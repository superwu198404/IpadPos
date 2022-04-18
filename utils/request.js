const baseUrl = 'https://localhost:44313/Api/'

const showToast = (title) => {
	uni.showToast({
		title: title,
		icon: 'none'
	})
}

/**请求接口
 * @method http
 * @param {String} url 接口地址
 * @param {Object} data 接口参数
 * @param {Object} option 接口配置信息，可选
 * @param {string} option 加载提示信息，可选
 * @return {Object} Promise
 */
const http = (url, data = {}, msg = "加载中...", option = {}) => {
	let hideLoading = option.hideLoading || false // 是否显示 loading
	let hideMsg = option.hideMsg || false // 是否隐藏错误提示
	let token = uni.getStorageSync("auth"); //获取接口凭证
	if (!hideLoading) {
		uni.showLoading({
			title: msg,
			mask: true
		})
	}
	// debugger;
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: option.method || 'POST', // 默认 post 请求
			header: {
				'auth': token
			},
			data: data,
			success: res => { // 服务器成功返回的回调函数
				if (!hideLoading) uni.hideLoading()
				if (res.statusCode === 200) {
					let result = res.data
					if (result.code >= 0) {
						resolve(result)
						return
					}
					reject(result.msg)
					if (!hideMsg) showToast(result.msg)
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
	})
}

export default {
	http
}
