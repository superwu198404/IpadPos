<!-- 测试促销界面 -->
<template>
	<view class="body">
		<view>
			<view style="height: 50px;line-height: 50px;" >请输入</view>
			<view>
				<input style="border:1px solid gray" type="text" v-model="qrText" />
			</view>
		</view>
		<button class="button" hover-class="hover" v-show="false">
			测试
		</button>
		<button class="button" hover-class="hover">
			按钮
		</button>
		
		<canvas canvas-id="couponQrcode" class="canvas"
			:style="'border:0px solid; width:256px; height:256px;margin:10px 0px 0px 50px;'"></canvas>
	</view>
</template>
<script>
	import cxCount from '@/utils/cx/cxCount.js';
	import hy_query from '@/api/hy/hy_query.js';
	import qrCode from '@/utils/xprinter/weapp-qrcode.js';
	var app = getApp();
	var that;

	export default {
		data() {
			return {
				ZKDatas: [],
				qrCodeWidth: 256, //开票二维码宽
				qrCodeHeight: 256, // 开票二维码高
				imageSrc: "/static/xprinter/erweima.png",
				qrText : "http://fpsb.ikengee.com:8017/GetElecInvoice/Index" + "?v=1" + "&saledate=2023-02-16" + "&bill=K200QTD00512302161136200" +"&khid=K200QTD005" + "&gsid=K200" + "&sltype=0.16",
				//qrText: "http://fpsb.ikengee.com:8017/",
			}
		},
		onLoad: function() {
			that = this;
		    let hyinfoModel = {
			"hyId": "1000311652", 
			"CardNo": "KG1000311652", 
			"AllinPayAccount": "100000001349164", 
			"AliPayId": "", 
			"AllinPayCardNo": "1082770000400550", 
			"ActivityId": "", 
			"youzanId": "FhRDCTGa996921810022846464", 
			"Balance": 97700, 
			"JFBalance": "300", 
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
			
			let sale02_arr1 = [
				{
				    "SPID": "000000001010500014",
				    "SNAME": "杨枝甘露冰面包",
				    "QTY": 2,
				    "OPRICE": 16.5,
				    "DISCRATE": 0,
				    "NET": 33,
				    "PRICE": 16.5,
				    "NO": 111
				}
				];
		   
			cxCount.Createcx(sale02_arr1, "sale",hyinfoModel);
			
			var that = this;
			setTimeout(() => {
				that.couponQrCode()
			}, 50);
		},
		created: function(e) {
			let that = this;
			//初始化画布
			that.initPhoto();
		},
		methods: {
			//初始化画布数据
			initPhoto: function() {
				//初始化画布数据
				var that = this;
				const ctx_Qrcode = uni.createCanvasContext("couponQrcode", this);
				var png_Qrcode = that.imageSrc;
				uni.getImageInfo({
					src: png_Qrcode,
					success(res) {
						that.setData({
							qrCodeWidth: 256,
							qrCodeHeight: 256
						});
						//console.log("画布宽度" + res.width, "画布高度" + res.height);
						ctx_Qrcode.drawImage(png_Qrcode, 0, 0, res.width, res.height);
						ctx_Qrcode.draw();
					}
				});
		
			},
			//二维码生成工具
			couponQrCode: function() {
				let that = this;
				
				new qrCode('couponQrcode', {
					text: that.qrText,
					width: 256,
					height: 256,
					colorDark: "#000000",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.L
				})
				
				console.log("qrText",qrText);
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