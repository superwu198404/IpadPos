import configInfo from '@/utils/configInfo.js'; //配置参数
import Req from '@/utils/request.js';

//会员信息查询接口
function Query_Member_Assets(a, b, func) {
	Req.http("Hy/hy", {
		apiname: "Query_Member_Assets",
		appid: configInfo.appid,
		paramkey: "acc", 
		data: {
			acc: acc,
			type: type,
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//会员中心查询查询接口
function hyQuery_new(a, b, func) {
	Req.http("Hy/hy", {
		apiname: "hyQuery_new",
		appid: configInfo.appid,
		paramkey: "acc", 
		data: {
			acc: acc,
			type: type,
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
 
//会员中心查询查询接口
function queryCustomCard(a, b, func) {
	Req.http("Hy/hy", {
		apiname: "queryCustomCard",
		appid: configInfo.appid,
		paramkey: "others",
		source: "wxsmallprogram",
		data: {
			type: "queryCustomCard",
			kquser: configInfo.kquser,
			ynencript: "N",
			databody: {
				kquser: configInfo.kquser,
				phone: p,
				type: t
			}
		},
		phone: p
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
 

//仟吉单券查询
function TicktQuery(a, b, func) {
	Req.http("Hy/hy", {
		"apiname": "TICKETQUERY",
		"appid": configInfo.appid,
		"paramkey": "acc",
		"data": {
			"GT_IMPORT": [{
				"ZZCP_NUM": a,
				"ZZCPHX_STORE": b
			}]
		}
	}, "查询中...", {
		url: "center"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//仟吉单券核销
function TicktUse(data = [], func) {
	Req.http("Hy/hy", {
		"apiname": "TICKETUSE",
		"appid": configInfo.appid,
		"paramkey": "acc",
		"data": {
			"GT_IMPORT": data
		}
	}, "核销中...", {
		url: "center"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};


//卓越券核销
function couponConsume(d, b, func) {
	Req.http("Hy/hy", {
		"appid": configInfo.appid,
		"apiname": "couponConsume",
		"paramkey": "others",
		"source": "wxsmallprogram",
		"data": {
			"type": "queryCustomCard",
			"kquser": configInfo.kquser,
			"ynencript": "Y",
			"databody": d,
			"bill": b
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
export default {
	Query_Member_Assets,
	hyQuery_new,
	queryCustomCard,
	TicktQuery,
	couponConsume,
	TicktUse
}
