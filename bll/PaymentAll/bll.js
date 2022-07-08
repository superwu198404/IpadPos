/*
 PaymentAll 业务逻辑处理（view => bll => api）
*/
import _pay from '@/api/Pay/PaymentALL.js';

/**
 * 
 * @param {*} trade 进行重试的订单数据集合
 */
export const retrySinglePay = function(trade,succes,error){
	if(trade.trade.auth_code){//根据此属性判断接下来的重试是 查询，还是支付
		trade.data.auth_code = trade.trade.auth_code;
		trade.data.money = (Number(trade.trade.amount) * 100).toFixed(0), //这一笔的支付金额
		_pay.PaymentAll(trade.type,trade.data,succes,error);
	}else{//如果不存在 auth_code
		_pay.QueryPayment(trade.type, {
			out_trade_no: trade.trade_no
		}, succes, error);
	}
	
}