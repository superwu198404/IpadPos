import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

///微信付款码支付
const CodePayment = (title, auth_code, body, total_fee) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/CodePayment",
		title: title,
		method: "POST",
		data: {
			auth_code: auth_code,
			body: body,
			total_fee: total_fee
		}
	}, function(res) {
		return res;
	});
}
///微信扫码支付
const CodeScanPay = (title, out_trade_no, subject, auth_code, total_amount, func, func2) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/Payment",
		title: title,
		method: "POST",
		data: {
			apiName: 'CodePayment',
			type: 'WxPayService',
			body: {
				out_trade_no: out_trade_no,
				body: subject,
				auth_code: auth_code,
				total_fee: total_amount
			}
		}
	}, function(res) {
		// console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	}, null, null, func2);
}
///查询微信扫码支付的结果
const QueryCodeScanPay = (title, out_trade_no, func, func2) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/Payment",
		title: title,
		load: false,
		method: "POST",
		data: {
			apiName: 'V2TradeQuery',
			type: 'WxPayService',
			body: {
				out_trade_no: out_trade_no
			}
		}
	}, function(res) {
		// console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	}, null, null, func2);
}
///撤销支付订单
const CancelCodeScanPay = (title, out_trade_no, func, func2) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/Payment",
		title: title,
		method: "POST",
		data: {
			apiName: 'V2TradeCancel',
			type: 'WxPayService',
			body: {
				out_trade_no: out_trade_no
			}
		}
	}, function(res) {
		// console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	}, null, null, func2);
}
///查询订单是否退款
const QueryRefund = (title, out_trade_no, func, func2) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/Payment",
		title: title,
		method: "POST",
		data: {
			apiName: 'V2RefundQuery',
			type: 'WxPayService',
			body: {
				out_trade_no: out_trade_no
			}
		}
	}, function(res) {
		// console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	}, null, null, func2);
}

///订单退款
const Refund = (title, out_trade_no, out_refund_no, total_fee, func, func2) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/Payment",
		title: title,
		method: "POST",
		data: {
			apiName: 'V2TradeRefund',
			type: 'WxPayService',
			body: {
				out_trade_no: out_trade_no,
				out_refund_no: out_refund_no,
				total_fee: total_fee,
				refund_fee: total_fee
			}
		}
	}, function(res) {
		// console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	}, null, null, func2);
}
//////以上接口为旧版本接口 弃用 采用下列新版本接口

/**
 * 微信支付类
 */
var WxPay = function() {
	this.BasePayment = async function(t, p, d, func) {
		Req.asyncFuncOne({
			http: {
				load: true,
				url: "/PaymentAll/Handle",
				title: t,
			},
			method: "POST",
			data: {
				paytype: "WxPay_ScanCode",
				method: p,
				param: {
					appid: getApp().globalData.appid,
					gsid: getApp().globalData.store.GSID
				},
				// sign: rsa.rsaEncrypt(JSON.stringify(d))
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
		this.BasePayment("QueryPayment", d, func);
	};
	this.CancelPayment = function(d, func) {
		this.BasePayment("CancelPayment", d, func);
	};
	this.Refund = function(d, func) {
		this.BasePayment("Refund", d, func);
	};
	this.QueryRefund = function(d, func) {
		this.BasePayment("QueryRefund", d, func)
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
				paytype: "WxPay_ScanCode",
				method: m,
				param: {
					appid: getApp().globalData.appid,
					gsid: getApp().globalData.store.GSID
				},
				// sign: rsa.rsaEncrypt(JSON.stringify(d))
				sign: aes.aesEncrypt(JSON.stringify(d))
			}
		}
	}

	/**
	 * 包含支付和查询以及撤销的支付体
	 */
	this.PaymentAll = function(body, func) {
		Req.asyncFuncArr1(CreateData("支付中...", "Payment", body), [
			function(res) {
				util.sleep(5000);
				return CreateData("查询中...", "QueryPayment", {
					out_trade_no: body.out_trade_no
				});
			},
			function(res) {
				if (res.code && res.data.status == "SUCCESS") {
					if (func)
						func(res);
					return {
						code: false,
						msg: "支付成功了"
					};
				} else { //res.code&&res.data.status=="PAYING"
					util.sleep(5000);
					return CreateData("查询中...", "QueryPayment", {
						out_trade_no: body.out_trade_no
					});
				}
			},
			function(res) {
				if (res.code && res.data.status == "SUCCESS") {
					if (func)
						func(res)
					return {
						code: false,
						msg: "支付成功了"
					};
				} else { //res.code&&res.data.status=="PAYING"
					util.sleep(5000);
					return CreateData("查询中...", "QueryPayment", {
						out_trade_no: body.out_trade_no
					});
				}
			},
			function(res) {
				if (res.code && res.data.status == "SUCCESS") {
					if (func)
						func(res)
					return {
						code: false,
						msg: "支付成功了"
					};
				} else { //res.code&&res.data.status=="PAYING"
					util.sleep(5000);
					return CreateData("查询中...", "QueryPayment", {
						out_trade_no: body.out_trade_no
					});
				}
			},
			function(res) {
				if (res.code && res.data.status == "SUCCESS") {
					if (func)
						func(res)
					return {
						code: false,
						msg: "支付成功了"
					};
				} else { //res.code&&res.data.status=="PAYING"
					util.sleep(5000);
					return CreateData("查询中...", "QueryPayment", {
						out_trade_no: body.out_trade_no
					});
				}
			},
			function(res) {
				if (res.code && res.data.status == "SUCCESS") {
					if (func)
						func(res)
					return {
						code: false,
						msg: "支付成功了"
					};
				} else { //res.code&&res.data.status=="PAYING"
					util.sleep(5000);
					return CreateData("查询中...", "QueryPayment", {
						out_trade_no: body.out_trade_no
					});
				}
			},
			function(res) {
				if (res.code && res.data.status == "SUCCESS") {
					if (func)
						func(res)
					return {
						code: false,
						msg: "支付成功了"
					};
				} else { //res.code&&res.data.status=="PAYING"
					return CreateData("撤销中...", "CancelPayment", { //30s超时撤销
						out_trade_no: body.out_trade_no
					});
				}
			}
		], function(err) {
			console.log("支付接口返回的错误信息：", err)
			util.simpleMsg( res.msg, true);
			//支付或者查询false了 则进行撤销操作
			// return CreateData("撤销中...", "CancelPayment", {
			// 	out_trade_no: body.out_trade_no
			// });
		});
	}

	//查询-退款。params:body-请求参数，catchFunc-请求失败回调，finallyFunc-最终回调
	this.RefundAll = function(body, catchFunc, finallyFunc, resultsFunc) {
		Req.asyncFuncChain(CreateData("查询退款中...", "QueryPayment", body), [
			function(res) {
				return CreateData("退款中...", "Refund", body);
			}
		], catchFunc, finallyFunc, resultsFunc);
	}
}
var WxPayment = function() {
	return new WxPay();
}
export default {
	CodePayment,
	CodeScanPay,
	CancelCodeScanPay,
	QueryCodeScanPay,
	QueryRefund,
	Refund,
	WxPayment
}
