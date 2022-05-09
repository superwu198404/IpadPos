<template>
	<view>
		<button @click="appPay()">支付宝支付</button>
		<button>微信支付</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			appPay:function(){
				let orderInfo="app_id=2021000118679584&biz_content=%7b%22out_trade_no%22%3a%2220211224101530%22%2c%22total_amount%22%3a0.01%2c%22subject%22%3a%22%e6%b5%8b%e8%af%95%22%2c%22product_code%22%3a%22001000100001%22%2c%22goods_detail%22%3a%5b%7b%22goods_id%22%3a%22a01%22%2c%22goods_name%22%3a%22a%22%2c%22quantity%22%3a1%2c%22price%22%3a0.01%7d%2c%7b%22goods_id%22%3a%22b02%22%2c%22goods_name%22%3a%22b%22%2c%22quantity%22%3a1%2c%22price%22%3a0.01%7d%5d%7d&charset=utf-8&format=%e5%8f%aa%e6%94%af%e6%8c%81json&method=alipay.trade.app.pay&sign_type=RSA2&timestamp=2022-04-22+15%3a15%3a49&version=1.0&sign=XLrdSZhkQGrLWreXH5VMtVXHo%2fIdsIjtJzEds9uDXEvzojmgzoLWY%2fVQbTa4KWoojdbgjtTwumHeyeKw9TVwgCXrKIKtOJrMrqw%2beqtBLME7zNZqBlt1wT3Gyi5sTZXUdxejYHW555TCwiy0exwELevOOvCLOtedzMAUMRiI%2bCf3PQbcl1y5AnN4qmXgThXGOd7ZtQ3ODgcEYZKq%2fPy48Q0qG68YTLzKybuk0idBIr90RtpJatMPYyK1Bfoif%2fFmTdYlYS8J0i7027FIKppuwMLKnRUAg%2fhKru%2f447O4aS9PjmMv2r3wGpeNnvwnIPcyBj86XKZrl5geNian9v8SPQ%3d%3d";
				uni.requestPayment({
				    provider: 'alipay',
				    orderInfo: orderInfo, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
				    success: function (res) {
				        console.log('success:' + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log('fail:' + JSON.stringify(err));
				    }
				});
			},
			wxPay:function(){
				uni.requestPayment({
				    "provider": "wxpay", 
				    "orderInfo": {
				        "appid": "wx499********7c70e",  // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
				        "noncestr": "c5sEwbaNPiXAF3iv", // 随机字符串
				        "package": "Sign=WXPay",        // 固定值
				        "partnerid": "148*****52",      // 微信支付商户号
				        "prepayid": "wx202254********************fbe90000", // 统一下单订单号 
				        "timestamp": 1597935292,        // 时间戳（单位：秒）
				        "sign": "A842B45937F6EFF60DEC7A2EAA52D5A0" // 签名，这里用的 MD5/RSA 签名
				    },
				    success(res) {},
				    fail(e) {}
				})
			}
		}
	}
</script>

<style>

</style>
