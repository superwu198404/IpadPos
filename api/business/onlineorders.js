import Req from '@/utils/request.js';

/**
 * 获取线上订单列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getOnlineOrders = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetOnlineOrders";
	let reqdata = Req.resObj(true, "线上订单查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

/**
 * 获取到货时间段
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const getTimeRange = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetTimeRange";
	let reqdata = Req.resObj(true, "时间段查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

/**
 * 获取裱花间列表
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const getRoom = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetRoom";
	let reqdata = Req.resObj(true, "裱花间查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

/**
 * 线上订单处理中
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const ordersAccept = function(data, func, err){
	let apistr = "MobilePos_API.Models.SALE001CLASS.OrdersAccept";
	let reqdata = Req.resObj(true, "订单处理中", data, apistr);
	Req.asyncFuncOne(reqdata, func, err);
}
