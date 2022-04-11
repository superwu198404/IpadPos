<template>
	<view class="content">
		<button type="default" @click="initBle">初始化蓝牙模块</button>
		<scroll-view scroll-y="true" show-scrollbar="true">
			<radio-group>
				<view v-for="(item, index) in bleDevs" :key="index" v-if="item.name.length > 0">
					<view style="font-size: 32rpx; color: #333;">
						<radio :value="item.deviceId" />
						{{ item.name }}
					</view>
					<view style="font-size: 20rpx">信号强度: {{ item.RSSI }}dBm ({{ Math.max(100 + item.RSSI, 0) }}%)</view>
					<view style="font-size: 20rpx">deviceId: {{ item.deviceId }} 设备名称: {{ item.name }}</view>

					<view @tap="createBLEConnection(item)" style="margin: 20rpx;background-color: #bfffb8;padding: 10rpx;">连接</view>
					<view @tap="close(item)" style="margin: 20rpx;background-color: #fff5cd;padding: 10rpx;">断开</view>
				</view>
			</radio-group>
		</scroll-view>
		<button type="default" @click="getBLEDeviceServices">获取服务</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				bleDevs: [],
				status: -2, //-2未连接  -1已连接  0连接成功
				deviceId: 'C8:9B:AD:8C:97:EC',
				serviceId: '',
				characteristicId: '',
			};
		},
		onLoad() {},
		mounted() {
			this.onBLEConnectionStateChange()
		},
		methods: {
			// ArrayBuffer转16进度字符串示例
			ab2hex:function(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('')
			},

			onBLEConnectionStateChange:function() {
				uni.onBLEConnectionStateChange(res => {
					// 该方法回调中可以用于处理连接意外断开等异常情况
					console.info(`device ${res.deviceId} state has changed, connected: ${res.connected} `)
					if (res.connected == false) {
						// this.dklj();                                                                                                            
						// this.createBLEConnection()
					}
				})
			},
			//初始化蓝牙
			initBle:function() {
				console.info('初始化蓝牙>>>');
				this.bleDevs = [];
				uni.openBluetoothAdapter({
					success: (res) => { //已打开
						uni.getBluetoothAdapterState({ //蓝牙的匹配状态
							success: (res1) => {
								console.info(res1, '“本机设备的蓝牙已打开”')
								// 开始搜索蓝牙设备
								this.startBluetoothDeviceDiscovery()
							},
							fail(error) {
								uni.showToast({
									icon: 'none',
									title: '查看手机蓝牙是否打开'
								});
							}
						});

					},
					fail: err => { //未打开 
						uni.showToast({
							icon: 'none',
							title: '查看手机蓝牙是否打开'
						});
					}
				})
			},
			// 开始搜索蓝牙设备
			startBluetoothDeviceDiscovery:function() {
				
	 
				uni.startBluetoothDevicesDiscovery({
					//allowDuplicatesKey:false;
					success: (res) => {
						console.info('启动成功', res)
						// 发现外围设备
						this.onBluetoothDeviceFound()
					},
					fail: err => {
						console.log(err, '错误信息')
					}
				})
			},
			// 发现外围设备
			onBluetoothDeviceFound:function() {
				
		 
				// console.log("执行到这--发现外围设备")
				uni.onBluetoothDeviceFound((res) => {
					// console.log(res)
					// ["name", "deviceId"]
					// 吧搜索到的设备存储起来，方便我们在页面上展示
					if (this.bleDevs.indexOf(res.devices[0].deviceId) == -1) {
						this.bleDevs.push(res.devices[0])
					}
					console.info("蓝牙列表",JSON.stringify(this.bleDevs));
				})
			},

			//选择设备连接吧deviceId传进来
			createBLEConnection:function(item) {
				console.info("item.deviceId", item.deviceId)
				let thit = this
				//data里面建立一个deviceId，存储起来
				this.deviceId = item.deviceId
				
				//连接蓝牙
				uni.createBLEConnection({
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: this.deviceId,
					success(res) {
						//防止在这里面取不到this，古在外面用thit存储了this
						thit.stopBluetoothDevicesDiscovery()

						console.info("蓝牙连接成功deviceId", res)

					},
					fail(res) {
						console.info("蓝牙连接失败", res)
					}
				})
			},
			// 停止搜寻蓝牙设备
			stopBluetoothDevicesDiscovery:function() {
				uni.stopBluetoothDevicesDiscovery({
					success: e => {
						this.loading = false
						console.info('停止搜索蓝牙设备:' + e.errMsg);
					},
					fail: e => {
						console.info('停止搜索蓝牙设备失败，错误码：' + e.errCode);
					}
				});
			},

			//获取蓝牙的所有服务
			getBLEDeviceServices:function() {
				setTimeout(() => {
					uni.getBLEDeviceServices({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: this.deviceId,
						success: (res) => {
							// console.log("成功",res)
							console.info('device services:', res)
							//这里会获取到好多个services  uuid  我们只存储我们需要用到的就行，这个uuid一般硬件厂家会给我们提供
							console.info("services", res.services)
							res.services.forEach((item) => {
                               console.info("services", JSON.stringify(item));
								if (item.uuid.indexOf("F393-E50E24DCCA9E") != -1) {
									this.serviceId = item.uuid;
									console.info("servicesId", item.uuid)

									// this.serviceId = item.uuid;
									//存储到状态
									this.$store.commit("upserviceId", item.uuid)
									console.info(this.serviceId)
									// 这里获取回调，读取成功就的值就会在这个地方接收到！！！
									uni.onBLECharacteristicValueChange((res) => {
											console.info("监听成功", res.value)
											ArrayBuffer
											//res.value是ArrayBuffer类型的，官方给了一个方法转16进制，我们再进行操作
											console.info(this.ab2hex(res.value))
										}),
										//进入特征
										this.getBLEDeviceCharacteristics()
								}else{
									
									console.info("没有搜索到指定的设备")
								}
							})
						}
					})
				}, 1000)
			},
			//获取蓝牙特征
			getBLEDeviceCharacteristics:function() {
				console.info("进入特征");
				setTimeout(() => {
					uni.getBLEDeviceCharacteristics({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: this.deviceId,
						// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
						serviceId: this.serviceId,
						success: (res) => {
							console.info("res.characteristics.", res.characteristics)
							res.characteristics.forEach((item) => {
								if (item.uuid.indexOf("E0A9-E50E24DCCA9E") != -1) {
									console.info('characteristicId :', item.uuid)
									this.characteristicId = item.uuid
									//利用传参的形势传给下面的notify，这里的uuid如果都需要用到，就不用做判断了，建议使用setTimeout进行间隔性的调用此方法
									this.notifyBLECharacteristicValueChange(item.uuid)
								}
							})

						},
						fail: (res) => {
							console.info(res)
						}
					})
				}, 1000)
			},
			// 启用 notify 功能
			notifyBLECharacteristicValueChange:function(characteristicId) {
				console.info('特征值', characteristicId)
				console.info(this.deviceId, 'this.deviceId')
				console.info(this.serviceId, 'this.serviceId')

				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: this.deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: this.serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: this.characteristicId,
					success: (res) => {

						console.info('启用 notify 功能 success', res.errMsg)
					},
					fail: (res) => {
						console.info('启用 notify 功能 success2', res.errMsg)
					}
				})

			},
			close:function(item) {
				uni.closeBLEConnection({
					deviceId: item.deviceId,
					success(res) {
						console.info("断开蓝牙成功", res)
					},
					fail(res) {
						console.info("断开蓝牙失败", res)
					}
				})
			}
			
		
		
		}


	};
</script>
