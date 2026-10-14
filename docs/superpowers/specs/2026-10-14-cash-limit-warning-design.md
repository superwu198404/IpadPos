# 现金支付超限提示与课长消息记录 — 设计文档

日期：2026-10-14
状态：待评审

## 背景与目标

门店现金过机存在赊销风险：收银员用现金收款后不按时存现，形成账外资金占用。现需要：

1. 当用户以**现金**支付且**本单现金合计超过参数上限**时，弹出提示，告知"现金赊销须三日内存现，如违规使用现金过机系统记录并同步课长"。
2. 每次发生超限且用户确认支付，向后台写入一条消息记录，供门店课长接收。

## 范围

只改 `pages/Payment/Payment.vue` 这一个支付页。覆盖走该页的以下业务：销售、预订、预订提取、售卡、售券、赊销结算。

**退款不触发**（`Z151` / `Z152` 等），即使它们也走同一页面——退款是退钱给顾客，不构成赊销风险。实现上在 `CashLimit` 开头用 `isRefund` 短路。

不改动的部分：
- 服务端 `ExecuteBatchSQL` 接收逻辑保持不变
- 本地 SQLite **不建** `POS_INFOR_WARM` 表，该表只在 Oracle 侧存在
- 不新增上传队列机制，复用现有的 `communication_for_oracle` 附加 SQL 通道

## 术语与口径定义

| 术语 | 定义 |
|---|---|
| 现金支付方式 | `util.getStorage("FKDA_INFO")` 中 `MEDIA == '1'` 的那条记录的 `FKID` |
| 本单现金合计 | 已录现金 + 本次输入 |
| 已录现金 | `PayList` 中 `fkid == 现金FKID` 且 `amount > 0` 的行的 `amount` 之和 |
| 本次输入 | 输入框绑定的 `dPayAmount` |
| 超限 | 本单现金合计 > `CASHSX` 参数值，且 `CASHSX` 解析为数字后 > 0 |

### 为什么已录现金要过滤 `amount > 0`

`CheckCashPayment`（[Payment.vue:1936](pages/Payment/Payment.vue:1936)）会把找零写成一条负数 `amount` 的记录。按"录入金额合计"口径（用户已确认），找零不计入现金合计，因此过滤掉负数行即可，无需额外判断找零。

### 关于 `MEDIA` 字段名

需求原文写的是 `FKDA.MEIDA=1`，项目实际字段名为 `MEDIA`（见 [init.js:235](api/business/init.js:235) 的 `SELECT FKID,SNAME,JKSNAME,MEDIA FROM FKDA`）。实现以 `MEDIA` 为准。

### 关于 `FKID='ZF01'`

需求原文写 `FKID='ZF01'`。经核查，`ZF01` 在本项目中**不是现金**：
- [Payment.vue:1286](pages/Payment/Payment.vue:1286) 把它列为"跳过接口调用"的白名单成员
- [Refund.vue:64](pages/Refund/Refund.vue:64) 把它当作支付宝的本地假数据

全项目判定现金的统一方式是 `MEDIA == '1'`。实现采用后者，不硬编码 `ZF01`。

## 新增参数

| 项 | 值 |
|---|---|
| POSCS | `CASHSX` |
| POSCSNR | 现金上限，单位为**元** |
| 读取方式 | `common.GetPOSCS_Local("CASHSX")`（[api/common.js:928](api/common.js:928)） |

参数的配置与下发由服务端负责（`POSCSZMX` + `DAPZCS_NR`，经 `sysParm.getSysParam` 落本地 `sysParam` 缓存）。

容错：参数未配置或解析为 `NaN` 时，解析结果按 `0` 处理，**不触发**超限提示。理由是本功能属于业务管控，不应因参数缺失阻塞收银。

## 交互设计

### 触发位置

在 `InPaymentBeforeStoped`（[Payment.vue:1595](pages/Payment/Payment.vue:1595)）的 `Promise.all` 数组中，排在 `CashChange` 之后新增 `this.CashLimit()`。

顺序上必须在 `CashChange` 之后：`CashChange` 处理找零相关的二次确认，先让用户确认金额无误，再做超限管控，避免两个弹窗叠加。

### 弹窗

新建 `components/CashLimitModal/CashLimitModal.vue`，样式与事件机制仿照现有的 [CashChangeModal](components/CashChangeModal/CashChangeModal.vue)，即通过 `uni.$emit` 派发事件、父页面用 `uni.$once` + Promise 封装成可 `await` 的交互。

不复用 `CashChangeModal` 的原因：现有组件的按钮是【取消 / 确认】，而本需求是【确定 / 取消】，且**取消的语义相反**——`CashChangeModal` 的取消是"这一笔先不支付"，本需求是"终止本次支付"。混用会污染每天在用的找零确认逻辑。

提示文案（固定）：

> 现金赊销须三日内存现，如违规使用现金过机系统记录并同步课长

### 状态机

弹窗有两个状态：`countdown`（倒计时中）与 `awaitUser`（等待用户决策）。

进入弹窗即处于 `countdown`，10 秒。

| 事件 | 触发时机 | 行为 |
|---|---|---|
| 倒计时结束 | `countdown` 态下 10s 走完 | 切换为 `awaitUser` 态。【确定】按钮由置灰变为可点。弹窗不关闭，不自动支付，不写消息表 |
| 点【确定】 | **仅 `awaitUser` 态可用** | 停止倒计时 → 关闭弹窗 → 返回 `true` → 支付流程继续 → 支付成功后追加消息 SQL |
| 点【取消】 | 两个状态都可用 | 停止倒计时 → 关闭弹窗 → 返回 `false` → 支付流程终止 → **保留输入框原值，不清空** |

**【确定】在倒计时期间置灰不可点**，这是本功能的核心约束：10 秒内用户唯一能做的操作是【取消】或等待，强制收银员至少看完 10 秒风险提示。倒计时走完后【确定】才解锁，此时用户可以自由决定确认支付还是取消。

支付流程在弹窗期间挂起（`await` 在 `Promise.all` 里），不设置额外超时，用户可以无限期思考。

### 多次触发

用户点【取消】终止支付后，`PayList` 未变化（已录现金不变），**输入框保留原值**。用户可直接改金额或再次点支付，若仍超限会再次弹窗。属预期行为。

保留输入值是有意为之：收银员往往只需要微调金额（比如少收一点降到上限以下），清空会强迫重新输入。

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
| `SALEDATE` | `sale1_obj.SALEDATE` | **必须与单据的 `SALE001.SALEDATE` 一致**，不能另外取当前时间。理由是 `POS_INFOR_WARM` 的主键含 `SALEDATE`，且后台按 `(yn_tx, saledate, khid, bill)` 建了索引，两处取值不一致会导致消息与单据关联不上 |
| `KHID` | `sale1_obj.KHID` | |
| `BILL` | `sale1_obj.BILL` | 赊销结算场景 `sale1_obj.BILL` 即 `mode_info.sale_credit_settlement.new_bill`，两者一致 |
| `BILL_TYPE` | `sale1_obj.BILL_TYPE`，赊销结算场景覆盖为 `SXJS` | 见下节 |
| `RYID` | `sale1_obj.RYID` | 收银员 |
| `NET` | 本单现金合计（元） | 与超限判定同一个值 |
| `YN_TX` | 常量 `'N'` | |

`SALEDATE` 是 `date` 列，走 `TO_DATE` 格式化。格式串用 `yyyy-mm-dd`：`sale1_obj.SALEDATE` 由 [`base_sale.js:2084`](utils/sale/base_sale.js:2084) 的 `getDate()` 生成，只拼年月日（**不含时分秒**），时分秒是独立的 `SALETIME` 字段。`GetSale` 初始化时 `this.saledate = this.getDate()`（[base_sale.js:2811](utils/sale/base_sale.js:2811)），再写入 `sale001.SALEDATE`（[base_sale.js:4084](utils/sale/base_sale.js:4084)、[4120](utils/sale/base_sale.js:4120)）。

注意：**不要用 `dateformat.getYMDS()`**，那是 `SALETIME` 的口径（`'YYYY-MM-DD HH:mm:ss'`），与 `SALEDATE` 不是同一个值，会造成消息与单据关联不上。

### BILL_TYPE 的现有链路

值的产生与传递已经打通，无需新增传递路径：

1. [base_sale.js:3974](utils/sale/base_sale.js:3974) — `this.bill_type = sale.saleBillType[this.current_type.xstype]`。数组定义在 [saleClass.js:484](utils/sale/saleClass.js:484)，取值为 `Z101` / `Z151` / `Z121` / `Z104` / `Z112` 等。
2. [base_sale.js:4731](utils/sale/base_sale.js:4731) — `$beforeFk` 中 `this.sale001.BILL_TYPE = this.bill_type`，在付款前落到单据上。**这一步保证 `sale1_obj.BILL_TYPE` 在支付页可用。**
3. [Payment.vue:2113](pages/Payment/Payment.vue:2113) — `this.BILL_TYPE = this.SALES.sale1.BILL_TYPE`。

### BILL_TYPE 的映射缺口

需求要求"赊销结算的写个 SXJS"，但 `saleBillType` 数组里**没有 `SXJS`**。因此需要一个额外覆盖：

```
bill_type = (current_type.clickType == 'sale_credit_settlement') ? 'SXJS' : sale1_obj.BILL_TYPE
```

判定条件 `clickType == 'sale_credit_settlement'` 与 [base_sale.js:3860](utils/sale/base_sale.js:3860) 判断单号时用的是同一个，语义一致。

注意 `current_type` 在支付页是否可直接访问需要实现时确认——若不可访问，用 `sale1_obj.XSTYPE` 反查 `saleBillType` 亦可等价判定（赊销结算的 `xstype` 在 [saleClass.js:495](utils/sale/saleClass.js:495) 附近对应 `Z101`，与普通销售重合，因此**优先用 `clickType`**，`XSTYPE` 不可靠）。

后续若还有其他业务类型需要特殊值，在同一个映射函数里加分支即可。

## SQL 拼装

```sql
INSERT INTO POS_INFOR_WARM (SALEDATE,KHID,BILL,BILL_TYPE,RYID,NET,YN_TX)
VALUES (TO_DATE('<saledate>','yyyy-mm-dd'),'<khid>','<bill>','<bill_type>','<ryid>',<net>,'N');
```

`<saledate>` 取 `sale1_obj.SALEDATE`（`'YYYY-MM-DD'`），格式串固定 `yyyy-mm-dd`。

### 关键实现约束

**末尾必须带分号。** `CreateSaleOrder` 对 `dataObj` 里的业务表 SQL 会自动补 `;`（由 `CreateSQL` 处理），但对 `additional.oracle` 只做 `join(';')` **不给每条补分号**（[bll.js:260](bll/Common/bll.js:260)）。而现有调用方传入的附加 SQL 本身就是不带分号的（见 [base_sale.js:3837](utils/sale/base_sale.js:3837) 的 `CXMDFS`）。因此本 INSERT 需自带 `;`，否则会与后续语句粘连。

**单引号转义。** 拼接字符串值前统一做 `replace(/'/g, "''")`，避免门店名或单号含单引号时 SQL 出错。

**`NET` 是数字列。** 拼入前用 `Number(...).toFixed(3)` 或等价方式归一，不加引号。

### 追加位置

在 `SaleDataCombine` 之后、`orderSQLGenarator` 之前（此时 `sale1_obj` 已填充 `KHID` / `RYID` / `BILL` / `SALEDATE` / `BILL_TYPE`），把拼好的语句 push 进 `this.communication_for_oracle`。

`PayedResult` 会把 `communication_for_oracle` 作为 `additional.oracle` 传给 `CreateSaleOrder`（[base_sale.js:3851](utils/sale/base_sale.js:3851)），后者追加进 `POS_TXFILE.TX_SQL`，随单据一起上传。

## 已知问题记录（不在本次范围内）

[bll.js:259](bll/Common/bll.js:259)：

```js
SqliteSql.concat(sqlite_addition_sqls);   // 缺少赋值
```

`Array.prototype.concat` 不修改原数组，此处结果被丢弃，导致 `additional.sqlite` 传入的语句实际不生效（`exeSql` 由未包含附加项的 `SqliteSql` 与队列行组成）。

本次方案走 Oracle 侧，**不受影响**。但这是一个真实缺陷：任何依赖 `additional.sqlite` 的调用方，其额外本地 DDL/DML 都不会执行。建议单独评估是否修复——直接改成 `SqliteSql = SqliteSql.concat(sqlite_addition_sqls)` 会影响现有调用方行为，需要先确认没有调用方在"依赖它不生效"。

## 组件与模块拆分

### 新增 `utils/sale/cashLimit.js`

三个纯函数，不依赖 vue 实例，便于单独验证：

| 函数 | 签名 | 职责 |
|---|---|---|
| `getCashFkid()` | → `string` | 从 `FKDA_INFO` 取 `MEDIA=='1'` 的 `FKID` |
| `getCashTotal(payList, dPayAmount, cashFkid)` | → `number` | 算本单现金合计 |
| `isOverLimit(cashTotal, paramValue)` | → `boolean` | 参数容错 + 比较 |
| `getBillType(sale1Obj, isSaleCreditSettlement)` | → `string` | 映射 `SXJS`，见下 |
| `buildWarmInsert({saledate, khid, bill, billType, ryid, net})` | → `string` | 拼 Oracle INSERT |

**`isSaleCreditSettlement` 由调用方传入。** 工具函数不依赖 `Payment.vue` 的 `current_type`。实现时先查清 `Payment.vue` 能否直接拿到 `current_type.clickType`；拿不到就用 [`base_sale.js:3860`](utils/sale/base_sale.js:3860) 同一个判定口径，在页面侧算出布尔值再传入。**不要用 `sale1_obj.XSTYPE` 反查** —— 赊销结算的 `xstype` 与普通销售在 `Z101` 上重合，不可靠。

### 新增 `components/CashLimitModal/CashLimitModal.vue`

props：`visible`、`text`、`seconds`（默认 10）。
内部维护 `countdown` / `remain` 状态与 `setInterval`；组件销毁或 `visible` 变 `false` 时必须 `clearInterval`，避免定时器泄漏。
事件：`uni.$emit("cash-limit-confirm")` / `uni.$emit("cash-limit-cancel")`。

### 修改 `pages/Payment/Payment.vue`

1. `components` 注册 `CashLimitModal`，模板中挂载
2. `data` 增加 `CashLimitModal: { Visible: false, Confirm: false, Text: "", Remain: 10 }`
3. 新增 `CashLimit: async function()` 方法。**方法开头 `if (this.isRefund) return true;`** —— 退款不触发超限提示（退款是退钱给顾客，不构成赊销风险，也不应进课长消息）。
4. `InPaymentBeforeStoped` 的 `Promise.all` 数组里加入 `this.CashLimit()`
5. `SaleDataCombine`（或 `orderSQLGenarator`）里追加消息 INSERT
6. 记录本次是否超限+确认（供第 5 步判断），以及确认时的现金合计值

## 验证方式

本项目无测试框架，验证靠 HBuilderX 真机/模拟器运行 + 控制台日志。

需要覆盖的场景：

| # | 场景 | 预期 |
|---|---|---|
| 1 | `CASHSX` 未配置 | 不弹窗，支付正常 |
| 2 | 现金金额 ≤ `CASHSX` | 不弹窗，支付正常 |
| 3 | 现金金额 > `CASHSX`，点【确定】 | 弹窗 → 支付成功 → `POS_TXFILE.TX_SQL` 含 INSERT → 上传后 Oracle 有记录且 `yn_tx='N'` |
| 4 | 现金金额 > `CASHSX`，点【取消】 | 弹窗关闭 → 支付终止 → **输入框保留原值** → 无 Oracle 记录 |
| 5 | 倒数 10s 不操作 | 弹窗不关，【确定】可点，支付仍挂起 |
| 6 | 非现金支付方式 | 完全不触发 |
| 7 | 赊销结算 + 现金超限 | `BILL_TYPE` 写入 `SXJS` |
| 8 | 分两次收现金，第二次触发超限 | 合计口径正确，`NET` 为两笔之和 |
| 9 | 现金含找零 | 找零负数记录不计入合计 |
| 10 | 退款（Z151）现金超限 | **不触发**，直接放行 |
| 11 | 倒计时期间点【确定】 | 按钮置灰，点不动 |

日志沿用项目约定：`console.log("[CashLimit]...")` 前缀。

## 版本与发版

`manifest.json` 的 `versionName` / `versionCode` 需递增（当前 `1.1.144` / `144`）。

## 待确认事项

1. 服务端 `POSCSZMX` / `DAPZCS_NR` 中 `CASHSX` 的配置与下发（用户确认"已配置或即将配置"）。
2. 服务端 `ExecuteBatchSQL` 端到端验证：确认 `POS_TXFILE.TX_SQL` 中带末尾分号的 INSERT 能被正确拆分执行。
3. `Payment.vue` 能否直接访问 `current_type.clickType`（决定 `isSaleCreditSettlement` 是页面侧算好还是工具函数自己取）。实现第一步先查清。
4. 同一单重复超限确认会撞主键 `(SALEDATE,KHID,BILL)`。当前设计接受该风险（"确定"是人工决策，收银员不会明知会失败还重复点）。若需彻底规避，需要服务端把约束改为唯一索引并改用 `MERGE`，或客户端先查后写 —— 但客户端无法查询 Oracle，此路不通。**建议先按当前设计实现，观察实际是否出现该场景。**
