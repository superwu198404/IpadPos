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
 * 本单现金合计 = **实收金额** = 录入金额 - 找零。
 *
 * 口径（2026-10-16 调整）：按实收算，也就是去掉找零后的值。
 *
 * ⚠️ 不能用 `toBePaidPrice()`（待支付金额）代替：
 *   待付 = 这单还欠多少，与收银员实际收了多少钱是**两回事**。
 *   例：待付 5000、收银员只收了 800 现金 -> 实收 800，不该判超限；
 *       若用待付判，会拿 5000 去比限额，导致"输入的金额远小于限额也弹超额"。
 *   两者只有在"录入金额恰好等于待付"（无找零）时才相等。
 *
 * 为什么用 `dPayAmount` 作为录入金额、而不是累加 `PayList`：
 *   - `dPayAmount` 是输入框当前值，也等于 `toBePaidPrice()`（切换支付方式时被重置），
 *     已包含本单此前的现金额度；现金是全单唯一支付方式（`CheckCashPayment`
 *     会合并前一条现金记录），所以它就是本次的录入金额。
 *   - `PayList` 的更新发生在 `PushToPaidList`，**晚于**本函数被调用的时机
 *     （`InPaymentBeforeStoped` 在 `PayHandle` 开头执行），此刻读它是旧值。
 *
 * `changeNumber` 来自 `CountCashChange()`，即 `录入金额 - 待支付金额`。
 * 理论上不会超过录入金额，这里仍用 `Math.max(0, ...)` 兜底异常输入。
 *
 * @param {number|string} dPayAmount 输入框中的支付金额（录入金额）
 * @param {number|string} changeNumber 找零金额
 * @returns {number} 实收现金合计
 */
export const getCashTotal = function(dPayAmount, changeNumber) {
	const paid = Number(dPayAmount) || 0;
	// 找零为负表示"输入小于待付"（还欠钱），此时没有找零，实收就是输入金额本身。
	// 直接把负数当减项会算成"倒找钱"，是错的，所以先归零。
	const change = Math.max(0, Number(changeNumber) || 0);
	return Math.max(0, paid - change);
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
 * 返回值有三种：
 *   - SQL 字符串：正常生成，调用方应追加进 OracleSql
 *   - "NOCASH"：读到了标记，但本单**本来就不该记录**（非现金单、现金方式不可用、
 *     单据字段不全）。标记已在内部清掉，调用方不需要做任何事。
 *   - null：根本没有标记，什么都没发生，调用方不需要做任何事。
 *
 * 支付页靠区分后两者来决定要不要清理残留标记，见 Payment.vue 的 CashLimit。
 */
export const buildWarmSql = function(dataObj) {
	const pending = readPending();
	if (!pending) return null;

	// 无论后续哪条分支返回，标记都已消费完毕
	clearPending();

	// 「不是现金单」是**正常情况**，不算异常，不写 warn 日志（否则每次支付都刷屏）。
	// 但必须与 null 区分开：null 表示"从来没写过标记"，
	// 而这里表示"写过一个标记、但它没被消费掉"，支付页据此清理残留。
	// BILL / SALEDATE 同时是主键成员，缺失会让 TO_DATE 或主键约束在 Oracle 报错，
	// 而报错会让整张单据卡在上传队列里反复重试，故一并校验。
	const sale1 = dataObj && dataObj.SALE001;
	if (!sale1 || !sale1.BILL || !sale1.SALEDATE) {
		return "NOCASH";
	}

	// 若现金支付方式是"不可用"状态，本次不可能是现金支付。
	// 典型场景：用户在弹窗【取消】后改用其它方式 —— 标记会残留到下一张单据，
	// 此时必须丢弃，否则会写一条 BILL 属于新单、NET 却是旧单的脏记录。
	// （FKDA_INFO / PayWayList 取不到时跳过该判断，不因取数失败影响正常记录）
	const fkda = util.getStorage("FKDA_INFO");
	const cash_info = (fkda && fkda.length) ? fkda.find(info => info.MEDIA == '1') : null;
	const cash_way = util.getStorage("PayWayList");
	if (cash_info && cash_way && cash_way.length) {
		const settled = cash_way.find(w => w.fkid == cash_info.FKID);
		if (settled && settled.yn_use == 'N') {
			console.warn("[BuildWarmSql]本单现金支付方式不可用，丢弃残留标记:", cash_info.FKID);
			return "NOCASH";
		}
	}

	// 不变式校验：支付页写下的 net 必须等于本单实际落库的**现金净额**。
	//
	// 为什么这是**精确**判据而不是凑数的防御：
	//   - 只有"当前支付方式 = 现金"时 CashChange 才会写标记，所以有标记的单必有现金支付行；
	//   - 金额无关的竞态（用户改金额、上一单残留的同名标记、用户取消后改用其它方式）
	//     都会让两者对不上，从而被这一条全部拦掉。
	//
	// 求和时**正负行都要算**：净额 = 正数行（录入口径的支付）+ 负数行（找零）。
	//   SALE003 里的现金行有两类：
	//     - 支付行：`AMT = dPayAmount`（录入金额，含找零）
	//     - 找零行：`AMT = -excess`（CheckCashPayment 写入，带着同一个 FKID）
	//   两者相加才是实收，而 `pending.net` 记的正是实收（= 待支付金额），口径才一致。
	//
	// 早期版本这里只累加正数行（当时 net 也记录入金额），2026-10-16 口径改为实收后
	// 若仍只取正数行，会让**有找零的超限单全部被判为不匹配而丢弃**。
	//
	// 不相等说明标记不属于本单，丢弃。
	if (cash_info && Array.isArray(dataObj.SALE003)) {
		const cash_amt = dataObj.SALE003
			.filter(i => i && i.FKID == cash_info.FKID)
			.reduce((sum, i) => sum + Number(i.AMT || 0), 0);
		if (Math.abs(cash_amt - Number(pending.net || 0)) > 0.005) {
			return "NOCASH";
		}
	}

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
