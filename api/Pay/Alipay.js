import Req from '@/utils/request.js';

var def_body = {
	    "paytype": "",
	    "method": "",
	    "param": {}, 
	    "data": {}
};

//请求处理入口
export default (title, body = {...def_body},...callbacks) => {
	Req.asyncFunc(...[{
		http: true,
		url: "PaymentAll/Handle",
		title: title,
		method: "POST",
		data: {
			paytype:"AliPay_ScanCode",
			method:body.method,
			param:body.param,
			data:body.data
		}
	},...callbacks]);
}
