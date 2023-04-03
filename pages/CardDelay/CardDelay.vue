<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
<!-- 		<PrinterPage ref="printerPage" style="display: none;" /> -->
		<view class="right">

			<!-- 顶部导航栏-->
			<Head :_ynDKF="false" :custom="false" :_showSale="true" :_ynMsg='false'></Head>
			<view class="prolist">
				<view class="hh" style="padding-right:3.7%;">
					<view class="hotcakes">
						<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 卡务操作
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
					<view class="tishis">请注意所选的操作类型是否符合顾客要求！</view>
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
									<image src="@/images/img2/swiping_card.png" mode="widthFix" @click="swiping_card()"
										v-if="CurType=='Delay'">
										<!-- <image v-else src="@/images/img2/zhifucx-cu.png" mode="widthFix" @click="scan_code_handle()"> -->
										<input type="text" placeholder="请输入查询卡号" v-model="CardNumber" />
										<button v-if="CardNumber" @click="CardNumber=''">×</button>
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
												<label>卡类型：{{typeDefault(CardInfo.cardType,"暂无")}}</label>
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
						<view class="cardqs" v-if="CurType=='Loss'">
							<view class="cardlist">
								<view class="ulli" style="height: 483rpx;">
									<view class="touch-list chikaren">
										<image class="bgs" src="@/images/dl-bjhw.png" mode="widthFix" style="top:0;">
										</image>
										<view class="h7">
											<image src="@/images/img2/quanmcheng.png"></image>
											卡号：{{CardInfo.cardId||"暂无"}}
										</view>
										<view class="clues" style="margin-top:14rpx;">
											<text>姓名：</text>
											<view class="label">
												<input type="text" placeholder="请输入姓名" v-model="CKRInfo.name" />
												<button v-if="CKRInfo.name" @click="CKRInfo.name=''">×</button>
											</view>
										</view>
										<view class="clues">
											<text>手机号：</text>
											<view class="label"><input type="number" v-model="CKRInfo.phone"
													placeholder="请输入手机号" />
												<button v-if="CKRInfo.phone" @click="CKRInfo.phone=''">×</button>
											</view>
										</view>
										<view class="clues">
											<text>身份证号：</text>
											<view class="label"><input type="text" v-model="CKRInfo.idcard"
													placeholder="请输入身份证号" />
												<button v-if="CKRInfo.idcard" @click="CKRInfo.idcard=''">×</button>
											</view>
										</view>
									</view>
									<view class="jutiinfo">
										<label><text>卡名称：{{CardInfo.spName||"暂无"}}</text></label>
										<label><text>卡类型：{{typeDefault(CardInfo.cardType,"暂无")}}</text></label>
										<label><text>卡状态：{{statusDefault(CardInfo.status,"暂无")}}</text></label>
										<label><text>卡余额：￥{{CardInfo.balance||0}}</text></label>
									</view>
								</view>
							</view>
							<view class="operat">
								<button class="btn btn-qx" @click="Cancel">取消</button>
								<button class="btn btn-h" @click="Confirm">确认</button>
								<!-- <button class="btn btn-qx" v-if="CurType=='Loss'" @click="showCardRen=true">持卡人</button> -->
							</view>
						</view>
						<view class="carddet" v-else>
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
								<label>
									暂无更多信息...
								</label>
							</view>
							<view class="operat">
								<button class="btn btn-qx" @click="Cancel">取消</button>
								<button class="btn btn-h" @click="Confirm">确认</button>
								<!-- <button class="btn btn-qx" v-if="CurType=='Loss'" @click="showCardRen=true">持卡人</button> -->
							</view>
						</view>

					</view>

				</view>
			</view>
		</view>
		<!-- 持卡人信息 -->
		<!-- <chikaren :show.sync="showCardRen"></chikaren> -->
	</view>
</template>

<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue';

	//业务处理
	import util from '@/utils/util.js';
	import member from "@/api/hy/MemberInterfaces.js";
	import _card_sale from "@/api/business/card_sale.js";
	import _card_coupon from "@/utils/sale/card_coupon.js";
	import _business from "@/utils/business_dictionary.js";
	import common from '@/api/common.js';

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
				Store: getApp().globalData.store,
				_sale2_count: 0
			}
		},
		watch: {
			CardInfo: function(n, o) {
				console.log("卡信息发生变动：", n);
				if (this.CardInfo.cardId || this.CardInfo.cardId != "") {
					this._sale2_count = 1;
				}else{
					this._sale2_count = 0;
				}
			}
		},
		created() {
			that = this;
			that.OrderBill = _card_coupon.getBill(that.Store);
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
						return _business.card_status[v];
					} else
						return def_val;
				}
			},
			typeDefault() {
				return function(v, d = "暂无") {
					if (v) {
						return _business.card_type[v];
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
				if (common.CheckSign()) {
					if (that.CardInfo && Object.keys(that.CardInfo).length > 0) {
						util.simpleModal("提示", "是否确认切换业务？", res => {
							if (res) {
								that.ResetBill(data);
							}
						})
					} else {
						that.ResetBill(data);
					}
				}
			},
			ResetBill(e = 'Delay', code = true) {
				if (code) { //成功才清除
					that.CardNumber = "";
					that.CurType = e;
					that.CardInfo = {};
					that.CKRInfo = {};
					Vue.set(that.CKRInfo, "name", ""); //响应式清除
					Vue.set(that.CKRInfo, "phone", ""); //响应式清除
					Vue.set(that.CKRInfo, "idcard", ""); //响应式清除
				}
				that.OrderBill = _card_coupon.getBill(that.Store);
			},
			swiping_card() {
				if (common.CheckSign()) {
					member.GetTLCard(getApp().globalData.store, function(res) {
						if (!res.code) {
							util.simpleMsg(res.msg, !res.code);
							return;
						}
						that.CardNumber = res.data;
						that.GetCardInfo();
					})
				}
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
				if (that.CurType != "Delay") {
					if (that.CardInfo.cardType != 'Z001') {
						util.simpleMsg("仅实体VIP卡，可挂失！", true);
						return;
					}
					console.log("持卡人信息：", that.CKRInfo);
					if (!that.CKRInfo || Object.keys(that.CKRInfo).length == 0) {
						util.simpleMsg("请先填写顾客信息", true);
						return;
					} else {
						if (!that.CKRInfo.name) {
							util.simpleMsg("请输入姓名", true);
							return;
						}
						if (!that.CKRInfo.phone) {
							util.simpleMsg("请输入手机号", true);
							return;
						}
						if (!(/^(13|14|15|18)\d{9}$/.test(that.CKRInfo.phone))) {
							util.simpleMsg("手机号码有误，请重填", true);
							return;
						}
						if (!that.CKRInfo.idcard) {
							util.simpleMsg("请输入身份证号", true);
							return;
						}
						var ids =
							/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
						if (!ids.test(that.CKRInfo.idcard)) {
							util.simpleMsg("身份证号有误，请重填", true);
							return;
						}
					}
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
								that.ResetBill(that.CurType, res.code); //重置
							})
						} else {
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
								that.ResetBill(that.CurType, res.code); //重置
							})
						}
					}
				})
			},
			//取消
			Cancel: function() {
				that.ResetBill(that.CurType); //重置
			},

			//清空数据
			ClearSale: function() {
				util.simpleModal("提示", "是否确认清空当前数据？", res => {
					if (res) {
						that.ResetBill(that.CurType);
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
		margin-top: 20rpx;
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

	.hh {
		position: relative;
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
		z-index: 99;
		background: #fff;
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

	.ulli .h7 {
		color: #333333;
		font-size: 38rpx;
		line-height: 50px;
	}

	.ulli .h7 image {
		width: 38rpx;
		height: 38rpx;
		margin-right: 10rpx;
	}

	.cardlist .chikaren {
		padding: 1% 7%;
		width: 86%;
	}

	.jutiinfo {
		background: #F1F9F1;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 0 0 20rpx 20rpx;
		padding: 1% 6%;
	}

	.jutiinfo label {
		color: #b0b0b0;
		font-size: 26rpx;
		width: 50%;
		line-height: 50rpx;
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
		padding: 0 15% 0 0;
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

	.tishis {
		background: #FE694B;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 20rpx 20rpx 0 0;
		color: #fff;
		position: absolute;
		bottom: 0rpx;
		right: 2%;
		font-size: 26rpx;
		padding: 0 30rpx;
	}
</style>
<style>
	.clues {
		display: flex;
		justify-content: start;
		align-items: center;
		line-height: 60rpx;
		fony-size: 26rpx;
		position: relative;
		z-index: 2;
		margin: 16rpx 0 0;
	}

	.clues text {
		width: 164rpx;
		color: #006B44;
		font-size: 28rpx;
	}

	.clues .label {
		background-color: #fff;
		height: 60rpx;
		line-height: 60rpx;
		border: 1px solid #C5E7C8;
		width: 79%;
		border-radius: 6rpx;
		padding: 0 0.5%;
		display: flex;
		align-items: center;
	}

	.clues .label input {
		width: 90%;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 10rpx;
	}

	.clues .label button {
		width: 32rpx;
		height: 32rpx;
		background: #98C3B3;
		border-radius: 50%;
		font-size: 18rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		color: #fff;
	}

	.rjcg {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 100rpx;
		color: #006B44;
		font-weight: 700;
		font-size: 40rpx;
	}
</style>
