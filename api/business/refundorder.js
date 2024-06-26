import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

var Program = getApp().globalData.store;

//查询销售单据
var GetOrders = function(khid, gsid, posid, bill, date, func) {
	let sql = "SELECT DATE(s1.sAledate) SALEDATE ,TIME(s1.SALETIME) SALETIME,s1.bill,\
                   (\
                   case  s1.XSTYPE\
                   when '1'then '销售' \
                   WHEN '5' then '预定提取' \
                    end \
                   ) XSTYPE,ry.sname RYID,S1.ZNET,S1.TNET,S1.TLINE,S1.CUID,S1.HYJF*(-1) HYJF \
                 FROM SALE001 S1 left join MDRYKH RY on  S1.RYID = RY.RYID  \
                 WHERE S1.XSTYPE IN('1','5') \
                 AND not exists  (select 1 from sale001 s2 where  s1.bill =s2.xs_bill \
                 AND s1.saledate = s2.xs_date and s1.khid =s2.xs_khid and s1.posid =s2.xs_posid) \
                 AND S1.KHID='" + khid + "'  AND S1.GSID  ='" + gsid + "'  AND S1.POSID ='" + posid + "' and s1.BILL_TYPE not in ('Z111','Z112')";
	if (bill) {
		sql += " and S1.BILL='" + bill + "' ";
	}
	if (date) {
		sql += " and date(S1.SALEDATE) =date('" + date + "')";
	}
	sql += " order by s1.saledate desc"
	db.get().executeQry(sql, "查询中...", res => {
		console.log("退货信息查询结果：", res);
		if (func) func(res);
	}, err => {
		console.log("查询sql:", sql);
		util.simpleMsg("查询异常:" + err.message, true);
	});
}

/**
 * 查询详情单
 * @param {退款单号} refund_bill 
 * @param {销售单号i} xs_bill 
 * @param {销售日期} xs_date 
 * @param {回调函数} func 
 */
var GetOrderDetails = function(refund_bill, xs_bill, xs_date, func) {
	let sql = " SELECT '" + Program.KHID + "' KHID ,'" + Program.GSID + "' GSID,'" + Program.BMID + "' BMID,'" +
		Program.POSID + "' POSID," +
		" date('" + _date.getYMDS() + "') SALEDATE,DATETIME('" + _date.getYMDS() + "') SALETIME,'" + refund_bill +
		"' BILL,'" + Program.RYID + "' RYID, cast(s2.NO as int) NO," +
		" s1.spid,s1.sname,S1.UNIT,s1.plid,t1.barcode,'' SERIAL,(-1)*S2.QTY QTY,S2.PRICE,S2.OPRICE,(-1)*S2.NET NET," +
		"HYBL,0.0 DISCRATE,0.0 BILLDISC,'N'YN_CXDISC,-1*abs(S2.CXDISC) CXDISC,'' CXID,'N' YN_HYDISC,0.0 HYDISC, 0.0 HYJF,'N' YN_SKYDISC,0.0 DISC,'' DISC_TYPE,'" +
		_date.getDateByParam("Y") + "' YAER,'" +
		_date.getDateByParam("M") + "' MONTH,'" + _date.getDateByParam("w") + "' WEEK," + _date.getDateByParam(
			"h") + " TIME,'' STR1, STR2,  S1.YN_ZS,'" + Program.DQID + "' DPID,'" + Program.KCDID + "' KCDID,'" +
		Program.GCID +
		"' GCID, -1*abs(s2.BZDISC) BZDISC, -1*abs(s2.TPDISC) TPDISC , -1*abs(s2.LSDISC) LSDISC, s2.SPJGZ FROM SALE002 S2, SPDA S1,SPTMDA T1,SPKHDA SM  WHERE  S1.SPID =T1.SPID " +
		"AND T1.YN_MAIN ='Y' AND S1.SPID =SM.SPID AND SM.KHID ='" + Program.KHID +
		"'AND S2.KHID =SM.KHID  AND S2.SPID =S1.SPID AND S2.SALEDATE =DATETIME('" + xs_date + "') AND S2.BILL ='" +
		xs_bill + "'";
	// console.log("[GetOrderDetails]查询详情单条件参数列表:", {
	// 	KHID: Program.KHID,
	// 	GSID: Program.GSID,
	// 	BMID: Program.BMID,
	// 	RYID: Program.RYID,
	// 	POSID: Program.POSID,
	// 	REFUND_BILL: refund_bill,
	// 	XS_BILL: xs_bill,
	// 	DQID: Program.DQID,
	// 	KCDID: Program.KCDID,
	// 	GCID: Program.GCID
	// });

	//去除表sptmda的关联 初始化去除了这个表
	sql = " SELECT '" + Program.KHID + "' KHID ,'" + Program.GSID + "' GSID,'" + Program.BMID + "' BMID,'" +
		Program.POSID + "' POSID," +
		" date('" + _date.getYMDS() + "') SALEDATE,DATETIME('" + _date.getYMDS() + "') SALETIME,'" + refund_bill +
		"' BILL,'" + Program.RYID + "' RYID, cast(s2.NO as int) NO," +
		" s1.spid,s1.sname,S1.UNIT,s1.plid,'' SERIAL,(-1)*S2.QTY QTY,S2.PRICE,S2.OPRICE,(-1)*S2.NET NET," +
		"HYBL,0.0 DISCRATE,0.0 BILLDISC,'N'YN_CXDISC,-1*abs(S2.CXDISC) CXDISC,'' CXID,'N' YN_HYDISC,0.0 HYDISC, 0.0 HYJF,'N' YN_SKYDISC,0.0 DISC,'' DISC_TYPE,'" +
		_date.getDateByParam("Y") + "' YAER,'" +
		_date.getDateByParam("M") + "' MONTH,'" + _date.getDateByParam("w") + "' WEEK," + _date.getDateByParam(
			"h") + " TIME,'' STR1, STR2,  S1.YN_ZS,'" + Program.DQID + "' DPID,'" + Program.KCDID + "' KCDID,'" +
		Program.GCID +
		"' GCID, -1*abs(s2.BZDISC) BZDISC, -1*abs(s2.TPDISC) TPDISC , -1*abs(s2.LSDISC) LSDISC, s2.SPJGZ FROM SALE002 S2, SPDA S1,SPKHDA SM  WHERE S1.SPID =SM.SPID AND SM.KHID ='" +
		Program.KHID +
		"'AND S2.KHID =SM.KHID  AND S2.SPID =S1.SPID AND S2.SALEDATE =DATETIME('" + xs_date + "') AND S2.BILL ='" +
		xs_bill + "'";
	console.log("[GetOrderDetails]查询详情单sql:", sql)
	db.get().executeQry(sql, "查询中...", res => {
		console.log("[GetOrderDetails]退货信息查询结果：", res);
		if (func) func(res);
	}, err => {
		console.log("[GetOrderDetails]查询sql:", sql);
		util.simpleMsg("[GetOrderDetails]查询异常:" + err.message, true);
	});
}


//查询赊销单
var SXGetOrders = function(data, func) {
	let apistr = "MobilePos_API.Models.SXSALE001CLASS.GetOrders";
	let reqdata = Req.resObj(true, "查询中...", data, apistr,true);
	Req.asyncFuncOne(reqdata, func, func);
}
//查询赊销详情单
var GetSXOrderDetails = function(data, func) {
	let apistr = "MobilePos_API.Models.SXSALE001CLASS.GetSXOrderDetails";
	let reqdata = Req.resObj(true, "查询中...", data, apistr,true);
	Req.asyncFuncOne(reqdata, func, func);
}
/**
 * 赊销退单
 * @param {*} data 
 * @param {*} func 
 */
var CreditOrderRefund = function(data, func) {
	let apistr = "MobilePos_API.Models.SXSALE001CLASS.CreditOrderRefund";
	let reqdata = Req.resObj(true, "操作中...", data, apistr,true);
	Req.asyncFuncOne(reqdata, func);
}

export default {
	GetOrders,
	GetOrderDetails,
	SXGetOrders,
	GetSXOrderDetails,
	CreditOrderRefund
}
