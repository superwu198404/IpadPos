import Req from '@/utils/request.js';
const Payment = (title, apiName, type, body={},fun1,fun4) => {
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
	},fun1,null,null,fun4);
}

export default {
	Payment
}
