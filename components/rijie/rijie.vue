<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs" v-if="rj_show">
		<view class="customer" v-if="rj_sf">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<view class="h3">日结 <button @click="Close()" class="guan">×</button></view>
			<view class="clues">
				<image src="@/images/rijie.png" mode="widthFix"></image>
				<text>您确定当前要进行日结操作吗？</text>
			</view>
			<view class="affirm"><button class="btn btn-hk">取消</button><button class="btn">确定</button></view>
		</view>
		<view class="customer" v-if="rj_cg">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<view class="h3">日结 <button @click="Close()" class="guan">×</button></view>
			<view class="clues">
				<image src="@/images/rijie.png" mode="widthFix"></image>
			</view>
			<label class="rjcg">日结成功</label>
		</view>
	</view>
	
</template>

<script>
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
		width: 90%;
		height: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 2%;
	}

	.affirm button {
		width: 46%;
		margin:0 2%;
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
	.clues image{
		margin:2% 0 0 4%;
	}
	.rjcg{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top:100rpx;
		color: #006B44;
		font-weight: 700;
		font-size: 40rpx;
	}
</style>
