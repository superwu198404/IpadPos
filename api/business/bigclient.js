import Req from '@/utils/request.js';
import util from '@/utils/util.js';
import common from '@/api/common.js';

/**
 * 获取大客户列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getBigClients = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetBigClients";
	let reqdata = Req.resObj(true, "查询中...", data, apistr, true);
	Req.asyncFuncOne(reqdata, func, catchFunc);
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