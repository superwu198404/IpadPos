/**
 * 积分抵扣接口
 * @param {*} data 
 * @param {*} func 
 * @param {*} catchFunc 
 */
export const pointsDeduction = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.PointsDeduction";
	let reqdata = Req.resObj(true, "抵扣中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}

/**
 * 积分回退接口
 * @param {*} data 
 * @param {*} func 
 * @param {*} catchFunc 
 */
export const pointsReturn = function(data, func, catchFunc) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.PointsReturn";
	let reqdata = Req.resObj(true, "回退中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, catchFunc);
}