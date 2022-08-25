import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';
import {
	RequestSend
} from '@/api/business/da.js'

/**
 * 创建请求参数
 * @param {支付类型:微信，支付宝...} pt 
 * @param {提示信息:支付中...} t 
 * @param {支付方法:支付，退款...} m 
 * @param {业务参数:1} d 
 */
var CreateData = function(pt, t, m, d) {
	let data;
	// let PayInfo = getApp().globalData.PayInfo;
	let PayInfo = util.getStorage("PayInfo");
	console.log("[CreateData]PayInfo:", PayInfo);
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
			util.simpleMsg("抱歉，请重新扫码", true);
		}
	} else {
		console.log("pt,或者PayInfo为空：", pt + PayInfo);
		util.simpleMsg("抱歉，请重新扫码", true);
	}
	return data;
}

/**
 *基础支付接口 
 * @param {*} pt 支付类型 pay-type
 * @param {*} t 请求加载标题 title
 * @param {*} d 请求数据 data
 * @param {*} func 
 */
const BasePayment = async function(pt, t, m, d, func, catchFunc) {
	let data = CreateData(pt, t, m, d);
	if (data) {
		Req.asyncFuncOne(data, function(res) {
			if (func)
				func(res)
		}, function(res) {
			if (catchFunc) {
				catchFunc(res)
			}
		});
	} else {
		util.simpleMsg("参数异常", true);
	}
};

/**
 *单个支付接口 
 * @param {支付类型} pt 
 * @param {业务参数} d 
 * @param {回调结果函数} func 
 */
const _Payment = function(pt, d, func, catchFunc) {
	BasePayment(pt, "支付中...", "Payment", d, func, catchFunc);
};
const _QueryPayment = function(pt, d, func, catchFunc) {
	BasePayment(pt, "查询中...", "QueryPayment", d, func, catchFunc);
};
const _CancelPayment = function(pt, d, func, catchFunc) {
	BasePayment(pt, "撤销中...", "CancelPayment", d, func, catchFunc);
};
const _Refund = function(pt, d, func, catchFunc) {
	BasePayment(pt, "退款中...", "Refund", d, func, catchFunc);
};
const _QueryRefund = function(pt, d, func, catchFunc) {
	BasePayment(pt, "查询中...", "QueryRefund", d, func, catchFunc)
};



/**
 * 包含支付和查询以及撤销的支付体
 */
const _PaymentAll = function(pt, body, func, catchFunc) {
	let request = CreateData(pt, "支付中...", "Payment", body);
	console.log("获取请求体：", body);
	console.log("获取请求体(whole)：", request);
	Req.asyncFuncArr1(request, [
		function(res) {
			// util.sleep(3000);
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
		console.log("支付接口返回的错误信息：", err);
		if (catchFunc) catchFunc(err);
		util.simpleMsg(res.msg, true);
	});
}

//查询-退款。params:body-请求参数，catchFunc-请求失败回调，finallyFunc-最终回调
const _RefundAll = function(pt, body, catchFunc, finallyFunc, resultsFunc) {
	return Req.asyncFuncChain(CreateData(pt, "查询退款中...", "QueryPayment", body), [
		function(res) {
			return CreateData(pt, "退款中...", "Refund", body);
		}
	], catchFunc, finallyFunc, resultsFunc);
}

//微信支付类
var wxPay = {
	PaymentAll: function(pt, body, func, catchFunc) {
		_PaymentAll(pt, body, func, catchFunc);
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		_RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
	},

	Payment: function(pt, body, func, catchFunc) {
		_Payment(pt, body, func, catchFunc);
	},
	QueryPayment: function(pt, body, func, catchFunc) {
		_QueryPayment(pt, body, func, catchFunc);
	},
	CancelPayment: function(pt, body, func, catchFunc) {
		_CancelPayment(pt, body, func, catchFunc);
	},
	Refund: function(pt, body, func, catchFunc) {
		_Refund(pt, body, func, catchFunc);
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		_QueryRefund(pt, body, func, catchFunc);
	}
}
//支付宝支付类
var zfbPay = {
	PaymentAll: function(pt, body, func, catchFunc) {
		_PaymentAll(pt, body, func, catchFunc);
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		_RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
	},

	Payment: function(pt, body, func, catchFunc) {
		_Payment(pt, body, func, catchFunc);
	},
	QueryPayment: function(pt, body, func, catchFunc) {
		_QueryPayment(pt, body, func, catchFunc);
	},
	CancelPayment: function(pt, body, func, catchFunc) {
		_CancelPayment(pt, body, func, catchFunc);
	},
	Refund: function(pt, body, func, catchFunc) {
		_Refund(pt, body, func, catchFunc);
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		_QueryRefund(pt, body, func, catchFunc);
	}
}
//仟吉电子卡支付类
var hykPay = {
	GetConfig: async function() { //获取 mis 支付参数，款台号
		if (!util.getStorage('ecard-config')) {
			let result = await RequestSend(`select * from payconfig where paytype='TLCARD' and KHID='${getApp().globalData.store.KHID}'`);
			if (result.code && result.result.code) {
				let config_arr = JSON.parse(result.result.data);
				if (config_arr && config_arr.length && config_arr.length > 0)
					util.setStorage('ecard-config', config_arr[0]);
				else
					util.simpleMsg("[ECARD-CONFIG]支付参数数据库未查询到!", true)
			} else
				util.simpleMsg("[ECARD-CONFIG]支付参数获取失败!", true)
		} else
			console.log("[ECARD-CONFIG][catch]Config:", util.getStorage('ecard-config'));
		return util.getStorage('ecard-config');
	},
	PaymentAll: function(pt, body, func, catchFunc) {
		this.GetConfig().then((config) => {
			body.merchant_no = config.SHID;//从数据库获取配置
			_PaymentAll(pt, body, func, catchFunc);
		})
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		_RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
	},
	Payment: function(pt, body, func, catchFunc) {
		_Payment(pt, body, func, catchFunc);
	},
	QueryPayment: function(pt, body, func, catchFunc) {
		_QueryPayment(pt, body, func, catchFunc);
	},
	CancelPayment: function(pt, body, func, catchFunc) {
		_CancelPayment(pt, body, func, catchFunc);
	},
	Refund: function(pt, body, func, catchFunc) {
		_Refund(pt, body, func, catchFunc);
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		_QueryRefund(pt, body, func, catchFunc);
	}
}
//仟吉实体卡
var kengeePay = {
	GetConfig: async function() { //获取 mis 支付参数，款台号
		if (!util.getStorage('mis-config')) {
			let result = await RequestSend(
				`select * from payconfig where paytype='TL' and khid='${getApp().globalData.store.KHID}'`);
			if (result.code && result.result.code) {
				let config_arr = JSON.parse(result.result.data);
				if (config_arr && config_arr.length && config_arr.length > 0)
					util.setStorage('mis-config', config_arr[0]);
				else
					util.simpleMsg("[REAL-CONFIG]支付参数数据库未查询到!", true)
			} else
				util.simpleMsg("[REAL-CONFIG]支付参数获取失败!", true)
		} else
			console.log("[REAL-CONFIG][catch]Config:", util.getStorage('mis-config'));
		return util.getStorage('mis-config');
	},
	PaymentAll: function(pt, body, func, catchFunc) {
		this.GetConfig().then((config) => {
			Req.asyncFuncOne(CreateData("MIS", "查询中...", "ReadCard", {
				store_id:config.SHID,
				terminalCode:config.NOTE
			}),(res) => {
				console.log("[ReadCard]读取卡信息:",res);
				let card_info = res.data;
				body.card_no = card_info.card_no;
				body.auth_code = card_info.track_info;
				body.merchant_no = 'TL22061561470300';
				body.storeName = getApp().globalData.store.NAME;
				console.log("[ReadCard]组装支付参数:",body);
				_PaymentAll(pt, body, func, catchFunc);
			},(err) => {
				console.log("[ReadCard]读卡异常!",err);
			});
		})
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		_RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
	},
	Payment: function(pt, body, func, catchFunc) {
		_Payment(pt, body, func, catchFunc);
	},
	QueryPayment: function(pt, body, func, catchFunc) {
		_QueryPayment(pt, body, func, catchFunc);
	},
	Refund: function(pt, body, func, catchFunc) {
		_Refund(pt, body, func, catchFunc);
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		_QueryRefund(pt, body, func, catchFunc);
	}
}
//mis银联支付
var misPay = {
	GetConfig: async function() { //获取 mis 支付参数，款台号
		if (!util.getStorage('mis-config')) {
			let result = await RequestSend(
				`select * from payconfig where paytype='TL' and khid='${getApp().globalData.store.KHID}'`);
			if (result.code && result.result.code) {
				let config_arr = JSON.parse(result.result.data);
				if (config_arr && config_arr.length && config_arr.length > 0)
					util.setStorage('mis-config', config_arr[0]);
				else
					util.simpleMsg("[MIS-CONFIG]支付参数数据库未查询到!", true)
			} else
				util.simpleMsg("[MIS-CONFIG]支付参数获取失败!", true)
		} else
			console.log("[MIS-CONFIG][catch]Config:", util.getStorage('mis-config'));
		return util.getStorage('mis-config');
	},
	PaymentAll: function(pt, body, func, catchFunc) {
		this.GetConfig().then((config) => {
			//参数从后端 PayConfig 表中获取 Key 是机器号，Note是门店id
			body.merchant_no = null;//使用全局配置（后端）
			body.terminalCode = config.NOTE;
			body.store_id = config.SHID;
			_PaymentAll(pt, body, func, catchFunc);
		})
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		this.GetConfig().then((config) => {
			body.terminalCode = config.NOTE;
			body.store_id = config.SHID;
			_RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
		})
	},
	Payment: function(pt, body, func, catchFunc) {
		_Payment(pt, body, func, catchFunc);
	},
	QueryPayment: function(pt, body, func, catchFunc) {
		_QueryPayment(pt, body, func, catchFunc);
	},
	CancelPayment: function(pt, body, func, catchFunc) {
		_CancelPayment(pt, body, func, catchFunc);
	},
	Refund: function(pt, body, func, catchFunc) {
		_Refund(pt, body, func, catchFunc);
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		_QueryRefund(pt, body, func, catchFunc);
	}
}
//仟吉电子券
var szqPay = {
	PaymentAll: function(pt, body, func, catchFunc) {
		_PaymentAll(pt, body, func, catchFunc);
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		// _RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
		//退款自处理
		if (finallyFunc)
			finallyFunc({
				code: true,
				msg: "自处理成功",
				body
			});
	},

	Payment: function(pt, body, func, catchFunc) {
		_Payment(pt, body, func, catchFunc);
	},
	QueryPayment: function(pt, body, func, catchFunc) {
		_QueryPayment(pt, body, func, catchFunc);
	},
	CancelPayment: function(pt, body, func, catchFunc) {
		//注意券后端无该接口
		_CancelPayment(pt, body, func, catchFunc);
	},
	Refund: function(pt, body, func, catchFunc) {
		//_Refund(pt, body, func, catchFunc);
		//自处理
		if (func)
			func({
				code: true,
				msg: "自处理成功",
				body
			});
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		_QueryRefund(pt, body, func, catchFunc);
	}
}
//无后端接口的处理方式
var noPay = {
	PaymentAll: function(pt, body, func, catchFunc) {
		//_PaymentAll(pt, body, func, catchFunc);
		//自处理
		if (func)
			func({
				code: true,
				msg: "自处理成功",
				body
			});
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		// _RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
		//退款自处理
		if (finallyFunc)
			finallyFunc({
				code: true,
				msg: "自处理成功",
				body
			});
	},

	Payment: function(pt, body, func, catchFunc) {
		// _Payment(pt, body, func, catchFunc);
		//自处理
		if (func)
			func({
				code: true,
				msg: "自处理成功",
				body
			});
	},
	QueryPayment: function(pt, body, func, catchFunc) {
		//_QueryPayment(pt, body, func, catchFunc);
		//自处理
		if (func)
			func({
				code: true,
				msg: "自处理成功",
				body
			});
	},
	CancelPayment: function(pt, body, func, catchFunc) {
		//_CancelPayment(pt, body, func, catchFunc);
		//自处理
		if (func)
			func({
				code: true,
				msg: "自处理成功",
				body
			});
	},
	Refund: function(pt, body, func, catchFunc) {
		//_Refund(pt, body, func, catchFunc);
		//自处理
		if (func)
			func({
				code: true,
				msg: "自处理成功",
				body
			});
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		//_QueryRefund(pt, body, func, catchFunc);
		//自处理
		if (func)
			func({
				code: true,
				msg: "自处理成功",
				body
			});
	}
}

//根据支付类型反射支付方式
var payType = {
	// 108使用
	WX_CLZF: wxPay,
	ZFB_CLZF: zfbPay,
	HYK: hykPay,
	SZQ: szqPay,
	MIS: misPay,
	NOPAY: noPay,
	REALCARD: kengeePay,
	
	//仟吉使用
	WXZF: wxPay,
	ZFB20: zfbPay,
	PAYCARD: hykPay,
	PAYBRUSHCARD: kengeePay,
	SZQ: szqPay,
	TL: misPay,
}

//聚合支付主入口
var PaymentAll = function(pt, body, func, catchFunc) {
	payType[pt].PaymentAll(pt, body, func, catchFunc)
}
//聚合退款主入口
var RefundAll = function(pt, body, catchFunc, finallyFunc, resultsFunc) {
	payType[pt].RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc)
}

//单个支付入口
var Payment = function(pt, body, func, catchFunc) {
	payType[pt].Payment(pt, body, func, catchFunc)
}
//查询支付结果入口
var QueryPayment = function(pt, body, func, catchFunc) {
	payType[pt].QueryPayment(pt, body, func, catchFunc)
}
//撤销支付入口
var CancelPayment = function(pt, body, func, catchFunc) {
	payType[pt].CancelPayment(pt, body, func, catchFunc)
}
//单个退款入口
var Refund = function(pt, body, func, catchFunc) {
	payType[pt].Refund(pt, body, func, catchFunc)
}
//查询退款结果入口
var QueryRefund = function(pt, body, func, catchFunc) {
	payType[pt].QueryRefund(pt, body, func, catchFunc)
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
