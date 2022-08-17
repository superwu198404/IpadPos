<template>
	<view>
		<text>{{showmsg}}</text>>
		<p>门店：<input placeholder="请输入门店的编码" v-model="khid" /></p>
		<p>款台：<input placeholder="请输入款台号" v-model="posid" /></p>
		<button @click="init">数据初始化</button>
		<!-- <button @click="reinit">重读数据</button> -->
		<button @click="toDbqry">数据查看</button>
		<button @click="toIndex">去结算</button>
		<button @click="toPrinter">蓝牙与打印</button>
	</view>
</template>

<script>
	import Req from '@/utils/request.js';
	import sqlLite from '@/utils/db/db_excute.js';
	import _create_sql from '@/utils/db/create_sql.js';
	var mysqlite = sqlLite.get();
	var that = null;

	export default {

		data() {
			return {
				initok: false,
				errstr: "",
				tx001: null,
				khid: "K200QTD005", //'K0101QT2',//108通讯 测试使用
				posid: "1", //"8",//108通讯 测试使用
				yninit: false,
				showmsg: "门店基础数据初始化"
			}
		},
		onLoad() {
			that = this;
		},
		methods: {
			toDbqry: function() {
				uni.navigateTo({
					url: "/pages/sqlitetest/sqlitetest"
				});
			},
			toIndex: function() {
				uni.navigateTo({
					url: "/pages/index/index"
				});
			},
			toPrinter: function() {
				uni.navigateTo({
					url: "/pages/xprinter/home"
				});
			},
			startx: function() {
				//this.init();
				//第一步检查本地数据库是否存在
				var sql = " select  cvalue  from  ipadconfig where  type='KHID'";
				//console.log("开始查询")
				mysqlite.executeQry(sql, "校验本地数据库信息", (res) => {
					this.tx(res)
				}, () => {
					this.init()
				});
			},
			tx: function(res) {
				console.log("准备开始");
				let getkhid = req.getResData(res);
				console.log(getkhid);
			},
			reinit: () => {
				mysqlite.executeQry("SELECT * FROM sqlite_master WHERE type ='table'", "操作中...", res => {
					// console.log("查询的表信息：", res);
					let arr = res.msg.map(r => {
						return "drop table " + r.name;
					})
					console.log("删除sql:", arr);
					mysqlite.executeSqlArray(arr, "删除中...", res => {
						console.log("表删除成功:", res);
					}, err => {
						console.log("表删除失败:", err);
					})
				})

			},
			init: async function() {
				console.log("准备开始初始化" + that.khid);
				let apistr = "MobilePos_API.Utils.PosInit.getTx001";
				let reqdata = Req.resObj(true, "正在进行初始化001", null, apistr);
				console.log(JSON.stringify(reqdata));
				Req.asyncFunc(reqdata,
					(res) => {
						console.log("001回调成功");
						that.tx001 = Req.getResData(res);
						let reqPosData = {
							"khid": that.khid,
							"posid": that.posid
						};
						let apistr = "MobilePos_API.Utils.PosInit.reloadsqlite";
						return Req.resObj(true, "正在获取通讯数据004", reqPosData, apistr);
					},
					(res) => {
						debugger;
						let sql = [];
						console.log("004回调：", res);
						let tx004 = Req.getResData(res);
						//根据001循环创建表，并生成初始化语句
						this.tx001.forEach(function(item) {
							let arr004 = tx004.filter((item4) => {
								return item4.TABNAME == item.TABNAME
							});
							//console.log( JSON.stringify( arr004));
							let new004 = arr004.map(function(item004) {
								return item.SQLINS + item004.INSSTR
							});
							if (new004.length > 0) //存在数据说明这里有初始化的内容
							{
								sql.push("drop table  " + item.TABNAME);
							}
							sql.push(item.DDLSTR);
							sql = sql.concat(new004);
						});
						sql = sql.concat(_create_sql.TXSql); //追加数据通讯表POS_TXFILE
						return Req.resObj(true, "正在开始重建数据库", sql);
					},
					async (res) => {
							console.log("数据库重建结果：", res);
							that.tx001 = null;
							let x = await mysqlite.executeSqlArray(res.data, "开始创建数据库",
								(resks) => {
									console.log("执行语句成功" + res.data.length);
									uni.navigateTo({
										url: "/pages/sqlitetest/sqlitetest" // 传递参数 id，值为1
									});
									let reqdata = Req.retData(true, "start创建成功")
									return reqdata;
								},
								(res) => {
									that.initok = false;
									that.errstr = res;
									return Req.retData(false, "start创建失败")
								}
							);
							return x;
						},
						null,
						(res) => {
							console.log("异常结果：", res);
							that.tx001 = null;
							console.log(JSON.stringify("start创建完成"));
						}
				)
			},
		}
	}
</script>

<style>

</style>
