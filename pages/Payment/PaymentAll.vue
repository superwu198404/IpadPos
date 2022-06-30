<style scopeed>
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
					<image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image>
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
				<view>
					<image src="../../images/shouyintai.png" mode="widthFix"></image> 收银台
				</view>
				<button v-if="!isRefund" @click="ShowCoupon()">+ 使用卡券</button>
			</view>
			<view class="amounts">
				<!-- <p>订单号：{{out_trade_no_old}}</p> -->
				<p><text>总金额</text><text>{{isRefund ? refundView.totalAmount : totalAmount}}</text></p>
				<p><text>折扣</text><text>{{Discount}}</text></p>
				<p><text>已收</text><text>{{isRefund ? refundView.actualAmount : Number(yPayAmount).toFixed(2)}}</text>
				</p>
				<p><text>欠款</text><text>{{isRefund ? refundView.debtAmount : debt}}</text></p>
				<p><text>还需支付</text><text class="pay-center"><span
							v-if="isRefund">{{ refundView.debtAmount }}</span><input v-if="!isRefund" type="number"
							:disabled="allowInput" value="" :key="domRefresh" v-model="dPayAmount" /></text></p>
			</view>
			<view class="paydetails">
				<view class="pay-sum">
					<view class="settleds">
						<view class="paymentlist">
							<h3 v-if="!isRefund">已结算</h3>
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
										<text>{{ dPayAmount }}￥</text>
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
												重试
												<div v-if="pay.loading" class="refund-icon refund-loading"></div>
											</div>
										</div>
									</view>
								</view>
							</view>
							<!-- 退款 -->
							<h3 v-if="isRefund">已退款</h3>
							<view class="sets-list refund" v-if="isRefund">
								<view class="paylists">
									<view class="Methods"
										v-for="(refund, index) in RefundList.filter(i => !i.fail && i.refund_num!=0 && !i.refunding && i.fkid!=='ZCV1')">
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
								@click="clickPayType($event)">
								<image class="p-bg" src="../../images/xzbj-da.png" mode="widthFix"></image>
								<p>聚合支付</p>
								<label class="poly-box">
									<view v-for="(item,index) in PayWayList.filter(i=>i.poly=='Y')">
										<image :src="require('../../images/' + item.type + '.png')" mode="widthFix">
										</image>
									</view>
								</label>
								<label class="poly-text">
									<text>支持</text>
									<text v-for="(item,index) in PayWayList.filter(i=>i.poly=='Y')">
										,{{item.name}}</text>
								</label>
							</view>
							<view v-for="(item,index) in PayWayList.filter(i=>i.poly=='N')" class="pattern nots curr"
								:class="currentPayType === 'COUPON'&&item.type==='SZQ'? 'selected':' '" id="COUPON"
								@click="clickPayType($event)">
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
				<view class="h4"><text>选择优惠券</text> <button class="colse" @click="coupons = false">×</button></view>
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
		<!-- 画布 -->
		<view class="canvasdiv">
			<canvas canvas-id="couponQrcode" class="canvas"
				:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;disabled:none;'"></canvas>
			<canvas canvas-id="canvasLogo" class="canvas"
				:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;disabled:none;'"></canvas>
		</view>
	</view>
	</view>
</template>

<script>
	var app = getApp();
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue';
	import hy from '@/api/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import _wx from '@/api/Pay/WxPay.js';
	import _ali from '@/api/Pay/AliPay.js';
	import _card from '@/api/Pay/ECardPay.js';
	import _coupon from '@/api/Pay/ECoupon.js';
	import _pay from '@/api/Pay/PaymentALL.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	//打印相关
	import esc from '@/utils/xprinter/esc.js';
	import encode from '@/utils/xprinter/encoding.js';
	import xprinter_util from '@/utils/xprinter/util.js';
	import qrCode from '@/utils/xprinter/weapp-qrcode.js';
	var that;
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				SALES: {
					sale1: {},
					sale2: [],
					sale3: []
				},
				coupons: false, //卡券弹窗
				coupon_list: [], //券集合
				navmall: false,
				channel: "POS",
				YN_TotalPay: false,
				allowInput: false,
				isRefund: true, //是否是退款模式
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
				query: null,
				BILL_TYPE: "",
				SKY_DISCOUNT: 0, //总手工折扣额（就是支付舍弃的分）
				XS_TYPE: "",
				handles: null,
				ZFBZK: getApp().globalData.PZCS["YN_ZFBKBQ"] == "Y" ? this.totalAmount : 0,
				refundView: {
					totalAmount: 0,
					actualAmount: 0,
					debtAmount: 0
				},
				sbsp_arr: [], //水吧产品初始集合
				sale8_obj: {}, //水吧产品对象
				sale8_arr: [], //水吧产品集合
				//打印相关
				looptime: 0,
				currentTime: 1,
				lastData: 0,
				oneTimeData: 0,
				buffSize: [],
				buffIndex: 0,
				//发送字节数下标
				printNum: [],
				printNumIndex: 0,
				printerNum: 1,
				currentPrint: 1,
				isReceiptSend: false,
				isQuery: false,
				imageSrc: "/static/xprinter/logo.jpg",
				jpgSrc: "/static/xprinter/logo.jpg",
				jpgWidth: 340,
				jpgHeight: 113,
				qrCodeWidth: 200, //二维码宽
				qrCodeHeight: 200, // 二维码高
				qrCodeContent: "https://www.jufanba.com/pinpai/88783/", //二维码地址
			}
		},
		watch: {
			dPayAmount: function(n, o) {
				if (this.isRefund) return; //如果为退款，直接退出
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
				if (Number(n) === 0 && n.length > 1 && n[0] === '-') {
					this.dPayAmount = 0;
					this.domForceRefresh();
				}
				if (Number(n) < 0) { //待支付金额必须为正数
					this.dPayAmount = o;
					uni.showToast({
						title: '待支付金额必须大于0!',
						icon: "error"
					});
					this.domForceRefresh();
				}
				console.log(`newValue:${n},amount:${amount}`);
				if (amount > 0) { //未完成支付，仍然存在欠款
					if (this.PayList.length === 0) this.CanBack = true; //未使金额发生变化则仍然可以退出
					else this.CanBack = false;
					//检测待支付金额是否超过了欠款，如果超过则自动修正为欠款金额数
					if (Number(n) > this.toBePaidPrice()) {
						this.dPayAmount = amount; //超过待支付金额后自动给与目前待支付金额的值
						uni.showToast({
							title: '金额输入错误!',
							icon: "error"
						});
						this.domForceRefresh();
					} else {
						let count = this.dPayAmount.toString().split('.')[1].length;
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
				this.currentPayInfo = this.PayWayList.find(i => i.type === this
					.PayTypeJudgment()); //每次支付后根据 authcode 判断支付方式并给 currentPayInfo
				console.log("当前支付类型信息：", this.currentPayInfo);
			},
			currentPayType: function(n, o) { //每次发生变化,切换页面dom选中
				if (n === "COUPON") { //如果用券，则不再允许编辑待付款金额
					this.dPayAmount = this.toBePaidPrice();
					this.domForceRefresh();
					this.allowInput = true;
				} else
					this.allowInput = false;
			},
			RefundList: function(n, o) {
				this.refundAmountCount(); //重新计算金额
				if (n && n.filter(i => i.fail).length == 0) {
					this.CanBack = true;
				}
			}
		},
		computed: {
			debt: function() {
				this.allAmount = this.toBePaidPrice();
				return this.allAmount;
			}
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			let that = this;
			var list = [];
			var numList = [];
			var j = 0;

			for (var i = 20; i < 200; i += 10) {
				list[j] = i;
				j++;
			}

			for (var i = 1; i < 10; i++) {
				numList[i - 1] = i;
			}

			that.setData({
				buffSize: list,
				oneTimeData: list[0],
				printNum: numList,
				printerNum: numList[0]
			});
			that.initPhoto();
		},
		methods: {
			//页面首次加载事件
			onLoad(options) {
				that = this;
				this.GetHyCoupons();
				//生成二维码
				setTimeout(() => {
					this.couponQrCode()
				}, 50);
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
			//创建订单数据
			CreateDBData: function(func) {
				let saledate = dateformat.getYMD();
				let saletime = dateformat.getYMDS();
				let sale1 = this.SALES.sale1,
					sale2 = this.SALES.sale2,
					sale3 = this.SALES.sale3;
				console.log("sale1 封装中...");
				let hyinfo = getApp().globalData.hyinfo;
				console.log("创建订单前的会员信息:", hyinfo);
				//基础数据
				this.sale1_obj = {
					BILL: this.isRefund ? this.out_refund_no : this.out_trade_no_old,
					SALEDATE: saledate,
					SALETIME: saletime,
					KHID: this.KHID,
					POSID: this.POSID,
					RYID: this.RYID,
					BILL_TYPE: this.BILL_TYPE, //销售类型
					XSTYPE: this.XS_TYPE, //销售类型
					XS_BILL: sale1?.BILL ?? "", //退款时记录原单号（重点）
					XS_POSID: sale1?.POSID ?? "", //退款时记录原posid（重点）
					XS_DATE: sale1?.SALEDATE ?? "", //退款时记录原销售日期（重点）
					XS_KHID: sale1?.KHID ?? "", //退款时记录原khid（重点）
					XS_GSID: sale1?.GSID ?? "", //退款时记录原GSID（重点）
					TLINE: sale2.length,
					TNET: (this.isRefund ? -1 : 1) * this.totalAmount, //总金额（重点）
					DNET: 0,
					ZNET: (this.isRefund ? -1 : 1) * this.totalAmount,
					BILLDISC: this.isRefund ? -sale1?.BILLDISC : (Number(this.Discount) + Number(this
						.SKY_DISCOUNT)).toFixed(2), //整单折扣需要加上手工折扣,
					ROUND: Number(this.SKY_DISCOUNT).toFixed(2), //取整差值（手工折扣总额）,
					CHANGENET: 0,
					CXTNET: 0,
					TCXDISC: 0,
					CUID: hyinfo.hyId, //会员号
					CARDID: "", //卡号
					THYDISC: 0,
					TDISC: Number(this.SKY_DISCOUNT).toFixed(2),
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
					CLTIME: saletime
				};
				console.log("sale1 封装完毕!");
				this.sale2_arr = [];
				console.log("sale2 封装中...");
				for (var i = 0; i < this.Products.length; i++) {
					this.sale2_obj = {
						BILL: this.isRefund ? this.out_refund_no : this.out_trade_no_old, //主单号
						SALEDATE: saledate,
						SALETIME: saletime,
						KHID: this.KHID,
						POSID: this.POSID,
						SPID: this.Products[i].SPID, //交易商品id
						NO: i,
						PLID: this.Products[i].PLID,
						BARCODE: this.Products[i].BARCODE,
						UNIT: this.Products[i].UNIT,
						QTY: (this.isRefund ? -1 : 1) * this.Products[i].QTY,
						PRICE: (this.Products[i].PRICE - this.Products[i].SKYDISCOUNT).toFixed(2),
						OPRICE: this.Products[i].OPRICE,
						NET: this.isRefund ? (-1 * this.Products[i].PRICE).toFixed(2) : (this.Products[i].PRICE *
							this.Products[i].QTY - this.Products[i].SKYDISCOUNT).toFixed(2),
						DISCRATE: this.isRefund ? -this.Products[i].DISCRATE : this.Products[i]
							.SKYDISCOUNT, //当前商品的折扣额 后续可能有促销折扣
						YN_SKYDISC: this.isRefund ? this.Products[i].YN_SKYDISC : this.Products[i].SKYDISCOUNT >
							0 ? "Y" : "N", //是否有手工折扣
						DISC: this.isRefund ? -this.Products[i].DISC : this.Products[i].SKYDISCOUNT, //手工折扣额
						YN_CXDISC: 'N',
						CXDISC: 0,
						// YAER: new Date().getFullYear(),
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
				console.log("sale2 封装完毕!");
				this.sale3_arr = [];
				console.log("sale3 封装中...");
				console.log("筛选掉弃用金额：", this.RefundList.filter(i => !i.fail && i.fkid != 'ZCV1'))
				var list = this.isRefund ? this.RefundList.filter(i => !i.fail && i.fkid != 'ZCV1') : this
					.PayList.filter(i => !i.fail); //如果是退款，那么就是退款信息，否则是支付信息
				list.forEach((item) => {
					console.log("Item:", item)
					this.sale3_obj = {
						BILL: this.isRefund ? this.out_refund_no : this
							.out_trade_no_old, //主单号，注：订单号为 BILL+ _ + NO,类似于 10010_1
						SALEDATE: saledate,
						SALETIME: saletime,
						KHID: this.KHID,
						POSID: this.POSID,
						NO: item.no, //付款序号
						FKID: ((function() {
							if (this.isRefund)
								return item.fkid;
							else
								switch (item.is_free) {
									case 'Y':
										return 'ZZ01';
									case 'N':
										return 'ZF09';
									default:
										return item.fkid;
								}
						}).bind(this))(), //付款类型id
						AMT: (this.isRefund ? -1 : 1) * item.amount, //付款金额(退款记录为负额)
						ID: item.card_no, //卡号或者券号
						RYID: this.RYID, //人员
						GCID: this.GCID, //工厂
						DPID: this.DPID, //店铺
						KCDID: this.KCDID, //库存点
						BMID: this.BMID, //部门id
						DISC: item.disc, //折扣金额
						FAMT: item.disc, //折扣金额(卡券消费后要记录)
						RATE: item.disc, //折扣金额(卡消费后要记录)
						ZKLX: (function() {
							switch (item.is_free) {
								case 'Y':
									return 'ZV01';
								case 'N':
									return 'ZV09';
								default:
									return item.zklx;
							}
						})(), //折扣类型
						IDTYPE: item.id_type //卡类型
					};
					this.sale3_arr = this.sale3_arr.concat(this.sale3_obj);
				})
				console.log("sale3 封装完毕!");
				for (var i = 0; i < this.sbsp_arr.length; i++) {
					this.sale8_obj = {
						SALEDATE: saledate,
						SALETIME: saletime,
						GCID: this.GCID,
						KHID: this.KHID,
						POSID: this.POSID,
						BILL: this.isRefund ? this.out_refund_no : this.out_trade_no_old,
						SPID: this.sbsp_arr[i].SPID,
						NO: i,
						ATTCODE: "1",
						ATTNAME: "糖",
						OPTCODE: "1",
						CSTCODE: "1",
						OPTMAT: "123456",
						QTY: this.sbsp_arr[i].QTY,
						PRICE: this.sbsp_arr[i].PRICE
					}
					this.sale8_arr = this.sale8_arr.concat(this.sale8_obj);
				}

				//生成执行sql
				let sql1 = common.CreateSQL(this.sale1_obj, 'SALE001');
				let sql2 = common.CreateSQL(this.sale2_arr, 'SALE002');
				let sql3 = common.CreateSQL(this.sale3_arr, 'SALE003');
				let sql8 = common.CreateSQL(this.sale8_arr, 'SALE008');
				// console.log("SALE1-OBJ:", this.sale1_obj);
				// console.log("SALE2-ARR:", this.sale2_arr);
				console.log("SALE8-ARR:", this.sale8_arr);
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
				// console.log("SALE1-OBJ-SQL:", sql1.sqlliteArr);
				// console.log("SALE2-ARR-SQL:", sql2.sqlliteArr);
				// console.log("SALE3-ARR-SQL:", sql3.sqlliteArr);
				let exeSql = sql1.sqlliteArr.concat(sql2.sqlliteArr).concat(sql3.sqlliteArr).concat(sql8.sqlliteArr)
					.concat(sql4.sqlliteArr);
				console.log("sqlite待执行sql:", exeSql)
				//return;
				db.get().executeDml(exeSql, "订单创建中", function(res) {
					if (func) func(res);
					console.log("订单创建成功：", res);
					uni.showToast({
						title: "销售单创建成功"
					})
				}, function(err) {
					console.log("订单创建失败：", err);
					uni.showToast({
						title: "销售单创建失败",
						icon: "error"
					})
				});
			},
			// 执行表单插入本地数据库操作
			SaleExcuted: function(sqlArr) {
				db.get().executeDml(sqlArr, null, function(res) {
					uni.showToast({
						title: "销售单创建成功"
					})
				}, function(err) {
					uni.showToast({
						title: "销售单创建失败",
						icon: "error"
					})
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
				//适配真机
				let that = this;
				if (!this.currentPayType) {
					uni.showToast({
						title: "未选择支付方式，请选择后再进行支付!",
						icon: "error"
					});
					return;
				}
				console.log("this.toBePaidPrice():", this.toBePaidPrice())
				if ((!this.dPayAmount || Number(this.dPayAmount) === 0) && this.toBePaidPrice() != 0) {
					uni.showToast({
						title: "金额不能为空!",
						icon: "error"
					});
					this.dPayAmount = this.toBePaidPrice();
					return;
				}
				if (!this.YN_TotalPay) { //如果未支付完成
					console.log("判断券号是否为空：", )
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
			//退款数据处理
			RefundDataHandle: function() { //把上个页面传入的退款数据进行处理后进行展示
				console.log("SALE1 初始化开始：", this.sale1_obj);
				this.SALE1Init(this.sale1_obj); //sale1 初始化
				console.log("SALE2 初始化开始：", this.sale2_arr);
				this.SALE2Init(this.sale2_arr);
				console.log("SALE3 初始化开始：", this.sale3_arr);
				this.SALE3Init(this.sale3_arr);
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
						return {
							PLID: i.PLID,
							SPID: i.SPID,
							UNIT: i.UNIT,
							BARCODE: i.BARCODE,
							NAME: i.NAME,
							PRICE: i.PRICE,
							OPRICE: i.OPRICE,
							AMOUNT: i.NET,
							QTY: i.QTY,
							DISCRATE: i.DISCRATE, //退款使用
							YN_SKYDISC: i.YN_SKYDISC,//退款使用
							DISC: i.DISC //退款使用
						}
					}).bind(this));
					console.log("商品信息循环后：", this.Products);
					this.refundAmountCount(); //退款金额计算
				}
				console.log("SALE2 初始化完毕！", this.Products)
			},
			//SALE003 初始化、处理
			SALE3Init: function() {
				if (this.isRefund) {
					let group = ["ZZ01", "ZF09", "ZCV1"];
					let list = this.SALES.sale3?.map((function(i) { //将sale3的数据转为页面适用的格式
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
							msg: "" //操作提示信息（可以显示失败的或者成功的）
						}
					}).bind(this));
					console.log("SALE3-处理前：", list);
					let coupons = list.filter(i => group.indexOf(i.fkid) !== -1),
						count = 0,
						unback = undefined; //筛选出 赠券、有偿券、弃用金额 类的订单数据
					console.log("SALE3-券类：", coupons);
					if (coupons.length > 0) { //如果存在券数据则进行合并，否则不管
						coupons.map(i => count += Number(i.amount)); //计算获取这笔订单中所有券的实际支付金额
						unback = { //不可回退金额对象（复数券的 面额 - 放弃金额）
							fkid: "ZG11",
							bill: ``, //券不参与退款请求，所以不需要订单号
							name: this.PayWayList.find(p => p.fkid == "ZG11")?.name ?? "", //获取不可回退金额 name
							amount: Number(count).toFixed(2),
							no: 0,
							fail: true, //def初始和退款失败的皆为true
							refund_num: 0, //退款（尝试）次数
							refunding: false, //是否在正在退款中
							loading: false,
							msg: "" //操作提示信息（可以显示失败的或者成功的）
						};
					}
					this.RefundList = list.filter(i => group.indexOf(i.fkid) === -1).concat(unback ? [unback] :
				[]);; //筛选出 非 赠券、有偿券、弃用金额 类的订单数据，然后重新追加上面处理完毕的 不可回退金额 对象
				}
				console.log("SALE3 初始化完毕！", this.RefundList)
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
					uni.showToast({
						title: "已完成退款!"
					});
					return;
				}
				console.log("RefundList-Before:", this.RefundList);
				//遍历 RefundList 发起退单请求
				this.RefundList.filter(i => i.fail).forEach((function(refundInfo, index) {
					let payWayType = this.PayWayList.find(i => i.fkid == refundInfo.fkid)?.type;
					if (refundInfo.fkid === "ZG11") { //如果为不可回退金额
						refundInfo.fail = false;
						refundInfo.refund_num += 1;
						promises.push(new Promise(function(resolve, reject) { //避免空数组检测不到
							resolve(true);
						}));
					} else {
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
										0) //退款总金额（兼容微信）
								}, (function(err) { //如果发生异常（catch）
									// catch code...
								}).bind(that),
								(function(res) { //执行完毕（finally），退款次数 +1
									refundInfo.refund_num += 1; //发起请求默认加1
									refundInfo.refunding = false; //标记为已经结束退款操作
									this.RefundList = Object.assign([], this.RefundList) //刷新视图
								}).bind(that),
								(function(ress) { //执行完毕（results），根据结果判断
									if (!ress[1].code) { //如果第二个回调退款结果异常，那么把当前退款标记为失败，否则标记为成功
										refundInfo.fail = true;
										refundInfo.msg = ress[1].msg; //错误提示信息记录
									} else
										refundInfo.fail = false;
								}).bind(that));
							promises.push(res)
						} else {
							uni.showToast({
								title: "支付方式不存在!",
								icon: "error"
							});
						}
					}
				}).bind(this));
				console.log("RefundList-After:", this.RefundList);
				this.refundAmountCount(); //重新计算
				Promise.all(promises).then((res) => {
					if (res.length > 0) //用来过滤掉无退款而进行创建的问题（保险代码）
						that.createOrders();
				})
			},
			createOrders: function(is_success) {
				if (this.RefundList.filter(i => i.fail).length === 0 || is_success)
					this.CreateDBData((res) => {
						//销售单单创建成功后 上传一下数据
						let bill = that.XS_TYPE == '2' ? that.out_refund_no : that.out_trade_no_old;
						common.TransLiteData(bill);
						//上传积分
						if (that.isRefund)
							that.scoreReduce();
						else
							that.scoreConsume();
						//调用打印
						// if (that.isRefund)
						setTimeout(function() {
							console.log("that.Products", that.Products);
							console.log("that.PayWayList", that.PayWayList);
							console.log("that.sale3_arr", that.sale3_arr);
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
							that.receiptPrinter(that.sale1_obj, arr2, arr3);
						}, 3000);
					});
			},
			//支付类型判断
			PayTypeJudgment: function() {
				let curPayType = "";
				let startCode = this.authCode.substring(0, 2);
				if (startCode) {
					let CodeRule = getApp().globalData.CodeRule;
					if (this.currentPayType === "COUPON") //券
					{
						startCode = "coupon";
					}
					//取出当前是何种类型的支付方式
					curPayType = CodeRule[startCode]; //WX_CLZF,ZFB_CLZF,SZQ,HYK....
				}
				return curPayType;
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
					merchant_no: this.MerId,
					channel: this.channel,
					discountable_amount: (Number(this.ZFBZK) * 100).toFixed(0), //支付宝折扣金额（只有支付宝才有噢）
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
				let payAfter = this.PayDataAssemble(),
					type = this.PayTypeJudgment(),
					info = this.PayWayList.find(i => i.type === type);
				console.log(`支付单号：${this.out_trade_no},支付参数：${JSON.stringify(payAfter)},支付类型：${JSON.stringify(info)}`);
				let XZZF = util.getStorage("XZZF");
				let pt = this.PayTypeJudgment();
				console.log("限制支付集合数据：", XZZF);
				console.log("当前支付集合：", this.PayList);
				console.log("当前支付类型：", pt);
				if (XZZF.length > 0 && this.PayList.length > 0 && XZZF.indexOf(pt) >= 0) { //如果被限制了 则进行判断是否有过支付
					let obj = this.PayList.find((r) => {
						return r.type == pt;
					})
					if (obj) {
						uni.showToast({
							title: "请更换支付方式!",
							icon: "error"
						});
						this.authCode = '';
						return;
					}
				}
				//this.authCode = ""; //避免 authCode 重复使用
				_pay.PaymentAll(this.PayTypeJudgment(), payAfter, (function(result) {
					console.log("支付结果：", result);
					uni.showToast({
						title: "支付成功!"
					});
					this.PaidList = payAfter.product_info.map(i => {
						i.price /= 100;
						return i;
					}); //把支付信息贴出来
					this.UpdateHyInfo(result.data); //更新会员信息
					this.authCode = ""; //避免同一个付款码多次使用
					this.orderGenarator(payAfter, result.data, false); //支付记录处理(成功)
					if (this.debt > 0) {
						this.CanBack = false;
					}
				}).bind(this), (function(error) {
					console.log("支付失败！")
					uni.showToast({
						title: "支付失败!原因：" + error.msg
					});
					// this.orderGenarator(payAfter, error, true); //支付记录处理(失败)
					this.authCode = ""; //避免同一个付款码多次使用
				}).bind(this))
			},
			//创建支付记录
			orderGenarator: function(payload, result, fail) {
				console.log("生成订单类型[orderGenarator]：", this.currentPayType);
				let excessInfo = this.PayWayList.find(item => item.type == "EXCESS"); //放弃金额
				this.yPayAmount += fail ? 0 : (payload.money / 100); //把支付成功部分金额加上
				if (result.vouchers.length > 0) { //如果是券支付，且返回的卡券数组列表为非空
					result.vouchers.forEach((function(coupon, index) {
						this.PayList.push(this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
							amount:((coupon.yn_card ==='Y'? coupon.pay_amount : (coupon.type === 'EXCESS' ? -coupon.pay_amount : coupon.denomination))/100).toFixed(2),
							fkid: coupon.type === 'EXCESS' ? excessInfo.fkid : this.currentPayInfo?.fkid,
							name: coupon.type === 'EXCESS' ? excessInfo.name : this.currentPayInfo?.name,
							disc: (coupon?.discount / 100).toFixed(2),
							fail,
							id_type: coupon?.type,
							is_free: coupon?.yn_zq,
							card_no: coupon?.no
						}, result));
					}).bind(this));
				} else //如果是聚合支付
				{
					this.PayList.push(this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
						amount: (payload.money / 100).toFixed(2),
						fail
					}, result));
				}
				this.PayList = Object.assign([], this.PayList);
			},
			//订单对象创建
			orderCreated: function(obj, payload) {
				let order = Object.assign({ //每支付成功一笔，则往此数组内存入一笔记录
					fkid: this.currentPayInfo?.fkid ?? "",
					type: this.currentPayInfo?.type ?? "",
					bill: payload?.out_trade_no,
					name: this.currentPayInfo?.name ?? "",
					amount: 0,
					no: this.PayList.length,
					disc: (payload?.discount / 100).toFixed(2),
					zklx: payload?.disc_type ?? "",
					id_type: "",
					user_id: payload?.open_id || payload?.hyid,
					is_free: "",
					card_no: "",
					//业务配置字段 ↓
					fail: true, //def初始和退款失败的皆为true
					pay_num: 0, //退款（尝试）次数
					paying: false, //是否在正在退款中
					loading: false,
					msg: "" //操作提示信息（可以显示失败的或者成功的）
				}, obj);
				console.log("封装响应体[orderCreated]:", order)
				return order;
			},
			//积分操作 支付调用
			scoreConsume: function() {
				console.log("正在准备上传积分，会员信息：", getApp().globalData.hyinfo);
				let that = this
				let hyinfo = getApp().globalData.hyinfo;
				if (hyinfo && hyinfo.hyId) { //录入过会员信息
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
							channel: that.channel,
							cityCode: "",
							code: that.out_trade_no_old,
							date: dateformat.getYMDS(),
							deducePoint: 0,
							districtCode: "",
							entryList: arr,
							memberCode: hyinfo.hyId,
							netAmount: that.totalAmount,
							orderAmount: that.totalAmount,
							orderType: '1', //订单类型
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
							hyid: hyinfo.hyId,
							sign: ""
						}
					}
					console.log("积分上传参数：", param);
					hy.consumeJF(that.brand, param, function(res) {
						console.log("积分上传结果：", res);
						uni.showToast({
							title: res.code ? "积分上传成功" : res.msg,
							icon: res.code ? "success" : "error"
						})
					})
				}
			},
			//积分操作 退款调用
			scoreReduce: function() {
				console.log("正在准备上传积分，会员信息：", getApp().globalData.hyinfo);
				let that = this
				let hyinfo = getApp().globalData.hyinfo;
				if (hyinfo && hyinfo.hyId) { //录入过会员信息
					let param;
					if (that.brand == 'KG') {
						param = {
							LT_IMPORT: [{
								ZZITEM: "1",
								ZZMEMBER_ID: hyinfo.hyId,
								ZZYZ_ID: "",
								ZZORDER_NUM: that.out_refund_no,
								ZZORDER_TYPE: "2",
								ZZLORDER: that.sale1_obj?.XS_BILL,
								ZZTPRICE: that.totalAmount,
								ZZPAYMENT: that.totalAmount,
								ZZPOINT_ADD: "0",
								ZZPOINT_PAY: that.totalAmount,
								ZZCHANNEL: that.channel,
								ZZSTORE: that.KHID,
								ZZORDER_DATE: dateformat.getYMD().replace(/\-/g, ''),
								ZZCPTIME: dateformat.gettimes(),
								ZYL01: "",
								ZYL02: "",
								ZYL03: "",
								ZYL04: "",
								ZYL05: ""
							}],
							LT_ITEM: [],
							code: that.out_refund_no
						}
					} else {}
					console.log("积分上传参数：", param);
					hy.minusHyJf(param, function(res) {
						console.log("积分上传结果：", res);
						uni.showToast({
							title: res.code ? "积分上传成功" : res.msg,
							icon: res.code ? "success" : "error"
						})
					})
				}
			},
			//初始化
			paramInit: function() {
				this.query = uni.createSelectorQuery().in(this); //获取元素选择器
				var prev_page_param = this.$store.state.location;
				if (prev_page_param) {
					this.Products = prev_page_param.Products;
					this.Discount = Number(prev_page_param.Discount).toFixed(2); //折扣信息
					this.PayWayList = prev_page_param.PayWayList; //此行注释是由于无法初始化支付途径，为了方便测试所以采用写死数据 
					console.log("PayWayList:", this.PayWayList)
					this.hyinfo = prev_page_param.hyinfo;
					this.out_trade_no_old = prev_page_param.out_trade_no_old; //单号初始化（源代号）
					this.out_refund_no = prev_page_param.out_refund_no; //退款单号初始化
					this.$store.commit("set-trade", this.out_trade_no_old); //保存当前单号至全局
					this.out_trade_no = this.out_trade_no_old; //子单号
					this.isRefund = prev_page_param.XS_TYPE == "2"; //如果等于 2，则表示退款，否则是支付
					this.SALES.sale1 = prev_page_param?.sale1_obj; //sale1数据
					this.SALES.sale2 = prev_page_param?.sale2_arr; //sale2数据
					this.SALES.sale3 = prev_page_param?.sale3_arr; //sale3数据
					this.XS_TYPE = prev_page_param.XS_TYPE;
					this.BILL_TYPE = prev_page_param.BILL_TYPE;
					this.RefundDataHandle();
					//this.authCode = prev_page_param.authCode;
					this.GetSBData(); //筛选水吧产品
				}
			},
			//总金额计算
			priceCount: function() {
				let total = 0;
				this.Products.forEach(product => total += product.AMOUNT);
				// console.log("商品总金额：", this.SKY_DISCOUNT);
				//舍弃分的处理
				this.SKY_DISCOUNT = parseFloat((total % 1).toFixed(2));
				console.log("手工折扣额：", this.SKY_DISCOUNT);
				this.totalAmount = parseFloat((total - this.SKY_DISCOUNT).toFixed(2)); //舍弃分数位
				let curDis = 0;
				this.Products.forEach(function(item, index, arr) {
					let high = parseFloat((item.AMOUNT / total * that.SKY_DISCOUNT).toFixed(2));
					item.SKYDISCOUNT = high;
					curDis += high;
					// console.log("几个值：", [high, curDis, index, arr.length, that.SKY_DISCOUNT]);
					if (index == arr.length - 1) {
						let dif = parseFloat((that.SKY_DISCOUNT - curDis).toFixed(2)); //实际的差值
						item.SKYDISCOUNT += dif;
					}
				});
				console.log("处理分后的商品信息：", this.Products);
			},
			//欠款界面绑定数据更新
			refundAmountCount: function() {
				console.log("重新计算金额：", this.RefundList)
				let ta = 0,
					aa = 0,
					da = 0;
				this.RefundList.forEach(i => {
					ta += Number(i.amount);
					if (!i.fail) aa += Number(i.amount);
					if (i.fail) da += Number(i.amount);
				});
				this.refundView.totalAmount = (-ta).toFixed(2);
				this.refundView.actualAmount = (-aa).toFixed(2);
				this.refundView.debtAmount = (-da).toFixed(2);
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
			//点击切换支付方式
			clickPayType: function(e) {
				this.currentPayType = e.currentTarget.id; //小程序
			},
			//返回上个页面
			backPrevPage: function() {
				if (this.CanBack) uni.navigateBack();
				else uni.showToast({
					title: `您还未完成${this.isRefund ? "退款":"支付"}操作！`,
					icon: "error"
				})
			},
			//展示会员卡券信息
			ShowCoupon: function() {
				if (that.coupon_list.length <= 0) {
					uni.showToast({
						title: "暂无可用券",
						icon: "error"
					})
				} else {
					console.log("待付款：", that.debt);
					console.log("券集合：", JSON.stringify(that.coupon_list));
					let arr = that.coupon_list.filter(function(item, index, arr) {
						return parseFloat(item.limitmoney) <= that.debt; //筛选下可支付的券
					})
					that.coupon_list = arr;
					that.coupons = !that.coupons;
				}
			},
			//获取会员卡券	
			GetHyCoupons: function() {
				let hyinfo = getApp().globalData.hyinfo;
				if (hyinfo.hyId) {
					console.log("会员信息：", JSON.stringify(hyinfo));
					hy.CouponList_ALL(hyinfo.hyId, function(res) {
						if (res.code) {
							that.coupon_list = res.data;
						}
					});
				}
			},
			//点击券去使用
			CouponToUse: function(e) {
				//有券号
				if (e) {
					console.log("选择使用的卡券号：", e);
					that.currentPayType = 'COUPON';
					if (!this.YN_TotalPay) { //如果未支付完成
						that.coupons = !that.coupons; //关闭弹窗
						this.authCode = e; //券号赋值
						console.log("券号：", that.authCode)
						that.Pay();
					} else {
						uni.showToast({
							title: "订单已支付完成!"
						});
					}
				}
			},
			//处理操作映射
			handleMapper: function() {
				this.handles = {
					ALI: _ali.AliPayment(),
					WX: _wx.WxPayment(),
					COUPON: _coupon.CouponPayment(),
					CARD: _card.CardPayment()
				}
			},
			//切换-退款和支付
			ActionSwtich: function() {
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
					let refund_no = this.out_refund_no, //获取订单号
						that = this; //转存this指向
					let payWayType = this.PayWayList.find(i => i.fkid == singleRefund.fkid)?.type;
					if (payWayType == "SZQ") { //如果为券，直接默认成功
						singleRefund.fail = false;
						singleRefund.refund_num += 1;
						return;
					}
					// let handle = that.handles[payWayName];
					// if (handle) {
					if (payWayType) {
						_pay.RefundAll(payWayType, {
								out_trade_no: singleRefund.bill, //单号
								out_refund_no: refund_no, //退款单号
								refund_money: (Math.abs(Number(singleRefund.amount) * 100)).toFixed(0), //退款金额
								total_money: (Math.abs(Number(singleRefund.amount) * 100)).toFixed(0) //退款总金额（兼容微信）
							}, (function(err) { //如果发生异常（catch）
								// catch code...
							}).bind(that),
							(function(res) { //执行完毕（finally），退款次数 +1
								singleRefund.refund_num += 1; //发起请求默认加1
								this.RefundList = Object.assign([], this.RefundList) //刷新视图
							}).bind(that),
							(function(ress) { //执行完毕（results），根据结果判断
								if (!ress[1].code) { //如果第二个回调退款结果异常，那么把当前退款标记为失败，否则标记为成功
									singleRefund.fail = true; //退款失败
									singleRefund.msg = ress[1].msg; //错误提示信息记录
									uni.showModal({
										title: '退款失败',
										content: ress[1].msg
									});
								} else {
									singleRefund.fail = false;
									// this.Sale3PackageSaveForSqlite([singleRefund]); //追加重试成功的订单信息
									this.createOrders();
								}
								singleRefund.loading = false; //关闭加载样式
							}).bind(that));
					} else
						console.log("当前支付方式：", payWayType);
					uni.showToast({
						title: "支付方式不存在!",
						icon: "error"
					});
				}
				this.refundAmountCount(); //重新计算
			},
			//单笔订单重试
			singlePayRetry: function(fkid, trade_no) {
				let trade = this.PayList.find(i => i.bill === trade_no),
					type = this.PayWayList.find(i => i.fkid == fkid)?.type;
				trade.loading = true;
				_pay.QueryPayment(type, {
					out_trade_no: trade_no
				}, (function(res) {
					trade.loading = false;
					trade.pay_num += 1; //支付次数加一
					trade.fail = false;
					this.dPayAmount -= trade.amount;
					this.PayList = Object.assign([], this.PayList); //刷新视图
				}).bind(this), (function(err) {
					trade.loading = false;
					trade.pay_num += 1; //支付次数加一
					this.PayList = Object.assign([], this.PayList); //刷新视图
					uni.showModal({
						title: '支付失败',
						content: "未查询到订单！"
					});
				}).bind(this));
			},
			//会员信息重写
			UpdateHyInfo: function(e) {
				console.log("接口返回的会员信息：", e);
				if (e && e.hyid) { //支付接口有返回会员信息
					let hyinfo = getApp().globalData.hyinfo;
					console.log("当前会员信息：", hyinfo);
					if (!hyinfo || !hyinfo.hyId) { //如果没有会员信息就重新录入一下
						getApp().globalData.hyinfo.hyId = e.hyid;
					}
				}
				console.log("更新后的会员信息:", getApp().globalData.hyinfo);
			},
			//获取水吧商品
			GetSBData: function(e) {
				let arr = util.getStorage("POSCS");
				let obj = arr.find((r) => {
					return r.POSCS == 'SBLBBM';
				})
				let bmArr = [];
				if (obj) {
					bmArr = obj.POSCSNR.split(',');
				}
				if (that.Products.length > 0) {
					that.sbsp_arr = that.Products.filter((r) => {
						return bmArr.indexOf(r.PLID) >= 0;
					})
				}
				console.log("本单水吧商品：", that.sbsp_arr);
			},
			// 二维码生成工具
			couponQrCode() {
				let bill = this.XS_TYPE == '2' ? this.out_refund_no : this.out_trade_no_old;
				console.log("二维码生成内容", this.qrCodeContent + bill)
				new qrCode('couponQrcode', {
					text: this.qrCodeContent,
					width: this.qrCodeWidth,
					height: this.qrCodeHeight,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.H
				})
			},
			//初始化画布数据
			initPhoto: function() {},
			//打印小票
			receiptPrinter: function(sale1_obj, sale2_arr, sale3_arr) {
				//输出日志
				console.log("打印接收数据 sale1_obj", sale1_obj);
				console.log("打印接收数据 sale2_arr", sale2_arr);
				console.log("打印接收数据 sale3_arr", sale3_arr);
				
				//票据
				var that = this;
				//打印数据转换
				var printerInfo = xprinter_util.printerData(sale1_obj, sale2_arr, sale3_arr);
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init();
				//打印格式
				command.formString(printerInfo);

				// 打印二维码
				uni.canvasGetImageData({
					canvasId: "couponQrcode",
					x: 0,
					y: 0,
					width: that.qrCodeWidth,
					height: that.qrCodeHeight,
					success: function(res) {
						console.log("获取画布数据成功");
						command.setSelectJustification(1); //居中
						command.setBitmap(res);
						command.setPrint();

						//that.addData(bill,xsDate,command.getData());
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						uni.showToast({
							title: "获取画布数据失败",
							icon: "none"
						});
						//that.addData(bill,xsDate,command.getData());
						that.prepareSend(command.getData()); //发送数据
					}
				});

				//that.prepareSend(command.getData()); //发送数据
				console.log("打印格式记录", command.getData());
			},
			//重新打印
			againPrinter: function(xsBill) {
				console.log("进入到打印了", xsBill)
				var that = this;
				//xsBill = "2214055034000983";
				let sql = "select * from POS_XSBILLPRINT where XSBILL='" + xsBill + "' order by XSDATE desc";
				db.get().executeQry(sql, "数据查询中", function(res) {
					let billStr = res.msg[0].BILLSTR;
					console.log("重打数据:", res.msg[0].BILLSTR);
					//初始化打印机
					var command = esc.jpPrinter.createNew();
					command.addCotent(billStr);
					console.log("重新打印格式记录", command.getData());
					that.prepareSend(command.getData()); //准备发送数据
				}, function(err) {
					console.log("获取重新打印数据出错:", err);
					uni.showToast({
						icon: 'error',
						title: "获取重新打印数据出错"
					})
				});
			},
			printerJPG: function() {
				var that = this;
				var canvasWidth = that.jpgWidth;
				var canvasHeight = that.jpgHeight;
				var command = esc.jpPrinter.createNew();
				command.init(); //初始化打印机

				uni.canvasGetImageData({
					canvasId: "canvasLogo",
					x: 0,
					y: 0,
					width: canvasWidth,
					height: canvasHeight,
					success: function(res) {
						console.log("获取画布数据成功");
						command.setSelectJustification(1); //居中
						command.setBitmap(res);
						command.setPrint();
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						uni.showToast({
							title: "获取画布数据失败",
							icon: "none"
						});
					}
				});
			},
			//准备发送，根据每次发送字节数来处理分包数量
			prepareSend: function(buff) {
				console.log("prepareSend 开始")
				var that = this;
				var time = that.oneTimeData;
				var looptime = parseInt(buff.length / time);
				var lastData = parseInt(buff.length % time);

				that.setData({
					looptime: looptime + 1,
					lastData: lastData,
					currentTime: 1
				});
				that.Send(buff);
			},
			// 添加数据
			addData(xsBill, xsDate, billStr) {
				let addSql = 'insert into POS_XSBILLPRINT (XSBILL,XSDATE,BILLSTR) values ("' + xsBill + '","' + xsDate +
					'",' + billStr + ')';
				db.get().executeDml(addSql, "执行中", (res) => {
					console.log("sql 执行结果：", res);
				});
			},
			//分包发送
			Send: function(buff) {
				var that = this;
				var currentTime = that.currentTime;
				var loopTime = that.looptime;
				var lastData = that.lastData;
				var onTimeData = that.oneTimeData;
				var printNum = that.printerNum;
				var currentPrint = that.currentPrint;
				var buf;
				var dataView;

				if (currentTime < loopTime) {
					buf = new ArrayBuffer(onTimeData);
					dataView = new DataView(buf);

					for (var i = 0; i < onTimeData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
					}
				} else {
					buf = new ArrayBuffer(lastData);
					dataView = new DataView(buf);

					for (var i = 0; i < lastData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
					}
				}
				//console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)

				uni.writeBLECharacteristicValue({
					deviceId: app.globalData.BLEInformation.deviceId,
					serviceId: app.globalData.BLEInformation.writeServiceId,
					characteristicId: app.globalData.BLEInformation.writeCharaterId,
					value: buf,
					success: function(res) {
						if (currentTime <= loopTime) {

						} else {
							uni.showToast({
								title: "已打印第" + currentPrint + "张成功"
							});
						} //console.log(res)
					},
					fail: function(e) {
						uni.showToast({
							title: "打印第" + currentPrint + "张失败",
							icon: "none"
						}); //console.log(e)
					},
					complete: function() {
						currentTime++;

						if (currentTime <= loopTime) {
							that.setData({
								currentTime: currentTime
							});
							that.Send(buff);
						} else {
							if (currentPrint == printNum) {
								that.setData({
									looptime: 0,
									lastData: 0,
									currentTime: 1,
									isReceiptSend: false,
									currentPrint: 1
								});
							} else {
								currentPrint++;
								that.setData({
									currentPrint: currentPrint,
									currentTime: 1
								});
								that.Send(buff);
							}
						}
					}
				});
			}	
		},
		created() {
			if (window && !window.vue) { //把vue放到全局上，方便调试
				window.vue = this;
			}
			this.paramInit();
			this.priceCount();
			this.handleMapper(); //初始化处理映射
			this.dPayAmount = this.toBePaidPrice(); //初始化首次给待支付一个默认值
		},
		mounted() {}
	}
</script>
<style>
	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
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

	.pay-center {
		display: inline-flex;
		align-items: center;
		height: 100%;
	}

	.amounts {
		box-sizing: border-box;
	}

	.refund-more-box {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
	}

	.refund-icon {
		width: 12px;
		height: 12px;
		background-size: cover;
		margin-left: 4px;
	}

	.refund-warm {
		background-image: url(../../images/warn.png);
	}

	.refund-loading {
		background-image: url(../../images/loading.png);
		filter: brightness(100);
		animation: loading infinite 0.5s linear;
	}

	.refund-text {
		margin-right: 6px;
	}

	.refund-reset {
		background-color: #42b14b;
		color: white;
		font-size: 12px;
		border-radius: 5px;
		padding: 1px 2px;
		display: inline-flex;
		flex-direction: row;
		align-items: center;
	}

	.canvasdiv {
		width: 0px;
		height: 0px;
		visibility: hidden;
	}
</style>
