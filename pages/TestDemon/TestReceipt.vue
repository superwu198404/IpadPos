<template>
	<view class="body">
		<view>
			<view style="height: 50px;line-height: 50px;">请输入单号（用于测试重新打印）</view>
			<view>
				<input style="border:1px solid gray" type="text" v-model="bill_printer" />
			</view>
		</view>
		<button class="button" hover-class="hover" @tap="againPrinter">重打</button>
		<button class="button" hover-class="hover" @tap="bluePrinter" :loading="isReceiptSend" :disabled="isReceiptSend"
			v-show="false">
			打印小票-测试
		</button>
		<button class="button" hover-class="hover" @tap="queryStatus" :loading="isQuery" :disabled="isQuery">
			查询状态
		</button>
		<button class="button" hover-class="hover" @tap="printPhoto" v-show="true">打印二维码-测试</button>
		<canvas canvas-id="couponQrcode" class="canvas"
			:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>

		<button class="button" hover-class="hover" @tap="printJPGPhoto" v-show="false">打印logo-测试</button>
		<canvas canvas-id="canvasLogoJPG" class="canvas"
			:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>

		<canvas canvas-id="canvasXPEWM" class="canvas"
			:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>

		<picker style="margin:20px;display: none;" mode="selector" :range="buffSize" :value="buffIndex"
			@change="buffBindChange">
			当前每次发送字节数为(点击可更换)：{{ buffSize[buffIndex] }}
		</picker>

		<picker style="margin:20px;display: none;" mode="selector" :range="printNum" :value="printNumIndex"
			@change="printNumBindChange">
			当前打印份数(点击可更换)：{{ printNum[printNumIndex] }}
		</picker>
	</view>
</template>

<script>
	import esc from '@/utils/xprinter/esc.js';
	import xprinter_util from '@/utils/xprinter/util.js';
	import qrCode from '@/utils/xprinter/weapp-qrcode.js';

	import common from '@/api/common.js';
	import Req from '@/utils/request.js';
	import util from '@/utils/util.js';
	//import bleConnect from '@/utils/xprinter/bleConnect.js';

	export default {
		data() {
			return {
				looptime: 0,
				currentTime: 1,
				lastData: 0,
				oneTimeData: 10000,
				buffSize: [],
				buffIndex: 0,
				//发送字节数下标
				printNum: [],
				printNumIndex: 0,
				printerNum: 1,
				currentPrint: 1,
				isReceiptSend: false,
				isQuery: false,
				imageSrc: "/static/xprinter/erweima.png",
				jpgSrc: "/static/xprinter/logo.jpg",
				canvasGZHWidth: 256, //小票结尾二维码宽
				canvasGZHHeight: 256, //小票结尾二维码高
				jpgWidth: 340,
				jpgHeight: 113,
				qrCodeWidth: 256, //开票二维码宽
				qrCodeHeight: 256, // 开票二维码高
				bill_printer: "", //单号
				blueStatus: false, //打印机状态
			};
		},
		//生命周期函数--监听页面加载
		onLoad: function(options) {
			var that = this;
			setTimeout(() => {
				that.couponQrCode()
			}, 50);
		},
		//生命周期函数--监听页面初次渲染完成
		onReady: function() {
			var list = [];
			var numList = [];
			var j = 0;
			//打印字节数组
			for (var i = 10000; i <= 200000; i += 10000) {
				list[j] = i;
				j++;
			}
			//打印份数数组
			for (var i = 1; i <= 10; i++) {
				numList[i - 1] = i;
			}
			this.setData({
				buffSize: list,
				oneTimeData: list[3],
				printNum: numList,
				printerNum: numList[0]
			});
		},
		created: function(e) {
			let that = this;
			//初始化画布
			that.initPhoto();
		},
		methods: {
			//二维码生成工具
			couponQrCode: function() {
				let that = this;
				new qrCode('couponQrcode', {
					text: "",
					width: that.qrCodeWidth,
					height: that.qrCodeHeight,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.L
				})
			},	
			//初始化画布数据
			initPhoto: function() {
				//初始化画布数据
				var that = this;
				const ctx_Qrcode = uni.createCanvasContext("couponQrcode", this);
				var png_Qrcode = that.imageSrc;
				uni.getImageInfo({
					src: png_Qrcode,
					success(res) {
						that.setData({
							qrCodeWidth: that.qrCodeWidth,
							qrCodeHeight: that.qrCodeHeight
						});
						//console.log("画布宽度" + res.width, "画布高度" + res.height);
						ctx_Qrcode.drawImage(png_Qrcode, 0, 0, res.width, res.height);
						ctx_Qrcode.draw();
					}
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
						command.setPrint();
						command.endPrinter(); //打印切纸				
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						util.simpleMsg("获取画布数据失败", "none");
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
						util.simpleMsg("获取画布数据失败","none");
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
