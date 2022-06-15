import Req from '@/utils/request.js';
import rsa from '@/utils/rsa.js';

var def_body = {
	"paytype": "",
	"method": "",
	"param": {},
	"data": {}
};

//请求处理入口
const RequestHandle = (title, body = {
	...def_body
}, ...callbacks) => {
	Req.asyncFunc(...[{
		http: true,
		url: "PaymentAll/Handle",
		title: title,
		method: "POST",
		data: {
			paytype: "AliPay_ScanCode",
			method: body.method,
			param: body.param,
			sign: rsa.rsaEncrypt(JSON.stringify(body.data))
		}
	}, ...callbacks]);
}

//请求处理入口(电子券查询)
const ECouponQuery = (title, body = [], ...callbacks) => {
	Req.asyncFunc(...[{
		http: true,
		url: "Hy/hy",
		title: title,
		method: "POST",
		data: {
			apiname: "TICKETQUERY",
			appid: "keengee",
			paramkey: "acc",
			data: {
				GT_IMPORT: body
			}
		}
	}, ...callbacks]);
}

const Payment = (title, apiName, type, body = {}, fun1, fun4) => {
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
	}, fun1, null, null, fun4);
}

export default {
	Payment,
	RequestHandle
}
