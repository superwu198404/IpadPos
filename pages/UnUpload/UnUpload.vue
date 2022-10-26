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
				<image src="../../images/dx-zhekou.png" mode="widthFix"></image> 未上传单据
			</view>
			<view>
				<view class="prints">
					<view class="sousuo" @click="GetUnLoad(true)">
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
					<NoData v-if="UnLoadDatas.length==0"></NoData>
					<view class="lis" v-else v-for="(item,index) in UnLoadDatas">
						<view class="protheme">
							<image src="../../images/dakehu-xz.png" mode="widthFix"></image>
							<view class="themes">
								<view class="h8">单号：{{item.STR1}}</view>
								<label><text>单据类型</text>{{item.YW_NAME}}</label>
							</view>
						</view>
						<label class="eventdate">单据日期：<text>{{item.BDATE}}</text><button
								@click="Upload(item)">上传</button></label>
					</view>
				</view>

				<!-- <view class="confirm">
				<button class="btn" @click="showUnLoadData=false">确 认</button>
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
				showUnLoadData: false,
				UnLoadDatas: [],
			}
		},
		created: function(res) {
			that = this;
			that.GetUnLoad();
		},
		methods: {
			onLoad: function() {
				that = this;
			},
			Close: function() {
				uni.$emit('tools', 'communication');
			},
			GetUnLoad: function(e) {
				_main.GetUnLoad(res => {
					console.log("获取成功:", res);
					that.UnLoadDatas = res;
					that.showUnLoadData = true;
					if (e) {
						util.simpleMsg("刷新成功");
					}
				})
			},
			//单据上传
			Upload: function(e) {
				if (e) {
					common.TransLite(e.STR1); //直接传输数据
				}
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
</style>
