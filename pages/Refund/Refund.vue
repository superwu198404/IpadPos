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
	import db from '@/utils/db/db_excute.js';
	import create_sql from '@/utils/db/create_sql.js';
	import dateformat from '@/utils/dateformat.js';

	export default {
		data() {
			return {
				allAmount: 0, //订单总金额(包含折扣)
				totalAmount: 0, //应付总金额
				yPayAmount: 0, //已支付金额
				dPayAmount: 0, //待支付
				qPayAmount: 0,
				PayAmount: 0,
				Discount: 0,
				PayWay: [{
						name: '支付宝',
						value: 'ALI',
						type: "AliPayService",
						fkid: "ZF01",
					},
					{
						name: '微信',
						value: 'WX',
						type: "AliPayService",
						fkid: "ZF02"
					},
					{
						name: '券支付',
						value: 'COUPON',
						type: "qzf",
						fkid: "ZF03"
					},
					{
						name: '电子卡',
						value: 'CARD',
						type: "dzk",
						fkid: "ZF04"
					}
				], //支付方式
				bill: "K210QTD00112022516175759256", //单号
				selectPayWay: "", //选中的支付方式
				sale3_obj: {}
			}
		},
		methods: {
			onLoad: function(e) {

			},
			//支付方式切换
			radioChange(e) {
				let way = e.target.value;
				this.selectPayWay = way;
			},
			Search: function(e) {
				if (this.bill) {
					let sql = 'select * from SALE001 where BILL="' + this.bill + '"';
					db.SqliteHelper.get().executeQry(sql, "数据查询", function(res) {
						console.log("查询成功");
						console.log(res);
						if(res.code&&res.msg.length>0){
							//说明查到了值
							let dataObj=res.msg[0].
							this.allAmount=r.ZNET;
							this.totalAmount=r.TNET;
						}
					}, function(err) {
						console.log("查询失败");
						console.log(err);
					});
				}
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
			}
		}
	}
</script>

<style>

</style>
