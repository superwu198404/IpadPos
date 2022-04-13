<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text v-on:click='change()' class="title">{{title+"："+context}}</text>
		</view>
 
 
	</view>

</template>
<script>
	import Dialog from '../../static/js/dialog.js'
	export default {
		//变量初始化
		data() {
			return {
				title: 'Hello',
				context: "点了",
				lists: ['a', 'b', 'c'],
				lst: [{
					str: 'a'
				}, {
					str: 'b'
				}, {
					str: 'c'
				}]
			}
		},
		//接收上个页面传入的参数
		onLoad(option) {
			//this.change("world");    
		},
		//方法初始化
		methods: {
			change: function(msg) {
				let that=this;
				 this.$store.dispatch('popup/open', {
				 	title: '提示',
				 	content: '修改按钮和颜色',
				 	confirmText: '好的',
				 	cancelText: '知道了',
				 	confirmColor: 'red',
				 	cancelColor: '#2878ff',
				 	otherIco:'../../static/icons/transition.png',
				 	showTitleIco:true,
				 	confirm(res) 
					{
						that.context=res.confirmText
				 	},
				 	cancel(res) {
							that.context=res.cancelText
				 	},
					other(res){
						that.context=res.otherText
					}
				 });
			},
			cc: bb 
		
		},
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
