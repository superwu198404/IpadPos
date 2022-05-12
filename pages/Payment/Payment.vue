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
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue'

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
						value: 'WX',
						type: "AliPayService"
					},
					{
						name: '微信',
						value: 'ALI',
						type: "AliPayService"
					},
					{
						name: '仟吉券支付',
						value: 'qjqzf',
						type: "qjqzf"
					},
					{
						name: '卓越券支付',
						value: 'zyqzf',
						type: "zyqzf"
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
					if (this.selectPayWay == "qjqzf" || this.selectPayWay == "zyqzf") {
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
							if (res.data == null) {
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: "none"
								});
								 
							} else {
								let errResult = JSON.parse(res.data);
								errResult = errResult.alipay_trade_cancel_response
								let msg=""
								//非业务失败
								if (errResult.code != "40004") {
									//业务失败
									msg= errResult.sub_msg;
								} else {
									//业务失败
									msg= errResult.sub_msg;
								}
								uni.showToast({
									title: msg,
									duration: 2000,
									icon: "none"
								});
							}
							if (func) func(res);
						});
				} else if ('CARD') {

				} else if ('COUPON') {

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
							res.msg="支付异常";
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
						} else {
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
						}
					});
			},
			Qj_QPay: function(code) {
				let  that=this;
				//查询券  code查询出来券的金额 假如是10块钱
				let qamount=0;
				hy.TicktQuery(code,"",
				function(res){
					//有券
					if(res.code){
						let q=JSON.parse(res.data);
						qamount=q.ZZCPVALUE;
					}else{
						//无券或者异常
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: "error"
						});
						return;
					}
				});
				 
				if (qamount> that.dPayAmount) {
					uni.showModal({
						title: '提示',
						content: '券金额:'+qamount+',大于支付金额，是否继续支付？',
						confirmText: "是",
						cancelText: "否",
						success: function(res) {
							if (res.confirm) {
								//继续支付   扣掉券的信息  
								that.PayAmont=that.dPayAmount;
								 //多的生成放弃记录
								 if (qamount> that.dPayAmount) {
								 	//放弃金额
								 	let fq=qamount- that.dPayAmount; //券金额-待支付金额=放弃金额
								 	 //生成放弃记录
								 }
								 //生成支付记录   抵扣金额=所有待支付金额
								 
							} else if (res.cancel) {
								return;
							}
						}
					});
				}
		 

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
				if(this.selectPayWay!='qjqzf'&&this.selectPayWay!='zyqzf'){
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
				if (that.selectPayWay == 'qjqzf') {
					that.Qj_QPay(code);
				} else if (that.selectPayWay == 'zyqzf') {

				}
				//支付宝支付
				else if (that.selectPayWay == 'AliPayService') {

					if (!code) {
						///查询

						//根据单号—+序号进行查询
						title = "正在查询订单支付结果，请稍后...";
						//查询 订单
						that.OrderQuery(title, that.out_trade_no);
					} else {
						that.sale1_obj.out_trade_no = common.CreateBill("K210QTD002", "001");
						that.sale1_obj.auth_code = code;
						that.sale1_obj.subject = "商品支付";
						that.sale1_obj.totalAmount = that.PayAmont;
						let t="ALI";
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
						} else {
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
						}
					});

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
							let err = {
								code: "-1",
								msg: ""
							}
							if (res.data == null) {
								err.msg = res.msg;
							} else {
								let errResult = JSON.parse(res.data);
								errResult = errResult.alipay_trade_pay_response;
								//非业务失败
								if (errResult.code != "40004") {
									err.msg = msg;
								} else {
									//业务失败
									err.msg = errResult.sub_msg;
								}
							}
							if (func) func(err);
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
