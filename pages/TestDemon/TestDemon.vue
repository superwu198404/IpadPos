<template>
	<view class="container">
		<button type="default" @click="openSqllite">开启数据库</button>
		<button type="default" @click="closeSqllite">关闭数据库</button>
		<button type="default" @click="createTable">创建table</button>
		<button type="default" @click="addData">添加数据</button>
		<button type="default" @click="getData">查询数据</button>

		状态：{{ status }}
	</view>
</template>

<script>
	import Req from '@/utils/request.js';
	import sqlLite from '@/utils/db/db_excute.js';
	import hy_model from '@/class/hy_model.js';
	import common from '@/utils/util.js';
	import pay from '@/api/Pay/AliPay.js';
	import db from '@/utils/db/db_excute.js';

	export default {
		data() {
			return {
				status: ""
			}
		},

		onLoad: function() {
			
			let obj = {
				subject: "商品销售",
				out_trade_no: "K12345678912345678902",
				// out_trade_no: "K12345678912345678907",
				total_money: "1",
				money: "1",
				auth_code: "132716010020176325",
				// auth_code: "285142260393078668",
				store_id: "K0101QTDS1",
				store_name: "武汉xxx",
				merchant_no: "999990053990001",
				product_info: [{
					spid: "21313131",
					name: "苹果",
					price: "1",
					num: "1"
				}]
			}
			// pay.CardPayment().PaymentAll(obj, function(res) {
			// 	console.log("支付结果：", res);
			// 	uni.showToast({
			// 		title: "支付成功"
			// 	})
			// })
			// pay.WxPayment().Payment(obj, function(res) {
			// 	console.log("支付结果", res);
			// });
			// pay.AliPayment().PaymentAll(obj, function(res) {
			// 	console.log("支付结果：", res);
			// 	uni.showToast({
			// 		title: "支付成功"
			// 	})
			// })
			// pay.AliPayment().Payment(obj, function(res) {
			// 	console.log("支付结果", res);
			// });
			// let str = rsa.rsaEncrypt(JSON.stringify(arr));
			// console.log("加密测试：", str);
			// console.log("解密测试：", rsa.rsaDecrypt(str));
			// console.log("排序：", common.objKeySort(arr));
			// Req.asyncFunc({
			// 	http: true,
			// 	url: "/WxPay/AliPay",
			// 	title: "请稍等...",
			// 	data: {
			// 		out_trade_no: "",
			// 		auth_code: "",
			// 		subject: "测试测试",
			// 		total_amount: 0.01
			// 	}
			// }, function(res) {
			// 	console.log("请求一：");

			// });
			// var a=new hy_model.hyObj('13597696131',"夏末")
			// let res=a.GetHyInfo("好厉害");
			// console.log(res);
			// debugger;
			//会员信息查询调用接口
			// hybase.Query_Member_Assets("15527956801", "Mobile", function(res) {
			// 	console.log(res);
			// })
			// return;
			//简单多层机构 适用于不依赖上层请求结果的请求集
			// Req.Post(["Values/GetData", "Values/PutData", "Values/DelData"], [{
			// 	age: 10,
			// 	name: "小明"
			// }, {
			// 	age: 30,
			// 	name: "小王"
			// }, {
			// 	age: 40,
			// 	name: "小李"
			// }], ["加载一", "加载二", "加载三"], {}, function(res) {
			// 	//debugger;
			// 	console.log("测试结果：" + res);
			// });
			return;
			//请求示例 （需要依赖上层请求的结果的）
			// Req.http("Values/GetData", {
			// 	age: 10,
			// 	name: "小明"
			// }, "请求一").then((res) => {
			// 	console.log(res);
			// 	return Req.http("Values/PutData", {
			// 		age: 20,
			// 		name: "小王"
			// 	}, "请求二")
			// }).then((res) => {
			// 	console.log(res);
			// 	return Req.http("Values/DelData", {
			// 		age: 30,
			// 		name: "小李"
			// 	}, "请求三")
			// }).then((res) => {
			// 	console.log(res);
			// })
		},
		methods: {

			// 开启数据库
			openSqllite() {
				if (sqlLite.isOpen()) {
					this.status = '开启成功!'
				} else {
					// 开启数据库
					sqlLite.openSqllite()
						.then((e) => this.status = '开启成功!')
						.catch((e) => this.status = '开启失败!')
				}
			},
			// 关闭数据库
			closeSqllite() {
				if (sqlLite.isOpen()) {
					// 关闭数据库
					sqlLite.closeSqllite()
						.then((e) => this.status = '关闭成功!')
						.catch((e) => this.status = '关闭失败!')
				} else {
					this.status = '关闭成功!'
				}
			},
			// 创建数据库 (index, name, age)
			createTable() {
				sqlLite.executeSql(
						'create table if not exists userInfo ( "index" INTEGER PRIMARY KEY AUTOINCREMENT,"name" TEXT,"age" TEXT)'
					).then((e) => this.status = '创建成功!')
					.catch((e) => this.status = '创建失败!')
			},
			// 添加数据
			addData() {
				var name = "demo"
				var age = "23"
				sqlLite.executeSql(
						'insert into userInfo (name, age) values ("' + name + '","' + age + '")'
					).then((e) => this.status = '添加成功!')
					.catch((e) => this.status = '添加失败!')
			},
			// 查询数据
			getData() {
				var tableName = 'userInfo'
				sqlLite.selectSql(
						'select * from ' + tableName + ''
					).then((date) => this.status = date)
					.catch((e) => this.status = '查询失败!')
			}
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
