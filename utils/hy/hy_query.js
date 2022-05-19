import Req from '@/utils/request.js';
var Brand=getApp().globalData.brand;
var appid = getApp().globalData.appid;
var kquser=getApp().globalData.kquser;
 
//会员信息查询接口
const  Query_Member_Assets= (a, b, func) =>{
	Req.http("Hy/hy", {
		apiname: "Query_Member_Assets",
		appid: appid,
		paramkey: "acc", 
		data: {
			acc: acc,
			type: type,
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

//会员中心查询查询接口
const hyQuery_new= (a, b, func)=> {
	Req.http("Hy/hy", {
		apiname: "hyQuery_new",
		appid: appid,
		paramkey: "acc", 
		data: {
			acc: acc,
			type: type,
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
 
//会员中心查询查询接口
const queryCustomCard=(p, t, func)=> {
	Req.http("Hy/hy", {
		apiname: "queryCustomCard",
		appid: appid,
		paramkey: "others",
		source: "wxsmallprogram",
		data: {
			type: "queryCustomCard",
			kquser: kquser,
			ynencript: "N",
			databody: {
				kquser: kquser,
				phone: p,
				type: t
			}
		},
		phone: p
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
 
//仟吉单券查询
const QJTicktQuery= (a, b, func)=> {
	Req.http("Hy/hy", {
		apiname: "TICKETQUERY",
		appid: appid,
		paramkey: "acc",
		data: {
			GT_IMPORT: [{
				ZZCP_NUM: a,
				ZZCPHX_STORE: b
			}]
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//仟吉单券核销
const QJTicktUse=(d, func)=> {
	Req.http("Hy/hy", {
		apiname: "TICKETUSE",
		appid: appid,
		paramkey: "acc",
		data: {
			GT_IMPORT: d
		}
	}, "核销中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//卓越券核销
const couponConsume= (d,b,func)=> {
	Req.http("Hy/hy", {
		appid: appid,
		apiname: "couponConsume",
		paramkey: "others",
		source: "wxsmallprogram",
		data: {
			type: "couponConsume",
			kquser: kquser,
			ynencript: "n",
			databody: d,
		    bill: b
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
const HyQuery= (a,b,func)=>{
	if(Brand="KG"){
		Query_Member_Assets(a,b,func);
	}else if(Brand=="ZY"){
		queryCustomCard(a,b,func);
	}
};
const TicktQuery= (a,b, func)=>{
	if(Brand=="KG"){
		QJTicktQuery(a,b,func);
	}else if(Brand=="ZY"){
		 func({code:true})
	}
};
const TicktUse= (d,b, func)=>{
	if(Brand=="KG"){
		QJTicktUse(d,func);
	}else if(Brand=="ZY"){
		couponConsume(d,b,func);
	}
};
 

//仟吉会员卡二维码核销接口
function QRCODE_CONSUME(e, func) {
	Req.http("Hy/hy", {
		"appid": appid,
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
	Req.http("Hy/hy", {
		"appid": appid,
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
	Req.http("Hy/hy", {
		"appid":appid,
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
	Req.http("Hy/hy", {
		"appid":appid,
		"apiname": "customCardpay",
		"paramkey": "others",
		"source": "wxsmallprogram",
		"data": {
			"type": "customCardpay",
			"kquser": kquser,
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
	Req.http("Hy/hy", {
		"appid": appid,
		"apiname": "customCardrefund",
		"paramkey": "bill",
		"source": "wxsmallprogram",
		"data": {
			"type": "customCardrefund",
			"kquser": kquser,
			"ynencript": "N",
			"databody": d
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//会员卡支付接口
function PAY_ALL(m, e, func) {
	if (m == 'KG') {
		QRCODE_CONSUME(e, func);
	} else {
		customCardpay(e, func);
	}
}
//会员卡支付查询接口
function QUERY_ALL(m, e, func) {
	if (m == 'KG') {
		SALE_QUERY(e, func);
	} else {
		func({code:true});
		//customCardrefund(e, func);
	}
}
//会员卡退款接口
function REFUND_ALL(m, e, func) {
	if (m == 'KG') {
		REFUND(e, func);
	} else {
		customCardrefund(e, func);
	}
}

//卓越积分
function consumeJFscore(d, func) {
	Req.http("Hy/hy", {
		"appid": appid,
		"apiname": "consumeJFscore",
		"source": "wxsmallprogram",
		"paramkey": "bill",
		"data": {
			"type": "consumeJFscore",
			"kquser": kquser,
			"ynencript": "N",
			"databody": d
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};

function newUploadHyjf(d, func) {
	Req.http("Hy/hy", {
		"appid": appid,
		"appid": "keengee",
		"paramkey": "acc",
		"data": d
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//会员积分
function consumeJF(f, func) {
	if (m == 'KG') {
		newUploadHyjf(e, func);
	} else {
		consumeJFscore(e, func);
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
