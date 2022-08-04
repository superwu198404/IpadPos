<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/extract.css);
</style>
<template>
	<view>
		<view class="nav">
			<view class="getback">
				<!-- <image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image> -->
				<view class="message">
					<view class="imgs">
						<image src="@/images/tongzhi.png" mode="widthFix"></image>
					</view>
					<text>门店有一条新的外卖配送单消息来啦...</text>
					<!-- <text v-for="(item,index) in data">{{item.title}}</text> -->
				</view>
			</view>
			<view class="stores">
				<view class="checkout">
					<label>
						<image src="@/images/dx-mendian.png" mode="widthFix"></image>{{STORE_NAME}}
					</label>
					<label>
						<image src="@/images/dx-kuantai.png" mode="widthFix"></image>款台号：{{POSID}}
					</label>
				</view>
				<view class="account">
					<text>{{RYID}}</text>
					<view>
						<image src="@/images/touxiang.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "menu_head",
		props:{
			data:[]
		},
		data() {
			return {
				STORE_NAME: getApp().globalData.store.NAME,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID
			};
		},
	}
</script>

<style>

</style>
