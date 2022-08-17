import common from '@/api/common.js';
import util from '@/utils/util.js';

// const glabal = getApp().globalData.store;

export const GetPayWayList = async function() {
	let PayWayList = [];
	// console.log("[GetPayWayList]客户端ID:",glabal);
	await common.GetPayWayAsync(getApp()?.globalData?.store?.KHID ?? "K200QTD005", function(res) {
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
		}
	});
	console.log("[PayWayList-Outer]获取到的支付方式：", PayWayList);
	return PayWayList;
}