import db from '@/utils/db/db_excute.js';
import qrCode from '@/utils/xprinter/weapp-qrcode.js';

const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(
		':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};

function formatDate (date){
	// debugger
	let dateNew = new Date(date);
	const year = dateNew.getFullYear();
	const month = dateNew.getMonth() + 1;
	const day = dateNew.getDate();
	//yyyy-MM-dd HH:mm:ss
	return year + '-' + month + '-' + day;
}

function formatDateNew (date){
	try{
		let dateNew = new Date(date.replace(/-/g,'/'));
		const year = dateNew.getFullYear();
		const month = dateNew.getMonth() + 1;
		const day = dateNew.getDate();
		//yyyy-MM-dd HH:mm:ss
		return year + '/' + month + '/' + day;
	}catch(e){
		console.log("formatDateNew err",e)
	}
	return "";
}

function getTime(type) {
	let date = new Date(),
		currentDate,
		currentTime,
		seperator = "-", // 如果想要其他格式 只需 修改这里 
		year = date.getFullYear(),
		month = date.getMonth() + 1,
		weex = date.getDay(),
		day = date.getDate(),
		hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
		minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
		second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	month >= 1 && month <= 9 ? (month = "0" + month) : "";
	day >= 0 && day <= 9 ? (day = "0" + day) : "";
	//当前 日期
	currentDate = year + seperator + month + seperator + day;
	//当前 时间
	currentTime = hour + ":" + minute + ":" + second;
	// 输出格式 为 2018-8-27 14:45:33
	// console.log(currentDate +" "+ currentTime);
	if (type == 0) {
		return currentDate
	} else if (type == 1) {
		return currentTime;
	} else if (type == 2) {
		if (weex == 1) {
			return '星期一'
		}
		if (weex == 2) {
			return '星期二'
		}
		if (weex == 3) {
			return '星期三'
		}
		if (weex == 4) {
			return '星期四'
		}
		if (weex == 5) {
			return '星期五'
		}
		if (weex == 6) {
			return '星期六'
		}
		if (weex == 7) {
			return '星期日'
		}
	} else if (type == 10) {
		return weex;
	} else {
		return currentDate + " " + currentTime;
	}
}

// 获取字节的个数
function getComputedByteLen(content, totalleng) {
	let contentLength = content.replace(/[^\x00-\xff]/g, '01').length;
	let data = "";
	let nbspStr = "";
	//如果长度超出最大占位，则截取字符显示
	if (contentLength > totalleng) {
		data = content.substr(0, totalleng / 2).PadRight(totalleng - 1, '\u0020');
	} else {
		data = content;
		let subLength = totalleng - contentLength;
		for (var i = 0; i < subLength; i++) {
			nbspStr += "\u0020";
		}
	}
	return data + nbspStr;
}

//方法一扩展（C#中PadLeft、PadRight）
String.prototype.PadLeft = function(len, charStr) {
	var s = this + '';
	return new Array(len - s.length + 1).join(charStr, '') + s;
}
String.prototype.PadRight = function(len, charStr) {
	var s = this + '';
	return s + new Array(len - s.length + 1).join(charStr, '');
}

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

/**
 * 售卡/售券打印数据转换
 * @param {sale1_obj, sale2_arr, sale3_arr} 传入数据
 */
const sksqPrinterData = (sale1_obj, sale2_arr, sale3_arr, sale6_arr, xsType) => {	
	var billType = sale1_obj.BILL_TYPE; //Z101
	var bill = sale1_obj.BILL;
	var xsBill = sale1_obj.XS_BILL;
	var xsDate = sale1_obj.SALETIME;
	var khName = getApp().globalData.store.NAME;
	var khAddress = getApp().globalData.store.KHAddress;
	var khPhone = getApp().globalData.store.PHONE;
	var posId = snvl(sale1_obj.POSID,"");
	var posUser = snvl(sale1_obj.RYID,"");
	var lineNum = sale2_arr.length;
	var payableAmount = sale1_obj.TNET;
	var discountedAmount = nnvl(sale1_obj.BILLDISC,0);
	var originalAmount = sale1_obj.TNET + nnvl(sale1_obj.BILLDISC,0);
	var cuid = snvl(sale1_obj.CUID,"");
	var hdnet = 0;
	var totalQty = 0;
	var totalPrice = 0;
	
	let sale6_sumQty = 0;
	let sale6_sumNet = 0;
	let failSumQty = 0;
	let failSumNet = 0;
	
	//商品表信息
	var sale2List = [];
	for (var i = 0; i < sale2_arr.length; i++) {
		var sale2_printer = {
			bill: sale2_arr[i].BILL, //主单号
			saleDate: sale2_arr[i].SALEDATE,
			saleTime: sale2_arr[i].SALETIME,
			khid: sale2_arr[i].KHID,
			posId: snvl(sale2_arr[i].POSID,""),
			no: i,
			
			barCode: sale2_arr[i].BARCODE,
			qty: sale2_arr[i].QTY, //数量
			price: sale2_arr[i].PRICE, //单价
			oprice: nnvl(sale2_arr[i].OPRICE,0), //原价
			amount: nnvl(sale2_arr[i].NET, 0), //金额
			discount: nnvl(sale2_arr[i].DISCRATE, 0), //总折扣额
			originalNet: nnvl(sale2_arr[i].OPRICE,0) * sale2_arr[i].QTY,
		};
		sale2List = sale2List.concat(sale2_printer);
		totalQty += sale2_arr[i].QTY;
		totalPrice += nnvl(sale2_arr[i].OPRICE,0) * nnvl(sale2_arr[i].QTY,1);
	}
	
	console.log("sale02List 转换后数据:", sale2List);

	//支付数据
	var sale3List = [];
	var payTotal = 0.00;
	for (var j = 0; j < sale3_arr.length; j++) {
		var sale3_printer = {
			bill: sale3_arr[j].BILL,
			saleDate: sale3_arr[j].SALEDATE,
			saleTime: sale3_arr[j].SALETIME,
			khid: snvl(sale3_arr[j].KHID,""),
			posId: snvl(sale3_arr[j].POSID,""),
			no: sale3_arr[j].NO, //付款序号
			fkid: sale3_arr[j].FKID, //付款类型id
			amt: parseFloat(sale3_arr[j].AMT), //付款金额
			id: sale3_arr[j].ID, //卡号或者券号
			ryid: snvl(sale3_arr[j].RYID,""), //人员
			disc: sale3_arr[j].DISC, //折扣金额
			zklx: snvl(sale3_arr[j].ZKLX,""), //折扣类型
			idType: sale3_arr[j].IDTYPE, //卡类型
			fkName: snvl(sale3_arr[j].SNAME,""),
			save_je: nnvl(sale3_arr[j].balance,0), // 余额
		};
		sale3List = sale3List.concat(sale3_printer);
		payTotal += parseFloat(sale3_arr[j].AMT);
	}

	console.log("sale3List 转换后数据:", sale3List);
	
	//销售卡券明细
	var sale6List = [];
	for (var j = 0; j < sale6_arr.length; j++) {
		var sale6_printer = {
			bill: sale6_arr[j].BILL,
			saleDate: sale6_arr[j].SALEDATE, //销售日期
			saleTime: sale6_arr[j].SALETIME, //销售时间
			khid: snvl(sale6_arr[j].KHID,""), //门店
			posId: snvl(sale6_arr[j].POSID,""), //收款台
			spid: snvl(sale6_arr[j].SPID,""),
			no: sale6_arr[j].NO, //序号
			
			kqids: snvl(sale6_arr[j].KQIDS,""), //起始卡券号
			kqide: snvl(sale6_arr[j].KQIDE,""), //截止卡券号
									
			kqidstr: snvl(sale6_arr[j].KQIDSTR,""), //卡券范围
			qty: nnvl(sale6_arr[j].QTY,0), //数量
			mystr: nnvl(sale6_arr[j].MYSTR,0),
		};
		sale6_sumQty += nnvl(sale6_arr[j].QTY,0),
		sale6_sumNet += nnvl(sale6_arr[j].MYSTR,0) * nnvl(sale6_arr[j].QTY,0),
		sale6List = sale6List.concat(sale6_printer);
	}
		
	console.log("sale06List 转换后数据:", sale6List);

	var printerInfo = {
		xsType,
		billType,
		bill, //单号
		xsBill, //原单号
		xsDate, //打印时间
		khName, //门店名称
		khAddress, //门店地址
		khPhone, //门店电话
		posId, //款台
		posUser, //收银员
		sale2List, //商品信息
		lineNum, //条目
		payableAmount, //应付金额
		discountedAmount, //已优惠金额
		originalAmount, //原金额
		totalQty, //总数量
		cuid, //会员编号
		hdnet, //商家承担
		sale3List, //支付信息
		sale6List, //销售卡券明细
		sale6_sumQty,
		sale6_sumNet,
		failSumQty,
		failSumNet,
	}
	console.log("打印接收数据转换后 skPrinterData:", printerInfo);
	return printerInfo;
}

/**
 * 打印数据转换
 * @param {sale1_obj, sale2_arr, sale3_arr} 传入数据
 */
const printerData = (sale1_obj, sale2_arr, sale3_arr, ggyContent,type) => {
	var xsType = "XS";
	switch (sale1_obj.XSTYPE) {
		case "0": //外卖单接单
			xsType = "WM";
			break;
		case "1": //销售
			xsType = "XS";
			break;
		case "2": //退单
			xsType = "TD";
			break;
		case "3": //预订
			xsType = "YD";
			break;
		case "4": //预订取消
			xsType = "YDQX";
			break;
		case "5": //预订提取
			xsType = "YDTQ";
			break;
		case "6": //赊销
			xsType = "SX";
			break;
		case "7": //赊销退单
			xsType = "SXTD";
			break;
		case "8": //线上订单提取
			xsType = "XSDDTQ";
			break;
		case "9": //线上订单取消
			xsType = "XSDDQX";
			break;
	}
	var billType = sale1_obj.BILL_TYPE; //Z101
	var bill = sale1_obj.BILL;
	var xsBill = sale1_obj.XS_BILL;
	var xsDate = sale1_obj.SALETIME;
	var khName = getApp().globalData.store.NAME;
	var khAddress = getApp().globalData.store.KHAddress;
	var khPhone = getApp().globalData.store.PHONE;
	var posId = snvl(sale1_obj.POSID,"");
	var posUser = snvl(sale1_obj.RYID,"");
	var lineNum = sale2_arr.length;
	var payableAmount = sale1_obj.TNET;
	var discountedAmount = nnvl(sale1_obj.BILLDISC,0);
	//var originalAmount = nnvl(sale1_obj.ZNET,0) + discountedAmount;
	var originalAmount = 0;
	var cuid = snvl(sale1_obj.CUID,"");
	var hdnet = 0;
	var ggy = ggyContent;
	var totalQty = 0;
	var totalPrice = 0;
	//商品数据
	var goodsList = [];
	for (var i = 0; i < sale2_arr.length; i++) {
		var sale2_printer = {
			bill: sale2_arr[i].BILL, //主单号
			saleDate: sale2_arr[i].SALEDATE,
			saleTime: sale2_arr[i].SALETIME,
			khid: sale2_arr[i].KHID,
			posId: snvl(sale2_arr[i].POSID,""),
			no: i,
			plid: snvl(sale2_arr[i].PLID,""),
			barCode: sale2_arr[i].BARCODE,
			unit: snvl(sale2_arr[i].UNIT,""), //单位

			spid: sale2_arr[i].SPID, //商品编码
			spname: snvl(sale2_arr[i].SNAME,""), //商品名称
			qty: sale2_arr[i].QTY, //数量
			price: sale2_arr[i].PRICE, //单价
			oprice: nnvl(sale2_arr[i].OPRICE,0), //原价
			amount: nnvl(sale2_arr[i].NET, 0), //金额
			discount: nnvl(sale2_arr[i].DISCRATE, 0), //总折扣额
			originalNet: nnvl(sale2_arr[i].OPRICE,0) * sale2_arr[i].QTY,
		};
		goodsList = goodsList.concat(sale2_printer);
		totalQty += sale2_arr[i].QTY;
		totalPrice += nnvl(sale2_arr[i].OPRICE,0) * nnvl(sale2_arr[i].QTY,1);
	}
	
	originalAmount = totalPrice; //原金额，重新通过商品列表获取赋值
	console.log("goodsList 转换后数据:", goodsList);

	//支付数据
	var sale3List = [];
	for (var j = 0; j < sale3_arr.length; j++) {
		var sale3_printer = {
			bill: sale3_arr[j].BILL,
			saleDate: sale3_arr[j].SALEDATE,
			saleTime: sale3_arr[j].SALETIME,
			khid: snvl(sale3_arr[j].KHID,""),
			posId: snvl(sale3_arr[j].POSID,""),
			no: sale3_arr[j].NO, //付款序号
			fkid: sale3_arr[j].FKID, //付款类型id
			amt: parseFloat(sale3_arr[j].AMT), //付款金额
			id: sale3_arr[j].ID, //卡号或者券号
			ryid: snvl(sale3_arr[j].RYID,""), //人员
			disc: sale3_arr[j].DISC, //折扣金额
			zklx: snvl(sale3_arr[j].ZKLX,""), //折扣类型
			idType: sale3_arr[j].IDTYPE, //卡类型
			fkName: snvl(sale3_arr[j].SNAME,""),
			save_je: nnvl(sale3_arr[j].balance,0), // 余额
		};
		sale3List = sale3List.concat(sale3_printer);
	}

	console.log("sale3List 转换后数据:", sale3List);

	var printerInfo = {
		xsType, //销售、退单、预订、预订提取、预订取消、赊销、赊销退单、线上订单、外卖；
		billType,
		bill, //单号
		xsBill, //原单号
		xsDate, //打印时间
		khName, //门店名称
		khAddress, //门店地址
		khPhone, //门店电话
		posId, //款台
		posUser, //收银员
		goodsList, //商品集合
		lineNum, //条目
		payableAmount, //应付金额
		discountedAmount, //已优惠金额
		originalAmount, //原金额
		totalQty, //总数量
		cuid, //会员编号
		hdnet, //商家承担
		sale3List, //支付信息
		ggy, //广告语
	}
	console.log("打印接收数据转换后 printerInfo:", printerInfo);

	return printerInfo;
}

/**
 * 赊销打印数据转换
 * @param {sale1_obj, sale2_arr, sale3_arr} 传入数据
 */
const sxPrinterData = (sale1_obj, sale2_arr, sale3_arr, print, ggyContent,type) => {
	var xsType = "SX";
	switch (sale1_obj.XSTYPE) {
		case "0": //外卖单接单
			xsType = "WM";
			break;
		case "1": //销售
			xsType = "XS";
			break;
		case "2": //退单
			xsType = "TD";
			break;
		case "3": //预订
			xsType = "YD";
			break;
		case "4": //预订取消
			xsType = "YDQX";
			break;
		case "5": //预订提取
			xsType = "YDTQ";
			break;
		case "6": //赊销
			xsType = "SX";
			break;
		case "7": //赊销退单
			xsType = "SXTD";
			break;
		case "8": //线上订单提取
			xsType = "XSDDTQ";
			break;
		case "9": //线上订单取消
			xsType = "XSDDQX";
			break;
	}
	var billType = sale1_obj.BILL_TYPE; //Z101
	var bill = sale1_obj.BILL;
	var xsBill = sale1_obj.XS_BILL;
	var xsDate = sale1_obj.SALETIME;
	var khName = getApp().globalData.store.NAME;
	var khAddress = getApp().globalData.store.KHAddress;
	var khPhone = getApp().globalData.store.PHONE;
	var posId = snvl(sale1_obj.POSID,"");
	var posUser = snvl(sale1_obj.RYID,"");
	var lineNum = sale2_arr.length;
	var payableAmount = sale1_obj.TNET;
	var discountedAmount = nnvl(sale1_obj.BILLDISC,0);
	//var originalAmount = nnvl(sale1_obj.ZNET,0) + discountedAmount;
	var originalAmount = 0;
	var cuid = snvl(sale1_obj.CUID,"");
	var hdnet = 0;
	var ggy = ggyContent;
	var totalQty = 0;
	var totalPrice = 0;
	var dnet = nnvl(sale1_obj.DNET,0); //定金
    var dkhName = "";
	
	//商品数据
	var goodsList = [];
	for (var i = 0; i < sale2_arr.length; i++) {
		var sale2_printer = {
			bill: sale2_arr[i].BILL, //主单号
			saleDate: sale2_arr[i].SALEDATE,
			saleTime: sale2_arr[i].SALETIME,
			khid: sale2_arr[i].KHID,
			posId: snvl(sale2_arr[i].POSID,""),
			no: i,
			plid: snvl(sale2_arr[i].PLID,""),
			barCode: sale2_arr[i].BARCODE,
			unit: snvl(sale2_arr[i].UNIT,""), //单位

			spid: sale2_arr[i].SPID, //商品编码
			spname: snvl(sale2_arr[i].SNAME,""), //商品名称
			qty: sale2_arr[i].QTY, //数量
			price: sale2_arr[i].PRICE, //单价
			oprice: nnvl(sale2_arr[i].OPRICE,0), //原价
			amount: nnvl(sale2_arr[i].NET, 0), //金额
			discount: nnvl(sale2_arr[i].DISCRATE, 0), //总折扣额
			originalNet: nnvl(sale2_arr[i].OPRICE,0) * sale2_arr[i].QTY,
		};
		goodsList = goodsList.concat(sale2_printer);
		totalQty += nnvl(sale2_arr[i].QTY,1);
		totalPrice += nnvl(sale2_arr[i].OPRICE,0) * nnvl(sale2_arr[i].QTY,1);
	}
	
	originalAmount = totalPrice; //原金额，重新通过商品列表获取赋值
	console.log("goodsList 转换后数据:", goodsList);

	//支付数据
	var sale3List = [];
	for (var j = 0; j < sale3_arr.length; j++) {
		var sale3_printer = {
			bill: sale3_arr[j].BILL,
			saleDate: sale3_arr[j].SALEDATE,
			saleTime: sale3_arr[j].SALETIME,
			khid: snvl(sale3_arr[j].KHID,""),
			posId: snvl(sale3_arr[j].POSID,""),
			no: sale3_arr[j].NO, //付款序号
			fkid: sale3_arr[j].FKID, //付款类型id
			amt: parseFloat(sale3_arr[j].AMT), //付款金额
			id: sale3_arr[j].ID, //卡号或者券号
			ryid: snvl(sale3_arr[j].RYID,""), //人员
			disc: sale3_arr[j].DISC, //折扣金额
			zklx: snvl(sale3_arr[j].ZKLX,""), //折扣类型
			idType: sale3_arr[j].IDTYPE, //卡类型
			fkName: snvl(sale3_arr[j].SNAME,""),
			save_je: nnvl(sale3_arr[j].balance,0), // 余额
		};
		sale3List = sale3List.concat(sale3_printer);
	}

	console.log("sale3List 转换后数据:", sale3List);

	let printerNum = 1;
	if(print != null){
		printerNum = nnvl(print.PRINTNUM,1);
		dkhName = snvl(print.DKFNAME,"");
	}

	var printerInfo = {
		xsType, //销售、退单、预订、预订提取、预订取消、赊销、赊销退单、线上订单、外卖；
		billType,
		bill, //单号
		xsBill, //原单号
		xsDate, //打印时间
		khName, //门店名称
		khAddress, //门店地址
		khPhone, //门店电话
		posId, //款台
		posUser, //收银员
		goodsList, //商品集合
		lineNum, //条目
		payableAmount, //应付金额
		discountedAmount, //已优惠金额
		originalAmount, //原金额
		totalQty, //总数量
		cuid, //会员编号
		hdnet, //商家承担
		sale3List, //支付信息
		ggy, //广告语
		dnet,
		dkhName, //大客户名称
	}
	console.log("打印接收数据转换后 printerInfo:", printerInfo);

	return printerInfo;
}

/**
 * 赊销结算打印数据转换
 * @param {sale1_obj, sale2_arr, sale3_arr} 传入数据
 */
const sxjsPrinterData = (sale1_obj, sale2_arr, sale3_arr, print, ggyContent) => {
	var xsType = "SXJS";
	
	var bill = sale1_obj.BILL;
	// var xsDate = sale1_obj.DATE_QT;
	var xsDate = getTime(3);
	var khName = getApp().globalData.store.NAME;
	var khAddress = getApp().globalData.store.KHAddress;
	var khPhone = getApp().globalData.store.PHONE;
	var posId = snvl(sale1_obj.POSID,"");
	var posUser = snvl(sale1_obj.RYNAME_LR,"");
	var dkfid = snvl(sale1_obj.DKFID,"");
	var dkfname = snvl(sale1_obj.DKFNAME,"");
	var lineNum = sale2_arr.length;
	var payableAmount = nnvl(sale1_obj.TJSNET,0);
    
	var ggy = ggyContent;
	var totalPrice = 0;
	
	//arr2数据
	var arr2List = [];
	for (var i = 0; i < sale2_arr.length; i++) {
		var sale2_printer = {
			bill: snvl(sale2_arr[i].BILL,""), //单号
			bill_sx: snvl(sale2_arr[i].BILL_SX,""),//BILL_SX
			dnet: nnvl(sale2_arr[i].DNET,0), //待结算额
			jsnet: nnvl(sale2_arr[i].JSNET,0), //本次结算额
			no: i,
		};
		arr2List = arr2List.concat(sale2_printer);
		totalPrice += nnvl(sale2_arr[i].JSNET,0);
	}
	
	var originalAmount = totalPrice; //原金额，重新通过商品列表获取赋值
	console.log("arr2List 转换后数据:", arr2List);

	//支付数据
	var sale3List = [];
	for (var j = 0; j < sale3_arr.length; j++) {
		var sale3_printer = {
			bill: sale3_arr[j].BILL,
			saleTime: sale3_arr[j].JK_DATE,
			no: sale3_arr[j].NO, //付款序号
			fkid: sale3_arr[j].FKID, //付款类型id
			fkName: snvl(sale3_arr[j].SNAME,""),
			amt: parseFloat(sale3_arr[j].AMT), //付款金额
			disc: nnvl(sale3_arr[j].DISC,0), //折扣金额
			zklx: snvl(sale3_arr[j].ZKLX,""), //折扣类型
			save_je: nnvl(sale3_arr[j].balance,0), // 余额
		};
		sale3List = sale3List.concat(sale3_printer);
	}

	console.log("sale3List 转换后数据:", sale3List);

	let printerNum = 1;
	if(print != null){
		printerNum = nnvl(print.PRINTNUM,1);
	}

	var printerInfo = {
		xsType, //销售、退单、预订、预订提取、预订取消、赊销、赊销退单、线上订单、外卖；
		bill,
		xsDate,
		khName,
		khAddress,
		khPhone,
		posId,
		posUser,
		dkfid,
		dkfname,
		lineNum,
		payableAmount,
		ggy,
		arr2List,
		sale3List,
		printerNum,
	}
	console.log("打印接收数据转换后 printerInfo:", printerInfo);

	return printerInfo;
}

/**
 * 外卖打印数据转换
 * @param {sale1_obj, sale2_arr, sale3_arr} 传入数据
 */
const wmPrinterData = (sale1_obj, sale2_arr, ggyContent, type,bs_Reason,bs_Note,new_bill) => {
	var xsType = "WM";
	var bill = sale1_obj.BILL;
	var wdate = sale1_obj.WDATE;
	var wtime = sale1_obj.WTIME;
	var xsBill = sale1_obj.XS_BILL;
	var custmtime = snvl(sale1_obj.CUSTMTIME,"");
	var daysn = snvl(sale1_obj.DAYSN,"");
	var khName = getApp().globalData.store.NAME;
	var khAddress = getApp().globalData.store.KHAddress;
	var khPhone = getApp().globalData.store.PHONE;
	var gsid = snvl(sale1_obj.GSID,"");
	var status = nnvl(sale1_obj.STATUS,0);
	var remark = snvl(sale1_obj.STR1,"");
	var payableAmount = sale1_obj.STR2;
	var originalAmount = nnvl(sale1_obj.STR8,0);
	var shAddress = snvl(sale1_obj.STR4,"");
	var shPhone = snvl(sale1_obj.STR6,"");
	var shContact = snvl(sale1_obj.STR5,"");
	var ggy = ggyContent;
	var xsptid = sale1_obj.XSPTID;
	var nowTime = getTime(3);
	var posId = snvl(sale1_obj.POSID,"");
	var note2 = snvl(sale1_obj.NOTE2,""); //平台名称。如美团外卖
	
	var bsReason = "";
	var bsNote = "";
	var newBill="";
	if(type == "WMTHBS"){
		bsReason = bs_Reason;
		bsNote = bs_Note;
		newBill = new_bill;
	}else if(type == "WM"){
		newBill = new_bill;
	}
	var wmType = type;

	//商品数据
	var goodsList = [];
	for (var i = 0; i < sale2_arr.length; i++) {
		var sale2_printer = {
			bill: sale2_arr[i].BILL, //主单号
			spid: sale2_arr[i].SPID, //商品编码
			spname: sale2_arr[i].STR5, //商品名称
			qty: sale2_arr[i].QTY, //商品数量
			price: sale2_arr[i].PRICE, //商品价格
			oprice: sale2_arr[i].OPRICE, //原价
			net: nnvl(sale2_arr[i].NET,0), //商品金额
			unit: snvl(sale2_arr[i].STR7,""), //商品单位
			pack: sale2_arr[i].PACK, //外卖预订单商品数量
			bqty: nnvl(sale2_arr[i].BQTY,0),
		};
		goodsList = goodsList.concat(sale2_printer);
	}
	console.log("goodsList 转换后数据:", goodsList);

	//支付数据
	var sale3List = [];

	var printerInfo = {
		xsType,
		bill, //单号
		xsBill, //原单号
		wdate,
		wtime,
		custmtime,
		daysn,
		khName, //门店名称
		khAddress, //门店地址
		khPhone, //门店电话	
		gsid,
		status, //'12', '请接单', '15', '取消订单', '33', '退货订单', '30', '申请退货', '20', '申请取消', '其他'
		remark,

		goodsList, //商品集合

		payableAmount, //应付金额
		originalAmount, //原金额
		shAddress, //收货地址
		shPhone, //收货联系电话
		shContact, // 收货联系人
		sale3List, //支付信息
		ggy, //广告语
		xsptid,
		note2,
		wmType,
		bsReason,
		bsNote,
		nowTime, //当前时间
		posId,
		newBill, //新产生的退货单号
	}
	console.log("外卖打印接收数据转换后 printerInfo:", printerInfo);

	return printerInfo;
}

/**
 * 线上订单打印数据转换
 * @param {} 传入数据
 */
const xsPrinterData = (sale1_obj, ggyContent, type) => {
	var xsType = "XSDD";
	var bill = sale1_obj.BILL;
	var ydbill = sale1_obj.YDBILL;
	var date_dh = sale1_obj.DATE_DH;
	var saletime = sale1_obj.SALETIME;
	var thtype = sale1_obj.THTYPE;
	var custmname = snvl(sale1_obj.CUSTMNAME,"");
	var custmaddress = snvl(sale1_obj.CUSTMADDRESS,"");
	var custmphone = snvl(sale1_obj.CUSTMPHONE,"");
	var custmcomm = snvl(sale1_obj.CUSTMCOMM,"");

	var spid = sale1_obj.SPID;
	var sname = sale1_obj.SNAME;
	var price = sale1_obj.PRICE;
	var ggy = ggyContent;

	xsType = type;
	let dateNow = getTime(3);

	var printerInfo = {
		xsType,
		bill,
		ydbill,
		date_dh,
		saletime,
		thtype,
		custmname,
		custmaddress,
		custmphone,
		custmcomm,
		spid,
		sname,
		price,
		ggy,
		dateNow,
	}
	console.log("线上订单打印接收数据转换后 printerInfo:", printerInfo);
	return printerInfo;
}

/**
 * 打印数据转换
 * @param {sale1_obj, sale2_arr, sale3_arr} 传入数据
 */
const ydPrinterData = (sale1_obj, sale2_arr, sale3_arr,ydsale001, ggyContent) => {
	var xsType = "YD";
	switch (sale1_obj.XSTYPE) {
		case "0": //外卖单接单
			xsType = "WM";
			break;
		case "1": //销售
			xsType = "XS";
			break;
		case "2": //退单
			xsType = "TD";
			break;
		case "3": //预订
			xsType = "YD";
			break;
		case "4": //预订取消
			xsType = "YDQX";
			break;
		case "5": //预订提取
			xsType = "YDTQ";
			break;
		case "6": //赊销
			xsType = "SX";
			break;
		case "7": //赊销退单
			xsType = "SXTD";
			break;
		case "8": //线上订单提取
			xsType = "XSDD";
			break;
		case "9": //线上订单取消
			xsType = "XSDDQX";
			break;
	}
	var billType = sale1_obj.BILL_TYPE; //Z101
	var bill = sale1_obj.BILL;
	var xsBill = sale1_obj.XS_BILL;
	var xsDate = sale1_obj.SALETIME;
	var khName = getApp().globalData.store.NAME;
	var khAddress = getApp().globalData.store.KHAddress;
	var khPhone = getApp().globalData.store.PHONE;
	var posId = snvl(sale1_obj.POSID,"");
	var posUser = snvl(sale1_obj.RYID,"");
	var lineNum = sale2_arr.length;
	var payableAmount = sale1_obj.TNET;
	var discountedAmount = nnvl(sale1_obj.BILLDISC,0);
	//var originalAmount = nnvl(sale1_obj.ZNET,0) + discountedAmount;
	var originalAmount = 0;
	var cuid = snvl(sale1_obj.CUID,"");
	var hdnet = 0;
	var ggy = ggyContent;
	var totalQty = 0;
	var totalPrice = 0;
	
	//商品数据
	var goodsList = [];
	for (var i = 0; i < sale2_arr.length; i++) {
		var sale2_printer = {
			bill: sale2_arr[i].BILL, //主单号
			saleDate: sale2_arr[i].SALEDATE,
			saleTime: sale2_arr[i].SALETIME,
			khid: sale2_arr[i].KHID,
			posId: snvl(sale2_arr[i].POSID,""),
			no: i,
			plid: snvl(sale2_arr[i].PLID,""),
			barCode: sale2_arr[i].BARCODE,
			unit: snvl(sale2_arr[i].UNIT,""), //单位

			spid: sale2_arr[i].SPID, //商品编码
			spname: snvl(sale2_arr[i].SNAME,""), //商品名称
			qty: sale2_arr[i].QTY, //数量
			price: sale2_arr[i].PRICE, //单价
			oprice: sale2_arr[i].OPRICE, //原价
			amount: nnvl(sale2_arr[i].NET, 0), //金额
			discount: nnvl(sale2_arr[i].DISCRATE, 0), //总折扣额
			originalNet: nnvl(sale2_arr[i].OPRICE,0) * sale2_arr[i].QTY,	
		};
		goodsList = goodsList.concat(sale2_printer);
		totalQty += nnvl(sale2_arr[i].QTY,1);
		totalPrice += nnvl(sale2_arr[i].OPRICE,0) * nnvl(sale2_arr[i].QTY,1);
	}
	originalAmount = totalPrice; //原金额，重新通过商品列表获取赋值
	console.log("goodsList 转换后数据:", goodsList);

	//支付数据
	var sale3List = [];
	for (var j = 0; j < sale3_arr.length; j++) {
		var sale3_printer = {
			bill: sale3_arr[j].BILL,
			saleDate: sale3_arr[j].SALEDATE,
			saleTime: sale3_arr[j].SALETIME,
			khid: snvl(sale3_arr[j].KHID,""),
			posId: snvl(sale3_arr[j].POSID,""),
			no: sale3_arr[j].NO, //付款序号
			fkid: sale3_arr[j].FKID, //付款类型id
			amt: parseFloat(sale3_arr[j].AMT), //付款金额
			id: sale3_arr[j].ID, //卡号或者券号
			ryid: snvl(sale3_arr[j].RYID,""), //人员
			disc: sale3_arr[j].DISC, //折扣金额
			zklx: snvl(sale3_arr[j].ZKLX,""), //折扣类型
			idType: sale3_arr[j].IDTYPE, //卡类型
			fkName: snvl(sale3_arr[j].SNAME,""),
			save_je: nnvl(sale3_arr[j].balance,0), // 余额
		};
		sale3List = sale3List.concat(sale3_printer);
	}

	console.log("sale3List 转换后数据:", sale3List);
	
	var qknet = Math.round((nnvl(originalAmount,0) - nnvl(payableAmount,0) - nnvl(discountedAmount,0))*100)/100;
	var dnet = nnvl(sale1_obj.DNET,0);
	var custmname = snvl(ydsale001.CUSTMNAME,"");
	var custmphone = snvl(ydsale001.CUSTMPHONE,"");
	var thdate = snvl(ydsale001.THDATE,"");
	var custmcomm = snvl(ydsale001.CUSTMCOMM,"");;
	var thkhid = snvl(ydsale001.THKHID,"");;
	var custmaddress = snvl(ydsale001.CUSTMADDRESS,"");

	var printerInfo = {
		xsType, //销售、退单、预订、预订提取、预订取消、赊销、赊销退单、线上订单、外卖；
		billType,
		bill, //单号
		xsBill, //原单号
		xsDate, //打印时间
		khName, //门店名称
		khAddress, //门店地址
		khPhone, //门店电话
		posId, //款台
		posUser, //收银员
		goodsList, //商品集合
		lineNum, //条目
		payableAmount, //应付金额
		discountedAmount, //已优惠金额
		originalAmount, //原金额
		totalQty, //总数量
		cuid, //会员编号
		hdnet, //商家承担
		sale3List, //支付信息
		ggy, //广告语
		
		qknet,//欠款
		dnet,//定金金额
		custmname,//客户名称
		custmphone,//客户电话
		thdate,//要求提货日期
		custmcomm,//客户要求
		thkhid,//要求提货门店	
		custmaddress,//送货地址
	}
	console.log("打印接收数据转换后 printerInfo:", printerInfo);

	return printerInfo;
}

/**
 * 只显示后几位 *********** 0222
 * @param {value} 传入数据
 */
const onlyFourBank = (value) => {
	if (value && value.length > 8) {
		return `${"*".repeat(value.length - 8)}${value.length % 6 ? " " : ""}${value.slice(-6)}`;
	}
	return value;
}

/**
 * 手机号中间四位隐藏
 * @param {value} 传入数据
 */
const onlyFourPhone = (value) => {
	if (value && value.length > 4) {
		let reg = /^(.{3}).*(.{4})$/
		value = value.replace(reg, '$1****$2')
	}
	return value;
}

// 添加打印记录
const addPos_XsBillPrintData = (xsBill, xsDate, billStr) => {
	let execSql_arr = ['insert into POS_XSBILLPRINT (XSBILL,XSDATE,BILLSTR) values ("' + xsBill + '","' + xsDate +
		'","' + billStr + '")'
	];
	db.get().executeDml(execSql_arr, "执行中", function(res) {
		console.log("POS_XSBILLPRINT sql执行结果：", res);
	}, function(err) {
		console.log("POS_XSBILLPRINT sql执行失败：", err);
	});
}

const addContent = function(content) {
	var contentArr = content.split(',');
	let arrNew = [];
	contentArr.forEach(function(item, index) {
		item = parseInt(item);
		arrNew.push(item);
	})
	return arrNew;
}

/**
 * 查询终端参数
 * @param {parmid 参数组id} 
 */
const getPOSCS = async (parmid) => {
	let poscs = [];
	let execSql_arr =
		"SELECT D1.SNAME,P1.POSCS,P1.POSCSNR FROM POSCSZMX P1 ,DAPZCS_NR D1 WHERE D1.ID ='POSCS' AND D1.ID_NR = P1.POSCS AND P1.POSCSZID ='" +
		parmid + "' ORDER BY  P1.SZ";
	await db.get().executeQry(execSql_arr, "执行中", function(res) {
		console.log(parmid + "POSCS sql执行结果：", res.msg);
		poscs = res.msg;
	}, function(err) {
		console.log("POSCS sql执行失败：", err);
	});
	return poscs;
}

/**
 * 终端参数
 * @param {poscsData} 
 */
const commonPOSCS = async (poscsData) => {
	let poscs = "";
	var YN_YXDY = ""; //是否打印小票 ，N不调用打印逻辑；
	var YN_DYFP = ""; //是否打印发票，使用黑标发票纸的维护Y，Ipad收银 统一N；
	var DYJZF = ""; //小票打印机字符，32对应58mm宽的纸，40-对应80mm宽纸，iPad连的蓝牙打印机 统一推荐使用40参数；
	var XPZZHS = ""; //小票走纸行数，打印完小票内容后，再走几行空白纸，一般仟吉维护0，取参数值走纸；
	var HYY = ""; //小票欢迎语，维护文本内容
	var XPLOGO = ""; //票抬头logo，通过参数内容 logo.jpg 取对应图片文件打印到小票顶部作为商户logo；
	var XPEWM = ""; //票结尾二维码，内容维护 二维码图片名称，png格式；取对应图片文件打印，取不到时不打且不能占位；
	var DZFPEWMDZ = ""; //电子发票二维码地址，前端生成发票开票二维码，打印在小票底部
	var YN_CALLNUM = ""; //水吧产品叫号 ，维护Y的时候 ，支付前 收银员手工录入水吧叫号的号码，小票顶部打印这个号码
	var SBLBBM = "";
	var YN_DYDZFPEWM = ""; //是否打印电子发票二维码

	var obj1 = poscsData;
	var YN_YXDY_obj = obj1.filter(item => {
		if (item.POSCS == "YN_YXDY") {
			return item.POSCSNR;
		}
	});
	if (YN_YXDY_obj.length > 0) {
		YN_YXDY = YN_YXDY_obj[0].POSCSNR;
	}

	var obj2 = poscsData;
	var YN_DYFP_obj = obj2.filter(item => {
		if (item.POSCS == "YN_DYFP") {
			return item.POSCSNR;
		}
	});
	if (YN_DYFP_obj.length > 0) {
		YN_DYFP = YN_DYFP_obj[0].POSCSNR;
	}

	var obj3 = poscsData;
	var DYJZF_obj = obj3.filter(item => {
		if (item.POSCS == "DYJZF") {
			return item.POSCSNR;
		}
	});
	if (DYJZF_obj.length > 0) {
		DYJZF = DYJZF_obj[0].POSCSNR;
	}

	var obj4 = poscsData;
	var XPZZHS_obj = obj4.filter(item => {
		if (item.POSCS == "XPZZHS") {
			return item.POSCSNR;
		}
	});
	if (XPZZHS_obj.length > 0) {
		XPZZHS = XPZZHS_obj[0].POSCSNR;
	}

	var obj5 = poscsData;
	var HYY_obj = obj5.filter(item => {
		if (item.POSCS == "HYY") {
			return item.POSCSNR;
		}
	});
	if (HYY_obj.length > 0) {
		HYY = HYY_obj[0].POSCSNR;
	}

	var obj6 = poscsData;
	var XPLOGO_obj = obj6.filter(item => {
		if (item.POSCS == "XPLOGO") {
			return item.POSCSNR;
		}
	});
	if (XPLOGO_obj.length > 0) {
		XPLOGO = XPLOGO_obj[0].POSCSNR;
	}

	var obj7 = poscsData;
	var XPEWM_obj = obj7.filter(item => {
		if (item.POSCS == "XPEWM") {
			return item.POSCSNR;
		}
	});
	if (XPEWM_obj.length > 0) {
		XPEWM = XPEWM_obj[0].POSCSNR;
	}

	var obj8 = poscsData;
	var DZFPEWMDZ_obj = obj8.filter(item => {
		if (item.POSCS == "DZFPEWMDZ") {
			return item.POSCSNR;
		}
	});
	if (DZFPEWMDZ_obj.length > 0) {
		DZFPEWMDZ = DZFPEWMDZ_obj[0].POSCSNR;
	}

	var obj9 = poscsData;
	var YN_CALLNUM_obj = obj9.filter(item => {
		if (item.POSCS == "YN_CALLNUM") {
			return item.POSCSNR;
		}
	});
	if (YN_CALLNUM_obj.length > 0) {
		YN_CALLNUM = YN_CALLNUM_obj[0].POSCSNR;
	}

	var obj10 = poscsData;
	var SBLBBM_obj = obj10.filter(item => {
		if (item.POSCS == "SBLBBM") {
			return item.POSCSNR;
		}
	});
	if (SBLBBM_obj.length > 0) {
		SBLBBM = SBLBBM_obj[0].POSCSNR;
	}

	var obj11 = poscsData;
	var YN_DYDZFPEWM_obj = obj11.filter(item => {
		if (item.POSCS == "YN_DYDZFPEWM") {
			return item.POSCSNR;
		}
	});
	if (YN_DYDZFPEWM_obj.length > 0) {
		YN_DYDZFPEWM = YN_DYDZFPEWM_obj[0].POSCSNR;
	}

	// console.log("YN_YXDY",YN_YXDY);
	// console.log("SBLBBM",SBLBBM);

	var printer_poscs = {
		YN_YXDY,
		YN_DYFP,
		DYJZF,
		XPZZHS,
		HYY,
		XPLOGO,
		XPEWM,
		DZFPEWMDZ,
		YN_CALLNUM,
		SBLBBM,
		YN_DYDZFPEWM,
	};

	//console.log("commonPOSCS",printer_poscs)
	return printer_poscs;
}

/**
 * 查询打印记录
 * @param {xsBill}  
 */
const getBillPrinterData = async (xsBill) => {
	let billStr = "";
	let sql = "select * from POS_XSBILLPRINT where XSBILL = '" + xsBill + "' order by XSDATE desc";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		console.log("重打数据查询成功", res);
		if(res.msg != null && res.msg != ""){
			billStr = res.msg[0].BILLSTR;
			console.log("重打数据查询成功", res.msg[0].XSBILL);
		}
	}, function(err) {
		console.log("获取打印数据出错:", err);
		uni.showToast({
			icon: 'error',
			title: "获取打印数据出错"
		})
	});
	return billStr;
}

/**
 * 查询打印记录，时间最近的一条记录
 * @param {xsBill}  
 */
const getBillPrinterMax = async () => {
	let xsBill = "";
	let sql = "select * from (select * from POS_XSBILLPRINT order by XSDATE DESC) limit 1";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		//console.log("重打数据查询成功 getBillPrinterMax", res);
		if(res.msg != null && res.msg != ""){
			xsBill = res.msg[0].XSBILL;
			//console.log("重打数据查询成功 getBillPrinterMax", res.msg[0].XSBILL);
		}
	}, function(err) {
		console.log("获取打印数据出错 getBillPrinterMax:", err);
	});
	return xsBill;
}

const groupByOrder = function(array, f) {
	let groups = {};
	array.forEach(function(o) {
		let group = JSON.stringify(f(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	return Object.keys(groups).map(function(group) {
		return groups[group];
	});
}

const groupBy = function(array, callback) {
	return new Promise((resolve) => {
		let groups = {};
		array.forEach(item => {
			let group = JSON.stringify(callback(item));
			groups[group] = groups[group] || [];
			groups[group].push(item);
		});
		let res = Object.keys(groups).map(group => {
			return groups[group];
		});
		resolve(res)
	})
}

const getSum = function(arr, bykey) {
	return new Promise((resolve) => {
		let res = this.groupBy(arr, function(item) {
			return item.fkid
		}).then(res => {
			console.log(res)
			let resultSum = res.map(item => {
				let sum = item.reduce((total, curr) => {
					return total + curr[bykey]
				}, 0);
				return sum
			})
			return resultSum
		})
		resolve(res)
	})
}

/**
 * 打印小票结尾二维码
 * @param {*} command 
 * @param {*} qrCodeWidth 
 * @param {*} qrCodeHeight 
 */
const gzhQrCodeAction = function(is_xpewm, command, qrCodeWidth, qrCodeHeight) {
	return new Promise((resolve, reject) => {
		console.log("3", is_xpewm, qrCodeWidth, qrCodeHeight);
		if (!is_xpewm) {
			resolve('3')
			return;
		}
		//打印小票结尾二维码
		uni.canvasGetImageData({
			canvasId: "canvasXPEWM",
			x: 0,
			y: 0,
			width: qrCodeWidth,
			height: qrCodeHeight,
			success: function(res) {
				console.log("3.获取小票结尾二维码画布数据成功");
				command.setSelectJustification(1); //居中
				command.setBitmap(res);
				command.setPrint();
				resolve(res)
			},
			complete: function(res) {
				console.log("3.小票结尾二维码 finish");
			},
			fail: function(res) {
				console.log("3.获取小票结尾二维码画布数据失败:", res);
				uni.showToast({
					title: "获取小票结尾二维码画布数据失败",
					icon: "none"
				});
			}
		});
	});
}

/**
 * 打印开票二维码
 * @param {*} command 
 * @param {*} qrCodeWidth 
 * @param {*} qrCodeHeight 
 */
const qrCodeAction = function(is_dzfpewmdz, command, qrCodeWidth, qrCodeHeight) {
	return new Promise((resolve, reject) => {
		console.log("4", is_dzfpewmdz);
		if (!is_dzfpewmdz) {
			resolve('4')
			return;
		}
		//打印二维码
		uni.canvasGetImageData({
			canvasId: "couponQrcode",
			x: 0,
			y: 0,
			width: qrCodeWidth,
			height: qrCodeHeight,
			success: function(res) {
				console.log("4.获取开票二维码画布数据成功");
				command.setSelectJustification(1); //居中
				command.setBitmap(res);
				command.setPrint();
				resolve(res)
			},
			complete: function(res) {
				console.log("4.开票二维码 finish");
			},
			fail: function(res) {
				console.log("4.获取开票二维码画布数据失败:", res);
				uni.showToast({
					title: "获取开票二维码画布数据失败",
					icon: "none"
				});
			}
		});
	});
}

/**
 * 生成二维码
 * @param {*} bill 
 * @param {*} qrCodeContent 
 * @param {*} qrCodeWidth 
 * @param {*} qrCodeHeight
 */
const qrCodeGenerate = function(is_dzfpewmdz, bill, qrCodeContent, qrCodeWidth, qrCodeHeight,objQrCode) {
	return new Promise((resolve, reject) => {
		let saleDate = formatDateNew(objQrCode.saledate);
		let qrText = objQrCode.url + "?v=" + objQrCode.v + "&saledate=" + saleDate + "&bill=" + objQrCode.bill + "&khid=" + objQrCode.khid + "&gsid=" +objQrCode.gsid + "&sltype=" +objQrCode.sltype;
		console.log("1.二维码生成内容:", qrText)
		if (!is_dzfpewmdz) {
			resolve('1')
			return;
		}
		new qrCode('couponQrcode', {
			text: qrText,
			width: qrCodeWidth,
			height: qrCodeHeight,
			colorDark: "#000000",
			colorLight: "#FFFFFF",
			correctLevel: qrCode.CorrectLevel.L
		})
		resolve('1')
	});
}

const gzhQrCodeGenerate = function(is_xpewm, url) {
	return new Promise((resolve, reject) => {
		if (!is_xpewm) {
			resolve('2')
			return;
		}
		const ctx_out = uni.createCanvasContext("canvasXPEWM");
		var png = url;
		uni.getImageInfo({
			src: png,
			success(res) {
				//console.log("小票结尾二维码画布宽度" + res.width, "画布高度" + res.height);
				ctx_out.drawImage(png, 0, 0, res.width, res.height);
				ctx_out.draw();
				resolve(res)
			}
		});
		console.log("2.gzhQrCodeGenerate", url);
	});
}

const snvl = function(pb_obj, pm_default) {
	let new_obj = "";
	if (pb_obj == null || pb_obj == "" || pb_obj == undefined) {
		new_obj = pm_default;
	} else {
		new_obj = pb_obj.toString();
	}
	return new_obj;
}

const nnvl = function(pb_obj, pm_default) {
	let new_obj = 0;
	if (pb_obj == null || pb_obj == "" || pb_obj == undefined || pb_obj == NaN) {
		new_obj = pm_default;
	} else {
		try {
			new_obj = parseFloat(pb_obj);
		} catch (e) {
			new_obj = -1;
		}
	}
	return new_obj;
}

const tnvl = function(pb_obj, pm_default) {
	let new_obj = "";
	if (pb_obj == null || pb_obj == "" || pb_obj == undefined) {
		new_obj = pm_default;
	} else {
		new_obj = pb_obj.toFixed(2);
	}
	return new_obj;
}

module.exports = {
	formatTime: formatTime,
	getTime: getTime,
	getComputedByteLen: getComputedByteLen,
	inArray: inArray,
	ab2hex: ab2hex,
	convertToGrayscale: convertToGrayscale,
	adjustPixel: adjustPixel,
	convertToMonoImage: convertToMonoImage,
	printerData: printerData,
	onlyFourBank: onlyFourBank,
	addPos_XsBillPrintData: addPos_XsBillPrintData,
	addContent: addContent,
	getPOSCS: getPOSCS,
	commonPOSCS: commonPOSCS,
	getBillPrinterData: getBillPrinterData,
	getBillPrinterMax: getBillPrinterMax,
	onlyFourPhone: onlyFourPhone,
	groupBy: groupBy,
	getSum: getSum,
	groupByOrder: groupByOrder,
	qrCodeGenerate: qrCodeGenerate,
	gzhQrCodeGenerate: gzhQrCodeGenerate,
	qrCodeAction: qrCodeAction,
	gzhQrCodeAction: gzhQrCodeAction,
	wmPrinterData: wmPrinterData,
	xsPrinterData: xsPrinterData,
	snvl: snvl,
	nnvl: nnvl,
	ydPrinterData: ydPrinterData,
	formatDate: formatDate,
	sxPrinterData: sxPrinterData,
	tnvl: tnvl,
	sxjsPrinterData: sxjsPrinterData,
	formatDateNew: formatDateNew,
	sksqPrinterData: sksqPrinterData,
};
