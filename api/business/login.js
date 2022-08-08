import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

var GetPassWord = function(khid, userid, password, func) {
	let sql = "select password_MD,gwid,SNAME from MDRYKH where ryid='" + userid + "' and khid='" + khid + "'";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("用户密码查询结果：", res);
		if (res.code && res.msg.length > 0) {
			let ps = res.msg[0].PASSWORD_MD;
			let newPs = get_mystr(ps);
			console.log("密文解密：", ps);
			newPs = newPs.substr(2, newPs.length - 4);
			if (newPs != password) {
				util.simpleMsg("密码错误！", true);
				return;
			}
			if (func) func({
				code: true,
				msg: "登录成功"
			});
		} else {
			util.simpleMsg("账号错误，请检查", true);
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

//初始化当前门店信息
var InitStore = function(khid, posid, ryinfo, func) {
	let store = {};
	let sql =
		"SELECT GSID,POSCSZID,SNAME,KHDA.adress,khda.Phone,sname ,CLIENT_TYPE,DQID,DPID,GCID,KHZID,ADRC,ADRPNAME ,KCDID,ZZTLX,JGID FROM KHDA where KHID='" +
		khid + "'";
	db.get().executeQry(sql, "加载中...", res => {
		console.log("门店信息查询成功：", res);
		store = {
			GSID: res.msg[0].GSID,
			KHID: khid,
			POSID: posid,
			RYID: "10086",
			KCDID: res.msg[0].KCDID,
			DPID: res.msg[0].DPID,
			// DKFID: '80000000',
			// BMID: "001",
			GCID: res.msg[0].GCID,
			DQID: res.msg[0].DQID,
			NAME: res.msg[0].SNAME,
			// MERID: "999990053990001",
			// deviceno: "13001001",
			KHAddress: res.msg[0].ADDRESS,
			POSCSZID: res.msg[0].POSCSZID,
			RYNAME: "老王",
			KHZID: res.msg[0].KHZID,
			PHONE: res.msg[0].PHONE,
		}
		getApp().globalData.store = Object.assign(getApp().globalData.store, store);
		console.log("初始化后的信息：", getApp().globalData.store);

	}, err => {
		console.log("门店信息查询失败：", err);
	})
}

export default {
	GetPassWord,
	GetKHIDByRYID
}
