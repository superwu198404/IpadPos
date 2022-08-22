import common from '@/api/common.js';
import util from '@/utils/util.js';
import {
	Refund
} from '@/bll/RefundBusiness/bll.js'
import {
	Payment
} from '@/bll/PaymentBusiness/bll.js'

export const GetPayWayList = async function() {
	let PayWayList = [];
	await common.GetPayWayAsync(getApp()?.globalData?.store?.KHID ?? "K200QTD005", function(res) {
		if (res.code) {
			let PayInfo = util.getStorage("PayInfo");
			console.log("[GetPayWayList]支付规则信息：", PayInfo);
			for (var i = 0; i < res.msg.length; i++) {
				if (!PayInfo || JSON.stringify(PayInfo) == "{}") { //没有支付规则则退出
					return;
				}
				let obj1 = PayInfo.find(r => r.TYPE == res.msg[i].JKSNAME && r.NOTE == res.msg[i]
					.SNAME);
				if (!obj1) { //如果规则数据中不存在这种支付方式则不追加
					continue;
				}
				let obj = {};
				obj.name = res.msg[i].SNAME;
				obj.fkid = res.msg[i].FKID;
				obj.type = res.msg[i].JKSNAME || "NOPAY";
				obj.poly = res.msg[i].POLY;
				obj.dbm = res.msg[i].YN_DBM; //是否要扫码 Y:扫码 N:不扫码
				obj.zklx = res.msg[i].ZKLX; //折扣类型（主要是会员卡使用）
				obj.yn_use = obj1.YN_USE || "Y"; //该支付方式是否可用
				if (res.msg[i].FKID == 'ZCV1') { //超额溢出的支付方式
					obj.type = "EXCESS";
				}
				PayWayList.push(obj);
			}
			//如果fkda没有则追加测试数据
			let arr = [{
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
			}, {
				name: "仟吉赠券",
				fkid: "ZZ01",
				type: "NOPAY",
				poly: "O"
			}, {
				name: "弃用金额",
				fkid: "ZCV1",
				type: "NOPAY",
				poly: "O"
			}]
			for (var i = 0; i < arr.length; i++) {
				let obj = PayWayList.find((item) => {
					return item.type == arr[i].type;
				});
				if (!obj) {
					PayWayList.push(arr[i]);
				}
			}
		}
	});
	console.log("[PayWayList-Outer]获取到的支付方式：", PayWayList);
	return PayWayList;
}

/**
 * 检测 sale 数据是否正常（判断 sale1、2、3是否都有数据，其中兼容了sale1为数组的情况）
 * @param {*} data 
 */
export const ErrorData = (data) => 
		!data.sale1 || 
		Array.isArray(data.sale1) ? data.sale1.length == 0 : Object.keys(data.sale1).length == 0 || //这里因为有可能回传入一个数组类型的sale1，所以做个判断
		data.sale2.length == 0 ||
		data.sale3.length == 0;
		
/**
 * 生成销售中 [支付] 或 [退款] 操作所需数据源
 * @param {*} data 
 * xs_type [必须]
 * bill_type [必须]
 * products [可选] => 当 xs_type 为 支付 的时候为必须，用于生成 sale2 的数据。
 * local_source、server_source [可选] => 当 xs_type 为 退款 的时候为必须，用于生成对应支付的 sale1、2、3 数据。
 */
const accept_def_params = {
	sales:{
		sale1:{},
		sale2:[],
		sale3:[],
	},
	products:[],
	xs_type: "",//是 支付(1) 还是 退款(2)
	bill_type: ""//是 支付(Z101) 还是 退款(Z151)
}
export const Accept = async function(params_obj = accept_def_params) {
	let params = Object.assign(accept_def_params,params_obj);
	if (params.xs_type == 1) { //提取操作 => 支付
		console.log("[预定提取]结算确认!开始结算...",params)
		return await Payment(params.products);
	} else { //取消操作 => 退款
		console.log("[预定取消]退单确认!开始退款...");
		return await Refund(params.sales,params.xs_type);
	}
}