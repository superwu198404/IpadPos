import configInfo from '@/utils/configInfo.js'; //配置参数
import Req from '@/utils/request.js';

//扫码消费接口
function QRCODE_CONSUME(m, c, a, p, s, st, me, func) {
	Req.asyncFunc({
		http: true,
		url_type: "jkpt",
		url: "TestTimeOut/CenterTransRetData",
		title: "查询中...",
		data: {
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
		}
	}, function(res) {
		console.log("请求一：");
		if (func) func(res);
	});
}
//卡消费记录查询查询接口
function SALE_QUERY(a, func) {
	Req.asyncFunc({
		http: true,
		url_type: "jkpt",
		url: "TestTimeOut/CenterTransRetData",
		title: "查询中...",
		data: {
			"apiname": "SALE_QUERY",
			"appid": configInfo.appid,
			"paramkey": "merOrderId",
			"data": {
				"merOrderId": a
			}
		}
	}, function(res) {
		console.log("请求一：");
		if (func) func(res);
	});
}


//实体卡刷卡支付
function CONSUME(m, c, t, p, a, s, me, st, func) {
	Req.asyncFunc({
		http: true,
		url_type: "jkpt",
		url: "TestTimeOut/CenterTransRetData",
		title: "查询中...",
		data: {
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
		}
	}, function(res) {
		console.log("请求一：");
		if (func) func(res);
	});
}
//通联卡退款
function REFUND(m, o, a, p func) {
	Req.asyncFunc({
		http: true,
		url_type: "jkpt",
		url: "TestTimeOut/CenterTransRetData",
		title: "查询中...",
		data: {
			"apiname": "REFUND",
			"appid": configInfo.appid,
			"paramkey": "cardNo",
			"data": {
				"merOrderId": m "oriOrderId": o,
				"amount": a,
				"payTxnId": p //"{\"code\":\"E\",\"msg\":\"订单不存在\",\"req_guid\":\"ab4d9790-d0ec-408b-b524-8d5263d6f764\"}"
			}
		}
	}, function(res) {
		console.log("请求一：");
		if (func) func(res);
	});
}

export default {
	SALE_QUERY,
	QRCODE_CONSUME,
	CONSUME,
	REFUND
}
