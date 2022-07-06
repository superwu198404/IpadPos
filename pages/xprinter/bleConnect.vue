<template>
	<view>
		<button class="button" hover-class="hover" @tap="startSearch" :loading="isScanning">
			搜索蓝牙设备
		</button>
		<text class=".td" style="display: none;">（Android8.0+系统需开启定位）</text>
		<scroll-view class="device_list" scroll-y scroll-with-animation>
			<view
				v-for="(item, index) in list"
				:key="index"
				:title="item.name"
				:data-title="item.deviceId"
				:data-name="item.name"
				:data-advertisData="item.advertisServiceUUIDs"
				@tap="bindViewTap"
				class="item"
				hover-class="item_hover"
			>
				<view style="font-size: 16px; color: #333;">{{ item.name }}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
var app = getApp();

export default {
	data() {
		return {
			list: [],
			services: [],
			serviceId: 0,
			writeCharacter: false,
			readCharacter: false,
			notifyCharacter: false,
			isScanning: false,
		};
	},

	components: {},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		app.globalData.BLEInformation.platform = app.globalData.getPlatform();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		let that = this;
		//搜索蓝牙
		that.startSearch();
	},	
	methods: {
		//搜索设备
		startSearch: function() {
			var that = this;
			uni.openBluetoothAdapter({
				success: function(res) {
					uni.getBluetoothAdapterState({
						success: function(res) {
							console.log("openBluetoothAdapter success", res);

							if (res.available) {
								if (res.discovering) {
									uni.stopBluetoothDevicesDiscovery({
										success: function(res) {
											console.log(res);
										}
									});
								} else {
									that.getBluetoothDevices();
								} 
							} else {
								uni.showModal({
									title: "提示",
									content: "本机蓝牙不可用",
									showCancel: false
								});
							}
						}
					});
				},
				fail: function() {
					uni.showModal({
						title: "提示",
						content: "蓝牙初始化失败，请到设置打开蓝牙",
						showCancel: false
					});
				}
			});
		},
		checkPemission: function() {
			//android 6.0以上需授权地理位置权限
			var that = this;
			var platform = app.globalData.BLEInformation.platform;

			if (platform == "ios") {
				app.globalData.platform = "ios";
				that.getBluetoothDevices();
			} else if (platform == "android") {
				app.globalData.platform = "android";
				console.log(
					app.globalData
						.getSystem()
						.substring(
							app.globalData.getSystem().length - (app.globalData.getSystem().length - 8),
							app.globalData.getSystem().length - (app.globalData.getSystem().length - 8) + 1
						)
				);

				if (
					app.globalData
						.getSystem()
						.substring(
							app.globalData.getSystem().length - (app.globalData.getSystem().length - 8),
							app.globalData.getSystem().length - (app.globalData.getSystem().length - 8) + 1
						) > 5
				) {
					uni.getSetting({
						success: function(res) {
							console.log(res);

							if (!res.authSetting["scope.userLocation"]) {
								uni.authorize({
									scope: "scope.userLocation",
									complete: function(res) {
										that.getBluetoothDevices();
									}
								});
							} else {
								that.getBluetoothDevices();
							}
						}
					});
				}
			}
		},
		getBluetoothDevices: function() {
			//获取蓝牙设备信息
			var that = this;
			console.log("start search");
			uni.showLoading({
				title: "正在加载",
				icon: "loading"
			});
			that.setData({
				isScanning: true
			});
			uni.startBluetoothDevicesDiscovery({
				success: function(res) {
					console.log(res);
					setTimeout(function() {
						const _this = this
						uni.getBluetoothDevices({
							success: function(res) {
								var devices = [];
								var num = 0;
								for (var i = 0; i < res.devices.length; ++i) {
									if (res.devices[i].name != "未知设备" && res.devices[i].name != "") {
										devices[num] = res.devices[i];
										num++;
										//console.log("蓝牙设备",res.devices[i].name)
										if (res.devices[i].name == app.globalData.BLEInformation.deviceName) {
											console.log("蓝牙打印设备",res.devices[i].name)
											app.globalData.BLEInformation.deviceId = res.devices[i].deviceId;
											that.bindAutoTap(app.globalData.BLEInformation.deviceId);
										}
									}
								}
								
								that.setData({
									list: devices,
									isScanning: false
								});
								uni.hideLoading();
								uni.stopPullDownRefresh();
								uni.stopBluetoothDevicesDiscovery({
									success: function(res) {
										console.log("停止搜索蓝牙");
									}
								});
							}
						});
					}, 5000);
				}
			});
		},
		bindViewTap: function(e) {
			var that = this;
			uni.stopBluetoothDevicesDiscovery({
				success: function(res) {
					console.log(res);
				}
			});
			that.setData({
				serviceId: 0,
				writeCharacter: false,
				readCharacter: false,
				notifyCharacter: false
			});
			console.log("当前连接蓝牙:",e.currentTarget.dataset.title);
			uni.showLoading({
				title: "正在连接"
			});
			uni.createBLEConnection({
				deviceId: e.currentTarget.dataset.title,
				success: function(res) {
					console.log("Connection success:",res);
					app.globalData.BLEInformation.deviceId = e.currentTarget.dataset.title;
					that.getSeviceId();
				},
				fail: function(e) {
					uni.showModal({
						title: "提示",
						content: "连接失败",
						showCancel: false
					});
					console.log("Connection fail:",e);
					uni.hideLoading();
				},
				complete: function(e) {
					console.log("Connection complete:",e);
				}
			});
		},
		bindAutoTap: function(deviceId) {
			console.log("bindAutoTap",deviceId);
			var that = this;
			uni.stopBluetoothDevicesDiscovery({
				success: function(res) {
					console.log(res);
				}
			});
			that.setData({
				serviceId: 0,
				writeCharacter: false,
				readCharacter: false,
				notifyCharacter: false
			});
			console.log("当前连接蓝牙:",deviceId);
			uni.showLoading({
				title: "正在连接"
			});
			uni.createBLEConnection({
				deviceId: deviceId,
				success: function(res) {
					console.log("Connection success:",res);
					app.globalData.BLEInformation.deviceId = deviceId;
					that.getSeviceId();
				},
				fail: function(e) {
					uni.showModal({
						title: "提示",
						content: "连接失败",
						showCancel: false
					});
					console.log("Connection fail:",e);
					uni.hideLoading();
				},
				complete: function(e) {
					console.log("Connection complete:",e);
				}
			});
		},
		getSeviceId: function() {
			var that = this;
			var platform = app.globalData.BLEInformation.platform;
			console.log(app.globalData.BLEInformation.deviceId);
			uni.getBLEDeviceServices({
				deviceId: app.globalData.BLEInformation.deviceId,
				success: function(res) {
					console.log(res); // var realId = ''

					that.setData({
						services: res.services
					});
					that.getCharacteristics();
				},
				fail: function(e) {
					console.log(e);
				},
				complete: function(e) {
					console.log(e);
				}
			});
		},
		getCharacteristics: function() {
			var that = this;
			var list = that.services;
			var num = that.serviceId;
			var write = that.writeCharacter;
			var read = that.readCharacter;
			var notify = that.notifyCharacter;
			uni.getBLEDeviceCharacteristics({
				deviceId: app.globalData.BLEInformation.deviceId,
				serviceId: list[num].uuid,
				success: function(res) {
					console.log(res);

					for (var i = 0; i < res.characteristics.length; ++i) {
						var properties = res.characteristics[i].properties;
						var item = res.characteristics[i].uuid;

						if (!notify) {
							if (properties.notify) {
								app.globalData.BLEInformation.notifyCharaterId = item;
								app.globalData.BLEInformation.notifyServiceId = list[num].uuid;
								notify = true;
							}
						}

						if (!write) {
							if (properties.write) {
								app.globalData.BLEInformation.writeCharaterId = item;
								app.globalData.BLEInformation.writeServiceId = list[num].uuid;
								write = true;
							}
						}

						if (!read) {
							if (properties.read) {
								app.globalData.BLEInformation.readCharaterId = item;
								app.globalData.BLEInformation.readServiceId = list[num].uuid;
								read = true;
							}
						}
					}

					if (!write || !notify || !read) {
						num++;
						that.setData({
							writeCharacter: write,
							readCharacter: read,
							notifyCharacter: notify,
							serviceId: num
						});

						if (num == list.length) {
							uni.showModal({
								title: "提示",
								content: "找不到该读写的特征值",
								showCancel: false
							});
						} else {
							that.getCharacteristics();
						}
					} else {
						uni.showToast({
							title: "连接成功"
						});
						that.openControl();
					}
				},
				fail: function(e) {
					console.log(e);
				},
				complete: function(e) {
					console.log("write:" + app.globalData.BLEInformation.writeCharaterId);
					console.log("read:" + app.globalData.BLEInformation.readCharaterId);
					console.log("notify:" + app.globalData.BLEInformation.notifyCharaterId);
				}
			});
		},
		openControl: function() {
			//连接成功返回页
			uni.navigateTo({
				url: "../start/start"
			});
		},
		//断开所有已经建立的连接，释放系统资源，要求在蓝牙功能使用完成后调用
		closeBluetoothAdapter() {
			plus.bluetooth.closeBluetoothAdapter({
				success: function(e) {
					console.log('close success: ' + JSON.stringify(e));
				},
				fail: function(e) {
					console.log('close failed: ' + JSON.stringify(e));
				}
			});
		},
		//断开蓝牙连接
		closeBLEConnection(deviceId, index) {
			const _this = this
			plus.bluetooth.closeBLEConnection({
				deviceId: deviceId,
				success: res => {
					console.log('断开蓝牙连接')
					_this.isLink.splice(index, 1, 4)
				}
			})
		}
	}
};
</script>
<style>
.button {
	margin-top: 20px;
	width: 90%;
	background-color: #54bec2;
	color: white;
	border-radius: 98rpx;
	background: bg_red;
}

/* 按下变颜色 */
.hover {
	background: #dcdcdc;
}

.device_list {
	height: auto;
	margin-left: 20px;
	margin-right: 20px;
	margin-top: 10px;
	margin-bottom: 20px;
	border: 1px solid #eee;
	border-radius: 5px;
	width: auto;
}
.td {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
}

.item {
	display: block;

	border-bottom: 1px solid #eee;
	padding: 4px;
	color: #666;
}
.item_hover {
	background-color: rgba(0, 0, 0, 0.1);
}
.block {
	display: block;
	color: #ffffff;
	padding: 5px;
} 
</style>
