// CashChange 弹窗编排的单元测试。
//
// CashChange 定义在 pages/Payment/Payment.vue 里、依赖 uni-app 运行时，无法直接 import。
// 这里在运行时把它（以及它依赖的两个等待方法）从 .vue 源码里抽出来，
// 挂到一个假实例上驱动。好处是测的是**页面里的真实代码**，
// 而不是复制一份到测试里——复制的副本会漂移。
//
// 规则（需求原文）：
//   超额 + 找零 ≤ 100 -> 只弹超限框；点确定继续支付并写标记（落库时记消息表），
//                        点取消终止。
//   超额 + 找零 > 100 -> 只弹超限框，文案里一并说明找零超百，只留一个【确定】
//                        （ShowCancel=false）；无论点什么都终止且不写标记。
//   未超额 -> 只弹原有的现金/找零确认框（超限逻辑完全不介入）；
//             但找零 > 100 仍然是输入有误，弹拦截框并终止。
// 即：任何时候都只弹**一个**弹窗。
import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const vueSrc = fs.readFileSync(path.join(repoRoot, 'pages/Payment/Payment.vue'), 'utf8')
  .replace(/\r\n/g, '\n');

// 从 .vue 源码里抽出一个方法的方法体。
//
// 不能用 "name:" 直接 indexOf——源码里到处是 console.log("[CashChange]...") 这类
// 日志前缀，会先命中注释/字符串。必须要求「行首 + 恰好 3 个 tab 缩进 + name:」
// 才是真正的方法定义，再按花括号配平截取，避免被嵌套的 } 提前截断。
const extractMethod = (name, kind = '') => {
  const decl = '\n\t\t\t' + name + ': ' + kind + 'function() {';
  const at = vueSrc.indexOf(decl);
  if (at < 0) throw new Error('在 Payment.vue 里找不到方法定义 ' + name + '，源码结构可能已变化');
  const open = at + decl.length - 1;   // 指向 '{'
  let depth = 0;
  for (let i = open; i < vueSrc.length; i++) {
    if (vueSrc[i] === '{') depth++;
    else if (vueSrc[i] === '}') {
      depth--;
      if (depth === 0) return vueSrc.slice(open + 1, i);
    }
  }
  throw new Error('方法 ' + name + ' 的大括号未闭合');
};

const WAIT_LIMIT_BODY = extractMethod('WaitCashLimitConfirm');
const WAIT_CASH_BODY = extractMethod('WaitCashModalConfirm');
const CASH_BODY = extractMethod('CashChange', 'async ');
const cashFn = new Function('return async function(){' + CASH_BODY + '}')();

let saved = null;

globalThis.util = {
  callBind: (ctx, fn) => fn.bind(ctx),
  getStorage: (k) => (k === 'FKDA_INFO' ? [{ FKID: 'ZF01', MEDIA: '1' }] : null)
};
globalThis.cashLimit = {
  getCashTotal: (a) => Number(a) || 0,
  getCashLimitParam: () => '1000',
  isOverLimit: (total, param) => {
    const n = Number(param);
    return !isNaN(n) && n > 0 && Number(total) > n;
  },
  savePending: (n) => { saved = n; },
  clearPending: () => {}
};

function makeInstance(o) {
  const inst = {
    dPayAmount: o.pay,
    allAmount: o.debt,
    isRefund: !!o.refund,
    currentPayInfo: { fkid: o.fkid || 'ZF01' },
    PayList: [],
    shown: [],
    CashModal: { Text: '', Visible: false },
    CashLimitInfo: { Text: '', Visible: false, ShowCancel: true },
    // 与页面实现保持一致：dPayAmount - allAmount
    CountCashChange() { return Number(this.dPayAmount) - Number(this.allAmount); }
  };
  inst.WaitCashLimitConfirm = new Function('return function(){' + WAIT_LIMIT_BODY + '}')();
  inst.WaitCashModalConfirm = new Function('return function(){' + WAIT_CASH_BODY + '}')();
  // 记录每个弹窗"被打开"的顺序（Visible 置 true 时记一笔）
  for (const [key, tag] of [['CashModal', 'C'], ['CashLimitInfo', 'L']]) {
    let v = false;
    Object.defineProperty(inst[key], 'Visible', {
      get: () => v,
      set: (nv) => { if (nv) inst.shown.push(tag); v = nv; }
    });
  }
  return inst;
}

// confirm: 用户在（唯一的那个）弹窗上点的按钮，true=确定 false=取消
async function run(o, confirm = true) {
  saved = null;
  const inst = makeInstance(o);
  const realLog = console.log;
  console.log = () => {};
  globalThis.uni = {
    $once: (name, cb) => {
      // 只让用户真正点的那个按钮回调
      if (confirm === name.endsWith('-confirm')) setTimeout(cb, 0);
    }
  };
  let result;
  try {
    result = await cashFn.call(inst);
  } finally {
    console.log = realLog;
  }
  return {
    result,
    shown: inst.shown.slice(),
    saved,
    cashText: inst.CashModal.Text,
    limitText: inst.CashLimitInfo.Text,
    showCancel: inst.CashLimitInfo.ShowCancel
  };
}

// ---------- 超额 + 找零 ≤ 100：确定继续支付并记消息，取消终止 ----------

test('超额且无找零：只弹超限框，点确定继续支付并写标记', async () => {
  const r = await run({ pay: 1500, debt: 1500 }, true);
  assert.deepStrictEqual(r.shown, ['L'], '只应弹出超限框');
  assert.strictEqual(r.showCancel, true, '无找零应保留【取消】按钮');
  assert.ok(!r.limitText.includes('找零'), '无找零时提示里不应出现找零字样');
  assert.strictEqual(r.saved, 1500, '应写入标记 1500（落库时记入消息表）');
  assert.strictEqual(r.result, true, '点确定应继续支付');
});

test('超额且有找零(≤100)：只弹超限框，带出找零金额，点确定继续支付并写标记', async () => {
  const r = await run({ pay: 1050, debt: 1000 }, true);
  assert.deepStrictEqual(r.shown, ['L'], '不应再弹现金确认框');
  assert.ok(r.limitText.includes('需找零 50.00'), '提示里应带出找零金额');
  assert.strictEqual(r.showCancel, true, '找零≤100 应保留【取消】按钮');
  assert.strictEqual(r.saved, 1050, '应写入标记 1050');
  assert.strictEqual(r.result, true, '点确定应继续支付');
});

test('超额且找零≤100：点取消终止且不写标记', async () => {
  const r = await run({ pay: 1050, debt: 1000 }, false);
  assert.deepStrictEqual(r.shown, ['L']);
  assert.strictEqual(r.saved, null, '取消不应写标记');
  assert.strictEqual(r.result, false, '应终止支付');
});

// ---------- 超额 + 找零 > 100：终止且不记消息 ----------

test('超额 + 找零>100：只弹超限框，只留一个确定按钮，且终止', async () => {
  const r = await run({ pay: 1200, debt: 1000 }, true);   // cash_total=1200>1000, change=200
  assert.deepStrictEqual(r.shown, ['L'], '只应弹超限框，不应再弹找零拦截框');
  assert.ok(r.limitText.includes('已超过 100 元'), '提示里应说明找零超百');
  assert.ok(r.limitText.includes('200.00'), '提示里应带出找零金额');
  assert.strictEqual(r.showCancel, false, '找零>100 只留一个确定按钮');
  assert.strictEqual(r.saved, null, '不应写标记');
  assert.strictEqual(r.result, false, '应终止支付');
});

test('超额 + 找零>100：点确定也终止（唯一按钮）', async () => {
  const r = await run({ pay: 1200, debt: 1000 }, true);
  assert.strictEqual(r.result, false);
  assert.strictEqual(r.saved, null);
});

// ---------- 未超额：走原有现金框 ----------

test('未超额且有找零：只弹找零框，超限逻辑完全不介入', async () => {
  const r = await run({ pay: 950, debt: 900 }, true);
  assert.deepStrictEqual(r.shown, ['C'], '未超额不应弹超限框');
  assert.ok(r.cashText.includes('现金支付 950 元，需找零 50.00 元'));
  assert.strictEqual(r.saved, null, '未超额不应写标记');
  assert.strictEqual(r.result, true, '应放行');
});

test('未超额且无找零：只弹现金确认框', async () => {
  const r = await run({ pay: 900, debt: 900 }, true);
  assert.deepStrictEqual(r.shown, ['C']);
  assert.ok(r.cashText.includes('现金支付 900 元，是否确认支付？'));
  assert.strictEqual(r.saved, null);
  assert.strictEqual(r.result, true);
});

test('未超额且点取消：终止支付', async () => {
  const r = await run({ pay: 900, debt: 900 }, false);
  assert.strictEqual(r.result, false);
});

test('边界：正好等于 CASHSX 不算超额，走普通现金框', async () => {
  const r = await run({ pay: 1000, debt: 900 }, true);    // cash_total=1000, 不 >1000
  assert.deepStrictEqual(r.shown, ['C'], '未超限应走普通现金框');
  assert.ok(r.cashText.includes('需找零 100.00'));
  assert.strictEqual(r.saved, null, '未超限不应写标记');
});

// ---------- 未超额 + 找零>100：仍是输入有误 ----------

test('未超额 + 找零超百：弹拦截框并终止', async () => {
  // 要 cash_total ≤ 1000（未超额）但 change > 100
  // pay - debt = change > 100 且 pay <= 1000  =>  debt < 900
  const r = await run({ pay: 1000, debt: 800 }, true);    // change=200, cash_total=1000 不超额
  assert.deepStrictEqual(r.shown, ['C'], '未超额但找零超百应弹拦截框');
  assert.ok(r.cashText.includes('找零金额超过100'), '应为拦截文案');
  assert.strictEqual(r.result, false, '应终止支付');
  assert.strictEqual(r.saved, null);
});

// ---------- 非现金 / 退款 ----------

test('非现金支付：不弹任何框，直接放行', async () => {
  const r = await run({ pay: 2000, debt: 1500, fkid: 'WXZF' }, true);
  assert.deepStrictEqual(r.shown, []);
  assert.strictEqual(r.result, true);
});

test('退款：不弹任何框，直接放行', async () => {
  const r = await run({ pay: 2000, debt: 1500, refund: true }, true);
  assert.deepStrictEqual(r.shown, []);
  assert.strictEqual(r.result, true);
});
