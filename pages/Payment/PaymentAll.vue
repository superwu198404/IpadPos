
<style type="text/css">
	@import url(@/static/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content">
		<view class="navmall" v-if="navmall">
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
				<view class="getback">
					<image class="fh" src="../../images/fh.png" mode="widthFix"></image>
					<view class="message">
						<view class="imgs">
							<image src="../../images/tongzhi.png" mode="widthFix"></image>
						</view>
						<text>门店有一条新的外卖配送单消息来啦...</text>
					</view>
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
				<p><text>还需支付</text><input type="text" :disabled="allowInput" value="" :key="domRefresh"
						v-model="dPayAmount" /></p>
			</view>

			<view class="paydetails">
				<view class="pay-sum">
					<view class="settleds">
						<view class="paymentlist">
							<h3>已结算</h3>
							<view class="sets-list">
								<view class="paylists">
									<view class="Methods" v-for="(paid, index) in PayList">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ paid.name }}
										</view>
										<text>-{{paid.amount}}</text>
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
							<h3 v-if="refundShow">已退款</h3>
							<view class="sets-list refund" v-if="refundShow">
								<view class="paylists">
									<view class="Methods" v-for="(refund, index) in RefundList">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ refund.name }}
										</view>
										<text>-{{refund.amount}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="choosepays">
					<view class="pays-bj">
						<view class="top-zhifu">
							<view :class="currentPayType === 'POLY'? 'polys curr selected':'polys curr'" id='POLY'
								@click="clickPayType($event)">
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
								<view :class="currentPayType === 'COUPON'? 'pattern curr selected':'pattern curr'"
									id="COUPON" @click="clickPayType($event)">
									<view class="">
										<p>电子券</p>
										<text>coupons</text>
									</view>
									<image src="../../images/dzq-da.png" mode="widthFix"></image>
								</view>
								<view class="pattern nots curr">
									<view class="">
										<p>云闪付</p>
										<text>暂未开放</text>
									</view>
									<image src="../../images/ysf-da.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
						<view class="bom-zhifu">
							<view class="pattern nots curr">
								<view class="">
									<p>可伴支付</p>
									<text>暂未开放</text>
								</view>
								<image src="../../images/kb-da.png" mode="widthFix"></image>
							</view>
							<view class="pattern nots curr">
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
	import _ali from '@/api/Pay/AliPay.js';
	import _card from '@/api/Pay/ECardPay.js';
	import _coupon from '@/api/Pay/ECoupon.js';
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
				navmall: false,
				channel: "POS",
				YN_TotalPay: false,
				allowInput: false,
				refundShow: false,
				currentPayInfo: null, //当前一单的支付平台信息（提供 fkid 和 name）
				currentPayType: "POLY", //支付类型，目前主要区分 聚合（聚合包含 支付宝、微信、会员卡-电子卡）和 券，默认聚合
				subject: "商品销售", //订单类型（文本说明）
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
				PayList: [],
				// [{ //每支付成功一笔，则往此数组内存入一笔记录
				// 		fkid: "",
				// 		bill: "12",
				// 		name: "支付宝",
				// 		amount: 0.01,
				// 		no: 1
				// 	},{ //每支付成功一笔，则往此数组内存入一笔记录
				// 		fkid: "",
				// 		bill: "12",
				// 		name: "支付宝",
				// 		amount: 0.01,
				// 		no: 1
				// 	},{ //每支付成功一笔，则往此数组内存入一笔记录
				// 		fkid: "",
				// 		bill: "12",
				// 		name: "支付宝",
				// 		amount: 0.01,
				// 		no: 1
				// 	},{ //每支付成功一笔，则往此数组内存入一笔记录
				// 		fkid: "",
				// 		bill: "12",
				// 		name: "支付宝",
				// 		amount: 0.01,
				// 		no: 1
				// 	}], //支付订单信息 {fkid:"",bill:"",name:"",amount:"",no:""}
				PaidList: [], //已支付商品信息
				RefundList: [], //退款信息
				authCode: "", //支付授权码
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
				KHID: getApp().globalData.store.KHID, //客户id
				POSID: getApp().globalData.store.POSID, //pos机id
				RYID: getApp().globalData.store.RYID, //人员id
				Name: getApp().globalData.store.NAME, //店铺名称
				MerId: getApp().globalData.store.MERID, //商户号id
				brand: getApp().globalData.brand,
				kquser: getApp().globalData.kquser,
				hyinfo: getApp().globalData.hyinfo, //会员卡信息,
				dPayList: [],
				domRefresh: new Date().toString(),
				query: null
			}
		},
		watch: {
			dPayAmount: function(n, o) {
				if (Object.is(NaN, Number(n))) { //判断输入的是否是数字
					this.dPayAmount = o;
					uni.showToast({
						title: '输入的数字有误,已自动修正!',
						duration: 2000,
						icon: "error"
					});
					this.domForceRefresh(); //解决待付款赋值触发监听后，在其中修改值后文本内容依然没变的问题
					return;
				}
				let amount = this.toBePaidPrice(); //计算待支付金额
				if (amount > 0) { //未完成支付，仍然存在欠款
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
				} else { //完成支付，推送数据
					this.YN_TotalPay = true;
					this.CanBack = true;
					this.$store.commit('set-orders', this.PayList);
				}
			},
			yPayAmount: function(n, o) {
				this.dPayAmount = this.toBePaidPrice(); //一旦已支付金额发生变化，自动触发计算剩余待支付金额
			},
			authCode: function(n, o) {
				this.currentPayInfo = this.PayWayList.find(i => i.value === this
			.PayTypeJudgment()); //每次支付后根据 authcode 判断支付方式并给 currentPayInfo
			},
			currentPayType: function(n, o) { //每次发生变化,切换页面dom选中
				if (n === "COUPON") //如果用券，则不再允许编辑待付款金额
					this.allowInput = false;
				// this.allowInput = true;
				else
					this.allowInput = false;
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
				console.log("检测是否能返回：", this.PayList.length + this.dPayAmount + this.CanBack)
				if (this.PayList.length > 0 && this.dPayAmount > 0) { //如果发起支付了，要判断支付完毕没有
					if (!this.CanBack) {
						uni.showToast({
							title: "未支付完成",
							icon: "error"
						})
						return true; //返回true阻止默认操作
					}
				}
				if (this.YN_TotalPay) { //标注是否已经完成支付,已经完成需要携带支付参数
					uni.$emit('updateData', this.PayList)
					uni.navigateBack({
						delta: 1
					})
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
							fkid: payobj.fkid, //付款id（对应类别）
							bill: that.out_trade_no, //单号（可控）
							name: payobj.name, //支付类别
							amount: that.PayAmount, //单次支付金额（金额单位：元）
							no: that.PayList.length //序号
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
				//适配真机
				let that = this;
				that.authCode = ""; //避免同一个付款码多次使用
				debugger;
				if (!this.currentPayType) {
					uni.showToast({
						title: "未选择支付方式，请选择后再进行支付!",
						icon: "error"
					});
					return;
				}
				if (!this.YN_TotalPay) { //如果未支付完成
					if (that.authCode) { //如果有码
						that.PayHandle(); //直接发起支付
					} else { //为空就进行扫码
						uni.scanCode({
							success: function(res) {
								that.authCode = res.result; //获取扫码的 authCode
								that.PayHandle();
							}
						});
					}
				} else {
					uni.showToast({
						title: "订单已完成支付!"
					});
				}
			},
			//支付类型判断
			PayTypeJudgment: function() {
				let startCode = this.authCode.substring(0, 2);
				switch (startCode) {
					case "28":
						return "ALI";
					case "13":
						return "WX";
					default:
						if (this.currentPayType === "COUPON") //判断当前支付方式是否为 券 支付，如果是券支付，则返回券 类型，否则是卡类型
							return "COUPON"
						return "CARD";
						break;
				}
			},
			//支付 data 对象组装
			PayDataAssemble: function() {
				this.UniqueBill(); //包装 data 前先执行防重复单号操作
				return {
					subject: this.subject,
					out_trade_no: this.out_trade_no,
					total_money: (Number(this.totalAmount) * 100).toFixed(0), //总支付金额
					money: (Number(this.dPayAmount) * 100).toFixed(0), //这一笔的支付金额
					auth_code: this.authCode,
					store_id: this.KHID,
					store_name: this.Name,
					merchant_no: "999990053990001",
					channel: this.channel,
					product_info: this.Products.map(i => { //商品清单
						return {
							spid: i.SPID,
							name: i.NAME,
							price: (Number(i.PRICE) * 100).toFixed(0), //单价
							amount: (Number(i.AMOUNT) * 100).toFixed(0), //总金额
							num: i.QTY
						}
					})
				}
			},
			//支付处理入口
			PayHandle: function() {
				let handlePayment;
				switch (this.PayTypeJudgment()) {
					case "ALI": //支付宝支付处理
						handlePayment = _ali.AliPayment();
						break;
					case "WX": //微信支付处理
						handlePayment = _wx.WxPayment();
						break;
					case "CARD": //电子卡支付处理
						handlePayment = _card.CardPayment();
						break;
					case "COUPON": //券支付接口
						handlePayment = _coupon.CouponPayment();
						break;
				}
				let payAfter = this.PayDataAssemble();
				console.log("支付单号：", this.out_trade_no);
				handlePayment.PaymentAll(payAfter, (function(result) {
					debugger;
					uni.showToast({
						title: "支付成功!"
					});
					this.PaidList = payAfter.product_info.map(i => {
						i.price /= 100;
						return i;
					}); //把支付信息贴出来
					this.yPayAmount += (payAfter.money / 100); //把支付成功部分金额加上
					this.PayList.push({ //每支付成功一笔，则往此数组内存入一笔记录
						fkid: this.currentPayInfo?.fkid ?? "",
						bill: payAfter.out_trade_no,
						name: this.currentPayInfo?.name ?? "",
						amount: (payAfter.money / 100).toFixed(2),
						no: this.PayList.length
					});
				}).bind(this))
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
				this.query = uni.createSelectorQuery().in(this); //获取元素选择器
				var prev_page_param = this.$store.state.location;
				this.Products = prev_page_param.Products;
				this.Discount = prev_page_param.Discount; //折扣信息
				// this.PayWayList = prev_page_param.PayWayList;//此行注释是由于无法初始化支付途径，为了方便测试所以采用写死数据 
				this.hyinfo = prev_page_param.hyinfo;
				this.out_trade_no_old = prev_page_param.out_trade_no_old; //单号初始化（源代号）
				this.out_trade_no = this.out_trade_no_old; //子单号
				//this.authCode = prev_page_param.authCode;
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
			},
			//创建待支付记录 支付成功后需要剔除该数据
			CreateDPayData: function(t, e = 1) {
				let that = this;
				if (e > 0) { //追加记录
					let arr = that.dPayList.filter(function(v, i, ar) {
						return v.amount == that.PayAmount && v.no == that.no;
					})
					if (arr.length == 0) { //说明没有追加过该笔支付记录
						if (!t.payobj) { //不是券的支付
							let payobj = that.PayWayList.find(item => {
								return item.value == t
							});
							that.dPayList.push({
								type: payobj.value,
								fkid: payobj.fkid,
								bill: that.out_trade_no,
								name: payobj.name,
								amount: that.PayAmount,
								no: that.PayList.length
							});
						} else { //券的支付
							that.dPayList.push({
								type: "COUPON",
								fkid: t.payobj.fkid,
								bill: that.out_trade_no,
								name: t.payobj.name,
								amount: t.amount,
								no: that.PayList.length
							});
						}
					}
				} else {
					if (that.dPayList.length > 0) {
						that.dPayList.splice(that.dPayList.findIndex(item => item.bill === that.out_trade_no), 1);
					}
				}
			},
			//点击切换支付方式
			clickPayType: function(e) {
				this.currentPayType = e.target.id; //小程序
			},
			//查询重试
			RetrySearch: function(e) {
				let that = this;
				let obj = {
					out_trade_no: e.bill
				};
				if (e == "WX") {
					_wx.WxPayment().QueryPayment(obj, function(res) {
						that.CreateDPayData(null, -1);
						that.createPayData(null, e);
					})
				}
				if (e == "Ali") {
					_ali.AliPayment().QueryPayment(obj, function(res) {
						that.CreateDPayData(null, -1);
						that.createPayData(null, e);
					})
				}
				if (e == "CARD") {
					_card.CardPayment().QueryPayment(obj, function(res) {
						that.CreateDPayData(null, -1);
						that.createPayData(null, e);
					})
				}
				if (e == "COUPON") {
					_coupon.CouponPayment().QueryPayment(obj, function(res) {
						that.CreateDPayData(null, -1);
						that.createPayData(null, e);
					})
				}
			}
		},
		created() {
			if (window && !window.vue) { //把vue放到全局上，方便调试
				window.vue = this;
			}
			this.paramInit();
			this.priceCount();
			this.dPayAmount = this.toBePaidPrice(); //初始化首次给待支付一个默认值
		},
		mounted() {}
	}
</script>
<style>
	.right {
		width: 100%;
	}

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
