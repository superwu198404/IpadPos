export default {
	/**
	 * 页面跳转
	 * @param {string} to 跳转链接 /pages/index/index
	 * @param {Object} param 参数 {key : value, ...}
	 * @param {string} mode 模式 
	 */
	redirectTo(to, param, mode) {
		let url = to;
		// tabbar数组
		let tabbarList = ['/pages/index/index1/index', '/pages/index/index2/index', '/pages/index/index3/index']
		for (let i = 0; i < tabbarList.length; i++) {
			if (to.indexOf(tabbarList[i]) != -1) {
				uni.switchTab({
					url: url
				})
				return;
			}
		}
		// 参数
		if (param != undefined) {
			Object.keys(param).forEach(function(key) {
				if (url.indexOf('?') != -1) {
					url += "&" + key + "=" + param[key];
				} else {
					url += "?" + key + "=" + param[key];
				}
			});
		}
		// 跳转
		switch (mode) {
			case 'tabbar':
				// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
				uni.switchTab({
					url: url
				})
				break;
			case 'redirectTo':
				// 关闭当前页面，跳转到应用内的某个页面。
				uni.redirectTo({
					url: url
				});
				break;
			case 'reLaunch':
				// 关闭所有页面，打开到应用内的某个页面。
				uni.reLaunch({
					url: url
				});
				break;
			default:
				// 保留当前页面，跳转到应用内的某个页面
				uni.navigateTo({
					url: url
				});
		}
	},

	/**
	 * 判断当前页面栈是否存在，如果存在，则返回该页面栈，否则跳转到该页面
	 * @param {Object} url
	 */
	jumpPage(url) {
		let jump = true;
		let arr = getCurrentPages().reverse();
		for (let i = 0; i < arr.length; i++) {
			if (url.indexOf(arr[i].route) != -1) {
				jump = false;
				uni.navigateBack({
					delta: i
				});
				break;
			}
		}
		if (jump) {
			this.$util.diyRedirectTo(url);
		}
	},
 

}


