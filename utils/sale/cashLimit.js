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

// storage 标记：支付页确认超限后写，CreateSaleOrder 落库时消费
const STORAGE_KEY = "CashLimit_Warm";
// 新鲜度阈值：超过这个时间的标记视为残留（异常中断），不再消费，避免污染后续单据
const FRESH_MS = 5 * 60 * 1000;

export const savePending = function(net) {
	util.setStorage(STORAGE_KEY, {
		ts: Date.now(),
		net: Number(net) || 0
	});
}

// 读标记；不存在或已过期都返回 null
export const readPending = function() {
	const pending = util.getStorage(STORAGE_KEY);
	if (!pending || !pending.ts) return null;
	if (Date.now() - Number(pending.ts) > FRESH_MS) return null;
	return pending;
}

export const clearPending = function() {
	util.removeStorage(STORAGE_KEY);
}

// SQL 字符串值转义：单引号需要写成两个单引号
const escapeSql = function(v) {
	return String(v == null ? "" : v).replace(/'/g, "''");
}

/**
 * 组装 POS_INFOR_WARM 的 Oracle INSERT。
 * 由 bll/Common/bll.js 的 CreateSaleOrder 调用，是标记的唯一消费入口。
 *
 * 返回 null 表示本次无需写入。**只要读到了标记就一定清掉**（无论能否成功生成），
 * 以保证标记不会泄漏到下一张单据。
 *
 * 单据字段一律从 dataObj.SALE001 取——它与 Oracle 侧那条 SALE001 是同一份数据，
 * 保证 SALEDATE 等字段与单据完全一致（POS_INFOR_WARM 主键含 SALEDATE）。
 */
export const buildWarmSql = function(dataObj) {
	const pending = readPending();
	if (!pending) return null;

	// 无论后续哪条分支返回，标记都已消费完毕
	clearPending();

	const sale1 = dataObj && dataObj.SALE001;
	if (!sale1 || !sale1.BILL) return null;

	// 赊销结算判定：YWSXJS 表只在 sale_credit_settlement 模式生成
	// （base_sale.js 的 $initSale 内 this.additional['YWSXJS'] = params.ywsxjs）
	// 需求要求赊销结算写 SXJS，而 saleBillType 数组里没有这个值，故在此覆盖。
	const billType = dataObj.YWSXJS ? 'SXJS' : sale1.BILL_TYPE;

	// 数字列，不加引号；与 CreateSQL 保持一致，归一为三位小数
	const net = Number(pending.net || 0).toFixed(3);

	// 日期格式串必须与 api/common.js 的 CreateSQL 一致，否则 SALEDATE 与单据对不上
	return "insert into POS_INFOR_WARM (SALEDATE,KHID,BILL,BILL_TYPE,RYID,NET,YN_TX) values(" +
		"TO_DATE('" + escapeSql(sale1.SALEDATE) + "','yyyy-MM-dd HH24:mi:ss')," +
		"'" + escapeSql(sale1.KHID) + "'," +
		"'" + escapeSql(sale1.BILL) + "'," +
		"'" + escapeSql(billType) + "'," +
		"'" + escapeSql(sale1.RYID) + "'," +
		net + ",'N');";
}
