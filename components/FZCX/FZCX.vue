<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>
<template>
	<!-- <view class="boxs"> -->
	<!-- 辅助促销数据 -->
	<view class="meminfo" style="padding-top: 30px;">
		<text class="tishi">提示：{{FZCXRes.msg}}</text>
		<!-- <button class="close" @click="Close()" style="z-index: 99;">×</button> -->
		<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
		<view class="fuzhu">
			<view v-for="(item,index) in FZCXDatas">
				<view class="member">
					<label class="h9">{{item.CXZT}}<!-- 武汉满20元赠小号手提袋 --></label>
					<!-- <button @click="Close">×</button> -->
				</view>
				<view class="shoppbag">
					<view :class="item1.BQTY>0?'baglist curr':'baglist'" v-for="(item1,index1) in item.Details">
						<view class="bag">
							<view class="h8"><text>{{item1.SNAME}}</text> <text>售价：￥{{item1.PRICE}}</text></view>
							<label><text>说明</text><em>{{item1.DESCRIBE}}</em></label>
						</view>
						<view class="quantit">
							<view class="hhs">
								<text>可赠数量：{{item1.CZQTY}}</text>
								<text>数量</text>
							</view>
							<view class="nums">
								<text @click="Calculate(item1,-1)">-</text>
								<input disabled="true" v-model="item1.BQTY" />
								<text @click="Calculate(item1,1)">+</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="affirm">
			<button class="btn btn-hk" @click="Close()">取消</button>
			<button class="btn" @click="Confirm()">确定</button>
		</view>
	</view>
	<!-- </view> -->
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
		name: "FZCX",
		props: {
			_FZCXDatas: Object,
			_sale: Object
		},
		data() {
			return {
				FZCXDatas: [],
				FZCXDatasOld: [],
				FZCXRes: {
					msg: "已添加0个特殊商品预计额外支付：0元",
					data: [],
					count: 0,
					payAmount: 0
				}
			}
		},
		created: function() {
			that = this;
			that.FZCXDatas = that._FZCXDatas.oval;
			console.log("传入的辅助促销数据：", that.FZCXDatas);
			//如果之前选择过 则再赋值
			// if (that._FZCXDatas && that._FZCXDatas.cval) {
			// 	this.FZCXRes = that._FZCXDatas.cval;
			// }
			that.FZCXDatasOld = JSON.parse(JSON.stringify(that._FZCXDatas.oval));
		},
		methods: {
			Calculate: function(item, type) {
				if (type > 0 && item.XX_QTY4 && item.BQTY >= item.XX_QTY4) {
					util.simpleMsg("已达到该赠品上限：" + item.XX_QTY4, "none");
					return;
				}
				item.BQTY = Number(item.BQTY) + type;
				if (item.BQTY < 0) {
					item.BQTY = 0;
				}
				that.CalFZCX(); //实时计算促销结果

				console.log("数量给变化", item);
			},
			//计算促销的应付金额和折扣额
			CalFZCX: function() {
				let Arr = [];
				that.FZCXDatas.forEach(r => {
					let arr = r.Details.filter(r1 => {
						return r1.BQTY > 0;
					})
					Arr = Arr.concat(arr);
				})
				if (Arr.length > 0) {
					Arr = Arr.sort((a, b) => {
						return b.PRICE - a.PRICE
					});
					that.FZCXRes = _main.CalFZCX(Arr, that._sale);
				} else {
					that.FZCXRes = {
						msg: "已添加0个特殊商品预计额外支付：0元",
						data: [],
						count: 0,
						payAmount: 0
					};
				}
				console.log("售价排序后的促销商品：", that.FZCXRes);
			},
			//关闭辅助促销
			Close: function() {
				console.log("取消辅助促销");
				uni.$emit("close-FZCX", {}); //返回一个空对象
			},
			//确认辅助促销
			Confirm: function() {
				console.log("确认辅助促销");
				uni.$emit("close-FZCX", that.FZCXRes);
			}
		}
	}
</script>

<style>
	.meminfo {
		position: fixed;
		right: 0;
		width: 61%;
		z-index: 9889;
		height: 96%;
	}

	.fuzhu {
		height: 84%;
		overflow: auto;
	}

	.meminfo .close {
		position: absolute;
		top: 2%;
		right: 1%;
	}

	.member {
		padding: 1% 4%;
	}

	.affirm {
		width: 94%;
		padding: 2% 3%;
		margin: 0 auto;
		display: flex;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 9999;
		background-color: #fff;
	}

	.affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.tishi {
		font-size: 26rpx;
		font-weight: 700;
		color: #FE694B;
		padding: 0 4%;
	}

	.bag .h8 {
		width: 100%;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}
	.bag .h8 text:nth-child(1){
		font-weight: 700;
		max-width: 70%;
		overflow: auto;
	}
	.bag .h8 text {
		font-weight: 400;
	}
</style>
