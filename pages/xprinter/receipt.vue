<template>
	<view class="body">
		<view>
			<view style="height: 50px;line-height: 50px;">请输入单号（用于测试重新打印）</view>
			<view>
				<input style="border:1px solid gray" type="text" v-model="bill_printer" />
			</view>
		</view>
		<button class="button" hover-class="hover" @tap="againPrinter">重打</button>
		<button class="button" hover-class="hover" @tap="bluePrinter" :loading="isReceiptSend"
			:disabled="isReceiptSend" v-show="false">
			打印小票-测试
		</button>
		<button class="button" hover-class="hover" @tap="queryStatus" :loading="isQuery" :disabled="isQuery">
			查询状态
		</button>
		<button class="button" hover-class="hover" @tap="printPhoto" v-show="false">打印二维码-测试</button>
		<canvas canvas-id="couponQrcode" class="canvas"
			:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;disabled:none;'"></canvas>

		<button class="button" hover-class="hover" @tap="printJPGPhoto" v-show="false">打印logo-测试</button>
		<canvas canvas-id="canvasJPG" class="canvas"
			:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;disabled:none;'"></canvas>
		
		<picker style="margin:20px;display: none;" mode="selector" :range="buffSize" :value="buffIndex" @change="buffBindChange">
			当前每次发送字节数为(点击可更换)：{{ buffSize[buffIndex] }}
		</picker>

		<picker style="margin:20px;display: none;" mode="selector" :range="printNum" :value="printNumIndex"
			@change="printNumBindChange">
			当前打印份数(点击可更换)：{{ printNum[printNumIndex] }}
		</picker>
	</view>
</template>

<script>
	var app = getApp();
	import esc from '@/utils/xprinter/esc.js';
	import xprinter_util from '@/utils/xprinter/util.js';
	import qrCode from '@/utils/xprinter/weapp-qrcode.js';
	import vm from '@/utils/xprinter/MiddleUtil.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import Req from '@/utils/request.js';
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
				oneTimeData: 20,
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
				qrCodeWidth: 200, //二维码宽
				qrCodeHeight: 200, // 二维码高
				qrCodeContent: "https://www.jufanba.com/pinpai/88783/", //二维码地址
				bill_printer: "",
				//蓝牙相关
			};
		},
		components: {},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			console.log("onLoad GO");
			let that = this;
			setTimeout(() => {
				xprinter_util.couponQrCode(that.bill_printer,that.qrCodeContent,that.qrCodeWidth,that.qrCodeHeight);
			}, 50)
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			console.log("onReady GO");
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
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			//console.log('onShow GO')
		},
		mounted() {
			var that = this;
			vm.$on('bluePrinter', function(sale1_obj, sale2_arr, sale3_arr) {
				that.bluePrinter(sale1_obj, sale2_arr, sale3_arr);
			})
		},
		methods: {	
			//打印小票
			bluePrinter: async function(sale1_obj, sale2_arr, sale3_arr, print) {
				//票据
				var that = this;
				//输出日志
				console.log("打印接收数据 sale1_obj", sale1_obj);
				console.log("打印接收数据 sale2_arr", sale2_arr);
				console.log("打印接收数据 sale3_arr", sale3_arr);
				console.log("打印控制参数 print", print);
				
				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
				console.log("查询终端参数",printer_poscs);
				
				// 通过终端参数，Y 打印小票
				if(printer_poscs.YN_YXDY != "Y"){
					uni.showToast({
						icon: 'error',
						title: "终端参数未设置打印小票"
					})
					console.log("终端参数未设置打印小票");
					return;
				}
				
				//打印数据转换
				var printerInfo = xprinter_util.printerData(sale1_obj, sale2_arr, sale3_arr);
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init();
				//打印格式
				command.formString(printerInfo,printer_poscs,print);
				//写入打印记录表
				xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, sale1_obj.SALETIME, command.getData());
				
				// 电子发票二维码不为空，则打印二维码
				if(printer_poscs.DZFPEWMDZ != ""){
					//生成属于单号的二维码
					that.qrCodeContent = printer_poscs.DZFPEWMDZ;
					Promise.all([
					    xprinter_util.qrCodeGenerate(sale1_obj.BILL,that.qrCodeContent,that.qrCodeWidth,that.qrCodeHeight),
					    xprinter_util.gzhQrCodeGenerate(),
						xprinter_util.qrCodeAction(command,that.qrCodeWidth,that.qrCodeHeight)
					]).then(res => {
					    console.log("开始发送打印命令");
						that.prepareSend(command.getData()); //发送数据
					})
				}else{
					that.prepareSend(command.getData()); //发送数据
				}
				console.log("打印格式记录结束");
			},
			//重新打印
			againPrinter: async function(xsBill) {
				var that = this;
				//xsBill = that.bill_printer;
				console.log("重打单号:",xsBill)
				if(xsBill == "" || xsBill == null){
					uni.showToast({
						icon: 'error',
						title: "重打单号为空"
					})
					return;
				}
				//通过单号，查询重打格式数据
				let pos_xsbillprint = await xprinter_util.getBillPrinterData(xsBill);
				//console.log("pos_xsbillprint",pos_xsbillprint);	
				if(pos_xsbillprint == "" || pos_xsbillprint == null){
					uni.showToast({
						icon: 'error',
						title: "未查询到重打数据"
					})
					return;
				}
				
				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
			    console.log("查询终端参数",printer_poscs);
				
				// 通过终端参数，Y 打印小票
				if(printer_poscs.YN_YXDY != "Y"){
					uni.showToast({
						icon: 'error',
						title: "终端参数未设置打印小票"
					})
					console.log("终端参数未设置打印小票");
					return;
				}
				
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.addContent(pos_xsbillprint);
				
				// 电子发票二维码不为空，则打印二维码
				if(printer_poscs.DZFPEWMDZ != ""){
					//生成属于单号的二维码
					that.qrCodeContent = printer_poscs.DZFPEWMDZ;
					Promise.all([
					    xprinter_util.qrCodeGenerate(xsBill,that.qrCodeContent,that.qrCodeWidth,that.qrCodeHeight),
					    xprinter_util.gzhQrCodeGenerate(),
						xprinter_util.qrCodeAction(command,that.qrCodeWidth,that.qrCodeHeight)
					]).then(res => {
					    console.log("开始发送打印命令");
						that.prepareSend(command.getData()); //发送数据
					})		
				}else{
					//不打印二维码
					that.prepareSend(command.getData()); //发送数据
				}	
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
			//打印Logo事件
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
						const data = xprinter_util.convertToMonoImage(res.width, res.height, res.data,
							true);
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
				console.log("printer prepareSend")
				var that = this;
				var time = that.oneTimeData;
				var looptime = parseInt(buff.length / time);
				var lastData = parseInt(buff.length % time);

			    that.setData({
					looptime: looptime + 1,
					lastData: lastData,
					currentTime: 1
				});
			    that.Send(buff);
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
							var result = xprinter_util.ab2hex(r.value);
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
				//console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
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
