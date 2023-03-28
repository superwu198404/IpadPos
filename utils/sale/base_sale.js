import sale from '@/utils/sale/saleClass.js';
import util from '@/utils/util.js';
import cx from '@/utils/cx/cxCount.js';
import _main from '@/api/business/main.js';
import _refund from '@/api/business/refundorder.js';
import _extract from '@/api/business/extract.js';
import _date from '@/utils/dateformat.js';
import _member from '@/api/hy/MemberInterfaces.js';
import _cake from '@/api/business/CakeYD.js';
import _Req from '@/utils/request.js';

import {
	onlineOrderReserve //更新表接口
} from '@/api/business/onlineorders.js';
import {
	Sale3Model,
	Sale3ModelAdditional
} from '@/bll/PaymentBusiness/bll.js'
import {
	CreateSaleOrder,
	PointUploadNew
} from '@/bll/Common/bll.js'
import {
	BatchInverse
} from '@/bll/RefundBusiness/bll.js';
import common from '@/api/common.js';
import saleClass from '@/utils/sale/saleClass.js';
import hy_query from '@/api/hy/hy_query.js';
import {
	RequestSend
} from '@/api/business/da.js'
// import { log } from 'console';
/**
 * 销售类型列表进入销售页面之后会根据此列表配置进行初始化
 */
var XsTypeObj = {
	//销售下单
	sale: { //普通销售模式，最基本的模式
		xstype: "1",
		clickType: "sale", //目前尚未用到
		nameSale: "销售",
		icon_open: require('@/images/xiaoshou.png'),
		icon_close: require("@/images/xiaoshou-hui.png"),
		operation: { //只设置为true的就好 其他的默认设置为false
			"HY": true, //是否可以录入会员
			"DKF": true, //是否可以打开录入大客户
			"ynCx": true, //是否进行可以进行促销  (默认可以促销,选择折扣后默认清除促销)
			"Disc": true, //是否可以打开录入折扣 (默认可以特殊折扣)
			"ynFzCx": true, //是否可以辅助促销
			"ynCancel": true, //是否可以退出当前销售模式 wy测试要求销售放出清空按钮
			"FZCX": true, //是否可以打开辅助促销组件
			"upload_point": true, //允许积分上传
			"inputsp": true, //是否可以输入商品
			"ynSKDisc": true, //是否可以计算特殊折扣
			"ynEdit": true, //当前业务能否编辑商品
			"ynResetCX": false, //是否清除了促销
			"showCXZK": false, //展示促销和折扣来源
			"showEdit": false, //展开编辑商品

			"sale": true, //从这里开始都是销售模式
			"sale_cake_reserve": true,
			"sale_reserve": true,
			"sale_reserve_extract": true,
			"sale_online_order": true,
			"sale_online_order_extract": true,
			"sale_credit": true,
			"sale_credit_settlement": true,
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
		},
		$click() {
			return true;
		},
		$initSale: function(params) {
			// console.log("ynCancel取消状态：", this.currentOperation.ynCancel);
			this.actType = common.actTypeEnum.Payment
			console.log("[sale-$initSale]params:", params);
			if (this.actType != common.actTypeEnum.Payment) {
				this.currentOperation["ynFzCx"] = false; //退款不允许辅助促销
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
			let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
			this.createNewBill(); //创建新的sale001
			this.sale001.XSTYPE = 1;
			
			if (this.sale001.TNET == 0) {
				this.payed = [];
				this.payed.push(Sale3ModelAdditional(Sale3Model({
					fkid: cash_info.FKID,
					type: 'XJ',
					bill: this.sale001.BILL,
					name: "现金",
					amount: 0
				}), { //业务配置字段（支付状态设定为成功）
					fail: false, //定金显示为成功
					show: false
				}));
			}
			console.log("[Sale]新单据生成完毕!", this.sale001);
			this.PayParamAssemble();
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
		},
		//支付完成以后
		$saleFinied: async function() {
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				console.log("查看商品打印商品名称：", item.STR1);
				item.SNAME = item.STR1;
			})
			console.log("查看商品打印数据：", arr2);
			let arr3 = [];
			try {
				arr3 = this.GetPayedResult().data.sale3_arr;
			} catch (e) {
				console.log("销售下单开始调用打印this.sale003异常", e);
				arr3 = this.sale003;
			}

			arr3.forEach(function(item, index) {
				try {
					item.SNAME = util.getStorage('PayWayList').find(c => c.fkid == item.FKID).name;
					item.balance = item.balance;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})
			console.log("销售下单开始调用打印", {
				arr2,
				arr3
			})
			this.Page.bluePrinter(this.sale001, arr2, arr3, "", "XS");
			//一些特殊的设置 如积分上传
			console.log("检测积分上传参数：", {
				upload_point: this.currentOperation.upload_point,
				hyid: this.HY.cval.hyId,
				sale1: this.sale001
			});
			if (this.currentOperation.upload_point && this.HY.cval.hyId) { //判断是否又上传积分的操作
				console.log("[PayedResult]准备上传会员积分数据...");
				let upload_result = await PointUploadNew(this.sale001, this.sale002, this.sale003);
				console.log("[PayedResult]上传会员积分结果:", upload_result);
			}
		},
	},
	//销售退单
	sale_return_good: {
		xstype: "2",
		clickType: "sale_return_good",
		nameSale: "销售退货",
		icon_open: require("@/images/xstd.png"),
		icon_close: require("@/images/xstd-wxz.png"),
		operation: {
			// "sale": true, //可以跳转到销售模式 此模式禁止跳转到销售
			"ynCancel": true, //是否可以退出当前销售模式
			"ynFzCx": false, //是否可以辅助促销
			"FZCX": false, //是否可以打开辅助促销组件
			"upload_point": true, //允许积分上传

			"sale_takeaway_reserve": true,
			"sale_message": true,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows": 0 //是否存在锁定行数
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Refund;
			console.log("[sale_return_good]params:", params);
			this.currentOperation["ynFzCx"] = false; //退款不允许辅助促销
			this.ComponentsManage.FZCX = false;
			this.sale001 = Object.cover(new sale.sale001(), (params.sale1 ?? {}));
			this.sale002 = (params.sale2 ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
			this.sale003 = (params.sale3 ?? []).map(sale3 => Object.cover(new sale.sale003(), sale3));
			//给全局大客户对象赋值
			console.log("退单给大客户信息赋值：", this.sale001.DKFID);
			if (this.sale001.DKFID) {
				this.DKF.val.DKFID = this.sale001.DKFID;
			}
			console.log("退单给大客户信息赋值：", this.DKF.val);
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund);
			console.log("[sale_return_good]SALES:", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003
			});
			//给全局会员对象赋值
			if (this.sale001.CUID) {
				let obj = {
					hyId: this.sale001.CUID
				};
				this.HY.val = obj;
			}
			this.ShowStatement();
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
			// this.setNewParmSale({
			// 	sale001: this.sale001,
			// 	sale002: this.sale002,
			// 	sale003: this.sale003
			// }, common.actTypeEnum.Refund)
			// console.log("[SaleFinishing]销售退货处理完毕!", {
			// 	sale001: this.sale001,
			// 	sale002: this.sale002,
			// 	sale003: this.sale003
			// });
			return true;
		},
		//支付完成中
		$saleFinishing: function(result) {
			this.ClearDiscount(this.sale001, this.sale002);
			this.CombineCouponAndNoOrginPay(this.sale003);
		},
		//支付完成以后
		$saleFinied: async function() {
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})
			let arr3 = this.sale003;
			let fkdaRes = this.FKDA_INFO;
			arr3.forEach(function(item, index) {
				try {
					//item.SNAME = util.getStorage('PayWayList').find(c => c.fkid == item.FKID).name;
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = item.balance;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})
			console.log("销售退单开始调用打印", {
				arr2,
				arr3
			})
			this.Page.bluePrinter(this.sale001, arr2, arr3, "", "TD");
			//一些特殊的设置 如积分上传
			if (this.currentOperation.upload_point && this.HY.cval.hyId) { //判断是否又上传积分的操作
				console.log("[PayedResult]准备上传会员积分数据...");
				let upload_result = await PointUploadNew(this.sale001, this.sale002, this.sale003);
				console.log("[PayedResult]上传会员积分结果:", upload_result);
			}
		},
	},
	//预订单下单
	sale_reserve: {
		xstype: "3",
		clickType: "sale_reserve",
		nameSale: "预定",
		icon_open: require("@/images/yuding.png"),
		icon_close: require("@/images/yuding-hui.png"),
		operation: {
			"HY": true, //是否可以录入会员
			"Disc": true, //是否可以打开录入折扣
			"ynFzCx": false, //是否可以辅助促销 预定不开启
			"ynCx": true, //是否进行可以进行促销
			"ynCancel": true, //是否可以退出当前销售模式
			"ynSKDisc": true, //是否可以计算手工折扣
			"ynEdit": true, //当前业务能否编辑商品
			"showEdit": false, //展开编辑商品
			"ynResetCX": false, //是否清除了促销
			"showCXZK": false, //展示促销和折扣来源

			// "sale": true, //从这里开始都是销售模式
			"sale_reserve": true,
			// "sale_credit": true,
			"sale_return_good": false,
			"sale_reserve_cancel": false,
			"sale_takeaway": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"tools": true,
			// "sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true //是否可以输入商品
		},
		$click() {
			///******如果sale008.length>0 这里不能进行切换
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
			let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
			console.log("[BeforeFk]预订单录入:", this.sale001);
			this.sale001.XSTYPE = this.xsType; //把当前的销售类型赋值给新单
			this.setComponentsManage(null, 'openydCustmInput'); //打开预定录入信息
			console.log("[BeforeFk]预定录入信息初始化:", this.sale001);
			this.ydsale001 = Object.cover(new sale.ydsale001(), this.sale001);
			console.log("[SaleReserve]生成预定支付信息...");
			this.payed = [];
			this.payed.push(Sale3ModelAdditional(Sale3Model({
				fkid: cash_info.FKID,
				type: 'XJ',
				bill: this.sale001.BILL,
				name: "现金",
				amount: 0
			}), { //业务配置字段（支付状态设定为成功）
				fail: false, //定金显示为成功
				show: false
			}));
			console.log("[SaleReserve]生成预定支付信息成功!");
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
			let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
			this.sale001.ZNET = this.$total_amount; //支付后把定金给到 sale001 对应的字段上
			this.sale001.TNET = this.$total_amount; //支付后把定金给到 sale001 对应的字段上
			this.ydsale001 = Object.cover(this.ydsale001, this.sale001);
			this.ydsale001.BMID = this.ydsale001.BMID || "80000000"; //默认
			if (result.sale1_obj.DNET !== 0) { //定金为 0
				console.log("[SaleFinishing]过滤掉现金为 0 的记录:", this.sale003);
				this.sale003 = this.sale003.filter(s3 => !(s3.FKID === cash_info.FKID && Number(s3.AMT) === 0));
				console.log("[SaleFinishing]过滤后的记录:", this.sale003);
			}
			console.log("[SaleFinishing]预订单生成完毕!", {
				ydsale1: this.ydsale001,
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			});
		},
		//支付完成以后
		$saleFinied: function() {
			///******新增预定提取和预定取消时验证预定单的状态是否变更过，是否要进行判断有待商榷	
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})

			let fkdaRes = this.FKDA_INFO;
			let arr3 = [];
			try {
				arr3 = this.GetPayedResult().data.sale3_arr;
			} catch (e) {
				console.log("预定下单开始调用打印this.sale003异常", e);
				arr3 = this.sale003;
			}

			arr3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = item.balance;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})

			console.log("预定下单开始调用打印", {
				arr2,
				arr3
			})
			let printerPram = {
				"PRINTNUM": 2,
				"XSTYPE": "YD"
			};
			this.Page.ydBluePrinter(this.sale001, arr2, arr3, this.ydsale001, printerPram);
		},
		CloseReserveDrawer: function() {
			console.log("[CloseReserveDrawer]结算单打开...");
			this.setComponentsManage(null, "statement");
		},
		ReserveInfoInput: function(sale1) {
			console.log("[ReserveInfoInput]预定提取录入完成,准备进入支付页面...", sale1);
			Object.cover(this.sale001, sale1); //用于 sale001,如 DNET 赋值
			Object.cover(this.ydsale001, sale1); //用于 ydsale001
			console.log("[ReserveInfoInput]预定提取录入信息赋值完毕!", {
				ydsale1: this.ydsale001,
				sale1: this.sale001
			});
			this.sale001.$total_amount = this.sale001.DNET;
			this.$total_amount = this.sale001.DNET;
			console.log("[CloseReserveDrawer]预定录入关闭...");
			this.setComponentsManage(null, "statement");
			this.PayParamAssemble();
		}
	},
	//预订单提取
	sale_reserve_extract: {
		xstype: "5",
		clickType: "sale_reserve_extract",
		nameSale: "预定提取",
		icon_open: require("@/images/xz-ydtq.png"),
		icon_close: require("@/images/wxz-ydtq.png"),
		operation: {
			// "sale": true, //此模式禁止跳转到销售
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"FZCX": true, //是否可以打开辅助促销组件
			"ynFzCx": true, //是否可以辅助促销
			"ynSKDisc": true, //是否可以计算手工折扣
			"ynCancel": true, //是否可以退出当前销售模式
			"ynEdit": true, //当前业务能否编辑商品
			"showEdit": false, //展开编辑商品

			"tools": true,
			"upload_point": true,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true, //是否可以输入商品
		},
		$initSale: function(params) { //预定提取需要传入 ydsale001、syssale002，syssale003 信息
			this.allOperation.actType = common.actTypeEnum.Payment;
			console.log("[sale_reserve_extract]PARAMS:", params);
			this.old_bill = params.sale1.BILL;
			console.log("[sale_reserve_extract]SALE001:", params.sale1);
			this.sale001 = Object.cover(new sale.sale001(), (params.sale1 ?? {}));
			this.sale002 = (params.sale2 ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
			this.sale003 = (params.sale3 ?? []).map(sale3 => Object.cover(new sale.sale003(), sale3));
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund);
			this.ClearDiscount(this.sale001, this.sale002); //初始化清除折扣信息 提取会增加商品和辅助促销 会产生新的折扣值
			this.ShowStatement();
			console.log("[InitSale]预定提取，已设置锁定行...", this.sale002.length);
			this.currentOperation.lockRows = this.sale002.length;
			//合并 sale3 不含 ZKLX 的 记录
			let combine = this.sale003.filter(s2 => !s2.ZKLX); //筛选需要被合并的类型
			let list = this.sale003.filter(s2 => s2.ZKLX); //筛选不需要被合并的类型
			console.log("[InitSale]预定提取支付记录合并:", {
				sale3: this.sale003,
				combine,
				list
			});
			this.raw_order = []
			if (combine.length > 0) {
				let sale3 = Object.assign({}, combine[0]); //取出第一位
				let total = 0;
				combine.forEach(i => total += Number(i.AMT));
				sale3.AMT = total; //合并金额部分
				list.push(sale3);
			}
			this.raw_order = list;
			this.raw_order?.forEach(s3 => s3.FKID = 'ZG03') //预定金类型
			console.log("[BeforeFk]预定提取信息初始化:", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003,
				sale3_raw: this.raw_order
			});
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
			console.log("[SaleReserve]预定提取下一步...", this.sale001);
			let tnet = Number(this.sale001.TNET),
				dnet = Number(this.sale001.DNET)
			if (!isNaN(tnet) && !isNaN(dnet) && (tnet < dnet)) { //定金是无法退还的，所以提取的时候商品如果总值没达到定金金额是得提示让其继续加购商品才行
				util.simpleMsg("当前金额小于定金金额,请继续加购商品!", 'none')
				return false;
			}
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
				this.payed = [];
				this.payed.push(Sale3ModelAdditional(Sale3Model({
					fkid: 'ZG03',
					type: 'YDJ',
					bill: this.sale001.BILL,
					name: "预定金",
					amount: this.sale001.DNET
				}), { //业务配置字段（支付状态设定为成功）
					fail: false //定金显示为成功
				}));
				console.log("[SaleReserve]生成预定支付信息成功!", {
					sale1: this.sale001,
					sale2: this.sale002,
					sale3: this.sale003,
					payed: this.payed
				});
			}
			this.PayParamAssemble();
		},
		$saleFinishing: function(result) { //生成yd
			console.log("[SaleFinishing]预定生成中...", this.sale003);
			let reserve_amount = 0; //预定金额
			this.sale003.filter(i => i.FKID !== 'ZG03')?.forEach(s3 => reserve_amount += Number(s3.AMT));
			console.log("[SaleFinishing]预定金额为:", reserve_amount);
			console.log("[SaleFinishing]此单实付金额为:", this.sale001.TNET - reserve_amount);
			this.sale001.TNET = reserve_amount; //把此单的实际支付金额给到 TNET （预定提取后的TNET为整单金额减去定金）
			this.sale003 = this.sale003.filter(i => i.FKID !== 'ZG03').concat((util.callBind(this, function() {
				let start_no = (this.sale003.filter(i => i.FKID !== 'ZG03').map(i => i.NO)
					?.pop() ?? -1) + 1;
				console.log("[SaleFinishing]新起始序号:", start_no);
				this.raw_order?.forEach(i => {
					i.NO = start_no;
					start_no++;
				})
				return this.raw_order || [];
			}))()); //删除 $beforeFk 中生成的 zg03 的信息
			this.communication_for_oracle.push(
				`UPDATE ydsale001 set YD_STATUS ='2',ID_RY_TH ='${this.ryid}' , SJTHDATE = TO_DATE('${this.getTime()}', 'SYYYY-MM-DD HH24:MI:SS'), SJTHGSID = '${this.GSID}', SJTHGCID = '${this.GCID}', SJTHDPID = '${this.DPID}', SJTHKCDID = '${this.KCDID}', SJTHKHID = '${this.Storeid}', SJTHPOSID = '${this.POSID}', SJTHBILL = '${this.sale001.BILL}' WHERE bill ='${this.old_bill}';`
			);
			console.log("[SaleFinishing]生成合并后的 sale3 数据:", this.sale003);
			delete this.old_bill;
			// this.ClearDiscount(this.sale001, this.sale002); //清除折扣信息
		},
		async $saleFinied(sales) {
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})
			let arr3 = this.sale003;
			let fkdaRes = this.FKDA_INFO;
			arr3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = item.balance;
				} catch (e) {
					item.SNAME = "";
				}
			})
			console.log("预定提取开始调用打印", {
				arr2,
				arr3
			})
			let printerPram = {
				"PRINTNUM": 1,
				"XSTYPE": "YDTQ"
			};
			this.Page.ydBluePrinter(this.sale001, arr2, arr3, this.ydsale001, printerPram);
			//一些特殊的设置 如积分上传
			if (this.currentOperation.upload_point && this.HY.cval.hyId) { //判断是否又上传积分的操作且有会员id
				console.log("[PayedResult]准备上传会员积分...");
				let upload_result = await PointUploadNew(this.sale001, this.sale002, this.sale003);
			}
		},
	},
	//预订单取消
	sale_reserve_cancel: {
		xstype: "4",
		clickType: "sale_reserve_cancel",
		nameSale: "预定取消",
		icon_open: require("@/images/ydqx.png"),
		icon_close: require("@/images/ydqx-wxz.png"),
		operation: {
			// "sale": true,//此模式禁止跳转到销售
			"ynCancel": true, //是否可以退出当前销售模式
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows": 0, //是否存在锁定行数
		},
		$initSale: function(params) {
			console.log("[InitSale]预定取消初始化开始!", params);
			this.actType = common.actTypeEnum.Refund;
			this.old_bill = params.sale1.BILL;
			this.allOperation.actType = false;
			this.sale001 = Object.cover(new sale.sale001(), (params.sale1 ?? {}));
			this.sale001.BMID = ""; //因为数据源取得是 ydsale1，导致会携带默认的 BMID，而 sale1 是不需要默认的大客户的
			this.sale002 = (params.sale2 ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
			this.sale003 = (params.sale3 ?? []).map(sale3 => Object.cover(new sale.sale003(), sale3));
			console.log("[InitSale]预定取消，已设置锁定行...", this.sale002.length);
			this.currentOperation.lockRows = this.sale002.length;
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund);
			this.ShowStatement();
			console.log("[BeforeFk]预定取消信息初始化:", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003
			});
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
			console.log("[SaleFinishing]预定取消旧单更新:", this.old_bill);
			console.log("[SaleFinishing]预定取消获取的CurrentType:", this.current_type);
			this.communication_for_oracle.push(
				`UPDATE ydsale001 set YD_STATUS ='3',ID_RY_TH ='${this.ryid}', SJTHDATE = TO_DATE('${this.getTime()}', 'SYYYY-MM-DD HH24:MI:SS'), SJTHGSID = '${this.GSID}', SJTHGCID = '${this.GCID}', SJTHDPID = '${this.DPID}', SJTHKCDID = '${this.KCDID}', SJTHKHID = '${this.Storeid}', SJTHPOSID = '${this.POSID}', SJTHBILL = '${this.sale001.BILL}' WHERE bill ='${this.old_bill}';`
			);
			this.sale001.XSTYPE = this.current_type.xstype;
			this.sale001.TNET = -this.sale001.DNET;
			this.sale001.ZNET = -this.sale001.DNET;
			this.sale001.TLINE = this.sale002.length || 0;
			this.sale002.forEach(i => {
				i.QTY = Math.abs(Number(i.QTY) || 0);
				i.NET = Math.abs(Number(i.NET) || 0);
			})
			// this.sale003.forEach(i => {
			// 	i.FAMT = Math.abs(Number(i.FAMT) || 0);
			// 	i.RATE = Math.abs(Number(i.RATE) || 0);
			// 	i.DISC = Math.abs(Number(i.DISC) || 0);
			// }); //由支付页面payment内部 统一处理 
			delete this.old_bill;
			this.ClearDiscount(this.sale001, this.sale002); //清除折扣信息
			this.CombineCouponAndNoOrginPay(this.sale003);
			console.log("[SaleFinishing]生成合并后的 sale3 数据:", this.sale003);
		},
		async $saleFinied(sales) {
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})
			let arr3 = [];
			let fkdaRes = this.FKDA_INFO;
			try {
				arr3 = this.GetPayedResult().data.sale3_arr;
			} catch (e) {
				console.log("预订单取消开始调用打印this.sale003异常", e);
				arr3 = this.sale003;
			}

			arr3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = item.balance;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})
			console.log("预订单取消开始调用打印", {
				arr2,
				arr3
			})
			let printerPram = {
				"PRINTNUM": 1,
				"XSTYPE": "YDQX"
			};
			this.Page.ydBluePrinter(this.sale001, arr2, arr3, this.ydsale001, printerPram);
		},
	},
	//蛋糕预定
	sale_cake_reserve: {
		close: false,
		xstype: "3",
		clickType: "sale_cake_reserve",
		nameSale: "蛋糕图册",
		icon_open: require("@/images/dgaoyud.png"),
		icon_close: require("@/images/dgaoyud-wxz.png"),
		condition: [],
		imgCurrent: 0,
		afterPay: "sale_cake_reserve", //支付后要跳转的模式
		condition_output: function() {
			let result = [];
			this.condition.forEach(i => {
				i.DATA.forEach(o => {
					result.push({
						ID: o._ID
					})
				})
			})
			console.log("[condition_output]输出格式调整:", result);
			return result;
		},
		filter: false,
		yn_showDetail: false,
		operation: {
			"HY": true, //是否可以录入会员
			"Disc": true, //是否可以打开录入折扣
			"ynFzCx": false, //是否可以辅助促销 预定不开启
			"ynCx": true, //是否进行可以进行促销
			"ynCancel": true, //是否可以退出当前销售模式
			"ynSKDisc": true, //是否可以计算手工折扣
			"ynEdit": true, //当前业务能否编辑商品
			"showEdit": false, //展开编辑商品
			"ynResetCX": false, //是否清除了促销
			"showCXZK": false, //展示促销和折扣来源

			"sale_cake_reserve": true,
			"sale_reserve": false,
			"sale_return_good": false,
			"sale_reserve_cancel": false,
			"sale_takeaway": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"tools": true,
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true //是否可以输入商品
		},
		$click() {
			console.log("[sale_cake_reserve]蛋糕预定信息录入操作!");
			this.show_cake_reservation = true;
			return true;
		},
		$initSale: async function() {
			console.log("出实话this:", this.mode_info);

			this.mode_info.sale_cake_reserve.yn_showDetail = false; //初始化时关闭之前那打开的详情页
			console.log("[sale_cake_reserve]蛋糕预定初始化");
			this.actType = common.actTypeEnum.Payment;
			this.CakeBQList = await _cake.GetDGBQ();
			// this.CakeList = await _cake.GetCakeList(); 
			//数据比组件渲染要晚
			this.CakeList = this.cakeFilter();
			this.mode_info.sale_cake_reserve.condition = []; //清除一下已选标签数据
			this.CheckTagList = [];
			console.log("标签数据：", this.CakeBQList);
			console.log("蛋糕数据：", this.CakeList);
		},
		$print: function() { //对打印的控制
			return {
				tName: "蛋糕预定小票", // 名称
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
			let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
			console.log("[BeforeFk]预订单录入:", this.sale001);
			this.sale001.XSTYPE = this.xsType; //把当前的销售类型赋值给新单
			this.setComponentsManage(null, 'openydCustmInput'); //打开预定录入信息
			console.log("[BeforeFk]预定录入信息初始化:", this.sale001);
			this.ydsale001 = Object.cover(new sale.ydsale001(), this.sale001);
			console.log("[SaleReserve]生成预定支付信息...");
			this.payed = [];
			this.payed.push(Sale3ModelAdditional(Sale3Model({
				fkid: cash_info.FKID,
				type: 'XJ',
				bill: this.sale001.BILL,
				name: "现金",
				amount: 0
			}), { //业务配置字段（支付状态设定为成功）
				fail: false, //定金显示为成功
				show: false
			}));
			console.log("[SaleReserve]生成预定支付信息成功!");
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
			let cash_info = util.getStorage("FKDA_INFO").find(info => info.MEDIA == '1');
			this.sale001.ZNET = this.$total_amount; //支付后把定金给到 sale001 对应的字段上
			this.sale001.TNET = this.$total_amount; //支付后把定金给到 sale001 对应的字段上
			this.ydsale001 = Object.cover(this.ydsale001, this.sale001);
			this.ydsale001.BMID = this.ydsale001.BMID || "80000000"; //默认
			if (result.sale1_obj.DNET !== 0) { //定金为 0
				console.log("[SaleFinishing]过滤掉现金为 0 的记录:", this.sale003);
				this.sale003 = this.sale003.filter(s3 => !(s3.FKID === cash_info.FKID && Number(s3.AMT) === 0));
				console.log("[SaleFinishing]过滤后的记录:", this.sale003);
			}
			console.log("[SaleFinishing]预订单生成完毕!", {
				ydsale1: this.ydsale001,
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			});
		},
		//支付完成以后
		$saleFinied: function() {
			///******新增预定提取和预定取消时验证预定单的状态是否变更过，是否要进行判断有待商榷	
			//调用打印
			this.sale002.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})
			let fkdaRes = this.FKDA_INFO;
			let sale3 = this.GetPayedResult()?.data?.sale3_arr ?? this.sale003;
			sale3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = item.balance;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})
			console.log("蛋糕预定下单开始调用打印", {
				sale002: this.sale002,
				sale3
			})

			this.mode_info.sale_cake_reserve.yn_showDetail = false; //支付完成后关闭蛋糕详情
			console.log("蛋糕详情关闭：", this.mode_info.sale_cake_reserve.yn_showDetail);

			let printerPram = {
				"PRINTNUM": 2,
				"XSTYPE": "YD"
			};
			this.Page.ydBluePrinter(this.sale001, this.sale002, sale3, this.ydsale001, printerPram);
		},
		//退出确认
		CloseCakeReservation: function() {
			util.simpleModal('提示', '请输入校验密码', util.callBind(this, function(is_confirm, data) {
				console.log("[ReserveInfoInput]密码确认:", {
					is_confirm,
					data,
					userinfo: getApp().globalData?.userinfo
				});
				if (is_confirm) {
					if (data.content == getApp().globalData?.userinfo?.pwd) {
						console.log("[CloseCakeReservation]蛋糕预定关闭...");
						this.show_cake_reservation = false;
						this.CakeList = []; //清空传入的蛋糕数据
						this.resetSaleBill(); //清空一下
						// this.SetDefaultType();
					} else {
						if (data.content != getApp().globalData?.userinfo?.pwd)
							util.simpleMsg("密码错误", true)
					}
				}
			}), true)
		},
		//重置条件
		ResetCondition: function(condition) {
			console.log("[ResetCondition]重置选择条件...");
			console.log("[ResetCondition]参数信息:", {
				check_list: this.CheckTagList,
				condition,
				cake_tags: this.CakeTagList,
				kinds: this.CakeBQList
			});
			condition?.splice(0, condition?.length);
			this.CakeTagList?.map(i => i._CHECK = false);
			this.CheckTagList?.splice(0, this.CheckTagList?.length);
			this.CakeBQList?.map((i, ii) => {
				if (ii == 0) {
					i.CHECK = true;
					this.CakeTagList = i.DATA;
				} else {
					i.CHECK = false;
				}
				i.DATA?.map(o => o._CHECK = false);
			});
		},
		//确认条件
		ConfirmCondition: function(condition) {
			console.log("[ConfirmCondition]确认选择条件...");
			condition.splice(0, condition.length);
			console.log("[ConfirmCondition]参数信息:", {
				check_list: this.CheckTagList,
				condition,
				cake_tags: this.CakeTagList
			});
			this.CakeBQList?.forEach(i => {
				let cake = i.DATA.filter(o => o._CHECK);
				console.log("[ConfirmCondition]当前类别:", i);
				if (cake.length) {
					let check = Object.assign({}, i);
					check.DATA = cake;
					condition?.push(check);
				}
			});
			console.log("[ConfirmCondition]确认条件:", condition);
			let bqlist = this.mode_info.sale_cake_reserve.condition_output();
			console.log("[ConfirmCondition]标签条件输出信息:", bqlist);
			this.CakeList = this.cakeFilter(bqlist); //根据标签筛选蛋糕数据
			console.log("[ConfirmCondition]标签条件筛选结果:", this.CakeList);
			if (this.CakeList && this.CakeList.length == 0) {
				util.simpleMsg("无符合条件数据", true);
			} else {
				util.simpleMsg("筛选数据成功");
			}
			this.mode_info.sale_cake_reserve.filter = !this.mode_info.sale_cake_reserve.filter;
		},
		DeleteCheckedTag: function(item) {
			console.log("[DeleteCheckedTag]当前删除的标签:", item);
			this.mode_info.sale_cake_reserve.condition.forEach(i => {
				console.log("[DeleteCheckedTag]当前是否存在:", i.DATA.indexOf(item));
				i.DATA.splice(i.DATA.indexOf(item), 1);
			})
		},
		DeleteCheckingTag: function(item) {
			console.log("[DeleteCheckingTag]当前删除的标签:", item);
			this.CheckTagList.splice(this.CheckTagList.indexOf(item), 1);
			this.CakeBQList.forEach(i => {
				console.log("[DeleteCheckingTag]当前类别:", i);
				let info = i.DATA.find(o => o == item);
				if (info) info._CHECK = false;
			})
		},
		CloseReserveDrawer: function() {
			console.log("[CloseReserveDrawer]结算单打开...");
			this.setComponentsManage(null, "statement");
		},
		ReserveInfoInput: function(sale1) {
			console.log("[ReserveInfoInput]预定提取录入完成,准备进入支付页面...", sale1);
			Object.cover(this.sale001, sale1); //用于 sale001,如 DNET 赋值
			Object.cover(this.ydsale001, sale1); //用于 ydsale001
			console.log("[ReserveInfoInput]预定提取录入信息赋值完毕!", {
				ydsale1: this.ydsale001,
				sale1: this.sale001
			});
			this.sale001.$total_amount = this.sale001.DNET;
			this.$total_amount = this.sale001.DNET;
			util.simpleModal('提示', '请输入密码校验', util.callBind(this, function(is_confirm, data) {
				console.log("[ReserveInfoInput]密码确认:", {
					is_confirm,
					data,
					userinfo: getApp().globalData?.userinfo
				});
				if (is_confirm) {
					if (data.content == getApp().globalData?.userinfo?.pwd) {
						console.log("[CloseReserveDrawer]预定录入关闭...");
						this.setComponentsManage(null, "statement");
						this.PayParamAssemble();
					} else {
						if (data.content != getApp().globalData?.userinfo?.pwd) util.simpleMsg(
							"密码错误",
							true)
					}
				}
			}), true)

		},

		//dgyd展示预定蛋糕详情
		ShowCakeDetail: function(e) {
			// that.SetManage("inputsp");
			// util.simpleMsg("当前蛋糕：" + e.DGXLID);
			console.log("蛋糕信息：", e);
			if (e) { //展开详情
				console.log("展开详情");
				this.mode_info.sale_cake_reserve.yn_showDetail = true;
				this.initClikSpItem(e);
				console.log("详情渲染对象：", this.clikSpItem);
			} else { //关闭详情
				console.log("关闭详情");
				// this.condition = []; //清空已选标签 xyj 要求不清除 待后续观察清除原因
				// this.yn_showDetail = false;
				XsTypeObj.sale_cake_reserve.yn_showDetail = false;

			}
		},
		//选择详情图片顶部切换
		ChooseDetail: function(e) {
			console.log("切换索引：", e);
			// console.log("切换索引1：", this);
			this.imgCurrent = e;
		}
	},
	//线上订单提取
	sale_online_order_extract: {
		xstype: "8",
		clickType: "sale_online_order_extract",
		nameSale: "线上订单提取",
		icon_open: require("@/images/xsddtiqu.png"),
		icon_close: require("@/images/xsddtiqu-wxz.png"),
		operation: {
			"ynCancel": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Payment;
			this.old_bill = params.sale1.BILL;
			console.log("[sale_online_order_extract]线上订单sale信息:", params);
			this.sale001 = Object.cover(new sale.sale001(), (params.sale1 ?? {}));
			this.sale002 = params.sale2.map(s2 => {
				let new_s2 = Object.cover(new sale.sale002(), s2);
				new_s2.SALETIME = new_s2.SALETIME.replace('T', ' ');
				new_s2.SALEDATE = new_s2.SALEDATE.replace('T', ' ');
				new_s2.STR1 = s2.GOODNAME ?? "";
				return new_s2;
			});
			this.sale003 = params.sale3.map(s3 => {
				let new_s3 = Object.cover(new sale.sale003(), s3)
				new_s3.SALETIME = new_s3.SALETIME.replace('T', ' ');
				new_s3.SALEDATE = new_s3.SALEDATE.replace('T', ' ');
				new_s3.FKNAME = s3.SNAME ?? "";
				util.hidePropety(new_s3, 'FKNAME');
				new_s3.FKID = 'ZG03';
				return new_s3
			});
			console.log("[InitSale]FKNAME:", this.sale003.map(i => i.FKNAME));
			this.reserve_param = params.reserve_params;
			console.log("[InitSale]线上订单提货参数:", this.reserve_param);
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund);
			this.sale001.CUSTMTIME = this.sale001.CUSTMTIME.replace('T', ' ');
			this.sale001.XS_DATE = this.sale001.XS_DATE.replace('T', ' ');
			this.ShowStatement();
			this.payed = [];
			for (let s3 of this.sale003) {
				this.payed.push(Sale3ModelAdditional(Sale3Model({
					fkid: s3.FKID,
					type: '',
					bill: s3.BILL,
					name: s3.SNAME,
					amount: s3.AMT
				}), { //业务配置字段（支付状态设定为成功）
					fail: false //定金显示为成功
				}));
			}
			console.log("[sale_online_order_extract]线上订单初始化完毕:", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003
			});
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
		$beforeFk: function() {
			return true;
		},
		$saleFinishing: function(result) { //生成yd
			this.sale001.DNET = this.sale001.TNET; //线上订单的 DNET 为下单时候的付款金额
			this.sale001.ZNET = this.sale001.TNET; //线上订单的 ZNET 为下单时候的付款金额
			this.sale001.BILLDISC = 0;
			this.sale001.TCXDISC = 0;
			this.sale001.TDISC = 0;
			this.sale002.forEach(i => {
				i.DISCRATE = 0;
				i.DISC = 0;
				i.CXDISC = 0;
			});
			console.log("[SaleFinishing]线上提取生成中...", this.sale003);
			this.communication_for_oracle.push(
				`UPDATE ydsale001 set YD_STATUS ='2', SJTHDATE = TO_DATE('${this.getDate()}', 'SYYYY-MM-DD HH24:MI:SS'), SJTHGSID = '${this.GSID}', SJTHGCID = '${this.GCID}', SJTHDPID = '${this.DPID}', SJTHKCDID = '${this.KCDID}', SJTHKHID = '${this.Storeid}', SJTHPOSID = '${this.POSID}', SJTHBILL = '${this.sale001.BILL}' WHERE bill ='${this.old_bill}';`
			);
			console.log("[SaleFinishing]生成合并后的 sale3 数据:", this.sale003);
			delete this.old_bill;
		},
		async $saleFinied(sales) {
			console.log("[SaleFinied]线上提取提货...");
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})
			let arr3 = this.sale003;
			//查询支付方式
			let fkdaRes = this.FKDA_INFO;
			arr3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = 0;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})
			console.log("线上订单提取开始调用打印", {
				arr2,
				arr3
			})
			this.Page.bluePrinter(this.sale001, arr2, arr3, "", "XSDDTQ");

			onlineOrderReserve(this.reserve_param, util.callBind(this, function(res) {
				console.log("[SaleFinishing]提取成功！", res);
			}), util.callBind(this, function(err) {
				util.simpleMsg(err.msg, true);
			}));
			console.log("[SaleFinied]线上提取积分上传...");
			//一些特殊的设置 如积分上传
			if (this.currentOperation.upload_point && this.HY.cval.hyId) { //判断是否又上传积分的操作且有会员id
				console.log("[PayedResult]准备上传会员积分...");
				let upload_result = await PointUploadNew(this.sale001, this.sale002, this.sale003);
			}
		},
	},
	//赊销
	sale_credit: {
		xstype: "6",
		clickType: "sale_credit",
		nameSale: "赊销",
		icon_open: require("@/images/xstd.png"),
		icon_close: require("@/images/xstd-wxz.png"),
		operation: {
			"HY": false, //是否可以录入会员
			"DKF": true, //是否可以打开录入大客户
			"Disc": true, //是否可以打开录入折扣
			"ynFzCx": false, //是否可以辅助促销
			"ynCancel": true, //是否可以退出当前销售模式
			"FZCX": false, //是否可以打开辅助促销组件
			"ynCx": false, //是否进行可以进行促销
			"ynSKDisc": true, //是否可以计算手工折扣
			"ynEdit": true, //当前业务能否编辑商品
			"showEdit": false, //展开编辑商品

			// "sale": true,
			"sale_takeaway_reserve": true,
			"sale_message": true,
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true //是否可以输入商品
		},
		$initSale: function(params) {
			this.actType = common.actTypeEnum.Payment
			//销售切换到赊销时清除促销折扣等数据
			this.sale002.map(r => {
				r.NET = this.float(r.NET + r.DISCRATE, 2);
				r.PRICE = this.float(r.NET / r.QTY, 2);
				r.DISCRATE = 0;
				r.CXDISC = 0;
				r.YN_CXDISC = "N";
			})
			//清除一下会员信息
			this.HY.val = {};
			uni.$emit('set-member', this.HY.val);
			console.log("[sale-$initSale]params:", params);
		},
		///对打印的控制
		$print: function(sale001, sale002, sale003) {
			return {
				tName: "赊销小票", // 名称
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
			//生成赊销单
			this.sxsale001 = Object.cover(new sale.sxsale001(), this.sale001);
			console.log("[sale_reserve-$BeforeFk]预定信息生成:", {
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003,
				sxsale001: this.sxsale001
			});
			if (this.sale002.length > 0 && this.sale001.TNET >= 0) { // 部分商品金额为0
				console.log("[sale_credit]提前组装赊销已支付的数据...");
				this.payed = [];
				this.payed.push(Sale3ModelAdditional(Sale3Model({
					fkid: 'ZG01',
					type: 'MDSX',
					bill: this.sale001.BILL,
					name: "门店赊销",
					amount: this.sale001.TNET
				}), { //业务配置字段（支付状态设定为成功）
					fail: false //定金显示为成功
				}));
				console.log("[SaleReserve]生成预定支付信息成功!");
			}
			return true;
		},
		//支付完成后生成订单前
		$saleFinishing: function(result) {
			console.log("[SaleFinishing]赊销订单生成前...", result);
			this.sxsale001 = Object.cover(this.sxsale001, result.sale1_obj);
			this.sxsale001.SX_STATUS = 1;
			this.sxsale001.DKFNAME = this.DKF.val.NAME; //赊销追加一下 大客户名称
			console.log("[SaleFinishing]赊销订单生成完毕!", {
				sxsale001: this.sxsale001,
				sale003: this.sale003
			});
		},
		$saleFinied: function(sales) {
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})
			let arr3 = this.sale003;
			//查询支付方式
			let fkdaRes = this.FKDA_INFO;
			arr3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = 0;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})
			let dkfname = this.DKF.val.NAME;
			let printerPram = {
				"PRINTNUM": 2,
				"DKFNAME": dkfname
			};
			console.log("赊销开始调用打印", {
				arr2,
				arr3,
				printerPram
			})
			this.Page.sxBluePrinter(this.sale001, arr2, arr3, this.sxsale001, printerPram, "SX");
		},
		$click() {
			console.log("[sale_credit]赊销点击...");
			console.log("大客户权限：", this.currentOperation);
			this.ComponentsManage.DKF = true; //打开大客户弹窗
			console.log("大客户权限1：", this.currentOperation.DKF);
			return false;
		},
		OpenBigCustomer: function(data) {
			console.log("[CloseBigCustomer]大客户打开!", data);
			// this.mainSale.ComponentsManage.DKF = true;
			this.setComponentsManage(null, "DKF");
		},
		CloseBigCustomer: function(data) {
			console.log("[CloseBigCustomer]大客户关闭!", data);
			if (this.clickSaleType.clickType == 'sale_credit' && this.DKF.cval.DKFID != '80000000' && Object
				.keys(data).length == 0) { //赊销打开大客户后 没选择大客户则不做更改
				this.ComponentsManage["DKF"] = false;
				return;
			}
			this.DKF.val = data;
			console.log("当前大客户信息：", this.DKF.val);
			uni.$emit('select-credit', data);
		}
	},//赊销结算
	sale_credit_settlement: {
		close: false,
		xstype: "7",
		clickType: "sale_credit_settlement",
		nameSale: "赊销结算",
		icon_open: require("@/images/sxtd.png"),
		icon_close: require("@/images/sxtd-wxz.png"),
		new_bill: "",
		operation: {
			"HY": false, //是否可以录入会员
			"DKF": false, //是否可以打开录入大客户
			"Disc": false, //是否可以打开录入折扣
			"ynFzCx": false, //是否可以辅助促销
			"ynCancel": true, //是否可以退出当前销售模式
			"FZCX": false, //是否可以打开辅助促销组件
			"ynCx": false, //是否进行可以进行促销
			"ynSKDisc": false, //是否可以计算手工折扣
			"ynEdit": false, //当前业务能否编辑商品
			"showEdit": false, //展开编辑商品

			"sale_credit_settlement": true,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
		},
		$click() {
			console.log("[sale_credit_settlement]赊销结算点击...");
			console.log("[sale_credit_settlement]大客户权限(设置前)：", this.currentOperation);
			this.ComponentsManage.DKF = true; //打开大客户弹窗
			console.log("[sale_credit_settlement]大客户权限(设置后)：", this.currentOperation.DKF);
			uni.$once('select-credit', util.callBind(this, function(data) {
				if (Object.keys(data ?? {}).length > 0) {
					console.log("[Change]切换到赊销结算!");
					this.SetManage("sale_credit_settlement"); //切换到赊销
				} else { //如果没有大客户数据 则切换到普通销售模式
					console.log("[Change]切换到普通模式!");
					this.resetSaleBill();
				}
			}));
			return false;
		},
		$initSale: function(params) {
			console.log("[InitSale]当前业务:", this.current_type);
			this.mode_info.sale_credit_settlement.new_bill = this.getBill();
			console.log("[InitSale]赊销结算生成单号:", this.mode_info.sale_credit_settlement.new_bill);
			console.log("[InitSale]赊销结算单据信息:", params);
			this.actType = common.actTypeEnum.Payment;
			this.sale001 = Object.cover(new sale.sale001(), (params.sale1 ?? {}));
			this.sale002 = (params.sale2 ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
			this.sale003 = [];
			this.communication_for_oracle = params.sql;
			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Payment);
			this.ShowStatement();
			this.additional['YWSXJS'] = params.ywsxjs;
			this.additional['YWSXJSMX'] = params.ywsxjsmx;
			console.log("[InitSale]赊销结算附加表生成:", this.additional);
		},
		$beforeFk: function() {
			let allow_type = util.getStorage("POSCS").find(i => i.POSCS == 'XSJSFKID')?.POSCSNR.split(',');
			// allow_type.push('ZF04'); //测试用
			this.ban_type = util.getStorage("PayWayList").filter(i => !allow_type.includes(i.fkid)).map(i => i
				.fkid);
			console.warn("[BeforeFk]赊销结算获取的允许、和禁止 的付款类型:", {
				allow_type,
				ban_type: this.ban_type
			});
			return true;
		},
		$saleFinishing: function() {
			let credit_bill = this.mode_info.sale_credit_settlement.new_bill;
			console.log("[SaleFinishing]赊销结算绑定单号:", credit_bill);
			console.log("[SaleFinishing]赊销结算单据信息生成中...", {
				sale1: this.sale001,
				sale2: this.sale002,
				sale3: this.sale003
			});
			let ywsxfk_list = [];
			this.sale003.forEach(s3 => {
				let ywsxfk = Object.cover(new sale.ywsxfk(), s3);
				ywsxfk.BILL = credit_bill;
				ywsxfk.JK_DATE = new Date().toLocaleString();
				let exists_same_fkid = ywsxfk_list.find(i => i.FKID = ywsxfk.FKID);
				if (exists_same_fkid) { //业务赊销付款判断当前是否存在重复的fkid，有重复的则合并
					exists_same_fkid.AMT = Number(exists_same_fkid.AMT) + Number(ywsxfk.AMT);
				} else
					ywsxfk_list.push(ywsxfk);
			})
			// this.sale001 = {};
			// this.sale002 = [];
			// this.sale003 = [];
			console.log("[SaleFinishing]赊销结算三表信息(设置BILL前):", this.additional);
			//YWSXFK(类sale3)、YWSXJS(类sale1，主单号为BILL，大客户ID-DKFID，大客户名称-DKFNAME)、YWSXJSMX(类sale2-记录结算的单据，原单号记录字段为BILL_SX)
			this.additional['YWSXFK'] = ywsxfk_list;
			this.additional['YWSXJS'].BILL = credit_bill;
			this.additional['YWSXJS'].BILL_QT = credit_bill;
			this.additional['YWSXJSMX'].map(i => i.BILL = credit_bill);
			console.log("[SaleFinishing]赊销结算三表信息(设置BILL后):", this.additional);
		},
		$saleFinied: function(sales) {
			//调用打印
			let arr1 = this.additional['YWSXJS'];
			let arr2 = this.additional['YWSXJSMX'];
			let arr3 = this.additional['YWSXFK'];
			//查询支付方式
			let fkdaRes = this.FKDA_INFO;
			arr3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = 0;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})

			let printerPram = {
				"PRINTNUM": 2,
			};
			console.log("赊销结算开始调用打印", {
				arr1,
				arr2,
				arr3,
				printerPram
			})
			this.Page.sxjsBluePrinter(arr1, arr2, arr3, printerPram);
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
			// "sale_online_order": true,
			// "sale_takeaway_reserve": true,
			"sale_message": true,
			"ynCancel": true,
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
		SelectMenu: function() {
			console.log("[SelectMenu]外卖订单选中...");
			this.SetType("sale_takeaway");
			this.$initSale(XsTypeObj["sale_takeaway"]);
		}
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
			// "sale_online_order": true,
			// "sale_takeaway": true,
			// "sale_takeaway_reserve": true,//和外卖单保持一致 点击自己不允许跳转到其他页面
			"sale_message": true,
			"ynCancel": true,
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
		SelectMenu: function() {
			console.log("[SelectMenu]外卖预定单选中...");
			this.SetType("sale_takeaway_reserve");
			this.$initSale(XsTypeObj["sale_takeaway_reserve"]);
		}
	},
	//线上订单
	sale_online_order: {
		xstype: "8",
		clickType: "sale_online_order",
		nameSale: "线上订单",
		icon_open: require("@/images/xsdingdan.png"),
		icon_close: require("@/images/xsdingdan-wxz.png"),
		operation: {
			"sale": true,
			// "sale_online_order": true,
			// "sale_takeaway": true,
			// "sale_takeaway_reserve": true,
			"sale_message": true,
			"ynCancel": true,
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
		SelectMenu: function() {
			console.log("[SelectMenu]线上订单选中...");
			this.SetType("sale_online_order");
			this.$initSale(XsTypeObj["sale_online_order"]);
		}
	},
	//赊销退货
	sale_credit_return_good: {
		xstype: "7",
		clickType: "sale_credit_return_good",
		nameSale: "赊销退货",
		icon_open: require("@/images/sxtd.png"),
		icon_close: require("@/images/sxtd-wxz.png"),
		operation: {
			"HY": false, //是否可以录入会员
			"DKF": false, //是否可以打开录入大客户
			"Disc": false, //是否可以打开录入折扣
			"ynFzCx": false, //是否可以辅助促销
			"ynCancel": true, //是否可以退出当前销售模式
			"FZCX": false, //是否可以打开辅助促销组件
			"ynCx": false, //是否进行可以进行促销
			"ynSKDisc": false, //是否可以计算手工折扣
			"ynEdit": false, //当前业务能否编辑商品
			"showEdit": false, //展开编辑商品

			// "sale": true,
			"sale_credit_return_good": true,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
		},
		$initSale: function(params) { //清除一下会员信息
			console.log("[InitSale]赊销退货单据信息:", params);
			//清除一下已录入的会员信息
			this.HY.val = {};
			uni.$emit('set-member', this.HY.val);
			//给全局大客户对象赋值
			if (params.sale1.DKFID) {
				let obj = {
					DKFID: params.sale1.DKFID,
					NAME: params.sale1.DKFNAME,
				};
				this.DKF.val = obj;
			}
			this.actType = common.actTypeEnum.Refund;
			this.xsType = '2' //赊销退单重写
			this.bill_type = 'Z154'; ////赊销退单重写
			this.credit_sales = params;
			this.sale001 = Object.cover(new sale.sale001(), (params.sale1 ?? {}));
			this.sale002 = (params.sale2 ?? []).map(sale2 => Object.cover(new sale.sale002(), sale2));
			this.sale003 = (params.sale3 ?? []).map(sale3 => Object.cover(new sale.sale003(), sale3));
			this.sale003.map(sale3 => {
				sale3.fail = false;
			});
			console.log("[sale_credit_return_good]SALE001:", this.sale001);
			console.log("[sale_credit_return_good]SALE002:", this.sale002);
			console.log("[sale_credit_return_good]SALE003:", this.sale003);

			this.setNewParmSale({
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003
			}, common.actTypeEnum.Refund);
			this.ShowStatement();
		},
		///对打印的控制
		$print: function(sale001, sale002, sale003) {
			return {
				tName: "赊销退货小票", // 名称
				ynPrintFp: true, //是否打印发票二维码
				ynPintCustem: false, // 是否打印客户信息
				ynPintDisc: true, //是否打印折扣  
				payOrRet: "", //支付还是退款
			}
		},
		$click() {
			this.SetManage("sale_credit_return_good");
			return false;
		},
		$beforeFk: function() {
			//可以使用的支付方式 
			//加入支付方式
			// this.setNewParmSale({
			// 	sale001: this.sale001,
			// 	sale002: this.sale002,
			// 	sale003: this.sale003
			// }, common.actTypeEnum.Refund)
			// console.log("[SaleFinishing]赊销退货处理完毕!", {
			// 	sale001: this.sale001,
			// 	sale002: this.sale002,
			// 	sale003: this.sale003
			// });
			return true;
		},
		$saleFinishing: function() {
			console.log("[SaleFinishing]赊销退货结算单信息重写中...");
			this.sale001.DNET = 0;
			this.sale001.BILLDISC = Math.abs(Number(this.sale001.BILLDISC) || 0);
			this.sale001.TDISC = -Math.abs(Number(this.sale001.TDISC) || 0);
			this.sale001.TTPDISC = -Math.abs(Number(this.sale001.TTPDISC) || 0);
			this.sale001.TBZDISC = -Math.abs(Number(this.sale001.TBZDISC) || 0);
			this.sale001.TLSDISC = -Math.abs(Number(this.sale001.TLSDISC) || 0);
			this.sale002.forEach(i => {
				i.BZDISC = -Math.abs(Number(i.BZDISC) || 0);
				i.LSDISC = -Math.abs(Number(i.LSDISC) || 0);
				i.TPDISC = -Math.abs(Number(i.TPDISC) || 0);
			})
			console.log("[SaleFinishing]赊销退货结算单信息重写完成...", this.sale001);
			console.log("[SaleFinishing]赊销退货结算单信息重写完成1...", this.sale002);
			this.communication_for_oracle.push(
				`update sxsale001 set SX_STATUS='3' where bill='${this.sale001.XS_BILL}';`
			);
			this.ClearDiscount(this.sale001, this.sale002);
		},
		$saleFinied: function(sales) {
			console.log("[SaleFinied]赊销退单...", this.credit_sales);
			//调用打印
			let arr2 = this.sale002;
			arr2.forEach(function(item, index) {
				item.SNAME = item.STR1;
			})
			let arr3 = this.sale003;
			//查询支付方式
			let fkdaRes = this.FKDA_INFO;
			arr3.forEach(function(item, index) {
				try {
					item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
					item.balance = 0;
				} catch (e) {
					item.SNAME = "";
					item.balance = 0;
				}
			})

			let dkfname = this.DKF.val.NAME;
			let printerPram = {
				"PRINTNUM": 2,
				"DKFNAME": dkfname
			};
			console.log("赊销退单开始调用打印", {
				arr2,
				arr3,
				printerPram
			})
			this.Page.sxBluePrinter(this.sale001, arr2, arr3, this.sxsale001, printerPram, "SXTD");

			//废弃 采用本地生成模式
			// _refund.CreditOrderRefund({
			// 	khid: this.Storeid,
			// 	posid: this.POSID,
			// 	ryid: this.ryid,
			// 	dkhname: this.credit_sales.sale1.DKFNAME,
			// 	bill: this.credit_sales.sale1.BILL,
			// 	saledata: this.credit_sales.sale1.SALEDATE //new Date().toLocaleDateString()
			// }, res => {
			// 	console.log("[SaleFinied]赊销退单结果:", res);
			// 	if (res.code) {
			// 		util.simpleMsg("赊销退单成功!");
			// 	} else {
			// 		util.simpleMsg("退单失败:" + res.msg, true);
			// 	}
			// })
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
	this.uni = uni;
	var uni = uni;
	var payresult = null;
	//热销商品的存储介质！
	var hotSale = null;

	this.GetPayedResult = () => payresult;

	this.billindex = 0;
	
	//储存模式信息（用于界面行为绑定）
	this.mode_info = XsTypeObj;
	this.FKDA_INFO = util.getStorage('FKDA_INFO');
	console.warn("[GetSale]获取的支付方式信息:", this.FKDA_INFO);
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
	//清除sale2的折扣信息
	this.ClearDiscount = function(sale1, sale2) {
		sale1.BILLDISC = 0;
		sale1.TDISC = 0;
		sale1.TCXDISC = 0;
		sale1.TBZDISC = 0;
		sale1.TLSDISC = 0;
		sale1.TTPDISC = 0;
		console.log("[ClearDiscount]sale1折扣清除后:", sale1);
		sale2?.forEach(s2 => {
			s2.DISCRATE = 0;
			s2.CXDISC = 0;
			s2.BZDISC = 0;
			s2.LSDISC = 0;
			s2.TPDISC = 0;
		})
		console.log("[ClearDiscount]折扣清除后:", sale2);
	}
	//合并券类型和不可原路退回操作
	this.CombineCouponAndNoOrginPay = function(sale003) {
		console.log("[CombineCouponAndNoOrginPay]支付类型信息:", {
			memory: this.FKDA_INFO,
			catch: util.getStorage("FKDA_INFO")
		});
		let combine_fkid = util.getStorage("FKDA_INFO").filter(i => ['SZQ'].includes(i.JKSNAME)).map(i => i.FKID)
			.concat([
				'ZG02'
			]);
		console.log("[CombineCouponAndNoOrginPay]合并项FKID:", combine_fkid);
		let combine_sale3 = sale003.filter(i => combine_fkid.includes(i.FKID));
		let uncombine_sale3 = sale003.filter(i => !combine_fkid.includes(i.FKID));
		console.log("[CombineCouponAndNoOrginPay]合并分类:", {
			combine_sale3,
			uncombine_sale3,
			sale003
		});
		// 取消ZG02的合并功能（但保留根据券类型 FKID 切换至对应类型退款的 FKID） 👇
		combine_sale3?.forEach(i => {
			if (i.FKID == 'ZF09')
				i.FKID = 'ZG07'
		});
		return;
		// 下面代码目前作废 👇
		if (!combine_sale3.length) return; //如果没有和并项
		let single_sale3 = (() => {
			let sale3 = combine_sale3[0],
				total_amount = 0; //取原单第一位的原因是序号问题和部分数据填充的问题
			combine_sale3.forEach(i => {
				total_amount += Number(i.AMT) ?? 0;
			})
			sale3.AMT = total_amount;
			sale3.FKID = 'ZG02';
			sale3.FAMT = 0;
			sale3.RATE = 0;
			sale3.DISC = 0;
			sale3.ZKLX = 0;
			sale3.AUTH = "";
			sale3.ID = "";
			sale3.IDTYPE = "";
			return sale3;
		})();
		this.sale003 = uncombine_sale3.concat([single_sale3]);
		console.log("[CombineCouponAndNoOrginPay]合并处理后:", {
			sale003,
			this_sale003: this.sale003
		});
	}
	//创建订单号
	this.getBill = function() {
		var newbill = "";
		if (this.bill == null) {
			let d = new Date();
			let year = (d.getFullYear() % 100) < 10 ? "0" + (d.getFullYear() % 100) : (d.getFullYear() %
				100);
			let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
			let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
			let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
			let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
			let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
			// newbill = this.Storeid + this.POSID + "" + d.getFullYear() % 100 + (d.getMonth() + 1) + d.getDate() + d
			// 	.getHours() + d.getMinutes() + d.getSeconds();
			newbill = this.Storeid + this.POSID + year + month + day + hour + min + sec;
			//单号格式：门店号+pos号+yymmddHHmmss+流水号 自打开程序以后的开单号，每天清零
			newbill = newbill + "" + this.billindex;
			this.billindex++;
		} else {
			newbill = this.bill;
		}
		return newbill;
	}

	//*start* 自定义方法开始

	//*func*特殊折扣初始化数据
	this.GetTSZKData = util.callBind(this, async function() {
		if (!this.currentOperation.Disc) {
			util.simpleMsg("当前模式禁止选择折扣", "none");
			return;
		}
		//初始化获取特殊折扣(默认是标准和临时，如果选了大客户则包含特批)
		console.log("传入折扣的大客户数据：", this.DKF.val.DKFID);
		this.Disc.val.ZKData = await _main.GetZKDatasAll(this.DKF.val.DKFID); //传入大客户值
		this.setComponentsManage(null, "Disc");
		console.log("首页初始化的折扣数据：", this.Disc.val.ZKData);
	})
	//*func*特殊折扣关闭回调
	this.CloseTSZK = util.callBind(this, function(data) {
		this.setComponentsManage(null, "Disc");
		console.log("特殊折扣返回的商品数据：", data); //返回折扣类型 再次根据商品匹配一下折扣
		if (data == "NO") { //清除折扣
			this.Disc.val = {};
			//如果未选择 折扣类型 则说明可以进行促销操作 反之
			// this.currentOperation["Disc"] = false;
			// this.currentOperation["ynFzCx"] = true;
			// this.currentOperation["ynCx"] = true;
		} else {
			let obj = this.Disc.cval;
			obj.ZKType = data;
			console.log("回调折扣赋值：", obj);
			this.Disc.val = {
				...obj
			};
			console.log("回调折扣赋值1：", this.Disc.cval);
			// this.currentOperation["Disc"] = true;
			// this.currentOperation["ynFzCx"] = false;
			// this.currentOperation["ynCx"] = false; //特殊折扣和普通促销互斥
		}
		//清除一下之前产生的促销和折扣
		this.ResetCXZK();
		console.log("特殊折扣的操作权限：", this.currentOperation.Disc);
		console.log("促销的操作权限：", this.currentOperation.ynCx);
	})
	//*func*清除促销和折扣
	this.ResetCXZK = util.callBind(this, function(res) {
		console.log("进入清除促销折扣方法sale1", this.sale001);
		console.log("进入清除促销折扣方法sale2", this.sale002);
		if (this.sale001 && Object.keys(this.sale001).length > 0) { //创建对象后 才允许清除 big bug
			//切换折扣或者促销后 清空一下原来计算的折扣值
			this.sale001.TBZDISC = 0; //zk 总标准折扣
			this.sale001.TLSDISC = 0; //zk 总临时折扣
			this.sale001.TTPDISC = 0; //zk 总特批折扣
			this.sale001.TCXDISC = 0; //cx 总促销折扣
			this.sale001.TDISC = 0; //cx
			this.sale001.BILLDISC = 0; //cx zk
		}
		this.sale002.map(r => {
			r.NET = this.float(r.NET + r.DISCRATE, 2); //回退一下折扣？
			r.PRICE = this.float(r.NET / r.QTY, 2); //回退一下折扣？
			r.DISCRATE = 0; //zk，cx
			r.CXDISC = 0; //cx
			r.YN_CXDISC = "N"; //cx
			r.BZDISC = 0; //zk
			r.LSDISC = 0; //zk
			r.TPDISC = 0; //zk
		});
		this.CXHDArr = []; //
		this.ZKHDArr = []; //清除一下已生效的活动数据
		this.score_info.money = 0;
		this.score_info.score = 0;
		this.score_info.ispoints = 0;
		this.over48 = false;
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
				console.log("会员券列表查询结果：", res);
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
		// this.sale001.CUID = this.HY.val.hyId; //不要放开 先录入会员会导致sale 其他值为undefefined
		// console.log("[CloseMember]已设置会员ID信息至CUID字段...", this.sale001);
		uni.$emit('set-member', this.HY.val);
	})
	//*func*会员登录
	this.MemberLogin = util.callBind(this, function(e) { //会员登录
		if (!this.currentOperation.HY) {
			util.simpleMsg("当前模式不允许录入会员", "none");
			return;
		}
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
					this.$initSale(XsTypeObj['sale_credit']); //切换到赊销
					// uni.$emit('set-menu','sale_credit');
				} else { //如果没有大客户数据 则切换到普通销售模式
					console.log("[Change]切换到普通模式!");
					this.resetSaleBill();
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
		console.log("[Redirect]菜单切换完毕,更新data信息...");
		this.update();
	})
	//获取热销商品的列表
	this.getHotSale = function() {
		if (hotSale == null) {
			let reqPosData = {
				"khid": that.Storeid
			};
			let apistr = "MobilePos_API.Models.padGetHotSale.getHotSaleGoods";
			let reqdata = _Req.resObj(true, "正在获取热销商品...", reqPosData, apistr);
			_Req.asyncFuncOne(reqdata,
				res => {
					// console.log("请求的返回结果是啥"+ JSON.stringify(res).substr(0,300));
					var rethotsale = _Req.getResData(res);

					that.createHotSaleSpList(rethotsale);
				},
				res => {
					hotSale = null;
					that.myAlert("获取热销商品失败" + res.msg);

				}
			)
			//ajax 获取热销商品
		} else {
			//回调函数里调用这段代码
			that.createHotSaleSpList(hotSale);
		}
	}

	this.createHotSaleSpList = function(pm_rethotsale) {
		if (hotSale == null) {
			hotSale = pm_rethotsale;
			hotSale.forEach(plitem => {
				//生成热销数据结构
				plitem.plarr = [];
				plitem.splist.forEach(spitem => {
					if (that.spidKeyVal[spitem.SPID]) {
						plitem.plarr.push(that.spidKeyVal[spitem.SPID])
					};
				});
				that.log("看一下品类初始化的怎么样" + JSON.stringify(plitem.plarr).substr(0, 300));


			})
		}
		console.log("请求的返回结果是啥" + JSON.stringify(hotSale).substr(0, 300));

		that.selectFlagList = hotSale;
		if (that.selectFlagList.length > 0) {
			that.selectPlid = that.selectFlagList[0].plid;
		}
		that.update();
	}

	//*func*商品字母筛选
	this.Letters = util.callBind(this, function(e) {
		this.Page.Alphabetical = !this.Page.Alphabetical;
	})
	//搜索键盘 todo
	this.keyBoardSearch = util.callBind(this,function(e){
		// if (!this.currentOperation.FZCX || this.Page.Alphabetical === true) {
		if ( this.Page.Alphabetical === true) {
			util.simpleMsg("当前模式不允许搜索", "none");
			return;
		}
		this.Page.isKeyBoardShow = !this.Page.isKeyBoardShow
	})
	//*func*展开商品编辑
	this.showEditFunc = util.callBind(this, function(e) {
		if (this.sale002.length == 0) {
			util.simpleMsg("请先加购商品", true);
			return;
		}
		this.sale002.map(s2 => {
			if (!s2.$raw) {
				s2.$raw = Object.assign({}, s2);
				util.hidePropety(s2, '$raw');
			}
		})
		this.currentOperation["showEdit"] = true;
		this.update();
	})
	//*func*sale002商品详情页的加号和 减号
	this.Calculate = function(index, item, type) {
		let obj = this.sale008.find(r => {
			return r.NO == item.NO
		});
		if (obj && Object.keys(obj).length > 0) {
			//说明是水吧商品
			if (item.QTY >= 1 && type > 0) {
				item.QTY = 1;
				util.simpleMsg("水吧商品限定数量为1", "none");
			} else if (item.QTY <= 0 && type < 0) {
				item.QTY = 0;
			} else {
				item.QTY = Number(item.QTY) + type;
			}
		} else {
			item.QTY = Number(item.QTY) + type;
			if (item.QTY < 0) {
				item.QTY = 0;
			}
		}
		// let _qty = 0;
		// _qty = Number(item.QTY) + type;
		// if (item.QTY < 0) {
		// 	_qty = 0;
		// }
		console.log("商品数量变化:", item.QTY);
		// this.updateSp(index, item.SPID, _qty);
	}
	//*func*完成编辑
	this.completeEdit = util.callBind(this, function(e) {
		this.currentOperation.showCXZK = false;
		this.CXHDArr = [];
		this.ZKHDArr = [];
		let attempt_lock_row = false; //判断是否尝试修改锁定行
		this.currentOperation["showEdit"] = false;
		this.update();

		//筛选一下商品
		// let sale2 = this.sale002.filter(r => {
		// 	return r.QTY > 0;
		// })
		// this.sale002 = sale2;
		for (var i = this.sale002.length - 1; i >= 0; i--) {
			let item = this.sale002[i];
			// console.log("当前商品行：", item);
			if (i < this.currentOperation.lockRows && item.QTY !== 0 && item.QTY != item.$raw
				.QTY) { //1、必须在锁定行。2、数量必须改变了才提示。
				item.QTY = item.$raw.QTY ?? item.QTY;
				attempt_lock_row = true;
			} else
				this.updateSp(i, item.SPID, item.QTY);
		}
		if (attempt_lock_row) util.simpleMsg("该商品已被锁定!", true)
		if (this.sale002.length == 0) {
			//防止编辑时直接清空了商品数量 则之前计算的归0 处理
			that.sale001.ZNET = 0;
			that.sale001.TNET = 0;
			that.sale001.BILLDISC = 0;
			that.sale001.TLINE = 0; //这个是存商品行
			this.sale001.TCXDISC = 0;
			this.sale001.TDISC = 0;
			return;
		}
		//重新计算一下 促销啊 折扣啊 
		this.SaleNetAndDisc();
	})
	//*func*选中标签
	this.ChooseBQ = util.callBind(this, function(e) {
		if (e) {
			this.CakeBQList.forEach(i => {
				if (i != e) {
					if (!i.DATA.find(o => o._CHECK))
						i.CHECK = false;
				} else {
					if (i.DATA.find(o => o._CHECK))
						i.CHECK = true;
					else {
						i.CHECK = !i.CHECK;
					}
				}
			});
			this.CakeTagList = e.DATA;
		}
		this.update();
		console.log("[ChooseBQ]当前标签数据：", e);
	})
	//*func*选中标签
	this.ChooseTag = util.callBind(this, function(e) {
		if (e) {
			e._CHECK = !e._CHECK;
			if (e._CHECK) {
				this.CheckTagList.push(e);
			} else {
				for (var i = 0; i < this.CheckTagList.length; i++) {
					if (this.CheckTagList[i]._ID === e._ID) {
						this.CheckTagList.splice(i, 1);
					}
				}
			}
		}
		console.log("选中事件：", this.CheckTagList);
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
		uni.$off("ReturnSale");
		uni.$off("Switch");
		uni.$off("tools");
		uni.$off("exists-online-order");
		uni.$off("exists-takeaway");
		uni.$off("exists-takeaway-reserve");
		uni.$off("exit-cake-reservation");
		uni.$off("ShowCakeDetail");
		console.log("[Bind]BIND!");
		uni.$on("change", this.Change);
		uni.$on("redirect", this.Redirect);
		uni.$on("member-close", this.CloseMember);
		uni.$on("close-big-customer", (XsTypeObj.sale_credit.CloseBigCustomer).bind(this));
		uni.$on("open-big-customer", (XsTypeObj.sale_credit.OpenBigCustomer).bind(this));
		uni.$on("reserve-drawer-close", (XsTypeObj.sale_reserve.CloseReserveDrawer).bind(this));
		uni.$on("close-tszk", this.CloseTSZK);
		uni.$on("close-FZCX", this.CloseFZCX);
		uni.$on("ReturnSale", this.CancelSale);
		uni.$on("Switch", this.SetManage);
		uni.$on("tools", this.ToolsManage);
		uni.$on("exists-online-order", (XsTypeObj.sale_online_order.SelectMenu).bind(this));
		uni.$on("exists-takeaway", (XsTypeObj.sale_takeaway.SelectMenu).bind(this));
		uni.$on("exists-takeaway-reserve", (XsTypeObj.sale_takeaway_reserve.SelectMenu).bind(this));
		uni.$on("exit-cake-reservation", (XsTypeObj.sale_cake_reserve.CloseCakeReservation).bind(this));
		uni.$on("ShowCakeDetail", (XsTypeObj.sale_cake_reserve.ShowCakeDetail).bind(this));
	})
	//*func*退出当前销售模式 返回到默认的销售模式
	this.CancelSale = util.callBind(this, function(e) {
		let tip = this.clickSaleType.clickType == 'sale' ? "是否要清空当前销售单?" : "是否要清空销售单，并退出当前销售模式？"
		util.simpleModal("提示", tip, res => {
			if (res) {
				if (this.currentOperation.ynCancel) {
					this.resetSaleBill();
				}
			}
		})
	});

	//*func* 取消促销和重置促销
	this.ResetCX = util.callBind(this, function(e) {
		let tip = !this.currentOperation.ynResetCX ? "清除" : "恢复";
		util.simpleModal("提示", "是否确认要" + tip + "促销折扣？", res => {
			if (res) {
				if (!this.currentOperation.ynResetCX) {
					this.currentOperation.ynCx = false;
					this.ResetCXZK();
				} else {
					this.currentOperation.ynCx = true;
				}
				this.SaleNetAndDisc();
				this.currentOperation.ynResetCX = !this.currentOperation.ynResetCX;
				this.currentOperation.showCXZK = false; //清除和恢复时都关闭一下
			}
		})
	});
	//*func* 展示促销和折扣来源
	this.showCXZKFunc = util.callBind(this, function(e) {
		if (this.sale001.BILLDISC <= 0 || this.sale001.BILLDISC == this.sale001.ROUND) { //防止产生促销折扣后支付返回判断错误
			util.simpleMsg("暂无生效的促销或折扣", "none");
			return;
		}
		if (this.currentOperation.ynCx) { //如果促销生效了
			let arr = this.cxfsArr.map(r => {
				return r.CXBILL
			});
			console.log("促销单集合：", arr);
			_main.GetMDCXHD(arr, res => {
				console.log("获取到促销单信息：", res);
				this.CXHDArr = res;
			})
		}
		if (this.currentOperation.Disc) { //如果折扣生效了

		}
		this.currentOperation.showCXZK = !this.currentOperation.showCXZK;
		console.log("促销折扣显示状态：", this.currentOperation.showCXZK);
		this.update();
	});

	//*func* 取消促销和重置促销
	this.dgydExit = util.callBind(this, XsTypeObj.sale_cake_reserve.CloseCakeReservation);

	//*func* 展开和关闭标签筛选
	this.ToChoose = util.callBind(this, function(e) {
		this.mode_info.sale_cake_reserve.filter = !this.mode_info.sale_cake_reserve.filter;

		console.log("标签数据：", this.CakeBQList);
		if (this.CakeBQList.length > 0) {
			let arr = this.CakeBQList.filter(r => {
				return r.CHECK
			});
			if (arr.length == 0) {
				this.ChooseBQ(this.CakeBQList[0]) //默认展开第一个标签的数据
			}
		}
	});
	//*func* 积分促销控制
	this.CalScore = util.callBind(this, function(e) {
		console.log("是否要积分促销", e);
		this.SaleNetAndDisc(e);
	});
	//*End* 自定义方法结束
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
		util.simpleMsg(pm_str1, "none")
		that.log("--------------看到这个说明弹窗功能还没有做！--------------")
	}
	//基础配置参数本地化
	this.Storeid = store.KHID;
	this.storeName = store.NAME;
	this.POSID = store.POSID;
	this.ryid = store.RYID;
	this.KCDID = store.KCDID;
	this.DPID = store.DQID; //测试要求按照ｐｏｓ记录
	this.GCID = store.GCID;
	this.GSID = store.GSID;
	//销售系列主要数据对象
	this.sale001 = {}; //sale001 主单
	this.sale002 = []; //sale002 子单1：记录商品信息
	this.sale003 = []; //sale003 子单2：记录支付信息
	this.sale006 = [];
	this.sale008 = []; //sale008
	this.ywbhqh = []; //裱花请货单
	this.ydsale001 = {}; //预定主单
	this.sxsale001 = {}; //赊销主单
	this.additional = {}; //附加生成信息
	//判断当前 sale2 中是否包含裱花商品
	this.decoration = false;
	//判断当前 sale2 中是否包含促销方式为 hylv=3-48 的类型
	this.over48 = false;
	//可支付的积分
	this.score_info = {
		score: 0,
		money: 0
	}
	//禁止类型
	this.ban_type = [];
	//蛋糕预定
	this.show_cake_reservation = false;
	//工具栏界面
	this.tool_pages = {
		promotions: false, //当前促销活动
		communication: false, //通讯
		tickers: false //重打小票
	}
	//促销跟踪
	this.cxfsArr = [];
	//生效的促销活动集合
	this.CXHDArr = [];
	//生效的特殊折扣规则集合
	this.ZKHDArr = [];
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
	//用商品编码作为Key和Val的数据结构
	this.spidKeyVal = {};
	//更新（根据代码应该是强制刷新页面）
	this.actType = common.actTypeEnum.Payment;
	//筛选的品类
	this.selectPlid = "";
	//蛋糕预定标签集合
	this.CakeBQList = [];
	//蛋糕预定标签子级集合
	this.CakeTagList = [];
	//已选标签集合
	this.CheckTagList = [];
	//蛋糕预定商品集合
	this.CakeList = [
		// 	{
		// 	type: 'image',
		// 	url: 'http://58.19.103.220:8805/CakeImage/6.jpg',
		// 	names: '七星瓢虫儿童蛋糕',
		// 	miaoshu: '这是一段描述,七星瓢虫儿童蛋糕'
		// }, {
		// 	type: 'image',
		// 	url: 'http://58.19.103.220:8805/CakeImage/5.jpg',
		// 	names: '七星瓢虫儿童蛋糕',
		// 	miaoshu: '这是一段描述,七星瓢虫儿童蛋糕'
		// }, {
		// 	type: 'image',
		// 	url: 'http://58.19.103.220:8805/CakeImage/8.jpg',
		// 	names: '七星瓢虫儿童蛋糕',
		// 	miaoshu: '这是一段描述,七星瓢虫儿童蛋糕'
		// }, {
		// 	type: 'image',
		// 	url: 'http://58.19.103.220:8805/CakeImage/11-2.png',
		// 	names: '七星瓢虫儿童蛋糕',
		// 	miaoshu: '这是一段描述,七星瓢虫儿童蛋糕'
		// },
	];

	//观察sale2信息
	this.Page.$watch('mainSale.sale002', util.callBind(this, function(n, o) {
		this.CheckSale002ExistsDecoration();
	}))

	this.Page.$watch('mainSale.DKF', util.callBind(this, function(n, o) {
		console.warn("[Watch-Big-Customer]打客户信息发生变更...");
	}))
	
	this.Page.$watch('mainSale.billindex', util.callBind(this, function(n, o) {
		console.warn("[Watch-Serial-Number]流水号发生变更...");
		util.setStorage('serial-number',n);
	}))

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
			this.cval = newval;
			if (this.cval && Object.keys(this.cval).length > 0) {
				//使用that
				that.currentOperation["DKF"] = false; //会员和大客户互斥 录入会员后则不允许使用大客户
				this.base.GetHyCoupons();
			} else {
				console.log("会员清空后的权限操作：");
				that.setSaleTypeDefval("DKF");
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
			//缓存默认一下
			let store = util.getStorage("store");
			if (!newval || Object.keys(newval).length == 0) { //为空或者默认值
				console.log("默认值:", newval);
				this.cval.DKFID = this.Defval;
				that.setSaleTypeDefval("HY");
				that.setSaleTypeDefval("ynCx");
				this.base.HY.cval = {};
				store.DKFID = this.Defval;
				store.DKFNAME = '默认大客户';
				uni.$emit('set-dkf', "默认大客户"); //通知外部 恢复默认大客户
			} else {
				this.cval = newval;
				that.currentOperation["HY"] = false; //会员和大客户互斥 录入大客户则不允许使用会员
				that.currentOperation["ynCx"] = false; //选择大客户后 促销也同步失效
				store.DKFID = newval.DKFID;
				store.DKFNAME = newval.NAME;
				// if (that.clickSaleType.clickType == 'sale' || that.clickSaleType.clickType == 'sale_reserve') {
				if (that.currentOperation.DKF) {
					that.ResetCXZK(); //正向操作时 选择大客户后清除促销折扣
					//切换大客户后 要清除一下 上一个大客户的 折扣规则以及当前折扣类型
					if (that.Disc.val.ZKData?.DKFZKDatas) {
						console.log("清除前的特殊折扣数据：", that.Disc.cval);
						Reflect.deleteProperty(that.Disc.val.ZKData, "DKFZKDatas");
						Reflect.deleteProperty(that.Disc.val, "ZKType");
						util.simpleMsg("所有折扣已清除，请重新操作", "none");
						console.log("清除后的特殊折扣数据：", that.Disc.cval);
					}
				}
			}
			util.setStorage("store", store);
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
			this.cval = newval; //判断有效值
			// if (newval && Object.keys(newval).length > 0) {
			if (newval && newval.ZKType) { //有赋值折扣类型才算折扣生效
				that.currentOperation.ynCx = false;
				// that.currentOperation.FZCX = false;
			} else {
				console.log("折扣赋空值前的促销权限：", that.currentOperation.ynCx);

				that.setSaleTypeDefval("ynCx");
				// that.setSaleTypeDefval("FZCX");
			}
			console.log("折扣赋值后的促销权限：", that.currentOperation.ynCx);
		}
	};
	this.Disc.base = this;
	//辅助促销
	this.FZCX = {
		base: {},
		cval: {}, //选中的数据
		oval: [], //初始数据
		open: false,
		get val() {
			return this.cval;
		},
		set val(newval) {
			//赋值的时候进行计算
			this.cval = newval;
			// if (newval&&newval.data.length>0)
			// this.base.ComponentsManage["FZCX"] = false;
			// this.currentOperation.ynCx = false; 
			// }
		}
	};
	this.FZCX.base = this;
	///所有商品的列表,具体参考 utils.sale.xs_sp_init.js
	this.Allsplist = null;

	//检查sale002 是否包含裱花类型商品
	this.CheckSale002ExistsDecoration = function() {
		console.log("[CheckSale002ExistsDecoration]此时的sale2:", this.sale002);
		let sys_param = util.getStorage("sysParam");
		console.log("[CheckSale002ExistsDecoration]系统参数信息:", sys_param);
		if (sys_param && (Object.keys(sys_param).length > 0)) { //判断裱花参数是否存在
			let bh_support_id = (sys_param['BHLBBM'] ?? "").split(',');
			let exists_decoration = false;
			this.sale002?.forEach(s2 => {
				if (bh_support_id.find(id => id === s2.PLID?.substr(0, 3))) exists_decoration =
					true;
			})
			console.log("[CheckSale002ExistsDecoration]当前商品中是否包含裱花商品:", exists_decoration);
			this.decoration = exists_decoration;
		}
	}

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
		//this.Page.$set(this.Page, "Alphabetical", "");
		//筛选字母的列表
	}

	///当出现一些互斥的操作的时候  恢复默认值的时候使用
	this.setSaleTypeDefval = function(pm_key) {
		if (this.current_type.operation.hasOwnProperty(pm_key)) {
			let pm = this.current_type.operation[pm_key];
			console.log("当前权限：", pm);
			this.currentOperation[pm_key] = this.current_type.operation[pm_key];
		} else {
			// this.ComponentsManage[pm_key] = false;
			this.currentOperation[pm_key] = false;
		}
	}

	this.selectPlidChenged = function(e) {
		that.selectPlid = e.currentTarget.dataset.plid;
		that.Page.$set(that.Page[that.pageName], "selectPlid", that.selectPlid);
	}
	//设置所有商品列表数据，初始化字母列表  售价列表  和商品列表  ，初始化促销单 
	this.SetAllGoods = function(pm_list, pm_price) {
		// console.log("所有的商品集合：", pm_list);
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
		"sale": true, //默认可以销售
		"statement": false
	};
	///销售界面可以进行操作功能 ，
	this.allOperation = {
		"HY": false, //是否可以录入会员
		"DKF": false, //是否可以打开录入大客户
		"Disc": false, //是否可以打开录入折扣
		"ynFzCx": false, //是否可以辅助促销
		"ynSKDisc": false, //是否要计算特殊折扣
		"ynCancel": false, //是否可以退出当前销售模式
		"FZCX": false, //是否可以打开辅助促销组件
		"ynCx": false, //是否进行可以进行促销  
		"member_login": false, //是否打开会员登录界面
		"upload_point": false, //支付完毕后是否进行积分上传
		"showEdit": false, //展开编辑商品
		"ynEdit": false, //当前业务能否编辑商品
		"ynResetCX": false, //是否清除了促销
		"showCXZK": false, //是否展示促销，折扣来源

		"sale": false, //从这里开始都是销售模式
		"sale_cake_reserve": false,
		"sale_reserve": false,
		"sale_reserve_extract": false,
		"sale_online_order": false,
		"sale_online_order_extract": false,
		"sale_credit": false,
		"sale_return_good": false,
		"sale_reserve_cancel": false,
		"sale_credit": false,
		"sale_credit_settlement": false,
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
		"inputDrinkSp": false, ///******是否可以录入带有选配属性的水吧商品  //预定和赊销  都不行
	}
	//插件的显示在这里控制
	this.ComponentsManage = {
		"HY": false, //会员插件是否打开
		"DKF": false, //大客户插件是否打开
		"Disc": false, //折扣插件是否打开
		"FZCX": false, //辅助促销插件是否打开
		// "showEdit": false, //商品数量编辑是否打开
		"member_login": false,
		"sale": true, //从这里开始都是销售模式
		"sale_cake_reserve": false,
		"sale_reserve": false,
		"sale_reserve_extract": false,
		"sale_online_order": false,
		"sale_online_order_extract": false,
		"sale_credit": false,
		"sale_credit_settlement": false,
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
		console.log("[SetManage]组件类型:", pm_mtype);
		if (!pm_mtype) return;
		// console.log("[SetManage]LastManage:", lastManage);
		// console.log("[SetManage]CurrentManage:", pm_mtype);
		//if (pm_mtype === lastManage) return;
		if (lastManage != null && pm_mtype != lastManage) {
			// console.log("[SetManage]关闭上一个组件!");
			that.ComponentsManage[lastManage] = false;
		}
		console.log("[SetManage]组件类型信息-修改前:", that.ComponentsManage[pm_mtype]);
		that.ComponentsManage[pm_mtype] = !that.ComponentsManage[pm_mtype];
		console.log("[SetManage]组件类型信息-修改前:", that.ComponentsManage[pm_mtype]);
		lastManage = pm_mtype;
		// that.Page.$set(that.Page[that.pageName], "ComponentsManage", that.ComponentsManage);
		// that.log("[SetManage]组件控制对象:", that.ComponentsManage);
		// that.log("[SetManage]绑定完成:", that.ComponentsManage[pm_mtype]);
		that.update();
	}

	this.ToolsManage = util.callBind(this, function(info) {
		console.log("[ToolsManage]信息:", info);
		if (this.tool_pages[info] !== undefined) {
			console.log("[ToolsManage]修改前:", this.tool_pages[info]);
			this.tool_pages[info] = !this.tool_pages[info];
			console.log("[ToolsManage]修改后:", this.tool_pages[info]);
		}
	})

	//设置所有插件的切换非销售模式的切换  会员  折扣 大客户等事件
	this.setComponentsManage = function(e, pm_mtype) {
		console.log("进入组件切换事件：", pm_mtype);
		console.log("进入组件切换事件1：", e);
		let mtype = pm_mtype || e.currentTarget.dataset.mtype;
		// console.log("[SetComponentsManage]设置组件切换:", {
		// 	type: mtype,
		// 	mode: that.current_type,
		// 	current: that.currentOperation
		// });
		if (that.currentOperation.hasOwnProperty(mtype)) {
			// console.log("[SetComponentsManage]设置弹窗类组件切换!", mtype);
			that.SetManage(mtype);
		} else {
			that.myAlert("当前模式不支持此操作")
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
		let plitem = that.selectFlagList[plindex];
		let spitem = plitem.plarr[spindex];
		that.initClikSpItem(spitem);
		that.SetManage("inputsp")
	}
	//初始化选中的item，预定选蛋糕和 正常的商品点选都会使用
	this.initClikSpItem = function(pm_itemcClick) {
		that.clikSpItem = pm_itemcClick;
		that.log("查看点击的商品" + JSON.stringify(that.clikSpItem));
		that.clikSpItem.inputQty = 1;
		if (that.clikSpItem.ynshowlist) //如果是蛋糕默认选择一个商品id
		{
			//SPECS,DGJGZ,DGPLID 为selectSPID_Chenged动态添加的属性，只有蛋糕商品存在此属性，其他商品不存在！
			that.log("查看蛋糕包含的品类" + JSON.stringify(that.clikSpItem.specslist));
			that.clikSpItem.selectSPID = that.clikSpItem.specslist[0].SPID;
			that.clikSpItem.SPECS = that.clikSpItem.specslist[0].SPECS;
			that.clikSpItem.DGJGZ = that.clikSpItem.specslist[0].DGJGZ;
			that.clikSpItem.DGPLID = that.clikSpItem.specslist[0].DGPLID;
		} else {
			that.clikSpItem.selectSPID = that.clikSpItem.SPID;
			///若没有录入了商品 默认的数量为1  蛋糕和水吧都默认为1
			let arrSale002Filter = that.sale002.filter(item => {
				return item.SPID == that.clikSpItem.SPID
			})
			if (arrSale002Filter.length > 0) {
				console.log("arrSale002Filter录入的详情", arrSale002Filter);
				//已经录入了商品 
				that.clikSpItem.inputQty = arrSale002Filter[0].QTY;
			}
		}
		that.resetDrinkPro();
		that.clikSpItem.PRICE = that.spPrice[that.clikSpItem.selectSPID].PRICE;
		that.log("设置显示对象" + JSON.stringify(that.clikSpItem));
		that.Page.$set(that.Page[that.pageName], "clikSpItem", that.clikSpItem);
		//that.cakeFilter([{'ID':'002002'},{'ID':'003002'},{'ID':'003009'}])
	}

	//已经筛选好的蛋糕数组，作为缓存
	this.cakeList = []
	//根据传入的标签数组进行筛选，返回that.clikSpItem
	//使用结构中的bqlist  进行筛选
	//传入的参数格式[{id:"xxxxx"}] 
	this.cakeFilter = function(pm_inputArr) {
		that.cakeListInit();
		if (that.cakeList.length == 0) {
			that.myAlert("没有筛选出蛋糕结果！");
			return;
		}
		var b = pm_inputArr;
		if (b == null || b.length == 0) {
			return that.cakeList;
		} else {
			var fret = []
			that.cakeList.forEach(a => {
				let x = a.bqlist.filter(item => {
					let ret = b.filter(itemb => {
						return itemb.ID == item.ID
					});
					return ret.length > 0;
				});
				if (x.length == b.length) {
					fret.push(a);
				}
			})
			console.log("查看一下筛选的结果", fret);
			return fret;
		}
	}
	//只做一次 将所有蛋糕筛选出来备用
	this.cakeListInit = function() {
		let fplid = '109';
		if (that.cakeList.length > 0) {
			return;
		}
		var carr = that.Allsplist.filter(item => {
			return (item.plid.indexOf(fplid) == 0);
		})
		console.log("查看蛋糕的总长度" + carr.length, carr[0]);
		carr.forEach(
			carritem => {
				carritem.plarr.forEach(
					spitem => {
						if (spitem.ynshowlist == "1") {
							that.cakeList.push(spitem);
						}
					}
				)
			}
		)

		console.log("查看一下蛋糕的数据呢", that.cakeList)
	}


	//dgyd展示预定蛋糕详情
	this.ShowCakeDetail = function(e) {
		// that.SetManage("inputsp");
		console.log("蛋糕信息：", e);
		util.simpleMsg("当前蛋糕：" + e.DGXLID);
	}
	//选择蛋糕时候的操作
	this.selectSPID_Chenged = function(e) {
		//SPECS,DGJGZ,DGPLID 为selectSPID_Chenged动态添加的属性，只有蛋糕商品存在此属性，其他商品不存在！
		that.log("进入事件：" + JSON.stringify(e.currentTarget.dataset));
		let spid = e.currentTarget.dataset.spid;
		let specs = e.currentTarget.dataset.specs;
		let dgjgz = e.currentTarget.dataset.dgjgz;
		let dgplid = e.currentTarget.dataset.dgplid;
		that.log("选择的商品编码：" + JSON.stringify(spid) + JSON.stringify(dgjgz) + JSON.stringify(dgplid));
		that.clikSpItem.selectSPID = spid;
		that.clikSpItem.SPECS = specs;
		that.clikSpItem.DGJGZ = dgjgz;
		that.clikSpItem.DGPLID = dgplid;
		that.clikSpItem.PRICE = that.spPrice[spid].PRICE;
		that.log("" + JSON.stringify(that.clikSpItem));
		that.update();
	}
	//选择水吧属性的操作
	this.selectSxitem_Chenged = function(e) {

		that.log("进入事件：" + JSON.stringify(e.currentTarget.dataset));
		let dinx = e.currentTarget.dataset.dinx;
		let sxinx = e.currentTarget.dataset.sxinx;
		that.log("选择的属性列表：" + JSON.stringify(that.clikSpItem.addlist[dinx]));
		let lqty = that.clikSpItem.addlist[dinx].Darr[sxinx].QTY; //表示选中
		let CSTCODE = that.clikSpItem.addlist[dinx].Darr[sxinx].CSTCODE;
		if (CSTCODE == '1') //等于1表示免费是互斥的  等于2是多选的
		{
			for (var i = 0; i < that.clikSpItem.addlist[dinx].Darr.length; i++) {
				if (i == sxinx) {
					that.clikSpItem.addlist[dinx].Darr[i].SELECTED = "X";
				} else {
					that.clikSpItem.addlist[dinx].Darr[i].SELECTED = "";
				}
			}
		} else //此种情况下为付费的 可以多选
		{
			that.clikSpItem.addlist[dinx].Darr[sxinx].SELECTED = "X"
			lqty = lqty + 1;
			that.clikSpItem.addlist[dinx].Darr[sxinx].QTY = lqty;
			that.sumDrinkNewNet();
		}
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
	this.SetType = function(pm_type, uncheck = false) {
		console.log("[SetType]设置销售类型:", pm_type);
		this.previous = this.clickSaleType?.clickType;
		console.log("[SetType]上一个类型:", this.previous);
		console.log("[SetType]当前操作配置:", this.currentOperation);
		if (!this.currentOperation[pm_type] && (!uncheck)) {
			this.myAlert("请完成当前模式再进行切换！");
			return;
		}

		if (XsTypeObj[pm_type]) {
			// this.clickSaleType = XsTypeObj[pm_type];
			console.warn("type:", this.clickSaleType);
			console.warn("type:", XsTypeObj[pm_type]);
			// Object.assign(this.clickSaleType, XsTypeObj[pm_type]);//容易合并到其他模式没有的属性
			this.clickSaleType = XsTypeObj[pm_type];
			console.log("[SetType]设置当前点击销售的类型为:", this.clickSaleType);
			this.Page.$set(that.Page[that.pageName], "clickSaleType", that.clickSaleType);
			console.log("[SetType]销售类型:", pm_type);
			if (this.sale002.length > 0 && (this.currentOperation.sale002Rows == this.clickSaleType
					.operation.sale002Rows)) {
				this.myAlert("已录入商品，无法切换此模式！")
				return;
			}
			if (this.DKF && this.DKF.cval.DKFID != "80000000") {
				this.DKF.val = {};
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
		util.setStorage('open-loading', true);
		console.log("[PayedResult]支付结果:", result);
		uni.$emit('continue-message');
		uni.$emit('continue-timed-communication');
		// let cxfsSqlArr = _main.CXMDFS(this.sale001, this.cxfsArr, this.FZCX.cval.data, this.currentOperation
		// 	.ynCx, this.currentOperation.FZCX);
		// this.communication_for_oracle = this.communication_for_oracle.concat(cxfsSqlArr);
		// console.log("追加了促销跟踪的sql:", this.communication_for_oracle);
		// return;
		if (!result.code) { //取消支付或者支付失败了 不走后续的处理
			util.simpleMsg(result.msg, !result.code);
			//清除一下辅助促销 以及辅助促销产生的折扣数据 
			this.FZCX.cval = {};
			this.sale001.TCXDISC = 0; //fzcx
			this.sale001.TDISC = 0; //fzcx 
			//清除手工折扣
			this.sale001.ROUND = 0;
			return;
		}
		payresult = result;
		this.sale001 = Object.cover(new sale.sale001(), result.data.sale1_obj);
		this.sale002 = (result.data.sale2_arr ?? []).map(sale2 => Object.cover(new sale.sale002(),
			sale2));
		this.sale003 = (result.data.sale3_arr ?? []).map(sale3 => Object.cover(new sale.sale003(),
			sale3));
		this.sale008 = (result.data.sale8_arr ?? []).map(sale8 => Object.cover(new sale.sale008(),
			sale8));
		console.log("[PayedResult]支付结果状态判断...", result.code);
		if (result.code) {
			util.simpleMsg(result.msg);
			//反写一下会员id
			if (this.sale001.CUID) {
				this.HY.cval = {};
				this.HY.cval.hyId = this.sale001.CUID;
				console.log("反写会员信息成功：", this.HY.cval.hyId);
			}
			console.log("[PayedResult]是否允许辅助促销:", this.currentOperation.ynFzCx);
			//如果允许辅助促销
			if (this.currentOperation.ynFzCx) {
				let FZCXVal = this.FZCX.cval;
				console.log("[PayedResult]辅助促销的结果：", FZCXVal);
				if (FZCXVal && Object.keys(FZCXVal).length != 0) {
					FZCXVal.data.forEach(r => {
						let SPObj = _main.FindSP(this.Allsplist, r.SPID);
						console.log("当前匹配到的商品对象:", SPObj);
						console.log("当前辅助促销商品对象:", r);
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
			} catch (e) {
				console.log("[PayedResult]执行 SaleFinishing 发生异常:", e);
			}
			console.log("[PayedResult]调用执行 SaleFinishing 完毕!");
			//支付前允许手工折扣 则支付完成后要分摊商品金额
			if (this.currentOperation.ynSKDisc) {
				console.log("[PayedResult]判断支付前是否允许手工折扣...");
				//手工折扣额分摊
				this.sale002 = _main.ManualDiscount(this.sale001, this.sale002);
				console.log("[PayedResult]分摊后的商品信息：", this.sale002);
			}
			console.log("[PayedResult]准备创建销售单记录...", {
				sale001: this.sale001,
				sale002: this.sale002,
				sale003: this.sale003,
				sale006: this.sale006,
				sale008: this.sale008,
				ydsale001: this.ydsale001,
				ywbhqh: this.ywbhqh,
				sxsale001: this.sxsale001,
				...this.additional
			});
			console.log("[PayedResult]执行 CXMDFS 中...");
			let cxfsSqlArr = _main.CXMDFS(this.sale001, this.cxfsArr, this.FZCX.cval.data, this
				.currentOperation
				.ynCx, this.currentOperation.FZCX);
			this.communication_for_oracle = this.communication_for_oracle.concat(cxfsSqlArr);
			console.log("[PayedResult]追加了促销跟踪的sql:", this.communication_for_oracle);
			let create_result;
			try {
				create_result = await CreateSaleOrder({
					SALE001: this.sale001,
					SALE002: this.sale002,
					SALE003: this.sale003,
					SALE006: this.sale006,
					SALE008: this.sale008,
					YWBHQH: this.ywbhqh,
					YDSALE001: this.ydsale001,
					SXSALE001: this.sxsale001,
					...this.additional
				}, {
					sqlite: this.communication_for_sqlite,
					oracle: this.communication_for_oracle
				});
			} catch (e) {
				console.log("[PayedResult]订单sql生成发生异常:", e);
			}
			let bill = "";
			console.warn("[PayedResult]结算模式信息获取:", this.current_type);
			if (this.current_type.clickType == 'sale_credit_settlement') {
				bill = this.mode_info.sale_credit_settlement.new_bill;
				console.log("[PayedResult]赊销结算模式...");
			} else {
				bill = this.sale001.BILL;
				console.log("[PayedResult]其他结算模式...");
			}
			console.log('[PayedResult]通信表记录单号:', bill);
			common.TransLiteData(bill); //上传至服务端
			console.log("[PayedResult]创建销售单结果:", create_result);
			util.simpleMsg(create_result.msg, !create_result.code);
			try {
				this.$saleFinied(result.data);
			} catch (e) {
				console.log("[SaleFinied]执行异常:", e);
			}
		} else {
			util.simpleMsg(result.msg, true);
		}

		console.log("支付后要跳转的模式：", this.clickSaleType)
		console.log("支付后要跳转的模式：", this.clickSaleType.afterPay)
		this.resetSaleBill(this.clickSaleType.afterPay); //支付后要跳转的销售模式
	}

	//去支付
	this.pay = async function() {
		if (that.currentOperation.showEdit) {
			util.simpleMsg("请先完成商品编辑", "none");
			return;
		}
		if (!that.sale002 || that.sale002.length == 0) {
			util.simpleMsg("请先加购商品", true);
			return;
		}
		if (that.$beforeFk()) {
			console.log("[Pay]已进入支付!");
			that.PayParamAssemble();
		} else {
			console.log("[Pay]未进入支付!");
		}
	}

	this.PayParamAssemble = function(sales) {
		uni.$emit('stop-message');
		uni.$emit('stop-timed-communication');
		that.log("[PayParamAssemble]支付参数组装...")
		util.setStorage('open-loading', false);
		let inputParm = {
			sale1_obj: that.sale001, //001 主单 数据对象
			sale2_arr: that.sale002, //002 商品 数据对象集合
			sale3_arr: that.sale003, //003 支付数据集合
			sale8_arr: that.sale008, //008水吧商品
			score_info: that.score_info, //积分抵现信息
			ban_pay: that.ban_type, //被禁用的支付类型
			PayList: that.payed, //已支付信息
			actType: that.actType, //动作类型(退款、支付)
			hyinfo: that.HY.cval //会员信息
		}
		// console.log("[PayParamAssemble]封装数据:", inputParm);
		that.Page.$store.commit('set-location', inputParm);
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
		try {
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
		} catch (e) {
			console.warn("[InitSale]发生异常:", e);
		}

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
		Object.assign(inputParm.sale001, retparm);

		inputParm.sale001.GSID = this.GSID;
		console.log("[SetNewParmSale]SALE001合并后:", inputParm.sale001);
		inputParm.sale002.forEach(item002 => {
			Object.cover(item002, retparm);
		})
		console.log("[SetNewParmSale]SALE002合并后:", inputParm.sale002);
		inputParm.sale003.forEach(item003 => {
			Object.cover(item003, retparm);
		})
		console.log("[SetNewParmSale]SALE003合并后:", inputParm.sale003);
		if (pm_actType == common.actTypeEnum.Refund) {
			console.log("[SetNewParmSale]原单信息:", savaSale001);
			inputParm.sale001.XS_GSID = savaSale001.GSID;
			inputParm.sale001.XS_KHID = savaSale001.KHID;
			inputParm.sale001.XS_DATE = savaSale001.SALEDATE;
			inputParm.sale001.XS_POSID = savaSale001.POSID;
			inputParm.sale001.XS_BILL = savaSale001.BILL;
			// inputParm.sale001.BILL = this.getBill();
			// inputParm.sale001.SALEDATE = this.getDate();
			// inputParm.sale001.SALETIME = this.getTime();
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
	//创建新单 测试版
	this.createNewBill = function(e) {
		var commonSaleParm = {};
		let newbill = this.getBill();
		let stime = this.getTime();
		console.log("[CreateNewBill]创建新单!");
		console.log("[CreateNewBill]sale001：", this.sale001);
		console.log("[CreateNewBill]创建新单的大客户信息：", this.DKF.val);
		if (e && Object.keys(this.sale001).length > 0) { //适用于添加商品时的处理
			console.log("[CreateNewBill]sale1已经初始化过...");
			commonSaleParm = {
				KHID: this.sale001.KHID,
				POSID: this.sale001.POSID,
				RYID: this.sale001.RYID,
				BILL: this.sale001.BILL,
				KCDID: this.sale001.KCDID,
				GCID: this.sale001.GCID,
				DPID: this.sale001.DPID,
				SALEDATE: this.sale001.SALEDATE,
				SALETIME: this.sale001.SALETIME,
				CLTIME: this.sale001.CLTIME,
				YN_OK: this.sale001.YN_OK,
				YN_SC: this.sale001.YN_SC,
				YAER: this.sale001.YAER,
				MONTH: this.sale001.MONTH,
				WEEK: this.sale001.WEEK,
				TIME: this.sale001.TIME,
				DKFID: this.sale001.DKFID
			}
		} else {
			console.log("[CreateNewBill]sale1未初始化过...");
			commonSaleParm = {
				GSID: this.GSID,
				KHID: this.Storeid,
				SALEDATE: this.saledate,
				POSID: this.POSID,
				RYID: this.ryid,
				BILL: newbill,
				KCDID: this.KCDID,
				DPID: this.DPID,
				GCID: this.GCID,
				SALETIME: stime,
				YN_OK: 'X', //默认为 X
				YN_SC: 'N', //默认为 N
				YAER: _date.getDateByParam("Y"),
				MONTH: _date.getDateByParam("M"),
				WEEK: _date.getDateByParam("w"),
				TIME: _date.getDateByParam("h"),
				DKFID: this.DKF.val.DKFID
			};
		}
		console.log("旧的sale001：", this.sale001);
		// let oldSale1 = new saleClass.sale001();

		if (Object.keys(this.sale001).length == 0) { //BILL,KCDID  ,DPID,SALETIME,GCID
			// if (Object.keys(this.sale001).length != Object.keys(oldSale1).length) { //
			this.sale001 = new sale.sale001(commonSaleParm)
			console.log("[CreateNewBill]新单创建完毕!", this.sale001);
		}
		console.log("[CreateNewBill]单据参数：", commonSaleParm);
		return commonSaleParm;
	}
	this._createNewBill = function() {
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
				YN_OK: 'X', //默认为 X
				YN_SC: 'N', //默认为 N
				YAER: _date.getDateByParam("Y"),
				MONTH: _date.getDateByParam("M"),
				WEEK: _date.getDateByParam("w"),
				TIME: _date.getDateByParam("h"),
				DKFID: this.DKF.val.DKFID
			};
			this.sale001 = new sale.sale001(commonSaleParm)
			this.sale001.GSID = this.GSID;
			console.log("[CreateNewBill]新单创建完毕!", this.sale001);
		} else {
			console.log("[CreateNewBill]创建新单参数!");
			commonSaleParm = {
				KHID: this.sale001.KHID,
				POSID: this.sale001.POSID,
				RYID: this.sale001.RYID,
				BILL: this.getBill(),
				KCDID: this.sale001.KCDID,
				GCID: this.sale001.GCID,
				DPID: this.sale001.DPID,
				SALEDATE: this.sale001.SALEDATE, //退款应该采用新的值
				SALETIME: this.sale001.SALETIME, //退款应该采用新的值
				CLTIME: this.sale001.SALETIME, //退款应该采用新的值
				YN_OK: this.sale001.YN_OK, //默认为 X
				YN_SC: this.sale001.YN_SC, //默认为 N
				YAER: this.sale001.YAER,
				MONTH: this.sale001.MONTH,
				WEEK: this.sale001.WEEK,
				TIME: this.sale001.TIME,
				DKFID: this.sale001.DKFID
			}
		}
		return commonSaleParm;
	}

	//汇总sale002的所有内容
	this.sale002Sum = function(pm_input) {
		console.log("[Sale002Sum]汇总sale002的所有内容...", this.sale002);
		this.sale002.forEach(item => {
			console.log("[Sale002Sum]循环中查看002:", item);
			let keys = Object.keys(pm_input);
			for (var i = 0; i < keys.length; i++) {
				if (keys[i] == "ONET") {
					pm_input[keys[i]] += that.float(item["OPRICE"] * item["QTY"], 2);
				} else {
					pm_input[keys[i]] += that.float(item[keys[i]], 2);
				}
			}
		})
		return pm_input;
	}

	//点击商品的详情触发的事件
	this.getSp = function(e) {
		let store = util.getStorage("store");
		if (store.LOGINDATE && new Date(store.LOGINDATE).getDate() !== new Date().getDate()) {
			util.simpleMsg("签到状态过期，请重新签到", "none");
			store.OPENFLAG = 0;
			util.setStorage("store", store);
			util.sleep(1500);
			uni.redirectTo({
				url: "/pages/Center/Center"
			});
			return;
		}
		console.log("[GetSp]获取商品详情:");
		let pm_spid = that.clikSpItem.selectSPID;
		let pm_yndgxp = e.currentTarget.dataset.yndgxp; //是否是改胚蛋糕
		let pm_qty = that.clikSpItem.inputQty;
		let find = false;
		let inqty = parseFloat(pm_qty);
		that.log(pm_spid + "#" + pm_qty + "pm_yndgxp")
		var drink = that.sale008.filter(item => {
			return item.SPID = pm_spid
		});
		///检查是否已经添加过  如果已经添加过 直接修改某一行
		if (drink.length == 0) //如果有水吧商品的信息这里直接跳过
		{
			for (var row = 0; row < that.sale002.length; row++) {
				if (that.sale002[row].SPID == pm_spid) {
					find = that.updateSp(row, pm_spid, inqty)
					break;
				}
			}
		}
		if (pm_qty <= 0) {
			util.simpleMsg("请选择商品数量", true);
			return;
		}
		console.log("[GetSp]是否存在添加商品:", find);
		if (!find) {
			//从这里开始就是添加商品的逻辑，包含了水吧008的商品 可以独立一个方法
			//STR1 商品名称 STR2 门店名称  YN_XPDG  ,YNZS, SPJGZ
			console.log("[GetSp]进行单据创建,调用createNewBill有参...");
			let newprm = that.createNewBill.call(that, 1);
			// let new002 = new sale.sale002(newprm);
			let new002 = new sale.sale002();
			new002 = Object.cover(new002, newprm);
			console.log("[GetSp]生成新 sale002:", new002);
			var timeNo = new Date().getTime().toString().substr(4)
			new002.SPID = pm_spid;
			new002.NO = timeNo;
			new002.STR1 = that.clikSpItem.SNAME;
			//SPECS,DGJGZ,DGPLID 为selectSPID_Chenged动态添加的属性，只有蛋糕商品存在此属性，其他商品不存在！
			new002.UNIT = that.clikSpItem.SPECS || that.clikSpItem.UNIT;
			new002.SPJGZ = that.clikSpItem.DGJGZ || that.clikSpItem.SPJGZ;
			new002.PLID = that.clikSpItem.DGPLID || that.clikSpItem.XPLID;
			new002.STR2 = that.storeName;
			new002.YN_XPDG = pm_yndgxp;

			let price = that.spPrice[pm_spid].PRICE;
			console.log("商品的动态价格：", price);
			pm_qty = that.float(pm_qty, 3);
			price = that.float(price, 2);

			//添加水吧商品  水吧商品的
			if (that.clikSpItem.ynAddPro) {
				//水吧商品默认只加一个
				pm_qty = 1;
				that.clikSpItem.addlist.forEach(
					item => {
						item.Darr.forEach(drinkitem => {
							if (drinkitem.SELECTED == "X") {
								console.log("[GetSP]水吧商品:", drinkitem);
								let new008 = new sale.sale008();
								console.log("录入的水吧商品", drinkitem)
								new008 = Object.cover(new008, newprm);
								new008.NO = timeNo;
								new008.SPID = drinkitem.SPID;
								new008.OPTCODE = drinkitem.OPTCODE;
								new008.OPTMAT = drinkitem.OPTMAT
								new008.ATTCODE = drinkitem.ATTCODE;
								new008.ATTNAME = drinkitem.OPTNAME;
								new008.QTY = drinkitem.CSTCODE == '1' ? 0 : drinkitem.QTY;
								new008.PRICE = that.spPrice[drinkitem.OPTMAT]?.PRICE ?? 0;
								that.sale008.push(new008);
								//就是这里售价要累加
								price += that.float(drinkitem.QTY, 2) * that.float(new008
									.PRICE);
							}

						})
					}
				)
				//添加水吧商品
			}
			new002.OPRICE = price;
			new002.PRICE = price;
			new002.QTY = pm_qty;
			new002.NET = that.float(pm_qty * price, 2);
			new002.DISCRATE = 0;
			new002.BARCODE = that.clikSpItem.SPID;

			that.sale002.push(new002);

			that.log("[GetSp]添加了商品", new002);
			that.log("[GetSp]添加了水吧商品", that.sale008);
			that.log("[GetSp]添加商品对象", that.clikSpItem);
			//that.log("[GetSp]商品价格", that.spPrice);
			util.simpleMsg("商品添加成功");
		}
		if (that.clikSpItem.ynAddPro) {
			//水吧商品不关闭 直接刷新
			that.resetDrinkPro();
			that.update();
		} else {
			if (!that.clikSpItem.img) { //排除蛋糕预定确认后 还弹框的问题
				that.SetManage("inputsp");
			}
		}
	}
	//重置水吧商品的属性
	this.resetDrinkPro = function() {
		if (!that.clikSpItem.ynAddPro) {
			return;
		}
		that.clikSpItem.inputQty = 1;
		that.clikSpItem.NEWPRICE = 0 //每次添加后重置，新的水吧总价
		that.clikSpItem.addlist.forEach(
			item => {
				item.Darr.forEach(
					drinkitem => {

						drinkitem.QTY = 0; //添加完产品后qty清零
						drinkitem.SELECTED = drinkitem.RECMARK; //回复为默认选项
					}
				)
			}
		)


	}

	///计算最新的水吧累计金额
	this.sumDrinkNewNet = function() {
		var price = 0;
		if (!that.clikSpItem.ynAddPro) {
			return;
		}
		that.clikSpItem.addlist.forEach(
			item => {
				item.Darr.forEach(
					drinkitem => {
						console.log("显示一下售价" + drinkitem.SELECTED + "###" + drinkitem.CSTCODE);
						if (drinkitem.SELECTED == "X" && drinkitem.CSTCODE == '2') {
							var itempprice = that.spPrice[drinkitem.OPTMAT]?.PRICE ?? 0;
							console.log("显示一下售价" + itempprice)
							//就是这里售价要累加
							price += that.float(drinkitem.QTY) * that.float(itempprice);
						}
					}
				)
			}
		)
		that.clikSpItem.NEWPRICE = price;

	}
	///清除水吧产品的所有选择
	this.clearDrinkSx = function(pm_inx) {
		var maddr = that.clikSpItem.addlist[pm_inx].Darr;
		maddr.forEach(
			drinkitem => {
				drinkitem.QTY = 0; //添加完产品后qty清零
				drinkitem.SELECTED = drinkitem.RECMARK; //回复为默认选项
			}
		)
		that.sumDrinkNewNet();
		that.update()
	}

	//大于0的时候修改,小于等于0删除
	this.updateSp = function(pm_row, pm_spid, pm_qty) {
		console.log("[UpdateSp]更新商品...");
		if (pm_row < this.currentOperation.lockRows && pm_qty !== 0 && pm_qty != this.sale002[pm_row].QTY) {
			util.simpleMsg("该商品已被锁定!", true)
			console.log("[UpdateSp]商品处于被锁定行，无法修改数量!");
			return true;
		}
		if (pm_qty > 0) {
			this.sale002[pm_row].QTY = pm_qty;
			let price = this.float(this.sale002[pm_row].PRICE, 2);
			this.sale002[pm_row].NET = this.float(pm_qty * price, 2);
			that.log("更新商品" + JSON.stringify(this.sale002[pm_row]))
		}
		if (pm_qty <= 0) {

			//删除水吧相关的产品 
			for (var i = this.sale008.length - 1; i >= 0; i--) {
				if (this.sale008[i].NO == this.sale002[pm_row].NO) {
					this.sale008.splice(i, 1);
				}
			}
			this.sale002.splice(pm_row, 1);
		}
		return true;
	}

	/**
	 * 显示购物车
	 * @param {*} e 
	 */
	this.ShowStatement = async function(e) {
		let store = util.getStorage("store");
		if (store.LOGINDATE && new Date(store.LOGINDATE).getDate() !== new Date().getDate()) {
			util.simpleMsg("签到状态过期，请重新签到", "none");
			store.OPENFLAG = 0;
			util.setStorage("store", store);
			util.sleep(1500);
			uni.redirectTo({
				url: "/pages/Center/Center"
			});
			return;
		}
		console.log("促销权限：", that.currentOperation.ynCx);
		if (that.sale002.length == 0 || Object.keys(that.sale002).length == 0) {
			util.simpleMsg("请先加购商品", true);
			return;
		}
		console.log("[ShowStatement]SALE001:", that.sale001);
		console.log("[ShowStatement]商品信息:", that.sale002);
		await that.SaleNetAndDisc();
		console.log("[ShowStatement]打开结算单:", that.sale002);
		that.SetManage("statement");
		//如果会员存在 则直接打开会员详情
		if (that.HY.val.hyId && that.HY.val.Phone) {
			that.HY.open = true;
		}
	}

	//计算sale002
	this.SaleNetAndDisc = async function(e = 0) {
		let znet = 0
		if (Object.keys(that.sale002).length == 0) {
			//如果没有加购商品 则sale1可能未初始化 导致一些默认值KHID 无法初始化到sale001上 导致传输到支付页面KHID 为空
			return;
		}
		this.ban_type = []; //清空禁止支付方式操作
		if (that.currentOperation.ynCx) {
			console.log("[SaleNetAndDisc]促销前:", that.sale002);
			console.log("促销计算条件：", e);
			//调用促销计算
			let response = await cx.Createcx(that.sale002, this.clickSaleType?.clickType, this.HY.cval, e);
			// that.sale002 = response.products;
			this.CheckOver48Hours(response?.cxfs); //检查是否包含 hylv=3-48 的数据
			this.ScoreCount(response?.cxfs); //总和积分和抵现积分金额
			this.BanPayType(response?.cxfs); //收集禁止的支付id
			this.cxfsArr = response?.cxfs; //促销跟踪
			console.log("促销跟踪数据：", this.cxfsArr);
			let TCXDISC = 0;
			that.sale002.map(r => {
				TCXDISC += r.CXDISC
			});
			this.sale001.TCXDISC = TCXDISC;
			this.sale001.TDISC = TCXDISC;
			console.log("普通促销计算后的销售单1:", this.sale001);
			console.log("普通促销计算后的销售单2:", that.sale002);
		}
		// 因为默认促销和折扣都开启，所以只有禁止促销后才能进行折扣（选择折扣后促销则为false）
		if (!that.currentOperation.ynCx && that.currentOperation.Disc) {
			that.discCompute();
			let TBZDISC = 0,
				TLSDISC = 0,
				TTPDISC = 0;
			that.sale002.map(r => {
				TBZDISC += r.BZDISC;
				TLSDISC += r.LSDISC;
				TTPDISC += r.TPDISC;
			});
			//001 表追加特殊折扣值
			this.sale001.TBZDISC = TBZDISC;
			this.sale001.TLSDISC = TLSDISC;
			this.sale001.TTPDISC = TTPDISC;
			this.sale001.TDISC = TBZDISC + TLSDISC + TTPDISC;
			console.log("特殊折扣计算后的销售单2:", that.sale002);
			console.log("特殊折扣计算后的销售单1:", this.sale001);
			if (that.Disc.cval.ZKType && that.Disc.cval.ZKType != "NO") { //选了折扣类型才进行禁止支付的操作
				this.BanPayType(); //收集禁止的支付id
			}
		}
		var retx = that.sale002Sum({
			ONET: 0,
			NET: 0,
			QTY: 0,
			DISCRATE: 0
		});
		// that.log("***************计算结果展示******************")
		// that.log(retx)
		// that.log("***************计算结果展示******************")
		console.log("[SaleNetAndDisc]参数:", {
			retx
		});
		// that.sale001.ZNET = this.float(retx.ONET, 2); //原价
		// that.Page.$set(that.sale001, "TNET", this.float(retx.ONET - retx.DISCRATE, 2))

		//为了兼容预定提取 初始化会清除折扣额的问题，早期购物车重复开关闭会产生重复扣减的问题 待后续测试后去除
		//1.销售退单 discrate 默认为0 就会导致002的商品原价-0=NET 
		// if (this.clickSaleType.clickType != "sale_reserve_extract") {
		// 	that.sale001.TNET = this.float(retx.ONET - retx.DISCRATE, 2);
		// } else {
		that.sale001.TNET = this.float(retx.NET, 2); //全部采用累加net 测试
		// }
		that.sale001.ZNET = that.sale001.TNET; //调整为原价
		that.sale001.BILLDISC = this.float(retx.DISCRATE, 2); //包含了促销 和特殊折扣
		// that.sale001.TLINE = this.float(retx.QTY, 2);
		that.sale001.TLINE = that.sale002.length; //这个是存商品行
		//注意这一步不是计算辅助促销，仅仅是筛选辅助促销的数据
		if (that.currentOperation.ynFzCx) {
			this.computeFzCx();
		}
		console.log("计算过促销和折扣后的主单001：", that.sale001);
		console.log("计算过促销和折扣后的商品002：", that.sale002);
		that.update();
	}

	this.CheckOver48Hours = function(list) {
		if (list) {
			let over48 = list?.find(i => i.HYLV === '3-48');
			if (over48) this.over48 = true;
			else this.over48 = false;
			console.log("[CheckOver48Hours]HYLV为3-48的信息判断结果:", this.over48);
		} else
			console.warn("[CheckOver48Hours]list值无效!");
	}

	this.ScoreCount = function(list) {
		console.log("[ScoreCount]积分原列表:", list);
		if (list) {
			let score_total = 0;
			let money_total = 0;
			let ispoints = 0;
			list.forEach(i => {
				score_total += i.JFNUM;
				money_total += i.DHNET;
				ispoints += i.POINTS;
			})
			this.score_info.money = money_total;
			this.score_info.score = score_total;
			this.score_info.ispoints = ispoints;
			console.log("[ScoreCount]抵现积分总和结果:", this.score_info);
		} else
			console.warn("[ScoreCount]list值无效!");
	}

	this.BanPayType = function(list) {
		console.log("[BanPayType]被禁止类型:", list);

		let PayWayList = util.getStorage("PayWayList");
		if (list) {
			var ban_pay = [];
			// this.sale001.CUID = this.HY.val.hyId; 
			//!this.sale001.CUID || 
			if (!this.HY.val.hyId) {
				let pay_info = PayWayList.find(i => i.type === 'HyJfExchange');
				if (pay_info)
					ban_pay.push(pay_info.fkid);
			}
			list.forEach(i => {
				ban_pay = ban_pay.concat(i.NOTFKID?.split(','));
			});
			this.ban_type = Array.from(new Set(ban_pay));
			console.log("[BanPayType]存在禁止类型...", this.ban_type);
		} else { //特殊折扣只允许 这两种支付方式
			console.warn("[BanPayType]折扣禁止支付方式处理!");
			console.log("[BanPayType]禁止类型1:", PayWayList);

			let arr = PayWayList.filter(r => {
				return r.type != "WXZF" && r.type != "TL"
			});
			this.ban_type = arr.map(r => {
				return r.fkid
			});
		}
		console.log("[BanPayType]禁止类型:", this.ban_type);
	}

	//获取辅助促销的数据 因为需要依赖加购的商品产生的sale001 总价
	this.computeFzCx = function() {
		// console.log("001数据：", that.sale001);
		// console.log("总的商品价格：", that.spPrice);
		// 先获取辅助促销数据
		_main.GetFZCX(this.Storeid, async res => {
			that.FZCX.oval = await _main.GetFZCXNew(res, that.sale001, that.sale002, that
				.spPrice);
			console.log("[ComputeFzCx]重组后的辅助促销商品:", that.FZCX.oval);
		});
	}

	//使用特殊折扣进行计算
	this.discCompute = function() {
		// 计算商品的折扣值
		// console.log("002旧数据：", that.sale002);
		let res = _main.MatchZKDatas(this.Disc.val, that.sale002);
		that.sale002 = res.sale2;
		that.ZKHDArr = res.zkrule;
		console.log("002增加折扣后的新数据：", that.sale002);
	}
	//使用手工折扣进行计算 旧版四舍五入的逻辑
	this._SKdiscCompute = function() {
		//手工折扣额的处理
		let oldTNET = Number(this.sale001.TNET);
		console.log("[SKdiscCompute]原金额：", oldTNET);
		let newTnet = this.float(Math.round(oldTNET * 10) / 10, 2);
		console.log("[SKdiscCompute]新金额：", newTnet);
		let SKY_DISCOUNT = this.float(oldTNET - newTnet, 2);
		console.log("[SKdiscCompute]手工折扣额：", SKY_DISCOUNT);
		this.sale001.TNET = newTnet;
		this.sale001.ZNET = newTnet; //this.float(oldTNET - SKY_DISCOUNT, 2);
		this.sale001.BILLDISC = this.float(Number(this.sale001.BILLDISC) + SKY_DISCOUNT, 2);
		this.sale001.TCXDISC = this.float(Number(this.sale001.TCXDISC) + SKY_DISCOUNT, 2);
		this.sale001.ROUND = SKY_DISCOUNT;
		this.sale001.TDISC = this.float(Number(this.sale001.TDISC) + SKY_DISCOUNT, 2);
		console.log("[skdiscCompute]001计算手工折扣后的新数据：", that.sale001);
	}
	//使用手工折扣进行计算 新版舍弃全部分的逻辑
	this.SKdiscCompute = function() {
		//手工折扣额的处理
		console.log("原金额：", this.sale001.TNET);
		let SKY_DISCOUNT = this.float(((this.sale001.TNET * 10) % 1) / 10, 2);
		console.log("手工折扣额：", SKY_DISCOUNT);
		this.sale001.TNET = this.float(Number(this.sale001.TNET) - SKY_DISCOUNT, 2);
		this.sale001.ZNET = this.float(Number(this.sale001.ZNET) - SKY_DISCOUNT, 2);
		this.sale001.BILLDISC = this.float(Number(this.sale001.BILLDISC) + SKY_DISCOUNT, 2);
		this.sale001.TCXDISC = this.float(Number(this.sale001.TCXDISC) + SKY_DISCOUNT, 2);
		this.sale001.ROUND = SKY_DISCOUNT;
		this.sale001.TDISC = this.float(Number(this.sale001.TDISC) + SKY_DISCOUNT, 2);
		console.log("[skdiscCompute]001计算手工折扣后的新数据：", that.sale001);
	}

	//付款之前触发
	this.$beforeFk = function(pm_inputParm) {
		console.log("[BeforeFk]支付前触发:", pm_inputParm);
		console.log("[BeforeFk]当前的权限:", this.currentOperation);
		console.log("[BeforeFk]当前的模式:", this.current_type);
		//在付款前写这个防止左右更改！
		this.sale001.XSTYPE = this.xsType //付款的时候写
		this.sale001.BILL_TYPE = this.bill_type; //
		this.sale001.DKFID = this.DKF.val.DKFID; //当前选择的大客户的编码
		this.sale001.CUID = this.HY.cval.hyId; //如果sale1无hyid则写会员对象的hyid
		console.log("[BeforeFk]sale001：", this.sale001);
		//写大客户
		//code...
		//写会员
		//code...
		//可以使用的支付方式 
		//code...
		//如果 operation 中包含就弹出
		if (this.currentOperation.ynFzCx && this.FZCX.oval.length > 0) { //要有辅助促销数据
			console.log("[BeforeFk]此模式包含辅助销促操作...");
			this.setComponentsManage(null, 'FZCX');
			uni.$once('close-FZCX', util.callBind(this, function(e) {
				console.log("[BeforeFk]辅助促销关闭!");
				console.log("[BeforeFk] 追加辅助促销前的sale001：", this.sale001);
				//追加辅助促销的差价和折扣
				if (this.FZCX.cval && Object.keys(this.FZCX.cval).length > 0 && Object.keys(
						this
						.FZCX
						.cval.data || {}).length > 0) {
					console.warn("[BeforeFk]辅助促销计算部分!");
					this.sale001.TNET += this.FZCX.cval.payAmount; //加上辅助促销的的差价
					this.sale001.ZNET += this.FZCX.cval.payAmount; //加上辅助促销的的差价
					let allDisc = 0;
					this.FZCX.cval.data.forEach(r => {
						allDisc += (r.ONET - r.CXNET);
					})
					allDisc = Number(allDisc.toFixed(2));
					console.log("[BeforeFk] 追加辅助促销折扣额：", allDisc);
					this.sale001.BILLDISC += allDisc;
					this.sale001.TCXDISC += allDisc;
					this.sale001.TDISC += allDisc;
					this.sale001.TLINE += this.FZCX.cval.data.length;
					console.log("[BeforeFk] 追加辅助促销后的sale001：", this.sale001);
				}
				//计算手工折扣
				if (that.currentOperation.ynSKDisc) {
					this.SKdiscCompute();
				}
				console.log("手工折扣计算完毕");
				return this.CurrentTypeCall("$beforeFk",
					pm_inputParm); //将对应模式的 $beforeFK 调用，根据返回布尔确认是否进行进入支付操作。
			}))
			return false;
		} else {
			console.log("[BeforeFk]此模式不包含辅助促销操作...");
			//计算手工折扣
			if (that.currentOperation.ynSKDisc) {
				this.SKdiscCompute();
			}
			return this.CurrentTypeCall("$beforeFk", pm_inputParm);
		}
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
	this.resetSaleBill = util.callBind(this, function(e) {
		console.log("传入的参数：", e);
		uni.$emit('set-member', {}); //通知一下外部 清空会员信息
		uni.$emit('set-dkf', "默认大客户"); //通知外部 恢复默认大客户
		this.HY.cval = {};
		this.HY.val = {};
		this.DKF.cval = {};
		this.Disc.cval = {};
		this.FZCX.oval = [];
		this.FZCX.cval = {};
		this.cxfsArr = [];
		this.CXHDArr = [];
		this.ZKHDArr = [];
		this.bill = null;
		this.sale001 = {};
		this.sale002 = [];
		this.sale003 = [];
		this.sale008 = [];
		this.ydsale001 = {};
		this.ywbhqh = [];
		this.sxsale001 = {};
		this.clikSpItem = {};
		this.payed = [];
		this.ban_type = [];
		this.notFayType = [];
		this.additional = {};
		this.communication_for_oracle = [];
		this.communication_for_sqlite = [];

		console.log("this.clickSaleType", this.clickSaleType);
		if (this.clickSaleType.clickType == "sale_cake_reserve") {
			this.clickSaleType.ShowCakeDetail() //关闭蛋糕预定的详情
		}
		console.log("this.clickSaleType.yn_showDetail", this.clickSaleType.yn_showDetail);
		// console.log("this.clickSaleType", this.clickSaleType);
		// console.log("重置后跳转到：", this.clickSaleType.afterPay);
		// this.SetDefaultType(this.clickSaleType.afterPay);
		// console.log("this.clickSaleType.yn_showDetail1", this.clickSaleType.yn_showDetail);
		this.SetDefaultType(e);
		that.update()
		console.log("[ResetSaleBill]清空后的：", this.sale001);
	})

	//打印的方法
	this.$print = function(e) {

	}

	//
	this.SetDefaultType = function(type = "sale") {
		console.log("[SetDefaultType]设置默认类型:", type);
		this.SetType(type, true);
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

	this.Bind()
}


export default {
	XsTypeObj,
	GetSale
}
