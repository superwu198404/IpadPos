<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);

	.prolist {
		width: 100%;
	}
</style>

<template>
	<view class="commodity" style="position: relative;">
		<view class="hh">
			<view class="hotcakes">
				<image src="../../images/dx-zhekou.png" mode="widthFix"></image> 促销活动
			</view>
			<view>
				<view class="prints">
					<view class="sousuo" @click="GetMDCXHD(true)">
						<image src="../../images/shuaxin.png" mode="widthFix"></image>刷新
					</view>
					<!-- <view class="sousuo" @click="Close">
						X 关闭
					</view> -->
				</view>
			</view>
			<button class="close" @click="Close">×</button>
		</view>
		<view class="products">
			<view class="commods">
				<view class="uls">
					<NoData v-if="MDCXDatas.length==0"></NoData>
					<view class="lis" v-else v-for="(item,index) in MDCXDatas">
						<view class="protheme">
							<image src="../../images/dakehu-xz.png" mode="widthFix"></image>
							<view class="themes">
								<view class="h8">{{item.CXZT}}</view>
								<label><text>顾客范围</text>{{item.CXRY}}</label>
							</view>
						</view>
						<label class="eventdate">活动日期：<text>{{item.SDATE}} 至 {{item.EDATE}}</text></label>
					</view>
				</view>

				<!-- <view class="confirm">
				<button class="btn" @click="showMDCXData=false">确 认</button>
			</view> -->
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
	import _msg from '@/api/business/message.js';
	import _main from '@/api/business/main.js';

	var that;
	export default {
		data() {
			return {
				showMDCXData: false,
				MDCXDatas: [],
			}
		},
		created: function(res) {
			that = this;
			that.GetMDCXHD();
		},
		methods: {
			onLoad: function() {
				that = this;
			},
			Close: function() {
				uni.$emit('tools', 'promotions');
			},
			GetMDCXHD: function(e) {
				_main.GetMDCXHD(null, res => {
					console.log("获取成功:", res);
					that.MDCXDatas = res;
					that.showMDCXData = true;
					if (e)
						util.simpleMsg("获取成功");
				})
			}
		}
	}
</script>

<style>
	.products {
		height: 92%;
		overflow: auto;
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

	.commods .uls {
		display: flex;
	}

	.commods .uls .lis {
		width: 43%;
	}

	.uls .lis .protheme .themes {
		width: 70%;
	}

	.uls .lis .protheme .themes .h8 {
		max-width: 100%;
	}
</style>
