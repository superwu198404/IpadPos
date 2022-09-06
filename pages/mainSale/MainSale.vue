<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>

<template>
	<view class="content">
		<view class="right">
			<view class="listof">
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
							</view>
						</view>
						<!-- 小类循环 -->
						<view style="height:92%;flex: 1;">
							<scroll-view scroll-y="true" class="catecyc" :scroll-into-view="mainSale.scrollinto">
								<view class="products" v-for="(plitem, plindex) in  mainSale.selectFlagList">

									<view :id="mainSale.selectFlag+plitem.plid" class="h2">{{plitem.plname}}
										<label></label></view>

									<view class="procycle">
										<!-- 产品循环 -->
										<view class="li" v-for="(sptiem, spindex) in  plitem['plarr'] "
											@click="mainSale.showSpDetails" :data-plindex="plindex"
											:data-spindex="spindex">
											<view class="h3">
												<image src="../../images/dx-mrxk.png" mode="widthFix"></image>
												{{sptiem.SNAME}}
											</view>
											<view class="cods">
												<label>
													<image src="../../images/dx-bm.png" mode="widthFix"></image>0
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
						<view class="a-z" @click="Letters()">{{mainSale.selectFlag}}
							<image class="text" src="../../images/dx-fldw.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="Memberlogin(1)">
							<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="GetTSZKData()">
							<image src="../../images/cuxiaohd-dlu.png" mode="widthFix"></image>
						</view>
						<view class="states" @click="mainSale.showStatement">
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
				MainSale:{}
			}
		},
		computed: {
			Price: function() {
				return util.callBind(this, function(spid) {
					return this.mainSale.spPrice[spid]?.PRICE ?? "-";
				})
			}
		},
		methods: {
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
		},
		created() {
			console.log("[MainSale]开始构造函数");
			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale");
			console.log("[MainSale]开始设置基础的销售类型");
			this.mainSale.SetDefaultType();
			xs_sp_init.loadSaleSP.loadSp(this.KHID, util.callBind(this, function(products, prices) {
				console.log("[MainSale]商品实际的长度:", products.length);
				this.mainSale.SetAllGoods(products, prices);
			}), this.DQID, this.KHZID);
			console.log("[MainSale]将控制对象传入Home中...");
			this.$emit("Controller",this.mainSale);
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

	.catecyc {
		height: 100%;
	}
</style>
