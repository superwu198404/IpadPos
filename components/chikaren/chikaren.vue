<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs" v-if="show">
	<view class="customer">
		<image class="bg" src="@/images/dx-tchw.png" mode="widthFix"></image>
		<view class="h3">录入持卡人信息 <button @click="ConfirmScan()" class="guan">×</button></view>
		<view class="clues">
			<text>姓名：</text>
			<label>
			<input type="text" placeholder="请输入姓名" v-model="teacherName" focus="true" />
			<button v-if="emptys" @click="inputempty()">×</button>
			</label>
		</view>
		<view class="clues">
			<text>手机号：</text>
			<label><input text="number" pattern="[0-9]*" v-model="phone" placeholder="请输入手机号"  />
			<button v-if="emptys">×</button></label>
		</view>
		<view class="clues">
			<text>身份证号：</text>
			<label><input type="text" :value="searchshenfen" placeholder="请输入身份证号" />
			<button v-if="emptys">×</button></label>
		</view>
		<view class="affirm">
			<button class="btn btn-hk" @click="ConfirmScan()">取消</button>
			<button class="btn" @click="ConfirmScan()">确定</button>
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
	import _login from '@/api/business/login.js';
	import _main from '@/api/business/main.js';

	var that;
	export default {
		name: "chikaren",
		props: {
			show: Boolean
		},
		data() {
			return {
				emptys: false,
			};
		},
		created: function() {
			that = this;
		},
		methods: {
			
			
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
		padding: 0 3% 220rpx;
		z-index: 99;
		box-shadow: 10rpx 20rpx 99rpx 1px rgba(0,107,68,0.25);
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
		padding-bottom: 2%;
	}

	.affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.clues {
		display: flex;
		justify-content: start;
		align-items: center;
		line-height: 80rpx;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
		margin:50rpx 0 0;
	}
	.clues text{
		width:162rpx;
	}
	.clues label {
		background-color: #F9f9f9;
		height: 70rpx;
		line-height: 70rpx;
		border:1px solid #eee;
		width:79%;
		border-radius: 6rpx;
		padding:0 0.5%;
		display: flex;
		align-items: center;
	}
	.clues label input{
		width:90%;
		height: 70rpx;
		line-height: 70rpx;
		padding:0 10rpx;
	}
	.clues label button{
		width: 32rpx;
		height: 32rpx;
		background: #98C3B3;
		border-radius: 50%;
		font-size: 18rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding:0;
		color: #fff;
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
