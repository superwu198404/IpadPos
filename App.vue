<script>
	import common from '@/api/common.js';
	import util from '@/utils/util.js';
	import Req from '@/utils/request.js';
	import _init from '@/api/business/init.js';
	import Vue from 'vue'
	import {
		global
	} from '@/models/PaymentAll/models.js';
	import {
		RequestSend
	} from '@/api/business/da.js';

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
				DQNAME: '', //地区名称（销售地区）
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
				LOGINDATE: "", //登录时间
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
				firstconnect: 0,
				platform: "",
				deviceId: "",
				deviceName: "",
				writeCharaterId: "",
				writeServiceId: "",
				notifyCharaterId: "",
				notifyServiceId: "",
				readCharaterId: "",
				readServiceId: "",
				//printerFile: "http://58.19.103.220:8805/files/xprinter/", //测试环境 - 打印广告语文件存放url
				printerFile: "http://pad.kengee.com.cn:8018/files/xprinter/", //正式环境 - 打印广告语文件存放url
				qrCodeContent: "https://www.jufanba.com/pinpai/88783/", //二维码地址,走终端参数获取
				ggy: "", //广告语
			},
			YN_PRINT_CON: "N", //打印机连接状态
			msgInt: 0, //消息定时id
			Int: null, //单据定时传输的定时器
			AppStore_DownLoad: "https://apps.apple.com/cn/app/", //App Store下载地址
		},
		onLaunch: async function() {
			console.log('[APP-LAUNCH]APP启动!')
			plus.screen.lockOrientation('landscape-primary'); //锁定横屏
			// #ifdef APP-PLUS  
			console.log("进行通讯！")
			await _init.dataInit("download_zbtx");
			await _init.YN_Init(function(res) {
				//执行通讯
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

			// let deviceinfo = uni.getDeviceInfo();
			// console.log("设备信息：", deviceinfo);
			// util.setStorage("deviceinfo", deviceinfo);

			let sysinfo = uni.getSystemInfoSync();
			console.log("系统信息：", sysinfo);
			util.setStorage("sysinfo", sysinfo);

			//存缓存 应用版本号
			try {
				uni.setStorageSync('appversion', sysinfo.appWgtVersion);
			} catch (e) {}

			//取缓存 应用的版本号
			const v = uni.getStorageSync('appversion');
			let v_db = "";
			let down_id = "";
			//数据库版本号
			this.db_appversion = {};
			try {
				await RequestSend(
					`SELECT X.XTCSID,X.SNAME,X.SEQNO,X.STR1,X.STR2,X.DATE_LR,X.DATE_XG  FROM XTCS X WHERE X.XTCSID ='version' AND ROWNUM<=1 ORDER BY SEQNO DESC,DATE_XG DESC`,
					util.callBind(this, function(res) {
						if (res.code) {
							let db_vs = JSON.parse(res.data);
							if (db_vs != null && db_vs != undefined) {
								this.db_appversion = db_vs[0];
								v_db = this.db_appversion.STR1;
								down_id = this.db_appversion.STR2;
							}
							uni.setStorageSync('db_appversion', this.db_appversion);
						} else {
							console.log("获取db_appversion失败!");
						}
					}))
			} catch (e) {
				console.log("获取db_appversion失败:", e);
			}
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		onUnload: function() {
			console.log('App 卸载');
		}
	}
</script>

<style>
	@import url(@/static/style/common.css);
</style>
