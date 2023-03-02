<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>
<template>
	<view class="content">
		<Page></Page><!-- 左侧菜单 -->
		<view class="right">
			<Head :custom.sync="component.head.view.big_customer" :_ynDKF='component.head.view.enable_customer'></Head>
			
		</view>
	</view>
</template>

<script>
	export default {
		name: "Menu",
		data(){
			return {
				component:{
					head:{
						view:{
							big_customer: false,
							enable_customer: true
						}
					}
				}
			}
		},
		methods:{
			
		},
		created() {
			
		}
	}
</script>

<style>
</style>