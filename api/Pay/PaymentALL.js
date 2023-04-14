import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';
import member from '@/api/hy/MemberInterfaces.js'; //会员积分抵现自实现的支付和退款（由于不是常规支付，所以常规的支付流程不适用）
import checker from '@/utils/graceChecker.js';
import common from '@/api/common.js';
import {
	RequestSend
} from '@/api/business/da.js'
import tiktok from '../business/tiktok';

/**
 * 创建请求参数
 * @param {支付类型:微信，支付宝...} pt 
 * @param {提示信息:支付中...} t 
 * @param {支付方法:支付，退款...} m 
 * @param {业务参数:1} d 
 */
var CreateData = function(pt, t, m, d, load = false) {
	let data;
	// let PayInfo = getApp().globalData.PayInfo;
	let store = util.getStorage("store");
	let PayInfo = util.getStorage("PayInfo");
	console.log("[CreateData]PayInfo:", PayInfo);
	if (pt && PayInfo && PayInfo.length > 0) {
		let PayObj = PayInfo.find(function(item, index, arr) {
			return item.TYPE == pt;
		})
		if (PayObj) { //查询到支付信息
			console.warn("[CreateData]门店参数信息:",d);
			console.warn("[CreateData]目标配置信息:",d.original_company_id);
			data = {
				code: true,
				http: {
					load,
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
						gsid: d.original_company_id || store.GSID,
						// gsid: store.GSID,
						source: PayObj.SOURCE
					},
					sign: aes.aesEncrypt(JSON.stringify(d))
				}
			}
		} else {
			console.log("[CreateData]PayObj为空 pt：", pt);
			console.log("[CreateData]PayObj为空 PayInfo：", PayInfo);
			util.simpleMsg("抱歉，请重新扫码", true);
		}
	} else {
		console.log("[CreateData]PayObj为空 pt：", pt);
		console.log("[CreateData]PayObj为空 PayInfo：", PayInfo);
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

//获取支付配置参数
const _GetConfig = async function(type, khid) { //获取 mis 支付参数，款台号
	let config;
	let result = await RequestSend(
		// `select * from payconfig where paytype='TLCARD' and KHID='${getApp().globalData.store.KHID}'`
		`select * from payconfig where paytype='${type}' and KHID='${khid}'`
	);
	if (result.code && result.result.code) {
		let config_arr = JSON.parse(result.result.data);
		if (config_arr && config_arr.length && config_arr.length > 0) {
			config = config_arr[0];
		}
	}
	return config;
}

//获取支付配置参数
const _GetClientInfos = async function(khid) { //获取 mis 支付参数，款台号
	let config;
	let result = await RequestSend(
		`select * from khda where KHID='${khid}'`
	);
	if (result.code && result.result.code) {
		let config_arr = JSON.parse(result.result.data);
		if (config_arr && config_arr.length && config_arr.length > 0) {
			config = config_arr[0];
		}
	}
	return config;
}

//包含支付和查询以及撤销的支付体
const _PaymentAll = function(pt, body, func, catchFunc) {
	let request = CreateData(pt, "支付中...", "Payment", body);
	let show_log = true;
	console.log("[PaymentAll]获取请求体：", body);
	console.log("[PaymentAll]获取请求体(whole)：", request);
	Req.asyncFuncArr1(request, [
		function(res) {
			// util.sleep(3000);
			if (show_log) console.log("[PaymentAll]发起支付结果（Payment）:", res);
			return CreateData(pt, "查询中...", "QueryPayment", body);
		},
		function(res) {
			if (show_log) console.log("[PaymentAll]第一次查询结果（QueryPayment）:", res);
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
			if (show_log) console.log("[PaymentAll]第二次查询结果（QueryPayment）:", res);
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
			if (show_log) console.log("[PaymentAll]第三次查询结果（QueryPayment）:", res);
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
			if (show_log) console.log("[PaymentAll]第四次查询结果（QueryPayment）:", res);
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
			if (show_log) console.log("[PaymentAll]第五次查询结果（QueryPayment）:", res);
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
			if (show_log) console.log("[PaymentAll]第六次查询结果（QueryPayment）:", res);
			if (res.code && res.data.status == "SUCCESS") {
				if (func)
					func(res)
				return {
					code: false,
					msg: "支付成功了"
				};
			} else { //res.code&&res.data.status=="PAYING"
				if (show_log) console.log("[PaymentAll]超时发起撤销");
				//30s超时撤销
				return CreateData(pt, "撤销中...", "CancelPayment", body);
			}
		}
	], function(err) {
		console.log("[PaymentAll]支付接口返回的错误信息：", err);
		if (catchFunc) catchFunc(err);
		util.simpleMsg(res.msg, true);
	});
}

//查询-退款。params:body-请求参数，catchFunc-请求失败回调，finallyFunc-最终回调
const _RefundAll = function(pt, body, catchFunc, finallyFunc, resultsFunc) {
	console.log("[RefundAll]退款数据:", body);
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
	PaymentAll: function(pt, body, func, catchFunc) {
		_GetConfig("TLCARD", getApp().globalData.store.KHID).then((config) => {
			if (!config) {
				if (catchFunc) catchFunc(util.createdResult(false,"未配置通联商户号!", null));
				return;
			}
			body.merchant_no = config.SHID; //从数据库获取配置 因为和POS共用，SHID是POS的商户号，这个LONGKEY是IPAD的商户号
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
	PaymentAll: function(pt, body, func, catchFunc) {
		_GetConfig("TLCARD", getApp().globalData.store.KHID).then((config) => {
			if (!config || !config.LONGKEY) {
				if (catchFunc) catchFunc(util.createdResult(false,"未配置通联商户号!", null));
				return;
			}
			Req.asyncFuncOne(CreateData("TL", "查询中...",
				"ReadCard", { //这里固定写成通联的原因是因为，刷卡接口写在MIS的Payment里在，且因为使用刷卡机要包装一系列参数，而MIS内有方法处理，其他类里没有
					store_id: config.KEY,
					terminalCode: config.NOTE,
					merchant_no: config.LONGKEY
				}), (res) => { //返回卡号和磁道信息
				console.log("[ReadCard]读取卡信息:", res);
				let card_info = res.data;
				body.card_no = card_info.card_no.substring(3); //去掉实体卡前缀三位
				body.auth_code = card_info.track_info;
				body.merchant_no = config.SHID;
				body.storeName = getApp().globalData.store.NAME;
				console.log("[ReadCard]组装支付参数:", body);
				_PaymentAll(pt, body, func, catchFunc);
			}, (err) => {
				util.simpleMsg("读卡异常!" + err.msg, true)
				console.log("[ReadCard]读卡异常!", err);
				if (catchFunc) catchFunc(err);
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
	PaymentAll: function(pt, body, func, catchFunc) {
		_GetConfig("TL", getApp().globalData.store.KHID).then((config) => {
			if (!config || !config.NOTE) {
				if (catchFunc) catchFunc(util.createdResult(false,"未配置通联商户号!", null));
				return;
			}
			//参数从后端 PayConfig 表中获取 Key 是 门店id/门店号，Note是 机器号/终端号/款台号
			body.merchant_no = config.SHID; //使用全局配置（后端）
			body.terminalCode = config.NOTE;
			body.store_id = config.KEY;
			_PaymentAll(pt, body, func, catchFunc);
		})
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		_GetConfig("TL", body.original_store_id || getApp().globalData.store.KHID).then((config) => {
			if (!config || !config.NOTE) {
				if (catchFunc) catchFunc(util.createdResult(false,"未配置通联商户号!", null));
				return;
			}
			body.merchant_no = config.SHID; //使用全局配置（后端
			body.terminalCode = config.NOTE;
			body.store_id = config.KEY;
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

//mis银联二维码支付
var misScanCodePay = {
	PaymentAll: function(pt, body, func, catchFunc) {
		_GetConfig("UPAY", getApp().globalData.store.KHID).then((config) => {
			if (!config || !config.LONGKEY) {
				if (catchFunc) catchFunc(util.createdResult(false,"未配置通联商户号!", null));
				return;
			}
			//参数从后端 PayConfig 表中获取 RYID 是 门店id/门店号，Note是 机器号/终端号/款台号，LONGKEY是商户号
			body.merchant_no = config.LONGKEY; //使用全局配置（后端）
			body.terminalCode = config.NOTE;
			body.store_id = config.RYID;
			_PaymentAll(pt, body, func, catchFunc);
		})
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		console.log("[RefundAll]UPAY中的Body参数为:",body);
		_GetConfig("UPAY", body.original_store_id || getApp().globalData.store.KHID).then((config) => {
			if (!config || !config.LONGKEY) {
				if (catchFunc) catchFunc(util.createdResult(false,"未配置通联商户号!", null));
				return;
			}
			body.merchant_no = config.LONGKEY; //使用全局配置（后端
			body.terminalCode = config.NOTE;
			body.store_id = config.RYID;
			console.log("[RefundAll]银联二维码退款参数:", {
				config,
				body
			});
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
		// _PaymentAll(pt, body, func, catchFunc);
		let request = CreateData(pt, "支付中...", "Payment", body);
		let show_log = true;
		console.log("[PaymentAll]获取请求体：", body);
		console.log("[PaymentAll]获取请求体(whole)：", request);
		Req.asyncFuncArr1(request, [
			function(res) {
				// util.sleep(3000);
				if (show_log) console.log("[PaymentAll]第一次结果（QueryPayment）:", res);
				if (res.data.discount) { //将券核销返回的抵扣金额传入到查询接口中做比对
					body.discount = res.data.discount;
				}
				return CreateData(pt, "查询中...", "QueryPayment", body);
			},
			function(res) {
				if (show_log) console.log("[PaymentAll]第二次结果（QueryPayment）:", res);
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
				if (show_log) console.log("[PaymentAll]第三次结果（QueryPayment）:", res);
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
				if (show_log) console.log("[PaymentAll]第四次结果（QueryPayment）:", res);
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
				if (show_log) console.log("[PaymentAll]第五次结果（QueryPayment）:", res);
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
				if (show_log) console.log("[PaymentAll]第六次结果（QueryPayment）:", res);
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
				if (show_log) console.log("[PaymentAll]第七次结果（CancelPayment）:", res);
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
			console.log("[PaymentAll]支付接口返回的错误信息：", err);
			if (catchFunc) catchFunc(err);
			util.simpleMsg(res.msg, true);
		});
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		// _RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);

		//调用下 券退回 接口 但是不能影响主线业务
		try {
			//销售退货或预定取消才可进行券退回
			console.log("券返回时的业务类型：", body.ywtype);
			if (body.ywtype && (body.ywtype == 'Z151' || body.ywtype == 'Z171')) {
				_Refund(pt, body, res => {
					console.log("券返回结果：", res);
				}, err => {
					console.log("券返回失败：", err);
				});
			}
		} catch (e) {
			//TODO handle the exception
			console.log("券返回异常：", e.message);
		}
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

//可伴电子券
var kbPay = {
	PaymentAll: function(pt, body, func, catchFunc) {
		_PaymentAll(pt, body, func, catchFunc);
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		body.store_id = body.original_store_id;
		_RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc);
	},
	QueryCouponDetails: async function(card_number){
		let details_result = null;
		await Req.AsyncRequesrChain(CreateData('COUPON', "查询中...", "QueryInfo", {
				auth_code: card_number,
				product_info: []
			}, true), [
			function(res) { //先判断订单查询，当前订单是否没支付过，如果没支付过，再进行卡信息查询，获取余额信息
				console.log("[QueryInfo]第一次结果（QueryInfo）:", res);
				details_result = res;
				return res;
			}
		], function(err) {
			details_result = err;
		}, function(active_err) {
			console.log("主动抛出异常:", active_err);
			details_result = active_err;
		});
		return details_result;
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
		_Refund(pt, body, func, catchFunc);
	},
	QueryRefund: function(pt, body, func, catchFunc) {
		_QueryRefund(pt, body, func, catchFunc);
	}
}

//仟吉积分抵现
var pointPay = {
	PaymentAll: function(pt, body, func, catchFunc) {
		if (!body.member_id) {
			util.simpleMsg("请先登录会员...", true);
			return;
		}
		let flag = checker.checkMobile(body.member_id)
		member.QueryHyInfo("查询中...", {
			brand: getApp().globalData?.brand,
			kquser: getApp().globalData?.kquser,
			data: {
				code: body.member_id,
				type: flag ? 'Mobile' : 'ACCOUNT'
			}
		}, function(res) {
			console.log("[PaymentAll]积分抵现部分会员信息查询结果...", res);
			let member_info = JSON.parse(res.data);
			let score = member_info.JFBalance
			if (score > body.point) { //如果账户积分支持抵现
				member.PointsDeduction("积分抵现中...", {
					brand: getApp().globalData?.brand,
					data: {
						hyid: body.member_id,
						// hyid: "1000311647",
						amount: body.point,
						trade_no: body.out_trade_no,
						money: body.point_money * 100
					}
				}, func, func);
			} else {
				console.log("[PaymentAll]积分不足，无法抵现...", member_info);
			}
		}, function(err) {
			util.simpleMsg("会员积分查询失败，请重试...", 'none');
		})
	},
	RefundAll: function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		member.PointsReturn("积分返还中...", {
			brand: getApp().globalData?.brand,
			data: {
				amount: body.point,
				trade_no: body.out_trade_no,
				refund_no: body.out_refund_no,
				money: body.refund_money
			}
		}, (res) => { //成功回调
			finallyFunc(res);
			resultsFunc([, {
				code: true
			}]); //手动控制结果成功（因为积分回退没有所谓的查询，也就不存在两个返回结果：查询结果 and 退款结果）
		}, catchFunc);
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
				data: body,
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
				data: body,
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
				data: body,
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
				data: body,
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
				data: body,
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
				data: body,
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
				data: body,
				body
			});
	}
}

//品诺支付
var pinoPay = {
	/* 品诺支付流程（支付）：
	 * 先查订单，平台不存在时，再调用核销。
	 * 补充：由于核销不会提示余额不足，所以要自行调用卡信息查询接口确认。
	 */
	PaymentAll: async function(pt, body, func, catchFunc, finallyFunc) {
		var config_result = await _GetConfig("PINNUOPAY", getApp().globalData.store.DQID).then((config) => {
			var result = {
				code: false,
				msg: null,
				data: null
			}
			console.log("[PaymentAll]品诺支付参数获取:", config)
			if (!config) {
				result.code = false;
				result.msg = "支付参数未配置!";
			} else {
				result.code = true;
				result.msg = "参数获取成功!";
				result.data = config;
			}
			return result;
		})
		if (!config_result.code) {
			catchFunc(config_result);
		} else {
			var config = config_result.data;
			var base_require_request_params = () => ({
				transaction_id: config.KEY, //渠道私钥 cGpIBoaTnJBljg4l1OIW
				trade_no: config.LONGKEY, //密码aes加密用的密钥 !@#$_^piNUC0906!
				deviceno: config.SHID, //门店标识id 45952392
				store_id: config.APPID //门店id 1421
			});
			if (!body.auth_code) {
				catchFunc({
					msg: "未传入卡号!"
				});
				return;
			}
			var is_pe_code = body.auth_code.substr(0, 2) == "PE"; //判断是否是 PE 码（PE、PN）
			var card_no = body.auth_code.substr(2, 11);
			var password = body.auth_code.substr(13) || 0;
			console.log("[PaymentAll]品诺支付:", {
				card_no,
				password
			});
			Req.AsyncRequesrChain(CreateData(pt, "查询中...", "QueryPayment", Object.assign(
				base_require_request_params(), {
					out_refund_no: body.out_trade_no, //查询订单号
				})), [
				function(res) { //先判断订单查询，当前订单是否没支付过，如果没支付过，再进行卡信息查询，获取余额信息
					console.log("[PaymentAll]第一次结果（QueryPayment）:", res);
					var request_data = CreateData(pt, "查询中...", "QueryCardDetails", Object.assign(
						base_require_request_params(), {
							ryid: getApp().globalData.store.KHID,
							card_no: body.auth_code
						}));
					return request_data;
				},
				function(res) {
					console.log("[PaymentAll]第二次结果（QueryCardDetails）:", res);
					console.log("[PaymentAll]支付金额:", {
						card_balance: res.data.balance,
						order_balance: body.money,
						card_id: res.data.card_id,
						query_password: res.data.card_password,
						password,
					});
					var request_data = CreateData(pt, "支付中...", "Payment", Object.assign(
						base_require_request_params(), {
							ryid: getApp().globalData.store.KHID,
							card_no: is_pe_code ? res.data.card_id :
							card_no, //如果是PE码则传入查询卡信息返回的card_id,否则按照PN规则传入
							auth_code: is_pe_code ? res.data.card_password : password,
							money: body.money,
							out_trade_no: body.out_trade_no
						}));
					console.log("[PaymentAll]支付请求参数:", request_data);
					if (res.code && (res.data.balance - (body.money / 100)) >= 0) {
						return request_data;
					} else {
						request_data.code = false; //主动抛出异常
						util.simpleMsg(`卡余额不足，当前余额：${res.data.balance}，请充值后重试!`, true);
						finallyFunc?.call();
						return;
					}
				},
				function(res) {
					var request_data = CreateData(pt, "查询中...", "QueryPayment", Object.assign(
						base_require_request_params(), {
							out_refund_no: body.out_trade_no, //查询订单号
						}));
					console.log("[PaymentAll]第三次结果（Payment）:", res);
					if (res.code) { //支付成功
						return request_data;
					} else { //支付失败
						request_data.code = false; //主动抛出异常
						util.simpleMsg("支付失败!", true);
						console.log("支付失败:", res);
						finallyFunc?.call();
						return;
					}
				},
				function(res) {
					console.log("[PaymentAll]第四次结果（QueryPayment）:", res);
					if (res.code) { //支付成功
						func?.call(null, res);
						return {
							code: false,
							msg: "支付成功了",
							data: res
						};
					} else { //支付失败
						request_data.code = false; //主动抛出异常
						util.simpleMsg("支付失败!", true);
						console.log("支付失败:", res);
						finallyFunc?.call();
						return;
					}
				}
			], function(err) {
				console.log("[PaymentAll]支付接口返回的错误信息：", err);
				if (err.msg == "未查询到订单信息") {
					err.code = true;
					return;
				}
				if (catchFunc) catchFunc(err);
				util.simpleMsg(res.msg, true);
			}, function(active_err) {
				console.log("主动抛出异常:", active_err);
			});
		}
	},
	RefundAll: async function(pt, body, catchFunc, finallyFunc, resultsFunc) {
		console.log("[RefundAll]原订单门店ID:", body.original_store_id);
		var original_area_id = (await _GetClientInfos(body.original_store_id))?.DQID;
		console.log("[RefundAll]原订单地区ID:", original_area_id);
		var config_result = await _GetConfig("PINNUOPAY", original_area_id || getApp().globalData.store.DQID).then((config) => {
			var result = {
				code: false,
				msg: null,
				data: null
			}
			console.log("[RefundAll]品诺支付参数获取:", config)
			if (!config) {
				result.code = false;
				result.msg = "支付参数未配置!";
			} else {
				result.code = true;
				result.msg = "参数获取成功!";
				result.data = config;
			}
			return result;
		})
		if (!config_result.code) {
			catchFunc(config_result);
		} else {
			var config = config_result.data;
			var base_require_request_params = () => ({
				transaction_id: config.KEY, //渠道私钥
				trade_no: config.LONGKEY, //密码aes加密用的密钥
				deviceno: config.SHID, //门店标识id
				store_id: config.APPID //门店id
			});
			console.log("[RefundAll]退款数据:", body);
			Req.asyncFuncChain(CreateData(pt, "查询中...", "QueryPayment", Object.assign(
				base_require_request_params(), {
					out_refund_no: body.out_trade_no, //本地订单号
				})), [
				function(res) {
					console.log("[RefundAll]第一次结果（QueryPayment）:", res);
					console.log("[RefundAll]准备被退款的渠道单号:", body.point);
					return CreateData(pt, "退款中...", "Refund", Object.assign(
						base_require_request_params(), {
							out_refund_no: body.point, //品诺渠道单号
							posid: body.out_refund_no, //品诺渠道单号
						}));
				}
			], catchFunc, finallyFunc, resultsFunc);
		}
	},
	QueryCardDetails: async function(card_number){
		var config_result = await _GetConfig("PINNUOPAY", getApp().globalData.store.DQID).then((config) => {
			console.log("[QueryCardDetails]品诺支付参数获取:", config)
			if (!config) {
				return util.createdResult(false,'支付参数未配置!');
			} else {
				return util.createdResult(true,'参数获取成功!',config);
			}
		})
		console.log("[QueryCardDetails]品诺支付参数获取结果:",config_result);
		if (!config_result.code) {//如果没获取到参数
			catchFunc(config_result);
			return result;
		}
		var config = config_result.data;
		var base_require_request_params = () => ({
			transaction_id: config.KEY, //渠道私钥
			trade_no: config.LONGKEY, //密码aes加密用的密钥
			deviceno: config.SHID, //门店标识id
			store_id: config.APPID //门店id
		});
		if (!card_number) {
			return util.createdResult(false, "未传入卡号!");
		}
		var is_pe_code = card_number.substr(0, 2) == "PE"; //判断是否是 PE 码（PE、PN）
		var card_no = card_number.substr(2, 11);
		var password = card_number.substr(13) || 0;
		console.log("[QueryCardDetails]品诺支付:", {
			card_no,
			password
		});
		let details_result = null;
		await Req.AsyncRequesrChain(CreateData('PINNUO', "查询中...", "QueryCardDetails", Object.assign(
			base_require_request_params(), {
				ryid: getApp().globalData.store.KHID,
				card_no: card_number
			}), true), [
			function(res) { //先判断订单查询，当前订单是否没支付过，如果没支付过，再进行卡信息查询，获取余额信息
				console.log("[QueryCardDetails]第一次结果（QueryCardDetails）:", res);
				details_result = res;
				return res;
			}
		], function(err) {
			details_result = err;
		}, function(active_err) {
			console.log("主动抛出异常:", active_err);
			details_result = active_err;
		});
		return details_result;
	},
	Payment: function(pt, body, func, catchFunc) {
		_Payment(pt, body, func, catchFunc);
	},
	QueryPayment: async function(pt, body, func, catchFunc) {
		var config_result = await _GetConfig("PINNUOPAY", getApp().globalData.store.DQID).then((config) => {
			var result = {
				code: false,
				msg: null,
				data: null
			}
			console.log("[PaymentAll]品诺支付参数获取:", config)
			if (!config) {
				result.code = false;
				result.msg = "支付参数未配置!";
			} else {
				result.code = true;
				result.msg = "参数获取成功!";
				result.data = config;
			}
			return result;
		});
		if (!config_result.code) {
			catchFunc(config_result);
		} else {
			var config = config_result.data;
			var base_require_request_params = () => ({
				transaction_id: config.KEY, //渠道私钥
				trade_no: config.LONGKEY, //密码aes加密用的密钥
				deviceno: config.SHID, //门店标识id
				store_id: config.APPID //门店id
			});
			if (!body.auth_code)
				catchFunc({
					msg: "未传入卡号!"
				});
			var is_pe_code = body.auth_code.substr(0, 2) == "PE"; //判断是否是 PE 码（PE、PN）
			var card_no = body.auth_code.substr(2, 11);
			var password = body.auth_code.substr(13) || 0;
			console.log("[PaymentAll]品诺支付:", {
				card_no,
				password
			});
			_QueryPayment(pt, Object.assign(base_require_request_params(), {
				out_refund_no: body.out_trade_no, //查询订单号
			}), func, catchFunc);
		}
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

//抖音团购券（联机）支付
var tiktokPay = {
	PaymentAll: async function(pt, body, func, catchFunc, finallyFunc){//核销
		console.log("[PaymentAll]开始抖音券核销操作...");
		let poi_id = await tiktok.get_tiktok_store_id(),token = await tiktok.get_tiktok_token();
		console.log("[PaymentAll]抖音券支付参数查询完毕...");
		console.log("[PaymentAll]抖音券支付参数:",{
			token,
			poi_id
		});
		body.transaction_id = token;
		body.store_id = poi_id;
		// body.transaction_id = "clt.ed203972c0b777fc71573e1f6fb0e1cax27V1Jp4SqWdplol91iqpXhpkSDh";
		// body.store_id = "6601132867395258372";
		if (!token) {
			if (catchFunc) catchFunc(util.createdResult(false,"当前门店未配置抖音TOKEN，禁止核销", null));
			return;
		}
		if (!poi_id) {
			if (catchFunc) catchFunc(util.createdResult(false,"当前门店未配置抖音POI_ID，未认领门店，禁止核销", null));
			return;
		}
		Req.AsyncRequesrChain(CreateData(pt, "支付中...", "Payment", body), [
			function(res) { //先判断订单查询，当前订单是否没支付过，如果没支付过，再进行卡信息查询，获取余额信息
				console.log("[PaymentAll]第一次结果（Payment）:", res);
				if(res.code && res.data.money)
					body.money = res.data.money;
				func?.call(null, res);
				return res;
			}
		], function(err) {
			console.log("[PaymentAll]支付接口返回的错误信息：", err);
			if (catchFunc) catchFunc(err);
			util.simpleMsg(res.msg, true);
		}, function(active_err) {
			console.log("主动抛出异常:", active_err);
		});
	},
	RefundAll: async function(pt, body, catchFunc, finallyFunc, resultsFunc){//撤销
		let token = await tiktok.get_tiktok_token();
		body.transaction_id = token;
		// body.transaction_id = "clt.ed203972c0b777fc71573e1f6fb0e1cax27V1Jp4SqWdplol91iqpXhpkSDh";
		Req.asyncFuncChain(CreateData(pt, "查询中...", "QueryPayment", body), [
			function(res) {
				console.log("[RefundAll]第一次结果（QueryPayment）:", res);
				return CreateData(pt, "退款中...", "Refund", body);
			}
		], catchFunc, finallyFunc, resultsFunc);
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
	//108使用

	//仟吉使用
	WXZF: wxPay, //微信支付
	ZFB20: zfbPay, //支付宝支付
	PAYCARD: hykPay, //仟吉电子卡
	PAYBRUSHCARD: kengeePay, //仟吉实体卡
	HyJfExchange: pointPay, //积分抵现 
	SZQ: szqPay, //电子券支付
	TL: misPay, //银联（银行卡）支付
	UPAY: misScanCodePay, //银联二维码
	PINNUO: pinoPay, //品诺支付（核销、支付、支付查询）
	COUPON: kbPay, //可伴电子券支付
	NOPAY: noPay, //不走接口的支付方式
	DouYinJK: tiktokPay,//抖音团购券（联机）支付
}

//聚合支付主入口
var PaymentAll = function(pt, body, func, catchFunc, finallyFunc) {
	try {
		console.log("[PaymentAll]开始调用:",[...arguments]);
		payType[pt].PaymentAll(pt, body, func, catchFunc, finallyFunc)
	} catch (e) {
		console.log("[PaymentAll]发生调用异常:", e);
		console.log("[PaymentAll]发生调用异常参数:", [...arguments]);
		if (catchFunc) catchFunc();
	}
}
//聚合退款主入口
var RefundAll = function(pt, body, catchFunc, finallyFunc, resultsFunc) {
	try {
		console.log("[RefundAll]开始调用:",[...arguments]);
		payType[pt].RefundAll(pt, body, catchFunc, finallyFunc, resultsFunc)
	} catch (e) {
		console.log("[RefundAll]发生调用异常:", e);
		if (catchFunc) catchFunc();
	}
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
	RefundAll,
	_GetConfig,
	_PaymentAll,
	CreateData,
	PaymentTypeInfos: payType,
}
