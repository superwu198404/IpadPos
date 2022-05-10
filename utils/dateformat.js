/** 
 * 字符串转时间（yyyy-MM-dd HH:mm:ss） 
 * result （分钟） 
 */
const stringToDate = (fDate) => {
	var fullDate = fDate.split("-");
	return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0);
};

/** 
 * 格式化日期 
 * @param date 日期 
 * @param format 格式化样式,例如yyyy-MM-dd HH:mm:ss E 
 * @return 格式化后的 
 */
const formatDate = (date, format) => {
	var v = "";
	if (typeof date == "string" || typeof date != "object") {
		return;
	}
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var weekDay = date.getDay();
	var ms = date.getMilliseconds();
	var weekDayString = "";

	if (weekDay == 1) {
		weekDayString = "周一";
	} else if (weekDay == 2) {
		weekDayString = "周二";
	} else if (weekDay == 3) {
		weekDayString = "周三";
	} else if (weekDay == 4) {
		weekDayString = "周四";
	} else if (weekDay == 5) {
		weekDayString = "周五";
	} else if (weekDay == 6) {
		weekDayString = "周六";
	} else {
		weekDayString = "周日";
	}

	v = format;
	//Year 
	v = v.replace(/yyyy/g, year);
	v = v.replace(/YYYY/g, year);
	v = v.replace(/yy/g, (year + "").substring(2, 4));
	v = v.replace(/YY/g, (year + "").substring(2, 4));

	//Month 
	var monthStr = month;
	v = v.replace(/MM/g, monthStr);
	// var monthStr = ("0" + month);
	// v = v.replace(/MM/g, monthStr.substring(monthStr.length - 2));

	//Day 
	var dayStr = day;
	v = v.replace(/dd/g, dayStr);
	// var dayStr = ("0" + day);
	// v = v.replace(/dd/g, dayStr.substring(dayStr.length - 2));

	//hour 
	var hourStr = ("0" + hour);
	v = v.replace(/HH/g, hourStr.substring(hourStr.length - 2));
	v = v.replace(/hh/g, hourStr.substring(hourStr.length - 2));

	//minute 
	var minuteStr = ("0" + minute);
	v = v.replace(/mm/g, minuteStr.substring(minuteStr.length - 2));

	//Millisecond 
	v = v.replace(/sss/g, ms);
	v = v.replace(/SSS/g, ms);

	//second 
	var secondStr = ("0" + second);
	v = v.replace(/ss/g, secondStr.substring(secondStr.length - 2));
	v = v.replace(/SS/g, secondStr.substring(secondStr.length - 2));

	//weekDay 
	v = v.replace(/E/g, weekDayString);
	return v;
};
/**
 * 计算两个日期相差几天
 * cusDate 当前时间
 * oriDate  比较时间
 * 返回 正数为cusDate>oriDate
 */
const calculateTime = (cusDate, oriDate) => {
	var cusTime = cusDate.getTime();
	var oriTime = oriDate.getTime();
	return (cusTime - oriTime) / (1000 * 60 * 60 * 24)
};
/**
 * 时间戳转日期格式
 * @param {Object} timeStamp
 */
const timeStampTurnTime = (timeStamp, type = "") => {
	if (timeStamp != undefined && timeStamp != "" && timeStamp > 0) {
		var date = new Date();
		date.setTime(timeStamp * 1000);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		if (type) {
			return y + '-' + m + '-' + d;
		} else {
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		}
	} else {
		return "";
	}
};

/**
 * 日期格式转时间戳
 * @param {Object} timeStamp
 */
const timeTurnTimeStamp = (string) => {
	var f = string.split(' ', 2);
	var d = (f[0] ? f[0] : '').split('-', 3);
	var t = (f[1] ? f[1] : '').split(':', 3);
	return (new Date(
		parseInt(d[0], 10) || null,
		(parseInt(d[1], 10) || 1) - 1,
		parseInt(d[2], 10) || null,
		parseInt(t[0], 10) || null,
		parseInt(t[1], 10) || null,
		parseInt(t[2], 10) || null
	)).getTime() / 1000;
};

/**
 * 倒计时
 * @param {Object} seconds 秒
 */
const countDown = (seconds) => {
	let [day, hour, minute, second] = [0, 0, 0, 0]
	if (seconds > 0) {
		day = Math.floor(seconds / (60 * 60 * 24))
		hour = Math.floor(seconds / (60 * 60)) - (day * 24)
		minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
		second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
	}
	if (day < 10) {
		day = '0' + day
	}
	if (hour < 10) {
		hour = '0' + hour
	}
	if (minute < 10) {
		minute = '0' + minute
	}
	if (second < 10) {
		second = '0' + second
	}
	return {
		d: day,
		h: hour,
		i: minute,
		s: second
	};
};
//获取现在时刻的日期，星期几，时分秒
const GetDateTimeNowStr = (type) => {
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
};

const GetTimeStamp = () => {
	return (new Date()).getTime();
};

//某个日期是否晚于某个日期
const after = (date1, date2) => {
	var stime = this._getTime(this._transferDate(date1));
	var etime = this._getTime(this._transferDate(date2));
	return stime < etime ? true : false;
};

//某个日期是在当月中的星期几
const getDayOfWeek = (date) => {
	return this._getWeek(date1);
};

/*获取今天星期几,如果为0代表星期日*/
const getWeek = (date) => {
	return this._transferDate(date).getDay();
};
//获取两个日期相隔天数
const getDays = (date1, date2) => {
	const dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
	const minusDays = Math.floor(((date2.getTime() - date1.getTime()) / dateTime)); //计算出两个日期的天数差
	return Math.abs(minusDays);
};
//获取当前日期 yyyyMMdd
const getYMD = () => {
	let date = new Date();
	let year = date.getFullYear().toString();
	let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
	let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
	let str = year + '-' + month + '-' + day;
	return str;
};
//获取当前日期时间yyyyMMddHHmmss
const getYMDS = () => {
	let date = new Date();
	let year = date.getFullYear().toString();
	let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
	let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
	let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours().toString();
	let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes().toString();
	let sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds().toString();
	let str = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
	return str;
};
export default {
	stringToDate,
	formatDate,
	calculateTime,
	timeStampTurnTime,
	timeTurnTimeStamp,
	countDown,
	GetDateTimeNowStr,
	GetTimeStamp,
	after,
	getDayOfWeek,
	getWeek,
	getDays,
	getYMD,
	getYMDS
}
