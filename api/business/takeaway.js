import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';

/**
 * 获取外卖单
 */
var GetWMOrders = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrders";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//查询表外卖详情单
var GetWMOrderDetail = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrderDetail";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意接收
var ConfirmReceipt = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConfirmReceipt";
	let reqdata = Req.resObj(true, "操作中...", e, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意和拒绝退单
var CommonRefund = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.CommonRefund";
	let reqdata = Req.resObj(true, "操作中...", e, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//获取报损数据
var GetBSData = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetBSData";
	let reqdata = Req.resObj(true, "查询中...", e, apistr);
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

var dj_commit = async function(pm_bill, is_ywtype, khid, posid) {
	console.log("oracle_sqlsql开始组装");
	let sql = await sql_commit(pm_bill, is_ywtype, "BQTY")
	console.log("oracle_sql组装完毕：", sql);
	if (!sql) {
		uni.showToast({
			title: "提交失败请确认录入信息的正确性！",
			icon: "error"
		})
	}
	this.tx_obj = {
		TX_SQL: sql,
		STOREID: khid,
		POSID: posid,
		TAB_NAME: is_ywtype,
		STR1: pm_bill,
		BDATE: _date.getYMD(),
		YW_NAME: "",
		CONNSTR: 'CONNSTRING'
	};
	let arr3 = common.CreateSQL(this.tx_obj, 'POS_TXFILE');
	console.log("sqlite保存外卖sql：", arr3.sqlliteSql);
	await db.get().executeDml(arr3.sqlliteSql, "保存中...", r => {
		console.log("通讯数据保存结果：", r);
	}, e => {
		console.log("通讯数据保存结果：", r);
		uni.showToast({
			title: "通讯数据保存失败",
			icon: "error"
		})
	})
	let sqlArr = ["UPDATE  SYSYWTEMP001 SET STATUS= '1' WHERE YWTYPE = '" + is_ywtype +
		"' AND  BILL = '" + pm_bill + "'",
		"UPDATE  SYSYWTEMP002 SET STATUS= '1' WHERE YWTYPE = '" + is_ywtype +
		"' AND  BILL = '" + pm_bill + "'"
	]
	await db.get().executeDml(sqlArr, r => {
		console.log("更改外卖单状态结果:", r);
		uni.showToast({
			title: "报损单保存成功"
		})
	}, e => {
		uni.showToast({
			title: "报损单保存失败",
			icon: "error"
		})
	})
}
//确认提交报损
var ConfirmBS = function(e, bill) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConfirmBS";
	let reqdata = Req.resObj(true, "操作中...", e, apistr);
	Req.asyncFuncOne(reqdata, res => {
		console.log("后台报损返回数据:", res);
		let arr = JSON.parse(res.data).split(';');
		arr = arr.filter(r => r != ""); //去除分割后的空字符串
		db.get().executeDml(arr, "本地保存中...", r => {
			console.log("本地单据保存成功:", err);
			dj_commit(bill, "QTBS");
		}, err => {
			console.log("本地单据保存异常:", err);
		})
	}, err1 => {
		console.log("后台报损返回数据:", err1);
	});
}
export default {
	GetWMOrders,
	GetWMOrderDetail,
	ConfirmReceipt,
	CommonRefund,
	GetBSData,
	ConfirmBS,
	dj_commit
}
