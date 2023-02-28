<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>
<template>
	<view class="content">
		<view class="right right-correct">
			<!-- 顶部导航栏 -->
			<Head :custom.sync="view.big_customer" :_ynDKF='view.enable_customer'></Head>
			<!-- 内容栏 -->
			<view class="steps">
				<view class="listep curr">
					<text class="xuhao">01</text>
					<view class="setname"><label>录入待售卡券</label><text>刷卡，扫券，或手动录入</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">02</text>
					<view class="setname"><label>确认折扣和金额</label><text>是否选大客户赊销等</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">03</text>
					<view class="setname"><label>支付</label><text>先支付，后激活/充值</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">04</text>
					<view class="setname"><label>等待激活/充值</label><text>已支付订单</text></view>
					<!-- <em>>>>>>></em> -->
				</view>
			</view>
			<view class="listof listof-correct">
				<view class="prolist prolist-correct zxpro " style="width: 92%;">
					<view class="choice">
						<view class="tab curr">
							<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
							<text>活动券激活</text>
						</view>
					</view>
					<view class="module" style="height: 66%;">
						<view class="hh">待售详情 <em></em></view>
						<!-- 没刷卡时显示 -->
						<view class="swipetip" v-if="view.swipe_tip">
							<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>请先刷卡录入</text>
						</view>
						<!-- 刷卡后显示卡列表 -->
						<view class="cardlist">
							<view class="ulli" v-for="sales in source.sale2_union_sale6">
								<image class="bgs" src="@/images/quan-bg.png" mode="widthFix"></image>
								<view class="h6">
									<label>￥{{ sales.sale002.PRICE }}<text>/{{ sales.sale002.QTY }}张</text></label>
									<view class="zje">
										<view><text>总金额</text>￥{{ sales.sale002.NET }}</view>
										<button @click="remove_union(sales)">
											<image src="@/images/img2/ka-shanchu.png"></image>
										</button>
									</view>
								</view>
								<view class="card-num">
									<label>始：<text>{{ sales.sale006.KQIDS }}</text></label>
									<label>终：<text>{{ sales.sale006.KQIDE }}</text></label>
								</view>
								<view class="statistic">
									<label><em>●</em><text>总折扣：</text>567</label>
									<label><em>●</em><text>默认折扣：</text>5</label>
									<label><em>●</em><text>标准折扣：</text>54</label>
									<label><em>●</em><text>特批折扣：</text>5</label>
								</view>
							</view>

						</view>
					</view>
					<view class="totals">
						<view>
							<em></em>
							<label>总数量：<text>{{ unpaid_total_quantity }}</text></label>
							<label>总金额：<text>￥{{ unpaid_total_amount }}</text></label>
						</view>
						<button class="btn" @click="ToPayment">确认支付</button>
					</view>
					<!-- 起始卡号 -->
					<CardNumEntry :show.sync="view.no_input"></CardNumEntry>
				</view>
				<view class="operation operation-correct">
					<view class="sorting">
						<view class="a-z">
							<image src="../../images/img2/shuakalr.png" mode="widthFix" @click="view.no_input=true">
							</image>
						</view>
						<view class="a-z">
							<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
						</view>
						<view class="a-z">
							<image src="@/images/img2/chikaren.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue';
	import member from '@/api/hy/MemberInterfaces.js';
	import Sale from '@/utils/sale/card_coupon.js';
	import util from '@/utils/util.js';
	import sales from '@/utils/sale/saleClass.js';
	import {
		Sale3Model,
		Sale3ModelAdditional
	} from '@/bll/PaymentBusiness/bll.js'
	var $ = null;
	export default {
		name: "CouponSale",
		components: {
			Head
		},
		data() {
			return {
				form: {
					start_coupon_no: "400000005787429980",
					end_coupon_no: "400000005787431313",
				},
				view: {
					select_coupon_segment: null,
					no_input: false,
					swipe_tip: false,
					big_customer: true,
					enable_customer: true,
				},
				source: {
					enable_credit: false,
					sale001: null,
					sale002: [],
					sale006: [],
					paid: [],
					sale2_union_sale6: []
				},
				sale: null,
				container: null,
			}
		},
		computed: {
			unpaid_total_quantity() {
				return this.source.sale002.map(sale2 => sale2.QTY).reduce((prev_qty, next_qty) => prev_qty + next_qty, 0);
			},
			unpaid_total_amount() {
				return this.source.sale001?.TNET || 0;
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
						let added = this.source.sale006.find(sale6 => sale6.KQIDS === data.begin_num || sale6
							.KQIDE === data.begin_num || sale6.KQIDS === data.end_num || sale6.KQIDE ===
							data.end_num);
						if (added) { //判断是否出现重合的券号
							util.simpleMsg('当前起始或结束券号已被添加，请重新录入!')
							return;
						}
						this.form.start_coupon_no = data.begin_num;
						this.form.end_coupon_no = data.end_num || data.begin_num;
						this.coupon_sale();
					}));
				} else if (n === false) {
					uni.$off("GetCardNums");
				}
			},
			'source.sale002'(n, o) {
				let sale001 = this.source.sale001,
					total_amount = this.source.sale002.map(sale2 => sale2.NET).reduce((prev_net, next_net) => prev_net +
						next_net, 0);
				sale001.TNET = total_amount;
				sale001.ZNET = total_amount;
			}
		},
		methods: {
			remove_union(sales) {
				let remove_sale2_index = this.source.sale002.indexOf(sales.sale002),
					remove_sale6_index = this.source.sale006.indexOf(sales.sale006),
					remove_union_index = this.source.sale2_union_sale6.indexOf(sales);
				if (remove_sale2_index != -1)
					this.source.sale002.splice(remove_sale2_index, 1);
				if (remove_sale6_index != -1)
					this.source.sale006.splice(remove_sale6_index, 1);
				if (remove_union_index != -1)
					this.source.sale2_union_sale6.splice(remove_union_index, 1);
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
					khid: "K200QTD006" || this.KHID
				})
			},
			async coupon_segment_valid() {
				return await member.coupon_sale.CouponValid({
					coupon_start: this.form.start_coupon_no,
					coupon_end: this.form.end_coupon_no,
					khid: "K200QTD006" || this.KHID
				})
			},
			coupon_sale() {
				console.log("[CouponSale]开始售券流程...");
				var good_id = null;
				this.coupon_info_search().then($(function(res) {
					console.log("[CouponSale]券信息查询:", res);
					if (res.code) {
						good_id = res.data.coupon_good_no;
						return this.coupon_store_search(good_id);
					} else {
						util.simpleMsg("券信息查询有误!" + (res?.msg || ""), true)
					}
				})).then($(function(res) {
					console.log("[CouponSale]券库存校验:", res);
					let data = res.data;
					if (res.code && data?.length && data[0].CARDNUM != 0) {
						return this.coupon_segment_valid();
					} else {
						util.simpleMsg("券库存校验有误，请检查是否在当前门店券库存!" + (res?.msg || ""), true)
					}
				})).then($(async function(res) {
					console.log("[CouponSale]券可发售号段校验:", res);
					if (res.code) {
						try {
							let product_info = await this.sale.MatchSP(good_id, res.data.coupon_count, res
								.data.coupon_value);
							if (this.source.sale001 === null) { //判断是否存在 sale001，不存在则创建
								this.source.sale001 = this.factory.get_sale001({
									ZNET: product_info.NET,
									TNET: product_info.NET,
								});
							}
							let sale002 = this.factory.get_sale002(this.source.sale001, product_info);
							let sale006 = this.factory.get_sale006(this.source.sale001, {
								QTY: res.data.coupon_count,
								SPID: good_id,
								KQIDS: this.form.start_coupon_no,
								KQIDE: this.form.end_coupon_no
							});
							this.source.sale002.push(sale002);
							this.source.sale006.push(sale006);
							this.source.sale2_union_sale6.push({
								sale002,
								sale006
							});
							console.log("[CouponSale]已加入到待支付列表:", this.source);
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
			ToPayment() {
				this.CreateCreditSale();
				this.sale.RedirectToPayment({
					sale001: this.source.sale001,
					sale002: this.source.sale002,
					paid: this.source.paid,
					action: 'Payment',
					complet: $(function(result) {
						console.log("[ToPayment]支付完成:", result);
						if (result.code) {

						}
					})
				});
			},
			CreateCreditSale() {
				if (this.source.enable_credit)
					this.source.paid.push(Sale3ModelAdditional(Sale3Model({
						fkid: 'ZG01',
						type: 'MDSX',
						bill: util.getBill(),
						name: "门店赊销",
						amount: this.source.sale001.TNET
					}), { //业务配置字段（支付状态设定为成功）
						fail: false //定金显示为成功
					}));
			}
		},
		created() {
			this.sale = new Sale.InitKQSale(this, uni, getApp().globalData.store, "GiftCoupon_Active");
			$ = util.callContainer(this);
			uni.$on("big-customer-close", $(function(data) {
				console.log("[Created]大客户回调:", data);
				if (data.exists_credit)
					this.source.enable_credit = true; //启用赊销
			}));
		},
		destroyed() {
			uni.off("big-customer-close");
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
		padding-bottom: 60px;
		padding-top: 10px;
		box-sizing: border-box;
	}

	.prolist-correct {
		height: 100%;
	}

	.operation-correct {
		height: 100%;
	}
</style>
