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
						"SPID": "000000001090100415",
						"SNAME": "爱恋草莓6号-仟吉",
						"QTY": 1,
						"OPRICE": 139,
						"DISCRATE": 0,
						"NET": 139,
						"PRICE": 139,
						"NO": 1
					},
					{
						"SPID": "000000001070600008",
						"SNAME": "(10盎司)芒果酸奶",
						"QTY": 3,
						"OPRICE": 15,
						"DISCRATE": 0,
						"NET":15,
						"PRICE": 15,
						"NO": 2
					},
					{
					    "SPID": "000000001040200044",
					    "SNAME": "奥利奥狂想罐",
					    "QTY": 2,
					    "OPRICE": 22.8,
					    "DISCRATE": 0,
					    "NET": 45.6,
					    "PRICE": 22.8,
					    "NO": 3
					}
					];
				cxCount.Createcx(sale02_arr);
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