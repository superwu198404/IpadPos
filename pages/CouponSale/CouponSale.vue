<template>
	<view style="border: 1px solid red;height: 100%;width: 100%;">
		<h1>券销售界面</h1>
		<div>
			<input v-model="form.start_coupon_no" placeholder="请输入起始券号..." />
			<input v-model="form.end_coupon_no" placeholder="请输入截至券号..." />
		</div>
		<button @click="coupon_sale">售券</button>
	</view>
</template>

<script>
	import member from '@/api/hy/MemberInterfaces.js'
	import util from '../../utils/util';
	export default {
		name: "CouponSale",
		data() {
			return {
				form: {
					start_coupon_no: "400000005787429980",
					end_coupon_no: "400000005787518186",
					is_batch: false,
				}
			}
		},
		watch: {
			start_coupon_no(n, o) {
				if (is_batch) {
					this.form.end_coupon_no = n;
				}
			}
		},
		methods: {
			async coupon_info_search() {
				return await member.coupon_sale.CouponInfoSearch({
					coupon_start: this.form.start_coupon_no
				})
			},
			async coupon_store_search(id) {
				return await member.coupon_sale.CouponStoreSearch({
					cardinfo: {
						begin_num: this.form.start_coupon_no,
						end_num: this.form.end_coupon_no,
						material_id: id,
						khid: "K200QTD005" || this.KHID
					}
				})
			},
			async coupon_segment_valid() {
				return await member.coupon_sale.CouponValid({
					coupon_start: this.form.start_coupon_no,
					coupon_end: this.form.end_coupon_no,
					khid: "K200QTD005" || this.KHID
				})
			},
			coupon_sale() {
				console.log("[CouponSale]开始售券流程...");
				this.coupon_info_search().then(util.callBind(this, function(res) {
					console.log("[CouponSale]券信息查询:", res);
					if (res.code) {
						let good_id = res.data.coupon_good_no;
						return this.coupon_store_search(good_id);
					} else {

					}
				})).then(util.callBind(this, function(res) {
					console.log("[CouponSale]券库存校验:", res);
					if(res.code){
						return this.coupon_segment_valid();
					} else {

					}
				})).then(util.callBind(this, function(res) {
					console.log("[CouponSale]券可发售号段校验:", res);
					if(res.code){
						
					} else {

					}
				}));
			}
		},
		created() {

		}
	}
</script>

<style>
</style>
