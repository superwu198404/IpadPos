<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<view class="meminfo" style="display: inline-flex;flex-direction: column;">
		<view class="member">
			<label>填写预定信息</label>
			<button @click="Close()">×</button>
		</view>
		<view class="middle" style="flex: 1 0px;">
			<view class="restlist">
				<label><text>*提货门店：</text><input type="text" v-model="Order.THNAME" @input="inputTHKH"
						:disabled="!YN_YDTH" />
					<view class="thmd">
					<text v-for="(item,index) in THKHDATAS" @click="ChooseTH(item)">{{item.ADDR}}</text>
					</view>
				</label>
				<label><text>*配送方式：</text>
					<picker @change="THChange" :range="THTYPES" range-key="NAME" value="index" :disabled="YN_THTYPE">
						<view>{{THTYPES.length>0?THTYPES[index].NAME:""}}</view>
					</picker>
				</label>
				<label><text>*提货时间：</text>
					<!-- <input type="date" v-model="Order.THDATE" /> -->
					<picker mode="time" position="bottom" get-container="#picker" @change="timeChange">
						<view>{{Order.TH_TIME}}</view>
					</picker>
					<!-- <hTimePicker sTime="15" cTime="15" interval="1" @changeTime="timeChange">
						<view slot="pCon" class="changeTime">
							点击选择时间
						</view>
					</hTimePicker> -->
				</label>
				<label><text>*定金：</text><input type="number" v-model="Order.DNET" @input="CheckMoney" />
				</label>
				<label><text>收货人：</text><input type="text" v-model="Order.CUSTMNAME" /></label>
				<label><text>*联系电话：</text><input type="number" v-model="Order.CUSTMPHONE" @blur="GetAddr()" /></label>
				<label><text>*提货日期：</text>
					<!-- <input type="date" v-model="Order.THDATE" /> -->
					<picker mode="date" fields="day" @change="dateChange">
						<view>{{Order.TH_DATE}}</view>
					</picker>
				</label>
				<!-- <label><text>配送中心：</text><input type="text" v-model="Order.STR2" /></label> -->
				<label><text>*配送中心：</text>
					<picker @change="PSChange" :range="PSDatas" range-key="SNAME">
						<view>{{Order.STR2}}-{{Order._STR2}}</view>
					</picker>
				</label>
				<label><text>配送地址：</text><input type="text" v-model="Order.CUSTMADDRESS" /></label>
				<label><text>*蛋糕规格：</text>
					<picker @change="GGChange" :range="GGDatas">
						<view>{{Order.CARDID}}</view>
					</picker>
				</label>
				<label><text>备注：</text><textarea v-model="Order.CUSTMCOMM"></textarea></label>
			</view>
			<view class='rests' v-if="yn_add" style="margin-bottom: 0; padding-bottom: 0;">
				<view class="h6"><text>新增地址</text></view>
				<view class="restlist">
					<label><text>收货人：</text><input type="text" v-model="ADDR.NAME" /></label>
					<label><text>联系电话：</text><input type="number" v-model="ADDR.PHONE" /></label>
					<!-- :disabled="ADDR.ACT=='Update'" -->
					<label class="long"><text>收货地址：</text><input type="text" v-model="ADDR.ADDRESS"
							@blur="searchMapAddr()" /></label>
					<view v-if="AddrArr.length>0">
						<label v-for="(item1,index1) in AddrArr" @click="chooseAddr(item1)"
							style="width: 100%;padding-left: 80px;">{{item1.address}};</label>
					</view>
					<view class="note">
						<!-- <label><text>备注：</text><textarea v-model="ADDR.NOTE"></textarea></label> -->
						<view class="caozuo"><button class="btn-xg" @click="ConfirmADDR()">确认</button>
							<!-- <button class="btn-sc">删除</button> -->
						</view>
					</view>
				</view>
			</view>
			<view class='rests'>
				<view class="h6"><text>地址</text> <button @click="ShowAddADDR()">+ 新增地址</button></view>
				<view class="location">
					<view class="site" v-for="(item,index) in ADDRS" @click="ConfirmOrderAddr(item)">
						<view class="sitelist">
							<!-- <radio></radio> -->
							<view>
								<text>{{item.CNAME}}，{{item.PHONE}}</text>
								<label>{{item.ADDRESS}}</label>
							</view>
						</view>
						<view class="caozuo">
							<button class="btn-xg" @click="Up_Addr(item)">修改</button>
							<button class="btn-sc" @click="Del_Addr(item)">删除</button>
						</view>
					</view>
				</view>
				<view class="more">显示全部地址<image src="../../images/zhankaiqb-dt.png"></image>
				</view>
			</view>
			<view class="atlas">
				<div class="map"></div>
			</view>
		</view>
		<view class="operat" style="display: flex;padding: 8px;gap: 8px;">
			<button class="btn btn-qx" @click="Close()">取 消</button>
			<button class="btn" @click="Confirm">确 定</button>
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
					CARDID: "", //蛋糕类型  
					YD_STATUS: "1"
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
		methods: {
			DataInit: async function() {
				that = this;
				await that.getTHTYPE();
				that.Order.BILL = common.CreateBill(that.KHID, that.POSID);
				that.Order.CARDID = that.GGDatas[0];
				console.log("[DataInit]是否支持异店提货:",common.GetPOSCS_Local("YN_YDTH"));
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
				let obj = util.getStorage("sysParam");
				if (obj && obj.YDZXJG) {
					that.YDJGSJ = obj.YDZXJG * 60; //小时化分
				}
				this.showReserve();
				this.Order.ZNET = this.sale?.ZNET || 0; //从外部接收整单金额
				console.log("[DataInit]数据初始化!", this.sale);
				this.Order.ZNET = this.sale.ZNET;
				this.Order.DNET = this.sale.ZNET;
				this.Order.TNET = this.sale.ZNET;
				console.log("[DataInit]预订单初始化完毕!", this.Order);
			},
			onLoad: function() {
				this.DataInit();
			},
			//提货门店输入事件
			inputTHKH: e => {
				let str = e.detail.value;
				console.log("输入信息：", str);
				if (that.THKHDATA.length > 0) {
					that.THKHDATAS = that.THKHDATA.filter((item, index) => {
						return item.ADDR.indexOf(str) >= 0;
					})
					console.log("筛选后的门店数据：", that.THKHDATAS);
				}
			},
			//手选提货门店
			ChooseTH: e => {
				console.log("手选门店值：", e.ADDR);
				that.Order.THKHID = e.KHID;
				that.Order.THNAME = e.SNAME;
				if (that.Order.THKHID != that.KHID) {
					that.THTYPE = 0;
					that.YN_THTYPE = true; //默认自提且不允许更改
				} else {
					that.YN_THTYPE = false;
				}
				that.THKHDATAS = []; //选择后清空一下数据源
				that.RefreshData(); //刷新一下数据
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

				if (that.Order.THKHID == that.KHID) { //提货门店是当前门店
					if (that.Order.THTYPE == 0 || that.Order.THTYPE == 1) { //自提或者宅配 日期加一
						date = dateformat.getYMD(1);
					}
				}
				that.Order.THDATE = date + ' ' + time;
				that.Order.TH_DATE = date;
				that.Order.TH_TIME = time;

				if (that.Order.THKHID != that.KHID || that.Order.THTYPE == '1') { //异店提货，且宅配到家
					that.Order.DNET = that.Order.TNET;
				} else {
					that.Order.DNET = 0;
				}
				if (that.Order.THTYPE == '0') { //自提
					that.startTime = that.STIME;
					that.endTime = that.ETIME;
				} else if (that.Order.THTYPE == '2') { //现卖
					that.startTime = dateformat.getDateByParam('h') + ":" + dateformat.getDateByParam('m');
					that.endTime = "19:00";
				}
				console.log("开始时间：", that.startTime);
				console.log("开始时间1：", that.endTime);
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
						if (bmArr.indexOf(r.PLID) >= 0) {
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
				await common.GetDapzcs("THTYPE", res => {
					console.log("[ReserveDrawer]提货类型数据：", res);
					if (res.code && res.msg.length > 0) {
						that._THTYPES = res.msg.map((item, index) => {
							return {
								ID: item.ID_NR,
								NAME: item.SNAME
							};
						})
						console.log("[ReserveDrawer]提货类型数据THTYPES：", that._THTYPES);
					}
				})
			},
			dateChange: e => {
				that.Order.TH_DATE = e.detail.value;
				that.Order.THDATE = that.Order.TH_DATE + ' ' + that.Order.TH_TIME;
			},
			timeChange: e => {
				that.Order.TH_TIME = e.detail.value;
				that.Order.THDATE = that.Order.TH_DATE + ' ' + that.Order.TH_TIME;
			},
			//提货类型改变
			THChange: e => {
				that.index = e.detail.value;
				that.Order.THTYPE = that.THTYPES[that.index].ID;
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
				_reserve.Del_Addr({
					phone: e.PHONE,
					addrid: e.ADDRID
				}, res => {
					if (res.code) {
						util.simpleMsg("删除成功", false);
					}
					that.yn_add = false;
					that.GetAddr();
				})
			},
			//地址编辑确认
			ConfirmADDR: function() {
				if (!that.ADDR.PHONE) {
					util.simpleMsg("电话为空", true);
					return;
				}
				if (!that.ADDR.NAME) {
					util.simpleMsg("联系人为空", true);
					return;
				}
				if (!that.ADDR.ADDRESS) {
					util.simpleMsg("地址信息为空", true);
					return;
				}
				console.log("新增的地址信息：", that.ADDR);
				_reserve.ConfirmADDR(that.ADDR, res => {
					console.log("编辑结果：", res);
					util.simpleMsg("操作" + (res.code ? "成功" : "失败"), !res.code)
					that.yn_add = !res.code;
					that.Order.CUSTMNAME = that.ADDR.NAME; //默认赋值
					that.Order.CUSTMADDRESS = that.ADDR.ADDRESS; //默认赋值
					// if (res.code) {
					// 	that.GetAddr(); //刷新一下地址列表
					// }
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
					console.log("高德地址查询:", res);
					if (res.code) {
						that.AddrArr = JSON.parse(res.data);
					}
				})
			},

			//选中地址
			chooseAddr: function(e) {
				if (e) {
					that.ADDR.ADDRESS = e.address;
					that.ADDR.LONGITUDE = e.adrjd;
					that.ADDR.LATITUDE = e.adrwd;
				}
			},
			//选中配送地址
			ConfirmOrderAddr: function(e) {
				console.log("触发没", e);
				that.AddrArr = []; //清空一下
				that.Order.CUSTMNAME = e.CNAME; //默认赋值
				that.Order.CUSTMADDRESS = e.ADDRESS;
				that.Order.ADDRID = e.ADDRID;
				that.Order.LONGITUDE = e.LONGITUDE;
				that.Order.LATITUDE = e.LATITUDE;
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
				console.log("获取到的GSKHINFO", GSKHINFO);
				_reserve.MatchBHKH({
					LONGITUDE: that.Order.LONGITUDE,
					LATITUDE: that.Order.LATITUDE,
					GSKHINFO: GSKHINFO
				}, res => {
					console.log("匹配结果:", res);
					if (res.code) {
						let data = JSON.parse(res.data);
						if (data.over) {
							util.simpleMsg(data.msg, "none");
							that.index = 0;
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
				if (!that.Order.THKHID) {
					util.simpleMsg("提货门店为空", true);
					return;
				}
				if (!that.Order.THTYPE) {
					util.simpleMsg("配送方式为空", true);
					return;
				}
				if (that.Order.THTYPE != '1' && new Date(that.Order.THDATE.replace(/-/g, "/")) < new Date()) {
					util.simpleMsg("提货时间早于当前", true);
					return;
				}
				if (that.Order.THTYPE == '1') {
					let hour = new Date(that.Order.THDATE.replace(/-/g, "/")).getHours(); //提货时间的小时部分
					if (hour < 7 || hour > 19) {
						util.simpleMsg("提货时间不在7到19点", true);
						return;
					}
					if (new Date(that.Order.THDATE.replace(/-/g, "/")) < new Date().setHours(new Date().getHours() +
							1)) {
						util.simpleMsg("提货时间小于一小时内", true);
						return;
					}
				}
				if (that.Order.THTYPE == '2') { //现卖限制时间不能早于当前和19点以后
					if (new Date(that.Order.THDATE.replace(/-/g, "/")) < new Date()) {
						util.simpleMsg("提货时间小于当前时间", true);
						return;
					}
					if (new Date(that.Order.THDATE.replace(/-/g, "/")) > new Date().setHours(19)) {
						util.simpleMsg("提货时间晚于19点", true);
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
					util.simpleMsg("定金大于应收金额", true);
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
				}
				that.Order.CUSTMADDRESS = util.stripscript(that.Order.CUSTMADDRESS); //去除一下特殊字符串
				that.Order.CUSTMADDRESS = that.Order.ADDRID; //赋值为地址对应的id
				that.YDDATA = JSON.stringify(that.Order);
				that.Order.DNET = Number(that.Order.DNET);
				that.Order.TNET = that.Order.DNET;
				that.Order.YD_STATUS = "1";
				that.Order.BMID = that.BMID;
				if (that.confirm) {
					console.log("[Confirm]外部传入事件触发!");
					that.confirm(that.Order);
				}
				that.statements = false;
				that.yn_add = false;
				that.Empty();
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
					CARDID: "" //蛋糕类型

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
	.thmd{
		position: absolute;
		left: 150rpx;
		top:100%;
		background-color: #fff;
		border-radius: 6rpx;
		width:66%;
		text-align: left;
		z-index: 999999999;
		box-shadow: 0px 10rpx 20rpx 1px rgba(66,177,75,0.06);
		padding:1%;
	}
	.restlist .thmd text{
		width: 100%;
		display: block;
		text-align: left;
		line-height: 50rpx;
		white-space: nowrap;
	}
</style>
