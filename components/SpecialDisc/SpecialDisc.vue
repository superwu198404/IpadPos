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
						特殊折扣选择
					</view>
					<view class="uls">
						<view class="lis curr">
							<view class="h8">
								<view>标准折扣<em></em></view>
								<!-- <label>总折扣额:<text>￥566</text></label> -->
								<span>已选</span>
							</view>
							<view class="discount">
								<label
									v-for="(item,index) in ZKDatas.filter(r=>{return r.ZKTYPE=='ZD02'})">{{item.ZKNAME}}，满<span>{{item.MZNET}}</span>打<span>{{(item.ZKQTY_JS*10).toFixed(1)}}折</span></label>
								<!-- <label>·02 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·03 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label> -->
								<view v-for="(item,index) in ZKDatas.filter(r=>{return r.ZKTYPE=='ZD03'})">
									<label>
										<checkbox></checkbox>临时折扣
									</label>
									<text>满¥{{item.MZNET}}即打{{(item.ZKQTY_JS*10).toFixed(1)}}折</text>

								</view>
							</view>
						</view>
						<view class="lis" v-if="DKFZKDatas.length>0">
							<view class="h8">
								<view>特批折扣<em></em></view>
								<span>已选</span>
							</view>
							<view class="discount">
								<view>
									<label
										v-for="(item,index) in DKFZKDatas">{{item.SPJGZ}}，打<span>{{(item.BFB*10).toFixed(1)}}折</span></label>
								</view>
							</view>
						</view>
						<view class="confirm">
							<button class="btn btn-qx" @click="CloseZK()">取消</button><button class="btn" @click="ConfirmZK()">确 认</button>
						</view>
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
		props: {
			dkhid: String
		},
		data() {
			return {
				curZKType: "", //BZ lS TP
				DQID: util.getStorage("store").DQID,
				DKFID: util.getStorage("store").DKFID,
				JGID: util.getStorage("store").JGID,
				ZKDatas: [],
				DKFZKDatas: [],
				curZK: {}
			};
		},
		created: function() {
			that = this;
			that.GetZKDatas(that.curZKType);
			let store = util.getStorage("store");
			// if (store.DKFID && store.DKFID != '80000000') {
			if (that.dkhid) {
				that.DKFID = that.dkhid;
				that.GetZKDatas('TP');
			}
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
					zktype: type,
					dqid: that.DQID,
					spjgz: "",
					dkhid: that.DKFID, //测试使用 "0020004824"
					jgid: that.JGID
				};
				_main.GetZKDatas(data, res => {
					console.log("折扣数据获取结果：", res);
					if (res.code) {
						if (type == 'TP') {
							that.DKFZKDatas = JSON.parse(res.data);
						} else {
							that.ZKDatas = res.msg;
						}
					} else {
						if (type == 'TP') {
							that.DKFZKDatas = [];
						} else {
							that.ZKDatas = [];
						}
						util.simpleMsg("暂无数据", true);
					}
					console.log("页面折扣数据：", that.ZKDatas);
					console.log("页面折扣数据1：", that.DKFZKDatas);
				})
			},
			//确认折扣
			ConfirmZK: function() {

			},
		}
	}
</script>

<style>
.special .confirm .btn{
	width:30%;
	margin:0 2%;
}
</style>
