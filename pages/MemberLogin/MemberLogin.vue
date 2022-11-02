<style>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>

<template>
	<view class="boxs">
		<!-- <menu_page :menuIndex="0"></menu_page> -->
		<!-- <view class="right"> -->
		<!-- <menu_head></menu_head> -->
		<!-- <Head></Head> -->
		<view class="mem-bg">
			<button class="skip" @click="ReBack()">×</button>
			<image class="img-bg" src="../../images/hydl-bj.png" mode="widthFix"></image>
			<view class="import">
				<view class="h1">会员登录</view>
				<text class="zim">Member login</text>
				<label>
					<image src="../../images/zhanghu.png" mode="widthFix"></image>
					<input type="text" v-model="numbers" :adjust-position="true" focus="true" :hold-keyboard="true"
						@confirm="HYLogin" />
					<!-- <input v-model="realBarcode" type="text" @keydown="handleKeyUp" /> -->
				</label>
				<button @click="HYLogin()">登 录</button>

				<button @click="Codequery()">扫码查询</button>
			</view>
		</view>
		<!-- </view> -->
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
	import Head from '@/pages/Home/Component/Head.vue'
	var that, eventChannel;
	export default {
		components: {
			Head
		},
		data() {
			return {
				numbers: "",
				brand: app.globalData.brand,
				kquser: app.globalData.kquser,
				realBarcode: "",
				isScanningGun: false
			}
		},
		methods: {
			onLoad: function() {
				that = this;
				eventChannel = this.getOpenerEventChannel();
			},
			Codequery: function() {
				let that = this;
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						// that.code = res.result;
						let store = util.getStorage("store");
						let obj = {
							khid: store.KHID,
							code: res.result
						}
						_member.QueryHyInfoByCode("查询中...", {
								brand: that.brand,
								kquser: that.kquser,
								data: obj
							},
							function(res) {
								if (res.code) {
									let hyinfo = JSON.parse(res.data);
									util.setStorage("hyinfo", hyinfo);
									util.simpleMsg("登录成功");
									setTimeout(r => {
										uni.$emit("member-close", hyinfo);
									}, 1500)
								} else {
									util.simpleMsg(res.msg, "none");
								}
							}, err => {
								console.log("会员信息查询失败:", err);
								util.simpleMsg(err.msg, "none");
							});
					}
				});
			},
			//登录事件
			HYLogin: function() {
				if (!that.numbers) {
					util.simpleMsg("请输入手机号，会员号", "none");
					return;
				}
				let store = util.getStorage("store");
				if (that.numbers.length > 11) { //扫码操作
					let obj = {
						khid: store.KHID,
						code: that.numbers
					}
					_member.QueryHyInfoByCode("查询中...", {
							brand: that.brand,
							kquser: that.kquser,
							data: obj
						},
						function(res) {
							if (res.code) {
								let hyinfo = JSON.parse(res.data);
								util.setStorage("hyinfo", hyinfo);
								util.simpleMsg("登录成功");
								setTimeout(r => {
									uni.$emit("member-close", hyinfo);
								}, 1500)
							} else {
								util.simpleMsg(res.msg, "none");
							}
						}, err => {
							console.log("会员信息查询失败:", err);
							util.simpleMsg(err.msg, "none");
						});
				} else {
					let flag = _checker.checkMobile(that.numbers);
					let obj = {
						code: that.numbers,
						type: flag ? 'Mobile' : 'ACCOUNT'
					}
					_member.QueryHyInfo("查询中...", {
						brand: that.brand,
						kquser: that.kquser,
						data: obj
					}, res => {
						console.log("会员信息查询成功:", res);
						if (res.code) {
							let hyinfo = JSON.parse(res.data);
							util.setStorage("hyinfo", hyinfo);
							util.simpleMsg("登录成功");
							setTimeout(r => {
								uni.$emit("member-close", hyinfo);
							}, 1500)
						} else {
							util.simpleMsg(res.msg, "none");
						}
					}, err => {
						console.log("会员信息查询失败:", err);
						util.simpleMsg(err.msg, "none");
					});
				}
			},
			//返回
			ReBack: function() {
				uni.$emit("member-close", {});
				return;
				uni.navigateBack({
					success: function() {
						eventChannel.emit('refreshHY', {
							data: '会员登录页面返回'
						})
					}
				});
			},
			// 处理keyup事件
			handleKeyUp(e) {
				console.log("按键事件:", e);
				var shiftKey = e.shiftKey //为true则按了shiftKey
				let keyCode = e.code
				var key = e.key //其他按键key
				let array = ["Q", "W", "E", "R", "T", "Y", "U",
					"I", "O", "P", "A", "S", "D", "F", "G", "H", "J",
					"K", "L", "Z", "X", "C", "V", "B", "N", "M",
					"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
				]
				// 这种情况下 基本上是 中文输入法 才有出现
				if (key == "Process") {
					for (const a of array) {
						// 如果匹配到是英文
						if (keyCode == "Key" + a) {
							// 判断大小写
							if (shiftKey) {
								this.realBarcode += a
								this.isScanningGun = true
							} else {
								this.realBarcode += (a.toLowerCase())
								this.isScanningGun = true
							}
						} else
							// 如果匹配到是数字
							if (keyCode == "Digit" + a) {
								this.realBarcode += String(a)
								this.isScanningGun = true
							}
					}
					if (keyCode == "Enter") {
						console.log("")
						// this.clickBarCode()
					}
				} else
					// 这是英文状态下 直接判断输入的英文在没在上面大写字母中
					if (array.includes(key.toUpperCase())) {
						this.realBarcode += key
					} else
						// 这是英文状态下 直接判断输入的小写英文在没在上面大写字母中
						if (array.includes(key.toUpperCase())) {
							this.realBarcode += key
						} else
							// 这是数字 直接判断输入的数字在没在上面数字中
							if (array.includes(key)) {
								this.realBarcode += String(key)
							}
				else if (keyCode == "Enter") {
					// 监听到enter触发了，执行后续事件
					// this.clickBarCode()
				}
			},
		},
		created() {
			that = this;
		}
	}
</script>

<style>
	.mem-bg {
		width: 70%;
		height: 90%;
		padding: 2%;
		position: relative;
		margin: 5% auto;
	}

	.mem-bg .img-bg {
		width: 100%;
		border-radius: 30rpx;
		border:16rpx solid #fff;
		/* opacity: 0; */
	}

	.mem-bg .import {
		position: absolute;
		top: 26%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		color: #fff;
		width: 60%;
		justify-content: center;
		background: rgba(0, 107, 68, 0.3);
		text-align: center;
	}

	.mem-bg .import .h1 {
		font-size: 80rpx;
		font-weight: 700;
		line-height: 100rpx;
		text-align: center;
		margin-top: -50rpx;
	}

	.mem-bg .import .zim {
		display: block;
		font-size: 50rpx;
		line-height: 160rpx;
	}

	.mem-bg .import label {
		display: flex;
		background-color: #fff;
		width: 76%;
		align-items: center;
		padding: 0 2%;
		margin: 40rpx auto;
		height: 84rpx;
		line-height: 84rpx;
	}

	.import label image {
		width: 40rpx;
	}

	.import label input {
		height: 100%;
		margin-left: 10rpx;
		width: 76%;
		color: #333;
	}

	.import button {
		margin: 30rpx auto;
		border-radius: 0;
		background-color: #006B44;
		color: #fff;
		width: 80%;
		padding: 0 2%;
		font-weight: 700;
		border-radius: 6rpx;
	}

	.skip {
		position: absolute;
		top: 5%;
		right: 5%;
		z-index: 99;
		background-color: #F5F5F5;
		height: 80rpx;
		line-height: 80rpx;
		width: 80rpx;
		font-size: 40rpx;
		padding: 0;
	}
</style>
