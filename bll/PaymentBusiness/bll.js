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
 * @param {*} payments 支付信息列表 
 */
export const Payment = async function(products,payments) {
	let result = PriceCount(products) //支付金额初始化
	//预先重置
	let sale1_obj = {}, //支付 sale1 主表数据初始对象
		sale2_arr = [], //支付 sale2 子表数据初始对象
		sale3_arr = []; //支付 sale3 子表数据初始对象
	//已支付记录
	let pay_list = [];
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
	sale3_arr = [];
	pay_list = payments;
	console.log("[Payment]sale1", sale1_obj);
	console.log("[Payment]sale2", sale2_arr);
	console.log("[Payment]sale3", sale3_arr);
	return await TransferForPaymentAll( //TransferForPaymentAll 简化了部分传值，下面是针对退款需要的值，根据所需也可以调整为支付所需的传值
		{
			sale1_obj: sale1_obj,
			sale2_arr: sale2_arr,
			sale3_arr: sale3_arr,
			PayList: pay_list,
			SKY_DISCOUNT: result.sky_discount,
			Products: result.products,
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
		products, //商品列表
		sky_discount: SKY_DISCOUNT, //折扣金额
		tatal_amount: totalAmount //总金额（处理后）
	}
}

/**
 * 生成 sale3 的记录（预订单）
 */
const sale3_def = {
	fkid: "",
	type: "",
	bill: "",
	name: "",
	amount: 0,
	no: 0
};
export const Sale3Model = function(init = sale3_def) {
	return Object.assign({
		fkid: "ZF04",
		type: "HYK",
		bill: "111111111111111111111111111",
		name: "微信支付",
		amount: 0.01,
		no: 0,
		is_free: "", //*卡券独有 是否是赠券
		disc: 0, //*卡券独有 卡折扣金额折扣率
		zklx: "", //*卡券独有 折扣类型
		id_type: "", //*卡券独有 卡类型
		user_id: "", //*支付宝微信独有 用户id 
		auth_code: "", //*支付宝微信，其他的不知道
		card_no: "" //*卡券独有卡券号码
	}, init)
}

/**
 * 
 * @param {*} sale3 附加额外的参数的记录对象（预订单）
 */
const additional_def = {
	fail: true, //def初始和退款、支付失败的皆为true
	pay_num: 0, //付款（尝试）次数，这里起码有一次才会显示为失败，0则不会
	paying: false, //是否在正在支付重试中
	refunding: false, //是否在正在退款重试中
	loading: false, //是否显示加载
	msg: "" //操作提示信息（可以显示失败的或者成功的）
};

export const Sale3ModelAdditional = function(sale3_model, init = additional_def) {
	return Object.assign(sale3_model, Object.assign({
		//业务配置字段 ↓
		fail: true, //def初始和退款、支付失败的皆为true
		pay_num: 0, //付款（尝试）次数，这里起码有一次才会显示为失败，0则不会
		paying: false, //是否在正在支付重试中
		refunding: false, //是否在正在退款重试中
		loading: false,
		msg: "" //操作提示信息（可以显示失败的或者成功的）
	}, init))
}
