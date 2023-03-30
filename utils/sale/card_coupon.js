import _sale from '@/utils/sale/saleClass.js';
import _util from '@/utils/util.js';
import _date from '@/utils/dateformat.js';
import _member from '@/api/hy/MemberInterfaces.js';
import _Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import sales from '@/utils/sale/saleClass.js';
import _card_sale from "@/api/business/card_sale.js";
import {
	CreateSaleOrder,
	PointUploadNew
} from '@/bll/Common/bll.js';

import _common from '@/api/common.js';
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
	if (index == 0) {
		index = _util.newFloat((Math.random() * 10), 0);
	}
	newbill = newbill + "" + index;
	console.log("创建的单号：", newbill);
	return newbill;
}
//初始化sale001
var InitSale001 = function(store, pm_input) {
	console.log("传入的数据：", store);
	console.log("传入的数据1：", pm_input);
	var commonSaleParm = {
		GSID: store.GSID,
		KHID: store.KHID,
		SALEDATE: _date.getYMD(),
		POSID: store.POSID,
		RYID: store.RYID,
		BILL: getBill(store),
		KCDID: store.KCDID,
		DPID: store.DPID,
		GCID: store.GCID,
		SALETIME: _date.getYMDS(),
		YN_OK: 'X', //默认为 X
		YN_SC: 'N', //默认为 N
		YAER: _date.getDateByParam("Y"),
		MONTH: _date.getDateByParam("M"),
		WEEK: _date.getDateByParam("w"),
		TIME: _date.getDateByParam("h"),
		XSPTID: "PAD"
	};
	let obj = commonSaleParm;
	if (pm_input && Object.keys(pm_input).length > 0) {
		obj = Object.assign({}, commonSaleParm, pm_input);
	}
	let sale001 = new _sale.sale001(obj);
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
				_util.simpleMsg("卡状态不是“未激活”状态", "none");
				return false;
			}
			return true;
		},
		//校验库存
		CheckStock: function(data, func) {
			_member.StockQuery("查询中...", {
				data
			}, res1 => {
				if (res1.code && res1.data[0].CARDNUM == "0") {
					func({
						code: false,
						msg: "卡库存不在当前门店"
					})
					return;
				}
				func(res1);
			}, func);
		},
		//激活申请校验
		ActiveApply: function(data, func) {
			_member.singleCardActiveApply("校验中...", {
				data
			}, func, func);
		},
		//激活确认校验
		ActiveConfirm: function(data, func) {
			console.log("激活参数：", data);
			_member.singleCardActiveConfirm("激活中...", {
				data
			}, func, func);
		},
		//激活后充值
		Recharge: function(data, func) {
			console.log("充值参数：", data);
			_member.posPayRecharge("充值中...", {
				data
			}, func, func);
		},
		//业务完成
		Completed: async function(data,func) {
			try {
				console.log("[Completed]即将创建销售单:", data);
				let create_result = await CreateSaleOrder({
					SALE001: data.SALE001,
					SALE002: data.SALE002,
					SALE003: data.SALE003,
					SALE006: data.SALE006,
					SXSALE001: data.SXSALE001,
				});
				console.log("[Completed]创建销售单结果:", create_result);
				if (create_result.code)
				console.log("业务单号:", data.SALE001.BILL);
				_common.TransLiteData(data.SALE001.BILL, res => {
					console.warn("Completed卡券 ======:", res);
					if(res.code){ if (func) func(res);}
				}); //上传至服务端
				_util.simpleMsg(create_result.msg, !create_result.code);	
			} catch (e) {
				console.log("[Completed]订单sql生成发生异常:", e);
			}
		},
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
				sale2.PRICE = 0;
				sale2.OPRICE = 0;
				sale2.UNIT = spinfo?.UNIT;
				sale2.PLID = spinfo?.PLID;
				sale2.SPJGZ = spinfo?.SPJGZ;
				sale2.BRANDID = "SKCZ";
				sale2.txtStyle = "left:0";
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
		InitData: function(data, func) {
			console.log("VIP充值初始化：", data);
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
			if (res.data.status != 'Z001') { //要已激活的
				_util.simpleMsg("卡状态不是“已激活”状态", "none");
				return false;
			}
			return true;
		},
		//校验库存
		CheckStock: function(data, func) {
			//vip卡充值不校验库存 所以默认通过
			func({
				code: true,
				msg: "vip卡充值:默认校验通过"
			})
		},
		//激活申请（校验）
		ActiveApply: function(data, func) {
			//vip卡充值不需要激活 所以默认通过
			func({
				code: true,
				msg: "vip卡充值:默认激活通过"
			})
		},
		//激活确认（校验）
		ActiveConfirm: function(data, func) {
			//vip卡充值不需要激活 所以默认通过
			func({
				code: true,
				msg: "vip卡充值:默认激活通过"
			})
		},
		//激活后充值
		Recharge: function(data, func) {
			console.log("充值参数：", data);
			_member.posPayRecharge("充值中...", {
				data
			}, func, func);
		},
		//业务完成
		Completed: async function(data,func) {
			try {
				console.log("[Completed]即将创建销售单:", data);
				let create_result = await CreateSaleOrder({
					SALE001: data.SALE001,
					SALE002: data.SALE002,
					SALE003: data.SALE003,
					SALE006: data.SALE006,
					SXSALE001: data.SXSALE001,
				});
				console.log("[Completed]创建销售单结果:", create_result);
				if (create_result.code)
					console.log("业务单号:", data.SALE001.BILL);
				_common.TransLiteData(data.SALE001.BILL, res => {
					console.warn("Completed卡券 ======:", res);
					if(res.code){ if (func) func(res);}
				}); //上传至服务端
				_util.simpleMsg(create_result.msg, !create_result.code);
			} catch (e) {
				console.log("[Completed]订单sql生成发生异常:", e);
			}
		},
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
				sale2.PRICE = 0;
				sale2.OPRICE = 0;
				sale2.UNIT = spinfo?.UNIT;
				sale2.PLID = spinfo?.PLID;
				sale2.SPJGZ = spinfo?.SPJGZ;
				sale2.BRANDID = "CZ";
				sale2.txtStyle = "left:0";
				return sale2;
			}
			return null;
		}

	},
	//礼品卡 激活
	"GiftCard_Active": {
		xsype: "1",
		bill_type: "Z111",
		kqtype: "SK", //售卡
		typename: "礼品卡售卡", //售卡

		//初始化
		InitData: function(data, func) {
			console.log("礼品卡激活初始化：", data);
		},
		//查询信息
		QueryInfo: function(data, func) {
			_member.CARD_QUERY("查询中...", {
				data
			}, func, func);
		}, //校验状态
		CheckStatus: function(res) {
			if (!res.code) {
				_util.simpleMsg(res.msg, true);
				return false;
			}
			if (res.data.cardType != 'Z002') {
				_util.simpleMsg("卡类型不是礼品卡", "none");
				return false;
			}
			if (res.data.status != 'Z007') {
				_util.simpleMsg("卡状态不是“未激活”状态", "none");
				return false;
			}
			return true;
		},

		//校验可用号段
		CheckActiveNum: function(data, func) {
			_member.checkCardsActiveNums("校验中...", {
				data
			}, func, func);
		},
		//校验库存
		CheckStock: async function(data, func) {
			await _member.StockQuery("查询中...", {
				data
			}, res1 => {
				if (res1.code && res1.data[0].CARDNUM == "0") {
					func({
						code: false,
						msg: "卡库存不在当前门店"
					})
					return;
				}
				func(res1);
			}, func);
		},
		//批量激活申请校验
		ActiveApply: function(data, func) {
			_member.batchCardActiveApply("校验中...", {
				data
			}, func, func);
		},
		//批量激活确认校验
		ActiveConfirm: function(data, func) {
			console.log("激活参数：", data);
			_member.batchCardActiveConfirm("激活中...", {
				data
			}, func, func);
		},

		//业务完成
		Completed: async function(data,func) {
			try {
				console.log("[Completed]即将创建销售单:", data);
				let create_result = await CreateSaleOrder({
					SALE001: data.SALE001,
					SALE002: data.SALE002,
					SALE003: data.SALE003,
					SALE006: data.SALE006,
					SXSALE001: data.SXSALE001,
				});
				console.log("[Completed]创建销售单结果:", create_result);
				if (create_result.code)
					console.log("业务单号:", data.SALE001.BILL);
				_common.TransLiteData(data.SALE001.BILL, res => {
					console.warn("Completed卡券 ======:", res);
					if(res.code){ if (func) func(res);}
				}); //上传至服务端
				_util.simpleMsg(create_result.msg, !create_result.code);
			} catch (e) {
				console.log("[Completed]订单sql生成发生异常:", e);
			}
		},
		//商品信息匹配
		MatchSP: async function(spid, price, qty) {
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
				sale2.SPID = spid;
				sale2.STR1 = spinfo?.SNAME;
				sale2.PRICE = price || 0;
				sale2.OPRICE = price || 0;
				sale2.QTY = qty || 1;
				sale2.NET = _util.newFloat(sale2.PRICE * sale2.QTY, 2);
				sale2.UNIT = spinfo?.UNIT;
				sale2.PLID = spinfo?.PLID;
				sale2.SPJGZ = spinfo?.SPJGZ;
				sale2.BRANDID = "SK";
				sale2.txtStyle = "left:0";
				return sale2;
			}
			return null;
		}

	},
	//礼品券 激活
	"GiftCoupon_Active": {
		xsype: "1",
		bill_type: "Z111",
		kqtype: "SQ", //售券
		typename: "礼品券售券", //售券
		//商品信息匹配
		MatchSP: async function(spid, count, price) {
			let spinfo;
			var result = (await RequestSend(`select * from SPDA where SPID='${spid}'`))?.result;
			console.log("[MatchSP]查询结果：", result);
			var data = JSON.parse(result.data || "");
			if (result.code && data?.length) {
				spinfo = data[0];
			}
			return {
				STR1: spinfo?.SNAME,
				PRICE: price,
				SPID: spid,
				OPRICE: price,
				NET: price * count,
				QTY: count,
				NO: 0,
				UNIT: spinfo?.UNIT,
				PLID: spinfo?.PLID,
				SPJGZ: spinfo?.SPJGZ
			};
		},
		Completed: async function(data, callback) {
			try {
				console.log("[Completed]即将创建销售单:", data);
				let create_result = await CreateSaleOrder({
					SALE001: data.SALE001,
					SALE002: data.SALE002,
					SALE003: data.SALE003,
					SALE006: data.SALE006,
					SXSALE001: data.SXSALE001,
				});
				console.log("[Completed]创建销售单结果:", create_result);
				if (create_result.code)
					console.log("业务单号:", data.SALE001.BILL);
				let tranfer_result = await _common.TransLiteDataAsync(data.SALE001.BILL); //上传至服务端
				if (callback) callback(tranfer_result);
				_util.simpleMsg(create_result.msg, !create_result.code);
			} catch (e) {
				console.log("[Completed]订单sql生成发生异常:", e);
			}
		}
	},
	//VIP卡 激活，充值 重试
	"VIPCard_Retry": {
		//初始化
		InitData: function(data, func) {
			console.log("VIP售卡重试初始化：", data);
			if (func) func();
		},
		//商品信息匹配
		MatchSP: async function(spid) {

		},
		//查询信息
		QueryInfo: function(data, func) {

		},
		//校验状态
		CheckStatus: function(res) {

		},
		//校验库存
		CheckStock: function(data, func) {

		},
		//激活申请校验
		ActiveApply: function(data, func) {
			_member.singleCardActiveApply("校验中...", {
				data
			}, func, func);
		},
		//激活确认校验
		ActiveConfirm: function(data, func) {
			console.log("激活参数：", data);
			_member.singleCardActiveConfirm("激活中...", {
				data
			}, func, func);
		},
		//激活后充值
		Recharge: function(data, func) {
			console.log("充值参数：", data);
			_member.posPayRecharge("充值中...", {
				data
			}, func, func);
		},
		//业务完成
		Completed: function(data, func) {
			console.log("[Completed]即将更新销售单状态:", data);
			let sql = "update sale001 set str1='" + data.str1 + "',reason='" + data.reason + "',yn_ok='" + data
				.yn_ok + "' where bill='" + data.bill + "';"
			sql += "update syssale001 set str1='" + data.str1 + "',reason='" + data.reason + "',yn_ok='" + data
				.yn_ok + "' where bill='" + data.bill + "';"
			_card_sale.ExecuteBatchSQL(sql, func);
		},
	},
	//礼品卡激活 重试
	"GiftCard_Retry": {
		//初始化
		InitData: function(data, func) {
			console.log("VIP售卡重试初始化：", data);
			if (func) func();
		},
		//商品信息匹配
		MatchSP: async function(spid) {

		},
		//查询信息
		QueryInfo: function(data, func) {

		},
		//校验状态
		CheckStatus: function(res) {

		},
		//校验库存
		CheckStock: function(data, func) {

		},
		//激活申请校验
		ActiveApply: function(data, func) {

		},
		//批量激活确认校验
		ActiveConfirm: function(data, func) {
			console.log("激活参数：", data);
			_member.batchCardActiveConfirm("激活中...", {
				data
			}, func, func);
		},
		//业务完成
		Completed: function(data, func) {
			console.log("[Completed]即将更新销售单状态:", data);
			let sql = "update sale001 set str1='" + data.str1 + "',reason='" + data.reason + "',yn_ok='" + data
				.yn_ok + "' where bill='" + data.bill + "';"
			sql += "update syssale001 set str1='" + data.str1 + "',reason='" + data.reason + "',yn_ok='" + data
				.yn_ok + "' where bill='" + data.bill + "';"
			_card_sale.ExecuteBatchSQL(sql, func);
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
	this.CheckActiveNum = function(data, func) {
		return KQTypeObj[this.YWType].CheckActiveNum(data, func);
	};
	this.CheckStock = async function(data, func) {
		await KQTypeObj[this.YWType].CheckStock(data, func);
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
		return KQTypeObj[this.YWType].Completed(data, func);
	};
	//商品信息匹配
	this.MatchSP = async function() {
		return await KQTypeObj[this.YWType].MatchSP.call(this, ...arguments);
	}
	const def = {
		sale001: null,
		sale002: [],
		sale003: [],
		sale008: [],
		score_info: null,
		paid: [],
		action: '',
		member: null,
		complet: (res) => console.log("[RedirectToPayment]支付完成:", res)
	}

	this.RedirectToPayment = function(options = def) {
		let params = Object.assign(Object.assign({}, def), options);
		uni.$emit('stop-message');
		uni.$emit('stop-timed-communication');
		console.log("[RedirectToPayment]支付参数组装...");
		_util.setStorage('open-loading', false);
		let inputParm = {
			sale1_obj: params.sale001, //001 主单 数据对象
			sale2_arr: params.sale002, //002 商品 数据对象集合
			sale3_arr: params.sale003, //003 支付数据集合
			sale8_arr: params.sale008, //008水吧商品
			score_info: params.score_info, //积分抵现信息
			ban_pay: params.ban_type, //被禁用的支付类型
			PayList: params.paid, //已支付信息
			actType: params.action, //动作类型(退款、支付)
			hyinfo: params.member //会员信息
		}
		console.log("[RedirectToPayment]封装数据:", inputParm);
		this.Vue.$store.commit('set-location', inputParm);
		uni.navigateTo({
			url: "../Payment/Payment",
			events: {
				FinishOrder: params.complet
			}
		})
	}
}
export default {
	KQTypeObj,
	InitKQSale,
	InitSale001,
	getBill
}
