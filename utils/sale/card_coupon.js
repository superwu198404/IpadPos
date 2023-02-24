import _sale from '@/utils/sale/saleClass.js';
import _util from '@/utils/util.js';
import _date from '@/utils/dateformat.js';
import _member from '@/api/hy/MemberInterfaces.js';
import _Req from '@/utils/request.js';


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
				_util.simpleMsg(res.msg);
				return false;
			}
			if (res.data.cardType == 'Z1001') {
				_util.simpleMsg("不是VIP卡");
				return false;
			}
			if (res.data.status == 'Z007') {
				_util.simpleMsg("卡状态无效");
				return false;
			}
			return true;
		},
		//校验库存
		CheckStock: function(data, func) {
			_member.CheckStock("查询中。。。", {
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
	},
}

//初始化卡券销售业务
var InitKQSale = function(vue, uni, store, ywtype) {
	this.Vue = vue; //vue实例
	this.Uni = uni; //uni实例
	this.Store = store; //门店实例
	this.YWType = ywtype; //业务类型

	//执行操作方法
	this.InitData = function(data) {
		KQTypeObj[this.YWType].InitData(this.Store, data);
	};
	this.QueryInfo = function(data, func) {
		KQTypeObj[this.YWType].QueryInfo(data, func);
	};
	this.CheckStock = function(data, func) {
		KQTypeObj[ywtype].CheckStock(data, func);
	};
	this.ActiveApply = function(data, func) {
		KQTypeObj[ywtype].ActiveApply(data, func);
	};
	this.ActiveConfirm = function(data, func) {
		KQTypeObj[ywtype].ActiveConfirm(data, func);
	};
	this.Recharge = function(data, func) {
		KQTypeObj[ywtype].Recharge(data, func);
	};
	this.Completed = function(data, func) {
		KQTypeObj[ywtype].Completed(data, func);
	};
}
export default {
	KQTypeObj,
	InitKQSale
}
