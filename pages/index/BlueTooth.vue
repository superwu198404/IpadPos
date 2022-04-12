<template>
	<view>
		<view class="uni-list-cell uni-list-cell-pd auto-switch-cell">
			<view class="uni-list-cell-db" @click="switchBluetooth">蓝牙初始化</view>
		</view>
		<list class="bt-list" v-if="devData.length!=0">
			<view v-for="(item,index) in devData" :key="index" class="bt-item">
				<view class="singleLeft">
					<view class="dev-single-name">
						<view class="single">
							<view :class="{'cgreen': item.RSSI >= 1}" style=" height: 8rpx;"> </view>
							<view :class="{'cgreen': item.RSSI >= 2}" style=" height: 12rpx;"> </view>
							<view :class="{'cgreen': item.RSSI >= 3}" style=" height: 15rpx;"> </view>
							<view :class="{'cgreen': item.RSSI >= 4}" style=" height: 19rpx;"> </view>
							<view :class="{'cgreen': item.RSSI >= 5}" style=" height: 22rpx;"> </view>
						</view>
						<view class="dev-name">
							<view>{{item.name}}</view>
							<view>{{item.deviceId}}</view>
						</view>
						<view>1234</view>
					</view>
				</view>
				<!-- 	<view class="singleRight">
					<button plain type="primary" class="link-btn" @click="linkBLE(item,item.deviceId, item.name)"
						v-if="BTPrintStatus !== item.deviceId">选择</button>
					<button plain type="primary" class="link-btn activelink" @click="closeBLE(item.deviceId)"
						v-if="BTPrintStatus === item.deviceId">取消</button>
				</view> -->
			</view>
		</list>
	</view>
	<!-- 	<view style="width: 200rpx; background: #4EB331; color: white; border-radius: 8rpx;padding: 20rpx 0;text-align: center; margin: 10rpx auto; font-size: 26rpx;"
		v-show="deviceName" @click="testPrint">
		测试蓝牙打印
	</view> -->
</template>
<script>
	export default {
		data() {
			return {
				devData: []
			}
		},
		methods: {
			//打开蓝牙
			switchBluetooth: function(e) {
				console.info("初始化蓝牙");
				if (e.mp.detail) {
					console.info("初始化蓝牙", JSON.stringify(e.mp.detail));

					uni.openBluetoothAdapter({
						success: res => {
							console.info("初始化成功了");
							// 初始化完毕开始搜索 
							this.StartBluetoothDeviceDiscovery();
						},
						fial: err => {
							console.info("出错了");
							uni.showToast({
								icon: "none",
								title: "请打开蓝牙功能！",
								duration: 3000
							});
						}

					})
				} else {
					//断开蓝牙
					uni.closeBluetoothAdapter({
						success(res) {
							console.log(res);
						},
						fail: err => {
							console.log(res);
						}
					})
				}
			},

			//开始查找设备 
			StartBluetoothDeviceDiscovery: function() {
				let that = this;
				// 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。
				//传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
				uni.startBluetoothDevicesDiscovery({
					services: ['FEE7'],
					success: res => {
						console.log('第二步 开始搜寻附近的蓝牙外围设备：startBluetoothDevicesDiscovery success', res);
						that.onListenerBTDevFound();
					},
					fail: res => {
						uni.showToast({
							icon: "none",
							title: "查找设备失败！",
							duration: 3000
						});
					}
				})
			},
			//发现外围设备
			onListenerBTDevFound: function() {
		  
				uni.onBluetoothDeviceFound(res => {
					console.log("第三步 监听寻找到新设备的事件:", JSON.stringify(res));
					console.log("第100步 监听寻找到新设备的事件:", JSON.stringify(res.devices));
					let dev = res.devices[0];
					console.log("第四步 监听寻找到新设备:", JSON.stringify(dev));
					if (dev.name && dev.localName) {
						let arr = this.devData.filter(item => item.deviceId === dev.deviceId);
						console.log("第五步 打印监听过的设备:", JSON.stringify(arr));
						if (arr.length > 0) {
							// 说明存在相同设备，要进行RSSI更新
							let n = that.devData.indexOf(arr[0]);
							console.log("第五6.1步 监听寻找到新设备的事件:", JSON.stringify(n));
							// 转换信号
							let rssi = Math.floor(max(0, dev.RSSI + 100) / 10);
							console.log("第五6.2步 监听寻找到新设备的事件:", JSON.stringify(rssi));
							if (rssi <= 0) {
								console.log("第五6.3步 监听寻找到新设备的事件:", "rssi <= 0");
								// 无信号删除
								this.devData.splice(n, 1);
							} else {
								console.log("第五6.4步 监听寻找到新设备的事件:", "rssi > 0");
								this.devData[n].RSSI = rssi;
							}
						} else {
							this.devData.push(dev);
							console.log("第五6.5步 监听寻找到新设备的事件:", "this.devData.push(dev);");
						}
						this.devData.forEach((currentValue, index, ) => {
							that.devData[index].services = [];
						});
					}
					uni.setStorageSync("setAllBluthData", this.devData);
					console.log("第五8步 监听寻找到新设备的事件:", JSON.stringify(this.devData));
					res.devices.forEach(device => { //这一步就是去筛选找到的蓝牙中,有没有你匹配的名称  
						console.log("第9步 这一步就是去筛选找到的蓝牙中,有没有你匹配的名称:", JSON.stringify(device));
						if (device.name == '付豪的iphone xs max') { //匹配蓝牙名称
							console.log("第10步 ", device.name);
							uni.setStorageSync("DeviceID", device.deviceId); //把已经连接的蓝牙设备信息放入缓存
							this.DeviceID = device.deviceId;
							let DeviceID = device.deviceId; //这里是拿到的uuid 			
							this.StopBluetoothDevicesDiscovery(); //当找到匹配的蓝牙后就关掉蓝牙搜寻,因为蓝牙搜寻很耗性能             
							console.log("匹配到的蓝牙this.DeviceID：", this.DeviceID);
							this.CreateBLEConnection(DeviceID); //创建蓝牙连接,连接低功耗蓝牙设备  

						}else{
							console.log("没有找到指定的蓝牙设备");
						}
					});
				})

			},
			//停止搜索
			StopBluetoothDevicesDiscovery: function() {
				uni.stopBluetoothDevicesDiscovery({
					success: res => {
						console.log("第四步 找到匹配的蓝牙后就关掉蓝牙搜寻:", JSON.stringify(res))
					},
					fail: res => {
						console.log('第四步 停止搜索蓝牙设备失败，错误码：' + res.errCode);
					}
				});

			},
			//创建蓝牙链接
			CreateBLEConnection: function(DeviceID, index) {
				let doc = this
				uni.createBLEConnection({ //创建蓝牙连接,连接低功耗蓝牙设备  
					deviceId: DeviceID, //传入刚刚获取的uuid  
					success(res) {
						console.log("第五步 创建蓝牙连接成功:", JSON.stringify(res));
						doc.GetBLEDeviceServices(DeviceID); //获取蓝牙设备所有服务(service)。

					},
					fail(res) {
						console.log(res);
					}
				})

			},
			//获取蓝牙设备所有的服务
			GetBLEDeviceServices: function(DeviceID, index) {
				let doc = this;
				setTimeout(function() { //这里为什么要用setTimeout呢,等等下面会解释  
					uni.getBLEDeviceServices({ //获取蓝牙设备所有服务  
						deviceId: DeviceID,
						success(res) { //为什么要用延时,因为不用延时就拿不到所有的服务,在上一步,连接低功耗蓝牙  
							//设备的时候,需要一个600-1000毫秒的时间后,再去获取设备所有服务,不给延时就会一直返回错误码10004                               
							console.log("第六步 获取蓝牙设备所有服务:", JSON.stringify(res))
							uni.setStorageSync("ServiceUUID", res.services[2].uuid); //把已经连接的蓝牙设备信息放入缓存
							uni.setStorageSync("ServiceUUIDNew", res.services[2]
								.uuid); //把已经连接的蓝牙设备信息放入缓存
							let ServiceUUIDNew = res.services[2].uuid;
							this.ServiceUUID = res.services[2].uuid;

							console.log("this.ServiceUUID:", this.ServiceUUID);
							doc.GetBLEDeviceCharacteristics(
								DeviceID); //获取蓝牙设备某个服务中所有特征值 				             
						},
						fail(res) {
							console.log(JSON.stringify(res))
						}
					})
				}, 1000);
			},
			//获取蓝牙特征值
			GetBLEDeviceCharacteristics: function(DeviceID) {
				console.log("第七步 获取蓝牙特征值DeviceID:", DeviceID, "serviceId:", uni.getStorageSync('ServiceUUIDNew'));
				setTimeout(() => {
					uni.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值  
						deviceId: DeviceID,
						serviceId: uni.getStorageSync(
							'ServiceUUIDNew'), //这个serviceId可以在上一步获取中拿到,也可以在  
						//蓝牙文档中(硬件的蓝牙文档)拿到,我这里是通过文档直接赋值上去的,一般有两个,一个是收的uuid,一个是发的uuid,我们这边是发  
						success(res) {
							console.log("第七步 获取蓝牙设备某个服务中所有特征值成功:", JSON.stringify(res));
							uni.showToast({
								title: '开启蓝牙连接',
								duration: 2000
							});
							uni.setStorageSync("CharacteristicId", res.characteristics[1]
								.uuid); //把某个服务中所有特征值信息放入缓存
							this.characteristicId = res.characteristics[1].uuid;
						},
						fail(res) {
							console.log("获取蓝牙设备某个服务中所有特征值失败:", JSON.stringify(res));
						}
					})
				}, 2000);
			},
			// 第八步 发送二进制数据
			WriteBLECharacteristicValue: function() {
				let doc = this;
				for (let i = 0; i < doc.defaultVal.length; i++) {
					plus.bluetooth.writeBLECharacteristicValue({
						// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
						deviceId: uni.getStorageSync('DeviceID'),
						// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取  
						serviceId: uni.getStorageSync('ServiceUUIDNew'),
						// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取  
						characteristicId: uni.getStorageSync('CharacteristicId'),
						// 这里的value是ArrayBuffer类型  
						value: doc.defaultVal[i],

						success(res) {
							console.log('writeBLECharacteristicValue success', res);
							console.log("开始打印第" + (i + 1) + "张：", doc.defaultVal[i]);
							if (doc.defaultVal.length != 0) {
								uni.showToast({
									title: "正在打印第" + (i + 1) + "张",
									// duration: 2000  
									mask: true
								});

							} else {
								uni.hideLoading();
							}
						},
						fail(res) {
							console.log(JSON.stringify(res));
							doc.errorCodeTip(res.code);
							// console.log(JSON.stringify(buffer))
						}
					});
				}

			},
			errorCodeTip: function(code) {
				let doc = this;
				if (code == 0) {
					//正常
				} else if (code == 10000) {
					uni.showToast({
						title: '未初始化蓝牙适配器',
						icon: 'none'
					})
				} else if (code == 10001) {
					uni.showToast({
						title: '当前蓝牙适配器不可用',
						icon: 'none'
					})
				} else if (code == 10002) {
					uni.showToast({
						title: '没有找到指定设备',
						icon: 'none'
					})
				} else if (code == 10003) {
					uni.showToast({
						title: '连接失败',
						icon: 'none'
					})
				} else if (code == 10004) {
					uni.showToast({
						title: '没有找到指定服务',
						icon: 'none'
					})
				} else if (code == 10005) {
					uni.showToast({
						title: '没有找到指定特征值',
						icon: 'none'
					})
				} else if (code == 10006) {
					uni.showToast({
						title: '当前连接已断开',
						icon: 'none'
					})
				} else if (code == 10007) {
					uni.showToast({
						title: '当前特征值不支持此操作',
						icon: 'none'
					})
				} else if (code == 10008) {
					uni.showToast({
						title: '其余所有系统上报的异常',
						icon: 'none'
					})
				} else if (code == 10009) {
					uni.showToast({
						title: 'Android 系统特有，系统版本低于 4.3 不支持 BLE',
						icon: 'none'
					})
				}
				if (code != 0) {
					//正常
					//在页面加载时候初始化蓝牙适配器
					doc.OpenBluetoothAdapter();
				}
			},
			getBluetoothDevices: function() {
				console.log("获取蓝牙设备");
				uni.getBluetoothDevices({
					success: res => {
						console.log('获取蓝牙设备成功:' + res);
						this.bluetooth = res.devices;
						console.log('获取蓝牙设备成功this.bluetooth:' + this.bluetooth);
						this.bluetooth.forEach((item) => {
							this.isLink.push(0)
						});
					}
				});
			},
			//断开蓝牙连接
			closeBLEConnection: function(deviceId, index) {
				uni.closeBLEConnection({
					deviceId: deviceId,
					success: res => {
						this.isLink.splice(index, 1, 4)
						console.log(res)
					}
				});
			},
			notifyBLECharacteristicValueChange: function(deviceId) {
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: this.serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: this.characteristicId,
					success: (res) => {
						console.log('notifyBLECharacteristicValueChange success', res.errMsg);
						// this.onBLECharacteristicValueChange(this.deviceId);
					},
					fail: (res) => {
						console.log('notifyBLECharacteristicValueChange success', res.errMsg);
					}
				})
			},
			ab2hex: function(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			// 监听低功耗蓝牙设备的特征值变化
			onBLECharacteristicValueChange: function() {
				uni.onBLECharacteristicValueChange((res) => {
					console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
					console.log(this.ab2hex(res.value));
					this.macAddress = res.deviceId;
					this.macValue = this.ab2hex(res.value);
					// this.readBLECharacteristicValue(this.deviceId)
				});
			},
			// 读取设备二进制数据
			readBLECharacteristicValue: function() {
				// console.log('进入读取');
				// setTimeout(()=>{
				uni.readBLECharacteristicValue({
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: this.deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: this.serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: this.characteristicId,
					success: (res) => {
						console.log('readBLECharacteristicValue:', res)
						this.readCode = res.errCode;
						this.readCodeMsg = res.errMsg;
						this.onBLECharacteristicValueChange(this.deviceId);
					},
					fail: (res) => {
						console.log('readBLECharacteristicValue:', res)
						this.readCode = res.errCode;
						this.readCodeMsg = res.errMsg;
						this.onBLECharacteristicValueChange(this.deviceId);
					}
				})
				// },200)
			}
		}
	}
</script>
