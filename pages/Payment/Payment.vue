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
			<input v-model="PayAmont">
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
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue'
	import hy from '@/utils/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import _wx from '@/utils/Pay/WxPay.js';
	import _ali from '@/utils/Pay/Alipay.js';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: 'center',
				totalAmount: 1000000, //应付
				yPayAmount: 0, //已支付金额
				dPayAmount: 1000000, //待支付
				PayWay: [{
						name: '支付宝',
						value: 'AliPayService'
					},
					{
						name: '微信',
						value: 'WxPayService',

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
				PayAmont: 0,
				selectPayWay: null,
				PayList: [{
					way: "支付宝",
					amount: 0.01,
					no: "2022050914270271"
				}],
				authCode: null,
				out_trade_no: "2022050914270271"
			}
		},
		methods: {
			radioChange(e) {
				let way = e.target.value;
				this.selectPayWay = way;
				if (way == 'AliPayService' || way == 'WxPayService') {
					this.PayAmont = this.totalAmount - this.yPayAmount;
				} else {
					this.PayAmont = 0;
				}
			},
			paysuccess: function(Result) {
				this.PayList.push({
					way: "支付宝",
					amount: this.PayAmont,
					no: Result.out_trade_no
				});
				//支付成功生成记录
				this.dPayAmount -= this.PayAmont; //等支付减去支付金额
				this.yPayAmount += this.PayAmont //已支付加上支付金额
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
			},

			closeCode: function() {
				this.$refs['popup'].close();
			},
			OrderQuery: function(title, out_trade_no, func, fun4) {
				_ali.Payment(title, "TradeQuery", this.selectPayWay, {
					out_trade_no: out_trade_no
				}, func, fun4);
			},
			OrderCancel: function(title, out_trade_no) {
				_ali.Payment(title, "TradeCancel", this.selectPayWay, {
						out_trade_no: out_trade_no
					},
					function(res) {
						let qResult = JSON.parse(res.data);
						qResult = qResult.alipay_trade_cancel_response
						if (qResult.code == "10000") {
							uni.showToast({
								title: "支付超时，订单已撤销",
								duration: 2000,
								icon: "error"
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
						errResult = errResult.alipay_trade_cancel_response
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
				this.$refs['popup'].open();

			},
			ToPay: function(e) {
				let that = this;
				let code = e.target.value;
				let times = 0;
				let timerIndex;
				let title = "";
				//定时器
				var timer = function() {
					if (times < 25) {
						//查询 订单
						that.OrderQuery(title, that.out_trade_no,
							function(res) {
								let qResult = JSON.parse(res.data);
								qResult = qResult.alipay_trade_query_response;
								if (qResult.code == "10000") {
									if (qResult.trade_status == "WAIT_BUYER_PAY") {
										//交易创建，等待买家付款 加上用户支付中提示
										title = "支付中，请稍后.."
									} else {
										//交易支付成功//生成支付记录
										if (qResult.trade_status == "TRADE_SUCCESS") {
											that.paysuccess(qResult);
										} else {
											let msg = "";
											if (qResult.trade_status == "TRADE_CLOSED") {
												msg = "未付款,交易超时已关闭";
											}
											if (qResult.trade_status == "TRADE_FINISHED")
												msg = "交易结束完成";

											uni.showToast({
												title: msg,
												duration: 2000,
												icon: "error"
											});
										}
										clearInterval(timerIndex);
										timer = null;
									}
								} else {
									//异常
									clearInterval(timerIndex);
									timer = null;
									return false;
								}
								return res;
							},
							function(res) {
								clearInterval(timerIndex);
								uni.showToast({
									title: "支付异常",
									duration: 2000,
									icon: "error"
								});
							});
						//提示是否继续等待
						if (times == 6 || times == 12 || times == 18 || times == 24) {
							clearInterval(timerIndex);
							uni.showModal({
								title: '提示',
								content: '是否继续等待',
								confirmText: "是",
								cancelText: "否",
								success: function(res) {
									if (res.confirm) {
										timerIndex = setInterval(timer, 5000)
									} else if (res.cancel) {
										//不等待就取消查询   取消订单
										that.OrderCancel("支付取消，订单撤销中..", that.out_trade_no);

									}
								}
							});
						}
					} else {
						clearInterval(timerIndex);
						//还是没结果撤销订单
						that.OrderCancel("支付超时，订单撤销中", that.out_trade_no);
					}
					times++;
				};
				if (!code) {
					//根据单号—+序号进行查询
					title = "正在查询订单支付结果，请稍后...";
					//查询 订单
					that.OrderQuery(title, that.out_trade_no,
						function(res) {
							let qResult = JSON.parse(res.data);
							qResult = qResult.alipay_trade_query_response;
							if (qResult.code == "10000") {
								if (qResult.trade_status == "WAIT_BUYER_PAY") {
									//交易创建，等待买家付款 加上用户支付中提示
									title = "支付中，请稍后.."
								} else {
									//交易支付成功//生成支付记录
									if (qResult.trade_status == "TRADE_SUCCESS") {
										that.paysuccess(qResult);
									} else {
										let msg = "";
										if (qResult.trade_status == "TRADE_CLOSED") {
											msg = "未付款,交易超时已关闭";
										}
										if (qResult.trade_status == "TRADE_FINISHED")
											msg = "交易结束完成";

										uni.showToast({
											title: msg,
											duration: 2000,
											icon: "error"
										});
									}
									clearInterval(timerIndex);
									timer = null;
								}
							} else {
								//异常
								clearInterval(timerIndex);
								timer = null;
								return false;
							}
							return res;
						},
						function(res) {
							clearInterval(timerIndex);
							uni.showToast({
								title: "支付异常",
								duration: 2000,
								icon: "error"
							});
						});
				} else {
					title = "支付宝付款码支付";
					let result = _ali.Payment(title, "CodePayment", this.selectPayWay, {
							out_trade_no: that.out_trade_no, //2022050914270235
							auth_code: that.authCode,
							subject: "测试测试",
							total_amount: that.PayAmont
						},
						function(res) {
							let Result = JSON.parse(res.data);
							Result = Result.alipay_trade_pay_response;
							if (Result.code == "10000") {
								that.paysuccess(Result);
								return;
							} else if (Result.code == "10003") { //支付中 交易创建，等待买家付款
								title = "用户支付中";
								times = 0
								timerIndex = setInterval(timer, 5000)
							}
							that.authCode = null;
							return Result;
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
							Result = Result.alipay_trade_pay_response;
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
							that.authCode = null;
						});
				}
			},
			refund: function(data) {
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
						let Result = JSON.parse(res.data);
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
