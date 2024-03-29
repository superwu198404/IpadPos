import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

var app = getApp();


var PTIP = {
	HandleMsg: function(t, e) {
		return {
			type: t,
			url: ".../",
			data: e
		};
	},
	DelMsg: function(e) {}
}
var JJPT = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var XTIP = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var CTIP = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var STIP = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var SQIP = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var QWIP = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var DZD = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var RTIP = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var DBSCDCL = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var BHPSL = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var KQDBL = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var WLIP = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var WMYS = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}
var HRSC = {
	HandleMsg: function(e) {},
	DelMsg: function(e) {}
}

//消息类型枚举
var msgEnum = {
	PTIP: PTIP,
	JJPT: JJPT,
	XTIP: XTIP,
	CTIP: CTIP,
	STIP: STIP,
	SQIP: SQIP,
	QWIP: QWIP,
	DZD: DZD,
	RTIP: RTIP,
	DBSCDCL: DBSCDCL,
	BHPSL: BHPSL,
	KQDBL: KQDBL,
	WLIP: WLIP,
	WMYS: WMYS,
	HRSC: HRSC
}
//处理消息
var HandleMsg = (type, data) => {
	return msgEnum[type].HandleMsg(type, data);
}
//消息已读
var DelMsg = (type, data, func) => {
	return msgEnum[type].DelMsg(data, func);
}
/**
 * 获取门店所有消息
 * @param {*} e 
 * @param {*} func 
 */
var GetAllMsg = function(e, t, func) {
	let apistr = "MobilePos_API.Models.MessageCLASS.GetMessage";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e,
		type: t
	}, apistr, false); //不显示加载提示
	// console.log("查询门店消息");
	// Req.asyncFuncOne(reqdata, func, func);
	Req.HttpPersonal(reqdata, func)
}

//获取消息方法
var ShowMsg = function(khid, type, func) {
	_ShowMsg(khid, type, func);
	if (!getApp().globalData.msgInt) {
		getApp().globalData.msgInt = setInterval(r => {
			_ShowMsg(khid, type, func);
		}, 60000); //一分钟查询一次
	}
}
//获取消息方法1
var _ShowMsg = function(khid, type = "", func) {
	GetAllMsg(khid, type, res => {
		if (res.code) {
			// console.log("消息数据：", res);
			let data = JSON.parse(res.data);
			if (func) func(data);
		}
	});
}
/**
 * 消息已读
 * @param {*} e 
 * @param {*} func 
 */
var DelMsg = function(e, d, func) {
	let apistr = "MobilePos_API.Models.MessageCLASS.DelMessage";
	let reqdata = Req.resObj(true, "操作中...", {
		khid: e,
		msg: d
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
export default {
	GetAllMsg,
	ShowMsg,
	DelMsg,
	_ShowMsg
}
