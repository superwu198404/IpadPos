import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

/**
 * 获取线上订单列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getReserveOrders = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetReserveOrders";
	let reqdata = Req.resObj(true, "预定取货查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
var GetAddr = function(data, func) {
	let apistr = "MobilePos_API.Models.YDSALE001CLASS.GetAddr";
	let reqdata = Req.resObj(true, "查询地址中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

var Del_Addr = function(data, func) {
	let apistr = "MobilePos_API.Models.YDSALE001CLASS.Del_Addr";
	let reqdata = Req.resObj(true, "查询地址中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

var ConfirmADDR = function(data, func) {
	let apistr = "MobilePos_API.Models.YDSALE001CLASS.ConfirmADDR";
	let reqdata = Req.resObj(true, "操作中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//获取高德配置信息
var GetAmap = async function(e, func) {
	// let obj = {
	// 	key: "254f6b89b324d15973e2408cbfad55c3",
	// 	areaid: "027"
	// };
	// return obj;
	let sql = "select zf from Dapzcs_Nr where id = 'AmapKey'";
	let sql1 = "select ZF from Dapzcs_Nr where id = 'CITYCODE' and id_nr=(select Adrp from khda where khid='" +
		e + "')";
	await db.get().executeQry(sql, "查询中...", r => {
		if (r.msg.length == 0) {
			obj.key = "254f6b89b324d15973e2408cbfad55c3";
		} else {
			obj.key = r.msg[0].ZF;
		}
	});
	await db.get().executeQry(sql1, "查询中...", r => {
		if (r.msg.length == 0) {
			obj.areaid = "027";
		} else {
			obj.areaid = r.msg[0].ZF;
		}
	});
	if (func) func(obj);
}

var MatchBHKH = function(data, func) {
	let apistr = "MobilePos_API.Models.YDSALE001CLASS.MatchBHKH";
	let reqdata = Req.resObj(true, "操作中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

var searchMapAddr = function(data, func) {
	let apistr = "MobilePos_API.Models.YDSALE001CLASS.searchMapAddr";
	let reqdata = Req.resObj(true, "操作中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

var getGSKHINFO = (gsid, khid) => {
	// await common.GetPOSCS(khid, r => {
	// 	console.log("POSCS查询结果", r)；
	// })
	let arr = util.getStorage("POSCS");
	console.log("POSCS查询结果:", arr);
	let obj = arr.find((r) => r.POSCS == 'KJGSFW');
	let Gskhinfo = " in ('" + gsid + "',";
	try {
		let addgsstr = "";
		let strgsz = obj.POSCSNR;//QxDict[KJGSFW];
		let arraygs = strgsz.Split(',');
		for (let i = 0; i < arraygs.Length; i++) {
			addgsstr += "'" + arraygs[i] + "',";
		}
		addgsstr = addgsstr.substr(0, addgsstr.length - 1);
		if (!addgsstr) {
			Gskhinfo = Gskhinfo.substr(0, Gskhinfo.length - 1);
		}
		Gskhinfo = Gskhinfo + addgsstr + ")";
	} catch {
		Gskhinfo = " in ('" + gsid + "')";
	}
	return Gskhinfo;
}
export default {
	GetAddr,
	Del_Addr,
	ConfirmADDR,
	GetAmap,
	searchMapAddr,
	MatchBHKH,
	getGSKHINFO
}
