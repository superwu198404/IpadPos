<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeout.css);
	@import url(@/static/style/OnlineOrders/index.css);
</style>
<template>
	<view class="commodity" style="position: relative;">
		<view class="hh">
			<view class="hotcakes">
				<image src="@/images/ydtq.png" mode="widthFix"></image> 本店热销
				<view>类型：<text>立即送</text><text>在线订单</text></view>
			</view>
			<view>
				<view class="prints">
					<view class="sousuo">
						<image src="../../images/ydtq-dyj.png" mode="widthFix"></image>打印
					</view>
					<view class="sousuo">
						<label>
							<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
						</label>
					</view>
				</view>
			</view>
		</view>
		<!-- 小类循环 -->
		<view class="products">
			<view class="procycle">
				<!-- 外卖单循环 -->
				<view v-for="(item,index) in onlineOrders" :class="getCheckStyle(item.BILL)" :order="item"
					@tap="ShowDetail(item)">
					<view class="h3">
						<view class="platform">
							<label>
								<image src="@/images/wmd-meituan.png" mode="widthFix"></image>
								{{item.SNAME}}
							</label>
							<label
								:class="'state quxiao ' + getTakeWayStyle(item.THTYPE)"><text>●</text>{{ getTakeWayText(item.THTYPE) }}</label>
							<!-- <label class="state jiedan" v-if="jiedan"><text>●</text>请接单</label> -->
						</view>
						<view>￥{{item.PRICE}}</view>
					</view>
					<view class="cods">
						<label><text>预定单号：</text><text>{{item.YDBILL || '-'}}</text></label>
						<label><text class="text-nowrap">预定时间：</text><text
								class="ellipsis-text">{{item.SALETIME || '-'}}</text></label>
						<label><text class="text-nowrap">顾客姓名：</text><text
								class="ellipsis-text">{{item.CUSTMNAME || '-'}}</text></label>
						<label><text class="text-nowrap">顾客电话：</text><text
								class="ellipsis-text">{{item.CUSTMPHONE || '-'}}</text></label>
					</view>
					<view class="address">
						顾客地址：{{item.CUSTMADDRESS || '-'}}
					</view>
				</view>
			</view>
			<view class="details">
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
							<text>{{details.order.KHSNAME || '-'}}</text>
						</label>
						<label class="from-label">
							<text>商品编码：</text>
							<text>{{details.order.SPID || '-'}}</text>
						</label>
						<label class="from-label">
							<text>商品名称：</text>
							<text>{{details.order.SNAME || '-'}}</text>
						</label>
						<label class="from-label">
							<text>到货日期：</text>
							<text v-if="mode('read')">{{details.order.DATE_DH || '-'}}</text>
							<picker v-if="mode('edit')" class="date-picker picker" mode="date" :value="getOrderDate"
								:start="new Date()" @change="SelectDate">
								<view class="uni-input">{{ details.order.DATE_DH.split(' ')[0] }}</view>
							</picker>
							<picker v-if="mode('edit')" class="time-picker picker" mode="time" :value="getOrderTime"
								:start="getCurrentTime" @change="SelectTime">
								<view class="uni-input">{{ details.order.DATE_DH.split(' ')[1] }}</view>
							</picker>
							<text v-if="mode('edit')" class="tips" @click="DateTimeTips()">!</text>
						</label>
						<label class="from-label">
							<text>到货时段：</text>
							<text>{{ timeRangeView }}</text>
						</label>
						<label class="from-label">
							<text>数量：</text>
							<text>{{details.order.ZQTY_SQ || '-'}}</text>
						</label>
						<label class="from-label">
							<text>单位：</text>
							<text>{{details.order.UNIT || '-'}}</text>
						</label>
						<label class="from-label">
							<text>客户要求：</text>
							<text v-if="mode('read')">{{details.order.CUSTMCOMM || '-'}}</text>
							<input v-if="mode('edit')" class="input" type="text" v-model="details.order.CUSTMCOMM" />
						</label>
					</view>
				</view>
				<view class="operat">
					<button v-if="mode('read')" class="btn btn-edit" @click="Edit()">编辑</button>
					<button v-if="mode('edit')" class="btn" @click="Save()">保存</button>
					<button v-if="mode('edit')" class="btn btn-qx" @click="CancelSave()">取消</button>
					<button v-if="mode('read')" class="btn" @click="ConfirmAccept(true)">接受确认</button>
					<button v-if="mode('read')" class="btn btn-qx" @click="ConfirmAccept(false)">取消</button>
				</view>
			</view>
		</view>
		<view class="search-shadow" v-if="view.search.open">
			<view class="search-panel">
				<view class="search-top">
					<text class="search-title">{{ view.search.title }}</text>
					<text class="search-close" @click="view.search.open = false">×</text>
				</view>
				<view class="search-content">
					<view class="search-toolbar">
						<view class="search-label">订单号:<input class="search-input" type="text"
								v-model="view.search.form.bill" /></view>
						<view class="search-label">自提码:<input class="search-input" type="text"
								v-model="view.search.form.code" /></view>
						<view class="search-btn-group">
							<button class="btn btn-qx">清空</button><button class="btn">查询</button>
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
	import {
		getOnlineOrders, //获取线上订单
		getTimeRange, //获取时间段
		getRoom, //获取裱花间（暂时不用修改）
		updateOrderInfo, //更新表接口
		ordersAccept //顶顶那处理
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
		data() {
			return {
				onlineOrders: [],
				BHLB: `(${util.getStorage("POSCS")?.find(i => i.POSCS === 'BHLBBM')?.POSCSNR || "109"})`,
				view: {
					search: {
						open: false,
						title: "提取商品",
						form: {
							code: "",
							bill: ""
						}
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
				edit: false //开启编辑状态
			}
		},
		watch: {
			'details.order.$date': function(n, o) {
				this.details.order.DATE_DH = `${this.details.order.$date} ${this.details.order.$time}`.trim() || this
					.details.order.DATE_DH;
				console.log("$date", this.details.order.DATE_DH)
			},
			'details.order.$time': function(n, o) {
				this.details.order.DATE_DH = `${this.details.order.$date} ${this.details.order.$time}`.trim() || this
					.details.order.DATE_DH;
				console.log("$time", this.details.order.DATE_DH)
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
					return bill === this.details.order.BILL ? 'li curr' : 'li'
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
				this.GetOnlineOrders();
				// 查询到货时间段列表
				getTimeRange({
					gsid: this.GSID
				}, util.callBind(this, function(res) {
					if (!res.data) {
						util.simpleMsg("未获取到到货时间段！", true)
						return;
					}
					console.log("到货时间段:", JSON.parse(res.data))
					this.timeRange = JSON.parse(res.data)
				}));
			},
			//获取在线订单
			GetOnlineOrders: function() {
				getOnlineOrders({
					gsid: this.GSID,
					khid: this.KHID,
					bhlb: this.BHLB
				}, util.callBind(this, function(res) {
					let orders = JSON.parse(res.data).map(i => {
						i.SALETIME = i.SALETIME.replace('T', " ");
						i.timestamp = i.SALETIME ? Number(new Date(i.SALETIME)) : 0
						i.$checked = false;
						i.$raw = Object.assign({},i);
						return i
					});
					orders.sort((a, b) => a.timestamp - b.timestamp);
					this.onlineOrders = orders.reverse();
					console.log("线上订单:", this.onlineOrders);
					this.RenderFrom(this.onlineOrders[0]);
				}), (res) => {
					util.simpleMsg("线上订单获取失败!", true, res);
				});
			},
			DateTimeTips: function() {
				util.simpleModal("提示",
					"1、自提单到货日期只能为当前日期之后，且不能为晚上21点之后，早上7点之前\n2、配送单到货日期只能为当前日期当前日期一小时之后，到货时间 不能 为晚上18点之后，早上9点之前");
			},
			CheckArrivalDate: function(date) { //检查到货时间是否合法，到货时段：0-7、7-14、14-24
				if (date) {
					let current = (function() {
							let dt = new Date(date.replaceAll('-', '/'));//Ipad 时间转换只支持 2000/1/1，不支持 2000-1-1
							return new Date(dt.setHours(dt.getHours() + 8));//Ipad 时区加 8 小时
						})(),
						now = new Date(new Date().setHours(new Date().getHours() + 8));
					console.log("当前时间", JSON.stringify(now))
					if (this.details.order.THTYPE_CODE == '0') { //自提
						//自提单可修改：到货日期（只能修改为当前日期之后）、到货时段（对应到货日期）、备注
						let limit = now,
						date_max = new Date(current.getFullYear(),current.getMonth(),current.getDate()-1,8+21),//晚上 21:00
						date_min = new Date(current.getFullYear(),current.getMonth(),current.getDate()-1,8+7);//早上 7:00
						//时间必须设置为当前时间之后，且时间不能在 21点 以后和 7:00 以前
						if (current.getTime() >= limit.getTime() && date_max.getTime() > current.getTime() && date_min.getTime() <= current.getTime())
							return true;
						else
							return false;
					} else if (this.details.order.THTYPE_CODE == '1') { //配送
						//配送单可修改：到货日期（当前日期一小时之后）、到货时段（对应到货日期）、备注
						let limit = new Date(now.setHours(now.getHours() + 1)),
						date_max = new Date(current.getFullYear(),current.getMonth(),current.getDate()-1,8+18),//晚上 18:00
						date_min = new Date(current.getFullYear(),current.getMonth(),current.getDate()-1,8+9);//早上 9:00
						//时间必须设置为当前时间 1小时 之后，且时间不能在 18点 以后和 9:00 以前
						if (current.getTime() >= limit.getTime() && date_max.getTime() > current.getTime() && date_min.getTime() <= current.getTime())
							return true;
						else
							return false;
					}
				}
			},
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
							this.details.order.DHSJD = time.ID
							console.log("匹配时间：", time)
						}
					}));
				}
			},
			//渲染到视图
			RenderFrom: function(source) {
				this.details.order.BILL = source.BILL;
				Object.assign(this.details.order, source);
				this.details.order.$date = this.details.order?.DATE_DH?.split(" ")[0] || "";
				this.details.order.$time = this.details.order?.DATE_DH?.split(" ")[1] || "";
			},
			//展示详情
			ShowDetail: function(order) {
				console.log("当前状态：",this.edit)
				if (!this.view.edit) {
					this.RenderFrom(order);
					this.$forceUpdate();
				} else
					util.simpleMsg("请确认保存信息！")
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
				this.details.order.$date = val.detail.value;
			},
			//选择时间
			SelectTime: function(val) {
				this.details.order.$time = val.detail.value;
			},
			//编辑
			Edit: function() {
				this.edit = true;
				this.details.order.$raw = Object.assign({},this.details.order);
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
						timerange: this.details.order.DHSJD
					}, util.callBind(this, function(res) {
						this.GetOnlineOrders(); //刷新列表
						console.log("修改结果：", res);
						util.simpleMsg("订单修改成功!")
					}), (err) => {
						util.simpleMsg(err.msg, true, err);
					});
				else
					util.simpleMsg("时间设置有误!", true)
			},
			//取消（编辑->取消）
			CancelSave: function() {
				this.edit = false;
				Object.assign(this.details.order,this.details.order.$raw);
			},
			//确认接受
			ConfirmAccept: async function(isAccept) {
				console.log("处理订单：", this.details.order)
				this.details.order.STATUS = isAccept;

				//this.details.order.GCID = this.GCID; //测试写死数据（因为存在 id 位数大于 四位的情况 导致报错）
				// let now = new Date();
				// let testDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay())
				// this.details.order.DATE_DH = (JSON.stringify(testDate).split("T")[0] + " 00:00:00").slice(1); //测试写死数据

				let valid = await Validity(this.details.order);
				if (valid.state)
					ordersAccept({
						storeid: this.KHID, //店铺id
						gcid: this.GCID, //工厂id
						orders: [this.details.order]
					}, util.callBind(this, function(res) {
						this.GetOnlineOrders(); //刷新页面
						util.simpleMsg("接受成功!")
						console.log("处理结果：", res)
					}), (err) => {
						util.simpleMsg(err.msg, true, err);
					});
				else
					util.simpleMsg(valid.msg, true, valid)
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

	.products .procycle .li {
		box-sizing: border-box;
		border-color: gray;
	}

	.products .procycle .li.curr {
		border-color: #70c477;
		box-shadow: 0px 0px 0px 2px #70c477;
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
	
	.btn{
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
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
</style>
