/**
 * 此 js 用于创建 PaymentAll 下一些可能会和其他页面有共用的对象
 * @param {*} obj 
 * @param {*} payload 
 */
import util from '@/utils/util.js';

//订单对象创建
export const orderCreated = function(obj, payload) {
	let order = Object.assign({ //每支付成功一笔，则往此数组内存入一笔记录
		fkid: this.currentPayInfo?.fkid ?? "",
		type: this.currentPayInfo?.type ?? "",
		bill: payload?.out_trade_no,
		name: this.currentPayInfo?.name ?? "",
		amount: 0,
		no: this.PayList.length,
		disc: (payload?.discount / 100).toFixed(2),
		zklx: payload?.disc_type ?? "",
		id_type: "",
		user_id: payload?.open_id || payload?.hyid,
		is_free: "",
		card_no: "",
		auth_code:"",//用于处理从上个页面传入，但未进行支付的订单
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
export const PayDataAssemble = function(){
	this.UniqueBill(); //包装 data 前先执行防重复单号操作
	return {
		subject: this.subject,
		out_trade_no: this.out_trade_no,
		total_money: (Number(this.totalAmount) * 100).toFixed(0), //总支付金额
		money: (Number(this.dPayAmount) * 100).toFixed(0), //这一笔的支付金额
		auth_code: this.authCode,
		store_id: this.KHID,
		store_name: this.NAME,
		merchant_no: this.MerId,
		channel: this.channel,
		memo:this.currentPayInfo?.fkid,
		discountable_amount: (Number(this.ZFBZK) * 100).toFixed(0), //支付宝折扣金额（只有支付宝才有噢）
		product_info: this.Products.map(i => { //商品清单
			return {
				spid: i.SPID,
				name: i.NAME,
				price: (Number(i.PRICE) * 100).toFixed(0), //单价
				amount: (Number(i.AMOUNT) * 100).toFixed(0), //总金额
				num: i.QTY
			}
		})
	}
}

export const global = {
	data: function() {
		return {
			GSID: getApp().globalData.store.GSID, //公司id
			DPID: getApp().globalData.store.DPID, //店铺id
			KCDID: getApp().globalData.store.KCDID, //存库点id
			GCID: getApp().globalData.store.GCID, //工厂id
			BMID: getApp().globalData.store.BMID, //部门id
			KHID: getApp().globalData.store.KHID, //客户id
			POSID: getApp().globalData.store.POSID, //pos机id
			RYID: getApp().globalData.store.RYID, //人员id
			NAME: getApp().globalData.store.NAME, //店铺名称
			MerId: getApp().globalData.store.MERID, //商户号id
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
			jpgWidth: 340,
			jpgHeight: 113,
			qrCodeWidth: 200, //二维码宽
			qrCodeHeight: 200, // 二维码高
			canvasGZHWidth: 200, //小票结尾二维码宽
			canvasGZHHeight: 200, //小票结尾二维码高
		}
	}
}


