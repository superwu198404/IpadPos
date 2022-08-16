<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content" style="overflow: hidden;">
		<Page @switch="SwitchPage"></Page>
		<view class="right">
			<Head></Head>
			<!-- 利用 v-if 和 v-show 来手动达到 "keep-alive" 的效果 -->
			<component v-for="c in router" :is="c.name" v-show="current === c.name || !c.keepAlive" v-if="current === c.name || c.keepAlive"></component>
		</view>
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
				current: "Main",
				router: []
			}
		},
		methods: {
			SwitchPage: function(data) {
				console.log("[SwitchPage]页面切换:", data);
				console.log("[SwitchPage]页面名称:", data.name);
				this.current = data.name;
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
