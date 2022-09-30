<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<view class="content" style="overflow: hidden;">
			<Page ref="menu" :current="mainSale.current_type.clickType"></Page>
			<view class="right" style="position: relative;">
				<Head :custom="mainSale.ComponentsManage.DKF" :_showSale="mainSale.currentOperation.ynCancel"></Head>
				<view class="listof" style="position: absolute;z-index: 0;">
					<view class="prolist">
						<!-- 大类循环 -->
						<view class="commodity">
							<view class="hh">
								<view class="hotcakes">
									<image src="../../images/dx-tqi.png" mode="widthFix"></image> 本店热销
									<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
								</view>
								<view class="classifys">
									<text v-for="(xplitem, xplindex) in mainSale.selectFlagList"
										:class="mainSale.selectPlid==xplitem.plid?'curr':''"
										@click="mainSale.selectPlidChenged"
										:data-plid="xplitem.plid">{{xplitem.plname}}</text>
									<label>
										<image src="../../images/jt-zhangkai.png" mode="widthFix"></image>
									</label>
									<!-- <button v-if="mainSale.currentOperation.ynCancel"
										@click="mainSale.CancelSale">返回销售</button> -->
								</view>
							</view>
							<!-- 小类循环 -->
							<view style="height:92%;flex: 1;">
								<scroll-view scroll-y="true" class="catecyc" :scroll-into-view="mainSale.scrollinto">
									<view class="products" v-for="(plitem, plindex) in  mainSale.selectFlagList">

										<view :id="mainSale.selectFlag+plitem.plid" class="h2">{{plitem.plname}}
											<label></label>
										</view>

										<view class="procycle">
											<!-- 产品循环 -->
											<view class="li" v-for="(sptiem, spindex) in  plitem['plarr'] "
												@click="mainSale.showSpDetails" :data-plindex="plindex"
												:data-spindex="spindex">
												<view class="h3">
													<!-- <image src="../../images/dx-mrxk.png" mode="widthFix"></image> -->
													{{sptiem.SNAME}}
												</view>
												<view class="cods">
													<label>
														<image src="../../images/dx-bm.png" mode="widthFix"></image>
														{{sptiem.SPID.substr(8)}}
													</label>
													<label>
														<image src="../../images/dx-dw.png" mode="widthFix"></image>
														{{sptiem.UNIT}}
													</label>
												</view>
												<view class="price">
													<text>￥{{ Price(sptiem.SPID) }}</text>
													<view>
														<image src="../../images/dx-gd.png" mode="widthFix"></image>
													</view>
												</view>
											</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
					<view class="operation">
						<view class="sorting">
							<view class="seasonal">
								<image src="../../images/dx-dwj.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="mainSale.Letters()">{{mainSale.selectFlag}}
								<image class="text" src="../../images/dx-fldw.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="mainSale.MemberLogin(1)">
								<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="mainSale.GetTSZKData">
								<image src="../../images/cuxiaohd-dlu.png" mode="widthFix"></image>
							</view>
							<!-- <view class="a-z" @click="SignIn()">
								<span class="mini-text">签到</span>
							</view>
							<view class="a-z" @click="DailySettlement()">
								<span class="mini-text">日结</span>
							</view> -->
							<view class="states" @click="mainSale.ShowStatement">
								<text>结算单</text>
								<label>«</label>
							</view>
						</view>
						<view class="toproof">
							<image src="../../images/dx-qdb.png" mode="widthFix"></image>
						</view>
						<view class="ranks" v-if="Alphabetical">
							<label :class="mainSale.selectFlag==flagitem?'curr':''" @click="mainSale.FlagClick"
								:data-flag="flagitem" v-for="(flagitem, flagindex) in  mainSale.flagList">
								<text>{{flagitem}}</text>
							</label>

						</view>
					</view>
				</view>
				<!-- 在这插入组件 -->
				<!-- <Reserve style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_reserve"></Reserve> -->
				<Extract style="position: absolute;z-index: 5;" key="1" :mode="true"
					v-if="mainSale.ComponentsManage.sale_reserve_extract"></Extract>
				<Extract style="position: absolute;z-index: 5;" key="2" :mode="false"
					v-if="mainSale.ComponentsManage.sale_reserve_cancel"></Extract>
				<TakeAway style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_takeaway">
				</TakeAway>
				<TakeYD style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_takeaway_reserve">
				</TakeYD>
				<OnlineOrders style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_online_order">
				</OnlineOrders>
				<OnlinePick style="position: absolute;z-index: 5;"
					v-if="mainSale.ComponentsManage.sale_online_order_extract"></OnlinePick>
				<Message style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_message"></Message>
				<RefundOrder style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_return_good">
				</RefundOrder>
				<SXRefund style="position: absolute;z-index: 5;"
					v-if="mainSale.ComponentsManage.sale_credit_return_good"></SXRefund>
				<Promotion style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.tools"></Promotion>
			</view>
			<!-- <newToast ref="message" @Close="CloseMessage" :yn_show="view.message" :title="'测试一下'"></newToast> -->
		</view>

		<!-- 会员登录 -->
		<MemberLogin v-if="mainSale.ComponentsManage.HY" class="member-login-box"></MemberLogin>
		<!-- 蛋糕属性选择 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.inputsp">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<button class="close" @click="mainSale.setComponentsManage" data-mtype='inputsp'>×</button>
				<view class="commods">
					<view class="h3">
						<image src="../../images/dx-mrxk.png" mode="widthFix"></image> {{mainSale.clikSpItem.SNAME}}
					</view>
					<view class="cods">
						<label>
							<image src="../../images/dx-bm.png" mode="widthFix"></image>{{mainSale.clikSpItem.SPID}}
						</label>
						<label>
							<image src="../../images/dx-dw.png" mode="widthFix"></image>{{mainSale.clikSpItem.UNIT}}
						</label>
					</view>
					<view class="price">
						<view>
						<text class="jiage">￥{{mainSale.clikSpItem.PRICE}}</text>
						<text v-if="mainSale.clikSpItem.ynAddPro" class="jiage zongjia" style="font-size: 28rpx;">+加料总价{{mainSale.clikSpItem.NEWPRICE}}={{mainSale.clikSpItem.PRICE+mainSale.clikSpItem.NEWPRICE}}</text>
						</view>
						<view>
							<button @click="mainSale.chengedQty" data-qty="-1"
								:disabled="mainSale.clikSpItem.ynAddPro">-</button>
							<label>{{mainSale.clikSpItem.ynAddPro?1:mainSale.clikSpItem.inputQty}}</label>
							<button @click="mainSale.chengedQty" data-qty="1"  :disabled="mainSale.clikSpItem.ynAddPro">+</button>
						</view>
					</view>
					<view class="tochoose">
						<view v-for=" (sp, spinx) in mainSale.sale002" v-if="sp.BARCODE == mainSale.clikSpItem.SPID">
						  <label class="shux"><text>{{sp.QTY}}</text>-<text>{{sp.UNIT}}</text>
							  <text v-for="(sx08, sxindex) in mainSale.sale008" v-if="sp.NO==sx08.NO" >[{{sx08.ATTNAME}}{{sx08.QTY?("x"+sx08.QTY):""}}]</text>
						  </label>
							<label><text>￥{{sp.PRICE}}</text>
								<button :data-spid="sp.SPID" :data-row="spinx"
									@click="mainSale.updateSp(spinx,sp.SPID,0)" class="del">×</button></label>
						</view>
					</view>
					<view class="sizes" v-if="mainSale.clikSpItem.ynshowlist">
						<view class="sizelist">
							<label v-for=" (specs, specsinx) in mainSale.clikSpItem.specslist" :data-spid="specs.SPID"
								:class="specs.SPID==mainSale.clikSpItem.selectSPID?'curr':''"
								@click="mainSale.selectSPID_Chenged">{{specs.SPECS}}</label>
						</view>
					</view>
					<view class="sizes" v-if="mainSale.clikSpItem.ynAddPro">
						<view v-for=" (ditem, dinx) in mainSale.clikSpItem.addlist">
							<view>{{ditem.ATTCODE}}</view>
							<view class="sizelist">
								<label v-for=" (sxitem, sxinx) in ditem.Darr" :data-dinx="dinx" :data-sxinx="sxinx"
									:class="sxitem.SELECTED=='X'?'curr':''"
									@click="mainSale.selectSxitem_Chenged">{{sxitem.CSTCODE==2?("￥"+Price(sxitem.OPTMAT)):""}}{{" "+sxitem.OPTNAME+(sxitem.CSTCODE==2?"+"+sxitem.QTY:"")}}</label>
								<button :data-dinx="dinx" @click="mainSale.clearDrinkSx(dinx)" class="del">×</button>
							</view>
						</view>
					</view>
				</view>
				<view class="confirm">
					<button class="btn" data-yndgxp='N' @click="mainSale.getSp">确认</button>
				</view>
			</view>
		</view>
		<!-- 预定信息录入 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.openydCustmInput" style="text-align: right;">
			<ReserveDrawer :show="mainSale.ComponentsManage.openydCustmInput"
				:confirm="(mainSale.mode_info.sale_reserve.ReserveInfoInput).bind(mainSale)" :sale="mainSale.sale001">
			</ReserveDrawer>
		</view>
		<!-- 辅助促销 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.FZCX">
			<FZCX v-if="mainSale.ComponentsManage.FZCX" :_FZCXDatas="mainSale.FZCX" :_sale="mainSale.sale001"></FZCX>
		</view>
		<!-- 结算单 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.statement">
			<view class="memberes">
				<view class="meminfo" v-if="ShowHY&&mainSale.HY.open">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label
								class="meminfo"><text>{{mainSale.HY.val.NickName}}</text><text>{{mainSale.HY.val.hyId}}</text></label>
						</label>
						<button @click="mainSale.HY.open = false">×</button>
					</view>
					<view class="nom">
						<label>
							<text>￥{{ MemberBalance }}</text>
							<text>余额</text>
						</label>
						<label>
							<text>{{ MemberPoint }}</text>
							<text>积分</text>
						</label>
						<label>
							<text>{{ MemberCoupons.length}}</text>
							<text>优惠券</text>
						</label>
						<label>
							<text>{{ MemberGiftCard }}</text>
							<text>礼品卡</text>
						</label>
					</view>
					<view class="coulist">
						<view class="h2">优惠券</view>
						<view class="uls">
							<view class="lis" v-for="(item,index) in MemberCoupons">
								<view class="voucher">
									<view><text>￥</text>{{item.money}}</view>
									<text>满{{item.limitmoney}}可用</text>
								</view>
								<image class="banyuan" src="../../images/quan-fenge.png" mode="widthFix"></image>
								<view class="coupon-dets">
									<view class="limit">
										<view class="h3" v-for="(item1,index1) in item.limitDesc">
											<text>{{item1}}</text>
										</view>
										<text class="datas">{{item.s_date}} 至 {{item.e_date}}</text>
									</view>
									<view class="directions">
										<image class="bg" src="../../images/quan-bg.png" mode="widthFix"></image>
										<view>使用说明<image src="../../images/xiala.png" mode="widthFix"></image>
										</view>
										<!-- <button @click="CouponToUse(item.lqid)">点击使用<image src="../../images/ewm.png"
															mode="widthFix"></image></button> -->
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="pop-r pop-rs">
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<button class="btn" @click="mainSale.HY.open=true"
								v-if="ShowHY">{{mainSale.HY.val.hyId}}</button>
							<button class="btn" v-else>未登录...</button>
						</label>
						<text @click="mainSale.resetSaleBill">清空</text>
					</view>
					<view class="h5"><text>账单</text><button
							v-if="mainSale.currentOperation.ynEdit&&!mainSale.currentOperation.showEdit"
							@click="mainSale.showEditFunc">编辑</button>
						<button v-if="mainSale.currentOperation.ynEdit&&mainSale.currentOperation.showEdit"
							@click="mainSale.completeEdit">完成</button>
					</view>
					<view class="goods">
						<!-- 商品循环 -->
						<view class="prolist" v-for="(sp, spinx) in mainSale.sale002">
							<view class="h3">
								<label>
									<image src="../../images/dx-mrxk.png" mode="widthFix"></image> {{sp.STR1}}
									<text>折扣￥{{sp.DISCRATE}}</text>
								</label>
								<view class="danjia" v-if="!mainSale.currentOperation.showEdit">
									<text>单价￥{{Price(sp.SPID)}}/</text>
									<text><em>×</em>{{sp.QTY}}</text>
								</view>
							</view>
							<view class="cods">
								<view>
									<label>
										<image src="../../images/dx-bm.png" mode="widthFix"></image>
										{{ sp.SPID.substr(8)}}
									</label>
									<label>
										<image src="../../images/dx-dw.png" mode="widthFix"></image>{{sp.UNIT}}
									</label>
								</view>
								<text
									v-if="!mainSale.currentOperation.showEdit">总价￥{{sp.NET}}</text>
								<!-- <text v-if="!mainSale.currentOperation.showEdit">总价￥{{sp.NET}}</text> -->
								<!-- 数量编辑 -->
								<view class="bianji" v-if="mainSale.currentOperation.showEdit">
									<text @click="mainSale.Calculate(sp,-1)">
										<image style="width: 40rpx; height: 40rpx;" src="@/images/dx-jian.png"
											mode="widthFix"></image>
									</text>
									<label style="display:inline-block;text-align: center;width:100rpx">{{sp.QTY}}</label>
									<text @click="mainSale.Calculate(sp,1)">
										<image style="width: 40rpx; height: 40rpx;" src="@/images/dx-jia.png"
											mode="widthFix"></image>
									</text>
								</view>
							</view>
						</view>
					</view>
					<view class="ul">
						<view class="li"><text>总金额</text><text>{{mainSale.sale001.ZNET}}</text></view>
						<view class="li"><text>件数</text><text>{{mainSale.sale001.TLINE}}</text></view>
						<view class="li"><text>总折扣</text><text>-￥{{mainSale.sale001.BILLDISC}}</text></view>
						<view class="li"><text>应收金额</text><text>￥{{mainSale.sale001.TNET}}</text></view>
					</view>
					<!-- <view class="h5" v-if="mainSale.currentOperation.ynFzCx">
						<text>赠品</text><text @click="mainSale.FZCX.open=true">点击查看 ></text>
					</view>
					<view class="h5" v-if="mainSale.FZCX.cval.msg">
						<text>提示：{{mainSale.FZCX.cval.msg}}</text>
					</view> -->
					<view class="shoppbag" v-if="false">
						<view class="hengs">
							<view class="baglist curr" v-for="(item,index) in AuxiliaryPromotion">
								<view class="bag">
									<text class="h8">{{item.SNAME}}</text>
									<label><text>说明</text>{{item.DESCRIBE}}</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text @click="Calculate(item,-1)">-</text>
										<input disabled="true" v-model="item.BQTY" />
										<text @click="Calculate(item,1)">+</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="confirm">
						<button @click="mainSale.pay" class="btn">下一步</button>
					</view>
					<view class="states" @click="mainSale.setComponentsManage" data-mtype='statement'>
						<text>结算单</text>
						<label>»</label>
					</view>
				</view>
			</view>
		</view>
		<!-- 特殊折扣 -->
		<SpecialDisc v-if="mainSale.ComponentsManage.Disc" :zkdatas="mainSale.Disc.val.ZKData"></SpecialDisc>
	</view>
</template>

<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue'
	import Page from '@/pages/Home/Component/Page.vue'
	//页面组件导入 👇
	import Reserve from '@/pages/Reserve/Reserve.vue'
	import Extract from '@/pages/Extract/Extract.vue'
	import TakeAway from '@/pages/TakeAway/TakeAway.vue'
	import TakeYD from '@/pages/TakeYD/TakeYD.vue'
	import OnlineOrders from '@/pages/OnlineOrders/OnlineOrders.vue'
	import OnlinePick from '@/pages/OnlinePick/OnlinePick.vue'
	import RefundOrder from '@/pages/RefundOrder/RefundOrder.vue'
	import SXRefund from '@/pages/RefundOrder/SXRefund.vue'
	import Message from '@/pages/Message/Message.vue'
	import CreditSettlement from '@/pages/CreditSettlement/CreditSettlement.vue'
	import Promotion from '@/pages/Promotion/Promotion.vue'
	import MemberLogin from '@/pages/MemberLogin/MemberLogin.vue'
	import ReserveDrawer from '@/pages/Reserve/ReserveDrawer.vue';
	//页面组件导入 👆
	import mysale from '@/utils/sale/base_sale.js';
	import xs_sp_init from '@/utils/sale/xs_sp_init.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _checker from '@/utils/graceChecker.js';
	import _msg from '@/api/business/message.js';
	import _main from '@/api/business/main.js';
	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	var app = getApp();
	export default {
		data() {
			return {
				statements: false,
				Alphabetical: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				dropout: false,
				coupon_list: [],
				mainSale: null,
				saleAdd: [],
				saleSub: [],
				MainSale: {},
				KHID: app.globalData.store.KHID, //"K210QTD003"
				DQID: app.globalData.store.DQID, //"K01000"
				KHZID: app.globalData.store.KHZID, //"02"
				CXDatas: [],
				page_info: {}
			}
		},
		components: {
			Head,
			Page,
			Reserve,
			Extract,
			TakeAway,
			TakeYD,
			OnlineOrders,
			OnlinePick,
			RefundOrder,
			SXRefund,
			Message,
			CreditSettlement,
			Promotion,
			MemberLogin,
			ReserveDrawer,
			PrinterPage
		},
		computed: {
			Price: function() {
				return util.callBind(this, function(spid) {
					return this.mainSale.spPrice[spid]?.PRICE ?? "-";
				})
			},
			MemberInfo: function() {
				console.log("[MemberInfo]会员信息:", this.mainSale.HY.val);
				return Object.keys(this.mainSale.HY.val) > 0 ? this.mainSale.HY.val : {
					coupons: [],
					hyId: "",
					NickName: "",
					Balance: 0,
					Phone: "",
					JFBalance: 0,
					hy_Assets: {
						GiftAmt: 0
					}
				}
			},
			PromotionDetails: function() {
				if (this.CXDatas && Array.isArray(this.CXDatas) && this.CXDatas.length > 0) {
					if (this.CXDatas[0].Details && Array.isArray(this.CXDatas[0].Details)) {
						return this.CXDatas[0].Details;
					} else {
						return [];
					}
				} else
					return [];
			},
			ShowHY: function() {
				return this.mainSale.HY.val?.hyId;
			},
			MemberBalance: function() {
				return (this.mainSale.HY.val?.Balance ?? 0) / 100;
			},
			MemberPoint: function() {
				return (this.mainSale.HY.val?.JFBalance ?? 0) / 100;
			},
			MemberGiftCard: function() {
				return (this.mainSale.HY.val?.hy_Assets?.GiftAmt ?? 0) / 100;
			},
			MemberCoupons: function() {
				return this.mainSale.HY.val.coupons ?? [];
			},
			MenuName: function() {
				return this.mainSale?.current_type?.clickType ?? ""
			}
		},
		methods: {
			onShow: function(e) {
				// let str = e.target.value;
				// console.log(this.sptiem.SNAME)
			},
			//销售打印小票
			bluePrinter: function(sale1_obj, sale2_arr, sale3_arr, print) {
				this.$refs.printerPage.bluePrinter(sale1_obj, sale2_arr, sale3_arr, print);
			},
			//线上订单打印小票
			xsBluePrinter: function(order, type, print) {
				this.$refs.printerPage.xsBluePrinter(order, type, print);
			},
			//外卖打印小票
			wmBluePrinter: function(order, datails, type, print) {
				this.$refs.printerPage.wmBluePrinter(order, datails, type, print);
			},
			testPrinter: function() {
				this.$refs.printerPage.testPrinter();
			},
			//商品总数量
			TotalNum: function() {
				let total = 0;
				// if (this.mainSale.currentOperation.showEdit) { //完成后再计算
				this.mainSale.sale002.map(r => {
					total += r.QTY;
				})
				// }
				return total;
			}
		},
		created() {
			console.log("[MainSale]开始构造函数!");
			console.log("初始化的khid:", this.KHID);
			console.log("初始化的DQID:", this.DQID);
			console.log("初始化的KHZID:", this.KHZID);
			let log = console.log;
			console.log = () => {};
			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale", uni);
			console.log("[MainSale]原型:", this.mainSale.sale003.remove);
			console.log("[MainSale]开始设置基础的销售类型");
			this.mainSale.SetDefaultType();
			console.log("初始化的khid:", this.KHID);
			xs_sp_init.loadSaleSP.loadSp(this.KHID, util.callBind(this, function(products, prices) {
				console.log("[MainSale]商品实际的长度:", products.length);
				this.mainSale.SetAllGoods(products, prices);
			}), this.DQID, this.KHZID);
			console.log = log;
		}
	}
</script>
<style>
	page {
		overflow: hidden;
	}

	.a-z {
		min-height: 2em;
	}

	.right {
		height: 100%;
	}

	.mini-text {
		font-size: x-small;
	}

	.right>* {
		width: 100%;
		background-color: #f5f4f8;
	}

	.menu .saleadd {
		padding: 0;
	}

	.listof {
		height: 91%;
	}

	.catecyc {
		height: 100%;
	}

	.member-login-box {
		position: absolute;
		top: 0px;
		width: 100%;
		height: 100%;
		z-index: 100;
	}

	.popup {
		position: relative;
		padding-bottom: 140rpx;
		max-height: 85%;
		overflow: auto;
	}

	.popup .confirm {
		position: absolute;
		bottom: 0;
		padding: 20rpx 0 40rpx;
		width: 90%;
		left: 5%;
		text-align: center;
		background-color: #fff;
	}

	.pop-rs .goods {
		height: 51%;
	}

	.prolist {
		position: relative;
	}

	.prolist .h3 label text {
		color: #FE694B;
		font-weight: 400;
		font-size: 18rpx;
		padding: 0 4rpx;
		border: 1rpx solid #FE694B;
		margin-left: 12rpx;
		border-radius: 4rpx;
	}

	.h5 button {
		color: #42B14B;
		background: none;
		font-size: 28rpx;
		margin: 0;
		padding: 0 20rpx;
	}

	.prolist .bianji {
		width: 180rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}

	.prolist .bianji label {
		display: flex;
		height: 50rpx;
		line-height: 50rpx;
		width: 160rpx;
		border: 1px solid #D3D3D3;
		background-color: #f5f5f5;
		text-align: center;
		font-size: 30rpx;
		background: none;
		border-radius: 4rpx;
	}

	.bianji text {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 50rpx;
		margin: 10rpx;
		width: 50rpx;
		height: 50rpx;
		padding: 0;
	}

	.bianji image {
		width: 40rpx;
		height: 40rpx;
	}
	.price .zongjia{
		font-size: 28rpx;
		margin-left: 26rpx;
	}
</style>
