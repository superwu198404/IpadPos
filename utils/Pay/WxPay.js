///微信付款码支付
const CodePayment = (title,auth_code,body,total_fee) => {
	Req.asyncFunc({
		http: true,
		url: "/WxPay/CodePayment",
		title: title,
		method: "POST",
		data: {
			auth_code: auth_code,
			body: body,,
			total_fee: total_fee
		}
	}, function(res) {
		console.log(JSON.stringify(res));
	});
}
///微信扫码支付
const codeScanPay=(title,out_trade_no，subject，total_amount) => {
	Req.asyncFunc({
	        http: true,
	        url: "/WxPay/CodeScanPay",
	        title: title,
			method:"POST",
	        data: {
	        	out_trade_no: out_trade_no,
	        	subject: subject,
	        	total_amount:total_amount
	        }
	      }, function(res) {
	        console.log(JSON.stringify(res));
	   });
}


