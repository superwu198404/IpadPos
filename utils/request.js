import configInfo from '@/utils/configInfo.js'; //配置参数

const baseUrl = configInfo.baseUrl;
const jkptUrl = configInfo.jkptUrl;
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
	if (option.url == 'jkpt') {
		p_url = jkptUrl;
	}
	if (option.url == 'center') {
		p_url = centerUrl;
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
	this.code = pm_code;
	this.msg = pm_msg;
	this.http = pm_http

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
	if (!pm_data.load && pm_data.load != false) { //为空则默认显示加载框
		uni.showLoading({
			title: pm_data.title || "加载中..."
		});
	}
	let p_url = baseUrl;
	let config = uni.getStorageSync("config");
	if (config) {
		p_url = config.ywurl;
	}
	if (pm_data.url_type && pm_data.url_type == 'jkpt') {
		p_url = jkptUrl;
	}
	if (pm_data.url_type && pm_data.url_type == 'center') {
		p_url = centerUrl;
	}
	return new Promise(function(resolve, reject) {
		uni.request({
			url: p_url + pm_data.url,
			method: pm_data.method || "POST",
			header: {
				'Content-Type': pm_data.method == 'GET' ?
					'application/x-www-form-urlencoded' : "application/json"
			},
			data: pm_data.data,
			success: (res) => {
				if (!pm_data.load && pm_data.load != false) { //为空则关闭默认加载框
					uni.hideLoading();
				}
				if (res.statusCode == 200) {
					return resolve(res.data);
				} else {
					return resolve(new retData(false, res.errMsg));
				}
			},
			fail: (res) => {
				if (!pm_data.load && pm_data.load != false) { //为空则关闭默认加载框
					uni.hideLoading();
				}
				console.log(res);
				return resolve(new retData(false, res.errMsg));
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
			return reject(new retData(false, e.message));
		}
	})
};
///作为异常和finally 的默认载体   
let def = function(pm_callback, pm_data) {
	if (pm_callback) {
		pm_callback(pm_data);
	}
}
/// 
///  res  =  { code:ture/false,msg:"消息",http:{url，title,method}，data:{}} 
//异步处理方法3
var asyncFunc = async function RequestDataArray2(pm_data, callbackfun, callbackfun2, callbackfun3, catchfun,
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
		res = await forPromise(callbacklist[i], res)

		if (res && !res.code) {
			def(catchfun, res);
			break;
		}
	}
	//到这里 应该httpFunc 与  forPromise 都执行完成且状态改变 应该直接运行即可
	if (finallyfun) def(finallyfun, res);
	/*
	Promise.all([httpFunc, forPromise]).then(function(f_res) {
		if (finallyfun)
			finallyfun(f_res);
	})
	*/
};



export default {
	http,
	Post,
	asyncFunc
}
