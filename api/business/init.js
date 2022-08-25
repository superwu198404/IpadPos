import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import dateformat from '@/utils/dateformat.js';

var app = getApp();

//获取支付方式
var GetPayWay = async function(e) {
	let PayWayList = [];
	await common.GetPayWay(e, function(res) {
		if (res.code) {
			let PayInfo = util.getStorage("PayInfo");
			console.log("支付规则信息：", PayInfo);
			for (var i = 0; i < res.msg.length; i++) {
				if (!PayInfo || JSON.stringify(PayInfo) == "{}") { //没有支付规则则退出
					return;
				}
				// let obj1 = PayInfo.find(r => r.TYPE == res.msg[i].JKSNAME && r.NOTE == res.msg[i].SNAME);
				let obj1 = PayInfo.find(r => r.TYPE == res.msg[i].JKSNAME);
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
		console.log("获取到的支付方式：", PayWayList);
		util.setStorage("PayWayList", PayWayList);
	})
};

//初始化基础数据
var InitData = async function(khid, func) {
	//生成支付规则数据(测试使用)
	// await common.InitZFRULE();
	//获取支付规则数据 在前执行
	await common.GetZFRULE();
	//获取支付方式 在后执行
	await GetPayWay(khid);
	//初始化配置参数
	await common.GetPZCS();
	//获取POS参数组数据
	await common.GetPOSCS(khid);
	if (func) 
	func();
}

export default {
	InitData
}
