import configInfo from '@/utils/configInfo.js'; //配置参数
import Req from '@/utils/request.js';

//会员信息查询接口
function Query_Member_Assets(acc, type, func) {
	Req.http("TestTimeOut/CenterTransBySelf", {
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
//会员优惠券查询接口
function NEW_HYQCX(a, b, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "NEW_HYQCX",
		"appid": configInfo.appid,
		"paramkey": "I_PARTNER",
		"data": {
			"I_PARTNER": a,
			"I_ZZCPSTATE": b
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//卡消费记录查询查询接口
function SALE_QUERY(a, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "SALE_QUERY",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			  "merOrderId": a
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}
export default {
	Query_Member_Assets,
	NEW_HYQCX,
	SALE_QUERY
}
