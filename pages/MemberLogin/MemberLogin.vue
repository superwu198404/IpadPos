<style>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>

<template>
	<view class="content">
		<menu_page :menuIndex="0"></menu_page>
		<view class="right">
			<menu_head></menu_head>
			<view class="mem-bg">
				<button class="skip" @click="ReBack()">返回</button>
				<image class="img-bg" src="../../images/hydl-bj.png" mode="widthFix"></image>
				<view class="import">
					<label>
						<image src="../../images/zhanghu.png" mode="widthFix"></image>
						<input type="number" v-model="numbers" />
					</label>
					<button @click="HYLogin()">登 录</button>
				</view>
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
	var that;
	export default {
		data() {
			return {
				numbers: "",
				brand: app.globalData.brand,
				kquser: app.globalData.kquser,
			}
		},
		methods: {
			onLoad: function() {
				that = this;
			},
			//登录事件
			HYLogin: function() {
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
							uni.navigateBack({})
						}, 1000);
					}
				}, err => {
					console.log("会员信息查询失败:", err);
					util.simpleMsg(err.msg, true);
				});
			},
			//返回
			ReBack: function() {
				uni.navigateBack({})
			}
		}
	}
</script>

<style>
	.mem-bg {
		width: 96%;
		height: 96%;
		padding: 2%;
		position: relative;
	}

	.mem-bg .img-bg {
		width: 100%;
	}

	.mem-bg .import {
		position: absolute;
		bottom: 22%;
		left: 12%;
		display: flex;
		width: 42%;
		justify-content: start;
	}

	.mem-bg .import label {
		display: flex;
		background-color: #fff;
		width: 80%;
		align-items: center;
		padding: 0 2%;
	}

	.import label image {
		width: 40rpx;
	}

	.import label input {
		height: 100%;
		margin-left: 10rpx;
		width: 76%;
	}

	.import button {
		margin: 0;
		border-radius: 0;
		background-color: #006B44;
		color: #fff;
		width: 22%;
		font-weight: 700;
	}

	.skip {
		position: absolute;
		top: 5%;
		right: 5%;
		z-index: 99;
		background-color: #F5F5F5;
		height: 80rpx;
		line-height: 80rpx;
		width: 140rpx;
	}
</style>
