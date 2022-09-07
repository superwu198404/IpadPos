<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
		<!-- v-if="qd_show" -->
		<view class="customer">
			<image class="bg" src="@/images/dx-tchw.png" mode="widthFix"></image>
			<!-- <view class="h3">提示 <button @click="Close()" class="guan">×</button></view> -->
			<view class="clues">
				<image src="@/images/qiandao.gif" mode="widthFix"></image>
				<text>请先进行签到~</text>
			</view>
			<view class="affirm"><button class="btn btn-qr" @click="Sign()">签到</button></view>
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
	import _login from '@/api/business/login.js';

	var that;
	export default {
		name: "qiandao",
		props: {},

		data() {
			return {
				qd_show: false
			};
		},
		methods: {
			//签到
			Sign: function() {
				_login.SignOrSignOut(true, "", res => {
					console.log("签到结果：", res);
					if (res.code) {
						util.simpleMsg("签到成功！");
						let data = JSON.parse(res.data);
						if (data.sql) {
							_login.SignOrSignOutSql(data.sql, res => {
								if (res.OPENFLAG == 1) {
									console.log("签到成功，新状态为：", res.OPENFLA);
									that.qd_show = false;
									setTimeout(r => {
										that.$emit("GetSignOut"); //触发首页的日结数据 搜搜
									}, 1500)
								}
							});
						}
					} else {
						util.simpleMsg(res.msg, "none");
						let store = util.getStorage("store");
						console.log("签到错误的信息：", store.OPENFLAG);
						if (store.OPENFLAG == 1) {
							that.qd_show = false;
							setTimeout(r => {
								that.$emit("GetSignOut"); //触发首页的日结数据 搜搜
							}, 1500)
						}
					}
				})
			},
		},
		created: function() {
			that = this;
			// let store = util.getStorage("store");
			// if (store) {
			// 	if (store.OPENFLAG != 1) {
			// 		that.qd_show = true;
			// 	}
			// }
		}
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
