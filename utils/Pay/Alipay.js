import Req from '@/utils/request.js';

//支付宝付款码支付
const CodePayment = (title, out_trade_no, auth_code, subject, total_amount) => {
	Req.asyncFunc({
		http: true,
		url: "/AliPay/CodePayment",
		title: title,
		method: "POST",
		data: {
			out_trade_no: this.out_trade_no,
			auth_code: this.auth_code,
			subject: "测试测试",
			total_amount: 0.01
		}
	}, function(res) {
		console.log(JSON.stringify(res));
		return res;
	});
}

//支付宝扫码付款
const CodeScanPay = (title, out_trade_no, subject, total_amount) => {
	Req.asyncFunc({
		http: true,
		url: "/AliPay/CodeScanPay",
		title: title,
		method: "POST",
		data: {
			out_trade_no: out_trade_no,
			subject: subject,
			total_amount: 0.01
		}
	}, function(res) {
		console.log(JSON.stringify(res));
		return res;
	});
}

///支付宝退款
const TradeRefund = (title, out_trade_no, out_request_no, refund_amount) => {
	Req.asyncFunc({
		http: true,
		url: "/AliPay/TradeRefund",
		title: title,
		method: "POST",
		data: {
			out_trade_no: out_trade_no,
			out_request_no: out_request_no,
			refund_amount: refund_amount
		}
	}, function(res) {
		console.log(JSON.stringify(res));
		return res;
	});
}

const Payment = (title, apiName, type, body={}) => {
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
	}, function(res) {
		console.log(JSON.stringify(res));
		return res;
});


}
export default {
	CodePayment,
	CodeScanPay,
	TradeRefund,
	Payment
}
