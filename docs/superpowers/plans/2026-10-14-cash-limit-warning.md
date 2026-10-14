# 现金支付超限提示与课长消息记录 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 现金支付超限时弹窗提示收银员，确认支付后向 Oracle 的 `POS_INFOR_WARM` 写入一条课长消息记录。

**Architecture:** 支付页（`Payment.vue`）只负责拦截判断与弹窗，确认后往 storage 写一个 `{ts, net}` 标记；真正的 Oracle INSERT 在 `CreateSaleOrder`（`bll/Common/bll.js`）内部组装并追加进 `OracleSql`，随单据一起进 `POS_TXFILE` 上传。这样 5 个 `CreateSaleOrder` 调用方全部零改动。

**Tech Stack:** uni-app + Vue2（无构建流程，HBuilderX 运行）；纯逻辑抽到 `utils/sale/cashLimit.js`，用 Node 内置 `node:test` 做单元测试（项目原本没有测试框架，本计划引入一套零依赖的最小脚手架）。

**设计文档:** `docs/superpowers/specs/2026-10-14-cash-limit-warning-design.md`

---

## 文件结构

| 文件 | 动作 | 职责 |
|---|---|---|
| `utils/sale/cashLimit.js` | 创建 | 全部纯逻辑：现金判定、金额合计、超限比较、storage 标记读写、Oracle INSERT 组装 |
| `components/CashLimitModal/CashLimitModal.vue` | 创建 | 10s 倒计时弹窗，【确定】倒计时期间置灰、【取消】始终可点 |
| `pages/Payment/Payment.vue` | 修改 | 注册弹窗组件、新增 `CashLimit()` 方法、挂进 `InPaymentBeforeStoped` 的 `Promise.all` |
| `bll/Common/bll.js` | 修改 | `CreateSaleOrder` 内调用 `buildWarmSql` 并把结果追加进 `OracleSql` |
| `tests/cashLimit/loader.mjs` | 创建 | Node loader，把 `@/` 别名解析到仓库根 |
| `tests/cashLimit/register.mjs` | 创建 | 注册上面的 loader |
| `tests/cashLimit/stub-util.mjs` | 创建 | `utils/util.js` 的内存桩，供单测替换 |
| `tests/cashLimit/cashLimit.test.mjs` | 创建 | 单元测试 |
| `manifest.json` | 修改 | 版本号递增（当前 `1.1.144` / `144`） |

**为什么要把逻辑抽到 `cashLimit.js`**：`Payment.vue` 已 2300+ 行，`bll.js` 是核心公共层。把纯函数抽出来既能单测，也让两处调用点都保持轻薄。

---

## Task 1: 搭建零依赖测试脚手架

项目的 `CLAUDE.md` 写明「无测试框架」，且 `cashLimit.js` 会 `import util from '@/utils/util.js'`——那个 `@/` 别名和 `getApp()` 全局在纯 Node 下都跑不了。本任务搭一套 Node 内置 `node:test` + 自定义 loader 的最小脚手架，后续所有纯逻辑任务都靠它验证。

**Files:**
- Create: `tests/cashLimit/stub-util.mjs`
- Create: `tests/cashLimit/loader.mjs`
- Create: `tests/cashLimit/register.mjs`
- Create: `tests/cashLimit/smoke.test.mjs`

- [ ] **Step 1: 创建 `utils/util.js` 的内存桩**

创建 `tests/cashLimit/stub-util.mjs`：

```js
// utils/util.js 的测试桩：只实现 cashLimit.js 用到的那几个方法。
// 用一个模块级对象模拟 storage，测试里可以直接断言它的内容。
const mem = {};

export default {
  getStorage: (k) => (k in mem ? mem[k] : null),
  setStorage: (k, v) => { mem[k] = v; },
  removeStorage: (k) => { delete mem[k]; },
  // 测试辅助：清空内存 store，避免用例之间互相污染
  __reset: () => { Object.keys(mem).forEach(k => delete mem[k]); }
};
```

- [ ] **Step 2: 创建 loader，把 `@/` 别名指到仓库根**

创建 `tests/cashLimit/loader.mjs`：

```js
import { pathToFileURL, fileURLToPath } from 'node:url';

// 用 fileURLToPath 而非 new URL(...).pathname —— 后者在中文路径下会保留 %XX 编码，
// 且 Windows 下会产生 "C:\C:" 这类错误前缀。本仓库路径含中文（D:\SVN项目\IpadPos），
// 用 pathname 必然失败。
const repoRootPath = fileURLToPath(new URL('../../', import.meta.url));
const repoRootUrl = pathToFileURL(repoRootPath).href;

export function resolve(specifier, context, next) {
  // 把 '@/utils/util.js' 换成测试桩
  if (specifier === '@/utils/util.js') {
    return { url: new URL('stub-util.mjs', import.meta.url).href, shortCircuit: true };
  }
  // 其余 '@/xxx' 一律解析到仓库根下的实际文件
  if (specifier.startsWith('@/')) {
    return { url: repoRootUrl + specifier.slice(2), shortCircuit: true };
  }
  return next(specifier, context);
}
```

- [ ] **Step 3: 创建 register，注册 loader**

创建 `tests/cashLimit/register.mjs`：

```js
import { register } from 'node:module';
register('./loader.mjs', import.meta.url);
```

- [ ] **Step 4: 写脚手架冒烟测试**

创建 `tests/cashLimit/smoke.test.mjs`：

```js
import test from 'node:test';
import assert from 'node:assert';
import util from '@/utils/util.js';

test('别名解析到测试桩，storage 读写可用', () => {
  util.setStorage('__smoke', { a: 1 });
  assert.deepStrictEqual(util.getStorage('__smoke'), { a: 1 });
  util.removeStorage('__smoke');
  assert.strictEqual(util.getStorage('__smoke'), null);
});
```

- [ ] **Step 5: 运行测试，确认脚手架可用**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/smoke.test.mjs
```
Expected: PASS，输出 `pass 1` / `fail 0`

- [ ] **Step 6: 提交**

```bash
git add tests/cashLimit/
git commit -m "test: 搭建 cashLimit 零依赖测试脚手架"
```

---

## Task 2: 现金判定与金额合计

**Files:**
- Create: `utils/sale/cashLimit.js`
- Create: `tests/cashLimit/cashLimit.test.mjs`

- [ ] **Step 1: 写失败的测试**

创建 `tests/cashLimit/cashLimit.test.mjs`：

```js
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
```

- [ ] **Step 2: 运行测试确认失败**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```
Expected: FAIL — `Cannot find module .../utils/sale/cashLimit.js`

- [ ] **Step 3: 写最小实现**

创建 `utils/sale/cashLimit.js`：

```js
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
```

- [ ] **Step 4: 运行测试确认通过**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```
Expected: PASS，`pass 14` / `fail 0`

- [ ] **Step 5: 提交**

```bash
git add utils/sale/cashLimit.js tests/cashLimit/cashLimit.test.mjs
git commit -m "feat: 现金超限判定与金额合计"
```

---

## Task 3: Storage 标记的读写与过期

**Files:**
- Modify: `utils/sale/cashLimit.js`
- Modify: `tests/cashLimit/cashLimit.test.mjs`

- [ ] **Step 1: 追加失败的测试**

在 `tests/cashLimit/cashLimit.test.mjs` 末尾追加：

```js
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
```

- [ ] **Step 2: 运行测试确认失败**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```
Expected: FAIL — `cashLimit.savePending is not a function`

- [ ] **Step 3: 写实现**

在 `utils/sale/cashLimit.js` 末尾追加：

```js
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
```

- [ ] **Step 4: 运行测试确认通过**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```
Expected: PASS，`pass 19` / `fail 0`

- [ ] **Step 5: 提交**

```bash
git add utils/sale/cashLimit.js tests/cashLimit/cashLimit.test.mjs
git commit -m "feat: 现金超限 storage 标记读写与过期校验"
```

---

## Task 4: 组装 Oracle INSERT

**Files:**
- Modify: `utils/sale/cashLimit.js`
- Modify: `tests/cashLimit/cashLimit.test.mjs`

- [ ] **Step 1: 追加失败的测试**

在 `tests/cashLimit/cashLimit.test.mjs` 末尾追加：

```js
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

test('buildWarmSql 无 SALEDATE 时清掉标记并返回 null（避免 Oracle TO_DATE 报错拖垮上传）', () => {
  cashLimit.savePending(1300);
  const sql = cashLimit.buildWarmSql({ SALE001: Object.assign({}, SALE1, { SALEDATE: '' }) });
  assert.strictEqual(sql, null);
  assert.strictEqual(cashLimit.readPending(), null);
});

test('buildWarmSql SALEDATE 缺失（undefined）同样跳过', () => {
  cashLimit.savePending(1300);
  const s1 = Object.assign({}, SALE1);
  delete s1.SALEDATE;
  assert.strictEqual(cashLimit.buildWarmSql({ SALE001: s1 }), null);
  assert.strictEqual(cashLimit.readPending(), null);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```
Expected: FAIL — `cashLimit.buildWarmSql is not a function`

- [ ] **Step 3: 写实现**

在 `utils/sale/cashLimit.js` 末尾追加：

```js
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
	if (!sale1) return null;

	// BILL / SALEDATE 同时是 POS_INFOR_WARM 的主键成员，任何一个缺失都会让
	// TO_DATE 或主键约束在 Oracle 侧报错，进而拖垮整张单据的上传，故一并校验。
	// 其余列（BILL_TYPE / RYID）缺失只会插入 null，不会阻断上传，不做校验。
	if (!sale1.BILL || !sale1.SALEDATE) {
		console.warn("[BuildWarmSql]单据信息不完整，跳过超限提醒记录:", {
			BILL: sale1.BILL,
			SALEDATE: sale1.SALEDATE
		});
		return null;
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
```

- [ ] **Step 4: 运行测试确认通过**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```
Expected: PASS，`pass 30` / `fail 0`

- [ ] **Step 5: 提交**

```bash
git add utils/sale/cashLimit.js tests/cashLimit/cashLimit.test.mjs
git commit -m "feat: 组装 POS_INFOR_WARM 的 Oracle INSERT"
```

---

## Task 5: 倒计时弹窗组件

本组件没有可单测的纯逻辑（依赖 uni-app 运行时），靠 Task 8 的真机清单验证。

**Files:**
- Create: `components/CashLimitModal/CashLimitModal.vue`

- [ ] **Step 1: 创建组件**

创建 `components/CashLimitModal/CashLimitModal.vue`。样式与事件机制仿照 `components/CashChangeModal/CashChangeModal.vue`，保持视觉一致：

```vue
<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/message.css);
</style>

<template>
	<view class="cash-limit-box" v-show="visible">
		<view class="cash-limit-contain">
			<view class="cash-limit-head">
				<span>现金支付提示</span>
			</view>
			<view class="cash-limit-content">
				{{ text }}
			</view>
			<view class="cash-limit-countdown" v-if="!unlocked">
				请阅读提示，{{ remain }} 秒后可确认
			</view>
			<view class="cash-limit-btn-groups">
				<button class="btn btn-qx" @click="Cancel">取消</button>
				<button class="btn btn-qr btn-flex" :disabled="!unlocked" :class="{ 'btn-disabled': !unlocked }"
					@click="Confirm">
					{{ unlocked ? '确定' : remain + 's' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			visible: Boolean,
			text: String,
			seconds: {
				type: Number,
				default: 10
			}
		},
		data() {
			return {
				remain: 0,
				unlocked: false,
				timer: null
			}
		},
		watch: {
			visible: function(n) {
				if (n) {
					this.StartCountdown();
				} else {
					this.StopCountdown();
				}
			}
		},
		methods: {
			// 每次打开都从 seconds 重新开始，【确定】重新置灰
			StartCountdown: function() {
				this.StopCountdown();
				this.unlocked = false;
				this.remain = this.seconds;
				this.timer = setInterval(() => {
					this.remain = this.remain - 1;
					if (this.remain <= 0) {
						this.StopCountdown();
						// 倒计时结束只是解锁【确定】，弹窗不关、不自动做任何事
						this.unlocked = true;
						this.remain = 0;
					}
				}, 1000);
			},
			// 必须清定时器，否则弹窗关闭后定时器仍在跑
			StopCountdown: function() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			Confirm() {
				if (!this.unlocked) return; // 倒计时期间【确定】置灰不可点
				this.StopCountdown();
				this.$emit("update:visible", false);
				uni.$emit("cash-limit-confirm");
			},
			Cancel() {
				this.StopCountdown();
				this.$emit("update:visible", false);
				uni.$emit("cash-limit-cancel");
			}
		},
		beforeDestroy() {
			this.StopCountdown();
		}
	}
</script>

<style>
	.cash-limit-box {
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999999;
		top: 0;
		left: 0;
	}

	.cash-limit-head {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 70rpx;
		padding: 0 2%;
		font-size: 32rpx;
		font-weight: bold;
	}

	.cash-limit-contain {
		width: 40%;
		display: flex;
		flex-direction: column;
		background-color: white;
		padding: 5px;
		box-sizing: border-box;
		box-shadow: 0px 3px 40px 1px rgba(66, 177, 75, 0.4);
		border-radius: 10rpx;
	}

	.cash-limit-content {
		flex: 1;
		padding: 50px 10px;
		font-size: 46rpx;
		font-weight: 700;
		text-align: center;
		display: block;
	}

	.cash-limit-countdown {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		padding-bottom: 10rpx;
	}

	.cash-limit-btn-groups {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 4% 0 2%;
	}

	.cash-limit-btn-groups .btn {
		width: 250rpx;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 32rpx;
		margin: 0 30rpx;
	}

	.cash-limit-btn-groups .btn-disabled {
		background-color: #ccc !important;
		color: #fff !important;
		border-color: #ccc !important;
	}
</style>
```

- [ ] **Step 2: 检查组件能被 easycom 自动识别**

`pages.json` 配置了 `easycom` 自动扫描 `components/组件名/组件名.vue`。本组件路径 `components/CashLimitModal/CashLimitModal.vue` 符合该约定，**无需手动注册到 `pages.json`**。

Run:
```bash
cd "D:/SVN项目/IpadPos" && ls components/CashLimitModal/CashLimitModal.vue && grep -n "easycom" -A 8 pages.json
```
Expected: 文件存在；`easycom` 的 `custom` 规则覆盖 `components/` 目录

- [ ] **Step 3: 提交**

```bash
git add components/CashLimitModal/
git commit -m "feat: 现金超限倒计时提示弹窗组件"
```

---

## Task 6: 支付页集成

**Files:**
- Modify: `pages/Payment/Payment.vue`（imports 约 343-365 行、components 384-387 行、data 396-399 行、模板 334-336 行、`InPaymentBeforeStoped` 1595-1608 行）

- [ ] **Step 1: 添加 import**

在 `pages/Payment/Payment.vue` 的 `<script>` 区 import 段落（约 343-365 行，与 `CashChangeModal` 等组件 import 放在一起）加入：

```js
import CashLimitModal from '@/components/CashLimitModal/CashLimitModal.vue';
import * as cashLimit from '@/utils/sale/cashLimit.js';
```

**必须用 `import * as cashLimit`**：`cashLimit.js` 全部是具名导出（`export const xxx`），写成 `import cashLimit from ...` 会得到 `undefined`，运行时才报错。

`util` 已在 `pages/Payment/Payment.vue:362` 以默认导入形式存在（`import util from '@/utils/util.js';`），直接复用，不要重复导入。

- [ ] **Step 2: 注册组件**

修改 `pages/Payment/Payment.vue:384-387`：

```js
		components: {
			uniPopup,
			PrinterPage,
			CashLimitModal
		},
```

- [ ] **Step 3: 添加弹窗状态**

在 `data()` 返回对象里，紧挨现有的 `CashModal`（`pages/Payment/Payment.vue:396-399`）之后加入：

```js
				CashLimitModal: {
					Visible: false,
					Text: "",
					Remain: 10
				},
```

- [ ] **Step 4: 在模板挂载弹窗**

修改 `pages/Payment/Payment.vue:334-336`，在 `CashChangeModal` 之后加入：

```html
		<!-- 现金支付提示弹窗 -->
		<CashChangeModal :visible.sync="CashModal.Visible" :confirm.sync="CashModal.Confirm" :text="CashModal.Text">
		</CashChangeModal>
		<!-- 现金超限提示弹窗 -->
		<CashLimitModal :visible.sync="CashLimitModal.Visible" :text="CashLimitModal.Text" :seconds="10">
		</CashLimitModal>
```

- [ ] **Step 5: 新增 `CashLimit` 方法**

在 `pages/Payment/Payment.vue` 的 `CashChange` 方法（约 1610-1670 行）**之后**、`DisabledPaymentChannel` 之前，插入：

```js
			//终止支付判断条件1.5: 现金支付超限提示（在 CashChange 之后，避免两个弹窗叠加）
			//只有正向支付的现金支付方式才走这里，金额超限时强制收银员阅读风险提示
			CashLimit: async function() {
				if (this.isRefund) return true; //退款是退钱给顾客，不构成赊销风险，直接放行
				console.log("[CashLimit]现金超限判断...", {
					dPayAmount: this.dPayAmount
				});
				// 取现金 FKID 是为了"当前是否现金支付"这个更早、更明确的判断，
				// 避免依赖 currentPayInfo 是否已初始化
				let cash_fkid = cashLimit.getCashFkid();
				if (!cash_fkid) {
					console.log("[CashLimit]未配置现金支付方式(FKDA.MEDIA=1)，跳过");
					return true;
				}
				let my_fkid = this.currentPayInfo?.fkid;
				if (my_fkid != cash_fkid) {
					console.log("[CashLimit]当前不是现金支付:", my_fkid);
					return true; //不是现金不走这个条件
				}
				let cash_total = cashLimit.getCashTotal(this.dPayAmount);
				let limit_value = cashLimit.getCashLimitParam();
				if (!cashLimit.isOverLimit(cash_total, limit_value)) {
					console.log("[CashLimit]未超限:", cash_total, limit_value);
					return true;
				}
				console.warn("[CashLimit]现金支付超限:", {
					cash_total,
					limit_value
				});
				this.CashLimitModal.Text = "现金赊销须三日内存现，如违规使用现金过机系统记录并同步课长";
				this.CashLimitModal.Visible = true;
				var async_callback = new Promise(util.callBind(this, function(resolve, reject) {
					uni.$once("cash-limit-confirm", util.callBind(this, function() {
						console.log("[CashLimit]弹窗点击了确定...");
						resolve(true);
					}));
					uni.$once("cash-limit-cancel", util.callBind(this, function() {
						console.log("[CashLimit]弹窗点击了取消...");
						resolve(false);
					}));
				}));
				let confirmed = await async_callback;
				if (confirmed) {
					// 只写标记，不拼 SQL——单据字段由 CreateSaleOrder 落库时从 dataObj 取
					cashLimit.savePending(cash_total);
				}
				return confirmed; //取消时返回 false，终止本次支付（输入框保留原值）
			},
```

- [ ] **Step 6: 挂进 `InPaymentBeforeStoped`**

修改 `pages/Payment/Payment.vue:1598-1600`：

```js
					let results = (await Promise.all([this.CashChange(), this.CashLimit(), this
						.DisabledPaymentChannel(), this
						.LimitPaymentChannel(), this.ScoreDiscount()
					]));
```

- [ ] **Step 7: 语法自检**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --check <(sed -n '/^<script>/,/^<\/script>/p' pages/Payment/Payment.vue | sed '1d;$d') 2>&1 | head -5 || echo "（.vue 内含 import 语法，node --check 不适用，改由 HBuilderX 运行验证）"
```
Expected: 无输出或提示不适用——`.vue` 文件无法直接用 `node --check`，本步骤仅作粗筛，真正验证在 Task 8

- [ ] **Step 8: 提交**

```bash
git add pages/Payment/Payment.vue
git commit -m "feat: 支付页集成现金超限提示"
```

---

## Task 7: 落库点集成

**Files:**
- Modify: `bll/Common/bll.js`（imports 1-17 行、`CreateSaleOrder` 257-261 行）

- [ ] **Step 1: 添加 import**

在 `bll/Common/bll.js:1-17` 的 import 段落加入：

```js
import * as cashLimit from '@/utils/sale/cashLimit.js';
```

同样用命名空间导入——`cashLimit.js` 是具名导出。

- [ ] **Step 2: 在 `CreateSaleOrder` 内追加 SQL**

修改 `bll/Common/bll.js:258-261`：

```js
		console.log("[CreateSaleOrder]将外部传入sql和生成的sql进行合并...");
		SqliteSql.concat(sqlite_addition_sqls);
		OracleSql += oracle_addition_sqls.join(';');
		// 现金超限提醒记录：支付页确认超限时在 storage 留了标记，此处组装并追加
		let warm_sql = cashLimit.buildWarmSql(dataObj);
		if (warm_sql) {
			OracleSql += warm_sql;
			console.log("[CreateSaleOrder]追加现金超限提醒SQL:", warm_sql);
		}
		console.log("[CreateSaleOrder]循环生成OracleSql：", OracleSql);
```

`buildWarmSql` 自带结尾分号（`CreateSQL` 生成的每条 oracle SQL 也都自带分号），所以这里直接 `+=` 拼接，不经过 `additional.oracle` 的 `join(';')`。

- [ ] **Step 3: 语法自检**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --check bll/Common/bll.js && echo "语法 OK"
```
Expected: `语法 OK`

- [ ] **Step 4: 确认 5 个调用方未被波及**

Run:
```bash
cd "D:/SVN项目/IpadPos" && git status --short bll/Common/bll.js utils/sale/card_coupon.js utils/sale/base_sale.js
```
Expected: 只有 `bll/Common/bll.js` 被修改，`base_sale.js` 和 `card_coupon.js` 未出现在列表中

- [ ] **Step 5: 提交**

```bash
git add bll/Common/bll.js
git commit -m "feat: CreateSaleOrder 内组装现金超限提醒 SQL"
```

---

## Task 8: 版本号递增与真机验证

**Files:**
- Modify: `manifest.json`（`versionName` / `versionCode`）

- [ ] **Step 1: 递增版本号**

修改 `manifest.json`，把 `versionName` 从 `1.1.144` 改为 `1.1.145`，`versionCode` 从 `144` 改为 `145`。

- [ ] **Step 2: 跑全部单测**

Run:
```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```
Expected: PASS，`pass 30` / `fail 0`

- [ ] **Step 3: HBuilderX 运行到真机/模拟器，按清单逐条验证**

| # | 场景 | 预期 |
|---|---|---|
| 1 | `CASHSX` 未配置（`sysParam.CASHSX` 为空） | 不弹窗，支付正常 |
| 2 | 现金金额 ≤ `CASHSX` | 不弹窗，支付正常 |
| 3 | 现金 > `CASHSX`，点【确定】 | 弹窗 → 支付成功 → `POS_TXFILE.TX_SQL` 含 `POS_INFOR_WARM` insert → Oracle 有记录且 `yn_tx='N'` |
| 4 | 现金 > `CASHSX`，点【取消】 | 弹窗关闭 → 支付终止 → **输入框保留原值** → 无 Oracle 记录、无 storage 残留 |
| 5 | 倒数 10s 不操作 | 弹窗不关，【确定】由置灰变为可点，支付仍挂起 |
| 6 | 倒计时期间点【确定】 | 按钮置灰，点不动 |
| 7 | 非现金支付方式 | 完全不触发 |
| 8 | 赊销结算 + 现金超限 | `BILL_TYPE` 写 `SXJS` |
| 9 | 分两次收现金，第二次触发超限 | `NET` 等于整单现金额，**不含重复计数** |
| 10 | 现金含找零 | 找零负数记录不计入合计 |
| 11 | 退款（Z151）现金超限 | **不触发**，直接放行 |
| 12 | 售卡（CardSale）+ 现金超限 | 触发，`BILL_TYPE` 写 `Z111`，Oracle 有记录 |
| 13 | 售券（CouponSale）+ 现金超限 | 触发，`BILL_TYPE` 写 `Z111`，Oracle 有记录 |
| 14 | 卡券激活失败（`YN_OK='F'`）+ 现金超限 | **仍然记录**（只要现金过机就记） |
| 15 | 超限确认后支付中断，下一单正常支付 | 下一单**不**被误记（标记已清理 / 已过期） |
| 16 | 赊销售卡（`BILL_TYPE='Z112'`）+ 现金超限 | `BILL_TYPE` 写 `Z112` |
| 17 | 对比 Oracle 上 `SALE001.SALEDATE` 与 `POS_INFOR_WARM.SALEDATE` | 两者完全相同（预期均为 `2026-10-13 00:00:00`） |

日志过滤关键字：`[CashLimit]`、`[CreateSaleOrder]追加现金超限提醒SQL`。

- [ ] **Step 4: 提交**

```bash
git add manifest.json
git commit -m "chore: 版本号递增至 1.1.145"
```

---

## 完成标准

- 全部 30 个单测通过
- Task 8 的 17 条真机场景全部符合预期
- `utils/sale/base_sale.js` 与 `utils/sale/card_coupon.js` **未被修改**（5 个调用方零改动）
- Oracle 中 `POS_INFOR_WARM` 出现记录且 `yn_tx='N'`

---

## 附：测试运行说明

**统一命令：**

```bash
cd "D:/SVN项目/IpadPos" && node --import ./tests/cashLimit/register.mjs --test tests/cashLimit/cashLimit.test.mjs
```

**已验证可行**：本计划中 `cashLimit.js` 与 `cashLimit.test.mjs` 的完整代码已在本仓库实际跑通，结果 `pass 30 / fail 0`。

**已知无害警告**：首次运行会打印

```
Warning: Module type of file:///D:/SVN项目/IpadPos/utils/sale/cashLimit.js is not specified...
To eliminate this warning, add "type": "module" to package.json
```

**不要按提示加 `type: module`**。仓库根目录的 `package.json` 是 `DomVideoPlayer` 插件（`video-player`）的清单，加了 `type: module` 会破坏该插件的加载。此警告仅影响性能提示，可忽略。

**为什么需要 loader**：`cashLimit.js` 用 `@/utils/util.js` 这个 uni-app 别名导入，纯 Node 解析不了。`tests/cashLimit/loader.mjs` 把 `@/` 映射到仓库根，并把 `@/utils/util.js` 换成内存桩 `stub-util.mjs`（因为真实 `util.js` 依赖 `getApp()` 全局，在 Node 下不可用）。

**该脚手架不影响正式打包**：`tests/` 目录不被 uni-app 引用，HBuilderX 打包时不会包含。
