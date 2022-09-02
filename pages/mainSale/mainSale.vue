<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>

<template>
	<view class="content">
		<view class="navmall">
			<view class="logo">
				<image src="../../images/kengee-logo.png" mode="widthFix"></image>
			</view>
			<view class="menu">
				<view class="saleadd" v-for="(item, index) in saleAdd">
					<view :class="mainSale.clickSaleType.xstype== item.xstype?'curr':''" :data-stype="item.clickType"
						@click="mainSale.saleTypeClick">
						<image class="xz" :src="item.iconCurr" mode="widthFix"></image>
						<image class="wx" :src="item.iconHui" mode="widthFix"></image>
						<text>{{item.nameSale}}</text>
					</view>
				</view>
				<view>
					<image @click="Moreand()" class="xz" src="../../images/xz-th.png" mode="widthFix"></image>
					<image @click="Moreand()" class="wx" src="../../images/wxz-th.png" mode="widthFix"></image>
					<text @click="Moreand()">退单业务</text>
					<view class="chargeback" v-if="(item, index) in saleSub">
						<label :class="mainSale.clickSaleType.xstype== item.xstype?'currs':''"
							:data-stype="item.clickType" @click="mainSale.saleTypeClick">
							<image class="xz" :src="item.iconHui" mode="widthFix"></image>
							<image class="wx" :src="item.iconCurr" mode="widthFix"></image>
							<text>{{item.nameSale}}</text>
						</label>
					</view>

				</view>
				<view>
					<image class="xz" src="../../images/xz-xx.png" mode="widthFix"></image>
					<image class="wx" src="../../images/xiaoxi-hui.png" mode="widthFix"></image>
					<text>消息</text>
				</view>
			</view>

		</view>
		<view class="right">
			<view class="nav">
				<view class="getback">
					<!-- <image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image> -->
					<view class="message">
						<view class="imgs">
							<image src="../../images/tongzhi.png" mode="widthFix"></image>
						</view>
						<text>门店有一条新的外卖配送单消息来啦...</text>
					</view>
				</view>
				<view class="stores">
					<view class="checkout">
						<label>
							<image src="../../images/dx-mendian.png" mode="widthFix"></image>
						</label>
						<label>
							<image src="../../images/dx-kuantai.png" mode="widthFix"></image>款台号：3
						</label>
					</view>
					<view class="account">
						<view>
							<image src="@/images/touxiang.png" mode="widthFix"></image>
						</view>
						<text @click="exits()">{{RYID}}
							<image style="width:24rpx;height: 24rpx;,margin-left:10rpx" src="@/images/xiala.png"
								mode="widthFix"></image>
						</text>
						<view class="dropout" v-if="dropout">
							<view class="exit" @click="LoginOut()">
								<image src="@/images/tuichu.png" mode="widthFix"></image>
								<text>退出</text>
							</view>
							<view class="exit" @click="Login()">
								<image src="@/images/zhuxiao.png" mode="widthFix"></image>
								<text>注销</text>
							</view>
							<view class="exit" @click="UPPWD()">
								<image src="@/images/xgmima.png" mode="widthFix"></image>
								<text>修改密码</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="listof">
				<component @Switch="SwitchPage" @Message="OpenMessage" v-for="c in router" :is="c.name" :ref="c.title"
					v-show="show(c) || !c.keepAlive" v-if="show(c) || c.keepAlive" :meta="meta_data"></component>
			</view>
		</view>
		<!-- 蛋糕属性选择 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.inputsp">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<button class="close" @click="mainSale.setComponentsManage" data-mtype='inputsp'>×xxx </button>
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
						<text class="jiage">{{mainSale.clikSpItem.PRICE}}</text>
						<view> <button @click="mainSale.chengedQty"
								data-qty="-1">–</button><label>{{mainSale.clikSpItem.inputQty}}</label><button
								@click="mainSale.chengedQty" data-qty="1">+</button></view>
					</view>
					<view>
						<view class="tochoose" v-for=" (sp, spinx) in mainSale.sale002"
							v-if="sp.BARCODE == mainSale.clikSpItem.SPID">
							<label><text>{{sp.QTY}}</text>-<text>{{sp.UNIT}}</text></label>
							<label><text>{{sp.PRICE}}</text><button class="del">×</button></label>
						</view>
					</view>
					<view class="sizes" v-if="mainSale.clikSpItem.ynshowlist">
						<view class="sizelist">
							<label :class="specs.SPID==mainSale.clikSpItem.selectSPID?curr:''"
								v-for=" (specs, specsinx) in mainSale.clikSpItem.specslist"
								:data-spid="specs.SPID">{{specs.SPECS}}</label>
						</view>
					</view>
					<view class="confirm">
						<button class="btn" data-yndgxp='N' @click="mainSale.getSp">确认</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 未登录结算单 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.statement">
			<view class="pop-r pop-rs">
				<view class="member">
					<label>
						<image class="touxiang" src="../../images/touxiang.png"></image><button
							class="btn">会员登录</button>
					</label>
					<text @click="mainSale.resetSaleBill">清空</text>
				</view>
				<view class="h5"><text>账单</text></view>
				<view class="goods">
					<!-- 商品循环 -->
					<view class="prolist" v-for="(sp, spinx) in mainSale.sale002 ">
						<view class="h3">
							<label>
								<image src="../../images/dx-mrxk.png" mode="widthFix"></image> {{sp.STR1}}
							</label>
							<text>{{sp.QTY}}</text>
						</view>
						<view class="cods">
							<view>
								<label>
									<image src="../../images/dx-bm.png" mode="widthFix"></image>{{ sp.SPID.substr(8)}}
								</label>
								<label>
									<image src="../../images/dx-dw.png" mode="widthFix"></image>{{sp.UNIT}}
								</label>
							</view>
							<text>总金额￥{{sp.NET}}</text><text>总折扣￥{{sp.DISCRATE}}</text>
						</view>
					</view>

				</view>

				<view class="ul">
					<view class="li"><text>总金额</text><text>{{mainSale.sale001.ZNET}}</text></view>
					<view class="li"><text>件数</text><text>{{mainSale.sale001.TLINE}}</text></view>
					<view class="li"><text>折扣</text><text>-￥{{mainSale.sale001.DISC}}</text></view>
					<view class="li"><text>应收金额</text><text>￥{{mainSale.sale001.ZNET}}</text></view>
				</view>
				<view class="h5"><text>赠品</text><text>查看全部 ></text></view>

				<view class="shoppbag">
					<view class="hengs">
						<view class="baglist curr">
							<view class="bag">
								<text class="h8">小号手提袋</text>
								<label><text>说明</text>已满80元，可赠4个</label>
							</view>
							<view class="quantit">
								<text>数量</text>
								<view class="nums">
									<text>-</text>
									<input type="number" />
									<text>+</text>
								</view>
							</view>
						</view>
						<view class="baglist">
							<view class="bag">
								<text class="h8">小号手提袋</text>
								<label><text>说明</text>已满80元，可赠4个</label>
							</view>
							<view class="quantit">
								<text>数量</text>
								<view class="nums">
									<text>-</text>
									<input type="number" />
									<text>+</text>
								</view>
							</view>
						</view>
						<view class="baglist">
							<view class="bag">
								<text class="h8">小号手提袋</text>
								<label><text>说明</text>已满80元，可赠4个</label>
							</view>
							<view class="quantit">
								<text>数量</text>
								<view class="nums">
									<text>-</text>
									<input type="number" />
									<text>+</text>
								</view>
							</view>
						</view>

					</view>
				</view>

				<view class="confirm">
					<button class="btn">确 认</button>
				</view>

				<view class="states" @click="mainSale.setComponentsManage" data-mtype='statement'>
					<text>结算单</text>
					<label>»</label>
				</view>

			</view>
		</view>
		<!-- 会员登陆结算 -->
		<view class="boxs" v-if="statements">
			<view class="memberes">
				<view class="meminfo" v-if="Memberinfo">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label class="meminfo"><text>会员名称</text><text>13012341234</text></label>
						</label>
						<button>×</button>
					</view>
					<view class="nom">
						<label>
							<text>￥123</text>
							<text>余额</text>
						</label>
						<label>
							<text>6123</text>
							<text>积分</text>
						</label>
						<label>
							<text>23</text>
							<text>优惠券</text>
						</label>
						<label>
							<text>12</text>
							<text>礼品卡</text>
						</label>
					</view>
					<view class="rests">
						<view class="h2">其他</view>
						<view class="restlist">
							<label><text>上次购买时间：</text><text>03-23 19:23:47</text></label>
							<label><text>是否推送活动信息：</text><text>是</text></label>
							<label><text>上次购买金额：</text><text>￥56</text></label>
							<label><text>是否参与上次活动：</text><text>否</text></label>
						</view>
					</view>
					<view class="coulist">
						<view class="h2">优惠券</view>
						<view class="uls">
							<view class="lis" v-for="(item,index) in coupon_list">
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
										<button @click="CouponToUse(item.lqid)">点击使用<image src="../../images/ewm.png"
												mode="widthFix"></image></button>
									</view>
								</view>
							</view>
						</view>

					</view>
				</view>
				<view class="meminfo" v-if="Shoppingbags">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view>
						<view class="member">
							<label class="h9">武汉满20元赠小号手提袋</label>
							<button>×</button>
						</view>
						<view class="shoppbag">
							<view class="baglist curr">
								<view class="bag">
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number" />
										<text>+</text>
									</view>
								</view>
							</view>
							<view class="baglist">
								<view class="bag">
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number" />
										<text>+</text>
									</view>
								</view>
							</view>
							<view class="baglist">
								<view class="bag">
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number" />
										<text>+</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="pop-r">
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<button class="btn" @click="Memberlogin()">会员登录</button>
						</label>
						<text>清空</text>
					</view>
					<view class="h5"><text>账单</text></view>
					<view class="goods">
						<!-- 商品循环 -->
						<view class="prolist">
							<view class="h3">
								<label>
									<image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕
								</label>
								<text>X2</text>
							</view>
							<view class="cods">
								<view>
									<label>
										<image src="../../images/dx-bm.png" mode="widthFix"></image>12345678
									</label>
									<label>
										<image src="../../images/dx-dw.png" mode="widthFix"></image>10个装
									</label>
								</view>
								<text>￥56</text>
							</view>
						</view>

					</view>

					<view class="ul">
						<view class="li"><text>总金额</text><text>￥567</text></view>
						<view class="li"><text>件数</text><text>7</text></view>
						<view class="li"><text>折扣</text><text>-￥5</text></view>
						<view class="li"><text>应收金额</text><text>￥560</text></view>
					</view>
					<view class="h5"><text>赠品</text><text @click="Bagslist()">查看全部 ></text></view>

					<view class="shoppbag">
						<view class="hengs">
							<view class="baglist curr">
								<view class="bag">
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number" />
										<text>+</text>
									</view>
								</view>
							</view>
							<view class="baglist">
								<view class="bag">
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number" />
										<text>+</text>
									</view>
								</view>
							</view>
							<view class="baglist">
								<view class="bag">
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number" />
										<text>+</text>
									</view>
								</view>
							</view>

						</view>
					</view>
					<view class="confirm">
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
	import util from '@/utils/util.js';
	import mysale from '@/utils/sale/baseSale.js';
	import xs_sp_init from '@/utils/sale/xs_sp_init.js';
	//路由数据
	import router from '@/utils/router.js'
	//页面组件导入
	import Main from '@/pages/Main/Main.vue'
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
	export default {
		data() {
			return {
				router:[],//页面组件路由信息
				meta_data:null,//页面元数据
				current:{
					name: "OnlineOrders",
					title: "线上订单"
				},
				statements: false,
				Alphabetical: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				dropout: false,
				coupon_list: [],
				mainSale: null,
				khid: "K210QTD003",
				saleAdd: [],
				saleSub: []
			}
		},
		computed: {
			show: function() {
				return util.callBind(this, function(info) {
					return (this.current.name === info.name) && (this.current.title === info.title);
				});
			}
		},
		methods: {
			onLoad() {
				console.log("开始");
				let YnsaleAdd = true;
				var that = this;
				for (let item in mysale.XsTypeObj) {
					console.log(item);
					if (item == "seleTh") {
						YnsaleAdd = false;
					}
					if (YnsaleAdd) {
						this.saleAdd.push(mysale.XsTypeObj[item])
					} else {
						this.saleSub.push(mysale.XsTypeObj[item])
					}
				}
				console.log("开始构造函数");
				that.mainSale = new mysale.GetSale(that.khid, '009', '007', that, "mainSale");
				console.log(that.mainSale.Storeid);
				console.log("开始设置基础的销售类型");
				that.mainSale.setDeftype();
				xs_sp_init.loadSaleSP.loadSp(that.khid, (res, res2) => {
					console.log("商品实际的长度" + res.length);
					that.mainSale.setAllSpList(res, res2);
				}, "K01000", "02")


			},
			OpenMessage:function(){
				console.log("打开消息框!");
			},
			SwitchPage:function(){
				console.log("页面切换!");
			},
			exits: function(e) {
				this.dropout = !this.dropout
			},
			Statements: function(e) {
				this.statements = !this.statements
			},
			Letters: function(e) {
				this.Alphabetical = true
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
			ComponentRecursion: function(tree, all) {
				tree.forEach(util.callBind(this, function(item) {
					all.push(item);
					if (item.details)
						this.ComponentRecursion(item.details, all);
				}));
			}
		},
		created() {
			let components = [];
			this.ComponentRecursion(router, components)
			this.router = components;
			console.log("[Created]处理后的路由信息:",this.router);
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}

	.menu .saleadd {
		padding: 0;
	}

	.listof {
		height: 91%;
	}
	.listof > * {
		width: 100%;
	}
</style>
