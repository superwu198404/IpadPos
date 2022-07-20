<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeout.css);
</style>

<template>
	<view class="commodity">
		<view class="hh">
			<view class="hotcakes">
				<image src="@/images/ydtq.png" mode="widthFix"></image> 本店热销
				<view>类型：<text>立即送</text><text>预订单</text></view>
			</view>
		</view>
		<!-- 小类循环 -->
		<view class="products">
			<view class="procycle">
				<!-- 外卖单循环 -->
				<view class="li-box">
					<view class="li" v-for="(item,index) in onlineOrders" :order="item" @click="ShowDetail(item)">
						<view class="h3">
							<view class="platform">
								<label>
									<image src="@/images/wmd-meituan.png" mode="widthFix"></image>
									{{item.SNAME}}
								</label>
								<label class="state quxiao"><text>●</text>取消订单</label>
								<!-- <label class="state jiedan" v-if="jiedan"><text>●</text>请接单</label> -->
							</view>
							<view>￥{{item.PRICE}}</view>
						</view>
						<view class="cods">
							<label><text>预定单号：</text>
								<div class="trade-roll" style="">
									<div style="">{{item.BILL || '-'}}</div>
								</div>
							</label>
							<label><text>到货时间：</text><text>{{item.DATE_DH || '-'}}</text></label>
							<label><text>顾客电话：</text><text>{{item.CUSTMPHONE || '-'}}</text></label>
							<label><text>预定时间：</text><text>{{item.SALETIME || '-'}}</text></label>
							<label><text>顾客要求：</text><text>{{item.CUSTMCOMM || '-'}}</text></label>
							<label><text>补充要求：</text><text>{{item.NOTE || '-'}}</text></label>
						</view>
						<view class="address">
							顾客地址：{{item.CUSTMADDRESS || '-'}}
						</view>
					</view>
				</view>
			</view>
			<view class="details">
				<view class="meminfo">
					<view class="member">
						<label>
							<image class="touxiang" src="@/images/touxiang.png"></image>
							<label class="meminfo"><text>会员名称</text><text>13012341234</text></label>
						</label>
					</view>
					<view class="harvest">
						<label class="from-label">
							<text>到货日期：</text>
							<text v-if="mode('read')">{{details.order.DATE_DH || '-'}}</text>
							<picker v-if="mode('edit')" class="date-picker picker" mode="date" :value="getOrderDate"
								:start="new Date()" :end="new Date()" @change="SelectDate">
								<view class="uni-input">{{ details.order.DATE_DH.split(' ')[0] }}</view>
							</picker>
							<picker v-if="mode('edit')" class="time-picker picker" mode="time" :value="getOrderTime"
								@change="SelectTime">
								<view class="uni-input">{{ details.order.DATE_DH.split(' ')[1] }}</view>
							</picker>
						</label>
						<label class="from-label">
							<text>到货时段：</text>
							<text v-if="mode('read')">{{ timeRangeView }}</text>
							<picker v-if="mode('edit')" class="picker" mode="selector" :range="timeRange"
								range-key="NAME" :value="details.order.DHSJD" @change="SelectTimeRange">
								<view class="uni-input">{{ timeRangeView }}</view>
							</picker>
						</label>
						<label class="from-label">
							<text>送货方式：</text>
							<text>{{details.order.THTYPE ? details.order.THTYPE.split('-')[1] : '-'}}</text>
						</label>
						<label class="from-label">
							<text>顾客姓名：</text>
							<text v-if="mode('read')">{{details.order.CUSTMNAME || '-'}}</text>
							<input v-if="mode('edit')" class="input" type="text" v-model="details.order.CUSTMNAME" />
						</label>
						<label class="from-label">
							<text>顾客要求：</text>
							<text v-if="mode('read')">{{details.order.CUSTMCOMM || '-'}}</text>
							<input v-if="mode('edit')" class="input" type="text" v-model="details.order.CUSTMCOMM" />
						</label>
						<label class="from-label">
							<text>裱花间：</text>
							<text v-if="mode('read')">{{details.order.KHSNAME || '-'}}</text>
							<picker v-if="mode('edit')" class="picker" mode="selector" :range="decorationRoom"
								range-key="addr" :value="getOrderRoom" @change="SelectRoom">
								<view class="uni-input">{{ details.order.KHSNAME }}</view>
							</picker>
						</label>
						<label class="from-label">
							<text>顾客电话：</text>
							<text v-if="mode('read')">{{details.order.CUSTMPHONE || '-'}}</text>
							<input v-if="mode('edit')" class="input" type="text" v-model="details.order.CUSTMPHONE" />
						</label>
						<label class="from-label">
							<text>顾客地址：</text>
							<text v-if="mode('read')">{{details.order.CUSTMADDRESS || '-'}}</text>
							<input v-if="mode('edit')" class="input" type="text" v-model="details.order.CUSTMADDRESS" />
						</label>
					</view>
					<view class="h5"><text>预定单号：{{details.order.BILL || '-'}}</text></view>
				</view>
				<view class="operat">
					<button v-if="mode('read') && false" class="btn btn-edit" @click="Edit()">编辑</button>
					<button v-if="mode('edit')" class="btn" @click="Save()">保存</button>
					<button v-if="mode('edit')" class="btn btn-qx" @click="CancelSave()">取消</button>
					<button v-if="mode('read')" class="btn" @click="ConfirmAccept()">接受确认</button>
					<button v-if="mode('read')" class="btn btn-qx" @click="Cancel()">取消</button>
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
		getOnlineOrders,
		getTimeRange,
		getRoom,
		ordersAccept
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
				edit: false
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
			timeRangeView: function() {
				return this.timeRange.find(util.callBind(this, function(i) {
					return i.ID === this.details.order.DHSJD;
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
				//查询到货时间段列表
				// getTimeRange({
				// 	gsid: this.GSID
				// }, util.callBind(this, function(res) {
				// 	if (!res.data) {
				// 		util.simpleMsg("未获取到到货时间段！",true)
				// 		return;
				// 	}
				// 	console.log("到货时间段:",JSON.parse(res.data))
				// 	this.timeRange = JSON.parse(res.data)
				// }));
				//获取裱花间列表
				// getRoom({
				// 	gsid: [this.GSID],
				// 	storeid: this.DPID,
				// }, util.callBind(this, function(res) {
				// 	if (!res.data || Object.keys(JSON.parse(res.data)).length === 0) {
				// 		util.simpleMsg("未获取到裱花间！",true)
				// 		return;
				// 	}
				// 	this.timeRange = JSON.parse(res.data)
				// }));
			},
			//获取在线订单
			GetOnlineOrders: function() {
				getOnlineOrders({
					gsid: this.GSID,
					khid: this.KHID,
					bhlb: this.BHLB
				}, util.callBind(this, function(res) {
					this.onlineOrders = JSON.parse(res.data).map(i => {
						i.SALETIME = i.SALETIME.replace('T', " ");
						return i
					});
					this.RenderFrom(this.onlineOrders[0]);
				}));
			},
			//渲染到视图
			RenderFrom: function(source) {
				Object.assign(this.details.order, source);
				this.details.order.$date = this.details.order?.DATE_DH?.split(" ")[0] || "";
				this.details.order.$time = this.details.order?.DATE_DH?.split(" ")[1] || "";
			},
			ShowDetail: function(order) {
				this.RenderFrom(order);
			},
			//选择裱花间
			SelectRoom: function(val) {
				this.details.order.KHSNAME = this.decorationRoom[val.detail.value].addr;
			},
			//选择时间段
			SelectTimeRange: function(val) {
				this.details.order.DHSJD = val.detail.value;
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
			},
			//保存（编辑->保存）
			Save: function() {
				this.edit = false;
			},
			//取消（编辑->取消）
			CancelSave: function() {
				this.edit = false;
			},
			//确认接受
			ConfirmAccept: function() {
				this.details.order.STATUS = true;
				this.details.order.GCID = this.GCID; //测试写死数据（因为存在 id 位数大于 四位的情况 导致报错）

				let now = new Date();
				let testDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay())
				this.details.order.DATE_DH = (JSON.stringify(testDate).split("T")[0] + " 00:00:00Z").slice(1, -
					1); //测试写死数据

				if (Validity(this.details.order).state)
					ordersAccept({
						storeid: this.DPID, //店铺id
						gcid: this.GCID, //工厂id
						orders: [this.details.order]
					}, util.callBind(this, function(res) {
						this.GetOnlineOrders(); //刷新页面
						util.simpleMsg("接受成功!")
						console.log("处理结果：", res)
					}), (err) => {
						util.simpleMsg(err.msg, true);
					});
			},
			//取消
			Cancel: function() {
				this.details.order.STATUS = false;
				this.details.order.STATUS = true;
				this.details.order.GCID = this.GCID; //测试写死数据（因为存在 id 位数大于 四位的情况 导致报错）

				let now = new Date();
				let testDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay())
				this.details.order.DATE_DH = (JSON.stringify(testDate).split("T")[0] + " 00:00:00Z").slice(1, -
					1); //测试写死数据

				if (Validity(this.details.order).state)
					ordersAccept({
						storeid: this.DPID, //店铺id
						gcid: this.GCID, //工厂id
						orders: [this.details.order]
					}, util.callBind(this, function(res) {
						this.GetOnlineOrders(); //刷新页面
						util.simpleMsg("接受成功!")
						console.log("处理结果：", res)
					}), (err) => {
						util.simpleMsg(err.msg, true);
					});
			}
		},
		mounted() {
			this.InitOrders();
		}
	}
</script>

<style>
	.max-height {
		height: 100%;
	}

	.products .procycle .li {
		box-sizing: border-box;
	}

	.products .details {
		height: unset;
	}

	.meminfo {
		position: unset;
	}

	.li-box{
		border: 1px solid red;
	}
	
	.procycle {
		border: 1px solid blue;
		max-height: 6%;
		overflow-y: auto;
		/* flex: 0; */
	}
</style>
