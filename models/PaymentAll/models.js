// import sysParm from "../../utils/sysParm/sysParm"
// import util from "../../utils/util"
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

/**
 * 支付数据封装体（只支持在 PaymentALL 中使用）
 */
export const PayDataAssemble = function() {
	this.UniqueBill(); //包装 data 前先执行防重复单号操作
	console.log("[PayDataAssemble]此时的二级单号:", this.prev_no);
	let sysParam = util.getStorage("sysParam");
	let zfb_disc = 0;
	if (sysParam.YN_ZFBKBQ && sysParam.YN_ZFBKBQ == "Y") {
		zfb_disc = (Number(this.dPayAmount) * 100).toFixed(0)
	} else { //下列为测试新加需求
		let cxnet = Number(this.SALES.sale1.TCXSISC); //总促销额
		if (cxnet == 0) {
			zfb_disc = (Number(this.dPayAmount) * 100).toFixed(0)
		} else {
			zfb_disc = 0;
		}
	}

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
		point: this.CashOffset.Score, //抵现积分数
		point_money: this.CashOffset.Money, //积分积分对应金额
		member_id: this.SALES.sale1.CUID,
		memo: this.currentPayInfo?.fkid ?? this.currentSelectedInfo
			?.fkid, //因为前者会受到authcode影响被清空，导致用券支付时，如果扫了错误的码会导致找不到支付信息，从而使其获取不到fkid，导致失败后端券查询报无auth_code的问题
		// discountable_amount: (Number(this.ZFBZK) * 100).toFixed(0), //支付宝折扣金额（只有支付宝才有噢）
		discountable_amount: zfb_disc,
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
			GSID: uni.getStorageSync('store')?.GSID, //公司id
			DPID: uni.getStorageSync('store')?.DPID, //店铺id
			KCDID: uni.getStorageSync('store')?.KCDID, //存库点id
			GCID: uni.getStorageSync('store')?.GCID, //工厂id
			DKFID: uni.getStorageSync('store')?.DKFID, //大客户id
			BMID: uni.getStorageSync('store')?.BMID, //部门id
			BHLB: uni.getStorageSync('store')?.BHLB, //裱花类别
			KHID: uni.getStorageSync('store')?.KHID, //客户id
			POSID: uni.getStorageSync('store')?.POSID, //pos机id
			RYID: uni.getStorageSync('store')?.RYID, //人员id
			NAME: uni.getStorageSync('store')?.NAME, //店铺名称
			MerId: uni.getStorageSync('store')?.MERID, //商户号id
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
			qrCodeWidth: 256, //二维码宽
			qrCodeHeight: 256, // 二维码高
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
