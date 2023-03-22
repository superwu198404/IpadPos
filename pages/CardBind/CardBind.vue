<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/takeout.css);
</style>
<template>
	<view class="container">
		<PrinterPage ref="printerPage" style="display: none;" />
		<!-- 顶部导航栏 -->
		<Head :custom.sync="view.big_customer" :_ynDKF='view.enable_customer' :_showSale="view.show_sale"></Head>
		<Tabs :tabs="source.tabs" style="margin-bottom: 20px;margin-top: 20px;" @change="tabs_change">
			<!-- <template slot='tools'>
				<view class="a-z">
					<image src="../../images/img2/shuakalr.png" mode="widthFix">
					</image>
				</view>
				<view class="a-z">
					<image src="../../images/cuxiaohd-dlu.png" mode="widthFix"></image>
				</view>
			</template> -->
			<template slot='content'>
				<TLCardBind v-if="view.current_tab_title == '通联卡绑定'"></TLCardBind>
			</template>
		</Tabs>
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue';
	import TLCardBind from '@/pages/CardBind/TLCardBind.vue';
	import card_bind from '@/api/business/card_bind.js';
	import util from '@/utils/util.js';
	export default {
		mixins:[card_bind],
		components:{
			Head,
			TLCardBind
		},
		data(){
			return {
				view:{
					big_customer: false,
					enable_customer: true,
					show_sale: true,
					current_tab_title: null
				},
				form:{
					member_code: "",
					card_number: ""
				},
				source:{
					tabs: [{title:'通联卡绑定',icon:""},{title:'易慧达旧卡绑定',icon:""}]
				}
			}
		},
		methods:{
			tabs_change(data){
				this.view.current_tab_title = data.title;
			}
		}
	}
</script>

<style>
	.container {
		 display: flex;
		 flex-direction: column;
		 gap: 5px;
	}
</style>