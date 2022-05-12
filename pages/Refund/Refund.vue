<template>
	<view>
		<!-- 订单详情 -->
		<view>
			<text>订单总金额：{{totalAmount}} </text>
			<text>折扣：{{Discount}} </text>
			<text>实收：{{PayAmount}} </text>
			<text>欠款：{{qPayAmount}} </text>
		</view>

		<view>
			<view>订单号：<input v-model="bill"><button @click="Search()">查询订单</button></view>
			<view><button @click="refund()">发起退款</button></view>
		</view>
		<view>
			<radio-group class="radio-group" @change="radioChange">
				<label class="radio" v-for="(item, index) in PayWay" :key="item.value">
					<radio :value="item.value" :checked="item.checked" /> {{item.name}}
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
	import _wx from '@/utils/Pay/WxPay.js';
	import _ali from '@/utils/Pay/Alipay.js';
	import common from '@/api/common.js';

	export default {
		data() {
			return {
				PayWay: [{
						name: '微信',
						value: 'WX'
					},
					{
						name: '支付宝',
						value: 'ALI',

					},
					{
						name: '电子卡',
						value: 'CARD'
					},
					{
						name: '电子券',
						value: 'COUPON'
					}
				], //支付方式列表
				bill: "", //单号
				selectPayWay: "", //选中的支付方式
				sale3_obj: {}
			}
		},
		methods: {
			//支付方式切换
			radioChange(e) {
				let way = e.target.value;
				this.selectPayWay = way;
			},

			//查询退款的合集
			queryRefundAll: function(t, e, func) {
				let Result;
				if (t == 'WX') {
					_wx.QueryRefund("微信退款查询", e.out_trade_no, function(res) {
						Result = JSON.parse(res.data);
						if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
							.out_refund_0 == 'SUCCESS') { //退款成功
							Result.new_code = '1';
						} else if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
							.out_refund_0 == 'PROCESSING') { //退款中
							Result.new_code = '0';
						} else {
							Result.new_code = '-1';
							Result.new_msg = Result.return_msg;
						}
						if (func) func(Result);
					});
				} else if (t == 'ALI') {
					_ali.Payment("支付宝退款查询", "RefundQuery", 'AliPayService', {
						out_trade_no: e.out_trade_no
						//out_request_no: e.out_refund_no
					}, function(res) {
						t = JSON.parse(res.data);
						Result = Result.alipay_trade_fastpay_refund_query_response;
						if (Result.code = "10000" && Result.refund_status == "REFUND_SUCCESS") { //退款成功
							Result.new_code = '1';
						} else {
							Result.new_code = '-1';
						}
						if (func) func(Result);
					})
				} else if (t == 'ACRD') {

				} else if (t == 'COUPON') {

				} else {

				}
			},
			//退款的合集
			RefundAll: function(t, e, func) {
				let Result;
				if (t == 'WX') {
					_wx.Refund("微信退款", e.out_trade_no, e.out_refund_no, e.total_fee, function(res) {
						Result = JSON.parse(res.data);
						if (Result.return_code == 'SUCCESS' && Result.result_code ==
							'SUCCESS') { //提交退款成功不代表退款成功 需要查询后才能知道结果
							Result.new_code = '1';
						} else { //退款提交失败
							Result.new_code = '-1';
							Result.new_msg = Result.return_msg;
						}
						if (func) func(Result);
					});
				} else if (t == 'ALI') {
					_ali.Payment("支付宝退款", "TradeRefund", 'AliPayService', {
						out_trade_no: e.out_trade_no,
						refund_amount: e.total_fee,
						out_request_no: e.out_refund_no
					}, function(res) {
						Result = JSON.parse(res.data);
						Result = Result.alipay_trade_refund_response;
						if (Result.code == "10000") { //退款成功
							Result.new_code = '1';
						} else {
							Result.new_code = '-1';
							Result.new_msg = Result.sub_msg;
						}
					})
					if (func) func(Result);
				} else if (t == 'ACRD') {

				} else if (t == 'COUPON') {

				} else {}
			},
			//查询订单详情
			Search: function() {
				this.sale3_obj.out_trade_no = this.bill;
				this.sale3_obj.out_refund_no = common.CreateBill("K210QTD002", "001");
			},
			//退款点击事件
			refund: function() {
				if (!bill) {
					uni.showToast({
						title: "请输入单号",
						icon: "error"
					})
					return;
				}
				if (!this.selectPayWay) {
					uni.showToast({
						title: "请选择退款方式",
						icon: "error"
					})
					return;
				}
				this.queryRefundAll(this.selectPayWay, this.sale3_obj, function(res) {
					console.log("查询结果" + res);
					if (res.new_code > 0) {
						let payobj = this.PayWay.find(item => {
							return item.value == this.selectPayWay
						});
						//查询到已经是退款成功的生成退款记录
						this.PayList.push({
							way: payobj.name,
							amount: data.amount,
							no: this.PayList.length + 1
						});
					} else {
						this.RefundAll(this.selectPayWay, this.sale3_obj, function(res1) {
							console.log("发起退款的结果" + res1);
							if (res1.code > 0) {
								//退款成功
								uni.showToast({
									title: "退款成功!",
									icon: "success"
								});
								//生成退款记录
							} else {
								//退款失败
								uni.showToast({
									title: "退款失败：" + res.new_msg,
									icon: "error"
								});
							}
						})
					}
				})
			},
			//发起退款原版
			refund1: function(data) {
				let that = this;
				var array = this.PayWay.filter((item) => {
					return item.name == data.way;
				})
				// ,
				// refund_amount:data.amount
				//查询退款
				_ali.Payment("退款信息查询中...", "RefundQuery", array[0].value, {
						out_trade_no: data.no,
						out_request_no: "T" + data.no
					},
					function(res) {
						t = JSON.parse(res.data);
						Result = Result.alipay_trade_fastpay_refund_query_response;
						if (Result.code = "10000") {
							if (Result.refund_status == "REFUND_SUCCESS") {
								//已经退款了
								uni.showToast({
									title: "已退款",
									duration: 2000,
									icon: "error"
								});
							} else {
								//没有退款  
								that.ToRefund("正在退款中..", data.no, data.amount, "T" + data.no, array[0].value);
							}

							//查询是否已经生成退款记录
							

							//支付成功生成记录
							that.dPayAmount += data.amount; //等支付减去支付金额
							that.yPayAmount -= data.amount //已支付加上支付金额
							if (that.selectPayWay == 'AliPayService' || that.selectPayWay =='WxPayService') {
								that.PayAmont = that.totalAmount - that.yPayAmount;
							} else {
								that.PayAmont = 0;
							}

						}
						return res;
					},
					function(res) {
						if (res.data == null) {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: "error"
							});
						}
						let Result = JSON.parse(res.data);
						Result = Result.alipay_trade_fastpay_refund_query_response;
						//非业务失败
						if (Result.code != "40004") {
							//业务失败
							uni.showToast({
								title: Result.msg,
								duration: 2000,
								icon: "error"
							});
							return;
						} else {
							//业务失败
							uni.showToast({
								title: Result.sub_msg,
								duration: 2000,
								icon: "error"
							});
						}
					});
			},
			ToRefund: function(title, out_trade_no, amount, out_request_no, way) {
				_ali.Payment(title, "TradeRefund", way, {
						out_trade_no: out_trade_no,
						refund_amount: amount,
						out_request_no: out_request_no
					},
					function(res) {
						let rResult = JSON.parse(res.data);
						rResult = rResult.alipay_trade_refund_response;
						if (rResult.code == "10000") {
							uni.showToast({
								title: "退款成功!",
								duration: 2000,
								icon: "success"
							});
						}
						return res
					},
					function(res) {
						if (res.data == null) {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: "error"
							});
						}
						let errResult = JSON.parse(res.data);
						errResult = errResult.alipay_trade_refund_response
						//非业务失败
						if (errResult.code != "40004") {
							//业务失败
							uni.showToast({
								title: errResult.msg,
								duration: 2000,
								icon: "error"
							});
						} else {
							//业务失败
							uni.showToast({
								title: errResult.sub_msg,
								duration: 2000,
								icon: "error"
							});
						}

					});
			}
		}}
</script>

<style>

</style>
