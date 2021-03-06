//全局地址
 // let commonUrl = 'https://lsg.minglangab.cn'

 let commonUrl = ''

// TODO 此处修改不同环境编译
if (process.env.NODE_ENV === 'development') {
	commonUrl = "";
} else {

	commonUrl = "";  

}

// post请求封装
function postRequest(url, data) {
	var promise = new Promise((resolve, reject) => {
		var that = this;

		

		var postData = data;

		var postData = JSON.stringify(data);;
		 uni.showLoading({
			  title: '加载中..'
		  });

		uni.request({
			url: commonUrl + url,
			data: postData,
			method: "POST",

			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},

			success: function(res) {
				if (res.statusCode !== 200) {
					// resolve({data:{message:'发生错误'+res.statusCode}});
					resolve({
						data: {
							message: '服务器繁忙'
						}
					});
					console.log(res)
				}
				if (res.data.code === 24) {
					//清除token
					uni.removeStorageSync('token');
					setTimeout(function() {
						uni.reLaunch({
							url: '../log/login/login'
						})
					}, 500)
				}
				resolve(res);
			},
			timeout: function(e) {
				reject("请检查网络连接");
				uni.showToast({
					icon: 'none',
					title: '请检查网络连接'
				})
				
				console.log(e, 1)
			},
			fail: function(e) {
					uni.showToast({
						icon: 'none',
						title: '请检查网络连接'
					})
				reject("请检查网络连接");

			},
			complete:function(){
				 uni.hideLoading();

			}
		});
	});
	return promise;
}

// get请求封装
function getRequest(url, data) {
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		var timestamp = Date.parse(new Date());
		data["timestamp"] = timestamp;
		uni.request({
			url: commonUrl + url,
			data: postData,
			method: "GET",
			dataType: "json",
			header: {
				"content-type": "application/x-www-form-urlencoded;charset=UTF-8",
			},
			success: function(res) {
				if (res.statusCode !== 200) {
					resolve({
						data: {
							message: '发生错误' + res.statusCode
						}
					});
				}
				if (res.data.code === 24) {
					setTimeout(function() {
						uni.reLaunch({
							url: '../log/login/login'
						})
					}, 500)
				}
				resolve(res);
			},
			error: function(e) {
				reject("请检查网络连接");
			}
		});
	});
	return promise;
}

module.exports = {
	post: postRequest,
	get: getRequest,
	commonUrl
};
