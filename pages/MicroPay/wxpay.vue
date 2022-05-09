<template>
	<view>
		<!-- 付款详情 -->
		<view>
			<view class="text-area"> 总金额：{{totalAmount}} </view>
			<view class="text-area"> 折扣：{{Discount}} </view>
			<view class="input"> 实收：{{yPayAmount}} </view>
			<view class="input"> 欠款：{{wPayAmount}} </view>
			<view class="input"> 还需支付：{{wPayAmount}} </view>
		</view>
		<!-- 商品详情 -->
		<view>
			<view v-for="(item) in products">
				<text>{{item.name}}</text>-
				<text>￥{{item.amount}}</text>-
				<text>{{item.price}}元/kg</text>-
				<text>x{{item.num}}</text>
			</view>
		</view>
		<button @click="wxSanPay()">微信扫码支付</button>
		<button @click="aliSanPay()">支付宝扫码支付</button>
		<button @click="hyCardPay()">电子会员卡支付</button>
		<button @click="CouponPay()">电子券支付</button>
	</view>
</template>

<script>
	import hy from '@/utils/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import _wx from '@/utils/Pay/WxPay.js';
	import common from '@/api/common.js';
	export default {
		data() {
			return {
				products: [{
					name: "黑森林",
					price: "10",
					amount: "20",
					num: 2
				}, {
					name: "毛毛虫",
					price: "12",
					amount: "24",
					num: 2
				}],
				auth_code: "288811249915033182",
				out_trade_no: "202204271458564",
				totalAmount: 100, //总金额
				Discount: "zfb2.0", //支付方式
				yPayAmount: 0, //已支付金额
				wPayAmount: 0,
				url: ""
			}
		},
		methods: {
			//微信扫码支付
			wxSanPay: function() {
				let bill = common.CreateBill("K210", "001");
				this.$data.out_trade_no = bill;
				console.log(bill);
				return;
				let _that = this;
				let result = _wx.CodeScanPay("微信扫码付", this.out_trade_no, "商品支付", _that.totalAmount);
				return;
				// 调起条码扫描
				uni.scanCode({
					scanType: ['qrCode', 'datamatrix', 'pdf417'],
					success: function(res) {
						_that.auth_code = res.result
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + JSON.stringify(res.result));
						//调用微信扫码付
						let result = _wx.CodeScanPay("微信扫码付", this.out_trade_no, "商品支付", 0.01);
					}
				});
			},
		}
	}
</script>

<style>

</style>
