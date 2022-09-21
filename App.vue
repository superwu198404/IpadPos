<script>
	import common from '@/api/common.js';
	import util from '@/utils/util.js';
	import Req from '@/utils/request.js';
	import _init from '@/api/business/init.js';
	import Vue from 'vue'
	import {
		global
	} from '@/models/PaymentAll/models.js';
	let int;
	export default {
		globalData: {
			appid: 'keengee',
			kquser: "CSKQ",
			brand: "KG",
			store: {
				GSID: "",
				KHID: "",
				POSID: "",
				KCDID: "",
				DPID: "",
				DKFID: '80000000',
				DKFNAME: '默认大客户',
				BMID: "", //对应program.xsbm pos 这个参数为空字符串
				GCID: "",
				DQID: '', //地区ID（销售地区）
				NAME: "",
				// MERID: "999990053990001",
				// deviceno: "13001001",
				KHAddress: "",
				POSCSZID: "",
				RYID: "",
				PWD: "",
				RYNAME: "",
				RYTYPE: "",
				KHZID: "",
				PHONE: "",
				JGID: "",
				STIME: "",
				ETIME: "",
				OPENFLAG: 0, //签到状态

			},
			hyinfo: {
				// hyId: "1000311640"
			},
			PayInfo: [], //支付规则
			CodeRule: {},
			PZCS: { //档案配置参数
				// YN_ZFBKBQ: "N"
			},
			POSCS: [
				// 	{ //POS参数组 测试用
				// 	KHID: "K0101QT2",
				// 	SNAME: "水吧类别编码",
				// 	POSCS: "SBLBBM",
				// 	POSCSNR: "107,108"
				// },
			],
			XZZF: [
				"WX_CLZF", "ZFB_CLZF", //108金凤
				"WXZF", "ZFB20", "HyJfExchange" //仟吉
			], //支付中禁止第多次支付的支付方式
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
				deviceName: "",
				writeCharaterId: "",
				writeServiceId: "",
				notifyCharaterId: "",
				notifyServiceId: "",
				readCharaterId: "",
				readServiceId: "",
				printerFile: "http://139.9.122.101:8029/files/", //打印文件存放url
				qrCodeContent: "https://www.jufanba.com/pinpai/88783/", //二维码地址
				ggy: "", //广告语
			},
			YN_PRINT_CON: "N", //打印机连接状态
			msgInt: 0, //消息定时id
		},
		start:function()
		{
		
			console.log('开始进行定时通讯')
			//3min执行一次销售单传输
			int = setInterval(() => {
				common.TransLiteData();
			}, 1000 * 60 * 3);
		},
		onLaunch: function() {
			console.log('[APP-LAUNCH]APP启动!') 
			plus.screen.lockOrientation('landscape-primary'); //锁定横屏
			// #ifdef APP-PLUS  
			_init.YN_Init(function(res) {
				uni.reLaunch({
					url: "/pages/Login/Login",
					// url: "/pages/start/start",
					success: () => {
						//跳转完页面后再关闭启动页
						plus.navigator.closeSplashscreen();
					}
				})
			}, err => {
				//存在则关闭启动页进入首页
				plus.navigator.closeSplashscreen();
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')

			this.globalData.start   = this.start;
			this.globalData.sysinfo = uni.getSystemInfoSync();
		},
		onHide: function() {
			console.log('App Hide');
			clearInterval(int);
		},
		onUnload: function() {
			console.log('App 卸载');
		}
	}
</script>

<style>
	@import url(@/static/style/common.css);
</style>
