<template>
	<view>
		<!-- 付款详情 -->
		<view>
			<view class="text-area"> 总金额：{{totalAmount}} </view>
			<view class="text-area"> 折扣：{{Discount}} </view>
			<view class="input"> 实收：{{yPayAmount}} </view>
			<view class="input"> 欠款：{{PayAmount}} </view>
			<view class="input"> 还需支付：{{PayAmount}} </view>
		</view>
		<!-- 商品详情 -->
		<view>
			<view v-for="(item) in products">
				<text>{{item.NAME}}</text>-
				<text>￥{{item.AMOUNT}}</text>-
				<text>{{item.PRICE}}元/kg</text>-
				<text>x{{item.QTY}}</text>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :type="type" :maskClick="false">
				<view class="uni-tip">
					付款码：
					<input confirm-type="confirm" @confirm="ToPay" v-model="authCode">
				</view>
			</uni-popup>
		</view>
		<!-- <button @click="wxSanPay()">微信扫码支付</button>
		<button @click="aliSanPay()">支付宝扫码支付</button>
		<button @click="hyCardPay()">电子会员卡支付</button>
		<button @click="CouponPay()">电子券支付</button> -->
		<view>
			<radio-group class="radio-group" @change="radioChange">
				<label class="radio" v-for="(item, index) in PayWay" :key="item.value">
					<radio :value="item.value" :checked="item.checked" /> {{item.name}}
				</label>
			</radio-group>
		</view>
		<button @click="Pay()">支付</button>
		<button @click="CreatTable()">创建表</button>
		<button @click="TestSql()">数据测试</button>
		<view> 支付列表:
			<p>序号---支付方式---支付金额---编码</p>
			<view v-for="(way, index) in PayList">
				{{ index }} --- {{ way.way }} ---{{way.amount}}--- {{ way.no }}
			</view>
		</view>

	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue'
	import hy from '@/utils/hy/hy_query.js';
	import _wx from '@/utils/Pay/WxPay.js';
	import _ali from '@/utils/Pay/Alipay.js';
	import common from '@/api/common.js';
	import dateformat from '@/utils/dateformat.js';
	import c_sql from '@/utils/db/create_sql.js';
	import db from '@/utils/db/db_excute.js';

	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				PayWay: [{
						name: '微信',
						value: 'WX',
						fkid: "ZF01"
					},
					{
						name: '支付宝',
						value: 'ALI',
						fkid: "ZF02"
					},
					{
						name: '电子卡',
						value: 'CARD',
						fkid: "ZF03"
					},
					{
						name: '电子券',
						value: 'COUPON',
						fkid: "ZF04"
					}
				],
				products: [{
					PLID: "100",
					BARCODE: '4533331313',
					SPID: "123456",
					UNIT: "个",
					NAME: "黑森林",
					PRICE: "10",
					OPRICE: "10",
					AMOUNT: "20",
					QTY: 2
				}, {
					PLID: "101",
					SPID: "456786",
					UNIT: "袋",
					BARCODE: '4533338338454533',
					NAME: "毛毛虫",
					PRICE: "12",
					OPRICE: "12",
					AMOUNT: "24",
					QTY: 2
				}],
				authCode: "130108158206176736",
				out_trade_no: "202204271458564",
				totalAmount: 100, //总金额
				Discount: "5", //折扣金额
				RealAmount: 95, //实际需要支付金额
				yPayAmount: 0, //已支付金额
				PayAmount: 1, //待支付
				url: "",
				type: "center",
				PayList: [],
				sale1_obj: {},
				sale2_obj: {},
				sale2_arr: [],
				sale3_obj: {},
				sale3_arr: [],
			}
		},
		methods: {
			//支付方式切换
			radioChange(e) {
				let way = e.target.value;
				this.selectPayWay = way;
				if (way == 'WX' || way == 'ALI') {
					this.PayAmont = this.totalAmount - this.yPayAmount;
				} else {
					this.PayAmont = 0;
				}
			},
			//发起支付
			Pay: function() {
				if (!this.selectPayWay) {
					uni.showToast({
						title: '请选择支付方式',
						duration: 2000,
						icon: "error"
					});
					return;
				}
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
				this.$refs['popup'].open();
			},
			//微信扫码支付
			wxSanPay: function() {
				console.log("扫码事件")
				// this.CreateSale();
				// return;
				let sql = c_sql.createSql; //创建表
				// db.SqliteHelper.get().executeDml(sql, "表结构创建中", function(res) {
				// 	console.log("数据库执行成功");
				// 	console.log(res);
				// }, function(err) {
				// 	console.log("数据库执行失败");
				// 	console.log(err);
				// });
				// this.CreateSale()
				console.log(dateformat.getYMDS());
				this.$refs['popup'].open();
			},
			//回车发起支付
			ToPay1: function() {
				let _that = this;
				let bill = common.CreateBill("K210QTD002", "001");

				_that.out_trade_no = bill;
				_wx.CodeScanPay("微信扫码付", _that.out_trade_no, "商品支付", _that.authCode, _that.totalAmount,
					function(res) {
						console.log("微信支付结果：");
						console.log(res);
					});
				return;
				// 调起条码扫描
				uni.scanCode({
					scanType: ['qrCode', 'datamatrix', 'pdf417'],
					success: function(res) {
						_that.auth_code = res.result
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + JSON.stringify(res.result));
						//调用微信扫码付
						let result = _wx.CodeScanPay("微信扫码付", this.out_trade_no, "商品支付", 0.01);
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
				} else if ('ALI') {
					_ali.Payment("支付宝扫码付", "_CodePayment", "AliPayService", {
							out_trade_no: e.out_trade_no,
							auth_code: e.auth_code,
							subject: e.subject,
							total_amount: e.totalAmount
						},
						function(res) {
							Result = JSON.parse(res.data);
							Result = Result.alipay_trade_pay_response;
							if (Result.code == '10000') { //支付成功
								Result.new_code = '1';
							} else if (Result.code == '10003') { //支付中
								Result.new_code = '0';
							} else {
								Result.new_code = '-1';
							}
							if (func) func(Result);
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
				} else if ('ALI') {
					let Result;
					_ali.OrderQuery("支付宝扫码付", e.out_trade_no,
						function(res) {
							Result = JSON.parse(res.data);
							Result = Result.alipay_trade_query_response;
							if (Result.code == '10000' && Result.trade_status == "TRADE_SUCCESS") { //支付成功
								Result.new_code = '1';
							} else if (Result.code == '10000' && Result.trade_status == "WAIT_BUYER_PAY") { //支付中
								Result.new_code = '0';
							} else {
								Result.new_code = '-1';
							}
							if (func) func(Result);
						});
				} else if ('CARD') {

				} else if ('COUPON') {

				} else {}
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
				} else if ('ALI') {
					_ali.OrderCancel("撤销支付宝扫码付", e.out_trade_no,
						function(res) {
							Result = JSON.parse(res.data);
							Result = Result.alipay_trade_cancel_response;
							if (Result.SubCode == '10000') { //撤销成功
								Result.new_code = '1';
							} else { //撤销失败
								Result.new_code = '-1';
							}
							if (func) func(Result);
						});
				} else if ('CARD') {

				} else if ('COUPON') {

				} else {}
			},
			//轮询方法
			circleQuery: function(t, e, func1) {
				let that = this;
				let nums = 1;
				var timerIndex;
				var timerFunc = function() {
					if (nums <= 24) {
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
									} else { //撤销订单
										clearInterval(timerIndex);
										uni.showToast({
											title: "取消支付，正在撤销订单",
											icon: "none"
										})
										that.cancelPayAll(t, e, func1);
									}
								}
							})
						} else {
							that.queryPayAll(t, e, function(res) {
								if (res.new_code > 0) {
									that.createPay(t); //创建支付记录
									clearInterval(timerIndex);
								}
								if (res.new_code < 0) {
									uni.showToast({
										title: "支付失败",
										icon: "error"
									})
									clearInterval(timerIndex);
								}
							});
						}
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
			//创建支付记录
			createPay: function(t) {
				let that = this;
				let payobj = that.PayList.find(item => {
					return item.value == t
				});
				that.PayList.Push({
					way: payobj.name,
					amount: that.PayAmount,
					no: that.PayList.length + 1,
					fkid: payobj.fkid
				});
				//预留处理业务数据的地方
			},
			// 回车发起支付
			ToPay: function(e) {
				let that = this;
				let code = e.target.value;

				that.sale1_obj.out_trade_no = common.CreateBill("K210QTD002", "001");
				that.sale1_obj.auth_code = code;
				that.sale1_obj.subject = "商品支付";
				that.sale1_obj.totalAmount = that.PayAmount;
				if (code) { //code 有值则发起支付
					//发起支付
					that.paymentAll(that.selectPayWay, that.sale1_obj, function(res) {
						debugger
						if (res.new_code < 0) {
							uni.showToast({
								title: res.new_msg,
								icon: "error",
								success() {
									that.$refs['popup'].close();
								}
							});
							return;
						}
						//轮询操作
						that.circleQuery(t, that.sale1_obj, func);
					})
				} else { //没值则发起查询
					that.queryPayAll(that.selectPayWay, that.sale1_obj, function(res) {
						if (res.new_code > 0) { //是支付成功的
							that.createPay(t); //追加支付成功的记录
						}
					})
				}
			},
			//回车发起支付原版
			ToPay2: function(e) {
				let that = this;
				let code = e.target.value;
				if (!code) {
					uni.showToast({
						title: "请输入付款码",
						duration: 2000,
						icon: "error"
					});
					return;
				}
				that.$refs['popup'].close();
				//title,auth_code,body,total_fee
				// let result= _ali.CodePayment("支付宝付款码支付",this.out_trade_no,"测试~",1);
				let result = _ali.Payment("支付宝扫码支付", "_CodePayment", "AliPayService", {
						out_trade_no: that.out_trade_no, //2022050914270235
						auth_code: that.authCode,
						subject: "测试测试",
						total_amount: 0.01
					},
					function(res) {
						let Result = JSON.parse(res.data);
						Result = Result.alipay_trade_pay_response;
						if (Result.code == "10000") {
							//支付成功生成记录
							that.PayList.Push({
								way: "微信",
								amount: that.PayAmont,
								no: Result.trade_no
							});
							return;
						} else if (Result.code == "10003") { //支付中 交易创建，等待买家付款
							let times = 0;
							let timerIndex;
							var timer = function() {
								if (times < 25) {
									//查询 订单
									that.OrderQuery(that.out_trade_no,
										function(res) {
											let qResult = JSON.parse(res.data);
											qResult = qResult.alipay_trade_query_response;
											if (qResult.code == "10000") {
												if (qResult.trade_status == "WAIT_BUYER_PAY") {
													//交易创建，等待买家付款
												} else {
													//交易支付成功//生成支付记录
													if (qResult.trade_status == "TRADE_SUCCESS") {
														that.PayList.Push({
															way: "微信",
															amount: that.PayAmont,
															no: Result.trade_no
														});
													} else {
														//未付款交易超时关闭，或支付完成后全额退款 TRADE_CLOSED
														//交易结束，不可退款 TRADE_FINISHED
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
											clearInterval(timer);
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
													that.OrderCancel(that.out_trade_no,
														function(res) {
															let qResult = JSON.parse(
																res.data);
															qResult = qResult
																.alipay_trade_cancel_response
															if (qResult.SubCode ==
																"10000") {
																uni.showToast({
																	title: "支付失败，订单已撤销",
																	duration: 2000,
																	icon: "error"
																});
															}
															return res
														},
														function(res) {
															if (res.data == null) {
																uni.showToast({
																	title: res
																		.msg,
																	duration: 2000,
																	icon: "error"
																});
															}
															let Result = JSON.parse(res
																.data);
															Result = Result
																.alipay_trade_pay_response;
															//非业务失败
															if (Result.code !=
																"40004") {
																//业务失败
																uni.showToast({
																	title: Result
																		.msg,
																	duration: 2000,
																	icon: "error"
																});
															} else {
																//业务失败
																uni.showToast({
																	title: Result
																		.sub_msg,
																	duration: 2000,
																	icon: "error"
																});
															}

														});

												}
											}
										});
									}

								} else {
									clearInterval(timer);
									//还是没结果撤销订单
									that.OrderCancel(that.out_trade_no);
								}
								times++;
							};
							timerIndex = setInterval(timer, 5000)
						}
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

					});
			},

			//创建页面订单数据
			CreateData: function() {
				this.sale1_obj = {
					BILL: this.out_trade_no,
					SALEDATE: dateformat.getYMD(),
					SALETIME: dateformat.getYMDS(),
					KHID: getApp().store.globalData.KHID,
					POSID: getApp().store.globalData.POSID,
					RYID: getApp().store.globalData.RYID,
					BILL_TYPE: 'Z101', //门店现场销售单
					XSTYPE: "1",
					XS_BILL: "", //退款时记录原单号
					XS_POSID: "", //退款时记录原posid
					XS_DATE: "", //退款时记录原销售日期
					XS_KHID: "", //退款时记录原khid
					XS_GSID: "", //退款时记录原GSID
					TLINE: this.sale2_obj.length,
					TNET: this.RealAmount,
					DNET: 0,
					ZNET: this.totalAmount,
					BILLDISC: this.Discount,
					ROUND: 0,
					CHANGENET: 0,
					CXTNET: 0,
					TCXDISC: 0,
					CUID: "", //会员号
					CRADID: "", //卡号
					THYDISC: this.Discount,
					YN_SC: 'N',
					GSID: getApp().globalData.store.GSID, //公司
					GCID: getApp().globalData.store.GCID, //工厂
					DPID: getApp().globalData.store.DPID, //店铺
					KCDID: getApp().globalData.store.KCDID, //库存点
					BMID: getApp().globalData.store.BMID, //部门id
					DKFID: getApp().globalData.store.DKFID, //大客户id默认编码
					XSPTID: 'POS',
					YN_OK: 'X',
					THTYPE: 0,
					CLTIME: dateformat.getYMDS()
				};
				for (var i = 0; i < this.products.length; i++) {
					this.sale2_obj = {
						BILL: this.out_trade_no,
						SALEDATE: dateformat.getYMD(),
						SALETIME: dateformat.getYMDS(),
						KHID: getApp().globalData.store.KHID,
						POSID: getApp().globalData.store.POSID,
						SPID: this.products[i].SPID,
						NO: i,
						PLID: this.products[i].PLID,
						BARCODE: this.products[i].BARCODE,
						UNIT: this.products[i].UNIT,
						QTY: this.products[i].QTY,
						PRICE: this.products[i].PRICE,
						OPRICE: this.products[i].OPRICE,
						NET: this.products[i].PRICE,
						DISCRATE: "0",
						YN_SKYDISC: 'N', //是否有手工折扣
						DISC: 0, //手工折扣额
						YN_CXDISC: 'N',
						CXDISC: 0,
						YEAR: new Date().getFullYear(),
						MONTH: new Date().getMonth() + 1,
						WEEK: dateformat.getYearWeek(new Date().getFullYear(), new Date().getMonth() + 1,
							new Date().getDay()),
						TIME: new Date().getHours(),
						RYID: getApp().store.globalData.RYID, //人员
						GCID: getApp().store.globalData.GCID, //工厂
						DPID: getApp().store.globalData.DPID, //店铺
						KCDID: getApp().store.globalData.KCDID, //库存点
						BMID: getApp().store.globalData.BMID //部门id
					};
					this.sale2_arr = this.sale2_arr.concat(this.sale2_obj);
				}
				for (var i = 0; i < this.PayList.length; i++) {
					this.sale3_obj = {
						BILL: this.out_trade_no,
						SALEDATE: dateformat.getYMD(),
						SALETIME: dateformat.getYMDS(),
						KHID: getApp().store.globalData.KHID,
						POSID: getApp().store.globalData.POSID,
						NO: i,
						FKID: this.PayList[i].fkid,
						AMT: this.PayList[i].amount,
						RYID: getApp().store.globalData.RYID, //人员
						GCID: getApp().store.globalData.GCID, //工厂
						DPID: getApp().store.globalData.DPID, //店铺
						KCDID: getApp().store.globalData.KCDID, //库存点
						BMID: getApp().store.globalData.BMID, //部门id
						DISC: ""
					};
					this.sale3_arr = this.sale3_arr.concat(this.sale3_obj);
				}
			},
			//创建业务数据
			CreateSale: function() {
				let sql1 = common.CreateSQL(this.products, 'SALE001');
				let sql2 = common.CreateSQL(this.products, 'SALE002');
				let sql3 = common.CreateSQL(this.products, 'SALE003');
				console.log("数据库状态" + db.isOpen());
				if (!db.isOpen()) {
					db.openSqllite().then(function(res) {
						console.log(res);
						let sql = c_sql.createSql;
						db.executeSql(sql).then(function(res1) {
							console.log(res1);
						});
					}).catch(function(err) {
						console.log(err);
					});
				} else {
					let sql = c_sql.createSql;
					db.executeSql(sql).then(function(res1) {
						console.log("zhixing");
						console.log(res1);
					}).catch(function(err) {
						console.log("异常");
						console.log(err);
					});
				}
			},

			//创建表结构
			CreatTable: function() {
				let sql = c_sql.createSql; //创建表
				db.SqliteHelper.get().executeDml(sql, "表结构创建中", function(res) {
					console.log("表结构创建成功");
					console.log(res);
				}, function(err) {
					console.log("表结构创建失败");
					console.log(err);
				});
			},

			//测试sql
			TestSql: function() {
				let sql = "insert into OSALE001 (KHID) values('test');";
				db.SqliteHelper.get().executeDml(sql, "执行sql", function(res) {
					console.log("sql执行成功")
					console.log(res)
				}, function(err) {
					console.log("sql执行失败")
					console.log(err)
				})
				return;
				// db.SqliteHelper.get().executeQry("select * from OSALE001", "", function(res) {
				// 	console.log("sql查询成功");
				// 	console.log(res);
				// }, function(err) {
				// 	console.log("sql查询失败");
				// 	console.log(err);
				// });
			},
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
