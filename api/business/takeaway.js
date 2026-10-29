import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import _member from '@/api/hy/MemberInterfaces.js';
import * as _gift from '@/api/hy/gift_point.js';

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
//检查是否有生产
var GetOrderHasSC = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetOrderHasSC";
	let reqdata = Req.resObj(true, "操作中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
//同意和拒绝退单
var CommonRefund = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.CommonRefund";
	e.appid = getApp().globalData.appid;
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
	var sql = "select spid,sname,unit,BQTY,sum(zqty) zqty,YNJF,PRICE from ( \
                                 select \
                                 x.SPID_ZP SPID,s.SNAME,s.UNIT, \
                                 0 BQTY,x.ZQTY_ZP ZQTY,nvl(x.NOTE,'N') YNJF,\
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
                                 and ( sk.spid IS NOT NULL OR nvl( x.note, 'N' ) = 'Y' ) \
                                 and (x.dqid = '" + dqid + "' or x.dqid = 'K00000' or x.khid = '" + khid +
		"' or x.SYBID = '" + sybid + "') \
                                 and (x.plid in ('" + plids + "') or x.plid is null ) \
                                 and (x.spid in ('" + spids + "') or x.spid is null ) \
                                 and (x.cccz in (select specs from spda where spid in ('" + spids + "')) or x.cccz is null ) \
                            ) group by spid,sname,unit,BQTY,YNJF,PRICE \
                            order by decode(YNJF,'Y',0,9999) ";
	console.log("[GetZSData]查询sql：", sql);
	await common.WebDBQuery(sql, res => {
		console.log("[GetZSData]查询结果：", res);
		if (res.code && res.data.length > 0) {
			info = JSON.parse(res.data || "");
		}
	});
	return info;
}
//查询本地已赠积分（销售赠品-赠积分）
var GetZSPayedData = async function(bill) {
	if (!bill) return null;
	let sql = "select BILL,KHID,SALEDATE,NO,STR1,STR2,LONGKEY,STR3,STR4,STR5 from SALE_PAYINFO where BILL = '" +
		bill + "'";
	console.log("[GetZSPayedData]查询sql：", sql);
	let info = null;
	await db.get().executeQry(sql, "查询中...", res => {
		console.log("[GetZSPayedData]查询结果：", res);
		if (res.code && res.msg && res.msg.length > 0)
			info = res.msg[0];
	});
	return info;
}
/**
 * 保存赠积分流水（本地 sqlite + 直接写服务器）
 * @param {Object} o
 * @param {String} o.bill     本单号
 * @param {String} o.khid     门店号
 * @param {String} o.saledate 销售时间
 * @param {Number} o.point    积分数，正值=赠送，负值=退还
 * @param {String} o.str1     退单时的原销售单号，正单传空
 */
var SaveZSPayed = async function(o, func) {
	let data = {
		BILL: o.bill,
		KHID: o.khid,
		SALEDATE: o.saledate,
		STR1: o.str1 || "",
		STR2: String(Number(o.point)),
		STR5: "SALEZS"
	};
	console.log("[SaveZSPayed]待保存数据：", data);
	//本地sqlite
	let lite = common.CreateSQL(data, "SALE_PAYINFO");
	//本地保存，失败即补一次：db_excute.js 的 executeDml 是无条件 begin，若此刻别处在途的
	//executeDml(打印写库 / CreateSaleOrder / PointUploadNew 等)还没走到 commit，
	//这里 begin 会失败(cannot start a transaction within a transaction)，SQL 一个字都不执行。
	//但加赠接口此刻已经调成功了，卓越侧积分加了、本地没有流水，
	//退单时 GetZSPayedData 查不到原单记录会跳过减赠，积分只加不退。
	//那段在途事务只持续几十毫秒(xprinter/util.js 的 addPos_XsBillPrintData 是 fire-and-forget)，
	//补写一次基本就过去了。这里只补一次、不循环、不等太久：
	//ConfirmJF 是 await 本函数的，阻塞会把收银员的"确定"按钮挂住，
	//他再点一次就会把加赠接口调两遍，积分翻倍——比少写一条流水更糟。
	let lite_res = await db.get().executeDml(lite.sqlliteSql, "保存中...", function(res) {
		return res;
	}, function(err) {
		console.log("[SaveZSPayed]本地保存失败：", err);
		return err;
	});
	if (!lite_res || !lite_res.code) {
		console.log("[SaveZSPayed]本地首次失败,300ms后补写一次：", lite_res && lite_res.msg);
		await new Promise(resolve => setTimeout(resolve, 300));
		lite_res = await db.get().executeDml(lite.sqlliteSql, "保存中...", function(res) {
			return res;
		}, function(err) {
			console.log("[SaveZSPayed]本地补写失败：", err);
			return err;
		});
	}
	if (lite_res && lite_res.code) {
		console.log("[SaveZSPayed]本地保存成功：", lite_res);
	} else {
		//不再阻断：服务器那条流水仍要写，避免两侧都不留痕。
		//此单退单时取不到原单赠积分记录，减赠会被跳过，需人工核对。
		console.log("[SaveZSPayed]本地保存最终失败,仍继续写服务器");
		util.simpleMsg("赠积分流水本地保存失败，退单可能无法自动退还积分，请留意", "none");
	}
	//直接写服务器(该表服务器与本地都有，不走 POS_TXFILE 中转)
	//注意：WebDBExecute 成功/失败走的是同一个回调，需自行判断 res.code
	await common.WebDBExecute(lite.oracleSql, res => {
		let ok = !!(res && res.code);
		console.log("[SaveZSPayed]服务器写入结果:", ok, res);
		if (!ok)
			util.simpleMsg("赠积分流水上传服务器失败:" + ((res && res.msg) || "未知错误"), true);
		if (func) func(ok);
	});
}
/**
 * 退单退还赠积分：从本地取出原单积分,取负写入退单记录,并调减赠接口
 * @param {Object} o
 * @param {String} o.oriBill  原销售单号（sale001.XS_BILL）
 * @param {String} o.bill     退单号（sale001.BILL）
 * @param {String} o.khid     门店号
 * @param {String} o.posid    POS号
 * @param {String} o.hyid     会员号
 * @param {String} o.saledate 退单时间
 */
var CancelZSPayed = async function(o, func) {
	let old = await GetZSPayedData(o.oriBill);
	if (!old || !old.STR2 || Number(old.STR2) == 0) {
		console.log("[CancelZSPayed]原单无赠积分记录,跳过:", o.oriBill);
		if (func) func(false);
		return;
	}
	let point = Math.abs(Number(old.STR2)); //原值可能已是负数,统一取绝对值
	console.log("[CancelZSPayed]原单赠积分:", point);
	//调减赠接口(value传正值)
	try {
		await _member.CancelGiftPoint("退还赠积分中...", {
			brand: getApp().globalData.brand,
			data: _gift.buildCancelGiftPoint({
				hyid: o.hyid,
				bill: o.bill,
				oriBill: o.oriBill,
				point: point
			})
		}, null, err => {
			console.log("[CancelZSPayed]减赠接口异常(不阻塞):", err);
		});
	} catch (e) {
		console.log("[CancelZSPayed]减赠接口异常(不阻塞):", e);
	}
	//写退单流水:STR2 取负
	await SaveZSPayed({
		bill: o.bill,
		khid: o.khid,
		saledate: o.saledate,
		point: -point,
		str1: o.oriBill
	}, func);
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
	e.appid = getApp().globalData.appid;
	let reqdata = Req.resObj(true, "操作中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
//外卖查询-换货
var GetWMOrderForChange = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrderForChange";
	let reqdata = Req.resObj(true, "查询中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
//外卖单详情-换货
var GetWMOrderDetailForChange = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrderDetailForChange";
	let reqdata = Req.resObj(true, "查询中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
//确认换绑
var ConfirmWMOrderForChange = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConfirmWMOrderForChange";
	let reqdata = Req.resObj(true, "操作中...", e, apistr, true);
	Req.asyncFuncOne(reqdata, func, func);
}
export default {
	GetWMOrders,
	GetWMOrderDetail,
	ConfirmReceipt,
	GetOrderHasSC,
	CommonRefund,
	GetBSData,
	ConfirmLY,
	dj_commit,
	GetWMDData,
	ConfirmBS,
	GetWMOrders_YD,
	ConfirmReceipt_YD,
	CommonRefund_YD,
	GetZSData,
	GetZSPayedData,
	SaveZSPayed,
	CancelZSPayed,
	GetWMOrderForChange,
	GetWMOrderDetailForChange,
	ConfirmWMOrderForChange
}