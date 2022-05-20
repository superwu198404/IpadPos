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
		console.log(JSON.stringify(res));
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
		console.log(JSON.stringify(res));
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
		console.log(JSON.stringify(res));
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
		console.log(JSON.stringify(res));
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
		console.log(JSON.stringify(res));
		if (func) {
			func(res);
		}
		return res;
	}, null, null, func2);
}
export default {
	CodePayment,
	CodeScanPay,
	CancelCodeScanPay,
	QueryCodeScanPay,
	QueryRefund,
	Refund
}
