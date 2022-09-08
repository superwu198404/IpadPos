<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<qiandao @GetSignOut="GetSignOutInWeek"></qiandao>
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
			return {};
		},
		methods: {
			onLoad: function() {
				that = this;
			},
			GetSignOutInWeek: function() {
				let store = util.getStorage("store");
				if (store.OPENFLAG == 1) {
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
