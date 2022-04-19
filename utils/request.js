import configInfo from '@/utils/configInfo.js';//配置参数

const baseUrl =configInfo.baseUrl;
const jkptUrl =configInfo.jkptUrl;

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

export default {
	http,
	Post
}
