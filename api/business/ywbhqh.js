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
//获取商品数据 
var GetSPDA = function(khid, func) {
	// let gskhinfo = getGSKHINFO(gsid, khid);
	// gskhinfo = "='11501'";
	let obj = util.getStorage("sysParam");
	let bmArr = [];
	if (obj && obj.BHLBBM) {
		bmArr = obj.BHLBBM.split(',');
	}
	let str = "";
	if (bmArr.length > 0) {
		let plids = bmArr.join("','");
		str = " and plid in(select plid from PLDA where plid_f in ('" + plids + "'))";
	}
	let sql =
		"select s.spid,s.sname,s.spid||'-'||s.sname idname from  SPKHDA sk left join spda s on sk.spid=s.spid where sk.khid='" +
		khid + "' and sk.YN_YW='Y' and s.PRODUCT_STATUS='1'" + str + " order by s.spid";
	db.get().executeQry(sql, "加载中...", res => {
		console.log("提货门店查询成功：", res);
		if (func)
			func(res);
	}, err => {
		console.log("提货门店查询失败：", err);
	})
}

export default {
	GetBHQHOrders,
	BHQHInput,
	BHQHCancelInput,
	GetSPDA,
	GetBHQHOrdersByParam
}