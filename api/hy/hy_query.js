import Req from '@/utils/request.js';
import _checker from '@/utils/graceChecker.js';
var Brand = getApp().globalData.brand;
var appid = getApp().globalData.appid;
var kquser = getApp().globalData.kquser;
var hyinfoModel = {
	hyId: null,
	CardNo: null,
	AllinPayAccount: null,
	AliPayId: null,
	AllinPayCardNo: null,
	ActivityId: null,
	youzanId: null,
	Balance: null,
	JFBalance: null,
	JFFactor: null,
	Name: null,
	NickName: null,
	CertNum: null,
	Phone: null,
	Birthday: null,
	Avatar: null,
	Sex: null,
	CountryCode: null,
	ProvinceCode: null,
	CityCode: null,
	DistrictCode: null,
	OrgCode: null,
	Area_code: null,
	Area: null,
	OpenId: null,
	AppId: null,
	UnionId: null,
	ynhyk: null,
	Vamt: null,
	Couponnum: null,
	CardType: null,
	RegisterDay: null,
	CreateTime: null,
	Status: null,
	ktypename: null,
	WxCpFriend: null,
	giftcard: [],
	hy_Level: {
		hyId: null,
		CardNo: null,
		CardType: null,
		ShowIndex: null,
		dValue: null,
		Level: null,
		LevelName: null,
		CardLevel: null,
		nextLevelName: null,
		JFBalance: null,
		Balance: null,
		ExpDate: null,
		CardStatus: null,
		TotalRefundAmount: null,
		TotalConsumeAmount: null
	},
	hy_Assets: {
		hyId: null,
		GiftAmt: null,
		GiftDisAmt: null,
		OverdueValue: null,
		FreezeValue: null,
		eVipDisAmt: null
	}
}
//会员信息查询接口
const Query_Member_Assets = (d, func) => {
	Req.http("Hy/hy", {
		apiname: "Query_Member_Assets",
		appid: appid,
		paramkey: "acc",
		data: d
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//会员中心查询查询接口
const hyQuery_new = (a, b, func) => {
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
const queryCustomCard = (p, func) => {
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
				type: '1'
			}
		},
		phone: p
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//会员中心查询查询接口
const queryCustomCard_Pos = (p, func) => {
	Req.http("Hy/hy", {
		apiname: "queryCustomCard_Pos",
		appid: appid,
		paramkey: "others",
		source: "wxsmallprogram",
		data: {
			type: "queryCustomCard_Pos",
			kquser: kquser,
			ynencript: "N",
			databody: {
				kquser: kquser,
				phone: p,
				type: '1'
			}
		},
		phone: p
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//卓越会员查询
const GetCardInfo = (c, func) => {
	Req.http("Hy/hy", {
		apiname: "GetCardInfo",
		appid: appid,
		paramkey: "others",
		source: "wxsmallprogram",
		data: {
			type: "GetCardInfo",
			kquser: kquser,
			ynencript: "N",
			databody: {
				kquser: kquser,
				cardtype: "ELEC",
				card_id: c.code
			}
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//仟吉单券查询
const QJTicktQuery = (a, b, func) => {
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
const Query_Member_Assets_Code = (d, func) => {
	Req.http("Hy/hy", {
		apiname: "Query_Member_Assets_Code",
		appid: appid,
		paramkey: "YWD",
		data: {
			YWD: '门店' + d.khid + '查询信息:' + d.code,
			qr: d.code
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//仟吉单券核销
const QJTicktUse = (d, func) => {
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
//会员券列表——卓越
const customcouponList = (p, func) => {
	Req.http("Hy/hy", {
		appid: appid,
		apiname: "customcouponList",
		paramkey: "others",
		source: "wxsmallprogram",
		data: {
			type: "customcouponList",
			kquser: kquser,
			ynencript: "n",
			databody: {
				kquser: "CSKQ",
				phone: p
			},
			phone: p
		}
	}, "查询中...").then(function(res) {
		if (func) func(res);
		return res;
	})
}
/**
 * 仟吉会员券列表查询
 * @param {} o 
 * @param {*} func 
 */
const NEW_HYQCX = (o, func) => {
	Req.http("Hy/hy", {
		appid: appid,
		apiname: "NEW_HYQCX",
		paramkey: "I_PARTNER",
		source: "Mobile_Pos",
		data: {
			I_PARTNER: o,
			I_ZZCPSTATE: "J01"
		}
	}, "查询中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
}
//卓越券核销
const couponConsume = (d, b, func) => {
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
const HyQuery = (mumbers, func) => {
	let typeName = null;
	let flag = _checker.checkMobile(mumbers);
	if (Brand == "KG") {
		if (flag) {
			typeName = 'Mobile';
		} else {
			typeName = 'ACCOUNT';
		}
		let obj = {
			acc: mumbers,
			type: typeName
		}
		Query_Member_Assets(obj, func);
	} else if (Brand == "ZY") {
		queryCustomCard_Pos(mumbers, func);
	}
};
/**
 *会员扫码查询 
 * @param {*} o 
 * @param {*} func 
 */
const HyCodeQuery = (o, func) => {
	if (Brand == "KG") {
		Query_Member_Assets_Code(o, func)
	} else if (Brand == "ZY") {
		GetCardInfo(o, func);
	}
};
const TicktQuery = (a, b, func) => {
	if (Brand == "KG") {
		QJTicktQuery(a, b, func);
	} else if (Brand == "ZY") {
		func({
			code: true
		})
	}
};
const TicktUse = (d, b, func) => {
	if (Brand == "KG") {
		QJTicktUse(d, func);
	} else if (Brand == "ZY") {
		couponConsume(d, b, func);
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
		"appid": appid,
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
		"appid": appid,
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
		func({
			code: true
		});
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

/**
 *会员券列表(组合)
 * @param {*} o 
 * @param {*} func 
 */
const CouponList_ALL = (o, func) => {
	if (Brand == "KG") {
		NEW_HYQCX(o, func);
	} else if (Brand == "ZY") {
		customcouponList(o, func);
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

//增加积分
function newUploadHyjf(d, func) {
	Req.http("Hy/hy", {
		"appid": appid,
		"apiname": "newUploadHyjf",
		"paramkey": "code",
		"data": d
	}, "积分上传中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
/**
 *扣减积分 
 * @param {*} d 
 * @param {*} func 
 */
function minusHyJf(d, func) {
	Req.http("Hy/hy", {
		"appid": appid,
		"apiname": "minusHyJf",
		"paramkey": "code",
		"data": d
	}, "积分上传中...").then(function(res) {
		//console.log(res);
		if (func) func(res);
		return res;
	})
};
//会员积分 合集(支付调用)
const consumeJF = function(m, e, func) {
	if (m == 'KG') {
		newUploadHyjf(e, func);
	} else {
		consumeJFscore(e, func);
	}
}
export default {
	HyQuery,
	HyCodeQuery,
	TicktQuery,
	TicktUse,
	QRCODE_CONSUME,
	SALE_QUERY,
	REFUND,
	PAY_ALL,
	QUERY_ALL,
	REFUND_ALL,
	CouponList_ALL,
	hyinfoModel,
	consumeJF,
	minusHyJf
}
