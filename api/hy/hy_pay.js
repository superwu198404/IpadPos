import configInfo from '@/utils/configInfo.js'; //配置参数
import Req from '@/utils/request.js';

//扫码消费接口
function QRCODE_CONSUME(m, c, a, p, s, st, me, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "QRCODE_CONSUME",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"merOrderId": m,
			"cardNo": c,
			"amount": a,
			"posOrderType": p,
			"storeNo": s,
			"storeName": st,
			"merchantNo": me
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}
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


//实体卡刷卡支付
function CONSUME(m, c, t, p, a, s, me, st, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "CONSUME",
		"appid": configInfo.appid,
		"paramkey": "cardNo",
		"data": {
			"merOrderId": m,
			"cardNo": c,
			"track": t,
			"posOrderType": p,
			"amount": a,
			"storeNo": s,
			"merchantNo": me,
			"storeName": st
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}
//通联卡退款
function REFUND(m, o, a, p func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "REFUND",
		"appid": configInfo.appid,
		"paramkey": "cardNo",
		"data": {
			"merOrderId": m
			"oriOrderId": o,
			"amount": a,
			"payTxnId": p//"{\"code\":\"E\",\"msg\":\"订单不存在\",\"req_guid\":\"ab4d9790-d0ec-408b-b524-8d5263d6f764\"}"
		}
	}, "退款中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

export default {
	SALE_QUERY,
	QRCODE_CONSUME,
	CONSUME,
	REFUND
}
