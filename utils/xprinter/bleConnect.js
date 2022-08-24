var app = getApp();
let list = [];
let services = [];
let serviceId = 0;
let writeCharacter = false;
let readCharacter = false;
let notifyCharacter = false;
let isScanning = false;
let intervalId = null;

///监听蓝牙连接状态
const onBLEConnectionStateChange = function() {
	uni.onBLEConnectionStateChange(res => {
		console.log(`设备状态 ${res.deviceId},connected: ${res.connected}`);
		if (res.connected == false) {
			closeBluetoothAdapter();
			closeBLEConnection(res.deviceId, 0);
			app.globalData.YN_PRINT_CON = "N";
			//选择适合需求的定时器
			intervalId = setInterval(() => {
				console.log("intervalId" + new Date());
				try {
					if (app.globalData.BLEInformation.deviceId != "" && app.globalData
						.BLEInformation.deviceName != "") {
						startSearch();
					}
				} catch (e) {
					clearIntervalFun();
				}
				console.log("YN_PRINT_CON", app.globalData.YN_PRINT_CON);
			}, 5000);
		} else {
			app.globalData.YN_PRINT_CON = "Y";
		}
		console.log(`连接状态 ${res.deviceId},connected: ${app.globalData.YN_PRINT_CON}`);
	})
}

//停止定时器
const clearIntervalFun = function(){
	clearInterval(intervalId); //清除计时器
	intervalId = null; //设置为null
}

const startSearch = function() {
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
							getBluetoothDevices();
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
}

const checkPemission = function() {
	//android 6.0以上需授权地理位置权限
	var platform = app.globalData.BLEInformation.platform;

	if (platform == "ios") {
		app.globalData.platform = "ios";
		getBluetoothDevices();
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
								getBluetoothDevices();
							}
						});
					} else {
						getBluetoothDevices();
					}
				}
			});
		}
	}
}

//获取蓝牙设备信息
const getBluetoothDevices = function() {
	console.log("start search");
	isScanning = true;
	uni.startBluetoothDevicesDiscovery({
		success: function(res) {
			console.log(res);
			setTimeout(function() {
				uni.getBluetoothDevices({
					success: function(res) {
						var devices = [];
						var num = 0;
						for (var i = 0; i < res.devices.length; ++i) {
							if (res.devices[i].name != "未知设备" && res
								.devices[i].name != "") {
								devices[num] = res.devices[i];
								num++;
								console.log("蓝牙设备Name", res.devices[i].name)
								if (res.devices[i].name == app.globalData
									.BLEInformation.deviceName && app
									.globalData.BLEInformation
									.deviceName != "") {
									console.log("蓝牙打印设备", res.devices[i]
										.name)
									app.globalData.BLEInformation
										.deviceId = res.devices[i]
										.deviceId;
									bindAutoTap(res.devices[i]
										.deviceId, res.devices[i].name);
								}
							}
						}

						list = devices,
							isScanning = false
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
}

//
const bindAutoTap = function(deviceId, deviceName) {
	console.log("当前连接蓝牙", deviceId + "||" + deviceName);
	uni.stopBluetoothDevicesDiscovery({
		success: function(res) {
			console.log(res);
		}
	});

	serviceId = 0,
		writeCharacter = false,
		readCharacter = false,
		notifyCharacter = false

	uni.showLoading({
		title: "正在连接"
	});
	uni.createBLEConnection({
		deviceId: deviceId,
		success: function(res) {
			console.log("Connection success:", res);
			app.globalData.BLEInformation.deviceId = deviceId;
			getSeviceId(deviceId, deviceName);
		},
		fail: function(e) {
			console.log("Connection fail:", e);
			uni.hideLoading();
		},
		complete: function(e) {
			console.log("Connection complete:", e);
		}
	});
}

const getSeviceId = function(deviceId, deviceName) {
	var platform = app.globalData.BLEInformation.platform;
	uni.getBLEDeviceServices({
		deviceId: app.globalData.BLEInformation.deviceId,
		success: function(res) {
			console.log(res);
			services = res.services
			getCharacteristics(deviceId, deviceName);
		},
		fail: function(e) {
			console.log(e);
		},
		complete: function(e) {
			console.log(e);
		}
	});
}

const getCharacteristics = function(deviceId, deviceName) {
	var list = services;
	var num = serviceId;
	var write = writeCharacter;
	var read = readCharacter;
	var notify = notifyCharacter;
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

				writeCharacter = write,
					readCharacter = read,
					notifyCharacter = notify,
					serviceId = num

				if (num == list.length) {
					uni.showModal({
						title: "提示",
						content: "找不到该读写的特征值",
						showCancel: false
					});
				} else {
					getCharacteristics(deviceId, deviceName);
				}
			} else {
				uni.showToast({
					title: "连接成功"
				});
				//停止定时器
				clearIntervalFun();
				app.globalData.BLEInformation.deviceId = deviceId;
				app.globalData.BLEInformation.deviceName = deviceName;
				app.globalData.YN_PRINT_CON = "Y";
				console.log("连接成功 deviceName", app.globalData.BLEInformation.deviceName +
					"||" + app.globalData.YN_PRINT_CON)
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
}

const closeBluetoothAdapter = function() {
	plus.bluetooth.closeBluetoothAdapter({
		success: function(e) {
			app.globalData.YN_PRINT_CON = "N";
			console.log('close success: ' + JSON.stringify(e));
		},
		fail: function(e) {
			console.log('close failed: ' + JSON.stringify(e));
		}
	});
}

const closeBLEConnection = function(deviceId, index) {
	plus.bluetooth.closeBLEConnection({
		deviceId: deviceId,
		success: res => {
			console.log('断开蓝牙连接')
			app.globalData.YN_PRINT_CON = "N";
			isLink.splice(index, 1, 4)
		}
	})
}

module.exports = {
	onBLEConnectionStateChange: onBLEConnectionStateChange,
	startSearch: startSearch,
	checkPemission: checkPemission,
	getBluetoothDevices: getBluetoothDevices,
	bindAutoTap: bindAutoTap,
	getSeviceId: getSeviceId,
	getCharacteristics: getCharacteristics,
	closeBluetoothAdapter: closeBluetoothAdapter,
	closeBLEConnection: closeBLEConnection,
	clearIntervalFun: clearIntervalFun
};
