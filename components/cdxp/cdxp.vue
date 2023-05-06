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
										<view class="critlist"><text>销售类别：</text>
											<!-- <view class="xslb"> -->
											<picker range-key="NAME" mode="selector" :range="xstypes" @change="Change"
												@cancel="Cancel">
												<view
													style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
													{{ current_data.NAME }}
												</view>
											</picker>
											<!-- </view> -->
										</view>
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
						<button class="close" @click="CloseCD">×</button>
					</view>
					<NoData v-if="Datas.length==0"></NoData>
					<!-- 小类循环 -->
					<view class="products" v-else>
						<view class="procycle">
							<view class="li" v-for="item in Datas">
								<view class="h3">
									<text>单号：{{item.BILL}}</text>
									<text class="price">￥{{item.TNET}}</text>
									<!-- 预定提取的单展示整单金额 -->
								</view>
								<view class="cods">
									<label>销售日期：{{item.SALEDATE}}</label>
									<label>出售时间：{{item.SALETIME}}</label>
								</view>
								<view class="cods">
									<label>订单类型：{{xsTypeName(item.XSTYPE,item.BILL_TYPE,item.KQXSTYPE)}}</label>
									<label>条目：{{ (item.TLINE =='' || item.TLINE == null) ? 1 : item.TLINE}}</label>
								</view>
								<view class="handles"><text></text>
									<button class="btn" @click="ConfirmCD(item)">重新打印</button>
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
		name: "cdxp",
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
				qrCodeWidth: 256, //二维码宽
				qrCodeHeight: 256, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				POS_XSBILLPRINT: [], //重打查询数据集合
				Datas: [],
				Criterias: false,
				p_date: dateformat.getYMD(),
				p_bill: "",
				p_xsType: "", //销售类别
				xstypes: [],
				current_data: {
					"TYPE": 1,
					"NAME": "销售"
				},
				current_index: 0,
				init: 1
			};
		},
		created: async function() {
			that = this;
			this.qd_show = true;
			//获取重打数据
			let xsBillRes = await xprinter_util.getBillPrinterMax();
			this.xsBill = xsBillRes;
			this.GetPTOrder();
		},
		methods: {
			Change: function(e) {
				let index = e.detail.value;
				if (index < this.xstypes.length) {
					this.current_data = this.xstypes[index];
					this.p_xsType = this.xstypes[index];
				}
			},
			Cancel: function() {

			},
			changeDate: e => {
				that.p_date = e.detail.value;
			},
			GetPTOrder: function(e) {
				let store = util.getStorage("store");
				_main.GetPTOrder(store.KHID, that.p_bill, that.p_date, that.current_data.TYPE,
					res => {
						if (res.code && res.msg.length > 0) {
							that.Datas = res.msg;
							if (e) {
								util.simpleMsg("查询成功");
							}
						} else {
							that.Datas = [];
							util.simpleMsg("暂无数据", true);
						}
					})
			},
			ShowSearch: function() {
				that.Criterias = !that.Criterias;
				if (!that.Criterias) {
					that.p_bill = "";
					that.p_date = dateformat.getYMD();
				}
			},
			Empty: function() {
				that.p_bill = "";
				that.p_date = dateformat.getYMD();
			},
			Search: function() {
				that.GetPTOrder(1);
			},
			//重打小票
			ConfirmCD: async function(data) {
				let that = this;
				console.log("重打小票 ConfirmCD =======", data);
				let xsBill = cx_util.snvl(data.BILL,"");
				let xsType = cx_util.snvl(data.XSTYPE,"");
				let bill_type = cx_util.snvl(data.BILL_TYPE,"");
				let kqxstype = cx_util.snvl(data.KQXSTYPE,"");
				let bill = cx_util.snvl(xsBill, "");
				
				if (cx_util.IsEmpty(bill)) {
					util.simpleMsg("小票单号不能为空!", true);
					return;
				}
				//通过单号，查询重打格式数据
				let pos_xsbillprint = await xprinter_util.getBillPrinterData(xsBill);	
				if (cx_util.IsEmpty(pos_xsbillprint)) {
					util.simpleMsg("未查询到重打数据", "none");
					return;
				}
				this.$emit("ClosePopup");
				
				//判断是否需要打印二维码
				let is_fpQRCode = 0;
				if(xsType == "1" && bill_type == "Z101") { 
					is_fpQRCode = "1";
				}else if(xsType == "3" && bill_type == "Z121"){
					is_fpQRCode = "1" ;
				}else if(xsType == "1" && bill_type == "Z111" 
					&& (kqxstype == "CZ" || kqxstype == "SKCZ" || kqxstype == "SK" || kqxstype == "SQ")){
					is_fpQRCode = "1";
				}
				//is_qrCode = 1 打印二维码
				that.$refs.printerPage.againPrinter(bill, is_fpQRCode, data, cx_util.snvl(pos_xsbillprint));
			},
			//重打小票关闭
			CloseCD: function(data) {
				this.$emit("ClosePopup");
			},
			xsTypeName: function(xstype, bill_type,kqxstype) {
				switch (xstype) {
					case "1":
					//整合卡券业务，增加条件判断展示业务类型
					if(bill_type == 'Z111' && kqxstype == 'SQ')
						return "券销售";
                    else if(bill_type == 'Z111' && kqxstype == 'SKCZ')
						return "卡激活充值";		
					else if(bill_type == 'Z111' && kqxstype != 'SKCZ')
						return "卡销售";			
					else
						return "销售";
						break;
					case "2":
						return "销售退货";
						break;
					case "3":
						return "预定";
						break;
					case "4":
						return "预定取消";
						break;
					case "5":
						return "预定提取";
						break;
					case "6":
						return "赊销";
						break;
					case "7":
						return "赊销退货";
						break;
					case "8":
						return "线上订单提取";
						break;
					case "9":
						return "线上订单取消";
						break;
					default:
					if(bill_type == 'Z102')
						return "外卖订单";
					else if(bill_type == 'Z152')
						return "外卖退单";
					else
						return "";
						break;
				}
			}
		},
		mounted() {
			this.xstypes = [
			{
				"TYPE": -1,
				"NAME": "--全部--"
			}, {
				"TYPE": 1,
				"NAME": "销售"
			}, {
				"TYPE": 2,
				"NAME": "销售退货"
			}, {
				"TYPE": 3,
				"NAME": "预定"
			}, {
				"TYPE": 4,
				"NAME": "预定取消"
			}, {
				"TYPE": 5,
				"NAME": "预定提取"
			}, {
				"TYPE": 6,
				"NAME": "赊销"
			}, {
				"TYPE": 7,
				"NAME": "赊销退货"
			}, {
				"TYPE": 0,
				"NAME": "外卖单"
			}, {
				"TYPE": 8,
				"NAME": "线上订单提取"
			}, {
				"TYPE": 9,
				"NAME": "线上订单取消"
			}, {
				"TYPE": 99,
				"NAME": "卡券业务"
			}];
			if (this.init) {
				this.current_data = this.xstypes.find(item => item.TYPE === this.init) ?? {};
			}
		}
	}
</script>

<style>
	.customer {
		background-color: #fff;
		width: 90%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 1% 0rpx;
		z-index: 99;
		box-shadow: 10rpx 20rpx 99rpx 1px rgba(0, 107, 68, 0.25);
		max-height: 86%;
	}
	.commodity{
		background:#fff;
	}
	.products{
		max-height: 1200rpx;
		overflow:auto;
	}
	.procycle .li .h3 {
		display: flex;
		justify-content: space-between;
		color: #333;
		padding-bottom: 12rpx;
	}

	.handles {
		margin-top: 6rpx;
	}

	.handles button {
		width: 200rpx;
	}

	.prolist .products .procycle .li .h3 {
		margin-bottom: 14rpx;
	}

	.li .cods {
		padding: 6rpx 0;
	}

	.hh {
		padding-right: 100rpx;
	}

	.hh .close {
		background: none;
		padding: 0;
		color: #333;
		top: 12rpx;
		right: 1%;
		height: 70rpx;
		border-radius: 50%;
		font-size: 44rpx;
	}

	.hotcakes {
		color: #333;
	}

	.critlist {
		position: relative;
	}

	.critlist .xslb {
		position: absolute;
		top: 64rpx;
		left: 0;
		width: 96%;
		padding: 2% 2% 0;
		background-color: #fff;
		z-index: 9;
		box-shadow: 0px 4rpx 20rpx 2rpx rgba(66, 177, 75, 0.2);
		display: flex;
		flex-direction: column;
		border-radius: 4rpx;
	}

	.critlist .xslb text {
		width: 100%;
		height: 66rpx;
		display: block;
		max-height: 600rpx;
		color: #333;
	}
</style>
