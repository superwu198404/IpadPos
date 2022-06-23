<template>
	<view>
		<p>--加购的商品商品信息--</p>
		<view v-for="(item,index) in Products">
			<text>{{item.NAME}}</text>-
			<text>￥{{item.AMOUNT}}</text>-
			<text>{{item.PRICE}}元/kg</text>-
			<text>x{{item.QTY}}</text>
		</view>
		<view>
			<text>请输入单号（用于测试退款）：</text>
			<text>
				<input style="border:1px solid gray" type="text" v-model="refund_no" />
			</text>
		</view>
		<button @click="MenuPage(0)">开始结算</button>
		<button @click="MenuPage(1)">开始退款</button>
		<button @click="MenuPage(2)">录入会员</button>
		<!-- <button @click="MenuPage(3)">返回调试</button>-->
		<!-- <button @click="Test(2)">测试一下</button> -->
	</view>
</template>
<script>
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	export default {
		//变量初始化
		data() {
			return {
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
				Products: [{
						PLID: "101",
						SPID: "10101002",
						UNIT: "袋",
						BARCODE: '2222222222',
						NAME: "黑森林",
						PRICE: 0.01,
						OPRICE: 0.01,
						AMOUNT: 0.01,
						QTY: 1
					},
					{
						PLID: "101",
						SPID: "10101002",
						UNIT: "袋",
						BARCODE: '2222222222',
						NAME: "毛毛虫",
						PRICE: 0.5,
						OPRICE: 0.5,
						AMOUNT: 1,
						QTY: 2
					},
					{
						PLID: "101",
						SPID: "10101002",
						UNIT: "袋",
						BARCODE: '2222222222',
						NAME: "虎皮蛋糕",
						PRICE: 0.01,
						OPRICE: 0.01,
						AMOUNT: 1,
						QTY: 1
					}
				], //商品信息
				PayWayList: [],
				BILL_TYPE: "Z101", //销售类型 默认为销售业务
				XS_TYPE: "1", //销售类型 默认为销售业务
				refund_no: ""
			}
		},
		//方法初始化
		methods: {
			//获取支付方式
			GetPayWay: function(e) {
				let that = this;
				common.GetPayWay(e, function(res) {
					console.log("本地获取支付方式结果：", res);
					if (res.code) {
						that.PayWayList = [];
						for (var i = 0; i < res.msg.length; i++) {
							let obj = {};
							obj.name = res.msg[i].SNAME;
							obj.fkid = res.msg[i].FKID;
							obj.type = res.msg[i].JKSNAME;
							obj.poly = res.msg[i].POLY;
							if (res.msg[i].JKSNAME == 'SZQ') {
								obj.value = "COUPON";
								//obj.type = "qzf";
							}
							if (res.msg[i].JKSNAME == 'ZFB20') {
								obj.value = "ALI";
								//obj.type = "AliPayService";
							}
							if (res.msg[i].JKSNAME == 'PAYCARD') {
								obj.value = "CARD";
								//obj.type = "dzk";
							}
							if (res.msg[i].JKSNAME == 'WX_CLZF') {
								obj.value = "WX";
								//obj.type = "WxPayService";
							}
							if (res.msg[i].FKID == 'ZCV1') { //超额溢出的支付方式
								obj.value = "EXCESS";
								//obj.type = "ce";
							}
							that.PayWayList.push(obj);
						}
					}
					console.log("获取到的支付方式：", that.PayWayList);
				})
			},
			MenuPage: async function(e) {
				if (e == 0 || e == 1) {
					this.BILL_TYPE = e == 0 ? "Z101" : "Z151"; //区分是销售还是退款
					this.XS_TYPE = e == 0 ? "1" : "2"; //区分是销售还是退款
					this.refund_no = "K200QTD005122622181743705";
					if (this.XS_TYPE == '2') {
						this.sale1_obj = await common.Excute("select * from SALE001 where BILL='" + this.refund_no +
							"'")[0];
						this.sale2_arr = await common.Excute("select * from SALE002 where BILL='" + this.refund_no +
							"'");
						this.sale3_arr = await common.Excute("select * from SALE003 where BILL='" + this.refund_no +
							"'");
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
				let arr = [
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF06', '微信支付（新）', 'wxzf（x）', NULL, '10,11,12,13,14,15', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF07', '支付宝2.0', 'zfb2.0', NULL, '25,26,27,28,29,30', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF08', '翼支付', 'yzf', NULL, '51', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF15', '银联二维码', 'ylewm', NULL, '62', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF54', '积慕支付', 'jmzf', NULL, 'JM', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
					"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF04', '仟吉电子卡', 'qjdzk', NULL, 'KG,kg', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);"
				]
				for (var i = 0; i < arr.length; i++) {
					db.get().executeDml(arr[i], "执行中", (res) => {
						console.log("sql 执行结果：", res);
					});
				}
				// Req.asyncFunc({
				// 	http: true,
				// 	title: '测试请求',
				// 	data: {
				// 		action: 'ExecuteBatchSQL',
				// 		ywname: 'SALE001CLASS',
				// 		data: ""
				// 	}
				// }, function(res) {
				// 	console.log("请求结果：", res);
				// });
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
		},
		//接收上个页面传入的参数
		onLoad(option) {
			//获取支付方式
			this.KHID = "K0101QT2";
			this.GetPayWay(this.KHID);
		},
		onShow() {
			// let that = this;
			// that.PayList = this.$store.state.orders; //全局参数
			// console.log('监听支付页面回传的支付参数为：');
			// console.log(that.PayList);
			// //创建订单数据
			// if (that.PayList && that.PayList.length > 0) {
			// 	this.CreateDBData()
			// }
			this.refund_no = this.$store.state.trade;
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
</style>
