<template>
	<view>
		<view>
			<p>--订单信息--</p>
			<p>订单总金额：{{allAmount}} </p>
			<p>实际金额：{{totalAmount}} </p>
			<p>已退款金额：{{yRefundAmount}} </p>
			<p>待退款金额：{{dRefundAmount}} </p>
		</view>
		<view>
			<p>--商品信息--</p>
			<view v-for="(item,index) in Products">
				<text>{{item.NAME}}</text>-
				<text>￥{{item.AMOUNT}}</text>-
				<text>{{item.PRICE}}元/kg</text>-
				<text>x{{item.QTY}}</text>
			</view>
		</view>
		<view>
			<view>订单号：<input v-model="bill"><button @click="Search()">查询订单</button></view>
			<view>退款金额：<input v-model="RefundAmount">订单序号：<input v-model="no"></view>

			<view>
				<radio-group class="radio-group" @change="radioChange">
					<label class="radio" v-for="(item, index) in PayWayList" :key="item.value">
						<radio :value="item.value" :checked="item.checked" /> {{item.name}}
					</label>
				</radio-group>
			</view>
			<button @click="refund()">发起退款</button>
		</view>
		<view>
			<p>--退款列表--</p>
			<p>序号---退款方式---金额</p>
			<view v-for="(way, index) in RefundList">
				--{{ way.no }} --- {{ way.name }} ---{{way.amount}}
			</view>
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
				CanBack: false, //是否允许退出
				allAmount: 0, //订单总金额(包含折扣)
				totalAmount: 0, //实际支付金额
				yRefundAmount: 0, //已退款金额
				dRefundAmount: 0, //待退款金额
				RefundAmount: 0, //单次退款业务金额
				Discount: 0,
				Products: [],
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
				bill: "",
				out_trade_no: "",
				out_refund_no: "",
				RefundList: [], //退款记录
				no: 0,
				selectPayWay: "", //选中的支付方式
				PayList: [], //支付记录
				sale1_obj: {},
				sale2_obj: {},
				sale2_arr: [],
				sale3_obj: {},
				sale3_arr: [],
				sale1_obj_old: {}, //原主单数据
				tx_obj: {},
				GSID: getApp().globalData.store.GSID,
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID,
				GCID: getApp().globalData.store.GCID,
				BMID: getApp().globalData.store.BMID,
				deviceno: getApp().globalData.store.deviceno
			}
		},
		methods: {
			onLoad: function(e) {
				this.out_refund_no_old = common.CreateBill(this.KHID, this.POSID);
				this.out_refund_no = this.out_refund_no_old;
				console.log("退款订单号" + this.out_refund_no);
				//this.TestDB();
			}, //返回事件
			onBackPress(e) {
				if (this.PayList.length > 0 && this.PayAmount > 0) { //如果发起支付了，要判断支付完毕没有
					if (!this.CanBack) {
						uni.showToast({
							title: "抱歉，还有待支付金额",
							icon: "error"
						})
						return true; //返回true阻止默认操作
					}
				}
			},
			//测试方法
			TestDB: function() {
				// let sql = [
				// 	 "insert into SALE003(bill,no) values('123321',0)"
				// ];
				// db.SqliteHelper.get().executeDml(sql, "测试sql 执行中", function(res) {
				// 	console.log("测试sql 执行成功");
				// 	console.log(res);
				// }, function(err) {
				// 	console.log("测试sql 执行失败");
				// 	console.log(err);
				// });
				// return
				let sql1 = "select * from SALE003 where bill='123321'";
				db.SqliteHelper.get().executeQry(sql1, "测试sql 执行中", function(res) {
					console.log("测试sql 查询成功");
					console.log(res);
				}, function(err) {
					console.log("测试sql 查询失败");
					console.log(err);
				});
			},
			//支付方式切换
			radioChange(e) {
				let value = e.target.value;
				let payobj = this.PayWayList.find(item => {
					return item.value == value
				});
				this.selectPayWay = payobj.type;
				this.selectPayWayVal = payobj.value;
			},
			//查询订单
			Search: function(e) {
				let that = this;
				if (this.bill) {
					that.Products = [];
					that.PayList = [];
					let sql1 = 'select * from SALE001 where BILL="' + that.bill + '"';
					let sql2 = 'select * from SALE002 where BILL="' + that.bill + '"';
					let sql3 = 'select * from SALE003 where BILL="' + that.bill + '"';
					db.SqliteHelper.get().executeQry(sql1, "数据查询", function(res) {
						console.log("查询成功");
						if (res.code && res.msg.length > 0) { //说明查到了值
							let dataObj = res.msg[0];
							that.allAmount = dataObj.ZNET;
							that.totalAmount = dataObj.TNET;
							that.sale1_obj_old = dataObj;
						}
					}, function(err) {
						console.log("查询失败");
						console.log(err);
					});
					db.SqliteHelper.get().executeQry(sql2, "数据查询", function(res) {
						console.log("查询成功");
						console.log(res);
						if (res.code && res.msg.length > 0) { //说明查到了值
							let arr = res.msg;
							for (var i = 0; i < arr.length; i++) {
								let obj = {};
								obj.NAME = arr[i].NAME;
								obj.AMOUNT = arr[i].AMOUNT
								obj.PRICE = arr[i].PRICE;
								obj.QTY = arr[i].QTY;
								that.Products.push(obj);
							};
						}
					}, function(err) {
						console.log("查询失败");
						console.log(err);
					});
					db.SqliteHelper.get().executeQry(sql3, "数据查询", function(res) {
						console.log("支付方式查询成功");
						console.log(res);
						if (res.code && res.msg.length > 0) { //说明查到了值
							let arr = res.msg;
							for (var i = 0; i < arr.length; i++) {
								let obj = {};
								obj.name = ""; // arr[i].NAME;
								obj.amount = arr[i].AMT
								obj.no = arr[i].NO;
								obj.fkid = arr[i].FKID;
								that.PayList.push(obj);
							};
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
							.refund_status_0 == 'SUCCESS') { //退款成功
							Result.code = '1';
						} else if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
							.refund_status_0 == 'PROCESSING') { //退款中
							Result.code = '0';
						} else {
							Result.code = '-1';
							Result.msg = Result.err_code_des;
						}
						if (func) func(Result);
					});
				} else if (t == 'ALI') {
					_ali.Payment("支付宝退款查询", "RefundQuery", 'AliPayService', {
						out_trade_no: e.out_trade_no,
						out_request_no: e.out_refund_no
					}, function(res) {
						Result = JSON.parse(res.data);
						Result = Result.alipay_trade_fastpay_refund_query_response;
						if (Result.code = "10000" && Result.refund_status == "REFUND_SUCCESS") { //退款成功
							Result.code = '1';
						} else {
							Result.code = '-1';
						}
						if (func) func(Result);
					}, function(err) {
						let msg = JSON.parse(err.msg);
						err.code = '-1';
						err.msg = msg.sub_msg;
						if (func) func(err);
					})
				} else if (t == 'CARD') {
					if (func) func({
						code: 1
					});
				} else if (t == 'COUPON') {
					if (func) func({
						code: 1
					});
				} else {
					if (func) func({
						code: 1
					});
				}
			},
			//退款的合集
			RefundAll: function(t, e, func) {
				let Result;
				if (t == 'WX') {
					_wx.Refund("微信退款", e.out_trade_no, e.out_refund_no, e.total_fee * 100, function(res) {
						Result = JSON.parse(res.data);
						if (Result.return_code == 'SUCCESS' && Result.result_code ==
							'SUCCESS') { //提交退款成功不代表退款成功 需要查询后才能知道结果
							Result.code = '1';
						} else { //退款提交失败
							Result.code = '-1';
							Result.msg = Result.err_code_des;
						}
						if (func) func(Result);
					}, function(err) {
						err.code = "-1";
						if (func) func(err);
					});
				} else if (t == 'ALI') {
					_ali.Payment("支付宝退款", "TradeRefund", 'AliPayService', {
						out_trade_no: e.out_trade_no,
						out_request_no: e.out_refund_no,
						refund_amount: e.total_fee
					}, function(res) {
						Result = JSON.parse(res.data);
						Result = Result.alipay_trade_refund_response;
						if (Result.code == "10000") { //退款成功
							Result.code = '1';
						} else {
							Result.code = '-1';
							Result.msg = Result.sub_msg;
						}
						if (func) func(Result);
					}, function(err) {
						let msg = JSON.parse(err.msg);
						err.code = '-1';
						err.msg = msg.sub_msg;
						if (func) func(err);
					})
				} else if (t == 'CARD') {
					let that = this;
					//会员卡退款
					let obj = {
						orderbill: e.out_trade_no,
						refundbill: e.out_refund_no,
						refundnet: e.refund_amount
					}
					if (that.brand == "KG") {
						obj.payTxnId = "";
					} else {
						obj.kquser = that.kquser;
						obj.storeid = that.KHID;
						obj.deviceno = that.deviceno;
						obj.ryid = that.RYID;
						obj.mer_id = that.MerId;
						obj.posid = that.POSID;
						obj.trans_date = dateformat.getdate();
						obj.hyid = "856666000100005005";
					}
					hy.REFUND_ALL(that.brand, obj, function(res) {
						if (res.code) {
							res.code = '1';
						} else {
							res.code = '-1';
						}
						if (func) func(res);
					})
				} else if (t == 'COUPON') {
					if (func) func({
						code: 1
					});
				} else {
					if (func) func({
						code: 1
					});
				}
			},
			//检验退款金额通过则返回支付的订单号
			CheckMoney: function() {
				let that = this;
				if (!that.RefundAmount) {
					uni.showToast({
						title: "请输入退款金额",
						icon: "error"
					})
					return false;
				}
				if (that.no == null || that.no == undefined || that.no.toString().trim() == "") { //排除0
					uni.showToast({
						title: "请输入订单序号",
						icon: "error"
					})
					return false;
				}
				console.info(JSON.stringify(that.PayList))
				let pay_obj_arr = that.PayList.filter(function(v, i, arr) {
					return v.amount == that.RefundAmount && v.no == that.no;
				})
				if (pay_obj_arr.length == 0) {
					uni.showToast({
						title: "金额不匹配",
						icon: "error"
					})
					return false;
				}
				that.out_trade_no = that.bill + '_' + that.no; //组装下商户订单号
				return true;
			},
			//单号防重处理
			UniqueBill: function() {
				let that = this;
				that.out_refund_no = that.out_refund_no_old + '_' + that.RefundList.length;
			},
			//退款点击事件
			refund: function() {
				let that = this;
				if (!that.bill) {
					uni.showToast({
						title: "请输入单号",
						icon: "error"
					})
					return;
				}
				if (!that.selectPayWay) {
					uni.showToast({
						title: "请选择退款方式",
						icon: "error"
					})
					return;
				}
				if (this.CheckMoney()) //校验金额并查找支付的订单号用于退款使用
				{
					that.queryRefundAll(this.selectPayWayVal, {
						out_trade_no: this.out_trade_no,
						out_refund_no: this.out_refund_no
					}, function(res) {
						console.log("查询结果" + res);
						if (res.code > 0) {
							//退款成功创建退款记录
							that.createPayData(that.selectPayWayVal);
						} else {
							that.UniqueBill(); //单号防重处理
							let param = {}
							param.out_refund_no = that.out_refund_no;
							param.out_trade_no = that.out_trade_no;
							param.total_fee = that.RefundAmount;
							that.RefundAll(that.selectPayWayVal, param, function(res1) {
								console.log("发起退款的结果" + res1);
								if (res1.code > 0) {
									//退款成功
									uni.showToast({
										title: "退款成功!",
										icon: "success"
									});
									//生成退款记录
									that.createPayData(that.selectPayWayVal);
								} else {
									//退款失败
									uni.showToast({
										title: "退款失败：" + res1.msg,
										icon: "error"
									});
								}
							})
						}
					})
				}
			},
			//计算已退款，待退款金额
			CalDZFMoney: function() {
				let ymoney = 0; //计算总的已退款金额
				for (var i = 0; i < this.RefundList.length; i++) {
					ymoney += parseFloat(this.RefundList[i].amount);
				}
				// console.log("支付方式集合中的金额" + ymoney);
				this.yRefundAmount = ymoney.toFixed(2);
				this.dRefundAmount = (this.totalAmount - this.yRefundAmount).toFixed(2);
				//this.RefundAmount = this.dRefundAmount;
			},
			//创建退款记录
			createPayData: function(t) {
				let that = this;
				let arr = that.RefundList.filter(function(v, i, ar) {
					return v.amount == that.RefundAmount && v.no == that.no;
				})
				if (arr.length == 0) { //说明没有追加过该笔退款
					let payobj = that.PayWayList.find(item => {
						return item.value == t
					});
					that.RefundList.push({
						fkid: payobj.fkid,
						bill: that.out_refund_no,
						name: payobj.name,
						amount: that.RefundAmount,
						no: that.RefundList.length
					});
					//重新计算待支付金额
					that.CalDZFMoney();
					uni.showToast({
						title: "退款成功",
						icon: "success",
						success: function(res) {
							//that.$refs['popup'].close();
						}
					})
					//预留处理业务数据的地方
					if (that.dRefundAmount == 0) { //说明已经退款完毕了
						this.CanBack = true; //可以返回了
						this.CreateDBData();
					}
				} else {
					uni.showToast({
						title: "本单已退款成功",
						icon: "error",
						success: function(res) {
							//that.$refs['popup'].close();
						}
					})
				}
			},
			//创建订单数据
			CreateDBData: function() {
				//基础数据
				this.sale1_obj = {
					BILL: this.out_refund_no_old,
					SALEDATE: dateformat.getYMD(),
					SALETIME: dateformat.getYMDS(),
					KHID: this.KHID,
					POSID: this.POSID,
					RYID: this.RYID,
					BILL_TYPE: 'Z151', //门店现场销售单
					XSTYPE: "2",
					XS_BILL: this.out_trade_no, //退款时记录原单号
					XS_POSID: this.sale1_obj_old.POSID, //退款时记录原posid
					XS_DATE: this.sale1_obj_old.SALEDATE, //退款时记录原销售日期
					XS_KHID: this.sale1_obj_old.KHID, //退款时记录原khid
					XS_GSID: this.sale1_obj_old.GSID, //退款时记录原GSID
					TLINE: this.sale2_obj.length,
					TNET: -this.totalAmount,
					DNET: 0,
					ZNET: -this.allAmount,
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
						BILL: this.out_refund_no_old,
						SALEDATE: dateformat.getYMD(),
						SALETIME: dateformat.getYMDS(),
						KHID: this.KHID,
						POSID: this.POSID,
						SPID: this.Products[i].SPID,
						NO: i,
						PLID: this.Products[i].PLID,
						BARCODE: this.Products[i].BARCODE,
						UNIT: this.Products[i].UNIT,
						QTY: -this.Products[i].QTY,
						PRICE: this.Products[i].PRICE,
						OPRICE: this.Products[i].OPRICE,
						NET: -this.Products[i].PRICE,
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
				for (var i = 0; i < this.RefundList.length; i++) {
					this.sale3_obj = {
						BILL: this.out_refund_no_old,
						SALEDATE: dateformat.getYMD(),
						SALETIME: dateformat.getYMDS(),
						KHID: this.KHID,
						POSID: this.POSID,
						NO: this.RefundList[i].no,
						FKID: this.RefundList[i].fkid,
						AMT: -this.RefundList[i].amount,
						ID: "", //卡号或者券号
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
					STR1: this.out_refund_no_old,
					BDATE: dateformat.getYMD(),
					YW_NAME: "销售单据",
					CONNSTR: 'CONNSTRING'
				};
				let sql4 = common.CreateSQL(this.tx_obj, 'POS_TXFILE');

				//console.log("开始生成订单数据");
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
		}
	}
</script>

<style>

</style>
