<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<view class="boxs">
		<view class="meminfo"
			style="display: inline-flex;flex-direction: column;max-heighy:100%;overflow:auto;z-index: 999;">
			<view class="member">
				<label>填写预定信息</label>
				<button @click="Close()">×</button>
			</view>
			<view class="middle" style="flex: 1 0px;">
				<view class="restlist">
					<label>
						<text><i class="sgin">*</i>提货门店：</text>
						<input type="text" v-model="Order.THNAME" @input="inputTHKH" :disabled="!YN_YDTH" />
						<view class="thmd">
							<text v-for="(item,index) in THKHDATAS" @click="ChooseTH(item)">{{item.ADDR}}</text>
						</view>
					</label>
					<label><text><i class="sgin">*</i>配送方式：</text>
						<picker @change="THChange" :range="THTYPES" range-key="NAME" value="index"
							:disabled="YN_THTYPE">
							<view>{{THTYPES.length>0?THTYPES[index].NAME:""}}</view>
							<text class="xial">▼</text>
						</picker>
					</label>
					<label><text><i class="sgin">*</i>提货日期：</text>
						<!-- <input type="date" v-model="Order.THDATE" /> -->
						<picker mode="date" fields="day" @change="dateChange" :start="LimitDate" :end="LimitMaxDate">
							<view>{{ extract_date }}</view>
							<text class="xial">▼</text>
						</picker>
					</label>
					<label><text><i class="sgin">*</i>提货时间：</text>
						<!-- <input type="date" v-model="Order.THDATE" /> -->
						<picker mode="time" fields="time" position="bottom" get-container="#picker"
							:value="extract_time" @change="timeChange">
							<view>{{Order.TH_TIME}}</view>
							<text class="xial">▼</text>
						</picker>
						<!-- <hTimePicker sTime="15" cTime="15" interval="1" @changeTime="timeChange">
						<view slot="pCon" class="changeTime">
							点击选择时间
						</view>
					</hTimePicker> -->
					</label>
					<label><text><i class="sgin">*</i>定金：</text><text v-if="over48">{{ Order.DNET }}</text><input v-else
							type="number" v-model="Order.DNET" @input="CheckMoney" :disabled="over48" />
					</label>
					<label><text><i class="sgin">*</i>蛋糕规格：</text>
						<picker @change="GGChange" :range="GGDatas">
							<view>{{Order.CARDID}}</view>
							<text class="xial">▼</text>
						</picker>
					</label>
					<label class="hui"><text>收货人：</text><input type="text" v-model="Order.CUSTMNAME" /></label>
					<label><text><i class="sgin">*</i>联系电话：</text><input type="number" v-model="Order.CUSTMPHONE"
							@blur="GetAddr()" /></label>
					<label class="hui"><text>配送地址：</text><input type="text" v-model="Order.CUSTMADDRESS"
							disabled="true" /></label>
					<!-- <label><text>配送中心：</text><input type="text" v-model="Order.STR2" /></label> -->
					<label><text><i class="sgin">*</i>配送中心：</text>
						<picker @change="PSChange" :range="PSDatas" range-key="SNAME"
							:disabled="Order.THTYPE=='0' || Order.THTYPE=='2'">
							<!-- <view>{{(Order.STR2 && Order._STR2) ? (Order.STR2 + '-' + Order._STR2) : ""}}</view> -->
							<view>{{(Order.STR2 && Order._STR2) ? (Order._STR2) : ""}}</view>
							<text class="xial">▼</text>
						</picker>
					</label>

					<label class="hui"><text>备注：</text><textarea v-model="Order.CUSTMCOMM"></textarea></label>
				</view>
				<view class='rests' v-if="yn_add" style="margin-bottom: 0; padding-bottom: 0;">
					<view class="h6"><text>新增地址</text></view>
					<view class="restlist">
						<label><text>收货人：</text><input type="text" v-model="ADDR.NAME" /></label>
						<label><text>联系电话：</text><input type="number" v-model="ADDR.PHONE" /></label>
						<!-- :disabled="ADDR.ACT=='Update'" -->
						<label class="long"><text>收货地址：</text><input type="text" v-model="ADDR.ADDRESS"
								@blur="searchMapAddr()" /></label>
						<view v-if="AddrArr.length>0 && AddShowAllAddressList">
							<label v-for="(item1,index1) in AddrArr" @click="chooseAddr(item1)"
								style="width: 100%;padding-left: 80px;">{{item1.address}};</label>
						</view>
						<view class="note">
							<!-- <label><text>备注：</text><textarea v-model="ADDR.NOTE"></textarea></label> -->
							<view class="caozuo"><button class="btn-xg" @click="ConfirmADDR()">确认</button><button
									class="btn-sc" @click="yn_add = false">取消</button></view>
						</view>
					</view>
				</view>
				<view class='rests'>
					<view class="h6"><text>地址</text> <button @click="ShowAddADDR()">+ 新增地址</button></view>
					<view class="location" v-if="ShowAllAddressList && Order.THTYPE!='0'">
						<view class="site" v-for="(item,index) in ADDRS" @click="ConfirmOrderAddr(item)">
							<view class="sitelist">
								<!-- <radio></radio> -->
								<view>
									<text>{{item.CNAME}}，{{item.PHONE}}</text>
									<label>{{item.ADDRESS}}</label>
								</view>
							</view>
							<view class="caozuo">
								<button class="btn-xg" @click.stop="Up_Addr(item)">修改</button>
								<button class="btn-sc" @click.stop="Del_Addr(item)">删除</button>
							</view>
						</view>
					</view>
					<view class="more" @click="ShowAllAddressList = !ShowAllAddressList">
						{{ ShowAllAddressList?'隐藏全部地址':'显示全部地址' }}
						<image src="../../images/zhankaiqb-dt.png" :class="ShowAllAddressList?'flip-vertical':''">
						</image>
					</view>
				</view>
				<view class="atlas">
					<!-- <cover-view class="map">
					<map :latitude="map.latitude" :longitude="map.longitude" :scale="map.scale" :markers="map.markers"></map>
				</cover-view> -->
					<view class="map" v-if="!ShowAllAddressList && !yn_add || ADDRS.length == 0">
						<map :key="map.key" :latitude="map.latitude" :longitude="map.longitude" :scale="map.scale"
							:markers="map.markers"></map>
					</view>
				</view>
			</view>
			<view class="operat" style="display: flex;padding: 8px;gap: 8px;">
				<button class="btn btn-qx" @click="Close()">取 消</button>
				<button class="btn" @click="Confirm">确 定</button>
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
	import _reserve from '@/api/business/extract.js';

	var that;
	export default {
		props: {
			confirm: {
				type: Function,
				default: null
			},
			sale: {
				type: Object,
				default: null
			},
			decoration: {
				type: Boolean,
				default: false
			},
			over48: {
				type: Boolean,
				default: false
			},
			_saleType: {
				type: String,
				default: ""
			}
		},
		computed: {
			extract_time: function() {
				console.log("[ExtractTime]提货时间:", this.Order.TH_TIME);
				if (this.Order.TH_TIME.length >= 5) {
					return this.Order.TH_TIME.substr(0, 5);
				} else if (this.Order.TH_TIME.length == 2) {
					return this.Order.TH_TIME + ":00";
				} else {
					return "00:00"
				}
			},
			extract_date: function() {
				return this.Order.TH_DATE.replaceAll('-', '/');
			}
		},
		data() {
			return {
				GSID: app.globalData.store.GSID,
				KHID: app.globalData.store.KHID,
				POSID: app.globalData.store.POSID,
				STIME: app.globalData.store.STIME,
				ETIME: app.globalData.store.ETIME,
				statements: false,
				index: 0,
				THTYPES: [],
				LimitDate: '2000-01-01',
				LimitMaxDate: '2100-01-01',
				LimitTime: '00:00',
				ShowAllAddressList: false,
				AddShowAllAddressList: false,
				CatchAddress: null,
				Products: [{
					PLID: "109",
					SPID: "10101022",
					UNIT: "袋",
					BARCODE: '2222222222',
					NAME: "黄金唱片",
					PRICE: 10,
					OPRICE: 10,
					AMOUNT: 10,
					QTY: 1
				}],
				Order: {
					DISC: 0,
					ZNET: 0,
					TNET: 0,
					DNET: 0,
					CUSTMNAME: "",
					CUSTMPHONE: "",
					THDATE: "",
					TH_DATE: "",
					TH_TIME: "",
					THTYPE: "1", //自提 和宅配
					NOTE: "",
					CUSTMADDRESS: "",
					ADDRID: "",
					THKHID: app.globalData.store.KHID,
					THNAME: app.globalData.store.NAME,
					CUSTMCOMM: "",
					STR2: "", //配送中心ID
					_STR2: "", //配送中心名称
					CARDID: "普通蛋糕", //蛋糕类型  
					YD_STATUS: "1"
				},
				map: {
					longitude: util.getStorage('StoreCoodinate').longitude ?? 114.3093413671875, //经度
					latitude: util.getStorage('StoreCoodinate').latitude ?? 30.570206594347283, //纬度
					scale: 12, //缩放级别
					markers: [],
					key: Number(new Date())
				},
				hyinfo: util.getStorage("hyinfo"),
				yn_add: false,
				ADDRS: [],
				ADDR: {
					NAME: "",
					PHONE: "",
					ADDRESS: "",
					NOTE: "",
					ACT: "Add", //新增
					LONGITUDE: "",
					LATITUDE: ""
				},
				AddrArr: [],
				YDDATA: "",
				YN_BHSP: false, //用于标注是否有裱花类商品，有则可选配送方式为“宅配到家”
				_THTYPES: [], //中转集合
				GGDatas: ["普通蛋糕", "称架蛋糕", "叠层蛋糕"],
				PSDatas: [], //配送中心数据
				YN_YDTH: false, //是否支持异店提货
				THKHDATA: [], //提货门店数据
				THKHDATAS: [], //提货门店数据 筛选后的数据
				YN_THTYPE: false, //是否允许更改提货方式，异店不允许
				YDJGSJ: 10, //提货间隔时间/分钟（存储的单位为小时）
				startTime: "7",
				endTime: "19"
			}
		},
		created() {
			console.log("[ReserveDrawer]预定录入!");
			this.DataInit();
		},
		watch: {
			'Order.THTYPE': function(n, o) {
				console.log("[WATCH-THTYPE]提货方式发生改变!", {
					n,
					o
				});
				if (n == '0') {
					that.Order.CUSTMADDRESS = ""; //清空地址信息
					that.Order.STR2 = "";
					that.Order._STR2 = "";
					console.log("[WATCH-THTYPE]清空自提的地址信息...");
				}
			},
			'Order.CUSTMADDRESS': function(n, o) {
				if (n && this.Order.THTYPE == '1')
					this.MatchBHKH();
				else {
					this.Order.LONGITUDE = "";
					this.Order.LATITUDE = "";
				}
			}
		},
		methods: {
			DataInit: async function() {
				console.log("[DataInit]时间限制配置:", {
					start_time: this.STIME,
					end_time: this.ETIME,
					store_info: app.globalData.store
				})
				that = this;
				await that.getTHTYPE();
				that.Order.BILL = common.CreateBill(that.KHID, that.POSID);
				// that.Order.CARDID = that.GGDatas[0];
				console.log("[DataInit]是否支持异店提货:", common.GetPOSCS_Local("YN_YDTH"));
				that.YN_YDTH = common.GetPOSCS_Local("YN_YDTH") == 'Y' ? true : false; //查看是否支持异店提货
				if (that.YN_YDTH) { //如果支持异店提货，则查询下当前区域门店数据
					_reserve.GetTHKHDA(that.GSID, that.KHID, res => {
						console.log("[ReserveDrawer]提货门店数据：", res);
						that.THKHDATA = res.msg;
					});
				}
				// let arr = util.getStorage("POSCS");
				// let obj1 = arr.find((r) => r.POSCS == 'YDZXJG');
				// if (obj1 && obj1.POSCSNR) {
				// 	that.YDJGSJ = obj1.POSCSNR * 60; //小时化分
				// }
				console.log("[ReserveDrawer]获取系统参数配置...");
				let obj = util.getStorage("sysParam");
				if (obj && obj.YDZXJG) {
					that.YDJGSJ = obj.YDZXJG * 60; //小时化分
					console.log("[ReserveDrawer]最短销售间隔:", that.YDJGSJ);
				}
				this.showReserve();
				this.Order.ZNET = this.sale?.ZNET || 0; //从外部接收整单金额
				console.log("[DataInit]数据初始化!", this.sale);
				this.Order.ZNET = this.sale.ZNET;
				this.Order.DNET = this.sale.ZNET;
				this.Order.TNET = this.sale.ZNET;
				console.log("[DataInit]预订单初始化完毕!", this.Order);
				this.IsForeignStore();//判断是否是外地门店提货
			},
			onLoad: function() {
				this.DataInit();
			},
			//提货门店输入事件
			inputTHKH: e => {
				console.log("[InputTHKH]门店数据:", that.THKHDATAS);
				let str = e.detail.value;
				let decoration = that.decoration; //判断是否包含裱花商品
				console.log("输入信息：", str);
				if (that.THKHDATA.length > 0) {
					that.THKHDATAS = that.THKHDATA.filter((item, index) => {
						return item.ADDR?.indexOf(str) >= 0;
					})
				}
			},
			//手选提货门店
			ChooseTH: e => {
				console.log("手选门店值：", e.ADDR);
				that.Order.THKHID = e.KHID;
				that.Order.THNAME = e.SNAME;
				if (that.Order.THKHID != that.KHID) {
					that.Order.THTYPE = 0;
					that.index = 0;
					that.YN_THTYPE = true; //默认自提且不允许更改
				} else {
					that.YN_THTYPE = false;
				}
				that.THKHDATAS = []; //选择后清空一下数据源
				that.RefreshData(); //刷新一下数据
			},
			IsForeignStore: function() {
				console.log("[IsForeignStore]判断门店是否是外地提货...",this.KHID);
				_reserve.IsForeignStore({
					KHID: this.KHID
				},util.callBind(this,function(res){
					let data = JSON.parse(res.data);
					console.log("[IsForeignStore]查询结果:",{raw:res,data});
					if(!(data && data.length)){
						this.Order.THTYPE = 0;
						this.index = 0;
						this.YN_THTYPE = true; //默认自提且不允许更改
					}
				}))
			},
			Show: function() {
				let pages = getCurrentPages(); //当前页面栈
				if (pages.length > 0) {
					let prevPage = pages[pages.length - 2]; //上一页面
					prevPage.onLoad();
				}
			},
			//刷新日期和限制关系
			RefreshData: function() {
				//给下默认时间
				let date = dateformat.getYMD(), //现卖的默认当前日期
					time = dateformat.gettime(1); //默认加一分钟

				if (this.over48) {
					let current_datetime = new Date().SetHours(48);
					date = dateformat.toDateString(current_datetime).replaceAll('/', '-');
					// time = current_datetime.toTimeString().split(" ")[0];
					console.log("[RefreshData]时间:", {
						date,
						time
					});
					this.LimitDate = date;
					// this.LimitTime = time;
				} else {
					if (that.Order.THKHID == that.KHID) { //提货门店是当前门店
						if (that.Order.THTYPE == 0 || that.Order.THTYPE == 1) { //自提或者宅配 日期加一
							date = dateformat.getYMD(1);
							this.LimitDate = dateformat.toDateString(new Date()); //限制时间为t+1后
							this.LimitMaxDate = "2100-01-01";
							console.log("[RefreshData]限制时间（自提、宅配）:", {
								min: this.LimitDate,
								max: this.LimitMaxDate,
								min_long: dateformat.toDateTimeString(new Date())
							});
						} else {
							this.LimitDate = dateformat.toDateString(new Date());
							this.LimitMaxDate = dateformat.toDateString(new Date());
							console.log("[RefreshData]限制时间（现卖）:", {
								min: this.LimitDate,
								max: this.LimitMaxDate,
								min_long: dateformat.toDateTimeString(new Date())
							});
						}
					}
				}
				console.log("[RefreshData]提货时间:", {
					th_date: this.Order.THDATE,
					date,
					time
				});
				that.Order.THDATE = date + ' ' + time;
				that.Order.TH_DATE = (() => {
					if (that.Order.THTYPE == '2') { //现卖
						console.log("[RefreshData]提货日期处理-现卖:", date);
						return date;
					} else { //非现卖
						console.log("[RefreshData]提货日期处理-非现卖:", {
							date_before: date,
							current_date: new Date().toLocaleDateString().replaceAll('-', '/')
						});
						if (date.replaceAll('-', '/') == dateformat.toDateString(new Date()).replaceAll('-',
								'/')) {
							console.log("[RefreshData]增加1天时间...");
							return new Date(date.replaceAll('-', '/')).SetHours(24).toLocaleDateString();
						} else {
							console.log("[RefreshData]不变...");
							return date
						};
					}
				})();
				that.Order.TH_TIME = (() => {
					console.log("[RefreshData]时间间隔处理:", {
						datetime: that.Order.THDATE,
						interval: that.YDJGSJ
					});
					let add_interval_date = new Date(that.Order.THDATE.replaceAll('-', '/')).SetMinutes(that
						.YDJGSJ);
					let add_time = add_interval_date.toLocaleTimeString('zh-CN', {
						hour: '2-digit',
						minute: '2-digit'
					});
					console.log("[RefreshData]时间间隔处理后:", {
						datetime: dateformat.toDateString(add_interval_date),
						time: add_time
					});
					return add_time.replace(/[^u4e00-u9fa5]/g, '');
				})();
				that.Order.THDATE = that.Order.TH_DATE + ' ' + that.Order.TH_TIME;
				if (that.Order.THKHID != that.KHID || that.Order.THTYPE == '1') { //异店提货，且宅配到家
					that.Order.DNET = that.Order.TNET;
				}
				// else {
				// 	that.Order.DNET = 0;
				// }
				if (that.Order.THTYPE == '0') { //自提
					that.startTime = that.STIME;
					that.endTime = that.ETIME;
				} else if (that.Order.THTYPE == '2') { //现卖
					that.startTime = dateformat.getDateByParam('h') + ":" + dateformat.getDateByParam('m');
					that.endTime = "19:00";
				}
				console.log("[RefreshData]开始时间：", that.startTime);
				console.log("[RefreshData]结束时间：", that.endTime);
			},
			//弹出预定信息录入框
			showReserve: function() {
				that.Empty();
				that.statements = true;
				// let arr = util.getStorage("POSCS");
				// let obj = arr.find((r) => r.POSCS == 'BHLBBM');
				let obj = util.getStorage("sysParam");
				let bmArr = [];
				if (obj && obj.BHLBBM) {
					bmArr = obj.BHLBBM.split(',');
				}
				if (that.Products.length > 0) {
					that.Products.map((r) => {
						if (bmArr?.indexOf(r.PLID) >= 0) {
							that.YN_BHSP = true;
						}
					});
				}
				//有水吧产品则展示所有类型
				if (that.YN_BHSP) {
					that.THTYPES = that._THTYPES;
				} else {
					that.THTYPES = that._THTYPES.filter((r, i) => {
						return r.ID != 1; //排除宅配到家
					});
				}
				if (that.THTYPES.length > 0) {
					that.Order.THTYPE = that.THTYPES[0].ID;
				}
			},
			Close: function() {
				that.statements = false;
				that.yn_add = false;
				uni.$emit("reserve-drawer-close");
			},
			//获取配送类型
			getTHTYPE: async function() {
				let decoration = this.decoration; //获取sale2是否存在裱花类别的信息
				let over48 = this.over48; //获取sale2是否存在裱花类别的信息
				await common.GetDapzcs("THTYPE", res => {
					console.log("[ReserveDrawer]提货类型数据：", res);
					if (res.code && res.msg.length > 0) {
						that._THTYPES = res.msg.map((item, index) => {
							return {
								ID: item.ID_NR,
								NAME: item.SNAME
							};
						}).filter(i => over48 ? (i.NAME === '宅配到家') : (decoration || (i.NAME !== '宅配到家')))
						console.log("[ReserveDrawer]提货类型数据THTYPES：", that._THTYPES);
					}
				})
			},
			dateChange: e => {
				that.Order.TH_DATE = e.detail.value;
				that.Order.THDATE = that.Order.TH_DATE + ' ' + that.Order.TH_TIME;
			},
			timeChange: e => {
				console.log("[TimeChange]时间切换：", e.detail);
				let time = e.detail.value;
				if (!time) {
					time = "00:00";
				}
				if (time?.indexOf(':') == 0) {
					time = "00" + time;
				}
				if (time?.indexOf(':') < 0) {
					time = time + ":00";
				}
				console.log("[TimeChange]时间格式化后：", time);
				that.Order.TH_TIME = time.replace(/[^u4e00-u9fa5]/g, '');
				that.Order.THDATE = that.Order.TH_DATE + ' ' + that.Order.TH_TIME;
			},
			//提货类型改变
			THChange: e => {
				that.index = e.detail.value;
				that.Order.THTYPE = that.THTYPES[that.index].ID;
				if (that.Order.THTYPE == '0' || that.Order.THTYPE == '2') {
					if (that.Order.THTYPE == '0') {
						that.Order.CUSTMADDRESS = ""; //清空地址信息
						console.log("[THChange]清空自提的地址信息...");
					}
					that.Order.STR2 = "";
					that.Order._STR2 = "";
				}
				if (that.Order.THTYPE == '1') { //宅配到家
					if (that.Order.LONGITUDE && that.Order.LATITUDE)
						that.MatchBHKH();
					else
						that.Order.CUSTMADDRESS = "";
				}
				if (!that.Order.CUSTMADDRESS && that.Order.CUSTMPHONE) { //有手机号且无地址的时候
					that.GetAddr();
				}
				that.RefreshData();
			},
			//显示地址框
			ShowAddADDR: () => {
				console.log("显示新增地址框")
				// that.ADDR = {};
				that.ADDR.NAME = "";
				that.ADDR.ADDRESS = "";
				that.ADDR.PHONE = that.Order.CUSTMPHONE; //默认赋值手机号
				that.ADDR.ACT = "Add"; //操作类型
				that.yn_add = true;
				console.log("数据:", that.ADDR);
			},
			GetAddr: function() {
				if (that.Order.THTYPE == '0') {
					console.log("自提类不需要弹出地址栏:");
					return;
				}
				_reserve.GetAddr({
					phone: that.Order.CUSTMPHONE
				}, res => {
					console.log("用户地址查询结果:", res);
					if (res.code && res.data.length > 0) {
						that.ADDRS = JSON.parse(res.data).filter((r) => {
							return r.ADDRID != null;
						});
						that.yn_add = false;
						this.ShowAllAddressList = true;
					} else {
						that.ADDRS = [];
						that.ShowAddADDR(); //默认展开地址新增表单
					}
				})
			},
			//点击修改事件
			Up_Addr: function(e) {
				that.yn_add = true;
				that.ADDR.ACT = "Update";
				that.ADDR.ADDRID = e.ADDRID;
				that.ADDR.PHONE = e.PHONE;
				that.ADDR.NAME = e.CNAME;
				that.ADDR.ADDRESS = e.ADDRESS;
				//坐标如何处理

			},
			//删除地址
			Del_Addr: function(e) {
				util.simpleModal("删除","确认删除该地址吗?",util.callBind(this,async function(confirm){
					console.log("[DelAddr]删除地址确认:", confirm);
					if(confirm){
						let use_current_address_order = [];
						await common.WebDBQuery(`select * from ydsale001 where note2='${e.ADDRID}' and yd_status='1'`, function(data){
							if(data.code){
								use_current_address_order = JSON.parse(data.data);
							}
							console.log("[DelAddr]查询当前地址信息:", use_current_address_order);
						})
						if(!use_current_address_order.length){
							_reserve.Del_Addr({
								phone: e.PHONE,
								addrid: e.ADDRID
							}, res => {
								console.log("[DelAddr]删除地址结果:",res);
								util.simpleMsg((res.code ? "删除成功" : res.msg), !res.code);
								util.sleep(2000);
								that.yn_add = false;
								that.GetAddr();
							})
						}
						else{
							util.simpleMsg("当前地址部分订单正在使用中,禁止删除!",true)
						}
					}
				}))
			},
			//地址编辑确认
			ConfirmADDR: function() {
				if (!that.ADDR.PHONE) {
					util.simpleMsg("电话为空", true);
					return;
				}
				if (!that.ADDR.NAME) {
					util.simpleMsg("收货人名称为空", true);
					return;
				}
				if (!that.ADDR.ADDRESS) {
					util.simpleMsg("地址信息为空", true);
					return;
				}
				if (!that.ADDR.LONGITUDE && !that.ADDR.LATITUDE) {
					console.log("[ConfirmADDR]缓存地址:", this.CatchAddress);
					that.ADDR.ADDRESS = that.ADDR.ADDRESS ?? this.CatchAddress.address;
					that.ADDR.LONGITUDE = this.CatchAddress.adrjd;
					that.ADDR.LATITUDE = this.CatchAddress.adrwd;
				}
				console.log("新增的地址信息：", that.ADDR);
				_reserve.ConfirmADDR(that.ADDR, res => {
					let exists_address_refresh = false,data = null;
					if(res.data){
						let data = JSON.parse(res.data);
						if(data.AddressID){
							that.Order.NOTE2 = Number(data.AddressID);
						}
					}
					console.log("编辑结果：", res);
					util.simpleMsg("操作" + (res.code ? "成功" : "失败"), !res.code)
					that.yn_add = !res.code;
					if (that.Order.CUSTMPHONE != that.ADDR.PHONE || that.Order.CUSTMADDRESS != that.ADDR.ADDRESS) exists_address_refresh = true;
					that.Order.CUSTMPHONE = that.ADDR.PHONE;
					that.Order.CUSTMNAME = that.ADDR.NAME; //默认赋值
					that.Order.CUSTMADDRESS = that.ADDR.ADDRESS; //默认赋值
					that.Order.LONGITUDE = that.ADDR.LONGITUDE;
					that.Order.LATITUDE = that.ADDR.LATITUDE;
					if (exists_address_refresh) {
						that.GetAddr(); //刷新一下地址列表
					}
				})
			},
			searchMapAddr: async function() {
				// if (that.ADDR.ADDRESS.length < 3 || that.ADDR.ADDRESS.length % 3 != 0) {
				// 	//最少要输入一点吧
				// 	return;
				// }
				that.ADDR.ADDRESS = util.stripscript(that.ADDR.ADDRESS); //去除一下特殊字符串
				let obj = await _reserve.GetAmap(that.KHID);
				_reserve.searchMapAddr({
					keywords: that.ADDR.ADDRESS,
					Areaid: obj.areaid,
					key: obj.key
				}, res => {
					console.log("[SearchMapAddr]高德地址查询:", res);
					if (res.code) {
						that.AddrArr = JSON.parse(res.data);
						that.AddShowAllAddressList = true;
						if (that.AddrArr && that.AddrArr.length && that.AddrArr.length > 0) {
							this.CatchAddress = that.AddrArr[0];
							console.log("[SearchMapAddr]储存缓存地址:", this.CatchAddress);
						}
					}
				})
			},
			//选中地址
			chooseAddr: function(e) {
				if (e) {
					that.ADDR.ADDRESS = e.address;
					that.ADDR.LONGITUDE = e.adrjd;
					that.ADDR.LATITUDE = e.adrwd;
					that.AddShowAllAddressList = false;
				}
			},
			//选中配送地址
			ConfirmOrderAddr: function(e) {
				console.log("[ConfirmOrderAddr]触发没", e);
				that.AddrArr = []; //清空一下
				that.Order.CUSTMNAME = e.CNAME; //默认赋值
				that.Order.CUSTMADDRESS = e.ADDRESS;
				that.Order.NOTE2 = e.ADDRID;
				that.Order.LONGITUDE = e.LONGITUDE;
				that.Order.LATITUDE = e.LATITUDE;
				that.ShowAllAddressList = false;
				that.map.markers.pop();
				console.log("[ConfirmOrderAddr]markers标点信息:", that.map.markers);
				that.map.markers = [{
					id: 'client',
					latitude: e.LONGITUDE,
					longitude: e.LATITUDE,
					title: '配送地址',
					callout: {
						content: '收货地址',
						color: 'red',
						display: 'ALWAYS'
					}
				}];
				this.map.key = Number(new Date());
				console.log("[ConfirmOrderAddr]markers新标点信息:", that.map.markers);
				//宅配到家需要匹配最近的配送中心
				if (that.Order.CUSTMADDRESS && that.Order.THTYPE == '1') {
					//匹配下裱花间
					that.MatchBHKH();
				}
				//预先获取配送中心数据，供手动修改
				that.GetPSCenter();
			},
			//自动匹配配送中心
			MatchBHKH: function() {
				let GSKHINFO = _reserve.getGSKHINFO(that.GSID, that.KHID);
				// GSKHINFO = "in ('K210') ";
				console.log("[MatchBHKH]获取到的GSKHINFO", GSKHINFO);
				_reserve.MatchBHKH({
					LONGITUDE: that.Order.LONGITUDE,
					LATITUDE: that.Order.LATITUDE,
					GSKHINFO: GSKHINFO,
					KHID: this.KHID
				}, res => {
					console.log("[MatchBHKH]匹配结果:", res);
					if (res.code) {
						let data = JSON.parse(res.data);
						if (data.over) {
							util.simpleMsg(data.msg, "none");
							that.Order.STR2 = "";
							that.Order._STR2 = "";
							that.index = 0;
							that.Order.THTYPE = 0;
							that.Order.LONGITUDE = 0;
							that.Order.LATITUDE = 0;
							that.Order.CUSTMADDRESS = ""; //清空地址信息
							console.log("[MatchBHKH]清空结果:", that.Order);
						} else {
							util.simpleMsg("已匹配最近的配送中心", "none");
							that.Order.STR2 = data.khid;
							that.Order._STR2 = data.name;
							that.$forceUpdate(); //刷新input的值 狗bug
						}
					}
				})
			},
			//校验定金
			CheckMoney: e => {
				let str = e.detail.value;
				// 正则表达试
				str = (str.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
				console.log("金额校验：", str);
				that.$nextTick(function() { //防止不及时更新的问题
					//重新赋值
					that.Order.DNET = str;
				});
			},
			//蛋糕规格切换事件
			GGChange: function(e) {
				that.Order.CARDID = that.GGDatas[e.detail.value];
			},
			//获取配送中心数据
			GetPSCenter: function(e) {
				_reserve.GetPSCenter(that.GSID, that.KHID, r => {
					if (r.msg.length > 0) {
						that.PSDatas = r.msg;
					}
				})
			},
			//配送数据切换
			PSChange: e => {
				that.Order.STR2 = that.PSDatas[e.detail.value].KHID;
				that.Order._STR2 = that.PSDatas[e.detail.value].SNAME;
			},
			//用户信息确定
			Confirm: () => {
				console.log("预定信息：", that.Order);
				let th_date = new Date(that.Order.THDATE.replace(/-/g, "/"));
				let hour = th_date.getHours();
				let minute = th_date.getMinutes();
				let hour_minute = hour.toString().padStart(2, 0) + minute.toString().padStart(2, 0);
				let mix_time_interval = new Date().SetMinutes(Number(that.YDJGSJ)); //获取提货最短时间间隔
				console.log("[Confirm]时间参数:", {
					current: hour_minute,
					stime: that.STIME,
					etime: that.ETIME,
					mix_interval: mix_time_interval.toLocaleString(),
					extract_date: th_date.toLocaleString()
				});
				console.log("[Confirm]门店信息:", {
					current_store: that.KHID,
					use_store: that.Order.THKHID,
				});
				if (!that.Order.THKHID) {
					util.simpleMsg("提货门店为空", true);
					return;
				}
				if (th_date < mix_time_interval) {
					util.simpleMsg(`提货时间小于最小提货时间间隔(最小间隔:${that.YDJGSJ} 分钟)`, true);
					return;
				}
				if (that.Order.THKHID != that.KHID) { //判断提货门店id是否是当前门店，如果不是则是异店提货，异店提货时候定金必须是全额
					if (Number(that.Order.ZNET) != Number(that.Order.DNET)) { //判断定金是否等于整单金额
						that.Order.DNET = that.Order.ZNET;
						util.simpleMsg("异店提货必须全额支付", true);
						return;
					}
				}
				if (that.over48) {
					if (new Date().SetHours(48) > new Date(that.Order.THDATE.replace(/-/g, "/"))) {
						util.simpleMsg("当前促销限制提货时间必须是在48小时以后!", true);
						that.RefreshData();
						return;
					}
				}
				//如果提货时间是当天，判断时间是否大于当前时间且小于 19:00
				if (new Date(that.Order.THDATE.replace(/-/g, "/")).toLocaleDateString() == new Date()
					.toLocaleDateString()) {
					let th_datetime = new Date(that.Order.THDATE.replace(/-/g, "/"));
					let max_th_datetime = new Date(th_datetime.toLocaleDateString()).SetHours(19);
					let current_datetime = new Date();
					console.log("[Confirm]提货时间控制:", {
						th_datetime: th_datetime.toLocaleString(),
						max_th_datetime: max_th_datetime.toLocaleString(),
						current_datetime: current_datetime.toLocaleString()
					});
					if (!(th_datetime > current_datetime)) {
						util.simpleMsg("当天提货时间必须大于当前时间!", true);
						return;
					}
					if (th_datetime > max_th_datetime) {
						util.simpleMsg("当天提货时间必须小于 19:00!", true);
						return;
					}
				} else { //否则判断时间是否在 8:00 ~ 19:00 之间
					let th_datetime = new Date(that.Order.THDATE.replace(/-/g, "/"));
					let max_th_datetime = new Date(th_datetime.toLocaleDateString()).SetHours(19);
					let min_th_datetime = new Date(th_datetime.toLocaleDateString()).SetHours(8);
					console.log("[Confirm]提货时间控制:", {
						th_raw: that.Order.THDATE,
						th_raw_datetime: th_datetime.toLocaleString(),
						max_th_datetime: max_th_datetime.toLocaleString(),
						min_th_datetime: min_th_datetime.toLocaleString()
					});
					if (th_datetime < min_th_datetime) {
						util.simpleMsg("提货时间必须在 8:00 之后!", true);
						return;
					}
					if (th_datetime > max_th_datetime) {
						util.simpleMsg("提货时间必须在 19:00 之前!", true);
						return;
					}
				}
				if (that.Order.THTYPE == undefined || that.Order.THTYPE == null) {
					util.simpleMsg("配送方式为空", true);
					return;
				}
				if (that.Order.THTYPE != '1' && new Date(that.Order.THDATE.replace(/-/g, "/")) < new Date()) {
					util.simpleMsg("提货时间早于当前", 'none');
					return;
				}
				if (that.Order.THTYPE == '0' && !(Number(that.STIME.substr(0, 5).replace(':', '')) <= Number(
						hour_minute)) && !(Number(that.ETIME.substr(0, 5).replace(':', '')) >= Number(
						hour_minute))) { //自提
					console.log("[Confirm]时间限制:", {
						start_time: that.STIME,
						end_time: that.ETIME
					});
					util.simpleMsg("提货时间不在营业时间内", 'none');
					return;
				}
				if (that.Order.THTYPE == '1') { //宅配到家
					let hour = new Date(that.Order.THDATE.replace(/-/g, "/")).getHours(); //提货时间的小时部分
					if (hour < 7 || hour > 19) {
						util.simpleMsg("提货时间不在7到19点", 'none');
						return;
					}
					if (new Date(that.Order.THDATE.replace(/-/g, "/")) < new Date().setHours(new Date().getHours() +
							1)) {
						util.simpleMsg("提货时间小于一小时内", 'none');
						return;
					}
				}
				if (that.Order.THTYPE == '2') { //现卖限制时间不能早于当前和19点以后
					that.Order.STR2 = that.KHID; //现卖配送的，提交 当前门店编码
					if (new Date(that.Order.THDATE.replace(/-/g, "/")) < new Date()) {
						util.simpleMsg("提货时间小于当前时间", 'none');
						return;
					}
					if (new Date(that.Order.THDATE.replace(/-/g, "/")) > new Date().setHours(19)) {
						util.simpleMsg("提货时间晚于19点", 'none');
						return;
					}
				}
				if (that.Order.DNET == null || that.Order.DNET == undefined) {
					util.simpleMsg("定金为空", true);
					return;
				}
				if (that.Order.DNET < 0) {
					util.simpleMsg("定金小于0", true);
					return;
				}
				if (that.Order.ZNET < that.Order.DNET) {
					util.simpleMsg("定金大于应收金额", 'none');
					return;
				}
				if (!that.Order.CUSTMPHONE) {
					util.simpleMsg("联系电话为空", true);
					return;
				}
				if (that.Order.THTYPE == '1' || that.Order.THTYPE == '2') {
					if (!that.Order.CUSTMADDRESS) {
						util.simpleMsg("配送地址为空", true);
						return;
					}
					
					if (!that.Order.NOTE2) {
						util.simpleMsg("配送地址编码为空，请重新选择地址", true);
						return;
					}
				}
				that.Order.CUSTMADDRESS = util.stripscript(that.Order.CUSTMADDRESS); //去除一下特殊字符串
				// that.Order.CUSTMADDRESS = that.Order.ADDRID; //赋值为地址对应的id
				that.YDDATA = JSON.stringify(that.Order);
				that.Order.DNET = Number(that.Order.DNET);
				console.log("[Confirm]已设置定金金额:", that.Order);
				that.Order.YD_STATUS = "1";
				that.Order.BMID = that.BMID;
				if (that.confirm) {
					console.log("[Confirm]外部传入事件触发!");
					that.confirm(that.Order);
				}
				that.statements = false;
				that.yn_add = false;
				// that.Empty();
				console.log("待提交的顾客信息:", that.YDDATA);
			},
			//清空
			Empty: function() {
				that.Order = {
					BILL: "",
					QTY: 0,
					DISC: 2,
					ZNET: 0,
					TNET: 0,
					DNET: 0,
					CUSTMNAME: "",
					CUSTMPHONE: "",
					THDATE: "",
					TH_DATE: "",
					TH_TIME: "",
					THTYPE: "",
					NOTE: "",
					CUSTMADDRESS: "",
					THKHID: that.KHID,
					THNAME: that.NAME,
					CUSTMCOMM: "",
					STR2: "", //配送中心ID
					_STR2: "", //配送中心名称
					CARDID: "普通蛋糕" //蛋糕类型

				};
				that.ADDRS = [];
				that.ADDR = {
					NAME: "",
					PHONE: "",
					ADDRESS: "",
					NOTE: "",
					ACT: "Add", //新增
					LONGITUDE: "",
					LATITUDE: ""
				};
				that.AddrArr = [];
				that.RefreshData();
			},
		},
	}
</script>

<style>
	.flip-vertical {
		transform: rotate(180deg);
	}

	.thmd {
		position: absolute;
		left: 150rpx;
		top: 100%;
		background-color: #fff;
		border-radius: 6rpx;
		width: 160%;
		text-align: left;
		z-index: 999999999;
		box-shadow: 0px 10rpx 20rpx 1px rgba(66, 177, 75, 0.06);
		padding: 1%;
		max-height: 800rpx;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}

	.restlist .thmd text {
		width: 100% !important;
		display: block;
		text-align: left;
		line-height: 50rpx;
		white-space: nowrap;
		font-weight: 400 !important;
	}

	.operat {
		z-index: 9999999999999;
	}

	.operat button {
		margin: 0 1%;
	}
</style>
