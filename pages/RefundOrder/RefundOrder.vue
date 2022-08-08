<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	/* @import url(@/static/style/Extract/extract.css); */
	@import url(@/static/style/takeout.css);
</style>

<template>
	<view class="content">
		<menu_page :menuIndex="6" :sec_index="0"></menu_page>
		<view class="right">
			<menu_head></menu_head>
		
				<view class="prolist">
					<view class="commodity">
						<view class="hh">
							<view class="hotcakes">
								<image src="../../images/tuihuo.png" mode="widthFix"></image> 退单业务
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
											<view class="critlist"><text>销售日期：</text>
												<picker mode="date" fields="day" @change="changeDate">
													<view class="uni-input">{{p_date}}</view>
												</picker>
											</view>
											<view class="confs">
												<button class="btn btn-qx" @click="Empty()">清空</button>
												<button class="btn" @click="Search()">查询</button>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 小类循环 -->
						<view class="products">
							<!-- <view class="h2">销售退单 <label></label></view>
 -->
							<view class="procycle">
								<!-- 订单循环 -->
								<view class="li" v-for="(item,index) in Orders">
									<view class="h3">
										<text>单号：{{item.BILL}}</text>
										<text class="price">￥{{item.TNET}}</text>
									</view>
									<view class="cods">
										<label>{{item.SALEDATE}} {{item.SALETIME}}</label>
										<label>订单类型 {{item.XSTYPE}}</label>
									</view>
									<view class="handles"><text></text><button class="btn"
											@click="GetOrderDetails(item)">详情</button></view>
								</view>
							</view>
							<view class="details"  v-if="statements">
								<view class="meminfo">
									<view class="member">
										<label>
											<image class="touxiang" src="../../images/touxiang.png"></image>
											<label class="meminfo"><text>会员ID</text><text>{{Order.CUID}}</text></label>
										</label>
										<text>清空</text>
									</view>
									<view class="h5"><text>单号：{{Order.BILL}}</text></view>
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
										<button class="btn" @click="Confirm">确 认</button>
									</view>
								
									<!-- <view class="states" @click="Statements()">
									<text>结算单</text>
									<label>»</label>
								</view> -->
								
								</view>
											
							</view>
						</view>
					</view>
				</view>

		
		</view>

		<!-- 子单信息 -->
		<!--  -->
		<view class="boxs" v-if="statements">
			<view class="memberes">
				<view class="pop-r">
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label class="meminfo"><text>会员ID</text><text>{{Order.CUID}}</text></label>
						</label>
						<text>清空</text>
					</view>
					<view class="h5"><text>单号：{{Order.BILL}}</text></view>
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
						<button class="btn" @click="Confirm">确 认</button>
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
	import {
		Refund
	} from '@/bll/RefundBusiness/bll.js'

	var that;
	export default {
		data() {
			return {
				statements: false,
				Criterias: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				coupon_list: [],
				Newaddr: false,
				Orders: [],
				p_bill: "K200QTD0051220808142432432",
				// p_bill: "",
				p_date: dateformat.getYMD(),
				Order: {},
				Details: {}
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
				that.GetOrders(this.p_bill);
			},
			GetOrders: function(bill, date) {
				console.log("[GetOrders]订单号:",bill);
				console.log("[GetOrders]时间:",date);
				_refund.GetOrders(this.KHID, this.GSID, this.POSID, bill, date, res => {
					console.log("查询结果:", res);
					if (res.code && res.msg.length > 0) {
						that.Orders = res.msg;
						that.Criterias = false;
					} else {
						that.Orders = [];
						util.simpleMsg("暂无数据", true);
					}
				});
			},
			GetOrderDetails: (e) => {
				that.Criterias = false;
				that.Order = e;
				let yw_bill = common.CreateBill(that.KHID, that.POSID);
				_refund.GetOrderDetails(yw_bill, e.BILL, e.SALEDATE, res => {
					console.log("详情单查询结果:", res);
					if (res.code && res.msg.length > 0) {
						that.Details = res.msg;
						that.statements = true;
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
				that.GetOrders(that.p_bill, that.p_date);
			},
			//清空查询条件
			Empty: () => {
				that.p_bill = "";
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
			Confirm:function(){
				console.log("退单确认!开始退款...");
				Refund.call(this,this.Order.BILL).then(util.callBind(this,function(){
					console.log("[Confirm]退单表数据(SALE1,2,3):",this.$store.state.location);
					uni.navigateTo({
						url: "../Payment/PaymentAll"
					})
				})).catch(util.callBind(this,function(err){
					console.log("退单表数据查询异常:",err);
				}));
			}
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}
	.meminfo {
		position: unset;
	}
	.ul{
		border:none;
	}
	.goods{
		min-height: 42%;
	}
</style>
