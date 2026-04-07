<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="centre">
		<!-- <image class="bg" src="../../images/chushihua.png" mode="widthFix"></image> -->
		<Head ref="bhHead" :_showSale="true" :showType="1" :_ynMsg='false' :type="'ywbhqh'"></Head>

		<view class="tranlist">
			<view class="leftlist">
				<view class="logos" @click="ToSale('/pages/BHYHPS/BHYHPS','not')">
					<!-- <image src="../../images/imgbh/peis@1x.png" mode="widthFix"></image> -->
					<view class="xingqi">
						<view>要货配送</view>
						<view>DISTRIBUTION</view>
					</view>
				</view>
				<view class="sginout-qd">
					<view class="left">
						<view @click="ToSale('/pages/YWMDSC/YWMDSC')">
							<view class="label">裱花主动入库</view>
							<image class="img" src="../../images/imgbh/jt_sx@1x.png" mode="widthFix"></image>
						</view>
						<view class="base-line"></view>
						<view @click="ToSale('/pages/BHZDPS/BHZDPS')">
							<view class="label">裱花主动配送</view>
							<image class="img" src="../../images/imgbh/jt_sx@1x.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="right right-qd">
						<view @click="ToSale('/pages/BHZDPS/BHZDPS','not')">
							<image class="datebg gaip_bj" src="../../images/gaip_bj.png" mode="widthFix"></image>
							<image class="tubiao" style="margin-right:20rpx;" src="../../images/imgbh/gaip@1x.png"
								mode="widthFix"></image><label>改胚</label>
						</view>
						<view @click="Chaxun(1)">
							<image class="datebg gaip_bj" src="../../images/cxxun_bj.png" mode="widthFix"></image>
							<image class="tubiao" style="margin-right:20rpx;" src="../../images/imgbh/cx@1x.png"
								mode="widthFix"></image><label>查询</label>
						</view>
					</view>
				</view>
				<view class="dates dates-bh2">
					<!-- <image class="datebg" src="../../images/new-bg.png" mode="widthFix"></image> -->
					<view class="sginout sginout-bh">
						<view @click="openMoreFunc()">
							<image class="tubiao" src="../../images/gdd.png" mode="widthFix"></image>
							<label>更多功能</label><text>MORE</text>
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
						<view>
							<view style="display: flex;justify-content: flex-start;align-items: flex-start;gap: 12rpx;">
								<image src="../../images/yaohsc.png" mode="heightFix"></image>
								<label style="line-height: 1;"
									@click="ToSale('/pages/YWBHQH/YWBHQH')"><text>生产任务</text><text>PRODUCTION</text></label>
							</view>
							<view style="display: flex;justify-content: flex-start;align-items: flex-start;gap: 12rpx;">
								<image src="../../images/drrwyl.png" mode="heightFix"></image>
								<label style="line-height: 1;"
									@click="viewTasks()"><text>今日任务概览</text><text>TASK</text></label>
							</view>
						</view>
					</view>
				</view>
				<view class="chongdu">
					<view class="dates">
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


		<!-- 更多功能弹窗 -->
		<view class="more-func-modal" v-show="showMoreFunc" @click="closeMoreFunc">
			<view class="modal-content" @click.stop>
				<!-- <image class="bj" src="../../images/hwen-ys.png" mode="widthFix"></image> -->
				<view class="title-left">
					<view>全部功能</view>
					<image @click="closeMoreFunc" src="../../images/gbb.png" mode="widthFix"></image>
				</view>
				<view class="content-list">
					<!-- 左侧分类栏 -->
					<view class="category-sidebar">
						<view v-for="(item, index) in menuList" :key="item.MenuId" class="category-item"
							:class="{ active: activeCategoryIndex === index }" @click="switchCategory(index)">
							{{ item.MenuName }}
							<image v-if="activeCategoryIndex === index" class="xzzz" src="../../images/xzzz.png">
							</image>
						</view>
					</view>
					<!-- 右侧功能网格 -->
					<view class="func-grid">
						<view v-for="(func,index) in currentFuncList" :key="index" class="func-item"
							@click="handleFuncClick(func)">
							<image v-if="index%5 == 0" class="func-icon" src="../../images/ic_1.png" mode="widthFix">
							</image>
							<image v-else-if="index%5 == 1" class="func-icon" src="../../images/ic_2.png"
								mode="widthFix"></image>
							<image v-else-if="index%5 == 2" class="func-icon" src="../../images/ic_3.png"
								mode="widthFix"></image>
							<image v-else-if="index%5 == 3" class="func-icon" src="../../images/ic_4.png"
								mode="widthFix"></image>
							<image v-else class="func-icon" src="../../images/ic_5.png" mode="widthFix"></image>

							<text class="func-name">{{ func.MenuName }}</text>
						</view>
					</view>

				</view>

			</view>

		</view>
	</view>
</template>

<script>
	var app = getApp();
	import Head from '@/pages/Home/Component/Head.vue';
	import NumberFormat from '@/components/NumberFormat/NumberFormat.vue';
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
	import _ywbhqh from '@/api/business/ywbhqh.js';
	import tiktok from '@/api/business/tiktok.js';
	var that;
	export default {
		components: {
			Head,
			NumberFormat
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
				IMAGES: [],

				showMoreFunc: false, // 控制弹窗显示
				menuList: [], // 一级分类菜单
				activeCategoryIndex: 0, // 当前选中的分类索引
			};
		},
		computed: {
			currentFuncList() {
				const current = this.menuList[this.activeCategoryIndex];
				return current ? current.Second || [] : [];
			}
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
				//this.GetBHQHRwTj();
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
			// 打开更多功能弹窗
			openMoreFunc() {
				const menu = util.getStorage("MDMENU") || [];
				this.menuList = menu;

				this.menuList = [{
						MenuName: "业务办理",
						Second: [{
								MenuName: "入库管理",
							},
							{
								MenuName: "配送管理",
							},
						]
					},
					{
						MenuName: "查询统计",
						Second: [{
							MenuName: "数据查询",
						}]
					},
					{
						MenuName: "系统设置",
						Second: [{
							MenuName: "基础设置",
						}]
					}
				];


				this.activeCategoryIndex = 0;
				this.showMoreFunc = true;

			},
			// 关闭弹窗
			closeMoreFunc() {
				this.showMoreFunc = false;
			},
			// 切换左侧分类
			switchCategory(index) {
				this.activeCategoryIndex = index;
			},
			// 处理功能点击
			handleFuncClick(func) {
				console.log("点击功能:", func);
				util.simpleMsg("功能暂未开放！", true);
				return
				this.closeMoreFunc(); // 点击后关闭弹窗
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
				if (not) {
					util.simpleMsg("功能暂未开放！", true);
					return;
				}
				let store = util.getStorage("store");
				console.log("ToSale.store：", store);
				//初始化系统参数 (防止重读后失效的)
				await _sysParam.init(store.KHID);
				if (store.CLIENT_STATUS != '1') {
					util.simpleMsg("门店非营业状态，禁止操作！", "none");
					return;
				}
				if (store.OPENFLAG != 1) {
					util.simpleMsg("请先进行签到", true);
					return;
				}
				if (store.OPENFLAG == 1 && store.LOGINDATE != dateformat.getYMD()) //判断是否为当天签到
				{
					util.simpleMsg("签到状态已过期，请重新签到！", true);
					return;
				}

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
											//缓存当天日期 用于在销售页判断是否为当天业务操作
											store.LOGINDATE = dateformat.getYMD();
											util.setStorage("store", store);
										} else {
											util.simpleMsg("签到失败！", true);
										}
									});
								} else {
									util.simpleMsg("签到失败：签到数据异常！", "none");
								}
							} else {
								if (res.msg.indexOf("已经进行了签到") >= 0) {
									let store = util.getStorage("store");
									store.LOGINDATE = dateformat.getYMD();
									util.setStorage("store", store); //缓存当天日期 用于在销售页判断是否为当天业务操作
								}
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
			// 今日概览
			viewTasks: function() {
				uni.redirectTo({
					url: "/pages/TaskOverview/TaskOverview",
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
	/* 今日概览CSS */
	@font-face {
		font-family: 'Bahnschrift';
		src: url('../../images/imgbh/bahnschrift.ttf') format('truetype');
		/* ttf格式用truetype */
		font-weight: normal;
		/* 常规字重 */
		font-style: normal;
	}

	/* 页面容器：控制两个区块的间距 */
	.page-container {
		width: 96%;
		margin: 20rpx auto;
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		/* 两个区块之间的空白间隔 */
	}

	/* 通用区块样式：两个块共用 */
	.section-block {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;


		background: rgba(255, 255, 255, 0.75);
		border-radius: 30rpx;
	}

	/* 区块标题 */
	.section-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #111111;
		margin-bottom: 24rpx;
	}

	/* 任务行布局 */
	.tasks-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;

		padding: 36rpx;
		box-sizing: border-box;
	}

	.tasks-row-one {
		background: rgba(240, 245, 244, 0.4);
		border-radius: 40rpx;

	}

	.tasks-row:last-child {
		margin-bottom: 0;
	}

	/* 任务卡片 */
	.task-card {
		flex: 1;
		padding: 0 16rpx;
		text-align: left;
		position: relative;
	}

	/* 卡片间虚线分隔 */
	.task-card:not(:last-child)::after {
		content: '';
		position: absolute;
		right: 40rpx;
		top: 10%;
		height: 80%;
		width: 2rpx;
		background: repeating-linear-gradient(to bottom,
				#eee,
				#eee 6rpx,
				transparent 6rpx,
				transparent 12rpx);
	}

	/* 标签+圆点 */
	.card-label {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #536961;
		margin-bottom: 12rpx;
	}

	.dot {
		display: inline-block;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		margin-right: 8rpx;
	}

	.dot.deepgreen {
		background: #006637;
	}

	.dot.green {
		background: #42B14B;
	}

	.dot.teal {
		background: #19C7A5;
	}

	.dot.light-blue {
		background: #62E6E6;
	}

	.dot.orange {
		background: #F39017;
	}

	/* 数值样式 */
	.card-value {
		font-size: 48rpx;
		font-weight: 700;
		color: #333333;
		margin-bottom: 12rpx;
		line-height: 1.1;
		padding-left: 20rpx;
		box-sizing: border-box;

		font-family: "Bahnschrift";
	}

	/* 较昨日提示 */
	.card-tip {
		font-size: 26rpx;
		color: #999999;
		padding-left: 20rpx;
		box-sizing: border-box;

		margin-top: 10rpx;
		display: flex;
		align-items: center;
	}

	.card-icon {
		width: 24rpx;
		height: 24rpx;
		position: relative;
		top: 2rpx;
		margin-left: 4rpx;
	}

	.card-tip>text:nth-child(1) {
		margin-right: 32rpx;
	}

	.card-tip .up {
		color: #FF6040;
		font-weight: 700;
	}

	.card-tip .down {
		color: #42B14B;
		font-weight: 700;
	}

	/* 入库尺寸分布卡片布局 */
	.size-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30rpx;

	}

	.size-card {
		background: #fff;
		border: 2rpx solid #D8D8D8;
		border-radius: 16rpx;
		padding: 36rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 54rpx;
	}

	.size-tag {
		background: #E6F7EF;
		color: #006637;
		font-size: 28rpx;
		font-weight: 700;
		padding: 16rpx 12rpx;
		white-space: nowrap;
		border-radius: 20rpx;
	}

	.size-info {
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}

	.size-count,
	.size-amount {
		font-family: "Bahnschrift";
		font-size: 32rpx;
		font-weight: 700;
		color: #333333;
	}

	.size-desc {
		font-size: 24rpx;
		color: #999999;
	}

	/* ----- ↑ */


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
		font-weight: 700;
	}

	.centre {
		width: 100%;
		height: 100%;
		position: relative;

		background-image: url('../../images/chushihua.png');
		background-size: cover;
		background-repeat: no-repeat;
		background-position: left top;
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

		background-image: url('../../images/imgbh/peis@1x.png');
		background-size: 100% 100%;
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
		/* background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0, 107, 68, 0.1); */
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
		width: 2rpx;
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
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.leftlist .sginout-qd .base-line {
		width: 100%;
		height: 2px;
		background: rgba(0, 107, 68, 0.2);
		border-radius: 30rpx 30rpx 30rpx 30rpx;
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
		border-radius: 30rpx 30rpx 30rpx 30rpx;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 24rpx;
		box-sizing: border-box;
	}

	.leftlist .sginout-qd .right-qd {
		display: flex;
		flex-direction: column;
	}

	.leftlist .sginout-qd .right-qd>view {
		position: relative;
		display: flex;
		align-items: center;
		padding-left: 40rpx;
		box-sizing: border-box;
		flex: 1;
	}

	.gaip_bj {
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

	.dates-bh2 {
		background-image: url('../../images/new-bg.png');
		background-size: 100% 100%;
	}

	.dates-bh image {
		width: 44rpx !important;
		height: 44rpx !important;
	}

	.dates-bh .line {
		display: block;
		width: 2rpx;
		height: 64rpx;
		background: #006B44;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		opacity: 0.2;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		box-shadow: none;
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
		/* line-height: 1; */
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
		overflow: hidden;
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
		padding-left: 3%
	}

	.rightlist .dates view {
		padding: 0 2%;
		width: 100%;
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


	/* 更多弹窗 */
	.more-func-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 弹窗内容容器 */
	.modal-content {
		width: 70%;
		height: 60vh;
		background: #fff;
		border-radius: 40rpx;
		overflow: hidden;


		background-image: url('../../images/imgbh/tanc-bg@1x.png');
		background-size: 100% 274rpx;
		/* 禁止背景图重复平铺 */
		background-repeat: no-repeat;
		/* 可选：控制背景图垂直位置（比如置顶，也可设center/bottom） */
		background-position: left top;
	}

	.modal-content .title-left {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2%;
		border-bottom: 2rpx solid #E9E9E9;
	}

	.modal-content .title-left view {
		font-weight: 700;
		font-size: 40rpx;
		color: #333333;
	}

	.modal-content .title-left image {
		width: 48rpx;
		height: 48rpx;
	}

	.modal-content .content-list {
		display: flex;
		height: 100%;
	}

	/* 左侧分类栏 */
	.category-sidebar {
		background: #F5F6F9;
		height: 93%;
		width: 25%;
		overflow-y: auto;
	}

	.category-item {
		padding: 30rpx 20rpx;
		font-size: 36rpx;
		color: #333;
		text-align: center;
		position: relative;
	}

	.category-item .xzzz {
		position: absolute;
		left: 0;
		top: 0;
		width: 16rpx;
		height: 100%;
	}

	.category-item.active {
		background: #fff;
		color: #006B44;
		font-weight: 700;
	}

	/* 右侧功能网格 */
	.func-grid {
		flex: 1;
		padding: 40rpx;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		align-content: start;
		gap: 56rpx;
		overflow-y: auto;
	}

	.func-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20rpx;
	}

	.func-icon {
		width: 100rpx;
		height: 100rpx;
	}

	.func-name {
		font-size: 40rpx;
		color: #111111;
		text-align: center;
	}
</style>