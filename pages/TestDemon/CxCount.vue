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
                let hyinfoModel= {
    "hyId": "1000311652", 
    "CardNo": "KG1000311652", 
    "AllinPayAccount": "100000001349164", 
    "AliPayId": "", 
    "AllinPayCardNo": "1082770000400550", 
    "ActivityId": "", 
    "youzanId": "FhRDCTGa996921810022846464", 
    "Balance": 97700, 
    "JFBalance": "177", 
    "JFFactor": null, 
    "Name": "", 
    "NickName": "", 
    "CertNum": "", 
    "Phone": "13817909479", 
    "Birthday": "", 
    "Avatar": "", 
    "Sex": "男", 
    "CountryCode": "", 
    "ProvinceCode": "", 
    "CityCode": "", 
    "DistrictCode": "", 
    "OrgCode": "KG", 
    "Area_code": null, 
    "Area": "", 
    "OpenId": "", 
    "AppId": "wx1464791bb4d14db8", 
    "UnionId": "ojIi0w9ttkx4ZzSDC5NgnA6RiXLQ", 
    "ynhyk": null, 
    "Vamt": 0, 
    "Couponnum": null, 
    "CardType": null, 
    "RegisterDay": "20220629", 
    "CreateTime": "1656464797000", 
    "Status": "1", 
    "ktypename": null, 
    "giftcard": null, 
    "hy_Level": {
        "hyId": "1000311652", 
        "CardNo": null, 
        "CardType": null, 
        "ShowIndex": 1, 
        "dValue": 0, 
        "Level": "V1", 
        "LevelName": "默认等级", 
        "CardLevel": null, 
        "nextLevelName": "", 
        "JFBalance": null, 
        "Balance": null, 
        "ExpDate": null, 
        "CardStatus": "1", 
        "TotalRefundAmount": 0, 
        "TotalConsumeAmount": 0
    }, 
    "hy_Assets": {
        "hyId": "1000311652", 
        "GiftAmt": 126600, 
        "GiftDisAmt": 25320, 
        "OverdueValue": 0, 
        "FreezeValue": 0, 
        "eVipDisAmt": 8890
    }, 
    "coupons": [ ]
};
				let sale02_arr = [
					{
					    "SPID": "000000001010100006",
					    "SNAME": "全味椰子吐司",
					    "QTY": 2,
					    "OPRICE": 30,
					    "DISCRATE": 0,
					    "NET": 60,
					    "PRICE": 30,
					    "NO": 1
					},
					{
					    "SPID": "000000001010100004",
					    "SNAME": "竹节排包(原味)",
					    "QTY": 3,
					    "OPRICE": 100,
					    "DISCRATE": 0,
					    "NET": 300,
					    "PRICE": 100,
					    "NO": 2
					},
					];
				cxCount.Createcx(sale02_arr, "sale",hyinfoModel);
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