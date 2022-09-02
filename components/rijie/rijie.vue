<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
		<view class="customer" v-if="rj_sf">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<view class="h3">日结 <button @click="Close()" class="guan">×</button></view>
			<view class="clues">
				<image src="@/images/rijie.png" mode="widthFix"></image>
				<text>您确定当前要进行日结操作吗？</text>
			</view>
			<view class="affirm">
				<button class="btn btn-hk" @click="Close()">取消</button>
				<button class="btn" @click="ToSignOut()">确定</button>
			</view>
		</view>
		<view class="customer" v-if="rj_cg">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<view class="h3">日结 <button @click="Close()" class="guan">×</button></view>
			<view class="clues">
				<image src="@/images/rijie.png" mode="widthFix"></image>
			</view>
			<label class="rjcg">日结成功</label>
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
		name: "rijie",
		props: {
			_rj_show: Boolean,
			_signOutDate: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				rj_show: false,
				rj_sf: true,
				rj_cg: false,
				signOutDate: []
			};
		},
		watch: {
			_rj_show: (n, o) => {

			},
			_signOutDate: (n, o) => {
				console.log("日结数据变化：",n);
				if (n.length > 0) {
					that.signOutDate = that._signOutDate;
				}
			}
		},
		methods: {
			Close: function() {
				//通知父组件关闭日结
				console.log("通知父组件关闭日结事件");
				that.$emit("CloseRJ", {});
			},
			//去签退
			ToSignOut: function(e) {
				that.rj_sf = false;
				that.rj_cg = true;
			},
			//签到
			Sign: function() {
				_login.SignOrSignOut(false, res => {
					console.log("签到结果：", res);
					if (res.code) {
						util.simpleMsg("签到成功！");
						let data = JSON.parse(res.data);
						if (data.sql) {
							_login.SignOrSignOutSql(data.sql);
						}
						that.qd_show = false;
					} else {
						util.simpleMsg(res.msg, "none");
					}
				})
			},
		},
		created: function() {
			that = this;
			that.rj_show = that._rj_show;
			that.signOutDate = that._signOutDate;
			console.log("进入日结组件")
		}
	}
</script>

<style>
	.customer {
		background-color: #fff;
		width: 40%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 3% 140rpx;
	}

	.customer .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
	}

	.customer .h3 {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 34rpx;
		border-bottom: 1px dashed #eee;
		position: relative;
		z-index: 2;
		font-weight: 700;
	}

	.customer .h3 .guan {
		float: right;
		background: none;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: right;
		padding: 0;
		width: 60rpx;
	}

	.affirm {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 2%;
	}

	.affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.clues {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		line-height: 140rpx;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
		font-weight: 700;
	}

	.clues image {
		margin: 2% 0 0 4%;
	}

	.rjcg {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 100rpx;
		color: #006B44;
		font-weight: 700;
		font-size: 40rpx;
	}
</style>
