/**
 * 此 js 用于创建 PaymentAll 下一些可能会和其他页面有共用的对象
 * @param {*} obj 
 * @param {*} payload 
 */
import util from '@/utils/util.js';
import common from '@/api/common.js';
import {
	GetPayWayList
} from '@/bll/Common/bll.js';

//订单对象创建
export const orderCreated = function(obj, payload) {
	let order = Object.assign({ //每支付成功一笔，则往此数组内存入一笔记录
		fkid: this.currentPayInfo?.fkid ?? "",
		type: this.currentPayInfo?.type ?? "",
		bill: payload?.out_trade_no,
		name: this.currentPayInfo?.name ?? "",
		amount: 0,
		no: this.PayList.length,
		disc: (payload?.discount / 100).toFixed(2) || 0, //由于失败会导致 discount 取值变成 undefined ，再进行计算会导致数值变成 NaN
		zklx: payload?.disc_type ?? "",
		id_type: "",
		user_id: payload?.open_id || payload?.hyid,
		is_free: "",
		card_no: "",
		point:payload.point,//抵现积分数
		auth_code: "", //用于处理从上个页面传入，但未进行支付的订单
		//业务配置字段 ↓
		fail: true, //def初始和退款失败的皆为true
		pay_num: 0, //退款（尝试）次数
		paying: false, //是否在正在退款中
		loading: false,
		msg: "" //操作提示信息（可以显示失败的或者成功的）
	}, obj);
	console.log("封装响应体[orderCreated]:", order)
	return order;
}

/**
 * 支付数据封装体（只支持在 PaymentALL 中使用）
 */
export const PayDataAssemble = function() {
	this.UniqueBill(); //包装 data 前先执行防重复单号操作
	console.log("此时的二级单号:", this.prev_no);
	return {
		subject: this.subject,
		no: this.prev_no, //储存当前序号
		out_trade_no: this.out_trade_no,
		total_money: (Number(this.totalAmount) * 100).toFixed(0), //总支付金额
		money: (Number(this.dPayAmount) * 100).toFixed(0), //这一笔的支付金额
		auth_code: this.authCode,
		store_id: this.KHID,
		store_name: this.NAME,
		merchant_no: this.MerId,
		channel: this.channel,
		point:this.CashOffset.Score,//抵现积分数
		point_money:this.CashOffset.Money,//积分积分对应金额
		memo: this.currentPayInfo?.fkid,
		discountable_amount: (Number(this.ZFBZK) * 100).toFixed(0), //支付宝折扣金额（只有支付宝才有噢）
		product_info: this.Products.map(i => { //商品清单
			return {
				spid: i.SPID,
				name: i.NAME,
				price: (Number(i.PRICE) * 100).toFixed(0), //单价
				amount: (Number(i.NET) * 100).toFixed(0), //总金额
				num: i.QTY
			}
		})
	}
}

export const global = {
	props: {
		meta: {
			type: Object,
			default: function() {
				return {};
			}
		}
	},
	data: function() {
		return {
			GSID:util.getStorage('store')?.GSID, //公司id
			DPID: util.getStorage('store')?.DPID, //店铺id
			KCDID: util.getStorage('store')?.KCDID, //存库点id
			GCID: util.getStorage('store')?.GCID, //工厂id
			DKFID: util.getStorage('store')?.DKFID, //大客户id
			BMID: util.getStorage('store')?.BMID, //部门id
			BHLB: util.getStorage('store')?.BHLB, //裱花类别
			KHID: util.getStorage('store')?.KHID, //客户id
			POSID: util.getStorage('store')?.POSID, //pos机id
			RYID: util.getStorage('store')?.RYID, //人员id
			NAME: util.getStorage('store')?.NAME, //店铺名称
			MerId: util.getStorage('store')?.MERID, //商户号id
			brand: getApp().globalData.brand,
			kquser: getApp().globalData.kquser,
			hyinfo: getApp().globalData.hyinfo //会员卡信息,
		}
	}
}

export const print = {
	data: function() {
		return {
			//打印相关
			jpgWidth: 1,
			jpgHeight: 1,
			qrCodeWidth: 200, //二维码宽
			qrCodeHeight: 200, // 二维码高
			canvasGZHWidth: 1, //小票结尾二维码宽
			canvasGZHHeight: 1, //小票结尾二维码高
		}
	}
}

export const TransferForPaymentAll = async function(data) {
	let global_config = util.getStorage('store'),
		pay_way_list = await GetPayWayList();
	console.log("[TransferForPaymentAll]支付方式获取:", pay_way_list);
	return Object.assign({
		allow_discount_amount: "", //允许折扣金额
		Discount: 0, //折扣金额
		store_id: "", //门店id
		cashier: "", //收银员
		date: "", //日期
		company: "", //公司
		sale1_obj: {}, //* 001 主单 数据对象
		sale2_arr: [], //* 002 商品 数据对象集合
		sale3_arr: [], //* 002 商品支付 数据对象集合
		Products: [], //* 商品信息
		PayWayList: pay_way_list, //* 支付方式
		hyinfo: {}, //会员信息
		authCode: "", //卡券信息 or 支付授权码
		out_trade_no_old: common.CreateBill(global_config.KHID, global_config.POSID), //生成支付单号
		out_refund_no: common.CreateBill(global_config.KHID, global_config.POSID), //生成退款单号
		BILL_TYPE: "", //* 单号类型
		XS_TYPE: "", //* 销售类型（1：支付处理，2：退款处理）
		actType: "", //* 动作类型
		PayList: [] //this.PayList 不需要传入的原因是因为 PaymentALL 会自己根据 sale3 的数据组装 PayList
	}, data)
}
