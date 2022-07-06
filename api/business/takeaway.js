import req from "@/utils/request.js";

/**
 * 获取外卖单
 */
var GetWMOrders = function(e, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetWMOrders";
	let reqdata = Req.resObj(true, "数据查询中", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func(res),func(res));
}
export default {
	GetWMOrders
}
