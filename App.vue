<script>
	import common from '@/api/common.js';
	let int;
	export default {
		globalData: {
			appid: 'keengee',
			kquser: "CSKQ",
			brand: "KG",
			store: {
				GSID: "027001",
				KHID: "K200QTD005",
				POSID: "1",
				RYID: "10086",
				KCDID: "123",
				DPID: "123",
				DKFID: '80000000',
				BMID: "001",
				GCID: "1001",
				NAME: "武汉xxx",
				MERID: "999990053990001",
				deviceno: "13001001"
			},
			hyinfo: {
				// hyId: "1000311640"
			},
			PayInfo: [{ //支付参数
				TYPE: "WX_CLZF",
				APPID: "keengee",
				GSID: "027001",
				URL: "/PaymentAll/Handle",
				PAYTYPE: "WxPay_ScanCode",
				SOURCE: "Mobile_Pos",
				BRAND: "KG"
			}, {
				TYPE: "ZFB20",
				APPID: "keengee",
				GSID: "027001",
				URL: "/PaymentAll/Handle",
				PAYTYPE: "AliPay_ScanCode",
				SOURCE: "Mobile_Pos",
				BRAND: "KG"
			}, {
				TYPE: "PAYCARD",
				APPID: "keengee",
				GSID: "027001",
				URL: "/PaymentAll/Handle",
				PAYTYPE: "ECard_Payment",
				SOURCE: "Mobile_Pos",
				BRAND: "KG"
			}, {
				TYPE: "SZQ",
				APPID: "keengee",
				GSID: "027001",
				URL: "/PaymentAll/Handle",
				PAYTYPE: "ECoupon_Payment",
				SOURCE: "Mobile_Pos",
				BRAND: "KG"
			}],
			CodeRule: {//支付码规则
				13: "WX_CLZF",
				28: "ZFB20",
				card: "PAYCARD",
				coupon: "SZQ"
			},
			getModel: function () {
			  //获取手机型号
			  return wx.getSystemInfoSync()["model"];
			},
			getSystem: function () {
			  //获取操作系统版本
			  return wx.getSystemInfoSync()["system"];
			},
			getPlatform: function () {
			  //获取客户端平台
			  return wx.getSystemInfoSync()["platform"];
			},
			getSDKVersion: function () {
			  //获取客户端基础库版本
			  return wx.getSystemInfoSync()["SDKVersion"];
			},
			userInfo: null,
			platform: "",
			screenWidth: uni.getSystemInfoSync().screenWidth,
			screenHeight: uni.getSystemInfoSync().screenHeight,
			BLEInformation: {
			  platform: "",
			  deviceId: "",
			  writeCharaterId: "",
			  writeServiceId: "",
			  notifyCharaterId: "",
			  notifyServiceId: "",
			  readCharaterId: "",
			  readServiceId: ""
			}
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')

			//1min执行一次销售单传输
			// int = setInterval(() => {
			//common.TransLiteData();
			// }, 1000 * 60); 
			this.globalData.sysinfo = uni.getSystemInfoSync();
		},
		onHide: function() {
			console.log('App Hide');
			clearInterval(int);
		}
	}
</script>

<style>

</style>
