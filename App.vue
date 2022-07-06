<script>
	import common from '@/api/common.js';
	import Req from '@/utils/request.js';
	let int;
	export default {
		globalData: {
			appid: 'keengee',
			kquser: "CSKQ",
			brand: "KG",
			store: {
				GSID: "027001",
				KHID: "K200QTD005", //"K0101QT2",
				POSID: "1",
				RYID: "10086",
				KCDID: "123",
				DPID: "123",
				DKFID: '80000000',
				BMID: "001",
				GCID: "1001",
				NAME: "武汉xxx",
				MERID: "999990053990001",
				deviceno: "13001001",
				KHAddress: "湖北省武汉市江汉区青年路与后襄河北路交汇处海马公园",
				POSCSZID: "武汉现烤",
			},
			hyinfo: {
				// hyId: "1000311640"
			},
			PayInfo: [], //支付规则
			CodeRule: {},
			PZCS: { //档案配置参数
				YN_ZFBKBQ: "N" 

			},
			POSCS: [{ //POS参数组 测试用
				KHID: "K0101QT2",
				SNAME: "水吧类别编码",
				POSCS: "SBLBBM",
				POSCSNR: "107,108"
			}],
			XZZF: ["WX_CLZF", "ZFB_CLZF"], //支付中禁止第多次支付的支付方式
			getModel: function() {
				//获取手机型号
				return wx.getSystemInfoSync()["model"];
			},
			getSystem: function() {
				//获取操作系统版本
				return wx.getSystemInfoSync()["system"];
			},
			getPlatform: function() {
				//获取客户端平台
				return wx.getSystemInfoSync()["platform"];
			},
			getSDKVersion: function() {
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
				deviceName: "Printer001",
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

			//3min执行一次销售单传输
			// int = setInterval(() => {
			// common.TransLiteData();
			// }, 1000 * 60 *3); 
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
