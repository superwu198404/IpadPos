<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content" style="overflow: hidden;">
		<Page ref="menu" @switch="SwitchPage" :name="selected.name" :title="selected.title"></Page>
		<view class="right">
			<Head @Switch="SwitchPage"></Head>
			<!-- 利用 v-if 和 v-show 来手动达到 "keep-alive" 的效果 -->
			<component @Switch="SwitchPage" @Controller="MainSaleLoad" @Message="OpenMessage" v-for="c in router"
				:is="c.name" :ref="c.title" v-show="show(c) || !c.keepAlive" v-if="show(c) || c.keepAlive"
				:meta="meta_data"></component>
		</view>
		<!-- <newToast ref="message" @Close="CloseMessage" :yn_show="view.message" :title="'测试一下'"></newToast> -->
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	//路由数据
	import router from '@/utils/router.js'
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue'
	import Page from '@/pages/Home/Component/Page.vue'
	//页面组件导入
	// import Main from '@/pages/Main/Main.vue'
	import MainSale from '@/pages/mainSale/mainSale.vue'
	import Reserve from '@/pages/Reserve/Reserve.vue'
	import Extract from '@/pages/Extract/Extract.vue'
	import TakeAway from '@/pages/TakeAway/TakeAway.vue'
	import TakeYD from '@/pages/TakeYD/TakeYD.vue'
	import OnlineOrders from '@/pages/OnlineOrders/OnlineOrders.vue'
	import OnlinePick from '@/pages/OnlinePick/OnlinePick.vue'
	import RefundOrder from '@/pages/RefundOrder/RefundOrder.vue'
	import SXRefund from '@/pages/RefundOrder/SXRefund.vue'
	import Message from '@/pages/Message/Message.vue'
	import CreditSettlement from '@/pages/CreditSettlement/CreditSettlement.vue'
	import Promotion from '@/pages/Promotion/Promotion.vue'
	//全局销售控制器
	import SaleController from '@/utils/sale/base_sale.js';
	//销售页商品初始化方法
	import SaleGoodsInit from '@/utils/sale/xs_sp_init.js';
	export default {
		name: "Home",
		components: {
			// Main,
			MainSale,
			Head,
			Page,
			Reserve,
			Extract,
			TakeAway,
			TakeYD,
			OnlineOrders,
			OnlinePick,
			RefundOrder,
			SXRefund,
			Message,
			CreditSettlement,
			Promotion
		},
		data() {
			return {
				current: {
					name: "MainSale",
					title: "销售",
					info:null
				},
				selected: {
					name: "MainSale",
					title: "销售"
				},
				view: {
					message: false
				},
				router: [], //路由信息参数
				meta_data: {}, //路由元数据
				controller: null
			}
		},
		computed: {
			show: function() {
				return util.callBind(this, function(info) {
					return (this.current.name === info.name) && (this.current.title === info.title);
				});
			},
		},
		methods: {
			OpenMessage: function(data) {
				console.log("[OpenMessage]消息框打开!", data);
				this.view.message = true;
				this.$refs.message.AutoClose();
			},
			CloseMessage: function(data) {
				console.log("[CloseMessage]消息框关闭!", data);
				this.view.message = false;
			},
			SwitchPage: function(data) {
				console.log("[SwitchPage]页面切换:", data);
				this.selected.name = data.name;
				this.selected.title = data.title;
				if (data.switch || data.switch === undefined) {
					this.current.name = data.name;
					this.current.title = data.title;
					this.current.info = this.router.find(r => r.name === data.name && r.title === data.title);
					console.log("[SwitchPage]组件Info:", data);
					console.log("[SwitchPage]组件RouteInfo:", );
					this.$set(this.meta_data, `data`, data?.meta ?? this.router.find(r => r.name === data.name && r
						.title === data.title)?.meta);
					this.$set(this.meta_data, `params`, data?.params ?? {});
					let vue = this.$refs[data.title];
					if (vue) {
						if (Array.isArray(vue)) {
							vue = vue[0];
						}
					}
					vue?.$nextTick(function() {
						console.log("[NextTick]Show触发!");
						vue?.Show ? vue.Show() : undefined;
					});
					if(this.controller) this.controller.SaleTypeClick(this.current.info.type);//给销售控制器传入当前菜单类型信息，以便对销售界面进行切换控制
				}
			},
			ComponentRecursion: function(tree, all = []) {
				tree.forEach(util.callBind(this, function(item) {
					all.push(item);
					if (item.details)
						this.ComponentRecursion(item.details, all);
				}));
				return all;
			},
			MsgToPage: function() {
				uni.$on("Switch", util.callBind(this, function(res) {
					this.SwitchPage(res);
				}))
			},
			MainSaleLoad: function(sale_controller) {
				console.log("[MainSaleLoad]已获取MainSale控制器对象...");
				this.controller = sale_controller;
			}
		},
		created() {
			this.router = this.ComponentRecursion(router); //路由数据
			this.MsgToPage(); //开启页面事件监听
		}
	}
</script>

<style>
	.right {
		display: flex;
		flex-direction: column;
	}
</style>
