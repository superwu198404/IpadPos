import Req from '@/utils/request.js';
import util from '@/utils/util.js';
import configInfo from '@/utils/configInfo.js'; //配置参数
/**
 * 获取线上订单列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getOnlineOrders = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetOnlineOrders";
	let reqdata = Req.resObj(true, "线上订单查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}

/**
 * 查询 提取码/订单号 的线上取货单
 * @param {*} data 
 * @param {*} func 
 * @param {*} catchFunc 
 */
export const getReserveOnlineOrders = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetReserveOnlineOrders";
	let reqdata = Req.resObj(true, "线上订单查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}

/**
 * 线上订单原单信息查询
 * @param {*} data 
 * @param {*} func 
 * @param {*} catchFunc 
 */
export const getReserveOnlineRawOrderInfo = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetReserveOnlineRawOrderInfo";
	let reqdata = Req.resObj(true, "线上订单信息查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}

/**
 * 提取 提取码/订单号 的线上取货单
 * @param {*} data 
 * @param {*} func 
 * @param {*} catchFunc 
 */
export const onlineOrderReserve = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.OnlineOrderReserve";
	let reqdata = Req.resObj(true, "线上订单提取中", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
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
 * 线上订单基本信息修改
 * @param {*} data 查询参数 
 * @param {*} func 回调函数 
 */
export const updateOrderInfo = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.UpdateOnlineOrderInfo";
	let reqdata = Req.resObj(true, "订单信息修改中", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}

/**
 * 线上订单处理中
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const ordersAccept = function(data, func, err) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.OrdersAccept";
	let reqdata = Req.resObj(true, "订单处理中", data, apistr);
	Req.asyncFuncOne(reqdata, func, err);
}

/**
 * 线上订单状态查询
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const ordersStatusCheck = function(data, func, err) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.OnlineOrderStatusCheck";
	let reqdata = Req.resObj(true, "订单查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, err);
}
