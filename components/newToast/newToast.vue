<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs" v-if="yn_show">
		<view class="customer">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<view class="h3">提示 <button @click="Close()" class="guan">×</button></view>
			<view class="clues">
				<text>这是一句提示语~</text>
			</view>
			<view class="affirm"><button class="btn btn-qr" @click="Close()">({{sec}}s)</button></view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	export default {
		name: "newToast",
		props: {
			title: "",
			yn_show: false
		},
		
		data() {
			return {
				sec: 3,
			};
		},
		methods: {
			AutoClose:function(){
				let index = setInterval(util.callBind(this,function() {
					console.log("[AutoClose]倒数：", this.sec);
					if (this.sec > 0) {
						this.sec -= 1;
					} else {
						clearInterval(index);
						this.sec = 3;//重置计时
						this.$emit("Close",{ msg:"消息关闭"});
					}
				}), 1000);
			},
			Close:function(){
				this.$emit("Close",{ msg:"消息关闭"});
			}
		},
		created: function() {
			this.AutoClose();
		}
	}
</script>

<style>
	.customer {
		background-color: #fff;
		width: 40%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 3% 140rpx;
	}

	.customer .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
	}

	.customer .h3 {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 34rpx;
		border-bottom: 1px dashed #eee;
		position: relative;
		z-index: 2;
		font-weight: 700;
	}

	.customer .h3 .guan {
		float: right;
		background: none;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: right;
		padding: 0;
		width: 60rpx;
	}

	.affirm {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.affirm button {
		width: 50%;
		background-color: #ddd;
		color: #333;
	}

	.clues {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 300rpx;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
	}
</style>
