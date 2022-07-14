<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeout.css);
</style>

<template>
	<view class="content">
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
				<view class="curr">
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>外卖单</text>
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
								<image src="@/images/waimaidan.png" mode="widthFix"></image> 外卖单
								<!-- <view>类型：<text>立即送</text><text>预订单</text></view> -->
							</view>
							<view class="sousuo">
								<image src="@/images/sousuo.png" mode="widthFix"></image>搜索
							</view>
						</view>
						<!-- 小类循环 -->
						<view class="products">
							<view class="procycle">
								<!-- 外卖单循环 -->

								<view class="li" v-for="(item,index) in WMOrders" :order="item"
									@click="ShowDetail(item)">
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
										<label><text>下单时间：</text><text>{{Order.WDATE}}</text></label>
										<label><text>提货时间：</text><text>{{Order.CUSTMTIME}}</text></label>
										<label><text>订单备注：</text><text>{{Order.STR1}}</text></label>
									</view>
									<view class="h5"><text>单号：{{Order.BILL}}</text></view>
									<view class="goods">
										<!-- 商品循环 -->
										<view class="prolist" v-for="(item1,index1) in Details">
											<view class="h3">
												<label>
													<image src="@/images/dx-mrxk.png" mode="widthFix"></image>
													{{item1.STR5}}
												</label>
												<text>X{{item1.QTY}}</text>
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
												<text>￥{{item1.PRICE}}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="operat">
									<button class="btn" @click="ConfirmReceipt()">接受确认</button>
									<button class="btn" @click="ConfirmReback()">同意退单</button>
									<button class="btn" @click="RejectReback()">拒绝退单</button>
									<button class="btn btn-qx" @click="Close()">退出</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 报损数据 -->
		<view class="boxs" v-if="yn_bs">
			<view class="memberes">
				<view class="pop-r">
					<view class="member">
						<label>
							门店报损
						</label>
						<button @click="yn_bs=!yn_bs">×</button>
					</view>
					<view class="breakage">
						<label><text>报损原因：</text>{{bs_Reason}}</label>
						<label><text>备注：{{bs_Note}}</text></label>
					</view>
					<view class="h5"><text>报损商品</text></view>
					<view class="goods">
						<!-- 商品循环 -->
						<view class="prolist" v-for="(item,index) in BSDATA">
							<view class="h3">
								<label>
									<image src="../../images/dx-mrxk.png" mode="widthFix"></image> {{item.STR5}}
								</label>
								<text>X{{item.BQTY}}</text>
							</view>
							<view class="cods">
								<view>
									<label>
										<image src="../../images/dx-bm.png" mode="widthFix"></image>{{item.SPID}}
									</label>
									<!-- <label>
										<image src="../../images/dx-dw.png" mode="widthFix"></image>10个装
									</label> -->
								</view>
								<text>￥{{item.NUM1}}</text>
							</view>
						</view>

					</view>

					<view class="confirm">
						<button class="btn" @click="ConfirmBS()">报 损</button>
						<button class="btn" @click="yn_bs=false">取 消</button>
					</view>

					<!-- <view class="states" @click="Statements()">
          <text>结算单</text>
          <label>»</label>
        </view> -->

				</view>
			</view>
		</view>
		<!-- 外卖袋 -->
		<view class="boxs" v-if="yn_wmd">
			<!-- v-if="Shoppingbags" -->
			<view class="meminfo">
				<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
				<view>
					<view class="member">
						<label class="h9">选择外带包装袋</label>
						<button @click="yn_wmd=false">×</button>
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
					<view class="confirm">
						<button class="btn">确 认</button>
						<button class="btn btn-xk">跳 过</button>
					</view>
				</view>
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
	import _take from '@/api/business/takeaway.js';

	var that;
	export default {
		data() {
			return {
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				NAME: getApp().globalData.store.NAME,
				RYID: getApp().globalData.store.RYID,
				KCDID: getApp().globalData.store.KCDID,
				DQID: getApp().globalData.store.BMID,
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
			}
		},
		methods: {
			onLoad: function() {
				that = this; //全局赋值
				//外卖单渲染
				that.GetOrders(that.KHID, r => {
					that.ShowDetail(that.WMOrders[0]);
				});
			},
			//获取外卖单数据
			GetOrders: function(e, func) {
				_take.GetWMOrders(e, res => {
					// console.log("外卖单查询结果：", res);
					if (res.code) {
						that.WMOrders = JSON.parse(res.data).main;
						that.OrderDeails = JSON.parse(res.data).detail;
						console.log("主单集合信息：", JSON.stringify(that.WMOrders));
						console.log("明细单集合信息：", JSON.stringify(that.OrderDeails));
						if (func) func(res);
					} else {
						uni.showToast({
							title: res.msg,
							icon: "error"
						})
						that.WMOrders = [];
						that.OrderDeails = [];
						that.Order = {};
						that.Details = [];
					}
				})
			},
			//展示外卖单信息
			ShowDetail: function(e) {
				console.log("主单详情：", JSON.stringify(e));
				that.Order = e; //订单对象
				that.Details = that.OrderDeails.filter(i => i.BILL == e.BILL);
				console.log("明细单详情：", JSON.stringify(that.Details));
			},
			//确认接收
			ConfirmReceipt: function() {
				if (that.Order) {
					_take.ConfirmReceipt({
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
						gsid: that.GSID
					}, res => {
						console.log("外卖单接收结果：", res);
						uni.showToast({
							title: res.code ? "接收成功" : res.msg,
							icon: res.code ? "success" : "error"
						})
						if (res.code) {
							let data = JSON.parse(res.data);
							if (data.yn_print) {
								//调用打印
								console.log("此处调用打印：");
							}
							if (data.yn_bs) {
								that.new_bill = data.new_bill;
								//调用处理报损
								console.log("此处调用报损：");
								that.GetBSData(that.new_bill, that.Order.WDATE);
							}
						}
						setTimeout(r => {
							//刷新列表
							that.GetOrders(that.KHID, r => {
								that.ShowDetail(that.WMOrders[0]);
							});
						}, 1500);
					})
				}
			},
			//同意退单
			ConfirmReback: function() {
				if (that.Order) {
					if (that.Order.STATUS != '20' && that.Order.STATUS != '30') //不是则无法同意
					{
						uni.showToast({
							title: "请点击“接受确认”",
							icon: "error"
						})
						return;
					}
					that.commonRefund("1");
				}
			},
			//拒绝退单
			RejectReback: function() {
				if (that.Order) {
					if (that.Order.STATUS != '20' && that.Order.STATUS != '30') //不是则无法拒绝
					{
						uni.showToast({
							title: "请点击“接受确认”",
							icon: "error"
						})
						return;
					}
					that.commonRefund("0");
				}
			},
			//同意和拒绝退单操作
			commonRefund: function(e) {
				let serial = "";
				that.Details.forEach(item => {
					serial += item.SERIAL + ",";
				})
				serial = serial.substr(0, serial.length - 1); //去除逗号
				_take.CommonRefund({
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
					setTimeout(r => {
						//刷新列表
						that.GetOrders(that.KHID, r => {
							that.ShowDetail(that.WMOrders[0]);
						});
					}, 1500);
				})
			},
			//获取报损数据
			GetBSData: function(b, d) {
				// let arr = [
				// 	"delete from SYSYWTEMP001 WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051220713191155'",
				// 	"delete from SYSYWTEMP002 WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051220713191155'",
				// 	"insert into SYSYWTEMP002 ( CLTIME,STATUS,NUM6,NUM5,NUM4,NUM3,NUM2,NUM1,STR7,STR6,STR5,STR4,STR3,STR2,STR1,NOTE2,NOTE1,QTY3,QTY2,QTY1,PRICE,BQTY,PACK,SPID,YWTYPE,BILL,NOTEERR )\r\n values (NULL,NULL,'1','0','99999','0','0','0','个','N','樱桃诱惑12号-仟吉',NULL,NULL,'外卖收费袋领用','Z39',NULL,NULL,'0','0','0','0','1','0','000000001090100003','QTBS','K200QTD0051220713191155',NULL)",
				// 	"insert into SYSYWTEMP001   (KHID,POSID,GSID,BMID,YWTYPE,BILL,RYID,RYNAME,WDATE,WTIME,STR1,STR2,STR3,STR4,STR5,STR6,STR7,NOTE1,NOTE2,STATUS,TO_BMID,TO_KHID) \r\n                    values('K200QTD005','1','K200','','QTBS','K200QTD0051220713191155','10086','老王','2022-07-14','2022-07-14 09:55:21','','','','','','Z39','','','','0','','')",
				// 	"UPDATE  SYSYWTEMP001 SET STATUS= '0' WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051220713191155'",
				// 	"UPDATE  SYSYWTEMP002 SET STATUS= '0' WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051220713191155'"
				// ]
				// db.get().executeDml(arr,"操作中...", r => {
				// 	console.log("执行成功", r);
				// }, e => {
				// 	console.log("执行失败", e);
				// });
				// _take.dj_commit('K200QTD0051220713191155', "QTBS");
				// return;
				// b = "K200QTD0051220713191155";
				// d = "2022-07-13";
				that.yn_bs = true;
				_take.GetBSData({
					bill: b,
					orderDate: d
				}, res => {
					console.log("外卖单报损数据：", res);
					if (res.code) {
						let data = JSON.parse(res.data);
						that.BSDATA = data;
						that.bs_Reason = data[0].STR2;
						that.bs_Note = data[0].STR1;
					}
				})
			},
			//报损确认
			ConfirmBS: function() {
				if (!that.BSDATA || that.BSDATA.length == 0) {
					uni.showToast({
						title: "暂无报损数据",
						icon: "error"
					})
					return;
				}
				let obj = {
					storeid: that.KHID,
					posid: that.POSID,
					gsid: that.GSID,
					czyid: that.RYID,
					czyname: that.RYNAME,
					storeKhzid: that.KHZID,
					storeDqid: that.DQID,
					datas: that.BSDATA
				};
				console.log("报损请求数据：", obj);
				_take.ConfirmBS(obj, that.new_bill);
			},
			//退出
			Close: function() {
				uni.navigateBack();

				// that.yn_bs = !that.yn_bs;
			},
			//、、、、、、、、、、、、、、、、、、、、
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
			Close: function() {
				that.GetBSData()
				// uni.navigateBack({})
			}
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}
</style>
