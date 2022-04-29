<template>
	<view>
		<view class="text-area">
		假装随机生成的订单号:<text  class="title">{{out_trade_no}}</text>
		</view>
		<view class="text-area">
		假装扫出来的付款码:<text  class="title">{{auth_code}}</text>
		</view>
		<button @click="San()">扫码枪扫描付款码</button>
		<button @click="AliPay()">支付宝支付</button>
		<button @click="AlipayTradeRefund()">支付宝退款</button>
		<button @click="wxPay()">微信支付</button>
		<button @click="BwxPay()">商户生成二维码让微信用户扫</button>
		<uqrcode  cid="uQRCode" ref="uQRCode"  :text="url" />
		<button @click="BAliPay()">商户生成二维码让支付宝用户扫</button>
		 
	</view>
 
 <!-- <uqrcode ref="uQRCode" text="uQRCode 3.0" /> -->
</template>

<script>
	import Req from '@/utils/request.js';
    import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode';
	export default {
		data() {
			return {
				auth_code:"288811249915033182",
				out_trade_no:"202204271458564",
				url:""
				
			}
		},
		methods: {
			San:function(){
				let _that=this;
				// 调起条码扫描
				uni.scanCode({
					scanType: ['qrCode','datamatrix','pdf417'],
					success: function (res) {
						_that.auth_code=res.result
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + JSON.stringify(res.result) );
					}
				});
			},
			   //支付宝付款码支付
				AliPay:function(){
					Req.asyncFunc({
					        http: true,
					        url: "/WxPay/AliPay",
					        title: "请稍等...",
							method:"POST",
					        data: {
					        	out_trade_no:this.out_trade_no,
					        	auth_code:this.auth_code,
					        	subject: "测试测试",
					        	total_amount:0.01
					        }
					      }, function(res) {
					        console.log(JSON.stringify(res));
					      });
				},
				//支付宝退款
				AlipayTradeRefund:function(){
					Req.asyncFunc({
					        http: true,
					        url: "/WxPay/AlipayTradeRefund",
					        title: "请稍等...",
							method:"POST",
					        data: {
					        	out_trade_no:this.out_trade_no, 
					        	out_request_no: "TD"+this.out_trade_no,
					        	refund_amount:0.01
					        }
					      }, function(res) {
					        console.log(JSON.stringify(res));
					      });
				},
				//微信付款码付
				wxPay:function(){
					Req.asyncFunc({
					        http: true,
					        url: "/WxPay/WxPay",
					        title: "微信付款码支付",
							method:"POST",
					        data: {
					        	auth_code: this.auth_code,
					        	body: "测试测试",
					        	total_fee:1
					        }
					      }, function(res) {
					        console.log(JSON.stringify(res));
					      });
					
				},
				//支付宝扫码付  目前参数只有小程序的  但是小程序不支持当面付
				BAliPay:function(){
					let that=this;
					Req.asyncFunc({
					        http: true,
					        url: "/WxPay/TradePrecreate",
					        title: "商户二维码",
							method:"POST",
					        data: {
					        	out_trade_no: that.out_trade_no,
					        	subject: "测试测试",
					        	total_amount:0.01
					        }
					      }, function(res) {
							  that.url=res.JsonData;
					        console.log(JSON.stringify(res));
					      });
				},
				//微信扫码付
				BwxPay:function(){
					let that=this;
					Req.asyncFunc({
					        http: true,
					        url: "/WxPay/TransactionsNative",
					        title: "商户二维码",
							method:"POST",
					        data: {
					        	out_trade_no: that.out_trade_no,
					        	subject: "测试测试",
					        	total_amount:0.01
					        }
					      }, function(res) {
							  that.url=res.code_url;
					        console.log(JSON.stringify(res));
					      });
				}
		}
	}
</script>

<style>

</style>
