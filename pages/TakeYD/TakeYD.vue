<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeyd.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<view class="navmall">
			<view class="logo">
				<image src="@/images/kengee-logo.png" mode="widthFix"></image>
			</view>
			<view class="menu">
				<view>
					<image class="xz" src="@/images/xiaoshou.png" mode="widthFix"></image>
					<image class="wx" src="@/images/xiaoshou-hui.png" mode="widthFix"></image>
					<text>销售</text>
				</view>
				<view>
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>预定</text>
				</view>
				<view>
					<image class="xz" src="@/images/xz-ydtq.png" mode="widthFix"></image>
					<image class="wx" src="@/images/wxz-ydtq.png" mode="widthFix"></image>
					<text>预定提取</text>
				</view>
				<view>
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>外卖单</text>
				</view>
				<view class="curr">
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>外卖预定</text>
				</view>
				<view>
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>线上订单</text>
				</view>
				<view>
					<image @click="Moreand()" class="xz" src="@/images/xz-th.png" mode="widthFix"></image>
					<image @click="Moreand()" class="wx" src="@/images/wxz-th.png" mode="widthFix"></image>
					<text @click="Moreand()">退单业务</text>
					<view class="chargeback" v-if="Chargeback">
						<label class="currs">
							<image class="xz" src="@/images/xstd.png" mode="widthFix"></image>
							<image class="wx" src="@/images/xstd-wxz.png" mode="widthFix"></image>
							<text>销售退单</text>
						</label>
						<label>
							<image class="xz" src="@/images/ydqx.png" mode="widthFix"></image>
							<image class="wx" src="@/images/ydqx-wxz.png" mode="widthFix"></image>
							<text>预订取消</text>
						</label>
						<label>
							<image class="xz" src="@/images/sxtd.png" mode="widthFix"></image>
							<image class="wx" src="@/images/sxtd-wxz.png" mode="widthFix"></image>
							<text>赊销退单</text>
						</label>
					</view>

				</view>
				<view>
					<image class="xz" src="@/images/xz-xx.png" mode="widthFix"></image>
					<image class="wx" src="@/images/xiaoxi-hui.png" mode="widthFix"></image>
					<text>消息</text>
				</view>
			</view>

			<view class="exit" @click="Close()">
				<image src="@/images/tuichu.png" mode="widthFix"></image>
				<text>退出</text>
			</view>
		</view>
		<view class="right">
			<view class="nav">
				<view class="getback">
					<!-- <image class="fh" src="@/images/fh.png" mode="widthFix" @click="backPrevPage()"></image> -->
					<view class="message">
						<view class="imgs">
							<image src="@/images/tongzhi.png" mode="widthFix"></image>
						</view>
						<text>门店有一条新的外卖配送单消息来啦...</text>
					</view>
				</view>
				<view class="stores">
					<view class="checkout">
						<label>
							<image src="@/images/dx-mendian.png" mode="widthFix"></image>{{NAME}}
						</label>
						<label>
							<image src="@/images/dx-kuantai.png" mode="widthFix"></image>款台号：{{POSID}}
						</label>
					</view>
					<view class="account">
						<text>{{RYID}}</text>
						<view>
							<image src="@/images/touxiang.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="listof">
				<view class="prolist">
					<view class="commodity">
						<view class="hh">
							<view class="hotcakes">
								<image src="@/images/waimaidan.png" mode="widthFix"></image> 外卖预定单
								<!-- <view>类型：<text>立即送</text><text>预订单</text></view> -->
							</view>
							<view class="sousuo" @click="Refresh()">
								<image src="@/images/shuaxin.png" mode="widthFix"></image>刷新
							</view>
						</view>
						<!-- 小类循环 -->
						<view class="products">
							<view class="procycle">
								<!-- 外卖单循环 -->

								<view class="li" :class="curIndex === index? 'curr':' '"
									v-for="(item,index) in WMOrders" :order="item" @click="ShowDetail(item,index)">
									<view class="h3">
										<view class="platform">
											<label>
												<image v-if="item.XSPTID=='ELM'" src="@/images/wmd-eleme.png"
													mode="widthFix"></image>
												<image v-if="item.XSPTID=='MEITUAN'" src="@/images/wmd-meituan.png"
													mode="widthFix"></image>
												<image v-if="item.XSPTID=='YOUZAN'" src="@/images/wmd-youzan.png"
													mode="widthFix"></image>
												{{item.NOTE2}}
											</label>
											<label class="state jiedan"
												v-if="item.STATUS==12"><text>●</text>{{item.STR3}}</label>
											<label class="state quxiao" v-else><text>●</text>{{item.STR3}}</label>
										</view>
										<view>￥{{item.ZNET}}</view>
									</view>
									<view class="cods">
										<label><text>提货时间：</text><text>{{item.CUSTMTIME}}</text></label>
										<label><text>流水号：</text><text>{{item.XS_BILL}}</text></label>
										<label><text>下单时间：</text><text>{{item.WDATE}}</text></label>
										<label><text>顾客电话：</text><text>{{item.STR6}}</text></label>
										<label><text>备注：</text><text>{{item.STR1}}</text></label>
									</view>
									<view class="address">
										订单类型：{{item.GSID}}
									</view>
								</view>

							</view>
							<view class="details">
								<view class="detinfo">
									<view class="member">
										<label>
											<image class="touxiang" src="@/images/touxiang.png"></image>
											<label
												class="xixin"><text>{{Order.STR5}}</text><text>{{Order.STR6}}</text></label>
										</label>
									</view>
									<view class="harvest">
										<label><text>外卖单号：</text><text>{{Order.BILL}}</text></label>
										<label><text>收货人：</text><text>{{Order.STR5}}</text></label>
										<label><text>联系电话：</text><text>{{Order.STR6}}</text></label>
										<label><text>下单时间：</text><text>{{Order.WDATE}} {{Order.WTIME}}</text></label>
										<label><text>提货时间：</text><text>{{Order.CUSTMTIME}}</text></label>
										<label><text>订单备注：</text><text>{{Order.STR1}}</text></label>
									</view>
									<view class="h5"><text>单号：{{Order.BILL}}</text></view>
									<view class="goods">
										<!-- 商品循环 -->
										<view class="prolist" v-for="(item1,index1) in Details">
											<view class="h3">
												<label>
													<checkbox-group @click="checkFunc(item1)" v-if="item1.yn_sb">
														<checkbox :checked="item1.isChecked"></checkbox>
													</checkbox-group>
													<image src="@/images/dx-mrxk.png" mode="widthFix"></image>
													{{item1.STR5}} — <text>￥{{item1.PRICE}}</text>
												</label>
												<view class="shuls"><text>×{{item1.PACK}}</text></view>
											</view>
											<view class="cods">
												<view>
													<label>
														<image src="@/images/dx-bm.png" mode="widthFix"></image>
														{{item1.SPID}}
													</label>
													<label>
														<image src="@/images/dx-dw.png" mode="widthFix"></image>
														{{item1.STR7}}
													</label>
												</view>
												<text>已取消：{{item1.BQTY}}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="operat">
									<button class="btn" @click="ConfirmReceipt()">接受确认</button>
									<button class="btn" @click="ConfirmReback()">同意退单</button>
									<button class="btn" @click="RejectReback()">拒绝退单</button>
									<button class="btn btn-qx" @click="ReBack()">退出</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	    <!-- 画布 -->
	    <view class="canvasdiv" :style="'visibility:hidden;'">
	    	<canvas canvas-id="couponQrcode" class="canvas"
	    		:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>
	    	<canvas canvas-id="canvasLogo" class="canvas"
	    		:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
	    	<canvas canvas-id="canvasXPEWM" class="canvas"
	    		:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>
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
	import _take from '@/api/business/takeaway.js';
	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	var that;
	export default {
		components: {
			PrinterPage
		},
		data() {
			return {
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				NAME: getApp().globalData.store.NAME,
				RYID: getApp().globalData.store.RYID,
				KCDID: getApp().globalData.store.KCDID,
				DQID: getApp().globalData.store.DQID,
				GSID: getApp().globalData.store.GSID,
				GCID: getApp().globalData.store.GCID,
				RYNAME: getApp().globalData.store.RYNAME,
				KHZID: getApp().globalData.store.KHZID,
				WMOrders: [],
				Order: {},
				OrderDeails: [],
				Details: [],
				statements: false,
				Alphabetical: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				coupon_list: [],
				yn_bs: false,
				yn_wmd: false,
				BSDATA: [],
				bs_Reason: "",
				bs_Note: "",
				new_bill: "", //单据操作后新生成的单号
				curIndex: 0,
				WMDDATA: [],
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 200, //二维码宽
				qrCodeHeight: 200, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
			}
		},
		methods: {
			onLoad: function() {
				that = this; //全局赋值
				//外卖单渲染
				that.GetOrders(that.KHID, r => {
					that.ShowDetail(that.WMOrders[0], 0);
				});
			},
			//获取外卖预定单数据
			GetOrders: function(e, func) {
				_take.GetWMOrders_YD(e, res => {
					// console.log("外卖单查询结果：", res);
					if (res.code) {
						that.WMOrders = JSON.parse(res.data).main;
						that.OrderDeails = JSON.parse(res.data).detail;
						// console.log("主单集合信息：", JSON.stringify(that.WMOrders));
						// console.log("明细单集合信息：", JSON.stringify(that.OrderDeails));
						if (func) func(res);
					} else {
						// uni.showToast({
						// 	title: res.msg,
						// 	icon: "error"
						// })
						that.WMOrders = [];
						that.OrderDeails = [];
						that.Order = {};
						that.Details = [];
					}
				})
			},
			//展示外卖单信息
			ShowDetail: function(e, i) {
				console.log("主单详情：", JSON.stringify(e));
				that.Order = e; //订单对象
				let detailArr = that.OrderDeails.filter(i => i.BILL == e.BILL);
				let arr = util.getStorage("POSCS");
				console.log("参数组数据:", arr);
				let obj = arr.find((r) => r.POSCS == 'BHLBBM');
				let bmArr = [];
				if (obj) {
					bmArr = obj.POSCSNR.split(',');
				}
				if (detailArr.length > 0) {
					detailArr.map((r) => {
						if (bmArr.indexOf(r.STR4) >= 0) {
							r.yn_sb = true;
						} else {
							r.yn_sb = false;
						};
						r.isChecked = false; //复选框默认值
					});
					that.Details = detailArr;
				}
				that.curIndex = i;
				console.log("明细单详情：", JSON.stringify(that.Details));
			},
			//复选款点击事件
			checkFunc: function(e) {
				if (e) {
					that.Details.forEach((item) => {
						if (item.SPID == e.SPID) {
							item.isChecked = !e.isChecked;
						}
					})
				}
			},
			//确认接收
			ConfirmReceipt: function() {
				console.log("提交单信息:", JSON.stringify(that.Order));
				console.log("提交单信息1:", JSON.stringify(that.Details));
				// return;
				if (that.Order && JSON.stringify(that.Order) != "{}") {
					_take.ConfirmReceipt_YD({
						status: that.Order.STATUS,
						bill: that.Order.BILL,
						khid: that.KHID,
						posid: that.POSID,
						ryid: that.RYID,
						storeKcdid: that.KCDID,
						storeKcdid: that.KCDID,
						refundtype: that.Order.BMID,
						orderDate: that.Order.WDATE,
						platformid: that.Order.XSPTID,
						storeGcid: that.GCID,
						storeDqid: that.DQID,
						gsid: that.GSID,
						billtype: that.Order.GSID, //立即送,预定单','取消单', '其他'
						spdatas: that.Details
					}, res => {
						console.log("外卖预定单接收结果：", res);
						uni.showToast({
							title: res.code ? "接收成功" : res.msg,
							icon: res.code ? "success" : "error"
						})
						if (res.code) {
							let data = JSON.parse(res.data);
							if (data.yn_print) {
								//调用打印
								//console.log("此处调用打印：");
								that.$refs.printerPage.wmBluePrinter(that.Order, that.Details,2);
							}
						}
						//列表刷新
						that.Refresh();
					})
				} else {
					uni.showToast({
						title: "暂无数据",
						icon: "error"
					})
				}
			},
			//同意退单
			ConfirmReback: function() {
				if (that.Order && JSON.stringify(that.Order) != "{}") {
					if (that.Order.STATUS != '20' && that.Order.STATUS != '30') //不是则无法同意
					{
						uni.showToast({
							title: "请点击“接受确认”",
							icon: "error"
						})
						return;
					}
					that.commonRefund("1");
				} else {
					uni.showToast({
						title: "暂无数据",
						icon: "error"
					})
				}
			},
			//拒绝退单
			RejectReback: function() {
				if (that.Order && JSON.stringify(that.Order) != "{}") {
					if (that.Order.STATUS != '20' && that.Order.STATUS != '30') //不是则无法拒绝
					{
						uni.showToast({
							title: "请点击“接受确认”",
							icon: "error"
						})
						return;
					}
					that.commonRefund("0");
				} else {
					uni.showToast({
						title: "暂无数据",
						icon: "error"
					})
				}
			},
			//同意和拒绝退单操作
			commonRefund: function(e) {
				let serial = "";
				that.Details.forEach(item => {
					serial += item.SERIAL + ",";
				})
				serial = serial.substr(0, serial.length - 1); //去除逗号
				_take.CommonRefund_YD({
					type: e,
					bill: that.Order.BILL,
					orderDate: that.Order.WDATE,
					platformid: that.Order.XSPTID,
					status: that.Order.STATUS,
					serial: serial,
					gsid: that.GSID,
					khid: that.KHID,
					posid: that.POSID,
					ryid: that.RYID,
					storeKcdid: that.KCDID,
					storeGcid: that.GCID,
					storeDqid: that.DQID
				}, res => {
					console.log("同意和拒绝退单结果：", res);
					uni.showToast({
						title: res.code ? "操作成功" : res.msg,
						icon: res.code ? "success" : "error"

					})
					//列表刷新
					that.Refresh();
				})
			},
			//列表刷新
			Refresh: function() {
				setTimeout(r => {
					that.GetOrders(that.KHID, r => {
						that.ShowDetail(that.WMOrders[0], 0);
					});
					that.$forceUpdate(); //刷新input的值 狗bug
				}, 1000);
			},
			//退出
			Close: function() {
				uni.navigateBack();
			},
			//退出按钮
			ReBack: function() {
				uni.navigateBack({});
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
			}
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}
</style>
