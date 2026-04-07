import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '@/utils/util';

/**
 * 获取裱花请货单
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
const GetBHQHOrders = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.GetBHQHOrders";
	let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
/**
 * 入库
 * @param {*} data 参数 
 * @param {*} func 回调函数
 */
const BHQHInput = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.BHQHTjRk";
	let reqdata = Req.resObj(true, "操作中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
/**
 * 取消入库
 * @param {*} data 参数 
 * @param {*} func 回调函数
 */
const BHQHCancelInput = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.GetBHQHOrders";
	let reqdata = Req.resObj(true, "操作中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
/**
 * 裱花筛选
 * @param {*} data 参数 
 * @param {*} func 回调函数
 */
const GetBHQHOrdersByParam = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.GetBHQHOrdersByParam";
	let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
/**
 * 要货配送
 * @param {*} data 参数 
 * @param {*} func 回调函数
 */
const GetBHYHPSByParam = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.GetBHYHPSByParam";
	let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
//获取商品数据 
var GetSPDA = function(khid, func, yn_xs = 'N', khzid, dqid) {
	// let gskhinfo = getGSKHINFO(gsid, khid);
	// gskhinfo = "='11501'";
	let obj = util.getStorage("sysParam");
	let bmArr = [];
	if (obj && obj.BHLBBM) {
		bmArr = obj.BHLBBM.split(',');
	}
	let str = " and sk.YN_YW='Y'";
	if (bmArr.length > 0) {
		let plids = bmArr.join("','");
		str += " and plid in(select plid from PLDA where plid_f in ('" + plids + "'))";
	}
	var x = _date.getYMD();
	if (yn_xs == "Y")
		str = " and sk.YN_XS='Y'"; //销售业务
	let sql =
		"select s.SPID,s.SNAME,s.spid||'-'||s.sname IDNAME,s.PINYIN,s.PLID,sk.ZLID,s.SPECS,xl.CCCZ,(SELECT PRICE/(CASE UQTY WHEN 0 THEN 1 ELSE UQTY END) PRICE FROM PRICDA WHERE DATE (SDATE)<=DATE ('" +
		x + "') AND DATE (EDATE)>=DATE ('" + x + "') AND (dqid IS NULL OR dqid='" + dqid +
		"') AND (khzid IS NULL OR khzid='" + khzid +
		"') AND QYSTAT='1' and spid=sk.spid) PRICE from  SPKHDA sk left join spda s on sk.spid=s.spid left join spda_dgxl xl on sk.spid=xl.spid where sk.khid='" +
		khid + "' and s.PRODUCT_STATUS='1'" + str + " order by s.spid";
	db.get().executeQry(sql, "加载中...", res => {
		console.log("商品信息查询成功：", res);
		if (func)
			func(res);
	}, err => {
		console.log("商品信息查询失败：", err);
	})
}
const BHQHOrderPrint = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.BHQHOrderPrint";
	let reqdata = Req.resObj(true, "操作中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//裱花请货任务统计
const GetBHQHRwTj = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.GetBHQHRwTj";
	let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
//裱花请货详情
const GetYWBHQHDetail = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.GetYWBHQHDetail";
	let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//获取裱花主动入库,配送商品数据 
var GetBHRKSPDA = function(khid, type, dqid, khzid, func) {
	// let gskhinfo = getGSKHINFO(gsid, khid);
	// gskhinfo = "='11501'";
	console.log("进入GetBHRKSPDA：", "11111");
	let obj = util.getStorage("sysParam");
	console.log("进入GetBHRKSPDA的obj：", obj);
	let bmArr = [];
	if (obj && obj.BHLBBM) {
		bmArr = obj.BHLBBM.split(',');
	}
	let str = "";
	if (bmArr.length > 0) {
		let plids = bmArr.join("','");
		str = " and sk.zlid in('" + plids + "')";
	}
	let spkwstr = "";
	let sql = "";
	if (type == "RK") {
		spkwstr = "and  (S.SPKW IS NULL OR S.SPKW!='J')"
		sql =
			"select s.spid,s.sname,s.spid||'-'||s.sname idname,pinyin,IFNULL(s.YN_ZS,'Y') YN_ZS from  SPKHDA sk left join spda s on sk.spid=s.spid where sk.khid='" +
			khid + "' and sk.YN_YW='Y' and sk.AQQTY='1' " + spkwstr + "  and s.PRODUCT_STATUS='1'" + str +
			" order by s.spid";
	} else {
		let d = new Date();
		var x = d.getFullYear() + "-" + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + "-" + (d
			.getDate() < 10 ? "0" : "") + d.getDate();
		sql =
			"select s.spid,s.sname,s.spid||'-'||s.sname idname,pinyin,s.specs,IFNULL(s.YN_ZS,'Y') YN_ZS,pr.PRICE / (CASE pr.UQTY  WHEN 0 THEN 1 else pr.UQTY end) PRICE from  SPKHDA sk left join spda s on sk.spid=s.spid left join PRICDA pr on sk.spid=pr.spid and pr.dqid='" +
			dqid + "' and (pr.khzid is null or pr.khzid = '" + khzid +
			"') where sk.khid='" +
			khid + "' and sk.YN_YW='Y' and sk.AQQTY='1'   and s.PRODUCT_STATUS='1'" + str +
			" and DATE(pr.SDATE) <= DATE('" + x + "')  " +
			" AND DATE(pr.EDATE) >= DATE('" + x + "') and (pr.dqid is null or pr.dqid = '" + dqid + "') " +
			"  and  pr.QYSTAT  ='1' order by s.spid";

	}
	console.log("裱花主动入库,配送商品数据SQL：", sql);

	db.get().executeQry(sql, "加载中...", res => {
		console.log("裱花主动入库,配送商品数据查询成功：", res);
		if (func)
			func(res);
	}, err => {
		console.log("裱花主动入库,配送商品数据查询失败：", err);
	})
}

/**
 * 主动入库
 * @param {*} data 参数 
 * @param {*} func 回调函数
 */
const BHQHZDInput = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.BHQHZDInput";
	let reqdata = Req.resObj(true, "操作中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
/**
 * 裱花主动配送可选门店 
 * @param {*}  参数 
 * @param {*} func 回调函数
 */
const GetPsKHList = function(func) {
	let apistr = "MobilePos_API.Models.YWBHQH.GetPsKHList";

	let obj = util.getStorage("sysParam");
	console.log("进入GetPsKHList的obj：", obj);
	let bmArr = [];
	if (obj && obj.KJGSFW) {
		bmArr = obj.KJGSFW.split(',');
	}
	let gsids = "";
	if (bmArr.length > 0) {
		gsids = bmArr.join("','");
	}
	let data = {
		gsids: gsids
	};
	let reqdata = Req.resObj(true, "操作中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

/**
 * 主动配送
 * @param {*} data 参数 
 * @param {*} func 回调函数
 */
const BHQHZDPS = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.BHQHZDPS";
	let reqdata = Req.resObj(true, "操作中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
//要货配送
const SubmitBHYHPS = function(data, func) {
	let apistr = "MobilePos_API.Models.YWBHQH.SubmitBHYHPS";
	let reqdata = Req.resObj(true, "操作中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}


export default {
	GetBHQHOrders,
	BHQHInput,
	BHQHCancelInput,
	GetSPDA,
	GetBHQHOrdersByParam,
	BHQHOrderPrint,
	GetBHQHRwTj,
	GetBHRKSPDA,
	BHQHZDInput,
	GetPsKHList,
	BHQHZDPS,
	GetYWBHQHDetail,
	GetBHYHPSByParam,
	SubmitBHYHPS
}