import Req from '@/utils/request.js';

/**
 * 获取线上订单列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getReserveOrders = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetReserveOrders";
	let reqdata = Req.resObj(true, "预定取货查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
