<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
		<!-- <view class="customer" v-if="rj_sf">
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
		</view> -->
		<!-- 选择日结 -->
		<view class="customer" v-if="rj_xz">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<!-- <view class="h3">日结 <button @click="Close()" class="guan">×</button></view> -->
			<view class="h6">当前你有以下日期没有做日结操作</view>
			<view class="cluelist">
				<view :class="index==curIndex?'list curr':'list'" v-for="(item,index) in signOutDate"
					@click="ChooseRJ(item,index)"><label>{{item}}</label><text>未日结</text></view>
				<!-- <view class="list"><label>2022-09-02</label><text>未日结</text></view> -->
			</view>
			<view class="affirm">
				<!-- <button class="btn btn-hk" @click="Close()">取消</button> -->
				<button class="btn" @click="ConfirmRJ()">确定</button>
			</view>
		</view>
		<view class="customer" v-if="rj_cg">
			<image class="bg" src="../../images/dx-tchw.png" mode="widthFix"></image>
			<!-- <view class="h3">日结 <button @click="Close()" class="guan">×</button></view> -->
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
				rj_sf: false,
				rj_xz: true,
				rj_cg: false,
				signOutDate: [],
				curIndex: 0,
				qtdate: ""
			};
		},
		watch: {
			_rj_show: (n, o) => {

			},
			_signOutDate: (n, o) => {
				console.log("日结数据变化：", n);
				if (n.length > 0) {
					that.signOutDate = that._signOutDate;
					that.qtdate = that.signOutDate[that.curIndex];
				}
			}
		},
		methods: {
			Close: function() {
				//通知父组件关闭日结
				console.log("通知父组件关闭日结事件");
				that.curIndex = 0;
				that.rj_sf = false;
				that.rj_xz = true;
				that.rj_cg = false;
				that.signOutDate = [];
				that.$emit("CloseRJ", {});
			},
			//去签退
			ToSignOut: function(e) {
				that.rj_sf = false;
				that.rj_xz = true;
				that.rj_cg = false;
			},
			//选择日结日期
			ChooseRJ: (e, i) => {
				that.qtdate = e;
				that.curIndex = i;
			},
			//选中日结日期
			ConfirmRJ: e => {
				console.log("即将日结的数据：", that.qtdate);
				if (that.qtdate) {
					_login.SignOrSignOut(false, that.qtdate, res => {
						console.log("日结结果：", res);
						if (res.code) {
							util.simpleMsg("日结成功！");
							let data = JSON.parse(res.data);
							if (data.sql) {
								_login.SignOrSignOutSql(data.sql);
							}
							that.signOutDate.splice(that.curIndex, 1); //删除日结了日期
							if (that.signOutDate.length > 0) {
								util.simpleMsg("日结成功！");
								that.curIndex = 0; //归0
								that.qtdate = that.signOutDate[that.curIndex];
							} else {
								that.rj_sf = false;
								that.rj_xz = false;
								that.rj_cg = true;
							}
						} else {
							util.simpleModal("提示", res.msg);
						}
					})
				} else {
					util.simpleMsg("请选择日期", true);
				}
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
		width: 48%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 2% 140rpx;
	}

	.customer .bg {
		position: absolute !important;
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

	.customer .h6 {
		color: #FE694B;
		line-height: 80rpx;
		font-size: 32rpx;
		font-weight: 600;
		position: relative;
		z-index: 9;
	}

	.cluelist {
		display: flex;
		flex-wrap: wrap;
	}

	.cluelist .list {
		width: 22.5%;
		margin: 0 1% 2%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2% 0;
		font-weight: 600;
		border: 2rpx solid #98C3B3;
		border-radius: 14rpx;
		font-size: 28rpx;
		line-height: 50rpx;
	}

	.cluelist .list.curr {
		border-color: #006B44;
		color: #006B44;
	}

	.cluelist .list.curr text {
		color: #006B44;
	}

	.cluelist .list text {
		font-size: 26rpx;
		color: #B0b0b0;
		line-height: 50rpx;
		font-weight: 400;
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
		padding: 1% 0;
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
