import Req from '@/utils/request.js';

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
const CodeScanPay = (title, out_trade_no, subject, auth_code, total_amount, func) => {
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
		console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	});
}
///查询微信扫码支付的结果
const QueryCodeScanPay = (title, out_trade_no, func) => {
	Req.asyncFunc({
		http: true,
		url: "/Payment/Payment",
		title: title,
		method: "POST",
		data: {
			apiName: 'V2TradeQuery',
			type: 'WxPayService',
			body: {
				out_trade_no: out_trade_no
			}
		}
	}, function(res) {
		console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	});
}
///撤销支付订单
const CancelCodeScanPay = (title, out_trade_no, func) => {
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
		console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	});
}
export default {
	CodePayment,
	CodeScanPay,
	QueryCodeScanPay
}
