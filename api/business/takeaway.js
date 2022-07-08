import Req from '@/utils/request.js';

/**
 * 获取外卖单
 */
var GetWMOrders = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrders";
	let reqdata = Req.resObj(true, "数据查询中", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//查询表外卖详情单
var GetWMOrderDetail = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrderDetail";
	let reqdata = Req.resObj(true, "数据查询中", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意接收
var ConfirmReceipt = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConfirmReceipt";
	let reqdata = Req.resObj(true, "操作中...", e, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//同意和拒绝退单
var ConmmonRefund = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ConmmonRefund";
	let reqdata = Req.resObj(true, "操作中...", e, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
export default {
	GetWMOrders,
	GetWMOrderDetail,
	ConfirmReceipt,
	ConmmonRefund
}
