import configInfo from '@/utils/configInfo.js'; //配置参数
import Req from '@/utils/request.js';

//会员信息查询接口
function Query_Member_Assets(acc, type, func) {
	Req.http("Hy/Query_Member_Assets", {
		"apiname": "Query_Member_Assets",
		"appid": configInfo.appid,
		"paramkey": "acc",
		"data": {
			"acc": acc,
			"type": type,
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
function hyQuery_new(a, t, func) {
	Req.http("Hy/hyQuery_new", {
		"apiname": "hyQuery_new",
		"appid": configInfo.appid,
		"paramkey": "acc",
		"data": {
			"acc": a,
			"type": t
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
function queryCustomCard(p,t, func) {
	Req.http("Hy/queryCustomCard", {
      "appid": configInfo.appid,
      "apiname": "queryCustomCard",
      "paramkey": "others",
      "source": "wxsmallprogram",
      "data": {
        "type": "queryCustomCard",
        "kquser": configInfo.kquser,
        "ynencript": "N",
        "databody": {
			 "kquser":configInfo.kquser,
			 "phone": p,
			 "type": t
		}
      },
	   "phone": p
    }, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//仟吉单券查询
function TicktQuery(a,b, func) {
	Req.http("Hy/TicktQuery", {
		"apiname": "TICKETQUERY",
		"appid": configInfo.appid,
		"paramkey": "acc",
		"data": {
			"GT_IMPORT": [
			     {  
			     "ZZCP_NUM": a,
			      "ZZCPHX_STORE": b
			     }
		      ]
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//仟吉单券核销
function TicktUse(data=[], func) {
	Req.http("Hy/TicktUse", {
		"apiname": "TICKETUSE",
		"appid": configInfo.appid,
		"paramkey": "acc",
		"data": {
			"GT_IMPORT": data 
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//卓越单券查询
 
//卓越券核销
function couponConsume(d,b, func) {
	Req.http("Hy/couponConsume", {
      "appid": configInfo.appid,
      "apiname": "couponConsume",
      "paramkey": "others",
      "source": "wxsmallprogram",
      "data": {
        "type": "queryCustomCard",
        "kquser": configInfo.kquser,
        "ynencript": "Y",
        "databody": d,
		"bill":b
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
