//graceChecker.js
/**
数据验证（表单验证）
zjq
*/

//校验手机格式
const checkMobile = (mobile) => {
	return RegExp(/^1[34578]\d{9}$/).test(mobile);
}
//校验邮箱格式
const checkEmail = (email) => {
	return RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(mobile);
}
//数字
const checkInt = (number) => {
	return RegExp(/^(?:[1-9]\d*|0)(?:\.\d+)?$/).test(number);
}
//校验金额 
const checkMoney = (s) => {
	//金额 只允许正数
	//var exp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
	//金额 允许正（+）负数
	//var exp = /(^([+-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^([+-]?)(0){1}$)|(^([+-]?)[0-9]\.[0-9]([0-9])?$)/;

	//金额 允许正负数
	var exp = /(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?$)/;
	if (exp.test(s)) {
		return true;
	} else {
		return false;
	}
}
const checkIdCard = (sId) => {
	if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
		console.log('你输入的身份证长度或格式错误');
		return false;
	}
	//身份证城市
	var aCity = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外"
	};
	if (!aCity[parseInt(sId.substr(0, 2))]) {
		console.log('你的身份证地区非法')
		return false
	}
	// 出生日期验证
	var sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(
			/-/g, "/"),
		d = new Date(sBirthday)
	if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
		console.log('身份证上的出生日期非法')
		return false
	}
	// 身份证号码校验
	var sum = 0,
		weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
		codes = "10X98765432"
	for (var i = 0; i < sId.length - 1; i++) {
		sum += sId[i] * weights[i];
	}
	var last = codes[sum % 11]; //计算出来的最后一位身份证号码
	if (sId[sId.length - 1] != last) {
		console.log('你输入的身份证号非法')
		return false
	}
	return true
}
//小数
const IsDecimal = (input) => {
	return /^[-+]?(?:0|[1-9]\d*)\.\d+$/.test(input);
}
//负小数
const IsNegativeDecimal = (input) => {
	return /^\-?(?:0|[1-9]\d*)\.\d+$/.test(input);
}
//正小数
const IsPositiveDecimal = (input) => {
	return /^\+?(?:0|[1-9]\d*)\.\d+$/.test(input);
}
//整数
const IsInteger = (input) => {
	return /^[-+]?(?:0|[1-9]\d*)$/.test(input);
}
//正整数
const IsPositiveInteger = (input) => {
	return /^\+?(?:0|[1-9]\d*)$/.test(input);
}
//负整数
const IsNegativeInteger = (input) => {
	return /^\-?(?:0|[1-9]\d*)$/.test(input);
}
//，undefined,null等转化为""
const praseStrEmpty = (str) => {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

//是否为空  
const IsNotEmpty = (source) => {
	var str = source.replace(/(^\s*)|(\s*$)/g, "");
	if (str == "" || str.toLowerCase() == "null" || str.length <= 0 || str == undefined) {
		return true;
	} else {
		return false;
	}
}

//字符串编码
const strEncode = (source) => {
	return encodeURIComponent(source);
}
//字符串解码
const strDencode = (source) => {
	return decodeURIComponent(source);
}

export default {
	checkMobile,
	checkEmail,
	checkInt,
	checkMoney,
	praseStrEmpty,
	IsNotEmpty,
	strEncode,
	strDencode
}
