import common from '@/api/common.js'
/**
 * 数据处理
 * @author echo.
 * @version 1.5.0
 **/
//勿删
const utils = {
	/**
	 * 对比版本号
	 * @param {Object} v1
	 * @param {Object} v2
	 */
	contrast(v1, v2) {
		try {
			let arr_1 = v1.split('.')
			let arr_2 = v2.split('.')
			for (var i = 0; i < arr_1.length; i++) {
				if (parseInt(arr_1[i]) > parseInt(arr_2[i])) {
					return 1
				} else if (parseInt(arr_1[i]) < parseInt(arr_2[i])) {
					return -1
				}
			}
		} catch (e) {
			return 0
		}
		return 0
	},
	//去空格
	trim: function(value) {
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},
	/**
	 * 简单消息提示
	 * @param title: 标题
	 * @param isError?: 是否是错误信息
	 * @returns void
	 */
	simpleMsg: function(title, isError = false, errData) {
		uni.showToast({
			title: (isError == 'none' || title.length > 7) ? `${isError ? '⚠' : '✔'}提示:\n` + title :
				title,
			icon: (isError == 'none' || title.length > 7) ? "none" : (isError ? 'error' :
				"success") //可传入none值
		})
		if (errData) console.log(title, errData)
	},
	/**
	 * 简单模态弹窗
	 * @param title: 标题
	 * @param content: 内容
	 * @returns void
	 */
	simpleModal: function(title, content, conFunc, is_input) {
		uni.showModal({
			title,
			content,
			editable: is_input,
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
					if (conFunc)
						conFunc(true, res);
				} else if (res.cancel) {
					console.log('用户点击取消');
					if (conFunc)
						conFunc(false, res);
				}
			}
		});
	},
	/**
	 * sql 生成
	 * @param obj: 生成参数，示例结构：[ 对象(数组或对象) , 表名 ]
	 * @returns void
	 */
	generateSQLStringArray: function(...args) { //生成SQL语句数组
		let sqls = [];
		args.forEach(arg => {
			try {
				console.log(`[GenerateSQLStringArray]表 ${arg[1]} 生成开始!`);
				if (arg.length && arg.length === 2) {
					let res = common.CreateSQL(arg[0], arg[1]);
					sqls = sqls.concat(res.sqlliteArr);
					console.log(`[GenerateSQLStringArray]表 ${arg[1]} 生成完毕!`, res);
				}
			} catch (e) {
				console.log(`[GenerateSQLStringArray]表 ${arg[1]} 生成失败!`, e);
			}
		})
		return sqls;
	},
	//转为IOS上支持的时间格式(ios 上时间对象 Date 不支持 yyyy-MM-dd 这种用'-'分隔的格式)
	formatIOSDateTime: function(dateStr) {
		return dateStr.replaceAll('-', '/');
	},
	//此处是时区补偿，因为IOS上有8个小时的时区（晚了八个小时）
	timeZoneCompensation: function(datetime, value = 8) {
		return new Date(datetime.setHours(datetime.getHours() + value));
	},
	//内容替换
	replaceAll: function(text, repstr, newstr) {
		return text.replace(new RegExp(repstr, "gm"), newstr);
	},
	//格式化手机号码
	formatNumber: function(num) {
		return num.length === 11 ? num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : num;
	},
	//获取零点时间 如：2022-01-01 14:12:22 => 2022-01-01 00:00:00
	twelveClock: function(datetime) {
		return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getUTCDate() + 1, -16, 0, 0)
	},
	//金额格式化
	rmoney: function(money) {
		return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,')
			.replace(
				/\,$/, '').split('').reverse().join('');
	},
	hidePropety: (obj, ...props) => {
		let configs = {};
		let keys = Object.keys(obj);
		props.forEach(p => {
			if (keys.indexOf(p) !== -1)
				configs[p] = {
					configurable: true,
					enumerable: false,
					writable: true
				}
		})
		Object.defineProperties(obj, configs);
		return obj;
	},
	callBind: function(thisObject, func) {
		return func.bind(thisObject);
	},
	callContainer: function(this_quote) {
		return (function(callback, is_bind = true) {
			try {
				if (is_bind)
					return callback.bind(this);
				else
					return callback.call(this);
			} catch (e) {
				console.warn('[CallContainer]调用容器内发生错误!错误信息:', e);
			}
		}).bind(this_quote);
	},
	//日期格式化
	formatDate: function(formatStr, fdate) {
		if (fdate) {
			if (~fdate.indexOf('.')) {
				fdate = fdate.substring(0, fdate.indexOf('.'));
			}
			fdate = fdate.toString().replace('T', ' ').replace(/\-/g, '/');
			var fTime, fStr = 'ymdhis';
			if (!formatStr)
				formatStr = "y-m-d h:i:s";
			if (fdate)
				fTime = new Date(fdate);
			else
				fTime = new Date();
			var month = fTime.getMonth() + 1;
			var day = fTime.getDate();
			var hours = fTime.getHours();
			var minu = fTime.getMinutes();
			var second = fTime.getSeconds();
			month = month < 10 ? '0' + month : month;
			day = day < 10 ? '0' + day : day;
			hours = hours < 10 ? ('0' + hours) : hours;
			minu = minu < 10 ? '0' + minu : minu;
			second = second < 10 ? '0' + second : second;
			var formatArr = [
				fTime.getFullYear().toString(),
				month.toString(),
				day.toString(),
				hours.toString(),
				minu.toString(),
				second.toString()
			]
			for (var i = 0; i < formatArr.length; i++) {
				formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
			}
			return formatStr;
		} else {
			return "";
		}
	},
	rgbToHex: function(r, g, b) {
		return "#" + utils.toHex(r) + utils.toHex(g) + utils.toHex(b)
	},
	toHex: function(n) {
		n = parseInt(n, 10);
		if (isNaN(n)) return "00";
		n = Math.max(0, Math.min(n, 255));
		return "0123456789ABCDEF".charAt((n - n % 16) / 16) +
			"0123456789ABCDEF".charAt(n % 16);
	},
	hexToRgb(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},

	// 时间戳
	ymsFormat: function() {
		let date = new Date();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hours = date.getHours();
		var minu = date.getMinutes();
		var second = date.getSeconds();
		var mile = date.getMilliseconds().toString();

		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		hours = hours < 10 ? ('0' + hours) : hours;
		minu = minu < 10 ? '0' + minu : minu;
		second = second < 10 ? '0' + second : second;
		mile = mile < 10 ? ("00" + mile) : (mile < 100 ? "0" + mile : mile);

		let str = date.getFullYear().toString().substring(2) + month + day + hours + minu + second + mile;
		return str;
	},

	//排序的函数
	objKeySort: function(arys) {
		var newObj = "";
		//先用Object内置类的keys方法获取要排序对象的属性名数组，再利用Array的sort方法进行排序
		if (arys === null) {
			return;
		}
		const newkey = Object.keys(arys).sort();
		for (let i = 0; i < newkey.length; i++) {
			const newArrKey = newkey[i];
			const newArrOne = arys[newkey[i]];
			//遍历newkey数组
			if (Object.prototype.toString.call(newArrOne).slice(8, -1) === "Array") {
				// for (let j = 0; j < newArrOne.length; j++) {
				// 	this.objKeySort(newArrOne[j]);
				// }
			} else if (Object.prototype.toString.call(newArrOne).slice(8, -1) === "Object") {
				// this.objKeySort(newArrOne);
			} else {
				newObj += [newArrKey] + "=" + newArrOne + "&";
			}
		}
		return newObj.substring(0, newObj.length - 1);
	},

	//模拟休眠方法 ms
	sleep: function(ms) {
		var start = Date.now(),
			end = start + ms;
		while (Date.now() < end);
		return;
	},
	/**
	 * 保留小数点几位数, 自动补零, 四舍五入
	 * @param num: 数值
	 * @param digit: 小数点后位数
	 * @returns string
	 */
	myFixed: function(num, digit) {
		if (Object.is(parseFloat(num), NaN)) {
			console.log(`传入的值：${num}不是一个数字`);
			return 0;
		}
		num = parseFloat(num);
		return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
	},
	UUID: function() {
		let func = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		return (func() + func() + "-" + func() + "-" + func() + "-" + func() + "-" + func() + func() +
			func());
	},
	/**
	 * 系统存值
	 * @param key: 键
	 * @param val: 值
	 * @returns string
	 */
	setStorage: function(key, val) {
		if (key) {
			getApp().globalData[key] = val;
			uni.setStorageSync(key, val);
		}
	},
	/**
	 * 系统取值
	 * @param key: 键
	 * @returns string
	 */
	getStorage: function(key) {
		let val = null;
		if (key) {
			val = getApp().globalData[key];
			if (!val || Object.keys(val).length == 0) {
				val = uni.getStorageSync(key);
			}
		}
		return val;
	},
	/**
	 * 清除全局存储值
	 * @param key: 键
	 * @returns string
	 */
	removeStorage: function(key) {
		let val = null;
		if (key) {
			getApp().globalData[key] = null;
			uni.removeStorageSync(key);
		}
		return val;
	},
	//去除特殊字符
	stripscript: function(s) {
		var pattern = new RegExp("[\\^@&•`\"‘’'“”]");
		var rs = "";
		for (var i = 0; i < s.length; i++) {
			rs = rs + s.substr(i, 1).replace(pattern, '');
		}
		return rs;
	},
	group: function(arr = [], field = "") {
		let map = new Map();
		let group = {};
		arr.map(i => {
			if (!group[i[field]]) {
				group[i[field]] = arr.filter(obj => obj[field] === i[field]);
			}
		});
		return group;
	},
	/**
	 * 取相反数
	 * @param {*} num 数字或数字字符串
	 */
	inverseNumber: function(num, log = true) {
		let number = Number(num);
		if (isNaN(number)) {
			console.log("[inverseNumber]转换发生错误,目标为:", num)
			return num;
		} else
			return -number;
	},

	//排序
	compare: function(prop, sort = 'desc') {
		return function(a, b) {
			if (sort == 'desc') {
				return b[prop] - a[prop] // 降序
			} else {
				return a[prop] - b[prop] // 升序
			}
		}
	},
	//转换为小数，并保留2位 返回number
	newFloat: function(pm_num, pm_declen = 2) {
		return Number(parseFloat(pm_num).toFixed(pm_declen));
	},
	getBill: function() {
		var newbill = "",
			store = uni.getStorageSync('store'),
			serial_number = Number(uni.getStorageSync('serial-number') || "0");
		let d = new Date();
		let year = (d.getFullYear() % 100) < 10 ? "0" + (d.getFullYear() % 100) : (d.getFullYear() %
			100);
		let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
		let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
		let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
		let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
		let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
		// newbill = this.Storeid + this.POSID + "" + d.getFullYear() % 100 + (d.getMonth() + 1) + d.getDate() + d
		// 	.getHours() + d.getMinutes() + d.getSeconds();
		newbill = store.KHID + store.POSID + year + month + day + hour + min + sec;
		//单号格式：门店号+pos号+yymmddHHmmss+流水号 自打开程序以后的开单号，每天清零
		newbill = newbill + "" + serial_number;
		serial_number++;
		uni.setStorageSync('serial-number', serial_number);
		return newbill;
	},
	//校验数量
	CheckNum: function(r, r1) {
		let num = 0;
		if (r && r1) {
			num = 1;
			if (r == r1)
				return 1;
			let num1 = r.substr(r.length - 6, 5);
			let num2 = r1.substr(r1.length - 6, 5);
			num = this.newFloat(Number(num2) - Number(num1) + 1, 0);
		}
		return num;
	},
	createdResult: function(code, msg, data = null) {
		return {
			code,
			msg,
			data
		}
	},
	convertShortDate: function(yyyymmdd) {
		if (yyyymmdd && yyyymmdd.length) {
			if (yyyymmdd.length === 8) {
				return `${yyyymmdd.substr(0,4)}/${yyyymmdd.substr(4,2)}/${yyyymmdd.substr(6,2)}`;
			}
			return new Date().toLocaleDateString()
		} else {
			return new Date().toLocaleDateString();
		}
	},
	//判断区间重叠[{min:"1",max:"4"},{min:"5",max:"8"},{min:"6",max:"10"}];
	IntervalOverlap1: function(arr, obj) {
		let over = true;
		for (var i = 0; i < arr.length; i++) {
			if ((arr[i].min <= obj.min && arr[i].max >= obj.min) || (arr[i].min <= obj.max && arr[i].max >= obj
					.max)) {
				over = false;
				break;
			}
		}
		console.log("校验结果：", over);
		return over;
	},
	//判断是否已录入
	IntervalOverlap: function(sale2, min, max) {
		console.log("开始校验区间：", sale2);
		if (sale2.length == 0) return true;
		let arr = sale2.map(r => {
			return {
				min: Number(r.begin_num.substr(r.begin_num.length - 6, 5)),
				max: Number(r.end_num.substr(r.end_num.length - 6, 5))
			};
		})
		let obj = {
			min: Number(min.substr(min.length - 6, 5)),
			max: Number(max.substr(max.length - 6, 5))
		}
		return utils.IntervalOverlap1(arr, obj);
	},
}

export default {
	simpleMsg: utils.simpleMsg,
	simpleModal: utils.simpleModal,
	trim: utils.trim,
	formatIOSDateTime: utils.formatIOSDateTime,
	timeZoneCompensation: utils.timeZoneCompensation,
	twelveClock: utils.twelveClock,
	replaceAll: utils.replaceAll,
	formatNumber: utils.formatNumber,
	rmoney: utils.rmoney,
	formatDate: utils.formatDate,
	rgbToHex: utils.rgbToHex,
	hexToRgb: utils.hexToRgb,
	ymsFormat: utils.ymsFormat,
	objKeySort: utils.objKeySort,
	sleep: utils.sleep,
	myFixed: utils.myFixed,
	uuid: utils.UUID,
	setStorage: utils.setStorage,
	getStorage: utils.getStorage,
	removeStorage: utils.removeStorage,
	hidePropety: utils.hidePropety,
	stripscript: utils.stripscript,
	callBind: utils.callBind,
	callContainer: utils.callContainer,
	group: utils.group,
	generateSQLStringArray: utils.generateSQLStringArray,
	inverseNumber: utils.inverseNumber,
	compare: utils.compare,
	contrast: utils.contrast,
	newFloat: utils.newFloat,
	getBill: utils.getBill,
	CheckNum: utils.CheckNum,
	createdResult: utils.createdResult,
	convertShortDate: utils.convertShortDate,
	IntervalOverlap: utils.IntervalOverlap
}
