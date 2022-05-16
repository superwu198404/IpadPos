<template>
	<view>
		<p>总金额：{{allAmount}}</p>
		<p>应收：{{totalAmount}}</p>
		<p>已支付：{{yPayAmount}}</p>
		<p>待支付：{{dPayAmount}}</p>
		<view>
			<radio-group class="radio-group" @change="radioChange">
				<label class="radio" v-for="(item, index) in PayWayList" :key="item.value">
					<radio :value="item.value" :checked="item.checked" /> {{item.name}}
				</label>
			</radio-group>
		</view>
		<view v-show="PayWay!=null">
			支付金额:
			<input :disabled="disablePayInput" v-model="PayAmount">
		</view>
		<button @click="Pay()">支付</button>
		<view> 支付列表:
			<p>序号---支付方式---金额---编码--操作</p>
			<view v-for="(way, index) in PayList">
				{{ way.no }} --- {{ way.name }} ---{{way.amount}}---{{ way.bill }}-- <label style="width:50rpx;"
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
	import insertsql from './Insert_sale.js';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: 'center',
				allAmount: 0, //订单总金额(包含折扣)
				totalAmount: 0, //应付总金额
				yPayAmount: 0, //已支付金额
				dPayAmount: 0, //待支付
				PayAmount: 0,
				Discount: 0,
				Products: [{
					PLID: "100",
					BARCODE: '4533331313',
					SPID: "123456",
					UNIT: "个",
					NAME: "黑森林",
					PRICE: 10,
					OPRICE: 10,
					AMOUNT: 20,
					QTY: 2
				}, {
					PLID: "101",
					SPID: "456786",
					UNIT: "袋",
					BARCODE: '4533338338454533',
					NAME: "毛毛虫",
					PRICE: 12,
					OPRICE: 12,
					AMOUNT: 24,
					QTY: 2
				}],
				PayWayList: [{
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
				PayWay: null,
				PayList: [{
					bill: "652313345645663",
					name: "支付宝",
					amount: 0.01,
					no: 0, //序号
					fkid: "ZF01"
				}],
				authCode: null,
				out_trade_no_old: "", //原顶单号
				out_trade_no: "", //单次支付的订单号（可能存在多笔同种支付的操作）
				disablePayInput: false,
				sale1_obj: {},
				sale2_obj: {},
				sale2_arr: [],
				sale3_obj: {},
				sale3_arr: [],
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				GSID: getApp().globalData.store.GSID,
				RYID: getApp().globalData.store.RYID
			}
		},
		methods: {
			//页面加载事件
			onLoad() {
				let spArr = this.Products;
				let money = 0;
				for (var i = 0; i < spArr.length; i++) {
					money += spArr[i].AMOUNT;
				}
				this.out_trade_no_old = common.CreateBill(this.KHID, this.POSID);
				this.out_trade_no = this.out_trade_no_old
				console.log("订单号" + this.out_trade_no);
				this.allAmount = money;
				this.totalAmount = money;
				this.CalDZFMoney();
			},
			//计算已支付，待支付金额
			CalDZFMoney: function() {
				let ymoney = 0; //计算总的已支付金额
				for (var i = 0; i < this.PayList.length; i++) {
					ymoney += this.PayList[i].amount;
				}
				this.yPayAmount = ymoney;
				this.dPayAmount = this.totalAmount - this.yPayAmount;
			},
			//单号防重处理
			UniqueBill: function() {
				let that = this;
				//单号防止重处理
				let pay_way = that.PayWayList.find(function(item) {
					return item.type == that.PayWay;
				});
				if (pay_way) {
					let pay_obj = that.PayList.find(function(item) {
						return item.name == pay_way.name;
					});
					if (pay_obj) { //说明已存在该支付方式 单号则需要加序号处理 防止单号重复
						that.out_trade_no = that.out_trade_no_old + '+' + that.PayList.length + 1;
					}
				}
			},
			//支付方式切换事件
			radioChange(e) {
				let value = e.target.value;
				let payobj = this.PayWayList.find(item => {
					return item.value == value
				});
				this.PayWay = payobj.type;
				if (this.PayWay == 'AliPayService' || this.PayWay == 'WxPayService') {
					this.PayAmount = this.dPayAmount;
					this.disablePayInput = false;
				} else {
					//券支付
					if (this.PayWay == "qzf") {
						//禁用输入金额框
						this.disablePayInput = true;
					}
					this.PayAmount = 0;
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
					_ali.Payment("订单撤销中..", "TradeCancel", "WxPayService", {
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

							//查询是否已经生成退款记录

							//支付成功生成记录
							that.dPayAmount += data.amount; //等支付减去支付金额
							that.yPayAmount -= data.amount //已支付加上支付金额
							if (that.PayWay == 'AliPayService' || that.PayWay == 'WxPayService') {
								that.PayAmount = that.totalAmount - that.yPayAmount;
							} else {
								that.PayAmount = 0;
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
							if (func) func(rResult);
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
				} else if (t == 'ACRD') {
					//会员卡退款
					let obj = {
						orderbill: "",
						refundbill: "",
						refundnet: "",
						payTxnId: ""
					}
					hy.REFUND_ALL('KG', function(res) {
						if (res.code) {
							res.code = '1';
							// let data = JSON.parse(res.data);
							// if (!data.cardList) {
							// 	//卓越
							// } else {
							// 	//仟吉
							// 	let data = data.cardList;
							// }
						} else {
							res.code = '-1';
							// uni.showToast({
							// 	title: res.msg,
							// 	duration: 2000,
							// 	icon: "error"
							// });
						}
						if (func) func(res);
					})
				} else if (t == 'COUPON') {

				} else {

				}
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
					_ali.Payment("订单查询..", "TradeQuery", "AliPayService", {
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
					//仟吉
					hy.QUERY_ALL(e.out_trade_no, function(res) {
						if (res.code) {
							res.code = '1';
						} else {
							res.code = '-1';
						}
						// if(res.code){
						// }else{
						// 	uni.showToast({
						// 		title: res.msg,
						// 		duration: 2000,
						// 		icon: "error"
						// 	});
						// }
						if (func) func(res);
					})

				} else if ('COUPON') {

				} else {}
			},
			//创建支付记录
			createPayDataData: function(t) {
				let that = this;
				let payobj = that.PayWayList.find(item => {
					return item.value == t
				});
				that.PayList.push({
					fkid: payobj.fkid,
					way: payobj.name,
					amount: that.dPayAmount,
					no: that.PayList.length + 1
				});
				//重新计算待支付金额
				that.CalDZFMoney(); 
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
								that.createPayData(t);
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
												timerIndex = setInterval(timerFunc,
													5000);
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
						ZZCP_NUM: qinfo.ZZCP_NUM,
						ZZCPHX_CHANNEL: qinfo.ZZCPHX_CHANNEL,
						ZZCPHX_STORE: qinfo.ZZCPHX_STORE,
						ZZVBELN: qinfo.ZZVBELN,
						ZZTPRICE: "288.00", //订单金额
						ZZCPHXDATE: dateformat.getYMD(),
						ZZCPTIME: dateformat.getYMDS(),
						ZZPRODUCT_ID: "000000001090100002", // 商品编码
						ZZPRODUCT_NET: this.allAmount , //商品金额
						ZZPRODUCT_NUM: this.Products.length//商品数量
					}],
					function(res) {
						if (res.code) {
							let used = JSON.parse(res.data);
							if (!used.GT_RETURN[0]) {
								//卓越
							} else {
								let GT_RETURN = used.GT_RETURN[0];
								if (GT_RETURN.TYPE == "E") {
									uni.showToast({
										title: GT_RETURN.MESSAGE,
										duration: 2000,
										icon: "error"
									});
								} else {
									that.PayAmount = that.dPayAmount;
									//生成支付列表记录
									that.PayList.push({
										fkid: "ZF03",
										way: "券支付",
										amount: that.dPayAmount,
										no: that.PayList.length + 1
									});
									//生成支付记录 抵扣金额=所有待支付金额
									//......
									if (qamount > that.dPayAmount) {
										//放弃金额
										let fq = qamount - that.dPayAmount; //券金额-待支付金额=放弃金额
										//生成支付列表放弃记录
										that.PayList.push({
											fkid: "ZF03",
											way: "券支付-放弃金额",
											amount: fq,
											no: that.PayList.length + 1
										});
										//生成支付记录的放弃记录
										//......
									}
								
								}
							}
						} else {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: "error"
							});
						}

					});
			},
			QPay: function(code) {
				let that = this;
				//查询券  code查询出来券的金额 
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
			KPay: function() {
				let that = this;
				//查询券  code查询出来券的金额 
				let kamount = 0;
				let obj = {
					orderInfo: {
						ordernet: "",
						orderbill: ""
					},
					paycode: "",
					storeid: "",
					storename: "",
					mer_id: ""
				};
				//仟吉
				hy.PAY_ALL('kg', obj, function(res) {
					if (res.code) {
						//仟吉就是成功  
						let data = JSON.parse(res.data);
						if (!data.cardList) {
							//卓越
                            
						} else {
							//仟吉
							let data = data.cardList;
						}
						//添加支付列表
						that.PayList.push({
							fkid: "ZF04",
							way: "电子卡",
							amount: kamount,
							no: that.PayList.length + 1
						})
						//生成支付记录

					} else {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: "error"
						});
					}
				})
			},
			//支付按钮点击事件
			Pay: function() {
				if (!this.PayWay) {
					uni.showToast({
						title: '请选择支付方式',
						duration: 2000,
						icon: "error"
					});
					return;
				}
				//券支付
				if (this.PayWay != 'qzf') {
					if (!this.PayAmount) {
						uni.showToast({
							title: '请输入支付金额',
							duration: 2000,
							icon: "error"
						});
						return;
					}
					if (this.PayAmount > (this.totalAmount - this.yPayAmount)) {
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
			//输入付款码后发起支付
			ToPay: function(e) {
				let that = this;
				let title = "";
				let param = {};
				let code = e.target.value;
				if (that.PayWay == null) return
				that.UniqueBill(); //单号防重处理
				//券支付
				if (that.PayWay == 'qzf') {
					that.QPay(code);
				} else if (that.PayWay == 'dzk') {
					that.KPay(code);
				}
				//支付宝支付
				else if (that.PayWay == 'AliPayService') {
					//查询
					if (!code) {
						param.out_trade_no = that.out_trade_no_old;
						//根据单号—+序号进行查询
						that.queryPayAll(t, that.sale1_obj, function(res) {
							if (res.code > 0) {
								//查询到了，查询是否有支付记录 没
                                let sql_query="select * from SALE001 where  BILL='"+that.sale1_obj+"'";
								//没有支付记录 生成支付记录
								//.....
							}
							if (res.code == 0) {
								//用户支付中
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: "error"
								});
							} else {
								// 异常、没有查询到
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: "error"
								});
							}
						});
					} else {
						param.out_trade_no = that.out_trade_no;
						param.auth_code = code;
						param.subject = "商品支付";
						param.totalAmount = that.PayAmount;
						let t = "ALI";
						//发起支付
						that.paymentAll(t, param, function(res) {
							if (res.code > "0") {
								uni.showToast({
									title: "支付成功",
									icon: "success",
									success() {
										that.$refs['popup'].close();
										//支付列表
										let payobj = that.PayWayList.find(item => {
											return item.value == t;
										});
										that.PayList.push({
											fkid: payobj.fkid,
											way: payobj.name,
											amount: that.dPayAmount,
											no: that.PayList.length + 1
										})
										//计算待支付金额
										let ymoney = 0; //计算总的已支付金额
										for (var i = 0; i < this.PayList.length; i++) {
											ymoney += this.PayList[i].amount;
										}
										this.yPayAmount = ymoney;
										this.dPayAmount = this.totalAmount - this.yPayAmount;
										//生成支付记录
										let store = getApp().globalData.store;
										//sale001
										let obj1 = {
											out_trade_no: that.out_trade_no,
											TLINE: that.Products.length,
											PayAmount: that.PayAmount,
											Discount: that.Discount
										};
										let s1sql = insertsql.sale1(obj1);
										let s2sql = insertsql.sale2(that.out_trade_no, that.products);
										let s3sql = insertsql.sale3(that.out_trade_no, that.PayList);
									}
								});
							} else if (res.code == 0) {
								//轮询操作
								that.circleQuery(t, param);
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
				var array = this.PayWayList.filter((item) => {
					return item.name == data.name;
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
					that.RefundAll(t, that.sale3_obj, 
					function(res1) {
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
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' &&
								Result
								.trade_type == 'MICROPAY') { //支付成功
								Result.code = '1';
							} else if (Result.return_code == 'SUCCESS' && Result.result_code ==
								'USERPAYING') { //支付中
								Result.code = '0';
							} else {
								Result.code = '-1';
								Result.msg = Result.return_msg;
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
								Result = JSON.parse(res.data);
								Result = errResult.alipay_trade_pay_response;
								//非业务失败
								if (Result.code != "40004") {
									res.msg = Result.msg;
								} else {
									//业务失败
									res.msg = Result.sub_msg;
								}
							}
							res.code = '-1';
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
