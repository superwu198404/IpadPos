<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/takeout.css);
</style>
<template>
	<view>
		<PrinterPage ref="printerPage" style="display: none;" />
		<!-- 顶部导航栏 -->
		<Head :custom.sync="view.big_customer" :_ynDKF='view.enable_customer' :_showSale="true" :_ynMsg='false'
			:type="'kq_sale'">
		</Head>
		<!-- 内容栏 -->
		<CouponSaleSteps ref="steps"></CouponSaleSteps>
		<view class="listof listof-correct">
			<view class="prolist prolist-correct zxpro " style="width: 92%;">
				<view class="choice">
					<view :class="view.current_part_view == 'coupon_activate' ? 'tab curr' : 'tab'">
						<label>
							<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
							<text @click="switch_to_page('coupon_activate')">券激活</text>
						</label>
						<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
					</view>
					<view :class="view.current_part_view == 'coupon_activate_fail' ? 'tab curr' : 'tab'">
						<label>
							<image src="@/images/img2/jihuoshibai.png" mode="widthFix"></image>
							<text @click="switch_to_page('coupon_activate_fail')">券激活失败</text>
						</label>
						<image class="bgs" src="@/images/img2/shibai-biaoq.png" mode="widthFix"></image>
					</view>
				</view>
				<view style="width: 100%; height: 100%;" v-if="view.current_part_view == 'coupon_activate'">
					<view class="module">
						<view class="hh">待售详情 <em></em></view>
						<!-- 没刷卡时显示 -->
						<view class="swipetip" v-if="view.swipe_tip">
							<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>请先刷卡录入</text>
						</view>
						<!-- 刷卡后显示卡列表 -->
						<view class="cardlist">
							<view class="swipetip" v-if="source.sale2_union_sale6.length==0">
								<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
								<text>请先录入券</text>
							</view>
							<view class="ulli" v-for="(sales,index) in source.sale2_union_sale6">
								<view class="touch-list list-touch" @click="touch_list($event,sales.sale006)"
									:data-style="get_text_style(sales.sale006)" :data-index="index"
									:style="get_text_style(sales.sale006)">
									<image class="bgs" src="@/images/quan-bg.png" mode="widthFix"></image>
									<view class="h6">
										<label>￥{{ sales.sale002.OPRICE }}<text>/{{ sales.sale006.QTY }}张</text></label>
										<view class="zje">
											<view>
												<text>总金额</text>￥{{ sales.sale002.NET }}
											</view>
										</view>
									</view>
									<view class="card-num">
										<label>始：<text>{{ sales.sale006.KQIDS }}</text></label>
										<label>终：<text>{{ sales.sale006.KQIDE }}</text></label>
									</view>
									<view class="statistic">
										<label class="firstzjk">
											<view><em>●</em><text>总折扣：</text></view>{{ sales.sale002.DISCRATE }}
										</label>
										<label
											class="f12"><em>●</em><text>标准折扣：</text>{{ sales.sale002.BZDISC }}</label>
										<label
											class="f12"><em>●</em><text>临时折扣：</text>{{ sales.sale002.LSDISC }}</label>
										<label
											class="f12"><em>●</em><text>特批折扣：</text>{{ sales.sale002.TPDISC }}</label>
										<label
											class="f12"><em>●</em><text>促销折扣：</text>{{ sales.sale002.CXDISC }}</label>
									</view>
								</view>
								<view class="touch-list list-delete" @click="remove_union(sales)">
									<image src="@/images/img2/ka-shanchu.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="totals">
						<view>
							<em></em>
							<label>总数量：<text>{{ unpaid_total_quantity }}</text></label>
							<label>总金额：<text>￥{{ unpaid_total_amount }}</text></label>
							<label>总折扣：<text>￥{{ unpaid_total_discount }}</text></label>
						</view>
						<button class="btn" @click="to_payment">确认支付</button>
						<!-- <button class="btn" style="margin-left: 10px;" @click="to_printer">打印格式</button> -->
					</view>
				</view>
				<CouponActivateFail v-if="view.current_part_view == 'coupon_activate_fail'"></CouponActivateFail>
				<!-- 起始卡号 -->
				<CardNumEntry :show.sync="view.no_input" :scan_code="view.scan_code"></CardNumEntry>
			</view>
			<view class="operation operation-correct">
				<view class="sorting">
					<view class="a-z">
						<image src="@/images/img2/shuakalr.png" mode="widthFix" @click="coupon_segment_input">
						</image>
					</view>
					<view class="a-z">
						<image src="@/images/cuxiaohd-dlu.png" mode="widthFix" @click="select_special_discount">
						</image>
					</view>
					<view class="a-z" style="display:block;height:105px;">
						<image src="@/images/img2/cuxsxiao.png" mode="widthFix"></image>
						<view class="shifoubox" @click="CheckPromotion">
							<view class="shibtn" v-if="checkPromotion">
								是
							</view>
							<view class="weishibtn" v-if="!checkPromotion">
								是
							</view>
							<view class="weifoubtn" v-if="checkPromotion">
								否
							</view>
							<view class="foubtn" v-if="!checkPromotion">
								否
							</view>
						</view>
					</view>
				</view>
			</view>
			<SpecialDisc v-if="view.enable_special_discount" :zkdatas="source.discount_infos" :product="source.sale002">
			</SpecialDisc>
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
	import Head from '@/pages/Home/Component/Head.vue';
	import Menu from '@/pages/KQSale/CardCouponMain/Menu.vue';

	import member from '@/api/hy/MemberInterfaces.js';
	import Sale from '@/utils/sale/card_coupon.js';
	import card_sale from '@/api/business/card_sale.js';
	import coupon_sale from '@/api/business/coupon_sale.js';
	import util from '@/utils/util.js';
	import sales from '@/utils/sale/saleClass.js';
	import main from '@/api/business/main.js';
	import common from '@/api/common.js';

	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	import {
		RequestSend
	} from '@/api/business/da.js';
	import {
		Sale3Model,
		Sale3ModelAdditional
	} from '@/bll/PaymentBusiness/bll.js';
	//组件部分
	import CouponActivateFail from '@/pages/KQSale/CouponSale/CouponActivateFail.vue';
	import CouponSaleSteps from '@/pages/KQSale/CouponSale/CouponSaleSteps.vue';
	var $ = null;
	export default {
		name: "CouponSale",
		mixins: [coupon_sale],
		components: {
			Head,
			Menu,
			PrinterPage,
			CouponActivateFail,
			CouponSaleSteps
		},
		data() {
			return {
				form: {
					start_coupon_no: "",
					end_coupon_no: "",
				},
				view: {
					select_coupon_segment: null,
					no_input: false,
					swipe_tip: false,
					big_customer: false,
					enable_customer: true,
					enable_special_discount: false,
					current_part_view: "coupon_activate",
					scan_code: true
				},
				source: {
					enable_credit: false,
					sale001: null,
					sale002: [],
					sale003: [],
					sale006: [],
					sxsale001: null,
					sale2_union_sale6: [],
					sale6_map_style: new Map(),
					coupon_active_success: false,
					big_customer_info: null,
					discount_infos: null,
					discount_type: 'NO'
				},
				sale: null,
				container: null,
				ban_type: [],
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 256, //二维码宽
				qrCodeHeight: 256, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				FKDA_INFO: [], //付款信息
				_sale2_count: 0,
				checkPromotion: false,
				CXData: [], //促销数据
				cxfsArr: [], //促销跟踪数据
			}
		},
		computed: {
			unpaid_total_quantity() {
				return this.source.sale002.map(sale2 => sale2.QTY).reduce((prev_qty, next_qty) => prev_qty + next_qty, 0);
			},
			unpaid_total_amount() {
				// return util.newFloat(this.source.sale001?.TNET || 0);
				return this.source.sale002.map(sale2 => util.newFloat(sale2.NET)).reduce((p, n) => p + n, 0).toFixed(2);
			},
			unpaid_total_discount() {
				return this.source.sale002.map(sale2 => util.newFloat(sale2.DISCRATE)).reduce((p, n) => p + n, 0).toFixed(2);
			},
			coupon_segment_total_amount() {
				return $(function(sale2, sale6) {
					return sale2.NET;
				})
			},
			get_union() {
				return $(function(sale6) {
					return this.source.sale2_union_sale6.find(sales => sales.sale006.includes(sale6));
				})
			},
			get_text_style() {
				return $(function(sale6) {
					return this.source.sale6_map_style.get(sale6)?.text_style;
				})
			}
		},
		watch: {
			'form.start_coupon_no'(n, o) {
				console.log("[Watch-Coupon]券号发生变更...");
			},
			'view.no_input'(n, o) {
				if (n === true) {
					uni.$once("GetCardNums", $(function(data) {
						console.log("[Watch-Number-Info]获取到号码信息:", data);
						console.log("[Watch-Number-Info]sale6列表数据:", this.source.sale006);
						if (data.type === 'N') return; //取消不进行查询操作
						console.warn("[Watch-Number-Info]开始判断起始结束券号是否重复...");
						let added = this.coupons_segment_repeat_judge(`${data.begin_num}-${data.end_num}`, this
							.source.sale006.map(sale6 => `${sale6.KQIDS}-${sale6.KQIDE}`));
						console.warn("[Watch-Number-Info]判断起始结束券号是否重复结果：", added);
						if (added) {
							util.simpleMsg('当前起始或结束券号已被添加，请重新录入!')
							return;
						}
						this.form.start_coupon_no = data.begin_num;
						this.form.end_coupon_no = data.end_num || data.begin_num;
						if (this.form.start_coupon_no) //真值才允许查询
							this.coupon_sale();
					}));
				} else if (n === false) {
					uni.$off("GetCardNums");
				}
			},
			'source.sale002'(n, o) {
				if (n.length === 0) {
					this.factory.reset_generators();
					this.$refs.steps.set_step(1);
				} else {
					this.$refs.steps.set_step(2);
				}
				if (this.source.sale001)
					this.source.sale001.TLINE = n.length;
				else
					return;
				this.re_computed_sales(this.source.sale001, n);
				console.log("sale2发生变化：", n);
				this._sale2_count = n.length;
				console.log("[WatchSale2]变化长度记录到SALE1上:", this.source);
			},
			'source.discount_type'(n, o) {
				$(this.total_discount_computed, false);
			},
			'source.sale001'(n, o) {
				if (n && n.DKHID) { //如果设置的值合法
					if (this.source.big_customer_info && source.big_customer_info
						.DKHID) { //判断sale001是否生成，如果已经生成那么设置其大客户id信息
						this.source.sale001.DKFID = source.big_customer_info.DKHID;
					}
				}
			},
			'source.big_customer_info'(n, o) { //如果设置了大客户信息
				if (n && n.DKHID) { //如果设置的值合法
					if (this.source.sale001) { //判断sale001是否生成，如果已经生成那么设置其大客户id信息
						this.source.sale001.DKFID = n.DKHID;
						this.$refs.steps.set_step(3);
					}
				}
			},
		},
		methods: {
			//勾选促销
			CheckPromotion: function() {
				this.checkPromotion = !this.checkPromotion;
				this.total_discount_computed();
				if (this.checkPromotion)
					util.simpleMsg("已生效促销！", false);
				else
					util.simpleMsg("已取消促销！", true);
				return;
				// uni.showModal({
				// 	title: "提示",
				// 	content: "是否生效促销？",
				// 	success: suc => {
				// 		if (suc.confirm) {
				// 			this.checkPromotion = true;
				// 		} else {
				// 			this.checkPromotion = false;
				// 		}
				// 		this.total_discount_computed();
				// 	}
				// })
			},
			coupon_segment_input() {
				if (common.CheckSign()) {
					this.view.no_input = true
				}
			},
			switch_to_page(name) {
				util.simpleModal("提示", "是否确认切换业务类型?", $(function(res) {
					if (res) {
						this.view.current_part_view = name;
					}
				}))
			},
			async get_discount_data(id) {
				return await main.GetZKDatasAll(id);
			},
			async get_payment_infos() {
				return await RequestSend(`SELECT FKID,SNAME,JKSNAME,MEDIA FROM FKDA`, $(function(res) {
					if (res.code) {
						this.FKDA_INFO = JSON.parse(res.data);
						util.setStorage('FKDA_INFO', this.FKDA_INFO)
						console.log("[GetPaymentInfos]获取支付方式:", this.FKDA_INFO);
					} else {
						console.log("[GetPaymentInfos]获取付款方式失败!", res);
					}
				}))
			},
			async coupon_info_search() {
				return await member.coupon_sale.CouponInfoSearch({
					coupon_start: this.form.start_coupon_no
				})
			},
			async coupon_store_search(id) {
				return await member.coupon_sale.CouponStoreSearch({
					begin_num: this.form.start_coupon_no,
					end_num: this.form.end_coupon_no,
					material_id: id,
					khid: this.KHID
				})
			},
			async coupon_segment_valid() {
				return await member.coupon_sale.CouponValid({
					coupon_start: this.form.start_coupon_no,
					coupon_end: this.form.end_coupon_no,
					khid: this.KHID
				})
			},
			async coupon_segment_distribute() {
				let combine_sale2 = this.sales_process()?.sale002; //合并sale2
				console.log("[CouponSegmentDistribute]合并后信息:", combine_sale2);
				let sale2_and_sale6 = {};
				this.source.sale2_union_sale6.forEach(sales => {
					if (!sale2_and_sale6[sales.sale002.SPID]) {
						sale2_and_sale6[sales.sale002.SPID] = [];
					}
					sale2_and_sale6[sales.sale002.SPID].push({ //push到对应的商品集合中
						start_no: sales.sale006.KQIDS,
						end_no: sales.sale006.KQIDE,
						count: sales.sale006.QTY
					});
				});
				return await member.coupon_sale.CouponDistribute({
					bill: this.source.sale001.BILL,
					khid: this.KHID,
					appid: getApp().globalData.appid,
					coupon_infos: combine_sale2.map((sale2, index) => ({
						no: index + 1,
						disc: sale2.DISCRATE,
						count: sale2.QTY || 0,
						goods: sale2_and_sale6[sale2.SPID] || [],
						total_denomination: sale2.NET
					}))
				})
			},
			async coupon_segment_activate() {
				return member.coupon_sale.CouponActivation({
					// bill: "",
					bill: this.source.sale001.BILL,
					khid: this.KHID //测试错误参数激活后续进行重试操作
				});
			},
			async coupon_sale() {
				console.log("[CouponSale]开始售券流程...");
				var good_id = null;
				await this.coupon_info_search().then($(function(res) {
					console.log("[CouponSale]券信息查询:", res);
					if (res.code) {
						good_id = res.data.coupon_good_no;
						console.warn("[CouponSale]券号段物料号:", good_id);
						return this.coupon_store_search(good_id);
					} else {
						util.simpleMsg("券信息查询有误!", true)
					}
				})).then($(function(res) {
					console.log("[CouponSale]券库存校验:", res);
					let data = res.data;
					if (res.code && data?.length && data[0].CARDNUM != 0) {
						return this.coupon_segment_valid();
					} else {
						util.simpleMsg("券库存校验有误，请检查是否在当前门店券库存!", true)
					}
				})).then($(async function(res) {
					console.log("[CouponSale]券可发售号段校验:", res);
					if (res.code) {
						try {
							let product_info = await this.sale.MatchSP(good_id, res.data.coupon_count,
								res.data.coupon_value);
							console.log("[CouponSale]券商品信息匹配:", product_info);
							if (this.source.sale001 === null) { //判断是否存在 sale001，不存在则创建
								this.source.sale001 = this.factory.get_sale001({
									ZNET: product_info.NET,
									TNET: product_info.NET,
									DKFID: '80000000', //default
									KQXSTYPE: 'SQ',
									THTYPE: '0',
									BILL_TYPE: 'Z111',
									XSTYPE: '1',
									CUID: 'SQ'
								});
							}
							let sale002 = this.factory.get_sale002(this.source.sale001, product_info);
							sale002.STR2 = this.form.start_coupon_no + "-" + this.form
								.end_coupon_no; //记录一下号段 用于删除时候联查
							let sale006 = this.factory.get_sale006(this.source.sale001, {
								QTY: res.data.coupon_count,
								SPID: good_id,
								KQIDS: this.form.start_coupon_no,
								KQIDE: this.form.end_coupon_no,
								KQIDSTR: this.form.start_coupon_no + "-" + this.form
									.end_coupon_no,
							});
							this.source.sale002.push(sale002);
							this.source.sale006.push(sale006);
							this.source.sale6_map_style.set(sale006, {
								text_style: "left:0"
							});
							this.source.sale2_union_sale6.push({
								sale002,
								sale006
							});
							console.log("[CouponSale]已加入到待支付列表:", this.source);
							this.total_discount_computed();
						} catch (e) {
							console.log("[CouponSale]券商品信息查询失败:", e);
						}
					} else {
						util.simpleMsg("券可销售号段校验有误!" + (res?.msg || ""), true);
					}
				})).then($(function() {
					this.form = this.$options.data().form;
					console.log("[CouponSale]重置表单信息完成...");
				}));
			},
			async coupon_activate() {
				this.$refs.steps.set_step(4);
				if (this.source.sale001.ROUND > 0) { //手工折扣分摊
					this.source.sale002 = main.ManualDiscount(this.source.sale001, this.source.sale002);
					console.log("[PayedResult]手工折扣分摊后的商品信息：", this.source.sale002);
				}
				console.log("[CouponActivate]准备开始券号激活流程...");
				await this.coupon_segment_distribute().then($(function(res) {
					console.log("[CouponActivate]券号激活申请结果:", res);
					if (res.code) {
						return this.coupon_segment_activate();
					} else {
						this.source.sale001.STR1 = "fail";
						this.source.sale001.YN_OK = "F";
						this.source.sale001.REASON = "FPF";
						util.simpleMsg("券激活申请失败!" + (res?.msg || ""), true);
					}
				})).then($(function(res) {
					console.log("[CouponActivate]券号激活结果:", res);
					if (res.code) {
						this.source.sale001.STR1 = "success";
						util.simpleMsg("券激活成功!", true);
					} else {
						this.source.sale001.STR1 = "fail";
						this.source.sale001.YN_OK = "F";
						this.source.sale001.REASON = "QJHF";
						util.simpleMsg("券激活失败!" + (res?.msg || ""), true);
					}
				}))
				console.log("[CouponActivate]券号激活流程执行完毕...");
				this.save_orders();
			},
			async save_orders() {
				console.log("[SaveOrders]准备开始生成订单，并上传订单信息到服务器...");
				try {
					let created_sales_result = await this.sale.Completed({
						SALE001: this.source.sale001,
						SALE002: this.source.sale002,
						SALE003: this.source.sale003,
						SALE006: this.source.sale006,
						SXSALE001: this.source.sxsale001,
						CXMDFSMX: this.cxfsArr
					});
					console.log("[SaveOrders]上传完毕，上传结果：", created_sales_result);
					$(this.receipt_printing.bind(this.source), false);
					this.reset_form();
					util.simpleMsg(created_sales_result.msg, !created_sales_result.code);
				} catch (e) {
					console.log("[SaveOrders]执行异常:", e);
				}
			},
			async get_coupon_sale_allow_payment() {
				console.log("[GetCouponSaleAllowPayment]开始查询...");
				let pay_id = (await common.Database().Query.Single("POSCSZMX").Condition("POSCS='SKSQFKID'").Condition(
					`POSCSZID='${this.POSCSZID}'`).Excute())?.POSCSNR;
				console.log("[GetCouponSaleAllowPayment]查询完毕:", pay_id);
				if (pay_id) {
					let allow_type = pay_id.split(',');
					console.log("[GetCouponSaleAllowPayment]允许使用的FKID:", allow_type);
					this.ban_type = util.getStorage("PayWayList").filter(i => !allow_type.includes(i.fkid)).map(i => i
						.fkid);
					console.log("[GetCouponSaleAllowPayment]禁止使用的FKID:", this.ban_type);
				}
			},
			async reset_form() {
				this.factory.reset_generators();
				this.source = this.$options.data().source;
				this.source.discount_infos = await this.get_discount_data(); //初始化折扣信息数据
				this._sale2_count = 0;
				uni.$emit('set-dkf', "默认大客户"); //通知外部 恢复默认大客户
				this.checkPromotion = false
				this.cxfsArr = [] //促销跟踪数据
			},
			total_discount_computed() {
				console.log("[TotalDiscountComputed]开始计算特殊折扣和手工折扣...");
				$(this.reset_discount, false); //重置折扣
				$(this.discount_computed, false); //特殊折扣计算
				$(this.goods_discount_summary, false); //最后将折扣额汇总到sale001上
				$(this.coupon_price_record.bind(null, this.source.sale002, this.source.sale006), false);
				console.log("[TotalDiscountComputed]特殊折扣和手工折扣计算完毕...");
			},
			reset_discount() {
				console.warn("[DiscountComputed]先清除折扣信息数据...");
				card_sale.FallbackSpecialDiscount(this.source.sale001, this.source.sale002); //清除折扣信息
				console.warn("[DiscountComputed]折扣信息数据清除完毕...");
			},
			goods_discount_summary() { //对sale002折扣、总金额进行汇总，并存入sale001
				console.log("[GoodsDiscountSummary]开始对sale002中的总金额，折扣额进行汇总...");
				let sale1 = this.source.sale001,
					sale2 = this.source.sale002;
				if (!(sale1 && sale2?.length)) {
					console.log("[GoodsDiscountSummary]记录sale001或sale002为空:", this.source);
					return;
				}
				let total_bzdisc = sale2.map(s2 => s2.BZDISC).reduce((p, n) => p + n, 0); //标准折扣
				let total_lsdisc = sale2.map(s2 => s2.LSDISC).reduce((p, n) => p + n, 0); //临时折扣
				let total_tpdisc = sale2.map(s2 => s2.TPDISC).reduce((p, n) => p + n, 0); //特批折扣
				let total_cxdisc = sale2.map(s2 => s2.CXDISC).reduce((p, n) => p + n, 0); //促销折扣
				let total_amount = sale2.map(sale2 => sale2.NET).reduce((prev_net, next_net) => prev_net +
					next_net, 0);
				console.log("[GoodsDiscountSummary]汇总的折扣总金额信息:", {
					total_bzdisc,
					total_lsdisc,
					total_tpdisc,
					total_cxdisc,
					total_amount
				});
				this.source.sale001.TCXDISC = util.newFloat(total_cxdisc);
				this.source.sale001.TBZDISC = util.newFloat(total_bzdisc);
				this.source.sale001.TLSDISC = util.newFloat(total_lsdisc);
				this.source.sale001.TTPDISC = util.newFloat(total_tpdisc);
				this.source.sale001.BILLDISC = util.newFloat(total_bzdisc + total_lsdisc + total_tpdisc + total_cxdisc);
				this.source.sale001.TDISC = this.source.sale001.BILLDISC;
				this.source.sale001.TNET = util.newFloat(total_amount);
				this.source.sale001.ZNET = util.newFloat(total_amount);
				console.log("[GoodsDiscountSummary]对sale002的总金额、折扣汇总完毕:", this.source.sale001);
			},
			remove_union(sales) {
				//其中 sale2_union_sale6 中储存的是 1对1 的sale2和sale6的数据对象，如果sale6发生删除，则应该删除对应的组合对象和对应的sale2数据
				console.log("数据对比sales.sale002：", sales.sale002);
				console.log("数据对比this.source.sale002：", this.source.sale002);

				let remove_sale2_index = this.source.sale002.indexOf(sales.sale002),
					remove_sale6_index = this.source.sale006.indexOf(sales.sale006),
					remove_union_index = this.source.sale2_union_sale6.indexOf(sales);
				remove_sale2_index = this.source.sale002.findIndex(f => {
					return (f.STR2 == sales.sale002.STR2 && f.SPID == sales.sale002.SPID);
				});
				remove_sale6_index = this.source.sale006.findIndex(f => {
					return (f.KQIDSTR == sales.sale006.KQIDSTR && f.SPID == sales.sale006.SPID);
				});
				remove_union_index = this.source.sale2_union_sale6.findIndex(f => {
					return (f.sale002.STR2 == sales.sale002.STR2 && f.sale002.SPID == sales.sale002.SPID && f
						.sale006.KQIDSTR == sales.sale006.KQIDSTR && f.sale006.SPID == sales.sale006.SPID);
				});
				console.log("[RemoveUnion]即将要删除的元素索引:", {
					remove_sale2_index,
					remove_sale6_index,
					remove_union_index
				});
				if (remove_sale6_index != -1) {
					this.source.sale002.splice(remove_sale2_index, 1); //删除外部sale002中的数据
					this.source.sale006.splice(remove_sale6_index, 1); //删除外部sale006中的数据
					this.source.sale2_union_sale6.splice(remove_union_index, 1); //删除外部组合对象数组中的数据
					this.source.sale6_map_style.delete(sales.sale006); //删除对应的样式集合对象
					this.re_computed_sales(this.source.sale001, this.source.sale002); //重新计算sale相关信息
				}
				console.log("[RemoveUnion]删除信息后:", this.source);
				$(this.total_discount_computed, false); //重新汇总折扣
			},
			touch_list(e, sale6) {
				console.log("[TouchList]点击列表:", {
					event: e,
					sale6
				});
				if (this.source.sale6_map_style.get(sale6).text_style == "left:0px") {
					this.source.sale6_map_style.get(sale6).text_style = "left:-50px";
				} else {
					this.source.sale6_map_style.get(sale6).text_style = "left:0px";
				}
				this.source.sale2_union_sale6.sort();
			},
			select_special_discount() {
				console.log("[SelectSpecialDiscount]特殊折扣选择:", this.source);
				this.view.enable_special_discount = true;
			},
			discount_computed(sale2) { //使用特殊折扣进行计算
				if (this.checkPromotion) { //促销计算
					let res = main.MatchCXDatas(this.CXData, this.source.sale002, this.source.sale001);
					this.source.sale002 = res.sale2;
					this.cxfsArr = res.cxfsArr;
					console.log("002增加促销后的新数据：", this.source.sale002);
				} else { //折扣计算
					let discount_computed_params = {};
					if (this.source.discount_type != 'NO') {
						console.warn("[DiscountComputed]准备折扣计算参数...", {
							param_sale2: sale2,
							context_sale2: this.source.sale002
						});
						discount_computed_params.ZKType = this.source.discount_type;
						discount_computed_params.ZKData = this.source.discount_infos;
						main.MatchZKDatas(discount_computed_params, sale2 || this.source
							.sale002); //可使用传入的sale2，如果不存在则使用当前上下文的sale2
						console.warn("[DiscountComputed]折扣计算完毕...");
					}
					console.warn("[DiscountComputed]SALE002增加折扣后的新数据:", this.source.sale002);
				}
				//渲染列表显示
				this.source.sale2_union_sale6.map(r => {
					let obj = this.source.sale002.find(r1 => (r1.SPID == r.sale002.SPID && r1.STR2 == r.sale002
						.STR2));
					if (obj) {
						r.sale002.NET = obj.NET;
						r.sale002.PRICE = obj.PRICE;
						r.sale002.DISCRATE = obj.DISCRATE;
						r.sale002.CXDISC = obj.CXDISC;
						r.sale002.BZDISC = obj.BZDISC;
						r.sale002.LSDISC = obj.LSDISC;
						r.sale002.TPDISC = obj.TPDISC;
						r.sale002.YN_CXDISC = obj.YN_CXDISC;
					}
				})
				console.log("sale26:", this.source.sale2_union_sale6);
			},
			craft_discount_computed(sale1, sale2) { //手工折扣额的处理
				if (!sale1) return;
				console.log("[CraftDiscountComputed]原金额:", sale1.TNET);
				let SKY_DISCOUNT = util.newFloat(((sale1.TNET * 10) % 1) / 10, 2);
				console.log("[CraftDiscountComputed]手工折扣额：", SKY_DISCOUNT);
				sale1.TNET = util.newFloat(Number(sale1.TNET) - SKY_DISCOUNT, 2);
				sale1.ZNET = util.newFloat(Number(sale1.ZNET) - SKY_DISCOUNT, 2);
				sale1.BILLDISC = util.newFloat(Number(sale1.BILLDISC) + SKY_DISCOUNT, 2);
				sale1.TCXDISC = util.newFloat(Number(sale1.TCXDISC) + SKY_DISCOUNT, 2);
				sale1.ROUND = SKY_DISCOUNT;
				sale1.TDISC = util.newFloat(Number(sale1.TDISC) + SKY_DISCOUNT, 2);
				console.log("[CraftDiscountComputed]SALE001计算手工折扣后的新数据：", this.source);
			},
			receipt_printing(source) { //打印代码写在下面
				let that = this;
				//调用打印
				let printerPram = {
					"PRINTNUM": 1,
					"XSTYPE": "SQ",
					"ISFP": "Y",
				};

				let arr3 = that.source.sale003;
				let fkdaRes = that.FKDA_INFO;
				arr3.forEach(function(item, index) {
					try {
						item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
						item.balance = item.balance;
					} catch (e) {
						item.SNAME = "";
						item.balance = 0;
					}
				});
				that.$refs.printerPage.sksqBluePrinter(that.source.sale001, that.source.sale002, arr3, that.source.sale006,
					printerPram);
			},
			credit_sales_create() {
				console.log("[CreditSalesCreate]准备开始创建赊销单据记录...");
				this.source.sxsale001 = this.factory.get_sxsale001(this.source.sale001, {
					SX_STATUS: 1,
					DKFNAME: this.source.big_customer_info.NAME,
					DKFID: this.source.big_customer_info.DKHID,
				});
				console.log("[CreditSalesCreate]创建赊销单据记录完成...");
				console.log("[CreditSalesCreate]准备开始创建赊销单据支付记录...");
				this.source.sale003.push(this.factory.get_sale003(this.source.sale001, {
					FKID: "ZG01",
					AMT: this.source.sale001.TNET
				}));
				console.log("[CreditSalesCreate]创建赊销单据支付记录完成...");
				console.log("[CreditSalesCreate]创建结果:", this.source);
			},
			credit_order_setting() {
				if (this.source.enable_credit) {
					console.log("[CreditOrderSetting]设置sale1的BILL_TYPE和XSTYPE...");
					this.source.sale001.BILL_TYPE = "Z112";
					this.source.sale001.XSTYPE = 6;
					console.log("[CreditOrderSetting]sale1设置完毕:", this.source.sale001);
				} else {
					console.log("[CreditOrderSetting]设置sale1的BILL_TYPE和XSTYPE...");
					this.source.sale001.BILL_TYPE = "Z111";
					this.source.sale001.XSTYPE = 1;
					console.log("[CreditOrderSetting]sale1设置完毕:", this.source.sale001);
				}
			},
			sales_process() { //单据处理，复制现在的sale1和sale2还有sale6，然后进行手工折扣额计算再进行
				let sale001 = Object.assign({}, this.source.sale001);
				let sale002 = $(function() {
					let new_sale2_list = []; //此时的sale2还是和券记录1对1，需要根据sale2.spid进行合并处理，并且合并折扣值
					this.source.sale002.forEach($(function(sale2) {
						let same_good = new_sale2_list.find(ns2 => ns2.SPID == sale2.SPID);
						if (same_good) { //是否存在已有的商品，如果有：
							//合并累加部分字段进行总和
							same_good.QTY += sale2.QTY;
							same_good.JFDISC += sale2.JFDISC;
							same_good.LSDISC += sale2.LSDISC;
							same_good.TPDISC += sale2.TPDISC;
							same_good.BZDISC += sale2.BZDISC;
							same_good.HYDISC += sale2.HYDISC;
							same_good.CXDISC += sale2.CXDISC;
							same_good.BILLDISC += sale2.BILLDISC;
							same_good.DISC += sale2.DISC;
							same_good.DISCRATE += sale2.DISCRATE;
							same_good.NET += sale2.NET;
						} else { //如果没有：
							new_sale2_list.push(Object.assign({}, sale2));
						}
					}));
					return new_sale2_list;
				}, false);
				this.craft_discount_computed(sale001, sale002);
				return {
					sale001,
					sale002
				}
			},
			to_payment() {
				console.log("[ToPayment]准备开始进入支付操作，判断是否存在提交的商品信息操作...", this.source);
				// this.craft_discount_computed(this.source.sale001); //手工折扣计算
				if (!this.source.sale001 || !this.source.sale002.length) {
					util.simpleMsg('请添加券后再进行此操作!')
					return;
				}
				console.log("[ToPayment]判断是否进行赊销操作...", this.source.enable_credit);
				this.credit_order_setting();

				if (this.source.enable_credit) {
					this.credit_sales_create();
					let sales = this.sales_process(); //复制避免折扣影响到原数据 +计算手工折扣
					this.source.sale001 = sales.sale001;
					this.source.sale002 = sales.sale002;
					this.coupon_activate(); //开始券申请激活流程
				} else {
					let sales = this.sales_process(); //复制避免折扣影响到原数据 +计算手工折扣
					this.sale.RedirectToPayment({
						sale001: sales.sale001,
						sale002: sales.sale002,
						paid: this.source.paid,
						ban_type: this.ban_type,
						action: 'Payment',
						complet: $(function(result) {
							console.log("[ToPayment]支付完成，支付结果:", result);
							if (result.code) {
								let salas = result.data;
								this.source.sale001 = Object.cover(this.factory.get_sale001(), salas
									.sale1_obj);
								this.source.sale002 = salas.sale2_arr.map($(function(sale2) {
									return this.factory.get_sale002(this.source.sale001, sale2)
								}));
								this.source.sale003 = salas.sale3_arr.map($(function(sale3) {
									return this.factory.get_sale003(this.source.sale001, sale3)
								}));
								this.coupon_activate(); //开始券申请激活流程
							}
						})
					});
				}
			},
			event_monitor() {
				console.log("[EventMonitor]事件处理...");
				this.event_register('ReturnSale', $(function(data) {
					console.log('[EventMonitor]表单信息清空...');
					util.simpleModal("提示", "是否确认清空当前数据？", $(function(res) {
						if (res) {
							this.reset_form();
							util.simpleMsg("清空成功！");
						}
					}))
				}));
				this.event_register('close-tszk', $(function(data) {
					console.log("[EventMonitor]用户选择的折扣信息:", data);
					this.source.discount_type = data; //记录折扣类型
					console.log("[EventMonitor]用户选择的折扣处理后的SALE2信息:", this.source.sale002);
					this.checkPromotion = false;
					this.view.enable_special_discount = false; //关闭特殊折扣弹窗
				}));
				this.event_register("big-customer-close", $(async function(data) {
					console.log("[Created]大客户回调:", data);
					console.log("[Created]当前是否有特殊折扣:", this.source.discount_type);
					if (data.exists_credit) {
						this.source.enable_credit = true; //启用赊销
					}
					if (Object.keys(data).length === 0 && this.source.discount_type == 'TP') {
						this.source.discount_type = "NO";
					}
					this.checkPromotion = false; //取消促销
					let arr = this.source.sale002.filter(f => f.CXDISC > 0);
					if (arr.length > 0) {
						this.reset_discount(); //重置促销折扣
						//渲染列表显示
						this.source.sale2_union_sale6.map(r => {
							let obj = this.source.sale002.find(r1 => (r1.SPID == r.sale002.SPID &&
								r1.STR2 == r.sale002.STR2));
							if (obj) {
								r.sale002.NET = obj.NET;
								r.sale002.PRICE = obj.PRICE;
								r.sale002.DISCRATE = obj.DISCRATE;
								r.sale002.CXDISC = obj.CXDISC;
								r.sale002.BZDISC = obj.BZDISC;
								r.sale002.LSDISC = obj.LSDISC;
								r.sale002.TPDISC = obj.TPDISC;
								r.sale002.YN_CXDISC = obj.YN_CXDISC;
							}
						})
					}
					this.source.big_customer_info = data;
					this.source.discount_infos = await this.get_discount_data(data.DKFID);
					console.log("[Created]获取当前大客户折扣信息:", this.source.discount_infos);
				}));
				this.event_register('coupon-activate-fail-close', $(function(data) {
					console.log("[EventMonitor]退出券激活界面...");
					this.view.current_part_view = "coupon_activate";
				}));
			},
			event_register(event_name, event_callback) {
				uni.$off(event_name);
				uni.$on(event_name, event_callback);
			}
		},
		mounted() {
			this.event_monitor(); //批量事件处理
			this.get_payment_infos(); //获取支付信息
			this.get_coupon_sale_allow_payment(); //获取允许使用的支付方式类型
		},
		async created() {
			this.sale = new Sale.InitKQSale(this, uni, getApp().globalData.store, "GiftCoupon_Active");
			this.source.discount_infos = await this.get_discount_data(); //初始化折扣信息数据
			this.CXData = await main.GetCXDatasAll(getApp().globalData.store.KHID);
			$ = util.callContainer(this);
			//test code...
			// this.KHID = 'K200QTD006';
		},
		destroyed() {
			uni.$off('ReturnSale');
		}
	}
</script>

<style>
	.right-correct {
		display: flex;
		flex-direction: column;
	}

	.listof-correct {
		width: auto;
		flex: 1;
		display: flex;
		align-items: center;
		padding-bottom: 22px;
		padding-top: 20px;
		box-sizing: border-box;
	}

	.prolist-correct {
		height: 100%;
	}

	.operation-correct {
		height: 100%;
		margin-top: -40px;
	}

	.shifoubox {
		height: 73px;
		width: 34px;
		margin: 0 auto;
		background: #E0EAE9;
		border-radius: 20px;
		border: 2px solid #006B44;
		font-weight: 400;
		font-size: 16px;
		color: #FFFFFF;
		position: relative;
	}

	.shibtn {
		width: 28px;
		height: 28px;
		background: #006B44;
		border-radius: 50%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 5%;
		left: 8%;
	}

	.foubtn {
		width: 28px;
		height: 28px;
		background: #006B44;
		border-radius: 50%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 5%;
		left: 8%;
	}

	.weishibtn {
		width: 28px;
		height: 28px;
		background: #e0eae9;
		border-radius: 50%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 5%;
		left: 8%;
		color: #006b44;
	}

	.weifoubtn {
		width: 28px;
		height: 28px;
		background: #e0eae9;
		border-radius: 50%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 5%;
		left: 8%;
		color: #006b44;
	}

	.firstzjk {
		width: 80.5% !important;
		display: flex !important;
		/* justify-content: space-between !important; */
	}

	.f12 {
		font-size: 12px !important;
	}
</style>