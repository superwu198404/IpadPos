<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<!-- <view class="boxs"> -->
		<!-- v-if="qd_show" -->
		<view class="customer">
			<image class="bg" src="@/images/dx-tchw.png" mode="widthFix"></image>
			<view class="h3">输入扫码枪标号 <button @click="Close()" class="guan">×</button></view>
			<view class="clues">
				<input type="text" placeholder="请输入"/>
			</view>
			<view class="affirm">
				<button class="btn btn-hk" @click="Close()">取消</button>
				<button class="btn" @click="Sign()">确定</button>
			</view>
		</view>
	<!-- </view> -->
</template>
<script>
</script>

<style>
	.customer {
		background-color: #fff;
		width: 46%;
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
		position: absolute !important;
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

	.customer .h6 {
		color: #FE694B;
		line-height: 80rpx;
		font-size: 32rpx;
		font-weight: 600;
		position: relative;
		z-index: 9;
	}

	.cluelist {
		display: flex;
		flex-wrap: wrap;
	}

	.cluelist .list {
		width: 22.5%;
		margin: 0 1% 2%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2% 0;
		font-weight: 600;
		border: 2rpx solid #98C3B3;
		border-radius: 14rpx;
		font-size: 28rpx;
		line-height: 50rpx;
	}

	.cluelist .list.curr {
		border-color: #006B44;
		color: #006B44;
	}

	.cluelist .list.curr text {
		color: #006B44;
	}

	.cluelist .list text {
		font-size: 26rpx;
		color: #B0b0b0;
		line-height: 50rpx;
		font-weight: 400;
	}

	.affirm {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 2%;
	}

	.affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.clues {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		line-height: 140rpx;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
		font-weight: 700;
	}

	.clues image {
		margin: 2% 0 0 4%;
	}

	.rjcg {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 100rpx;
		color: #006B44;
		font-weight: 700;
		font-size: 40rpx;
	}
</style>
