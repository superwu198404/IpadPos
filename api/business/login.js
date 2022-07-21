import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

var GetPassWord = function(userid, password, func) {
	// debugger;
	// let a = '&49|ADvC49FiXV133PVIA35}jw155G09wCB03*29w#A@';
	// let newPs = get_mystr(a);
	// newPs = newPs.substr(2, newPs.length - 4)
	// console.log(newPs)
	// return
	let sql = "select password_MD,gwid,SNAME from  MDRYKH where ryid='" + userid + "'";
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
			util.simpleMsg("无该用户信息", true);
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

export default {
	GetPassWord
}
