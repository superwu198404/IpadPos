import member from '@/api/hy/MemberInterfaces.js';
import common from '@/api/common.js';
import payment_all from '@/api/Pay/PaymentALL.js';
import util from '../../utils/util';
const infos_template = {
		type_name: '',//类型名称
		balance: 0,//余额
		status: '',//状态
		coupon_denomination: 0,//券面额
		card_id: '',//卡号
		card_password: '',//卡密码
		valid_date: '',//有效时间
		is_use: '',//是否使用
		is_customer_emotional_coupon: '',//是否客情券
		is_customer_complaint_coupon: '',//是否客诉赠券
		apply: '',//申领人
		sale_store_id: '',//售卖门店id
		sale_store_name: '',//售卖门店
		sale_date: '',//售出时间
		use_date: '',//使用时间
		use_store_id: '',//使用门店id
		use_store_name: '',//使用门店
		spend_amount: '',//消费金额
		operator: '',//操作员
		is_activate: '',//是否被激活
	};
const created_new_card_coupon_infos = (attach = infos_template) => {
	return Object.assign(Object.assign({}, infos_template),attach);
}
export default {
	coupon_status:{//券状态
		'F01': '未发放',
		'F02': '已领用',
		'J01': '可使用',
		'J02': '未售出已过期',
		'J03': '已使用',
		'J04': '已作废',
		'J05': '已退货',
		'J06': '售出已过期',
		'Z01': '转赠中',
		'S01': '已锁定',
		'J07': '过期退款',
		'J08': '过期后核销',
		'J09': '过期后转入'
	},
	base:{
		search(){
			console.log(`[Search]${this.text || ''}查询信息...`);
			return Promise.resolve([]);
		},
		scan_code: true
	},
	infos: created_new_card_coupon_infos,
	extend_base(type){
		return Object.setPrototypeOf(type, this.base);
	},
	get_types(){
		let coupon_status_enum = this.coupon_status;
		return Promise.resolve([
			this.extend_base({
				text: "仟吉券",
				value: "kengee_coupon",
				async search(data){
					console.log("[Search]仟吉券查询信息...",data);
					let result = await member.coupon_sale.base_request('CouponSearch', { coupon_start: data, khid: getApp().globalData.store?.KHID }), infos = null;
					console.log("[Search]仟吉券查询信息:",result);
					if(result.code){
						let local_result = await common.SimpleLocalQuery('SPDA',{
							spid: result.data?.coupon_good_no
						});
						console.log("[Search]商品信息查询结果:", local_result);
						console.log("[Search]当前this指向对象:", coupon_status_enum);
						infos = created_new_card_coupon_infos({
							card_id: data,
							type_name: result.data.total_info.ZZCPTYPE3_TXT || this.text,
							balance: result.data.total_info.ZZCPVALUE,
							valid_date: result.data.total_info.ZZCPVALIDT,
							is_customer_emotional_coupon: result.data.total_info.ZZIFKQ,
							is_customer_complaint_coupon: result.data.total_info.ZZKSZQ,
							apply: result.data.total_info.ZZCPSL_STAFF,
							use_date: result.data.total_info.ZZCPHXDATE,
							use_store_id: result.data.total_info.ZZCPHX_STORE,
							status: coupon_status_enum[result.data.total_info.ZZCPSTATE] || ""
						});
						console.log("[Search]仟吉券查询信息:",infos);
						return util.createdResult(true,result.msg,infos);
					}
					else{
						return util.createdResult(false,result.msg);;
					}
				}
			}),
			this.extend_base({
				text: "仟吉卡",
				value: "kengee_card",
				scan_code: false,
				async search(data){
					console.log("[Search]仟吉卡查询信息...",data);
					let result = await member.coupon_sale.special_request('CARD_QUERY', { card_num: data }), infos = null;
					console.log("[Search]仟吉卡查询信息:",result);
					if(result.code){
						let local_result = await common.SimpleLocalQuery('SPDA',{
							spid: result.data.materielId
						}), goods_infos = null;
						console.log("[Search]商品信息查询结果:", local_result);
						infos = created_new_card_coupon_infos({
							spend_amount: result.data.amount,
							balance: result.data.balance,
							card_id: data,
							type_name: this.text,
							valid_date: util.convertShortDate(result.data.expireDate)
						});
						if(local_result.data && local_result.length){
							infos.type_name = local_result[0].SNAME;
						}
						return util.createdResult(true,result.msg,infos);
					}
					else{
						return util.createdResult(false,result.msg);;
					}
				}
			}),
			this.extend_base({
				text: "可伴券",
				value: "keban_coupon",
				async search(data){
					console.log("[Search]可伴券查询信息...",data);
					let result = await payment_all.PaymentTypeInfos.COUPON.QueryCouponDetails(data), infos = null;
					console.log("[Search]可伴券查询结果:",result);
					if(result.code){
						infos = created_new_card_coupon_infos({
							card_id: data,
							coupon_denomination: result.data.money,
							balance: result.data.leftMoney,
							valid_date: new Date(result.data.endTime || new Date()).toLocaleString(),
							is_activate: result.data.status == '20'
						});
						return util.createdResult(true,result.msg,infos);
					}
					else{
						return util.createdResult(false,result.msg);;
					}
				}
			}),
			this.extend_base({
				text: "品诺卡",
				value: "pino_card",
				async search(data){
					console.log("[Search]品诺卡查询信息...",data);
					let result = await payment_all.PaymentTypeInfos.PINNUO.QueryCardDetails(data), infos = null;
					console.log("[Search]品诺卡查询结果:",result);
					if(result.code){
						infos = created_new_card_coupon_infos(result.data);
						infos.type_name = this.text;
						return util.createdResult(true,result.msg,infos);
					}
					else{
						return util.createdResult(false,result.msg);;
					}
				}
			}),
			this.extend_base({
				text: "禄品卡",
				value: "pl_card"
			}),
		])
	}
}