import util from '@/utils/util.js';

/**
 * 现金支付超限提示 + 课长消息记录
 *
 * 职责：
 *   1. 判定当前现金支付是否超限（支付页调用）
 *   2. 确认超限后把 {ts, net} 标记写进 storage（支付页调用）
 *   3. 单据落库时从 storage 取标记、拼出 Oracle INSERT（CreateSaleOrder 调用）
 *
 * 注意：本文件不 import api/common.js 或 bll，保持依赖单一，便于单元测试。
 */

// 取现金支付方式的 FKID：全项目统一用 FKDA.MEDIA == '1' 判定，不能用硬编码的 ZF01
export const getCashFkid = function() {
	const list = util.getStorage("FKDA_INFO");
	if (!list || !list.length) return undefined;
	const cash = list.find(info => info.MEDIA == '1');
	return cash ? cash.FKID : undefined;
}

// 取现金上限参数（POSCS = CASHSX）的 POSCSNR 值，直接读 sysParam 缓存
export const getCashLimitParam = function() {
	const param = util.getStorage("sysParam");
	if (!param) return "";
	return param["CASHSX"] || "";
}

/**
 * 本单现金合计。
 *
 * 直接用 dPayAmount，**不能再累加 PayList** —— dPayAmount 是"整单待付余额"，
 * 不是增量：
 *   - toBePaidPrice() = totalAmount - yPayAmount - PayedAmount
 *   - dPayAmount 在切换支付方式时被重置为 toBePaidPrice()（见 Payment.vue 的
 *     currentPayType watcher），因此它已经包含了本单此前的现金金额。
 *   - 现金是全单唯一支付方式（CheckCashPayment 会合并前一条现金记录），
 *     所以 dPayAmount 就是本单截至目前（含本次输入）的全部现金额。
 *   - yPayAmount / PayList 的更新发生在 PushToPaidList，晚于本函数被调用的时机
 *     （InPaymentBeforeStoped 在 PayHandle 开头执行）。
 *
 * 注意：CashLimit 只在当前支付方式是现金时被调用，所以这里不需要判断 fkid。
 *
 * @param {number|string} dPayAmount 输入框中的本次支付金额
 * @returns {number} 本单现金合计
 */
export const getCashTotal = function(dPayAmount) {
	return Number(dPayAmount) || 0;
}

// 超限判定：参数必须是一个正数才生效，否则本功能不触发（参数缺失不应阻塞收银）
export const isOverLimit = function(cashTotal, paramValue) {
	const limit = Number(paramValue);
	if (isNaN(limit) || limit <= 0) return false;
	return Number(cashTotal) > limit;
}
