import member from '@/api/hy/MemberInterfaces.js';
import common from '@/api/common.js';
import payment_all from '@/api/Pay/PaymentALL.js';
import util from '../../utils/util';
import bd from '@/utils/business_dictionary.js';
const infos_template = {
		type_name: '',//类型名称
		balance: 0,//余额
		init_balance: 0,//初始余额
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
		brand: '',//品牌
		materiel_id: '',//物料号
		operator: '',//操作员
		salesman: '',//销售员
		//下面的是额外的信息，和卡券基本信息无关，用于一些特殊的控制
		show_balance: true,//是否显示余额 注：实体卡未激活不显示余额
	};
const created_new_card_coupon_infos = (attach = infos_template) => {
	return Object.assign(Object.assign({}, infos_template),attach);
}
export default {
	base:{
		search(){
			console.log(`[Search]${this.text || ''}查询信息...`);
			util.simpleMsg("暂不支持当前类型!");
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
							valid_date: result.data.total_info.ZZCPVALIDT.replaceAll('-','/'),
							is_customer_emotional_coupon: result.data.total_info.ZZIFKQ,
							is_customer_complaint_coupon: result.data.total_info.ZZKSZQ,
							sale_store_name: result.data.total_info.ZZCPXSSTORE,
							use_store_name: result.data.total_info.ZZCPHX_STORE,
							apply: result.data.total_info.ZZCPSL_STAFF,
							use_date: result.data.total_info.ZZCPHXDATE,
							use_store_id: result.data.total_info.ZZCPHX_STORE,
							status: result.data.total_info.ZZCPSTATETXT//bd.coupon_status[result.data.total_info.ZZCPSTATE] || ""
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
						infos = created_new_card_coupon_infos({
							type_name: bd.card_type[result.data.cardType] || this.text,
							balance: result.data.balance,
							card_id: data,
							valid_date: util.convertShortDate(result.data.expireDate),
							status: bd.card_status[result.data.status] || "",
							show_balance: result.data.status != 'Z007',//卡未激活
							salesman: result.data.saleUserName || "",
							materiel_id: result.data.materielId || "",
							brand: result.data.brandId || "",
							init_balance: result.data.amount
						});
						console.log("[Search]处理后的卡信息:",infos);
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
					let local_result = await common.SimpleLocalQuery('SPDA',{
						spid: result.data?.coupon_good_no
					});
					console.log("[Search]本地商品信息查询结果:",local_result);
					if(result.code){
						infos = created_new_card_coupon_infos({
							card_id: data,
							type_name: bd.keban_coupon_type[result.data.codeType] || this.text,
							coupon_denomination: result.data.money,
							balance: result.data.leftMoney,
							valid_date: new Date(result.data.endTime || new Date()).toLocaleString(),
							status: result.data.status == '20' ? '已激活' : '未激活'
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
			})
		])
	}
}