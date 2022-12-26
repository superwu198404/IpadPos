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
	let store = util.getStorage("store");
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
					load: false,
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
						gsid: store.GSID,
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

/**
 * 包含支付和查询以及撤销的支付体
 */
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
				util.simpleMsg("支付参数为空!", true)
				if (catchFunc) catchFunc();
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
			if (!config) {
				util.simpleMsg("支付参数为空!", true);
				if (catchFunc) catchFunc();
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
			if (!config) {
				util.simpleMsg("支付参数为空!", true);
				if (catchFunc) catchFunc();
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
		_GetConfig("TL", getApp().globalData.store.KHID).then((config) => {
			if (!config) {
				util.simpleMsg("支付参数为空!", true)
				if (catchFunc) catchFunc();
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
		_GetConfig("TL", getApp().globalData.store.KHID).then((config) => {
			if (!config) {
				util.simpleMsg("支付参数为空!", true);
				if (catchFunc) catchFunc();
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
		_GetConfig("TL", getApp().globalData.store.KHID).then((config) => {
			if (!config) {
				util.simpleMsg("支付参数为空!", true)
				if (catchFunc) catchFunc();
				return;
			}
			body.merchant_no = config.SHID; //使用全局配置（后端
			body.terminalCode = config.NOTE;
			body.store_id = config.KEY;
			console.log("[RefundAll]银联二维码退款参数:",{
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

import member from '@/api/hy/MemberInterfaces.js'; //会员积分抵现自实现的支付和退款（由于不是常规支付，所以常规的支付流程不适用）
import checker from '@/utils/graceChecker.js';

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
	HyJfExchange: pointPay, //积分抵现
	SZQ: szqPay,
	TL: misPay,
	
	//新增接口
	UPAY:misScanCodePay,
}

//聚合支付主入口
var PaymentAll = function(pt, body, func, catchFunc) {
	try {
		payType[pt].PaymentAll(pt, body, func, catchFunc)
	} catch (e) {
		console.log("[PaymentAll]发生调用异常:", e);
		if (catchFunc) catchFunc();
	}
}
//聚合退款主入口
var RefundAll = function(pt, body, catchFunc, finallyFunc, resultsFunc) {
	try {
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
	RefundAll
}
