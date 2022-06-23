import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';


/**
 * 创建请求参数
 * @param {支付类型:微信，支付宝...} pt 
 * @param {提示信息:支付中...} t 
 * @param {支付方法:支付，退款...} m 
 * @param {业务参数:1} d 
 */
var CreateData = function(pt, t, m, d) {
	let data;
	let PayInfo = getApp().globalData.PayInfo;
	if (pt && PayInfo && PayInfo.length > 0) {
		let PayObj = PayInfo.find(function(item, index, arr) {
			return item.TYPE == pt;
		})
		if (PayObj) { //查询到支付信息
			data = {
				code: true,
				http: {
					load: true,
					url: PayObj.URL, //"/PaymentAll/Handle", //默认值
					title: t,
					brand: PayObj.BRAND
				},
				method: "POST",
				data: {
					paytype: PayObj.PAYTYPE, //"WxPay_ScanCode",
					method: m, //Payment
					param: {
						appid: PayObj.APPID, //getApp().globalData.appid,
						gsid: PayObj.GSID, //getApp().globalData.store.GSID
						source: PayObj.SOURCE
					},
					sign: aes.aesEncrypt(JSON.stringify(d))
				}
			}
		} else {
			console.log("PayObj为空 pt：", pt + PayInfo);
			uni.showToast({
				title: "参数错误",
				icon: "error"
			})
		}
	} else {
		console.log("pt,或者PayInfo为空：", pt + PayInfo);
		uni.showToast({
			title: "参数错误",
			icon: "error"
		})
	}
	return data;
}

/**
 *基础支付接口 
 * @param {*} pt 
 * @param {*} t 
 * @param {*} d 
 * @param {*} func 
 */
const BasePayment = async function(pt, t, m, d, func, catchFunc) {
	let data = CreateData(pt, t, d);
	if (data) {
		Req.asyncFuncOne(data, function(res) {
			if (func)
				func(res)
		}, function(res) {
			if (catchFunc)
				catchFunc(res)
		});
	} else {
		uni.showToast({
			title: "参数错误",
			icon: "error"
		})
	}
};

/**
 *单个支付接口 
 * @param {支付类型} pt 
 * @param {业务参数} d 
 * @param {回调结果函数} func 
 */
const Payment = function(pt, d, func) {
	this.BasePayment(pt, "支付中...", "Payment", d, func);
};
const QueryPayment = function(pt, d, func, catchFunc) {
	BasePayment(pt, "查询中...", "QueryPayment", d, func, catchFunc);
};
const CancelPayment = function(pt, d, func) {
	this.BasePayment(pt, "撤销中...", "CancelPayment", d, func);
};
const Refund = function(pt, d, func) {
	this.BasePayment(pt, "退款中...", "Refund", d, func);
};
const QueryRefund = function(pt, d, func) {
	this.BasePayment(pt, "查询中...", "QueryRefund", d, func)
};

/**
 * 包含支付和查询以及撤销的支付体
 */
const PaymentAll = function(pt, body, func, catchFunc) {
	let request = CreateData(pt, "支付中...", "Payment", body);
	console.log("获取请求体：",body);
	console.log("获取请求体(whole)：",request);
	Req.asyncFuncArr1(request, [
		function(res) {
			util.sleep(5000);
			return CreateData(pt, "查询中...", "QueryPayment", body);
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
				return CreateData(pt, "查询中...", "QueryPayment", body);
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
				return CreateData(pt, "查询中...", "QueryPayment", body);
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
				return CreateData(pt, "查询中...", "QueryPayment", body);
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
				return CreateData(pt, "查询中...", "QueryPayment", body);
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
				return CreateData(pt, "查询中...", "QueryPayment", body);
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
				//30s超时撤销
				return CreateData(pt, "撤销中...", "CancelPayment", body);
			}
		}
	], function(err) {
		console.log("支付接口返回的错误信息：", err)
		if(catchFunc) catchFunc(err);
		uni.showToast({
			icon: "error",
			title: err.msg
		})
	});
}

//查询-退款。params:body-请求参数，catchFunc-请求失败回调，finallyFunc-最终回调
const RefundAll = function(pt, body, catchFunc, finallyFunc) {
	return Req.asyncFuncChain(CreateData(pt, "查询退款中...", "QueryPayment", body), [
		function(res) {
			return CreateData(pt, "退款中...", "Refund", body);
		}
	], catchFunc, finallyFunc, resultsFunc);
}
export default {
	Payment,
	QueryPayment,
	CancelPayment,
	Refund,
	QueryRefund,
	PaymentAll,
	RefundAll
}
