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
					<input type="text" v-model="userid" placeholder="请输入登录账号" />
				</label>
				<label>
					<image src="../../images/dl-mima.png" mode="widthFix"></image>
					<input password="true" v-model="password" placeholder="请输入登录账号" />
				</label>
				<label>
					<image src="../../images/dl-mendian.png" mode="widthFix"></image>
					<input type="text" v-model="khid " />
				</label>
			</view>
			<view class="logbtn">
				<button @click="Login()">登 录</button>
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

	var that;
	export default {
		data() {
			return {
				userid: "",
				password: "",
				khid: ""
			}
		},
		methods: {
			onLoad: function() {
				that = this;
			},
			Login: function() {
				if (!that.userid || !that.password) {
					util.simpleMsg("请输入账号密码", true);
					return;
				}
				_login.GetPassWord(that.userid, that.password, res => {
					console.log("登录成功：", res);
					util.simpleMsg("登录成功");
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
