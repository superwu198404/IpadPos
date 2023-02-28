<template>
	<!-- <view style="border: 1px solid red;height: 100%;width: 100%;">
		<h1>券销售界面</h1>
		<div>
			<input v-model="form.start_coupon_no" placeholder="请输入起始券号..." />
			<input v-model="form.end_coupon_no" placeholder="请输入截至券号..." />
		</div>
		<button @click="coupon_sale">售券</button>
	</view> -->
	<view class="content">
		<view class="right">
			<!-- 顶部导航栏 -->
			<Head></Head>
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
			<view class="listof" style="width: 100%;">
				<view class="prolist zxpro" style="width: 92%;">
					<view class="choice">
						<view class="tab curr">
							<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
							<text>VIP售卡充值</text>
						</view>
						<view class="tab">
							<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>VIP售卡充值
						</view>
	
						<view class="ckr">“持卡人姓名”：877888999</view>
					</view>
					<view class="module" style="height: 66%;">
						<view class="hh">待售详情 <em></em></view>
						<!-- 没刷卡时显示 -->
						<view class="swipetip" v-if="swipe_tip">
							<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>请先刷卡录入</text>
						</view>
						<!-- 刷卡后显示卡列表 -->
						<view class="cardlist" v-for="item in unpaid_coupon_list">
							<view class="ulli">
								<image class="bgs" src="@/images/quan-bg.png" mode="widthFix"></image>
								<view class="h6">
									<label>￥{{item.PRICE}}<text>/{{item.QTY}}张</text></label>
									<view class="zje">
										<view><text>总金额</text>￥{{item.NET}}</view>
										<button>
											<image src="@/images/img2/ka-shanchu.png"></image>
										</button>
									</view>
								</view>
								<view class="card-num">
									<label>始：<text>ID4332143223456767565</text></label>
									<label>终：<text>ID4332143223456767575</text></label>
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
							<label>总数量：<text>2134</text></label>
							<label>总金额：<text>￥82134</text></label>
						</view>
						<button class="btn">确认支付</button>
					</view>
					<!-- 起始卡号 -->
					<CardNumEntry v-if="no_input"></CardNumEntry>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="a-z">
							<image src="../../images/img2/shuakalr.png" mode="widthFix" @click="no_input=true">
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
	import member from '@/api/hy/MemberInterfaces.js'
	import Sale from '@/utils/sale/card_coupon.js'
	import util from '../../utils/util';
	import sales from '@/utils/sale/saleClass.js';
	export default {
		name: "CouponSale",
		data() {
			return {
				form: {
					start_coupon_no: "400000005787429980",
					end_coupon_no: "400000005787431313",
					is_batch: false,
				},
				view:{
					select_coupon_segment: null,
					no_input: false,
					swipe_tip: false,
				},
				source:{
					coupon_list: [],
					sales:{
						sale001: null,
						sale002: null,
						sale003: null,
						sale006: null
					}
				},
				sale: null,
			}
		},
		computed:{
			unpaid_coupon_list(){
				return [];
			}
		},
		watch: {
			start_coupon_no(n, o) {
				if (is_batch) {
					this.form.end_coupon_no = n;
				}
			}
		},
		methods: {
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
				this.coupon_info_search().then(util.callBind(this, function(res) {
					console.log("[CouponSale]券信息查询:", res);
					if (res.code) {
						good_id = res.data.coupon_good_no;
						return this.coupon_store_search(good_id);
					} else {
						util.simpleMsg("券信息查询有误!" + (res?.msg || ""), true)
					}
				})).then(util.callBind(this, function(res) {
					console.log("[CouponSale]券库存校验:", res);
					let data = res.data;
					if (res.code && data?.length && data[0].CARDNUM != 0) {
						return this.coupon_segment_valid();
					} else {
						util.simpleMsg("券库存校验有误，请检查是否在当前门店券库存!" + (res?.msg || ""), true)
					}
				})).then(util.callBind(this, async function(res) {
					console.log("[CouponSale]券可发售号段校验:", res);
					if (res.code) {
						try{
							let product_info = await this.sale.MatchSP(good_id, res.data.coupon_count,res.data.coupon_value);
							console.log("[CouponSale]券商品信息查询(sale002):",product_info);
							let sale006 = new sales.sale006();
							sale006.QTY = res.data.coupon_count;
							sale006.SPID = good_id;
							sale006.KQIDS = this.form.start_coupon_no;
							sale006.KQIDE = this.form.end_coupon_no;
							this.$to_sale_pages('sale_coupon', {
								sale2: [product_info],
								sale6: [sale006],
								start_no:this.form.start_coupon_no,
								end_no:this.form.end_coupon_no,
								coupon_count:res.data.coupon_count
							})
						}catch(e){
							console.log("[CouponSale]券商品信息查询失败:",e);
						}
					} else {
						util.simpleMsg("券可销售号段校验有误!" + (res?.msg || ""), true);
					}
				}));
			}
		},
		created() {
			this.sale = new Sale.InitKQSale(this, uni, getApp().globalData.store, "GiftCoupon_Active");
		}
	}
</script>

<style>
</style>
