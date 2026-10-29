/**
 * 销售赠品 - 加赠/减赠积分的参数组装
 * 纯函数，不依赖 uni/uni.request，便于独立验证
 * 前端不直连网关，统一经 /Member/handle 由 MIS 侧转发
 *   加赠 method: SingleAddCustPoints
 *   减赠 method: SingleSubCustPoints
 * 两个接口的 member 串均不带 activityCode
 */

/**
 * 组装加赠积分参数
 * @param {Object} o
 * @param {String} o.hyid    会员号
 * @param {String} o.bill    本销售单号
 * @param {Number} o.point   本次赠送积分数（正值）
 */
export const buildAddGiftPoint = function(o) {
	return {
		account: o.hyid,
		merOrderId: o.bill,
		value: Number(o.point),
		opNote: "积分新增"
	};
}

/**
 * 组装减赠积分参数
 * 注意：接口 value 传正值，卓越侧记账为负值
 * @param {Object} o
 * @param {String} o.hyid     会员号
 * @param {String} o.bill     退单号
 * @param {String} o.oriBill  关联的原销售单号
 * @param {Number} o.point    退单对应积分数（传正值）
 */
export const buildCancelGiftPoint = function(o) {
	return {
		account: o.hyid,
		merOrderId: o.bill,
		value: Number(o.point),
		channel: "POS",
		oriOderId: o.oriBill
	};
}

export default {
	buildAddGiftPoint,
	buildCancelGiftPoint
}
