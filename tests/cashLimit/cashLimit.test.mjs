import test from 'node:test';
import assert from 'node:assert';
import util from '@/utils/util.js';
import * as cashLimit from '@/utils/sale/cashLimit.js';

test.beforeEach(() => util.__reset());

test('getCashFkid 取 MEDIA==1 的 FKID', () => {
  util.setStorage('FKDA_INFO', [
    { FKID: 'ZF02', MEDIA: '0' },
    { FKID: 'ZF01', MEDIA: '1' },
    { FKID: 'ZF03', MEDIA: '0' }
  ]);
  assert.strictEqual(cashLimit.getCashFkid(), 'ZF01');
});

test('getCashFkid 无现金支付方式时返回 undefined', () => {
  util.setStorage('FKDA_INFO', [{ FKID: 'ZF02', MEDIA: '0' }]);
  assert.strictEqual(cashLimit.getCashFkid(), undefined);
});

test('getCashLimitParam 从 sysParam 缓存取 CASHSX', () => {
  util.setStorage('sysParam', { CASHSX: '1000', SRGZ: '3' });
  assert.strictEqual(cashLimit.getCashLimitParam(), '1000');
});

test('getCashLimitParam 参数缺失返回空字符串', () => {
  util.setStorage('sysParam', { SRGZ: '3' });
  assert.strictEqual(cashLimit.getCashLimitParam(), '');
});

test('getCashTotal 直接返回待支付金额（实收口径）', () => {
  // 找零 = 录入 - 待付，所以 实收 = 录入 - 找零 = 待付；调用方传 toBePaidPrice()
  assert.strictEqual(cashLimit.getCashTotal(800), 800);
  assert.strictEqual(cashLimit.getCashTotal(1300), 1300);
});

test('getCashTotal 待付为字符串数字也能处理（toBePaidPrice 走 toFixed 返回字符串）', () => {
  assert.strictEqual(cashLimit.getCashTotal('800.00'), 800);
  assert.strictEqual(cashLimit.getCashTotal('1300.50'), 1300.5);
});

test('getCashTotal 待付为 0 时返回 0', () => {
  assert.strictEqual(cashLimit.getCashTotal('0.00'), 0);
  assert.strictEqual(cashLimit.getCashTotal(0), 0);
});

test('getCashTotal 参数缺失按 0 处理', () => {
  assert.strictEqual(cashLimit.getCashTotal(undefined), 0);
  assert.strictEqual(cashLimit.getCashTotal(null), 0);
  assert.strictEqual(cashLimit.getCashTotal(''), 0);
});

test('getCashTotal 非数字按 0 处理', () => {
  assert.strictEqual(cashLimit.getCashTotal('abc'), 0);
});

test('isOverLimit 超限返回 true', () => {
  assert.strictEqual(cashLimit.isOverLimit(1300, '1000'), true);
});

test('isOverLimit 等于上限不算超限', () => {
  assert.strictEqual(cashLimit.isOverLimit(1000, '1000'), false);
});

test('isOverLimit 参数为空不触发', () => {
  assert.strictEqual(cashLimit.isOverLimit(9999, ''), false);
});

test('isOverLimit 参数非数字不触发', () => {
  assert.strictEqual(cashLimit.isOverLimit(9999, 'abc'), false);
});

test('isOverLimit 参数为 0 不触发', () => {
  assert.strictEqual(cashLimit.isOverLimit(9999, '0'), false);
});

test('isOverLimit 参数为负数不触发', () => {
  assert.strictEqual(cashLimit.isOverLimit(9999, '-5'), false);
});

test('savePending 写入标记并在 readPending 读回', () => {
  cashLimit.savePending(1300);
  const pending = cashLimit.readPending();
  assert.strictEqual(pending.net, 1300);
  assert.ok(typeof pending.ts === 'number' && pending.ts > 0);
});

test('readPending 无标记返回 null', () => {
  assert.strictEqual(cashLimit.readPending(), null);
});

test('readPending 标记过期返回 null', () => {
  // 手动写入一个 6 分钟前的标记（新鲜度阈值是 5 分钟）
  util.setStorage('CashLimit_Warm', { ts: Date.now() - 6 * 60 * 1000, net: 1300 });
  assert.strictEqual(cashLimit.readPending(), null);
});

test('readPending 刚写入的标记不算过期', () => {
  util.setStorage('CashLimit_Warm', { ts: Date.now() - 60 * 1000, net: 1300 });
  assert.strictEqual(cashLimit.readPending().net, 1300);
});

test('clearPending 清掉标记', () => {
  cashLimit.savePending(1300);
  cashLimit.clearPending();
  assert.strictEqual(cashLimit.readPending(), null);
});

// 注意：本组用例只造 SALE001、不设 FKDA_INFO，走的是 buildWarmSql 里
// "取数失败则跳过不变式校验" 的兜底分支，因此专注于验证 SQL 的格式与字段。
// 含不变式校验的完整路径见文件末尾的「不变式校验」一组。

const SALE1 = {
  SALEDATE: '2026-10-13',
  KHID: 'K200QTD005',
  BILL: 'K200QTD005251013120000',
  BILL_TYPE: 'Z101',
  RYID: 'RY001'
};

test('buildWarmSql 无标记时返回 null', () => {
  assert.strictEqual(cashLimit.buildWarmSql({ SALE001: SALE1 }), null);
});

test('buildWarmSql 正常生成 INSERT 并自带结尾分号', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({ SALE001: SALE1 });
  assert.ok(sql.endsWith(';'), '必须自带结尾分号');
  assert.ok(sql.includes("insert into POS_INFOR_WARM"));
  assert.ok(sql.includes("'K200QTD005'"));
  assert.ok(sql.includes("'K200QTD005251013120000'"));
  assert.ok(sql.includes("'RY001'"));
  assert.ok(sql.includes('1300.000'), 'NET 需归一为三位小数');
  assert.ok(sql.includes("'N'"), 'YN_TX 显式写 N');
  assert.ok(sql.includes("TO_DATE('2026-10-13','yyyy-MM-dd HH24:mi:ss')"));
});

test('buildWarmSql 消费后清掉标记，不会污染下一单', () => {
  cashLimit.savePending(1300);
  cashLimit.buildWarmSql({ SALE001: SALE1 });
  assert.strictEqual(cashLimit.readPending(), null);
  assert.strictEqual(cashLimit.buildWarmSql({ SALE001: SALE1 }), null);
});

test('buildWarmSql 标记过期时不生成', () => {
  util.setStorage('CashLimit_Warm', { ts: Date.now() - 6 * 60 * 1000, net: 1300 });
  assert.strictEqual(cashLimit.buildWarmSql({ SALE001: SALE1 }), null);
});

test('buildWarmSql 赊销结算写 SXJS', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({
    SALE001: SALE1,
    YWSXJS: { BILL: 'SX001' }   // YWSXJS 只在赊销结算模式生成
  });
  assert.ok(sql.includes("'SXJS'"));
  assert.ok(!sql.includes("'Z101'"));
});

test('buildWarmSql 非赊销结算沿用 BILL_TYPE', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({ SALE001: SALE1 });
  assert.ok(sql.includes("'Z101'"));
});

test('buildWarmSql 转义单引号', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({
    SALE001: Object.assign({}, SALE1, { RYID: "RY'O1" })
  });
  assert.ok(sql.includes("'RY''O1'"), '单引号必须转义为两个单引号');
});

test('buildWarmSql 无 SALE001 时清掉标记并返回 NOCASH', () => {
  cashLimit.savePending(1300);
  assert.strictEqual(cashLimit.buildWarmSql({}), 'NOCASH');
  assert.strictEqual(cashLimit.readPending(), null);
});

test('buildWarmSql 无 BILL 时清掉标记并返回 NOCASH（主键不能为空）', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({ SALE001: Object.assign({}, SALE1, { BILL: '' }) });
  assert.strictEqual(sql, 'NOCASH');
  assert.strictEqual(cashLimit.readPending(), null);
});

test('buildWarmSql 无 SALEDATE 时清掉标记并返回 NOCASH（避免 Oracle TO_DATE 报错拖垮上传）', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({ SALE001: Object.assign({}, SALE1, { SALEDATE: '' }) });
  assert.strictEqual(sql, 'NOCASH');
  assert.strictEqual(cashLimit.readPending(), null);
});

test('buildWarmSql SALEDATE 缺失（undefined）同样跳过', () => {
  cashLimit.savePending(1300);
  const s1 = Object.assign({}, SALE1);
  delete s1.SALEDATE;
  assert.strictEqual(cashLimit.buildWarmSql({ SALE001: s1 }), 'NOCASH');
  assert.strictEqual(cashLimit.readPending(), null);
});

// ---- 不变式校验：net 必须等于本单实际落库的现金额 ----

const CASH_FKID = 'ZF01';
const WAYS = [{ fkid: 'ZF01', yn_use: 'Y' }, { fkid: 'WXZF', yn_use: 'Y' }];

// 带 SALE003 的完整 dataObj：SALE1 + 一条现金支付行
const withSale3 = (cashAmt, extra = []) => ({
  SALE001: SALE1,
  SALE003: [{ FKID: CASH_FKID, AMT: cashAmt }].concat(extra)
});

test('现金额与 net 一致时正常生成', () => {
  util.setStorage('FKDA_INFO', [{ FKID: CASH_FKID, MEDIA: '1' }]);
  util.setStorage('PayWayList', WAYS);
  cashLimit.savePending(2000);
  const sql = cashLimit.buildWarmSql(withSale3(2000));
  assert.ok(sql && sql.includes('2000.000'), '应生成并写入 2000.000');
});

test('含找零负数行时按净额校验（正数行 + 负数行 = 实收）', () => {
  util.setStorage('FKDA_INFO', [{ FKID: CASH_FKID, MEDIA: '1' }]);
  util.setStorage('PayWayList', WAYS);
  // 待付 1500、录入 2000、找零 500 -> 实收 1500，net 记的就是 1500
  cashLimit.savePending(1500);
  const sql = cashLimit.buildWarmSql(withSale3(2000, [{ FKID: CASH_FKID, AMT: -500 }]));
  assert.ok(sql, '正数行 2000 + 负数行 -500 = 1500，应匹配 net 并生成');
  assert.ok(sql.includes('1500.000'), 'NET 应写实收 1500');
});

test('若只累加正数行则会误判（回归防护）', () => {
  util.setStorage('FKDA_INFO', [{ FKID: CASH_FKID, MEDIA: '1' }]);
  util.setStorage('PayWayList', WAYS);
  // 同样的数据，但 net 写录入金额 2000 —— 模拟"只算正数行"的旧口径。
  // 这条断言确认新旧算法确实会得出不同结论，说明上一条用例是有区分度的。
  cashLimit.savePending(2000);
  assert.strictEqual(cashLimit.buildWarmSql(withSale3(2000, [{ FKID: CASH_FKID, AMT: -500 }])),
    'NOCASH', '按录入金额写 net 与净额 1500 对不上，应被丢弃');
});

test('net 与现金流不一致时丢弃（防上一单残留标记串单）', () => {
  util.setStorage('FKDA_INFO', [{ FKID: CASH_FKID, MEDIA: '1' }]);
  util.setStorage('PayWayList', WAYS);
  cashLimit.savePending(9999);   // 与 SALE003 的 2000 对不上
  assert.strictEqual(cashLimit.buildWarmSql(withSale3(2000)), 'NOCASH');
  assert.strictEqual(cashLimit.readPending(), null);
});

test('本单无现金支付行时丢弃（已配置失效等）', () => {
  util.setStorage('FKDA_INFO', [{ FKID: CASH_FKID, MEDIA: '1' }]);
  util.setStorage('PayWayList', WAYS);
  cashLimit.savePending(2000);
  assert.strictEqual(cashLimit.buildWarmSql({ SALE001: SALE1, SALE003: [] }), 'NOCASH');
});

test('现金支付方式不可用时丢弃', () => {
  util.setStorage('FKDA_INFO', [{ FKID: CASH_FKID, MEDIA: '1' }]);
  util.setStorage('PayWayList', [{ fkid: 'ZF01', yn_use: 'N' }]);  // 被限制掉
  cashLimit.savePending(2000);
  assert.strictEqual(cashLimit.buildWarmSql(withSale3(2000)), 'NOCASH');
});

test('FKDA_INFO 取不到时跳过不变式校验，仍正常生成', () => {
  util.setStorage('PayWayList', WAYS);   // 故意不设 FKDA_INFO
  cashLimit.savePending(2000);
  const sql = cashLimit.buildWarmSql(withSale3(2000));
  assert.ok(sql && sql.includes('2000.000'), '取数失败不应影响正常记录');
});
