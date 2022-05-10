<template>
	<view>

		<button @click="San()">扫码枪扫描付款码</button>
		<button @click="AliPay()">支付宝支付</button>
		<button @click="AlipayTradeRefund()">支付宝退款</button>
		<button @click="wxPay()">微信支付</button>
		<button @click="BwxPay()">商户生成二维码让微信用户扫</button>
		<uqrcode cid="uQRCode" ref="uQRCode" :text="url" />
		<button @click="BAliPay()">商户生成二维码让支付宝用户扫</button>
	</view>

	<!-- <uqrcode ref="uQRCode" text="uQRCode 3.0" /> -->
</template>

<script>
	import hy from '@/utils/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import _wx from '@/utils/Pay/WxPay.js';
	import _ali from '@/utils/Pay/Alipay.js';
	import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode';
	export default {
		data() {
			return {
				auth_code: "289547390641106797",
				out_trade_no: "202204271458564",
				totalAmount: 100, //应付
				yPayAmount: 0, //已支付金额
				PayWay: [{
						name: '支付宝',
						value: 'zfb',
						checked: 'true'
					},
					{
						name: '微信',
						value: 'wx',
						
					},
					{
						name: '仟吉券',
						value: 'qjq'
					},
					{
						name: '电子卡',
						value: 'dzk'
					}
				], //支付方式
				PayAmont: 100000,
				url: ""
			}
		},
		methods: {
			 
			San: function() {
				let _that = this;
				// 调起条码扫描
				uni.scanCode({
					scanType: ['qrCode', 'datamatrix', 'pdf417'],
					success: function(res) {
						_that.auth_code = res.result
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + JSON.stringify(res.result));
					}
				});
			},
			//支付宝付款码支付
			AliPay: function() {
				let that=this;
				//title,auth_code,body,total_fee
				// let result= _ali.CodePayment("支付宝付款码支付",this.out_trade_no,"测试~",1);
				let result = _ali.Payment("支付宝付款码支付", "CodePayment", "AliPayService", {
					out_trade_no: "2022050914270237",//2022050914270235
					auth_code: "282411163073918928",
					subject: "测试测试",
					total_amount: 2000
				});
			},

			BAliPay: function() {
				//title,out_trade_no,subject,total_amount
				let result = _ali.CodeScanPay("支付宝扫码付", this.out_trade_no, "测试测试", 0.01);
			},
			//支付宝退款 title,out_trade_no,out_request_no,refund_amount
			AlipayTradeRefund: function() {
				let result = _ali.TradeRefund("支付宝退款", this.out_trade_no, "TD" + this.out_trade_no, 0.01);
			},

			//微信付款码付
			wxPay: function() {
				//title,auth_code,body,total_fee
				let result = _wx.CodePayment("微信付款码支付", this.auth_code, "测试测试", 1);
			},

			//微信扫码付
			BwxPay: function() {
				//title,out_trade_no,subject,total_amount
				let result = _wx.CodeScanPay("微信扫码付", this.out_trade_no, "测试测试", 0.01);
			}
		}
	}
</script>

<style>

</style>
