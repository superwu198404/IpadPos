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
				<Head :custom="mainSale.ComponentsManage.DKF" :_showSale="mainSale.currentOperation.ynCancel"
					:_ynDKF="mainSale.currentOperation.DKF" :type="mainSale.current_type.clickType"></Head>
				<view class="listof" style="position: absolute;z-index: 0;">
					<view class="prolist">
						<!-- 大类循环 -->
						<view class="commodity">
							<view class="hh" style="padding-right:3.7%;">
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
								<scroll-view scroll-y="true" class="catecyc" :scroll-anchoring="true"
									:scroll-into-view="mainSale.scrollinto">
									<view class="products" v-for="(plitem, plindex) in  mainSale.selectFlagList"
										:data-plid="plitem.plid">

										<view :id="mainSale.selectFlag+plitem.plid"
											:class="mainSale.selectPlid==plitem.plid?'curr':''" class="h2">
											<text>{{plitem.plname}}</text>
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
														<image src="../../images/dx-bm.png" mode="widthFix">
														</image>
														{{sptiem.SPID.substr(8)}}
													</label>
													<label>
														<image src="../../images/dx-dw.png" mode="widthFix">
														</image>
														{{sptiem.UNIT}}
													</label>
												</view>
												<view class="price">
													<text>￥{{ Price(sptiem.SPID) }}</text>
													<view>
														<image src="../../images/dx-gd.png" mode="widthFix">
														</image>
													</view>
												</view>
											</view>
										</view>
									</view>
								</scroll-view>
							</view>
							</scroll-view>
						</view>
					</view>
					<view class="operation">
						<view class="sorting">
							<view class="seasonal">
								<image src="../../images/dx-dwj.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="mainSale.Letters()">
								<span>{{mainSale.selectFlag}}</span>
								<image class="text" src="../../images/dx-fldw.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="mainSale.MemberLogin(1)">
								<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
							</view>
							<view class="a-z" @click="mainSale.GetTSZKData">
								<image src="@/images/cuxiaohd-dlu.png" mode="widthFix"></image>
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
								<view class="statnum" style="margin-top:10rpx;">
									<image src="@/images/jsd-dxiao.gif" mode="widthFix"></image>
									<text>{{TotalNum}}</text>
								</view>
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
				<Message style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_message">
				</Message>
				<RefundOrder style="position: absolute;z-index: 5;" v-if="mainSale.ComponentsManage.sale_return_good">
				</RefundOrder>
				<SXRefund style="position: absolute;z-index: 5;"
					v-if="mainSale.ComponentsManage.sale_credit_return_good"></SXRefund>
				<CreditSettlement style="position: absolute;z-index: 5;"
					v-if="mainSale.ComponentsManage.sale_credit_settlement" :big-customer-info="mainSale.DKF.val">
				</CreditSettlement>
			</view>
			<!-- <newToast ref="message" @Close="CloseMessage" :yn_show="view.message" :title="'测试一下'"></newToast> -->
		</view>
		<view class="boxs" v-if="mainSale.tool_pages.promotions"
			style="display: flex;justify-content: center;align-items: center;">
			<Promotion style="width: 90%;height: 90%;background-color: white;border-radius: 5px;"></Promotion>
		</view>

		<view class="boxs" v-if="mainSale.tool_pages.communication"
			style="display: flex;justify-content: center;align-items: center;">
			<UnUpload style="width: 90%;height: 90%;background-color: white;border-radius: 5px;"></UnUpload>
		</view>
		<!-- 会员登录 -->
		<MemberLogin v-if="mainSale.ComponentsManage.HY" class="member-login-box"></MemberLogin>
		<!-- 商品详情选择 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.inputsp">

			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<button class="close" @click="mainSale.setComponentsManage" data-mtype='inputsp'
					style="z-index: 99999;">×</button>
				<view class="commods">
					<view class="h3">
						<image src="@/images/dx-mrxk.png" mode="widthFix"></image> {{mainSale.clikSpItem.SNAME}}
					</view>
					<view class="cods">
						<label>
							<image src="../../images/dx-bm.png" mode="widthFix"></image>
							{{mainSale.clikSpItem.SPID.substr(8)}}
						</label>
						<label>
							<image src="../../images/dx-dw.png" mode="widthFix"></image>{{mainSale.clikSpItem.UNIT}}
						</label>
					</view>
					<view class="price">
						<view>
							<text class="jiage">￥{{mainSale.clikSpItem.PRICE}}</text>
							<text v-if="mainSale.clikSpItem.ynAddPro" class="jiage zongjia"
								style="font-size: 28rpx;">+加料总价{{mainSale.clikSpItem.NEWPRICE}}={{mainSale.clikSpItem.PRICE+mainSale.clikSpItem.NEWPRICE}}</text>
						</view>
						<view>
							<button @click="mainSale.chengedQty" data-qty="-1"
								:disabled="mainSale.clikSpItem.ynAddPro">-</button>
							<label>{{mainSale.clikSpItem.ynAddPro?1:mainSale.clikSpItem.inputQty}}</label>
							<button @click="mainSale.chengedQty" data-qty="1"
								:disabled="mainSale.clikSpItem.ynAddPro">+</button>
						</view>
					</view>
					<view class="tochoose">
						<view v-for=" (sp, spinx) in mainSale.sale002" v-if="sp.BARCODE == mainSale.clikSpItem.SPID">
							<label class="shux"><text>{{sp.UNIT}}</text>*<text>{{sp.QTY}}</text>
								<text v-for="(sx08, sxindex) in mainSale.sale008"
									v-if="sp.NO==sx08.NO">[{{sx08.ATTNAME}}{{sx08.QTY?("x"+sx08.QTY):""}}]</text>
							</label>
							<label><text>￥{{sp.PRICE}}</text>
								<button :data-spid="sp.SPID" :data-row="spinx"
									@click="mainSale.updateSp(spinx,sp.SPID,0)" class="del">×</button></label>
						</view>
					</view>
					<view class="sizes" v-if="mainSale.clikSpItem.ynshowlist">
						<view class="sizelist">
							<label v-for=" (specs, specsinx) in mainSale.clikSpItem.specslist"
								:data-dgplid="specs.DGPLID" :data-dgjgz="specs.DGJGZ" :data-specs="specs.SPECS"
								:data-spid="specs.SPID" :class="specs.SPID==mainSale.clikSpItem.selectSPID?'curr':''"
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
		<view class="boxs" v-if="mainSale.ComponentsManage.openydCustmInput" style="text-align: right;z-index: 99999;">
			<ReserveDrawer :show="mainSale.ComponentsManage.openydCustmInput" :over48="mainSale.over48"
				:confirm="(mainSale.current_type.ReserveInfoInput).bind(mainSale)" :sale="mainSale.sale001"
				:decoration="mainSale.decoration" :_saleType="mainSale.clickSaleType.clickType">
			</ReserveDrawer>
		</view>

		<!-- 辅助促销 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.FZCX">
			<FZCX v-if="mainSale.ComponentsManage.FZCX" :_FZCXDatas="mainSale.FZCX" :_sale="mainSale.sale001">
			</FZCX>
		</view>
		<!-- 结算单 -->
		<view class="boxs" style="z-index: 99999;" v-if="mainSale.ComponentsManage.statement">
			<view class="memberes">
				<view class="shareButton" @click="mainSale.setComponentsManage" data-mtype='statement'></view>
				<!-- 会员信息 -->
				<view class="meminfo" v-if="ShowHY&&mainSale.HY.open">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label
								class="meminfo"><text>{{mainSale.HY.val.NickName}}</text><text>{{mainSale.HY.val.hyId}}</text></label>
						</label>
						<button class="close" @click="mainSale.HY.open = false">×</button>
					</view>
					<view class="nom">
						<label>
							<text>***</text>
							<!-- <text>￥{{ MemberBalance }}</text> -->
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
							<text>***</text>
							<!-- <text>{{ MemberGiftCard }}</text> -->
							<text>礼品卡</text>
						</label>
					</view>
					<view class="coulist">
						<view class="h2">会员信息</view>
						<view class="infoes">
							<view><text>会员手机号：</text>{{mainSale.HY.val.Phone}}</view>
							<view><text>会员生日：</text>{{mainSale.HY.val.Birthday}}</view>
							<view><text>注册日期：</text>{{RegisterDate}}</view>
							<view><text>企微好友：</text>{{mainSale.HY.val.WxCpFriend?"是":"否"}}</view>
						</view>
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
				<!-- 折扣信息 促销和折扣下且有值才显示-->
				<view class="meminfo" v-if="mainSale.currentOperation.showCXZK">
					<image class="bgs" src="@/images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">
						<label style="font-weight: 700;"><text>已使用的促销/折扣列表</text></label>
						<button class="close" @click="mainSale.showCXZKFunc">×</button>
					</view>
					<!-- 促销集合 -->
					<view class="listuls" v-if="mainSale.currentOperation.ynCx" style="padding:20rpx 2%">
						<view class="lis" v-for="(item,index) in mainSale.CXHDArr"
							style="width:90%;flex-direction: column;border:1px solid #eee">
							<view class="protheme">
								<image src="../../images/dakehu-xz.png" mode="widthFix"></image>
								<view class="themes">
									<view class="h8">活动主题：{{item.CXZT}}</view>
									<label><text>顾客范围：</text>{{item.CXRY}}</label>
									<label class="eventdate">活动日期：{{item.SDATE}} 至 {{item.EDATE}}</label>
								</view>
							</view>
						</view>
					</view>
					<!-- 折扣集合 -->
					<view class="zhekou" v-if="mainSale.currentOperation.Disc">
						<view class="lis" v-for="(item,index) in mainSale.ZKHDArr" style="width:90%;padding-top:4rpx;">
							<view v-if="item.ZKTYPE">
								<view class="h8">
									<view>折扣类型：{{item.ZKTYPE=='ZD02'?"标准折扣":"临时折扣"}}</view>
									<view>折扣额：<text>￥{{item.ZKNET}}</text></view>
								</view>
								<vlew class="manjian">
									满<span>{{item.MZNET}}</span>打<span>{{(item.ZKQTY_JS*10).toFixed(1)}}</span>折；</vlew>
								<view class="neirong">内容：{{item.ZKNAME}}</view>

							</view>
							<view v-else>
								<view class="h8">
									<view>折扣类型：{{"特批折扣"}}</view>
									<view>折扣额：<text>￥{{item.ZKNET}}</text></view>
								</view>
								<vlew class="manjian">打<span>{{(item.ZKQTY_JS*10).toFixed(1)}}</span>折</vlew>
								<view class="neirong">内容：{{item.ZKNAME}}</view>
							</view>
						</view>

					</view>
				</view>
				<!-- 结算单详情 -->
				<view class="pop-r pop-rs">
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<view>
								<button class="btn" @click="mainSale.HY.open=true"
									v-if="mainSale.HY.cval.hyId">{{mainSale.HY.cval.hyId}}</button>
								<button class="btn" v-else @click="mainSale.MemberLogin(1)">未登录...</button>
								<view class="score-box" v-if="mainSale.score_info.score && mainSale.score_info.money">
									活动可用积分:{{ mainSale.score_info.score }},可抵扣金额{{ mainSale.score_info.money }}
								</view>
							</view>
						</label>
						<text class="qingk"
							v-if="mainSale.clickSaleType.clickType=='sale'||mainSale.clickSaleType.clickType=='sale_reserve'"
							@click="mainSale.ResetCX()">{{!mainSale.currentOperation.ynResetCX?"清除促销":"恢复促销"}}</text>
					</view>
					<view class="h5"><text>账单</text>
						<label>
							<button v-if="mainSale.currentOperation.ynEdit&&!mainSale.currentOperation.showEdit"
								@click="mainSale.showEditFunc">编辑</button>
							<button v-if="mainSale.currentOperation.ynEdit&&mainSale.currentOperation.showEdit"
								@click="mainSale.completeEdit">完成</button>
							<button style="color:#FE694B;border-left:1px solid #eee"
								@click="mainSale.resetSaleBill()">清空</button>
						</label>
					</view>
					<view class="goods">
						<!-- 商品循环 -->
						<view class="prolist" v-for="(sp, spinx) in mainSale.sale002">
							<view class="h3">
								<label>
									<image src="../../images/dx-mrxk.png" mode="widthFix"></image>
									<label>{{sp.STR1}}</label>
									<text v-if="mainSale.actType=='Payment'">折扣￥{{sp.DISCRATE}}</text>
								</label>
								<view class="danjia"
									v-if="!mainSale.currentOperation.showEdit || CheckGoodIsLock(spinx)">
									<!-- <text>单价￥{{Price(sp.SPID)}}/</text> -->
									<text>单价￥{{sp.PRICE}}/</text>
									<text><em>×</em>{{mainSale.actType=='Payment'?sp.QTY:-sp.QTY}}</text>
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
								<!-- <text v-if="!mainSale.currentOperation.showEdit">原价￥{{(Price(sp.SPID)*sp.QTY).toFixed(2)}}</text> -->
								<text
									v-if="!mainSale.currentOperation.showEdit || CheckGoodIsLock(spinx)">总价￥{{mainSale.actType=='Payment'?sp.NET:-sp.NET}}</text>
								<!-- 数量编辑 -->
								<view class="bianji"
									v-if="mainSale.currentOperation.showEdit && !(CheckGoodIsLock(spinx))">
									<text @click="mainSale.Calculate(spinx,sp,-1)">
										<image style="width: 40rpx; height: 40rpx;" src="@/images/dx-jian.png"
											mode="widthFix"></image>
									</text>
									<label
										style="display:inline-block;text-align: center;width:100rpx">{{sp.QTY}}</label>
									<text @click="mainSale.Calculate(spinx,sp,1)">
										<image style="width: 40rpx; height: 40rpx;" src="@/images/dx-jia.png"
											mode="widthFix"></image>
									</text>
								</view>
							</view>
						</view>
					</view>
					<view class="ul">
						<view class="li">
							<!-- 支付展示整单金额 退款展示实付金额 -->
							<text>总金额</text><text>￥{{mainSale.actType=='Payment'?TotalNet:-mainSale.sale001.TNET}}</text>
						</view>
						<view class="li">
							<text>件数</text><text>{{mainSale.actType=='Payment'?TotalNum:-TotalNum}}</text>
						</view>
						<view class="li" @click="mainSale.showCXZKFunc">
							<text>总折扣<image style="width:40rpx;height:40rpx;vertical-align: middle;"
									src="@/images/ts-zhekou.png"></image>
							</text><text>￥{{mainSale.actType=='Payment'?-mainSale.sale001.BILLDISC:0}}</text>
						</view>
						<view class="li">
							<text>应收金额</text><text>￥{{ mainSale.actType=='Payment'?ReceivableAmount:-ReceivableAmount }}</text>
						</view>
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
						<view class="statnum">
							<image src="@/images/jsd-dxiao.gif" mode="widthFix"></image>
							<text>{{TotalNum}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 特殊折扣 -->
		<SpecialDisc v-if="mainSale.ComponentsManage.Disc" :zkdatas="mainSale.Disc.val.ZKData"
			:product="mainSale.sale002">
		</SpecialDisc>
		<!-- 画布 -->
		<view class="canvasdiv" :style="'visibility:hidden;'">
			<canvas canvas-id="couponQrcode" class="canvas"
				:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasLogo" class="canvas"
				:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasXPEWM" class="canvas"
				:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>
		</view>
		<!-- 蛋糕预定  -->
		<view class="dgyd" v-if="mainSale.ComponentsManage.sale_cake_reserve || mainSale.show_cake_reservation"
			@open="mainSale.ShowStatement">
			<view class="head">
				<view class="head-portrait" @click="mainSale.MemberLogin(1)">
					<image src="@/images/touxiang.png" mode="widthFix"></image>
					<view class="member-account">{{ mainSale.HY.val.hyId ? (mainSale.HY.val.hyId) : "点击登录..."}}</view>
				</view>
				<view class="head-exit">
					<view class="exit" @click="mainSale.dgydExit">
						<image src="@/images/tuichu.png"></image> 切换
					</view>
				</view>
			</view>
			<!-- //列表 -->
			<view v-show="!mainSale.mode_info.sale_cake_reserve.yn_showDetail">
				<view class="body-titles">
					<view style="width: 90%;display: flex;">
						<view class="hot-sales" style="height: 70rpx; line-height: 70rpx;">
							产品列表
							<label></label>
						</view>
						<view class="yixuan" v-if="CheckedList.length>0">

							<text style="display:inline-block;height: 70rpx; line-height: 70rpx;">已选：</text>
							<view class="yxlb">
								<label v-for="tag in CheckedList">{{ tag._NAME }}
									<!-- <button @click="DeleteCheckedTag(tag)">×</button> -->
								</label>

							</view>
							<!-- <label class="xsqb">显示全部…</label> -->
						</view>
					</view>
					<view class="filter" @click="mainSale.ToChoose">
						<span>共{{mainSale.CakeList.length}}款</span>
						<image src="@/images/qushaixuan.png"></image> 去筛选
					</view>
					<view class="shaixuan" v-if="mainSale.mode_info.sale_cake_reserve.filter">
						<view class="yixuan">
							<text>全部已选：</text>
							<view class="yxlb">
								<label v-for="item2 in mainSale.CheckTagList">{{item2._NAME}}<button
										@click="DeleteCheckingTag(item2)">×</button></label>
							</view>
							<view class="queding">
								<button @click="Reset">重置</button>
								<button @click="Confirm">确定</button>
							</view>
						</view>
						<view class="kinds">
							<view class="kindlist" :class="true?'tab_toggle_show':'tab_toggle_hide'">
								<label v-for="item in mainSale.CakeBQList" @click="mainSale.ChooseBQ(item)"
									:class="item.CHECK? 'curr':' '">{{item.BQNAME}}</label>
							</view>
							<!-- <button @click="Morekind">+ 更多</button> -->
						</view>
						<view class="tallys">
							<text>选择：</text>
							<view class="talist">
								<label v-for="item1 in mainSale.CakeTagList" @click="mainSale.ChooseTag(item1)"
									:class="item1._CHECK? 'curr':' '">
									{{item1._NAME}}
								</label>
							</view>
						</view>
					</view>
				</view>
				<view style="width: 100%;height: 100%">
					<Swiper :_swiperList="mainSale.CakeList" />
				</view>
			</view>
			<!-- 详情 -->
			<view class="detailys" v-if="mainSale.mode_info.sale_cake_reserve.yn_showDetail">
				<view class="body-titles" style="height:70rpx;line-height: 70rpx;">
					<view style="width: 90%;display: flex; align-items: center;"
						@click="mainSale.mode_info.sale_cake_reserve.ShowCakeDetail()">
						ㄑ
						<view class="hot-sales">
							产品详情
							<label></label>
						</view>
					</view>
				</view>
				<view class="particular">
					<view class="shuffs">
						<view class="banner">
							<swiper autoplay="true" :interval="5000" :duration="500" circular="true"
								indicator-active-color="#fff" easing-function="true" indicator-dots='true'
								:current="mainSale.mode_info.sale_cake_reserve.imgCurrent">
								<!-- @change="swiperChange" -->
								<swiper-item v-for="(item, index) in mainSale.clikSpItem.imglist" :key="index">
									<image :src="P_URL+item.IMGURL"></image>
								</swiper-item>
							</swiper>
						</view>
						<view class="tupian">
							<label v-for="(item, index) in mainSale.clikSpItem.imglist"
								@click="mainSale.mode_info.sale_cake_reserve.ChooseDetail(index)">
								<image :src="P_URL+item.IMGURL"></image>
							</label>
						</view>
					</view>
					<view class="exhibiting">
						<view class="h3">
							<image src="@/images/dx-mrxk.png" mode="widthFix"> {{mainSale.clikSpItem.SNAME}}
						</view>
						<view class="miaos">{{mainSale.clikSpItem.note}}</view>
						<view class="commods">
							<!-- 价格数量 -->
							<view class="price">
								<view>
									<text class="jiage">￥{{mainSale.clikSpItem.PRICE}}</text>
									<text v-if="mainSale.clikSpItem.ynAddPro" class="jiage zongjia"
										style="font-size: 28rpx;">+加料总价{{mainSale.clikSpItem.NEWPRICE}}={{mainSale.clikSpItem.PRICE+mainSale.clikSpItem.NEWPRICE}}</text>
								</view>
								<view>
									<button @click="mainSale.chengedQty" data-qty="-1"
										:disabled="mainSale.clikSpItem.ynAddPro">-</button>
									<label>{{mainSale.clikSpItem.ynAddPro?1:mainSale.clikSpItem.inputQty}}</label>
									<button @click="mainSale.chengedQty" data-qty="1"
										:disabled="mainSale.clikSpItem.ynAddPro">+</button>
								</view>
							</view>
							<!-- 加入购物车的产品属性 -->
							<view class="tochoose" v-if="false">
								<view v-for=" (sp, spinx) in mainSale.sale002"
									v-if="sp.BARCODE == mainSale.clikSpItem.SPID">
									<label class="shux"><text>{{sp.UNIT}}</text>*<text>{{sp.QTY}}</text>
										<text v-for="(sx08, sxindex) in mainSale.sale008"
											v-if="sp.NO==sx08.NO">[{{sx08.ATTNAME}}{{sx08.QTY?("x"+sx08.QTY):""}}]</text>
									</label>
									<label><text>￥{{sp.PRICE}}</text>
										<button :data-spid="sp.SPID" :data-row="spinx"
											@click="mainSale.updateSp(spinx,sp.SPID,0)" class="del">×</button></label>
								</view>
							</view>

						</view>
						<view class="yxlb">
							<!-- 以选标签   -->
							<label v-for="item2 in mainSale.clikSpItem.bqlist"># {{item2.NAME}}</label>
						</view>
						<view class="sizes">
							<view class="chic"><i class="sgin">*</i>尺寸</view>
							<view class="sizelist">
								<!-- 尺寸列表 -->
								<label v-for=" (specs, specsinx) in mainSale.clikSpItem.specslist"
									:data-dgplid="specs.DGPLID" :data-dgjgz="specs.DGJGZ" :data-specs="specs.SPECS"
									:data-spid="specs.SPID"
									:class="specs.SPID==mainSale.clikSpItem.selectSPID?'curr':''"
									@click="mainSale.selectSPID_Chenged">{{specs.SPECS}}</label>
							</view>
						</view>
						<view class="join"><button class="btn" data-yndgxp='N' @click="mainSale.getSp">确认</button>
						</view>
					</view>
				</view>
				<view class="states" @click="mainSale.ShowStatement">
					<text>结算单</text>
					<label>«</label>
					<view class="statnum">
						<image src="@/images/jsd-dxiao.gif" mode="widthFix"></image>
						<text>{{TotalNum}}</text>
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
	import Swiper from '@/components/blackmonth-swiper/index'
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
	import UnUpload from '@/pages/UnUpload/UnUpload.vue'
	import MemberLogin from '@/pages/MemberLogin/MemberLogin.vue'
	import ReserveDrawer from '@/pages/Reserve/ReserveDrawer.vue';
	import CakeReservation from '@/pages/CakeReservation/CakeReservation.vue';
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
				page_info: {},
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 200, //二维码宽
				qrCodeHeight: 200, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				sale_type_infos: null,
				Tallylist: false,
				P_URL: ""
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
			UnUpload,
			MemberLogin,
			ReserveDrawer,
			CakeReservation,
			PrinterPage,
			Swiper
		},
		computed: {
			Reset: function() {
				return (this.sale_type_infos.sale_cake_reserve.ResetCondition).bind(this.mainSale, this.mainSale
					.mode_info.sale_cake_reserve.condition);
			},
			Confirm: function() {
				return (this.sale_type_infos.sale_cake_reserve.ConfirmCondition).bind(this.mainSale, this.mainSale
					.mode_info.sale_cake_reserve.condition);
			},
			DeleteCheckedTag: function() {
				return (this.sale_type_infos.sale_cake_reserve.DeleteCheckedTag).bind(this.mainSale);
			},
			DeleteCheckingTag: function() {
				return (this.sale_type_infos.sale_cake_reserve.DeleteCheckingTag).bind(this.mainSale);
			},
			CheckedList: function() {
				let tags = [];
				console.log("[CheckedList]选择项目:", this.mainSale.mode_info.sale_cake_reserve.condition);
				this.mainSale.mode_info.sale_cake_reserve.condition.map(i => tags = tags.concat(i.DATA));
				console.log("[CheckedList]计算结果:", tags);
				return tags;
			},
			Price: function() {
				return util.callBind(this, function(spid) {
					return this.mainSale.spPrice[spid]?.PRICE ?? "-";
				})
			},
			CheckGoodIsLock: function() {
				return util.callBind(this, function(index) {
					// console.log("[CheckGoodIsLock]检查商品是否是被锁定的:", 
					// 	{
					// 	index,
					// 	lock: this.mainSale.currentOperation
					// });
					return (index + 1) <= this.mainSale.currentOperation.lockRows;
				})
			},
			Qushaixuan: function() {
				this.Tallylist = !this.Tallylist
			},
			Morekind: function() {
				if (this.qudao_num = 1) {
					this.qudao_num = 2
				} else {
					this.qudao_num = 1
				}
			},
			ReceivableAmount: function() { //mainSale.sale001.TNET
				console.log("[ReceivableAmount]待支付金额计算...", this.mainSale.current_type);
				var amount = 0;
				if (this.mainSale.current_type.clickType === 'sale_reserve') {
					let complet_ammount = 0; //已经完成的定金
					this.mainSale?.sale003.forEach(s3 => complet_ammount += s3.AMT);
					amount = (this.mainSale?.sale001?.TNET || 0) - complet_ammount
				} else if (this.mainSale.current_type.clickType === 'sale_reserve_cancel')
					amount = this.mainSale?.sale001?.DNET || 0;
				else if (this.mainSale.current_type.clickType === 'sale_reserve_extract')
					amount = (this.mainSale?.sale001?.ZNET || 0) - (this.mainSale?.sale001?.DNET || 0);
				else
					amount = (this.mainSale?.sale001?.TNET || 0);
				return amount?.toFixed(2);
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
				return this.mainSale.HY.val?.hyId && this.mainSale.currentOperation.HY;
			},
			MemberBalance: function() {
				return (this.mainSale.HY.val?.Balance ?? 0) / 100;
			},
			MemberPoint: function() {
				return (this.mainSale.HY.val?.JFBalance ?? 0);
			},
			RegisterDate: function() {
				let a = "";
				let day = this.mainSale.HY.val?.RegisterDay;
				if (day && day.indexOf(':') < 0) {
					a = day.substr(0, 4) + "-" + day.substr(4, 2) + "-" + day.substr(6, 2);
				}
				return a;
			},
			MemberGiftCard: function() {
				return (this.mainSale.HY.val?.hy_Assets?.GiftAmt ?? 0) / 100;
			},
			MemberCoupons: function() {
				return this.mainSale.HY.val.coupons ?? [];
			},
			MenuName: function() {
				return this.mainSale?.current_type?.clickType ?? ""
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
			},
			//商品总金额 包含折扣
			TotalNet: function() {
				console.log("00000000000001数据：", this.mainSale.sale001);
				let total = (this.mainSale.sale001.TNET + this.mainSale.sale001.BILLDISC).toFixed(2);
				return total;
			},
		},
		methods: {
			// 隐藏
			Componentes: function() {
				this.statement = false;
			},
			//销售打印小票
			bluePrinter: function(sale1_obj, sale2_arr, sale3_arr, print, type) {
				this.$refs.printerPage.bluePrinter(sale1_obj, sale2_arr, sale3_arr, print, type);
			},
			//线上订单打印小票
			xsBluePrinter: function(order, type, print) {
				this.$refs.printerPage.xsBluePrinter(order, type, print);
			},
			//外卖打印小票
			wmBluePrinter: function(order, datails, type, print) {
				this.$refs.printerPage.wmBluePrinter(order, datails, type, print);
			},
			//预定打印小票
			ydBluePrinter: function(sale1_obj, sale2_arr, sale3_arr, ydsale001, print) {
				this.$refs.printerPage.ydBluePrinter(sale1_obj, sale2_arr, sale3_arr, ydsale001, print);
			},
			//赊销打印小票
			sxBluePrinter: function(sale1_obj, sale2_arr, sale3_arr, sxsale001, print, type) {
				this.$refs.printerPage.sxBluePrinter(sale1_obj, sale2_arr, sale3_arr, sxsale001, print, type);
			},
		},
		created() {
			// uni.setLocale("en");
			// uni.showModal({
			// 	content: "请使用扫码枪扫码",
			// 	editable: true,
			// 	confirmText: "确认",
			// 	cancelText: "取消",
			// 	success: function(res) {
			// 		console.log("回调结果：", res);
			// 		if (res.confirm) {
			// 			if (res.content) {}
			// 		}
			// 	}
			// })
			console.log("[MainSale]开始构造函数!");
			this.sale_type_infos = mysale.XsTypeObj;
			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale", uni);
			console.log("[MainSale]原型:", this.mainSale.sale003.remove);
			console.log("[MainSale]开始设置基础的销售类型");
			this.mainSale.SetDefaultType();
			console.log("初始化的khid:", this.KHID);
			xs_sp_init.loadSaleSP.loadSp(this.KHID, util.callBind(this, function(products, prices) {
				console.log("[MainSale]商品实际的长度:", products.length);
				this.mainSale.SetAllGoods(products, prices);
			}), this.DQID, this.KHZID);
			let sys = util.getStorage("sysParam");
			if (sys && sys.DGIMGURL) {
				this.P_URL = sys.DGIMGURL;
			}
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
		z-index: 99;
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
		border-radius: 0;
	}

	.prolist .bianji {
		width: 180rpx !important;
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
		width: 160rpx !important;
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

	.price .zongjia {
		font-size: 28rpx;
		margin-left: 26rpx;
	}

	.score-box {
		background-color: var(--green);
		border-radius: 5px;
		font-size: 0.6rem;
		padding: 2px 5px;
		color: white;
		white-space: nowrap;
	}

	.shareButton {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		right: 0;
		background: none;
	}
</style>
