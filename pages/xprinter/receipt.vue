<template>
	<view class="body">
		<button
			class="button"
			hover-class="hover"
			@tap="receiptTest"
			:loading="isReceiptSend"
			:disabled="isReceiptSend"
		>
			打印小票
		</button>
		<button
			class="button"
			hover-class="hover"
			@tap="queryStatus"
			:loading="isQuery"
			:disabled="isQuery"
		>
			查询状态
		</button>
		<button class="button" hover-class="hover" @tap="printPhoto">打印二维码</button>
		<canvas
			canvas-id="couponQrcode"
			class="canvas"
			:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"
		></canvas>

		<button class="button" hover-class="hover" @tap="printJPGPhoto">打印logo</button>
		<canvas
			canvas-id="canvasJPG"
			class="canvas"
			:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'" 		
		></canvas>
		<picker
			style="margin:20px"
			mode="selector"
			:range="buffSize"
			:value="buffIndex"
			@change="buffBindChange"
		>
			当前每次发送字节数为(点击可更换)：{{ buffSize[buffIndex] }}
		</picker>

		<picker
			style="margin:20px"
			mode="selector"
			:range="printNum"
			:value="printNumIndex"
			@change="printNumBindChange"
		>
			当前打印份数(点击可更换)：{{ printNum[printNumIndex] }}
		</picker>
	</view>
</template>

<script>
var app = getApp();
var esc = require("../../utils/xprinter/esc.js");
var encode = require("../../utils/xprinter/encoding.js");
var util = require("../../utils/xprinter/util.js");
var qrCode  = require("../../utils/xprinter/weapp-qrcode.js");

function inArray(arr, key, val) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === val) {
			return i;
		}
	}
	return -1;
}
// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
	var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(bit) {
		return ("00" + bit.toString(16)).slice(-2);
	});
	return hexArr.join("");
}
function convertToGrayscale(data) {
	let g = 0;

	for (let i = 0; i < data.length; i += 4) {
		g = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
		data[i] = g;
		data[i + 1] = g;
		data[i + 2] = g;
	}
	return data;
}

function setPixel(data, offset, value) {
	data[offset] = value;
	data[offset + 1] = value;
	data[offset + 2] = value;
}

function adjustPixel(data, offset, value) {
	data[offset] += value;
}
// 彩色图转成单色图
function convertToMonoImage(width, height, data, shake) {
	let g = 0;
	let e = 0;

	for (let i = 0; i < data.length; i += 4) {
		data[i] = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let dataOffset = (width * y + x) * 4;
			g = data[dataOffset];

			if (g >= 150) {
				// 灰色转黑白的阈值, 可以调整打印效果
				e = g - 255;
				setPixel(data, dataOffset, 255);
			} else {
				e = g;
				setPixel(data, dataOffset, 0);
			}

			if (!shake) continue;

			if (x < width - 1 && y < height - 1) {
				//右边像素处理
				data[(width * y + x + 1) * 4] += (7 * e) / 16; //下

				data[(width * (y + 1) + x) * 4] += (5 * e) / 16; //右下

				data[(width * (y + 1) + x + 1) * 4] += e / 16; //左下

				if (x > 0) {
					data[(width * (y + 1) + x - 1) * 4] += (3 * e) / 16;
				}
			} else if (x == width - 1 && y < height - 1) {
				//下方像素处理
				data[(width * (y + 1) + x) * 4] += (5 * e) / 16;
			} else if (x < width - 1 && y == height - 1) {
				//右边像素处理
				data[(width * y + x + 1) * 4] += (7 * e) / 16;
			}
		}
	}
	return data;
}

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
			qrCodeWidth: 200,
			qrCodeHeight: 200,
			qrCodeContent: "https://www.jufanba.com/pinpai/88783/"
		};
	},

	components: {},
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
		this.fileReader();
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
	onShow: function() {},

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
	methods: {
	  	fileReader:function(){
			const self = this;
				// 请求本地系统文件对象 plus.io.PRIVATE_WWW：应用运行资源目录常量
				plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fobject){
					// fs.root是根目录操作对象DirectoryEntry
					fobject.root.getFile('poem.txt',{create:true}, function(fileEntry){
						fileEntry.file( function(file){
							var fileReader = new plus.io.FileReader();
							self.resInfo = JSON.stringify(file);
							console.log("getFile:", JSON.stringify(file));
							fileReader.onloadend = function(evt) {
								console.log( "Read success" );
								self.resInfo = self.resInfo+'--'+JSON.stringify(evt);
								console.log('result',JSON.stringify(evt)); 
							}
							fileReader.readAsText(file, 'utf-8');
							self.resInfo = self.resInfo + '-- ' +file.size + '--' + file.name;
							console.log('file文件',self.resInfo);
						} );
					});
				} );
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
		initPhoto: function() {
			//初始化画布数据
			//创建一个png格式
			var that = this;
			const ctx_out = uni.createCanvasContext("canvasOut", this);
			var png = that.imageSrc;
			uni.getImageInfo({
				src: png,

				success(res) {
					that.setData({
						canvasWidth: res.width,
						canvasHeight: res.height
					});
					console.log("画布宽度" + res.width, "画布高度" + res.height);
					ctx_out.drawImage(png, 0, 0, res.width, res.height);
					ctx_out.draw();
				}
			}); //创建一个jpg格式图片

			const ctx_jpg = uni.createCanvasContext("canvasJPG", this);
			var jpg_width = that.jpgWidth;
			var jpg_height = that.jpgHeight;
			var img = that.jpgSrc;
			uni.getImageInfo({
				src: img,

				success(res) {
					that.setData({
						jpgWidth: res.width,
						jpgHeight: res.height
					});
					console.log("JPG画布宽度" + res.width, "JPG画布高度" + res.height);
					ctx_jpg.drawImage(img, 0, 0, res.width, res.height);
					ctx_jpg.draw();
				}
			});
		},
		receiptTest: function() {
			//票据测试
			var that = this;
			var canvasWidth = that.canvasWidth;
			var canvasHeight = that.canvasHeight;
			var nowDate = util.getTime(); //当前时间
			
			var command = esc.jpPrinter.createNew();
			command.init(); //初始化打印机
			
			command.setSelectJustification(1); //居中
			command.setCharacterSize(17); //设置倍高倍宽
			command.setText("KenGee 仟吉" + "\n");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(1); //设置居左	
			command.setText("欢迎光临");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小			
			command.setSelectJustification(0); //设置居左
			command.setText("销售小票: 武汉万科汉阳国际店门厅");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("销售时间: " + nowDate);
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText(util.getComputedByteLen("款台: 8",17) + "收银员:金凤001");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("单号: 2214055034000983"+ "\n");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("商品名称       数量  单价  金额  折扣  ");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("-----------------------------------------------");
			command.setPrint(); //打印并换行
			
			//商品信息
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText(util.getComputedByteLen("德式黑杂粮切片方包",15) + util.getComputedByteLen("1",6) + util.getComputedByteLen("1.00",6) + util.getComputedByteLen("1.00",6) + util.getComputedByteLen("0",6));
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText(util.getComputedByteLen("你好吐司",15) + util.getComputedByteLen("1",6) + util.getComputedByteLen("1.00",6) + util.getComputedByteLen("1.00",6) + util.getComputedByteLen("0",6));
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("--------------------总计-----------------------");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("条目:1 数量:1 应付金额:1.00");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("已优惠金额:0.00 原金额:1.00");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("--------------------付款方式-------------------");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("现金:1");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("支付:1.00");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("找零:0.00");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("门店地址: 湖北省武汉市江汉区青年路与后襄河北路交汇处海马公园");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("-----------------------------------------------");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("轻轻地走了，正如我轻轻的来");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("-----------------------------------------------");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("商户承担折扣额: 0");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("-----------------------------------------------");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("KenGee 客服热线 400-1800-517" + "\n");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("更多活动资讯请加入门店粉丝福利群额~");
			command.setPrint(); //打印并换行
			
			command.setCharacterSize(0); //设置正常大小
			command.setSelectJustification(0); //设置居左
			command.setText("-----------------------------------------------");
			command.setPrint(); //打印并换行
			
			that.prepareSend(command.getData()); //准备发送数据
		},
		printPhoto: function() { //打印图片事件
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
					command.setSelectJustification(1);//居中
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
		printJPGPhoto: function() { //打印彩图事件
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
					//const data = convertToGrayscale(res.data)
					const data = convertToMonoImage(res.width, res.height, res.data, true);
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
					command.setSelectJustification(1);//居中
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
		prepareSend: function(buff) {
			//准备发送，根据每次发送字节数来处理分包数量
			//console.log(buff)
			var that = this;
			var time = that.oneTimeData;
			var looptime = parseInt(buff.length / time);
			var lastData = parseInt(buff.length % time); //console.log(looptime + "---" + lastData)

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
						console.log(`characteristic ${r.characteristicId} has changed, now is ${r}`);
						var result = ab2hex(r.value);
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
			} //console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)

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
