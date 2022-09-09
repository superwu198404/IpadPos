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

				// let sale02_arr = [{
				// 			"SPID": "000000001040200004", //商品编码
				// 			"SNAME": "水果沙拉", //商品名称
				// 			"QTY": 5, //数量
				// 			"OPRICE": 18.8, //商品原单价
				// 			"DISCRATE": 0,//单商品折扣价
				// 			"NET": 56.4, //单商品折扣后的总价
				// 			"PRICE": 11.28, //单个商品折扣后的价
				// 			"NO": 1 //排序
				// 		},
				// 		{
				// 			"SPID": "000000001040200003",
				// 			"SNAME": "礼盒2号",
				// 			"QTY": 10,
				// 			"OPRICE": 19.8,
				// 			"DISCRATE": 0,
				// 			"NET": 174.24,
				// 			"PRICE": 17.42,
				// 			"NO": 2
				// 		},
				// 		{
				// 			"SPID": "000000001080100005",
				// 			"SNAME": "礼盒2号",
				// 			"QTY": 10,
				// 			"OPRICE": 19.8,
				// 			"DISCRATE": 0,
				// 			"NET": 174.24,
				// 			"PRICE": 17.42,
				// 			"NO": 3
				// 		},
				// 	];
				
				let sale02_arr=[{
	"XPDGCOM": null,
	"XPDGSTR": null,
	"SBERR": null,
	"YN_SB": null,
	"MYSTR": null,
	"YN_XPDG": "N",
	"BMID": null,
	"RYID": "10086",
	"KCDID": "D005",
	"DPID": null,
	"GCID": "K201",
	"STR2": "武汉xxx哈吉卡号就开始",
	"STR1": "爱心莓",
	"TIME": 0,
	"WEEK": 0,
	"MONTH": 0,
	"YAER": 0,
	"HYJFCD": 0,
	"JFDISC": 0,
	"HYJF": 0,
	"LSDISC": 0,
	"TPDISC": 0,
	"BZDISC": 0,
	"HYDISC": 0,
	"YN_HYDISC": null,
	"CXID": null,
	"CXDISC": 0,
	"YN_CXDISC": null,
	"BILLDISC": 0,
	"DISC_TYPE": null,
	"DISC": 0,
	"YN_SKYDISC": null,
	"HYBL": 0,
	"DISCRATE": 0,
	"BRANDID": null,
	"HTID": null,
	"GYSID": null,
	"NET": "14.90",
	"OPRICE": 14.90,
	"PRICE": "14.90",
	"MINSQTY": 0,
	"QTY": "1.000",
	"UNIT": "个",
	"SERIAL": null,
	"BARCODE": "000000001040200008",
	"PLID": null,
	"NO": 0,
	"SPID": "000000001040200008",
	"BILL": "K200QTD005122981714540",
	"KHID": "K200QTD005",
	"SALETIME": "2022-09-08T09:14:54.777Z"
}, {
	"XPDGCOM": null,
	"XPDGSTR": null,
	"SBERR": null,
	"YN_SB": null,
	"MYSTR": null,
	"YN_XPDG": "N",
	"BMID": null,
	"KCDID": "D005",
	"DPID": null,
	"GCID": "K201",
	"STR2": "武汉xxx哈吉卡号就开始",
	"STR1": "奥利奥狂想罐",
	"TIME": 0,
	"WEEK": 0,
	"MONTH": 0,
	"YAER": 0,
	"HYJFCD": 0,
	"JFDISC": 0,
	"HYJF": 0,
	"LSDISC": 0,
	"TPDISC": 0,
	"BZDISC": 0,
	"HYDISC": 0,
	"YN_HYDISC": null,
	"CXID": null,
	"CXDISC": 0,
	"YN_CXDISC": null,
	"BILLDISC": 0,
	"DISC_TYPE": null,
	"DISC": 0,
	"YN_SKYDISC": null,
	"HYBL": 0,
	"DISCRATE": 0,
	"BRANDID": null,
	"HTID": null,
	"GYSID": null,
	"NET": "22.80",
	"OPRICE": 22.80,
	"PRICE": "22.80",
	"MINSQTY": 0,
	"QTY": "1.000",
	"UNIT": "个",
	"SERIAL": null,
	"BARCODE": "000000001040200044",
	"PLID": null,
	"NO": 1,
	"SPID": "000000001040200044",
	"SALETIME": "2022-09-08T09:14:54.777Z"
}]

				
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