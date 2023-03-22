<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<view class="right">

			<!-- 顶部导航栏-->
			<Head :_ynDKF="false" :custom="false" :_showSale="true" :type='"kq_sale"'></Head>
			<view class="prolist">
				<view class="hh" style="padding-right:3.7%;">
					<view class="hotcakes">
						<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 卡务操作
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
				</view>
				<view class="commodity">
					<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
					<!-- <view class="typeoper">
						<label><button>卡延期</button><image src="@/images/img2/danju.png" mode="widthFix"></image></label>
					</view> -->
					<view class="number">
						<view class="labnum">
							<text>卡操作：</text>
							<view class="chaxun">
								<view class="chanxz">
									<label :class="CurType=='Delay'?'curr':''" @click="select_type('Delay')">卡延期
										<em>✓</em></label>
									<label :class="CurType=='Loss'?'curr':''" @click="select_type('Loss')">卡挂失
										<em>✓</em></label>
								</view>
							</view>
						</view>
						<view class="labnum">
							<text>卡号：</text>
							<view class="chaxun">
								<view class="label">
									<image src="@/images/img2/swiping_card.png" mode="widthFix" @click="swiping_card()">
										<!-- <image v-else src="@/images/img2/zhifucx-cu.png" mode="widthFix" @click="scan_code_handle()"> -->
										<input type="text" placeholder="请输入查询卡号" v-model="CardNumber" />
								</view>
								<button class="btn" @click="GetCardInfo()">查询</button>
							</view>
						</view>
					</view>
					<view class="partics">
						<view class="cardqs">
							<view class="cardlist">
								<view class="ulli" style="height: 483rpx;">
									<view class="touch-list list-touch">
										<image class="bgs" src="@/images/img2/kaqchaxun.png" mode="widthFix"></image>
										<view class="h6">
											<label><em></em>{{CardInfo.spName||"暂无"}}</label>
										</view>
										<view class="denominat"
											v-if="CardInfo.cardType=='Z001'||CardInfo.cardType=='Z005'">
											<label>￥<text>{{CardInfo.balance||0}}</text></label>
										</view>
										<view class="denominat" v-else>
											<view v-if="CardInfo.amount>0">
												<label>￥<text>{{CardInfo.amount}}</text></label>
											</view>
											<view v-else><label>￥<text>{{CardInfo.balance||0}}</text></label></view>
										</view>
										<view class="cardinfo">
											<view class="leftinfo">
												<label >卡类型：{{typeDefault(CardInfo.cardType,"暂无")}}</label>
												<view class="kname">卡号：{{CardInfo.cardId||"暂无"}}</view>
												<!-- <view class="card-num">
													<label>{{typeDefault(CardInfo.cardType,"暂无")}}</label>
													<view>卡号：{{CardInfo.cardId||"暂无"}}</view>
												</view> -->
											</view>

										</view>
										<view class="statistic">
											<!-- <text>卡状态：{{statusDefault(CardInfo.status,"暂无")}}</text> -->
											<text>有效期：{{formateDate(CardInfo.expireDate)}}</text>
										</view>
									</view>
									<view class="touch-list list-delete">
										<image src="@/images/img2/ka-shanchu.png" mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="carddet">
							<view class="totals">
								<view>
									<em></em>
									<label>卡号：<text>{{CardInfo.cardId||"暂无"}}</text></label>
								</view>
							</view>
							<view class="kainfolist">
								<label>
									<text>卡名称：</text><text>{{CardInfo.spName||"暂无"}}</text>
								</label>
								<label>
									<text>卡类型：</text><text>{{typeDefault(CardInfo.cardType,"暂无")}}</text>
								</label>
								<label>
									<text>卡状态：</text><text>{{statusDefault(CardInfo.status,"暂无")}}</text>
								</label>
								<label v-if="CardInfo.cardType=='Z001'||CardInfo.cardType=='Z005'">
									<text>余额：</text><text>￥{{CardInfo.balance||0}}</text>
								</label>
								<label v-else>
									<view v-if="CardInfo.amount>0"><text>面额：</text><text>￥{{CardInfo.amount||0}}</text>
									</view>
									<view v-else><text>余额：</text><text>￥{{CardInfo.balance||0}}</text></view>
								</label>
								<label>
									<text>有效期：</text><text>{{formateDate(CardInfo.expireDate)}}</text>
								</label>
								<!-- <label>
									<text>使用时间：</text><text>45644</text>
								</label> -->
								<label>
									暂无更多信息...
								</label>
							</view>
							<view class="operat">
								<button class="btn btn-qx" @click="Cancel">取消</button>
								<button class="btn btn-h" @click="Confirm">确认</button>
								<button class="btn btn-qx" v-if="CurType=='Loss'" @click="showCardRen=true">持卡人</button>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>
		<!-- 持卡人信息 -->
		<chikaren :show.sync="showCardRen"></chikaren>
	</view>
</template>

<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue';

	//业务处理
	import bussiness from '@/api/business/card_coupon_query.js';
	import util from '@/utils/util.js';
	import member from "@/api/hy/MemberInterfaces.js";
	import _card_sale from "@/api/business/card_sale.js";
	import _card_coupon from "@/utils/sale/card_coupon.js";
	// import _query_sale from "@/api/business/query_sale.js";

	var that;
	export default {
		name: "CardDelay",
		components: {
			Head
		},
		data() {
			return {
				CardNumber: "",
				CardInfo: {},
				CKRInfo: {},
				showCardRen: false,
				CurType: "Delay",
				Store: getApp().globalData.store
			}
		},
		async created() {
			that = this;
			that.OrderBill = _card_coupon.getBill(that.Store);
			// let a = await _query_sale.GetRJData('K200QTD005','2023-03-20');
			console.log("日结销售数据：", a);
		},
		mounted() {
			uni.$on("ConfirmCKR", that.ConfirmCKR);
			uni.$on("ReturnSale", that.ClearSale);
		},
		destroyed() {
			uni.$off("ConfirmCKR");
			uni.$off("ReturnSale");
		},
		computed: {
			statusDefault() {
				return function(v, def_val = '暂无') {
					if (v) {
						if (v == 'Z001') {
							return '正常';
						} else if (v == 'Z002') {
							return '冻结'
						} else if (v == 'Z003') {
							return '注销'
						} else if (v == 'Z004') {
							return '挂失'
						} else if (v == 'Z005') {
							return '挂失'
						} else if (v == 'Z006') {
							return '挂失'
						} else
							return "未激活";
					} else
						return def_val;
				}
			},
			typeDefault() {
				return function(v, d = "暂无") {
					if (v) {
						if (v == 'Z001') {
							return '实体VIP卡';
						} else if (v == 'Z002') {
							return '实体礼品卡'
						} else if (v == 'Z003') {
							return '电子礼品卡'
						} else if (v == 'Z005') {
							return '电子储值卡'
						} else
							return d;
					} else
						return d;
				}
			},
			formateDate() {
				return function(v) {
					if (v) {
						if (v.indexOf("-") < 0) { //20230916
							let a = v.substr(0, 4) + '-' + v.substr(4, 2) + '-' + v.substr(6, 2);
							return a;
						}
						return v;
					} else
						return "暂无";
				}
			},
		},
		methods: {
			select_type(data) {
				if (that.CardInfo && Object.keys(that.CardInfo).length > 0) {
					util.simpleModal("提示", "是否确认切换业务？", res => {
						if (res) {
							that.ResetBill(data);
						}
					})
				} else {
					that.ResetBill(data);
				}
			},
			ResetBill(e = 'Delay') {
				that.CardNumber = "";
				that.CurType = e;
				that.CardInfo = {};
				that.CKRInfo = {};
				that.OrderBill = _card_coupon.getBill(that.Store);
			},
			swiping_card() {
				member.GetTLCard(getApp().globalData.store, function(res) {
					if (!res.code) {
						util.simpleMsg(res.msg, !res.code);
						return;
					}
					that.CardNumber = res.data;
					that.GetCardInfo();
				})
			},
			//获取卡信息
			GetCardInfo: function() {
				that.CardNumber = that.CardNumber.trim();
				if (!that.CardNumber) {
					util.simpleMsg("请录入卡号", true);
					return;
				}
				member.CARD_QUERY("查询中...", {
					data: {
						card_num: that.CardNumber
					}
				}, async res => {
					if (res.code) {
						console.log("卡信息查询结果：", res.data);
						let cardInfo = res.data;
						cardInfo.cardId = that.CardNumber;
						let spinfo = await _card_sale.MatchSP(cardInfo.materielId); //商品信息匹配
						if (spinfo) {
							cardInfo.spName = spinfo.SNAME;
						}
						that.CardInfo = cardInfo;
					} else {
						util.simpleMsg(res.msg, true);
					}
				}, err => {
					util.simpleMsg(err.msg, true);
				});
			},
			//确认
			Confirm: function() {
				if (!that.CardInfo || Object.keys(that.CardInfo).length == 0) {
					util.simpleMsg("请先查询卡信息", true);
					return;
				}
				util.simpleModal("提示", "是否确认此操作？", res1 => {
					if (res1) {
						if (that.CurType == 'Delay') {
							_card_sale.CARD_DELAY({
								salebill: that.OrderBill,
								card_num: that.CardInfo.cardId,
								ryid: that.Store.RYID,
								ry_name: that.Store.RYNAME,
								khid: that.Store.RYID,
								kh_name: that.Store.RYID,
							}, res => {
								if (res.code) {
									util.simpleMsg("延期成功！");
								} else {
									util.simpleModal("提示", res.msg);
								}
								that.ResetBill(); //重置
							})
						} else {
							if (!that.CKRInfo || Object.keys(that.CKRInfo).length == 0) {
								util.simpleMsg("请先填写顾客信息", true);
								return;
							}
							if (that.CardInfo.cardType != 'Z001') {
								util.simpleMsg("抱歉，卡类型错误", true);
								return;
							}
							_card_sale.REPORT_LOSS({
								salebill: that.OrderBill,
								card_num: that.CardInfo.cardId,
								ryid: that.Store.RYID,
								ry_name: that.Store.RYNAME,
								phone: that.CKRInfo.phone,
								id_card_no: that.CKRInfo.idcard,
								user_name: that.CKRInfo.name,
							}, res => {
								if (res.code) {
									util.simpleMsg("挂失成功！");
								} else {
									util.simpleModal("提示", res.msg);
								}
								that.ResetBill(); //重置
							})
						}
					}
				})
			},
			//取消
			Cancel: function() {
				that.ResetBill(); //重置
			},

			//清空数据
			ClearSale: function() {
				util.simpleModal("提示", "是否确认清空当前数据？", res => {
					if (res) {
						that.ResetBill();
					}
				})
			},
			//持卡人回调事件
			ConfirmCKR: function(e) {
				console.log("持卡人回调事件：", e);
				that.showCardRen = false;
				if (e && e.type == 'Y') {
					that.CKRInfo = e;
				} else {
					that.CKRInfo = {};
				}
			},
		},
	}
</script>


<style>
	.commodity .number {
		padding: 0;
		width: 100%;
		display: flex;
	}

	.chaxun {
		display: flex;
		align-items: center;
	}

	.commodity .number .labnum {
		margin: 2% 0;
		display: flex;
		flex-direction: column;
		height: auto;
		width: 46%;
	}

	.commodity .number button {
		width: 25%;
		height: 70rpx;
		line-height: 70rpx;
		margin: 0 0 0 20rpx;
	}

	.commodity .number {
		display: flex;
	}

	.commodity .totals view label {
		font-size: 32rpx;
		font-weight: 700;
		color: #333;
		padding-left: 2%;
		white-space: nowrap;
	}

	.totals view em {
		height: 40rpx;
		margin: 0 8rpx 0 30rpx;
	}

	.totals button {
		background-color: #FBB955;
		width: 300rpx;
	}

	.cardlist {
		box-shadow: 0px 10px 30px 1px rgba(66, 177, 75, 0.16);
		position: relative;
		padding: 0;
	}

	.cardlist .ulli {
		width: 100%;
		margin: 0;
	}

	.cardlist .ulli .h6 {
		background: none;
		padding: 2% 2% 0;
		height: 120rpx;
		width: 70%;
		/* overflow: hidden; */
	}

	.cardlist .ulli .h6 label {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		position: relative;
		font-size: 46rpx;
		color: #006B44;
		height: 120rpx;
		line-height: 60rpx;
	}

	.cardlist .ulli .h6 em {
		display: block;
		width: 68rpx;
		height: 6rpx;
		position: absolute;
		bottom: 20rpx;
		left: 19%;
		z-index: 6;
		border-radius: 6rpx;
		background-color: #006B44;
	}

	.cardlist .touch-list {
		padding: 6% 0 0;
	}

	.ulli .card-num {
		border-bottom: none;
	}

	.ulli .card-num view {
		color: #42B14B;
		font-size: 30rpx;
		padding-left: 4%;
		padding-top: 14rpx;
	}

	.ulli .card-num label {
		padding: 0;
	}

	.cardinfo {
		padding: 10.5% 4% 1%;
		transform: translateY(-60rpx);
	}

	.statistic {
		padding: 3% 3%;
		justify-content: space-between;
		color: #fff;
		/* margin-top: 18rpx; */
	}

	.statistic text:nth-child(2) {
		background-color: #FFE8E4;
		color: #FE694B;
		font-size: 26rpx;
		padding: 4rpx 10rpx;
	}

	.chanxz {
		width: 85%;
		padding: 2% 15% 0 0;
		position: relative;
	}

	.chanxz label {
		width: 23%;
		font-size: 28rpx;
		margin: 0 1% !important;
		border-color: #FFCFC5;
	}

	.chanxz label:nth-child(1) {
		border-color: #FBB955;
		color: #FBB955;
	}

	.chanxz label:nth-child(2) {
		border-color: #FE694B;
		color: #FE694B;
	}

	.chanxz label:nth-child(1).curr {
		border-color: #FBB955;
		background: linear-gradient(180deg, #FFEEB9 0%, #FFFFFF 100%);
		color: #FBB955
	}

	.chanxz label:nth-child(2).curr {
		background: linear-gradient(180deg, #FFD2C9 0%, #FFFFFF 100%);
		border: 2rpx solid #FE694B;
	}

	.chanxz label:nth-child(1).curr em {
		background: #FBB955;
	}

	.chanxz label:nth-child(2).curr em {
		background: #FE694B;
	}

	.chanxz .quanbu {
		width: 90rpx;
		position: absolute;
		top: 19rpx;
		right: 3%;
		font-size: 18rpx;
		color: #42B14B;
	}

	.chanxz .quanbu image {
		width: 22rpx;
		height: 22rpx;
	}

	.label picker {
		width: 100%;
		height: 100%;
		border-radius: 5px;
		background: #F5F5F5;
	}

	.picker {
		width: 100%;
		height: 100%;
	}

	.operat {
		width: 100%;
		display: flex;
		position: absolute;
		bottom: 0;
		padding: 2% 0;
	}

	.operat button {
		margin: 0 4%;
	}
</style>
