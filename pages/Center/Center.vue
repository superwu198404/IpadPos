<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view>
		<button @click="ToSale(1)">去销售（判断日结）</button>
		<button @click="ToSale()">去销售（不判断日结）</button>
		<button @click="Sign()">签到</button>
		<button @click="SignOut()">日结</button>
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

	var that;
	export default {
		data() {
			return {
				showSign: false,
				showSignOut: false,
				signOutDate: [],
				signOutDates: []
			};
		},
		methods: {
			onLoad: function() {
				that = this;
				that.GetSignOutInWeeks();
			},
			//跳转到销售页面
			ToSale: function(e) {
				let store = util.getStorage("store");
				if (e) {
					if (store.OPENFLAG == 1 && that.signOutDates.length == 0) { //签到了 且没有日结数据
						if (store.RYTYPE != "SYSTEM") {
							uni.redirectTo({
								url: "/pages/mainSale/MainSale"
							});
						} else {
							uni.redirectTo({
								url: "/pages/index/index"
							});
						}
					} else {
						// util.simpleMsg("请先日结", true);
						that.SignOut(); //发起日结
					}
				} else {
					if (store.RYTYPE != "SYSTEM") {
						uni.redirectTo({
							url: "/pages/mainSale/MainSale"
						});
					} else {
						uni.redirectTo({
							url: "/pages/index/index"
						});
					}
				}
			},
			//手动直接发起签到
			Sign: function() {
				// that.showSign = true;
				util.simpleModal("提示", "是否确认签到？", res => {
					if (res) {
						_login.SignOrSignOut(true, "", res => {
							console.log("手动签到结果：", res);
							if (res.code) {
								util.simpleMsg("签到成功！");
								let data = JSON.parse(res.data);
								if (data.sql) {
									_login.SignOrSignOutSql(data.sql);
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
		},
	}
</script>

<style>
	.customer {
		background-color: #fff;
		width: 45%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 0 180rpx;
	}

	.customer .bg {
		position: absolute !important;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
	}

	.affirm {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 20rpx;
	}

	.affirm button {
		width: 50%;
		background-color: #42B14B;
		color: #fff;
	}

	.clues {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
	}

	.clues image {
		width: 100%;
	}

	.clues image:nth-child(2) {
		display: none;
	}

	.clues image:nth-child(2) {
		display: none;
	}

	.clues text {
		margin-top: -180rpx;
		font-weight: 700;
	}
</style>
