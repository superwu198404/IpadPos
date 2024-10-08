import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import _member from '@/api/hy/MemberInterfaces.js';
import {
	RequestSend
} from '@/api/business/da.js'
import Vue from 'vue';

/**
 * 获取卡充值规则明细
 */
var GetKCZGZMX = function(e, func) {
	let apistr = "MobilePos_API.Models.CardSaleCLASS.GetKCZGZMX";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
//跳转支付=>支付后执行的事件
var PayParamAssemble = function(that, func) {
	uni.$emit('stop-message');
	uni.$emit('stop-timed-communication');
	console.log("[PayParamAssemble]支付参数组装...")
	util.setStorage('open-loading', false);
	let allow_type = util.getStorage("POSCS").find(i => i.POSCS == 'SKSQFKID')?.POSCSNR.split(',');
	let ban_type = util.getStorage("PayWayList").filter(i => !allow_type.includes(i.fkid)).map(i => i
		.fkid);
	console.warn("[BeforeFk]卡券销售结算获取的允许、和禁止 的付款类型:", {
		allow_type,
		ban_type
	});
	let inputParm = {
		sale1_obj: that.SALE001, //001 主单 数据对象
		sale2_arr: (that.SALE2 && that.SALE2.length > 0) ? that.SALE2 : that.SALE002, //002 商品 数据对象集合 vip业务有赠送金额
		actType: "Payment", //动作类型(退款、支付)
		ban_pay: ban_type, //被禁用的支付类型
		PayList: that.payed || [], //已支付信息
	}
	console.log("[PayParamAssemble]支付前封装的数据:", inputParm);
	that.$store.commit('set-location', inputParm);
	// console.log("支付前的sale6：", sales.SALE006);
	uni.navigateTo({
		url: "/pages/Payment/Payment",
		events: {
			FinishOrder: func //that.PayedResult
		},
		complete: res => {
			console.log("跳转结果：", res);
		}
	})
}

//回退特殊折扣
var ResetCXZK = function(that) {
	if (that.SALE001 && Object.keys(that.SALE001).length > 0) {
		//切换折扣或者促销后 清空一下原来计算的折扣值
		that.SALE001.TBZDISC = 0; //zk 总标准折扣
		that.SALE001.TLSDISC = 0; //zk 总临时折扣
		that.SALE001.TTPDISC = 0; //zk 总特批折扣
		that.SALE001.TCXDISC = 0; //cx 总促销折扣
		that.SALE001.TDISC = 0; //cx
		that.SALE001.BILLDISC = 0; //cx zk
	}
	that.SALE002.map(r => {
		// r.NET = util.newFloat(r.NET + r.DISCRATE, 2);; //回退一下折扣？
		r.NET = util.newFloat(r.OPRICE * r.QTY, 2);; //回退一下折扣？
		r.PRICE = util.newFloat(r.NET / r.QTY, 2); //回退一下折扣？
		r.DISCRATE = 0; //zk
		r.BZDISC = 0; //zk
		r.LSDISC = 0; //zk
		r.TPDISC = 0; //zk
		r.CXDISC = 0; //cx
	});
}

//回退特殊折扣(通用)
var FallbackSpecialDiscount = function(sale001, sale002 = []) {
	console.warn("[FallbackSpecialDiscount]开始清除折扣信息...", {
		sale001,
		sale002
	});
	if (sale001 && Object.keys(sale001).length > 0) {
		console.log("[FallbackSpecialDiscount]开始清除sale001折扣信息:", sale001);
		//切换折扣或者促销后 清空一下原来计算的折扣值
		sale001.TBZDISC = 0; //zk 总标准折扣
		sale001.TLSDISC = 0; //zk 总临时折扣
		sale001.TTPDISC = 0; //zk 总特批折扣
		sale001.TCXDISC = 0; //cx 总促销折扣
		sale001.TDISC = 0; //cx
		sale001.BILLDISC = 0; //cx zk
		console.log("[FallbackSpecialDiscount]sale001折扣信息清除完毕:", sale001);
	}
	console.log("[FallbackSpecialDiscount]开始清除sale002折扣信息:", sale002);
	sale002.map(r => {
		// r.NET = util.newFloat(r.NET + r.DISCRATE, 2);; //回退一下折扣？
		r.NET = util.newFloat(r.OPRICE * r.QTY, 2);; //回退一下折扣？
		r.PRICE = util.newFloat(r.NET / r.QTY, 2); //回退一下折扣？
		r.DISCRATE = 0; //cx/zk
		r.BZDISC = 0; //zk
		r.LSDISC = 0; //zk
		r.TPDISC = 0; //zk
		r.CXDISC = 0; //cx
		r.YN_CXDISC = 'N'; //cx
	});
	console.log("[FallbackSpecialDiscount]sale002折扣信息清除完毕:", sale002);
	console.warn("[FallbackSpecialDiscount]清除折扣信息完毕...");
}
/**
 * 获取激活、充值失败的订单
 */
var GetFailOrder = function(data, func) {
	let apistr = "MobilePos_API.Models.CardSaleCLASS.GetFailOrder";
	let reqdata = Req.resObj(true, "查询中...", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

//重组sale 数据
var FormatSale = function(saleObj) {
	let arr = [];
	if (saleObj && saleObj.sale1) {
		saleObj.sale1.map(r => {
			let obj = {};
			obj.SALE1 = r;
			obj.SALE2 = saleObj.sale2.filter(r1 => {
				return r1.BILL == r.BILL
			});
			obj.SALE3 = saleObj.sale3.filter(r1 => {
				return r1.BILL == r.BILL
			});
			obj.SALE6 = saleObj.sale6.filter(r1 => {
				return r1.BILL == r.BILL
			});
			arr.push(obj);
		})
	}
	console.log("重组后的售卡单：", arr);
	return arr;
}
var ExecuteBatchSQL = function(sql, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.ExecuteBatchSQL";
	let reqdata = Req.resObj(true, "数据传输中", {
		sql
	}, apistr);
	Req.asyncFuncOne(reqdata, func);
}

//持卡人事件
var updateCustomerInfo = function(data, func) {
	_member.updateCustomerInfo("上传中...", {
		data
	}, func, func);
}
//商品信息匹配
var MatchSP = async function(spid) {
	let spinfo;
	var result = (await RequestSend(`select * from SPDA where SPID='${spid}'`))?.result;
	console.log("[MatchSP]查询结果：", result);
	var data = JSON.parse(result.data || "");
	console.log("匹配的商品信息：", data)
	if (result.code && data?.length) {
		spinfo = data[0];
	}
	return spinfo;
}
//卡延期
var CARD_DELAY = function(data, func) {
	_member.CARD_DELAY("操作中...", {
		data
	}, func, func);
}
//卡挂失
var REPORT_LOSS = function(data, func) {
	_member.REPORT_LOSS("操作中...", {
		data
	}, func, func);
}
export default {
	GetKCZGZMX,
	PayParamAssemble,
	ResetCXZK,
	FallbackSpecialDiscount,
	GetFailOrder,
	FormatSale,
	ExecuteBatchSQL,
	updateCustomerInfo,
	MatchSP,
	REPORT_LOSS,
	CARD_DELAY
}