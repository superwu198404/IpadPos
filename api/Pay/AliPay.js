import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

var def_body = {
	"paytype": "",
	"method": "",
	"param": {},
	"data": {}
};

//请求处理入口1
const RequestHandle = (title, body = {
	...def_body
}, ...callbacks) => {
	Req.asyncFunc(...[{
		http: true,
		url: "PaymentAll/Handle",
		title: title,
		method: "POST",
		data: {
			paytype: "AliPay_ScanCode",
			method: body.method,
			param: body.param,
			//sign: rsa.rsaEncrypt(JSON.stringify(body.data))
			sign: aes.aesEncrypt(JSON.stringify(d))
		}
	}, ...callbacks]);
}

const Payment = (title, apiName, type, body = {}, fun1, fun4) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/Payment",
		title: title,
		method: "POST",
		data: {
			apiName: apiName,
			type: type,
			body: body
		}
	}, fun1, null, null, fun4);
}

/**
 * 支付宝支付类
 */
var AliPay = function() {
	this.BasePayment = async function(t, p, d, func) {
		Req.asyncFuncOne({
			http: {
				load: true,
				url: "/PaymentAll/Handle",
				title: t,
			},
			method: "POST",
			data: {
				paytype: "AliPay_ScanCode",
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
			uni.showToast({
				icon: "error",
				title: res.msg
			})
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
	//创建支付接口数据
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
				paytype: "AliPay_ScanCode",
				method: m,
				param: {
					appid: getApp().globalData.appid,
					gsid: getApp().globalData.store.GSID
				},
				// sign: rsa.rsaEncrypt(JSON.stringify(d)),
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
			uni.showToast({
				icon: "error",
				title: err.msg
			})
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
var AliPayment = function() {
	return new AliPay();
}
export default {
	Payment,
	RequestHandle,
	AliPayment
}
