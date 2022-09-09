<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
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
			<view class="nav" style="display: none;">
				<view class="getback">
					<view class="message">
						<view class="imgs">
							<image src="../../images/tongzhi.png" mode="widthFix"></image>
						</view>
						<text>门店有一条新的外卖配送单消息来啦...</text>
					</view>
				</view>
				<view class="account">
					<text>{{RYID}}</text>
					<view>
						<image src="../../images/touxiang.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="hh" style="padding-top:56rpx;">
				<view>
					<image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image>
					<image src="../../images/shouyintai.png" mode="widthFix"></image> 收银台
				</view>
				<view class="checkout">
					<label>
						<image src="../../images/dx-mendian.png" mode="widthFix"></image><text>{{NAME}}</text>
					</label>
					<label>
						<image src="../../images/dx-kuantai.png" mode="widthFix"></image>款台号：{{POSID}}
					</label>
				</view>
			</view>
			<view class="amounts">
				<!-- <p>订单号：{{out_trade_no_old}}</p> -->
				<p><text>总金额</text><text>{{isRefund ? refundView.totalAmount : totalAmount}}</text></p>
				<p><text>折扣</text><text>{{Discount}}</text></p>
				<p><text>已收</text><text>{{isRefund ? refundView.actualAmount : Number(yPayAmount).toFixed(2)}}</text>
				</p>
				<p><text>欠款</text><text>{{isRefund ? refundView.debtAmount : debt}}</text></p>
				<p>
					<text>还需支付</text>
					<text class="pay-center">
						<span v-if="isRefund">{{ refundView.debtAmount }}</span>
						<input v-if="!isRefund && currentPayType != 'HyJfExchange'" type="number" :disabled="allowInput"
							value="" :key="domRefresh" v-model="dPayAmount" />
						<input v-if="!isRefund && currentPayType == 'HyJfExchange'" type="number" disabled="false"
							value="" :key="domRefresh" v-model="CashOffset.Score" />
					</text>
				</p>
			</view>
			<view class="paydetails">
				<view class="pay-sum">
					<view class="settleds">
						<view class="paymentlist">
							<h3 v-if="!isRefund">已结算<button v-if="!isRefund" @click="ShowCoupon()">+ 可用券</button></h3>
							<view class="sets-list" v-if="!isRefund">
								<view class="paylists">
									<view class="Methods"
										v-for="(pay, index) in PayList.filter(i => !i.fail && !i.payding)">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ pay.name }}
										</view>
										<text>{{pay.amount}}￥</text>
									</view>
								</view>
								<view class="stills">
									<view class="Methods">
										<view class="payicon">
											<image src="../../images/shouyintai.png" mode="widthFix"></image>
											还需支付
										</view>
										<text>{{ debt }}￥</text>
									</view>
								</view>
							</view>
							<h3 v-if="!isRefund">结算失败</h3>
							<view class="sets-list refund" v-if="!isRefund">
								<view class="paylists">
									<view class="Methods"
										v-for="(pay, index) in PayList.filter(i => i.fail && !i.payding)"
										v-if="pay.pay_num == 0">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ pay.name }}
										</view>
										<div class="refund-more-box">
											<text class="refund-text">{{pay.amount}}￥</text>
											<div class="refund-reset" @click="singlePayRetry(pay.fkid,pay.bill)">
												{{ pay.auth_code?"支付":"重试" }}
												<div v-if="pay.loading" class="refund-icon refund-loading"></div>
											</div>
										</div>
									</view>
								</view>
							</view>
							<!-- 退款 -->
							<h3 v-if="isRefund">已退款 <button v-if="!isRefund" @click="ShowCoupon()">+ 可用券</button></h3>
							<view class="sets-list refund" v-if="isRefund">
								<view class="paylists">
									<view class="Methods" v-for="(refund, index) in refundedList">
										<!-- 这段的含义是 退款成功 且 次数不等于 0 的（起码为1，因为发起请求时默认为成功）且是状态确定的（正在支付操作算不确定的，所以不显示，当成功或失败才算确定的状态） -->
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ refund.name }}
										</view>
										<text>{{(-refund.amount).toFixed(2)}}￥</text>
									</view>
								</view>
							</view>
							<h3 v-if="isRefund">退款失败</h3>
							<view class="sets-list refund" v-if="isRefund">
								<view class="paylists">
									<view class="Methods"
										v-for="(refund, index) in RefundList.filter(i => i.fail && i.refund_num!=0 && !i.refunding)">
										<!-- v-for="(refund, index) in RefundList"> -->
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ refund.name }}
										</view>
										<div class="refund-more-box" @click="singleRetry(refund.bill)">
											<text class="refund-text">{{(-refund.amount).toFixed(2)}}￥</text>
											<div class="refund-reset">
												重试
												<div v-if="refund.loading" class="refund-icon refund-loading"></div>
											</div>
										</div>
									</view>
								</view>
							</view>
							<view>
								<button class="btn gopays" @click="Refund(true)"
									v-if="RefundList.filter(i => i.fail && i.refund_num!=0).length > 0 && false">重试</button>
							</view>
						</view>
					</view>
				</view>
				<view class="choosepays">
					<view class="pays-bj">
						<view class="bom-zhifu">
							<view class="pattern nots curr" :class="currentPayType === 'POLY'? 'selected':' '" id='POLY'
								@click="clickPayType('',$event)">
								<image class="p-bg" src="../../images/xzbj-da.png" mode="widthFix"></image>
								<p>聚合支付</p>
								<label>
									<view v-for="(item,index) in PayWayList.filter(i=>i.poly=='Y')">
										<image :src="require('../../images/' + item.type + '.png')" mode="widthFix">
										</image>
									</view>
								</label>
								<label class="poly-text">
									<!-- <text>支持</text> -->
									<text>支持{{PayWayList.filter(i=>i.poly=='Y').map(i => i.name).join(",")}}</text>
								</label>
							</view>
							<view v-for="(item,index) in PayWayList.filter(i=>i.poly=='N')" class="pattern nots curr"
								:class="currentPayType === item.type ? 'selected':' '" :id="item.type"
								@click="clickPayType(item,$event)">
								<view class="">
									<p>{{item.name}}</p>
								</view>
								<image :src="require('../../images/' + item.type + '.png')" mode="widthFix">
							</view>
						</view>

					</view>
					</p>
					<button class="btn gopays" @click="ActionSwtich()">{{ isRefund ? "退 款":"支 付"}}</button>
				</view>
			</view>
		</view>
		<!-- 会员券列表 -->
		<view class="boxs" v-if="coupons">
			<view class="coupons">
				<view class="h4"><text>选择优惠券</text> <button class="colse" @click="coupons = !coupons">×</button></view>
				<view style="max-height: 620px;overflow: auto;">
					<view class="uls">
						<view class="lis" v-for="(item,index) in coupon_list">
							<view class="voucher">
								<view><text>￥</text>{{item.money}}</view>
								<text>满{{item.limitmoney}}可用</text>
							</view>
							<image class="banyuan" src="../../images/quan-fenge.png" mode="widthFix"></image>
							<view class="coupon-dets">
								<view class="limit">
									<view class="h3" v-for="(item1,index1) in item.limitDesc">
										<text>{{item1}}</text>
									</view>
									<text class="datas">{{item.s_date}} 至 {{item.e_date}}</text>
								</view>
								<view class="directions">
									<image class="bg" src="../../images/quan-bg.png" mode="widthFix"></image>
									<view>使用说明<image src="../../images/xiala.png" mode="widthFix"></image>
									</view>
									<button @click="CouponToUse(item.lqid)">点击使用<image src="../../images/ewm.png"
											mode="widthFix"></image></button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 画布 -->
		<view class="canvasdiv" :style="'visibility:hidden;'">
			<canvas canvas-id="couponQrcode" class="canvas"
				:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasLogo" class="canvas"
				:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasXPEWM" class="canvas"
				:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>
		</view>
	</view>
	</view>
</template>
<script>
	var app = getApp();
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue';
	import hy from '@/api/hy/hy_query.js';
	import {
		pointsDeduction,
		pointsReturn
	} from '@/api/business/pointpay.js';
	import Req from '@/utils/request.js';
	import _wx from '@/api/Pay/WxPay.js';
	import _ali from '@/api/Pay/AliPay.js';
	import _card from '@/api/Pay/ECardPay.js';
	import _coupon from '@/api/Pay/ECoupon.js';
	import _pay from '@/api/Pay/PaymentALL.js';
	import {
		PointUpload
	} from '@/bll/Common/bll.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import {
		orderCreated,
		PayDataAssemble,
		global,
		print
	} from '@/models/PaymentAll/models.js';
	import {
		retrySinglePay
	} from '@/bll/PaymentAll/bll.js'
	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	var that, is_log = true;
	var log = console.log;
	// console.log = (...params) => {
	// 	if(is_log)
	// 		log(...params)
	// };
	export default {
		mixins: [global, print],
		components: {
			uniPopup,
			PrinterPage
		},
		data() {
			return {
				SALES: {
					sale1: {}, //主单
					sale2: [], //商品
					sale3: [], //支付
					sale8: [] //水吧商品
				},
				PaymentInfos: { //从上个页面传来的支付信息
					PayList: [],
					PayedAmount: 0, //已经完成支付的金额，主要针对从上个页面传入的订单数据的总和（解耦金额计算逻辑）
				},
				CashOffset: {
					Score: 1, //抵现的积分数
					Money: 0.01 //抵现的积分数对应的实际金额
				},
				coupons: false, //卡券弹窗
				prev_no: 0,
				limit: 3,
				used_no: [],
				coupon_list: [], //券集合
				logs: false,
				is_poly: true, //指示当前选择的是聚合还是非聚合
				isRefund: true,
				navmall: false,
				channel: "POS",
				YN_TotalPay: false,
				allowInput: false,
				refundRefresh: new Date().toString(), //刷新退款成功和失败列表
				currentPayInfo: null, //当前一单的支付平台信息（提供 fkid 和 name）
				currentPayType: "POLY", //支付类型，目前主要区分 聚合（聚合包含 支付宝、微信、会员卡-电子卡）和 券，默认聚合
				subject: "商品销售", //订单类型（文本说明）
				xuanzhong: true,
				CanBack: true, //是否允许退出(为false，此处是为了方便测试)
				type: 'center',
				allAmount: 0, //订单总金额(包含折扣)
				totalAmount: 0, //应付总金额
				yPayAmount: 0, //已支付金额
				dPayAmount: 0, //待支付
				PayAmount: 0,
				Discount: 0,
				allow_discount_amount: 0, //不可折扣金额 传入支付宝 0 不折扣 >0 折扣
				Products: [], //商品信息
				PayWayList: [], //支付方式
				PayWay: null,
				selectPayWayVal: null,
				PayList: [], //支付订单信息 {fkid:"",bill:"",name:"",amount:"",no:""}
				PaidList: [], //已支付商品信息
				RefundList: [], //退款信息
				authCode: "", //支付授权码
				out_trade_no_old: "", //原定单号
				out_trade_no: "", //单次发起支付的订单号（匹配多笔支付的操作 采用原订单号加序号的规则）
				out_refund_no: "", //退款单号
				disablePayInput: false,
				sale1_obj: {},
				sale2_arr: [],
				sale3_arr: [], //已支付的交易数据（本页面存在多次交易的可能，所以此参数只能在本页面动态构造）
				tx_obj: {},
				domRefresh: new Date().toString(),
				query: null,
				complete: false,
				BILL_TYPE: "",
				SKY_DISCOUNT: 0, //总手工折扣额（就是支付舍弃的分）
				XSTYPE: "",
				ZFBZK: 0, //支付宝折扣额
				refundView: {
					totalAmount: 0,
					actualAmount: 0,
					debtAmount: 0
				},
				sbsp_arr: [], //水吧产品初始集合
				sale8_arr: [], //水吧产品集合
				actType: "", //当前操作行为 用以定义是支付还是退款
				hyinfo: {} //当前会员信息
			}
		},
		watch: {
			dPayAmount: function(n, o) {
				if (this.isRefund) return; //如果为退款，直接退出
				if (Object.is(NaN, Number(n))) { //判断输入的是否是数字
					this.dPayAmount = o;
					util.simpleMsg('输入的数字有误,已自动修正!', false);
					this.domForceRefresh(); //解决待付款赋值触发监听后，在其中修改值后文本内容依然没变的问题
					return;
				}
				let amount = this.toBePaidPrice(); //计算待支付金额
				if (Number(n) === 0 && n.length > 1 && n[0] === '-') {
					this.dPayAmount = 0;
					this.domForceRefresh();
				}
				if (Number(n) < 0) { //待支付金额必须为正数
					this.dPayAmount = o;
					util.simpleMsg('待支付金额必须大于0!', false);
					this.domForceRefresh();
				}
				console.log(`newValue:${n},amount:${amount}`);
				if (amount > 0) { //未完成支付，仍然存在欠款
					if (this.PayList.length === 0) this.CanBack = true; //未使金额发生变化则仍然可以退出
					else this.CanBack = false;
					//检测待支付金额是否超过了欠款，如果超过则自动修正为欠款金额数
					if (Number(n) > this.toBePaidPrice()) { //后面这部分是因为存在一个舍弃分（就是一分钱两分钱不要，自动折扣）
						if (Number(n) - this.toBePaidPrice() > 0.1)
							util.simpleMsg('金额输入错误!', false, {
								new_val: n || "-",
								count_val: this.toBePaidPrice()
							});
						this.dPayAmount = amount; //超过待支付金额后自动给与目前待支付金额的值
						this.domForceRefresh();
					} else {
						let count = (this.dPayAmount?.toString() || ".").split('.')[1].length;
						if (count > 2) {
							this.dPayAmount = Number(this.dPayAmount).toFixed(2);
							this.domForceRefresh();
						}
					}
				} else { //完成支付，推送数据
					var that = this;
					this.YN_TotalPay = true;
					this.CanBack = true;
					console.log("Generator-SALE1、2、3:", this.sale1_obj, this.sale2_arr, this.sale3_arr);
					this.createOrders(true);
				}
			},
			yPayAmount: function(n, o) {
				this.dPayAmount = this.toBePaidPrice(); //一旦已支付金额发生变化，自动触发计算剩余待支付金额
			},
			authCode: function(n, o) {
				console.log("[watch-authCode]判断authCode：", n);
				console.log("[watch-authCode]PayWayList：", this.PayWayList);
				if (n)
					this.currentPayInfo = this.PayWayList.find(i => i.type === this
						.PayTypeJudgment()); //每次支付后根据 authcode 判断支付方式并给 currentPayInfo
				else
					this.currentPayInfo = null
				console.log("当前支付类型信息：", this.currentPayInfo);
			},
			currentPayType: function(n, o) { //每次发生变化,切换页面dom选中
				console.log("[Watch-CurrentPayType]当前类型:", n);
				this.currentPayInfo = this.PayWayInfo(n); //根据 type 获取支付信息
				if (n === "SZQ") { //如果用券，则不再允许编辑待付款金额
					this.dPayAmount = this.toBePaidPrice();
					this.domForceRefresh();
					this.allowInput = true;
				} else if (n === "HyJfExchange") { //如果是用的积分抵现，则修改为当前可用的积分上限进行支付（对应金额，且不能修改）
					this.dPayAmount = this.CashOffset.Money;
					this.allowInput = true;
				} else {
					this.dPayAmount = this.toBePaidPrice();
					this.allowInput = false;
				}
			},
			RefundList: function(n, o) {
				this.refundAmountCount(); //重新计算金额
				if (n && n.filter(i => i.fail).length == 0) {
					this.CanBack = true;
					console.log("[RefundList-Watch]Refunds：", this.RefundList)
					this.createOrders();
				}
			},
			logs: function(n, o) {
				is_log = n;
			}
		},
		computed: {
			debt: function() {
				this.allAmount = this.toBePaidPrice();
				return this.allAmount;
			},
			refundedList: function() {
				return this.RefundList.filter(i => !i.fail && i.refund_num != 0 && !i.refunding);
			}
		},
		methods: {
			onLoad: function(option) {
				this.event = this.getOpenerEventChannel();
			},
			//单号防重处理
			UniqueBill: function() {
				let that = this;
				that.out_trade_no = that.out_trade_no_old + '_' + ((function() {
					if (this.prev_no === null) {
						this.prev_no = that.PayList.length;
						return that.PayList.length;
					} else
					if (this.used_no.indexOf(this.prev_no) !== -1)
						return ++this.prev_no;
					else
						return this.prev_no;
				}).bind(this))();
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
			//合并 index 中已经初始化一部分的 数据对象
			SaleDataCombine: function() {
				let saledate = dateformat.getYMD();
				let saletime = dateformat.getYMDS();
				let hyinfo = this.hyinfo || util.getStorage("hyinfo");
				let sale1 = this.SALES.sale1,
					sale2 = this.SALES.sale2,
					sale3 = this.SALES.sale3,
					sale8 = this.SALES.sale8;
				console.log("[SaleDataCombine]sale1", sale1);
				console.log("[SaleDataCombine]sale2", sale2);
				console.log("[SaleDataCombine]sale3", sale3);
				console.log("[SaleDataCombine]sale1 封装中...");
				console.log("[SaleDataCombine]封装参数TotalAmount:", this.totalAmount);
				this.sale1_obj = Object.assign(sale1, { //上个页面传入的 sale1 和 当前追加
					BILL: this.isRefund ? this.out_refund_no : this.out_trade_no_old,
					SALEDATE: saledate,
					SALETIME: saletime,
					TNET: this.isRefund ? -sale1.TNET : this.totalAmount, //实付金额（重点）
					ZNET: this.isRefund ? -sale1.ZNET : this.totalAmount, //总金额（重点）
					BILLDISC: this.isRefund ? -sale1?.BILLDISC : (Number(this.Discount) + Number(this
						.SKY_DISCOUNT)).toFixed(2), //整单折扣需要加上手工折扣,
					ROUND: this.isRefund ? -sale1.ROUND : Number(this.SKY_DISCOUNT).toFixed(2), //取整差值（手工折扣总额）
					CUID: this.isRefund ? sale1.CUID : hyinfo?.hyId,
					CLTIME: saletime,
					XS_BILL: sale1?.BILL ?? "", //退款时记录原单号（重点）
					XS_POSID: this.isRefund ? (sale1?.POSID ?? "") : "", //退款时记录原posid（重点）
					XS_DATE: this.isRefund ? (sale1?.SALEDATE ?? "") : "", //退款时记录原销售日期（重点）
					XS_KHID: this.isRefund ? (sale1?.KHID ?? "") : "", //退款时记录原khid（重点）
					XS_GSID: this.isRefund ? (sale1?.GSID ?? "") : "", //退款时记录原GSID（重点）
					XSTYPE: this.XSTYPE,
					BILL_TYPE: this.BILL_TYPE,
					TDISC: this.isRefund ? (-sale1?.TDISC ?? "0") : Number(this.SKY_DISCOUNT).toFixed(2),
					TLINE: (this.isRefund ? -sale1.TLINE : sale1.TLINE)
				});
				console.log("[SaleDataCombine]sale1 封装完毕!", this.sale1_obj);
				console.log("[SaleDataCombine]sale2 封装中...");
				this.sale2_arr = sale2.map((function(item, index) {
					let obj = Object.assign(item, {
						BILL: this.isRefund ? this.out_refund_no : this.out_trade_no_old, //主单号
						SALEDATE: saledate,
						SALETIME: saletime,
						PRICE: parseFloat(item.PRICE).toFixed(2),
						NET: this.isRefund ? (-1 * item.NET).toFixed(2) : (item.NET - item
							.SKYDISCOUNT).toFixed(2),
						DISCRATE: this.isRefund ? -item.DISCRATE : item
							.SKYDISCOUNT, //当前商品的折扣额 后续可能有促销折扣
						YN_SKYDISC: this.isRefund ? item.YN_SKYDISC : item.SKYDISCOUNT >
							0 ? "Y" : "N", //是否有手工折扣
						DISC: this.isRefund ? -item.DISC : item.SKYDISCOUNT, //手工折扣额
						MONTH: new Date().getMonth() + 1,
						QTY: (this.isRefund ? -1 : 1) * item.QTY,
						WEEK: dateformat.getYearWeek(new Date().getFullYear(), new Date()
							.getMonth() + 1,
							new Date().getDay()),
						TIME: new Date().getHours()
					});
					return util.hidePropety(obj, "NAME");
				}).bind(this));
				console.log("[SaleDataCombine]sale2 封装完毕!", this.sale2_arr);
				console.log("[SaleDataCombine]sale3 封装中...");
				this.sale3_arr = this.Sale3Source().map((function(item, index) {
					return util.hidePropety({
						BILL: this.isRefund ? this.out_refund_no : this
							.out_trade_no_old, //主单号，注：订单号为 BILL+ _ + NO,类似于 10010_1
						SALEDATE: saledate,
						SALETIME: saletime,
						KHID: this.KHID,
						POSID: this.POSID,
						NO: item.no, //付款序号
						FKID: item.fkid, //付款类型id
						AMT: this.isRefund ? -(Number(item.amount)) : item.amount, //付款金额(退款记录为负额)
						ID: this.isRefund ? (item.origin?.ID || "") : item.card_no, //卡号或者券号
						RYID: this.RYID, //人员
						GCID: this.GCID, //工厂
						DPID: this.DPID, //店铺
						KCDID: this.KCDID, //库存点
						// BMID: this.BMID, //部门id
						BMID: item.point, //部门id
						DISC: this.isRefund ? -(item.origin?.DISC || 0) : item.disc, //折扣金额
						FAMT: this.isRefund ? -(item.origin?.FAMT || 0) : item
							.disc, //折扣金额(卡券消费后要记录)
						RATE: this.isRefund ? -(item.origin?.RATE || 0) : item
							.disc, //折扣金额(卡消费后要记录)
						ZKLX: this.isRefund ? (item.origin?.ZKLX || "") : item.zklx, //折扣类型
						IDTYPE: this.isRefund ? (item.origin?.IDTYPE || "") : item.id_type, //卡类型
						balance: this.isRefund ? "" : (item.balance || ""), //如果是电子卡，余额
						balance_old: this.isRefund ? "" : (item.balance_old || "") //如果是电子卡，余额
					}, "balance", "balance_old");;
				}).bind(this));
				console.log("[SaleDataCombine]sale3 封装完毕!", this.sale3_arr);
				console.log("[SaleDataCombine]sale8 封装中...");
				this.sale8_arr = sale8; //使用直接传入的水吧商品
				//sale8 由销售页面传入 无需再处理
				// this.sale8_arr = this.sbsp_arr.map((function(item, index) {
				// 	return Object.assign(item, {
				// 		SALEDATE: saledate,
				// 		SALETIME: saletime,
				// 		GCID: this.GCID,
				// 		KHID: this.KHID,
				// 		POSID: this.POSID,
				// 		BILL: this.isRefund ? this.out_refund_no : this.out_trade_no_old,
				// 		SPID: item.SPID,
				// 		NO: i,
				// 		ATTCODE: "1",
				// 		ATTNAME: "糖",
				// 		OPTCODE: "1",
				// 		CSTCODE: "1",
				// 		OPTMAT: "123456",
				// 		QTY: item.QTY,
				// 		PRICE: item.PRICE
				// 	});
				// }).bind(this));
				console.log("[SaleDataCombine]sale8 封装完毕!");
			},
			//集中生成 sql 指令
			orderSQLGenarator: function() {
				let saledate = dateformat.getYMD();
				let saletime = dateformat.getYMDS();
				let sql1 = common.CreateSQL(this.sale1_obj, 'SALE001');
				let sql2 = common.CreateSQL(this.sale2_arr, 'SALE002');
				let sql3 = common.CreateSQL(this.sale3_arr, 'SALE003');
				let sql8 = common.CreateSQL(this.sale8_arr, 'SALE008');
				console.log("[orderSQLGenarator]sql1生成：", sql1)
				console.log("[orderSQLGenarator]sql2生成：", sql2)
				console.log("[orderSQLGenarator]sql3生成：", sql3)
				console.log("[orderSQLGenarator]sql8生成：", sql8)
				this.tx_obj = {
					TX_SQL: sql1.oracleSql + sql2.oracleSql + sql3.oracleSql + sql8.oracleSql,
					STOREID: this.KHID,
					POSID: this.POSID,
					TAB_NAME: 'XS',
					STR1: this.isRefund ? this.out_refund_no : this.out_trade_no_old,
					BDATE: saletime, //增加时分秒的操作
					YW_NAME: "销售单据",
					CONNSTR: 'CONNSTRING'
				};
				let sql4 = common.CreateSQL(this.tx_obj, 'POS_TXFILE');
				return sql1.sqlliteArr.concat(sql2.sqlliteArr).concat(sql3.sqlliteArr).concat(sql4.sqlliteArr).concat(
					sql8.sqlliteArr);
			},
			//sale 003 数据源：
			Sale3Source: function() {
				return this.isRefund ? this.RefundList.filter(i => !i.fail) : this.PayList.filter(
					i => !i.fail); //如果是退款，那么就是退款信息，否则是支付信息
			},
			//创建订单数据
			CreateDBData: async function(func) {
				console.log("是否完成创建销售单：", this.complete)
				if (!this.complete) { // complete 为 false 代表未创建销售单，如果为true则代表已经创建完毕
					//对订单数据进行合并 生成最终的this.sale1_obj,this.sale2_arr,this.sale3_arr,this.sale8_arr 
					this.SaleDataCombine();
					if (func)
						func({
							code: true,
							msg: "支付完成，数据整合完成"
						});
					return;
					//从这开始中止
					//生成执行sql
					let exeSql = this.orderSQLGenarator();
					let dbo = db.get();
					console.log("sqlite待执行sql:", exeSql);
					await dbo.close();
					dbo.executeDml(exeSql, "订单创建中", (function(res) {
						if (func) func(res);
						this.complete = true;
						console.log("订单创建成功：", res);
						util.simpleMsg("销售单创建成功");

					}).bind(this), function(err) {
						console.log("订单创建失败：", err);
						util.simpleMsg("销售单创建失败", false);
					});
				}
			},
			//使用的 单号 判断（支付单号、退款单号）
			useOrderNoChoice: function() {
				return this.isRefund ? this.out_refund_no : this.out_trade_no_old;
			},
			//使用的 积分 类型操作 增加/减少 积分
			useOrderTypeChoice: function() {
				return this.isRefund ? "DECREASE" : "INCREASE";
			},
			// 执行表单插入本地数据库操作
			SaleExcuted: function(sqlArr) {
				db.get().executeDml(sqlArr, null, function(res) {
					util.simpleMsg("销售单创建成功");
				}, function(err) {
					util.simpleMsg("销售单创建失败", true);
				});
			},
			//生成SALE3表sql
			Sale3PackageSaveForSqlite: function(list) {
				let current = [];
				list.forEach(((item) => {
					current.push({
						BILL: this.isRefund ? this.out_refund_no : this
							.out_trade_no_old, //主单号，注：订单号为 BILL+ _ + NO,类似于 10010_1
						SALEDATE: dateformat.getYMD(),
						SALETIME: dateformat.getYMDS(),
						KHID: this.KHID,
						POSID: this.POSID,
						NO: item.no, //付款序号
						FKID: item.fkid, //付款类型id
						AMT: item.amount, //付款金额
						ID: item.user_id, //卡号或者券号
						RYID: this.RYID, //人员
						GCID: this.GCID, //工厂
						DPID: this.DPID, //店铺
						KCDID: this.KCDID, //库存点
						BMID: this.BMID, //部门id
						DISC: item.disc, //折扣金额
						ZKLX: item.zklx, //折扣类型
						IDTYPE: item.id_type //卡类型
					});
				}).bind(this))
				let sql3 = common.CreateSQL(current, 'SALE003');
				this.SaleExcuted(sql3);
			},
			//支付按钮点击事件
			Pay: function() {
				let that = this; //适配真机
				console.log("[Pay]当前支付类型:", this.currentPayType);
				let pay_info = this.PayWayInfo(this.currentPayType);
				console.log("[Pay]当前支付类型信息:", pay_info);
				if (!this.currentPayType) {
					util.simpleMsg("未选择支付方式，请选择后再进行支付!", false);
					return;
				}
				if ((!this.dPayAmount || Number(this.dPayAmount) === 0) && this.toBePaidPrice() != 0) {
					util.simpleMsg("金额不能为空!", false);
					this.dPayAmount = this.toBePaidPrice();
					return;
				}
				if (!this.YN_TotalPay) { //如果未支付完成
					if ((pay_info.dbm === "Y" || this.is_poly) && !this.authCode) { //需要扫码操作(条件：1、指定为聚合支付。2、或直接设定扫或不扫码)
						console.log("此操作类型需要扫码！", pay_info)
						console.log("是否属于聚合支付：", this.is_poly)
						uni.scanCode({
							success: (function(res) {
								this.authCode = res.result; //获取扫码的 authCode
								console.log("[Pay]scanCode:", res);
								that.PayHandle();
							}).bind(this),
							fail(err) {
								console.log("[Pay]Error:", err);
							}
						});
					} else { //不需要扫码操作
						console.log("此操作类型不需要扫码！", pay_info)
						that.PayHandle(); //直接发起支付
					}
				} else {
					util.simpleMsg("订单已完成支付!");
				}
			},
			//退款数据处理
			RefundDataHandle: function() { //把上个页面传入的退款数据进行处理后进行展示
				console.log("[RefundDataHandle]SALE1 初始化开始：", this.sale1_obj);
				this.SALE1Init(this.sale1_obj); //sale1 初始化
				console.log("[RefundDataHandle]SALE2 初始化开始：", this.sale2_arr);
				this.SALE2Init(this.sale2_arr);
				console.log("[RefundDataHandle]SALE3 初始化开始：", this.sale3_arr);
				this.SALE3Init(this.sale3_arr);
				this.logs = false;
			},
			//支付数据处理
			PayDataHandle: function() {
				if (common.actTypeEnum.Payment === this.actType) { //如果是支付
					console.log("[PayDataHandle]初始化 PayList 列表...", this.SALES)
					this.PayListInit();
					this.sale1_obj = this.SALES.sale1;
					this.sale2_arr = this.SALES.sale2;
					this.sale3_arr = this.SALES.sale3;
					console.log("[PayDataHandle]初始化完毕!");
				}
			},
			//计算从上个页面传入的已完成的支付金额
			PayedCount: function() {
				let count = 0;
				this.PaymentInfos.PayList?.filter(i => !i.fail).map(pay => { //总和计算上个页面已经支付成功的订单的金额
					count += pay.amount;
				});
				console.log("[PayedCount]已支付金额(已完成支付的记录计算金额):", count);
				return count;
			},
			//PayList 初始化
			PayListInit: function() { //由于存在计算已支付金额的操作，所以此操作必须要在进行待支付金额计算前调用，否则会导致待支付金额误差的问题
				let pays = this.PaymentInfos.PayList;
				this.PayList = JSON.parse(JSON.stringify(this.PaymentInfos.PayList ?? []));
				// this.PayList = this.PaymentInfos.PayList;
				this.PaymentInfos.PayedAmount = this.PayedCount();
				console.log("[PayListInit]PayList列表初始化完毕！", this.PayList)
			},
			//SALE001 初始化
			SALE1Init: function() {
				if (this.isRefund)
					this.sale1_obj = this.SALES.sale1 ? Object.assign({}, this.SALES.sale1) : {};
				console.log("SALE1 初始化完毕！", this.sale1_obj)
				this.sale1_obj = {}; //重置此项	
			},
			//SALE002 初始化、处理
			SALE2Init: function() {
				if (this.isRefund) {
					this.Products = this.SALES.sale2?.map((function(i) {
						return Object.assign({
							PLID: i.PLID,
							SPID: i.SPID,
							UNIT: i.UNIT,
							BARCODE: i.BARCODE,
							NAME: i.NAME,
							PRICE: i.PRICE,
							OPRICE: i.OPRICE,
							NET: i.NET,
							QTY: i.QTY,
							DISCRATE: i.DISCRATE, //退款使用
							YN_SKYDISC: i.YN_SKYDISC, //退款使用
							DISC: i.DISC //退款使用
						}, i)
					}).bind(this));
					console.log("[SALE2Init]商品信息循环后：", this.Products);
					this.refundAmountCount(); //退款金额计算
				}
				console.log("[SALE2Init]SALE2 初始化完毕！", this.Products)
			},
			//SALE003 初始化、处理
			SALE3Init: function() {
				if (this.isRefund) {
					console.log("[SALE3Init]PayWayList:", this.PayWayList);
					this.RefundList = this.SALES.sale3?.map((function(i) { //将sale3的数据转为页面适用的格式
						return {
							fkid: i.FKID,
							bill: `${i.BILL}_${i.NO}`,
							name: this.PayWayList.find(p => p.fkid == i.FKID)?.name ?? "",
							amount: Number(i.AMT).toFixed(2),
							no: i.NO,
							fail: true, //def初始和退款失败的皆为true
							refund_num: 0, //退款（尝试）次数
							refunding: false, //是否在正在退款中
							loading: false,
							msg: "", //操作提示信息（可以显示失败的或者成功的）
							origin: i
						}
					}).bind(this));
				}
				console.log("SALE3 初始化完毕！", this.RefundList)
			},
			//根据 type 获取 支付信息
			PayWayInfo: function(type) {
				console.log("[PayWayInfo]支付类型:", type);
				console.log("[PayWayInfo]支付方式列表:", this.PayWayList);
				return this.PayWayList.find(i => i.type === type) || {};
			},
			//退款操作
			Refund: function(isRetry = false) {
				console.log("开始退款流程...")
				console.log("退款单号为：", this.out_refund_no)
				let refund_no = this.out_refund_no,
					that = this,
					promises = [];
				//遍历所有退款失败的(或者未退款的)
				console.log("退款单列表：", this.RefundList)
				if (this.RefundList.filter(i => i.fail).length === 0) {
					util.simpleMsg("已完成退款!");
					return;
				}
				console.log("RefundList-Before:", this.RefundList);
				//遍历 RefundList 发起退单请求
				this.RefundList.filter(i => i.fail).forEach((function(refundInfo, index) {
					let payWayType = this.PayWayList.find(i => i.fkid == refundInfo.fkid)?.type;
					console.log("[Refund]退款fkid:", refundInfo.fkid)
					console.log("[Refund]退款payWayType:", payWayType)
					if (payWayType) {
						if (!isRetry) refundInfo.fail =
							false; //开始默认为退款成功（只包含首次退款的，如果是第二次尝试则默认为原有状态，也就是false）
						refundInfo.refunding = true; //标记为正在退款的状态
						let res = _pay.RefundAll(payWayType, {
								out_trade_no: refundInfo.bill, //单号
								out_refund_no: refund_no + `_${index}`, //退款单号
								refund_money: (Math.abs(Number(refundInfo.amount) * 100)).toFixed(
									0), //退款金额
								total_money: (Math.abs(Number(refundInfo.amount) * 100)).toFixed(
									0), //退款总金额（兼容微信）
								point: refundInfo.origin.BMID //兼容积分抵现返还积分
							}, (function(err) { //如果发生异常（catch）
								util.simpleMsg(err.msg, true, err);
							}).bind(that),
							(function(res) { //执行完毕（finally），退款次数 +1
								console.log("[Refund-退款]Finally:", res);
								refundInfo.refund_num += 1; //发起请求默认加1
								refundInfo.refunding = false; //标记为已经结束退款操作
								this.RefundList = Object.assign([], this.RefundList) //刷新视图
							}).bind(that),
							(function(ress) { //执行完毕（results），根据结果判断
								console.log("[Refund-退款]Results:", ress);
								if (!ress[1].code) { //如果第二个回调退款结果异常，那么把当前退款标记为失败，否则标记为成功
									refundInfo.fail = true;
									refundInfo.msg = ress[1].msg; //错误提示信息记录
								} else
									refundInfo.fail = false;
							}).bind(that));
						promises.push(res)
					} else {
						util.simpleMsg("支付方式不存在!");
					}
				}).bind(this));
				this.refundAmountCount(); //重新计算
				Promise.all(promises).then((res) => {
					console.log("RefundList-After:", this.RefundList);
				})
			},
			//创建订单对象列表
			createOrders: function(is_success) {
				if (this.RefundList.length !== 0 && this.RefundList.filter(i => i.fail).length === 0 || this.PayList
					.length !== 0 && this.PayList.filter(i => i.fail).length === 0 || is_success)
					this.CreateDBData((res) => {
						util.simpleMsg("支付已完成！");
						setTimeout(function() {
							that.backPrevPage();
						}, 1500);
						//后续处理转移到销售页面处理
						return;
						//销售单单创建成功后 上传一下数据
						let bill = (that.actType == common.actTypeEnum.Refund ? that.out_refund_no : that
							.out_trade_no_old);
						common.TransLiteData(bill);
						that.scoreConsume();
						//调用打印
						let arr2 = that.sale2_arr;
						arr2.forEach(function(item, index) {
							let obj = that.Products.find((i) => {
								return i.SPID == item.SPID;
							})
							if (obj) {
								item.SNAME = obj.NAME;
							}
						})
						let arr3 = that.sale3_arr;
						arr3.forEach(function(item, index) {
							let obj = that.PayWayList.find((i) => {
								return i.fkid == item.FKID;
							})
							item.SNAME = obj.name;
						})
						that.$refs.printerPage.bluePrinter(that.sale1_obj, arr2, arr3);

					});
			},
			//支付类型判断
			PayTypeJudgment: function() {
				let curPayType = "";
				let startCode = this.authCode.substring(0, 2);
				if (startCode) {
					let CodeRule = getApp().globalData.CodeRule;
					if (this.currentPayType === "SZQ") //券
						startCode = "coupon";
					//取出当前是何种类型的支付方式
					curPayType = CodeRule[startCode]; //WX_CLZF,ZFB_CLZF,SZQ,HYK....
				}
				if (!curPayType) {
					util.simpleMsg("二维码错误！请重新扫码！", "none");
					this.authCode = '';
				}
				console.log("[PayTypeJudgment]支付类型：", curPayType);
				return curPayType;
			},
			//支付 data 对象组装
			PayDataAssemble: PayDataAssemble,
			//支付处理入口
			PayHandle: function() {
				console.log("[PayHandle]进入支付处理...");
				let payAfter = this.PayDataAssemble(),
					info = this.PayWayInfo(this.currentPayType);
				console.log("[PayHandle]Info:", info);
				console.log("[PayHandle]判断支付信息...");
				if (Object.keys(info).length === 0)
					info = this.PayWayInfo(this.PayTypeJudgment());
				console.log("[PayHandle]支付单号:", this.out_trade_no);
				console.log("[PayHandle]支付参数:", payAfter);
				console.log("[PayHandle]支付类型:", info);
				let XZZF = util.getStorage("XZZF");
				let pt = this.PayTypeJudgment();
				console.log("[PayHandle]当前支付集合：", this.PayList);
				console.log("[PayHandle]当前支付类型：", pt);
				//如果被限制了 则进行判断是否有过支付
				if ((XZZF.length > 0 && this.PayList.length > 0 && XZZF.indexOf(pt) >= 0) && this.PayList.find((r) => r
						.type == pt)) {
					util.simpleMsg("请更换支付方式!", true);
					this.authCode = '';
					return;
				}
				console.log("[PayHandle]支付开始...");
				_pay.PaymentAll(info.type, payAfter, (function(result) {
						console.log("[Payment-付款]支付结果：", result);
						util.simpleMsg("支付成功!");
						this.UpdateHyInfo(result.data); //更新会员信息
						console.log("[PayHandle]auth_code清空！");
						this.authCode = ""; //避免同一个付款码多次使用
						this.orderGenarator(payAfter, info.type, result.data, false); //支付记录处理(成功)
						if (this.debt > 0) {
							this.CanBack = false;
						}
						console.log("[PayHandle]序号储存！");
						console.log("[PayHandle]序号：", this.prev_no)
						this.used_no.push(this.prev_no); //存入，避免重复单号出现
						console.log("[PayHandle]序号列表：", this.used_no);
					}).bind(this),
					(function(error) {
						this.used_no.push(this.prev_no); //避免出现用某一种支付方式失败后，再次支付因为订单号重复导致无法支付的问题
						console.log("[Payment-付款]支付失败！")
						util.simpleModal("支付失败", error.msg);
						this.authCode = ""; //避免同一个付款码多次使用
						this.orderGenarator(payAfter, info.type, null,
							true); //支付记录处理(失败) 注：此记录为必须，因为有的单会因为请求超时判定为失败，所以这里的得记录这个支付信息，方便后续重试进行查询
					}).bind(this))
			},
			//支付后创建支付记录
			orderGenarator: function(payload, type, result, fail) {
				console.log("生成订单类型[orderGenarator]：", this.currentPayType);
				console.log("生成订单类型[payload]：", payload);
				console.log("生成订单类型[result]：", result);
				let payObj = this.PayWayList.find(item => item.type == type); //支付对象主要用于会员卡支付
				//计算已支付金额（如果这笔支付成功，则总和进已支付金额中，否则为 0）
				this.yPayAmount += fail ? 0 : ((function() {
					if (result.vouchers.length > 0) {
						console.log("[OrderGenarator]券支付金额：")
						let coupon = result.vouchers.filter(i => i.yn_card === 'N'),
							card = result.vouchers.filter(i => i.yn_card === 'Y');
						if (coupon.length > 0) {
							console.log("[OrderGenarator]券 payload.money：", payload.money)
							let fq = coupon.find(i => i.note === "EXCESS");
							return (coupon.length > 1 ? (fq.denomination - fq.pay_amount) :
								result
								.vouchers[0].denomination) / 100;
						} else {
							console.log("[OrderGenarator]卡 payload.money：", card)
							let num = 0;
							card.map(i => num += i.pay_amount);
							return num / 100
						}
					} else {
						console.log("[OrderGenarator]非券支付金额：", payload.money / 100)
						return (payload.money / 100)
					}
				}).bind(this))(); //把支付成功部分金额加上
				//支付失败的时候 result 并不是标准的响应内容
				if (result) {
					if (result.vouchers.length > 0) { //如果是券支付，且返回的卡券数组列表为非空
						result.vouchers.forEach((function(coupon, index) {
							let excessInfo = this.PayWayList.find(item => item.fkid == coupon.fkid); //放弃金额
							console.log("卡券：", coupon)
							this.PayList.push(this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
								amount: ((coupon.yn_card === 'Y' ? coupon.pay_amount :
									(coupon
										.note === 'EXCESS' ? -coupon
										.pay_amount : coupon
										.denomination)) / 100).toFixed(2),
								fkid: coupon.yn_card === 'Y' ? this.currentPayInfo?.fkid :
									coupon
									?.fkid,
								name: coupon.yn_card === 'Y' ? this.currentPayInfo?.name :
									excessInfo.name,
								balance: (coupon?.balance / 100).toFixed(2), //如果是电子卡，余额
								balance_old: ((coupon.balance + coupon.pay_amount) / 100)
									.toFixed(
										2), //如果是电子卡，余额
								zklx: coupon.yn_card === 'Y' ? payObj.zklx : (coupon
									.note ===
									'EXCESS' ? excessInfo.fkid : coupon.disc_type),
								disc: (coupon?.discount / 100).toFixed(2),
								fail,
								id_type: coupon?.type,
								is_free: coupon?.yn_zq,
								card_no: coupon?.no,
								no: payload.no
							}, result));
						}).bind(this));
					} else { //如果是聚合支付(这里应该是非卡券类别)
						this.PayList.push(this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
							amount: (payload.money / 100).toFixed(2),
							fail,
							no: payload.no
						}, result));
					}
				} else { //如果为失败的支付请求
					this.PayList.push(this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
						amount: (payload.money / 100).toFixed(2),
						fail,
						no: payload.no,
						bill: payload.out_trade_no //保存失败的订单号
					}));
				}
				this.PayList = Object.assign([], this.PayList);
			},
			//订单对象创建
			orderCreated, //避免后续绑定this指向
			_scoreConsume: function() {
				PointUpload({
					order_no: this.useOrderNoChoice(),
					sale_order_no: this.sale1_obj?.XS_BILL,
					member_id: this.isRefund ? hyinfo?.hyId : this.sale1_obj.CUID,
					product: this.Products,
					pay_list: this.PayList.map(item => {
						return {
							paymentType: item.fkid,
							payAmount: item.amount
						}
					}),
					mode: this.useOrderTypeChoice()
				})
			},
			//积分操作 
			scoreConsume: function() {
				console.log("[ScoreConsume]开始积分上传...");
				let hyinfo = this.hyinfo || util.getStorage("hyinfo");
				if (!hyinfo || JSON.stringify(hyinfo) == '{}') { //没会员信息的话就不调用上传积分以免接口报错
					console.log("[ScoreConsume]未检查到会员信息!");
					return;
				}
				let data = this.memberGenarator();
				console.log("[ScoreConsume]积分上传参数：", data);
				_member.UploadPoint("积分上传中...", {
					brand: that.brand,
					data
				}, (res) => {
					console.log("[ScoreConsume]积分上传成功...", res)
					util.simpleMsg(res.code ? "积分上传成功" : res.msg, res.code ? false : "none");
				}, (err) => {
					console.log("[ScoreConsume]积分上传失败...", err)
					util.simpleMsg(err.msg, "none");
				})
			},
			//生成会员积分信息请求参数列表
			memberGenarator: function(obj = {}) {
				let hyinfo = this.hyinfo || getApp().globalData.hyinfo;
				console.log("[MemberGenarator]会员积分请求参数:", hyinfo);
				return Object.assign({
					// addPoint: 0,//接口默认字段无需传值 下面的同理
					channel: this.channel,
					// cityCode: "",
					bill: this.useOrderNoChoice(), //订单号
					date: dateformat.getYMDS(),
					// deducePoint: 0,
					// districtCode: "",
					productList: this.Products.map((item, i) => {
						return {
							lineNumber: i,
							product: item.BARCODE,
							category: item.PLID,
							quantity: item.QTY,
							userPrice: item.PRICE,
							basePrice: item.OPRICE,
							netPrice: item.NET
						}
					}),
					amount: this.totalAmount, //netAmount: that.totalAmount,
					orderAmount: this.totalAmount,
					// orderType: '1', //订单类型
					payList: this.PayList.map(item => {
						return {
							paymentType: item.fkid,
							payAmount: item.amount
						}
					}),
					khid: this.KHID,
					// preOrderCode: "",
					// promotionIds: [],
					region: this.BMID,
					// stateCode: "",
					//else
					kquser: this.kquser,
					posid: this.POSID,
					cxbill: "",
					hyid: this.isRefund ? hyinfo?.hyId : this.sale1_obj.CUID, //会员id
					sign: "",
					time: dateformat.gettimes(),
					zf_bill: this.sale1_obj?.XS_BILL,
					price: this.totalAmount,
					pay_amount: this.totalAmount,
					//判断积分是扣还是加
					actionType: this.useOrderTypeChoice() //values： INCREASE(增加) or DECREASE(减少)
				}, obj);
			},
			//初始化
			paramInit: function() {
				that = this;
				this.PayWayList = util.getStorage('PayWayList'); //获取支付方式 
				console.log("支付初始化——可用的支付方式:", this.PayWayList)

				// this.hyinfo = util.getStorage('hyinfo');
				// console.log("支付初始化——会员信息:", this.hyinfo);

				var prev_page_param = this.$store.state.location;
				console.log("[ParamInit]传入页面参数:", prev_page_param);
				if (prev_page_param) {
					//传入的sale系列表数据初始化 👇
					this.SALES.sale1 = prev_page_param?.sale1_obj; //sale1数据
					this.SALES.sale2 = prev_page_param?.sale2_arr; //sale2数据
					this.SALES.sale3 = prev_page_param?.sale3_arr; //sale3数据
					this.SALES.sale8 = prev_page_param?.sale8_arr; //sale3数据
					this.hyinfo = prev_page_param?.hyinfo; //会员信息采用传入
					console.log("支付初始化——会员信息:", this.hyinfo);

					//sale 系列表数据初始化 👆
					this.actType = prev_page_param.actType; //当前行为操作
					if (this.actType == common.actTypeEnum.Payment) { //支付
						this.isRefund = false;
						this.out_trade_no_old = prev_page_param.sale1_obj.BILL; //单号初始化（原单号）
						this.out_trade_no = this.out_trade_no_old; //子单号（首次进入赋值）
						this.PaymentInfos.PayList = prev_page_param?.PayList; //已支付的支付数据（某些业务下存在已支付的数据）
						this.PayDataHandle(); //处理上个页面传入的支付数据-> sale初始化，sale1:依赖传入，sale2:依赖 Product，sale3:依赖 PayList
					} else { //退款
						this.isRefund = true;
						this.out_refund_no = prev_page_param.sale1_obj.BILL; //退款单号初始化
						this.RefundDataHandle(); //处理上个页面传入的退单数据
					}
					this.Products = prev_page_param.sale2_arr.map(r => {
						return {
							PLID: r.PLID,
							SPID: r.SPID,
							UNIT: r.UNIT,
							BARCODE: r.BARCODE,
							NAME: r.NAME,
							PRICE: r.PRICE,
							OPRICE: r.OPRICE,
							NET: r.NET,
							QTY: parseInt(r.QTY)
						}
					});
					this.Discount = Number(prev_page_param.sale1_obj.BILLDISC).toFixed(2); //折扣信息
					this.PriceCount(); //给 sale2 加上 SKY_DISCOUNT 参数
					// this.GetSBData(); //筛选水吧产品 水吧商品由销售页面传入不需要再处理
					this.GetHyCoupons(); //获取会员的优惠券用以支付使用

					this.XSTYPE = this.SALES.sale1.XSTYPE;
					this.BILL_TYPE = this.SALES.sale1.BILL_TYPE;
					this.KHID = this.SALES.sale1.KHID; //重新赋值KHID
					this.GSID = this.SALES.sale1.GSID; //重新赋值GSID
					this.POSID = this.SALES.sale1.POSID; //重新赋值RYID
					this.RYID = this.SALES.sale1.RYID; //重新赋值RYID
					// this.PaymentInfos.PayedAmount = 0; //进行初始化后不再计算此值
					this.ZFBZK = getApp().globalData.PZCS["YN_ZFBKBQ"] == "Y" ? this.totalAmount : 0; //初始化一下支付宝折扣金额
				}
				this.dPayAmount = this.toBePaidPrice(); //初始化首次给待支付一个默认值
				console.log("门店编码和名称", this.NAME);
			},
			//总金额计算 舍弃分的处理
			PriceCount: function() {
				let total = 0;
				this.sale2_arr.forEach(product => {
					total += parseFloat(product.NET);
					// console.log("商品金额：" + product.NET)
				});
				total = parseFloat(total.toFixed(2));
				//舍弃分的处理
				this.SKY_DISCOUNT = parseFloat((total % 1).toFixed(2));
				console.log("总金额判断：", total);
				console.log("手工折扣额：", this.SKY_DISCOUNT);
				this.totalAmount = parseFloat((total - this.SKY_DISCOUNT).toFixed(2)); //舍弃分数位
				// this.totalAmount = 0.01; //舍弃分数位
				let curDis = 0;
				this.sale2_arr.forEach(function(item, index, arr) {
					let high = parseFloat((item.NET / total * that.SKY_DISCOUNT).toFixed(2));
					item.SKYDISCOUNT = high;
					curDis += high;
					if (index == arr.length - 1) {
						let dif = parseFloat((that.SKY_DISCOUNT - curDis).toFixed(2)); //实际的差值
						item.SKYDISCOUNT += dif;
					}
				});
				console.log("[PriceCount]处理分后的商品信息：", this.sale2_arr);
				// console.log("[PriceCount]SKYDISCOUNT值(由于属性被隐藏控制台打印不出来具体内容)：", this.sale2_arr.map(i => i.SKYDISCOUNT));
			},
			//欠款界面绑定数据更新
			refundAmountCount: function() {
				console.log("重新计算金额：", this.RefundList)
				let ta = 0,
					aa = 0,
					da = 0;
				this?.RefundList?.forEach(i => {
					ta += Number(i.amount);
					if (!i.fail) aa += Number(i.amount);
					if (i.fail) da += Number(i.amount);
				});
				this.refundView.totalAmount = (-ta).toFixed(2);
				this.refundView.actualAmount = (-aa).toFixed(2);
				this.refundView.debtAmount = (-da).toFixed(2);
			},
			//计算待支付(欠款)金额(总金额 - 折扣金额 - 已支付金额 - 上个页面已经完成的订单金额),判断:如果小于0时候，便只返回0
			toBePaidPrice: function() {
				let amount = (Number(this.totalAmount - this.Discount - this.yPayAmount - this.PaymentInfos
					.PayedAmount)).toFixed(2);
				let price = amount >= 0 ? amount : 0;
				return price;
			},
			//文本框dom刷新
			domForceRefresh: function() {
				this.domRefresh = new Date().toString();
			},
			//点击切换支付方式
			clickPayType: function(r, e) {
				this.is_poly = e.currentTarget.id === 'POLY'; //如果是 POLY 则是聚合，否则不是
				if (this.is_poly || r.yn_use == 'Y') { //配置了可使用的支付方式才可被选中
					this.currentPayType = e.currentTarget.id; //小程序
				}
				if (this.is_poly || r.yn_use == 'Y') { //配置了可使用的支付方式才可被选中
					this.currentPayType = e.currentTarget.id; //小程序
				}
			},
			//返回上个页面
			backPrevPage: function() {
				if (this.CanBack) {
					console.log("[BackPrevPage]待支付金额:", this.dPayAmount);
					if (Number(this.dPayAmount) === 0) {
						this.event.emit("FinishOrder", {
							code: true,
							msg: "支付完成!",
							data: {
								sale1_obj: this.sale1_obj,
								sale2_arr: this.sale2_arr,
								sale3_arr: this.sale3_arr,
								sale8_arr: this.sale8_arr
							}
						});
					} else {
						this.event.emit("FinishOrder", {
							code: false,
							msg: "支付取消!"
						});
					}
					uni.navigateBack()
				} else
					util.simpleMsg(`您还未完成${this.isRefund ? "退款":"支付"}`, true);
			},
			//展示会员卡券信息
			ShowCoupon: function() {
				if (that.coupon_list.length <= 0) {
					util.simpleMsg("暂无可用券", true);
				} else {
					this.currentPayType = "SZQ"
					let arr = that.coupon_list.filter(function(item, index, arr) {
						return parseFloat(item.limitmoney) <= that.debt; //筛选下可支付的券
					})
					that.coupon_list = arr;
					that.coupons = !that.coupons;
				}
			},
			//获取会员卡券	
			GetHyCoupons: function() {
				let hyinfo = this.hyinfo || util.getStorage("hyinfo");
				// console.log("会员信息：", JSON.stringify(hyinfo));
				if (hyinfo?.hyId) {
					_member.CouponList("获取中...", {
						brand: that.brand,
						data: {
							hyid: hyinfo.hyId,
							phone: hyinfo.Phone
						}
					}, (res) => {
						if (res.code) {
							that.coupon_list = res.data;
						}
					}, (err) => {
						console.log("异常数据：", res)
					})
				}
			},
			//点击券去使用
			CouponToUse: function(e) {
				//有券号
				if (e) {
					console.log("选择使用的卡券号：", e);
					that.currentPayType = 'SZQ';
					if (!this.YN_TotalPay) { //如果未支付完成
						that.coupons = !that.coupons; //关闭弹窗
						this.authCode = e; //券号赋值
						console.log("券号：", that.authCode)
						that.Pay();
					} else {
						util.simpleMsg("订单已完成支付");
					}
				}
			},
			//切换-退款和支付
			ActionSwtich: function() {
				console.log("是否是退款：", this.isRefund)
				if (this.isRefund)
					this.Refund();
				else
					this.Pay();
			},
			//单笔订单退款重试
			singleRetry: function(trade_no) {
				console.log("重试单号：", trade_no)
				let singleRefund = this.RefundList.find(i => i.bill === trade_no);
				if (singleRefund) {
					singleRefund.loading = true; //开启加载样式
					let refund_no = this.out_refund_no; //获取订单号
					let payWayType = this.PayWayList.find(i => i.fkid == singleRefund.fkid)?.type;
					if (payWayType) {
						_pay.RefundAll(payWayType, {
								out_trade_no: singleRefund.bill, //单号
								out_refund_no: refund_no, //退款单号
								refund_money: (Math.abs(Number(singleRefund.amount) * 100)).toFixed(
									0), //退款金额
								total_money: (Math.abs(Number(singleRefund.amount) * 100)).toFixed(
									0) //退款总金额（兼容微信）
							}, (function(err) { //如果发生异常（catch）
								// catch code...
							}).bind(this),
							(function(res) { //执行完毕（finally），退款次数 +1
								singleRefund.refund_num += 1; //发起请求默认加1
								this.RefundList = Object.assign([], this.RefundList) //刷新视图
							}).bind(this),
							(function(ress) { //执行完毕（results），根据结果判断
								if (!ress[1].code) { //如果第二个回调退款结果异常，那么把当前退款标记为失败，否则标记为成功
									if (this.limit >= singleRefund.refund_num)
										singleRefund.fail = true; //退款失败
									else {
										let info = this.PayWayInfo('NO');
										singleRefund.fail = false; //退款失败
										singleRefund.fkid = info.fkid;
										singleRefund.name = info.name;
									}
									singleRefund.msg = ress[1].msg; //错误提示信息记录
									util.simpleModal('退款失败', ress[1].msg);
								} else {
									singleRefund.fail = false;
								}
								singleRefund.loading = false; //关闭加载样式
								this.RefundList = this.RefundList;
							}).bind(this));
					} else
						util.simpleMsg("支付方式不存在!");
				}
				this.refundAmountCount(); //重新计算
			},
			//判断是否存在相同的付款类型
			existSamePayType: function(type) {
				if (type === 'HYK' || type === 'ZQ' || type === 'SZQ')
					return false;
				return this.PayList.indexOf(i => i.type == type) !== -1; //满足则是存在，否则不存在
			},
			//单笔订单重试
			singlePayRetry: function(fkid, trade_no) {
				let trade = this.PayList.find(i => i.bill === trade_no),
					type = this.PayWayList.find(i => i.fkid == fkid)?.type,
					data = this.PayDataAssemble();
				trade.loading = true;
				if (!this.existSamePayType(type))
					retrySinglePay({
						type: type,
						trade,
						trade_no,
						data
					}, (function(res) {
						let data = res.data;
						//由于失败支付这仨字段是没有正确的赋值的，不出意外应该都是 undefined,这里重试成功了之后得给这几个字段重新赋值
						trade.discount = data.discount ?? 0;
						trade.disc = data.zklx ?? "";
						trade.user_id = (data?.open_id || data?.hyid) ?? "";
						this.used_no.push(this.prev_no); //如果成功
						this.retryEnd(trade, false)
						this.yPayAmount += (data.money / 100);
						this.PayList = Object.assign([], this.PayList); //刷新视图
						util.simpleModal('[singlePayRetry]重试支付成功!', res);
					}).bind(this), (function(err) {
						this.retryEnd(trade);
						this.PayList = Object.assign([], this.PayList); //刷新视图
						util.simpleModal('[singlePayRetry]重试支付失败!', err.msg);
					}).bind(this));
				else
					util.simpleMsg("已存在相同的付款方式！", false);
			},
			retryEnd: function(trade, isFail = true) {
				trade.loading = false;
				trade.pay_num += 1; //支付次数加一
				trade.fail = isFail;
			},
			//会员信息重写
			UpdateHyInfo: function(e) {
				console.log("接口返回的会员信息：", e);
				try {
					if (e && e.hyid) { //支付接口有返回会员信息
						let hyinfo = util.getStorage("hyinfo");
						console.log("当前会员信息：", hyinfo);
						if (!hyinfo || JSON.stringify(hyinfo) == '{}' || !hyinfo.hyId) {
							util.setStorage("hyinfo", {
								hyId: e.hyid
							});
						}
						// if ((!hyinfo || !hyinfo.hyId) && getApp().globalData.hyinfo) { //如果没有会员信息就重新录入一下
						// 	getApp().globalData.hyinfo.hyId = e.hyid;
						// }
					}
					console.log("更新后的会员信息:", util.getStorage("hyinfo"));
				} catch (err) {
					console.log("HYID:", err);
				}

			},
			//获取水吧商品
			GetSBData: function(e) {
				let obj = util.getStorage("sysParam");
				let bmArr = [];
				if (obj && obj.SBLBBM) {
					console.log("水吧商品编码:", obj.SBLBBM);
					bmArr = obj.SBLBBM.split(',');
				}
				if (that.Products.length > 0) {
					that.sbsp_arr = that.Products.filter((r) => {
						return bmArr.indexOf(r.PLID) >= 0;
					})
				}
				console.log("本单水吧商品：", that.sbsp_arr);
			},
			//页面卸载事件
			onUnload: function(e) {
				console.log("页面卸载事件：");
				util.removeStorage("hyinfo"); //支付完成后清除下会员信息
			}
		},
		async created() {
			// console.log("打印一下支付宝参数：",getApp().globalData.PZCS);
			// console.log("打印一下支付宝参数：",getApp().globalData.PZCS["YN_ZFBKBQ"]);
			if (window && !window.vue) { //把vue放到全局上，方便调试
				window.vue = this;
			}
			this.paramInit();
			if (!app.globalData?.CodeRule || Object.keys(app.globalData?.CodeRule) === 0) await common
				.GetZFRULE(); //初始化支付规则（如果没有的话）
		},
		mounted() {}
	}
</script>

<style>
	.refund-more-box {
		display: flex;
	}

	.refund-reset {
		background-color: var(--green);
		color: white;
		border-radius: 5px;
		padding: 2px 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.refund-text {
		display: inline-flex;
		align-items: center;
	}

	.refund-icon {
		width: 15px;
		height: 15px;
		display: inline-block;
		background-size: cover;
		background-image: url('@/images/loading.png');
		filter: brightness(10);
		margin-left: 6px;
	}

	.refund-loading {
		animation: 1.5s rotate infinite linear;
	}
</style>
