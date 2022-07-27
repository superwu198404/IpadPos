<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="content">
		<view class="navmall">
			<view class="logo">
				<image src="../../images/kengee-logo.png" mode="widthFix"></image>
			</view>
			<view class="menu">
				<view :class="menuIndex==0?'curr':''" @click="ToPage('../../pages/Main/Main')">
					<image class="xz" src="../../images/xiaoshou-hui.png" mode="widthFix"></image>
					<image class="wx" src="../../images/xiaoshou.png" mode="widthFix"></image>
					<text>销售</text>
				</view>
				<view :class="menuIndex==1?'curr':''" @click="ToPage('../../pages/Reserve/Reserve')">
					<image class="xz" src="../../images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="../../images/yuding-hui.png" mode="widthFix"></image>
					<text>预定</text>
				</view>
				<view :class="menuIndex==2?'curr':''" @click="ToPage('../../pages/Reserve/Reserve')">
					<image class="xz" src="../../images/xz-ydtq.png" mode="widthFix"></image>
					<image class="wx" src="../../images/wxz-ydtq.png" mode="widthFix"></image>
					<text>预定提取</text>
				</view>
				<view :class="menuIndex==3?'curr':''" @click="ToPage('../../pages/TakeAway/TakeAway')">
					<image class="xz" src="../../images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="../../images/yuding-hui.png" mode="widthFix"></image>
					<text>外卖单</text>
				</view>
				<view :class="menuIndex==4?'curr':''" @click="ToPage('../../pages/OnlineOrders/OnlineOrders')">
					<image class="xz" src="../../images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="../../images/yuding-hui.png" mode="widthFix"></image>
					<text>线上订单</text>
				</view>
				<view :class="menuIndex==5?'curr':''" @click="Chargeback=true">
					<image class="xz" src="../../images/xz-th.png" mode="widthFix"></image>
					<image class="wx" src="../../images/wxz-th.png" mode="widthFix"></image>
					<text>退单业务</text>
					<view class="chargeback" v-if="Chargeback">
						<label class="currs">
							<image class="xz" src="../../images/xstd.png" mode="widthFix"></image>
							<image class="wx" src="../../images/xstd-wxz.png" mode="widthFix"></image>
							<text>销售退单</text>
						</label>
						<label>
							<image class="xz" src="../../images/ydqx.png" mode="widthFix"></image>
							<image class="wx" src="../../images/ydqx-wxz.png" mode="widthFix"></image>
							<text>预订取消</text>
						</label>
						<label>
							<image class="xz" src="../../images/sxtd.png" mode="widthFix"></image>
							<image class="wx" src="../../images/sxtd-wxz.png" mode="widthFix"></image>
							<text>赊销退单</text>
						</label>
					</view>
				</view>
				<view :class="menuIndex==6?'curr':''" @click="ToPage('../../pages/Message/Message')">
					<image class="xz" src="../../images/xz-xx.png" mode="widthFix"></image>
					<image class="wx" src="../../images/xiaoxi-hui.png" mode="widthFix"></image>
					<text>消息</text>
				</view>
			</view>

			<view class="exit">
				<image src="../../images/tuichu.png" mode="widthFix"></image>
				<text @click="LoginOut()">退出</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "menu_page",
		data() {
			return {

			};
		},
		props: {
			menuIndex: 0,
			Chargeback:false
		},
		methods: {
			ToPage: function(e) {
				console.log("触发没，",e);
				uni.redirectTo({
					url: e,
					complete:r=>{
						console.log(r);
					}
				})
			}
		}
	}
</script>

<style>

</style>
