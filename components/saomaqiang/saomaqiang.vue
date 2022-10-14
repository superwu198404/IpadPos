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
</style>