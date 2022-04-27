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


//会员中心查询查询接口
function hyQuery_new(a, t, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
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
}



//会员查询
function queryHyBy(m, c, a, p, s, st, me, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "queryHyBy",
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
//单卡查询
function CARD_QUERY(c, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "CARD_QUERY",
		"appid": configInfo.appid,
		"paramkey": "cardNo",
		"data": {
			"cardNo": c
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//VIP卡充值
function posPayRecharge(m, c, r, d, e, em, s, st, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "posPayRecharge",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"merOrderId": m,
			"cardNumber": c,
			"rechargeAmount": r,
			"discountAmount": d,
			"empNo": e,
			"empName": em,
			"storeCode": s,
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

//VIP卡充值
function POS_BIND_CARD(a, c, e, s, st, t, b, bi, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "POS_BIND_CARD",
		"appid": configInfo.appid,
		"paramkey": "cardNo",
		"data": {
			"account": a,
			"cardNo": c,
			"empNo": e,
			"storeCode": s,
			"storeName": st,
			"track": t,
			"bindUserCode": b,
			"bindUserName": bi
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//VIP单卡激活
function singleCardActiveConfirm(m, ma, a, d, c, ap, s, sa, sal, sale, g, ca, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "singleCardActiveConfirm",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"merOrderId": m,
			"materielId": ma,
			"amount": a,
			"disAmount": d,
			"channel": c,
			"appKey": ap,
			"saleStoreCode": s,
			"saleStoreName": sa,
			"saleUserCode": sal,
			"saleUserName": sale,
			"guestFlag": g,
			"cardNo": ca
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//VIP单卡激活
function singleCardActiveApply(m, ma, a, d, c, ap, s, sa, sal, sale, g, ca, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "singleCardActiveApply",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"merOrderId": m,
			"materielId": ma,
			"amount": a,
			"disAmount": d,
			"channel": c,
			"appKey": ap,
			"saleStoreCode": s,
			"saleStoreName": sa,
			"saleUserCode": sal,
			"saleUserName": sale,
			"guestFlag": g,
			"cardNo": ca
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//卡号段可激活数量校验
function checkCardsActiveNums(c, ca, car, m, s, v, card, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "checkCardsActiveNums",
		"appid": configInfo.appid,
		"paramkey": "cardNoBegin",
		"data": {
			"channel": c,
			"cardNoBegin": ca,
			"cardNoEnd": car,
			"materielId": m,
			"saleStoreCode": s,
			"validStore": v,
			"cardNum": card
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//礼品卡批量申请（校验）
function batchCardActiveApply(c, o, ca, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "batchCardActiveApply",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"channel": c,
			"orderList": o,
			"cardList": ca
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//礼品卡批量激活
function batchCardActiveConfirm(c, m, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "batchCardActiveConfirm",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"channel": c,
			"merOrderId": m
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//VIP卡登记

function updateCustomerInfo(c, p, n, s, i, st, sto, e, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "updateCustomerInfo",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"cardNo": c,
			"phone": p,
			"name": n,
			"sex": s,
			"idCardNo": i,
			"storeNo": st,
			"storeName": sto,
			"empNo": e
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}
//查询VIP卡登记信息
function queryVipCardInfo(c, p, y, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "queryVipCardInfo",
		"appid": configInfo.appid,
		"paramkey": "YWD",
		"data": {
			"cardNo": c,
			"phone": p,
			"YWD": y
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//卡延期
function CARD_DELAY(m, c, cr, cre, s, st, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "CARD_DELAY",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"merOrderId": m,
			"cardNo": c,
			"createUserCode": cr,
			"createUserName": cre,
			"storeNo": s,
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

//易慧达卡信息查询
function CardQuery_YHD(a, s, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "CardQuery_YHD",
		"appid": configInfo.appid,
		"paramkey": "secretCode",
		"data": {
			"area": a,
			"secretCode": s
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}


//易慧达卡充值
function CardRecharge_YHD(a, ar, s, e, em, m, st, sto, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "CardRecharge_YHD",
		"appid": configInfo.appid,
		"paramkey": "account",
		"data": {
			"account": a,
			"area": ar,
			"secretCode": s,
			"empNo": e,
			"empName": em,
			"merOrderId": m,
			"storeCode": st,
			"storeName": sto
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//VIP卡挂失
function REPORT_LOSS(m, c, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "REPORT_LOSS",
		"appid": configInfo.appid,
		"paramkey": "merOrderId",
		"data": {
			"merOrderId": m,
			"cardNo": c
		}
	}, "查询中...", {
		url: "jkpt"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}

//查询卡消费明细
function CARD_RECORDS(c, t, func) {
	Req.http("TestTimeOut/CenterTransRetData", {
		"apiname": "CARD_RECORDS",
		"appid": configInfo.appid,
		"paramkey": "cardNo",
		"data": {
			"cardNo": c,
			"track": t
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
	hyQuery_new,
	CARD_QUERY,
	posPayRecharge,
	POS_BIND_CARD,
	singleCardActiveConfirm,
	singleCardActiveApply,
	checkCardsActiveNums,
	batchCardActiveApply,
	batchCardActiveConfirm,
	updateCustomerInfo,
	queryVipCardInfo,
	CARD_DELAY,
	CardQuery_YHD,
	CardRecharge_YHD,
	REPORT_LOSS,
	CARD_RECORDS
}
