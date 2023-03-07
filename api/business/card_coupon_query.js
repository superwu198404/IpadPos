import member from '@/api/hy/MemberInterfaces.js';
import common from '@/api/common.js';
import payment_all from '@/api/Pay/PaymentALL.js';
import util from '../../utils/util';
export default {
	base:{
		search(){
			console.log(`[Search]${this.text || ''}查询信息...`);
			return Promise.resolve([]);
		},
		infos(){
			return {
				type_name: '',//类型名称
				balance: 0,//余额
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
			};
		}
	},
	extend_base(type){
		return Object.setPrototypeOf(type, this.base);
	},
	get_types(){
		return Promise.resolve([
			this.extend_base({
				text: "仟吉券",
				value: "kengee_coupon",
				async search(data){
					console.log("[Search]仟吉券查询信息...",data);
					return await member.coupon_sale.base_request('CouponSearch', { coupon_start: data, khid: getApp().globalData.store?.KHID });
				}
			}),
			this.extend_base({
				text: "仟吉卡",
				value: "kengee_card",
				async search(data){
					console.log("[Search]仟吉卡查询信息...",data);
					let result = await member.coupon_sale.special_request('CARD_QUERY', { card_num: data }), infos = this.infos();
					console.log("[Search]仟吉卡查询信息:",result);
					if(result.code){
						let local_result = await common.SimpleLocalQuery('SPDA',{
							spid:'仟吉SAP-VIP卡'
						});
						console.log("[Search]商品信息查询结果:", local_result);
						infos = Object.assign(infos,{
							spend_amount: result.data.amount,
							balance: result.data.balance,
							valid_date: util.convertShortDate(result.data.expireDate)
						});
					}
					console.log("[Search]仟吉卡查询信息:",infos);
					return infos;
				}
			}),
			this.extend_base({
				text: "可伴券",
				value: "keban_coupon",
				async search(data){
					console.log("[Search]可伴券查询信息...",data);
					return await payment_all.PaymentTypeInfos.COUPON.QueryCouponDetails(data);
				},
				
			}),
			this.extend_base({
				text: "品诺卡",
				value: "pino_card",
				async search(data){
					console.log("[Search]品诺卡查询信息...",data);
					let result = await payment_all.PaymentTypeInfos.PINNUO.QueryCardDetails(data), infos = this.infos();
					console.log("[Search]品诺卡查询结果:",result);
					if(result.code){
						infos = Object.assign(infos,result.data);
					}
					console.log("[Search]品诺卡返回结果:",infos);
					return infos;
				}
			}),
			this.extend_base({
				text: "禄品卡",
				value: "pl_card"
			}),
		])
	}
}