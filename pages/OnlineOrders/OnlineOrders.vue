<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeout.css);
	@import url(@/static/style/common.css);
	/* @import url(@/static/style/OnlineOrders/index.css); */
</style>
<template>
	<view class="right">
		<view class="bkjb">
			<view class="neik">
				<!-- <menu_content :index="5" :_index="0"> -->
				<view class="commodity" style="position: relative;">
					<PrinterPage ref="printerPage" style="display: none;" />
					<view class="hh">
						<view class="hotcakes">
							<image src="@/images/ydtq.png" mode="widthFix"></image> 线上订单
						</view>
						<view class="prints">
							<view>
								<view class="prints">
									<!-- <view class="sousuo" @click="view.search.open = true">
										<label>
											<image src="../../images/sousuo.png" mode="widthFix"></image>提取
										</label>
									</view> -->
									<!-- <view class="sousuo">
								<image src="../../images/ydtq-dyj.png" mode="widthFix"></image>打印
							</view> -->
									<!-- <view class="sousuo">
										<label>
											<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
										</label>
									</view> -->
									<view class="sousuo" @click="GetOnlineOrders()" style="color: white;">
										<image src="@/images/shuaxin.png" mode="widthFix"></image>刷新
									</view>
								</view>
							</view>
						</view>
					</view>

					<NoData v-if="Object.keys(onlineOrdersGroup).length==0"></NoData>
					<!-- 小类循环 -->
					<view class="products" v-else>
						<view class="procycle">
							<!-- 外卖单循环 -->
							<view v-for="(item,index) in Object.keys(onlineOrdersGroup)" :class="getCheckStyle(item)"
								@tap="ShowDetail(onlineOrdersGroup[item][0])">
								<view class="h3">
									<view class="platform">
										<label>
											{{ item }}
										</label>
										<label
											:class="'state quxiao ' + getTakeWayStyle(onlineOrdersGroup[item][0].THTYPE)"><text>●</text>{{ getTakeWayText(onlineOrdersGroup[item][0].THTYPE) }}</label>
										<!-- <label class="state jiedan" v-if="jiedan"><text>●</text>请接单</label> -->
									</view>
									<view>￥{{onlineOrdersGroup[item][0].PRICE}}</view>
								</view>
								<view class="cods">
									<label><text class="text-nowrap">预定时间：</text><text
											class="ellipsis-text">{{onlineOrdersGroup[item][0].SALETIME || '-'}}</text></label>
									<label><text class="text-nowrap">顾客姓名：</text><text
											class="ellipsis-text">{{onlineOrdersGroup[item][0].CUSTMNAME || '-'}}</text></label>
								</view>
								<view class="address">
									顾客地址：{{onlineOrdersGroup[item][0].CUSTMADDRESS || '-'}}
								</view>
							</view>
						</view>
						<view class="details" v-if="onlineOrders.length>0">
							<view class="meminfo">
								<view class="member">
									<label>
										<image class="touxiang" src="@/images/touxiang.png"></image>
										<label
											class="meminfo"><text>{{ details.order.CUSTMNAME || "-" }}</text><text>{{ details.order.CUSTMPHONE || "-" }}</text></label>
									</label>
								</view>
								<view class="harvest">
									<label class="from-label">
										<text>裱花间：</text>
										<text v-if="mode('read')">{{details.order.KHSNAME || '-'}}</text>
										<StorePicker mode="selector" class="input" style="z-index: 99999999;"
											:init="details.order.KHID_BH" v-if="mode('edit')" @change="StoreChange">
										</StorePicker>
									</label>
									<label class="from-label">
										<text>到货日期：</text>
										<text v-if="mode('read')">{{details.order.DATE_DH || '-'}}</text>
										<picker v-if="mode('edit')" class="date-picker picker" mode="date" fields="day"
											:value="getOrderDate" :start="new Date()" @change="SelectDate">
											<view class="uni-input">{{ viewDate }}</view>
										</picker>
										<picker v-if="mode('edit')" class="time-picker picker" mode="time" fields="time"
											:value="getOrderTime" :start="getCurrentTime" @change="SelectTime">
											<view class="uni-input">{{ viewTime }}</view>
										</picker>
										<text v-if="mode('edit')" class="tips" @click="DateTimeTips()">!</text>
									</label>
									<label class="from-label">
										<text>到货时段：</text>
										<text>{{ timeRangeView }}</text>
									</label>
									<label class="from-label">
										<text>数量：</text>
										<text>{{details.goods.length || '-'}}</text>
										<!-- <text>{{details.order.ZQTY_SQ || '-'}}</text> -->
									</label>
									<label class="from-label">
										<text>单位：</text>
										<text>{{details.order.UNIT || '-'}}</text>
									</label>
									<label class="from-label">
										<text>客户要求：</text>
										<text v-if="mode('read')">{{details.order.CUSTMCOMM || '-'}}</text>
										<input v-if="mode('edit')" class="input" type="text"
											v-model="details.order.CUSTMCOMM" />
									</label>
								</view>
								<view class="goods">
									<!-- 商品循环 -->
									<view class="prolist" v-for="(i,index) in this.details.goods">
										<view class="h3">
											<label>
												<image src="@/images/dx-mrxk.png" mode="widthFix"></image>
												{{i.SNAME}} — <text>￥{{i.PRICE}}</text>
											</label>
											<view class="shuls"><text>×{{i.ZQTY_SQ}}</text></view>
										</view>
										<view class="cods">
											<view>
												<label>
													<image src="@/images/dx-bm.png" mode="widthFix"></image>
													{{i.SPID}}
												</label>
												<label>
													<image src="@/images/dx-dw.png" mode="widthFix"></image>
													{{i.STR7}}
												</label>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="operat">
								<button
									v-if="mode('read') && view.search.confirm && !view.check.loading && view.check.result"
									class="btn btn-edit" @click="Edit()">编辑</button>
								<button v-if="mode('edit')" class="btn" @click="Save()">保存</button>
								<button v-if="mode('edit')" class="btn btn-qx" @click="CancelSave()">取消</button>
								<button
									v-if="mode('read') && view.search.confirm && !view.check.loading && view.check.result"
									class="btn" @click="ConfirmAccept(true)">接受确认</button>
								<button
									v-if="mode('read') && !view.search.confirm && !view.check.loading && view.check.result"
									class="btn btn-qx" @click="ConfirmAccept(false)">取消</button>
								<view class="check-tips loading" v-if="view.check.loading">订单状态检查中</view>
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
		</view>
	</view>
	<!-- </menu_content> -->
</template>
<script>
	var app = getApp();
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import {
		RequestSend
	} from '@/api/business/da.js';
	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	import {
		getOnlineOrders, //获取线上订单
		getTimeRange, //获取时间段
		getRoom, //获取裱花间（暂时不用修改）
		updateOrderInfo, //更新表接口
		ordersAccept, //顶顶那处理
		ordersStatusCheck
	} from '@/api/business/onlineorders.js';
	import {
		Validity
	} from '@/bll/OnlineOrders/bll.js'
	import {
		global
	} from '@/models/PaymentAll/models.js';
	var that;
	export default {
		name: 'OnlineOrders',
		mixins: [global],
		components: {
			PrinterPage
		},
		data() {
			return {
				onlineOrders: [],
				onlineOrdersGroup: [],
				BHLB: `(${util.getStorage("POSCS")?.find(i => i.POSCS === 'BHLBBM')?.POSCSNR || "109"})`,
				EndTime: `(${util.getStorage("POSCS")?.find(i => i.POSCS === 'QHJZSJ')?.POSCSNR || "18:00"})`,
				view: {
					search: {
						open: false,
						title: "提取商品",
						form: {
							code: "",
							bill: "LH202209220005"
						},
						confirm: false
					},
					check: {
						loading: false,
						result: true,
						bill: ""
					}
				},
				datetime: {
					date: {
						start: ""
					},
					time: {
						start: "",
						end: ""
					}
				},
				details: {
					order: {
						DHSJD: "",
						DATE_DH: "",
						CUSTMNAME: "",
						CUSTMCOMM: "",
						CUSTMPHONE: "",
						KHSNAME: "",
						CUSTMADDRESS: "",
						STATUS: "", //状态 （1：确认 9：取消）
						$date: "",
						$time: ""
					},
					goods: []
				},
				timeRange: [ /*到货时段*/ ],
				decorationRoom: [ /*裱花间*/ ],
				edit: false, //开启编辑状态
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 256, //二维码宽
				qrCodeHeight: 256, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
			}
		},
		watch: {
			'details.order.$date': function(n, o) {
				this.details.order.DATE_DH = `${this.details.order.$date} ${this.details.order.$time}`.trim() || this
					.details.order.DATE_DH;
			},
			'details.order.$time': function(n, o) {
				this.details.order.DATE_DH = `${this.details.order.$date} ${this.details.order.$time}`.trim() || this
					.details.order.DATE_DH;
			},
			'details.order.DATE_DH': function(n, o) {
				this.SetTimeRange();
			},
			'details.order': function(n, o) {
				this.onlineOrders.filter(i => i.$checked).map(i => {
					i.$checked = false;
					return i;
				})
				n.$checked = true;
			}
		},
		computed: {
			getOrderDate: function() {
				return this.details.order.DATE_DH?.split(' ')[0] || JSON.stringify(new Date()).split("T")[0];
			},
			getOrderTime: function() {
				return this.details.order.DATE_DH?.split(' ')[1] || JSON.stringify(new Date()).split("T")[1];
			},
			viewDate: function() {
				return this.details.order.DATE_DH.split(' ')[0]
			},
			viewTime: function() {
				return this.details.order.DATE_DH.split(' ')[1]
			},
			getOrderTimeRange: function() {
				return this.details.order.DHSJD
			},
			getOrderRoom: function() {
				let current = this.details.order.KHSNAME;
				let index = this.decorationRoom.indexOf(i => i.addr === current);
				return index != -1 ? index : 0;
			},
			getCurrentTime: function() {
				return new Date().getHours().toString().padStart(2, 0) + ":" + new Date().getSeconds().toString()
					.padStart(2, 0)
			},
			getTakeWayText: function() {
				return function(type) {
					if (type)
						return type.slice(2);
					else
						return '-';
				}
			},
			getCheckStyle: function() {
				return function(bill) {
					return bill === this.details.order.YDBILL ? 'li curr' : 'li'
				}
			},
			getTakeWayStyle: function() {
				return function(type) {
					if (type)
						if (type[0] === '0')
							return 'jiedan';
						else
							return 'quxiao';
					else
						return 'quxiao';
				}
			},
			timeRangeView: function() {
				return this.timeRange.find(util.callBind(this, function(i) {
					return i.ID == this.details.order.DHSJD;
				}))?.NAME || '-'
			},
			mode: function() {
				return util.callBind(this, function(mode) {
					if (this.edit) { //编辑状态
						if (mode === 'read')
							return false;
						else
							return true;
					} else {
						if (mode === 'read')
							return true;
						else
							return false;
					}
				})
			}
		},
		methods: {
			//初始化线上订单列表
			InitOrders: function() {
				//查询在线订单列表
				this.GetOnlineOrders(util.callBind(this, function() {
					this.RenderFrom(this.onlineOrders[0]); //首次渲染
					uni.$emit("exists-online-order");
				}));

				// 查询到货时间段列表
				getTimeRange({
					gsid: this.GSID
				}, util.callBind(this, function(res) {
					if (!res.data) {
						util.simpleMsg("未获取到到货时间段！", "none")
						return;
					}
					this.timeRange = JSON.parse(res.data)
				}));
			},
			//获取在线订单
			GetOnlineOrders: function(func) {
				getOnlineOrders({
					gsid: this.GSID,
					khid: this.KHID,
					bhlb: this.BHLB
				}, util.callBind(this, function(res) {
					let orders = JSON.parse(res.data).map(i => {
						i.SALETIME = i.SALETIME.replace('T', " ");
						i.timestamp = i.SALETIME ? Number(new Date(i.SALETIME)) : 0
						i.$checked = false;
						i.$raw = Object.assign({}, i);
						return i
					});
					orders.sort((a, b) => a.timestamp - b.timestamp);
					this.onlineOrders = orders.reverse();
					this.onlineOrdersGroup = util.group(this.onlineOrders, 'YDBILL');
					console.log("[GetOnlineOrders]线上订单数据:", this.onlineOrders);
					console.log("[GetOnlineOrders]线上订单数据-根据与订单号分组:", this.onlineOrdersGroup);
					if (func) func();
				}), (res) => {
					util.simpleMsg("暂无数据!", true, res);
					this.onlineOrdersGroup = {};
				});
			},
			//时间限制说明
			DateTimeTips: function() {
				util.simpleModal("提示",
					"1、自提单到货日期只能为当前日期之后，且不能为晚上21点之后，早上7点之前\n2、配送单到货日期只能为当前日期当前日期一小时之后，到货时间 不能 为晚上18点之后，早上9点之前");
			},
			//检查到货时间是否合法
			CheckArrivalDate: function(date) { //到货时段：0-7、7-14、14-24
				if (date) {
					let current = (function() {
							let dt = new Date(date.replaceAll('-', '/')); //Ipad 时间转换只支持 2000/1/1，不支持 2000-1-1
							return new Date(dt.setHours(dt.getHours() + 8)); //Ipad 时区加 8 小时
						})(),
						now = new Date(new Date().setHours(new Date().getHours() + 8));
					if (this.details.order.THTYPE_CODE == '0') { //自提
						//自提单可修改：到货日期（只能修改为当前日期之后）、到货时段（对应到货日期）、备注
						let limit = now,
							date_max = new Date(current.getFullYear(), current.getMonth(), current.getUTCDate() + 1, (-
								16 + 21), 0, 0), //晚上 21:00
							date_min = new Date(current.getFullYear(), current.getMonth(), current.getUTCDate() + 1, (-
								16 + 7), 0, 0); //早上 7:00
						//时间必须设置为当前时间之后，且时间不能在 21点 以后和 7:00 以前
						if (current.getTime() >= limit.getTime() && date_max.getTime() > current.getTime() && date_min
							.getTime() <= current.getTime())
							return true;
						else
							return false;
					} else if (this.details.order.THTYPE_CODE == '1') { //配送
						//配送单可修改：到货日期（当前日期一小时之后）、到货时段（对应到货日期）、备注
						let limit = new Date(now.setHours(now.getHours() + 1)),
							date_max = new Date(current.getFullYear(), current.getMonth(), current.getUTCDate() + 1, (-
								16 + 18), 0, 0), //晚上 18:00
							date_min = new Date(current.getFullYear(), current.getMonth(), current.getUTCDate() + 1, (-
								16 + 9), 0, 0); //早上 9:00
						//时间必须设置为当前时间 1小时 之后，且时间不能在 18点 以后和 9:00 以前
						if (current.getTime() >= limit.getTime() && date_max.getTime() > current.getTime() && date_min
							.getTime() <= current.getTime())
							return true;
						else
							return false;
					}
				}
			},
			//设置时间区间
			SetTimeRange: function() {
				if (this.details.order.DATE_DH) {
					this.timeRange.forEach(util.callBind(this, function(time, index) {
						let date = new Date(this.details.order.DATE_DH.replaceAll('-', '/'));
						let time_arr = time.NAME.split("-");
						let start = new Date(this.details.order.DATE_DH.replaceAll('-', '/'));
						let end = new Date(this.details.order.DATE_DH.replaceAll('-', '/'));
						start.setHours(Number(time_arr[0]), 0, 0);
						end.setHours(Number(time_arr[1]), 0, 0);
						if (start <= date && date <= end) {
							this.details.order.DHSJD = time.ID;
						}
					}));
				}
			},
			//编辑状态（注：加入此状态是因为说 POS 上进行确认取消操作时候需要查询订单状态，然后根据状态进行部分功能的隐藏和展示，但由于默认取消按钮是展示的，可能会出现订单有效的情况-订单有效是不能取消的，所以这个地方得在状态被查出之前设置为加载状态避免出现非正常的操作）
			EditLoad: function(loading, bill) {
				if (this.view.check.loading) { //进入加载
					this.view.check.loading = loading;
					this.view.check.bill = bill;
				} else { //退出加载
					if (this.view.check.bill === bill) { //确认 bill 和进入的时候存的是一致的，避免点了第一条数据，再去点第二条，第二条状态可能还没查出来就被第一条的结果覆盖
						this.view.check.loading = loading;
						this.view.check.bill = bill;
					}
				}
			},
			//渲染到视图
			RenderFrom: function(source) {
				if (source?.BILL) {
					this.view.check.loading = true;
					this.view.check.bill = source?.YDBILL;
					this.OrderStatusCheck(source?.YDBILL)
					Object.assign(this.details.order, source);
					this.details.order.$date = this.details.order?.DATE_DH?.split(" ")[0] || "";
					this.details.order.$time = this.details.order?.DATE_DH?.split(" ")[1] || "";
					let good_infos = this.onlineOrdersGroup[this.details.order.YDBILL]; //获取对应商品集合中商品信息集合
					console.log("[RenderFrom]当前组数据:", good_infos);
					if (good_infos) this.details.goods = good_infos;
				}
			},
			OrderStatusCheck: function(bill) {
				this.EditLoad(true, bill);
				this.view.check.result = false;
				return ordersStatusCheck({
					bill: bill
				}, util.callBind(this, function(res) {
					this.EditLoad(false, bill);
					this.view.search.confirm = res.code;
					this.view.check.result = true; //放开所有按钮
					if (!res.code) util.simpleMsg(res.msg, res.code, res);
					console.log("[OrderStatusCheck]Res:", res);
				}), util.callBind(this, function(err) {
					console.log("[OrderStatusCheck]订单状态查询失败...");
					this.EditLoad(false, bill);
					this.view.check.result = false; //锁定所有按钮
					util.simpleMsg("订单状态查询失败,请重新点击左侧订单发起查询!")
				}));
			},
			//展示详情
			ShowDetail: function(order) {
				if (!this.view.edit) {
					this.RenderFrom(order);
					this.$forceUpdate();
				} else
					util.simpleMsg("请确认保存信息！")
			},
			//门店选择
			StoreChange: function(data) {
				console.log("[StoreChange]门店选择:", data);
				this.details.order.KHID_BH = data.KHID;
				this.details.order.KHSNAME = data.NAME;
			},
			//选择裱花间
			SelectRoom: function(val) {
				this.details.order.KHSNAME = this.decorationRoom[val.detail.value].addr;
			},
			//选择时间段
			SelectTimeRange: function(val) {
				this.details.order.DHSJD = this.timeRange[val.detail.value].ID;
			},
			//选择日期
			SelectDate: function(val) {
				console.log("[SelectDate]设置日期:", val);
				this.details.order.$date = val.detail.value;
			},
			//选择时间
			SelectTime: function(val) {
				console.log("[SelectTime]设置时间:", val);
				let pad = false;
				if (val.length <= 2) pad = true;
				this.details.order.$time = (val.detail.value || "00") + ":00";
			},
			//编辑
			Edit: function() {
				this.edit = true;
				this.details.order.$raw = Object.assign({}, this.details.order);
			},
			//保存（编辑->保存）
			Save: function() {
				this.edit = false;
				if (this.CheckArrivalDate(this.details.order.DATE_DH))
					updateOrderInfo({
						yd_bill: this.details.order.YDBILL,
						khid: this.details.order.KHID,
						remark: this.details.order.CUSTMCOMM,
						date: this.details.order.DATE_DH,
						timerange: this.details.order.DHSJD,
						khid_bh: this.details.order.KHID_BH,
					}, util.callBind(this, function(res) {
						this.GetOnlineOrders(); //刷新列表
						util.simpleMsg("订单修改成功!", false, res)
					}), (err) => {
						util.simpleMsg(err.msg, "none", err);
					});
				else {
					Object.assign(this.details.order, this.details.order.$raw)
					util.simpleMsg("时间设置有误!", true)
				}
			},
			//取消（编辑->取消）
			CancelSave: function() {
				this.edit = false;
				Object.assign(this.details.order, this.details.order.$raw);
			},
			//确认接受
			ConfirmAccept: async function(isAccept) {
				console.log("[ConfirmAccept]处理订单：", this.details.order)
				this.details.order.STATUS = isAccept;
				let info_valid = true,
					time_valid = true;
				if (isAccept) { //只有接单才判断
					info_valid = await Validity(this.details.order);
					time_valid = this.CheckArrivalDate(this.details.order.DATE_DH);
				}
				if (info_valid.state && time_valid || !isAccept) {
					let query_res = await RequestSend(
						`select * from ywbhqh where bill_status='0' and BILL_YD='${this.details.order.YDBILL}'`);
					// let query_res = await RequestSend(`select * from ywbhqh where bill_status='0' and BILL_YD='LH202210240004'`);
					console.log("[ConfirmAccept]订单查询信息:", query_res);
					if (this.view.search.confirm && JSON.parse(query_res.result?.data)?.length != 0) { //因为接单后状态会发生变更
						ordersAccept({
							storeid: this.KHID, //店铺id
							gcid: this.GCID, //工厂id
							end_time: this.EndTime,
							czyid: this.RYID,
							orders: [this.details.order]
						}, util.callBind(this, function(res) {
							this.GetOnlineOrders(util.callBind(this, function() {
								let type = Object.keys(this.onlineOrdersGroup)[0];
								if (this.onlineOrdersGroup[type]) {
									Object.assign(this.details.order, this.onlineOrdersGroup[
										type][0]);
								}
							})); //刷新页面
							util.simpleMsg("接受成功!")
							console.log("[ConfirmAccept]处理结果：", res)
							//调用打印
							this.$refs.printerPage.xsBluePrinter(this.details.order, "XSDD");

						}), (err) => {
							util.simpleMsg(err.msg, "none", err);
						});
					} else {
						util.simpleMsg('订单状态无效!', true);
					}
				} else {
					if (!info_valid.state)
						util.simpleMsg(info_valid.msg, true, info_valid)
					else if (!time_valid)
						util.simpleMsg("到货时间错误!", true, info_valid)
				}
			},
		},
		mounted() {
			this.InitOrders();
		}
	}
</script>

<style>
	:root {
		--green: #70c477;
	}

	.max-height {
		height: 100%;
	}

	.products {
		height: calc(88% - 30px) !important;
	}

	.picker {
		border: 1px solid #70c477;
		border-radius: 6rpx;
		margin-right: 5px;
		padding: 0px 3px;
	}

	.harvest uni-label {
		display: flex;
		align-items: center;
	}

	.products .procycle .li {
		/* box-sizing: border-box; */
		/* border-color: gray; */
	}

	.products .procycle .li.curr {
		border-color: #42B14B;
		box-shadow: 0px 0px 0px 1px #42B14B;
	}

	.products .details {
		height: unset;
	}

	.meminfo {
		position: unset;
	}

	.procycle {
		max-height: 100%;
		overflow-y: auto;
	}

	.ellipsis-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.text-nowrap {
		white-space: nowrap;
	}

	.tips {
		width: 18px;
		height: 18px;
		display: inline-flex;
		background-color: #70c477;
		color: white;
		font-weight: bold;
		border-radius: 50%;
		align-items: center;
		justify-content: center;
		margin-left: 10px;
	}

	.btn {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
	}

	.meminfo .goods {
		height: 46%;
	}

	.from-label {
		margin-bottom: 2rpx;
	}
</style>
<style>
	.search-shadow {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0px;
		top: 0px;
		z-index: 100;
		background: rgba(0, 0, 0, 0.1);
		padding: 15%;
		box-sizing: border-box;
	}

	.search-panel {
		background-color: white;
		border-radius: 5px;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.search-top {
		height: 8%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.search-title,
	.search-close {
		line-height: 16%;
		padding: 6px;
		box-sizing: border-box;
	}

	.search-title {
		font-size: 1em;
	}

	.search-close {
		color: black;
		font-size: 1.2em;
		font-weight: 600;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.search-content {
		flex: 1 0px;
	}

	.search-toolbar {
		width: 100%;
		height: 26px;
		display: flex;
		align-items: center;
		padding: 0px 10px;
	}

	.search-btn-group {
		display: flex;
		gap: 8px;
	}

	.search-btn-group>* {
		height: 26px;
		line-height: 26px;
		font-size: 16px;
	}

	.search-label {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.search-input {
		border: 1px solid #70c477;
		position: relative;

	}

	.check-tips {
		height: 90rpx;
		width: 100%;
		background-color: #f8f8f8;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1% 2%;
	}
</style>
