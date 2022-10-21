<template>
	<view class="content">
		<image class="bgs" src="../../images/dl-bj.png" mode="widthFix"></image>
		<view class="login">
			<view class="h1">登录<image src="../../images/dl-bjhw.png" mode="widthFix"></image>
			</view>
			<image class="eng" src="../../images/dl-login.png" mode="widthFix"></image>
			<view class="import">
				<label>
					<image src="../../images/zhanghu.png" mode="widthFix"></image>
					<input type="text" v-model="userid" placeholder="请输入登录账号" @blur="GetKHIDS()" />
				</label>
				<label>
					<image src="../../images/dl-mima.png" mode="widthFix"></image>
					<input password="true" v-model="password" placeholder="请输入登录密码" />
				</label>
				<label>
					<image src="../../images/dl-mendian.png" mode="widthFix"></image>
					<input type="text" v-model="khid" disabled="true" />
					<!-- <picker :range="KHArr" :value="index" @change="ChooseKH">
						<view style="width: 100%;">{{KHArr[index]}}</view>
					</picker> -->
				</label>
			</view>
			<view class="logbtn">
				<button @click="Login()">登 录</button>
				<!-- <button @click="reset()" style="margin-top: 20rpx;">重新初始化</button> -->
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
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _checker from '@/utils/graceChecker.js';
	import _login from '@/api/business/login.js';
	import _init from '@/api/business/init.js';
	import Vue from 'vue'
	import {
		global
	} from '@/models/PaymentAll/models.js';
	var that;
	export default {
		data() {
			return {
				userid: "",
				password: "",
				khid: "",
				posid: "",
				KHArr: [],
				index: 0,
				store: util.getStorage("store")
			}
		},
		methods: {
			onLoad: function() {
				//console.log("[Login-onLoad]加载触发!");
				that = this;
				let Init_Data = util.getStorage("Init_Data");
				if (Init_Data && Init_Data != '{}') { //赋值初始化的门店和款台
					that.khid = Init_Data.KHID;
					that.posid = Init_Data.POSID;
				}
				//初始化支付方式和全局配置参数
				console.log("[Login-onLoad]初始化基本数据!");
				_init.InitData(that.khid);
				//测试数据：
				//let sql =
				//"select * FROM cxformd001 where bill='FZCX2210170002' and KHID = 'K200QTD005' AND Yn_Jslb = 'F'";
				//sql = [
				//"delete from SYSYWTEMP002 WHERE YWTYPE = 'QTBS'  AND  bill = 'K200QTD0051221021180118'",
				//"delete from SYSYWTEMP001 WHERE YWTYPE = 'QTBS'  AND  bill = 'K200QTD0051221021180118'",
				// let sql =
				// 	"insert into SYSYWTEMP002 (CLTIME,STATUS,NUM6,NUM5,NUM4,NUM3,NUM2,NUM1,STR7,STR6,STR5,STR4,STR3,STR2,STR1,NOTE2,NOTE1,QTY3,QTY2,QTY1,PRICE,BQTY,PACK,SPID,YWTYPE,BILL,NOTEERR) values(null,null,0,0,0,0,0,30,null,null,竹节排包(原味),null,null,损坏,外卖报损,null,null,0,0,0,30,1,0,000000001010100004,QTBS,K200QTD0051221021180118,null)insert into SYSYWTEMP002 (CLTIME,STATUS,NUM6,NUM5,NUM4,NUM3,NUM2,NUM1,STR7,STR6,STR5,STR4,STR3,STR2,STR1,NOTE2,NOTE1,QTY3,QTY2,QTY1,PRICE,BQTY,PACK,SPID,YWTYPE,BILL,NOTEERR) values(null,null,\"0\",\"0\",\"0\",\"0\",\"0\",\"5\",null,null,\"告白5号\",null,null,\"损坏\",\"外卖报损\",null,null,\"0\",\"0\",\"0\",\"5\",\"1\",\"0\",\"000000001090100003\",\"QTBS\",\"K200QTD0051221021180118\",null)";
				//"insert into SYSYWTEMP001 (KHID,POSID,GSID,BMID,YWTYPE,BILL,RYID,RYNAME,WDATE,WTIME,STR1,STR2,STR3,STR4,STR5,STR6,STR7,NOTE1,NOTE2,STATUS,TO_BMID,TO_KHID) values('K200QTD005','1','K200','','QTBS','K200QTD0051221021180118','999','门店测试1','2022-10-21','2022-10-21 18:01:19','','','','','','','','','','0','','')",
				//"UPDATE  SYSYWTEMP001 SET STATUS= '0' WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051221021180118'",
				//"UPDATE  SYSYWTEMP002 SET STATUS= '0' WHERE YWTYPE = 'QTBS' AND  BILL = 'K200QTD0051221021180118'"
				//]
				// db.get().executeDml(sql, "", res => {
				// 	console.log("执行结果：", res);
				// }, err => {
				// 	console.log("查询错误：", err);
				// })
			},
			GetKHIDS: function() {
				if (that.khid) {
					return;
				}
				if (!that.userid) {
					util.simpleMsg("请输入账号", true);
					return;
				}
				_login.GetKHIDByRYID(that.userid, r => {
					if (r.code && r.msg.length > 0) {
						let arr = r.msg.map((rr) => {
							return rr.KHID;
						});
						that.KHArr = arr;
						that.khid = that.KHArr[0]; //赋默认值
						console.log("客户信息序列化集合：", arr);

					} else {
						that.KHArr = [];
						that.khid = "";
						util.simpleMsg("未匹配到门店", true);
					}
				})
			},
			//客户选择事件
			ChooseKH: function(e) {
				that.index = e.detail.value;
				that.khid = that.KHArr[that.index];
				// console.log("选择事件：", e.detail.value);
				// console.log("选择事件1：", that.index);
			},
			Login: function() {
				if (!that.userid || !that.password) {
					util.simpleMsg("请输入账号密码", true);
					return;
				}
				_login.GetPassWord(that.khid, that.userid, that.password, res => {
					console.log("[Login]登录成功:", res);
					util.simpleMsg("登录成功");
					//初始化门店信息
					_login.InitStore(that.khid, that.posid, res.data, r => {
						setTimeout(r => {
							// if (that.store.OPENFLAG == "1") {
							// 	uni.redirectTo({
							// 		url: "../mainSale/MainSale"
							// 	})
							// } else {
							// 	uni.redirectTo({
							// 		url: "/pages/Center/Center"
							// 	})
							// }
							uni.redirectTo({
								url: "/pages/Center/Center"
							})
						}, 1000);
					});
				})
			},
			reset: function() {
				uni.redirectTo({
					url: "/pages/start/start"
				})
			},
			Admin: function() {
				uni.showModal({
					editable: true,
					content: "请输入管理密码",
					// placeholderText: "测试密码：999",
					success: function(res) {
						console.log("确认信息:", res);
						if (res.confirm) {
							if (res.content == "999") {
								let store = util.getStorage("store");
								store.GSID = "K200"; //027001
								store.KHID = "K200QTD005"; //"K0101QT2",
								store.POSID = "1";
								store.KCDID = "D005";
								store.DPID = "11072"; // 11072
								store.DKFID = '80000000';
								store.DKFNAME = '默认大客户';
								store.BMID = ""; //对应program.xsbm pos 这个参数为空字符串
								store.GCID = "K201";
								store.DQID = 'K01000'; //地区ID（销售地区）
								store.NAME = "武汉xxx哈吉卡号就开始";
								store.MERID = "999990053990001";
								store.deviceno = "13001001";
								store.KHAddress = "湖北省武汉市江汉区青年路与后襄河北路交汇处海马公园";
								store.POSCSZID = "001";
								store.RYID = "10086";
								store.PWD = "123";
								store.RYNAME = "老王";
								store.RYTYPE = "SYSTEM";
								store.KHZID = "03";
								store.PHONE = 18171372662;
								store.JGID = "K200";
								store.STIME = "7";
								store.ETIME = "19";
								// OPENFLAG: 0, //签到状态
								console.log("管理登录的门店信息：", store);
								util.setStorage("store", store);

								//全局混入
								console.log("全局混入客户端信息！");
								Vue.mixin(global)
								// if (store.OPENFLAG == "1") {
								// 	uni.redirectTo({
								// 		url: "../index/index"
								// 	})
								// } else {
								uni.redirectTo({
									url: "../Center/Center"
								})
								// }
							} else {
								util.simpleMsg("密码错误", true);
							}
						}
					}
				})
			}
		}
	}
</script>

<style>
	uni-page-body,
	uni-page-refresh,
	page {
		background-color: #FBF9FF;
		color: #333;
		height: 100%;
	}

	.content {
		width: 100%;
		height: 95%;
		padding-top: 44rpx;
		position: relative;
	}

	.content .bgs {
		position: absolute;
		top: 88rpx;
		right: 3%;
		width: 74%;
	}

	.login {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 12%;
		z-index: 99;
		background-color: #FBF9FF;
		border-radius: 20rpx;
		width: 50%;
		box-shadow: 0px 10px 60px 1px rgba(66, 177, 75, 0.15);
	}

	.login .h1 {
		width: 90%;
		position: relative;
		padding-top: 120rpx;
		padding-left: 10%;
		font-size: 80rpx;
	}

	.login .h1 image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.login .eng {
		width: 200rpx;
		margin-left: 10%;
		margin-top: 30rpx;
	}

	.import {
		padding: 6% 10%;
	}

	.import label {
		display: block;
		width: 94%;
		height: 80rpx;
		background-color: #F5F4F8;
		border: 1px solid #C5E7C8;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		padding: 0 2%;
		margin-bottom: 8%;
	}

	.import label image {
		width: 40rpx;
	}

	.import label input {
		height: 100%;
		margin-left: 10rpx;
		width: 80%;
	}

	.logbtn {
		padding: 0 10% 10%;
	}

	.logbtn button {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background-color: #006B44;
		border-radius: 10rpx;
		color: #fff;
		font-size: 32rpx;
	}
</style>
