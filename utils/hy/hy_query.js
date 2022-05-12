import configInfo from '@/utils/configInfo.js'; //配置参数
import Req from '@/utils/request.js';

//会员信息查询接口
const  Query_Member_Assets= (a, b, func) =>{
	Req.http("Hy/hy", {
		apiname: "Query_Member_Assets",
		appid: configInfo.appid,
		paramkey: "acc", 
		data: {
			acc: acc,
			type: type,
		}
	}, "查询中...", {
		url: "center"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//会员中心查询查询接口
const hyQuery_new= (a, b, func)=> {
	Req.http("Hy/hy", {
		apiname: "hyQuery_new",
		appid: configInfo.appid,
		paramkey: "acc", 
		data: {
			acc: acc,
			type: type,
		}
	}, "查询中...", {
		url: "center"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
 
//会员中心查询查询接口
const queryCustomCard=(p, t, func)=> {
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
		url: "center"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
 
//仟吉单券查询
const QJTicktQuery= (a, b, func)=> {
	Req.http("Hy/hy", {
		apiname: "TICKETQUERY",
		appid: configInfo.appid,
		paramkey: "acc",
		data: {
			GT_IMPORT: [{
				ZZCP_NUM: a,
				ZZCPHX_STORE: b
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
const QJTicktUse=(d, func)=> {
	Req.http("Hy/hy", {
		apiname: "TICKETUSE",
		appid: configInfo.appid,
		paramkey: "acc",
		data: {
			GT_IMPORT: d
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
const couponConsume= (d,b,func)=> {
	Req.http("Hy/hy", {
		appid: configInfo.appid,
		apiname: "couponConsume",
		paramkey: "others",
		source: "wxsmallprogram",
		data: {
			type: "queryCustomCard",
			kquser: configInfo.kquser,
			ynencript: "Y",
			databody: d,
		    bill: b
		}
	}, "查询中...", {
		url: "center"
	}).then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
 
const HyQuery= (a,b,func)=>{
	if(configInfo.Brand=="QJ"){
		Query_Member_Assets(a,b,func);
	}else if(configInfo.Brand=="ZY"){
		queryCustomCard(a,b,func);
	}
};
const TicktQuery= (a,b, func)=>{
	if(configInfo.Brand=="QJ"){
		QJTicktQuery(a,b,func);
	}else if(configInfo.Brand=="ZY"){
		 
	}
};
const TicktUse= (d,b, func)=>{
	if(configInfo.Brand=="QJ"){
		QJTicktUse(d,b,func);
	}else if(configInfo.Brand=="ZY"){
		couponConsume(d,b);
	}
};
 

//仟吉会员卡二维码核销接口
function QRCODE_CONSUME(e, func) {
	Req.http("Hy/QRCODE_CONSUME", {
		"appid": configInfo.appid,
		"apiname": "QRCODE_CONSUME",
		"paramkey": "cardNo",
		"source": "mobile_pos",
		"data": {
			"merOrderId": e.orderInfo.orderbill,
			"cardNo": e.paycode,
			"amount": e.orderInfo.ordernet,
			"posOrderType": "1",
			"storeNo": e.storeid,
			"storeName": e.storename,
			"merchantNo": e.mer_id
		}
	}, "核销中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//仟吉 支付订单查询接口
function SALE_QUERY(m, func) {
	Req.http("Hy/SALE_QUERY", {
		"appid": configInfo.appid,
		"apiname": "SALE_QUERY",
		"paramkey": "merOrderId",
		"source": "mobile_pos",
		"data": {
			"merOrderId": m
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//仟吉 支付订单退款接口
function REFUND(e, func) {
	Req.http("Hy/REFUND", {
		"appid": configInfo.appid,
		"apiname": "REFUND",
		"paramkey": "merOrderId",
		"source": "mobile_pos",
		"data": {
			"merOrderId": e.orderbill,
			"oriOrderId": e.refundbill,
			"amount": e.refundnet,
			"payTxnId": e.payTxnId
		}
	}, "退款中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//卓越会员卡核销
function customCardpay(d, func) {
	Req.http("Hy/customCardpay", {
		"appid": configInfo.appid,
		"apiname": "customCardpay",
		"paramkey": "others",
		"source": "wxsmallprogram",
		"data": {
			"type": "customCardpay",
			"kquser": configInfo.kquser,
			"ynencript": "N",
			"databody": d
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//卓越卡核销后退款
function customCardrefund(d, func) {
	Req.http("Hy/customCardrefund", {
		"appid": configInfo.appid,
		"apiname": "customCardrefund",
		"paramkey": "bill",
		"source": "wxsmallprogram",
		"data": {
			"type": "customCardrefund",
			"kquser": configInfo.kquser,
			"ynencript": "N",
			"databody": d
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//支付接口
function PAY_ALL(m, e, func) {
	if (m == 'KG') {
		QRCODE_CONSUME(e, func);
	} else {
		customCardpay(e, func);
	}
}
//支付查询接口
function QUERY_ALL(m, e, func) {
	if (m == 'KG') {
		SALE_QUERY(e, func);
	} else {
		//customCardrefund(e, func);
	}
}
//退款接口
function REFUND_ALL(m, e, func) {
	if (m == 'KG') {
		REFUND(e, func);
	} else {
		customCardrefund(e, func);
	}
}

 
export default {
	HyQuery,
	TicktQuery,
	TicktUse,
	QRCODE_CONSUME,
	SALE_QUERY,
	REFUND,
	PAY_ALL,
	QUERY_ALL,
	REFUND_ALL
}
