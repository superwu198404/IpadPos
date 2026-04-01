<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="centre">
		<!-- <image class="bg" src="../../images/chushihua.png" mode="widthFix"></image> -->
		<Head ref="Head" :BUSSINESS_NAME="BUSSINESS_NAME" :_showSale="true" :_ynMsg='false'></Head>

		<!-- 今日任务总览 -->
        <view class="page-container">
            <view class="section-block" style="position:relative;">
                <view class="section-title">今日任务总览</view>
                <view @click="GetBHQHRwTj" style="position: absolute;right:36rpx;top:32rpx;display: flex;align-items: center;">
                    <image src="../../images/imgbh/cd@1x.png" mode="widthFix" style="width:34rpx;height:34rpx;margin-right:6rpx"></image>
                    <text style="font-size: 30rpx;color: #536961;">刷新</text>
                </view>
                    
                <view class="tasks-row tasks-row-one">
                    <view class="task-card" v-for="(item, index) in taskCountList" :key="'count_' + index">
                        <view class="card-label">
                            <text class="dot" :class="item.dotClass"></text>{{ item.label }}
                        </view>
                        <NumberFormat class="card-value" :value="item.value" color="#333333" />
                        <view v-if="item.isShow" class="card-tip">
                            <text>较上周同期</text>
                            <text :class="item.compareType == 1 ? 'up' : 'down'">{{ item.compareValue }}</text>
                            <image v-if="item.compareType == 1" class="card-icon"
                                src="../../images/imgbh/rise-icon.png" mode="widthFix"></image>
                            <image v-else class="card-icon" src="../../images/imgbh/down-icon.png" mode="widthFix">
                            </image>
                        </view>
                    </view>
                </view>
                <view class="tasks-row">
                    <view class="task-card" v-for="(item, index) in taskAmountList" :key="'amount_' + index">
                        <view class="card-label">
                            <text class="dot" :class="item.dotClass"></text>{{ item.label }}
                        </view>
                        <NumberFormat class="card-value" :value="item.value" color="#333333" />
                        <view v-if="item.isShow" class="card-tip">
                            <text>较上周同期</text>
                            <text :class="item.compareType == 1 ? 'up' : 'down'">{{ item.compareValue }}</text>
                            <image v-if="item.compareType == 1" class="card-icon"
                                src="../../images/imgbh/rise-icon.png" mode="widthFix"></image>
                            <image v-else class="card-icon" src="../../images/imgbh/down-icon.png" mode="widthFix">
                            </image>
                        </view>
                    </view>
                </view>
            </view>

            <view class="section-block">
                <view class="section-title">入库尺寸分布</view>
                <view class="size-cards">
                    <view class="size-card" v-for="(item, index) in sizeDataList" :key="'size_' + index">
                        <view class="size-tag">{{ item.size }}</view>
                        <view class="size-info">
                            <view class="size-count">{{ item.count }}</view>
                            <view class="size-desc">总数量(个)</view>
                        </view>
                        <view class="size-info">
                            <NumberFormat class="size-amount" :value="item.amount" color="#333333" />
                            <view class="size-desc">总金额(元)</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
	</view>
</template>

<script>
	var app = getApp();
	import Head from '@/pages/Home/Component/YWHead.vue';
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
				BUSSINESS_NAME: '今日任务总览',
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

				// 1. 数量类任务数据（
				taskCountList: [{
						label: "总任务数",
						value: "0",
						dotClass: "deepgreen",
						compareValue: "0",
						compareType: "1",
						prop:"T_QTY",
						isShow: true
					},
					{
						label: "ToC任务数",
						value: "0",
						dotClass: "teal",
						compareValue: "0",
						compareType: "0",
						prop:"T_TCQTY",
						isShow: true
					},
					{
						label: "ToB任务数",
						value: "0",
						dotClass: "green",
						compareValue: "0",
						compareType: "1",
						prop:"T_TBQTY",
						isShow: true
					},
					{
						label: "入库数",
						value: "0",
						dotClass: "light-blue",
						compareValue: "0",
						compareType: "0",
						prop:"T_RKQTY",
						isShow: true
					},
					{
						label: "超时订单数",
						value: "0",
						dotClass: "orange",
						compareValue: "0",
						compareType: "1",
						prop:"T_CSQTY",
						isShow: false
					}
				],

				// 2. 金额类任务数据
				taskAmountList: [{
						label: "总任务金额(元)",
						value: "0",
						dotClass: "deepgreen",
						compareValue: "0",
						compareType: "1",
						prop:"T_PRICE",
						isShow: true
					},
					{
						label: "ToC任务金额(元)",
						value: "0",
						dotClass: "teal",
						compareValue: "0",
						compareType: "0",
						prop:"T_TCPRICE",
						isShow: true
					},
					{
						label: "ToB任务金额(元)",
						value: "0",
						dotClass: "green",
						compareValue: "0",
						compareType: "1",
						prop:"T_TBPRICE",
						isShow: true
					},
					{
						label: "入库金额(元)",
						value: "0",
						dotClass: "light-blue",
						compareValue: "0",
						compareType: "1",
						prop:"T_RKPRICE",
						isShow: true
					},
					{
						label: "超时订单金额(元)",
						value: "0",
						dotClass: "orange",
						compareValue: "0",
						compareType: "1",
						prop:"T_CSPRICE",
						isShow: false
					}
				],

				// 3. 入库尺寸分布数据
				sizeDataList: [
				]
			};
		},
		methods: {
			onLoad: async function() {
				that = this;
				that.GetBHQHRwTj();
				
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
			
			GetBHQHRwTj:function(t) {
				that = this;
				console.log("123123");
				let store = util.getStorage("store");
				console.log("当前门店数据",store);
				let data1 = {
					khid: store.KHID,
					gsid: store.GSID
				};
					_ywbhqh.GetBHQHRwTj(data1, res => {
						console.log("查询到的任务数据：", res);
						 if (res.code) { // 接口调用成功
						      // 解析接口返回的数据（res.data是JSON字符串，转成对象）
						      const tData = JSON.parse(res.data);
							  const taskData=tData.tjdt;
							  const hzData=tData.hzdt;
					
							if(taskData.length>0){
						      // 处理数量类数组（更新value、compareValue、compareType）
						      that.taskCountList = that.processTaskList(that.taskCountList, taskData);
							   console.log("处理后的taskCountList：", that.taskCountList);
						      // 处理金额类数组
						      that.taskAmountList = that.processTaskList(that.taskAmountList, taskData);
							  console.log("处理后的taskAmountList：", that.taskAmountList);
							  }
							  
							  //处理汇总数据
							  if(hzData.length>0){
								 let arr = hzData.map(r => {
								 	return {
								 		size: r.SPECS,
								 		count: r.SUM_ZQTY_SQ,
								 		amount:r.SUM_PRICE
								 	
								 	}
								 });
								 console.log("处理后的arr：", arr);
								 that.sizeDataList=arr;
								  
								  
							  }
							  
						    } else { 
						      that.taskCountList = that.taskCountList.map(item => ({
						        ...item,
						        value: "0",
						        compareValue: "0",
						        compareType: "1"
						      }));
						      that.taskAmountList = that.taskAmountList.map(item => ({
						        ...item,
						        value: "0",
						        compareValue: "0",
						        compareType: "1"
						      }));
							  util.simpleMsg("当前门店无数据！", "none");
						    }
						
					})
			},
			
			// 先定义通用的任务数组处理函数（放在页面/组件的 methods 里，或全局）
			processTaskList(taskList, sqlData) {
				
					console.log("接收到的任务数据taskList：", taskList);
					console.log("接收到的任务数据sqlData：", sqlData);
					const dataObj = Array.isArray(sqlData) && sqlData.length > 0 ? sqlData[0] : {};
			  return taskList.map(item => {
			      // 匹配今天（T_开头）和昨天（Y_开头）的字段
			      const todayProp = item.prop;
			      const yesterdayProp = "Y" + todayProp.slice(1); // T_QTY → Y_QTY
			      
			      // 兼容空值，转为数字（避免NaN）
			      const todayValue = Number(dataObj[todayProp] || 0);
			      const yesterdayValue = Number(dataObj[yesterdayProp] || 0);
			      
			      // 计算增长比例：(昨天 - 今天) / 今天 * 100%（她自己写错了，现在要写成 / 昨天的 * 100%）
			      // 关键：处理今天值为0的情况，避免除以0导致NaN
			      let diff = 0; // 默认比例为0
			      if (yesterdayValue !== 0) {
			        diff = ((yesterdayValue - todayValue) / yesterdayValue) * 100;
			        // 保留2位小数，避免过多小数位（可选，根据业务需求调整）
			        diff = Number(diff.toFixed(2));
			      }
			      
			      // compareType：1=上升（今天>昨天），0=下降（今天≤昨天）
			      // 比例diff<0 → 昨天<今天 → 今天上升 → 1
			      // 比例diff≥0 → 昨天≥今天 → 今天下降 → 0
			      const compareType = diff < 0 ? 1 : 0;
			      
			      return {
			        ...item,
			        value: todayValue.toString(), // 今天的数值（转字符串）
			        compareValue: Math.abs(diff).toString()+"%", // 比例绝对值（无负数）
			        compareType: compareType // 1=上升，0=下降
			      };
			    });
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

	.dates-bh .line {
		display: block;
		width: 1rpx;
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