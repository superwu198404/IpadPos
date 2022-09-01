<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs" v-if="qd_show">
		<view class="customer">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<!-- <view class="h3">提示 <button @click="Close()" class="guan">×</button></view> -->
			<view class="clues">
				<image src="@/images/qiandao.gif" mode="widthFix"></image>
				<text>请先进行签到~</text>
			</view>
			<view class="affirm"><button class="btn btn-qr">签到</button></view>
		</view>
	</view>
</template>

<script>
</script>

<style>
	.customer {
		background-color: #fff;
		width: 45%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 0 180rpx;
	}

	.customer .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
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
		padding-bottom: 20rpx;
	}

	.affirm button {
		width: 50%;
		background-color: #42B14B;
		color: #fff;
	}

	.clues {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
	}
	.clues image{
		width:100%;
	}
	.clues text{
		margin-top:-180rpx;
		font-weight: 700;
	}
</style>
