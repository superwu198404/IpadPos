<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content" style="overflow: hidden;">
		<Page @switch="SwitchPage"></Page>
		<view class="right">
			<Head></Head>
			<!-- <component :is="current"></component> -->
			<component is="Reserve" v-if="current === 'Reserve'"></component>
			<component is="Extract" v-show="current === 'Extract'"></component>
			<component is="TakeAway" v-show="current === 'TakeAway'"></component>
			<component is="TakeYD" v-show="current === 'TakeYD'"></component>
			<component is="OnlineOrders" v-show="current === 'OnlineOrders'"></component>
			<component is="OnlinePick" v-show="current === 'OnlinePick'"></component>
			<component is="RefundOrder" v-show="current === 'RefundOrder'"></component>
			<component is="SXRefund" v-show="current === 'SXRefund'"></component>
			<component is="Message" v-show="current === 'Message'"></component>
			<component is="CreditSettlement" v-show="current === 'CreditSettlement'"></component>
		</view>
	</view>
</template>

<script>
	import Head from '@/pages/Main/Component/Head.vue'
	import Page from '@/pages/Main/Component/Page.vue'
	//页面组件导入
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
		name: "Main",
		components: {
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
				current:""
			}
		},
		methods:{
			SwitchPage:function(data){
				console.log("[SwitchPage]页面切换:",data);
				console.log("[SwitchPage]页面名称:",data.name);
				this.current = data.name;
			}
		},
		created() {

		}
	}
</script>

<style>
	.right {
		display: flex;
		flex-direction: column;
	}
</style>
