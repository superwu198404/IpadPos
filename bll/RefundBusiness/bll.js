import {
	RefundQuery
} from '@/api/business/da.js';
import {
	TransferForPaymentAll
} from '@/models/PaymentAll/models.js';
import common from '@/api/common.js';
import util from '@/utils/util.js';

/**
 * 退货（款）处理操作 
 * @param {*} bill 
 */
export const Refund = async function(bill) {
	//判断sale1,sale2,sale3数据是否是正常数据
	let ErrorData = (data) => !data.sale1 || Object.keys(data.sale1).length == 0 || data.sale2.length == 0 || data.sale3.length == 0;
	let data = await common.QueryRefund(bill);
	console.log("[Refund]本地数据:",data);
	if (ErrorData(data)) { //如果服务器查不到
		data = await RefundQuery(bill); //服务器退款查询
		console.log("[Refund]服务器数据:",data);
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
