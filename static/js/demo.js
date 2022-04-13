export function openPopup() {
	getApp().globalData.store.dispatch('popup/open', {
		showCancel: true,
		title: '我是js中打开的弹窗',
		content: '我是js中打开的弹窗内容内容内容内容内容内容内容内容内容内容内容',
		confirmText: '好的',
		cancelText: '知道了',
		confirmColor: 'red',
		cancelColor: '#2878ff',
		btnType: 1,
		maskClick: true,
		confirm(res) {
			console.log('点击确定回调：', res)
		},
		cancel(res) {
			console.log('点击取消回调：', res)
		}
	});
}
