import qrCode from '@/utils/xprinter/weapp-qrcode.js';
import xprinter_util from '@/utils/xprinter/util.js';
import esc from '@/utils/xprinter/esc.js';

//打印参数
export const print_init = {
	data: function() {
		return {
			//打印相关
			looptime: 0,
			currentTime: 1,
			lastData: 0,
			oneTimeData: 5000,
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
			canvasGZHWidth: 200, //小票结尾二维码宽
			canvasGZHHeight: 200, //小票结尾二维码高
			jpgWidth: 340,
			jpgHeight: 113,
			qrCodeWidth: 256, //开票二维码宽
			qrCodeHeight: 256, // 开票二维码高
			bill_printer: "", //单号
		}
	}
}

//二维码生成工具
export const couponQrCode = function() {
	new qrCode('couponQrcode', {
		text: getApp().globalData.BLEInformation.qrCodeContent,
		width: this.qrCodeWidth,
		height: this.qrCodeHeight,
		colorDark: "#333333",
		colorLight: "#FFFFFF",
		correctLevel: qrCode.CorrectLevel.H
	})
}

//广告语
export const ggyAction = async function() {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: getApp().globalData.BLEInformation.printerFile + "poem.txt",
			method: "GET",
			data: "",
			success: (res) => {
				console.log("ggyAction success: ", res.data)
				getApp().globalData.BLEInformation.ggy = res.data;
				return resolve(res.data);
			},
			fail: (res) => {
				console.log("ggyAction false: ", res);
				return resolve("");
			}
		})
	})
}

//线上订单打印小票
export const xsBluePrinter = async function(order, type, print) {
	//票据
	var that = this;
	let sale1_objO = JSON.stringify(order);
	//输出日志
	console.log("线上订单打印接收数据 sale1_obj", order);
	console.log("线上订单打印控制参数 print", print);

	let dateNow = xprinter_util.getTime(3);
	//查询终端参数
	var poscsData = await xprinter_util.getPOSCS(getApp().globalData.store.POSCSZID);
	var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
	console.log("查询终端参数", printer_poscs);

	// 通过终端参数，Y 打印小票
	if (printer_poscs.YN_YXDY != "Y") {
		util.simpleMsg("终端参数未设置打印小票", "none");
		console.log("终端参数未设置打印小票");
		return;
	}
	var ggyContent = await that.ggyAction();
	//打印数据转换
	let sale1_obj = JSON.parse(sale1_objO);
	var printerInfo = xprinter_util.xsPrinterData(sale1_obj, ggyContent, type);
	//初始化打印机
	var command = esc.jpPrinter.createNew();
	command.init();
	//打印格式
	command.FormStringXS(printerInfo, printer_poscs, print, type);
	//写入打印记录表
	xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, dateNow, command.getData());

	let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
	let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
	// 电子发票二维码不为空、小票结尾二维码不为空
	if (is_dzfpewmdz || is_xpewm) {
		//生成属于单号的二维码
		Promise.all([
			xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
				that.qrCodeWidth, that.qrCodeHeight),
			//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
			//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
			xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
		]).then(res => {
			console.log("xsBluePrinter 开始发送打印命令");
			prepareSend(command.getData()); //发送数据
		}).catch(reason => {
			console.log('xsBluePrinter reject failed reason', reason)
			prepareSend(command.getData()); //发送数据
		})
	} else {
		prepareSend(command.getData()); //发送数据
	}
	//that.prepareSend(command.getData()); //发送数据
	console.log("线上订单打印格式记录结束");
}

//外卖打印小票
export const wmBluePrinter = async function(order, datails, type, print) {
	//票据
	var that = this;
	let sale1_objO = JSON.stringify(order);
	let sale2_arrO = JSON.stringify(datails);
	//输出日志
	console.log("外卖打印接收数据 sale1_obj", order);
	console.log("外卖打印接收数据 sale2_arr", datails);
	console.log("外卖打印控制参数 print", print);

	let dateNow = xprinter_util.getTime(3);
	//查询终端参数
	var poscsData = await xprinter_util.getPOSCS(getApp().globalData.store.POSCSZID);
	var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
	console.log("查询终端参数", printer_poscs);

	// 通过终端参数，Y 打印小票
	if (printer_poscs.YN_YXDY != "Y") {
		util.simpleMsg("终端参数未设置打印小票", "none");
		console.log("终端参数未设置打印小票");
		return;
	}
	var ggyContent = await that.ggyAction();
	//打印数据转换
	let sale1_obj = JSON.parse(sale1_objO);
	let sale2_arr = JSON.parse(sale2_arrO);
	var printerInfo = xprinter_util.wmPrinterData(sale1_obj, sale2_arr, ggyContent, type);
	//初始化打印机
	var command = esc.jpPrinter.createNew();
	command.init();
	//打印格式
	command.wmFormString(printerInfo, printer_poscs, print, type);
	//写入打印记录表
	xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, dateNow, command.getData());

	let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
	let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
	// 电子发票二维码不为空、小票结尾二维码不为空
	if (is_dzfpewmdz || is_xpewm) {
		//生成属于单号的二维码
		Promise.all([
			xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
				that.qrCodeWidth, that.qrCodeHeight),
			//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
			//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
			xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
		]).then(res => {
			console.log("wmBluePrinter 开始发送打印命令");
			prepareSend(command.getData()); //发送数据
		}).catch(reason => {
			console.log('wmBluePrinter reject failed reason', reason)
			prepareSend(command.getData()); //发送数据
		})
	} else {
		prepareSend(command.getData()); //发送数据
	}
	//that.prepareSend(command.getData()); //发送数据
	console.log("外卖打印格式记录结束");
}

//销售打印小票
export const bluePrinter = async function(sale1_obj, sale2_arr, sale3_arr, print) {
	//票据
	var that = this;
	//输出日志
	console.log("销售打印接收数据 sale1_obj", sale1_obj);
	console.log("销售打印接收数据 sale2_arr", sale2_arr);
	console.log("销售打印控制参数 print", print);
	console.log("销售打印接收数据 sale3_arr", sale3_arr);

	//查询终端参数
	var poscsData = await xprinter_util.getPOSCS(getApp().globalData.store.POSCSZID);
	var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
	console.log("查询终端参数", printer_poscs);

	// 通过终端参数，Y 打印小票
	if (printer_poscs.YN_YXDY != "Y") {
		util.simpleMsg("终端参数未设置打印小票", "none");
		console.log("终端参数未设置打印小票");
		return;
	}
	var ggyContent = await that.ggyAction();
	//打印数据转换
	var printerInfo = xprinter_util.printerData(sale1_obj, sale2_arr, sale3_arr, ggyContent);
	//初始化打印机
	var command = esc.jpPrinter.createNew();
	command.init();
	//打印格式
	command.formString(printerInfo, printer_poscs, print);
	//写入打印记录表
	xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, sale1_obj.SALETIME, command.getData());

	let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
	let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
	// 电子发票二维码不为空、小票结尾二维码不为空
	if (is_dzfpewmdz || is_xpewm) {
		//生成属于单号的二维码
		Promise.all([
			xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
				that.qrCodeWidth, that.qrCodeHeight),
			//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
			//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
			xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
		]).then(res => {
			console.log("开始发送打印命令");
			prepareSend(command.getData()); //发送数据
		}).catch(reason => {
			console.log('bluePrinter reject failed reason', reason)
			prepareSend(command.getData()); //发送数据
		})
	} else {
		prepareSend(command.getData()); //发送数据
	}
	console.log("打印格式记录结束");
}

//重新打印
export const againPrinter: async function(xsBill) {
	var that = this;
	//xsBill = that.bill_printer;
	console.log("重打单号:", xsBill)
	if (xsBill == "" || xsBill == null) {
		uni.showToast({
			icon: 'error',
			title: "重打单号为空"
		})
		return;
	}
	//通过单号，查询重打格式数据
	let pos_xsbillprint = await xprinter_util.getBillPrinterData(xsBill);
	//console.log("pos_xsbillprint",pos_xsbillprint);	
	if (pos_xsbillprint == "" || pos_xsbillprint == null) {

		util.simpleMsg("未查询到重打数据", "none");
		return;
	}

	//查询终端参数
	var poscsData = await xprinter_util.getPOSCS(getApp().globalData.store.POSCSZID);
	var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
	console.log("查询终端参数", printer_poscs);

	// 通过终端参数，Y 打印小票
	if (printer_poscs.YN_YXDY != "Y") {
		util.simpleMsg("未查询到重打数据", "none");
		console.log("终端参数未设置打印小票");
		return;
	}

	//初始化打印机
	var command = esc.jpPrinter.createNew();
	command.addContent(pos_xsbillprint);

	let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
	let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
	console.log("is_dzfpewmdz", is_dzfpewmdz)
	console.log("is_xpewm", is_xpewm)
	// 电子发票二维码不为空，则打印二维码
	if (is_dzfpewmdz || is_xpewm) {
		//生成属于单号的二维码
		Promise.all([
			xprinter_util.qrCodeGenerate(is_dzfpewmdz, xsBill, printer_poscs.DZFPEWMDZ, that
				.qrCodeWidth, that.qrCodeHeight),
			//that.gzhQrCodeGenerate(is_xpewm,getApp().globalData.BLEInformation.printerFile + printer_poscs.XPEWM),
			//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
			xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
		]).then(res => {
			console.log("开始发送打印命令");
			prepareSend(command.getData()); //发送数据
		}).catch(reason => {
			console.log('againPrinter reject failed reason', reason)
			prepareSend(command.getData()); //发送数据
		})
	} else {
		//不打印二维码
		prepareSend(command.getData()); //发送数据
	}
}


//准备发送，根据每次发送字节数来处理分包数量
export const prepareSend: function(buff) {
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
	Send(buff);
}


export const Send = function(buff) {
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
		deviceId: getApp().globalData.BLEInformation.deviceId,
		serviceId: getApp().globalData.BLEInformation.writeServiceId,
		characteristicId: getApp().globalData.BLEInformation.writeCharaterId,
		value: buf,
		success: function(res) {
			if (currentTime <= loopTime) {

			} else {
				util.simpleMsg("已打印第" + currentPrint + "张成功", "none");
			} //console.log(res)
		},
		fail: function(e) {
			util.simpleMsg("已打印第" + currentPrint + "张成功", "none");
		},
		complete: function() {
			currentTime++;

			if (currentTime <= loopTime) {
				that.setData({
					currentTime: currentTime
				});
				Send(buff);
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
					Send(buff);
				}
			}
		}
	});
}