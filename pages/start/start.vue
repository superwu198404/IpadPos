<template>
	<view>
		<text>{{showmsg}}</text>>
		<input placeholder="请输入门店的编码" v-model="khid" />
		<button @click="init">确定</button>
		<button @click="toDbqry">调试y</button>
		<button @click="toIndex">去结算</button>
	</view>
</template>

<script>
	import Req from '@/utils/request.js';
	import sqlLite from '@/utils/db/db_excute.js';
	var mysqlite = sqlLite.get();
	var that = null;

	export default {

		data() {
			return {
				initok: false,
				errstr: "",
				tx001: null,
				khid: 'K0101QT2',
				yninit: false,
				showmsg: "正在检查是否初始化"
			}
		},
		onLoad() {
			that = this;
		},
		methods: {
			toDbqry: function() {
				uni.redirectTo({
					url: "/pages/sqlitetest/sqlitetest"
				});
			},
			toIndex: function() {
				uni.redirectTo({
					url: "/pages/index/index"
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
			init: async function() {

				console.log("准备开始初始化" + that.khid);
				let apistr = "MobilePos_API.Utils.PosInit.getTx001";
				let reqdata = Req.resObj(true, "正在进行初始化001", null, apistr);
				console.log(JSON.stringify(reqdata));
				Req.asyncFunc(reqdata,
					(res) => {
						console.log("001回调：", that.khid);
						that.tx001 = Req.getResData(res);
						let reqPosData = {
							"KHID": that.khid,
							"POSID": "8"
						};
						let apistr = "MobilePos_API.Utils.PosInit.reloadsqlite";
						return Req.resObj(true, "正在获取通讯数据004", reqPosData, apistr);
					},
					(res) => {
						let sql = [];
						console.log("开始创建数据库");
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
						return Req.resObj(true, "正在开始重建数据库", sql);
					},
					async (res) => {
							that.tx001 = null;
							let x = await mysqlite.executeSqlArray(res.data, "开始创建数据库",
								(resks) => {
									console.log("执行语句成功" + res.data.length);
									uni.redirectTo({
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
