//API地址

//UAT
const url = 'http://10.0.101.151:8805';
//生产
// const url = 'http://pad.kengee.com.cn:8018';

/**
 * 品牌配置定义
 * 各品牌包含：名称、编号,appid、业务接口地址、及其他扩展属性
 */
const BRANDS = {
	'KG': {
		name: '仟吉-KG',
		brandNo: 'KG',
		appid: "keengee",
		baseUrl: url + "/Api/"
	},
	'YYM': {
		name: '优伊萌-YYM',
		brandNo: 'YYM',
		appid: "jznn",
		baseUrl: url + "/YYM/Api/"
	},
};

/** 设置当前品牌 */
function setCurrentBrand(brandNo) {
	const brand = BRANDS[brandNo];
	if (!brand) {
		console.warn('[setCurrentBrand] 品牌不存在:', brandNo);
		return false;
	}
	// config.baseUrl 和 globalData 先同步更新，确保当前会话立即生效
	config.baseUrl = brand.baseUrl;
	const app = getApp();
	if (app) {
		app.globalData.appid = brand.appid;
		app.globalData.brand = brand.brandNo;
		app.globalData.BLEInformation.printerFile = brand.baseUrl + "files/xprinter/";
	}
	// storage 写入失败不影响当前会话
	try {
		uni.setStorageSync('currentBrand', brandNo);
		console.log('[setCurrentBrand] 品牌已设置:', brandNo);
	} catch (e) {
		console.error('[setCurrentBrand] storage写入失败:', e);
	}
	return true;
}

/** 获取当前品牌配置 */
function getCurrentBrand() {
	try {
		const no = uni.getStorageSync('currentBrand') || '';
		return BRANDS[no] || null;
	} catch (e) {
		return null;
	}
}

/** 获取所有品牌列表 */
function getBrandList() {
	return Object.keys(BRANDS).map(key => BRANDS[key]);
}

/** 应用配置对象（导出为可变引用，request.js 通过 config.baseUrl 动态取值） */
const config = {
	baseUrl: '', // 初始化后会从品牌配置覆盖
};

/** 旧版本默认地址（无品牌配置时的兜底） */
const FALLBACK_URL = url + "/Api/";

/** 获取当前 baseUrl（函数取值，确保调用时拿到最新值） */
function getBaseUrl() {
	return config.baseUrl || FALLBACK_URL;
}

/** 重置 globalData 到初始状态（切换门店等场景使用） */
function resetGlobalData() {
	try {
		const app = getApp();
		if (!app) return;
		const gd = app.globalData;
		gd.appid = 'keengee';
		gd.brand = 'KG';
		gd.store = {
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
		};
		gd.hyinfo = {};
		gd.PayInfo = [];
		gd.CodeRule = {};
		gd.PZCS = {};
		gd.POSCS = [];
		gd.userInfo = null;
		gd.platform = "";
		gd.BLEInformation = {
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
		};
		gd.YN_PRINT_CON = "N";
		gd.msgInt = 0;
		if (gd.Int) {
			clearInterval(gd.Int);
			gd.Int = null;
		}
	} catch (e) {
		console.error('[resetGlobalData] 重置失败:', e);
	}
}

export {
	BRANDS,
	setCurrentBrand,
	getCurrentBrand,
	getBrandList,
	getBaseUrl,
	resetGlobalData
};
export default config;