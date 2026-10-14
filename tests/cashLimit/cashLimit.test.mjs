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

test('getCashTotal 直接返回 dPayAmount（整单待付余额）', () => {
  // dPayAmount 是全单余额，已包含本单此前的现金额，不能再累加 PayList
  assert.strictEqual(cashLimit.getCashTotal(1300), 1300);
});

test('getCashTotal 字符串数字也能处理', () => {
  assert.strictEqual(cashLimit.getCashTotal('1300.50'), 1300.5);
});

test('getCashTotal undefined / null / 空串按 0 处理', () => {
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

test('buildWarmSql 无 SALE001 时清掉标记并返回 null', () => {
  cashLimit.savePending(1300);
  assert.strictEqual(cashLimit.buildWarmSql({}), null);
  assert.strictEqual(cashLimit.readPending(), null);
});

test('buildWarmSql 无 BILL 时清掉标记并返回 null（主键不能为空）', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({ SALE001: Object.assign({}, SALE1, { BILL: '' }) });
  assert.strictEqual(sql, null);
  assert.strictEqual(cashLimit.readPending(), null);
});
