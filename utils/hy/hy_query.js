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
function queryCustomCard(y, p,t, func) {
	Req.http("Hy/queryCustomCard", {
      "appid": configInfo.appid,
      "apiname": "queryCustomCard",
      "paramkey": "others",
      "source": "wxsmallprogram",
      "data": {
        "type": "queryCustomCard",
        "kquser": configInfo.kquser,
        "ynencript": y,
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


export default {
	Query_Member_Assets,
	hyQuery_new,
    queryCustomCard
}
