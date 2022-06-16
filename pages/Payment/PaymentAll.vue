<link rel="stylesheet" href="../../style/basis.css" type="text/css" />
<style type="text/css">
	/* @import url(../../style/basis.css); */
	@import url(@/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content">
		<view class="navmall">
			<view class="logo">
				<image src="../../images/kengee-logo.png" mode="widthFix"></image>
			</view>
			<view class="menu">
				<view class="curr">
					<image src="../../images/xiaoshou.png" mode="widthFix"></image>
					<text>销售</text>
				</view>
				<view>
					<image v-if="xuanzhong" src="../../images/yuding.png" mode="widthFix"></image>
					<image src="../../images/yuding-hui.png" mode="widthFix"></image>
					<text>预定</text>
				</view>
			</view>
			<view class="exit">
				<image src="../../images/tuichu.png" mode="widthFix"></image>
				<text>退出</text>
			</view>
		</view>
		<view class="right">
			<view class="nav">
				<view class="message">
					<view class="imgs">
						<image src="../../images/tongzhi.png" mode="widthFix"></image>
					</view>
					<text>门店有一条新的外卖配送单消息来啦...</text>
				</view>
				<view class="account">
					<text>员工账号</text>
					<view>
						<image src="../../images/touxiang.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="hh">
				<image src="../../images/shouyintai.png" mode="widthFix"></image> 收银台
			</view>
			<view class="amounts">
				<!-- <p>订单号：{{out_trade_no_old}}</p> -->
				<p><text>总金额</text><text>{{totalAmount}}</text></p>
				<p><text>折扣</text><text>{{Discount}}</text></p>
				<p><text>已收</text><text>{{yPayAmount}}</text></p>
				<p><text>欠款</text><text>{{debt}}</text></p>
				<p><text>还需支付</text><input type="text" value="" :key="domRefresh" v-model="dPayAmount" /></p>
			</view>

			<view class="paydetails">
				<view class="pay-sum">
					<view class="settleds">

						<view class="paymentlist">
							<h3>已结算</h3>
							<view class="sets-list">
								<view class="paylists">
									<view class="Methods" v-for="(product, index) in Products">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ product.NAME }}
										</view>
										<text>-{{product.AMOUNT}}</text>
									</view>
								</view>
								<view class="stills">
									<view class="Methods">
										<view class="payicon">
											<image src="../../images/shouyintai.png" mode="widthFix"></image>
											还需支付
										</view>
										<text>￥{{ dPayAmount }}</text>
									</view>
								</view>
							</view>
							<!-- 退款 -->
							<h3>已退款</h3>
							<view class="sets-list refund">
								<view class="paylists">
									<view class="Methods" v-for="(product, index) in Products">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ product.NAME }}
										</view>
										<text>-{{product.AMOUNT}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="choosepays">
					<view class="pays-bj">
						<view class="top-zhifu">
							<view class="polys curr">
								<image class="p-bg" src="../../images/xzbj-da.png"></image>
								<p>聚合支付</p>
								<label>
									<image src="../../images/zfb-da.png" mode="widthFix"></image>
									<image src="../../images/wxzf-da.png" mode="widthFix"></image>
									<image src="../../images/hyk-da.png" mode="widthFix"></image>
								</label>
								<text>支持支付宝、微信及会员卡支付</text>
							</view>
							<view class="r-zhifu">
								<view class="pattern">
									<view class="">
										<p>电子券</p>
										<text>coupons</text>
									</view>
									<image src="../../images/dzq-da.png" mode="widthFix"></image>
								</view>
								<view class="pattern nots">
									<view class="">
										<p>云闪付</p>
										<text>暂未开放</text>
									</view>
									<image src="../../images/ysf-da.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
						<view class="bom-zhifu">
							<view class="pattern nots">
								<view class="">
									<p>可伴支付</p>
									<text>暂未开放</text>
								</view>
								<image src="../../images/kb-da.png" mode="widthFix"></image>
							</view>
							<view class="pattern nots">
								<view class="">
									<p>品诺支付</p>
									<text>暂未开放</text>
								</view>
								<image src="../../images/pn-da.png" mode="widthFix"></image>
							</view>

						</view>
					</view>
					</p>
					<button class="btn gopays" @click="Pay()">支 付</button>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue';
	import hy from '@/api/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import _wx from '@/api/Pay/WxPay.js';
	import _ali from '@/api/Pay/Alipay.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	var that;
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				subject:"",//订单类型（文本说明）
				xuanzhong: true,
				CanBack: false, //是否允许退出
				type: 'center',
				allAmount: 0, //订单总金额(包含折扣)
				totalAmount: 0, //应付总金额
				yPayAmount: 0, //已支付金额
				dPayAmount: 0, //待支付
				PayAmount: 0,
				Discount: 0,
				Products: [],
				PayWayList: [], //支付方式
				PayWay: null,
				selectPayWayVal: null,
				PayList: [],
				authCode: null,
				out_trade_no_old: "", //原定单号
				out_trade_no: "", //单次发起支付的订单号（匹配多笔支付的操作 采用原订单号加序号的规则）
				disablePayInput: false,
				sale1_obj: {},
				sale2_obj: {},
				sale2_arr: [],
				sale3_obj: {},
				sale3_arr: [], //已支付的交易数据（本页面存在多次交易的可能，所以此参数只能在本页面动态构造）
				tx_obj: {},
				GSID: getApp().globalData.store.GSID, //公司id
				DPID: getApp().globalData.store.DPID, //店铺id
				KCDID: getApp().globalData.store.KCDID, //存库点id
				GCID: getApp().globalData.store.GCID, //工厂id
				BMID: getApp().globalData.store.BMID, //部门id
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID,
				Name: getApp().globalData.store.NAME,
				MerId: getApp().globalData.store.MERID,
				brand: getApp().globalData.brand,
				kquser: getApp().globalData.kquser,
				hyinfo: getApp().globalData.hyinfo, //会员卡信息
				domRefresh: new Date().toString()
			}
		},
		watch: {
			dPayAmount: function(n, o) {
				let amount = this.toBePaidPrice();
				//检测待支付金额是否超过了欠款，如果超过则自动修正为欠款金额数
				if (Number(n) > this.toBePaidPrice()) {
					this.dPayAmount = amount; //超过待支付金额后自动给与目前待支付金额的值
					uni.showToast({
						title: '待支付金额超过欠款,已自动修正!',
						duration: 2000,
						icon: "error"
					});
					this.domForceRefresh(); //解决待付款赋值触发监听后，在其中修改值后文本内容依然没变的问题
				}
			}
		},
		computed: {
			debt: function() {
				this.allAmount = this.toBePaidPrice();
				return this.allAmount;
			}
		},
		methods: {
			//页面首次加载事件
			onLoad(options) {
				//首先创建销售表结构
				common.CreatSaleTable();
				//券信息加载
				let lqid = options.lqid;
				if (lqid) {
					console.log("券号：", lqid);
					let that = this
					that.auth_code = lqid;
					that.PayWayList.forEach(function(v, i) {
						if (v.value == 'COUPON') {
							v.checked = true;
							that.PayWay = v.type;
							that.selectPayWayVal = v.value;
						}
					})
				}

			},
			//返回事件
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
			QUsed: function(d, b, func) {
				//继续支付   扣掉券的信息
				hy.TicktUse(d, b,
					function(res) {
						if (res.code) {
							let used = JSON.parse(res.data);
							if (used.GT_RETURN) {
								let GT_RETURN = used.GT_RETURN[0];
								if (GT_RETURN.TYPE == "E") {
									res.code = -1;
									res.msg = GT_RETURN.MESSAGE
								} else {
									res.code = 1;
								}
							} else {
								res.code = 1;
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
				this.authCode = "";
				this.PayWay = payobj.type;
				this.selectPayWayVal = payobj.value;
				this.PayAmount = this.dPayAmount;
				this.disablePayInput = false;
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
					CUID: this.hyinfo.HYID, //会员号
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
						NO: i,
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
				db.get().executeDml(exeSql, "订单创建中", function(res) {
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
				db.get().executeQry(sql, "数据查询", function(res) {
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
				let arr = that.PayList.filter(function(v, i, ar) {
					return v.amount == that.PayAmount && v.no == that.no;
				})
				if (arr.length == 0) { //说明没有追加过该笔支付记录
					if (!t.payobj) { //不是券的支付
						let payobj = that.PayWayList.find(item => {
							return item.value == t
						});
						that.PayList.push({
							fkid: payobj.fkid,
							bill: that.out_trade_no,
							name: payobj.name,
							amount: that.PayAmount,
							no: that.PayList.length
						});
					} else { //券的支付
						that.PayList.push({
							fkid: t.payobj.fkid,
							bill: that.out_trade_no,
							name: t.payobj.name,
							amount: t.amount,
							no: that.PayList.length
						});
					}
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
						this.CanBack = true; //可以返回了
						this.CreateDBData(); //创建订单数据
						this.scoreConsume(); //积分操作
					}
				} else {
					uni.showToast({
						title: "本单已支付成功",
						icon: "error",
						success: function(res) {
							//that.$refs['popup'].close();
						}
					})
				}
			},
			TestDB: function() {
				let sql = [
					"update SALE003 set amt='0.01' where bill='K210QTD00112022516175759256' and no='1')"
				];
				db.get().executeDml(sql, "订单创建中", function(res) {
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
					console.log("循环次数监听：" + nums);
					if (nums <= 24) {
						that.queryPayAll(t, e, function(res) {
							if (res.code > 0) {
								clearInterval(timerIndex);
								//支付成功创建支付记录
								that.createPayData(t);
								uni.hideLoading();
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
												timerIndex = setInterval(timerFunc, 5000);
											} else {
												uni.hideLoading();
												clearInterval(timerIndex);
												uni.showToast({
													title: "取消支付，即将撤销订单",
													icon: "error",
													success: function() {
														setTimeout(function() {
															//撤销订单
															that.cancelPayAll(
																t, e,
																func1);
														}, 2000);
													}
												})
											}
										}
									})
								}
							} else {
								uni.hideLoading();
								clearInterval(timerIndex);
								uni.showToast({
									title: res.msg,
									icon: "error",
									success: function() {
										setTimeout(function() {
											//撤销订单
											that.cancelPayAll(t, e, func1);
										}, 2000);
									}
								});
							}
							nums++
						});
					} else { //撤销订单
						uni.hideLoading();
						clearInterval(timerIndex);
						uni.showToast({
							title: "支付超时，即将撤销订单",
							icon: "error",
							success: function() {
								setTimeout(function() {
									that.cancelPayAll(t, e, func1);
								}, 2000);
							}
						})
					}
				}
				timerFunc();
				timerIndex = setInterval(timerFunc, 5000);
			},
			close: function() {
				this.$refs['popup'].close();
			},
			//支付按钮点击事件
			Pay: function() {
				debugger
				//适配真机
				let that = this;
				if (that.authCode) { //如果有码
					that.PayHandle(); //直接发起支付
				} else { //为空就进行扫码
					uni.scanCode({
						success: function(res) {
							that.PayHandle();
						}
					});
				}
			},
			//支付类型判断
			PayTypeJudgment: function() {
				let startCode = this.authCode.substring(0, 2);
				switch (startCode) {
					case "28":
						return "AliPay";
					case "13":
						return "WxPay";
					default:
						return "Other";
				}
			},
			//支付 data 对象组装
			PayDataAssemble: function() {
				return {
					subject: this.subject,
					out_trade_no: this.out_trade_no,
					total_money: this.totalAmount,//总支付金额
					money: this.dPayAmount,//这一笔的支付金额
					auth_code: this.authCode,
					store_id: this.DPID,
					store_name: "武汉xxx",
					merchant_no: "999990053990001",
					product_info: this.Products.map(i => {//商品清单
						return {
							spid: i.SPID,
							name: i.NAME,
							price: i.PRICE,
							num: i.QTY
						}
					})
				}
			},
			PayHandle: function() {
				let handlePayment;
				switch (this.PayTypeJudgment()) {
					case "AliPay": //支付宝支付处理
						handlePayment = _ali.AliPayment();
						break;
					case "WxPay": //微信支付处理
						handlePayment = _wx.WxPayment();
						break;
				}
				handlePayment.Payment(this.PayDataAssemble(),function(result){
					debugger
				})
			},
			//输入付款码后回车发起支付
			ToPay: function(e) {
				let that = this;
				let title = "";
				let param = {};//支付接口参数
				let code = e ? e.target.value : that.authCode;
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
								uni.showLoading({
									mask: true,
									title: "正在查询支付结果"
								})
								that.circleQuery(that.selectPayWayVal, param, function(res) {});
							} else {
								//支付成功创建支付记录
								let resData = JSON.parse(res.data);
								let lqmoney = 0;
								let fqmoeny = 0; //放弃金额
								let relmoeny = 0; //实际核销金额
								if (resData.GT_RETURN) {
									lqmoney = parseFloat(resData.GT_RETURN[0].VALUE2);
								} else {
									lqmoney = resData.lqmoney
								}
								if (lqmoney > that.PayAmount) {
									//产生放弃金额
									fqmoeny = lqmoney - that.PayAmount;
									relmoeny = that.PayAmount;
								} else {
									relmoeny = lqmoney;
								}
								//产生核销实际金额
								let payobj = that.PayWayList.find(item => {
									return item.value == that.selectPayWayVal
								});
								let obj = {
									amount: relmoeny,
									t: that.selectPayWayVal,
									payobj: payobj
								}
								that.createPayData(obj);
								if (fqmoeny > 0) {
									obj.payobj.name = payobj.name + "放弃";
									obj.amount = fqmoeny;
									that.createPayData(obj);
								}
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
			//支付方法合集
			paymentAll: function(t, e, func) {
				let payobj = this.PayWayList.find(item => {
					return item.value == t
				});
				let Result;
				if (t == 'WX') {
					_wx.CodeScanPay("支付中...", e.out_trade_no, e.subject, e.auth_code, e.totalAmount * 100,
						function(res) {
							Result = JSON.parse(res.data);
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' &&
								Result
								.trade_type == 'MICROPAY') { //支付成功
								Result.code = 1;
							} else if (Result.return_code == 'SUCCESS' && Result.err_code ==
								'USERPAYING') { //支付中
								Result.code = 0;
							} else {
								Result.code = -1;
								Result.msg = Result.err_code_des; //return_msg;
							}
							if (func) func(Result);
						},
						function(err) {
							if (err) {
								err.code = -1;
							}
							if (func) func(err);
						});
				} else if (t == 'ALI') {
					_ali.Payment("支付中...", "CodePayment", "AliPayService", {
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
				} else if (t == 'CARD') {
					let that = this;
					let obj;
					// e.auth_code="856666000100003870";
					// e.auth_code = "KG97618173949838540810";

					if (that.brand == "KG") {
						obj = {
							orderInfo: {
								ordernet: e.totalAmount, //amount
								orderbill: e.out_trade_no //merOrderId
							},
							paycode: e.auth_code, //卡号cardNo 
							storeid: that.KHID, //storeNo
							storename: that.Name, //storeName
							mer_id: that.MerId //merchantNo 商户号
						};
					} else {
						//构造参数
						let productInfo = [];
						that.Products.forEach(function(item, index) {
							productInfo.push({
								spid: item.SPID,
								sname: item.NAME,
								price: item.PRICE,
								qty: item.QTY,
								net: item.AMOUNT,
								plid: item.PLID,
								discrate: 0
							});
						});
						obj = {
							kquser: that.kquser,
							mer_id: that.MerId, //商户号
							storeid: that.KHID,
							ryid: that.RYID,
							paycode: e.auth_code,
							posid: that.POSID,
							orderInfo: {
								ordernet: e.totalAmount,
								orderbill: e.out_trade_no,
								productInfo: productInfo
							},
							extra1: "",
							extra2: ""
						}
					}
					hy.PAY_ALL(that.brand, obj, function(res) {
						if (res.code) {
							res.code = 1;
						} else {
							res.code = -1;
						}
						if (func) func(res);
					});
				} else if ('COUPON') {
					let that = this;
					//查询券  code查询出来券的金额
					let qamount = 0;
					//仟吉的返回查询结果  卓越的假装返回结果0
					hy.TicktQuery(e.auth_code, "",
						function(res) {
							//有券
							let obj;
							let b = null;
							let ask = false;
							if (res.code) {
								if (res.data) {
									//仟吉
									let q = JSON.parse(res.data);
									qamount = q.ZZCPVALUE; //仟吉会返回真正的金额  
									if (qamount > e.totalAmount) {
										ask = true;
									};
									//构造参数
									obj = [];
									that.Products.forEach(function(item, index) {
										obj.push({
											ZZCP_NUM: q.ZZCP_NUM,
											ZZCPHX_CHANNEL: q.ZZCPHX_CHANNEL,
											ZZCPHX_STORE: q.ZZCPHX_STORE,
											ZZVBELN: q.ZZVBELN,
											ZZTPRICE: e.totalAmount, //订单金额
											ZZCPHXDATE: dateformat.getdate(),
											ZZCPTIME: dateformat.gettimes(),
											ZZPRODUCT_ID: item.PLID, // 商品编码
											ZZPRODUCT_NET: item.PRICE, //商品金额
											ZZPRODUCT_NUM: item.QTY //商品数量
										});
									});
								} else {
									//卓越
									ask = false;
									b = e.out_trade_no;
									//构造参数
									let productInfo = [];
									that.Products.forEach(function(item, index) {
										productInfo.push({
											spid: item.SPID,
											sname: item.NAME,
											price: item.PRICE,
											qty: item.QTY,
											net: item.AMOUNT,
											plid: item.PLID,
											discrate: 0
										});
									});
									obj = {
										storeid: that.KHID,
										kquser: that.kquser,
										ryid: that.RYID,
										gsid: that.GSID,
										usedetail: [],
										posid: that.POSID,
										fkid: payobj.fkid,
										lqid: e.auth_code,
										orderInfo: {
											ordernet: e.totalAmount, //实际支付金额
											znet: that.allAmount, //订单总金额
											orderbill: e.out_trade_no,
											productInfo: productInfo
										}
									};
								}
								//只有仟吉 仟吉券金额大于支付金额的时候才会走询问
								if (ask) {
									uni.showModal({
										title: '提示',
										content: '券金额:' + qamount + ',大于支付金额，是否继续支付？',
										confirmText: "是",
										cancelText: "否",
										success: function(cres) {
											if (cres.confirm) {
												that.QUsed(obj, null, function(res1) {
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
									//直接支付 扣掉券的信息
									that.QUsed(obj, b, function(res1) {
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
								Result.code = 1;
							} else if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
								.trade_state == 'USERPAYING') { //支付中
								Result.code = 0;
							} else {
								Result.code = -1;
								Result.msg = Result.return_msg;
							}
							if (func) func(Result);
						},
						function(err) {
							err.code = -1;
							if (func) func(err);
						});
				} else if (t == 'ALI') {
					_ali.Payment("查询支付结果...", "TradeQuery", that.PayWay, {
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
				} else if (t == 'CARD') {
					//仟吉
					hy.QUERY_ALL(that.brand, e.out_trade_no, function(res) {
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
			//撤销支付订单合集
			cancelPayAll: function(t, e, func) {
				let Result;
				if (t == 'WX') {
					_wx.CancelCodeScanPay("订单撤销中...", e.out_trade_no,
						function(res) {
							Result = JSON.parse(res.data);
							if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS') { //撤销成功
								Result.new_code = '1';
							} else {
								Result.new_code = '-1';
								Result.new_msg = Result.return_msg;
							}
							if (func) func(Result);
						},
						function(err) {
							err.code = "-1";
							if (func) func(err);
						});
				} else if (t == 'ALI') {
					_ali.Payment("订单撤销中...", "TradeCancel", "WxPayService", {
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
			//积分操作
			scoreConsume: function() {
				let that = this
				let hyinfo = app.gloabaldata.hyinfo;
				if (that.totalAmount > 0 && hyinfo) { //录入过会员信息
					let param;
					if (that.brand == 'KG') {
						let arr = [],
							arr1 = [];
						that.Products.forEach(function(item, i) {
							arr.push({
								lineNumber: i,
								product: item.BARCODE,
								category: item.PLID,
								quantity: item.QTY,
								userPrice: item.PRICE,
								basePrice: item.OPRICE,
								netPrice: item.AMOUNT
							})
						});
						that.PayList.forEach(function(item, i) {
							arr1.push({
								paymentType: item.fkid,
								payAmount: item.amount
							});
						});
						param = {
							addPoint: 0,
							channel: "POS",
							cityCode: "",
							code: that.out_trade_no,
							date: dateformat.getYMDS(),
							deducePoint: 0,
							districtCode: "",
							entryList: arr,
							memberCode: hyinfo.hyid,
							netAmount: that.totalAmount,
							orderAmount: that.allAmount,
							orderType: "1",
							paymentInfoList: arr1,
							pointOfService: that.KHID,
							preOrderCode: "",
							promotionIds: [],
							region: that.BMID,
							stateCode: ""
						}
					} else {
						param = {
							kquser: that.kquser,
							soreid: that.KHID,
							oderbill: that.out_trade_no,
							psid: that.POSID,
							slenet: that.totalAmount,
							cxbill: "",
							hyid: hyinfo.hyid,
							sign: ""
						}
					}
					hy.consumeJF(that.brand, param, function(res) {
						console.log("积分上传结果：" + res);
					})
				}
			},
			//初始化
			paramInit: function() {
				var prev_page_param = this.$store.state.location;
				this.Products = prev_page_param.Products; //商品数据
				this.Discount = prev_page_param.Discount; //商品数据
				this.PayWayList = prev_page_param.PayWayList;
				this.hyinfo = prev_page_param.hyinfo;
				this.authCode = prev_page_param.authCode;
				this.sale1_obj = prev_page_param.sale1_obj;
				this.sale2_arr = prev_page_param.sale2_arr;
			},
			//总金额计算
			priceCount: function() {
				let total = 0;
				this.Products.forEach(product => total += product.AMOUNT);
				this.totalAmount = total;
			},
			//待支付(欠款)金额(总金额 - 折扣金额 - 已支付金额),判断:如果小于0时候，便只返回0
			toBePaidPrice: function() {
				let amount = (this.totalAmount - this.Discount - this.yPayAmount).toFixed(2);
				let price = amount >= 0 ? amount : 0;
				return price;
			},
			//文本框dom刷新
			domForceRefresh: function() {
				this.domRefresh = new Date().toString();
			}
		},
		created() {
			this.paramInit();
			this.priceCount();
			this.dPayAmount = this.toBePaidPrice(); //初始化首次给待支付一个默认值
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
