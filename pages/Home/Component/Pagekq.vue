<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="navmall">
		<view class="logo">
			<image src="@/images/KGlogo-2.png" mode="widthFix"></image>
		</view>
		<view class="menu" style="overflow-y:auto;overflow-x:hidden;">
			<view class="bills" v-for="(item,key) in menukq" @click="MenuSelect(key,item)"
				:class="Selected(key) ? 'curr' : ''">
				<label></label>
				<image class="xz" :src="item.icon_open" mode="widthFix"></image>
				<image class="wx" :src="item.icon_close" mode="widthFix"></image>
				<text>{{item.nameSale}}</text>
			</view>
		</view>
		<!-- 重打小票 -->
		<!-- <cdxp v-if="showcdxp" @ClosePopup="ClosePopup"></cdxp> -->
	</view>
</template>

<script>
	
	import Promotion from '@/pages/Promotion/Promotion.vue'; //页面注册为组件
	export default {
		components: {
			Promotion
		},
		name: "Page",
		props: {
			current: String
		},
		computed: {
			
		},
	
		data() {
			return {
				menukq: [
					{
						icon_open: '@/image/img2/kakaka-hui.png',
						icon_close: '@/image/img2/kakaka.png',
						nameSale:'VIP卡充值'
					},
					{
						icon_open: '@/image/img2/lpkjih-bai.png',
						icon_close: '@/image/img2/lpkjih.png',
						nameSale:'礼品卡激活'
					},
					{
						icon_open: '@/image/img2/quanquan-hui.png',
						icon_close: '@/image/img2/quanquan.png',
						nameSale:'券销售'
					},
					{
						icon_open: '@/image/img2/kachaxun.png',
						icon_close: '@/image/img2/kachaxun-bai.png',
						nameSale:'卡查询'
					},
					,
					{
						icon_open: '@/image/img2/quancx.png',
						icon_close: '@/image/img2/quancx-bai.png',
						nameSale:'券查询'
					}
				],
				Selected:0,
					//点击事件要控制的参数 页面的层级都为0 所以 v-if 所在的容器隐藏了，通过这个属性来控制
				};
		},
		methods: {
			
		},
	}
</script>

<style>
	.menu {
		padding: 0px;
		outline: 0px;
	}
</style>
