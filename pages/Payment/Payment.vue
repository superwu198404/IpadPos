<template>
	<view>
		<p>应收：{{totalAmount}}</p>
		<view>
			待支付：
			<label>{{dPayAmount}}</label>
		</view>
		<view>
			<radio-group class="radio-group" @change="radioChange">
				<label class="radio" v-for="(item, index) in PayWay" :key="item.value">
					<radio :value="item.value" :checked="item.checked" /> {{item.name}}
				</label>
			</radio-group>
		</view>
		<view v-show="selectPayWay!=null">
			支付金额:
			<input :disabled="disablePayInput" v-model="PayAmont">
		</view>
		<button @click="Pay()">支付</button>
		<view> 支付列表:
			<p>序号---支付方式---金额---编码--操作</p>
			<view v-for="(way, index) in PayList">
				{{ index }} --- {{ way.way }} ---{{way.amount}}---{{ way.no }}-- <label style="width:50rpx;"
					@click=refund(way)>退款</label>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :type="type" :maskClick="false">
				<view class="uni-tip">
					<button @click="closeCode">关闭</button>
					付款码：
					<input confirm-type="confirm" @confirm="ToPay" v-model="authCode">
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue';
	import hy from '@/utils/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import _wx from '@/utils/Pay/WxPay.js';
	import _ali from '@/utils/Pay/Alipay.js';
	import common from '@/api/common.js';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: 'center',
				totalAmount: 20, //应付
				yPayAmount: 0, //已支付金额
				dPayAmount: 20, //待支付
				PayWay: [{
						name: '支付宝',
						value: 'ALI',
						type: "AliPayService"
					},
					{
						name: '微信',
						value: 'WX',
						type: "AliPayService"
					},
					{
						name: '券支付',
						value: 'qzf',
						type: "qzf"
					},
					{
						name: '电子卡',
						value: 'dzk',
						type: "dzk"
					}
				], //支付方式
				PayAmont: 0,
				selectPayWay: null,
				PayList: [{
					way: "支付宝",
					amount: 0.01,
					no: "2022050914270271"
				}],
				authCode: null,
				out_trade_no: null,
				disablePayInput: false,
				sale1_obj: {},
				sale2_obj: {},
				sale3_obj: {}
			}
		},
		methods: {
			radioChange(e) {
				let value = e.target.value;
				let payobj = this.PayWay.find(item => {
					return item.value == value
				});
				this.selectPayWay = payobj.type;
				if (this.selectPayWay == 'AliPayService' || this.selectPayWay == 'WxPayService') {
					this.PayAmont = this.totalAmount - this.yPayAmount;
					this.disablePayInput = false;
				} else {
					//券支付
					if (this.selectPayWay == "qzf") {
						//禁用输入金额框
						this.disablePayInput = true;
					}
					this.PayAmont = 0;
				}
			},
			//撤销支付订单合集
			cancelPayAll: function(t, e, func) {
				let Result;
				if (t == 'WX') {
					_wx.CancelCodeScanPay("撤销微信扫码付", e.out_trade_no,
						function(res) {
							Result = JSON.parse(res.data);
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS') { //撤销成功
								Result.new_code = '1';
							} else {
								Result.new_code = '-1';
								Result.new_msg = Result.return_msg;
							}
							if (func) func(Result);
						});
				} else if (t == 'ALI') {
					_ali.Payment("订单撤销中..", "TradeCancel", this.selectPayWay, {
							out_trade_no: e.out_trade_no
						},
						function(res) {
							let qResult = JSON.parse(res.data);
							qResult = qResult.alipay_trade_cancel_response
							if (qResult.code == "10000") {
								uni.showToast({
									title: "支付超时，订单已撤销",
									duration: 2000,
									icon: "none"
								});
							}
							if (func) func(res);
						},
						function(res) {
							let msg = res.msg;
							if (res.data != null) {
								let errResult = JSON.parse(res.data);
								errResult = errResult.alipay_trade_cancel_response
								//非业务失败
								if (errResult.code != "40004") {
									//业务失败
									msg = errResult.sub_msg;
								} else {
									//业务失败
									msg = errResult.sub_msg;
								}
							}
							uni.showToast({
								title: msg,
								duration: 2000,
								icon: "none"
							});
							if (func) func(res);
						});
				} else if ('CARD') {

				} else if ('COUPON') {

				} else {}
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
					_ali.Payment("支付宝退款查询...", "RefundQuery", 'AliPayService', {
							out_trade_no: e.out_trade_no,
							out_request_no: e.out_request_no
						},
						function(res) {
							let Result = JSON.parse(res.data);
							Result = Result.alipay_trade_fastpay_refund_query_response;
							if (Result.code = "10000" && Result.refund_status == "REFUND_SUCCESS") {
								//已经退款了
								Result.code = '1';
							} else {
								//没有退款  
								Result.code = '0';
								that.ToRefund("正在退款中..", data.no, data.amount, "T" + data.no, array[0].value);
							}

							that.PayList.push({
								way: "支付宝",
								amount: data.amount,
								no: "T" + data.no
							});
							//查询是否已经生成退款记录

							//支付成功生成记录
							that.dPayAmount += data.amount; //等支付减去支付金额
							that.yPayAmount -= data.amount //已支付加上支付金额
							if (that.selectPayWay == 'AliPayService' || that.selectPayWay == 'WxPayService') {
								that.PayAmont = that.totalAmount - that.yPayAmount;
							} else {
								that.PayAmont = 0;
							}
							if (func) func(Result);
						},

						function(res) {
							if (res.data != null) {
								let Result = JSON.parse(res.data);
								Result = Result.alipay_trade_fastpay_refund_query_response;
								//非业务失败
								if (Result.code != "40004") {
									res.msg = Result.msg;
									//业务失败
									return;
								} else {
									//业务失败
									res.msg = Result.sub_msg;
								}
								res.code = "-1";
							}
							if (func) func(res);
						});

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

					_ali.Payment("支付宝退款", "TradeRefund", "AliPayService", {
							out_trade_no: e.out_trade_no,
							refund_amount: e.refund_amount,
							out_request_no: e.out_refund_no
						},
						function(res) {
							let rResult = JSON.parse(res.data);
							rResult = rResult.alipay_trade_refund_response;
							if (Result.code = "10000" && Result.refund_status == "REFUND_SUCCESS") { //退款成功
								rResult.code = '1';
							} else {
								rResult.code = '0';
							}
							if (func) func(Result);
						},
						function(res) {
							if (res.data != null) {
								let errResult = JSON.parse(res.data);
								errResult = errResult.alipay_trade_refund_response
								//非业务失败
								if (errResult.code != "40004") {
									//业务失败
									res.msg = errResult.msg;
								} else {
									res.msg = errResult.sub_msg;
								}
								res.code = '-1'
							}
							if (func) func(res);
						});
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
			//查询支付结果合集
			queryPayAll: function(t, e, func) {
				let Result;
				if (t == 'WX') {
					_wx.QueryCodeScanPay("微信扫码付", e.out_trade_no,
						function(res) {
							Result = JSON.parse(res.data);
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
								.trade_state == 'SUCCESS') { //支付成功
								Result.new_code = '1';
							} else if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
								.trade_state == 'USERPAYING') { //支付中
								Result.new_code = '0';
							} else {
								Result.new_code = '-1';
								Result.new_msg = Result.return_msg;
							}
							if (func) func(Result);
						});
				} else if (t == 'ALI') {
					let Result;
					let that = this;
					_ali.Payment("订单查询..", "TradeQuery", this.selectPayWay, {
							out_trade_no: e.out_trade_no
						},
						function(res) {
							let qResult = JSON.parse(res.data);
							qResult = qResult.alipay_trade_query_response;
							if (qResult.code == "10000") {
								if (qResult.trade_status == "WAIT_BUYER_PAY") {
									//交易创建，等待买家付款 加上用户支付中提示
									qResult.msg = "支付中，请稍后..";
									qResult.code = '0';
								} else {
									//交易支付成功//生成支付记录
									if (qResult.trade_status == "TRADE_SUCCESS") {
										qResult.code = '1';
									} else {
										let msg = "";
										if (qResult.trade_status == "TRADE_CLOSED") {
											msg = "未付款,交易超时已关闭";
										}
										if (qResult.trade_status == "TRADE_FINISHED")
											msg = "交易结束完成";
										qResult.code = '-1';
										qResult.msg = msg;
									}
								}
							} else {
								//异常
								qResult.code = '-1';
							}
							if (func) func(qResult);
						},
						function(res) {
							res.code = "-1";
							res.msg = "支付异常";
							if (func) func(res);
						});
				} else if ('CARD') {

				} else if ('COUPON') {

				} else {}
			},
			//创建支付记录
			createPay: function(t) {
				let that = this;
				let payobj = that.PayList.find(item => {
					return item.value == t
				});
				this.PayList.push({
					way: payobj.name,
					amount: Result.total_amount,
					no: Result.out_trade_no
				});
				//支付成功生成记录
				this.dPayAmount -= Result.total_amount; //等支付减去支付金额
				this.yPayAmount += Result.total_amount //已支付加上支付金额
				if (this.selectPayWay == 'AliPayService' || this.selectPayWay == 'WxPayService') {
					this.PayAmont = this.totalAmount - this.yPayAmount;
				} else {
					this.PayAmont = 0;
				}
				uni.showToast({
					title: "支付成功！",
					duration: 2000,
					icon: "error"
				});

				//预留处理业务数据的地方
			},
			//轮询方法
			circleQuery: function(t, e, func1) {
				let that = this;
				let nums = 1;
				var timerIndex;
				var timerFunc = function() {
					if (nums <= 24) {
						that.queryPayAll(t, e, function(res) {
							if (res.code > 0) {
								//创建支付记录
								that.createPay(t);
								clearInterval(timerIndex);
							}
							if (res.code == 0) {
								//用户支付中  提示是否继续
								if (nums % 6 == 0) {
									clearInterval(timerIndex);
									uni.showModal({
										title: '提示',
										content: '是否继续等待？',
										confirmText: "是",
										cancelText: "否",
										success: function(res) {
											if (res.confirm) { //重启定时器继续查
												timerIndex = setInterval(timerFunc, 5000);
											} else {
												clearInterval(timerIndex);
												uni.showToast({
													title: "取消支付，正在撤销订单",
													icon: "none"
												})
												//撤销订单
												that.cancelPayAll(t, e, func1);
											}
										}
									})
								}

							} else {
								//查询失败信息
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: "error"
								});
							}
						});
					} else { //撤销订单
						clearInterval(timerIndex);
						uni.showToast({
							title: "支付超时，正在撤销订单",
							icon: "none"
						})
						that.cancelPayAll(t, e, func1);
					}
					nums++
				}
				timerIndex = setInterval(timerFunc, 5000);
			},
			closeCode: function() {
				this.$refs['popup'].close();
			},
			QUsed: function(qinfo) {
				//继续支付   扣掉券的信息
				hy.TicktUse([{
						"ZZCP_NUM": qinfo.ZZCP_NUM,
						"ZZCPHX_CHANNEL": qinfo.ZZCPHX_CHANNEL,
						"ZZCPHX_STORE": qinfo.ZZCPHX_STORE,
						"ZZVBELN": qinfo.ZZVBELN,
						"ZZTPRICE": "288.00", //订单金额
						// "ZZCPHXDATE": DateTime.Now.ToString("yyyyMMdd"),
						// "ZZCPTIME": DateTime.Now.ToString("HHmmss"),
						"ZZPRODUCT_ID": "000000001090100002", // 商品编码
						"ZZPRODUCT_NET": 279.0, //商品金额
						"ZZPRODUCT_NUM": 1.0 //商品数量
					}],
					function(res) {
						let used = JSON.parse(res.data);
						let GT_RETURN = used.GT_RETURN[0];
						if (GT_RETURN.TYPE == "E") {
							uni.showToast({
								title: GT_RETURN.MESSAGE,
								duration: 2000,
								icon: "error"
							});
						} else {
							that.PayAmont = that.dPayAmount;
							//多的生成放弃记录
							if (qamount > that.dPayAmount) {
								//放弃金额
								let fq = qamount - that.dPayAmount; //券金额-待支付金额=放弃金额
								//生成放弃记录
							}
							//生成支付记录   抵扣金额=所有待支付金额
						}
					});
			},
			QPay: function(code) {
				let that = this;
				//查询券  code查询出来券的金额 假如是10块钱
				let qamount = 0;
				hy.TicktQuery(code, "",
					function(res) {
						//有券
						if (res.code) {
							let q = JSON.parse(res.data);
							qamount = q.ZZCPVALUE;
							if (qamount > that.dPayAmount) {
								uni.showModal({
									title: '提示',
									content: '券金额:' + qamount + ',大于支付金额，是否继续支付？',
									confirmText: "是",
									cancelText: "否",
									success: function(res) {
										if (res.confirm) {
											that.QUsed(q);
										} else if (res.cancel) {
											return;
										}
									}
								});
							} else {
								that.QUsed(q);
							}
						} else {
							//无券或者异常
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: "error"
							});
							return;
						}
					});




			},
			Pay: function() {
				if (!this.selectPayWay) {
					uni.showToast({
						title: '请选择支付方式',
						duration: 2000,
						icon: "error"
					});
					return;
				}
				//券支付
				if (this.selectPayWay != 'qzf') {
					if (!this.PayAmont) {
						uni.showToast({
							title: '请输入支付金额',
							duration: 2000,
							icon: "error"
						});
						return;
					}
					if (this.PayAmont > (this.totalAmount - this.yPayAmount)) {
						uni.showToast({
							title: '输入的金额有误',
							duration: 2000,
							icon: "error"
						});
						return;
					}
				}
				this.$refs['popup'].open();

			},
			ToPay: function(e) {
				let that = this;
				let title = "";
				let code = e.target.value;
				that.out_trade_no = common.CreateBill("K210QTD002", "001");
				console.info(that.out_trade_no);
				if (that.selectPayWay == null) return
				//券支付
				if (that.selectPayWay == 'qzf') {
					that.QPay(code);
				}
				//支付宝支付
				else if (that.selectPayWay == 'AliPayService') {
					let t = "ALI";
					if (!code) {
						///查询
						//根据单号—+序号进行查询
						that.queryPayAll(t, that.sale1_obj, function(res) {
							if (res.code > 0) {
								//创建支付记录
								that.createPay(t);
							}
							if (res.code == 0) {
								 //用户支付中
								 uni.showToast({
								 	title: res.msg,
								 	duration: 2000,
								 	icon: "error"
								 });
							} else {
								// 
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: "error"
								});
							}
						});
					} else {
						that.sale1_obj.out_trade_no = common.CreateBill("K210QTD002", "001");
						that.sale1_obj.auth_code = code;
						that.sale1_obj.subject = "商品支付";
						that.sale1_obj.totalAmount = that.PayAmont;
						//发起支付
						that.paymentAll(t, that.sale1_obj, function(res) {
							debugger;
							if (res.code > "0") {
								uni.showToast({
									title: "支付成功",
									icon: "success",
									success() {
										that.$refs['popup'].close();
									}
								});
							} else if (res.code == 0) {
								//轮询操作
								that.circleQuery(t, that.sale1_obj);
							} else {
								uni.showToast({
									title: res.msg,
									icon: "error",
									success() {
										that.$refs['popup'].close();
									}
								});
							}

						})
					}
				}
			},
			refund: function(data) {
				let that = this;
				var array = this.PayWay.filter((item) => {
					return item.name == data.way;
				})
				let t = array[0].value;
				// ,
				// refund_amount:data.amount
				//查询退款
				//1.根据单号查询数据库中的订单
				//2.根据订单查询退款单号  
				let out_request_no = null;
				//如果没有查出来就  生成退款单号直接退款接口
				if (!out_request_no) {
					out_request_no = common.CreateBill("K210QTD002", "001");
					console.info(out_request_no);
					that.sale3_obj = {
						out_trade_no: data.no,
						refund_amount: data.amount,
						out_request_no: out_request_no
					};
					that.RefundAll(t, that.sale3_obj, function(res1) {
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
								title: "退款失败：" + res1.msg,
								icon: "error"
							});
						}
					});
				} else {
					//如果有退款单号就查退款接口
					let obj = {
						out_trade_no: data.no,
						out_request_no: out_request_no
					}
					let t = "ALI";
					that.queryRefundAll(t, obj, function(res) {
						console.log("查询结果" + res);
						if (code == 1) {
							//查询到已经是退款成功的生成退款记录
						} else if (code == 0) {

							//发起退款
							that.RefundAll(t, that.sale3_obj, function(res1) {
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
										title: "退款失败：" + res1.msg,
										icon: "error"
									});
								}
							});
						} else {
							//异常或者其它信息
							uni.showToast({
								title: res.msg,
								icon: "error"
							});
						}
					});


				}



			},
			//支付方法合集
			paymentAll: function(t, e, func) {
				let Result;
				if (t == 'WX') {
					_wx.CodeScanPay("微信扫码付", e.out_trade_no, e.subject, e.auth_code, e.totalAmount,
						function(res) {
							Result = JSON.parse(res.data);
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
								.trade_type == 'MICROPAY') { //支付成功
								Result.new_code = '1';
							} else if (Result.return_code == 'SUCCESS' && Result.result_code ==
								'USERPAYING') { //支付中
								Result.new_code = '0';
							} else {
								Result.new_code = '-1';
								Result.new_msg = Result.return_msg;
							}
							if (func) func(Result);
						});
				} else if (t == 'ALI') {
					_ali.Payment("支付宝付款码支付", "CodePayment", "AliPayService", {
							out_trade_no: e.out_trade_no,
							auth_code: e.auth_code,
							subject: e.subject,
							total_amount: e.totalAmount
						},
						function(res) {
							Result = JSON.parse(res.data);
							Result = Result.alipay_trade_pay_response;
							//支付成功
							if (Result.code == "10000") {
								Result.code = '1';

							}
							//支付中或者系统异常情况下 开启轮询
							else if (Result.code == "10003" || Result.sub_code == "ACQ.SYSTEM_ERROR") {
								if (!Result.msg) {
									title = Result.msg;
								}
								Result.code = '0';
							} else {
								Result.code = '-1';
							}
							if (func) func(Result);
						},
						function(res) {

							if (res.data != null) {
								let errResult = JSON.parse(res.data);
								errResult = errResult.alipay_trade_pay_response;
								//非业务失败
								if (errResult.code != "40004") {
									res.msg = errResult.msg;
								} else {
									//业务失败
									res.msg = errResult.sub_msg;
								}
							}
							res.code = '-1'
							if (func) func(res);
						}

					);
				} else if ('CARD') {

				} else if ('COUPON') {

				} else {}
			}
		}
	}
</script>

<style>
	.uni-tip {
		background: #fff;
		width: 70%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		border-radius: 10px;
	}

	.uni-tip-title {
		text-align: center;
		font-size: 16px;
	}

	.uni-tip-group-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-content: center;
	}

	.uni-tip-group-button button {
		margin: 0;
	}

	.uni-tip-content {
		min-height: 60px;
	}
</style>
