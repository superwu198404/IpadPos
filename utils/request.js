import configInfo from '@/utils/configInfo.js'; //配置参数

const baseUrl = configInfo.baseUrl;
const centerUrl = configInfo.centerUrl;

const showToast = (title, icon = "none") => {
	uni.showToast({
		title: title,
		icon: icon
	})
}

/**请求接口
 * @method http
 * @param {String} url 接口地址
 * @param {Object} data 接口参数
 * @param {Object} option 接口配置信息，可选
 * @param {string} msg 加载提示信息，可选
 * @return {Object} Promise
 */
const http = (url, data = {}, msg = "加载中...", option = {}) => {
	let p_url = option.url || baseUrl // 地址给默认值
	let hideLoading = option.hideLoading || false // 是否显示 loading
	let hideMsg = option.hideMsg || false // 是否隐藏错误提示
	let token = uni.getStorageSync("auth"); //获取接口凭证
	if (!hideLoading) {
		uni.showLoading({
			title: msg,
			mask: true
		})
	}
	if (option.url == 'center') {
		p_url = centerUrl;
	}
	//console.log("请求地址：", p_url + url);
	return new Promise((resolve, reject) => {
		uni.request({
			url: p_url + url,
			method: option.method || 'POST', // 默认 post 请求
			header: {
				'auth': token
			},
			data: data,
			success: res => { // 服务器成功返回的回调函数
				if (!hideLoading) uni.hideLoading()
				if (res.statusCode === 200) {
					let result = res.data
					if (result.code || result.code >= 0 || result.code == 'S') {
						resolve(result)
						return
					} else {
						if (!hideMsg) showToast(result.msg, 'error')
						resolve(result)
						return;
					}
				} else { // 返回值非 200，强制显示提示信息
					showToast('[' + res.statusCode + '] 系统处理失败')
					reject('[' + res.statusCode + '] 系统处理失败')
				}
			},
			fail: (err) => { // 接口调用失败的回调函数
				if (!hideLoading) uni.hideLoading()
				if (err.errMsg != 'request:fail abort') {
					showToast('连接超时，请检查您的网络。')
					reject('连接超时，请检查您的网络。')
				}
			}
		})
	}).catch(function(reason) {
		console.log('异常捕捉catch:', reason);
	});
}
/**请求接口(多层结构)
 * @method http
 * @param {String} urls 接口地址s
 * @param {Object} datas 接口参数
 * @param {string} msgs 加载提示信息，可选
 * @param {Object} option 接口配置信息，可选
 * @param {Object} func 回调函数
 * @return {Object} Promise
 */
const Post = function(urls, datas, msgs, option = {}, func) {
	if (!urls || urls.length == 0) {
		showToast('请设置请求地址！', "error");
		return;
	}
	if (!datas || datas.length == 0) {
		showToast('请设置请求参数！', "error");
		return;
	}
	let arr = [];
	//如果是数组
	if (urls.constructor === Array) {
		let a;
		if (urls.length == 1) {
			http(urls[0], datas[0], msgs[0], option).then((res) => {
				console.log(res);
				arr = arr.concat(res);
			})
		} else if (urls.length == 2) {
			http(urls[0], datas[0], msgs[0], option).then((res) => {
				console.log(res);
				arr = arr.concat(res);
				return http(urls[1], datas[1], msgs[1], option)
			}).then((res) => {
				console.log(res);
				arr = arr.concat(res);
			});
		} else if (urls.length == 3) {
			a = http(urls[0], datas[0], msgs[0]).then((res) => {
				console.log(res);
				arr = arr.concat(res);
				return http(urls[1], datas[1], msgs[1])
			}).then((res) => {
				console.log(res);
				arr = arr.concat(res);
				return http(urls[2], datas[2], msgs[2])
			}).then((res) => {
				console.log(res);
				arr = arr.concat(res);
			})
		} else {
			arr = arr.concat("暂支持三个及以内请求");
		}
		Promise
			.all([a])
			.then(function(results) {
				if (func) func(arr);
			});
		// let arr=[];
		// for (var i = 0; i < urls.length; i++) {
		// 	let p=http(urls[i], datas[i], msgs[i]);
		// 	arr=arr.concat(p);
		// }
		// debugger;
		// Promise
		// .all(arr)
		// .then(function(results){
		//     console.log(results);
		// });
	} else { //如果是字符串
		console.log("字符串请求")
		http(urls, datas, msgs).then((res) => {
			console.log(res);
		})
	}
};

function retData(pm_code, pm_msg, pm_http) {
	var ret = {};
	ret.code = pm_code;
	ret.msg = pm_msg;
	ret.http = pm_http
	return ret;
}

//请求方法
let httpFunc = function(pm_data) {

	let config = uni.getStorageSync("config"); //从缓存中取出要请求的地址
	let p_url = baseUrl;
	if (config) {
		p_url = config.urls[pm_data.url_type]; //通过键值来取
	}
	// if (pm_data.url_type && pm_data.url_type == 'center') {
	// 	p_url = centerUrl;
	// }
	// if (pm_data.data && !pm_data.data.brand) { //brand给默认值
	// 	pm_data.data.brand = "MobilePos_API.Models";
	// }
	return new Promise(function(resolve, reject) {
		uni.request({
			url: p_url + pm_data.http.url,
			method: pm_data.method || "POST",
			header: {
				'Content-Type': pm_data.method == 'GET' ?
					'application/x-www-form-urlencoded' : "application/json"
			},
			data: pm_data.data,
			success: (res) => {

				if (res.statusCode == 200) {
					return resolve(res.data);
				} else {
					return resolve(new retData(false, res.errMsg));
				}
			},
			fail: (res) => {

				console.log(res);
				// return resolve(new retData(false, res.errMsg));
				return resolve(new retData(false, "网络错误!"));
			}
		})
	})
	//去除catch 因为没有回调方法来处理 
	// .catch(function(reason) {
	// 	//if (catchfun)
	// 	//catchfun(reason);
	// 	console.log('异常捕捉catch:', reason);
	// 	return reject(new retData(false, reason.errMsg));
	// });
}

//处理回调的地方 放外面
let forPromise = function(func, pm_data) {
	return new Promise(function(resolve, reject) {
		// func(pm_data)
		// return resolve(pm_data);
		try {
			return resolve(func(pm_data));
		} catch (e) {
			return resolve(new retData(false, e.message));
		}
	})
};
///作为异常和finally 的默认载体   
let def = function(pm_callback, pm_data) {
	uni.hideLoading();
	if (pm_callback) {
		pm_callback(pm_data);
	}
}

/// 
/// res  =  { code:ture/false,msg:"消息",http:{url，title,method}，data:{}} 
/// 异步处理方法旧版本
var asyncFunc1 = async function RequestDataArray(pm_data, callbackfun, callbackfun2, callbackfun3, catchfun,
	finallyfun) {
	var callbacklist = [];
	for (var i = 1; i <= 3; i++) {
		if (arguments[i]) {
			callbacklist.push(arguments[i]);
		}
	}
	let res = pm_data;
	for (var i = 0; i < callbacklist.length; i++) {
		if (res && res.http) {
			res = await httpFunc(res);
			if (res && !res.code) {
				def(catchfun, res);
				break;
			}
		}
		res = await forPromise(callbacklist[i], res);
		if (res && !res.code) {
			def(catchfun, res);
			break;
		}
	}
	//到这里 应该httpFunc 与  forPromise 都执行完成且状态改变 应该直接运行即可
	def(finallyfun, res);
	/*
	Promise.all([httpFunc, forPromise]).then(function(f_res) {
		if (finallyfun)
			finallyfun(f_res);
	})
	*/
};

var asyncFunc = async function(pm_data, callbackfun, callbackfun2, callbackfun3, catchfun, finallyfun) {
	var callbacklist = [];
	for (var i = 1; i <= 3; i++) {
		if (arguments[i]) {
			callbacklist.push(arguments[i]);
		}
	}
	let res = pm_data;
	await asyncFuncArr(pm_data, callbacklist, catchfun, finallyfun);
};

var showloding = function(yn_show, pm_txt) {
	if (yn_show && pm_txt) {
		uni.showLoading({
			title: pm_txt || "加载中...",
			mask: true
		});
	}
}

var hideloding = function(yn_show, pm_txt) {
		uni.hideLoading();
}

var asyncFuncOne = async function(pm_data, callbackfun, catchfun) {
	return await asyncFunc(pm_data, callbackfun, null, null, catchfun, null);
}

var asyncFuncArr = async function(pm_data, callbackfunArr, catchfun, finallyfun) {
	var callbacklist = [];
	callbacklist = callbackfunArr;
	let res = pm_data;
	for (var i = 0; i < callbacklist.length; i++) {
		if (res && res.http) {
			console.log("[AsyncFuncArr]http请求:", res);
			showloding(res.http.load, res.http.title);
			res = await httpFunc(res);
			console.log("[AsyncFuncArr]http返回值:", res);
			hideloding(); 
			if (res && !res.code) {
				def(catchfun, res);
				break;
			}
		}
		showloding(res.load, res.msg);
		res = await forPromise(callbacklist[i], res)
		// console.log("回调函数" + i.toString() + JSON.stringify(res).substring(0, 100));
		if (res && !res.code) {
			console.log("回调函数异常了" + i.toString() + JSON.stringify(res));
			def(catchfun, res);
			break;
		}
	}
	hideloding();
	//到这里 应该httpFunc 与  forPromise 都执行完成且状态改变 应该直接运行即可
	def(finallyfun, res);
}

/**
 * 重载方法（不中断调用-用于退款操作）
 * @param {*} pm_data 请求数据
 * @param {*} callbackfunArr 回调数组
 * @param {*} catchfun 异常处理函数
 * @param {*} finallyfun 末端执行的函数
 * @param {*} resultsFunc 获取所有请求返回值的函数（返回包括首次、所有回调，依次按顺序连接，类似 Promise.all 的返回操作）
 */
var asyncFuncChain = async function(pm_data, callbackfunArr, catchfun, finallyfun, resultsFunc) {
	var callbacklist = [],
		results = [];
	callbacklist = callbackfunArr;
	let res = pm_data;
	for (var i = 0; i <= callbacklist.length; i++) {
		if (res && res.http) {
			console.log("[AsyncFuncChain]http请求:", res);
			showloding(res.http.load, res.http.title);
			res = await httpFunc(res); //发起请求
			console.log("[AsyncFuncChain]http请求结果:", res);
			results.push(res); //存入执行结果
			if (res && !res.code) { //如果请求失败，则调用配置的catch函数
				def(catchfun, res);
			}
		}
		showloding(res.load, res.msg);
		res = await forPromise(callbacklist[i], res);
	}
	//到这里 应该httpFunc 与  forPromise 都执行完成且状态改变 应该直接运行即可
	if (finallyfun) def(finallyfun, res);
	//将所有回调执行结果，通过回调传递到外部
	if (resultsFunc) def(resultsFunc, results);
	return results; //返回总执行结果集合
}

var asyncFuncArr1 = async function(pm_data, callbackfunArr, catchfun, otherfun, finallyfun) {
	var callbacklist = [];
	callbacklist = callbackfunArr;
	let res = pm_data;
	for (var i = 0; i <= callbacklist.length; i++) {
		if (res && res.http) {
			showloding(res.http.load, res.http.title);
			res = await httpFunc(res); //发起请求
			if (res && !res.code) { //如果请求失败，则调用配置的catch函数
				def(catchfun, res);
				break;
			}
		}
		showloding(res.load, res.msg);
		res = await forPromise(callbacklist[i], res);
		if (res && !res.code) { //如果是主动抛出的false 则执行自定义函数
			def(otherfun, res);
			break;
		}
	}
	//到这里 应该httpFunc 与  forPromise 都执行完成且状态改变 应该直接运行即可
	if (finallyfun) def(finallyfun, res);
}
var resObj = function(pm_code, pm_msg, pm_data, pm_url, pm_load) {
	let urlx = pm_url || '';
	let urlArr = urlx.split('.')
	let httpParm = null;
	let reqData = {};
	if (urlArr && urlArr.length >= 3) {

		httpParm = {
			url: "ReqMuster/Handle",
			title: pm_msg,
			method: "POST",
			load: pm_load == null ? true : pm_load,
		};

		reqData.data = pm_data ? JSON.stringify(pm_data) : null;
		reqData.brand = urlArr.slice(0, urlArr.length - 2).join('.');
		reqData.ywname = urlArr[urlArr.length - 2];
		reqData.action = urlArr[urlArr.length - 1];
	} else {
		reqData = pm_data;
		httpParm = null;
	}
	var ret = {
		code: pm_code,
		msg: null,
		http: httpParm,
		data: reqData,
		load: pm_load ? true : false
	}
	return ret;
}

var getResData = function(res) {
	let resdata = JSON.parse(res.data);
	return resdata.data ? JSON.parse(resdata.data) : resdata;
}

export default {
	http,
	Post,
	resObj,
	retData,
	asyncFunc,
	asyncFuncOne,
	asyncFuncArr,
	asyncFuncArr1,
	asyncFuncChain,
	getResData
}
