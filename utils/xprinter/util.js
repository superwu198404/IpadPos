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
 * 打印数据转换
 * @param {sale1_obj, sale2_arr, sale3_arr} 传入数据
 */
const printerData = (sale1_obj, sale2_arr, sale3_arr)=>{
	var xsType = "XS";
	switch(sale1_obj.XSTYPE){
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
	var posId = sale1_obj.POSID;
	var posUser = sale1_obj.RYID;
	var lineNum = sale2_arr.length;
	var totalQty = 0;
	var payableAmount = sale1_obj.TNET;
	var discountedAmount = sale1_obj.BILLDISC;
	var originalAmount = sale1_obj.ZNET;
	
	//商品数据
	var goodsList = [];
	for (var i = 0; i < sale2_arr.length; i++) {
		var sale2_printer = {
			bill: sale2_arr[i].BILL, //主单号
			saleDate: sale2_arr[i].SALEDATE,
			saleTime: sale2_arr[i].SALETIME,
			khid: sale2_arr[i].KHID,
			posId: sale2_arr[i].POSID,
			no: i,
			plid: sale2_arr[i].PLID,
			barCode: sale2_arr[i].BARCODE,
			unit: sale2_arr[i].UNIT, //单位
	
			spid: sale2_arr[i].SPID, //商品编码
			spname: sale2_arr[i].SNAME, //商品名称
			qty: sale2_arr[i].QTY, //数量
			price: sale2_arr[i].PRICE, //单价
			amount: sale2_arr[i].NET, //金额
			discount: sale2_arr[i].DISCRATE, //总折扣额
		};
		goodsList = goodsList.concat(sale2_printer);
		totalQty += sale2_arr[i].QTY;
	}
	
	console.log("goodsList 转换后数据:", goodsList);
	
	//支付数据
	var sale3List = [];
	for (var j = 0; j < sale3_arr.length; j++) {
		var sale3_printer = {
			bill: sale3_arr[j].BILL,
			saleDate: sale3_arr[j].SALEDATE,
			saleTime: sale3_arr[j].SALETIME,
			khid: sale3_arr[j].KHID,
			posId: sale3_arr[j].POSID,
			no: sale3_arr[j].NO, //付款序号
			fkid: sale3_arr[j].FKID, //付款类型id
			amt: parseFloat(sale3_arr[j].AMT), //付款金额
			id: sale3_arr[j].ID, //卡号或者券号
			ryid: sale3_arr[j].RYID, //人员
			disc: sale3_arr[j].DISC, //折扣金额
			zklx: sale3_arr[j].ZKLX, //折扣类型
			idType: sale3_arr[j].IDTYPE, //卡类型
			fkName: sale3_arr[j].SNAME,
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
		posId, //款台
		posUser, //收银员
		goodsList, //商品集合
		lineNum, //条目
		payableAmount, //应付金额
		discountedAmount, //已优惠金额
		originalAmount, //原金额
		totalQty, //总数量
		sale3List, //支付信息
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

// 添加打印记录
const addPos_XsBillPrintData = (xsBill, xsDate, billStr) => {
	let execSql_arr = ['insert into POS_XSBILLPRINT (XSBILL,XSDATE,BILLSTR) values ("' + xsBill + '","' + xsDate +'","' + billStr + '")'];
    db.get().executeDml(execSql_arr, "执行中", function(res) {
		console.log("POS_XSBILLPRINT sql执行结果：", res);
	}, function(err) {
		console.log("POS_XSBILLPRINT sql执行失败：", err);
	});	
}

const addContent = function(content){
    var contentArr = content.split(',');
	let arrNew = [];
	contentArr.forEach(function(item, index) {
		item = parseInt(item);
		arrNew.push(item);
	})
	return arrNew;
}

// 二维码生成工具
const couponQrCode = async function(bill,qrCodeContent,qrCodeWidth,qrCodeHeight) {
    await new qrCode('couponQrcode', {
		text: qrCodeContent,
		width: qrCodeWidth,
		height: qrCodeHeight,
		colorDark: "#333333",
		colorLight: "#FFFFFF",
		correctLevel: qrCode.CorrectLevel.H
	})
	console.log("二维码生成内容:", qrCodeContent + bill)
}

/**
 * 查询终端参数
 * @param {parmid 参数组id} 
 */
const getPOSCS = async (parmid) => {
	let poscs = [];
	let execSql_arr = "SELECT D1.SNAME,P1.POSCS,P1.POSCSNR FROM POSCSZMX P1 ,DAPZCS_NR D1 WHERE D1.ID ='POSCS' AND D1.ID_NR = P1.POSCS AND P1.POSCSZID ='"+parmid+"' ORDER BY  P1.SZ";
    await db.get().executeQry(execSql_arr, "执行中", function(res) {
		console.log("POSCS sql执行结果：", res.msg);
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
	var YN_YXDY  = ""; //是否打印小票 ，N不调用打印逻辑；
	var YN_DYFP  = "";//是否打印发票，使用黑标发票纸的维护Y，Ipad收银 统一N；
	var DYJZF  = "";//小票打印机字符，32对应58mm宽的纸，40-对应80mm宽纸，iPad连的蓝牙打印机 统一推荐使用40参数；
	var XPZZHS  = "";//小票走纸行数，打印完小票内容后，再走几行空白纸，一般仟吉维护0，取参数值走纸；
	var HYY  = ""; //小票欢迎语，维护文本内容
	var XPLOGO = "";//票抬头logo，通过参数内容 logo.jpg 取对应图片文件打印到小票顶部作为商户logo；
	var XPEWM = "";//票结尾二维码，内容维护 二维码图片名称，png格式；取对应图片文件打印，取不到时不打且不能占位；
	var DZFPEWMDZ = "";//电子发票二维码地址，前端生成发票开票二维码，打印在小票底部
	var YN_CALLNUM = ""; //水吧产品叫号 ，维护Y的时候 ，支付前 收银员手工录入水吧叫号的号码，小票顶部打印这个号码
	var SBLBBM = "";
	
	var obj1 = poscsData;
	var YN_YXDY_obj = obj1.filter(item => {
	   if (item.POSCS == "YN_YXDY") {
	      return item.POSCSNR;
	   }
	});
	if(YN_YXDY_obj.length > 0){
		YN_YXDY = YN_YXDY_obj[0].POSCSNR;
	}
	
    var obj2 = poscsData;
	var YN_DYFP_obj = obj2.filter(item => {
	   if (item.POSCS == "YN_DYFP") {
	      return item.POSCSNR;
	   }
	});
	if(YN_DYFP_obj.length > 0){
		YN_DYFP = YN_DYFP_obj[0].POSCSNR;
	}
	
	var obj3 = poscsData;
	var DYJZF_obj = obj3.filter(item => {
	   if (item.POSCS == "DYJZF") {
	      return item.POSCSNR;
	   }
	});
	if(DYJZF_obj.length > 0){
		DYJZF = DYJZF_obj[0].POSCSNR;
	}
	
	var obj4 = poscsData;
	var XPZZHS_obj = obj4.filter(item => {
	   if (item.POSCS == "XPZZHS") {
	      return item.POSCSNR;
	   }
	});
	if(XPZZHS_obj.length > 0){
		XPZZHS = XPZZHS_obj[0].POSCSNR;
	}
	
	var obj5 = poscsData;
	var HYY_obj = obj5.filter(item => {
	   if (item.POSCS == "HYY") {
	      return item.POSCSNR;
	   }
	});
	if(HYY_obj.length > 0){
		HYY = HYY_obj[0].POSCSNR;
	}
	
	var obj6 = poscsData;
	var XPLOGO_obj = obj6.filter(item => {
	   if (item.POSCS == "XPLOGO") {
	      return item.POSCSNR;
	   }
	});
	if(XPLOGO_obj.length > 0){
		XPLOGO = XPLOGO_obj[0].POSCSNR;
	}
	
	var obj7 = poscsData;
	var XPEWM_obj = obj7.filter(item => {
	   if (item.POSCS == "XPEWM") {
	      return item.POSCSNR;
	   }
	});
	if(XPEWM_obj.length > 0){
		XPEWM = XPEWM_obj[0].POSCSNR;
	}
	
	var obj8 = poscsData;
	var DZFPEWMDZ_obj = obj8.filter(item => {
	   if (item.POSCS == "DZFPEWMDZ") {
	      return item.POSCSNR;
	   }
	});
	if(DZFPEWMDZ_obj.length > 0){
		DZFPEWMDZ = DZFPEWMDZ_obj[0].POSCSNR;
	}
	
	var obj9 = poscsData;
	var YN_CALLNUM_obj = obj9.filter(item => {
	   if (item.POSCS == "YN_CALLNUM") {
	      return item.POSCSNR;
	   }
	});
	if(YN_CALLNUM_obj.length > 0){
		YN_CALLNUM = YN_CALLNUM_obj[0].POSCSNR;
	}
	
	var obj10 = poscsData;
	var SBLBBM_obj = obj10.filter(item => {
	   if (item.POSCS == "SBLBBM") {
	      return item.POSCSNR;
	   }
	});
	if(SBLBBM_obj.length > 0){
		SBLBBM = SBLBBM_obj[0].POSCSNR;
	}
	
	// console.log("YN_YXDY",YN_YXDY);
	// console.log("SBLBBM",SBLBBM);
	
	var printer_poscs=
	{
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
	};

	//console.log("commonPOSCS",printer_poscs)
	return printer_poscs;
}

/**
 * 查询打印记录
 * @param {xsBill}  
 */
const getBillPrinterData = async (xsBill)=>{
	let billStr = "";
	let sql = "select * from POS_XSBILLPRINT where XSBILL = '" + xsBill + "' order by XSDATE desc";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		billStr = res.msg[0].BILLSTR;
	    console.log("重打数据查询成功",res.msg[0].XSBILL);
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
 * 打印二维码
 * @param {*} command 
 * @param {*} qrCodeWidth 
 * @param {*} qrCodeHeight 
 */
const canvasGetImageData = async (command,qrCodeWidth,qrCodeHeight)=>{
	//打印二维码
	await uni.canvasGetImageData({
		canvasId: "couponQrcode",
		x: 0,
		y: 0,
		width: qrCodeWidth,
		height: qrCodeHeight,
		success: function(res) {
			console.log("获取画布数据成功");
			command.setSelectJustification(1); //居中
			command.setBitmap(res);
			command.setPrint();	
		},
		complete: function(res) {
			console.log("couponQrcode finish");
		},
		fail: function(res) {
			console.log("获取画布数据失败:", res);
			uni.showToast({
				title: "获取画布数据失败",
				icon: "none"
			});
		}
	});
	return command;
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
	couponQrCode: couponQrCode,
	getPOSCS: getPOSCS,
	commonPOSCS: commonPOSCS,
	getBillPrinterData: getBillPrinterData,
	canvasGetImageData: canvasGetImageData
};
