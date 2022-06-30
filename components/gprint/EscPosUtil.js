import encode from '@/utils/xprinter/encoding.js';
//字符串转字节序列
function stringToByte(str) {
	var bytes = new Array();
	var len, c;
	len = str.length;
	for (var i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if (c >= 0x010000 && c <= 0x10FFFF) {
			bytes.push(((c >> 18) & 0x07) | 0xF0);
			bytes.push(((c >> 12) & 0x3F) | 0x80);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000800 && c <= 0x00FFFF) {
			bytes.push(((c >> 12) & 0x0F) | 0xE0);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000080 && c <= 0x0007FF) {
			bytes.push(((c >> 6) & 0x1F) | 0xC0);
			bytes.push((c & 0x3F) | 0x80);
		} else {
			bytes.push(c & 0xFF);
		}
	}
	return bytes;
}

//字节序列转ASCII码
//[0x24, 0x26, 0x28, 0x2A] ==> "$&C*"
function byteToString(arr) {
	if (typeof arr === 'string') {
		return arr;
	}
	var str = '',
		_arr = arr;
	for (var i = 0; i < _arr.length; i++) {
		var one = _arr[i].toString(2),
			v = one.match(/^1+?(?=0)/);
		if (v && one.length == 8) {
			var bytesLength = v[0].length;
			var store = _arr[i].toString(2).slice(7 - bytesLength);
			for (var st = 1; st < bytesLength; st++) {
				store += _arr[st + i].toString(2).slice(2);
			}
			str += String.fromCharCode(parseInt(store, 2));
			i += bytesLength - 1;
		} else {
			str += String.fromCharCode(_arr[i]);
		}
	}
	return str;
}

//居中
function Center() {
	var Center = [];
	Center.push(27);
	Center.push(97);
	Center.push(1);
	var strCenter = byteToString(Center);
	return strCenter;
}

//居左
function Left() {
	var Left = [];
	Left.push(27);
	Left.push(97);
	Left.push(48);
	var strLeft = byteToString(Left);
	return strLeft;
}
//标准字体
function Size1() {
	var Size1 = [];
	Size1.push(29);
	Size1.push(33);
	Size1.push(0);
	var strSize1 = byteToString(Size1);
	return strSize1;
}
//大号字体
function Size2(n) {
	var Size2 = [];
	Size2.push(29);
	Size2.push(33);
	Size2.push(n);
	var strSize2 = byteToString(Size2);
	return strSize2;
}

//初始化打印机
function init() {
	var data = [];
	data.push(27)
	data.push(64)
	var strdata = byteToString(data);
	return strdata;
}

//打印
function SetPrint() {
	var Print = [];
	Print.push(10);
	var strPrint = byteToString(Print);
	return strPrint;
}

function SetBarcodeWidth(width) { //设置条码宽度
	var Print = [];
	Print.push(29)
	Print.push(119)
	if (width > 6) {
		width = 6;
	}
	if (width < 2) {
		width = 1;
	}
	Print.push(width)
	var strPrint = byteToString(Print);
	return strPrint;
};

function SetBarcodeHeight(height) { //设置条码高度
	var Print = [];
	Print.push(29)
	Print.push(104)
	Print.push(height)
	var strPrint = byteToString(Print);
	return strPrint;
};

//设置条码内容
function SetBarcodeContent() {
	var Print = [];
	Print.push(29)
	Print.push(107)
	//Print.push(2) // 固定 打印JAN13(EAN13)的条码类型
	Print.push(73)
	var strPrint = byteToString(Print);
	return strPrint;
}

module.exports = {
	Center: Center,
	Left: Left,
	Size1: Size1,
	Size2: Size2,
	byteToString: byteToString,
	stringToByte: stringToByte,
	SetBarcodeWidth: SetBarcodeWidth,
	SetBarcodeHeight: SetBarcodeHeight,
	SetBarcodeContent: SetBarcodeContent,
	SetPrint
}
