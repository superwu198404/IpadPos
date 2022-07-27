/**
 * 数据处理
 * @author echo.
 * @version 1.5.0
 **/
//勿删
const utils = {
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
			title,
			icon: isError ? "error" : "success"
		})
		if(errData) console.log(title,errData)
	},
	/**
	 * 简单模态弹窗
	 * @param title: 标题
	 * @param content: 内容
	 * @returns void
	 */
	simpleModal: function(title, content) {
		uni.showModal({
			title,
			content
		});
	},
	//内容替换
	replaceAll: function(text, repstr, newstr) {
		return text.replace(new RegExp(repstr, "gm"), newstr);
	},
	//格式化手机号码
	formatNumber: function(num) {
		return num.length === 11 ? num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : num;
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

	//模拟休眠方法
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
			if (!val) {
				val = uni.getStorageSync(key)
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
	}
}

export default {
	simpleMsg: utils.simpleMsg,
	simpleModal: utils.simpleModal,
	trim: utils.trim,
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
	callBind: utils.callBind
}
