const Payment = (title,postdata={}) => {
	Req.asyncFunc({
		http: true,
		url: "/WxPay/CodePayment",
		title: title,
		method: "POST",
		data: postdata
	}, function(res) {
		return  res;
	});
}
export default {
	Payment
}