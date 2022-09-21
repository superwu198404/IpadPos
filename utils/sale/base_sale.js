import sale from '@/utils/sale/saleClass.js';
import util from '@/utils/util.js';
import cx from '@/utils/cx/cxCount.js';
import _main from '@/api/business/main.js';
import _refund from '@/api/business/refundorder.js';
import _extract from '@/api/business/extract.js';
import _date from '@/utils/dateformat.js';
import _member from '@/api/hy/MemberInterfaces.js';

import {
	Sale3Model,
	Sale3ModelAdditional
} from '@/bll/PaymentBusiness/bll.js'
import {
	CreateSaleOrder,
	PointUploadNew
} from '@/bll/Common/bll.js'
import common from '@/api/common.js';
/**
 * 销售类型列表进入销售页面之后会根据此列表配置进行初始化
 */
var XsTypeObj = {
	//销售+退货
	sale: { //普通销售模式，最基本的模式
		xstype: "1",
		clickType: "sale", //目前尚未用到
		nameSale: "销售",
		icon_open: require('@/images/xiaoshou.png'),
		icon_close: require("@/images/xiaoshou-hui.png"),
		operation: { //只设置为true的就好 其他的默认设置为false
			"HY": true, //是否可以录入会员
			"DKF": true, //是否可以打开录入大客户
			"Disc": true, //是否可以打开录入折扣
			"ynFzCx": true, //是否可以辅助促销
			"FZCX": true, //是否可以打开辅助促销组件
			"ynCx": true, //是否进行可以进行促销
			"sale": true, //从这里开始都是销售模式
			"sale_reserve": true,
			"sale_reserve_extract": true,
			"sale_online_order": true,
			"sale_online_order_extract": true,
			"sale_credit": true,
			"sale_return_good": true,
			"sale_reserve_cancel": true,
			"sale_credit": true,
			"sale_credit_return_good": true,
			"sale_takeaway": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"tools": true,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true //是否可以输入商品
		},
		$click() {
			return true;
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Payment
			console.log("[sale-$initSale]params:", params);
			if (this.actType != common.actTypeEnum.Payment) {
				this.operation.ynFzCx = false;
				this.ComponentsManage.FZCX = false;
			}
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "销售小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
		//在此模式下添加商品是否所有限制
		$addSp: function(pm_input) {
			//无条件返回表示，不需要限制
			return true;
		},
		///在付款之前的操作
		$beforeFk: function() {
			console.log("[Sale]新单据生成中...");
			this.createNewBill(); //创建新的sale001

			this.sale001.XSTYPE = 1;
			//手工折扣额的处理
			console.log("原金额：", this.sale001.TNET);
			let SKY_DISCOUNT = this.float(((this.sale001.TNET * 10) % 1) / 10, 2);
			console.log("手工折扣额：", SKY_DISCOUNT);
			this.sale001.TNET = this.float(Number(this.sale001.TNET) - SKY_DISCOUNT, 2);
			this.sale001.BILLDISC = this.float(Number(this.sale001.BILLDISC) + SKY_DISCOUNT, 2);
			this.sale001.ROUND = this.float(Number(this.sale001.ROUND) + SKY_DISCOUNT, 2);
			this.sale001.TDISC = this.float(Number(this.sale001.TDISC) + SKY_DISCOUNT, 2);

			console.log("[Sale]新单据生成完毕!", this.sale001);
			//可以使用的支付方式 
			return true;
		},
		//支付完成之前销售单之前
		$SaleBefor: function() {
			//一些特殊的设置
		},
		//支付完成中
		$saleFinishing: function(result) {
			//一些特殊的设置
			console.log("[sale-$saleFinishing]:", result)
			//手工折扣额分摊
			this.sale002 = _main.ManualDiscount(this.sale001, this.sale002);
			console.log("分摊后的商品信息：", this.sale002);
		},

		//支付完成以后
		$saleFinied: async function() {
			//一些特殊的设置 如积分上传
			if (this.currentOperation.upload_point && this.HY.cval.hyId) { //判断是否又上传积分的操作
				console.log("[PayedResult]准备上传会员积分数据...");
				let upload_result = await PointUploadNew(this.sale1, this.sale2, this.sale3);
				console.log("[PayedResult]上传会员积分结果:", upload_result);
			}
		},
	},
	sale_return_good: {
		xstype: "2",
		clickType: "sale_return_good",
		nameSale: "销售退货",
		icon_open: require("@/images/xstd.png"),
		icon_close: require("@/images/xstd-wxz.png"),
		operation: {
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Refund;
			console.log("[sale_return_good]SALE001:", params.sale1);
			this.sale001 = params.sale1 ?? {};
			console.log("[sale_return_good]SALE002:", params.sale2);
			this.sale002 = params.sale2 ?? {};
			console.log("[sale_return_good]SALE003:", params.sale3);
			this.sale003 = params.sale3 ?? {};
			console.log("退款初始化：123123313");
			this.operation.ynFzCx = false;
			this.ComponentsManage.FZCX = false;
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "退单小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
		$click() {
			this.SetManage('sale_return_good');
			return false;
		},
		$beforeFk: function() {
			//自动退货预处理，把支付方式准备写入进行预退货
			//一些特殊的设置
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund)
			console.log("[SaleFinishing]销售退货处理完毕!", {
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			});
			return true;
		},
		//支付完成中
		$saleFinishing: function(result) {

		},
		//支付完成以后
		$saleFinied: async function() {
			//一些特殊的设置 如积分上传
			if (this.currentOperation.upload_point && this.HY.cval.hyId) { //判断是否又上传积分的操作
				console.log("[PayedResult]准备上传会员积分数据...");
				let upload_result = await PointUploadNew(this.sale1, this.sale2, this.sale3);
				console.log("[PayedResult]上传会员积分结果:", upload_result);
			}
		},
	},
	//预订单+提取+取消
	sale_reserve: {
		xstype: "3",
		clickType: "sale_reserve",
		nameSale: "预定",
		icon_open: require("@/images/yuding.png"),
		icon_close: require("@/images/yuding-hui.png"),
		operation: {
			"HY": true, //是否可以录入会员
			"Disc": true, //是否可以打开录入折扣
			"ynFzCx": true, //是否可以辅助促销
			"ynCx": true, //是否进行可以进行促销
			"sale": true, //从这里开始都是销售模式
			"sale_reserve": true,
			"sale_credit": true,
			"sale_return_good": false,
			"sale_reserve_cancel": false,
			"sale_takeaway": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"tools": true,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true //是否可以输入商品
		},
		$click() {
			console.log("[sale_reserve]预定信息录入操作!");
			this.SetManage("sale_reserve");
			return true;
		},
		$initSale: function() {
			this.actType = common.actTypeEnum.Payment;
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "预定小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
		$beforeFk: function() { //支付打开预定信息录入
			//品诺
			//仟吉卡 当预定金包含折扣类型的时候 需要拆分重写
			//仟吉券 当预定金包含折扣类型的时候 需要拆分重写
			console.log("[BeforeFk]预订单录入:", this.sale001);
			this.sale001.XSTYPE = this.xsType; //把当前的销售类型赋值给新单
			this.setComponentsManage(null, 'statement'); //关闭购物车
			this.setComponentsManage(null, 'openydCustmInput'); //打开预定录入信息
			console.log("[BeforeFk]预定录入信息初始化:", this.sale001);
			this.ydsale001 = Object.cover(new sale.ydsale001(), this.sale001);
			console.log("[sale_reserve-$BeforeFk]预定信息生成:", {
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003,
				ydsale001: this.ydsale001
			});
			return false;
		},
		//支付完成中
		$saleFinishing: function(result) { //生成yd
			console.log("[SaleFinishing]预订单生成中...", result);
			this.ydsale001 = Object.cover(this.ydsale001, result.sale1_obj);
			console.log("[SaleFinishing]预订单生成完毕!", {
				ydsale1: this.ydsale001,
				sale003: this.sale003
			});
		},
		//支付完成以后
		$saleFinied: function() {

		},
		CloseReserveDrawer: function() {
			console.log("[CloseReserveDrawer]预定录入关闭...");
			this.setComponentsManage(null, "openydCustmInput");
			console.log("[CloseReserveDrawer]结算单打开...");
			this.setComponentsManage(null, "statement");
		}
	},
	sale_reserve_extract: {
		xstype: "5",
		clickType: "sale_reserve_extract",
		nameSale: "预定提取",
		icon_open: require("@/images/xz-ydtq.png"),
		icon_close: require("@/images/wxz-ydtq.png"),
		operation: {
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"FZCX": true, //是否可以打开辅助促销组件
			"ynFzCx": true, //是否可以辅助促销
			"tools": true,
			"upload_point": true,
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true //是否可以输入商品
		},
		$initSale: function(params) { //预定提取需要传入 ydsale001、syssale002，syssale003 信息
			this.allOperation.actType = common.actTypeEnum.Payment;
			this.old_bill = params.sale1.BILL;
			console.log("[sale_reserve_extract]SALE001:", params.sale1);
			this.sale001 = Object.cover(new sale.sale001(), (params.sale1 ?? {}));
			console.log("[sale_reserve_extract]SALE002:", params.sale2);
			this.sale002 = (params.sale2 ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
			console.log("[sale_reserve_extract]SALE003:", params.sale3);
			this.sale003 = (params.sale3 ?? []).map(sale3 => Object.cover(new sale.sale003(), sale3));
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Payment);
			console.log("[InitSale]预定提取，已设置锁定行...", this.sale002.length);
			this.currentOperation.lockRows = this.sale002.length;

			//合并 sale3 不含 ZKLX 的 记录
			let combine = this.sale003.filter(s2 => !s2.ZKLX); //筛选需要被合并的类型
			let list = this.sale003.filter(s2 => s2.ZKLX); //筛选不需要被合并的类型
			if (combine.length > 0) {
				let sale3 = combine[0]; //取出第一位
				let total = 0;
				combine.forEach(i => total += Number(i.AMT));
				sale3.AMT = total; //合并金额部分
				list.push(sale3);
				this.raw_order = list;
			}
			this.raw_order.forEach(s3 => s3.FKID = 'ZG03') //预定金类型
			console.log("[BeforeFk]预定提取信息初始化:", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003,
				sale3_raw: this.raw_order
			});
			//已经支付的信息

			//会员
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "提取小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
		$click() {
			console.log("[sale_reserve_extract]切换预定提取界面!");
			this.SetManage("sale_reserve_extract");
			return false;
		},
		$beforeFk() {
			console.log("[SaleReserve]预定支付金额:", this.sale001.DNET);
			let keys = Object.keys(new sale.sale001());
			let reserve_key = Object.keys(this.sale001);
			let hide_key = [];
			reserve_key.forEach(key => {
				if (keys.indexOf(key) === -1)
					hide_key.push(key);
			})
			util.hidePropety(this.sale001, ...hide_key);
			// this.sale001.DNET = Number(this.sale001.ZNET) - 1; //测试支付金额为 1 元
			console.log("[SaleReserve]定金:", this.sale001);

			if (this.sale001.DNET) {
				console.log("[SaleReserve]生成预定支付信息...");
				this.payed.push(Sale3ModelAdditional(Sale3Model({
					fkid: 'ZG03',
					type: 'YDJ',
					bill: this.sale001.BILL,
					name: "预定金",
					amount: this.sale001.DNET
				}), { //业务配置字段（支付状态设定为成功）
					fail: false //定金显示为成功
				}));
				console.log("[SaleReserve]生成预定支付信息成功!");
			}
			return true;
		},
		$saleFinishing: function(result) { //生成yd
			this.sale003.remove(i => i.ZKLX === 'ZG03'); //删除 $beforeFk 中生成的 zg03 的信息
			this.sale003.concat(this.raw_order);
			this.communication_for_oracle.push(
				`UPDATE ydsale001 set YD_STATUS ='2', SJTHDATE = TO_DATE('${this.getDate}', 'SYYYY-MM-DD HH24:MI:SS'), SJTHGSID = '${this.GSID}', SJTHGCID = '${this.GCID}', SJTHDPID = '${this.DPID}', SJTHKCDID = '${this.KCDID}', SJTHKHID = '${this.Storeid}', SJTHPOSID = '${this.POSID}', SJTHBILL = '${sales.sale1_obj.BILL}' WHERE bill ='${this.old_bill}';"`
			);
			delete this.old_bill;
			console.log("[SaleFinishing]生成合并后的 sale3 数据:", this.sale003);
			console.log("[SaleFinishing]生成状态更新 ydsale001 的sql:",
				`UPDATE ydsale001 set YD_STATUS ='2', SJTHDATE = TO_DATE('${this.getDate}', 'SYYYY-MM-DD HH24:MI:SS'), SJTHGSID = '${this.GSID}', SJTHGCID = '${this.GCID}', SJTHDPID = '${this.DPID}', SJTHKCDID = '${this.KCDID}', SJTHKHID = '${this.Storeid}', SJTHPOSID = '${this.POSID}', SJTHBILL = '${sales.sale1_obj.BILL}' WHERE bill ='${this.old_bill}';"`
			);
		},
		async $saleFinied(sales) {
			//一些特殊的设置 如积分上传
			if (this.currentOperation.upload_point && this.HY.cval.hyId) { //判断是否又上传积分的操作且有会员id
				console.log("[PayedResult]准备上传会员积分...");
				let upload_result = await PointUploadNew(this.sale1, this.sale2, this.sale3);
			}
		},
	},
	sale_reserve_cancel: {
		xstype: "4",
		clickType: "sale_reserve_cancel",
		nameSale: "预定取消",
		icon_open: require("@/images/ydqx.png"),
		icon_close: require("@/images/ydqx-wxz.png"),
		operation: {
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$initSale: function(params) {
			console.log("[InitSale]预定取消初始化开始!");
			this.actType = common.actTypeEnum.Refund;
			this.old_bill = params.sale1.BILL;
			this.allOperation.actType = false;
			console.log("[sale_reserve_cancel]SALE001:", params.sale1);
			this.sale001 = params.sale1 ?? {};
			console.log("[sale_reserve_cancel]SALE002:", params.sale2);
			this.sale002 = params.sale2 ?? [];
			console.log("[sale_reserve_cancel]SALE003:", params.sale3);
			this.sale003 = params.sale3 ?? [];
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Payment);
			console.log("[BeforeFk]预定提取信息初始化:", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003
			});
		},
		$beforeFk: function() {
			//品诺
			//仟吉卡 当预定金包含折扣类型的时候 需要拆分重写
			//仟吉券 当预定金包含折扣类型的时候 需要拆分重写
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund)
			console.log("[SaleFinishing]销售退货处理完毕!", {
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			});
			return true;
		},
		$click() {
			this.SetManage("sale_reserve_cancel");
			return false;
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "预定小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
		$saleFinishing: function(result) { //生成yd
			this.sale003.remove(i => i.ZKLX === 'ZG03'); //删除 $beforeFk 中生成的 zg03 的信息
			this.sale003.concat(this.raw_order);
			this.communication_for_oracle.push(
				`UPDATE ydsale001 set YD_STATUS ='3' WHERE bill ='${this.old_bill}';"`
			);
			delete this.old_bill;
			console.log("[SaleFinishing]生成合并后的 sale3 数据:", this.sale003);
			console.log("[SaleFinishing]生成状态更新 ydsale001 的sql:",
				`UPDATE ydsale001 set YD_STATUS ='2', SJTHDATE = TO_DATE('${this.getDate}', 'SYYYY-MM-DD HH24:MI:SS'), SJTHGSID = '${this.GSID}', SJTHGCID = '${this.GCID}', SJTHDPID = '${this.DPID}', SJTHKCDID = '${this.KCDID}', SJTHKHID = '${this.Storeid}', SJTHPOSID = '${this.POSID}', SJTHBILL = '${sales.sale1_obj.BILL}' WHERE bill ='${this.old_bill}';"`
			);
		},
	},
	//线上订单+线上提取
	sale_online_order: {
		xstype: "8",
		clickType: "sale_online_order",
		nameSale: "线上订单",
		icon_open: require("@/images/xsdingdan.png"),
		icon_close: require("@/images/xsdingdan-wxz.png"),
		operation: {
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$click() {
			this.SetManage("sale_online_order");
			return false;
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "线上小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
	},
	sale_online_order_extract: {
		xstype: "8",
		clickType: "sale_online_order_extract",
		nameSale: "线上订单提取",
		icon_open: require("@/images/xsddtiqu.png"),
		icon_close: require("@/images/xsddtiqu-wxz.png"),
		operation: {
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Refund;
			this.allOperation.actType = false;
			console.log("[sale_reserve_cancel]SALE001:", params.sale1);
			this.sale001 = params.sale1 ?? {};
			console.log("[sale_reserve_cancel]SALE002:", params.sale2);
			this.sale002 = params.sale2 ?? [];
			console.log("[sale_reserve_cancel]SALE003:", params.sale3);
			this.sale003 = params.sale3 ?? [];
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "提取小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
		$click() {
			this.SetManage("sale_online_order_extract");
			return false;
		},
	},
	//外卖单
	sale_takeaway: {
		xstype: "8",
		clickType: "sale_takeaway",
		nameSale: "外卖单",
		icon_open: require("@/images/waimaid.png"),
		icon_close: require("@/images/waimaid-hui.png"),
		operation: {
			"sale": true, //从这里开始都是销售模式
			"sale_reserve": true,
			"sale_credit": true,
			"sale_return_good": true,
			"sale_reserve_cancel": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$click() {
			this.SetManage("sale_takeaway");
			return false;
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "外卖销售单", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
	},
	//外卖单预定
	sale_takeaway_reserve: {
		xstype: "8",
		clickType: "sale_takeaway_reserve",
		nameSale: "外卖预定单",
		icon_open: require("@/images/wmyudd.png"),
		icon_close: require("@/images/wmyudd-hui.png"),
		operation: {
			"sale": true, //从这里开始都是销售模式
			"sale_reserve": true,
			"sale_credit": true,
			"sale_return_good": true,
			"sale_reserve_cancel": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$click() {
			this.SetManage("sale_takeaway_reserve");
			return false;
		},
		///对打印的控制
		$print: function() {
			return {
				tName: "外卖预订单", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
	},
	//消息
	sale_message: {
		xstype: "6",
		clickType: "sale_message",
		nameSale: "消息",
		icon_open: require("@/images/xz-xx.png"),
		icon_close: require("@/images/xiaoxi-hui.png"),
		operation: {
			"sale_message": true
		},
		$click() {
			this.SetManage("sale_message");
			return false;
		},
	},
	//赊销+退货
	sale_credit: {
		xstype: "6",
		clickType: "sale_credit",
		nameSale: "赊销",
		icon_open: require("@/images/xstd.png"),
		icon_close: require("@/images/xstd-wxz.png"),
		operation: {
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Payment
			console.log("[sale-$initSale]params:", params);
		},
		///对打印的控制
		$print: function(sale001, sale002, sale003) {

		},
		//在此模式下添加商品是否所有限制
		$addSp: function(pm_input) {
			//无条件返回表示，不需要限制
			return true;
		},
		///在付款之前的操作
		$beforeFk: function() {
			//可以使用的支付方式 
			//加入支付方式
			return false;
		},
		$click() {
			console.log("[sale_credit]赊销点击...");
			this.ComponentsManage.DKF = true; //打开大客户弹窗
			return false;
		},
		OpenBigCustomer: function(data) {
			console.log("[CloseBigCustomer]大客户打开!", data);
			// this.mainSale.ComponentsManage.DKF = true;
			this.setComponentsManage(null, "DKF");
		},
		CloseBigCustomer: function(data) {
			console.log("[CloseBigCustomer]大客户关闭!", data);
			this.DKF.val = data;
			uni.$emit('select-credit', data);
		}
	},
	sale_credit_return_good: {
		xstype: "7",
		clickType: "sale_credit_return_good",
		nameSale: "赊销退货",
		icon_open: require("@/images/sxtd.png"),
		icon_close: require("@/images/sxtd-wxz.png"),
		operation: {
			"sale_credit_return_good": true
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Refund;
			console.log("[InitSale]赊销退货单据信息:", params);
			this.sale001 = Object.cover(new sale.sale001(), params.sale1);
			console.log("[sale_credit_return_good]SALE001:", this.sale001);
			this.sale002 = (params.sale2 ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
			console.log("[sale_credit_return_good]SALE002:", this.sale002);
			this.sale003 = (params.sale3 ?? []).map(sale3 => Object.cover(new sale.sale003(), sale3));
			console.log("[sale_credit_return_good]SALE003:", this.sale003);
			console.log("[InitSale]赊销退货单据生成完毕!", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003
			});
			this.credit_sales = params;
		},
		$click() {
			this.SetManage("sale_credit_return_good");
			return false;
		},
		$beforeFk: function() {
			//可以使用的支付方式 
			//加入支付方式
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund)
			console.log("[SaleFinishing]赊销退货处理完毕!", {
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			});
			return true;
		},
		$saleFinishing: function() {
			console.log("[SaleFinishing]赊销退货结算单信息生成...");
		},
		$saleFinied: function(sales) {
			console.log("[SaleFinied]赊销退单...", this.credit_sales);
			_refund.CreditOrderRefund({
				khid: this.Storeid,
				posid: this.POSID,
				ryid: this.ryid,
				dkhname: this.credit_sales.sale1.DKFNAME,
				bill: this.credit_sales.sale1.BILL,
				saledata: this.credit_sales.sale1.SALEDATE //new Date().toLocaleDateString()
			}, res => {
				console.log("[SaleFinied]赊销退单结果:", res);
				if (res.code) {
					util.simpleMsg("赊销退单成功!");
				} else {
					util.simpleMsg("退单失败:" + res.msg, true);
				}
			})
		},
	},
}

/**
 * 
 * @param {*} global 配置参数
 * @param {*} vue vue实例
 * @param {*} target_name 目标名称
 * @param {*} uni uni实例
 */
function GetSale(global, vue, target_name, uni) {
	let store = global.store; //店铺配置信息
	let brand = global.brand;
	var that = this;
	var uni = uni;
	this.billindex = 0;
	/*
	 * 工具方法 
	 */
	//转换为小数，并保留2位
	this.float = function(pm_num, pm_declen) {
		return Number(parseFloat(pm_num).toFixed(pm_declen));
	}
	//获取当前时间：年月日-yyyy-mm-dd
	this.getDate = function() {
		let d = new Date();
		var x = d.getFullYear() + "-" + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + "-" + (d
			.getDate() < 10 ? "0" : "") + d.getDate();
		return x;
	}
	//获取当前时间：时分秒-hh:mm:ss
	this.getTime = function() {
		let d = new Date();
		var x = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" +
			d
			.getMinutes() + ":" + d.getSeconds();
		return x;
	}
	//创建订单号
	this.getBill = function() {
		var newbill = "";
		if (this.bill == null) {
			let d = new Date();
			newbill = this.Storeid + this.POSID + "" + d.getFullYear() % 100 + (d.getMonth() + 1) + d.getDate() + d
				.getHours() + d.getMinutes() + d.getSeconds();
			//单号格式：门店号+pos号+yymmddHHmmss+流水号 自打开程序以后的开单号，每天清零
			newbill = newbill + "" + this.billindex;
			this.billindex++;
		} else {
			newbill = this.bill;
		}
		return newbill;
	}
	//*func*特殊折扣初始化数据
	this.GetTSZKData = util.callBind(this, async function() {
		//初始化获取特殊折扣(默认是标准和临时，如果选了大客户则包含特批)
		console.log("传入折扣的大客户数据：", this.DKF.val.DKHID);
		this.Disc.val.ZKData = await _main.GetZKDatasAll(this.DKF.val.DKHID); //传入大客户值
		this.setComponentsManage(null, "Disc");
		console.log("首页初始化的折扣数据：", this.Disc.val.ZKData);
	})
	//*func*特殊折扣关闭回调
	this.CloseTSZK = util.callBind(this, function(data) {
		this.setComponentsManage(null, "Disc");
		console.log("特殊折扣返回的商品数据：", data); //返回折扣类型 再次根据商品匹配一下折扣
		this.Disc.val.ZKType = data;
	})
	//*func*辅助促销关闭回调
	this.CloseFZCX = util.callBind(this, function(res) {
		this.setComponentsManage(null, "FZCX");
		// this.FZCX.open = false;
		console.log("辅助促销回调结果：", res);
		if (res) {
			this.FZCX.val = res; //选择商品后的提示信息
		}
	})
	//*func*获取会员优惠券
	this.GetHyCoupons = util.callBind(this, function() {
		console.log("[GetHyCoupons]打印会员信息：", this.HY.val);
		if (this.HY.val.hyId) {
			this.HY.val.coupons = [];
			this.update();
			_member.CouponList("获取中...", {
				brand: brand,
				data: {
					hyid: this.HY.val.hyId,
					phone: this.HY.val.Phone
				}
			}, util.callBind(this, function(res) {
				if (res.code) {
					if (res.data && Array.isArray(res.data)) {
						this.HY.val.coupons = res.data;
						this.update();
					}
					// this.ShowStatement();
				}
			}), (err) => {
				console.log("[GetHyCoupons]异常数据：", res)
			})
		}
	})

	//*func*会员登录关闭回调
	this.CloseMember = util.callBind(this, function(member_info) {
		this.setComponentsManage(null, "HY");
		console.log("[CloseMember]会员页关闭!", member_info);
		this.HY.val = member_info;
		console.log("[CloseMember]会员信息:", this.HY.val);
		uni.$emit('set-member', this.HY.val);
	})
	//*func*会员登录
	this.MemberLogin = util.callBind(this, function(e) { //会员登录
		console.log("[MemberLogin]会员登录!");
		this.setComponentsManage(null, "HY");
		console.log("[MemberLogin]状态信息:", this.ComponentsManage.HY);
	})
	//*func*菜单切换
	this.Change = util.callBind(this, function(menu) {
		console.log("[Change]菜单点击触发!", menu);
		if (menu.info.clickType === 'sale_credit') {
			uni.$once('select-credit', util.callBind(this, function(data) {
				if (Object.keys(data ?? {}).length > 0) {
					console.log("[Change]切换到赊销!");
					this.SetManage('sale_credit'); //切换到赊销
					this.$initSale('sale_credit'); //切换到赊销
					// uni.$emit('set-menu','sale_credit');
				}
			}));
		}
		this.SetType(menu.info.clickType);
	})
	//*func*菜单切换
	this.Redirect = util.callBind(this, function(info) {
		console.log("[Redirect]重定向至销售主页!", info);
		let menu_info = XsTypeObj[info.name];
		console.log("[Redirect]模式信息:", menu_info);
		this.$initSale(menu_info, info.params);
		this.SetManage('sale');
	})
	//*func*预定录入回调
	this.ReserveInfoInput = util.callBind(this, function(sale1) {
		console.log("[ReserveInfoInput]预定提取录入完成,准备进入支付页面...", {
			ydsale1: this.ydsale001,
			sale1: this.sale001
		});
		Object.cover(this.sale001, sale1); //用于 sale001,如 DNET 赋值
		Object.cover(this.ydsale001, sale1); //用于 ydsale001
		console.log("[ReserveInfoInput]预定提取录入信息赋值完毕!", {
			ydsale1: this.ydsale001,
			sale1: this.sale001
		});
		this.PayParamAssemble();
	})
	//*func*商品字母筛选
	this.Letters = util.callBind(this, function(e) {
		this.Page.Alphabetical = true
	})
	//*func*回调绑定监听
	this.Bind = util.callBind(this, function() {
		console.log("[Bind]UNBIND!");
		uni.$off("change");
		uni.$off("redirect");
		uni.$off("member-close");
		uni.$off("close-big-customer");
		uni.$off("open-big-customer");
		uni.$off("reserve-drawer-close");
		uni.$off("close-tszk");
		uni.$off("close-FZCX");
		console.log("[Bind]BIND!");
		uni.$on("change", this.Change);
		uni.$on("redirect", this.Redirect);
		uni.$on("member-close", this.CloseMember);

		uni.$on("close-big-customer", (XsTypeObj.sale_credit.CloseBigCustomer).bind(this));
		uni.$on("open-big-customer", (XsTypeObj.sale_credit.OpenBigCustomer).bind(this));
		uni.$on("reserve-drawer-close", (XsTypeObj.sale_reserve.CloseReserveDrawer).bind(this));

		uni.$on("close-tszk", this.CloseTSZK);
		uni.$on("close-FZCX", this.CloseFZCX);
	})
	//日志
	this.log = function(str) {
		if (typeof(str) == 'string') {
			console.log(...arguments);
		} else {
			console.log(...arguments);
		}
	}
	//由于未知弹窗所以暂时用这个	 
	this.myAlert = function(pm_str1, pm_str2) {
		that.log("--------------看到这个说明弹窗功能还没有做！--------------")
	}
	//基础配置参数本地化
	this.Storeid = store.KHID;
	this.storeName = store.NAME;
	this.POSID = store.POSID;
	this.ryid = store.RYID;
	this.KCDID = store.KCDID;
	this.DPID = store.DPID;
	this.GCID = store.GCID;
	this.GSID = store.GSID;
	//销售系列主要数据对象
	this.sale001 = {}; //sale001 主单
	this.sale002 = []; //sale002 子单1：记录商品信息
	this.sale003 = []; //sale003 子单2：记录支付信息
	this.sale008 = []; //sale008
	//预定
	this.ydsale001 = {}; //sale001 主单
	// 通讯表\sqlite 额外sql
	this.communication_for_oracle = [];
	this.communication_for_sqlite = [];
	//销售时间（默认当前）
	this.saledate = this.getDate();
	//销售页面
	this.Page = vue; //销售页面实例
	this.pageName = target_name; //页面名称(这个控制器所控制的页面名称)
	//销售页面销售类型
	this.xsType = "sale"
	this.bill_type = null; //sale.saleBillType[this.xsType];
	this.bill = null;
	this.clickSaleType = {}; //当前点击的销售模式
	this.current_type = {}; //当前的销售模式
	this.payPassWord = false; //当前模式支付是否要输入登录密码
	this.selectFlag = "A";
	//不支持的付款方式
	this.notFayType = [];
	this.payed = []; //已支付信息
	//商品售价的信息列表
	this.spPrice = {};
	//字母的列表
	this.flagList = [];
	//根据字母筛选出来的商品列表
	this.selectFlagList = [];
	//点击的单个商品
	this.clikSpItem = {};
	//商品档案002 以商品id为键值的结构
	this.spSelectArr = {};
	//更新（根据代码应该是强制刷新页面）
	this.actType = common.actTypeEnum.Payment;
	//筛选的品类
	this.selectPlid = "";

	this.update = function() {
		if (that.Page) {
			that.Page.$forceUpdate()
		} else {
			that.log("页面变量丢失！！！！！！！")
		}
	}
	//初始化所有可以点击的商品，会员的结构
	this.HY = {
		cval: {},
		base: {},
		open: false,
		get val() {
			return this.cval;
		},
		set val(newval) {
			this.base.ComponentsManage["HY"] = false;
			this.base.allOperation["DKF"] = false; //会员和大客户互斥 录入会员后则不允许使用大客户
			this.cval = newval;
			if (this.cval) {
				this.base.GetHyCoupons();
			}
			that.update();
		}
	}
	this.HY.base = this;
	//大客户
	this.DKF = {
		base: {},
		cval: {},
		Defval: "80000000",
		get val() {
			if (!this.cval.DKFID) {
				this.cval.DKFID = this.Defval;
			}
			/*
			  这里要根据大客户ID是否为空 如果为空 返回一个默认的大客户
			*/
			return this.cval;
		},
		set val(newval) {
			this.base.ComponentsManage["DKF"] = false;
			this.base.allOperation["HY"] = false; //会员和大客户互斥 录入大客户则不允许使用会员
			if (newval == null || newval == this.Defval) {
				this.cval = this.Defval;
				return;
			}
			this.cval = newval;
		}
	}
	this.DKF.base = this;
	//折扣、当前选择的折扣方式
	this.Disc = {
		base: {},
		cval: {},
		Defval: 100,
		get val() {
			return this.cval;
		},
		set val(newval) {
			//赋值的时候进行计算
			this.cval = newval;
			// this.base.ComponentsManage["Disc"] = false;
			// if (this.cval>= 100) {
			console.log("选择得折扣类型为：", this.cval.ZKType);
			if (!this.cval.ZKType) { //如果未选择 折扣类型 则说明可以进行促销操作 反之
				this.base.allOperation["Disc"] = false;
				this.base.allOperation["ynFzCx"] = true;
				this.base.allOperation["ynCx"] = true;
			} else {
				this.base.allOperation["Disc"] = true;
				this.base.allOperation["ynFzCx"] = false;
				this.base.allOperation["ynCx"] = false; //特殊折扣和普通促销互斥
			}
		}
	};
	this.Disc.base = this;
	//辅助促销
	this.FZCX = {
		base: {},
		cval: [], //选中的数据
		oval: [], //初始数据
		open: false,
		get val() {
			return this.cval;
		},
		set val(newval) {
			//赋值的时候进行计算
			this.cval = newval;
			// if (newval.length > 0) {\"FZCX"] = true;
			// 	this.base.ComponentsManage["FZCX"] = false;
			// }
		}
	};
	this.FZCX.base = this;
	///所有商品的列表,具体参考 utils.sale.xs_sp_init.js
	this.Allsplist = null;

	//this.oldOperation = null;
	//当前锁定的行为多少

	//初始化字母的列表
	this.filterSp = function(pm_flag) {
		this.selectFlag = pm_flag;
		this.selectFlagList = this.Allsplist.filter(item => {
			return item.FSTR == pm_flag
		});
		if (this.selectFlagList.length > 0) {
			this.selectPlid = this.selectFlagList[0].plid;
		}
		that.log("[FilterSp]筛选出来的长度", this.selectFlagList.length)
		this.Page.$set(this.Page[this.pageName], "selectFlagList", this.selectFlagList);
		this.Page.$set(this.Page[this.pageName], "selectFlag", this.selectFlag);
		this.Page.$set(this.Page, "Alphabetical", false);
		//筛选字母的列表
	}

	///当出现一些互斥的操作的时候  恢复默认值的时候试用
	this.setSaleTypeDefval = function(pm_key) {
		if (this.currentOperation.hasOwnProperty(pm_key)) {
			this.ComponentsManage[pm_key] = this.currentOperation[pm_key];
		} else {
			this.ComponentsManage[pm_key] = false;
		}
	}

	this.selectPlidChenged = function(e) {
		that.selectPlid = e.currentTarget.dataset.plid;
		that.Page.$set(that.Page[that.pageName], "selectPlid", that.selectPlid);
	}
	//设置所有商品列表数据，初始化字母列表  售价列表  和商品列表  ，初始化促销单 
	this.SetAllGoods = function(pm_list, pm_price) {
		cx.Cxdict();
		this.spPrice = pm_price;
		this.Page.$set(this.Page[this.pageName], "spPrice", this.spPrice);
		this.Allsplist = pm_list;
		this.filterSp("A");
		that.log("[SetAllGoods]绑定完成！", this.Page[this.pageName].selectFlagList[0]);
		this.Allsplist.forEach(item => {
			if (that.flagList.indexOf(item.FSTR) < 0) {
				that.flagList.push(item.FSTR)
			}
		})
		that.log("[SetAllGoods]初始化字母列表" + JSON.stringify(this.flagList));
		this.Page.$set(this.Page[this.pageName], "flagList", this.flagList);
		console.log("[SetAllGoods]绑定字母表！");
	}
	//点击后获取数据（字母）
	this.FlagClick = function(e) {
		var flagX = e.currentTarget.dataset.flag;
		that.log("点击的字母！" + flagX);
		that.filterSp.call(that, flagX);
	}
	///当前模式下可以操作的功能，初始化以后会写到此列表中，在此列表中此可以进行点击操作，不在是不可以点击或者操作、计算等！
	this.currentOperation = {
		"statement": false
	};
	///销售界面可以进行操作功能 ，
	this.allOperation = {
		"HY": false, //是否可以录入会员
		"DKF": false, //是否可以打开录入大客户
		"Disc": false, //是否可以打开录入折扣
		"ynFzCx": false, //是否可以辅助促销
		"FZCX": false, //是否可以打开辅助促销组件
		"ynCx": false, //是否进行可以进行促销  
		"member_login": false, //是否打开会员登录界面
		"upload_point": false, //支付完毕后是否进行积分上传
		"sale": false, //从这里开始都是销售模式
		"sale_reserve": false,
		"sale_reserve_extract": false,
		"sale_online_order": false,
		"sale_online_order_extract": false,
		"sale_credit": false,
		"sale_return_good": false,
		"sale_reserve_cancel": false,
		"sale_credit": false,
		"sale_credit_return_good": false,
		"sale_takeaway": false,
		"sale_takeaway_reserve": false,
		"sale_message": false,
		"tools": false,
		"openydCustmInput": false, //预定输入客户的信息
		"openydCustmEdit": false, //预定修改客户的信息
		"sale002Rows": false, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
		"lockRows": 0, //是否存在锁定的行数
		"inputsp": false,
		"statement": true, //购物车
	}
	//插件的显示在这里控制
	this.ComponentsManage = {
		"HY": false, //会员插件是否打开
		"DKF": false, //大客户插件是否打开
		"Disc": false, //折扣插件是否打开
		"FZCX": false, //辅助促销插件是否打开
		"member_login": false,
		"sale": true, //从这里开始都是销售模式
		"sale_reserve": false,
		"sale_reserve_extract": false,
		"sale_online_order": false,
		"sale_online_order_extract": false,
		"sale_credit": false,
		"sale_return_good": false,
		"sale_reserve_cancel": false,
		"sale_credit": false,
		"sale_credit_return_good": false,
		"sale_takeaway": false,
		"sale_takeaway_reserve": false,
		"sale_message": false,
		"tools": false,
		"openydCustmInput": false, //预定输入客户的信息
		"openydCustmEdit": false, //预定修改客户的信息
		"inputsp": false,
		"statement": false, //购物车
	}

	var lastManage = null;

	///设置基础的权限
	this.SetCurrentOperation = function(pm_OperEnum) {
		console.log("[SetCurrentOperation]传入权限:", pm_OperEnum);
		//所有模式都具有的默认权限 在这里直接初始化好 ，
		this.currentOperation = {
			"statement": false
		};
		for (var item in this.allOperation) {
			//that.log("开始设置权限"+item);
			if (pm_OperEnum && pm_OperEnum[item]) {
				//普通销售具有所有的权限
				this.currentOperation[item] = pm_OperEnum[item]
			} else {
				this.currentOperation[item] = false;
			}
			//切换的时候关闭所有插件
			// for (item in this.ComponentsManage) {
			// 	that.ComponentsManage[item] = false;
			// }
		}
		this.SetManage(this.clickSaleType.clickType);
		this.update();
		console.log("[SetCurrentOperation]权限设置完毕!");
	}

	//设定具体的插件件让其进行显示,并关闭其他插件
	this.SetManage = function(pm_mtype) {
		if (!pm_mtype) return;
		console.log("[SetManage]LastManage:", lastManage);
		console.log("[SetManage]CurrentManage:", pm_mtype);
		//if (pm_mtype === lastManage) return;
		if (lastManage != null && pm_mtype != lastManage) {
			console.log("[SetManage]关闭上一个组件!");
			that.ComponentsManage[lastManage] = false;
		}
		that.log("[SetManage]点击的类型:", pm_mtype);
		that.ComponentsManage[pm_mtype] = !that.ComponentsManage[pm_mtype];
		lastManage = pm_mtype;
		// that.Page.$set(that.Page[that.pageName], "ComponentsManage", that.ComponentsManage);
		that.log("[SetManage]组件控制对象:", that.ComponentsManage);
		that.log("[SetManage]绑定完成:", that.ComponentsManage[pm_mtype]);
		that.update();
	}

	//设置所有插件的切换非销售模式的切换  会员  折扣 大客户等事件
	this.setComponentsManage = function(e, pm_mtype) {
		let mtype = pm_mtype || e.currentTarget.dataset.mtype;
		console.log("[SetComponentsManage]设置组件切换:", {
			type: mtype,
			mode: that.current_type,
			current: that.currentOperation
		});
		if (that.currentOperation.hasOwnProperty(mtype)) {
			console.log("[SetComponentsManage]设置弹窗类组件切换!", mtype);
			that.SetManage(mtype);
		} else {
			that.myAlert("当前模式下进行此操作")
		}
	}

	//调用各个销售类型的方法名称,参数列表
	this.CurrentTypeCall = function(pm_fun) {
		console.log("[CurrentTypeCall]当前销售类型:", this.current_type);
		console.log("[CurrentTypeCall]当前销售类型调用:", pm_fun);
		let defstr = "def"
		let arr = Array.from(arguments).slice(1);
		if (that.current_type[pm_fun]) {
			return that.current_type[pm_fun].apply(that, arr);
		} else {
			//方便定义公用的处理方法，如果销售类型里没有这个方法则调用这个
			if (that[defstr + pm_fun]) {
				return that[defstr + pm_fun].apply(that, arr);
			}
		}
	}
	//选择的商品进行品类的切换
	this.selectPlidChenged = function(e) {
		var plid = e.currentTarget.dataset.plid;
		that.selectPlid = plid;
		that.scrollinto = that.selectFlag + plid;
		that.log("切换到的品类" + that.scrollinto)
		that.Page.$set(that.Page[that.pageName], "selectPlid", that.selectPlid);
		that.Page.$set(that.Page[that.pageName], "scrollinto", that.scrollinto);
	}

	//展示商品的详情的事件
	this.showSpDetails = function(e) {
		//that.log("开始点击"+ JSON.stringify(that.currentOperation));
		if (!that.currentOperation.inputsp) {
			that.myAlert("当前模式下不可录入商品")
			return;
		}
		let plindex = e.currentTarget.dataset.plindex;
		that.log("开始点击plindex" + plindex);
		let spindex = e.currentTarget.dataset.spindex;
		that.log("开始点击spindex" + plindex);
		that.log("当前显示的商品集合" + JSON.stringify(that.selectFlagList[plindex]));
		let plitem = that.selectFlagList[plindex];
		let spitem = plitem.plarr[spindex];

		that.clikSpItem = spitem;
		that.clikSpItem.inputQty = 0;
		if (that.clikSpItem.ynshowlist) //如果是蛋糕默认选择一个商品id
		{

			that.log("查看蛋糕包含的品类" + JSON.stringify(that.clikSpItem.specslist));
			that.clikSpItem.selectSPID = that.clikSpItem.specslist[0].SPID;


		} else {
			that.clikSpItem.selectSPID = that.clikSpItem.SPID;
		}
		that.clikSpItem.PRICE = that.spPrice[that.clikSpItem.selectSPID].PRICE;
		that.log("设置显示对象" + JSON.stringify(that.clikSpItem));
		that.Page.$set(that.Page[that.pageName], "clikSpItem", that.clikSpItem);
		that.SetManage("inputsp")
	}
	this.selectSPID_Chenged = function(e) {
		that.log("进入事件：" + JSON.stringify(e.currentTarget.dataset));
		let spid = e.currentTarget.dataset.spid;
		that.log("选择的商品编码：" + JSON.stringify(spid));
		that.clikSpItem.selectSPID = spid;
		that.clikSpItem.PRICE = that.spPrice[spid].PRICE;
		that.log("" + JSON.stringify(that.clikSpItem));
		that.update();
	}
	//商品详情页的加号和 减号
	this.chengedQty = function(e) {
		let qty = e.currentTarget.dataset.qty;
		that.log("开始点击that.clikSpItem.inputQty" + that.clikSpItem.inputQty);
		qty = parseFloat(qty)
		let oldqty = parseFloat(that.clikSpItem.inputQty)
		qty = qty + oldqty;
		if (qty < 0) {
			qty = 0;
		}
		that.clikSpItem.inputQty = qty;
		//that.Page.$set(that.Page[that.pageName].clikSpItem,"inputQty",qty);
		that.update()
		that.log("-----绑定完成++++" + qty);
	}

	/*
	 * 修改销售类型
	 * @param {*} pm_type 销售类型
	 * @param {*} switch_callback 页面切换时的回调
	 */
	this.SetType = function(pm_type) {
		console.log("[SetType]设置销售类型:", pm_type);
		this.previous = this.clickSaleType?.clickType;
		console.log("[SetType]上一个类型:", this.previous);
		if (!this.currentOperation[pm_type]) {
			this.myAlert("请完成当前模式再进行切换！");
			return;
		}

		if (XsTypeObj[pm_type]) {
			// this.clickSaleType = XsTypeObj[pm_type];
			Object.assign(this.clickSaleType, XsTypeObj[pm_type])
			console.log("[SetType]设置当前点击销售的类型为:", this.clickSaleType);
			this.Page.$set(that.Page[that.pageName], "clickSaleType", that.clickSaleType);
			console.log("[SetType]销售类型:", pm_type);
			if (this.sale002.length > 0 && (this.currentOperation.sale002Rows == this.clickSaleType
					.operation
					.sale002Rows)) {
				this.myAlert("已经输入了商品不能进行此操作")
				return;
			}
			if (this.clickSaleType.$click.call(this)) {
				this.$initSale(this.clickSaleType);
			}

		} else {
			this.myAlert("没有此种操作模式" + pm_type);
		}
	}

	/**
	 * 支付结果
	 * @param {*} e 
	 */
	this.PayedResult = async function(result) {
		console.log("[PayedResult]支付结果:", result);
		if (!result.code) { //取消或者失败了 不走后续的处理
			util.simpleMsg(result.msg, !result.code);
			//清除一下辅助促销
			this.FZCX.cval = null;
			return;
		}
		this.sale001 = Object.cover(new sale.sale001(), result.data.sale1_obj);
		this.sale002 = (result.data.sale2_arr ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
		this.sale003 = (result.data.sale3_arr ?? []).map(sale3 => Object.cover(new sale.sale003(), sale3));
		this.sale008 = (result.data.sale8_arr ?? []).map(sale8 => Object.cover(new sale.sale008(), sale8));

		if (result.code) {
			util.simpleMsg(result.msg);
			//反写一下会员id
			if (this.sale001.CUID) {
				this.HY.cval = {};
				this.HY.cval.hyId = this.sale001.CUID;
			}
			console.log("[PayedResult]是否允许辅助促销:", this.currentOperation.ynFzCx);
			//如果允许辅助促销
			if (this.currentOperation.ynFzCx) {
				let FZCXVal = this.FZCX.cval;
				console.log("[PayedResult]辅助促销的结果：", FZCXVal);
				if (Object.keys(FZCXVal).length != 0) {
					FZCXVal.data.forEach(r => {
						let SPObj = _main.FindSP(this.Allsplist, r.SPID);
						if (Object.keys(SPObj).length > 0) {
							let NO = this.sale002.length;
							let s2 = _main.CreateSale2(r, this.sale001, SPObj, NO);
							s2 = Object.assign(new sale.sale002(), s2); //合并一下对象
							this.sale002.push(s2); //追加s2
						}
					})
					console.log("[PayedResult]追加辅助促销后的商品：", this.sale002);
				}
			}
			console.log("[PayedResult]调用执行 SaleFinishing 中...");
			try {
				this.$saleFinishing(result.data);
			} catch (err) {
				console.log("[PayedResult]调用执行 SaleFinishing 异常:", err);
			}
			console.log("[PayedResult]准备创建销售单记录...", {
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003,
				sale008: this.sale008,
				ydsale001: this.ydsale001
			});
			let create_result = await CreateSaleOrder({
				SALE001: this.sale001,
				SALE002: this.sale002,
				SALE003: this.sale003,
				SALE008: this.sale008,
				YDSALE001: this.ydsale001
			}, {
				sqlite: this.communication_for_sqlite,
				oracle: this.communication_for_oracle
			});
			common.TransLiteData(this.sale001.BILL); //上传至服务端
			console.log("[PayedResult]创建销售单结果:", create_result);
			util.simpleMsg(create_result.msg, !create_result.code);
			this.$saleFinied(result.data);
		} else {
			util.simpleMsg(result.msg, true);
		}
		this.resetSaleBill();
	}

	this.pay = async function() {
		if (!that.sale002 || that.sale002.length == 0) {
			util.simpleMsg("请先加购商品", true);
			return;
		}
		if (await that.$beforeFk()) {
			console.log("[Pay]已进入支付!");
			that.PayParamAssemble();
		} else {
			console.log("[Pay]未进入支付!");
		}
	}

	this.PayParamAssemble = function(sales) {
		that.log("[PayParamAssemble]支付参数组装...")
		let inputParm = {
			sale1_obj: that.sale001, //001 主单 数据对象
			sale2_arr: that.sale002, //002 商品 数据对象集合
			sale3_arr: that.sale003, //003 支付数据集合
			sale8_arr: that.sale008, //008水吧商品
			PayList: that.payed,
			actType: that.actType
		}
		console.log("sale001:", that.sale001);
		that.Page.$store.commit('set-location', inputParm);
		console.log("[PayParamAssemble]动作类型:", that.actType);
		uni.navigateTo({
			url: "../Payment/Payment",
			events: {
				FinishOrder: util.callBind(that, that.PayedResult)
			}
		})
	}

	//点击了菜单后获取到对应的 TYPE 然后根据 TYPE 切换销售页为对应模式
	this.SaleTypeClick = function(type) {
		console.log("[SaleTypeClick]销售页面切换类型:", type);
		that.SetType.call(that, type);
	}

	//初始化销售的操作
	this.$initSale = function(pm_newtype, pm_saleobj) {
		//在这里需要关闭 打开的插件
		console.log("[$InitSale]销售初始化开始!", {
			type: pm_newtype || this.clickSaleType
		});
		pm_newtype = pm_newtype || this.clickSaleType;
		Object.assign(this.current_type, pm_newtype);
		console.log("[$InitSale]设置当前销售类型:", this.current_type);
		this.bill_type = sale.saleBillType[this.current_type.xstype];
		console.log("[$InitSale]bill_type:", this.bill_type);
		this.xsType = this.current_type.xstype;
		//设置权限生效
		this.SetCurrentOperation(this.current_type.operation);
		this.CurrentTypeCall("$initSale", pm_saleobj ?? {});
		this.Page.$set(this.Page[this.pageName], "currentType", this.current_type);
		console.log("[$initSale]销售初始化完毕!");
	}

	this.cxBillinit = function() {

	}

	//统计生成促销发生
	this.mdcxfs = function() {

	}

	this.initcxSpRow = function() {

	}

	this.cxBillinit = function() {

	}

	/**
	 * 设置新的销售参数
	 * @param {*} inputParm sale123 数据对象，格式:{ sale001:{},sale002:[],sale003:[] }
	 * @param {*} pm_actType 销售模式 common.actTypeEnum 中的一种
	 */
	this.setNewParmSale = function(inputParm, pm_actType) {
		console.log("[SetNewParmSale]设置新的销售参数!", );
		// this.sale001 = {};
		var retparm = this.createNewBill();
		//将001缓存一份 在退货的时候进行使用
		var savaSale001 = {};
		Object.assign(savaSale001, inputParm.sale001)
		console.log("[SetNewParmSale]SALE001合并前:", retparm);
		Object.assign(inputParm.sale001, retparm);
		console.log("[SetNewParmSale]SALE001合并后:", retparm);
		inputParm.sale001.GSID = this.GSID;
		inputParm.sale002.forEach(item002 => {
			Object.assign(item002, retparm);
		})
		inputParm.sale003.forEach(item003 => {
			Object.assign(item003, retparm);
		})
		if (pm_actType == common.actTypeEnum.Refund) {
			console.log("[SetNewParmSale]原单信息:", savaSale001);
			inputParm.sale001.XS_GSID = savaSale001.GSID;
			inputParm.sale001.XS_KHID = savaSale001.KHID;
			inputParm.sale001.XS_DATE = savaSale001.DATE;
			inputParm.sale001.XS_POSID = savaSale001.POSID;
			inputParm.sale001.XS_BILL = savaSale001.BILL;
			inputParm.sale001.BILL = this.getBill();
			console.log("[SetNewParmSale]设置完毕!", {
				param: inputParm,
				sales: {
					sale1: this.sale001,
					sale2: this.sale002,
					sale3: this.sale003
				}
			});
		}
		return inputParm;
	}

	this.createNewBill = function() {
		var commonSaleParm = {};
		if (Object.keys(this.sale001).length == 0) { //BILL,KCDID  ,DPID,SALETIME,GCID
			console.log("[CreateNewBill]创建新单!");
			let newbill = this.getBill();
			let stime = this.getTime();
			commonSaleParm = {
				KHID: this.Storeid,
				SALEDATE: this.saledate,
				POSID: this.POSID,
				RYID: this.ryid,
				BILL: newbill,
				KCDID: this.KCDID,
				DPID: this.DPID,
				GCID: this.GCID,
				SALETIME: stime,
				YN_OK: 'N', //默认为 N
				YN_SC: 'X', //默认为 X
				YAER: _date.getDateByParam("Y"),
				MONTH: _date.getDateByParam("M"),
				WEEK: _date.getDateByParam("w"),
				TIME: _date.getDateByParam("h")
			};
			this.sale001 = new sale.sale001(commonSaleParm)
			this.sale001.GSID = this.GSID;
			console.log("[CreateNewBill]新单创建完毕!", this.sale001);
		} else {
			console.log("[CreateNewBill]创建新单参数!");
			commonSaleParm = {
				KHID: this.sale001.KHID,
				SALEDATE: this.sale001.SALEDATE,
				POSID: this.sale001.POSID,
				RYID: this.sale001.RYID,
				BILL: this.sale001.BILL,
				KCDID: this.sale001.KCDID,
				GCID: this.sale001.GCID,
				DPID: this.sale001.DPID,
				SALETIME: this.sale001.SALETIME,
				CLTIME: this.sale001.SALETIME,
				YN_OK: this.sale001.YN_OK, //默认为 N
				YN_SC: this.sale001.YN_SC, //默认为 X
				YAER: this.sale001.YAER,
				MONTH: this.sale001.MONTH,
				WEEK: this.sale001.WEEK,
				TIME: this.sale001.TIME
			}
		}
		return commonSaleParm;
	}

	//汇总sale002的所有内容
	this.sale002Sum = function(pm_input) {
		this.sale002.forEach(item => {
			that.log("循环中查看002");
			that.log(JSON.stringify(item));
			let keys = Object.keys(pm_input);
			for (var i = 0; i < keys.length; i++) {
				that.log(JSON.stringify(keys[i]));
				pm_input[keys[i]] += that.float(item[keys[i]], 2);
				that.log(JSON.stringify(pm_input));
			}
		})

		return pm_input;
	}

	//点击商品的详情触发的事件
	this.getSp = function(e) {
		console.log("[GetSp]获取商品详情:");
		let pm_spid = that.clikSpItem.selectSPID;
		let pm_yndgxp = e.currentTarget.dataset.yndgxp; //是否是改胚蛋糕
		let pm_qty = that.clikSpItem.inputQty;
		let find = false;
		let inqty = parseFloat(pm_qty);
		that.log(pm_spid + "#" + pm_qty + "pm_yndgxp")
		///检查是否已经添加过  如果已经添加过 直接修改某一行
		for (var row = 0; row < that.sale002.length; row++) {
			if (that.sale002[row].SPID == pm_spid) {
				find = that.updateSp(row, pm_spid, inqty)
				break;
			}
		}
		if (!find) {
			//STR1 商品名称 STR2 门店名称  YN_XPDG  ,YNZS, SPJGZ
			let newprm = that.createNewBill.call(that);
			// let new002 = new sale.sale002(newprm);
			let new002 = new sale.sale002();
			new002 = Object.cover(new002, newprm);
			console.log("[GetSp]生成新 sale002:", new002);
			new002.SPID = pm_spid;
			new002.NO = that.sale002.length;
			new002.STR1 = that.clikSpItem.SNAME;
			new002.UNIT = that.clikSpItem.UNIT;
			new002.STR2 = that.storeName;
			new002.YN_XPDG = pm_yndgxp;
			new002.SPJGZ = that.clikSpItem.SPJGZ;
			let price = that.spPrice[pm_spid].PRICE;
			pm_qty = that.float(pm_qty, 3);
			price = that.float(price, 2);
			new002.OPRICE = price;
			new002.PRICE = price;
			new002.QTY = pm_qty;
			new002.NET = that.float(pm_qty * price, 2);
			new002.DISCRATE = 0;
			new002.BARCODE = that.clikSpItem.SPID;
			that.sale002.push(new002);
			that.log("[GetSp]添加了商品", new002);
			//that.log("[GetSp]商品价格", that.spPrice);
		}
		that.SetManage("inputsp");
	}

	//大于0的时候修改,小于等于0删除
	this.updateSp = function(pm_row, pm_spid, pm_qty) {
		console.log("[UpdateSp]更新商品...");
		if (pm_row < this.currentOperation.lockRows) {
			util.simpleMsg("该商品已被锁定!", true)
			console.log("[UpdateSp]商品处于被锁定行，无法删除!");
			return;
		}
		if (pm_qty > 0) {
			this.sale002[pm_row].QTY = pm_qty;
			let price = this.float(this.sale002[pm_row].PRICE);
			this.sale002[pm_row].NET = this.float(pm_qty * price, 2);
			that.log("更新商品" + JSON.stringify(this.sale002[pm_row]))
		}
		if (pm_qty <= 0) {
			this.sale002.splice(pm_row, 1);
		}
		return true;
	}

	/**
	 * 显示购物车
	 * @param {*} e 
	 */
	this.ShowStatement = async function(e) {
		console.log("[ShowStatement]商品信息:", that.sale002);
		await that.SaleNetAndDisc();
		console.log("[ShowStatement]打开结算单:", that.sale002);
		that.SetManage("statement")
	}

	//计算sale002
	this.SaleNetAndDisc = async function() {
		let znet = 0
		if (that.currentOperation.ynCx) {
			await cx.Createcx(that.sale002);
		}
		if (that.currentOperation.ynFzCx) {
			this.computeFzCx();
		}
		if (that.currentOperation.Disc) {
			that.discCompute();
		}
		that.sale001.TLINE = that.sale002.length;
		var retx = that.sale002Sum({
			NET: 0,
			QTY: 0,
			DISCRATE: 0
		});
		// that.log("***************计算结果展示******************")
		// that.log(retx)
		// that.log("***************计算结果展示******************")
		that.sale001.ZNET = this.float(retx.NET, 2);
		that.sale001.TNET = this.float(retx.NET, 2);
		that.sale001.BILLDISC = this.float(retx.DISCRATE, 2);
		that.sale001.TLINE = this.float(retx.QTY, 2);
		//this.update();
	}

	//获取辅助促销的数据 因为需要依赖加购的商品产生的sale001 总价
	this.computeFzCx = function() {
		// console.log("001数据：", that.sale001);
		// console.log("总的商品价格：", that.spPrice);
		// 先获取辅助促销数据
		_main.GetFZCX(this.Storeid, res => {
			that.FZCX.oval = _main.GetFZCXNew(res, that.sale001, that.spPrice);
			console.log("重组后的辅助促销商品：", that.FZCX.oval);
		});
	}

	//使用特殊折扣进行计算
	this.discCompute = function() {
		// 计算商品的折扣值
		// console.log("002旧数据：", that.sale002);
		that.sale002 = _main.MatchZKDatas(this.Disc.val, that.sale002);
		console.log("002增加折扣后的新数据：", that.sale002);
	}

	//付款之前触发
	this.$beforeFk = function(pm_inputParm) {
		console.log("[BeforeFk]支付前触发:", pm_inputParm);
		//在付款前写这个防止左右更改！
		this.sale001.XSTYPE = this.xstype //付款的时候写
		this.sale001.BILL_TYPE = this.bill_type; //
		this.sale001.DKFID = this.DKF.cval.DKFID; //当前选择的大客户的编码
		this.sale001.CUID = this.HY.cval.hyId; //写会员编码
		//写大客户
		//code...
		//写会员
		//code...
		//可以使用的支付方式 
		//code...
		//如果 operation 中包含就弹出
		return new Promise(util.callBind(this, function(reslove, reject) {
			if (this.currentOperation.ynFzCx) {
				console.log("[BeforeFk]此模式包含辅助促销操作...");
				this.setComponentsManage(null, 'FZCX');
				console.log("[BeforeFk]辅助促销:", {
					count: Object.keys(this.FZCX.oval).length
				});
				uni.$once('close-FZCX', util.callBind(this, function(e) {
					console.log("[BeforeFk]辅助促销窗口关闭...");
					// if (e) {
					//追加辅助促销的差价和折扣
					if (Object.keys(this.FZCX.cval).length > 0) {
						this.sale001.TNET = this.float(this.sale001.TNET + this.FZCX
							.cval.payAmount, 2); //加上辅助促销的的差价
						this.FZCX.cval.data.forEach(r => {
							this.sale001.BILLDISC = this.float((this.sale001
									.BILLDISC || 0) + (r.ONET - r
									.CXNET),
								2);
						})
					}
					return reslove(this.CurrentTypeCall("$beforeFk",
						pm_inputParm)); //将对应模式的 $beforeFK 调用，根据返回布尔确认是否进行进入支付操作。

					// } else {
					// 	return reslove(false);
					// }
				}))
			} else {
				console.log("[BeforeFk]此模式不包含辅助促销操作...");
				return reslove(this.CurrentTypeCall("$beforeFk", pm_inputParm));
			}
		}));
	}

	//付款之后生成订单前触发
	this.$saleFinishing = function(sales) {
		console.log("[$SaleFinishing]支付完毕后触发:", sales);
		this.CurrentTypeCall("$saleFinishing", sales);
	}

	//付款之后生成订单后触发
	this.$saleFinied = function(sales) {
		console.log("[$SaleFinied]支付完毕后触发:", sales);
		this.CurrentTypeCall("$saleFinied", sales);
	}

	//重置销售单据
	this.resetSaleBill = util.callBind(this, function() {
		this.HY.cval = null;
		this.DKF.cval = null;
		this.Disc.cval = null;
		this.FZCX.oval = null;
		this.FZCX.cval = null;
		this.bill = null;
		this.sale001 = {};
		this.sale002 = [];
		this.sale003 = [];
		this.sale008 = [];
		this.ydsale001 = {};
		this.clikSpItem = {};
		this.payed = [];
		this.notFayType = [];
		this.communication_for_oracle = [];
		this.communication_for_sqlite = [];
		this.SetDefaultType();
		that.update()
		console.log("清空后的：", this.sale001);
	})

	//打印的方法
	this.$print = function(e) {

	}

	//
	this.SetDefaultType = function(type = "sale") {
		console.log("[SetDefaultType]设置默认类型:", type);
		this.SetType(type);
		console.log("[SetDefaultType]初始化销售单...");
		this.$initSale(XsTypeObj[type]);
		console.log("[SetDefaultType]设置默认展示组件...");
		this.SetManage(type);
	}

	//计算积分
	this.getJfcompute = function() {

	}

	//输入会员的方法
	this.InputHy = function() {

	}

	//输入大客户的方法
	this.InputDkf = function() {

	}
}


export default {
	XsTypeObj,
	GetSale
}
