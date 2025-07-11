import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

/**
 * 获取外卖单
 */
var GetWMOrders = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrders";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//查询表外卖详情单
var GetWMOrderDetail = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrderDetail";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意接收
var ConfirmReceipt = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConfirmReceipt";
	let reqdata = Req.resObj(true, "操作中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意和拒绝退单
var CommonRefund = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.CommonRefund";
	let reqdata = Req.resObj(true, "操作中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//获取报损数据
var GetBSData = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetBSData";
	let reqdata = Req.resObj(true, "查询中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}


var sql_commit = async function(pm_bill, is_ywtype, mqty) {
	let ds = [],
		ds1 = [];
	console.log("开始执行sql:");
	let sql = "SELECT * FROM SYSYWTEMP001 WHERE BILL = '" + pm_bill + "' AND YWTYPE ='" + is_ywtype +
		"' AND STATUS = '0'";
	console.log("执行sql1:", sql);
	await db.get().executeQry(sql, "查询中...", r => {
		ds = r.msg;
	});
	sql = "SELECT CLTIME,NOTEERR,BILL,YWTYPE,SPID,PACK,BQTY,PRICE,QTY1,QTY2,QTY3,NOTE1,NOTE2,STR1,STR2,STR3,STR4,'' STR5,STR6,STR7,NUM1,NUM2,NUM3,NUM4,NUM5,NUM6,STATUS\
             FROM SYSYWTEMP002 WHERE  " + mqty + "<>0  AND BILL = '" + pm_bill + "' AND YWTYPE ='" + is_ywtype +
		"' AND STATUS = '0'";
	console.log("执行sql2:", sql);
	await db.get().executeQry(sql, "查询中...", r => {
		ds1 = r.msg;
	});
	let arr = common.CreateSQL(ds, "SYSYWTEMP001");
	let arr1 = common.CreateSQL(ds1, "SYSYWTEMP002");

	return arr.oracleSql + arr1.oracleSql;
}

var dj_commit = async function(pm_bill, is_ywtype, khid, posid, func) {
	console.log("oracle_sqlsql开始组装");
	let sql = await sql_commit(pm_bill, is_ywtype, "BQTY")
	console.log("oracle_sql组装完毕：", sql);
	if (!sql) {
		util.simpleMsg("单据生成失败", true);
		return;
	}
	let tx_obj = {
		TX_SQL: sql,
		STOREID: khid,
		POSID: posid,
		TAB_NAME: is_ywtype,
		STR1: pm_bill,
		BDATE: _date.getYMD(),
		YW_NAME: "",
		CONNSTR: 'CONNSTRING'
	};
	let arr3 = common.CreateSQL(tx_obj, 'POS_TXFILE');
	console.log("sqlite保存外卖sql：", arr3.sqlliteSql);
	await db.get().executeDml(arr3.sqlliteSql, "保存中...", r => {
		console.log("通讯数据保存成功：", r);
	}, e => {
		console.log("通讯数据保存失败：", e);
		util.simpleMsg("数据保存失败", true);
	})
	let sqlArr = ["UPDATE  SYSYWTEMP001 SET STATUS= '1' WHERE YWTYPE = '" + is_ywtype +
		"' AND BILL = '" + pm_bill + "'",
		"UPDATE SYSYWTEMP002 SET STATUS= '1' WHERE YWTYPE = '" + is_ywtype +
		"' AND BILL = '" + pm_bill + "'"
	]
	await db.get().executeDml(sqlArr, "保存中...", res => {
		console.log("更改外卖单状态成功:", res);
		common.TransLite(pm_bill); //直接传输数据
		if (func) func(res);
	}, err => {
		console.log("更改外卖单状态失败:", err);
		util.simpleMsg("数据更改失败", true);
	})
}
//查询赠品
var GetZSData = async function(dqid, khzid, khid, sybid, plids, spids) {
	let info;
	var sql = "select spid,sname,unit,BQTY,sum(zqty) zqty,PRICE from ( \
                                 select \
                                 x.SPID_ZP SPID,s.SNAME,s.UNIT,0 BQTY,x.ZQTY_ZP ZQTY,\
                                 (SELECT nvl(PRICE,-1) \
                                 FROM PRICDA \
		                                 WHERE SDATE <= TRUNC(SYSDATE) \
		                                 AND EDATE >= TRUNC(SYSDATE) \
		                                 and (dqid is null or dqid = '" + dqid + "') \
		                                 and (khzid is null or khzid = '" + khzid + "') \
		                                 and  QYSTAT  ='1' \
		                                 AND SPID = x.SPID_ZP \
		                                 and ROWNUM = 1) PRICE \
                                 FROM \
                                 XSZSGZ x \
                                 LEFT JOIN SPDA s ON s.SPID = x.SPID_ZP \
                                 LEFT JOIN (select SPID from SPKHDA where khid = '" + khid + "' and yn_xs = 'Y' ) sk on sk.SPID = x.SPID_ZP \
                                 where x.DA_STATUS = '1' \
                                 and sk.spid is not null \
                                 and (x.dqid = '" + dqid + "' or x.dqid = 'K00000' or x.khid = '" + khid +
		"' or x.SYBID = '" + sybid + "') \
                                 and (x.plid in ('" + plids + "') or x.plid is null ) \
                                 and (x.spid in ('" + spids + "') or x.spid is null ) \
                                 and (x.cccz in (select specs from spda where spid in ('" + spids + "')) or x.cccz is null ) \
                                 order by x.spid,x.PLID,x.khid,x.dqid \
                            ) group by spid,sname,unit,BQTY,PRICE ";
	console.log("[GetZSData]查询sql：", sql);
	await common.WebDBQuery(sql, res => {
		console.log("[GetZSData]查询结果：", res);
		if (res.code && res.data.length > 0) {
			info = JSON.parse(res.data || "");
		}
	});
	return info;
}
//查询外卖袋
var GetWMDData = function(d, e, func) {
	let sql = "select dr.note SPID, sd.sname, sd.unit, '0' BQTY, dr.sz ZQTY from dapzcs_nr dr, spda sd\
             where dr.id = 'WM_ZSDZ' and dr.sname = '" + d + "'and sd.spid = dr.note and dr.ZF='" + e + "'";
	console.log("外卖袋查询sql:", sql);
	db.get().executeQry(sql, "查询中...", res => {
		if (func)
			func(res);
	}, err => {
		console.log("查询外卖袋数据出错:", err);
		util.simpleMsg("异常：" + err.msg, "none");
	});
}

//确认提交报损和领用
var ConfirmLY = function(obj, bill, ywtype, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConfirmLY";
	let reqdata = Req.resObj(true, "操作中...", obj, apistr, true);
	Req.asyncFuncOne(reqdata, res => {
		console.log("后台领用返回数据:", res);
		if (!res.code) {
			util.simpleMsg(res.msg, true);
			return;
		}
		let arr = JSON.parse(res.data).split(';');
		arr = arr.filter(r => r != ""); //去除分割后的空字符串
		db.get().executeDml(arr, "本地保存中...", res => {
			console.log("本地单据保存成功:", res);
			dj_commit(bill, ywtype, obj.khid, obj.posid, func);
		}, err => {
			console.log("本地单据保存异常:", err);
			util.simpleMsg("单据保存异常", true);
		})
	}, err1 => {
		console.log("后台报损返回数据:", err1);
	});
}
//报损业务确认
var ConfirmBS = function(data, is_ywtype, bill, Program, func) {
	let excesql = common.CreateSQL(data, "SYSYWTEMP002");
	let sqlArr = ["delete from SYSYWTEMP002 WHERE YWTYPE = '" + is_ywtype + "'  AND  bill = '" + bill + "'",
		"delete from SYSYWTEMP001 WHERE YWTYPE = '" + is_ywtype + "'  AND  bill = '" + bill + "'"
	];
	sqlArr = sqlArr.concat(excesql.sqlliteArr);
	sqlArr = sqlArr.concat([
		"insert into SYSYWTEMP001 (KHID,POSID,GSID,BMID,YWTYPE,BILL,RYID,RYNAME,WDATE,WTIME,STR1,STR2,STR3,STR4,STR5,STR6,STR7,NOTE1,NOTE2,STATUS,TO_BMID,TO_KHID) values('" +
		Program.storeid + "','" + Program.posid + "','" + Program.gsid + "','','" + is_ywtype + "','" +
		bill + "','" + Program.czyid + "','" + Program.czyname + "','" + _date.getYMD() + "','" + _date
		.getYMDS() + "','','','','','','','','','','0','','')",
		"UPDATE  SYSYWTEMP001 SET STATUS= '0' WHERE YWTYPE = '" + is_ywtype + "' AND  BILL = '" + bill +
		"'",
		"UPDATE  SYSYWTEMP002 SET STATUS= '0' WHERE YWTYPE = '" + is_ywtype + "' AND  BILL = '" + bill + "'"
	]);
	// let sqlArr = [
	// 	"delete from SYSYWTEMP002 WHERE YWTYPE = '" + is_ywtype + "'  AND  bill = '" + bill + "'",
	// 	"delete from SYSYWTEMP001 WHERE YWTYPE = '" + is_ywtype + "'  AND  bill = '" + bill + "'",
	// 	excesql.sqlliteSql,
	// 	"insert into SYSYWTEMP001 (KHID,POSID,GSID,BMID,YWTYPE,BILL,RYID,RYNAME,WDATE,WTIME,STR1,STR2,STR3,STR4,STR5,STR6,STR7,NOTE1,NOTE2,STATUS,TO_BMID,TO_KHID) values('" +
	// 	Program.storeid + "','" + Program.posid + "','" + Program.gsid + "','','" + is_ywtype + "','" +
	// 	bill + "','" + Program.czyid + "','" + Program.czyname + "','" + _date.getYMD() + "','" + _date
	// 	.getYMDS() + "','','','','','','','','','','0','','')",
	// 	"UPDATE  SYSYWTEMP001 SET STATUS= '0' WHERE YWTYPE = '" + is_ywtype + "' AND  BILL = '" + bill + "'",
	// 	"UPDATE  SYSYWTEMP002 SET STATUS= '0' WHERE YWTYPE = '" + is_ywtype + "' AND  BILL = '" + bill + "'"
	// ]
	db.get().executeDml(sqlArr, "操作中...", res => {
		console.log("临时单据生成成功：", res);
		dj_commit(bill, is_ywtype, Program.storeid, Program.posid, func);
		console.log("临时单据保存通讯成功：", res);
	}, err => {
		console.log("临时单据保存失败：", err);
		util.simpleMsg("单据生成失败", true);
	})
}

/////////////////////////外卖预订单
/**
 * 获取外卖预定单
 */
var GetWMOrders_YD = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrders_YD";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意接收预订单
var ConfirmReceipt_YD = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConfirmReceipt_YD";
	let reqdata = Req.resObj(true, "操作中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意和拒绝退单
var CommonRefund_YD = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.CommonRefund_YD";
	let reqdata = Req.resObj(true, "操作中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
export default {
	GetWMOrders,
	GetWMOrderDetail,
	ConfirmReceipt,
	CommonRefund,
	GetBSData,
	ConfirmLY,
	dj_commit,
	GetWMDData,
	ConfirmBS,
	GetWMOrders_YD,
	ConfirmReceipt_YD,
	CommonRefund_YD,
	GetZSData
}