import _sale from '@/utils/sale/saleClass.js';
import _util from '@/utils/util.js';
import _date from '@/utils/dateformat.js';
import _member from '@/api/hy/MemberInterfaces.js';
import _Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import sales from '@/utils/sale/saleClass.js'
import {
	RequestSend
} from '@/api/business/da.js'
//创建订单号
var getBill = function(store, index = 0) {
	var newbill = "";
	let d = new Date();
	let year = (d.getFullYear() % 100) < 10 ? "0" + (d.getFullYear() % 100) : (d.getFullYear() %
		100);
	let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
	let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
	let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
	let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
	newbill = store.KHID + store.POSID + year + month + day + hour + min + sec;
	//单号格式：门店号+pos号+yymmddHHmmss+流水号 自打开程序以后的开单号，每天清零
	newbill = newbill + "" + index;
	console.log("创建的单号：", newbill);
	return newbill;
}
//初始化sale001
var InitSale001 = function(store, pm_input) {
	var commonSaleParm = {
		GSID: store.GSID,
		KHID: store.KHID,
		SALEDATE: _date.getYMD(),
		POSID: store.POSID,
		RYID: store.ryid,
		BILL: getBill(),
		KCDID: store.KCDID,
		DPID: store.DPID,
		GCID: store.GCID,
		SALETIME: _date.getYMDS(),
		YN_OK: 'X', //默认为 X
		YN_SC: 'N', //默认为 N
		YAER: _date.getDateByParam("Y"),
		MONTH: _date.getDateByParam("M"),
		WEEK: _date.getDateByParam("w"),
		TIME: _date.getDateByParam("h")
	};
	if (pm_input && Object.keys(pm_input).length > 0) {
		commonSaleParm = Object.assign(commonSaleParm, pm_input);
	}
	let sale001 = new _sale.sale001(commonSaleParm);
	console.log("[InitSale001]SALE001创建完毕!", sale001);
	return sale001;
}

var KQTypeObj = {
	//VIP卡 激活，充值
	"VIPCard_Active": {
		xsype: "1",
		bill_type: "Z111",
		kqtype: "SKCZ", //售卡充值
		typename: "VIP售卡充值", //售卡充值
		//初始化
		InitData: function(data, func) {
			console.log("VIP售卡初始化：", data);
			_card_sale.GetKCZGZMX("", res => {
				console.log("卡充值规则获取结果：", res);
				if (res.code) {
					let arr = JSON.parse(res.data);
					_util.setStorage("KCZGZMX", arr);
				} else {
					_util.removeStorage("KCZGZMX");
				}
				if (func) func();
			});
		},
		//查询信息
		QueryInfo: function(data, func) {
			_member.CARD_QUERY("查询中...", {
				data
			}, func, func);
		},
		//校验状态
		CheckStatus: function(res) {
			if (!res.code) {
				_util.simpleMsg(res.msg, true);
				return false;
			}
			if (res.data.cardType != 'Z001') {
				_util.simpleMsg("卡类型不是VIP卡", "none");
				return false;
			}
			if (res.data.status != 'Z007') {
				_util.simpleMsg("卡状态无效", "none");
				return false;
			}
			return true;
		},
		//校验库存
		CheckStock: function(data, func) {
			_member.StockQuery("查询中。。。", {
				data
			}, func, func);
		},
		//激活申请校验
		ActiveApply: function(data) {},
		//激活确认校验
		ActiveConfirm: function(data) {},
		//激活后充值
		Recharge: function(data) {},
		//业务完成
		Completed: function(data) {},
		//商品信息匹配
		MatchSP: async function(spid) {
			let spinfo;
			var result = (await RequestSend(`select * from SPDA where SPID='${spid}'`))?.result;
			console.log("[MatchSP]查询结果：", result);
			var data = JSON.parse(result.data || "");
			console.log("匹配的商品信息：", data)
			if (result.code && data?.length) {
				spinfo = data[0];
			}
			if (spinfo) {
				let sale2 = new _sale.sale002();
				sale2.QTY = 1;
				sale2.SPID = spid;
				sale2.STR1 = spinfo?.SNAME;
				sale2.PRICE = spinfo?.PRICE;
				sale2.OPRICE = spinfo?.PRICE;
				sale2.UNIT = spinfo?.UNIT;
				sale2.PLID = spinfo?.PLID;
				sale2.SPJGZ = spinfo?.SPJGZ;
				sale2.BRANDID = "SK";
				return sale2;
			}
			return null;
		}
	},
	//VIP 卡充值
	"VIPCard_Recharge": {
		xsype: "1",
		bill_type: "Z111",
		kqtype: "CZ", //充值
		typename: "VIP充值", //售卡充值

		//初始化
		InitData: function() {},
		//校验状态
		CheckStatus: function() {},
		//校验库存
		CheckStock: function() {},
		//激活申请校验
		ActiveApply: function() {},
		//激活确认校验
		ActiveConfirm: function() {},
		//激活后充值
		Recharge: function() {},
		//业务完成
		Completed: function() {},
	},
	//礼品卡 激活
	"GiftCard_Active": {
		xsype: "1",
		bill_type: "Z111",
		kqtype: "SK", //售卡
		typename: "礼品卡售卡", //售卡

		//初始化
		InitData: function() {},
		//校验状态
		CheckStatus: function() {},
		//校验库存
		CheckStock: function() {},
		//激活申请校验
		ActiveApply: function() {},
		//激活确认校验
		ActiveConfirm: function() {},
		//激活后充值
		Recharge: function() {},
		//业务完成
		Completed: function() {},
	},
	//礼品券 激活
	"GiftCoupon_Active": {
		xsype: "1",
		bill_type: "Z111",
		kqtype: "SQ", //售券
		typename: "礼品券售券", //售券
		//商品信息匹配
		MatchSP: async function(spid,count,price) {
			let spinfo;
			var result = (await RequestSend(`select * from SPDA where SPID='${spid}'`))?.result;
			console.log("[MatchSP]查询结果：", result);
			var data = JSON.parse(result.data || "");
			if (result.code && data?.length) {
				spinfo = data[0];
			}
			return {
				STR1 : spinfo?.SNAME,
				PRICE : price,
				SPID : spid,
				OPRICE : price,
				NET : price * count,
				QTY : count,
				NO : 0,
				UNIT : spinfo?.UNIT,
				PLID : spinfo?.PLID,
				SPJGZ : spinfo?.SPJGZ
			};
		},
	},
}

//初始化卡券销售业务
var InitKQSale = function(vue, uni, store, ywtype) {
	this.Vue = vue; //vue实例
	this.Uni = uni; //uni实例
	this.Store = store; //门店实例
	this.YWType = ywtype; //业务类型

	//执行操作方法
	this.InitData = function(data, func) {
		KQTypeObj[this.YWType].InitData(data, func);
	};
	this.QueryInfo = function(data, func) {
		KQTypeObj[this.YWType].QueryInfo(data, func);
	};
	this.CheckStatus = function(data, func) {
		return KQTypeObj[this.YWType].CheckStatus(data, func);
	};
	this.CheckStock = function(data, func) {
		KQTypeObj[this.YWType].CheckStock(data, func);
	};
	this.ActiveApply = function(data, func) {
		KQTypeObj[this.YWType].ActiveApply(data, func);
	};
	this.ActiveConfirm = function(data, func) {
		KQTypeObj[this.YWType].ActiveConfirm(data, func);
	};
	this.Recharge = function(data, func) {
		KQTypeObj[this.YWType].Recharge(data, func);
	};
	this.Completed = function(data, func) {
		KQTypeObj[this.YWType].Completed(data, func);
	};
	//商品信息匹配
	this.MatchSP = async function(spid) {
		return await KQTypeObj[this.YWType].MatchSP.call(this,...arguments);
	}
}
export default {
	KQTypeObj,
	InitKQSale,
	InitSale001
}
