import {
	RefundQuery
} from '@/api/business/da.js';
import common from '@/api/common.js';
import util from '@/utils/util.js';

export const GetPayWayList = async function(e) {
	let PayWayList = [];
	e = 'K0101QT2'; //测试使用
	await common.GetPayWay(e, function(res) {
		console.log("GetPayWayList：", res);
		if (res.code) {
			for (var i = 0; i < res.msg.length; i++) {
				let obj = {};
				obj.name = res.msg[i].SNAME;
				obj.fkid = res.msg[i].FKID;
				obj.type = res.msg[i].JKSNAME || "NOPAY";
				obj.poly = res.msg[i].POLY;
				obj.dbm = res.msg[i].YN_DBM; //是否要扫码 Y:扫码 N:不扫码
				obj.zklx = res.msg[i].ZKLX; //折扣类型（主要是会员卡使用）
				if (res.msg[i].FKID == 'ZCV1') { //超额溢出的支付方式
					obj.type = "EXCESS";
				}
				PayWayList.push(obj);
			}
			//如果fkda没有则追加测试数据
			let arr = [{
				name: "弃用金额",
				fkid: "ZCV1",
				type: "NOPAY",
				poly: "O"
			}, {
				name: "仟吉电子卡",
				fkid: "ZF04",
				type: "HYK",
				poly: "Y"
			}, {
				name: "云闪付",
				fkid: "ZF33",
				type: "YSF",
				poly: "N"
			}, {
				name: "可伴支付",
				fkid: "ZF22",
				type: "COUPON",
				poly: "N"
			}, {
				name: "品诺支付",
				fkid: "ZF32",
				type: "PINNUO",
				poly: "N",
			}, {
				name: "不可原路退回",
				fkid: "ZG11",
				type: "NO",
				poly: "O"
			}, ]
			for (var i = 0; i < arr.length; i++) {
				let obj = PayWayList.find((item) => {
					return item.type == arr[i].type;
				});
				if (!obj) {
					PayWayList.push(arr[i]);
				}
			}
			PayWayList.push({
				name: "仟吉赠券",
				fkid: "ZZ01",
				// type: "ZQ",
				type: "NOPAY",
				poly: "O"
			});
			console.log("[PayWayList]获取到的支付方式：", PayWayList);
		}
	});
	return PayWayList;
}

export const Refund = async function(bill) {
	let data = await RefundQuery(bill);
	let sale1_obj = {}, //sale 1 数据对象
		sale2_arr = [], //sale 2 数据对象
		sale3_arr = []; //sale 3 数据对象
	let Products = []; //商品信息 数据对象
	let PayWayList = []; //支付方式 数据对象
	PayWayList = await GetPayWayList(this.KHID);
	if (!sale1_obj || Object.keys(sale1_obj).length == 0 || sale2_arr.length == 0 || sale3_arr.length ==
		0) { //如果服务器查不到
		data = await common.QueryRefund(bill);
	}
	sale1_obj = data.sale1;
	sale2_arr = data.sale2.map(i => util.hidePropety(i, "SKYDISCOUNT", "NAME"));
	sale3_arr = data.sale3;
	Products = sale3_arr?.map((function(i) {
		return Object.assign({
			PLID: i.PLID,
			SPID: i.SPID,
			UNIT: i.UNIT,
			BARCODE: i.BARCODE,
			NAME: i.NAME,
			PRICE: i.PRICE,
			OPRICE: i.OPRICE,
			AMOUNT: i.NET,
			QTY: i.QTY,
			DISCRATE: i.DISCRATE, //退款使用
			YN_SKYDISC: i.YN_SKYDISC, //退款使用
			DISC: i.DISC //退款使用
		}, i)
	}).bind(this));
	console.log("[Refund]SALES：", [sale1_obj, sale2_arr, sale3_arr]);
	if (!sale1_obj || Object.keys(sale1_obj).length == 0 || sale2_arr.length == 0 || sale3_arr.length == 0) {
		uni.showToast({
			title: "订单不存在！",
			icon: "error"
		})
		return;
	}
	//把数据传入下个页面
	this.$store.commit('set-location', {
		allow_discount_amount: "", //允许折扣金额
		Discount: 0, //折扣金额
		store_id: "", //门店id
		cashier: "", //收银员
		date: "", //日期
		company: "", //公司
		sale1_obj: sale1_obj, //001 主单 数据对象
		sale2_arr: sale2_arr, //002 商品 数据对象集合
		sale3_arr: sale3_arr, //002 商品 数据对象集合
		Products: Products, //商品信息
		PayWayList: PayWayList, //支付方式
		hyinfo: {}, //会员信息
		authCode: "", //卡券信息 or 支付授权码
		out_trade_no_old: common.CreateBill(this.KHID, this.POSID),
		out_refund_no: common.CreateBill(this.KHID, this.POSID), //生成退款单号
		BILL_TYPE: "Z151",
		XS_TYPE: "2",
		SKY_DISCOUNT: sale1_obj.BILLDISC,
		totalAmount: 0,
		actType: common.actTypeEnum.Refund,
		PayList: /*this.PayList*/ []
	});
}
