import configInfo from '@/utils/configInfo.js'; //配置参数

const baseUrl = configInfo.baseUrl;
const jkptUrl = configInfo.jkptUrl;

const showToast = (title, icon = "none") => {
	uni.showToast({
		title: title,
		icon: icon
	})
}

/**请求接口
 * @method http
 * @param {String} url 接口地址1
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
	if (option.url) {
		p_url = p_url == 'jkpt' ? jkptUrl : baseUrl;
	}
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
					if (result.code >= 0 || result.code == 'S') {
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
				debugger;
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

const httpArr = async function RequestDataArray(pm_data, content, method, callbackfun, callbackfun2, catchfun,
	finallyfun) {
	var callbacklist = [];
	if (callbackfun) {
		callbacklist.push(callbackfun);
	}
	if (callbackfun2) {
		callbacklist.push(callbackfun2);
	}
	var funm = function() {
		uni.showLoading({
			title: content,
			mask: true,
			icon: "none",
			duration: 0
		});
		return new Promise(function(resolve, reject) {
			uni.request({
				url: baseUrl + "Values/GetData",
				method: method,
				header: {
					'Content-Type': method == 'GET' ? 'application/x-www-form-urlencoded' :
						"application/json"
				},
				data: pm_data,
				success: (res) => {
					uni.hideLoading();
					if (res.data.code) {
						return resolve(res.data);
					} else {
						return reject(res.data.msg);
					}
				},
				fail: (res) => {
					uni.hideLoading();
					return reject(res);
				}
			})
		}).catch(function(reason) {
			console.log('异常捕捉catch:', reason);
		});
	}
	/*
	p.finally(
	          function()
	          {
	            setTimeout(res=>{
	                
	            wx.hideLoading();
	            },2500);
	          if(finallyfun)
	          {
	            finallyfun();
	          }
	          }

	)*/
	var forPromise = function(func) {
		return new Promise(function(resolve, reject) {
			return resolve(func(res));
		})
	};
	var currentP = null;
	var res;
	for (var i = 0; i < callbacklist.length; i++) {
		if (currentP == null) {
			res = await funm();
		} else {
			res = await forPromise(callbacklist[i]);
		}
		currentP = callbacklist[i];
		callbacklist[i](res);
	}
	if (forPromise != null) {
		await forPromise(currentP);
	}
	Promise.all([funm, forPromise]).then(function(results) {
		if (finallyfun) finallyfun(res);
	})
}

const httpArr1 = async function RequestDataArray(pm_data, content, method, callbackfun, callbackfun2, catchfun,
	finallyfun) {
	var callbacklist = [];
	if (callbackfun) {
		callbacklist.push(callbackfun);
	}
	if (callbackfun2) {
		callbacklist.push(callbackfun2);
	}
	var funm = function() {
		uni.showLoading({
			title: content,
			mask: true,
			icon: "none",
			duration: 0
		});
		return new Promise(function(resolve, reject) {
			uni.request({
				url: baseUrl + "Values/GetData",
				method: method,
				header: {
					'Content-Type': method == 'GET' ? 'application/x-www-form-urlencoded' :
						"application/json"
				},
				data: pm_data,
				success: (res) => {
					uni.hideLoading();
					if (res.data.code) {
						return resolve(res.data);
					} else {
						return reject(res.data.msg);
					}
				},
				fail: (res) => {
					uni.hideLoading();
					return reject(res);
				}
			})
		}).catch(function(reason) {
			if (catchfun)
				catchfun(reason);
			console.log('异常捕捉catch:', reason);
		});
	}
	/*
	p.finally(
	          function()
	          {
	            setTimeout(res=>{
	                
	            wx.hideLoading();
	            },2500);
	          if(finallyfun)
	          {
	            finallyfun();
	          }
	          }

	)*/
	let forPromise = function(func, pm_data) {
		let res;
		try {
			if (pm_data) {
				res = pm_data.data ? pm_data.data : pm_data;
				return new Promise(function(resolve, reject) {
					return resolve(func(res))
				})
			}
		} catch (e) {
			//TODO handle the exception
			return null;
			if (catchfun)
				catchfun(e.message);
		}
	};
	let currentP = null;
	let res;
	try {
		for (var i = 0; i < callbacklist.length; i++) {
			if (currentP == null) {
				debugger;
				res = await funm();
				callbacklist[i](res)
			} else {
				debugger;
				res = await forPromise(callbacklist[i], res);
			}
			currentP = callbacklist[i];
		}
	} catch (e) {
		//TODO handle the exception
		currentP = null;
		if (catchfun)
			catchfun(e.message);
	}
	Promise.all([funm, forPromise]).then(function(f_res) {
		uni.hideLoading();
		console.log(f_res);
		if (finallyfun)
			finallyfun(f_res);
	})
	// if (currentP) {
	// 	await forPromise(currentP, res);
	// }
}
//版本2
const httpArr2 = async function RequestDataArray(pm_data, content, method, callbackfun, callbackfun2, catchfun,
	finallyfun) {
	var callbacklist = [];
	if (callbackfun) {
		callbacklist.push(callbackfun);
	}
	if (callbackfun2) {
		callbacklist.push(callbackfun2);
	}
	var funm = function() {
		uni.showLoading({
			title: content,
			mask: true,
			icon: "none",
			duration: 0
		});
		return new Promise(function(resolve, reject) {
			uni.request({
				url: baseUrl + "Values/GetData",
				method: method,
				header: {
					'Content-Type': method == 'GET' ? 'application/x-www-form-urlencoded' :
						"application/json"
				},
				data: pm_data,
				success: (res) => {
					uni.hideLoading();

					if (res.data.code) {
						return resolve(res.data);
					} else {
						return reject(res.data.msg);
					}
				},
				fail: (res) => {
					uni.hideLoading();
					return reject(res);
				}
			})
		}).catch(function(reason) {
			if (catchfun)
				catchfun(reason);
			console.log('异常捕捉catch:', reason);
		});
	}
	let forPromise = function(func, pm_data) {
		let res;
		try {
			if (pm_data) {
				res = pm_data.data ? pm_data.data : pm_data;
				return new Promise(function(resolve, reject) {
					return resolve(func(res))
				})
			}
		} catch (e) {
			//TODO handle the exception
			return null;
			if (catchfun)
				catchfun(e.message);
		}
	};
	let currentP = null;
	let res;
	try {
		debugger;
		res = await funm();
		for (var i = 0; i < callbacklist.length; i++) {
			currentP = callbacklist[i];
			currentP(res);
			// res = await forPromise(currentP, res);
		}
	} catch (e) {
		//TODO handle the exception
		// currentP = null;
		if (catchfun)
			catchfun(e.message);
	}
	Promise.all([funm, forPromise]).then(function(f_res) {
		console.log("回调执行完毕：" + f_res);
		if (finallyfun)
			finallyfun(f_res);
	})
	// if (currentP) {
	// 	await forPromise(currentP, res);
	// }
}

//请求方法
let httpFunc = function(pm_data) {
	if (!pm_data.url) {
		uni.showModal({
			title: "请求地址不正确",
			icon: "error"
		})
		return;
	}
	uni.showLoading({
		title: pm_data.title || "加载中..."
	});

	return new Promise(function(resolve, reject) {
		uni.request({
			url: baseUrl + pm_data.url,
			method: pm_data.method || "POST",
			header: {
				'Content-Type': pm_data.method == 'GET' ?
					'application/x-www-form-urlencoded' : "application/json"
			},
			data: pm_data.data,
			success: (res) => {
				uni.hideLoading();
				if (res.statusCode == 200) {
					return resolve(res.data);
				} else {
					return reject(res.errMsg);
				}
			},
			fail: (res) => {
				uni.hideLoading();
				return reject(res);
			}
		})
	}).catch(function(reason) {
		if (catchfun)
			catchfun(reason);
		console.log('异常捕捉catch:', reason);
	});
}

//处理回调的地方 放外面
let forPromise = function(func, pm_data) {
	return new Promise(function(resolve, reject) {
		// func(pm_data)
		// return resolve(pm_data);
		return resolve(func(pm_data));
	})
};

//异步处理方法1
var asyncFunc = async function RequestDataArray(pm_data, callbackfun, catchfun, finallyfun) {
	let callbacklist = [];
	if (callbackfun) {
		callbacklist.push(callbackfun);
	}
	let res = pm_data;
	if (pm_data.http) {
		res = await httpFunc(pm_data);
	} else {
		//其他异步操作
	}
	let currentP;
	for (var i = 0; i < callbacklist.length; i++) {
		debugger;
		if (res && res.http) {
			res = await httpFunc(res)
		}
		res = await forPromise(callbacklist[i], res)
	}
	Promise.all([httpFunc, forPromise]).then(function(f_res) {
		if (finallyfun)
			finallyfun(f_res);
	})
};

//异步处理方法2
var asyncFunc1 = async function RequestDataArray1(pm_data, callbackfun, callbackfun2, catchfun, finallyfun) {
	var callbacklist = [];
	if (callbackfun) {
		callbacklist.push(callbackfun);
	}
	if (callbackfun2) {
		callbacklist.push(callbackfun2);
	}
	let res = pm_data;
	if (pm_data.http) {
		res = await httpFunc(pm_data);
	} else {
		//其他异步操作
	}
	let currentP;
	for (var i = 0; i < callbacklist.length; i++) {
		debugger;
		if (res && res.http) {
			res = await httpFunc(res);
		}
		res = await forPromise(callbacklist[i], res)
	}
	Promise.all([httpFunc, forPromise]).then(function(f_res) {
		if (finallyfun)
			finallyfun(f_res);
	})
};

//异步处理方法3
var asyncFunc2 = async function RequestDataArray2(pm_data, callbackfun, callbackfun2, callbackfun3, catchfun,
	finallyfun) {
	var callbacklist = [];
	
	for(var i= 1;i<=3;i++)
	{
	   if( arguments[i])
	   {
		   callbacklist.push(arguments[i]);
	   }
	}
	let res = pm_data;
	for (var i = 0; i < callbacklist.length; i++) {
		debugger;
		if (res && res.http) {
			res = await httpFunc(res);
		}
		res = await forPromise(callbacklist[i], res)
	}
	Promise.all([httpFunc, forPromise]).then(function(f_res) {
		if (finallyfun)
			finallyfun(f_res);
	})
};


export default {
	http,
	Post,
	httpArr,
	httpArr1,
	httpArr2,
	asyncFunc,
	asyncFunc1,
	asyncFunc2
}
