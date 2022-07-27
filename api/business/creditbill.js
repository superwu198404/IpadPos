import Req from '@/utils/request.js';
import util from '@/utils/util.js';

/**
 * 获取退货订单列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getRefundBills = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetRefundBills";
	let reqdata = Req.resObj(true, "退货单查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}