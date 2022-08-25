<template>
	<view class="centre">
		<image class="bg" src="@/images/chushihua.png" mode="widthFix"></image>
		<view class="subject">
			<view class="hh">
				<view class="h1">系统初始化</view><text>Initialize</text>
			</view>
			<view class="infos">
				<label>
					<image src="../../images/dx-mendian.png" mode="widthFix"></image>
					<!-- <input /> -->
					<input placeholder="请输入门店的编码" v-model="khid" />
				</label>
				<label>
					<image src="../../images/dx-kuantai.png" mode="widthFix"></image>
					<!-- <input /> -->
					<input placeholder="请输入款台号" v-model="posid" type="number" />
				</label>
			</view>
			<view class="operate">
				<button class="btn" @click="init">初始化</button>
			</view>
		</view>

		<!-- <text>{{showmsg}}</text>>
		<p>门店：<input placeholder="请输入门店的编码" v-model="khid" /></p>
		<p>款台：<input placeholder="请输入款台号" v-model="posid" /></p>
		<button @click="init">数据初始化</button>
		<button @click="toDbqry">数据查看</button>
		<button @click="toIndex">去结算</button>
		<button @click="toPrinter">蓝牙与打印</button> -->
	</view>
</template>
<style>
	.centre {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.centre .bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.subject {
		width: 40%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		box-shadow: 0px 20rpx 40rpx 1px rgba(66, 177, 75, 0.16);
		border-radius: 40rpx;
		padding: 4% 5%;
	}

	.subject .hh {
		display: flex;
		flex-direction: column;
		font-size: 58rpx;
		color: #006B44;
	}

	.subject .hh .h1 {
		font-size: 70rpx;
		line-height: 90rpx;
		font-weight: 700;
	}

	.infos {
		margin-top: 10%;
	}

	.infos label {
		background-color: #E0EAE9;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 12rpx;
		width: 94%;
		display: flex;
		align-items: center;
		margin: 5% 0;
		padding: 0 3%;
	}

	.infos label input {
		width: 90%;
		height: 80rpx;
		line-height: 80rpx;
	}

	.infos image {
		width: 46rpx;
		height: 36rpx;
	}

	.operate {
		margin-top: 15%;
	}

	.operate .btn {
		background-color: #006B44;
		color: #fff;
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
	}
</style>

<script>
	import Req from '@/utils/request.js';
	import sqlLite from '@/utils/db/db_excute.js';
	import _create_sql from '@/utils/db/create_sql.js';
	import util from '@/utils/util.js';

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
		methods: {
			onLoad() {
				that = this;
				util.setStorage("Init_Data", {KHID:"K200QTD005",POSID:"1"});
				let Init_Data = util.getStorage("Init_Data");
				if (Init_Data && Init_Data != '{}') { //初始化过
					uni.navigateTo({
						url: "/pages/Login/Login"
					});
				} else {
					let store = util.getStorage("store");
					if (store && JSON.stringify(store) != "{}") {
						that.khid = store.KHID;
						that.posid = store.POSID;
					}
				}
			},
			toDbqry: function() {
				uni.navigateTo({
					url: "/pages/sqlitetest/sqlitetest"
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
				if (!that.khid || !that.posid) {
					util.simpleMsg("请输入门店id和款台号", "none");
					return;
				}
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
									//储存初始化门店和款台
									util.setStorage("Init_Data", {
										KHID: that.khid,
										POSID: that.posid
									});
									
									uni.navigateTo({
										url: "/pages/Login/Login"
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
							util.simpleMsg(res.msg, "none");
							console.log(JSON.stringify("start创建完成"));
						}
				)
			},
		}
	}
</script>

<style>

</style>
