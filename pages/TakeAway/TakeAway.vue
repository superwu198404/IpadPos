<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeout.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<!-- <menu_page :menuIndex="3"></menu_page> -->
		<view class="right">
			<view :class="exit_btn ? 'bkjb full-screen' : 'bkjb'">
				<view class="neik">
					<!-- <menu_head></menu_head> -->
					<view class="listof">
						<view class="prolist" style="display: flex;flex-direction: column;">
							<view :class="exit_btn ? 'hh add-top' : 'hh'">
								<view class="hotcakes">
									<image src="@/images/waimaidan.png" mode="widthFix"></image> 外卖单
									<!-- <view>类型：<text>立即送</text><text>预订单</text></view> -->
								</view>
								<view>
									<view class="sousuo" @click="Refresh()">
										<image src="@/images/shuaxin.png" mode="widthFix"></image>刷新
									</view>
									<view class="sousuo" v-if="exit_btn" @click="Exit()">
										<image src="@/images/tuichu.png"
											style="filter: grayscale(1)invert(1)brightness(30.5);" mode="widthFix">
										</image>退出
									</view>
								</view>
							</view>
							<NoData v-if="WMOrders.length==0"></NoData>
							<view class="products" style="flex:1;margin-bottom:60rpx;" v-else>
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
											<label><text>流水号：</text><text>{{item.XS_BILL}}</text></label>
											<label><text>提货时间：</text><text>{{item.CUSTMTIME}}</text></label>
											<!-- <label><text>下单时间：</text><text>{{item.WDATE}}</text></label>
										<label><text>顾客电话：</text><text>{{item.STR6}}</text></label>
										<label><text>备注：</text><text>{{item.STR1}}</text></label> -->
										</view>
										<view class="address">
											订单类型：{{item.GSID}}
										</view>
									</view>
								</view>
								<view class="details" v-if="WMOrders.length>0">
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
											<!-- <label><text>收货人：</text><text>{{Order.STR5}}</text></label>
										<label><text>联系电话：</text><text>{{Order.STR6}}</text></label> -->
											<label><text>下单时间：</text><text>{{Order.WTIME}}</text></label>
											<!-- <label><text>提货时间：</text><text>{{Order.CUSTMTIME}}</text></label> -->
											<label><text>订单备注：</text><text>{{Order.STR1}}</text></label>
										</view>
										<!-- <view class="h5"><text>单号：{{Order.BILL}}</text></view> -->
										<view class="goods">
											<!-- 商品循环 -->
											<view class="prolist" v-for="(item1,index1) in Details">
												<view class="h3">
													<label>
														<image src="@/images/dx-mrxk.png" mode="widthFix"></image>
														{{item1.STR5}} — <text>￥{{item1.PRICE}}</text>
													</label>
													<view class="shuls"><text>×{{item1.QTY}}</text></view>
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
										<button class="btn" @click="ConfirmReceipt()" v-if="yn_qr">接受确认</button>
										<button class="btn" @click="ConfirmReback()" v-if="yn_ty">同意退单</button>
										<button class="btn" @click="RejectReback()" v-if="yn_jj">拒绝退单</button>
										<!-- <button class="btn btn-qx" @click="ReBack()">退出</button> -->
									</view>
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
				<view class="pop-r" style="right:0 !important;">
					<view class="member">
						<label>
							门店报损
						</label>
						<button @click="Close()">×</button>
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
									<image src="../../images/dx-mrxk.png" mode="widthFix"></image>{{item.STR5}}
								</label>
								<text>X{{item.BQTY}}</text>
							</view>
							<view class="cods">
								<view>
									<label>
										<image src="../../images/dx-bm.png" mode="widthFix"></image>{{item.SPID}}
									</label>
									<label>
										<image src="../../images/dx-dw.png" mode="widthFix"></image>{{item.UNIT}}
									</label>
								</view>
								<text>￥{{item.NUM1}}</text>
							</view>
						</view>

					</view>

					<view class="confirm">
						<button class="btn" @click="ConfirmBS()">报 损</button>
						<button class="btn" @click="Close()">取 消</button>
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
						<button @click="Close()">×</button>
					</view>
					<view class="shoppbag">
						<view class="baglist curr" v-for="(item,index) in WMDDATA">
							<view class="bag">
								<text class="h8">{{item.SNAME}}</text>
								<label><text>说明</text>最多可选{{item.ZQTY}}{{item.UNIT}}</label>
							</view>
							<view class="quantit">
								<text>数量</text>
								<view class="nums">
									<text @click="Calculate(item,'-')">-</text>
									<input type="number" v-model="item.BQTY" @blur="Calculate(item,'*',$event)" />
									<text @click="Calculate(item,'+')">+</text>
								</view>
							</view>
						</view>
					</view>
					<view class="confirm">
						<button class="btn" @click="ConfirmWMD()">确 认</button>
						<button class="btn btn-xk" @click="Skip()">跳 过</button>
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
	import _member from '@/api/hy/MemberInterfaces.js';
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
				BMID: getApp().globalData.store.BMID,
				brand: getApp().globalData.brand,
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
				qrCodeWidth: 256, //二维码宽
				qrCodeHeight: 256, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				yn_qr: false, //确认按钮
				yn_ty: false, //同意按钮
				yn_jj: false, //拒绝按钮
				js_res: {}, //确认接收返回结果
				exit_btn: false, //是否显示退出按钮
				event_channel: null
			}
		},
		methods: {
			onLoad: function(option) {
				that = this; //全局赋值
				this.event_channel = this.getOpenerEventChannel();
				this.event_channel?.emit('get_take_away', this);
				//外卖单渲染
				that.GetOrders(that.KHID, r => {
					that.ShowDetail(that.WMOrders[0], 0);
				});
			},
			//获取外卖单数据
			GetOrders: function(e, func) {
				_take.GetWMOrders(e, res => {
					// console.log("外卖单查询结果：", res);
					if (res.code) {
						that.WMOrders = JSON.parse(res.data).main;
						that.OrderDeails = JSON.parse(res.data).detail;
						// console.log("主单集合信息：", JSON.stringify(that.WMOrders));
						// console.log("明细单集合信息：", JSON.stringify(that.OrderDeails));
						if (func) func(res);
					} else {
						util.simpleMsg("暂无数据", true);
						that.WMOrders = [];
						that.OrderDeails = [];
						that.Order = {};
						that.Details = [];
					}
				})
			},
			//展示外卖单信息
			ShowDetail: function(e, i) {
				if (e) {
					if (e.STATUS == '12' || e.STATUS == '15' || e.STATUS == '33') {
						that.yn_qr = true;
						that.yn_ty = false;
						that.yn_jj = false;
					}
					if (e.STATUS == '20' || e.STATUS == '30') {
						that.yn_qr = false;
						that.yn_ty = true;
						that.yn_jj = true;
					}
				}
				console.log("主单详情：", JSON.stringify(e));
				that.Order = e; //订单对象
				that.Details = that.OrderDeails.filter(i => i.BILL == e.BILL);
				that.curIndex = i;
				console.log("明细单详情：", JSON.stringify(that.Details));
			},
			//确认接收
			ConfirmReceipt: function() {
				if (that.Order && JSON.stringify(that.Order) != "{}") {
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

						if (res.code) {
							let data = JSON.parse(res.data);
							console.log("返回信息:", data);
							that.js_res = data;
							//是退单状态接收确认，打印退单小票
							if (data.yn_print && (that.Order.STATUS == "33" || that.Order.STATUS == "15")) {
								let wm_type = "WM";
								let printerPram = {
									"PRINTNUM": 1,
									"XSTYPE": wm_type,
									"BS_REASON": that.bs_Reason,
									"BS_NOTE": that.bs_Note,
									"NEW_BILL": data.new_bill,
								};
								that.$refs.printerPage.wmBluePrinter(that.Order, that.Details, printerPram);
							}
							if (data.yn_bs) { //有报损操作
								that.new_bill = data.new_bill;
								//调用处理报损
								console.log("此处调用报损：");
								that.GetBSData(that.new_bill, that.Order.WDATE);
							}
							if (data.yn_wmd) //有外卖袋
							{
								console.log("此处调用领用：");
								that.GetWMDData(that.DQID, that.Order.XSPTID);
							}
							// if (data.pay_data && data.pay_data.length > 0) {
							// 	if (that.Order.XSPTID == 'YOUZAN' && that.Order.YZID) {
							// 		console.log("有赞接单后调用积分上传接口:")
							// 		that.JFConsume(data.pay_data, that.Order.YZID);
							// 	}
							// }
						} else {
							// util.simpleMsg("接收失败：", res.msg, true);
							util.simpleModal("接收失败", res.msg);
						}
						if (!that.yn_bs && !that.yn_wmd) { //防止刷新过快
							//刷新列表
							that.Refresh();
						}

					})
				} else {
					util.simpleMsg("暂无数据", true);
				}
			},

			//同意退单
			ConfirmReback: function() {
				if (that.Order && JSON.stringify(that.Order) != "{}") {
					if (that.Order.STATUS != '20' && that.Order.STATUS != '30') //不是则无法同意
					{
						util.simpleMsg("请点击“接受确认”", "none");
						return;
					}
					that.commonRefund("1");
				} else {
					util.simpleMsg("暂无数据", true);
				}
			},
			//拒绝退单
			RejectReback: function() {
				if (that.Order && JSON.stringify(that.Order) != "{}") {
					if (that.Order.STATUS != '20' && that.Order.STATUS != '30') //不是则无法拒绝
					{
						util.simpleMsg("请点击“接受确认”", "none");
						return;
					}
					that.commonRefund("0");
				} else {
					util.simpleMsg("暂无数据", true);
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
					if (res.code) {
						util.simpleMsg("操作成功");
						if (res.data.yn_print) {
							//调用打印
							console.log("此处调用打印：");
							//打印
							if (that.js_res.yn_print) {
								let wm_type = that.yn_bs ? "WMTHBS" : "WM";
								let printerPram = {
									"PRINTNUM": 2,
									"XSTYPE": wm_type,
									"BS_REASON": that.bs_Reason,
									"BS_NOTE": that.bs_Note,
									"NEW_BILL": that.new_bill,
								};
								that.$refs.printerPage.wmBluePrinter(that.Order, that.Details, printerPram);
							}
						}
					} else {
						util.simpleModal("操作失败", res.msg);
					}
					//刷新列表
					that.Refresh();
				})
			},

			//调用积分
			JFConsume: function(PayList, hyid) {
				let obj = {
					channel: "POS",
					bill: that.Order.BILL, //订单号
					date: dateformat.getYMDS(),
					productList: this.Details.map((item, i) => {
						return {
							lineNumber: i,
							product: item.SPID,
							category: item.STR4,
							quantity: item.QTY,
							userPrice: item.PRICE,
							basePrice: item.PRICE,
							netPrice: item.NET
						}
					}),
					amount: that.Order.ZNET, //netAmount: that.totalAmount,
					orderAmount: that.Order.ZNET,
					payList: PayList.map(item => {
						return {
							paymentType: item.FKID,
							payAmount: item.AMT
						}
					}),
					khid: that.KHID,
					region: that.BMID,
					hyid: hyid, //会员id 也就是有赞ID
					actionType: "INCREASE" //values： INCREASE(增加) or DECREASE(减少)
				};
				console.log("积分上传参数：", obj);
				_member.UploadPoint("积分上传中...", {
					brand: that.brand,
					data: obj
				}, (res) => {
					console.log("积分上传成功...", res)
					if (res.code) {
						util.simpleMsg("积分上传成功");
					} else {
						util.simpleModal("积分上传失败", res.msg);
					}
				}, (err) => {
					console.log("积分上传失败...", err)
					util.simpleModal("积分上传失败", err.msg);
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
				// b = "K200QTD0051220714145754";
				// d = "2022-07-14";
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
					util.simpleMsg("暂无报损数据", true);
					return;
				}
				let obj = {
					storeid: that.KHID,
					posid: that.POSID,
					gsid: that.GSID,
					czyid: that.RYID,
					czyname: that.RYNAME,
					storeKhzid: that.KHZID,
					storeDqid: that.DQID
				};
				let newArr = JSON.parse(JSON.stringify(that.BSDATA))
				for (const key in newArr) {
					delete newArr[key].UNIT;
				}
				console.log("报损数据处理开始：", obj);
				console.log("报损数据处理开始1：", newArr);
				_take.ConfirmBS(newArr, common.ywTypeEnum.QTBS, that.new_bill, obj, res => {
					console.log("报损本地操作结果：", res);
					if (res.code) {
						util.simpleMsg("接收成功");
						//调用打印
						if (that.js_res.yn_print) {
							let wm_type = that.yn_bs ? "WMTHBS" : "WM";
							let printerPram = {
								"PRINTNUM": 2,
								"XSTYPE": wm_type,
								"BS_REASON": that.bs_Reason,
								"BS_NOTE": that.bs_Note,
								"NEW_BILL": that.new_bill,
							};
							that.$refs.printerPage.wmBluePrinter(that.Order, that.Details, printerPram);
						}
					} else {
						util.simpleModal("操作失败", res.msg);
					}
					console.log("主动关闭报损");
					that.Close();
				});
			},

			//获取外卖袋数据
			GetWMDData: function(b, d) {
				that.yn_wmd = true;
				_take.GetWMDData(b, d, res => {
					console.log("外卖袋数据：", res);
					if (res.code && res.msg.length > 0) {
						that.WMDDATA = res.msg;
						that.WMDDATA.forEach((item, index, arr) => {
							if (arr.length == 1) {
								item.BQTY = 1;
							} else {
								item.BQTY = 0;
							}
						})
					} else { //没有外卖袋的时候 直接进行积分上传和打印
						that.Skip();
					}
				})
			},
			//数量计算
			Calculate: function(e, t, event) {
				// console.log("计算事件:", e + t);
				if (t == '+') {
					if (e.BQTY == e.ZQTY) {
						e.BQTY = e.ZQTY;
						util.simpleMsg("不能再多了", true);
					} else {
						e.BQTY += 1;
					}
				} else if (t == '-') {
					if (e.BQTY <= 0) {
						e.BQTY = 0;
						util.simpleMsg("不能再少了", true);
					} else {
						e.BQTY -= 1;
					}
				} else if (t == '*') {
					let num = event.detail.value;
					num = parseFloat(num);
					console.log("输入得值:", num);
					if (num > e.ZQTY || num <= 0) {
						num = 0;
						util.simpleMsg("数量输入有误", true);
					}
					e.BQTY = num;
				}
				that.WMDDATA.forEach((item, index, arr) => {
					// console.log("商品信息：", item.SPID + "/" + e.SPID);
					if (item.SPID == e.SPID) {
						item.BQTY = e.BQTY;
					}
				});

				// that.$set(that.WMDDATA[index], "BQTY", e.BQTY); // 实例方法$set
				that.$forceUpdate(); //刷新input的值 狗bug
				console.log("新数量:", that.WMDDATA);
			},
			//外卖袋确认
			ConfirmWMD: function() {
				let arr = that.WMDDATA.filter((item) => {
					return item.BQTY > 0
				});
				let bill = "WMLY" + that.Order.BILL;
				if (!arr || arr.length == 0) {
					util.simpleMsg("无可用数据", true);
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
					datas: arr,
					bill: bill,
					ywtype: common.ywTypeEnum.QTLY
				};
				_take.ConfirmLY(obj, bill, common.ywTypeEnum.QTLY, res => {
					console.log("领用本地操作结果：", res);
					if (res.code) {
						that.UpAndPrint();
					}
					that.Close();
				});
			},
			//上传积分和打印
			UpAndPrint: function() {
				//先上传积分
				if (that.js_res.pay_data && that.js_res.pay_data.length > 0) {
					if (that.Order.XSPTID == 'YOUZAN' && that.Order.YZID) {
						console.log("有赞接单后调用积分上传接口:")
						that.JFConsume(that.js_res.pay_data, that.Order.YZID);
					}
				}
				util.simpleMsg("接收成功");
				//后打印
				if (that.js_res.yn_print) {
					let wm_type = that.yn_bs ? "WMTHBS" : "WM";
					let printerPram = {
						"PRINTNUM": 2,
						"XSTYPE": wm_type,
						"BS_REASON": that.bs_Reason,
						"BS_NOTE": that.bs_Note,
						"NEW_BILL": that.new_bill,
					};
					that.$refs.printerPage.wmBluePrinter(that.Order, that.Details, printerPram);
				}
			},
			//列表刷新
			Refresh: function() {
				setTimeout(r => {
					that.GetOrders(that.KHID, r => {
						that.ShowDetail(that.WMOrders[0], 0);
					});
				}, 1000);
			},
			//外卖袋跳过
			Skip: function(e) {
				//外卖袋 跳过后 直接调用积分上传和打印
				that.UpAndPrint();
				that.Close();
			},
			//退出
			Close: function() {
				that.yn_bs = false;
				that.yn_wmd = false;
				//刷新列表
				that.Refresh();
			},
			//退出按钮
			ReBack: function() {
				uni.navigateBack({});
				// that.GetWMDData(that.DQID, "YOUZAN"); //that.Order.XSPTID
				// let arr = [
				// 	"delete from SYSYWTEMP001 WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051220714145754'",
				// 	"delete from SYSYWTEMP002 WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051220714145754'",
				// 	"delete from pos_txfile where str1='K200QTD0051220714145754'"
				// ]
				// db.get().executeDml(arr, "操作中...", r => {
				// 	console.log("删除成功", r);
				// }, e => {
				// 	console.log("删除失败", e);
				// });
				// that.yn_bs = true;
				// that.new_bill = "K200QTD0051220714145754";
				//  that.GetBSData("K200QTD0051220714145754", "2022-07-14");
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
			Exit: function() {
				uni.navigateBack();
			}
		},
		created() {
			that = this; //全局赋值
			//外卖单渲染
			that.GetOrders(that.KHID, r => {
				that.ShowDetail(that.WMOrders[0], 0);
				uni.$emit("exists-takeaway");
			});
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}

	.meminfo {
		width: 70%;
	}

	.meminfo .confirm {
		position: absolute;
		bottom: 1%;
		left: 0;
	}

	.sousuo {
		margin-right: 0px !important;
	}

	.full-screen {
		box-sizing: border-box;
		width: 100% !important;
		height: 100% !important;
	}

	.add-top {
		padding-top: 60rpx;
	}
</style>
