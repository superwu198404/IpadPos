<script>
	import common from '@/api/common.js';
	import util from '@/utils/util.js';
	import Req from '@/utils/request.js';
	import _init from '@/api/business/init.js';
	import dateformat from '@/utils/dateformat.js';
	import Vue from 'vue'
	import {
		global
	} from '@/models/PaymentAll/models.js';
	import {
		RequestSend
	} from '@/api/business/da.js';
	import {
		setCurrentBrand,
		getCurrentBrand
	} from '@/utils/configInfo.js';

	export default {
		globalData: {
			appid: 'keengee',
			brand: "KG",
			kquser: "CSKQ",
			store: {
				GSID: "",
				KHID: "",
				POSID: "",
				KCDID: "",
				DPID: "",
				DKFID: '80000000',
				DKFNAME: '默认大客户',
				BMID: "",
				GCID: "",
				DQID: '',
				DQNAME: '',
				NAME: "",
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
				OPENFLAG: 0,
				LOGINDATE: "",
			},
			hyinfo: {},
			PayInfo: [],
			CodeRule: {},
			PZCS: {},
			POSCS: [],
			XZZF: [
				"WX_CLZF", "ZFB_CLZF",
				"WXZF", "ZFB20", "HyJfExchange"
			],
			getModel: function() {
				return uni.getSystemInfoSync()["model"];
			},
			getSystem: function() {
				return uni.getSystemInfoSync()["system"];
			},
			getPlatform: function() {
				return uni.getSystemInfoSync()["platform"];
			},
			getSDKVersion: function() {
				return uni.getSystemInfoSync()["SDKVersion"];
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
				printerFile: "http://pad.kengee.com.cn:8018/files/xprinter/",
				qrCodeContent: "https://www.jufanba.com/pinpai/88783/",
				ggy: "",
			},
			YN_PRINT_CON: "N",
			msgInt: 0,
			Int: null,
			AppStore_DownLoad: "https://apps.apple.com/cn/app/",
		},
		onLaunch: async function() {
			uni.getStorageInfo({
				complete: (res) => {

					console.log("onLaunch所有缓存：", res);
					console.log("onLaunch.store缓存：", uni.getStorageSync("store"));
				}
			})
			console.log('[APP-LAUNCH]APP启动!')
			plus.screen.lockOrientation('landscape-primary'); //锁定横屏
			// #ifdef APP-PLUS  
			console.log("进行通讯！")
			// 从 Init_Data 恢复品牌配置（确保不经过 start 时 baseUrl 正确）
			try {
				const initData = util.getStorage("Init_Data");
				console.log("onLaunch_initData：", initData);
				let brandNo = initData && initData.brandNo;
				// 兼容旧版本：Init_Data 没有 brandNo 时，从 currentBrand 缓存兜底
				if (!brandNo) {
					const oldBrand = getCurrentBrand();
					if (oldBrand) brandNo = oldBrand.brandNo;
				}
				// 兜底逻辑：旧设备无品牌信息时，默认设为 KG 品牌
				if (!brandNo) {
					brandNo = 'KG';
					console.log('[APP-LAUNCH]未检测到品牌信息，默认设为 KG');
				}
				setCurrentBrand(brandNo);
				console.log('[APP-LAUNCH]品牌已恢复:', brandNo);
			} catch (e) {
				console.error('[APP-LAUNCH]品牌恢复失败:', e);
			}
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