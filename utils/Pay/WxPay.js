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
const CodeScanPay = (title, out_trade_no, subject, total_amount) => {
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
				subject: subject,
				total_amount: total_amount
			}
		}
	}, function(res) {
		console.log(JSON.stringify(res));
		return res;
	});
}

export default {
	CodePayment,
	CodeScanPay
}
