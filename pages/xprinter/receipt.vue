<template>
	<view class="body">
		<button class="button" hover-class="hover" @tap="receiptPrinter" :loading="isReceiptSend"
			:disabled="isReceiptSend">
			打印小票
		</button>
		<button class="button" hover-class="hover" @tap="queryStatus" :loading="isQuery" :disabled="isQuery">
			查询状态
		</button>
		<button class="button" hover-class="hover" @tap="printPhoto">打印二维码</button>
		<canvas canvas-id="couponQrcode" class="canvas"
			:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>

		<button class="button" hover-class="hover" @tap="printJPGPhoto">打印logo</button>
		<canvas canvas-id="canvasJPG" class="canvas"
			:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
		<picker style="margin:20px" mode="selector" :range="buffSize" :value="buffIndex" @change="buffBindChange">
			当前每次发送字节数为(点击可更换)：{{ buffSize[buffIndex] }}
		</picker>

		<picker style="margin:20px" mode="selector" :range="printNum" :value="printNumIndex"
			@change="printNumBindChange">
			当前打印份数(点击可更换)：{{ printNum[printNumIndex] }}
		</picker>
		<button class="button" hover-class="hover" @tap="againPrinter">重打</button>
	</view>
</template>

<script>
	var app = getApp();
	import esc from '@/utils/xprinter/esc.js';
	import util from '@/utils/xprinter/util.js';
	import qrCode from '@/utils/xprinter/weapp-qrcode.js';
	import vm from '@/utils/xprinter/MiddleUtil.js';	
    import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	
	import excPostUtil from '@/components/gprint/EscPosUtil.js';
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	
	export default {
		data() {
			return {
				looptime: 0,
				currentTime: 1,
				lastData: 0,
				oneTimeData: 0,
				buffSize: [],
				buffIndex: 0,
				//发送字节数下标
				printNum: [],
				printNumIndex: 0,
				printerNum: 1,
				currentPrint: 1,
				isReceiptSend: false,
				isQuery: false,
				imageSrc: "/static/xprinter/logo.jpg",
				jpgSrc: "/static/xprinter/logo.jpg",
				canvasWidth: 200,
				canvasHeight: 200,
				jpgWidth: 340,
				jpgHeight: 113,
				qrCodeWidth: 200,//二维码宽
				qrCodeHeight: 200,// 二维码高
				qrCodeContent: "https://www.jufanba.com/pinpai/88783/", //二维码地址
				
				isSearch: false,
				bluetooth: [],
				isLink: [],
				// 调试数据
				serverList: [],
				characteristics: [],
				serviceId: '',
				characteristicId: '',
				macBlueName: 'Printer001', //对应的蓝牙名称
				macBlueDeviceId: "",
				macBlueIndex: 0,
				isSearchShow: false,
				isGetShow: true,
				connected: 0,
				oneTimeData: 20,
			};
		},

		components: {
			...mapState(['blueName'])},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			// this.canvas();
			setTimeout(() => {
				this.couponQrCode()
			}, 50)
			console.log('onLoad start');

			//蓝牙是否在扫描设备
			uni.onBluetoothAdapterStateChange((res) => {
				console.log("蓝牙" + (res.discovering ? "开启" : "关闭") + "搜索")
				this.discovering = res.discovering;
			})
			//监听扫描到的蓝牙设备
			uni.onBluetoothDeviceFound(resd => {
				//在这里识别你要用到的设备；
				const devices = resd.devices;
			})
			//监听蓝牙连接状态
			// uni.onBLEConnectionStateChange(res => {
			// 	console.log(`设备 ${res.deviceId},connected: ${res.connected}`)
			// 	this.Connecting = res.connected;
			// 	if (res.connected == false) {
			// 		this.closeBluetoothAdapter();
			// 		this.closeBLEConnection(res.deviceId, 0);
			// 		this.connected = 1;
			// 		if (this.connected == 1) {
			// 			//选择适合需求的定时器
			// 			this.timer = setTimeout(() => {
			// 				this.getBlueInfo()
			// 			}, 1000)
			// 		}
			// 	} else {
			// 		this.connected = 0;
			// 	}
			// 	this.deviceId = res.deviceId;
			// })
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			var list = [];
			var numList = [];
			var j = 0;

			for (var i = 20; i < 200; i += 10) {
				list[j] = i;
				j++;
			}

			for (var i = 1; i < 10; i++) {
				numList[i - 1] = i;
			}

			this.setData({
				buffSize: list,
				oneTimeData: list[0],
				printNum: numList,
				printerNum: numList[0]
			});
			this.initPhoto();
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			console.log('ENTER TO')
			//this.getBlueInfo()
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {

		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		mounted(){
		    var that = this;
		    vm.$on('receiptPrinter', function (sale1_obj,sale2_arr,sale3_arr) {
		        console.log("调用打印方法成功");
				that.receiptPrinter(sale1_obj,sale2_arr,sale3_arr);
		    })
		},
		methods: {
			// 监听蓝牙设备连接状态
			listenerConnection() {
				console.log('监听蓝牙设备连接状态')
				let _this = this;
				plus.bluetooth.onBLEConnectionStateChange(function(e) {
					console.log('connection state changed: ' + JSON.stringify(e));
					_this.deviceId = e.deviceId;
					_this.createBLEConnection(_this.deviceId)
				});
			},
			// 蓝牙手机初始化
			getBlueInfo() {
				console.log('getBlueInfo')
				const _this = this
				plus.bluetooth.openBluetoothAdapter({
					success(res) {
						console.log(JSON.stringify(res))
						_this.startBluetoothDevicesDiscovery()
					},
					fail(err) {
						console.log('fail', err)
						uni.showToast({
							title: '未检测到蓝牙',
							icon: 'none'
						})
					}
				});
			},
			// 搜索周围蓝牙设备
			startBluetoothDevicesDiscovery() {
				console.log('开始搜索蓝牙设备')
				const _this = this
				console.log(_this.bluetooth)
				this.isSearch = true
				this.bluetooth = []
				this.searchNoNameBluetooths = []
				plus.bluetooth.startBluetoothDevicesDiscovery({
					// services:['FE7D','FFF0'],//可选 要获取设备的uuid列表
					success(res) {
						console.log(JSON.stringify(res))
						plus.bluetooth.onBluetoothDeviceFound(res => {
							console.log('蓝牙名称', res.devices[0].deviceId)
							if (res.devices[0].name == _this.macBlueName) {
								console.log(JSON.stringify(res))
								uni.setStorageSync(res.devices[0].name, res);
							}
							_this.getBluetoothDevices();
						})
					},
					fail(err) {
						console.log('错误信息', JSON.stringify(err))
						uni.showToast({
							title: '蓝牙未初始化',
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			// 停止搜索
			stopBluetoothDevicesDiscovery() {
				plus.bluetooth.stopBluetoothDevicesDiscovery({
					success: e => {
						console.log('停止搜索蓝牙设备:' + e.errMsg);
					},
					fail: e => {
						console.log('停止搜索蓝牙设备失败，错误码：' + e.errCode);
					}
				});
			},
			// 获取已发现的蓝牙设备
			getBluetoothDevices() {
				console.log('获取已发现的蓝牙设备')
				const _this = this
				plus.bluetooth.getBluetoothDevices({
					success(res) {
						var isAuto = false;
						var _macBlueDeviceId = "";
						var _macBlueIndex = 0;
						console.log(' 已发现的蓝牙设备', res)
						// _this.stopBluetoothDevicesDiscovery()
						if (this.macBlueName != null && this.macBlueName != '') {
							console.log("蓝牙缓存", key)
							let key = uni.getStorageSync(this.macBlueName);
						}
						_this.bluetooth = res.devices.filter(item => {
							//console.log('获取已发现的蓝牙设备-名称', item.name)
							if (item.name == _this.macBlueName) {
								console.log('获取已发现的蓝牙设备-deviceId', item.deviceId)
								_macBlueDeviceId = item.deviceId
								isAuto = true;
							}
							return item.name
						})

						_this.isLink = []
						var i = 0;
						_this.bluetooth.forEach(e => {
							_this.isLink.push(0)
							if (e.name == _this.macBlueName) {
								_macBlueIndex = i;
							}
							i++;
						})
						//console.log('获取已发现的蓝牙设备-_macBlueDeviceId', _macBlueIndex)
						if (isAuto) {
							//连接蓝牙
							_this.createBLEConnection(_macBlueDeviceId, _macBlueIndex)
						}
					}
				})
			},
			// 获取蓝牙适配器状态
			getBluetoothAdapterState() {
				plus.bluetooth.getBluetoothAdapterState({
					success(res) {
						console.log('获取蓝牙适配器状态', res)
					}
				})
			},
			// 连接蓝牙
			createBLEConnection(deviceId, index) {
				console.log('连接蓝牙', deviceId, index)
				const _this = this
				this.deviceId = deviceId;
				if (this.isLink[index] == 2) {
					return;
				}
				this.isLink.splice(index, 1, 1)
				plus.bluetooth.createBLEConnection({
					deviceId: _this.deviceId,
					success: res => {
						console.log(res)
						_this.isLink.splice(index, 1, 2)
						_this.stopBluetoothDevicesDiscovery();
						_this.getBLEDeviceServices(_this.deviceId);
						uni.showLoading({
							title: '连接中...',
							mask: true
						});
						//自动读取称重
					},
					fail: res => {
						if (res.message == 'already connect') {
							_this.isLink[index] = 2;
							_this.stopBluetoothDevicesDiscovery();
							_this.getBLEDeviceServices(_this.deviceId);
						} else {
							_this.isLink.splice(index, 1, 3)
						}
						console.log(JSON.stringify(res))
					}
				})
			},
			//获取蓝牙设备所有服务(service)。
			getBLEDeviceServices(deviceId) {
				const _this = this
				console.log(deviceId)
				setTimeout(() => {
					plus.bluetooth.getBLEDeviceServices({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: deviceId,
						success: (res) => {
							console.log('获取蓝牙设备所有服务:', JSON.stringify(res.services))
							_this.serverList = res.services
							var findItem = res.services.find(item => {
								//FE7D FFF0
								if (item.uuid != '00001800-0000-1000-8000-00805F9B34FB' && item
									.uuid != '00001801-0000-1000-8000-00805F9B34FB' &&
									item.uuid != '0000180A-0000-1000-8000-00805F9B34FB') {
									return item;
								}
							})
							console.log(JSON.stringify(findItem))
							_this.serviceId = findItem.uuid;
							_this.getBLEDeviceCharacteristics(_this.deviceId)
						},

						fail: res => {
							console.log(res)
						}
					})
				}, 4000)
			},
			// 获取蓝牙特征值
			getBLEDeviceCharacteristics(deviceId) {
				console.log("进入特征");
				const _this = this
				setTimeout(() => {
					plus.bluetooth.getBLEDeviceCharacteristics({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: deviceId,
						// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
						serviceId: this.serviceId,
						success: (res) => {
							_this.characteristics = res.characteristics
							console.log('characteristics', JSON.stringify(_this.characteristics))

							let findItem = res.characteristics.find(item => {
								let uuid = item.uuid
								console.log("配置信息", item)
								return item.properties.write
							})
							console.log("characteristicId", findItem)
							_this.characteristicId = findItem.uuid;
							console.log('当前使用的特征characteristicId:', _this.characteristicId)
							_this.notifyBLECharacteristicValueChange(_this.deviceId)
							let bluetoothData = {
								deviceId: _this.deviceId,
								serviceId: _this.serviceId,
								characteristicId: _this.characteristicId
							}
							uni.setStorageSync('bluetoothData', bluetoothData)
							uni.hideLoading();

						},
						fail: (res) => {
							uni.hideLoading();
							console.log(res)
						}
					})
				}, 4000)
			},
			// 启用 notify 功能
			notifyBLECharacteristicValueChange(deviceId) {
				const _this = this;
				console.log('deviceId' + deviceId)
				console.log('serviceId' + _this.serviceId)
				console.log('characteristicId' + _this.characteristicId)
				plus.bluetooth.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: _this.serviceId,
					// 这里的 uuid 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: _this.characteristicId,
					success: (res) => {
						console.log('notifyBLECharacteristicValueChange success', res)
						_this.$api.msg('连接成功', 'success')
					},
					fail: (res) => {
						console.log('notifyBLECharacteristicValueChange fail', res)
						console.log(JSON.stringify(res))
						_this.$api.msg('连接失败')
					}
				})
			},
			//打印的数据
			senBlData(deviceId, serviceId, characteristicId, uint8Array) {
				console.log('************deviceId = [' + deviceId + ']  serviceId = [' + serviceId +
					'] characteristics=[' + characteristicId + "]")
				var uint8Buf = Array.from(uint8Array);
				console.log("这个是什么。。。。。", uint8Buf)
			
				function split_array(datas, size) {
					console.log("data是什么：", datas)
					var result = {};
					var j = 0
					for (var i = 0; i < datas.length; i += size) {
						result[j] = datas.slice(i, i + size)
						j++
					}
					console.log(result)
					return result
				}
				var sendloop = split_array(uint8Buf, 20);
				// console.log(sendloop.length)
				function realWriteData(sendloop, i) {
					var data = sendloop[i]
					if (typeof(data) == "undefined") {
						return
					}
					console.log("第【" + i + "】次写数据" + data)
					var buffer = new ArrayBuffer(data.length)
					var dataView = new DataView(buffer)
					for (var j = 0; j < data.length; j++) {
						dataView.setUint8(j, data[j]);
					}
					uni.writeBLECharacteristicValue({
						deviceId,
						serviceId,
						characteristicId,
						value: buffer,
						success(res) {
							setTimeout(() => {
								realWriteData(sendloop, i + 1);
							}, 10); //就是这里需要加延时，具体原因不清楚，等大神解释吧  
						},
						fail(res) {
							console.log(res)
						},
					})
				}
				var i = 0;
				realWriteData(sendloop, i);
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
			//重启app
			restart() {
				plus.runtime.restart();
			},
			fileReader: function() {
				const self = this;
				// 请求本地系统文件对象 plus.io.PRIVATE_WWW：应用运行资源目录常量
				plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fobject) {
					// fs.root是根目录操作对象DirectoryEntry
					fobject.root.getFile('poem.txt', {
						create: true
					}, function(fileEntry) {
						fileEntry.file(function(file) {
							var fileReader = new plus.io.FileReader();
							self.resInfo = JSON.stringify(file);
							console.log("getFile:", JSON.stringify(file));
							fileReader.onloadend = function(evt) {
								console.log("Read success");
								self.resInfo = self.resInfo + '--' + JSON.stringify(evt);
								console.log('result', JSON.stringify(evt));
							}
							fileReader.readAsText(file, 'utf-8');
							self.resInfo = self.resInfo + '-- ' + file.size + '--' + file.name;
							console.log('file文件', self.resInfo);
						});
					});
				});
			},
			// 二维码生成工具
			couponQrCode() {
				new qrCode('couponQrcode', {
					text: this.qrCodeContent,
					width: this.qrCodeWidth,
					height: this.qrCodeHeight,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.H
				})
			},
			initPhoto: function() {},
			//打印小票
			receiptPrinter: function(sale1_obj,sale2_arr,sale3_arr) {
				//输出日志
				console.log("打印接收数据 sale1_obj", sale1_obj);
				console.log("打印接收数据 sale2_arr", sale2_arr);
				console.log("打印接收数据 sale3_arr", sale3_arr);
				
				//票据
				var that = this;
				//打印数据转换
				var printerInfo = xprinter_util.printerData(sale1_obj, sale2_arr, sale3_arr);
				
				//初始化打印机
				var strCenter = excPostUtil.Center();
				var strLeft = excPostUtil.Left();
				var strSize1 = excPostUtil.Size1();
				var strSize2 = excPostUtil.Size2(16);
				var strSetPrint = excPostUtil.strSetPrint();
				
				var command = esc.jpPrinter.createNew();
				command.init();
				
				//打印格式
				command.formatString(printerInfo);
				console.log("打印格式记录", command.getData());
				// 打印二维码
				uni.canvasGetImageData({
					canvasId: "couponQrcode",
					x: 0,
					y: 0,
					width: that.qrCodeWidth,
					height: that.qrCodeHeight,
					success: function(res) {
						console.log("获取画布数据成功");
						command.setSelectJustification(1); //居中
						command.setBitmap(res);
						command.setPrint();
				
						//that.addData(bill,xsDate,command.getData());
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						uni.showToast({
							title: "获取画布数据失败",
							icon: "none"
						});
						//that.addData(bill,xsDate,command.getData());
					    that.prepareSend(command.getData()); //发送数据
					}
				});		
				//that.prepareSend(command.getData()); //发送数据
			},
			//重新打印
			againPrinter:function(xsBill){
				console.log("进入到打印了",xsBill)
				var that = this;
				xsBill = "K0101QT212271113832795";
				let sql = "select * from POS_XSBILLPRINT where XSBILL = '" + xsBill +"' order by XSDATE desc";
					
				db.get().executeQry(sql, "数据查询中", function(res) {
					let billStr = res.msg[0].BILLSTR;
					console.log("重打数据:",res.msg[0].BILLSTR);
					//初始化打印机
					var command = esc.jpPrinter.createNew();
					command.addCotent(billStr);
					console.log("打印格式记录", command.getData());
					that.prepareSend(command.getData()); //准备发送数据
				}, function(err) {
					console.log("获取打印数据出错:", err);
					uni.showToast({
						icon: 'error',
						title: "获取打印数据出错"
					})
				});
			},
			//打印二维码事件
			printPhoto: function() {
				//打印bitmap，图片内容不建议太大，小程序限制传输的字节数为20byte
				var that = this;
				var canvasWidth = that.qrCodeWidth;
				var canvasHeight = that.qrCodeHeight;
				var command = esc.jpPrinter.createNew();
				command.init(); //初始化打印机

				uni.canvasGetImageData({
					canvasId: "couponQrcode",
					x: 0,
					y: 0,
					width: canvasWidth,
					height: canvasHeight,
					success: function(res) {
						console.log("获取画布数据成功");
						command.setSelectJustification(1); //居中
						command.setBitmap(res);
						command.setPrint();
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						uni.showToast({
							title: "获取画布数据失败",
							icon: "none"
						});
					}
				});
			},
			//打印彩图事件
			printJPGPhoto: function() {
				var that = this;
				var canvasWidth = that.jpgWidth;
				var canvasHeight = that.jpgHeight; //抖动处理JPG图片

				const cfg = {
					x: 0,
					y: 0,
					width: canvasWidth,
					height: canvasHeight
				};
				uni.canvasGetImageData({
					canvasId: "canvasJPG",
					...cfg,
					success: res => {
						//const data = util.convertToGrayscale(res.data)
						const data = util.convertToMonoImage(res.width, res.height, res.data, true);
						uni.canvasPutImageData({
							canvasId: "canvasJPG",
							data,
							...cfg,
							success: res => {
								console.log(res);
								console.log("deal graphic width: " + cfg.width);
								console.log("deal graphic width: " + cfg.height);
								that.printerJPG();
							},
							fail: err => {
								console.error(err);
							}
						});
					},
					fail: err => {
						console.error(err);
					}
				});
			},
			printerJPG: function() {
				var that = this;
				var canvasWidth = that.jpgWidth;
				var canvasHeight = that.jpgHeight;
				var command = esc.jpPrinter.createNew();
				command.init(); //初始化打印机

				uni.canvasGetImageData({
					canvasId: "canvasJPG",
					x: 0,
					y: 0,
					width: canvasWidth,
					height: canvasHeight,
					success: function(res) {
						console.log("获取画布数据成功");
						command.setSelectJustification(1); //居中
						command.setBitmap(res);
						command.setPrint();
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						uni.showToast({
							title: "获取画布数据失败",
							icon: "none"
						});
					}
				});
			},
			//准备发送，根据每次发送字节数来处理分包数量
			prepareSend: function(buff) {
				console.log("receipt prepareSend 开始")
				var that = this;
				// var time = that.oneTimeData;
				var time = 20;
				var looptime = parseInt(buff.length / time);
				var lastData = parseInt(buff.length % time); 

				that.setData({
					looptime: looptime + 1,
					lastData: lastData,
					currentTime: 1
				});
				that.Send(buff);
			},
			// 添加数据
			addData(xsBill,xsDate,billStr) {
				let addSql = 'insert into POS_XSBILLPRINT (XSBILL,XSDATE,BILLSTR) values ("' + xsBill + '","' + xsDate + '",' + billStr + ')';
				db.get().executeDml(addSql, "执行中", (res) => {
					console.log("sql 执行结果：", res);
				});	
			},
			queryStatus: function() {
				//查询打印机状态
				var that = this;
				var buf;
				var dateView;
				/*
				  n = 1：传送打印机状态
				  n = 2：传送脱机状态
				  n = 3：传送错误状态
				  n = 4：传送纸传感器状态
				*/
				buf = new ArrayBuffer(3);
				dateView = new DataView(buf);
				dateView.setUint8(0, 16);
				dateView.setUint8(1, 4);
				dateView.setUint8(2, 2);
				uni.writeBLECharacteristicValue({
					deviceId: app.globalData.BLEInformation.deviceId,
					serviceId: app.globalData.BLEInformation.writeServiceId,
					characteristicId: app.globalData.BLEInformation.writeCharaterId,
					value: buf,
					success: function(res) {
						console.log("发送成功");
						that.setData({
							isQuery: true
						});
					},
					fail: function(e) {
						uni.showToast({
							title: "发送失败",
							icon: "none"
						}); //console.log(e)

						return;
					},
					complete: function() {}
				});
				uni.notifyBLECharacteristicValueChange({
					deviceId: app.globalData.BLEInformation.deviceId,
					serviceId: app.globalData.BLEInformation.notifyServiceId,
					characteristicId: app.globalData.BLEInformation.notifyCharaterId,
					state: true,
					success: function(res) {
						uni.onBLECharacteristicValueChange(function(r) {
							console.log(
								`characteristic ${r.characteristicId} has changed, now is ${r}`
								);
							var result = util.ab2hex(r.value);
							console.log("返回" + result);
							var tip = "";

							if (result == 12) {
								//正常
								tip = "正常";
							} else if (result == 32) {
								//缺纸
								tip = "缺纸";
							} else if (result == 36) {
								//开盖、缺纸
								tip = "开盖、缺纸";
							} else if (result == 16) {
								tip = "开盖";
							} else if (result == 40) {
								//其他错误
								tip = "其他错误";
							} else {
								//未处理错误
								tip = "未知错误";
							}

							uni.showModal({
								title: "打印机状态",
								content: tip,
								showCancel: false
							});
						});
					},
					fail: function(e) {
						uni.showModal({
							title: "打印机状态",
							content: "获取失败",
							showCancel: false
						});
						console.log(e);
					},
					complete: function(e) {
						that.setData({
							isQuery: false
						});
						console.log("执行完成");
					}
				});
			},
			Send: function(buff) {
				//分包发送
				var that = this;
				var currentTime = that.currentTime;
				var loopTime = that.looptime;
				var lastData = that.lastData;
				var onTimeData = that.oneTimeData;
				var printNum = that.printerNum;
				var currentPrint = that.currentPrint;
				var buf;
				var dataView;

				if (currentTime < loopTime) {
					buf = new ArrayBuffer(onTimeData);
					dataView = new DataView(buf);

					for (var i = 0; i < onTimeData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
					}
				} else {
					buf = new ArrayBuffer(lastData);
					dataView = new DataView(buf);

					for (var i = 0; i < lastData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
					}
				}
				 console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)

				uni.writeBLECharacteristicValue({
					deviceId: app.globalData.BLEInformation.deviceId,
					serviceId: app.globalData.BLEInformation.writeServiceId,
					characteristicId: app.globalData.BLEInformation.writeCharaterId,
					value: buf,
					success: function(res) {
						if (currentTime <= loopTime) {

						} else {
							uni.showToast({
								title: "已打印第" + currentPrint + "张成功"
							});
						} //console.log(res)
					},
					fail: function(e) {
						uni.showToast({
							title: "打印第" + currentPrint + "张失败",
							icon: "none"
						}); //console.log(e)
					},
					complete: function() {
						currentTime++;

						if (currentTime <= loopTime) {
							that.setData({
								currentTime: currentTime
							});
							that.Send(buff);
						} else {
							if (currentPrint == printNum) {
								that.setData({
									looptime: 0,
									lastData: 0,
									currentTime: 1,
									isReceiptSend: false,
									currentPrint: 1
								});
							} else {
								currentPrint++;
								that.setData({
									currentPrint: currentPrint,
									currentTime: 1
								});
								that.Send(buff);
							}
						}
					}
				});
			},
			buffBindChange: function(res) {
				//更改打印字节数
				var index = res.detail.value;
				var time = this.buffSize[index];
				this.setData({
					buffIndex: index,
					oneTimeData: time
				});
			},
			printNumBindChange: function(res) {
				//更改打印份数
				var index = res.detail.value;
				var num = this.printNum[index];
				this.setData({
					printNumIndex: index,
					printerNum: num
				});
			}
		}
	};
</script>
<style>
	/* pages/receipt/receipt.wxss */
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

	.canvas {
		display: flex;
		margin-top: 15px;
		height: 100%;
		justify-content: center;
		align-items: center;
	}

	.qrcode {
		padding: 50px 0 20px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		text-align: center;
	}
</style>
