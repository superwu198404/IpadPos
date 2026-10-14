# 现金支付超限提示与课长消息记录 — 设计文档

日期：2026-10-14
状态：待评审

## 背景与目标

门店现金过机存在赊销风险：收银员用现金收款后不按时存现，形成账外资金占用。现需要：

1. 当用户以**现金**支付且**本单现金合计超过参数上限**时，弹出提示，告知"现金赊销须三日内存现，如违规使用现金过机系统记录并同步课长"。
2. 每次发生超限且用户确认支付，向后台写入一条消息记录，供门店课长接收。

## 核心设计思路

**支付页只写一个标记，SQL 在 `CreateSaleOrder` 内部现场组装。**

```
Payment.vue 确认超限
  └─ setStorage("CashLimit_Warm", { ts, net })     ← 只写标记 + 金额

  ... 用户离开支付页，单据在上层页面收尾 ...

CreateSaleOrder(dataObj)   ← 所有落库路径的唯一入口
  ├─ 遍历 dataObj 生成业务 SQL
  ├─ 读标记 → 新鲜则从 dataObj.SALE001 取单据字段 → 拼 INSERT
  │          → OracleSql += 它 → 清掉标记
  └─ TX_SQL: OracleSql 一起进 POS_TXFILE 上传
```

这个形态的关键收益：**所有调用方零改动**。`base_sale.js`、`card_coupon.js` 的 5 个 `CreateSaleOrder` 调用点照常调用，表自动多一条。

## 为什么不用其他方案

### 不在支付页写表

两个硬性阻断：

**阻断一：支付时拿不到单号。**

- `sale1_obj.BILL` 为空才触发"创建新单"（[base_sale.js:4049](utils/sale/base_sale.js:4049) `createNewBill(e)`）
- 这是 `GetSale` 类的方法，而 **Payment.vue 完全不 import `base_sale`**（全文件无引用）
- Payment.vue 自己的 `CreateDBData` 已是空壳（[Payment.vue:841-853](pages/Payment/Payment.vue:841) 只调 `SaleDataCombine()` 就返回），[Payment.vue:1401](pages/Payment/Payment.vue:1401) 注释明写"后续处理转移到销售页面处理"——**支付页自己写队列的能力是被有意移除的**

**阻断二（更根本）：`POS_INFOR_WARM` 主键指向单据，无法独立上传。**

主键是 `(SALEDATE, KHID, BILL)`。若支付页先上传自己的行：

- Oracle 出现指向**不存在单据**的记录
- 单据上传失败或收银员退出 → 永久孤儿行，主键冲突导致**永远无法修正**

### 不在各调用方传 `additional`

原方案要在 `base_sale.js` + `card_coupon.js` 的 5 个 `CreateSaleOrder` 调用点分别传 `additional.oracle`。

放弃原因是**漏改风险已经实际发生过**：分析中发现售卡走 `GiftCard_Active`（[card_coupon.js:402](utils/sale/card_coupon.js:402)）、售券走 `GiftCoupon_Active`（[card_coupon.js:484](utils/sale/card_coupon.js:484)），这两处恰恰是本需求最关心的路径，最初被漏掉了。

改在 `CreateSaleOrder` 内部实现后，这类漏改在结构上不可能发生。

## 范围

改动落在两处：

1. `pages/Payment/Payment.vue` —— 拦截、弹窗、写标记
2. `bll/Common/bll.js` —— `CreateSaleOrder` 内生成并追加 INSERT

覆盖业务：所有进入支付页的正向支付（见"全链路覆盖分析"）。

**退款不触发**（`Z151` / `Z152` 等）：在 `CashLimit` 开头用 `isRefund` 短路，支付页不写标记，`CreateSaleOrder` 自然无标记可消费。

不改动的部分：
- 服务端 `ExecuteBatchSQL` 接收逻辑不变
- 本地 SQLite **不建** `POS_INFOR_WARM` 表，该表只在 Oracle 侧存在
- 不新增上传队列，复用 `POS_TXFILE`
- **5 个 `CreateSaleOrder` 调用方全部零改动**

## 全链路覆盖分析

口径：所有进入支付页的正向支付（`actType == Payment`），只要发生现金超限就记录。

### 支付页入口枚举

全项目 `navigateTo` 到 `/pages/Payment/Payment` 共 6 处：

| # | 入口 | 触发方 | 性质 | 结论 |
|---|---|---|---|---|
| 1 | `base_sale.js:3951` | `PayParamAssemble` | **主路径**。销售 / 预订 / 预订提取 / 预订取消 / 赊销 / 赊销结算 / 外卖 / 外卖预定 / 线上单 / 线上提取 / 裱花预定 | 覆盖 |
| 2 | `card_coupon.js:674` | `RedirectToPayment` | 售券（`CouponSale.vue:901`） | 覆盖 |
| 3 | `card_sale.js:46` | `PayParamAssemble` | 售卡（`CardSale.vue:789`、`CardActive.vue:788`） | 覆盖 |
| 4 | `CouponExchange.vue:678` | 页面内联 | 礼品券兑换 | 覆盖 |
| 5 | `index.vue:487` | `MenuPage(0)` | 调试页，**不可达** | 排除 |
| 6 | `hyinfo/index.vue:205` | `couponUse` | 孤岛页，参数失效 | 排除 |

因为本方案的写入点在 `CreateSaleOrder` 内部，1~4 **自动全覆盖**，不需要逐个适配。

**入口 5（`pages/index/index.vue`）是调试页**，三条独立证据：

- 「开始结算」按钮（`index.vue:115`）所在区块包在 `<view v-if="false">`（`index.vue:52`）里，**UI 上永不可点**
- `_DataAssembleSaveForGlobal`（`index.vue:745`）里是 2022 年硬编码样例数据（`BILL: "2298840210"`、`KHID: "K200QTD005"`、商品 `"爱心莓"` 等），且在 `index.vue:482` 把 `SaleBaseInit()` 组装的真数据覆盖掉
- `FinishOrder` 回调（`index.vue:488-493`）为空，**不调 `CreateSaleOrder`、不落库**

该页本身是运维调试页（SQL 调试框、切换门店、连接调试按钮）。

**入口 6（`pages/hyinfo/index.vue`）是坏的**：`?lqid=xxx` 在 `Payment.vue` 中**零消费**——`onLoad(option)`（[Payment.vue:653](pages/Payment/Payment.vue:653)）声明了 `option` 却从不引用，支付页数据只从 `$store.state.location` 取。该页自身也几乎无可达入口（`index.vue:497` 指向它的跳转已注释）。

券的真实入口是支付页**内部**的 `CouponToUse`（[Payment.vue:2350](pages/Payment/Payment.vue:2350)，按钮在 `Payment.vue:259`），本来就在支付页内，天然覆盖。

### 落库点枚举

**`CreateSaleOrder` 有 5 个调用方，本方案下全部零改动：**

| 调用方 | 位置 | 覆盖的业务 |
|---|---|---|
| `base_sale.js:3841` | `GetSale.PayedResult` | 入口 1 的全部模式 |
| `card_coupon.js:153` | `VIPCard_Active.Completed` | 售卡（VIP 售卡充值） |
| `card_coupon.js:280` | `VIPCard_Recharge.Completed` | VIP 卡充值 |
| `card_coupon.js:402` | `GiftCard_Active.Completed` | 礼品卡激活 |
| `card_coupon.js:484` | `GiftCoupon_Active.Completed` | 礼品券激活 |

### 退款入口

`RefundOrder.vue:388` 和 `Reserve.vue:364/380` 跳的是 `../Payment/PaymentAll`（**另一个页面**，非本次范围）。销售侧退款走 `sale_return_good` → `base_sale.js:3951` 进同一支付页，但 `actType == Refund`，由 `isRefund` 短路排除。

### 现金可见性分析

**`sale`（普通销售）在促销/手工折扣下会全额禁用支付方式（含现金）。**

`POSCS='TSDISC'` 白名单在 [base_sale.js:136-138](utils/sale/base_sale.js:136) 的条件是"特殊折扣"：

```js
if (this.sale001.TBZDISC > 0 || this.sale001.TLSDISC > 0 || this.sale001.TTPDISC > 0)
```

但 [base_sale.js:4654-4663](utils/sale/base_sale.js:4654) 的 `BanPayType()` 无参分支更狠：

```js
} else { //特殊折扣只允许 这两种支付方式
    let arr = PayWayList.filter(r => r.type != "WXZF" && r.type != "TL");
    this.ban_type = arr.map(r => r.fkid);   // 除微信、银联外全部禁用 —— 含现金
}
```

触发条件见 [base_sale.js:4563-4565](utils/sale/base_sale.js:4563)：`this.Disc.cval.ZKType && this.Disc.cval.ZKType != "NO"`（选了手工折扣类型）。

**此时现金被禁，收银员根本选不到，超限逻辑不会触发。促销和手工折扣是日常高频操作**，因此普通销售单触发本功能的概率可能低于预期。

其余入口的限制：

| 模式 | 现金限制 | 现金可用 |
|---|---|---|
| `sale` 普通销售 | `Pres` 促销 / `Disc` 手工折扣生效时**全额禁用**（仅留微信、银联） | 仅无促销且无手工折扣时 |
| `sale_reserve` 预订 | 同上（`base_sale.js:460/464`） | 同上 |
| `sale_reserve_extract` 预订提取 | 同上 + `ydnotfk` 模式配置（`685`）+ 特殊折扣禁止（`701`） | 视配置 |
| `sale_credit` 赊销 | 无付款黑名单（`base_sale.js:1434` 置空） | 可用 |
| `sale_credit_settlement` 赊销结算 | `XSJSFKID` 白名单，**仅当 `BILLDISC != 0` 时生效**；无折扣时反而不限制（`base_sale.js:1524-1533`） | 视参数与折扣 |
| 售卡售券 | `SKSQFKID` 白名单（`card_sale.js:28`） | 视参数 |
| 礼品券兑换 | 无（`CouponExchange.vue:665-675` 传空 `ban_pay`） | 可用 |

**`TSDISC` / `ydnotfk` / `XSJSFKID` / `SKSQFKID` 这些白名单都已确认包含现金 FKID**，因此限制生效时现金会显示为**不可用**，收银员选不到现金，自然不会触发本功能。

这是期望行为——限制支付即禁用现金时，本功能无从触发。**不需要为这些场景做任何额外处理。**

### `actType` 的一致性

`isRefund` 默认 `true`（[Payment.vue:416](pages/Payment/Payment.vue:416)），由 [paramInit:2073](pages/Payment/Payment.vue:2073) 按 `prev_page_param.actType == common.actTypeEnum.Payment` 显式置 `false`。

四个入口传值：入口 1 传 `that.actType`（`base_sale.js:3944`）；入口 3 硬编码 `"Payment"`（`card_sale.js:38`）；入口 4 硬编码 `"Payment"`（`CouponExchange.vue:672`）；入口 2 传 `'Payment'`（`CouponSale.vue:906`）。**全部正确，`isRefund` 不会误判。**

## 新增参数

| 项 | 值 |
|---|---|
| POSCS | `CASHSX` |
| POSCSNR | 现金上限，单位为**元** |

**读取方式：取 `sysParam` 缓存的 `CASHSX` 值。** `sysParam` 由 [sysParm.js:82-103](utils/sysParm/sysParm.js:82) 的 `getSysParam` 在初始化时从 `POSCSZMX` + `DAPZCS_NR` 拉取并持久化，键为 POSCS、值为 POSCSNR。

容错：参数未配置或解析为 `NaN` 时按 `0` 处理，**不触发**提示。本功能属业务管控，不应因参数缺失阻塞收银。

### 全局付款方式黑名单

`utils/sysParm/sysParm.js:19` 定义了 `POSCS='KHBZCDFKFS'`（"不支持的付款方式"），但**全项目没有任何代码消费它**。本方案不需要处理，但要意识到：目前没有任何全局开关能禁用现金。

## 术语与口径

| 术语 | 定义 |
|---|---|
| 现金支付方式 | `util.getStorage("FKDA_INFO")` 中 `MEDIA == '1'` 的记录的 `FKID` |
| 本单现金合计 | 已录现金 + 本次输入 |
| 已录现金 | `PayList` 中 `fkid == 现金FKID` 且 `amount > 0` 的行的 `amount` 之和 |
| 本次输入 | 输入框绑定的 `dPayAmount` |
| 超限 | 本单现金合计 > `CASHSX` 参数值，且 `CASHSX` 解析为数字后 > 0 |

### 为什么已录现金要过滤 `amount > 0`

`CheckCashPayment`（[Payment.vue:1936](pages/Payment/Payment.vue:1936)）会把找零写成一条负数 `amount` 的记录。按"不含找零的录入金额合计"口径（已确认），过滤掉负数行即可。

### 关于 `MEDIA` 字段名

需求原文写 `FKDA.MEIDA=1`，实际字段名为 `MEDIA`（[init.js:235](api/business/init.js:235) 的 `SELECT FKID,SNAME,JKSNAME,MEDIA FROM FKDA`）。实现以 `MEDIA` 为准。

### 关于 `FKID='ZF01'`

需求原文写 `FKID='ZF01'`。`ZF01` 在本项目中**不是现金**：

- [Payment.vue:1286](pages/Payment/Payment.vue:1286) 把它列为"跳过接口调用"的白名单成员
- [Refund.vue:64](pages/Refund/Refund.vue:64) 把它当作支付宝的本地假数据

全项目判定现金的统一方式是 `MEDIA == '1'`。实现采用后者，不硬编码 `ZF01`。

## 交互设计

### 触发位置

在 `InPaymentBeforeStoped`（[Payment.vue:1595](pages/Payment/Payment.vue:1595)）的 `Promise.all` 数组中，排在 `CashChange` 之后新增 `this.CashLimit()`。

顺序必须在 `CashChange` 之后：先让用户确认找零金额无误，再做超限管控，避免两个弹窗叠加。

### 弹窗

新建 `components/CashLimitModal/CashLimitModal.vue`，样式与事件机制仿照 [CashChangeModal](components/CashChangeModal/CashChangeModal.vue)（`uni.$emit` 派发事件，父页面 `uni.$once` + Promise 封装成可 `await` 的交互）。

不复用 `CashChangeModal` 的原因：现有组件按钮是【取消 / 确认】，而本需求是【确定 / 取消】，且**取消的语义相反**——`CashChangeModal` 的取消是"这一笔先不支付"，本需求是"终止本次支付"。混用会污染每天在用的找零确认逻辑。

提示文案（固定）：

> 现金赊销须三日内存现，如违规使用现金过机系统记录并同步课长

### 状态机

弹窗有两个状态：`countdown`（倒计时中）与 `awaitUser`（等待用户决策）。进入弹窗即处于 `countdown`，10 秒。

| 事件 | 触发时机 | 行为 |
|---|---|---|
| 倒计时结束 | `countdown` 态下 10s 走完 | 切换为 `awaitUser` 态。【确定】由置灰变为可点。弹窗不关闭，不自动支付 |
| 点【确定】 | **仅 `awaitUser` 态可用** | 停止倒计时 → 关闭弹窗 → 返回 `true` → 支付继续 → 写 storage 标记 |
| 点【取消】 | 两个状态都可用 | 停止倒计时 → 关闭弹窗 → 返回 `false` → 支付终止 → **保留输入框原值，不清空** |

**【确定】在倒计时期间置灰不可点**，这是本功能的核心约束：10 秒内用户唯一能做的操作是【取消】或等待，强制收银员至少看完 10 秒风险提示。

支付流程在弹窗期间挂起（`await` 在 `Promise.all` 里），不设额外超时。

### 多次触发

用户点【取消】后，`PayList` 未变化，**输入框保留原值**。用户可直接改金额或再次点支付，若仍超限会再次弹窗。

保留输入值是有意为之：收银员往往只需微调金额降到上限以下，清空会强迫重输。

## 数据设计

### Oracle 表（服务端已存在）

```sql
create table POS_INFOR_WARM(
  saledate  date,
  khid      varchar2(30),
  bill      varchar2(30),
  bill_type varchar2(30),
  ryid      varchar2(30),
  net       number(12,3),
  yn_tx     varchar2(1) default 'N',
  constraint POS_INFOR_WARM_KEY primary key (SALEDATE,KHID,BILL)
) tablespace md;

create index IN_POS_INFOR_WARM_tx on POS_INFOR_WARM (yn_tx,saledate,khid,bill) tablespace md;
```

`yn_tx` 是消息**发送**标记（给课长发了没有），不是上传标记。客户端写入时显式给 `'N'`。

### 字段来源

| 列 | 来源 | 说明 |
|---|---|---|
| `SALEDATE` | `dataObj.SALE001.SALEDATE` | 在 `CreateSaleOrder` 内取，**与 Oracle 侧 SALE001 是同一次拼装的同一份数据**，物理上不可能不一致 |
| `KHID` | `dataObj.SALE001.KHID` | 同上 |
| `BILL` | `dataObj.SALE001.BILL` | 同上 |
| `BILL_TYPE` | `dataObj.SALE001.BILL_TYPE`，赊销结算覆盖为 `SXJS` | 见下 |
| `RYID` | `dataObj.SALE001.RYID` | 同上 |
| `NET` | storage 标记里的 `net` | **必须来自支付页**，理由见下 |
| `YN_TX` | 常量 `'N'` | |

### 为什么 `NET` 必须在支付页存，不能从 `SALE003` 重算

落库时的 `SALE003` **已被改写**，不再是支付当时的过机记录：

- [base_sale.js:312](utils/sale/base_sale.js:312) `CombineCouponAndNoOrginPay(this.sale003)` 合并券与无原单支付
- [base_sale.js:483](utils/sale/base_sale.js:483) `this.sale003 = this.sale003.filter(s3 => !(s3.FKID === cash_info.FKID && Number(s3.AMT) === 0))` 过滤掉现金为 0 的记录

这些改写发生在 `SaleFinishing` 阶段。从改写后的数据重算，得到的是"落库口径"而非"过机口径"，与需求的"不含找零的录入金额合计"不符。

因此支付页在确认时必须把 `net` 存下来。

## SQL 拼装

### 追加位置

`bll/Common/bll.js` 的 `CreateSaleOrder`，在业务 SQL 循环之后、构造 `tx_obj` 之前（[bll.js:257-263](bll/Common/bll.js:257) 之间）：

```js
// 循环结束，OracleSql 已累积全部业务 SQL
let warm_sql = cashLimit.buildWarmSql(dataObj.SALE001);   // 读 storage + 拼 INSERT + 清标记
if (warm_sql) OracleSql += warm_sql;

let tx_obj = { TX_SQL: OracleSql, ... };   // 一起进 POS_TXFILE
```

`dataObj.SALE001` 此刻已是最终形态（循环内已补 `XSPTID = "PAD"`），字段全部就绪。

### 语句格式

```sql
insert into POS_INFOR_WARM (SALEDATE,KHID,BILL,BILL_TYPE,RYID,NET,YN_TX)
values(TO_DATE('<saledate>','yyyy-MM-dd HH24:mi:ss'),'<khid>','<bill>','<bill_type>','<ryid>',<net>,'N');
```

### 关键实现约束

**末尾必须带分号。** 参照 [common.js:107-112](api/common.js:107)，`CreateSQL` 生成的每条 oracle SQL 都自带结尾分号（SALE001~003 是 ` LOG ERRORS INTO xxx_ERROR_LOG;`，其余是 `;`）。我们用 `OracleSql +=` 直连，不经过 `additional.oracle` 的 `join(';')`（[bll.js:260](bll/Common/bll.js:260)），所以**必须自带分号**，否则会与后续语句粘连。

**日期格式串必须是 `yyyy-MM-dd HH24:mi:ss`**，与 [common.js:91](api/common.js:91) 保持一致（那里对所有含 `DATE` 的列统一用这个格式串）。

**已实测确认：** `sale1_obj.SALEDATE` 值为 `'2026-10-13'`（只有年月日），经 `CreateSQL` 用 `yyyy-MM-dd HH24:mi:ss` 解析后，Oracle 存入 **`2026-10-13 00:00:00`**。因此本 INSERT 只要用**同一个格式串 + 同一个取值**，`POS_INFOR_WARM.SALEDATE` 就能与 `SALE001.SALEDATE` 完全相等，主键 `(SALEDATE, KHID, BILL)` 可以正确关联。

注意：`SALEDATE` 列是**日期而非时间戳**，同一天的所有单据 `SALEDATE` 都是 `00:00:00`。

**单引号转义。** 拼接字符串值前做 `replace(/'/g, "''")`。

**`NET` 是数字列。** 拼入前用 `Number(...).toFixed(3)` 归一，不加引号。

### `BILL_TYPE` 的来源与 `SXJS` 映射

值的产生与传递已打通：`base_sale.js:3974` 从 `sale.saleBillType[xstype]` 取值 → `base_sale.js:4731` `$beforeFk` 写入 `sale001.BILL_TYPE` → 支付页可用 → 随 `dataObj.SALE001` 落到 `CreateSaleOrder`。**卡券侧由页面直接设置**（`CardSale.vue:350`、`CouponSale.vue:486`）。

需求要求"赊销结算写 `SXJS`"，但 `saleBillType` 数组（[saleClass.js:484](utils/sale/saleClass.js:484)）里**没有 `SXJS`**。需要覆盖：

```
bill_type = 'YWSXJS' in dataObj ? 'SXJS' : dataObj.SALE001.BILL_TYPE
```

#### 为什么用 `dataObj.YWSXJS` 判定（而非 `clickType`）

`Payment.vue` **取不到 `current_type.clickType`**（其参数来源是 `$store.state.location`，不含销售模式对象）。

改为在 `CreateSaleOrder` 内判断 `dataObj` 是否有 `YWSXJS` 表。这个办法更简单，而且**语义更准**：

- `YWSXJS`（赊销结算主单）**只在赊销结算模式生成**
- 唯一的赋值点是 [base_sale.js:1512](utils/sale/base_sale.js:1512) `this.additional['YWSXJS'] = params.ywsxjs`，位于 `sale_credit_settlement` 的 `$initSale` 钩子内（[base_sale.js:1458](utils/sale/base_sale.js:1458)）
- 全项目对 `YWSXJS` 的写入引用仅此一处
- 它随 `...this.additional` 展开进 `CreateSaleOrder` 的实参（[base_sale.js:3850](utils/sale/base_sale.js:3850)）

因此 `'YWSXJS' in dataObj` 是赊销结算的**可靠且唯一**的判据。附带好处：判定逻辑全部收在 `bll.js` 内，支付页连 `isSaleCreditSettlement` 都不需要传。

**仍然不要用 `XSTYPE` 反查** —— 赊销结算的 `xstype` 与普通销售在 `Z101` 上重合，不可靠。

## Storage 标记的设计

| 键 | 值 | 说明 |
|---|---|---|
| `CashLimit_Warm` | `{ ts: <时间戳>, net: <现金合计> }` | 无标记时表示无需记录 |

**两重保护防止误写下一单：**

1. `ts` 新鲜度校验（建议 5 分钟）——隔夜或异常中断的残留不会被消费
2. 消费后立即 `removeStorage`

**为什么用 storage 而不是模块级变量**：`Payment.vue` 与 `bll.js` 之间没有共享的运行时对象；项目里跨模块、跨页面传递短生命周期状态的惯例就是 storage（`FKDA_INFO`、`sysParam`、`POSCS` 等）。模块级变量在 uni-app 多页面实例下不可靠。

## 组件与模块拆分

### 新增 `utils/sale/cashLimit.js`

| 函数 | 签名 | 职责 |
|---|---|---|
| `getCashFkid()` | → `string` | 从 `FKDA_INFO` 取 `MEDIA=='1'` 的 `FKID` |
| `getCashTotal(payList, dPayAmount, cashFkid)` | → `number` | 算本单现金合计 |
| `isOverLimit(cashTotal, paramValue)` | → `boolean` | 参数容错 + 比较 |
| `savePending(net)` | → `void` | 写 storage 标记 |
| `buildWarmSql(dataObj)` | → `string \| null` | 读标记 → 校验新鲜度 → 拼 INSERT → **清标记**；无标记或已过期返回 `null` |
| `escape(v)` | → `string` | 单引号转义（内部函数） |

`buildWarmSql` 接收整个 `dataObj`（而非只收 `SALE001`），因为它需要同时判断 `dataObj.SALE001`（字段来源）和 `dataObj.YWSXJS`（赊销结算判定）。它在 `bll.js` 里被调用，是唯一的消费入口，`bll.js` 需 import 该模块。

**注意 `savePending` 不需要传 `isSaleCreditSettlement`** —— 赊销判定的全部逻辑收在 `buildWarmSql` 内，支付页不参与。

### 新增 `components/CashLimitModal/CashLimitModal.vue`

props：`visible`、`text`、`seconds`（默认 10）。
内部维护 `countdown` / `remain` 状态与 `setInterval`；组件销毁或 `visible` 变 `false` 时必须 `clearInterval`，避免定时器泄漏。
事件：`uni.$emit("cash-limit-confirm")` / `uni.$emit("cash-limit-cancel")`。

### 修改 `pages/Payment/Payment.vue`

1. `components` 注册 `CashLimitModal`，模板中挂载
2. `data` 增加 `CashLimitModal: { Visible: false, Confirm: false, Text: "", Remain: 10 }`
3. 新增 `CashLimit: async function()`。**开头 `if (this.isRefund) return true;`** 短路退款
4. `InPaymentBeforeStoped` 的 `Promise.all` 数组加入 `this.CashLimit()`
5. 判定超限且用户点【确定】后调 `cashLimit.savePending(net)`

### 修改 `bll/Common/bll.js`

`CreateSaleOrder` 内（[bll.js:257](bll/Common/bll.js:257) 附近）调用 `buildWarmSql(dataObj)` 并把结果拼进 `OracleSql`。**这是唯一的写入点，5 个调用方零改动。**

## 验证方式

本项目无测试框架，验证靠 HBuilderX 真机/模拟器运行 + 控制台日志。

| # | 场景 | 预期 |
|---|---|---|
| 1 | `CASHSX` 未配置 | 不弹窗，支付正常 |
| 2 | 现金金额 ≤ `CASHSX` | 不弹窗，支付正常 |
| 3 | 现金 > `CASHSX`，点【确定】 | 弹窗 → 支付成功 → `POS_TXFILE.TX_SQL` 含 INSERT → Oracle 有记录且 `yn_tx='N'` |
| 4 | 现金 > `CASHSX`，点【取消】 | 弹窗关闭 → 支付终止 → **输入框保留原值** → 无 Oracle 记录、**无 storage 残留** |
| 5 | 倒数 10s 不操作 | 弹窗不关，**【确定】由置灰变为可点**，支付仍挂起 |
| 6 | 倒计时期间点【确定】 | 按钮置灰，点不动 |
| 7 | 非现金支付方式 | 完全不触发 |
| 8 | 赊销结算 + 现金超限 | `BILL_TYPE` 写 `SXJS` |
| 9 | 分两次收现金，第二次触发超限 | 合计口径正确，`NET` 为两笔之和 |
| 10 | 现金含找零 | 找零负数记录不计入合计 |
| 11 | 退款（Z151）现金超限 | **不触发**，直接放行 |
| 12 | 售卡（CardSale）+ 现金超限 | 触发，`BILL_TYPE` 写 `Z111`，Oracle 有记录 |
| 13 | 售券（CouponSale）+ 现金超限 | 触发，`BILL_TYPE` 写 `Z111`，Oracle 有记录 |
| 14 | 卡券激活失败（`YN_OK='F'`）+ 现金超限 | **仍然记录**（只要现金过机就记） |
| 15 | 超限确认后支付中断，下一单正常支付 | 下一单**不**被误记（标记已清理 / 已过期） |
| 16 | 赊销售卡（`BILL_TYPE='Z112'`）+ 现金超限 | `BILL_TYPE` 写 `Z112` |
| 17 | 对比 Oracle 上 `SALE001.SALEDATE` 与 `POS_INFOR_WARM.SALEDATE` | 两者**完全相同**（预期均为 `2026-10-13 00:00:00`） |

日志沿用项目约定：`console.log("[CashLimit]...")` 前缀。

## 版本与发版

`manifest.json` 的 `versionName` / `versionCode` 需递增（当前 `1.1.144` / `144`）。

## 待确认事项

无阻塞项。全部前置问题已闭环，见下。

### 已闭环事项

- **`CASHSX` 参数来源**：直接取 `sysParam` 缓存的 `CASHSX` 值，不新增取数逻辑。
- **`SALE001.SALEDATE` 的实际存储格式**：确认为 `2026-10-13 00:00:00`（日期列，时分秒恒为 0）。本 INSERT 用同一格式串即可对齐。
- **`Payment.vue` 能否取 `current_type.clickType`**：取不到。改用 `dataObj.YWSXJS` 判定赊销结算，见"`BILL_TYPE` 的来源与 `SXJS` 映射"。
- **各白名单是否包含现金 FKID**：已确认**包含**。限制支付时现金显示为不可用，收银员选不到现金，自然不触发后续逻辑。这是期望行为，不需要额外处理。
- **服务端 SQL 分隔**：传入服务端的 SQL **按分号分隔**。本 INSERT 自带结尾分号，符合要求。
- **同一单重复超限确认撞主键**：暂不考虑。

## 已知问题记录（不在本次范围内）

[bll.js:259](bll/Common/bll.js:259)：

```js
SqliteSql.concat(sqlite_addition_sqls);   // 缺少赋值
```

`Array.prototype.concat` 不修改原数组，结果被丢弃，导致 `additional.sqlite` 传入的语句实际不生效。本方案走 Oracle 侧，**不受影响**。但这是真实缺陷：任何依赖 `additional.sqlite` 的调用方，其额外本地 DDL/DML 都静默丢失。建议单独评估修复——直接改成 `SqliteSql = SqliteSql.concat(sqlite_addition_sqls)` 会影响现有调用方行为，需先确认没有调用方在"依赖它不生效"。
