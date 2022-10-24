<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	/* @import url(@/static/style/takeout.css); */
	@import url(@/static/style/Extract/extract.css);
</style>

<template>
	<view class="content">
		<!-- <menu_page :menuIndex="6" :sec_index="2"></menu_page> -->
		<view class="right">
			<!-- <menu_head></menu_head> -->
			<view class="listof">
				<view class="prolist">
					<view class="commodity">
						<view class="hh">
							<view class="hotcakes">
								<image src="../../images/tuidan.png" mode="widthFix"></image> 退单业务
								<!-- <view class="classifys">
									<text class="curr">全部</text><text>今日</text><text>近三天</text>
								</view> -->
							</view>
							<view>
								<view class="prints">
									<view class="sousuo">
										<label @click="ShowSearch()">
											<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
										</label>
										<view class="criterias" v-if="Criterias" style="z-index: 99999;">
											<view class="critlist"><text>订单号：</text>
												<input type="text" v-model="p_bill" />
											</view>
											<view class="critlist"><text>客户名称：</text>
												<input type="text" v-model="p_name" />
											</view>
											<!-- <view class="critlist"><text>销售日期：</text>
												<picker mode="date" @change="changeDate">
													<view class="uni-input">{{p_date}}</view>
												</picker>
											</view> -->
											<view class="confs">
												<button class="btn btn-qx" @click="Empty()">清空</button>
												<button class="btn" @click="Search()">查询</button>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="h2">赊销退单 <label></label></view>
						<NoData v-if="Orders.length==0"></NoData>
						<!-- 小类循环 -->
						<view class="products" v-else>
							<view class="procycle">
								<!-- 订单循环 -->
								<view class="li" v-for="(item,index) in Orders" :class="curIndex === index? 'curr':' '"
									@click="ChooseOrder(item,index)">
									<view class="h3">
										<text>单号：{{item.BILL}}</text>
										<text class="price">￥{{item.DNET}}</text>
									</view>
									<view class="cods">
										<label>下单时间：{{item.SALEDATE}}</label>
										<label>客户编码：{{item.DKFID}}</label>
										<label>客户名称：{{item.DKFNAME}}</label>
									</view>
									<view class="handles"><text></text>
										<button class="btn" @click="GetSXOrderDetails(item)">退单</button>
									</view>
								</view>
							</view>
							<view class="details" v-if="false">
								<view class="detinfo">
									<view class="member">
										<label>
											<image class="touxiang" src="@/images/touxiang.png"></image>
											<label
												class="xixin"><text>{{Order.STR5}}</text><text>{{Order.STR6}}</text></label>
										</label>
									</view>
									<view class="harvest">
										<label><text>赊销单号：</text><text>{{Order.BILL}}</text></label>
										<label><text>赊销金额：</text><text>{{Order.DNET}}</text></label>
										<!-- <label><text>订单备注：</text><text>{{Order.STR1}}</text></label> -->
									</view>
									<view class="goods">
										<!-- 商品循环 -->
										<view class="prolist" v-for="(item1,index1) in Details">
											<view class="h3">
												<label>
													<image src="@/images/dx-mrxk.png" mode="widthFix"></image>
													{{item1.SNAME}} — <text>￥{{item1.PRICE}}</text>
												</label>
												<view class="shuls"><text>×{{item1.QTY}}</text></view>
											</view>
											<view class="cods">
												<view>
													<label>
														<image src="@/images/dx-bm.png" mode="widthFix"></image>
														{{item1.SPID}}
													</label>
													<label>
														<image src="@/images/dx-dw.png" mode="widthFix"></image>
														{{item1.UNIT}}
													</label>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="operat">
									<!-- <button class="btn" @click="ConfirmReback()">取消</button> -->
									<button class="btn" @click="ConfirmToPay()">确认退单</button>
								</view>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
		<!-- 子单信息 -->
		<view class="boxs" v-if="false">
			<view class="memberes">
				<view class="pop-r">
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label class="meminfo"><text>会员ID</text><text>{{Order.CUID}}</text></label>
						</label>
						<text>清空</text>
					</view>
					<view class="h5"><text>单号:{{Order.BILL}}</text></view>
					<view class="goods">
						<!-- 商品循环 -->
						<view class="prolist" v-for="(item,index) in Details">
							<view class="h3">
								<label>
									<image src="../../images/dx-mrxk.png" mode="widthFix"></image> {{item.SNAME}}
								</label>
								<text>X{{item.QTY}}</text>
							</view>
							<view class="cods">
								<view>
									<label>
										<image src="../../images/dx-bm.png" mode="widthFix"></image>{{item.SPID}}
									</label>
									<label>
										<image src="../../images/dx-dw.png" mode="widthFix"></image>{{item.UNIT}}
									</label>
								</view>
								<text>￥{{item.NET}}</text>
							</view>
						</view>
					</view>
					<view class="ul">
						<view class="li"><text>总金额</text><text>￥{{Order.TNET}}</text></view>
						<view class="li"><text>件数</text><text>{{Order.TLINE}}</text></view>
						<!-- <view class="li"><text>折扣</text><text>-￥5</text></view> -->
						<view class="li"><text>应收金额</text><text>￥{{Order.TNET}}</text></view>
					</view>
					<view class="confirm">
						<button class="btn btn-qx" @click="statements=false">返 回</button>
						<button class="btn">确 认</button>
					</view>

					<!-- <view class="states" @click="Statements()">
					<text>结算单</text>
					<label>»</label>
				</view> -->

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _refund from '@/api/business/refundorder.js';
	// import menu_page from "@/components/menu_page/menu_page.vue";

	var that;
	export default {
		// components: {
		// 	menu_page
		// },
		data() {
			return {
				statements: false,
				Criterias: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				coupon_list: [],
				Newaddr: false,
				KHID: app.globalData.store.KHID,
				GSID: app.globalData.store.GSID,
				POSID: app.globalData.store.POSID,
				RYID: app.globalData.store.RYID,
				Orders: [],
				p_bill: "",
				p_name: "",
				p_date: dateformat.getYMD(),
				Order: {},
				Details: [],
				Sale3: [],
				curIndex: 0,
			}
		},
		watch: {
			Criterias: function(n, o) {
				if (!n) {
					that.Empty();
				}
			}
		},
		methods: {
			onLoad: function() {
				that = this;
				that.GetOrders(r => {
					that.GetSXOrderDetails(r[0]);
				});
			},
			GetOrders: function(func) {
				_refund.SXGetOrders({
						khid: that.KHID,
						bill: that.p_bill,
						dkfname: that.p_name
					},
					res => {
						console.log("查询结果:", res);
						if (res.code) {
							let data = JSON.parse(res.data);
							that.Orders = data;
							that.Criterias = false;
							if (func) func(data);
						} else {
							that.Orders = [];
							util.simpleMsg("暂无数据", true);
						}
					});
			},
			ChooseOrder: (e, i) => {
				that.curIndex = i;
				// that.GetSXOrderDetails(e);
			},
			GetSXOrderDetails: (e) => {
				that.Order = e;
				_refund.GetSXOrderDetails({
					bill: e.BILL,
					khid: e.KHID,
					saledate: e.SALEDATE
				}, res => {
					console.log("赊销详情单查询结果:", res);
					if (res.code) {
						let data = JSON.parse(res.data);
						that.Details = data.sale2;
						that.Sale3 = data.sale3;
						that.statements = true;
						that.ConfirmToPay();
					} else {
						that.Details = [];
						that.statements = true;
						util.simpleMsg("无详情数据", true);
					}
				})
			},
			changeDate: (e) => {
				console.log(e);
				that.p_date = e.detail.value;
			},
			//搜索
			Search: function() {
				that.GetOrders();
			},
			//清空查询条件
			Empty: () => {
				that.p_bill = "";
				that.p_name = "";
				that.p_date = dateformat.getYMD();
			},
			//退出
			Close: function() {
				uni.navigateBack();
			},
			Statements: function(e) {
				this.statements = !this.statements;
			},
			ShowSearch: function(e) {
				this.Criterias = !this.Criterias;
			},
			Memberlogin: function(e) {
				this.Memberinfo = true,
					this.Shoppingbags = false
			},
			Bagslist: function(e) {
				this.Shoppingbags = true,
					this.Memberinfo = false
			},
			Moreand: function(e) {
				this.Chargeback = !this.Chargeback
			},
			newlys: function(e) {
				this.Newaddr = true
			},
			ConfirmToPay: function() {
				uni.showModal({
					title: '提示',
					content: '是否确认退货',
					success: util.callBind(this, function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							console.log("[ConfirmToPay]order:", that.Order);
							this.$to_sale_pages('sale_credit_return_good', {
								sale1: that.Order,
								sale2: that.Details,
								sale3: that.Sale3,
							})
						}
					})
				})
			},
			//确认去退货
			_ConfirmToPay: function(order) {
				uni.showModal({
					title: '提示',
					content: '是否确认退货',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							_refund.CreditOrderRefund({
								khid: that.KHID,
								posid: that.POSID,
								ryid: that.RYID,
								dkhname: order.DKFNAME,
								bill: order.BILL,
								saledata: order.SALEDATE //new Date().toLocaleDateString()
							}, res => {
								console.log("退单结果：", res);
								if (res.code) {
									util.simpleMsg("退单成功");
									setTimeout(r => {
										that.GetOrders();
									}, 1500);
								} else {
									util.simpleMsg("退单失败:" + res.msg, true);
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		},
		created() {
			that = this;
			that.GetOrders(r => {
				//that.GetSXOrderDetails(r[0]);
			});
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}

	.handles button {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
	}

	.price {
		margin-top: 0;
	}

	.h2 {
		padding: 0 3% 1%;
		position: relative;
		line-height: 40rpx;
	}

	.h2 label {
		position: absolute;
		width: 140rpx;
		bottom: 20rpx;
		left: 3%;
		height: 8rpx;
		background: linear-gradient(90deg, #006B44 0%, rgba(0, 107, 68, 0) 100%);
		border-radius: 8rpx;
	}

	.details .goods {
		height: 65%;
	}

	.detinfo {
		height: 85%;
	}

	.products {
		height: 84%;
	}

	.products .details {
		justify-content: start;
	}

	.products .procycle {
		height: 100%;
		overflow: auto;
	}
	.products .procycle .li{
		height:176rpx;
	}
	.products .procycle .li .h3 {
		font-size: 28rpx;
		font-weight: 600;
	}

	.products .h3 text {
		font-weight: 600;
	}
</style>
