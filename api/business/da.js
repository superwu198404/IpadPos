/*
Database Access(SQLite 本地数据库)
后端数据库访问
*/
import Req from '@/utils/request.js';

export const RequestSend = async function(sql, succesFunc, errorFunc) {
	let reqdata = Req.resObj(true, "数据处理中", sql, `MobilePos_API.Models.DataQuery.SALEQuery`,true),
		code = true,
		result = null;
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
			if (errorFunc) errorFunc(error);
		});
	return {
		code: code,
		result: result
	}
}

export const BatchQuery = async function(sqls, succesFunc, errorFunc) {
	let reqdata = Req.resObj(true, "数据传输中", sqls, `MobilePos_API.Models.DataQuery.BatchQuery`),
		code = true,
		result = null;
	// reqdata.data.data = sqls;
	await Req.asyncFuncOne(reqdata,
		function(res) {
			console.log("[BatchQuery]成功结果:", res);
			code = true;
			result = res;
			if (succesFunc) succesFunc(res);
		},
		function(error) {
			console.log("[BatchQuery]异常结果:", error);
			code = false;
			result = error;
			if (errorFunc) succesFunc(error);
		});
	return {
		code: code,
		result: result
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

/**
 * 业务查询操作
 * @param {*} sqls 需要执行的到服务端数据库的sql列表
 */
export const BusinessQuery = async function(sqls = []) {
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
