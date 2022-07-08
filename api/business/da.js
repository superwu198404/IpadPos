/*
Database Access
后端数据库访问
*/
import Req from '@/utils/request.js';

export const RequestSend = async function(sql, succesFunc, errorFunc) {
	let reqdata = Req.resObj(true, "数据传输中", sql, `MobilePos_API.Models.DataQuery.SALEQuery`),code = true,result = null;
	reqdata.data.data = sql;
	await Req.asyncFuncOne(reqdata,
		function(res) {
			code = true;
			result = res;
			if (succesFunc) succesFunc(res);
		},
		function(error) {
			code = false;
			result = error;
			if (errorFunc) succesFunc(error);
		});
		return {
			code:code,
			result:result
		}
}

// 退款用的订单查询
export const RefundQuery = async function(bill) {
	let sales = {
		sale1: {},
		sale2: [],
		sale3: []
	};
	await RequestSend(`select * from sale001 where bill='${bill}'`, (res) => {
		sales.sale1 = JSON.parse(res.data)[0];
	});
	await RequestSend(`select * from sale002 where bill='${bill}'`, (res) => {
		sales.sale2 = JSON.parse(res.data);
	});
	await RequestSend(`select * from sale003 where bill='${bill}'`, (res) => {
		sales.sale3 = JSON.parse(res.data);
	});
	return sales;
}
