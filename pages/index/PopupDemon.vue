<template>
	<view class="content">
		<button type="default" class="btn" @click="open">
			<text class="text">基础用法</text>
		</button>
		<button type="default" class="btn" @click="open2">
			<text class="text">修改按钮和颜色</text>
		</button>
		<button type="default" class="btn" @click="open3">
			<text class="text">只显示确认按钮</text>
		</button>
		<button type="default" class="btn" @click="open4">
			<text class="text">禁止点蒙层关闭</text>
		</button>
		<button type="default" class="btn" @click="open5">
			<text class="text">按钮交换位置</text>
		</button>
		<button type="default" class="btn" @click="open6">
			<text class="text">修改标题和内容颜色</text>
		</button>
	</view>
</template>
<script>
 
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {},
		methods: {
			open() {
				this.$store.dispatch('popup/open', {
					title: '提示',
					content: '基础用法',
					confirm(res) {
						console.log('点击确定回调：', res)
					},
					cancel(res) {
						console.log('点击取消回调：', res)
					},
					other(res){
						console.log('点击other回调：', res)
					}
				});
			},
			open2() {
				this.$store.dispatch('popup/open', {
					title: '提示',
					content: '修改按钮和颜色',
					confirmText: '好的',
					cancelText: '知道了',
					confirmColor: 'red',
					cancelColor: '#2878ff',
					otherIco:'../../static/icons/transition.png',
					showTitleIco:true,
					confirm(res) {
						console.log('点击确定回调：', res)
					},
					cancel(res) {
						console.log('点击取消回调：', res)
					}
				});
			},
			open3() {
				this.$store.dispatch('popup/open', {
					showCancel: true,
					showOther:true,
					title: '提示',
					content: '只显示确认按钮',
					confirm(res) {
						console.log('点击确定回调：', res)
					},
					cancel(res) {
						console.log('点击取消回调：', res)
					}
				});
			},
			open4() {
				this.$store.dispatch('popup/open', {
					maskClick: false,
					title: '提示',
					content: '禁止点蒙层关闭',
					confirm(res) {
						console.log('点击确定回调：', res)
					},
					cancel(res) {
						console.log('点击取消回调：', res)
					}
				});
			},
			open5() {
				this.$store.dispatch('popup/open', {
					btnType: 2,
					title: '提示',
					content: '按钮交换位置',
					confirm(res) {
						console.log('点击确定回调：', res)
					},
					cancel(res) {
						console.log('点击取消回调：', res)
					}
				});
			},
			open6() {
				this.$store.dispatch('popup/open', {
					title: '提示',
					titleColor:'pink',
					content: '修改标题和内容颜色',
					contentColor:'blue',
					confirm(res) {
						console.log('点击确定回调：', res)
					},
					cancel(res) {
						console.log('点击取消回调：', res)
					}
				});
			} 
		}
	}
</script>
<style scoped>
	.btn .text {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 32rpx;
		color: #222;
	}
</style>
