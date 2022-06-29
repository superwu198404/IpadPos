<template>
	<view>
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
		<button @click="MenuPage(2)">录入会员</button>
		<!-- <button @click="MenuPage(3)">返回调试</button>-->
		<!-- <button @click="Test(2)">测试一下</button> -->
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
	export default {
		//变量初始化
		data() {
			return {
				first:true,
				input: {
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
				sale1_obj: {},
				sale2_obj: {},
				sale2_arr: [],
				sale3_arr: [],
				hyinfo: getApp().globalData.hyinfo,
				Products: [], //商品信息
				PayWayList: [],
				BILL_TYPE: "Z101", //销售类型 默认为销售业务
				XS_TYPE: "1", //销售类型 默认为销售业务
				// refund_no: "K0101QT2122624153953331" 
				refund_no: ""
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
				this.input.similar = this.input.bills.filter(bill => bill?.includes(n) || false);
			}
		},
		//方法初始化
		methods: {
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
							obj.type = res.msg[i].JKSNAME;
							obj.poly = res.msg[i].POLY;
							if (res.msg[i].FKID == 'ZCV1') { //超额溢出的支付方式
								obj.type = "EXCESS";
							}
							that.PayWayList.push(obj);
						}
						//如果fkda没有则追加测试数据
						let arr = [{
							name: "弃用金额",
							fkid: "ZCV1",
							type: "EXCESS",
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
						},{
							name: "不可原路退回",
							fkid: "ZZ01",
							type: "NO",
							poly: "O"
						}]
						for (var i = 0; i < arr.length; i++) {
							let obj = that.PayWayList.find((item) => {
								return item.type == arr[i].type;
							});
							if (!obj) {
								that.PayWayList.push(arr[i]);
							}
						}
					}
					console.log("获取到的支付方式：", that.PayWayList);
				})
			},
			MenuPage: async function(e) {
				if (e == 0 || e == 1) {
					this.BILL_TYPE = e == 0 ? "Z101" : "Z151"; //区分是销售还是退款
					this.XS_TYPE = e == 0 ? "1" : "2"; //区分是销售还是退款
					console.log("待退款单号：", this.refund_no)
					if (this.XS_TYPE == '2') {
						let data = await common.QueryRefund(this.refund_no);
						this.sale1_obj = data.sale1;
						this.sale2_arr = data.sale2;
						this.sale3_arr = data.sale3;
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
						this.sale1_obj = {};
						this.sale2_arr = [];
						this.sale3_arr = [];
					}

					this.DataAssembleSaveForGlobal();
					uni.navigateTo({
						url: "../Payment/PaymentAll"
					})
				} else if (e == 2) {
					uni.navigateTo({
						url: "../hyinfo/index"
					})
				} else if (e == 3) {
					uni.navigateBack();
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
					out_refund_no: common.CreateBill(this.KHID, this
						.POSID), //生成退款单号
					BILL_TYPE: this.BILL_TYPE,
					XS_TYPE: this.XS_TYPE
				});
			},
			Test: function(e) {
				let param = {
					LT_IMPORT: [{
						ZZITEM: "1",
						ZZMEMBER_ID: "1000311640",
						ZZYZ_ID: "",
						ZZORDER_NUM: "K0101QT212262994030603",
						ZZORDER_TYPE: "2",
						ZZLORDER: "K0101QT212262993953620",
						ZZTPRICE: "3.00",
						ZZPAYMENT: "3.00",
						ZZPOINT_ADD: "0",
						ZZPOINT_PAY: "3.00",
						ZZCHANNEL: "POS",
						ZZSTORE: "K200QTD005",
						ZZORDER_DATE: "2022-06-29",
						ZZCPTIME: "094033",
						ZYL01: "",
						ZYL02: "",
						ZYL03: "",
						ZYL04: "",
						ZYL05: ""
					}],
					LT_ITEM: []
				}
				hy.minusHyJf(param, function(res) {
					console.log("积分上传结果：", res);
					uni.showToast({
						title: res.code ? "积分上传成功" : res.msg,
						icon: res.code ? "success" : "error"
					})
				})
				return;
				let arr = [
					"delete from dapzcs_nr where id='FKJHZF';",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF06', '微信支付（新）', 'wxzf（x）', NULL, '10,11,12,13,14,15', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF07', '支付宝2.0', 'zfb2.0', NULL, '25,26,27,28,29,30', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF08', '翼支付', 'yzf', NULL, '51', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF15', '银联二维码', 'ylewm', NULL, '62', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF54', '积慕支付', 'jmzf', NULL, 'JM', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF04', '仟吉电子卡', 'qjdzk', NULL, 'KG,kg', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);"
				]
				let sql = "";
				for (var i = 0; i < arr.length; i++) {
					sql += arr[i];
				}
				console.log("测试sql:", sql);
				//批量执行sql 必须是数组
				db.get().executeDml(arr, "执行中", (res) => {
					console.log("sql 执行结果：", res);
				});
				let sql1 = "";
				let apistr = "MobilePos_API.Models.SALE001CLASS.ExecuteBatchSQL";
				let reqdata = Req.resObj(true, "数据传输中", {
					sql: sql1
				}, apistr);
				Req.asyncFuncOne(reqdata,
					function(res1) {
						console.log("数据传输结果：", res1);
					});
			},
			insertProduct: function() {
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
				if (!products || products.length == 0) uni.setStorageSync("products",[{
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
				var that = this;
				//获取BILLS
				this.input.bills = (await common.Query("SELECT BILL FROM SALE001")).map(i => i.BILL);
				
				//生成支付规则数据
				await common.InitZFRULE();
				// await common.GetJHZF();
				that.KHID = "K0101QT2";
				//获取支付方式
				await that.GetPayWay(that.KHID);
				//初始化配置参数
				await common.GetPZCS();
				//获取支付规则数据
				await common.GetZFRULE("", (r) => {
					// console.log(`最终支付规则数据：①${getApp().globalData.PayInfo},②${ getApp().globalData.CodeRule}`);
				});
				//获取POS参数组数据
				await common.GetPOSCS(that.KHID);

				// console.log("Pay-SALE1、2、3：",await common.QueryRefund('K0101QT2122628193555279'))
				// console.log("Refund-SALE1、2、3：",await common.QueryRefund('K0101QT2122628194319455'))
			}
		},
		//接收上个页面传入的参数
		onLoad(option) {
			this.InitData();
			this.first = false;
		},
		async onShow() {
			this.refreshProduct();
			this.refund_no = this.$store.state.trade;
			// this.refund_no = "K0101QT2122628193555279";
			let info = uni.getStorageSync("hyinfo");
			if (info) {
				this.hyinfo = info;
				this.hyinfo.Balance = (this.hyinfo.Balance / 100).toFixed(2);
				getApp().globalData.hyinfo = this.hyinfo;
			}
			if(!this.first) //首次不执行
				this.input.bills = (await common.Query("SELECT BILL FROM SALE001")).map(i => i.BILL);
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
			console.info("onBackPress");
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
	.bills{
		max-height: 200px;
		overflow-y: auto;
	}
</style>
