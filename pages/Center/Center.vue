<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="centre">
		<image class="bg" src="@/images/chushihua.png" mode="widthFix"></image>
		<view class="tranlist">
			<view class="leftlist">
				<view class="logos">
					<image src="@/images/hello-card.png" mode="widthFix"></image>
				</view>
				<view class="sginout">
					<view @click="Sign()"><label>签到</label><text>SIGN IN</text></view>
					<view @click="SignOut()"><label>签退</label><text>CHECK OUT</text></view>
				</view>
				<view class="dates">
					<image class="datebg" src="@/images/quan-bg.png" mode="widthFix"></image>
					<view>
						<label><text>{{curWeek}}</text><text>{{curDate}}</text></label>
						<image src="@/images/day-icon.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="rightlist">
				<view class="market">
					<view class="prods">
						<view class="div">
							<image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu2-1.png"
								mode="heightFix"></image>
							<image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu1-1.png"
								mode="heightFix"></image>

						</view>
						<view class="div">
							<image :style="{'transform':'rotateY('+ angles +'deg)'}" src="@/images/xstu2-1.png"
								mode="heightFix"></image>
							<image :style="{'transform':'rotateY('+ angles +'deg)'}" src="@/images/xstu1-1.png"
								mode="heightFix"></image>
						</view>
						<view class="div">
							<image :style="{'transform':'rotateY('+ angless +'deg)'}" src="@/images/xstu2-1.png"
								mode="heightFix"></image>
							<image :style="{'transform':'rotateY('+ angless +'deg)'}" src="@/images/xstu1-1.png"
								mode="heightFix"></image>
						</view>
					</view>
					<view class="dates" @click="ToSale(1)">
						<view>
							<label><text>销售</text><text>SALES</text></label>
							<image src="@/images/jinruxs-jt.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="chongdu">
					<view class="dates">
						<button @click="reset()">重读基础数据 <text>REREAD</text></button>
						<button @click="zbtx()">通讯 <text>MRSSAGE</text></button>
					</view>
					<view class="tuichu" @click="ToOut()">
						<image src="@/images/logout.png" mode="widthFix"></image>
						退出
					</view>
				</view>
				版本号:{{version}}
			</view>
		</view>
		<!-- <button @click="ToSale(1)">去销售（判断日结）</button>
		<button @click="ToSale()">去销售（不判断日结）</button>
		<button @click="Sign()">签到</button>
		<button @click="SignOut()">日结</button> -->
		<!-- 签到组件 -->
		<!-- <qiandao @CloseSign="CloseSignIn" v-show="showSign"></qiandao> -->
		<!-- 日结组件 -->
		<rijie @CloseRJ="CloseSignOut" v-show="showSignOut" :_signOutDate="signOutDate"></rijie>
	</view>
</template>

<script>
	var app = getApp();
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _login from '@/api/business/login.js';
	import _init from '@/api/business/init.js';
	var that;
	export default {
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
				version: "1.0.0" //版本号
			};
		},
		methods: {
			onLoad: function() {
				that = this;
				that.GetSignOutInWeeks();
				// that.GetSkyJk();
				let sysinfo = util.getStorage("sysinfo");
				if (sysinfo) {
					that.version = sysinfo.appWgtVersion;
				}
			},
			onShow: function() {
				this.MonitorEvent();
				this.timer = setInterval(() => {
					this.timer = setTimeout(() => {
						if (this.angle == 0) {
							this.angle = 180;
						} else if (this.angle == 180) {
							this.angle = 0;
						}
					}, 4000);
					this.timers = setTimeout(() => {
						if (this.angles == 0) {
							this.angles = 180;
						} else if (this.angles == 180) {
							this.angles = 0;
						}
					}, 4500);
					this.timerss = setTimeout(() => {
						if (this.angless == 0) {
							this.angless = 180;
						} else if (this.angless == 180) {
							this.angless = 0;
						}
					}, 5000);
				}, 5500);

			},
			reset: function() {
				_init.dataInit('reloadsqlite')
			},
			zbtx: function() {
				_init.dataInit('download_zbtx')
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
			//跳转到销售页面
			ToSale: function(e) {
				let store = util.getStorage("store");
				if (store.OPENFLAG != 1) {
					util.simpleMsg("请先进行签到", true);
					return;
				}
				let int = getApp().globalData.Int;
				console.log("传输定时ID:", int);
				if (!int) {
					this.TimedCommunication();
				}
				util.setStorage("CurDate", dateformat.getYMD()); //缓存当天日期 用于在销售页判断是否为当天业务操作
				let sysParam = util.getStorage("sysParam");
				console.log("是否结款判断参数：", sysParam.YN_JKXS);
				if (sysParam.YN_JKXS != "Y") { //是否要结款判断
					if (that.signOutDates.length > 0) { //有日结数据
						that.SignOut(); //发起日结
						return;
					}
					uni.redirectTo({
						url: "/pages/mainSale/MainSale"
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
						url: "/pages/mainSale/MainSale"
					});
				})
			},
			//手动直接发起签到
			Sign: function() {
				// that.showSign = true;
				util.simpleModal("提示", "是否确认签到？", res => {
					if (res) {
						_login.SignOrSignOut(true, "", res => {
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
				console.log("将要签退的数据：", that.signOutDates);
				if (that.signOutDates.length > 0) { //历史日结
					that.showSignOut = true;
					that.signOutDate = that.signOutDates;
				} else { //今日日结
					that.ConfirmRJ();
				}
			},
			//获取一周内是否有未日结的数据 
			GetSignOutInWeek: function(func) {
				_login.GetSignOutInWeek(res => {
					console.log("是否有日结数据：", res);
					if (res.code) {
						if (t) { //主动触发
							that.showSignOut = true;
							that.signOutDate = JSON.parse(res.data); // ["2022/9/1","2022/8/31"]; 
						} else { //自动触发
							uni.showModal({
								title: "提示",
								content: res.msg,
								showCancel: false,
								success: e => {
									if (e.confirm) {
										console.log("点击了确定");
										that.showSignOut = true;
										that.signOutDate = JSON.parse(res
											.data); // ["2022/9/1","2022/8/31"]; 
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
			//关闭签到
			// CloseSign: function(res) {
			// 	console.log("父组件被通知事件");
			// 	that.showSign = false;
			// },
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
			//初始化
			DataInit: function(e) {
				_init.dataInit(e);
			}
		},
	}
</script>

<style>
	page-body,
	page-refresh,
	page {
		height: 100%;
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
		height: 86%;
		padding: 6% 10%;
		display: flex;
	}

	.leftlist {
		width: 42%;
		margin-right: 5%;
	}

	.leftlist .logos {
		width: 100%;
		height: 472rpx;
	}

	.leftlist .logos image {
		width: 100%;
	}

	.leftlist .sginout {
		display: flex;
		margin: 8% 0;
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
		height: 100%;
		justify-content: center;
		align-items: flex-start;
	}

	.leftlist .sginout view label {
		font-size: 44rpx;
		font-weight: 700;
		margin-bottom: 20rpx;
	}

	.leftlist .sginout view text,
	.leftlist .sginout view label {
		display: block;
		padding-left: 20%;
	}

	.leftlist .sginout view:nth-child(1) {
		margin-right: 10%;
	}

	.dates {
		width: 100%;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);
		position: relative;
		padding: 0;
		height: 360rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
		padding: 0 15%;
		width: 70%;
	}

	.dates label {
		display: flex;
		flex-direction: column;
		color: #006B44;
		font-size: 44rpx;
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

	.rightlist {
		width: 53%;
	}

	.rightlist .market {
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);
		height: 876rpx;
	}

	.rightlist .market .prods {
		display: flex;
		padding: 6% 5% 0;
	}

	.rightlist .market .prods view {
		border-radius: 30rpx;
		height: 540rpx;
		overflow: hidden;
		position: relative;
	}

	.rightlist .market .prods view image {
		width: 100%;

	}

	.rightlist .market .prods .div:nth-child(1) {
		width: 23%;
		margin-right: 2%;
	}

	.rightlist .market .prods .div:nth-child(2) {
		width: 33%;
		margin-right: 2%;
	}

	.rightlist .market .prods .div:nth-child(3) {
		width: 40%;
	}

	.rightlist .market .prods .div image {
		position: absolute;
		top: 0;
	}

	.rightlist .market .prods .div:nth-child(1) image {
		left: 0;
	}

	.rightlist .market .prods .div:nth-child(2) image {
		left: -53%;
	}

	.rightlist .market .prods .div:nth-child(3) image {
		right: 0;
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
		margin-top: 7%;
	}

	.chongdu .dates {
		width: 70%;
		margin-right: 5%;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1);
		padding: 0 5%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 256rpx;
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
		border-right: 1px solid #C1F6D8;
		width: 52%;
	}

	.chongdu .dates button:nth-child(2) {
		width: 45%;
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

		/* left: 0; */

		transition: all 1s;

	}



	.div image:first-child {

		z-index: 1;

		/*不对向屏幕就隐藏*/

		backface-visibility: hidden;

	}



	/* .div:hover image{
	
	            transform: rotateY(180deg);
	
	        } */
</style>
