<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/extract.css);
</style>
<template>
	<view class="boxs">
	<view class="content customer">
		<view class="right">
				<view class="commodity">
					<view class="hh">
						<view class="hotcakes">
							<image src="@/images/xianshangdingd.png" mode="widthFix"></image> 重打小票
							<!-- <view class="classifys">
												<text class="curr">全部</text><text>今日</text><text>近三天</text>
											</view> -->
						</view>
						<view>
							<view class="prints">
								<view class="sousuo">
									<label @click="ShowSearch()">
										<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
									</label>
									<view class="criterias" v-if="Criterias" style="z-index: 99999;">
										<view class="critlist"><text>订单号：</text>
											<input type="text" v-model="p_bill" />
										</view>
										<view class="critlist"><text>销售日期：</text>
											<picker mode="date" fields="day" @change="changeDate">
												<view class="uni-input">{{p_date}}</view>
											</picker>
										</view>
										<view class="confs">
											<button class="btn btn-qx" @click="Empty()">清空</button>
											<button class="btn" @click="Search()">查询</button>
										</view>
									</view>
								</view>
								
							</view>
						</view>
						<button class="close">×</button>
					</view>
	
					<!-- <NoData v-if="Orders.length==0"></NoData> -->
					<!-- 小类循环 -->
					 <!-- v-else -->
					<view class="products">
						<!-- <view class="h2">销售退单 <label></label></view>
			-->
						<view class="procycle">
							<view class="li" >
								<view class="h3">
									<text>单号：132323</text>
									<text class="price">￥12</text>
									<!-- 预定提取的单展示整单金额 -->
								</view>
								<view class="cods">
									<label>销售日期：2022-09-09</label>
									<label>出售时间：10：00</label>
								</view>
								<view class="cods">									
									<label>订单类型： 销售</label>
									<label>条目：9</label>
								</view>
								<view class="handles"><text></text>
									<button class="btn" @click="ConfirmCD">重新打印</button>
								</view>
							</view>
							<!-- 订单循环 -->
							<!-- <view class="li" v-for="(item,index) in Orders" :class="curIndex === index? 'curr':' '"
								@click="ChooseOrder(item,index)">
								<view class="h3">
									<text>单号：{{item.BILL}}</text>
									<text class="price">￥{{item.XSTYPE=='销售'?item.TNET:item.ZNET}}</text>
									
								</view>
								<view class="cods">
									<label>{{item.SALEDATE}} {{item.SALETIME}}</label>
									<label>订单类型： {{item.XSTYPE}}</label>
								</view>
								<view class="handles"><text></text>
									<button class="btn" @click="GetOrderDetails(item)">退单</button>
								</view>
							</view> -->
						</view>
					
					</view>
				</view>
		</view>
		
	</view>
	
	<!-- <view class="customer">
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
	</view> -->
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
		background-color: #f9f9f9;
		width: 90%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 1% 140rpx;
		z-index: 99;
		box-shadow: 10rpx 20rpx 99rpx 1px rgba(0,107,68,0.25);
		max-height: 90%;
	}

	.procycle .li .h3{
		display: flex;
		justify-content: space-between;
		color: #333;
		padding-bottom: 12rpx;
	}
	.handles{
		margin-top:6rpx;
	}
	.handles button{
		width:200rpx;
	}
	.prolist .products .procycle .li .h3{
		margin-bottom: 14rpx;
	}
	.li .cods{
		padding:6rpx 0;
	}
	.hh{
		padding-right: 100rpx;
	}
	.hh .close{
		background:none;
		padding:0;
		color: #333;
		top: 12rpx;
		right: 1%;
		height: 70rpx;
		border-radius: 50%;
		font-size: 44rpx;
	}
	.hotcakes{
		color: #333;
	}
</style>
