<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<view class="boxs" v-if="statements">
		<view class="memberes">
			<!-- v-if="Memberinfo" -->
			<view class="meminfo">
				<view class="member">
					<label>填写预定信息</label>
					<button @click="Close()">×</button>
				</view>
				<view class="middle">
					<view class="restlist">
						<label><text>收货人：</text><input type="text" v-model="Order.CUSTMNAME" /></label>
						<label><text>*联系电话：</text><input type="number" v-model="Order.CUSTMPHONE"
								@blur="GetAddr()" /></label>
						<label><text>*提货日期：</text>
							<!-- <input type="date" v-model="Order.THDATE" /> -->
							<picker mode="date" @change="dateChange">
								<view>{{Order.TH_DATE}}</view>
							</picker>
						</label>
						<label><text>*提货时间：</text>
							<!-- <input type="date" v-model="Order.THDATE" /> -->
							<picker mode="time" @change="timeChange">
								<view>{{Order.TH_TIME}}</view>
							</picker>
						</label>
						<label><text>*提货门店：</text><input type="text" v-model="Order.THKHID" /></label>
						<label><text>*定金：</text><input type="number" v-model="Order.DNET" /></label>
						<label><text>*配送方式：</text>
							<picker @change="THChange" :range="THTYPES" range-key="NAME" value="index">
								<view>{{THTYPES.length>0?THTYPES[index].NAME:""}}</view>
							</picker>
						</label>
						<label><text>配送地址：</text><input type="text" v-model="Order.CUSTMADDRESS" /></label>
						<label><text>备注：</text><textarea v-model="Order.CUSTMCOMM"></textarea></label>
					</view>
					<view class='rests' v-if="yn_add" style="margin-bottom: 0; padding-bottom: 0;">
						<view class="h6"><text>新增地址</text></view>
						<view class="restlist">
							<label><text>收货人：</text><input type="text" v-model="ADDR.NAME" /></label>
							<label><text>联系电话：</text><input type="number" v-model="ADDR.PHONE"
									:disabled="ADDR.ACT=='Update'" /></label>
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
				<view class="operat">
					<button class="btn btn-qx" @click="Close()">取 消</button>
					<button class="btn" @click="Confirm">确 定</button>
				</view>
			</view>

			<view class="pop-r">
				<view class="member">
					<label>
						<image class="touxiang" src="../../images/touxiang.png"></image>
						<label class="meminfo"><text>{{hyinfo.NICKNAME}}</text><text>{{hyinfo.hyId}}</text></label>
					</label>
					<text>清空</text>
				</view>
				<view class="h5"><text>单号：{{Order.BILL}}</text></view>
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
					<view class="li"><text>总金额</text><text>￥{{Order.ZNET}}</text></view>
					<view class="li"><text>件数</text><text>{{Order.QTY}}</text></view>
					<view class="li"><text>折扣</text><text>-￥{{Order.DISC}}</text></view>
					<view class="li"><text>应收金额</text><text>￥{{Order.TNET}}</text></view>
				</view>

				<view class="confirm">
					<button class="btn btn-qx">返 回</button>
					<button class="btn">确 认</button>
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
	import _reserve from '@/api/business/reserve.js';

	var that;
	export default {
		data() {
			return {
				GSID: app.globalData.store.GSID,
				KHID: app.globalData.store.KHID,
				POSID: app.globalData.store.POSID,
				statements: true,
				index: 0,
				THTYPES: [],
				Order: {
					BILL: "",
					QTY: 1,
					DISC: 2,
					ZNET: 12,
					TNET: 10,
					DNET: 0,
					CUSTMNAME: "",
					CUSTMPHONE: "12345678982",
					THDATE: dateformat.getYMD() + ' ' + dateformat.gettime(),
					TH_DATE: dateformat.getYMD(),
					TH_TIME: dateformat.gettime(),
					THTYPE: "",
					NOTE: "",
					CUSTMADDRESS: ""
				},
				hyinfo: app.globalData.hyinfo,
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
				AddrArr: []
			}
		},
		methods: {
			onLoad: function() {
				that = this;
				that.getTHTYPE();
				that.Order.BILL = common.CreateBill(that.KHID, that.POSID)
				//以下为测试数据
				// let GSKHINFO = _reserve.getGSKHINFO(that.GSID, that.KHID);
				// console.log("获取到的GSKHINFO", GSKHINFO);
			},
			Close: function() {
				that.statements = false;
			},
			getTHTYPE: function() {
				common.GetDapzcs("THTYPE", res => {
					if (res.code && res.msg.length > 0) {
						that.THTYPES = res.msg.map((item, index) => {
							return {
								ID: item.ID_NR,
								NAME: item.SNAME
							};
						})
						if (that.THTYPES.length > 0) {
							that.Order.THTYPE = that.THTYPES[that.index].ID;
						}
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
			},
			//显示地址框
			ShowAddADDR: () => {
				that.yn_add = true;
				that.ADDR = {};
				that.ADDR.PHONE = that.Order.CUSTMPHONE; //默认赋值手机号
				that.ADDR.ACT = "Add"; //操作类型
			},
			GetAddr: function() {
				_reserve.GetAddr({
					phone: that.Order.CUSTMPHONE
				}, res => {
					if (res.code && res.data.length > 0) {
						that.ADDRS = JSON.parse(res.data);
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
					util.simpleMsg("操作" + res.code ? "成功" : "失败", !res.code)
					that.yn_add = !res.code;
					if (res.code) {
						that.GetAddr(); //刷新一下地址列表
					}
				})
			},
			searchMapAddr: async function() {
				// if (that.ADDR.ADDRESS.length < 3 || that.ADDR.ADDRESS.length % 3 != 0) {
				// 	//最少要输入一点吧
				// 	return;
				// }
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
				that.Order.CUSTMADDRESS = e.ADDRESS;
				that.Order.LONGITUDE = e.LONGITUDE;
				that.Order.LATITUDE = e.LATITUDE;
				if (that.Order.CUSTMADDRESS) {
					//匹配下裱花间
					that.MatchBHKH();
				}
			},
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
						util.simpleMsg("已匹配到最近门店");
						let khid = JSON.parse(res.data);
						that.Order.THKHID = khid;
						that.$forceUpdate(); //刷新input的值 狗bug
					}
				})
			},
			//用户信息确定
			Confirm: () => {
				if (!that.Order.CUSTMPHONE) {
					util.simpleMsg("联系电话为空", true);
					return;
				}
				if (!that.Order.THKHID) {
					util.simpleMsg("提货门店为空", true);
					return;
				}
				if (!that.Order.THTYPE) {
					util.simpleMsg("提货类型为空", true);
					return;
				}
				if (that.Order.DNET == "" || that.Order.DNET == null || that.Order.DNET == undefined) {
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
				if (that.Order.THTYPE != '1' && that.Order.THDATE < new Date()) {
					util.simpleMsg("提货时间早于当前", true);
					return;
				}
				if (that.Order.THTYPE == '1' && that.Order.THDATE < new Date().setHours(new Date()
						.getHours() + 1)) {
					util.simpleMsg("提货时间小于一小时内", true);
					return;
				}
				if (that.Order.THTYPE == '1' || that.Order.THTYPE == '2') {
					if (!that.Order.CUSTMADDRESS) {
						util.simpleMsg("配送地址为空", true);
						return;
					}
				}
				console.log("待提交的顾客信息:", JSON.stringify(that.Order));
			}
		}
	}
</script>

<style>

</style>
