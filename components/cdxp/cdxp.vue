<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
	<!--  -->
	<view class="customer">
		<image class="bg" src="@/images/dx-tchw.png" mode="widthFix"></image>
		<view class="h3">重打小票 <button @click="CloseCD" class="guan">×</button></view>
		<view class="clues">
			<view class="infors">
				<text>销售日期：</text>
				<picker mode="date" fields="day" @change="dateChange">
					<view style="width:100%;"></view>
				</picker>
			</view>
			<view class="infors">
				<text>小票单号：</text>
				<input type="text" placeholder="请输入小票号" @confirm="ConfirmCD" v-model="xsBill" focus="true" />
			</view>
		</view>
		<view class="affirm">
			<button class="btn btn-hk" @click="CloseCD">取消</button>
			<button class="btn" @click="ConfirmCD">确定</button>
		</view>
	</view>
	<PrinterPage ref="printerPage" style="display: none;"></PrinterPage>
	<!-- 画布 -->
	<view class="canvasdiv" :style="'visibility:hidden;'">
		<canvas canvas-id="couponQrcode" class="canvas"
			:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>
		<canvas canvas-id="canvasLogo" class="canvas"
			:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
		<canvas canvas-id="canvasXPEWM" class="canvas"
			:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>
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
	import PrinterPage from '@/pages/xprinter/receipt';
	import cx_util from '@/utils/cx/cx_common.js';
	import xprinter_util from '@/utils/xprinter/util.js';
	import {
		RequestSend
	} from '@/api/business/da.js';
	
	var that;
	export default {
		name: "saomaqiang",
		props: {
			TH_DATE: "",
		},
		components: {
			PrinterPage
		},
		data() {
			return {
				xsBill: "",
				qd_show: true,
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 200, //二维码宽
				qrCodeHeight: 200, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				POS_XSBILLPRINT: [], //重打查询数据集合
			};
		},
		created : async function(){
			this.qd_show = true;
			let xsBillRes = await xprinter_util.getBillPrinterMax();
			console.log("获取重打数据 111",xsBillRes);
			this.xsBill = xsBillRes;
		},
		methods: {
			dateChange: e => {
				that.Order.TH_DATE = e.detail.value;
				that.Order.THDATE = that.Order.TH_DATE + ' ' + that.Order.TH_TIME;
			},
			timeChange: e => {
				that.Order.TH_TIME = e.detail.value;
				that.Order.THDATE = that.Order.TH_DATE + ' ' + that.Order.TH_TIME;
			},
			//重打小票
			ConfirmCD: function(data) {
				let that = this;
				let bill = cx_util.snvl(that.xsBill,"");
				if(bill == ""){
					util.simpleMsg("小票单号不能为空!", true);
					return;
				}
				this.$emit("ClosePopup");
				that.$refs.printerPage.againPrinter(bill);
			},
			//重打小票关闭
			CloseCD: function(data) {
				// this.qd_show = false;
				this.$emit("ClosePopup");
			},
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
		flex-direction: column;
		justify-content: start;
		align-items: center;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
		padding:40rpx 0 0;
	}
	.clues .infors{
		width:100%;
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}
	.clues input,.clues picker{
		height: 70rpx;
		line-height: 70rpx;
		border:1px solid #aaa;
		width:65%;
		border-radius: 6rpx;
		padding:0 0.5%;
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
