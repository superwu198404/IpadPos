export default {
	msg,
	successToast,
	showLoading,
	hideLoading,
	getStorage,
	setStorage,
	delStorage,
	clearStorage,
	uploadFile,
	GetPhone,
	getQueryString,
	fixed2,
	deepClone,
	copy,
	getUnique,
	prePage,
	CheckLogin,
	throttle,
	Debounce
}


//消息提示
const msg = (str) => {
	return new Promise((resolve, reject) => {
		uni.showToast({
			title: str,
			icon: "none",
			duration: 2000,
			position: "bottom",
			success: () => {
				resolve;
			},
		});
	});
}

// 成功提示框
const successToast = (str) => {
	return new Promise((resolve, reject) => {
		uni.showToast({
			title: str,
			icon: "success",
			duration: 2000,
			success: () => {
				resolve();
			},
		});
	});
}

// 显示loading 需要配合hideLoading关闭
const showLoading = (str) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: str,
			success: () => {
				resolve();
			},
		});
	});
};

// 隐藏loading
const hideLoading = () => {
	return new Promise((resolve, reject) => {
		uni.hideLoading({
			success: () => {
				resolve();
			},
		});
	});
}


//获取缓存
const getStorage = (key, sync = true) => {
	try {
		if (sync) {
			return uni.getStorageSync(key);
		} else {
			let data = "";
			uni.getStorage({
				key: key,
				success: function(res) {
					data = res.data;
				},
			});
			return data;
		}
	} catch (e) {
		return false;
	}
}

//设置缓存
const setStorage = (key, value, sync = true) => {
	try {
		if (sync) {
			return uni.setStorageSync(key, value);
		} else {
			uni.setStorage({
				key: key,
				data: value,
			});
		}
	} catch (e) {}
}

//移除缓存
const delStorage = (key, sync = true) => {
	try {
		if (sync) {
			return uni.removeStorageSync(key);
		} else {
			uni.removeStorage({
				key: key,
			});
		}
	} catch (e) {
		return false;
	}
}

//清空缓存
const clearStorage = (sync = true) => {
	try {
		if (sync) {
			return uni.clearStorageSync();
		} else {
			uni.clearStorage();
		}
	} catch (e) {
		return false;
	}
}
/**
 * 复制
 * @param {Object} message
 * @param {Object} callback
 */
const copy = (value, callback) => {
	// #ifdef H5
	var oInput = document.createElement('input'); //创建一个隐藏input（重要！）
	oInput.value = value; //赋值
	document.body.appendChild(oInput);
	oInput.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	oInput.className = 'oInput';
	oInput.style.display = 'none';
	uni.hideKeyboard();
	this.showToast({
		title: '复制成功'
	});
	typeof callback == 'function' && callback();
	// #endif
	// #ifdef MP || APP-PLUS
	uni.setClipboardData({
		data: value,
		success: () => {
			typeof callback == 'function' && callback();
		}
	});
	// #endif
}
/**
 * 深度拷贝对象
 * @param {Object} obj
 */
const deepClone = (obj) => {
	const isObject = function(obj) {
		return typeof obj == 'object';
	}

	if (!isObject(obj)) {
		throw new Error('obj 不是一个对象！')
	}
	//判断传进来的是对象还是数组
	let isArray = Array.isArray(obj)
	let cloneObj = isArray ? [] : {}
	//通过for...in来拷贝
	for (let key in obj) {
		cloneObj[key] = isObject(obj[key]) ? this.deepClone(obj[key]) : obj[key]
	}
	return cloneObj
}
/* 保留两位小数
 * @method fixed2
 * @param {String} str 需要转换的字符串
 * @return {String} 返回两位小数
 */
const fixed2 = (str) => {
	return Number.parseInt(str) < 10 ? '0' + str : str;
}

// 上传图片封装
const uploadFile = (obj) => {
	let url = baseurl + 'file-list/uploadImage'; //服务器地址
	let filePath = obj.filePath; //要上传文件资源的路径。
	let formData = obj.formData || {
		'user': 'test'
	};
	let success = obj.success;
	let name = obj.name || 'filePath'; //文件对应的 key 
	let method = obj.method || 'POST'; //默认post请求
	uni.uploadFile({
		url: url,
		filePath: filePath,
		name: name,
		formData: formData,
		header: {
			'token': token,
		},
		success: function(res) {
			success(res)
		},
		fail: function(res) {},
		complete: function(res) {},
	})
}
//获取url上的参数
const getQueryString = (name) => {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	let r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

// 格式化电话号码
const GetPhone = (phone) => {
	let tel = phone.slice(0, 3) + '****' + phone.slice(7, 11);
	return tel;
}


let _debounceTimeout = null,
	_throttleRunning = false

/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms   
 */
const Debounce = (fn, delay = 500) => {
	clearTimeout(_debounceTimeout);
	_debounceTimeout = setTimeout(() => {
		fn();
	}, delay);
}

/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms  
 */
const throttle = (fn, delay = 500) => {
	if (_throttleRunning) {
		return;
	}
	_throttleRunning = true;
	fn();
	setTimeout(() => {
		_throttleRunning = false;
	}, delay);
}



/**
 * 检查登录
 * @return {Boolean}
 */
const CheckLogin = (options = {}) => {
	const token = uni.getStorageSync('uniIdToken');
	if (token) {
		return true;
	}
	if (options.nav !== false) {
		uni.navigateTo({
			url: ' '
		})
	}
	return false;
}
/**
 * 获取页面栈
 * @param {Number} preIndex为1时获取上一页
 * @return {Object} 
 */
const prePage = (preIndex = 1) => {
	const pages = getCurrentPages();
	const prePage = pages[pages.length - (preIndex + 1)];
	return prePage.$vm;
}


//二维数组去重
const getUnique = array => {
	let obj = {}
	return array.filter((item, index) => {
		let newItem = item + JSON.stringify(item)
		return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
	})
}
