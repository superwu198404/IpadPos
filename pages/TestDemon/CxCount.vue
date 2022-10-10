<template>
	<view class="body">
		<view>
			<view style="height: 50px;line-height: 50px;">请输入</view>
			<view>
				<input style="border:1px solid gray" type="text"  />
			</view>
		</view>
		<button class="button" hover-class="hover" v-show="false">
			测试
		</button>
		<button class="button" hover-class="hover">
			按钮
		</button>
	</view>
</template>
<script>
	import cxCount from '@/utils/cx/cxCount.js';
	import hy_query from '@/api/hy/hy_query.js';
	var app = getApp();
	var that;

	export default {
		data() {
			return {
				ZKDatas: [],
			}
		},
		methods: {
			onLoad: function() {
				that = this;

				let sale02_arr = [
					{
					    "SPID": "000000001040200044",
					    "SNAME": "奥利奥狂想罐",
					    "QTY": 2,
					    "OPRICE": 22.8,
					    "DISCRATE": 0,
					    "NET": 45.6,
					    "PRICE": 22.8,
					    "NO": 1
					},
					{
					    "SPID": "000000001020200005",
					    "SNAME": "云朵醇味戚风蛋糕",
					    "QTY": 3,
					    "OPRICE": 200,
					    "DISCRATE": 0,
					    "NET": 400,
					    "PRICE": 200,
					    "NO": 2
					},
					];
				cxCount.Createcx(sale02_arr, "sale",hy_query.hyinfoModel);
			},
			CreateArr1: e => {
				let arr = [],
					obj = {};
				e.map((r, i) => {
					obj[r] = i
				})
				arr.push(obj);
				return arr;
			},

		}
	}
</script>
<style>
	.button {
		margin-top: 20px;
		width: 90%;
		background-color: #54bec2;
		color: white;
		border-radius: 98rpx;
		background: bg_red;
	}

	/* 按下变颜色 */
	.hover {
		background: #dcdcdc;
	}
</style>