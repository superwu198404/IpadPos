import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import dateformat from '@/utils/dateformat.js';
import Vue from 'vue'
import {
	global
} from '@/models/PaymentAll/models.js';

var GetPassWord = function(khid, userid, password, func) {
	let sql = "select password_MD,gwid,SNAME from MDRYKH where ryid='" + userid + "' and khid='" + khid + "'";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("用户密码查询结果：", res);
		if (res.code && res.msg.length > 0) {
			let ps = res.msg[0].PASSWORD_MD;
			if (!ps) {
				util.simpleMsg("账号密码异常", true);
				return;
			}
			let newPs = get_mystr(ps);
			console.log("密文解密：", ps);
			newPs = newPs.substr(2, newPs.length - 4);
			if (newPs != password) {
				util.simpleMsg("密码输入错误", true);
				return;
			}
			if (func) func({
				code: true,
				data: {
					ryid: userid,
					gwid: res.msg[0].GWID,
					name: res.msg[0].SNAME,
					pwd: password
				}
			});
		} else {
			util.simpleMsg("账号不允许登录当前门店！", "none");
		}
	}, err => {
		util.simpleMsg("校验异常", true);
	});
}
//密文解密
var get_mystr = function(pm_strpass) {
	let ls_str = "0A1*(B2Cmnopq3D4E5!@#)F6G7H8Irstu%^vwxyz9JKLM$&OP<>?|{}defghijklQSTUYVWXZRNabc";
	let pm_str = "";
	if (pm_strpass.length < 3) {
		return "";
	}
	try {
		pm_str = pm_strpass.substr(1, pm_strpass.length - 2);
		let pm_str_len = pm_str.length;
		let inx = 0,
			z = 0;
		let fist_len = 0;
		let mod2 = 0;
		let mod2_y;
		let num = 1;
		let ls_passstr;
		let ls_retstr = "";
		while (inx < pm_str_len) {
			num = 1;
			fist_len = parseInt(pm_str.substr(inx, 1));
			ls_passstr = pm_str.substr(inx, fist_len + 3);
			mod2 = parseInt(ls_passstr.substr(1, 1));
			let strzz = ls_passstr.substr(ls_passstr.length - 1, 1);
			mod2_y = ls_str.indexOf(strzz);
			if (fist_len >= 1 && fist_len <= 4) {
				mod2 = mod2 - 2;
			}
			if (fist_len >= 5 && fist_len <= 6) {
				mod2 = mod2 - 1;
			}
			if (mod2 >= 1) {
				for (z = 1; z <= mod2 - 1; z++) {
					num = num * 2;
				}
			} else {
				num = 0;
			}
			num = num + mod2_y;
			ls_retstr = ls_retstr + ls_str.substr(num, 1);
			inx = inx + fist_len + 3;
		}
		return ls_retstr;
	} catch {
		return "";
	}
}


//根据ryid 查询khid 一对多的关系
var GetKHIDByRYID = function(userid, func) {
	let sql = "select password_MD,gwid,SNAME,KHID from MDRYKH where ryid='" + userid + "'";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("用户信息查询结果：", res);
		func(res);
	}, err => {
		util.simpleMsg("校验异常", true);
	});
}
//修改本地密码
var UpdatePWD_Local = function(pwd, ryid, func) {
	let sql = "UPDATE MDRYKH SET PASSWORD_MD = '" + pwd + "' WHERE ryid = '" + ryid + "'";
	db.get().executeDml(sql, "操作中...", res => {
		console.log("密码修改成功：", res);
		if (func)
			func(res);
	}, err => {
		console.log("密码修改失败：", err);
		util.simpleMsg("密码修改失败：" + err.msg, "none");
	});
}
/**
 * 修改用户密码
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const UpdatePWD = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.UpdatePWD";
	let reqdata = Req.resObj(true, "操作中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
//初始化当前门店信息
var InitStore = function(khid, posid, ryinfo, func) {
	let store = {};
	let sql =
		"SELECT GSID,POSCSZID,SNAME,KHDA.adress,khda.Phone,sname ,CLIENT_TYPE,DQID,DQNAME,DPID,GCID,KHZID,ADRC,ADRPNAME ,KCDID,ZZTLX,JGID,STIME,ETIME FROM KHDA where KHID='" +
		khid + "'";
	db.get().executeQry(sql, "加载中...", res => {
		if (!res.code || res.msg.length == 0) {
			util.simpleMsg("门店信息查询失败，请重新初始化", "none");
			return;
		}
		console.warn("[InitStore]门店信息查询成功：", res);
		console.warn("[InitStore]人员信息展示：", ryinfo);
		store = {
			GSID: res.msg[0].GSID,
			KHID: khid,
			POSID: posid,
			KCDID: res.msg[0].KCDID,
			DPID: res.msg[0].DPID,
			GCID: res.msg[0].GCID,
			DQID: res.msg[0].DQID,
			DQNAME: res.msg[0].DQNAME,
			NAME: res.msg[0].SNAME,
			KHAddress: res.msg[0].ADDRESS,
			POSCSZID: res.msg[0].POSCSZID,
			KHZID: res.msg[0].KHZID,
			PHONE: res.msg[0].PHONE,
			RYNAME: ryinfo.name,
			RYID: ryinfo.ryid,
			RYTYPE: "PERSON",
			PWD: ryinfo.pwd,
			JGID: res.msg[0].JGID,
			STIME: dateformat.CheckStoreTime(res.msg[0].STIME),
			ETIME: dateformat.CheckStoreTime(res.msg[0].ETIME),
			DKFID: "80000000",
			DKFNAME: "默认大客户",
		}
		let store1 = util.getStorage("store");
		store1 = Object.assign(store1, store);
		util.setStorage("store", store1);
		console.log("[InitStore]全局混入客户端信息！");
		global.data = function(){
			return store1;
		};
		Vue.mixin(global);
		console.log("[InitStore]登录后的初始化信息：", store1);
		if (func) func({
			code: true,
			msg: "初始化成功"
		});
	}, err => {
		console.log("门店信息查询失败：", err);
	})
}

var YN_Sign = function(khid, posid, func) {
	let store = util.getStorage("store");
	if (store.OPENFLAG == '1') {
		util.simpleMsg("今日已签到");
		return;
	}
}

var SignOrSignOut = async function(ynqd, qtdate, func) {
	let salenum = 0,
		salenet = 0,
		openflag = 0;
	let sql = "SELECT COUNT(*) SALENUM,SUM(TNET) SALENET FROM  SALE001  WHERE SALEDATE =DATETIME('" + dateformat
		.getYMD(-1) + "')";
	await db.get().executeQry(sql, "查询中...", res => {
		if (res.code && res.msg.length > 0) {
			console.log("查询结果:", res);
			salenum = res.msg[0].SALENUM || 0;
			salenet = res.msg[0].SALENET || 0;
		}
	})
	let store = util.getStorage("store");
	let sql1 = "SELECT RUN_STATUS FROM KHYYMX  K1  WHERE  K1.KHID = '" + store.KHID +
		"'  and  DATE_YY>=DATETIME('" + dateformat.getYMD() + "')  and  DATE_YY<=DATETIME('" + dateformat
		.getYMD(1) + "')";
	await db.get().executeQry(sql1, "查询中...", res => {
		if (res.code && res.msg.length > 0) {
			console.log("签到查询结果:", res);
			openflag = res.msg[0].RUN_STATUS || 0;
			store.OPENFLAG = openflag;
			util.setStorage("store", store);
		}
	})
	// console.log("门店签到查询sql：", sql1);
	// console.log("门店签到信息：", openflag);
	let data = {
		gsid: store.GSID,
		khid: store.KHID,
		posid: store.POSID,
		ryid: store.RYID,
		ynqd,
		openflag: openflag,
		salenum,
		salenet,
		qtdate
	}

	let apistr = "MobilePos_API.Models.MainCLASS.SignOrSignOut";
	let reqdata = Req.resObj(true, "操作中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
var SignOrSignOutSql = async function(sql, func) {
	let sqlArr = sql.split(';');
	await db.get().executeDml(sqlArr[0], "执行中...", res => {
		console.log("更新签到sql结果：", res);
	}, err => {
		console.log("更新签到sql异常：", err);
	})
	await db.get().executeQry(sqlArr[1], "查询中...", res => {
		if (res.code && res.msg.length > 0) {
			let store = util.getStorage("store");
			store.OPENFLAG = res.msg[0].RUN_STATUS;
			console.log("新的签到数据：", store);
			util.setStorage("store", store);
			if (func) func(store);
		} else {
			console.log("未查询到签到数据：", res);
			util.simpleMsg("签到异常，请退出后重试", "none");
		}
	}, err => {
		console.log("签到sql查询异常:", err);
	})
}
//获取一周能是否有未日结的数据
var GetSignOutInWeek = async function(func) {
	let store = util.getStorage("store");

	let data = {
		khid: store.KHID
	}
	let apistr = "MobilePos_API.Models.MainCLASS.GetSignOutInWeek";
	let reqdata = Req.resObj(true, "查询中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
//获取收银员是否结款
var GetSkyJk = async function(func) {
	let store = util.getStorage("store");

	let data = {
		khid: store.KHID,
		ryid: store.RYID
	}
	let apistr = "MobilePos_API.Models.MainCLASS.GetSkyJk";
	let reqdata = Req.resObj(true, "查询中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

export default {
	GetPassWord,
	GetKHIDByRYID,
	InitStore,
	UpdatePWD,
	UpdatePWD_Local,
	SignOrSignOut,
	SignOrSignOutSql,
	GetSignOutInWeek,
	GetSkyJk
}
