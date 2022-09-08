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

				let sale02_arr = [{
							"SPID": "000000001040200004", //商品编码
							"SNAME": "水果沙拉", //商品名称
							"QTY": 5, //数量
							"OPRICE": 18.8, //商品原单价
							"DISCRATE": 0,//单商品折扣价
							"NET": 56.4, //单商品折扣后的总价
							"PRICE": 11.28, //单个商品折扣后的价
							"NO": 1 //排序
						},
						{
							"SPID": "000000001040200003",
							"SNAME": "礼盒2号",
							"QTY": 10,
							"OPRICE": 19.8,
							"DISCRATE": 0,
							"NET": 174.24,
							"PRICE": 17.42,
							"NO": 2
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