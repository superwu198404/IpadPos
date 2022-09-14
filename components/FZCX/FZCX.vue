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
					<button @click="Close">×</button>
				</view>
				<view class="shoppbag">
					<view class="baglist curr" v-for="(item1,index1) in item.Details">
						<view class="bag">
							<text class="h8">{{item1.SNAME}}</text>
							<label><text>{{item1.DESCRIBE}}</text></label>
						</view>
						<view class="quantit">
							<text>数量</text>
							<view class="nums">
								<text @click="Calculate(item1,'-')">-</text>
								<input type="number" v-model="item1.BQTY" @blur="Calculate(item1,'*',$event)" />
								<text @click="Calculate(item1,'+')">+</text>
							</view>
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
		name: "FZCX",
		props:{
			_FZCXDatas:Array,
		}
		data() {
			return {
				FZCXDatas: []
			}
		},
		created: function() {
			that = this;
		},
		methods: {
			Calculate: function() {

			}
		}
	}
</script>

<style>

</style>
