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

test('getCashTotal 累加本次输入与本单已录现金', () => {
  const payList = [
    { fkid: 'ZF01', amount: 500 },
    { fkid: 'WXZF', amount: 300 }
  ];
  // 500（已录现金）+ 800（本次输入）= 1300，微信的 300 不计
  assert.strictEqual(cashLimit.getCashTotal(payList, 800, 'ZF01'), 1300);
});

test('getCashTotal 过滤找零的负数记录', () => {
  const payList = [
    { fkid: 'ZF01', amount: 2000 },
    { fkid: 'ZF01', amount: -500 } // 找零
  ];
  // 只算 2000，找零不算，再加本次 0
  assert.strictEqual(cashLimit.getCashTotal(payList, 0, 'ZF01'), 2000);
});

test('getCashTotal 空 PayList 只算本次输入', () => {
  assert.strictEqual(cashLimit.getCashTotal([], 600, 'ZF01'), 600);
});

test('getCashTotal PayList 为 null 不炸', () => {
  assert.strictEqual(cashLimit.getCashTotal(null, 600, 'ZF01'), 600);
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
