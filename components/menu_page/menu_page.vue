<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="navmall">
		<view class="logo">
			<image src="../../images/KGlogo-2.png" mode="widthFix"></image>
		</view>
		<view class="menu">
			<view v-for="(item,index) in urls" :class="menuIndex==item.index?'curr':''" @click="ToPage(item)">
				<image class="xz" :src="item.icon" mode="widthFix"></image>
				<image class="wx" :src="item.icon1" mode="widthFix"></image>
				<text>{{item.title}}</text>
				<view class="chargeback" v-if="item.details&&item.showDetail">
					<label v-for="(item1,index1) in item.details" :class="sec_index==item1.index?'currs':''"
						@click="ToPage(item1)">
						<image class="xz" :src="item1.icon" mode="widthFix"></image>
						<image class="wx" :src="item1.icon1" mode="widthFix"></image>
						<text>{{item1.title}}</text>
					</label>
				</view>
			</view>
		</view>
		<!-- <view class="exit" @click="LoginOut()">
			<image src="../../images/tuichu.png" mode="widthFix"></image>
			<text>退出</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		name: "menu_page",
		data() {
			return {
			// 	urls: [{
			// 			title: "销售",
			// 			url: "../../pages/Main/Main",
			// 			icon: require('../../images/xiaoshou.png'),
			// 			icon1: require("../../images/xiaoshou-hui.png"),
			// 			index: 0
			// 		},
			// 		{
			// 			title: "预定",
			// 			url: "../../pages/Reserve/Reserve",
			// 			icon: require("../../images/yuding.png"),
			// 			icon1: require("../../images/yuding-hui.png"),
			// 			index: 1
			// 		},
			// 		{
			// 			title: "预定提取",
			// 			url: "../../pages/Extract/Extract",
			// 			icon: require("../../images/xz-ydtq.png"),
			// 			icon1: require("../../images/wxz-ydtq.png"),
			// 			index: 2
			// 		}, {
			// 			title: "外卖单",
			// 			url: "../../pages/TakeAway/TakeAway",
			// 			icon: require("../../images/yuding.png"),
			// 			icon1: require("../../images/yuding-hui.png"),
			// 			index: 3
			// 		},
			// 		{
			// 			title: "外卖预订单",
			// 			url: "../../pages/TakeYD/TakeYD",
			// 			icon: require("../../images/yuding.png"),
			// 			icon1: require("../../images/yuding-hui.png"),
			// 			index: 4
			// 		},
			// 		{
			// 			title: "线上业务",
			// 			url: "",
			// 			icon: require("../../images/xianshangdd.png"),
			// 			icon1: require("../../images/xianshangdd-hui.png"),
			// 			index: 5,
			// 			showDetail: false,
			// 			details: [{
			// 				title: "线上订单",
			// 				url: "../../pages/OnlineOrders/OnlineOrders",
			// 				icon: require("../../images/xsdingdan.png"),
			// 				icon1: require("../../images/xsdingdan-wxz.png"),
			// 				index: 0
			// 			}, {
			// 				title: "线上提取",
			// 				url: "../../pages/OnlinePick/OnlinePick",
			// 				icon: require("../../images/xsddtiqu.png"),
			// 				icon1: require("../../images/xsddtiqu-wxz.png"),
			// 				index: 1
			// 			}]
			// 		},
			// 		{
			// 			title: "退单业务",
			// 			url: "",
			// 			icon: require("../../images/xz-th.png"),
			// 			icon1: require("../../images/wxz-th.png"),
			// 			index: 6,
			// 			showDetail: false,
			// 			details: [{
			// 					title: "销售退单",
			// 					url: "../../pages/RefundOrder/RefundOrder",
			// 					icon: require("../../images/xstd.png"),
			// 					icon1: require("../../images/xstd-wxz.png"),
			// 					index: 0
			// 				},
			// 				// {
			// 				// 	title: "预定退单",
			// 				// 	url: "../../pages/RefundOrder/RefundOrder",
			// 				// 	icon: require("../../images/ydqx.png"),
			// 				// 	icon1: require("../../images/ydqx-wxz.png"),
			// 				// 	index: 1
			// 				// }, 
			// 				{
			// 					title: "赊销退单",
			// 					url: "../../pages/RefundOrder/SXRefund",
			// 					icon: require("../../images/sxtd.png"),
			// 					icon1: require("../../images/sxtd-wxz.png"),
			// 					index: 2
			// 				}
			// 			]
			// 		},
			// 		{
			// 			title: "消息",
			// 			url: "../../pages/Message/Message",
			// 			icon: require("../../images/xz-xx.png"),
			// 			icon1: require("../../images/xiaoxi-hui.png"),
			// 			index: 7
			// 		}
			// 		// {
			// 		// 	title: "赊销结算",
			// 		// 	url: "../../pages/CreditSettlement/CreditSettlement",
			// 		// 	icon: require("../../images/xz-xx.png"),
			// 		// 	icon1: require("../../images/xiaoxi-hui.png"),
			// 		// 	index: 8
			// 		// }
			// 	],
			//
			 };
		},
		props: {
			Chargeback: false,
			menuIndex: 0,
			sec_index: 0
		},
		methods: {
			ToPage: function(e) {
				console.log("触发没，", e);
				if (e.url) {
					uni.redirectTo({
						url: e.url,
						complete: r => {
							console.log(r);
						}
					})
				} else {
					this.menuIndex = e.index;
					this.urls.map((item, index) => {
						if (item.title != e.title) {
							item.showDetail = false;
						} else {
							e.showDetail = !e.showDetail;
						}
					})
				}
			},
			LoginOut: function() {
				uni.redirectTo({
					url: "../../pages/index/index",
					complete: r => {
						console.log(r)
					}
				})
			}
		}
	}
</script>

<style>

</style>
