<template>
	<view>
		<PrinterPage ref="printerPage" style="display: none;"></PrinterPage>
		<view>
			<div class="product">
				<div>商品ID：</div>
				<div><input v-model="input.fromData.SPID" /></div>
			</div>
			<div class="product">
				<div>品类ID：</div>
				<div><input v-model="input.fromData.PLID" /></div>
			</div>
			<div class="product">
				<div>商品名称：</div>
				<div><input v-model="input.fromData.NAME" /></div>
			</div>
			<div class="product">
				<div>商品条码：</div>
				<div><input v-model="input.fromData.BARCODE" /></div>
			</div>
			<div class="product">
				<div>商品数量：</div>
				<div><input v-model="input.fromData.QTY" /></div>
			</div>
			<div class="product">
				<div>商品单位：</div>
				<div><input v-model="input.fromData.UNIT" /></div>
			</div>
			<div class="product">
				<div>商品价格(元)：</div>
				<div><input v-model="input.fromData.PRICE" /></div>
			</div>
			<div class="product">
				<div>商品金额：</div>
				<div>{{ input.fromData.AMOUNT }}</div>
			</div>
			<div class="product">
				<div style="border-radius: 5px;background-color: lightgray;border:1px solid gray;padding: 2px 3px;margin-left: 5px;"
					@click="insertProduct()">添加</div>
			</div>
		</view>
		<p>--加购的商品商品信息--</p>
		<view style="max-height: 180px;border: 1px solid gray;overflow-y:auto;">
			<view v-for="(item,index) in Products" style="margin: 14px 2px;">
				<text>{{item.NAME}}</text>-
				<text>￥{{item.AMOUNT}}</text>-
				<text>{{item.PRICE}}元/kg</text>-
				<text>x{{item.QTY}}</text>
				<text><span
						style="background-color: red;color: white;padding: 2px 4px;border-radius: 5px;margin-left: 10px;"
						@click="removeProduct(item.ID)">删除</span></text>
			</view>
		</view>
		<view>
			<text style="height: 50px;line-height: 50px;">请输入单号（用于测试退款）：<span
					style="border-radius: 5px;padding: 2px 3px;margin-left: 5px;background-color: royalblue;color: white;"
					@click="searchOrder()">查询</span></text>
			<text>
				<input style="border:1px solid gray" type="text" v-model="refund_no" />
				<div class="bills">
					<div v-for="bill in input.similar" @click="billAssignment(bill)">{{ bill }}</div>
				</div>
			</text>
		</view>
		<button @click="MenuPage(0)">开始结算</button>
		<button @click="MenuPage(1)">开始退款</button>
		<!-- <button @click="MenuPage(2)">会员登录</button> -->
		<!-- <button @click="MenuPage(3)">外卖处理</button>
		<button @click="MenuPage(4)">外卖预定</button> -->
		<button @click="MenuPage(5)">登录</button>
		<button @click="MenuPage(6)">首页</button>
		<!-- <button @click="MenuPage(7)">销售退单</button>
		<button @click="MenuPage(8)">预定</button>
		<button @click="MenuPage(9)">赊销退单</button>
		<button @click="MenuMain()">功能主页</button> -->
		<!-- <button @click="againPrinter()">重新打印</button> -->
		<!-- <button @click="inputAuthCode()">录入付款码</button> -->
		<button @click="closeDB()">断开数据库链接</button>
		<!-- <button @click="MenuPage(3)">返回调试</button>-->
		<button @click="Test(2)">测试一下</button>
		<div v-if="view.orders.showDetail"
			style="position: absolute;width: 70%;height: 70%;left: 50%;right: 50%;top: 50%;bottom: 50%;transform: translate(-50%,-50%);background-color: white;box-shadow: 0px 0px 10px 0px #8f8f94;">
			<div style="height: 100%;width: 100%;overflow-y: auto;position: relative;">
				<div style="height: 25px;">
					<div @click="view.orders.showDetail = false"
						style="position: fixed;right: 0px;display: inline-block;padding: 6px;background-color: red;box-sizing: border-box;color: white;height: 25px;width: 25px;text-align: center;line-height: 12.5px;">
						×</div>
				</div>
				<div style="display: flex;">
					<div>
						<span>
							SALE001:
						</span>
						<pre>
						{{ view.orders.sale1_string }}
						</pre>
					</div>
					<div>
						<span>
							SALE002:
						</span>
						<pre>
						{{ view.orders.sale2_string }}
						</pre>
					</div>
					<div>
						<span>
							SALE003:
						</span>
						<pre>
						{{ view.orders.sale3_string }}
						</pre>
					</div>
				</div>
			</div>
		</div>
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
	import hy from '@/api/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import _pay from '@/api/Pay/PaymentALL.js';
	import util from '@/utils/util.js';
	import dateformat from '@/utils/dateformat.js';
	import {
		RefundQuery
	} from '@/api/business/da.js';
	import PrinterPage from '@/pages/xprinter/receipt';

	import _take from '@/api/business/takeaway.js';
	//打印相关
	export default {
		components: {
			PrinterPage
		},
		//变量初始化
		data() {
			return {
				first: true,
				input: {
					sql: "",
					fromData: {
						PLID: "101",
						SPID: "",
						UNIT: "个",
						BARCODE: '',
						NAME: "",
						PRICE: 1.00,
						OPRICE: 1.00,
						AMOUNT: 1.00,
						QTY: 1
					},
					bills: [], //整集合
					similar: [] //类似
				},
				view: {
					orders: {
						showDetail: false,
						sale1_string: "",
						sale2_string: "",
						sale3_string: ""
					}
				},
				allAmount: 0, //订单总金额(包含折扣)
				totalAmount: 0, //应付总金额
				Discount: 0, //折扣金额
				GSID: getApp().globalData.store.GSID, //公司id
				DPID: getApp().globalData.store.DPID, //店铺id
				KCDID: getApp().globalData.store.KCDID, //存库点id
				GCID: getApp().globalData.store.GCID, //工厂id
				BMID: getApp().globalData.store.BMID, //部门id
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID,
				Name: getApp().globalData.store.NAME,
				MerId: getApp().globalData.store.MERID,
				DKFID:getApp().globalData.store.DKFID,
				sale1_obj: {},
				sale2_obj: {},
				sale2_arr: [],
				sale3_arr: [],
				hyinfo: getApp().globalData.hyinfo,
				Products: [], //商品信息
				PayWayList: [],
				PayList: [],
				// PayList: [{
				// 	fkid: "ZF04",
				// 	type: "HYK",
				// 	bill: "111111111111111111111111111",
				// 	name: "微信支付",
				// 	amount: 0.01,
				// 	no: 0,
				// 	disc: 0.2,
				// 	zklx: "test-测试数据",
				// 	id_type: "test-测试数据",
				// 	user_id: "test-测试数据",
				// 	auth_code: "KG99504660018941542400",
				// 	is_free: "",
				// 	card_no: "",
				// 	//业务配置字段 ↓
				// 	fail: true, //def初始和退款失败的皆为true
				// 	pay_num: 0, //付款（尝试）次数，这里起码有一次才会显示为失败，0则不会
				// 	paying: false, //是否在正在退款中
				// 	loading: false,
				// 	msg: "" //操作提示信息（可以显示失败的或者成功的）
				// }],
				BILL_TYPE: "Z101", //销售类型 默认为销售业务
				XS_TYPE: "1", //销售类型 默认为销售业务
				// refund_no: "K0101QT2122624153953331" 
				refund_no: "",
				totalAmount: 0,
				SKY_DISCOUNT: 0,
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 200, //二维码宽
				qrCodeHeight: 200, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				actType: common.actTypeEnum.Payment //当前行为 代表是支付还是退款 默认支付行为
			}
		},
		watch: {
			'input.fromData.QTY': function(n, o) {
				this.input.fromData.AMOUNT = this.input.fromData.PRICE * this.input.fromData.QTY;
			},
			'input.fromData.PRICE': function(n, o) {
				this.input.fromData.AMOUNT = this.input.fromData.PRICE * this.input.fromData.QTY;
			},
			'refund_no': function(n, o) {
				if (!n) {
					this.input.similar = [];
					this.$forceUpdate();
					return;
				}
				this.input.similar = this.input.bills.filter(bill => (bill?.toLowerCase()?.includes(n.toLowerCase()) ||
					false) || (bill?.toUpperCase()?.includes(n.toUpperCase()) || false));
			}
		},
		//方法初始化
		methods: {
			inputAuthCode: function() {
				uni.scanCode({
					success: (function(res) {
						console.log("auth_code:", res.result)
						this.PayList[0].auth_code = res.result;
						console.log("this.PayList[0].auth_code:", this.PayList[0].auth_code)
					}).bind(this)
				});

			},
			//获取支付方式
			GetPayWay: async function(e) {
				let that = this;
				await common.GetPayWay(e, function(res) {
					console.log("本地获取支付方式结果：", res);
					if (res.code) {
						that.PayWayList = [];
						for (var i = 0; i < res.msg.length; i++) {
							let obj = {};
							obj.name = res.msg[i].SNAME;
							obj.fkid = res.msg[i].FKID;
							obj.type = res.msg[i].JKSNAME || "NOPAY";
							obj.poly = res.msg[i].POLY;
							obj.dbm = res.msg[i].YN_DBM; //是否要扫码 Y:扫码 N:不扫码
							obj.zklx = res.msg[i].ZKLX; //折扣类型（主要是会员卡使用）
							if (res.msg[i].FKID == 'ZCV1') { //超额溢出的支付方式
								obj.type = "EXCESS";
							}
							that.PayWayList.push(obj);
						}
						console.log("res.msg:", res.msg)
						//如果fkda没有则追加测试数据
						let arr = [{
							name: "弃用金额",
							fkid: "ZCV1",
							type: "NOPAY",
							poly: "O"
						}, {
							name: "仟吉电子卡",
							fkid: "ZF04",
							type: "HYK",
							poly: "Y"
						}, {
							name: "云闪付",
							fkid: "ZF33",
							type: "YSF",
							poly: "N"
						}, {
							name: "可伴支付",
							fkid: "ZF22",
							type: "COUPON",
							poly: "N"
						}, {
							name: "品诺支付",
							fkid: "ZF32",
							type: "PINNUO",
							poly: "N",
						}, {
							name: "不可原路退回",
							fkid: "ZG11",
							type: "NO",
							poly: "O"
						}, ]
						for (var i = 0; i < arr.length; i++) {
							let obj = that.PayWayList.find((item) => {
								return item.type == arr[i].type;
							});
							if (!obj) {
								that.PayWayList.push(arr[i]);
							}
						}
						that.PayWayList.push({
							name: "仟吉赠券",
							fkid: "ZZ01",
							// type: "ZQ",
							type: "NOPAY",
							poly: "O"
						});
					}
					console.log("获取到的支付方式：", that.PayWayList);
				})
			},
			MenuMain: function() {
				uni.navigateTo({
					url: "../Main/Main"
				});
			},
			MenuPage: async function(e) {
				if (e == 0 || e == 1) {
					this.BILL_TYPE = e == 0 ? "Z101" : "Z151"; //区分是销售还是退款
					this.XS_TYPE = e == 0 ? "1" : "2"; //区分是销售还是退款
					this.actType = e == 0 ? common.actTypeEnum.Payment : common.actTypeEnum.Refund; //定义当前行为
					console.log("待退款单号：", this.refund_no)
					if (this.actType == common.actTypeEnum.Refund) { //如果是退款
						let data = null;
						data = await RefundQuery(this.refund_no);
						if (!this.sale1_obj || Object.keys(this.sale1_obj).length == 0 || this.sale2_arr.length ==
							0 || this.sale3_arr.length == 0) { //如果服务器查不到
							data = await common.QueryRefund(this.refund_no);
						}
						this.sale1_obj = data.sale1;
						console.log("private-before:", data.sale2)
						this.sale2_arr = data.sale2.map(i => util.hidePropety(i, "SKYDISCOUNT", "NAME"));
						console.log("private-after:", data.sale2)
						this.sale3_arr = data.sale3;
						this.Products = this.sale3_arr?.map((function(i) {
							return Object.assign({
								PLID: i.PLID,
								SPID: i.SPID,
								UNIT: i.UNIT,
								BARCODE: i.BARCODE,
								NAME: i.NAME,
								PRICE: i.PRICE,
								OPRICE: i.OPRICE,
								AMOUNT: i.NET,
								QTY: i.QTY,
								DISCRATE: i.DISCRATE, //退款使用
								YN_SKYDISC: i.YN_SKYDISC, //退款使用
								DISC: i.DISC //退款使用
							}, i)
						}).bind(this));
						this.refund_no = ""; //清空单号
						console.log("SALE1、2、3：", [this.sale1_obj, this.sale2_arr, this.sale3_arr]);
						if (!this.sale1_obj || Object.keys(this.sale1_obj).length == 0 || this.sale2_arr.length == 0 ||
							this.sale3_arr.length == 0) {
							uni.showToast({
								title: "订单不存在！",
								icon: "error"
							})
							return;
						}
					} else {
						this.SaleBaseInit();
					}
					this.DataAssembleSaveForGlobal();
					uni.navigateTo({
						url: "../Payment/PaymentAll"
					})
				} else if (e == 2) {
					uni.navigateTo({
						// url: "../hyinfo/index"
						url: "../MemberLogin/MemberLogin"
					})
				} else if (e == 3) {
					uni.navigateTo({
						url: "../TakeAway/TakeAway"
					})
				} else if (e == 4) {
					uni.navigateTo({
						url: "../TakeYD/TakeYD"
					});
				} else if (e == 5) {
					uni.navigateTo({
						url: "../Login/Login"
					});
				}else if (e == 6) {
					uni.navigateTo({
						url: "../Main/Main",
						complete:r=>{
							console.log(r);
						}
					});
				}
				else if (e == 8) {
					uni.navigateTo({
						url: "../Reserve/Reserve",
						complete:r=>{
							console.log(r);
						}
					});
				}
				else if (e == 9) {
					uni.navigateTo({
						url: "../RefundOrder/SXRefund",
						complete:r=>{
							console.log(r);
						}
					});
				}
			},
			DataAssembleSaveForGlobal: function() {
				//把数据传入下个页面
				this.$store.commit('set-location', {
					allow_discount_amount: "", //允许折扣金额
					Discount: 0, //折扣金额
					store_id: "", //门店id
					cashier: "", //收银员
					date: "", //日期
					company: "", //公司
					sale1_obj: this.sale1_obj, //001 主单 数据对象
					sale2_arr: this.sale2_arr, //002 商品 数据对象集合
					sale3_arr: this.sale3_arr, //002 商品 数据对象集合
					Products: this.Products, //商品信息
					PayWayList: this.PayWayList, //支付方式
					hyinfo: {}, //会员信息
					authCode: "", //卡券信息 or 支付授权码
					out_trade_no_old: common.CreateBill(this.KHID, this.POSID),
					out_refund_no: common.CreateBill(this.KHID, this.POSID), //生成退款单号
					BILL_TYPE: this.BILL_TYPE,
					XS_TYPE: this.XS_TYPE,
					SKY_DISCOUNT: this.SKY_DISCOUNT,
					totalAmount: this.totalAmount,
					actType: this.actType,
					PayList: this.PayList
				});
			},
			priceCount: function() {
				let total = 0;
				let that = this;
				this.Products.forEach(product => total += product.AMOUNT);
				// console.log("商品总金额：", this.SKY_DISCOUNT);
				//舍弃分的处理
				// this.SKY_DISCOUNT = parseFloat((total % 1).toFixed(2));
				console.log("手工折扣额：", this.SKY_DISCOUNT);
				this.totalAmount = parseFloat((total - this.SKY_DISCOUNT).toFixed(2)); //舍弃分数位
				let curDis = 0;
				this.Products.forEach(function(item, index, arr) {
					let high = parseFloat((item.AMOUNT / total * that.SKY_DISCOUNT).toFixed(2));
					item.SKYDISCOUNT = high;
					curDis += high;
					// console.log("几个值：", [high, curDis, index, arr.length, that.SKY_DISCOUNT]);
					if (index == arr.length - 1) {
						let dif = parseFloat((that.SKY_DISCOUNT - curDis).toFixed(2)); //实际的差值
						item.SKYDISCOUNT += dif;
					}
				});
				console.log("处理分后的商品信息：", this.Products);
			},
			SaleBaseInit: function() {
				this.priceCount() //支付金额初始化
				//预先重置
				this.sale1_obj = {};
				this.sale2_arr = [];
				this.sale3_arr = [];
				//创建基本结构
				//sale 001:
				this.sale1_obj = {
					BILL: "", //payall 追加
					SALEDATE: "", //payall 追加
					SALETIME: "", //payall 追加
					KHID: this.KHID,
					POSID: this.POSID,
					RYID: this.RYID,
					BILL_TYPE: this.BILL_TYPE,
					XSTYPE: this.XS_TYPE,
					XS_BILL: "",
					XS_POSID: "",
					XS_DATE: "",
					XS_KHID: "",
					XS_GSID: "",
					TLINE: this.Products.length,
					TNET: 0, //payall 追加
					DNET: 0,
					ZNET: 0, //payall 追加
					BILLDISC: 0, //payall 追加
					ROUND: 0, //payall 追加
					CHANGENET: 0,
					CXTNET: 0,
					TCXDISC: 0,
					CUID: this?.hyinfo?.hyId,
					CARDID: "",
					THYDISC: 0,
					TDISC: 0, //payall 追加
					YN_SC: 'N',
					GSID: this.GSID, //公司
					GCID: this.GCID,
					DPID: this.DPID,
					KCDID: this.KCDID,
					BMID: this.BMID,
					DKFID: this.DKFID,
					XSPTID: 'POS',
					YN_OK: 'X',
					THTYPE: 0,
					CLTIME: "" //payall 追加
				};
				//sale 002:
				this.sale2_arr = this.Products.map((item, index) => {
					return util.hidePropety({
						BILL: "", //payall 追加
						SALEDATE: "", //payall 追加
						SALETIME: "", //payall 追加
						KHID: this.KHID,
						POSID: this.POSID,
						SPID: item.SPID,
						NO: index,
						PLID: item.PLID,
						BARCODE: item.BARCODE,
						UNIT: item.UNIT,
						QTY: (this.isRefund ? -1 : 1) * item.QTY,
						PRICE: item.PRICE, //payall 追加
						OPRICE: item.OPRICE,
						NET: 0, //payall 追加
						DISCRATE: 0, //payall 追加
						YN_SKYDISC: '', //payall 追加
						DISC: 0, //payall 追加
						YN_CXDISC: 'N',
						CXDISC: 0,
						MONTH: '', //payall 追加
						WEEK: '', //payall 追加
						TIME: '', //payall 追加
						RYID: this.RYID,
						GCID: this.GCID,
						DPID: this.DPID,
						KCDID: this.KCDID,
						BMID: this.BMID,
						SKYDISCOUNT: item.SKYDISCOUNT
					}, "SKYDISCOUNT");
				});
				console.log("after:", this.sale2_arr)
				console.log("after:", JSON.stringify(this.sale2_arr))
			},
			Test: function(e) {
				let sql1 = "";
				let apistr = "MobilePos_API.Models.SALE001CLASS.ExecuteBatchSQL";
				let reqdata = Req.resObj(true, "数据传输中", {
					sql: sql1
				}, apistr);
				Req.asyncFuncOne(reqdata, function(res1) {
					console.log("数据传输结果：", res1);
					uni.showToast({
						title: res1.code ? "数据传输成功" : "数据传输失败",
						icon: res1.code ? "success" : "error"
					})
					if (res1.code) {
						let delStr = "delete from POS_TXFILE where str1 ='" + delVal + "'";
						db.get().executeDml(delStr, "数据删除中", function(res2) {
							console.log("缓存数据删除成功:", res2);
							if (func) func(res2);
						}, function(err1) {
							console.log("缓存数据删除失败:", err1);
						});
					}
				});
			},
			insertProduct: function() {
				if (Object.entries(this.input.fromData).findIndex(arr => arr[1] === null || arr[1] === undefined ||
						arr[1] === "") !== -1) {
					uni.showToast({
						title: "有字段为空，无法添加!",
						icon: "error"
					});
					return;
				}
				let product = Object.assign({
					ID: util.uuid()
				}, this.input.fromData);
				let products = uni.getStorageSync("products");
				products.push(product);
				uni.setStorageSync("products", products);
				this.refreshProduct();
			},
			removeProduct: function(id) {
				let products = uni.getStorageSync("products");
				products.splice(products.findIndex(i => i.ID === id), 1);
				uni.setStorageSync("products", products);
				this.refreshProduct();
			},
			refreshProduct: function() {
				let products = uni.getStorageSync("products");
				if (!products || products.length == 0) uni.setStorageSync("products", [{
						PLID: "101",
						SPID: "1010100004",
						UNIT: "袋",
						BARCODE: '2222222220',
						NAME: "超软白土司",
						PRICE: 0.01,
						OPRICE: 0.01,
						AMOUNT: 0.01,
						QTY: 1
					},
					{
						PLID: "101",
						SPID: "1010100010",
						UNIT: "袋",
						BARCODE: '2222222221',
						NAME: "你好土司",
						PRICE: 0.5,
						OPRICE: 0.5,
						AMOUNT: 1,
						QTY: 2
					},
					{
						PLID: "101",
						SPID: "10101022",
						UNIT: "袋",
						BARCODE: '2222222222',
						NAME: "黄金唱片",
						PRICE: 0.01,
						OPRICE: 0.01,
						AMOUNT: 0.01,
						QTY: 1
					},
					{
						PLID: "107",
						SPID: "10701001",
						UNIT: "杯",
						BARCODE: '2222222223',
						NAME: "焦糖玛奇朵",
						PRICE: 1,
						OPRICE: 1,
						AMOUNT: 1,
						QTY: 1
					}, {
						PLID: "107",
						SPID: "10701002",
						UNIT: "杯",
						BARCODE: '2222222224',
						NAME: "法式香草拿铁",
						PRICE: 1,
						OPRICE: 1,
						AMOUNT: 1,
						QTY: 1
					}
				]);
				this.Products = uni.getStorageSync("products");
			},
			change: function(e) {
				this.$showModal({
					concent: '测试测试~',
					showCancel: true,
					showOther: true,
					confirmVal: '知道了',
					align: 'left',
					$confirm: function(res) {
						console.log("$confirm");
					},
					$cancel: function(res) {
						console.log("$cancel");
					},
					$other: function(res) {
						console.log("$other");
					}
				});
			},
			billAssignment: function(bill) {
				this.refund_no = bill;
				this.input.similar = [];
				this.$forceUpdate();
			},
			searchOrder: async function() {
				let sales = await common.QueryRefund(this.refund_no);
				console.log("SALES:", sales);
				this.view.orders.sale1_string = JSON.stringify(sales.sale1, null, 2);
				this.view.orders.sale2_string = JSON.stringify(sales.sale2, null, 2);
				this.view.orders.sale3_string = JSON.stringify(sales.sale3, null, 2);
				this.view.orders.showDetail = true;
			},
			//初始化基础数据
			InitData: async function() {
				// 插入应对 银联 mis 的 fkid 信息
				// await common.Excute(`insert into KHZFKDA('DATE_LR','DATE_SH','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','KHZID') values('2022-07-28 14:14:00','2022-07-28 14:14:00',1,'ZF51','022','022','K03000')`);
				//await common.Excute(`insert into KHZFKDA('DATE_LR','DATE_SH','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','KHZID') values('2022-07-28 14:14:00','2022-07-28 14:14:00',1,'ZF51','022','022','CS01')`);
				// await common.Excute(`insert into KHZFKDA('DATE_LR','DATE_SH','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','KHZID') values('2022-07-28 14:14:00','2022-07-28 14:14:00',1,'ZF02','022','022','K01000')`);
				await common.Query("select * from KHZFKDA where FKID='ZF51'",(res) => {
					console.log("查询结果：",res)
				})
				var that = this;
				//获取BILLS
				this.input.bills = (await common.Query("SELECT BILL FROM SALE001 ORDER BY SALETIME")).map(i => i.BILL).reverse();
				// console.log("Client:",await common.Query("SELECT KHID,SNAME,KHDA.adress,khda.Phone,sname ,CLIENT_TYPE,DQID,DPID,GCID,KHZID,ADRC,ADRPNAME ,KCDID,ZZTLX,JGID FROM KHDA"))
				//生成支付规则数据
				await common.InitZFRULE();
				let khid = "K0101QT2";
				//获取支付方式
				await that.GetPayWay(khid);
				//初始化配置参数
				await common.GetPZCS();
				//获取支付规则数据
				await common.GetZFRULE();
				//获取POS参数组数据
				await common.GetPOSCS(khid);

				console.log("POSCS", util.getStorage("POSCS"))
				// console.log("Pay-SALE1、2、3：",await common.QueryRefund('K0101QT2122628193555279'))
				// console.log("Refund-SALE1、2、3：",await common.QueryRefund('K0101QT2122628194319455'))
			},
			//重新打印
			againPrinter: function(xsBill) {
				let that = this;
				that.$refs.printerPage.againPrinter(that.refund_no);
			},
			closeDB:async function(){
				await common.Close();
			}
		},
		//接收上个页面传入的参数
		onLoad(option) {
			//console.log("单号测试：", common.CreateBill(this.KHID, this.POSID));
			this.InitData();
			this.first = false;
		},
		async onShow() {
			this.refreshProduct();
			this.refund_no = this.$store.state.trade;
			
			if (!this.first) //首次不执行
				this.input.bills = (await common.Query("SELECT BILL FROM SALE001")).map(i => i.BILL).reverse();
		},
		onReady() {
			//监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发

		},
		onHide() {
			//监听页面隐藏
		},
		onUnload() {
			//监听页面卸载
		},
		onResize() {
			//监听窗口尺寸变化
		},
		onPullDownRefresh() {
			//监听用户下拉动作，一般用于下拉刷新，参考
		},
		onReachBottom() {
			//页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。具体见下方注意事项
		},
		onTabItemTap() {
			//点击 tab 时触发，参数为Object
		},
		onShareAppMessage() {
			//用户点击右上角分享
		},
		onPageScroll() {
			//监听页面滚动 参数为Objec
		},
		onNavigationBarButtonTap() {
			//监听原生标题栏按钮点击事件 参数为Object
		},
		onBackPress() {
			//监听页面返回  
			//console.info("onBackPress");
		},
		onNavigationBarSearchInputChanged() {
			//监听原生标题栏搜搜输入框输入内容变化事件
		},
		onNavigationBarSearchInputConfirmed() {
			//监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的搜素按钮是出发
		},
		onNavigationBarSearchInputClicked() {
			//监听原生标题栏搜搜输入框点击事件 （pages.json 中的 searchInput 配置 disabled 为 true 时才会触发）
		},
		onShareTimeline() {
			//监听用户点击又上角转发到朋友圈
		},
		onAddToFavorites() {
			//监听用户点击右上角收藏
		}
	}
	//可定义方法和变量
	function bb() {
		console.info("bb");
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.product {
		display: inline-flex;
	}

	.product input {
		width: 150px;
		border: 1px solid gray;
	}

	.bills {
		max-height: 200px;
		overflow-y: auto;
	}

	.canvasdiv {
		width: 0px;
		height: 0px;
		visibility: hidden;
	}
</style>
