<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content" style="overflow: hidden;">
		<Page @switch="SwitchPage"></Page>
		<view class="right">
			<Head></Head>
			<!-- 利用 v-if 和 v-show 来手动达到 "keep-alive" 的效果 -->
			<component @Switch="SwitchPage" @Message="OpenMessage" v-for="c in router" :is="c.name" :ref="c.title"
				v-show="show(c) || !c.keepAlive" v-if="show(c) || c.keepAlive"
				:meta="meta_data"></component>
		</view>
		<!-- <newToast ref="message" @Close="CloseMessage" :yn_show="view.message" :title="'测试一下'"></newToast> -->
	</view>
</template>

<script>
	//导入 Vue 实例
	import Vue from 'vue'

	import util from '@/utils/util.js';
	//路由数据
	import router from '@/utils/router.js'
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue'
	import Page from '@/pages/Home/Component/Page.vue'
	//页面组件导入
	import Main from '@/pages/Main/Main.vue'
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
	export default {
		name: "Home",
		components: {
			Main,
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
			CreditSettlement
		},
		data() {
			return {
				current: {
					name: "Main",
					title: "销售"
				},
				view: {
					message: false
				},
				router: [],
				meta_data: {}
			}
		},
		computed: {
			show: function() {
				return util.callBind(this, function(info) {
					// console.log("[Computed-Show]Info:", info);
					// console.log("[Computed-Show]Info-Result:", (this.current.name === info.name) && (this.current.title === info.title));
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
				this.current.name = data.name;
				this.current.title = data.title;
				console.log("[SwitchPage]组件name:", this.current.name);
				console.log("[SwitchPage]组件title:", this.current.title);
				this.$set(this.meta_data, `data`, data?.meta ?? {});
				this.$set(this.meta_data, `params`, data?.params ?? {});
				let vue = this.$refs[data.title];
				if (vue) {
					if (Array.isArray(vue)) {
						vue = vue[0];
					}
				}
				vue?.$nextTick(function() {
					vue?.Show ? vue.Show() : undefined;
				});
			},
			ComponentRecursion: function(tree, all) {
				tree.forEach(util.callBind(this, function(item) {
					all.push(item);
					if (item.details)
						this.ComponentRecursion(item.details, all);
				}));
			}
		},
		created() {
			let components = [];
			this.ComponentRecursion(router, components)
			this.router = components;
		}
	}
</script>

<style>
	.right {
		display: flex;
		flex-direction: column;
	}
</style>
