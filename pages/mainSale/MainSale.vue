<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>

<template>
	<view class="content">
		<view class="content" style="overflow: hidden;">
			<Page ref="menu"></Page>
			<view class="right" style="position: relative;">
				<Head></Head>
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
							<view class="a-z" @click="MemberLogin(1)">
								<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="GetTSZKData()">
								<image src="../../images/cuxiaohd-dlu.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="SignIn()">
								<span class="mini-text">签到</span>
							</view>
							<view class="a-z" @click="DailySettlement()">
								<span class="mini-text">日结</span>
							</view>
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
				<Reserve style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_reserve"></Reserve>
				<Extract style="position: absolute;z-index: 5;" key="1" :mode="true" v-if="mainSale.ComponentsManage.sale_reserve_extract"></Extract>
				<Extract style="position: absolute;z-index: 5;" key="2" :mode="false" v-if="mainSale.ComponentsManage.sale_reserve_cancel"></Extract>
				<TakeAway style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_takeaway"></TakeAway>
				<TakeYD style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_takeaway_reserve"></TakeYD>
				<OnlineOrders style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_online_order"></OnlineOrders>
				<OnlinePick style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_online_order_extract"></OnlinePick>
				<Message style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_message"></Message>
				<RefundOrder style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_return_good"></RefundOrder>
				<SXRefund style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_credit_return_good"></SXRefund>
				<Promotion style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.tools"></Promotion>
			</view>
			<!-- <newToast ref="message" @Close="CloseMessage" :yn_show="view.message" :title="'测试一下'"></newToast> -->
		</view>

		<MemberLogin v-if="mainSale.ComponentsManage.member_login"
			style="position: absolute;top: 0px;width: 100%;height: 100%;z-index: 100;"></MemberLogin>

		<!-- 会员弹框 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.HY">
			<view class="memberes">
				<view class="meminfo">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label
								class="meminfo"><text>{{mainSale.HY.val.NickName}}</text><text>{{mainSale.HY.val.hyId}}</text></label>
							<label @click="ChangeMember()">切换</label>
						</label>
						<button @click="mainSale.ComponentsManage.HY = false">×</button>
					</view>
					<view class="nom">
						<label>
							<text>￥{{mainSale.HY.val.Balance/100}}</text>
							<text>余额</text>
						</label>
						<label>
							<text>{{mainSale.HY.val.JFBalance/100}}</text>
							<text>积分</text>
						</label>
						<label>
							<text>{{mainSale.HY.val.coupons.length}}</text>
							<text>优惠券</text>
						</label>
						<label>
							<text>{{mainSale.HY.val.hy_Assets.GiftAmt/100}}</text>
							<text>礼品卡</text>
						</label>
					</view>
					<view class="rests" v-if="false">
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
							<view class="lis" v-for="(item,index) in mainSale.HY.val.coupons">
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
			</view>
		</view>

		<!-- 蛋糕属性选择 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.inputsp">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<button class="close" @click="mainSale.setComponentsManage" data-mtype='inputsp'>x </button>
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
										<!-- <button @click="CouponToUse(item.lqid)">点击使用<image src="../../images/ewm.png"
												mode="widthFix"></image></button> -->
										<button>点击使用<image src="../../images/ewm.png" mode="widthFix"></image></button>
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
							<button class="btn" @click="MemberLogin()">会员登录</button>
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
				</view>
			</view>
		</view>

		<!-- 特殊折扣 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.Disc">
			<view class="popup special">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="commods" style="padding-top:26rpx;">
					<view class="h3">
						特殊折扣选则<button class="close" @click="mainSale.ComponentsManage.Disc=false">×</button>
					</view>
					<view class="uls">
						<view class="lis curr">
							<view class="h8">
								<view>标准折扣<em></em></view>
								<label>总折扣额:<text>￥566</text></label>
								<span>已选</span>
							</view>
							<view class="discount">
								<label>·01 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·02 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·03 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<view>
									<label>
										<checkbox></checkbox>临时折扣
									</label>
									<text>满¥1000即打9折，折扣额¥123</text>
								</view>
							</view>
						</view>
						<view class="lis">
							<view class="h8">
								<view>特批折扣<em></em></view>
								<span>已选</span>
							</view>
							<view class="discount">
								<label>·01 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·02 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·03 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
							</view>
						</view>
					</view>
					<view class="confirm">
						<button class="btn" @click="showMDCXData=false">确 认</button>
					</view>
				</view>
			</view>
		</view>

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
				MainSale: {}
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
			MemberLogin
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
			}
		},
		methods: {
			Change: function(menu) {
				console.log("[Change]菜单点击触发!", menu);
				this.mainSale.SetManage(menu.info.clickType);
			},
			Redirect: function(info) {
				console.log("[Redirect]重定向至销售主页!", info);
				let menu_info = this.mysale.XsTypeObj[info.name];
				this.mainSale.$initSale(menu_info.clickType,info.params);
				this.mainSale.SetManage('sale');
			},
			CloseMember: function(member_info) {
				this.mainSale.ComponentsManage.member_login = false;
				console.log("[CloseMember]会员页关闭!", member_info);
				this.mainSale.HY.val = member_info;
				console.log("[CloseMember]会员信息:", this.mainSale.HY.val);
				this.GetHyCoupons(member_info);
			},
			SignIn:function(){
				console.log("[SignIn]签到!");
				uni.$emit('head-action',{
					name:'Sign'
				})
			},
			DailySettlement:function(){
				console.log("[DailySettlement]日结!");
				uni.$emit('head-action',{
					name:'ConfirmRJ'
				})
			},
			//切换登录
			ChangeMember: function() {
				this.mainSale.ComponentsManage.member_login = true;
				this.mainSale.ComponentsManage.HY = false;
			},
			GetTSZKData: function() { //展示特殊折扣
				// that.showTSZK = true;
				this.mainSale.ComponentsManage.Disc = true;
			},
			exits: function(e) {
				this.dropout = !this.dropout;
			},
			Statements: function(e) {
				this.statements = !this.statements
			},
			Letters: function(e) {
				this.Alphabetical = true
			},
			GetHyCoupons: function(hyinfo) {
				if (hyinfo?.hyId) {
					_member.CouponList("获取中...", {
						brand: this.brand,
						data: {
							hyid: this.MemberInfo.hyId,
							phone: this.MemberInfo.Phone
						}
					}, util.callBind(this, function(res) {
						if (res.code) {
							this.mainSale.HY.val.coupons = res.data;
							this.mainSale.update();
							this.mainSale.HY.val.hyId = this.mainSale.HY.val.hyId;
							this.mainSale.ComponentsManage.HY = true;
							console.log("[GetHyCoupons]会员信息-computed:", this.MemberInfo);
							console.log("[GetHyCoupons]会员信息-control:", this.mainSale.HY.val);
						}
					}), (err) => {
						console.log("异常数据：", res)
					})
				}
			},
			MemberLogin: function(e) { //会员登录
				console.log("[MemberLogin]会员登录!");
				if (Object.keys(this.mainSale.HY.val).length > 0) {
					this.GetHyCoupons(this.mainSale.HY.val);
				} else
					this.mainSale.ComponentsManage.member_login = true;
				console.log("[MemberLogin]状态信息:", this.mainSale.ComponentsManage.member_login);
			},
			Bagslist: function(e) {
				this.Shoppingbags = true,
					this.Memberinfo = false
			},
			Moreand: function(e) {
				this.Chargeback = !this.Chargeback
			},
			Bind: function() {
				uni.$on("change", this.Change);
				uni.$on("redirect", this.Redirect);
				uni.$on("member-close", this.CloseMember);
			}
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
			this.Bind();
		}
	}
</script>

<style>
	page {
		overflow: hidden;
	}
	.a-z{
		min-height: 2em;
	}
	.right {
		height: 100%;
	}
	.mini-text {
	    font-size: x-small;
	}
	.right > * {
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
</style>
