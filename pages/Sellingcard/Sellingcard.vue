<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>

<template>
	<view class="content">
		<!-- <menu_page :menuIndex="7"></menu_page> -->
		<view class="right">
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
							<image src="../../images/img2/VIP-skaczhi.png" mode="widthFix"></image>
							<text>VIP售卡充值</text>
						</view>
						<view class="tab">
							<image src="../../images/img2/VIP-skaczhi.png" mode="widthFix"></image>VIP售卡充值
						</view>

						<view class="ckr">“持卡人姓名”：877888999</view>
					</view>

					<view class="module">
						<view class="hh">充值金额 <em></em></view>
						<view class="jinelist">
							<view class="li-je curr">
								<label>¥200</label>
								<text>20元为代金券</text>
								<em>送￥20</em>
							</view>
							<view class="li-je">
								<label>¥200</label>
								<text>20元为代金券</text>
								<em>送￥20</em>
							</view>
							<view class="li-je">
								<label>¥200</label>
								<text>20元为代金券</text>
								<em>送￥20</em>
							</view>
							<view class="li-je">
								<label>¥200</label>
								<text>20元为代金券</text>
								<em>送￥20</em>
							</view>
							<view class="li-je">
								<label>¥200</label>
								<text>20元为代金券</text>
								<em>送￥20</em>
							</view>
						</view>
					</view>
					<view class="module" style="height: 66%;">
						<view class="hh">待售详情 <em></em></view>
						<!-- 没刷卡时显示 -->
						<view class="swipetip" v-if="swipetip">
							<image src="../../images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>请先刷卡录入</text>
						</view>
						<!-- 刷卡后显示卡列表 -->
						<view class="cardlist">
							<view class="ulli">
								<image class="bgs" src="../../images/quan-bg.png" mode="widthFix"></image>
								<view class="h6">
									<label>￥550<text>/10张</text></label>
									<view class="zje">
										<view><text>总金额</text>￥56780</view>
										<button>
											<image src="../../images/img2/ka-shanchu.png"></image>
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
					<view class="boxs" v-if="ShowOthersPay">
						<view class="popup">
							<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
							<view class="h1">录入礼品卡卡号 <button class="close">×</button></view>
							<view class="number">
								<label>
									<text>开始卡号：</text>
									<input type="text" placeholder="请输入开始卡号" />
								</label>
								<label>
									<text>截止卡号：</text>
									<input type="text" placeholder="请输入截止卡号" />
								</label>
							</view>
							<view class="confirm">
								<button class="btn btn-qx" data-yndgxp='N'>取消</button>
								<button class="btn" data-yndgxp='N' @click="mainSale.getSp">确认</button>
							</view>
						</view>

					</view>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="a-z">
							<image src="../../images/img2/shuakalr.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="mainSale.MemberLogin(1)">
							<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="mainSale.GetTSZKData">
							<image src="../../images/img2/chikaren.png" mode="widthFix"></image>
						</view>
					</view>
					<!-- <view class="toproof">
							<image src="../../images/dx-qdb.png" mode="widthFix"></image>
						</view> -->
					<view class="ranks" v-if="Alphabetical">
						<label :class="mainSale.selectFlag==flagitem?'curr':''" @click="mainSale.FlagClick"
							:data-flag="flagitem" v-for="(flagitem, flagindex) in  mainSale.flagList">
							<text>{{flagitem}}</text>
							<em></em>
						</label>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _card_coupon from "@/utils/sale/card_coupon.js";
	import util from "@/utils/util.js";
	import _util from "@/utils/util.js";
	import _card_sale from "@/api/business/card_sale.js";
	import _saleClass from "@/utils/sale/saleClass.js";

	var that, KQSale;
	export default {
		name: "CardSale",
		data() {
			return {
				begin_num: "1087110000744323",
				end_num: "",
				store: getApp().globalData.store,
				SALE002Arr: [],
				showCZGZ: false,
				CZGZMX: [],
				CurCZGZ: {},
				SALE002: []
			}
		},
		created: function() {
			that = this;
			KQSale = new _card_coupon.InitKQSale(that, uni, that.store, "VIPCard_Active");
			KQSale.InitData("卡销售初始化", res => {
				that.ShowCZGZ();
			});
		},
		methods: {
			Confirm: function() {
				if (!this.begin_num) {
					_util.simpleMsg("卡号不为空");
				}
				KQSale.QueryInfo({
					card_num: that.begin_num
				}, res => {
					console.log(res);
					if (KQSale.CheckStatus(res)) {
						KQSale.CheckStock({
							begin_num: that.begin_num,
							end_num: that.begin_num,
							material_id: res.data.materielId,
							khid: that.store.KHID
						}, async res1 => {
							console.log("库存校验结果：", res1);
							if (!res1.code) {
								_util.simpleMsg(res1.msg, true);
								return;
							}
							if (res1.data[0].CARDNUM == "0") {
								_util.simpleMsg("卡库存不在当前门店", "none");
								return;
							}
							let spObj = await KQSale.MatchSP(res.data.materielId);
							if (spObj) {
								let arr = that.SALE002Arr.filter(r => {
									return r.SPID == spObj.SPID;
								});
								if (arr.length == 0)
									that.SALE002Arr.push(spObj);
								else {
									_util.simpleMsg("已添加该商品", "none");
								}
							}
						})
					}
				})
			},
			//展示充值规则
			ShowCZGZ: function() {
				let czgz = _util.getStorage("KCZGZMX");
				if (czgz) {
					that.showCZGZ = true;
					that.CZGZMX = czgz.map(r => {
						return {
							CZNET: r.CZNET,
							ZSNET: r.ZSNET
						}
					})
				}
			},
			//充值规则选择事件
			ChooseCZGZ: function(e) {
				if (e)
					that.CurCZGZ = e;
				that.SALE002.map(r => {
					r.PRICE = e.CZNET;
					r.PRICE = e.CZNET;
					r.PRICE = e.CZNET;
				})
			},
		}
	}
</script>

<style>
</style>
