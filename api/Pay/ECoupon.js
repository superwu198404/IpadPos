import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

/**
 * 电子券支付类
 */
var CouonPay = function() {
	this.BasePayment = async function(t, p, d, func) {
		Req.asyncFuncOne({
			http: {
				load: true,
				url: "/PaymentAll/Handle",
				title: t,
			},
			method: "POST",
			data: {
				paytype: "ECoupon_Payment",
				method: p,
				param: {
					appid: getApp().globalData.appid,
					gsid: getApp().globalData.store.GSID
				},
				//sign: rsa.rsaEncrypt(JSON.stringify(d))
				sign: aes.aesEncrypt(JSON.stringify(d))
			}
		}, function(res) {
			if (func)
				func(res)
		}, function(res) {
			// if (func)
			// 	func(res)
			util.simpleMsg( res.msg, true);
		});
	};

	/**
	 *支付接口 
	 * @param {*} d 
	 * @param {*} func 
	 */
	this.Payment = function(d, func) {
		this.BasePayment("支付中...", "Payment", d, func);
	};
	this.QueryPayment = function(d, func) {
		if (func)
			func({
				code: true,
				msg: "默认成功",
				data
			});
	};
	var CreateData = function(t, m, d) {
		return {
			code: true,
			http: {
				load: true,
				url: "/PaymentAll/Handle",
				title: t,
			},
			method: "POST",
			data: {
				paytype: "ECoupon_Payment",
				method: m,
				param: {
					appid: getApp().globalData.appid,
					gsid: getApp().globalData.store.GSID,
					source: "Mobile_Pos"
				},
				// sign: rsa.rsaEncrypt(JSON.stringify(d))
				sign: aes.aesEncrypt(JSON.stringify(d))
			}
		}
	}
	var CreateData1 = function(t, d) {
		return {
			code: true,
			http: {
				load: true,
				url: "/Hy/hy",
				title: t,
			},
			method: "POST",
			data: {
				apiname: "TICKETQUERY",
				appid: getApp().globalData.appid,
				paramkey: "acc",
				data: {
					GT_IMPORT: [{
						ZZCP_NUM: d.auth_code,
						ZZCPHX_STORE: d.store_id
					}]
				}
			}
		}
	}
	/**
	 * 包含支付和查询以及撤销的支付体
	 */
	this.PaymentAll = function(body, func) {
		let type = "", //券类型
			yn_zq = "", //是否赠券
			yn_lp = "", //是否礼品券
			yn_jl = "", //是否节令券
			discount = 0; //折扣额
		Req.asyncFuncArr1(CreateData1("查询中...", body), [
			function(res) {
				console.log("券查询结果：", res);
				let data = JSON.parse(res.data);
				type = data.ZZDISCTYPE;
				discount = data.ZZCPXSDISC;
				yn_zq = data.ZZKSZQ;
				yn_lp = data.ZZKSZQ == 'Y' ? 'N' : 'Y';
				yn_jl = data.ZZIFJLQ;
				return CreateData("支付中...", "Payment", body);
			},
			function(res) {
				util.sleep(5000);
				if (func) {
					//组建券类型和折扣额
					res.data.card_coupon_type = type;
					res.data.discount = discount;
					res.data.yn_zq = yn_zq;
					res.data.yn_lp = yn_lp;
					res.data.yn_jl = yn_jl;
					console.log("券支付结果：", res);
					func(res);
				}
				return res;
				//查询调用的是另外一个 api，所以此处得提出来改路径
				// let req = CreateData("查询中...", "QueryPayment", {
				// 	out_trade_no: body.out_trade_no
				// });
				//req.http.url = "/Hy/hy";//重设置url路径
				// return req;
			},
			// function(res) {
			// 	if (res.code && res.data.status == "SUCCESS") {
			// 		if (func)
			// 			func(res);
			// 		return {
			// 			code: false,
			// 			msg: "支付成功了"
			// 		};
			// 	} else { //res.code&&res.data.status=="PAYING"
			// 		util.sleep(5000);
			// 		return CreateData("查询中...", "QueryPayment", {
			// 			out_trade_no: body.out_trade_no
			// 		});
			// 	}
			// },
			// function(res) {
			// 	if (res.code && res.data.status == "SUCCESS") {
			// 		if (func)
			// 			func(res)
			// 		return {
			// 			code: false,
			// 			msg: "支付成功了"
			// 		};
			// 	} else { //res.code&&res.data.status=="PAYING"
			// 		util.sleep(5000);
			// 		return CreateData("查询中...", "QueryPayment", {
			// 			out_trade_no: body.out_trade_no
			// 		});
			// 	}
			// },
			// function(res) {
			// 	if (res.code && res.data.status == "SUCCESS") {
			// 		if (func)
			// 			func(res)
			// 		return {
			// 			code: false,
			// 			msg: "支付成功了"
			// 		};
			// 	} else { //res.code&&res.data.status=="PAYING"
			// 		util.sleep(5000);
			// 		return CreateData("查询中...", "QueryPayment", {
			// 			out_trade_no: body.out_trade_no
			// 		});
			// 	}
			// },
			// function(res) {
			// 	if (res.code && res.data.status == "SUCCESS") {
			// 		if (func)
			// 			func(res)
			// 		return {
			// 			code: false,
			// 			msg: "支付成功了"
			// 		};
			// 	} else { //res.code&&res.data.status=="PAYING"
			// 		util.sleep(5000);
			// 		return CreateData("查询中...", "QueryPayment", {
			// 			out_trade_no: body.out_trade_no
			// 		});
			// 	}
			// },
			// function(res) {
			// 	if (res.code && res.data.status == "SUCCESS") {
			// 		if (func)
			// 			func(res)
			// 		return {
			// 			code: false,
			// 			msg: "支付成功了"
			// 		};
			// 	} else { //res.code&&res.data.status=="PAYING"
			// 		util.sleep(5000);
			// 		return CreateData("查询中...", "QueryPayment", {
			// 			out_trade_no: body.out_trade_no
			// 		});
			// 	}
			// },
			// function(res) {
			// 	if (res.code && res.data.status == "SUCCESS") {
			// 		if (func)
			// 			func(res)
			// 		return {
			// 			code: false,
			// 			msg: "支付成功了"
			// 		};
			// 	} else { //res.code&&res.data.status=="PAYING"
			// 		// return CreateData("撤销中...", "CancelPayment", { //30s超时撤销
			// 		// 	out_trade_no: body.out_trade_no
			// 		// });
			// 	}
			// }
		], function(err) {
			console.log("支付接口返回的错误信息：", err)
			
			util.simpleMsg( res.msg, true);
			//支付或者查询false了 则进行撤销操作
			// return CreateData("撤销中...", "CancelPayment", {
			// 	out_trade_no: body.out_trade_no
			// });
		});
	}

	//查询-退款（券的默认成功，此处是摆设）
	this.RefundAll = function(body, func) {
		Req.asyncFuncArr1(CreateData("查询退款中...", "QueryRefund", body), [
			function(res) {
				util.sleep(5000);
				return CreateData("退款中...", "Refund", body);
			}
		], function(err) {
			console.log("退款接口返回的错误信息：", err)
		});
	}
}
var CouponPayment = function() {
	return new CouonPay();
}
export default {
	CouponPayment
}
