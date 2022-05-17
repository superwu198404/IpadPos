<template>
	<view>
		<view>
			<p>总金额：{{allAmount}}</p>
			<p>应收：{{totalAmount}}</p>
			<p>已支付：{{yPayAmount}}</p>
			<p>待支付：{{dPayAmount}}</p>
		</view>
		<!-- 商品详情 -->
		<view>
			<view v-for="(item,index) in Products">
				<text>{{item.NAME}}</text>-
				<text>￥{{item.AMOUNT}}</text>-
				<text>{{item.PRICE}}元/kg</text>-
				<text>x{{item.QTY}}</text>
			</view>
		</view>
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
			<p>序号---支付方式---金额--操作</p>
			<view v-for="(way, index) in PayList">
				{{ way.no }} --- {{ way.name }} ---{{way.amount}}-- <label style="width:50rpx;"
					@click=refund(way)>退款</label>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :type="type" :maskClick="false">
				<view class="uni-tip">
					<button @click="close">关闭</button>
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
	import db from '@/utils/db/db_excute.js';
	import create_sql from '@/utils/db/create_sql.js';
	import dateformat from '@/utils/dateformat.js';

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
					BARCODE: '111111111',
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
					BARCODE: '2222222222',
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
				selectPayWayVal: null,
				PayList: [{
					bill: "652313345645663",
					name: "支付宝",
					amount: 40,
					no: 0, //序号
					fkid: "ZF01"
				}, {
					bill: "652313345645663",
					name: "微信",
					amount: 3.99,
					no: 1, //序号
					fkid: "ZF02"
				}],
				authCode: null,
				out_trade_no_old: "", //原定单号
				out_trade_no: "", //单次发起支付的订单号（匹配多笔支付的操作 采用原订单号加序号的规则）
				disablePayInput: false,
				sale1_obj: {},
				sale2_obj: {},
				sale2_arr: [],
				sale3_obj: {},
				sale3_arr: [],
				tx_obj: {},
				GSID: getApp().globalData.store.GSID,
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID,
				GCID: getApp().globalData.store.GCID,
				BMID: getApp().globalData.store.BMID,
			}
		},
		methods: {
			//页面首次加载事件
			onLoad() {
				//首先创建销售表结构
				this.CreatSaleTable();

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
				setTimeout(() => { //测试时加的延迟定时器
					// this.CreateDBData();
					this.SearcheOrder("K210QTD00112022516175759256");
					// this.TestDB();
				}, 3000);

			},
			//创建销售表结构
			CreatSaleTable: function() {
				let sql = create_sql.createSql; //创建表
				db.SqliteHelper.get().executeDml(sql, "表结构创建中", function(res) {
					console.log("表结构创建成功");
					console.log(res);
				}, function(err) {
					console.log("表结构创建失败");
					console.log(err);
				});
			},
			QUsed: function(qinfo, func) {
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
						ZZPRODUCT_NET: this.allAmount, //商品金额
						ZZPRODUCT_NUM: this.Products.length //商品数量
					}],
					function(res) {
						if (res.code) {
							let used = JSON.parse(res.data);
							if (!used.GT_RETURN[0]) {
								//卓越
								res.code = 1;
							} else {
								let GT_RETURN = used.GT_RETURN[0];
								if (GT_RETURN.TYPE == "E") {
									res.code = -1;
									res.msg = GT_RETURN.MESSAGE
								} else {
									res.code = 1;
									// that.PayAmount = that.dPayAmount;
									// //生成支付列表记录
									// that.PayList.push({
									// 	fkid: "ZF03",
									// 	way: "券支付",
									// 	amount: that.dPayAmount,
									// 	no: that.PayList.length + 1
									// });
									// //生成支付记录 抵扣金额=所有待支付金额
									// //......
									// if (qamount > that.dPayAmount) {
									// 	//放弃金额
									// 	let fq = qamount - that.dPayAmount; //券金额-待支付金额=放弃金额
									// 	//生成支付列表放弃记录
									// 	that.PayList.push({
									// 		fkid: "ZF03",
									// 		way: "券支付-放弃金额",
									// 		amount: fq,
									// 		no: that.PayList.length + 1
									// 	});
									// 	//生成支付记录的放弃记录
									// 	//......
									// }

								}
							}
						} else {
							res.code = -1;
						}
						if (func) func(res);
					});
			},
			//计算已支付，待支付金额
			CalDZFMoney: function() {
				let ymoney = 0; //计算总的已支付金额
				for (var i = 0; i < this.PayList.length; i++) {
					ymoney += parseFloat(this.PayList[i].amount);
				}
				this.yPayAmount = ymoney.toFixed(2);
				this.dPayAmount = (this.totalAmount - this.yPayAmount).toFixed(2);
				this.PayAmount = this.dPayAmount;
			},
			//单号防重处理
			UniqueBill: function() {
				let that = this;
				that.out_trade_no = that.out_trade_no_old + '_' + that.PayList.length;
				return;
				//单号防止重处理（暂不启用）
				let pay_way = that.PayWay.find(function(item) {
					return item.type == that.selectPayWay;
				});
				if (pay_way) {
					let pay_obj = that.PayList.find(function(item) {
						return item.name == pay_way.name;
					});
					if (pay_obj) { //说明已存在该支付方式 单号则需要加序号处理 防止单号重复
						that.out_trade_no = that.out_trade_no_old + '_' + (that.PayList.length + 1);
					}
				}
			},
			//支付方式切换事件
			radioChange(e) {
				let value = e.target.value;
				let payobj = this.PayWayList.find(item => {
					return item.value == value
				});
				this.selectPayWay = payobj.type;
				this.selectPayWayVal = payobj.value;
				if (this.selectPayWay == 'AliPayService' || this.selectPayWay == 'WxPayService') {
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
								Result.code = 1;
							} else {
								//没有退款  
								Result.code = 0;
								that.ToRefund("正在退款中..", data.no, data.amount, "T" + data.no, array[0].value);
							}

							// that.PayList.push({
							// 	way: "支付宝",
							// 	amount: data.amount,
							// 	no: "T" + data.no
							// });
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
								res.code = -1;
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
								rResult.code = 1;
							} else {
								rResult.code = 0;
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
								res.code = -1
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
					//券的也没有
				} else {

				}
			},
			//查询支付结果合集
			queryPayAll: function(t, e, func) {
				let that = this;
				let Result;
				if (t == 'WX') {
					_wx.QueryCodeScanPay("查询支付结果...", e.out_trade_no,
						function(res) {
							Result = JSON.parse(res.data);
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
								.trade_state == 'SUCCESS') { //支付成功
								Result.code = '1';
							} else if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
								.trade_state == 'USERPAYING') { //支付中
								Result.code = '0';
							} else {
								Result.code = '-1';
								Result.msg = Result.return_msg;
							}
							if (func) func(Result);
						});
				} else if (t == 'ALI') {
					_ali.Payment("查询支付结果...", "TradeQuery", that.selectPayWay, {
							out_trade_no: e.out_trade_no
						},
						function(res) {
							let qResult = JSON.parse(res.data);
							qResult = qResult.alipay_trade_query_response;
							if (qResult.code == "10000") {
								if (qResult.trade_status == "WAIT_BUYER_PAY") {
									//交易创建，等待买家付款 加上用户支付中提示
									qResult.msg = "支付中，请稍后..";
									qResult.code = 0;
								} else {
									//交易支付成功//生成支付记录
									if (qResult.trade_status == "TRADE_SUCCESS") {
										qResult.code = 1;
									} else {
										let msg = "";
										if (qResult.trade_status == "TRADE_CLOSED") {
											msg = "未付款,交易超时已关闭";
										}
										if (qResult.trade_status == "TRADE_FINISHED")
											msg = "交易结束完成";
										qResult.code = -1;
										qResult.msg = msg;
									}
								}
							} else {
								//异常
								qResult.code = -1;
							}
							if (func) func(qResult);
						},
						function(res) {
							res.code = -1;
							res.msg = "支付异常";
							if (func) func(res);
						});
				} else if ('CARD') {
					//仟吉
					hy.QUERY_ALL(e.out_trade_no, function(res) {
						if (res.code) {
							res.code = 1;
						} else {
							res.code = -1;
						}
						if (func) func(res);
					})
				} else if ('COUPON') {
					//券的暂时没有
					if (func) func({
						code: 1,
						msg: ''
					});
				} else {}
			},

			//创建订单数据
			CreateDBData: function() {
				//基础数据
				this.sale1_obj = {
					BILL: this.out_trade_no_old,
					SALEDATE: dateformat.getYMD(),
					SALETIME: dateformat.getYMDS(),
					KHID: this.KHID,
					POSID: this.POSID,
					RYID: this.RYID,
					BILL_TYPE: 'Z101', //门店现场销售单
					XSTYPE: "1",
					XS_BILL: "", //退款时记录原单号
					XS_POSID: "", //退款时记录原posid
					XS_DATE: "", //退款时记录原销售日期
					XS_KHID: "", //退款时记录原khid
					XS_GSID: "", //退款时记录原GSID
					TLINE: this.sale2_obj.length,
					TNET: this.totalAmount,
					DNET: 0,
					ZNET: this.allAmount,
					BILLDISC: this.Discount,
					ROUND: 0,
					CHANGENET: 0,
					CXTNET: 0,
					TCXDISC: 0,
					CUID: "", //会员号
					CARDID: "", //卡号
					THYDISC: this.Discount,
					YN_SC: 'N',
					GSID: this.GSID, //公司
					GCID: this.GCID, //工厂
					DPID: this.DPID, //店铺
					KCDID: this.KCDID, //库存点
					BMID: this.BMID, //部门id
					DKFID: this.DKFID, //大客户id默认编码
					XSPTID: 'POS',
					YN_OK: 'X',
					THTYPE: 0,
					CLTIME: dateformat.getYMDS()
				};
				for (var i = 0; i < this.Products.length; i++) {
					this.sale2_obj = {
						BILL: this.out_trade_no_old,
						SALEDATE: dateformat.getYMD(),
						SALETIME: dateformat.getYMDS(),
						KHID: this.KHID,
						POSID: this.POSID,
						SPID: this.Products[i].SPID,
						NO: i + 1,
						PLID: this.Products[i].PLID,
						BARCODE: this.Products[i].BARCODE,
						UNIT: this.Products[i].UNIT,
						QTY: this.Products[i].QTY,
						PRICE: this.Products[i].PRICE,
						OPRICE: this.Products[i].OPRICE,
						NET: this.Products[i].PRICE,
						DISCRATE: "0",
						YN_SKYDISC: 'N', //是否有手工折扣
						DISC: 0, //手工折扣额
						YN_CXDISC: 'N',
						CXDISC: 0,
						YAER: new Date().getFullYear(),
						MONTH: new Date().getMonth() + 1,
						WEEK: dateformat.getYearWeek(new Date().getFullYear(), new Date().getMonth() + 1,
							new Date().getDay()),
						TIME: new Date().getHours(),
						RYID: this.RYID, //人员
						GCID: this.GCID, //工厂
						DPID: this.DPID, //店铺
						KCDID: this.KCDID, //库存点
						BMID: this.BMID //部门id
					};
					this.sale2_arr = this.sale2_arr.concat(this.sale2_obj);
				}
				for (var i = 0; i < this.PayList.length; i++) {
					this.sale3_obj = {
						BILL: this.out_trade_no_old,
						SALEDATE: dateformat.getYMD(),
						SALETIME: dateformat.getYMDS(),
						KHID: this.KHID,
						POSID: this.POSID,
						NO: this.PayList[i].no,
						FKID: this.PayList[i].fkid,
						AMT: this.PayList[i].amount,
						RYID: this.RYID, //人员
						GCID: this.GCID, //工厂
						DPID: this.DPID, //店铺
						KCDID: this.KCDID, //库存点
						BMID: this.BMID, //部门id
						DISC: ""
					};
					this.sale3_arr = this.sale3_arr.concat(this.sale3_obj);
				}

				//执行sql
				let sql1 = common.CreateSQL(this.sale1_obj, 'SALE001');
				let sql2 = common.CreateSQL(this.sale2_arr, 'SALE002');
				let sql3 = common.CreateSQL(this.sale3_arr, 'SALE003');

				this.tx_obj = {
					TX_SQL: sql1.oracleSql + sql2.oracleSql + sql3.oracleSql,
					STOREID: this.KHID,
					POSID: this.POSID,
					TAB_NAME: 'XS',
					STR1: this.out_trade_no_old,
					BDATE: dateformat.getYMD(),
					YW_NAME: "销售单据",
					CONNSTR: 'CONNSTRING'
				};
				let sql4 = common.CreateSQL(this.tx_obj, 'POS_TXFILE');

				// console.log(sql1.sqlliteArr);
				// console.log(sql2.sqlliteArr);
				// console.log(sql3.sqlliteArr);
				// console.log(sql4.sqlliteArr);

				let exeSql = sql1.sqlliteArr.concat(sql2.sqlliteArr).concat(sql3.sqlliteArr).concat(sql4.sqlliteArr);
				console.log("sqlite待执行sql:")
				console.log(exeSql);
				//return;
				db.SqliteHelper.get().executeDml(exeSql, "订单创建中", function(res) {
					console.log("订单创建成功");
					console.log(res);
				}, function(err) {
					console.log("订单创建失败");
					console.log(err);
				});
			},
			//查询订单数据
			SearcheOrder: function(e) {
				let sql = 'select * from sale001 where STR1="' + e + '"';
				db.SqliteHelper.get().executeQry(sql, "数据查询", function(res) {
					console.log("查询成功");
					console.log(res);
				}, function(err) {
					console.log("查询失败");
					console.log(err);
				});
			},
			//创建支付记录
			createPayData: function(t) {
				let that = this;
				let payobj = that.PayWayList.find(item => {
					return item.value == t
				});
				that.PayList.push({
					fkid: payobj.fkid,
					bill: that.out_trade_no,
					name: payobj.name,
					amount: that.dPayAmount,
					no: that.PayList.length
				});
				//重新计算待支付金额
				that.CalDZFMoney();
				uni.showToast({
					title: "支付成功",
					icon: "success",
					success: function(res) {
						that.$refs['popup'].close();
					}
				})
				//预留处理业务数据的地方
				if (that.dPayAmount == 0) { //说明支付完毕了
					this.CreateDBData();
				}
			},
			TestDB: function() {
				let sql = [
					"insert into SALE002 (BILL,SALEDATE,SALETIME,KHID,POSID,SPID,NO,PLID,BARCODE,UNIT,QTY,PRICE,OPRICE,NET,DISCRATE,YN_SKYDISC,DISC,YN_CXDISC,CXDISC,YAER,MONTH,WEEK,TIME,RYID,GCID,DPID,KCDID,BMID) values(\"K210QTD00112022516171757506_2\",DATETIME(\"2022-05-16\"),DATETIME(\"2022-05-16 17:18:42\"),\"K210QTD001\",\"1\",\"123456\",\"1\",\"100\",\"4533331313\",\"个\",\"2\",\"10\",\"10\",\"10\",\"0\",\"N\",null,\"N\",null,\"2022\",\"5\",\"18\",\"17\",\"10086\",\"1001\",null,null,\"001\")"
				];
				db.SqliteHelper.get().executeDml(sql, "订单创建中", function(res) {
					console.log("订单创建成功");
					console.log(res);
				}, function(err) {
					console.log("订单创建失败");
					console.log(err);
				});
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
								//支付成功创建支付记录
								that.createPayData(t);
								clearInterval(timerIndex);
							} else if (res.code == 0) {
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
									icon: "error",
									success: function() {
										//撤销订单
										that.cancelPayAll(t, e, func1);
									}
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
				timerFunc();
				timerIndex = setInterval(timerFunc, 5000);
			},
			close: function() {
				this.$refs['popup'].close();
			},
			//支付按钮点击事件
			Pay: function() {
				this.authCode = "";
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
					if (this.PayAmount <= 0 || this.PayAmount > this.dPayAmount) {
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
				that.UniqueBill(); //单号防重处理
				param.out_trade_no = that.out_trade_no;
				param.auth_code = code;
				param.subject = "商品支付";
				param.totalAmount = that.PayAmount;
				if (code) { //code 有值则发起支付
					that.paymentAll(that.selectPayWayVal, param, function(res) {
						if (res.code < 0) {
							uni.showToast({
								title: res.msg,
								icon: "error"
							});
							return;
						} else {
							if (that.selectPayWayVal != 'COUPON') {
								that.circleQuery(that.selectPayWayVal, param, function(res) {});
							} else {
                                //券支付结果
								//生成券支付记录

							}
						}
					});
				} else { //没值则发起查询
					that.queryPayAll(that.selectPayWayVal, param, function(res) {
						if (res.code > 0) { //是支付成功的
							that.createPayData(that.selectPayWayVal); //追加支付成功的记录
						} else {
							uni.showToast({
								title: res.msg,
								icon: "error"
							});
						}
					})
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
					_wx.CodeScanPay("微信支付", e.out_trade_no, e.subject, e.auth_code, e.totalAmount * 100,
						function(res) {
							debugger;
							Result = JSON.parse(res.data);
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' &&
								Result
								.trade_type == 'MICROPAY') { //支付成功
								Result.code = '1';
							} else if (Result.return_code == 'SUCCESS' && Result.err_code ==
								'USERPAYING') { //支付中
								Result.code = '0';
							} else {
								Result.code = '-1';
								Result.msg = Result.err_code_des; //return_msg;
							}
							if (func) func(Result);
						},
						function(err) {
							if (err) {
								err.code = '-1';
							}
							if (func) func(err);
						});
				} else if (t == 'ALI') {
					_ali.Payment("支付宝支付", "CodePayment", "AliPayService", {
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
								Result.code = 1;
							}
							//支付中或者系统异常情况下 开启轮询
							else if (Result.code == "10003" || Result.sub_code == "ACQ.SYSTEM_ERROR") {
								if (!Result.msg) {
									title = Result.msg;
								}
								Result.code = 0;
							} else {
								Result.code = -1;
							}
							if (func) func(Result);
						},
						function(res) {
							if (res.data != null) {
								Result = JSON.parse(res.data);
								Result = Result.alipay_trade_pay_response;
								//非业务失败
								if (Result.code != "40004") {
									res.msg = Result.msg;
								} else {
									//业务失败
									res.msg = Result.sub_msg;
								}
							}
							res.code = -1;
							if (func) func(res);
						}
					);
				} else if ('CARD') {
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
							res.code = 1;
							// //仟吉就是成功  
							// let data = JSON.parse(res.data);
							// if (!data.cardList) {
							// 	//卓越
							//                          res.code='1';
							// } else {
							// 	//仟吉
							// 	let data = data.cardList;
							// }
							// //添加支付列表
							// that.PayList.push({
							// 	fkid: "ZF04",
							// 	way: "电子卡",
							// 	amount: kamount,
							// 	no: that.PayList.length + 1
							// })
							//生成支付记录
						} else {
							res.code = -1;
						}
						if (func) func(res);
					});
				} else if ('COUPON') {
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
										success: function(cres) {
											if (cres.confirm) {
												that.QUsed(q, function(res1) {
													if (func) func(res1);
												});
											} else if (cres.cancel) {
												cres.code = -1;
												cres.msg = '已放弃支付';
												if (func) func(cres);
											}
										}
									});
								} else {
									//继续支付   扣掉券的信息
									that.QUsed(q, function(res1) {
										if (func) func(res1);
									});
								}
							} else {
								//无券或者异常
								res.code = -1;
								if (func) func(res);
							}
						});

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
