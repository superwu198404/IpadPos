<template>
	<view>
		<!-- 付款详情 -->
		<view>
			<view class="text-area"> 总金额：{{totalAmount}} </view>
			<view class="text-area"> 折扣：{{Discount}} </view>
			<view class="input"> 实收：{{yPayAmount}} </view>
			<view class="input"> 欠款：{{wPayAmount}} </view>
			<view class="input"> 还需支付：{{wPayAmount}} </view>
		</view>
		<!-- 商品详情 -->
		<view>
			<view v-for="(item) in products">
				<text>{{item.name}}</text>-
				<text>￥{{item.amount}}</text>-
				<text>{{item.price}}元/kg</text>-
				<text>x{{item.num}}</text>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :type="type" :maskClick="false">
				<view class="uni-tip">
					付款码：
					<input confirm-type="confirm" @confirm="ToPay" v-model="authCode">
				</view>
			</uni-popup>
		</view>
		<button @click="wxSanPay()">微信扫码支付</button>
		<button @click="aliSanPay()">支付宝扫码支付</button>
		<button @click="hyCardPay()">电子会员卡支付</button>
		<button @click="CouponPay()">电子券支付</button>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue'
	import hy from '@/utils/hy/hy_query.js';
	import _wx from '@/utils/Pay/WxPay.js';
	import common from '@/api/common.js';
	import dateformat from '@/utils/dateformat.js';
	import c_sql from '@/utils/db/create_sql.js';
	import db from '@/utils/db/db_excute.js';

	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				products: [{
					name: "黑森林",
					price: "10",
					amount: "20",
					num: 2
				}, {
					name: "毛毛虫",
					price: "12",
					amount: "24",
					num: 2
				}],
				authCode: "130108158206176736",
				out_trade_no: "202204271458564",
				totalAmount: 100, //总金额
				Discount: "0.5", //支付方式
				yPayAmount: 0, //已支付金额
				wPayAmount: 0,
				url: "",
				type: "center"
			}
		},
		methods: {
			//微信扫码支付
			wxSanPay: function() {
				console.log("扫码事件")
				// this.CreateSale();
				// return;
				let sql = c_sql.createSql;//创建表
				// db.SqliteHelper.get().executeDml(sql, "表结构创建中", function(res) {
				// 	console.log("数据库执行成功");
				// 	console.log(res);
				// }, function(err) {
				// 	console.log("数据库执行失败");
				// 	console.log(err);
				// });
				// sql = "insert into OSALE001 (KHID) values('K210QTD');";
				// db.SqliteHelper.get().executeDml(sql, "执行sql", function(res) {
				// 	console.log("sql执行成功")
				// 	console.log(res)
				// }, function(err) {
				// 	console.log("sql执行失败")
				// 	console.log(err)
				// })
				// return;
				// db.SqliteHelper.get().executeQry("select * from OSALE001", "", function(res) {
				// 	console.log("数据库查询成功");
				// 	console.log(res);
				// }, function(err) {
				// 	console.log("数据库查询失败");
				// 	console.log(err);
				// });
				// return;
				// this.CreateSale()
				console.log(dateformat.getYMDS());
				this.$refs['popup'].open();
			},
			ToPay: function() {
				let _that = this;
				let bill = common.CreateBill("K210QTD002", "001");

				_that.out_trade_no = bill;
				_wx.CodeScanPay("微信扫码付", _that.out_trade_no, "商品支付", _that.authCode, _that.totalAmount,
					function(res) {
						console.log("微信支付结果：");
						console.log(res);
					});
				return;
				// 调起条码扫描
				uni.scanCode({
					scanType: ['qrCode', 'datamatrix', 'pdf417'],
					success: function(res) {
						_that.auth_code = res.result
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + JSON.stringify(res.result));
						//调用微信扫码付
						let result = _wx.CodeScanPay("微信扫码付", this.out_trade_no, "商品支付", 0.01);
					}
				});
			},

			CreateSale: function() {
				let sql1 = common.CreateSQL(this.products, 'SALE001');
				let sql2 = common.CreateSQL(this.products, 'SALE002');
				let sql3 = common.CreateSQL(this.products, 'SALE003');
				console.log("数据库状态" + db.isOpen());
				if (!db.isOpen()) {
					db.openSqllite().then(function(res) {
						console.log(res);
						let sql = c_sql.createSql;
						db.executeSql(sql).then(function(res1) {
							console.log(res1);
						});
					}).catch(function(err) {
						console.log(err);
					});
				} else {
					let sql = c_sql.createSql;
					db.executeSql(sql).then(function(res1) {
						console.log("zhixing");
						console.log(res1);
					}).catch(function(err) {
						console.log("异常");
						console.log(err);
					});
				}
			}

		}
	}
</script>

<style>
	.uni-tip {
		background: #fff;
		width: 70%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		border-radius: 10px;
	}

	.uni-tip-title {
		text-align: center;
		font-size: 16px;
	}

	.uni-tip-group-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-content: center;
	}

	.uni-tip-group-button button {
		margin: 0;
	}

	.uni-tip-content {
		min-height: 60px;
	}
</style>
