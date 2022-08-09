<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/extract.css);
</style>

<template>
	<view class="content">
		<menu_page :menuIndex="6" :sec_index="2"></menu_page>
		<view class="right">
			<menu_head></menu_head>
			<view class="listof">
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
						<!-- 小类循环 -->
						<view class="products">
							<view class="h2">赊销退单 <label></label></view>

							<view class="procycle">
								<!-- 订单循环 -->
								<view class="li" v-for="(item,index) in Orders">
									<view class="h3">
										<text>单号：{{item.BILL}}</text>
										<text class="price">￥{{item.DNET}}</text>
									</view>
									<view class="cods">
										<label>下单时间：{{item.SALEDATE}}</label>
										<label>客户编码: {{item.DKFID}}</label>
										<label>客户名称: {{item.DKFNAME}}</label>
									</view>
									<view class="handles"><text></text>
										<button class="btn"@click="ConfirmToPay(item)">确定</button>
									</view>
								</view>
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
				Orders: [],
				p_bill: "",
				p_name: "",
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
				that.GetOrders();
			},
			GetOrders: function(bill, date) {
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
					if (res.code) {
						let data = JSON.parse(res.data);
						that.Details = data;
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
			//确认去退货
			ConfirmToPay:function(order){
				uni.showModal({
					title: '提示',
					content: '是否确认退货',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
							_refund.CreditOrderRefund({
								khid:this.KHID,
								posid:this.POSID,
								ryid:this.RYID,
								dkhname:order.DKFNAME,
								bill:order.BILL,
								saledata:new Date().toLocaleDateString()
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}
</style>
