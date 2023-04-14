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
				<view style="width:45%">
					<image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image>
					<image src="../../images/shouyintai.png" mode="widthFix"></image> 收银台
					<!-- <label class="sweep">
						是否使用扫码枪：
						<view class="classifys">
							<text @click="PAD_SCANFunc()" :class="!PAD_SCAN ? 'curr' : ''">是</text>
							<text @click="PAD_SCANFunc()" :class="!PAD_SCAN ? '' : 'curr'">否</text>
						</view>
					</label> -->
				</view>
				<view class="checkout">
					<label>
						<image src="../../images/dx-mendian.png" mode="widthFix"></image><text>{{NAME}}</text>
					</label>
					<label>
						<image src="../../images/dx-kuantai.png" mode="widthFix"></image>{{POSID}}
					</label>
					<label @click="PAD_SCANFunc()">
						<image src="@/images/dx-smqiang.png" mode="widthFix" v-if="!PAD_SCAN"></image>
						<image src="@/images/dx-smqiang-hong.png" mode="widthFix" v-else></image>
						<text v-if="!PAD_SCAN">使用扫码枪</text>
						<text v-else style="color: #FE694B;">使用拍照扫码</text>
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
							value="" :key="domRefresh" v-model="dPayAmount" min="0.01" />
						<input v-if="!isRefund && currentPayType == 'HyJfExchange'" type="number" disabled="false"
							value="" :key="domRefresh" v-model="CashOffset.Money" />
					</text>
				</p>
			</view>
			<view class="paydetails">
				<view class="pay-sum">
					<view class="settleds">
						<view class="paymentlist">
							<h3 v-if="!isRefund">已结算<button
									v-if="!isRefund&&PayWayList.find(i=>i.fkid=='1001'&&i.yn_use=='Y')"
									@click="ShowCoupon()">+ 可用券</button>
							</h3>
							<view class="sets-list" v-if="!isRefund">
								<view class="paylists yjs">
									<view class="Methods"
										v-for="(pay, index) in PayList.filter(i => !i.fail && !i.paying && i.show)">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ pay.name }}
										</view>
										<text>￥{{pay.amount}}</text>
									</view>
								</view>
								<view class="stills">
									<view class="Methods">
										<view class="payicon">
											<image src="../../images/shouyintai.png" mode="widthFix"></image>
											还需支付
										</view>
										<text>￥{{ debt }}</text>
									</view>
								</view>
							</view>
							<h3 v-if="!isRefund">结算失败</h3>
							<view class="sets-list refund" v-if="!isRefund">
								<view class="paylists yjs">
									<view class="Methods"
										v-for="(pay, index) in PayList.filter(i => i.fail && !i.payding && i.show)">
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ pay.name }}
										</view>
										<div class="refund-more-box">
											<text class="refund-text">{{pay.amount}}￥</text>
											<!-- <div class="refund-reset" @click="singlePayRetry(pay)">
												{{ pay.auth_code?"支付":"重试" }}
												<div v-if="pay.loading" class="refund-icon refund-loading"></div>
											</div> -->
											<div class="refund-reset" @click="singlePayRetry(pay)">
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
										v-for="(refund, index) in RefundList.filter(i => !i.fail && i.refund_num != 0 && !i.refunding && i.show)">
										<!-- 这段的含义是 退款成功 且 次数不等于 0 的（起码为1，因为发起请求时默认为成功）且是状态确定的（正在支付操作算不确定的，所以不显示，当成功或失败才算确定的状态） -->
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ refund.name }}
										</view>
										<text>￥{{(-refund.amount).toFixed(2)}}</text>
									</view>
								</view>
							</view>
							<h3 v-if="isRefund">退款失败</h3>
							<view class="sets-list refund" v-if="isRefund">
								<view class="paylists">
									<view class="Methods"
										v-for="(refund, index) in RefundList.filter(i => i.fail && i.refund_num !=0 && !i.refunding && i.show)">
										<!-- v-for="(refund, index) in RefundList"> -->
										<view class="payicon">
											<image src="../../images/dianziquan.png" mode="widthFix"></image>
											{{ refund.name }}
										</view>
										<div class="refund-more-box">
											<text class="refund-text">￥{{(-refund.amount).toFixed(2)}}</text>
											<div class="refund-reset" @click="singleRetry(refund)">
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
							<view class="pattern curr" :class="currentPayType === 'POLY'? 'selected':' '" id='POLY'
								@click="clickPayType('',$event)">
								<image class="p-bg" src="../../images/xzbj-da.png" mode="widthFix"></image>
								<p>聚合支付</p>
								<label>
									<view v-for="(item,index) in PayWayList.filter(i=>i.poly=='Y'&&i.yn_use=='Y')">
										<image :src="item.icon" mode="widthFix">
										</image>
									</view>
								</label>
								<label class="poly-text">
									<!-- <text>支持</text> -->
									<text>支持{{PayWayList.filter(i=>i.poly=='Y'&&i.yn_use=='Y').map(i => i.name).join(",")}}</text>
								</label>
							</view>
							<!-- :class="currentPayType === item.type ? 'selected':''" -->
							<view v-for="(item,index) in PayWayList.filter(i=>i.poly=='N')" class="pattern nots curr"
								:class="(currentSelectedInfo&&currentSelectedInfo.fkid == item.fkid )? 'selected':''"
								:id="item.type" @click="clickPayType(item,$event)">
								<view class="tits" :class="{seltss:item.yn_use == 'Y'}">
									<p v-if="item.yn_use == 'Y'">{{item.name}}</p>
									<p v-else>{{item.name}}<span style="font-size: 12px;">(禁用)</span></p>
								</view>
								<image :src="item.icon" mode="widthFix">
							</view>
							<view class="pattern nots curr" @click="clickPayType('Others',$event)"
								:class="currentPayType === 'Others' ? 'selected':''">
								<view class="tits seltss">
									<p>更多</p>
									<text
										style="font-size: 12px;color: gray;">可用数量:{{PayWayList.filter(r=>{return r.poly=='S'&&r.yn_use=='Y'}).length}}</text>
								</view>
								<image src="../../images/moren-zfu.png" mode="widthFix">
							</view>
						</view>
					</view>
					<!-- </p> -->
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
								<!-- <text>满{{item.limitmoney}}可用</text> -->
							</view>
							<image class="banyuan" src="../../images/quan-fenge.png" mode="widthFix"></image>
							<view class="coupon-dets">
								<view class="limit">
									<view class="h3">
										<text>{{item.sname}}</text>
									</view>
									<text class="datas">{{item.s_date}} 至 {{item.e_date}}</text>
								</view>
								<view class="directions">
									<image class="bg" src="../../images/quan-bg.png" mode="widthFix"></image>
									<view>使用说明:<text v-for="(item1,index1) in item.limitDesc">{{item1}}</text></view>
									<!-- <image src="../../images/xiala.png" mode="widthFix"></image> -->

									<button @click="CouponToUse(item.lqid)">点击使用<image src="../../images/ewm.png"
											mode="widthFix"></image></button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 其他支付方式 -->
		<view class="boxs" v-if="ShowOthersPay">
			<view class="coupons" style="width:80%;height: 85%;">
				<view class="hh" style="padding-top:56rpx;">
					<view style="width:45%">
						<!-- <image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image> -->
						<image src="../../images/shouyintai.png" mode="widthFix"></image> 收银台
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
							<input v-if="!isRefund && currentPayType != 'HyJfExchange'" type="number"
								:disabled="allowInput" value="" :key="domRefresh" v-model="dPayAmount" min="0.01" />
						</text>
					</p>
				</view>
				<image class="bjs" src="@/images/jsd-hybj.png" mode="widthFix"></image>
				<view class="modeclassy">
					<view :class="PayMode=='93'?'curr':' '" @click="ChangePayMode('93')">银行合作</view>
					<view :class="PayMode=='95'?'curr':' '" @click="ChangePayMode('95')">异业合作</view>
					<view :class="PayMode=='98'?'curr':' '" @click="ChangePayMode('98')">其他方式</view>
				</view>
				<view class="listofpay">
					<view class="modelist">
						<view v-for="(item) in PayWayList.filter(i=>i.poly=='S'&&i.fkid_f==PayMode)" class="modeli"
							:class="(currentSelectedInfo&&currentSelectedInfo.fkid == item.fkid )? 'curr':''"
							:id="item.type" @click="clickPayType(item,$event)">
							<view :class="item.yn_use=='Y'?'':'jinzhi'">
								<image :src="item.icon" mode="widthFix"></image>
								<label v-if="item.yn_use=='Y'">{{item.name}}</label>
								<label v-else>{{item.name}}<span style="font-size: 12px;">(禁用)</span></label>
							</view>
						</view>
					</view>
				</view>
				<view class="operats">
					<button class="btn btn-qx" @click="Others_ReturnPay">返回</button>
					<button class="btn" @click="ActionSwtich()">{{ isRefund ? "确认退款":"确认支付"}}</button>
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
		<!-- //扫码枪组件  @getAuthCode="GetAuthCode" -->
		<saomaqiang v-if="showSMQ" style="z-index: 999;"></saomaqiang>
		<!-- 支付加载框 -->
		<Loading :title="isRefund?'退款中...':'支付中...'" :show="in_payment"></Loading>
		<!-- 现金支付提示弹窗 -->
		<CashChangeModal :visible.sync="CashModal.Visible" :confirm.sync="CashModal.Confirm" :text="CashModal.Text">
		</CashChangeModal>
	</view>
	<!-- </view> -->
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
		Sale3Model,
		Sale3ModelAdditional
	} from '@/bll/PaymentBusiness/bll.js';
	import {
		PayDataAssemble,
		global,
		print
	} from '@/models/PaymentAll/models.js';
	import {
		retrySinglePay
	} from '@/bll/PaymentAll/bll.js'
	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	import _payment from '@/api/business/payment.js';

	var that, is_log = true;
	var log = console.log;
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
				CashModal: {
					Visible: false,
					Text: ""
				},
				PaymentInfos: { //从上个页面传来的支付信息
					PayList: [],
					PayedAmount: 0 //已经完成支付的金额，主要针对从上个页面传入的订单数据的总和
				},
				CashOffset: {
					Score: 1, //抵现的积分数
					Money: 0.01 //抵现的积分数对应的实际金额
				},
				in_payment: false,
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
				currentSelectedInfo: null, //当前界面选中状态支付方式
				currentPayInfo: null, //当前一单的支付平台信息（提供 fkid 和 name）
				currentPayType: "POLY", //支付类型，目前主要区分 聚合（聚合包含 支付宝、微信、会员卡-电子卡）和 券，默认聚合
				subject: "商品销售", //订单类型（文本说明）
				xuanzhong: true,
				CanBack: true, //是否允许退出(为false，此处是为了方便测试)
				AlreadyBack: false,
				ExistOperation: false, //是否是交易中
				RefundFinish: false,
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
				hyinfo: {}, //当前会员信息
				PAD_SCAN: true, //默认pad扫码 
				showSMQ: false, //是否显示扫码枪
				ShowOthersPay: false, //是否显示其他支付方式
				PayMode: '93', //支付类型
				allow_debt_excess: false, //设置是否允许超过待支付金额进行支付
				cash_change_tips: true,
				cash_sum: 0
			}
		},
		watch: {
			dPayAmount: function(n, o) {
				console.log("[Watch-dPayAmount]待支付金额修改:", {
					new: n,
					old: o
				});
				if (this.isRefund) return; //如果为退款，直接退出
				if (Object.is(NaN, Number(n))) { //判断输入的是否是数字
					if (o != null) {
						console.log("[Watch-dPayAmount]数据信息:", {
							new: n,
							old: o
						});
						this.dPayAmount = o;
						util.simpleMsg('输入的数字有误,已自动修正!', false);
						this.domForceRefresh(); //解决待付款赋值触发监听后，在其中修改值后文本内容依然没变的问题
					}
					return;
				}
				let amount = this.toBePaidPrice(); //计算待支付金额
				let amount_include_negative_number = this.toBePaidPriceAllNumber(); //计算待支付金额(包含负数)
				if (Number(n) === 0 && n.length > 1 && n[0] === '-') {
					this.dPayAmount = 0;
					this.domForceRefresh();
				}
				if (Number(n) < 0) { //待支付金额必须为正数
					this.dPayAmount = o;
					util.simpleMsg('待支付金额必须大于0!', false);
					this.domForceRefresh();
				}
				console.log(`[Watch-dPayAmount]newValue:${n},amount:${amount}`);
				if (amount > 0) { //未完成支付，仍然存在欠款
					console.log(`[Watch-dPayAmount]未完成支付!`, this.PayList);
					if (this.PayList.length === 0) this.CanBack = true; //未使金额发生变化则仍然可以退出
					// else this.CanBack = false;
					//检测待支付金额是否超过了欠款，如果超过则自动修正为欠款金额数
					console.log("[Watch-dPayAmount]判断是否允许超额支付:", this.allow_debt_excess);
					console.log("[Watch-dPayAmount]判断是否为积分抵现:", this.currentPayType);
					if (Number(n) > this.toBePaidPrice() && !this
						.allow_debt_excess && this.currentPayType != 'HyJfExchange'
					) { //后面这部分是因为存在一个舍弃分（就是一分钱两分钱不要，自动折扣）
						console.log(`[Watch-dPayAmount]超过待支付金额!`, n);
						if (Number(n) - this.toBePaidPrice() > 0.1)
							console.log(`[Watch-dPayAmount]金额异常!`, {
								new: Number(n),
								count: this.toBePaidPrice()
							});
						util.simpleMsg('金额输入错误!', false, {
							new_val: n || "-",
							count_val: this.toBePaidPrice()
						});
						this.dPayAmount = amount; //超过待支付金额后自动给与目前待支付金额的值
						this.domForceRefresh();
					} else {
						console.log(`[Watch-dPayAmount]未超过待支付金额!`, n);
						let decimal = (this.dPayAmount?.toString() ?? ".")?.split('.');
						console.log(`[Watch-dPayAmount]判断小数位数!`, decimal);
						if (decimal.length === 2) {
							let count = decimal[1].length;
							console.log("[Watch-dPayAmount]金额:", {
								val: Number(this.dPayAmount)
							});
							if ((count > 2) || (this.dPayAmount && decimal[0].length > 1 && this.dPayAmount[0] ==
									'0')) {
								this.dPayAmount = Number(this.dPayAmount)?.toFixed(2);
								this.domForceRefresh();
							}
						}
					}
				} else { //完成支付，推送数据
					console.log("[Watch-dPayAmount]完整支付金额:", amount_include_negative_number);
					if (amount_include_negative_number >= 0) { //避免券类的支付出现提前完成导致放弃金额未被记录的问题（未被记录则会变成负数）
						var that = this;
						this.YN_TotalPay = true;
						this.CanBack = true;
						console.log("[Watch-dPayAmount]Generator-SALE1、2、3:", this.sale1_obj, this.sale2_arr, this
							.sale3_arr);
						this.createOrders(true);
					}
				}
			},
			allow_debt_excess: function(n, o) {
				let reset_amount = this.toBePaidPrice();
				if (n === false && this.dPayAmount > Number(reset_amount)) {
					this.dPayAmount = reset_amount;
				}
			},
			yPayAmount: function(n, o) {
				console.log("[Watch-yPayAmount]已支付金额发生修改:", {
					n,
					o
				});
				this.dPayAmount = this.toBePaidPrice(); //一旦已支付金额发生变化，自动触发计算剩余待支付金额
			},
			authCode: function(n, o) {
				console.log("[watch-authCode]判断authCode：", n);
				console.log("[watch-authCode]PayWayList：", this.PayWayList);
				if (n) {
					let type = this.PayTypeJudgment();
					console.log("[watch-authCode]当前支付类型:", type);
					this.currentPayInfo = this.PayWayList.find((i) => i.type ===
						type); //每次支付后根据 authcode 判断支付方式并给 currentPayInfo
					if (this.currentPayInfo) this.currentSelectedInfo = this.currentPayInfo; //储存包含聚合的支付信息
				} else
					this.currentPayInfo = null
				console.log("[Watch-AuthCode]当前支付类型信息：", this.currentPayInfo);
			},
			currentPayType: function(n, o) { //每次发生变化,切换页面dom选中
				console.log("[Watch-CurrentPayType]当前类型:", n);
				this.currentPayInfo = this.PayWayInfo(n); //根据 type 获取支付信息
				this.allow_debt_excess = (this.currentPayInfo.yn_cezf == "Y"); //判断是否允许采用 金额>欠款 得操作 (超额支付)
				console.log("[Watch-CurrentPayType]设置是否允许超额支付:", this.allow_debt_excess);
				console.log("[Watch-CurrentPayType]支付信息:", this.currentPayInfo);
				if (n === "JHQ") { //如果用券，则不再允许编辑待付款金额
					this.dPayAmount = this.toBePaidPrice();
					this.domForceRefresh();
					this.allowInput = true;
				} else if (n === "HyJfExchange") { //如果是用的积分抵现，则修改为当前可用的积分上限进行支付（对应金额，且不能修改）
					this.dPayAmount = this.CashOffset.Score;
					this.allowInput = true;
				} else if (n === "DouYinJK") { //如果是用的积分抵现，则修改为当前可用的积分上限进行支付（对应金额，且不能修改）
					this.allowInput = true;
				} else {
					if (n === 'Others' || this.currentPayInfo.poly === "S") {
						this.allowInput = false;
						return;
					}
					this.dPayAmount = this.toBePaidPrice();
					this.allowInput = false;
				}
			},
			RefundList: function(n, o) {
				this.refundAmountCount(); //重新计算金额
				if (n && n.filter(i => i.fail || i.paying || i.refunding).length == 0) { //失败的、支付中的、退款中的 都为0
					this.CanBack = true;
					this.RefundFinish = true;
					console.log("[RefundList-Watch]现金提示...");
					this.CashRefundCombine(); //现金退款金额合并（实际支付金额-找零）
					this.CashRefundTips(); //现金退款提示
					console.log("[RefundList-Watch]Refunds：", this.RefundList)
					this.createOrders();
				}
			},
			PayList: function(n, o) {
				if (Number(this.toBePaidPrice()) === 0) { //判断如果待支付金额为 0 则返回上一个界面
					this.CanBack = true;
					console.log("[PayList-Watch]Payments：", this.PayList)
					// this.backPrevPage();
				} else {
					if (n.length == 1 && n[0].fkid == "ZF11") { //如果是兑换券 则默认不让退出
						this.CanBack = false;
						console.log("兑换券不允许返回：", this.CanBack);
					}
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
			}
		},
		methods: {
			onLoad: function(option) {
				uni.$off('getAuthCode');
				uni.$on("getAuthCode", this.GetAuthCode);
				console.log("进入onLoad方法");
				let a = util.getStorage("PAD_SCAN");
				if (a === "") {
					this.PAD_SCAN = true;
				} else {
					this.PAD_SCAN = a;
				}
				this.event = this.getOpenerEventChannel();
				this.$mp?.page?.$getAppWebview()?.setStyle({
					popGesture: 'none'
				});
			},
			ShowDefaultAfterImageLoadError: function(e, index, i) {

			},
			//扫码方式切换
			PAD_SCANFunc: function(e) {
				this.PAD_SCAN = !this.PAD_SCAN;
				console.log("扫码枪状态", this.PAD_SCAN);
				if (this.PAD_SCAN) {
					util.simpleMsg("已切换为摄像头扫码", "none");
				} else {
					// uni.setLocale("en");
					util.simpleMsg("已切换为扫码枪扫码", "none");
				}
				util.setStorage("PAD_SCAN", this.PAD_SCAN); //切换后缓存起来 下次默认使用
			},
			//单号防重处理
			UniqueBill: function() {
				let that = this;
				that.out_trade_no = that.out_trade_no_old + '_' + ((function() {
					if (this.prev_no === null) {
						this.prev_no = that.PayList.length;
						return that.PayList.length;
					} else {
						if (this.used_no.indexOf(this.prev_no) !== -1) { //如果序号已被使用
							let index = 20; //最大循环数20次
							while (index > 0) { //循环判断当前单号递增是否还存在，如果存在继续递增
								if (this.used_no.indexOf(this.prev_no) !== -1)
									++this.prev_no;
								else //如果单号找不到了那么就跳出
									break;
								index--;
							}
							return this.prev_no;
						} else
							return this.prev_no;
					}
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
			//合并重构sale123数据对象 缩减版
			SaleDataCombine: function() {
				if (this.complete) return; //表示已经创建过销售单，不再进行重复创建
				else this.complete = true; //如果未创建，那么标记为已创建
				let saledate = dateformat.getYMD();
				let saletime = dateformat.getYMDS();
				let hyinfo = this.hyinfo || util.getStorage("hyinfo");
				let sale1 = this.SALES.sale1,
					sale2 = this.SALES.sale2,
					sale3 = this.SALES.sale3,
					sale8 = this.SALES.sale8;
				console.log("当前类型：", this.isRefund);
				console.log("当前sale1：", sale1);
				console.log("当前sale2：", sale2);
				console.log("当前sale3：", sale3);
				this.sale1_obj = Object.assign(sale1, { //上个页面传入的 sale1 和 当前追加
					TNET: this.isRefund ? -Math.abs(sale1.TNET) : sale1.TNET, //实付金额（重点）
					ZNET: this.isRefund ? -Math.abs(sale1.ZNET) : sale1.ZNET, //总金额（重点）
					BILLDISC: this.isRefund ? -Math.abs(sale1?.BILLDISC) : (sale1?.BILLDISC ||
						0), //整单折扣需要加上手工折扣,
					ROUND: this.isRefund ? -Math.abs(sale1.ROUND) : (sale1?.ROUND || 0), //取整差值（手工折扣总额）
					CUID: this.isRefund ? sale1.CUID : hyinfo?.hyId || sale1.CUID,
					TDISC: this.isRefund ? -Math.abs(sale1.TDISC) : (sale1?.TDISC || 0),
					TCXDISC: this.isRefund ? -Math.abs(sale1.TCXDISC) : (sale1?.TCXDISC || 0),
					// TLINE: this.isRefund ? -sale1.TLINE : sale1.TLINE
					TLINE: sale1.TLINE
				});
				console.log("[SaleDataCombine]sale1 封装完毕!", this.sale1_obj);
				this.sale2_arr = sale2.map((function(item, index) {
					let obj = Object.assign(item, {
						BILL: sale1.BILL, //取最新的单号
						NET: this.isRefund ? -Math.abs(item.NET) : item.NET,
						DISCRATE: this.isRefund ? -Math.abs(item.DISCRATE) : item
							.DISCRATE, //当前商品的折扣额 后续可能有促销折扣
						DISC: this.isRefund ? -Math.abs(item.DISC) : item.DISC, //手工折扣额
						CXDISC: this.isRefund ? -Math.abs(item.CXDISC) : item.CXDISC, //手工折扣额
						QTY: this.isRefund ? -Math.abs(item.QTY) : item.QTY
					});
					return util.hidePropety(obj, "NAME");
				}).bind(this));
				console.log("[SaleDataCombine]sale2 封装完毕!", this.sale2_arr);
				let arr = util.getStorage("FKJHQTK");
				this.sale3_arr = this.Sale3Source().map((function(item, index) {
					let fkid = item.fkid; //兼容旧版 支付或者退款 均取旧值
					if (this.isRefund && arr && arr.length > 0) { //处理新版券退款方式映射
						let obj = arr.find(r => {
							return r.old_fkid == item.fkid
						});
						console.log("匹配到的退款方式映射数据：", obj);
						if (obj) {
							fkid = obj.new_fkid;
						}
					}
					return util.hidePropety({
						BILL: sale1.BILL, //主单号，注：订单号为 BILL+ _ + NO,类似于 10010_1
						SALEDATE: sale1.SALEDATE,
						SALETIME: sale1.SALETIME,
						KHID: sale1.KHID,
						POSID: sale1.POSID,
						NO: item.no, //付款序号
						FKID: fkid, //付款类型id
						AMT: this.isRefund ? -(Number(item.amount)) : item.amount, //付款金额(退款记录为负额)
						ID: this.isRefund ? (item.origin?.ID || "") : item.card_no, //卡号或者券号
						RYID: sale1.RYID, //人员
						GCID: sale1.GCID, //工厂
						DPID: sale1.DPID, //店铺
						KCDID: sale1.KCDID, //库存点
						// BMID: this.BMID, //部门id
						BMID: item.point, //部门id
						DISC: this.isRefund ? (item.origin?.DISC || 0) : item
							.disc || 0, //折扣金额 *逆向退款 不需要记录为负数*
						FAMT: this.isRefund ? (item.origin?.FAMT || 0) : item
							.disc || 0, //折扣金额(卡券消费后要记录) *逆向退款 不需要记录为负数*
						RATE: this.isRefund ? (item.origin?.RATE || 0) : item
							.disc || 0, //折扣金额(卡消费后要记录) *逆向退款 不需要记录为负数*
						ZKLX: this.isRefund ? (item.origin?.ZKLX || "") : item.zklx, //折扣类型
						IDTYPE: this.isRefund ? (item.origin?.IDTYPE || "") : item.id_type, //卡类型
						AUTH: item.auth, //交易号
						balance: this.isRefund ? "" : (item.balance || ""), //如果是电子卡，余额
						balance_old: this.isRefund ? "" : (item.balance_old || "") //如果是电子卡，余额
					}, "balance", "balance_old");;
				}).bind(this));
				console.log("[SaleDataCombine]sale3 封装完毕!", this.sale3_arr);
				this.sale8_arr = sale8; //使用直接传入的水吧商品
				console.log("[SaleDataCombine]sale8 封装完毕!", this.sale8_arr);
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
				return this.isRefund ? this.RefundList.filter(i => !i.fail) : this.PayList.filter(i => !i
					.fail); //如果是退款，那么就是退款信息，否则是支付信息
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
					//从这开始中止 后续处理在外部进行
					//生成执行sql
					// let exeSql = this.orderSQLGenarator();
					// let dbo = db.get();
					// console.log("sqlite待执行sql:", exeSql);
					// await dbo.close();
					// dbo.executeDml(exeSql, "订单创建中", (function(res) {
					// 	if (func) func(res);
					// 	this.complete = true;
					// 	console.log("订单创建成功：", res);
					// 	util.simpleMsg("销售单创建成功");

					// }).bind(this), function(err) {
					// 	console.log("订单创建失败：", err);
					// 	util.simpleMsg("销售单创建失败", false);
					// });
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
			//扫码枪回调
			GetAuthCode: function(e) {
				console.log("收到扫码枪回调：", e);
				this.showSMQ = false; //关闭组件
				if (e) {
					let code = common.ResetAuthCode(e);
					this.authCode = code; //获取扫码的 authCode
					console.log("[Pay]authCode:", this.authCode);
					let current_pay_info = this.PayWayInfo(this
						.PayTypeJudgment());
					console.log("[Pay]扫码判断支付方式信息:", current_pay_info);
					console.log("[Pay]authCode:", this.authCode);
					console.log("[Pay]支付信息：", {
						current_pay_info,
						pay_type: this.currentPayType
					});
					if (Object.keys(current_pay_info).length && current_pay_info
						.poly != 'Y' && this.currentPayType == 'POLY') {
						util.simpleMsg(`当前支付方式不属于聚合支付，请切换至对应的支付方式后进行支付!`)
						this.authCode = "";
						return;
					}
					that.PayHandle();
				} else {
					this.authCode = "";
				}
			},
			//支付按钮点击事件
			Pay: function() {
				let that = this; //适配真机
				console.log("[Pay]当前支付类型:", this.currentPayType);
				if (!this.currentPayType || this.currentPayType == 'Others') { //增加其他选项 不允许支付的控制
					util.simpleMsg("请选择支付方式后再进行支付!", false);
					return;
				}
				let pay_info = this.PayWayInfo(this.currentPayType);
				console.log("[Pay]当前支付类型信息:", pay_info);
				if ((!this.dPayAmount || Number(this.dPayAmount) === 0) && this.toBePaidPrice() != 0 || (this
						.currentPayType == 'HyJfExchange' && this.CashOffset.Score == 0)) {
					util.simpleMsg("金额不能为空!", true);
					this.dPayAmount = this.toBePaidPrice();
					return;
				}
				if (!this.YN_TotalPay) { //如果未支付完成
					if ((pay_info.dbm === "Y" || this.is_poly) && !this.authCode) { //需要扫码操作(条件：1、指定为聚合支付。2、或直接设定扫或不扫码)
						console.log("此操作类型需要扫码！", pay_info)
						console.log("是否属于聚合支付：", this.is_poly)
						if (!this.PAD_SCAN) { //是否扫码枪扫码
							this.showSMQ = true; //启动扫码框组件
							return;
							// uni.showModal({
							// 	content: "请使用扫码枪扫码",
							// 	editable: true,
							// 	confirmText: "确认",
							// 	cancelText: "取消",
							// 	success: (function(res) {
							// 		console.log("回调结果：", res);
							// 		if (res.confirm) {
							// 			if (res.content) {
							// 				this.authCode = res.content; //获取扫码的 authCode
							// 				let current_pay_info = this.PayWayInfo(this
							// 					.PayTypeJudgment());
							// 				console.log("[Pay]扫码判断支付方式信息:", current_pay_info);
							// 				console.log("[Pay]authCode:", this.authCode);
							// 				console.log("[Pay]支付信息：", {
							// 					current_pay_info,
							// 					pay_type: this.currentPayType
							// 				});
							// 				if (Object.keys(current_pay_info).length &&
							// 					current_pay_info
							// 					.poly != 'Y' && this.currentPayType == 'POLY') {
							// 					util.simpleMsg(`当前支付方式不属于聚合支付，请切换至对应的支付方式后进行支付!`)
							// 					this.authCode = "";
							// 					return;
							// 				}
							// 				that.PayHandle();
							// 			}
							// 		}
							// 	}).bind(this)
							// })
						} else {
							uni.scanCode({
								success: (function(res) {
									let code = common.ResetAuthCode(res.result);
									let valid_result = this.PaymentTypeValid(code);
									console.log("[Pay]判断结果:", valid_result);
									if (!valid_result.code) {
										util.simpleMsg(valid_result.msg, true);
										return;
									}
									this.authCode = code; //获取扫码的 authCode
									let current_pay_info = this.PayWayInfo(this
										.CurrentPaymentTypeJudge());
									console.log("[Pay]扫码判断支付方式信息:", current_pay_info);
									console.log("[Pay]scanCode:", res);
									if (current_pay_info && Object.keys(current_pay_info).length) {
										this.currentPayInfo = current_pay_info;
										this.currentPayType = current_pay_info?.type;
									}
									console.log("[Pay]支付信息：", {
										current_pay_info,
										pay_type: this.currentPayType
									});
									if (Object.keys(current_pay_info).length && current_pay_info
										.poly != 'Y' && this.currentPayType == 'POLY') {
										util.simpleMsg(`当前支付方式不属于聚合支付，请切换至对应的支付方式后进行支付!`)
										this.authCode = "";
										return;
									}
									that.PayHandle();
								}).bind(this),
								fail(err) {
									console.log("[Pay]Error:", err);
								}
							});
						}
					} else { //不需要扫码操作
						console.log("此操作类型不需要扫码！", pay_info)
						that.PayHandle(); //直接发起支付
					}
				} else {
					util.simpleMsg("订单已完成支付!");
				}
			},
			PaymentTypeValid: function(auth_code) {
				let type = this.CurrentPaymentTypeJudge(auth_code),
					pay_type_info = this.PayWayInfo(type),
					select_type_info = this.PayWayInfo(this.currentPayType);
				console.warn("[PaymentTypeValid]当前支付方式是否为聚合支付:", {
					type,
					pay_type_info,
					select_pay_type: this.currentPayType
				});
				if (this.currentPayType == 'POLY') {
					if (pay_type_info.poly == 'Y') {
						return util.createdResult(true, "校验成功!");
					} else {
						return util.createdResult(false,
							`请使用${(select_type_info?.name || (this.currentPayType == 'POLY' ? "聚合支付所包含的支付类型的" : "") || "")}付款码支付`
						)
					}
				} else {
					if (this.currentPayType == type) {
						return util.createdResult(true, "校验成功!");
					} else {
						return util.createdResult(false,
							`请使用${(select_type_info?.name|| (this.currentPayType == 'POLY' ? "聚合支付所包含的支付类型的" : "") || "")}付款码支付`
						)
					}
				}
			},
			//退款数据处理
			RefundDataHandle: function() { //把上个页面传入的退款数据进行处理后进行展示
				if (common.actTypeEnum.Refund === this.actType) { //如果是支付
					console.log("[RefundDataHandle]初始化 Sales 列表...", this.SALES)
					this.SALE1Init();
					this.SALE2Init();
					this.SALE3Init();
					this.refundAmountCount(); //退款金额计算
					console.log("[RefundDataHandle]初始化完毕!");
				}
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
				console.log("[PayedCount]已支付记录:", this.PaymentInfos.PayList);
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
				}
				console.log("[SALE2Init]SALE2 初始化完毕！", this.Products)
			},
			//SALE003 初始化、处理
			SALE3Init: function() {
				let that = this;
				if (this.isRefund) {
					console.log("[SALE3Init]PayWayList:", this.PayWayList);
					this.RefundList = this.SALES.sale3?.map((function(i) { //将sale3的数据转为页面适用的格式
						return Sale3ModelAdditional(Sale3Model({
							fkid: i.FKID,
							bill: `${that.SALES.sale1.XS_BILL}_${i.NO}`,
							name: this.PayWayList.find(p => p.fkid == i.FKID)?.name ?? "",
							amount: Number(i.AMT).toFixed(2),
							no: i.NO,
							group: i.AUTH,
							origin: i
						}))
					}).bind(this));
				}
				console.log("SALE3 初始化完毕！", this.RefundList)
			},
			//根据 type 获取 支付信息
			PayWayInfo: function(type) {
				console.log("[PayWayInfo]根据TYPE获取对应支付的具体信息:", {
					type,
					info: this.PayWayList.find(i => i.type === type) || {}
				});
				return this.PayWayList.find(i => i.type === type) || {};
			},
			CashRefundCombine: function() {
				let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
				console.warn("[CashRefundCombine]现金支付信息:", {
					payment_infos: util.getStorage("FKDA_INFO"),
					cash_info
				});
				let cash_list = this.RefundList.filter(i => i.fkid == cash_info.FKID);
				let other_list = this.RefundList.filter(i => i.fkid != cash_info.FKID);
				if (cash_list.length == 2) { //现金存在找零的情况
					let sum = cash_list.reduce((prev, next) => Number(prev.amount) + Number(next.amount));
					cash_list[0].amount = sum;
					other_list.push(cash_list[0]);
					this.RefundList = other_list;
				}
			},
			//现金退款提示（如果退款包含现金的话，提示现金部分是多少）
			CashRefundTips: function() {
				let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
				console.warn("[CashRefundTips]现金支付信息:", {
					payment_infos: util.getStorage("FKDA_INFO"),
					cash_info
				});
				if (!this.cash_change_tips) return;
				this.cash_change_tips = false;
				let cash_paids = this.RefundList.filter(i => Number(i.amount || 0) > 0 && i.fkid == cash_info.FKID);
				if (cash_paids.length) { //是否包含现金退款
					let sum_cash = cash_paids.map(i => Number(i.amount)).reduce((prev, next) => prev + next);
					this.cash_sum = sum_cash;
					// util.simpleModal('退款提示', `当前订单包含现金退款 ${sum_cash?.toFixed(2)} 元。`);
				}
				setTimeout(util.callBind(this, function() {
					this.cash_change_tips = true;
				}), 2000)
			},
			//退款操作
			Refund: function(isRetry = false) {
				console.log("[Refund]开始退款流程...")
				console.log("[Refund]退款单号为：", this.out_refund_no);
				let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
				console.warn("[Refund]现金支付信息：", {
					payment_infos: util.getStorage("FKDA_INFO"),
					cash_info
				});
				let refund_no = this.out_refund_no,
					that = this,
					promises = [];
				this.RefundList.find(i => i.refund_num != 0) ? this.CanBack = false : this.CanBack = true;
				//遍历所有退款失败的(或者未退款的)
				console.log("退款单列表：", this.RefundList)
				if (this.RefundList.filter(i => i.fail).length === 0) {
					util.simpleMsg(`已完成退款!${ this.cash_sum ? `当前订单包含现金退款 ${this.cash_sum?.toFixed(2)} 元。` : ""}`);
					this.CanBack = true;
					this.RefundFinish = true;
					this.CashRefundTips(); //现金退款提示
					this.SaleDataCombine();
					this.backPrevPage();
					return;
				}
				let groups = util.group(this.RefundList, 'group'); //根据 group 分组，auth为空的会被分到 null 中
				let only_code = Object.keys(groups)?.filter(k => k !== 'null'); //排除掉不包含唯一码的数据
				only_code.forEach(k => {
					groups[k].sort((a, b) => Number(a.no) - Number(b.no));
				})
				//检测是否存在不包含的付款类型
				let all_support_fkid = this.PayWayList;
				let check_result = this.RefundList.map(r => r.fkid).map(i => {
					let find_info = all_support_fkid.find(o => o.fkid == i)
					if (find_info && (find_info.poly == 'O' || find_info.yn_use == 'Y'))
						return {
							pay_info: find_info ?? i,
							is_support: true
						};
					else
						return {
							pay_info: find_info ?? i,
							is_support: false
						};
				});
				if (check_result.find(i => !i.is_support)) {
					util.simpleMsg("当前单据存在不被当前支持的类型,无法退款!", true);
					console.log("[Refund]检查出不受支持的支付类型...", check_result);
					return;
				}
				//遍历 RefundList 发起退单请求
				this.RefundList.filter(i => i.fail).forEach((function(refundInfo, index) {
					let payObj = this.PayWayList.find(i => i.fkid == refundInfo.fkid);
					let current_refund_exists_only_code = false; //当前退款是否包含唯一码
					console.log("[Refund]退款fkid:", refundInfo.fkid)
					console.log("[Refund]退款payWayType:", payObj.api)
					console.log("[Refund]groups:", groups);
					let total = 0;
					if (refundInfo.group) { //判断当前支付是否包含唯一码
						refundInfo = groups[refundInfo.group][0]; //获取此唯一码组的第一条数据（第一条数据的单号默认为退款的原单号）
						groups[refundInfo.group].map(r => {
							total += Number(r.amount); //聚合多卡支付的总金额
						})
						// refundInfo.amount = total.toFixed(2);
						total = total.toFixed(2);
						console.log("refundInfo:", refundInfo);
						current_refund_exists_only_code = true;
					}
					console.log("[Refund]退款单据信息:", refundInfo);
					//如果是预定金、现金（如果为0）门店赊销，直接跳过
					if (['ZG03', 'ZF01', 'ZG01', 'ZCV1'].indexOf(refundInfo.fkid) !== -1) {
						if (current_refund_exists_only_code) { //是否带唯一码
							groups[refundInfo.group].forEach(g => g.fail = false);
						}
						console.log("[Refund]跳过接口调用...");
						if (!(refundInfo.fkid === cash_info.FKID && Number(refundInfo.amount) !==
								0)) { //如果为现金且金额不为 0
							refundInfo.fail = false;
							promises.push(Promise.resolve())
							return;
						}
					}
					if (!refundInfo.fail && refundInfo.refunding) {
						console.log("[Refund]跳出当前循环...");
						return;
					}
					if (payObj) {
						if (!isRetry) { //开始默认为退款成功（只包含首次退款的，如果是第二次尝试则默认为原有状态，也就是false）
							refundInfo.fail = false;
						}
						refundInfo.refunding = true; //标记为正在退款的状态
						let res = new Promise(util.callBind(this, function(resolve, reject) {
							this.in_payment = true;
							console.log("[Refund]加载框打开...", {
								pay_type: payObj.type
							});
							_pay.RefundAll(payObj.api, {
									out_trade_no: refundInfo.bill, //单号
									out_refund_no: refund_no + `_${index}`, //退款单号
									refund_money: (Math.abs(Number(total || refundInfo
											.amount) * 100))
										.toFixed(0), //退款金额
									total_money: (Math.abs(Number(total || refundInfo
											.amount) * 100))
										.toFixed(0), //退款总金额（兼容微信）
									point: refundInfo.origin.BMID, //兼容积分抵现返还积分
									auth_code: refundInfo.origin
										.ID, //2023-02-15新增 可伴 退款和查询也需要券号
									original_company_id: this.SALES.sale1
										.XS_GSID, //2023-02-15新增 可伴 退款和查询也需要券号
									original_store_id: this.SALES.sale1
										.XS_KHID, //2023-02-15新增 可伴 退款和查询也需要券号
									original_area_id: this.SALES.sale1
										.XS_DQID, //2023-02-15新增 可伴 退款和查询也需要券号
									store_id: this.KHID, //2023-02-15新增 可伴 退款和查询需要门店号
									card_no: refundInfo.origin
										.ID, //2023-02-06新增 获取支付时的卡/券号（ID也可能记录的是openid,卡号等，按需使用）
									deviceno: refundInfo.origin
										.AUTH, //2023-04-11新增 用于抖音券核销撤销使用
									ywtype: this
										.BILL_TYPE // + "-" + this.XSTYPE //2023-02-06新增 业务类型 用于券退款是否要调用 券退回 接口 （销售退款，预定取消）
								}, (function(err) { //如果发生异常（catch）
									// util.simpleMsg(err.msg, true, err);
									refundInfo.fail = true;
									resolve(); //结束状态
									console.log("[Refund-退款]退款失败:", err);
									if (err.msg)
										util.simpleModal("退款失败", err.msg);
								}).bind(that),
								(function(res) { //执行完毕（finally），退款次数 +1
									console.log("[Refund-退款]Finally:", res);
									refundInfo.refund_num += 1; //发起请求默认加1
									refundInfo.refunding = false; //标记为已经结束退款操作
									this.RefundList = Object.assign([], this
										.RefundList) //刷新视图
									resolve(); //结束状态
								}).bind(that),
								(function(ress) { //执行完毕（results），根据结果判断
									console.log("[Refund-退款]Results:", ress);
									if (!ress[1]
										.code) { //如果第二个回调退款结果异常，那么把当前退款标记为失败，否则标记为成功
										refundInfo.fail = true;
										refundInfo.msg = ress[1].msg; //错误提示信息记录
									} else {
										refundInfo.fail = false;
										if (current_refund_exists_only_code) { //是否带唯一码
											groups[refundInfo.group].forEach(g => g
												.fail = false);
											console.log("groups[refundInfo.group]",
												groups[refundInfo
													.group]);
										}
									}
									resolve(); //结束状态
								}).bind(that));
						}));
						promises.push(res)
					} else {
						util.simpleMsg("支付方式不存在!", true);
						if (this.RefundList.length === 0) this.CanBack = true; //锁定退出
					}
				}).bind(this));
				console.log("[Refund]等待退款队列请求执行完毕...");
				Promise.all(promises).then(util.callBind(this, function(res) {
					console.log("[Refund]RefundList-After:", this.RefundList);
					this.in_payment = false;
				}))
			},
			//创建订单对象列表
			createOrders: function(is_success) {
				if (this.RefundList.length !== 0 && this.RefundList.filter(i => i.fail).length === 0 || this.PayList
					.length !== 0 && this.PayList.filter(i => i.fail).length === 0 || is_success)
					this.CreateDBData((res) => {
						let tip = that.actType == common.actTypeEnum.Refund ? "退款" : "支付";
						let refund_cash_tips =
							`${ this.cash_sum ? `当前订单包含现金退款 ${this.cash_sum?.toFixed(2)} 元。` : ""}`;
						util.simpleMsg(tip +
							`已完成！${that.actType == common.actTypeEnum.Refund ? refund_cash_tips : ""}`);
						setTimeout(function() {
							that.backPrevPage();
						}, 1500);
						//后续处理转移到销售页面处理
						return;
						//销售单单创建成功后 上传一下数据
						// let bill = (that.actType == common.actTypeEnum.Refund ? that.out_refund_no : that
						// 	.out_trade_no_old);
						// common.TransLiteData(bill);
						// that.scoreConsume();
						// //调用打印
						// let arr2 = that.sale2_arr;
						// arr2.forEach(function(item, index) {
						// 	let obj = that.Products.find((i) => {
						// 		return i.SPID == item.SPID;
						// 	})
						// 	if (obj) {
						// 		item.SNAME = obj.NAME;
						// 	}
						// })
						// let arr3 = that.sale3_arr;
						// arr3.forEach(function(item, index) {
						// 	let obj = that.PayWayList.find((i) => {
						// 		return i.fkid == item.FKID;
						// 	})
						// 	item.SNAME = obj.name;
						// })
						// that.$refs.printerPage.bluePrinter(that.sale1_obj, arr2, arr3);

					});
			},
			//支付类型判断
			PayTypeJudgment: function() {
				let curPayType = "";
				console.log("[PayTypeJudgment]二维码:", this.authCode);
				console.log("[PayTypeJudgment]当前选择的支付类型:", this.currentPayType);
				let startCode = this.authCode.substring(0, 2);
				if (startCode) {
					let CodeRule = getApp().globalData.CodeRule;
					console.log("[PayTypeJudgment]支付规则:", CodeRule);
					if (this.currentPayType === "JHQ") //券
						startCode = "coupon";
					if (this.currentPayType === "DouYinJK") //券
						startCode = "ht";
					//取出当前是何种类型的支付方式
					curPayType = CodeRule[startCode]; //WX_CLZF,ZFB_CLZF,JHQ,HYK....
					if (this.currentPayType === "UPAY") //银联二维码
						curPayType = "UPAY";
				}
				if (!curPayType && this.authCode) {
					util.simpleMsg("二维码错误！请重新扫码！", "none");
					this.authCode = '';
				}
				console.log("[PayTypeJudgment]当前返回的支付类型：", curPayType);
				return curPayType;
			},
			//支付类型判断
			CurrentPaymentTypeJudge: function(auth_code) {
				console.log("[CurrentPaymentTypeJudge]二维码:", this.authCode);
				let startCode = auth_code?.substring(0, 2) || this.authCode.substring(0, 2),
					current_type = "";
				if (startCode) {
					let CodeRule = getApp().globalData.CodeRule;
					console.log("[CurrentPaymentTypeJudge]支付规则:", CodeRule);
					if (this.currentPayType === "JHQ") //券
						startCode = "coupon";
					if (this.currentPayType === "DouYinJK") //券
						startCode = "ht";
					//取出当前是何种类型的支付方式
					current_type = CodeRule[startCode]; //WX_CLZF,ZFB_CLZF,JHQ,HYK....
				}
				if (!current_type && this.authCode) {
					util.simpleMsg("二维码错误！请重新扫码！", "none");
					this.authCode = '';
				}
				return current_type;
			},
			//支付 data 对象组装
			PayDataAssemble: PayDataAssemble,
			//支付处理入口
			PayHandle: async function() {
				console.log("[PayHandle]进入支付处理...");
				let payAfter = this.PayDataAssemble(),
					info = this.PayWayInfo(this.currentPayType);
				if (Object.keys(info).length === 0)
					info = this.PayWayInfo(this.PayTypeJudgment());
				console.log("[PayHandle]支付单号:", this.out_trade_no);
				console.log("[PayHandle]支付参数:", payAfter);
				if (await this.InPaymentBeforeStoped())
					return;
				console.log("[PayHandle]支付开始...", info);
				this.in_payment = true; //必须放这里
				_pay.PaymentAll(info.api, payAfter, (function(result) {
						try {
							if (this.currentPayType == 'HyJfExchange') { //判断当前是不是积分支付，如果是则扣除所有积分
								this.CashOffset.Score = 0;
								this.CashOffset.Money = 0;
							}
							console.log("[Payment-付款]支付结果：", result);
							util.simpleMsg("支付成功!");
							this.UpdateHyInfo(result.data); //更新会员信息
							console.log("[PayHandle]auth_code清空！");
							this.orderGenarator(payAfter, info.type, result.data, false, info, {
								excess: this.dPayAmount - this.debt <= 0 ? 0 : Number(this
									.CountCashChange()?.toFixed(2)), //判断是否是过量支付 [支付金额] - [欠款]，把过量的钱存起来
							}); //支付记录处理(成功)
							console.log("[PayHandle]判断待支付金额是否为0...");
							if (this.debt > 0) {
								this.CanBack = false;
							}
						} catch (e) {
							console.error("[PayHandle]发生异常:", e);
						}
						console.log("[PayHandle]执行默认操作（关闭支付加载框+清空auth_code）...");
						this.operationAfterSinglePayment();
						console.log("[PayHandle]序号：", this.prev_no)
						console.log("[PayHandle]序号列表：", this.used_no);
					}).bind(this),
					(function(error) {
						try {
							console.log("[Payment-付款]支付失败！", error)
							util.simpleModal("支付失败", error.msg);
							console.log("[Payment-付款]包装信息:", {
								assemble: payAfter,
								type: info.type
							});
							this.orderGenarator(payAfter, info.type, null, true,
								info); //支付记录处理(失败) 注：此记录为必须，因为有的单会因为请求超时判定为失败，所以这里的得记录这个支付信息，方便后续重试进行查询
						} catch (e) {
							console.error("[Payment-付款]发生异常:", e);
						}
						this.operationAfterSinglePayment();
					}).bind(this),
					(function(end) { //finally
						this.operationAfterSinglePayment();
					}).bind(this)
				)
			},
			CountCashChange: function() {
				let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
				console.warn('[CountCashChange]现金支付信息:', {
					payment_infos: util.getStorage("FKDA_INFO"),
					cash_info
				});
				let prev_cash_amount = this.PayList.find(i => i.fkid == cash_info.FKID)?.amount ||
					0; //查找上一个现金支付金额判断是否存在
				return Number(this.dPayAmount) - (Number(this.allAmount) + Number(prev_cash_amount));
			},
			//在 PayHandle 调用 PaymentAll 前的终止操作（用于控制是否进行支付操作），返回 Boolean，用于终止支付
			//注：支持异步+同步方法(貌似 uniapp 或者是 ios 的 js 解释器内不支持在 Promise.all 中使用同步的代码，所以只能用 Promise.resolve 包裹同步代码的返回结果)
			InPaymentBeforeStoped: async function() {
				try {
					console.log("[InPaymentBeforeStoped]支付前终止判断...");
					let results = (await Promise.all([this.CashChange(), this.DisabledPaymentChannel(), this
						.LimitPaymentChannel()
					]));
					console.log("[InPaymentBeforeStoped]限制条件处理结果:", results);
					//自定义判断，往数组里加
					return !results.every(result => result == true);
				} catch (e) {
					console.log("[InPaymentBeforeStoped]处理异常:", e);
					return true;
				}
			},
			//终止支付判断条件1: 现金找零(判断 [当前支付金额] - [欠款])
			CashChange: async function() {
				console.log("[CashChange]现金找零操作判断处理...", {
					pay_money: this.dPayAmount,
					debt: this.allAmount
				});
				let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
				console.warn("[CashChange]现金支付信息:", {
					payment_infos: util.getStorage("FKDA_INFO"),
					cash_info
				});
				if (this.currentPayInfo.fkid != cash_info.FKID) return true; //不是现金不走这个条件
				//找零金额
				let change_number = this.CountCashChange();
				if (change_number > 100) {
					console.log("[CashChange]找零超过100元...");
					this.CashModal.Text = "找零金额超过100￥，重新输入支付金额!";
					this.CashModal.Visible = true;
					return false;
				} else if (change_number > 0) {
					console.log("[CashChange]找零低于100元但大于0元...");
					this.CashModal.Text = `支付 ${ this.dPayAmount } 元，需找零 ${ change_number?.toFixed(2) } 元，确认支付？`;
					this.CashModal.Visible = true;
					var async_callback = new Promise(util.callBind(this, function(reslove, reject) {
						uni.$once("cash-modal-confirm", util.callBind(this, function() {
							console.log("[CashChange]弹窗点击了确定...");
							reslove(true);
						}));
						uni.$once("cash-modal-cancel", util.callBind(this, function() {
							console.log("[CashChange]弹窗点击了取消...");
							reslove(false);
						}));
					}));
					if ((await async_callback) == true)
						return true;
					else
						return false;
				} else {
					console.log("[CashChange]支付金额小于欠款...");
					this.CashModal.Text = `支付 ${ this.dPayAmount } 元，确认支付？`;
					this.CashModal.Visible = true;
					var async_callback = new Promise(util.callBind(this, function(reslove, reject) {
						uni.$once("cash-modal-confirm", util.callBind(this, function() {
							console.log("[CashChange]弹窗点击了确定...");
							reslove(true);
						}));
						uni.$once("cash-modal-cancel", util.callBind(this, function() {
							console.log("[CashChange]弹窗点击了取消...");
							reslove(false);
						}));
					}));
					if ((await async_callback) == true)
						return true;
					else
						return false;
				}
			},
			//终止支付判断条件2: 判断是否使用了禁用的支付方式支付 + 支付方式是否存在
			DisabledPaymentChannel: function() {
				var payment_channel_info = this.PayWayInfo(this.currentPayType); //支付方式信息
				console.log("[DisabledPaymentChannel]支付类型:", payment_channel_info);
				if (!payment_channel_info || Object.keys(payment_channel_info).length == 0) {
					util.simpleMsg("未找到此类支付方式信息!", true);
					this.authCode = "";
					return false;
				} else if (payment_channel_info.yn_use == 'N') {
					util.simpleMsg("不可使用此支付方式!", true);
					this.authCode = "";
					return false;
				} else {
					return true;
				}
			},
			//终止支付判断条件3: 判断是否是支付次数受限的支付
			LimitPaymentChannel: function() {
				let XZZF = util.getStorage("XZZF");
				let pt = this.PayTypeJudgment();
				console.log("[LimitPaymentChannel]当前限制支付集合：", XZZF);
				console.log("[LimitPaymentChannel]当前支付集合：", this.PayList);
				console.log("[LimitPaymentChannel]当前支付类型：", pt);
				if ((XZZF.length > 0 && this.PayList.length > 0 && XZZF.indexOf(pt) >= 0) && this.PayList.find((r) => r
						.type == pt && r.show)) { //显示时才参与判断
					util.simpleMsg("请更换支付方式!", true);
					this.authCode = '';
					return false;
				} else {
					return true;
				}
			},
			//支付操作后
			operationAfterSinglePayment: function() {
				this.in_payment = false;
				this.authCode = ""; //避免同一个付款码多次使用

				//重置到聚合
				this.Others_ReturnPay();
			},
			/* 支付后创建支付记录
			 * 参数：
			 * 1、payload —— 支付请求前通过 PayDataAssemble 包装的参数。
			 * 2、type 支付渠道类型（来自PayWayList内部对象的 TYPE 字段）。
			 * 3、result 支付返回结果（成功返回，失败为空）。
			 * 4、fail 支付是否失败。
			 * 5、type_info 支付渠道信息。
			 * 6、other_info 其他参数，其他参数统一放在 other_info 中，不在额外增加新参数。
			 */
			orderGenarator: function(payload, type, result, fail, type_info, other_info) {
				console.log("[OrderGenarator]生成订单类型：", {
					type: this.currentPayType,
					payload,
					result
				});
				//计算已支付金额（如果这笔支付成功，则总和进已支付金额中，否则为 0）
				let paid_amount = fail ? 0 : this.PaidAmountCalculation(payload, result, type_info); //把支付成功部分金额加上
				//支付失败的时候 result 并不是标准的响应内容
				if (result) {
					console.log("[OrderGenarator]支付成功请求...");
					this.SuccessOrderGenerator(payload, result, fail, type_info, other_info);
				} else { //如果为失败的支付请求
					console.log("[OrderGenarator]支付失败请求...");
					this.FailOrderGenerator(payload, result, fail, type_info, other_info);
				}
				this.yPayAmount += paid_amount;
				this.PayList = Object.assign([], this.PayList);
			},
			//已支付金额计算
			PaidAmountCalculation: function(payload, result, type_info) {
				console.warn("[PaidAmountCalculation]已支付金额计算...");
				if (result?.vouchers && result.vouchers.length > 0) {
					console.log("[OrderGenarator]券支付金额：", {
						payload,
						result,
						type_info
					})
					let coupon = result.vouchers.filter(i => i.yn_card === 'N'),
						card = result.vouchers.filter(i => i.yn_card === 'Y');
					if (coupon.length > 0) {
						console.log("[OrderGenarator]券 payload.money：", payload.money)
						let fq = coupon.find(i => i.note === "EXCESS"); //针对仟吉券
						if (fq) {
							return (coupon.length > 1 ? (fq.denomination - fq.pay_amount) : result
								.vouchers[0].denomination) / 100;
						} else { //其他券支付 如可伴券
							let num = 0;
							coupon.map(i => num += i.denomination);
							return num / 100
						}
					} else {
						console.log("[OrderGenarator]卡 payload.money：", card)
						let num = 0;
						card.map(i => num += i.pay_amount);
						return num / 100
					}
				} else {
					let pay_amount = 0;
					if (type_info.type == 'HyJfExchange') pay_amount = payload.point_money;
					else pay_amount = payload.money / 100;
					console.log("[OrderGenarator]非券支付金额：", pay_amount)
					return pay_amount;
				}
			},
			//成功单据信息生成
			SuccessOrderGenerator: function(payload, result, fail, type_info, other_info) {
				console.log("[SuccessOrderGenerator]生成成功订单...");
				let type = type_info.type; //代码变动-以防万一的代码
				let payObj = this.PayWayList.find(item => item.type == type); //支付对象主要用于会员卡支付
				let excess_amount = other_info?.excess || 0; //如果不存在超出金额或者为 0 则默认给 0
				if (result.vouchers && result.vouchers.length > 0) { //如果是券支付，且返回的卡券数组列表为非空
					console.log("[OrderGenarator]卡券支付订单生成...");
					result.vouchers.forEach((function(coupon, index) {
						try {
							let excessInfo = this.PayWayList.find(item => item.fkid == coupon
								.fkid); //放弃金额
							console.log("[OrderGenarator]卡券：", coupon)
							console.log("[OrderGenarator]当前支付方式信息：", this.currentPayInfo)
							this.PushToPaidList(this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
								amount: ((coupon.yn_card === 'Y' ? coupon.pay_amount : (coupon
									.note === 'EXCESS' ? -coupon.pay_amount :
									coupon.denomination)) / 100).toFixed(2),
								fkid: coupon.yn_card === 'Y' ? this.currentPayInfo
									?.fkid : coupon?.fkid,
								name: coupon.yn_card === 'Y' ? this.currentPayInfo
									?.name : excessInfo?.name,
								balance: (coupon?.balance / 100)?.toFixed(2), //如果是电子卡，余额
								balance_old: ((coupon?.balance + coupon?.pay_amount) / 100)
									?.toFixed(2), //如果是电子卡，余额
								zklx: coupon.yn_card === 'Y' ? payObj.zklx : coupon
									.disc_type, //22.11.21 测试要求券放弃金额 记录原折扣类型
								disc: (coupon?.discount / 100)?.toFixed(2),
								fail,
								id_type: coupon?.type,
								is_free: coupon?.yn_zq,
								card_no: coupon?.no,
								no: payload.no,
								excess: excess_amount, //找零金额
								auth: result.transaction_id //交易号 用于多卡退款时的分组依据
							}, result, type_info));
							payload.no++;
						} catch (e) {
							console.warn("[OrderGenarator]券信息生成异常:", e);
						}
					}).bind(this));
					console.log("[OrderGenarator]卡、券支付列表:", this.PayList);
				} else { //如果是聚合支付(这里应该是非卡券类别)
					console.log("[OrderGenarator]聚合支付订单生成...");
					this.PushToPaidList(this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
						amount: type_info.type != 'HyJfExchange' ? (payload.money / 100).toFixed(2) :
							payload.point_money?.toFixed(2),
						fail,
						card_no: result.open_id ?? result.transaction_id, //抖音券核销撤销字段：certificate_id
						auth: result.transaction_id, //抖音券核销撤销字段：verify_id
						no: payload.no,
						excess: excess_amount, //找零金额
					}, result, type_info));
					console.log("[OrderGenarator]聚合支付列表:", this.PayList);
				}
			},
			//失败单据信息生成
			FailOrderGenerator: function(payload, result, fail, type_info, other_info) {
				let type = type_info.type; //代码变动-以防万一的代码
				console.log("[FailOrderGenerator]支付失败信息:", [...arguments]);
				let trade = this.orderCreated({ //每支付成功一笔，则往此数组内存入一笔记录
					amount: type_info.type != 'HyJfExchange' ? (payload.money / 100).toFixed(2) : payload
						.point_money?.toFixed(2),
					fail,
					no: payload.no,
					bill: payload.out_trade_no, //保存失败的订单号
					auth_code: this.IsSaveAuthCode(payload.memo) ? payload.auth_code : "" //保存失败的券号
				}, null, type_info)
				console.log("[OrderGenarator]支付失败信息:", trade);
				this.retryEnd(trade, fail);
				console.log("[OrderGenarator]失败记录：", trade);
				this.PushToPaidList(trade);
			},
			IsSaveAuthCode: function(fkid) {
				let get_need_save_id = util.getStorage('PayWayList').filter(i => ['SZQ', 'COUPON', 'PINNUO',
					'DouYinJK'
				].includes(i.type)).map(i => i.fkid);
				return get_need_save_id.includes(fkid);
			},
			//订单对象创建
			orderCreated: function(obj, payload, current_pay_info) {
				this.used_no.push(obj.no);
				console.log("[OrderCreated]封装响应体开始...", {
					obj,
					payload,
					current_pay_info
				})
				let order = Object.assign(Sale3ModelAdditional(Sale3Model({
					fkid: current_pay_info?.fkid ?? "",
					type: current_pay_info?.type ?? "",
					bill: payload?.out_trade_no,
					name: current_pay_info?.name ?? "",
					no: this.PayList.length,
					// disc:(Number(payload?.discount) / 100)?.toFixed(2) ||
					// 	0, //由于失败会导致 discount 取值变成 undefined ，再进行计算会导致数值变成 NaN
					disc: payload?.discount ? (Number(payload?.discount) / 100)?.toFixed(2) : 0,
					zklx: payload?.disc_type ?? "",
					user_id: payload?.open_id || payload?.hyid,
					point: payload?.point ?? 0, //抵现积分数
				})), obj);
				console.log("[OrderCreated]封装响应体:", order)
				return order;
			}, //避免后续绑定this指向
			//向已支付订单记录列表追加数据操作
			PushToPaidList: function(paid) {
				if (this.CheckCashPayment(paid)) //检查是否是现金支付
					return; //根据函数控制是否执行默认添加记录操作（因为可能在函数内也会执行添加操作，避免重复）
				this.PayList.push(paid); //将支付记录追加到集合中
			},
			/* 检查现金支付：
			 * 1、是否超额支付，如果超额，将追加一条出账的找零记录
			 * 2、检查是否已经存在现金支付的记录，如果存在则覆盖
			 */
			CheckCashPayment: function(paid_record) {
				console.log("[CheckCashPayment]现金支付检测...", paid_record.fkid);
				let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
				console.warn("[CheckCashPayment]现金支付信息:", {
					payment_infos: util.getStorage("FKDA_INFO"),
					cash_info
				});
				if (paid_record.fkid == cash_info.FKID) {
					let remove_cash_record_index = this.PayList.findIndex(i => i.fkid == cash_info.FKID && !i.fail);
					console.log("[CheckCashPayment]现金支付索引:", remove_cash_record_index);
					let cash_paid_record = remove_cash_record_index != -1 ? this.PayList.splice(
						remove_cash_record_index, 1)[0] : null; //查找并删除支付成功，且为现金的记录，然后返回该记录
					console.log("[CheckCashPayment]前一条现金支付记录:", cash_paid_record);
					let push_paids = []; //放入待追加集合中
					if (cash_paid_record) { //存在一条现金支付记录
						console.log("[CheckCashPayment]合并现金支付金额...", {
							paid_record,
							cash_paid_record
						});
						this.yPayAmount -= cash_paid_record.amount; //减去上次现金支付的金额
						paid_record.amount = Number(paid_record.amount)?.toFixed(2); //把前一条现金支付金额与后一条合并
					}
					push_paids.push(paid_record); //把当前这条记录追加入集合
					console.log("[CheckCashPayment]现金是否超额支付...", paid_record.excess);
					if (paid_record.excess && paid_record.excess > 0) { //判断是否存在找零金额
						let change_record = Object.assign({}, paid_record); //生成找零记录
						let new_no = ++this.prev_no;
						this.used_no.push(new_no);
						change_record.no = new_no;
						change_record.amount = -paid_record.excess;
						this.yPayAmount -= paid_record
							.excess; //让 yPayAmount 金额回正，因为不排除找零，此时金额假如为 189，现金支付 190，则 189-190<0 不满足券类生成订单条件（券和现金类似，为券完整金额-放弃金额[如果有的话]）。
						push_paids.push(change_record); //把当前这条找零记录追加入集合
					}
					this.PayList = this.PayList.concat(push_paids);
					console.log("[CheckCashPayment]现金追加后的记录:", this.PayList);
					return true;
				} else
					return false;
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
			PayWayListInit: function(ban_pay_type = []) { //支付方式初始化
				let pay_way_list = JSON.parse(JSON.stringify(util.getStorage('PayWayList'))); //获取支付方式 
				console.log("[PayWayListInit]被禁止使用的支付类型:", ban_pay_type);
				console.log("[PayWayListInit]支付方式:", {
					all: util.getStorage('PayWayList'),
					catch: uni.getStorageSync('PayWayList')
				});
				this.PayWayList = pay_way_list.map(i => {
					try {
						i.icon = require('../../images/' + i.type + '.png');
					} catch (e) {
						i.icon = require('../../images/default_pay.png');
					}
					if (ban_pay_type?.find(t => t == i.fkid)) {
						i.yn_use = 'N'; //如果是被禁止类型的支付方式那么赋值为N表示无法用此选项支付
					}
					// if (i.fkid === 'ZF15') { //测试:用于测试禁止使用部分聚合支付的效果
					// 	i.poly = 'N';
					// } //银联二维码 属于聚合支付
					// if(i.poly == 'Y'){//测试:用于测试禁止使用部分聚合支付的效果
					// 	i.yn_use = 'N';
					// }
					return i;
				});;
				console.log("[PayWayListInit]支付初始化——可用的支付方式:", this.PayWayList);
			},
			//初始化
			paramInit: function() {
				that = this;
				var prev_page_param = this.$store.state.location;
				this.PayWayListInit(prev_page_param?.ban_pay);
				console.log("[ParamInit]传入页面参数:", prev_page_param);
				if (prev_page_param) {
					//传入的sale系列表数据初始化 👇
					this.SALES.sale1 = prev_page_param?.sale1_obj; //sale1数据
					this.SALES.sale2 = prev_page_param?.sale2_arr; //sale2数据
					this.SALES.sale3 = prev_page_param?.sale3_arr; //sale3数据
					this.SALES.sale8 = prev_page_param?.sale8_arr; //sale3数据
					this.CashOffset.Money = prev_page_param?.score_info?.money ?? 0;
					this.CashOffset.Score = prev_page_param?.score_info?.score ?? 0;
					console.log("[ParamInit]积分信息:", {
						pay: this.CashOffset,
						param: prev_page_param?.score_info
					});
					this.hyinfo = prev_page_param?.hyinfo; //会员信息采用传入
					console.log("[ParamInit]支付初始化——会员信息:", this.hyinfo);

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
						this.RefundDataHandle(); //处理上个页面传入的退单数据(其中会总计出退款金额 debtAmount)
					}
					this.Products = prev_page_param.sale2_arr.map(r => {
						return {
							PLID: r.PLID,
							SPID: r.SPID,
							UNIT: r.UNIT,
							BARCODE: r.BARCODE,
							NAME: r.STR1,
							PRICE: r.PRICE,
							OPRICE: r.OPRICE,
							NET: r.NET,
							QTY: parseInt(r.QTY)
						}
					});
					console.log("[ParamInit]手动设置待支付金额:", this.sale1_obj.$total_amount);
					if (this.sale1_obj.$total_amount !== undefined)
						this.totalAmount = this.sale1_obj.$total_amount;
					else {
						this.totalAmount = prev_page_param.sale1_obj.TNET
					}
					this.Discount = Number(prev_page_param.sale1_obj?.BILLDISC || "0").toFixed(2); //折扣信息
					// this.PriceCount(); //给 sale2 加上 SKY_DISCOUNT 参数 已废弃
					// this.GetSBData(); //筛选水吧产品 水吧商品由销售页面传入不需要再处理
					this.GetHyCoupons(); //获取会员的优惠券用以支付使用

					// util.simpleModal("门店检测", this.KHID);
					this.XSTYPE = this.SALES.sale1.XSTYPE;
					this.BILL_TYPE = this.SALES.sale1.BILL_TYPE;
					this.KHID = this.SALES.sale1.KHID; //重新赋值KHID
					this.GSID = this.SALES.sale1.GSID; //重新赋值GSID
					this.POSID = this.SALES.sale1.POSID; //重新赋值RYID
					this.RYID = this.SALES.sale1.RYID; //重新赋值RYID
					// util.simpleModal("门店检测1", this.SALES.sale1.KHID);
					// this.PaymentInfos.PayedAmount = 0; //进行初始化后不再计算此值

					//暂不确定默认0 getApp().globalData.PZCS["YN_ZFBKBQ"] == "Y" ? this.totalAmount : 0; //初始化一下支付宝折扣金额
					this.ZFBZK = 0;
				}
				console.log("[ParamInit]待支付金额初始化前:", this.dPayAmount);
				this.dPayAmount = this.toBePaidPrice(); //初始化首次给待支付一个默认值(其中会总计出待支付金额 debt)
				this.CheckActionComplet(); //此函数一定要在待支付金额和退款金额后进行调用
				console.log("[ParamInit]待支付金额初始化后:", this.dPayAmount);
			},
			ImmediateRefundCheck() { //直接退款的条件检测
				if (this.SALES.sale3.length === 1 && this.SALES.sale3[0].FKID === 'ZG01') //为赊销退单
					return true;
				// else if(){} //如果有其他业务分支...
				else
					return false;
			},
			CheckActionComplet() { //判断支付或退款动作是否完成（初始化阶段判断）
				if (this.isRefund) { //判断退款金额是否为 0（不判断支付是因为支付已经做了相关处理）
					let num = Number(this.refundView.debtAmount);
					if (!isNaN(num) && num === 0 || this.ImmediateRefundCheck()) {
						this.CanBack = true;
						this.RefundFinish = true;
						this.RefundList.map(i => i.fail = false);
						console.log("[CheckActionComplet]自动转为成功记录...", this.RefundList);
						this.SaleDataCombine();
						this.backPrevPage();
					}
				}
			},
			//总金额计算 舍弃分的处理 ***已废弃***
			PriceCount: function() {
				let total = parseFloat((util.callBind(this, function() {
					let total_amount = Number(this.sale1_obj.TNET);
					console.log("[PriceCount]商品总金额:", total_amount);
					return isNaN(total_amount) ? 0 : total_amount;
				}))().toFixed(2));
				//舍弃分的处理
				this.SKY_DISCOUNT = parseFloat((total % 1).toFixed(2));
				console.log("[PriceCount]手工折扣额：", this.SKY_DISCOUNT);
				this.totalAmount = parseFloat((total - this.SKY_DISCOUNT).toFixed(2)); //舍弃分数位
				// this.totalAmount = 0.01; //舍弃分数位

				//手工折扣分摊已转移到base_sale
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
				// let amount = (Number(this.totalAmount - this.Discount - this.yPayAmount - this.PaymentInfos
				// 	.PayedAmount)).toFixed(2);
				//进入支付页面后TNET已经是折扣后的金额
				let amount = (Number(this.totalAmount - this.yPayAmount - this.PaymentInfos.PayedAmount))
					.toFixed(2);
				let price = amount >= 0 ? amount : 0;
				return price;
			},
			toBePaidPriceAllNumber: function() { //和上面那个区别就是包含负数，避免券那种首先返回券面额再返回放弃金额导致订单提前结束生成
				let amount = (Number(this.totalAmount - this.yPayAmount - this.PaymentInfos.PayedAmount))
					.toFixed(2);
				return amount;
			},
			//文本框dom刷新
			domForceRefresh: function() {
				this.domRefresh = new Date().toString();
			},
			//点击切换支付方式
			clickPayType: function(r, e) {
				console.log("[ClickPayType]选择的支付类型：", {
					r,
					e
				});
				if (r == 'Others') { //点击其他支付
					console.log("展示其他方式");
					this.ShowOthersPay = true;
					this.currentPayType = r;
					this.ChangePayMode('93'); //默认展示第一个可用
					return;
				}
				// if(!e.currentTarget.id) return;
				let poly = this.is_poly;
				this.is_poly = e.currentTarget.id === 'POLY'; //如果是 POLY 则是聚合，否则不是
				// if (this.is_poly || r.yn_use == 'Y') { //配置了可使用的支付方式才可被选中
				// 	this.currentPayType = e.currentTarget.id; //小程序
				// }
				if (this.is_poly) {
					this.currentPayType = e.currentTarget.id; //聚合支付
					this.currentSelectedInfo = null; //清除非聚合方式的 选中项信息 后续通过支付码主动赋值
				} else {
					if (r.yn_use == 'Y') {
						this.currentPayType = e.currentTarget.id; //可使用的支付方式
						this.currentSelectedInfo = r; //缓存当前点击选中的支付信息
					} else {
						if (!this.ShowOthersPay) { //不在其他支付选项的时候
							this.is_poly = poly; //聚合支付复位
						}
						console.log("is_poly:", this.is_poly);
						util.simpleMsg("该支付方式暂无法使用！", "none");
					}
				}
			},
			//返回上个页面
			backPrevPage: function() {
				if (this.CanBack && !this.AlreadyBack) {
					console.log("[BackPrevPage]待支付金额:", this.toBePaidPrice());
					console.log("[BackPrevPage]是否已完成退款:", this.RefundFinish);
					if (Number(this.toBePaidPrice()) === 0 || this
						.RefundFinish) { //完成支付金额（待支付为 0 时）或者 RefundFinish（订单被标记为退款完成时） 为 true
						this.CanBack = false;
						this.AlreadyBack = true; //完成退出
						console.log("[BackPrevPage]单据数据:", {
							sale1: this.sale1_obj,
							sale2: this.sale2_arr,
							sale3: this.sale3_arr,
							sale8: this.sale8_arr
						});
						this.event.emit("FinishOrder", {
							code: true,
							msg: this.isRefund ? "退款成功!" : "支付完成!",
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
					// setTimeout(() => {
					// 	uni.navigateBack();
					// },5000)
					uni.navigateBack();
				} else
				if (!this.CanBack && !this.AlreadyBack) util.simpleMsg(`您还未完成${this.isRefund ? "退款":"支付"}`,
					true);
			},
			//展示会员卡券信息
			ShowCoupon: function() {
				let hyinfo = this.hyinfo || util.getStorage("hyinfo");
				if (!hyinfo?.hyId) {
					util.simpleMsg("请登录会员后再使用!")
					return;
				}
				this.GetHyCoupons(util.callBind(this, function() {
					if (that.coupon_list.length <= 0) {
						util.simpleMsg("暂无可用券", true);
					} else {
						this.currentPayType = "JHQ"
						let arr = that.coupon_list.filter(function(item, index, arr) {
							return parseFloat(item.limitmoney) <= that.debt; //筛选下可支付的券
						})
						that.coupon_list = arr;
						if (!arr.length) {
							util.simpleMsg("暂无可用券", true);
							return;
						}
						that.coupons = !that.coupons;
						console.log("[ShowCoupon]券列表信息:", that.coupon_list);
					}
				}));
			},
			//获取会员卡券	
			GetHyCoupons: function(func) {
				let hyinfo = this.hyinfo || util.getStorage("hyinfo");
				console.log("[GetHyCoupons]会员信息：", hyinfo);
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
						if (func) func();
					}, (err) => {
						console.log("[GetHyCoupons]异常数据：", res)
						if (func) func();
					})
				}
			},
			//点击券去使用
			CouponToUse: function(e) {
				//有券号
				if (e) {
					console.log("选择使用的卡券号：", e);
					that.currentPayType = 'JHQ';
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
			//切换支付方式
			ChangePayMode: function(e) {
				this.PayMode = e;
				//默认选中第一个
				let payObj = this.PayWayList.find(i => i.poly == 'S' && i.yn_use == 'Y' && i.fkid_f == e);
				if (payObj) {
					console.log("当前支付方式：", payObj);
					this.is_poly = false;
					this.currentPayType = payObj.type;
					this.currentSelectedInfo = payObj;
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
			NoOrginRefund: function(refund_info) { //不可原路——退款
				console.log("[NoOrginRefund]判断是否使用不可元路退回方式过机...");
				return new Promise(util.callBind(this, function(resolve, reject) {
					util.simpleModal('退款', '确定使用不可原路退回方式退款吗?', util.callBind(this, function(res) {
						if (res.confirm) {
							this.RecordInfoAsNoOrgin(refund_info);
							resolve(true);
						} else
							resolve(false);
					}))
				}));
			},
			NoOrginPay: async function(pay_info) { //不可原路——退款
				console.log("[NoOrginRefund]判断是否使用不可元路退回方式过机...");
				return new Promise(util.callBind(this, function(resolve, reject) {
					util.simpleModal('付款', '确定使用不可原路退回方式付款吗?', util.callBind(this, function(
						res) {
						console.log("[NoOrginRefund]选择结果:", res);
						if (res) {
							console.log("[NoOrginRefund]开始切换未不可原路退回方式...");
							this.RecordInfoAsNoOrgin(pay_info);
							console.log("[NoOrginRefund]切换完毕...");
							resolve(true);
						} else
							resolve(false);
					}))
				}));
			},
			RecordInfoAsNoOrgin: function(info) { //记录为不可回退类型
				info.fkid = 'ZG11';
				info.name = '不可原路退回';
				info.fail = false;
			},
			//单笔订单退款重试
			singleRetry: async function(info) {
				console.log("[SingleRetry]退款重试次数:", info.refund_num);
				let trade_no = info.bill;
				if (info.refund_num != 0) {
					if (await this.NoOrginRefund(info)) {
						this.refundAmountCount(); //重新计算
						return;
					}
				}
				console.log("[SingleRetry]重试单号：", trade_no)
				let singleRefund = this.RefundList.find(i => i.bill === trade_no);
				if (singleRefund) {
					singleRefund.loading = true; //开启加载样式
					let refund_no = this.out_refund_no; //获取订单号
					let payObj = this.PayWayList.find(i => i.fkid == singleRefund.fkid);
					if (payObj) {
						this.in_payment = true;
						_pay.RefundAll(payObj.api, {
								out_trade_no: singleRefund.bill, //单号
								out_refund_no: refund_no, //退款单号
								refund_money: (Math.abs(Number(singleRefund.amount) * 100))
									.toFixed(
										0), //退款金额
								total_money: (Math.abs(Number(singleRefund.amount) * 100)).toFixed(
									0), //退款总金额（兼容微信）
								auth_code: singleRefund.origin
									.ID, //2023-02-15新增 可伴 退款和查询也需要券号
								store_id: this.KHID, //2023-02-15新增 可伴 退款和查询需要门店号
								card_no: singleRefund.origin
									.ID, //2023-02-06新增 获取支付时的卡/券号（ID也可能记录的是openid,卡号等，按需使用）
								ywtype: this
									.BILL_TYPE // + "-" + this.XSTYPE //2023-02-06新增 业务类型 用于券退款是否要调用 券退回 接口 （销售退款，预定取消）
							}, (function(err) { //如果发生异常（catch）
								// catch code...
							}).bind(this),
							(function(res) { //执行完毕（finally），退款次数 +1
								this.in_payment = false;
								singleRefund.refund_num += 1; //发起请求默认加1
								this.RefundList = Object.assign([], this.RefundList) //刷新视图
							}).bind(this),
							(function(ress) { //执行完毕（results），根据结果判断
								this.in_payment = false;
								if (!ress[1].code) { //如果第二个回调退款结果异常，那么把当前退款标记为失败，否则标记为成功
									let info = this.PayWayInfo('NO');
									singleRefund.fail = true; //退款失败
									singleRefund.fkid = info.fkid;
									singleRefund.name = info.name;
									singleRefund.msg = ress[1].msg; //错误提示信息记录
									if (ress[1].msg && !ress[1].msg.includes(
											'网络错误')) { //本地查询超时，判定为可重试为 不可回退方式过机
										singleRefund.show = false;
									}
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
			singlePayRetry: async function(info) {
				console.log('[SinglePayRetry]重试支付:', info);
				if (info.pay_num > 1 && info.exactly) { //重试次数大于1，且支付结果必须为确定的（失败或成功，支付中属于不确定的结果）
					if (await this.NoOrginPay(info)) {
						console.log("[SinglePayRetry]已使用不可原路退回方式记录...");
						this.used_no.push(info.no); //如果成功
						console.log("[SinglePayRetry]已储存单序号...", info.no);
						this.yPayAmount += Number(info.amount);
						console.log("[SinglePayRetry]已计算待支付金额...", info.amount);
						this.PayList.sort(); //刷新视图
						return;
					}
				}
				let fkid = info.fkid,
					trade_no = info.bill;
				let type = this.PayWayList.find(i => i.fkid == fkid)?.type,
					data = this.PayDataAssemble();
				info.loading = true;
				if (!this.existSamePayType(type)) {
					this.in_payment = true;
					retrySinglePay({
						type: type,
						trade: info,
						auth_code: info.auth_code,
						store_id: this.KHID,
						trade_no,
						data
					}, (function(res) {
						this.in_payment = false;
						let data = res.data;
						if (data.status === 'PAYING') { //如果查询成功，状态为支付中
							console.log("[SinglePayRetry]重试查询结果为支付中...", data)
							this.RefundErrorCallback(info, false, res); //调用失败回调
							info.exactly = false; //结果为不确定的
							return;
						}
						//由于失败支付这仨字段是没有正确的赋值的，不出意外应该都是 undefined,这里重试成功了之后得给这几个字段重新赋值
						info.discount = data.discount ?? 0;
						info.disc = data.zklx ?? "";
						info.user_id = (data?.open_id || data?.hyid) ?? "";
						this.used_no.push(this.prev_no); //如果成功
						this.retryEnd(info, false)
						this.yPayAmount += (data.money / 100);
						this.PayList = Object.assign([], this.PayList); //刷新视图
						util.simpleModal('重试结果', res);
					}).bind(this), (this.RefundErrorCallback).bind(this, info, true));

				} else
					util.simpleMsg("已存在相同的付款方式！", false);
			},
			RefundErrorCallback: function(info, judge_net_err, err) { //单据记录
				this.in_payment = false;
				console.log("[RefundErrorCallback]退款异常回调...", {
					info,
					err
				});
				this.retryEnd(info);
				if (err.msg && !err.msg.includes('网络错误') &&
					judge_net_err) { //本地查询超时，判定为可重试为 不可回退方式过机
					info.show = false;
				}
				this.PayList = Object.assign([], this.PayList); //刷新视图
				util.simpleModal('重试结果', err.msg);
			},
			retryEnd: function(trade, isFail = true) {
				trade.loading = false;
				trade.exactly = true; //将结果转为确定，这种可以参与不可原路退回的判断
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
							this.hyinfo = {
								hyId: e.hyid
							};
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
			},
			//其他支付 相关方法
			//返回操作
			Others_ReturnPay: function(e) {
				this.ShowOthersPay = false;
				//重置为聚合支付
				this.is_poly = true;
				this.currentPayType = "POLY";
				this.currentSelectedInfo = null;
			},
			//确认操作
			Others_ConfirmPay: function(e) {
				this.ShowOthersPay = false;
			},
		},
		async created() {
			console.log("进入created方法");
			this.paramInit();
			if (!app.globalData?.CodeRule || Object.keys(app.globalData?.CodeRule) === 0)
				await common.GetZFRULE(); //初始化支付规则（如果没有的话）
			console.log("支付类型：", this.actType);
			if (this.actType != common.actTypeEnum.Payment) //退款才获取
				await _payment.GetTKRelation(); //获取券退款fkid 映射方式
		},
		mounted() {}
	}
</script>

<style>
	.right {
		height: 98%;
		width: 100%;
	}

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

	.sweep {
		display: flex;
		align-items: center;
		width: 48%;
		margin-right: 2%;
	}

	.classifys {
		display: flex;
		align-items: center;
		background-color: #E0EAE9;
		color: #006B44;
		font-weight: 400;
		border-radius: 40rpx;
		font-size: 14px;
		padding: 1px;
		border: 1px solid #006B44;
	}

	.classifys text {
		display: inline-block;
		padding: 4rpx 20rpx;
		border-radius: 30px;
	}

	.classifys text.curr {
		background-color: #006B44;
		color: #fff;

	}

	.customer .btn-qr {
		width: 50%;
		margin: 0 auto;
		position: absolute;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.customer .confirm {
		position: absolute;
		bottom: 0;
		left: 10%;
		width: 80%;
		padding: 2% 0 3%;
	}

	.bom-zhifu .pattern:nth-child(1),
	.bom-zhifu .pattern:nth-child(2),
	.bom-zhifu .pattern:nth-child(3),
	.bom-zhifu .pattern:nth-child(4),
	.pattern:nth-child(5) {
		width: 47% !important;
	}

	.bom-zhifu .pattern:nth-last-child(1),
	.bom-zhifu .pattern:nth-last-child(2),
	.bom-zhifu .pattern:nth-last-child(3),
	.bom-zhifu .pattern:nth-last-child(4) {
		width: 22%;
		padding: 0 1% 0 2%;
	}

	.bom-zhifu .pattern:nth-last-child(1) .tits p,
	.bom-zhifu .pattern:nth-last-child(2) .tits p,
	.bom-zhifu .pattern:nth-last-child(3) .tits p,
	.bom-zhifu .pattern:nth-last-child(4) .tits p {
		font-size: 30rpx !important;
		line-height: 56rpx !important;
		width: 90%;
	}

	.jinzhi {
		opacity: 0.7;
		color: #666;
	}
</style>
