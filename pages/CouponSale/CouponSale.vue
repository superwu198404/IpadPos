<template>
	<view style="border: 1px solid red;height: 100%;width: 100%;">
		<h1>券销售界面</h1>
		<div>
			<input v-model="form.start_coupon_no" placeholder="请输入起始券号..."/>
			<input v-model="form.start_coupon_end" placeholder="请输入截至券号..."/>
		</div>
	</view>
</template>

<script>
	import coupon_sale from '@/api/business/coupon_sale.js'
	export default {
		name:"CouponSale",
		data(){
			return {
				form:{
					start_coupon_no: "",
					end_coupon_no: "",
					is_batch: false,
				}
			}
		},
		watch:{
			start_coupon_no(n,o){
				if(is_batch){
					this.form.end_coupon_no = n;
				}
			}
		},
		methods:{
			async coupon_info_search(){
				let result = await coupon_sale.CouponInfoSearch({
					coupon_start: this.start_coupon_no
				})
			},
			async coupon_segment_valid(){
				let result = await coupon_sale.CouponValid({
					coupon_start: this.start_coupon_no,
					coupon_end: this.end_coupon_no
				})
			}
		},
		created() {
			
		}
	}
</script>

<style>
</style>