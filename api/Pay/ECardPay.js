import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

/**
 * 电子会员卡支付类
 */
var CardPay = function() {
	this.BasePayment = async function(t, p, d, func) {
		Req.asyncFuncOne({
			http: {
				load: true,
				url: "/PaymentAll/Handle",
				title: t,
			},
			method: "POST",
			data: {
				paytype: "ECard_Payment",
				method: p,
				param: {
					appid: getApp().globalData.appid,
					gsid: getApp().globalData.store.GSID,
					source: "Mobile_Pos"
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
	this.Refund = function(d, func) {
		this.BasePayment("Refund", d, func);
	};
	//共用一个查询
	this.QueryRefund = function(d, func) {
		this.BasePayment("QueryPayment", d, func)
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
				paytype: "ECard_Payment",
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
var CardPayment = function() {
	return new CardPay();
}
export default {
	CardPayment
}
