<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>
<template>
	<view>
		<!-- 特殊折扣 -->
		<view class="boxs">
			<view class="popup special">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="commods" style="padding-top:26rpx;">
					<view class="h3">
						特殊折扣选则<button class="close" @click="CloseZK()">×</button>
					</view>
					<view class="uls">
						<view class="lis curr">
							<view class="h8">
								<view>标准折扣<em></em></view>
								<label>总折扣额:<text>￥566</text></label>
								<span>已选</span>
							</view>
							<view class="discount">
								<label>·01 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·02 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·03 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<view>
									<label>
										<checkbox></checkbox>临时折扣
									</label>
									<text>满¥1000即打9折，折扣额¥123</text>
								</view>
							</view>
						</view>
						<view class="lis">
							<view class="h8">
								<view>特批折扣<em></em></view>
								<span>已选</span>
							</view>
							<view class="discount">
								<label>·01 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·02 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·03 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
							</view>
						</view>
					</view>
					<view class="confirm">
						<button class="btn" @click="ConfirmZK()">确 认</button>
					</view>
				</view>
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
		name: "SpecialDisc",
		data() {
			return {
				curZKType: "BZ",//BZ lS TP
				DQID: util.getStorage("store").DQID,
				DKFID: util.getStorage("store").DKFID,
				JGID: util.getStorage("store").JGID,
				ZKDatas: [],
				curZK: {}
			};
		},
		created: function() {
			that = this;
			that.GetZKDatas();
		},
		methods: {
			CloseZK: function() {
				uni.$emit('close-tszk', that.curZK);
			},
			//折扣类型切换事件
			ChangeZK: e => {
				that.curZKType = e.detail.value;
				that.GetZKDatas();
			},
			//获取并展示门店促销活动
			GetZKDatas: function(type) {
				let data = {
					zktype: that.curZKType,
					dqid: that.DQID,
					spjgz: "",
					dkhid: that.DKFID, //"0020004824", //测试使用
					jgid: that.JGID
				};
				_main.GetZKDatas(data, res => {
					console.log("折扣数据获取结果：");
					if (res.code) {
						if (that.curZKType == 'TP') {
							that.ZKDatas = JSON.parse(res.data);
						} else {
							that.ZKDatas = res.msg;
						}
					} else {
						that.ZKDatas = [];
						util.simpleMsg("暂无数据", true);
					}
				})
			},
			//确认折扣
			ConfirmZK: function() {

			},
		}
	}
</script>

<style>

</style>
