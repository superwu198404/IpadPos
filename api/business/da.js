/*
Database Access
后端数据库访问
*/
import Req from '@/utils/request.js';

const RequestSend = async function(sql,succesFunc,errorFunc) {
	let reqdata = Req.resObj(true, "数据传输中", { sql }, `MobilePos_API.Utils.DBHelpes.OracleHelpers.ExecuteSDMLSqlRetJson`);
	await Req.asyncFuncOne(reqdata,
		function(res) {
			if(succesFunc) succesFunc(res);
		},
		function(error) {
			if(errorFunc) succesFunc(error);
		});
}

export const RefundQuery = async function(bill){
	bill = 'BJ10QT00112107161002240';
	let result = true;
	await RequestSend(`select * from sale001 where bill='${bill}'`,(res) => {
		console.log("sale1-da:",res);
		result &= res.code;
	});
	await RequestSend(`select * from sale002 where bill='${bill}'`,(res) => {
		console.log("sale2-da:",res);
		result &= res.code;
	});
	await RequestSend(`select * from sale003 where bill='${bill}'`,(res) => {
		console.log("sale3-da:",res);
		result &= res.code;
	});
	return result;
}
