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
	import base_sale from '@/utils/sale/base_sale.js'
	import util from '@/utils/util.js';
	import db from '@/utils/db/db_excute.js';
	import Promotion from '@/pages/Promotion/Promotion.vue'; //页面注册为组件
	export default {
		components: {
			Promotion
		},
		name: "Pagekq",
		props: {
			current: String
		},
		computed: {
			Selected: function() {
				return util.callBind(this, function(name) {
					return name === this.current_info?.name;
				});
			},
		},
		watch: {
			current: function(n, o) {
				this.current_info.name = n;
				this.current_info.info = this.menu_info[n];
			}
		},
		data() {
			return {
				menukq: [
					{
						icon_open: require('@/images/img2/kakaka.png'),
						icon_close: require('@/images/img2/kakaka-hui.png'),
						nameSale:'VIP卡充值'
					},
					{
						icon_open: require('@/images/img2/lpkjih-bai.png'),
						icon_close: require('@/images/img2/lpkjih.png'),
						nameSale:'礼品卡激活'
					},
					{
						icon_open: require('@/images/img2/quanquan.png'),
						icon_close: require('@/images/img2/quanquan-hui.png'),
						nameSale:'券销售'
					},
					{
						icon_open: require('@/images/img2/kachaxun-bai.png'),
						icon_close: require('@/images/img2/kachaxun.png'),
						nameSale:'卡查询'
					},
					
					{
						icon_open: require('@/images/img2/quancx-bai.png'),
						icon_close: require('@/images/img2/quancx.png'),
						nameSale:'券查询'
					}
				],
				
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
	.menu .bills{
		padding:14% 0;
	}
</style>
