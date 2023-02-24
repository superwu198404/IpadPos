<template>
	<view style="border: 1px solid red;height: 100%;width: 100%;">
		<p>卡销售：</p>
		起始卡号：<input type="text" v-model="begin_num" />
		结束卡号：<input type="text" v-model="end_num" />
		<button @click="Confirm">确认</button>
	</view>
</template>

<script>
	import _card_coupon from "@/utils/sale/card_coupon.js";
	import _util from "@/utils/util.js";
	var that, KQSale;
	export default {
		name: "CardSale",
		data() {
			return {
				begin_num: "1087110000744323",
				end_num: "",

			}
		},
		created: function() {
			that = this;
			KQSale = new _card_coupon.InitKQSale(this, uni, getApp().globalData.store, "VIPCard_Active");
			// KQSale.InitData("测试");
		},
		methods: {
			Confirm: function() {
				if (!this.begin_num) {
					_util.simpleMsg("卡号不为空");
				}
				KQSale.QueryInfo({
					card_num: that.begin_num
				}, res => {
					console.log(res);
					if (KQSale.CheckStatus(res)) {
						KQSale.CheckStock({})
					}
				})
			}
		}
	}
</script>

<style>

</style>
