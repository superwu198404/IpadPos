<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="centre">
		<image class="bg" src="../../images/chushihua.png" mode="widthFix"></image>
		<Head :_showSale="true" :_ynMsg='false' :type="'ywbhqh'"></Head>
		<view class="tranlist">
			<view class="leftlist">
				<view class="logos">
					<image src="../../images/imgbh/peis@1x.png" mode="widthFix"></image>
					<view class="xingqi">
						<view>要货配送</view>
						<view>DISTRIBUTION</view>
					</view>
				</view>
				<view class="sginout-qd">
					<view class="left">
						<view @click="ToSale('/pages/mainSale/MainSale')">
							<view class="label">裱花主动入库</view>
							<image class="img" src="../../images/imgbh/jt_sx@1x.png" mode="widthFix"></image>
						</view>
						<view class="base-line"></view>
						<view @click="ToSale('/pages/mainSale/MainSale')">
							<view class="label">裱花主动配送</view>
							<image class="img" src="../../images/imgbh/jt_sx@1x.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="right" @click="ToTakeout()">
						<image class="datebg gaip_bj" src="../../images/imgbh/gaip_bj@1x.png" mode="widthFix"></image>
						<image class="tubiao" src="../../images/imgbh/gaip@1x.png" mode="widthFix"></image>
						<label>改胚</label><text>CHANGE</text>
					</view>
				</view>
				<view class="dates">
					<image class="datebg" src="../../images/imgbh/hwen@1x.png" mode="widthFix"></image>
					<view class="sginout sginout-bh">
						<view @click="Chaxun(1)">
							<image class="tubiao" src="../../images/imgbh/cx@1x.png" mode="widthFix"></image>
							<label>查询</label><text>INQUIRY</text>
						</view>
						<view class="line"></view>
						<view @click="reset()">
							<image class="tubiao" src="../../images/imgbh/cd@1x.png" mode="widthFix"></image>
							<label>重读</label><text>REREAD</text>
						</view>
						<view class="line"></view>
						<view @click="zbtx()">
							<image class="tubiao" src="../../images/imgbh/txl@1x.png" mode="widthFix"></image>
							<label>通讯</label><text>MESSAGE</text>
						</view>
					</view>
				</view>
			</view>
			<view class="rightlist">
				<view class="market">
					<view class="prods">
						<view class="div">
							<image src="../../images/imgbh/bhuaa@1x.jpg" mode="heightFix"></image>
						</view>
					</view>
					<view class="dates dates-bh">
						<view @click="ToSale('/pages/YWBHQH/YWBHQH')">
							<label><text>要货生产</text><text>PRODUCTION</text></label>
							<image src="../../images/imgbh/jt_sx@1x.png" mode="widthFix"></image>
						</view>
						<!-- <view @click="ToSale('/pages/mainSale/MainSale')">
							<label><text>销售</text><text>SALES</text></label>
						</view>
						<view style="border-left: 1rpx solid #C1F6D8;"
							@click="ToSale('/pages/KQSale/CardCouponMain/Menu')">
							<label><text>卡券业务</text><text>CARD</text></label>
						</view> -->
					</view>
				</view>
				<view class="chongdu">
					<view class="dates">
						<!-- 	<button @click="reset()">重读基础数据 <text>REREAD</text></button>
						<button @click="zbtx()">通讯 <text>MESSAGE</text></button> -->
						<button @click="Sign()"><label>签到</label><text>SIGN IN</text></button>
						<view class="line"></view>
						<button @click="SignOut()"><label>签退</label><text>CHECK OUT</text></button>
					</view>
					<view class="tuichu" @click="ToOut()">
						<image src="../../images/logout.png" mode="widthFix"></image>
						退出
					</view>
				</view>

			</view>
		</view>
		<view class="banbenhao">系统版本号：{{version}}</view>
		<!-- 签到组件 -->
		<!-- <qiandao @CloseSign="CloseSignIn" v-show="showSign"></qiandao> -->
		<!-- 日结组件 -->
		<rijie @CloseRJ="CloseSignOut" v-show="showSignOut" :_signOutDate="signOutDate"></rijie>
		<!-- //用于预先加载图片使用 -->
		<!-- <view v-show="false">
			<image :src="item.IMGURL" v-for="(item,index) in IMAGES" mode="widthFix"></image>
		</view> -->
	</view>
</template>

<script>
	var app = getApp();
	import Head from '@/pages/Home/Component/BHHead.vue';
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _login from '@/api/business/login.js';
	import _init from '@/api/business/init.js';
	import _cake from '@/api/business/CakeYD.js';
	import _sysParam from '@/utils/sysParm/sysParm.js';
	import _query_sale from '@/api/business/query_sale.js';

	import tiktok from '@/api/business/tiktok.js';
	var that;
	export default {
		components: {
			Head
		},
		data() {
			return {
				showSign: false,
				showSignOut: false,
				signOutDate: [],
				signOutDates: [],
				curWeek: dateformat.getWeekDate(),
				curDate: dateformat.getYMD(),
				timer: null,
				angle: 0,
				angles: 0,
				angless: 0,
				syyjk: {}, //收银员是否结款
				version: "1.0.0", //版本号
				IMAGES: []
			};
		},
		methods: {
			onLoad: async function() {
				that = this;
				that.GetSignOutInWeeks();
				// that.GetSkyJk();
				let sysinfo = util.getStorage("sysinfo");
				if (sysinfo) {
					that.version = sysinfo.appWgtVersion;
				}

				//预先加载蛋糕图片
				// _cake.PreLoadCakeImg(res => {
				// 	console.log("图片数据：", res);
				// 	that.IMAGES = res.msg;
				// });
			},
			onShow: function() {
				this.GetUserMenu(); //用户菜单数据
				// this.MonitorEvent();
				// this.timer = setInterval(() => {
				// 	this.timer = setTimeout(() => {
				// 		if (this.angle == 0) {
				// 			this.angle = 180;
				// 		} else if (this.angle == 180) {
				// 			this.angle = 0;
				// 		}
				// 	}, 4000);
				// 	this.timers = setTimeout(() => {
				// 		if (this.angles == 0) {
				// 			this.angles = 180;
				// 		} else if (this.angles == 180) {
				// 			this.angles = 0;
				// 		}
				// 	}, 4500);
				// 	this.timerss = setTimeout(() => {
				// 		if (this.angless == 0) {
				// 			this.angless = 180;
				// 		} else if (this.angless == 180) {
				// 			this.angless = 0;
				// 		}
				// 	}, 5000);
				// }, 5500);

			},
			reset: function() {
				_init.dataInit('reloadsqlite', true)
			},
			zbtx: function() {
				_init.dataInit('download_zbtx', true)
			},
			//uniapp中onHide()能监听到页面离开
			onHide() { //离开页面前清除计时器
				// console.log('onHide');
				clearInterval(this.timer);
				this.timer = null;
			},
			TimedCommunication: function() {
				//3min执行一次销售单传输 从终端参数获取
				let sysParam = util.getStorage("sysParam");
				let min = sysParam.TXSJJG || 3;
				let int = setInterval(() => {
					common.TransLiteData();
				}, 1000 * 60 * min);
				getApp().globalData.Int = int;
				console.log("本次单据传输定时ID:", int);
			},
			MonitorEvent: function() {
				console.log("[MonitorEvent-Center]事件监听开始...");
				uni.$off('stop-timed-communication');
				uni.$on('stop-timed-communication', util.callBind(this, function() { //停止消息轮询
					let timer = getApp().globalData.Int;
					console.log("[MonitorEvent-Center]通讯轮询停止!", timer);
					clearInterval(timer);
					getApp().globalData.Int = 0;
				}));
				console.log("[MonitorEvent-Center]通讯轮询停止事件监听开始...");
				uni.$off('continue-timed-communication');
				uni.$on('continue-timed-communication', util.callBind(this, function() { //继续消息轮询
					if (!getApp().globalData.Int) {
						console.log("[MonitorEvent-Center]通讯轮询继续!");
						this.TimedCommunication();
					} else {
						console.log("[MonitorEvent-Center]通讯轮询正在运行!", getApp().globalData.Int);
					}
				}));
				console.log("[MonitorEvent-Center]通讯轮询继续事件监听开始...");
			},
			ToTakeout: async function() {
				let store = util.getStorage("store"),
					take_away = null;
				//初始化系统参数 (防止重读后失效的)
				await _sysParam.init(store.KHID);
				if (store.OPENFLAG != 1) {
					util.simpleMsg("请先进行签到", true);
					return;
				}
				uni.$off("exists-takeaway");
				uni.navigateTo({
					url: "/pages/TakeAway/TakeAway",
					events: {
						get_take_away(data) {
							take_away = data;
							take_away.exit_btn = true;
						}
					}
				})
			},
			//跳转到销售页面
			ToSale: async function(e, not) {
				// if (not) {
				// 	util.simpleMsg("功能暂未开放！", true);
				// 	return;
				// }
				let store = util.getStorage("store");
				//初始化系统参数 (防止重读后失效的)
				await _sysParam.init(store.KHID);
				if (store.OPENFLAG != 1) {
					util.simpleMsg("请先进行签到", true);
					return;
				}
				// let int = getApp().globalData.Int;
				// console.log("传输定时ID:", int);
				// if (!int) { //销售单定时传输
				// 	this.TimedCommunication();
				// }
				store.LOGINDATE = dateformat.getYMD();
				util.setStorage("store", store); //缓存当天日期 用于在销售页判断是否为当天业务操作
				let sysParam = util.getStorage("sysParam");
				console.log("是否结款判断参数：", sysParam.YN_JKXS);
				if (sysParam.YN_JKXS != "Y") { //是否要结款判断
					if (that.signOutDates.length > 0) { //有日结数据
						that.SignOut(); //发起日结
						return;
					}
					uni.redirectTo({
						url: e,
						complete: res => {
							console.log("跳转结果", res);
						}
					});
					return;
				}
				_login.GetSkyJk(res => {
					console.log("查询到的结款数据：", res);
					if (!res.code) { //有未结款数据
						util.simpleMsg(res.msg, "none");
						return;
					}
					if (that.signOutDates.length > 0) { //有日结数据
						that.SignOut(); //发起日结
						return;
					}
					uni.redirectTo({
						url: e,
						complete: res => {
							console.log("跳转结果", res);
						}
					});
				})
			},
			//手动直接发起签到
			Sign: function() {
				// that.showSign = true;
				util.simpleModal("提示", "是否确认签到？", res => {
					if (res) {
						let date = dateformat.getYMD(); //可不传，主要为了兼容后台接口字段判断的问题
						_login.SignOrSignOut(true, date, res => {
							console.log("手动签到结果：", res);
							if (res.code) {
								let data = JSON.parse(res.data);
								if (data.sql) {
									_login.SignOrSignOutSql(data.sql, store => {
										console.log("签到结果回调：", store);
										if (store.OPENFLAG == 1) {
											util.simpleMsg("签到成功！");
										} else {
											util.simpleMsg("签到失败！", true);
										}
									});
								} else {
									util.simpleMsg("签到失败：签到数据异常！", "none");
								}
							} else {
								util.simpleModal("提示", res.msg);
							}
						})
					}
				})
			},
			//签退
			SignOut: function() {
				_login.CheckSignOut(res => {
					console.log("日结校验结果：", res);
					if (!res.code) {
						util.simpleMsg(res.msg, true);
						if (res.data && res.data.length > 0) { //有未日结的数据
							that.showSignOut = true;
							that.signOutDate = JSON.parse(res.data);
						}
						return;
					}
					//今日日结
					that.ConfirmRJ();
				})
				// console.log("将要签退的数据：", that.signOutDates);
				// if (that.signOutDates.length > 0) { //历史日结
				// 	that.showSignOut = true;
				// 	that.signOutDate = that.signOutDates;
				// } else { //今日日结
				// 	that.ConfirmRJ();
				// }
			},
			//获取一周内是否有未日结的数据 
			GetSignOutInWeek: function(func) {
				_login.GetSignOutInWeek(res => {
					console.log("是否有日结数据：", res);
					if (res.code) {
						if (t) { //主动触发
							that.showSignOut = true;
							that.signOutDate = JSON.parse(res.data);
						} else { //自动触发
							uni.showModal({
								title: "提示",
								content: res.msg,
								showCancel: false,
								success: e => {
									if (e.confirm) {
										console.log("点击了确定");
										that.showSignOut = true;
										that.signOutDate = JSON.parse(res.data);
									}
								}
							})
						}
					} else {
						if (t) {
							util.simpleMsg("暂无日结数据", true);
						}
					}
				})
			},
			//获取一周内是否有未日结的数据 初始化获取
			GetSignOutInWeeks: function(t, func) {
				_login.GetSignOutInWeek(res => {
					console.log("查询到的日结数据：", res);
					if (res.code) {
						that.signOutDates = JSON.parse(res.data);
					} else {
						that.signOutDates = []
					}
					// that.signOutDates = ["2022/9/8", "2022/9/7"];
				})
			},
			//收款员结款的结果
			GetSkyJk: function(t, func) {
				_login.GetSkyJk(res => {
					console.log("查询到的结款数据：", res);
					that.syyjk = res;
				})
			},
			//被通知关闭日结组件
			CloseSignOut: function(res) {
				console.log("父组件被通知事件");
				that.GetSignOutInWeeks(); //重新校验下是否有日结数据
				that.showSignOut = false;
			},
			//今日日结
			ConfirmRJ: e => {
				util.simpleModal("提示", "是否进行今日日结？", res => {
					if (res) {
						let qtdate = dateformat.getYMD();
						if (qtdate) {
							_login.SignOrSignOut(false, qtdate, res => {
								console.log("日结结果：", res);
								if (res.code) {
									util.simpleMsg("日结成功！");
									let data = JSON.parse(res.data);
									if (data.sql) {
										_login.SignOrSignOutSql(data.sql);
									}
								} else {
									util.simpleModal("提示", res.msg);
								}
							})
						} else {
							util.simpleMsg("日结日期为空", true);
						}
					}
				})
			},
			//退出
			ToOut: function() {
				util.simpleModal("提示", "是否确认退出应用？", e => {
					if (e) { //点击了确定
						util.removeStorage("hyinfo"); //清除会员信息
						if (uni.getSystemInfoSync().platform == 'ios') {
							plus.ios.import("UIApplication").sharedApplication()
								.performSelector("exit")
						} else if (uni.getSystemInfoSync().platform == 'android') {
							plus.runtime.quit();
						}
					}
				})
			},
			//门店查询
			Chaxun: function(e) {
				if (e) {
					util.simpleMsg("功能暂未开放！", true);
					return;
				}
				uni.redirectTo({
					url: "/pages/Querypage/QueryCenter/QueryCenter",
					complete: res => {
						console.log('跳转结果', res);
					}
				});
			},
			//初始化
			DataInit: function(e) {
				_init.dataInit(e);
			},
			//用户菜单
			GetUserMenu: function() {
				let store = util.getStorage("store");
				if (store && store.RYID)
					_query_sale.GetUserMenu({
						ryid: store.RYID
					}, res => {
						console.log("用户菜单数据查询结果：", res);
						let menuArr;
						if (res.code) {
							let data = JSON.parse(res.data);
							let M1 = data.menu1.map(r => {
								return {
									MenuName: r.MENUNAME,
									MenuId: r.MENUID
								}
							})
							let M2 = [];
							data.menu2.map(r => {
								let obj = M2.find(r1 => {
									return r1.MenuName == r.NOTE
								});
								if (!obj) {
									M2.push({
										MenuName: r.NOTE,
										MenuId: "_" + r.NOTE,
										F_MenuId: r.F_MENUID
									})
								}
							})
							console.log("二级分组：", M2);

							let M3 = data.menu2.map(r => {
								return {
									MenuName: r.MENUNAME,
									MenuId: r.MENUID,
									F_MenuId: "_" + r.NOTE
								}
							})
							console.log("三级分组：", M3);

							M2.map(r => {
								r.Third = M3.filter(r1 => {
									return r1.F_MenuId == r.MenuId;
								})
							})
							M1.map(r => {
								r.Second = M2.filter(r1 => {
									return r1.F_MenuId == r.MenuId;
								})
							})
							console.log("组装好的菜单数据：", M1);
							menuArr = M1;
							util.setStorage("MDMENU", menuArr);
						} else {
							util.removeStorage("MDMENU")
						}
					})
			}
		},
	}
</script>

<style scoped>
	page-body,
	page-refresh,
	page {
		height: 100%;
	}

	.banbenhao {
		position: fixed;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #999;
		padding: 0 3%;
		font-weight: 600;
	}

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

	.tranlist {
		position: relative;
		z-index: 99;
		width: 80%;
		height: 78%;
		padding: 6% 10%;
		display: flex;
	}

	.leftlist {
		width: 49%;
		margin-right: 3%;
	}

	.leftlist .logos {
		width: 100%;
		height: 240rpx;
		position: relative;
		overflow: hidden;
		border-radius: 30rpx;
	}

	.leftlist .logos .xingqi {
		position: absolute;
		top: 76rpx;
		left: 6%;
		z-index: 9;
		font-size: 40rpx;
		color: #fff;
	}

	.leftlist .logos .xingqi view {
		font-weight: 700;
		margin-right: 30rpx;
	}

	.leftlist .logos .xingqi>view:nth-child(2) {
		font-weight: 400;
		margin-right: 30rpx;
	}

	.leftlist .logos image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.leftlist .sginout {
		display: flex;
		margin: 60rpx 0;
		height: 260rpx;
	}

	.leftlist .sginout view {
		width: 45%;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);
		display: flex;
		flex-direction: column;
		color: #006B44;
		height: 80%;
		justify-content: center;
		align-items: flex-start;
	}

	.leftlist .sginout view label {
		font-size: 40rpx;
		font-weight: 700;
		margin-bottom: 10rpx;
	}

	.leftlist .sginout view text,
	.leftlist .sginout view label {
		display: block;
		padding-left: 12%;
		white-space: nowrap;
	}

	.leftlist .sginout view:nth-child(1) {
		margin-right: 10%;
	}

	.leftlist .sginout-bh {
		display: flex;
		justify-content: space-between;
	}

	.leftlist .sginout-bh view {
		/* width: 25%; */
	}

	.leftlist .sginout-bh view:nth-child(1) {
		margin-right: 0%;
	}

	.leftlist .sginout-bh .line {
		width: 1rpx;
		height: 25%;
		background: #006B44;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		opacity: 0.2;
	}

	.leftlist .sginout-qd {
		display: flex;
		justify-content: space-between;
		margin: 60rpx 0;
	}

	.leftlist .sginout-qd .left {
		width: 62%;
		height: 444rpx;
		background: #FFFFFF;
		padding: 82rpx 6%;
		box-sizing: border-box;
		box-shadow: 10px 20px 99px 0px rgba(0, 107, 68, 0.102);
		border-radius: 30px 30px 30px 30px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.leftlist .sginout-qd .base-line {
		width: 100%;
		height: 2px;
		background: rgba(0, 107, 68, 0.2);
		border-radius: 30px 30px 30px 30px;
	}

	.leftlist .sginout-qd .left image {
		width: 44rpx !important;
		height: 44rpx !important;
	}

	.leftlist .sginout-qd .left>view {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.leftlist .sginout-qd .left .label {
		display: flex;
		flex-direction: column;
		color: #006B44;
		font-size: 40rpx;
		font-weight: 700;
	}

	.leftlist .sginout-qd .right {
		position: relative;
		width: 32%;

		height: 444rpx;
		/* background: linear-gradient( 180deg, #E5FFE7 0%, rgba(229,255,231,0) 100%); */
		border-radius: 30px 30px 30px 30px;

		display: flex;
		flex-direction: column;
		padding: 12% 6%;
		box-sizing: border-box;
	}

	.right .gaip_bj {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100% !important;
		height: 100% !important;
	}

	.leftlist .sginout-qd .right image {
		width: 44rpx;
		height: 44rpx;
	}

	.leftlist .sginout-qd .right label {
		display: flex;
		flex-direction: column;
		color: #006B44;
		font-size: 40rpx;
		font-weight: 700;
		margin: 10rpx 0;
	}

	.leftlist .sginout-qd .right text {
		font-weight: 400;
		font-size: 34rpx;
		color: #006B44;
	}


	.dates {
		width: 100%;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);
		position: relative;
		padding: 0;
		height: 312rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.dates-bh image {
		width: 44rpx !important;
		height: 44rpx !important;
	}

	.dates .datebg {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.dates view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 15%;
		width: 70%;
	}

	.dates label {
		display: flex;
		flex-direction: column;
		color: #006B44;
		font-size: 40rpx;
		font-weight: 700;
	}

	.dates label text:nth-child(2) {
		font-weight: 400;
		font-size: 34rpx;
		margin-top: 20rpx;
	}

	.dates view image {
		width: 140rpx;
		height: 140rpx;
	}

	.dates .sginout {
		width: 90%;
		position: relative;
		z-index: 9;
		padding: 0 5%;
	}

	.dates .sginout view {
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		box-shadow: none;

		position: relative;
		top: 2rpx;
	}

	.dates .sginout view .tubiao {
		width: 44rpx;
		height: 44rpx;
		margin-left: 12%;
		margin-bottom: 10rpx;
	}

	.rightlist {
		width: 48%;
	}

	.rightlist .market {
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);
		height: 800rpx;
	}

	.rightlist .market .prods {
		display: flex;
		padding: 1% 1% 0;
	}

	.rightlist .market .prods view {
		border-radius: 30rpx;
		height: 540rpx;
		overflow: hidden;
		position: relative;
	}

	.rightlist .market .prods view image {
		width: 100% !important;

	}

	.rightlist .market .prods .div:nth-child(1) {
		width: 100%;
	}


	.market .dates {
		padding: 0;
		box-shadow: none;
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		height: 33%;
	}

	.rightlist .dates view {
		padding: 0 6%;
		width: 88%;
	}

	.rightlist .dates view image {
		width: 100rpx;
	}

	.chongdu {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 60rpx;
	}

	.chongdu .dates {
		width: 70%;
		margin-right: 5%;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);
		padding: 0 6%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 256rpx;
	}

	.rightlist .chongdu .line {
		width: 1rpx;
		height: 25%;
		background: #006B44;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		opacity: 0.2;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		box-shadow: none;
	}

	.chongdu .dates button {
		margin: 0;
		background-color: #fff;
		color: #006B44;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		font-weight: 700;
		line-height: 70rpx;
		padding: 0;
	}

	.chongdu .dates button:nth-child(1) {
		/* border-right: 1px solid #C1F6D8; */
		/* width: 52%; */
	}

	.chongdu .dates button:nth-child(2) {
		/* width: 45%; */
		padding-left: 2%;
	}

	.chongdu .dates button text {
		font-weight: 400;
		line-height: 50rpx;
	}

	.chongdu .tuichu {
		width: 25%;
		background-color: #006B44;
		border-radius: 20rpx;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 0;
		height: 256rpx;
	}

	.chongdu .tuichu image {
		width: 70%;
	}

	.tuichu {

		padding: 60rpx 0;

		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);

	}

	.prods {

		perspective: 400px;

	}

	.div {
		width: 100;
		height: 450px;
		margin: 0 auto;
		position: relative;
	}

	.div image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		transition: all 1s;
	}

	.div image:first-child {

		z-index: 1;

		/*不对向屏幕就隐藏*/

		backface-visibility: hidden;

	}

	page {
		overflow: hidden;
	}

	.sale-card-coupon {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		overflow: hidden;
		border-radius: 20rpx;
		height: 256rpx;
		margin-right: 50rpx;
		width: 25%;
	}

	.sale-card-coupon>* {
		flex: 1;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #006B44;
		font-size: 34rpx;
		border-radius: 20rpx;
		font-weight: 700;
	}
</style>