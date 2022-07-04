/*
Database Access
后端数据库访问
*/
import Req from '@/utils/request.js';

const RequestSend = async function(sql, succesFunc, errorFunc) {
	let reqdata = Req.resObj(true, "数据传输中", sql, `MobilePos_API.Models.DataQuery.SALEQuery`);
	reqdata.data.data = sql;
	console.log("[RequestSend]reqdata:", reqdata);
	await Req.asyncFuncOne(reqdata,
		function(res) {
			if (succesFunc) succesFunc(res);
		},
		function(error) {
			if (errorFunc) succesFunc(error);
		});
}

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
