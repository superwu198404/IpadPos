import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import dateformat from '@/utils/dateformat.js';
import _sysParam from '@/utils/sysParm/sysParm.js';

//校验是否有初始化过
var YN_Init = function(sucFunc, errFunc) {
	let sql = "select count(1) count from SPKHDA"
	db.get().executeQry(sql, "校验中...", res => {
		console.log("SPKHDA查询结果：", res);
		if (res.code && res.msg.length > 0 && res.msg[0].count > 0) {
			if (sucFunc)
				sucFunc(res);
			return;
		}
		if (errFunc)
			errFunc(res);
	}, err => {
		console.log("SPKHDA查询结果1：", err);
		if (errFunc)
			errFunc(err);
	})
}

//获取支付方式
var GetPayWay = async function(e) {
	let PayWayList = [];
	await common.GetPayWay(e, function(res) {
		// console.log("本地查到的付款信息：", res);
		if (res.code) {
			let PayInfo = util.getStorage("PayInfo");
			console.log("支付规则信息：", PayInfo);
			for (var i = 0; i < res.msg.length; i++) {
				if (!PayInfo || JSON.stringify(PayInfo) == "{}") { //没有支付规则则退出
					return;
				}
				let obj1 = PayInfo.find(r => r.TYPE == res.msg[i].JKSNAME && r.NOTE == res.msg[i]
					.SNAME);
				// let obj1 = PayInfo.find(r => r.TYPE == res.msg[i].JKSNAME);
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

//获取门店签到状态
var GetMDQD = function(khid, func) {
	let sql = "SELECT K1.RUN_STATUS FROM KHYYMX K1 WHERE K1.KHID = '" + khid + "' and DATE_YY >= DATETIME('" +
		dateformat.getYMD() + "') and DATE_YY <= DATETIME( '" + dateformat.getYMD(1) + "')";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("门店签到信息查询成功：", res);
		if (res.code && res.msg.length > 0) {
			let obj = util.getStorage("store");
			obj.OPENFLAG = res.msg[0].RUN_STATUS;
			util.setStorage("store", obj);
		} else {
			obj.OPENFLAG = 0;
		}
		if (func) func(res);
	}, err => {
		console.log("门店信息查询失败：", err);
	})
}


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
	
	//初始化系统参数
	_sysParam.init(khid);
	//签到状态
	GetMDQD(khid);
	
	//主动删除过期的销售数据
	common.DelSale(); //主动删除销售单
	if (func)
		func();
}

export default {
	InitData,
	YN_Init
}
