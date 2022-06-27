
	var app = getApp();
	var esc = require("../../utils/xprinter/esc.js");
	var encode = require("../../utils/xprinter/encoding.js");
	var util = require("../../utils/xprinter/util.js");
	var qrCode = require("../../utils/xprinter/weapp-qrcode.js");

    import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
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
			//打印小票
			receiptPrinter: function(sale1_obj,sale2_arr,sale3_arr) {
				console.log("打印接收数据 sale1_obj",sale1_obj);
				console.log("打印接收数据 sale2_arr",sale2_arr);
				console.log("打印接收数据 sale3_arr",sale3_arr);	
				//票据测试
				var that = this;
				
				// var xsType = "XS";
				// var xsBill = sale1_obj.BILL;
				// var xsDate = util.getTime();
				// var khName = getApp().globalData.NAME;
				// var khAddress = getApp().globalData.KHAddress;
				// var posId = sale1_obj.POSID;
				// var posUser = sale1_obj.RYID;
				// var lineNum = sale1_obj.TLINE;
				// var payableAmount = sale1_obj.totalAmount;
				// var discountedAmount = sale1_obj.BILLDISC;
				// var originalAmount = sale1_obj.allAmount;
				
				// var goods_obj = {};
				// var goodsList = [];
				// for (var i = 0; i < sale2_arr.length; i++){
				// 	let spname = "";
				// 	let sqlSpda = "SELECT SPID,SNAME,PRODUCT_TYPE,PRODUCT_STATUS,UNIT,PLID,BARCODE FROM SPDA where SPID='" + sale2_arr[i].SPID +"' order by SPID";
				// 	db.get().executeQry(sqlSpda, "数据查询中", function(res) {
				// 		spname = res.msg[0].SNAME;
				// 		console.log("商品数据:",res.msg[0].SNAME);
				// 	}, function(err) {
				// 		console.log("获取商品数据出错:", err);
				// 		uni.showToast({
				// 			icon: 'error',
				// 			title: "获取商品数据出错"
				// 		})
				// 	});
					
				// 	this.sale2_obj = {
				// 		bill: sale2_arr[i].BILL, //主单号
				// 		saleDate: sale2_arr[i].SALEDATE,
				// 		saleTime: sale2_arr[i].SALETIME,
				// 		khid: sale2_arr[i].KHID,
				// 		posId: sale2_arr[i].POSID,
				// 	    no: i,
				// 		plid: sale2_arr[i].PLID,
				// 		barCode: sale2_arr[i].BARCODE,
				// 		unit: sale2_arr[i].UNIT, //单位
						
				// 		spid: sale2_arr[i].SPID, //商品编码
				// 		spname: spname, //商品名称
				// 		qty: sale2_arr[i].QTY, //数量
				// 		price: sale2_arr[i].PRICE, //单价
				// 		amount: sale2_arr[i].NET, //金额
				// 		discount: sale2_arr[i].DISCRATE, //总折扣额
				// 	};
				// 	goodsList = goodsList.concat(sale2_obj);
				// }
				
				// var payTotal = 0.00;
				// var change = 0.00;
				
				// var sale3_obj = {};
				// var sale3List = [];
				// for (var i = 0; i < sale3_arr.length; i++){
				// 	let fkName = "";
				// 	let sqlFkda = "SELECT FKID,SNAME,PINYIN FROM FKDA where FKID ='" + sale3_arr[i].FKID +"' order by FKID";
				// 	db.get().executeQry(sqlFkda, "数据查询中", function(res) {
				// 		fkName = res.msg[0].SNAME;
				// 		console.log("付款方式数据:",res.msg[0].SNAME);
				// 	}, function(err) {
				// 		console.log("获取付款方式出错:", err);
				// 		uni.showToast({
				// 			icon: 'error',
				// 			title: "获取付款方式出错"
				// 		})
				// 	});
					
				// 	this.sale3_obj = {
				// 	   bill: sale3_arr[i].BILL,
				// 	   saleDate: sale3_arr[i].SALEDATE,
				// 	   saleTime: sale3_arr[i].SALETIME,
				// 	   khid: sale3_arr[i].KHID,
				// 	   posId: sale3_arr[i].POSID,
				// 	   no: sale3_arr[i].NO, //付款序号
				// 	   fkid: sale3_arr[i].FKID, //付款类型id
				// 	   amt: sale3_arr[i].AMT, //付款金额
				// 	   id: sale3_arr[i].ID,  //卡号或者券号
				// 	   ryid: sale3_arr[i].RYID, //人员
				// 	   disc: sale3_arr[i].DISC, //折扣金额
				// 	   zklx: sale3_arr[i].ZKLX, //折扣类型
				// 	   idType: sale3_arr[i].IDTYPE, //卡类型
				// 	   fkName: fkName,
				// 	};
				// 	sale3List = sale3List.concat(sale3_obj);
				// 	payTotal += sale3_obj.amt;
				// }

				// var printerInfo = {
				// 	xsType,//销售、退单、预订、预订提取、预订取消、赊销、赊销退单、线上订单、外卖；
				// 	xsBill, //单号
				// 	xsDate, //打印时间
				// 	khName, //门店名称
				// 	khAddress, //门店地址
				// 	posId, //款台
				// 	posUser, //收银员
				
				// 	goodsList,//商品集合
				
				// 	lineNum, //条目
				// 	payableAmount, //应付金额
				// 	discountedAmount, //已优惠金额
				// 	originalAmount, //原金额
					
				// 	sale3List, //付款方式
					
				// 	payTotal, //支付
				// 	change, //找零
				// }

				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init(); 

				//打印Logo
				
				command.setSelectJustification(1); //居中
				command.setCharacterSize(17); //设置倍高倍宽
				command.setText("KenGee 仟吉" + "\n");
				//command.setPrint(); //打印并换行
									
				// command.formString(printerInfo);

				// command.setCharacterSize(0); //设置正常大小
				// command.setSelectJustification(0); //设置居左
				// command.setText("--------------------总计-----------------------");
				// //command.setPrint(); //打印并换行

				// command.formStringTotal(printerInfo);

				// command.setCharacterSize(0); //设置正常大小
				// command.setSelectJustification(0); //设置居左
				// command.setText("--------------------付款方式-------------------");
				// //command.setPrint(); //打印并换行

				// command.formStringPaymentMethod(printerInfo);

				// command.setCharacterSize(0); //设置正常大小
				// command.setSelectJustification(0); //设置居左
				// command.setText("-----------------------------------------------");
				// //command.setPrint(); //打印并换行

				// command.setCharacterSize(0); //设置正常大小
				// command.setSelectJustification(0); //设置居左
				// command.setText("轻轻地走了，正如我轻轻的来");
				// //command.setPrint(); //打印并换行

				// command.setCharacterSize(0); //设置正常大小
				// command.setSelectJustification(0); //设置居左
				// command.setText("-----------------------------------------------");
				// command.setPrint(); //打印并换行

				//打印二维码
				// uni.canvasGetImageData({
				// 	canvasId: "couponQrcode",
				// 	x: 0,
				// 	y: 0,
				// 	width: that.qrCodeWidth,
				// 	height: that.qrCodeHeight,
				// 	success: function(res) {
				// 		console.log("获取画布数据成功");
				// 		command.setSelectJustification(1); //居中
				// 		command.setBitmap(res);
				// 		command.setPrint();
						
				// 		that.addData(xsBill,xsDate,command.getData());
				// 		that.prepareSend(command.getData()); //发送数据
				// 	},
				// 	complete: function(res) {
				// 		console.log("finish");
				// 	},
				// 	fail: function(res) {
				// 		console.log(res);
				// 		uni.showToast({
				// 			title: "获取画布数据失败",
				// 			icon: "none"
				// 		});
						
				// 		that.addData(xsBill,xsDate,command.getData());
				// 	    that.prepareSend(command.getData()); //发送数据
				// 	}
				// });
				
				command.setPrint(); //打印并换行
				console.log("打印格式记录", command.getData());
				//that.addData(xsBill,xsDate,command.getData());
				that.prepareSend(command.getData()); //准备发送数据
			},
			//重新打印
			againPrinter:function(xsBill){
				console.log("进入到打印了",xsBill)
				var that = this;
				xsBill = "2214055034000983";
				let sql = "select * from POS_XSBILLPRINT where XSBILL='" + xsBill +"' order by XSDATE desc";
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
			printPhoto: function() { //打印二维码事件
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
			prepareSend: function(buff) {
				//准备发送，根据每次发送字节数来处理分包数量
				console.log("prepareSend 开始")
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
	
	//打印小票
	function receiptPrinter(sale1_obj,sale2_arr,sale3_arr) {
		console.log("打印接收数据 sale1_obj",sale1_obj);
		console.log("打印接收数据 sale2_arr",sale2_arr);
		console.log("打印接收数据 sale3_arr",sale3_arr);	
		//票据测试
		var that = this;
		
		// var xsType = "XS";
		// var xsBill = sale1_obj.BILL;
		// var xsDate = util.getTime();
		// var khName = getApp().globalData.NAME;
		// var khAddress = getApp().globalData.KHAddress;
		// var posId = sale1_obj.POSID;
		// var posUser = sale1_obj.RYID;
		// var lineNum = sale1_obj.TLINE;
		// var payableAmount = sale1_obj.totalAmount;
		// var discountedAmount = sale1_obj.BILLDISC;
		// var originalAmount = sale1_obj.allAmount;
		
		// var goods_obj = {};
		// var goodsList = [];
		// for (var i = 0; i < sale2_arr.length; i++){
		// 	let spname = "";
		// 	let sqlSpda = "SELECT SPID,SNAME,PRODUCT_TYPE,PRODUCT_STATUS,UNIT,PLID,BARCODE FROM SPDA where SPID='" + sale2_arr[i].SPID +"' order by SPID";
		// 	db.get().executeQry(sqlSpda, "数据查询中", function(res) {
		// 		spname = res.msg[0].SNAME;
		// 		console.log("商品数据:",res.msg[0].SNAME);
		// 	}, function(err) {
		// 		console.log("获取商品数据出错:", err);
		// 		uni.showToast({
		// 			icon: 'error',
		// 			title: "获取商品数据出错"
		// 		})
		// 	});
			
		// 	this.sale2_obj = {
		// 		bill: sale2_arr[i].BILL, //主单号
		// 		saleDate: sale2_arr[i].SALEDATE,
		// 		saleTime: sale2_arr[i].SALETIME,
		// 		khid: sale2_arr[i].KHID,
		// 		posId: sale2_arr[i].POSID,
		// 	    no: i,
		// 		plid: sale2_arr[i].PLID,
		// 		barCode: sale2_arr[i].BARCODE,
		// 		unit: sale2_arr[i].UNIT, //单位
				
		// 		spid: sale2_arr[i].SPID, //商品编码
		// 		spname: spname, //商品名称
		// 		qty: sale2_arr[i].QTY, //数量
		// 		price: sale2_arr[i].PRICE, //单价
		// 		amount: sale2_arr[i].NET, //金额
		// 		discount: sale2_arr[i].DISCRATE, //总折扣额
		// 	};
		// 	goodsList = goodsList.concat(sale2_obj);
		// }
		
		// var payTotal = 0.00;
		// var change = 0.00;
		
		// var sale3_obj = {};
		// var sale3List = [];
		// for (var i = 0; i < sale3_arr.length; i++){
		// 	let fkName = "";
		// 	let sqlFkda = "SELECT FKID,SNAME,PINYIN FROM FKDA where FKID ='" + sale3_arr[i].FKID +"' order by FKID";
		// 	db.get().executeQry(sqlFkda, "数据查询中", function(res) {
		// 		fkName = res.msg[0].SNAME;
		// 		console.log("付款方式数据:",res.msg[0].SNAME);
		// 	}, function(err) {
		// 		console.log("获取付款方式出错:", err);
		// 		uni.showToast({
		// 			icon: 'error',
		// 			title: "获取付款方式出错"
		// 		})
		// 	});
			
		// 	this.sale3_obj = {
		// 	   bill: sale3_arr[i].BILL,
		// 	   saleDate: sale3_arr[i].SALEDATE,
		// 	   saleTime: sale3_arr[i].SALETIME,
		// 	   khid: sale3_arr[i].KHID,
		// 	   posId: sale3_arr[i].POSID,
		// 	   no: sale3_arr[i].NO, //付款序号
		// 	   fkid: sale3_arr[i].FKID, //付款类型id
		// 	   amt: sale3_arr[i].AMT, //付款金额
		// 	   id: sale3_arr[i].ID,  //卡号或者券号
		// 	   ryid: sale3_arr[i].RYID, //人员
		// 	   disc: sale3_arr[i].DISC, //折扣金额
		// 	   zklx: sale3_arr[i].ZKLX, //折扣类型
		// 	   idType: sale3_arr[i].IDTYPE, //卡类型
		// 	   fkName: fkName,
		// 	};
		// 	sale3List = sale3List.concat(sale3_obj);
		// 	payTotal += sale3_obj.amt;
		// }
	
		// var printerInfo = {
		// 	xsType,//销售、退单、预订、预订提取、预订取消、赊销、赊销退单、线上订单、外卖；
		// 	xsBill, //单号
		// 	xsDate, //打印时间
		// 	khName, //门店名称
		// 	khAddress, //门店地址
		// 	posId, //款台
		// 	posUser, //收银员
		
		// 	goodsList,//商品集合
		
		// 	lineNum, //条目
		// 	payableAmount, //应付金额
		// 	discountedAmount, //已优惠金额
		// 	originalAmount, //原金额
			
		// 	sale3List, //付款方式
			
		// 	payTotal, //支付
		// 	change, //找零
		// }
	
		//初始化打印机
		var command = esc.jpPrinter.createNew();
		command.init(); 
	
		//打印Logo
		
		command.setSelectJustification(1); //居中
		command.setCharacterSize(17); //设置倍高倍宽
		command.setText("KenGee 仟吉" + "\n");
		//command.setPrint(); //打印并换行
							
		// command.formString(printerInfo);
	
		// command.setCharacterSize(0); //设置正常大小
		// command.setSelectJustification(0); //设置居左
		// command.setText("--------------------总计-----------------------");
		// //command.setPrint(); //打印并换行
	
		// command.formStringTotal(printerInfo);
	
		// command.setCharacterSize(0); //设置正常大小
		// command.setSelectJustification(0); //设置居左
		// command.setText("--------------------付款方式-------------------");
		// //command.setPrint(); //打印并换行
	
		// command.formStringPaymentMethod(printerInfo);
	
		// command.setCharacterSize(0); //设置正常大小
		// command.setSelectJustification(0); //设置居左
		// command.setText("-----------------------------------------------");
		// //command.setPrint(); //打印并换行
	
		// command.setCharacterSize(0); //设置正常大小
		// command.setSelectJustification(0); //设置居左
		// command.setText("轻轻地走了，正如我轻轻的来");
		// //command.setPrint(); //打印并换行
	
		// command.setCharacterSize(0); //设置正常大小
		// command.setSelectJustification(0); //设置居左
		// command.setText("-----------------------------------------------");
		// command.setPrint(); //打印并换行
	
		//打印二维码
		// uni.canvasGetImageData({
		// 	canvasId: "couponQrcode",
		// 	x: 0,
		// 	y: 0,
		// 	width: that.qrCodeWidth,
		// 	height: that.qrCodeHeight,
		// 	success: function(res) {
		// 		console.log("获取画布数据成功");
		// 		command.setSelectJustification(1); //居中
		// 		command.setBitmap(res);
		// 		command.setPrint();
				
		// 		that.addData(xsBill,xsDate,command.getData());
		// 		that.prepareSend(command.getData()); //发送数据
		// 	},
		// 	complete: function(res) {
		// 		console.log("finish");
		// 	},
		// 	fail: function(res) {
		// 		console.log(res);
		// 		uni.showToast({
		// 			title: "获取画布数据失败",
		// 			icon: "none"
		// 		});
				
		// 		that.addData(xsBill,xsDate,command.getData());
		// 	    that.prepareSend(command.getData()); //发送数据
		// 	}
		// });
		
		command.setPrint(); //打印并换行
		console.log("打印格式记录", command.getData());
		//that.addData(xsBill,xsDate,command.getData());
		that.prepareSend(command.getData()); //准备发送数据
	}