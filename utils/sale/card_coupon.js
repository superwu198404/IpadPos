import _sale from '@/utils/sale/saleClass.js';
import _util from '@/utils/util.js';
import _date from '@/utils/dateformat.js';
import _member from '@/api/hy/MemberInterfaces.js';
import _Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import _card_sale from "@/api/business/card_sale.js";
import {
	RequestSend
} from '@/api/business/da.js'

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
			_member.CARD_QUERY("查询中。。。", {
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
			if (result.code && data?.length) {
				spinfo = data[0];
			}
			if (spinfo)
				return {
					SNAME: spinfo?.SNAME,
					PRICE: spinfo?.PRICE,
					UNIT: spinfo?.UNIT,
					PLID: spinfo?.PLID
				};
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
		MatchSP: async function(spid) {
			let spinfo;
			var result = (await RequestSend(`select * from SPDA where SPID='${spid}'`))?.result;
			console.log("[MatchSP]查询结果：", result);
			var data = JSON.parse(result.data || "");
			if (result.code && data?.length) {
				spinfo = data[0];
			}
			if (spinfo)
				return {
					SNAME: spinfo?.SNAME,
					PRICE: spinfo?.PRICE,
					UNIT: spinfo?.UNIT,
					PLID: spinfo?.PLID
				};
		}
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
		return await KQTypeObj[this.YWType].MatchSP(spid);
	}
}
export default {
	KQTypeObj,
	InitKQSale
}
