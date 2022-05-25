<template>
	<view>
		<button @click="Pay(0)">开始结算</button>
		<button @click="Pay(1)">开始退款</button>
		<button @click="Pay(2)">查询会员</button>
	</view>
</template>
<script>
	import db from '@/utils/db/db_excute.js';
	import create_sql from '@/utils/db/create_sql.js';
	export default {
		//变量初始化
		data() {
			return {}
		},
		//方法初始化
		methods: {

			Pay: function(e) {
				if (e == 0) {
					uni.navigateTo({
						url: "../Payment/Payment"
					})
				} else if (e == 1) {
					uni.navigateTo({
						url: "../Refund/Refund"
					})
				} else if (e == 2) {
					uni.navigateTo({
						url: "../hy/index"
					})
				}
			},
			change: function(e) {
				
				// uni.showModal({
				// 	title: '提示',
				// 	content: '这是一个模态弹窗',
				// 	success: function (res) {
				// 		if (res.confirm) {
				// 			console.log('用户点击确定');
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消');
				// 		}
				// 	}
				// });
				// this.$store.dispatch('popup/open', {
				// 	title: '提示',
				// 	content: '修改按钮和颜色',
				// 	showOther:true,
				// showCancel:false,
				// showConfirm:false,
				// 	confirm(res) 
				// {
				// 	that.context=res.confirmText
				// 	},
				// 	cancel(res) {
				// 		that.context=res.cancelText
				// 	},
				// other(res){
				// 	that.context=res.otherText
				// }
				// });

				this.$showModal({
					concent: '测试测试~',
					showCancel: true,
					showOther: true,
					confirmVal: '知道了',
					align: 'left',
					$confirm: function(res) {
						console.log("$confirm");
					},
					$cancel: function(res) {
						console.log("$cancel");
					},
					$other: function(res) {
						console.log("$other");
					}
				});
			},
		},
		//接收上个页面传入的参数
		onLoad(option) {
			//this.change("world");    
			console.info("onLoad");
		},
		onShow() {

		},
		onReady() {
			//监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发

		},
		onHide() {
			//监听页面隐藏
		},
		onUnload() {
			//监听页面卸载
		},
		onResize() {
			//监听窗口尺寸变化
		},
		onPullDownRefresh() {
			//监听用户下拉动作，一般用于下拉刷新，参考
		},
		onReachBottom() {
			//页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。具体见下方注意事项
		},
		onTabItemTap() {
			//点击 tab 时触发，参数为Object
		},
		onShareAppMessage() {
			//用户点击右上角分享
		},
		onPageScroll() {
			//监听页面滚动 参数为Objec
		},
		onNavigationBarButtonTap() {
			//监听原生标题栏按钮点击事件 参数为Object
		},
		onBackPress() {
			//监听页面返回  
			console.info("onBackPress");
		},
		onNavigationBarSearchInputChanged() {
			//监听原生标题栏搜搜输入框输入内容变化事件
		},
		onNavigationBarSearchInputConfirmed() {
			//监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的搜素按钮是出发
		},
		onNavigationBarSearchInputClicked() {
			//监听原生标题栏搜搜输入框点击事件 （pages.json 中的 searchInput 配置 disabled 为 true 时才会触发）
		},
		onShareTimeline() {
			//监听用户点击又上角转发到朋友圈
		},
		onAddToFavorites() {
			//监听用户点击右上角收藏
		}
	}
	//可定义方法和变量
	function bb() {
		console.info("bb");
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
