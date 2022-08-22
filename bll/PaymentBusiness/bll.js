import {
	RefundQuery
} from '@/api/business/da.js';
import {
	TransferForPaymentAll
} from '@/models/PaymentAll/models.js';
import common from '@/api/common.js';
import util from '@/utils/util.js';
/**
 * 支付处理操作 
 * @param {*} products 商品列表 
 */
export const Payment =async function(products) {
	let result = PriceCount(products)//支付金额初始化
	//预先重置
	let sale1_obj = {}, //支付 sale1 主表数据初始对象
		sale2_arr = [], //支付 sale2 子表数据初始对象
		sale3_arr = []; //支付 sale3 子表数据初始对象
	//创建基本结构
	//sale 001:
	sale1_obj = {
		BILL: "", //payall 追加
		SALEDATE: "", //payall 追加
		SALETIME: "", //payall 追加
		KHID: getApp().globalData.store.KHID,
		POSID: getApp().globalData.store.POSID,
		RYID: getApp().globalData.store.RYID,
		BILL_TYPE: "Z101", //销售类型
		XSTYPE: "1",
		XS_BILL: "",
		XS_POSID: "",
		XS_DATE: "",
		XS_KHID: "",
		XS_GSID: "",
		TLINE: products.length,
		TNET: 0, //payall 追加
		DNET: 0,
		ZNET: 0, //payall 追加
		BILLDISC: 0, //payall 追加
		ROUND: 0, //payall 追加
		CHANGENET: 0,
		CXTNET: 0,
		TCXDISC: 0,
		CUID: getApp().globalData.hyinfo?.hyId,
		CARDID: "",
		THYDISC: 0,
		TDISC: 0, //payall 追加
		YN_SC: 'N',
		GSID: getApp().globalData.store.GSID, //公司
		GCID: getApp().globalData.store.GCID,
		DPID: getApp().globalData.store.DPID,
		KCDID: getApp().globalData.store.KCDID,
		BMID: getApp().globalData.store.BMID,
		DKFID: getApp().globalData.store.DKFID,
		XSPTID: 'POS',
		YN_OK: 'X',
		THTYPE: 0,
		CLTIME: "" //payall 追加
	};
	//sale 002:
	sale2_arr = result.products.map((item, index) => {
		return util.hidePropety({
			BILL: "", //payall 追加
			SALEDATE: "", //payall 追加
			SALETIME: "", //payall 追加
			KHID: getApp().globalData.store.KHID,
			POSID: getApp().globalData.store.POSID,
			SPID: item.SPID,
			NO: index,
			PLID: item.PLID,
			BARCODE: item.BARCODE,
			UNIT: item.UNIT,
			QTY: item.QTY,
			PRICE: item.PRICE, //payall 追加
			OPRICE: item.OPRICE,
			NET: 0, //payall 追加
			DISCRATE: 0, //payall 追加
			YN_SKYDISC: '', //payall 追加
			DISC: 0, //payall 追加
			YN_CXDISC: 'N',
			CXDISC: 0,
			MONTH: '', //payall 追加
			WEEK: '', //payall 追加
			TIME: '', //payall 追加
			RYID: getApp().globalData.store.RYID,
			GCID: getApp().globalData.store.GCID,
			DPID: getApp().globalData.store.DPID,
			KCDID: getApp().globalData.store.KCDID,
			BMID: getApp().globalData.store.BMID,
			SKYDISCOUNT: item.SKYDISCOUNT
		}, "SKYDISCOUNT");
	});
	console.log("[Payment]sale1",sale1_obj);
	console.log("[Payment]sale2",sale2_arr);
	console.log("[Payment]sale3",sale3_arr);
	return await TransferForPaymentAll( //TransferForPaymentAll 简化了部分传值，下面是针对退款需要的值，根据所需也可以调整为支付所需的传值
		{
			sale1_obj: sale1_obj,
			sale2_arr: sale2_arr,
			sale3_arr: sale3_arr,
			SKY_DISCOUNT: result.sky_discount,
			Products:result.products,
			totalAmount: result.tatal_amount,
			//支付的类型判断类的值👇
			BILL_TYPE: "Z101",
			XS_TYPE: "1",
			actType: common.actTypeEnum.Payment,
		})
}

export const PriceCount = function(products) {
	let total = 0,
		SKY_DISCOUNT = 0,
		totalAmount = 0,
		curDis = 0;
	products.forEach(product => total += (product.NET || product.AMOUNT));
	SKY_DISCOUNT = parseFloat((total % 1).toFixed(2)); //舍弃分的处理
	console.log("手工折扣额：", SKY_DISCOUNT);
	totalAmount = parseFloat((total - SKY_DISCOUNT).toFixed(2)); //舍弃分数位
	products.forEach(function(item, index, arr) {
		let high = parseFloat(((item.NET || item.AMOUNT) / total * SKY_DISCOUNT).toFixed(2));
		item.SKYDISCOUNT = high;
		curDis += high;
		if (index == arr.length - 1) {
			let dif = parseFloat((SKY_DISCOUNT - curDis).toFixed(2)); //实际的差值
			item.SKYDISCOUNT += dif;
		}
	});
	return {
		products,//商品列表
		sky_discount: SKY_DISCOUNT,//折扣金额
		tatal_amount: totalAmount//总金额（处理后）
	}
}
