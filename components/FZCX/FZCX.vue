<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
		<!-- 辅助促销数据 -->
		<view class="meminfo">
			<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
			<view v-for="(item,index) in FZCXDatas">
				<view class="member">
					<label class="h9">{{item.CXZT}}<!-- 武汉满20元赠小号手提袋 --></label>
					<!-- <button @click="Close">×</button> -->
				</view>
				<view class="shoppbag">
					<view class="baglist curr" v-for="(item1,index1) in item.Details">
						<view class="bag">
							<text class="h8">{{item1.SNAME}}</text>
							<label>说明<text>{{item1.DESCRIBE}}</text></label>
						</view>
						<view class="quantit">
							<text>数量</text>
							<view class="nums">
								<text @click="Calculate(item1,-1)">-</text>
								<input disabled="true" v-model="item1.BQTY" />
								<text @click="Calculate(item1,1)">+</text>
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
		name: "FZCX",
		props: {
			_FZCXDatas: Array,
		},
		data() {
			return {
				FZCXDatas: [],
				FZCXDatasOld: [],
			}
		},
		created: function() {
			that = this;
			that.FZCXDatas = that._FZCXDatas;
			that.FZCXDatasOld = JSON.parse(JSON.stringify(that._FZCXDatas));
		},
		methods: {
			Calculate: function(item, type) {
				item.BQTY = Number(item.BQTY) + type;
				if (item.BQTY < 0) {
					item.BQTY = 0;
				}
				console.log("数量给变化", item);
			},
			//关闭辅助促销
			Close: function() {
				console.log("旧版本数据：", that.FZCXDatasOld);
				that.FZCXDatas = that.FZCXDatasOld;
				uni.$emit("close-FZCX", []);
			},
			//确认辅助促销
			Confirm: function() {
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
				}
				console.log("售价排序后的促销商品：", Arr);
				uni.$emit("close-FZCX", Arr);
			}
		}
	}
</script>

<style>

</style>
