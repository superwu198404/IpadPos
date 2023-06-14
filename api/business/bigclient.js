import Req from '@/utils/request.js';
import util from '@/utils/util.js';
import common from '@/api/common.js';

/**
 * 获取大客户列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getBigClients = function(data, func, catchFunc) {
	if(getApp().globalData.brand == 'KG'){
		let apistr = "MobilePos_API.Models.SALE001CLASS.GetBigClients";
		let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
		Req.asyncFuncOne(reqdata, func, catchFunc);
	}
	else{
		common.SimpleAPIRequest({
			class: 'DataQuery',
			method: 'SALEQuery',
			process: false,
			//标准版返回结果和仟吉版大有不同，缺少多个字段，还未明确
			data: `select DKFID DKHID, SNAME NAME from dkfda where kftype='${data.client_type == '3' ? '3' : '1'}' and khid='${data.storeid}' and dkfid like '%${data.khid}%' and sname like '%${data.name}%'`,
			success:func,
			error:catchFunc
		})
	}
}

/**
 * 获取大客户下的单据列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getBigClientSettlement = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetBigClientSettlement";
	let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}
