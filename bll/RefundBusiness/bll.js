import {
	BatchQuery
} from '@/api/business/da.js';
import {
	TransferForPaymentAll
} from '@/models/PaymentAll/models.js';
import common from '@/api/common.js';
import util from '@/utils/util.js';
import dateformat from '@/utils/dateformat.js';

/**
 * 退货（款）处理操作 
 * @param {*} sqlite_source 同步/异步 参数，传入本地 sale1,2,3 数据，数据结构必须为 { sale1:{},sale2:[],sale3:[] }
 * @param {*} oracle_source 同步/异步 参数，传入服务端 sale1,2,3 数据，数据结构必须为 { sale1:{},sale2:[],sale3:[] }
 */
export const Refund = async function(sqlite_source,oracle_source) {
	//判断sale1,sale2,sale3数据是否是正常数据
	let ErrorData = (data) => !data.sale1 || Object.keys(data.sale1).length == 0 || data.sale2.length == 0 ||
		data.sale3.length == 0, data = null;
	if(sqlite_source.constructor === Promise)//如果是异步数据，则等待
		data = await sqlite_source;
	else
		data = sqlite_source;
	console.log("[Refund]本地数据:", data);
	if (ErrorData(data)) { //如果服务器查不到
		if(oracle_source.constructor === Promise)//如果是异步数据，则等待
			data = await oracle_source;
		else
			data = oracle_source;
		console.log("[Refund]服务器数据:", data);
		if (ErrorData(data)) {
			util.simpleMsg("订单不存在!", true);
			return;
		}
	}
	//适配 PaymentAll 
	data.sale2.map(item => {
		item.AMOUNT = item.NET;
		return item;
	})
	console.log("[Refund]SALES：", [data.sale1, data.sale2, data.sale3]);
	return await TransferForPaymentAll( //TransferForPaymentAll 简化了部分传值，下面是针对退款需要的值，根据所需也可以调整为支付所需的传值
		{
			sale1_obj: data.sale1, //001 主单 数据对象
			sale2_arr: data.sale2, //002 商品 数据对象集合
			sale3_arr: data.sale3, //002 商品 数据对象集合
			SKY_DISCOUNT: data.sale1.BILLDISC,
			//退款的类型判断类的值👇
			BILL_TYPE: "Z151",
			XS_TYPE: "2",
			actType: common.actTypeEnum.Refund,
		})
}

/**
 * 批量将数据转化为相反数
 * @param {*} obj 
 * @param {*} props 
 */
const BatchInverse = function(obj, props) {
	props.forEach((prop) => {
		obj[prop] = util.inverseNumber(obj[prop])?.toFixed(2);
	})
}

/**
 * 下面 PaymentToRefundSALE 系列方法皆为从支付转退款的方法（传入支付的sale数据，返回退款的sale数据）
 * @param {*} sale 
 * @param {*} config 
 */

/**
 * 根据 sale001 中的 [支付数据] 生成对应的 [退款数据]
 */
export const PaymentToRefundSALE001 = function(sale, config = {
	REFUND_NO: "",
	BILL_TYPE: "Z151",
	XS_TYPE: "2"
}) {
	let saledate = dateformat.getYMD(),
		saletime = dateformat.getYMDS();
	let config_assign = Object.assign({
		REFUND_NO: "",
		BILL_TYPE: "Z151",
		XS_TYPE: "2"
	}, config);
	console.log("[PaymentToRefundSALE001]退款对象生成开始!");
	let raw = sale; //原始数据对象
	let sale_refund = Object.assign({}, raw);
	BatchInverse(sale_refund, ['TNET', 'ZNET', 'BILLDISC', 'ROUND', 'TDISC', 'TLINE']);
	sale_refund.BILL = config_assign.REFUND_NO;
	sale_refund.SALEDATE = saledate;
	sale_refund.SALETIME = saletime;
	sale_refund.CLTIME = saledate;
	sale_refund.XS_BILL = raw.BILL;
	sale_refund.XS_POSID = raw.POSID;
	sale_refund.XS_DATE = raw.SALEDATE;
	sale_refund.XS_KHID = raw.KHID;
	sale_refund.XS_GSID = raw.GSID;
	sale_refund.XSTYPE = config_assign.XS_TYPE;
	sale_refund.BILL_TYPE = config_assign.BILL_TYPE;
	console.log("[PaymentToRefundSALE001]退款对象生成完毕!",sale_refund);
	return sale_refund;
}

/**
 * 根据 sale002 中的 [支付数据] 生成对应的 [退款数据]
 */
export const PaymentToRefundSALE002 = function(sale_arr, config = {
	REFUND_NO: "",
	BILL_TYPE: "Z151",
	XS_TYPE: "2"
}) {
	let saledate = dateformat.getYMD(),
		saletime = dateformat.getYMDS();
	let config_assign = Object.assign({
		REFUND_NO: "",
		BILL_TYPE: "Z151",
		XS_TYPE: "2"
	}, config);
	let sale_after = [];
	console.log("[PaymentToRefundSALE002]退款对象生成开始!");
	sale_arr.forEach((sale_raw) => {
		let sale = Object.assign({},sale_raw);
		BatchInverse(sale, ['NET', 'DISCRATE', 'DISC', 'QTY']);
		sale.BILL = config_assign.REFUND_NO;
		sale.SALEDATE = saledate;
		sale.SALETIME = saletime;
		sale.PRICE = parseFloat(sale.PRICE).toFixed(2)
		sale.MONTH = new Date().getMonth() + 1;
		sale.WEEK = dateformat.getYearWeek(new Date().getFullYear(), new Date()
			.getMonth() + 1,
			new Date().getDay());
		sale.TIME = new Date().getHours();
		sale_after.push(util.hidePropety(sale,"NAME","AMOUNT"));
	});
	console.log("[PaymentToRefundSALE002]退款对象生成完毕!",sale_after);
	return sale_after;
}

/**
 * 根据 sale003 中的 [支付数据] 生成对应的 [退款数据]
 */
export const PaymentToRefundSALE003 = function(sale_arr, config = {
	REFUND_NO: "",
	BILL_TYPE: "Z151",
	XS_TYPE: "2"
}) {
	let saledate = dateformat.getYMD(),
		saletime = dateformat.getYMDS();
	let config_assign = Object.assign({
		REFUND_NO: "",
		BILL_TYPE: "Z151",
		XS_TYPE: "2"
	}, config);
	let sale_after = [];
	console.log("[PaymentToRefundSALE003]退款对象生成开始!");
	sale_arr.forEach((sale_raw) => {
		let sale = Object.assign({},sale_raw);
		BatchInverse(sale, ['AMT','DISC','FAMT','RATE']);
		sale.BILL = config_assign.REFUND_NO;
		sale.SALEDATE = saledate;
		sale.SALETIME = saletime;
		sale_after.push(sale);
	})
	console.log("[PaymentToRefundSALE003]退款对象生成完毕!",sale_after);
	return sale_after;
}
