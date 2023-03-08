import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
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
		sale2_arr: that.SALE002, //002 商品 数据对象集合
		actType: "Payment", //动作类型(退款、支付)
		ban_pay: ban_type, //被禁用的支付类型
		PayList: that.payed || [], //已支付信息
	}
	console.log("[PayParamAssemble]支付前封装的数据:", inputParm);
	that.$store.commit('set-location', inputParm);
	// console.log("支付前的sale6：", sales.SALE006);
	uni.navigateTo({
		url: "../Payment/Payment",
		events: {
			FinishOrder: func //that.PayedResult
		}
	})
}
export default {
	GetKCZGZMX,
	PayParamAssemble
}
