import common from '@/api/common.js';
import util from '@/utils/util.js';
import db from '@/utils/db/db_excute.js';
import dateformat from '@/utils/dateformat.js';
import member_api from '@/api/hy/MemberInterfaces.js';
import reserve from '@/api/business/extract.js';
import {
	Refund,
	PaymentToRefundSALE001,
	PaymentToRefundSALE002,
	PaymentToRefundSALE003,
	PaymentToRefundSALE008
} from '@/bll/RefundBusiness/bll.js'
import {
	Payment
} from '@/bll/PaymentBusiness/bll.js'

/**
 * 获取支付方式
 */
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
	Array.isArray(data.sale1) ? data.sale1.length == 0 : Object.keys(data.sale1).length == 0 ||
	//这里因为有可能回传入一个数组类型的sale1，所以做个判断
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
	sales: {
		sale1: {},
		sale2: [],
		sale3: [],
	},
	products: [],
	payments: [],
	xs_type: "", //是 支付(1) 还是 退款(2)
	bill_type: "" //是 支付(Z101) 还是 退款(Z151)
}
export const Accept = async function(params_obj = accept_def_params) {
	let params = Object.assign(accept_def_params, params_obj);
	if (params.xs_type == 1) { //提取操作 => 支付
		console.log("[Accept]结算确认!开始结算...", params)
		return await Payment(params.bill_type, params.products, params.payments);
	} else { //取消操作 => 退款
		console.log("[Accept]退单确认!开始退款...");
		return await Refund(params.sales, params.xs_type);
	}
}

/**
 * 销售单 sale1、2、3 数据生成
 */
const sale_order_generation_def_params = {
	no: "", //单号
	bill_type: "", //单据类型
	xs_type: "", //销售类型
	sales: { //sale单据列表
		sale1: {}, //sale1
		sale2: [], //sale2
		sale3: [] //sale3
	}
}

//统一生成销售单数据
export const _CreateSaleOrder = async function(sale1_obj, sale2_arr, sale3_arr, sale8_arr, func) {
	//执行结果
	let result = {
		code: false,
		data: null
	};
	try {
		let saledate = dateformat.getYMD();
		let saletime = dateformat.getYMDS();
		let sql1 = common.CreateSQL(sale1_obj, 'SALE001');
		let sql2 = common.CreateSQL(sale2_arr, 'SALE002');
		let sql3 = common.CreateSQL(sale3_arr, 'SALE003');
		let sql8 = common.CreateSQL(sale8_arr, 'SALE008');
		console.log("[orderSQLGenarator]sql1生成：", sql1)
		console.log("[orderSQLGenarator]sql2生成：", sql2)
		console.log("[orderSQLGenarator]sql3生成：", sql3)
		console.log("[orderSQLGenarator]sql8生成：", sql8)
		let tx_obj = {
			TX_SQL: sql1.oracleSql + sql2.oracleSql + sql3.oracleSql + sql8.oracleSql,
			STOREID: sale1_obj.KHID,
			POSID: sale1_obj.POSID,
			TAB_NAME: 'XS',
			STR1: sale1_obj.BILL,
			BDATE: saletime, //增加时分秒的操作
			YW_NAME: "销售单据",
			CONNSTR: 'CONNSTRING'
		};
		let sql4 = common.CreateSQL(tx_obj, 'POS_TXFILE');
		let exeSql = sql1.sqlliteArr.concat(sql2.sqlliteArr).concat(sql3.sqlliteArr).concat(sql4.sqlliteArr)
			.concat(sql8.sqlliteArr);
		await db.get().executeDml(exeSql, "订单创建中", res => {
			if (func) func(res);
			result.code = true;
			result.data = res;
			console.log("[SaleOrderGenaration]销售单创建成功!", res);
		}, err => {
			if (func) func(err);
			result.code = false;
			result.data = err;
			console.log("[SaleOrderGenaration]销售单创建失败!", err);
		});
	} catch (e) {
		//TODO handle the exception
		result.code = false;
		result.data = e;
	}
	return result;
}

const additional_def_params = {
	oracle: [],
	sqlite: []
};
//统一生成销售单数据
export const CreateSaleOrder = async function(dataObj, additional = additional_def_params, func) {
	//执行结果
	let result = {
		code: false,
		data: null,
		msg: "default-msg"
	};
	let oracle_addition_sqls = additional?.oracle || [];
	let sqlite_addition_sqls = additional?.sqlite || [];
	try {
		let saledate = dateformat.getYMD();
		let saletime = dateformat.getYMDS();

		let OracleSql = "",
			SqliteSql = []
		for (let key in dataObj) {
			let dataArr = JSON.parse(JSON.stringify(dataObj[key])); //深拷贝一下
			if (key == "SALE002") {
				dataArr.forEach(r => {
					delete r.STR1;
					delete r.STR2;
				})
			}
			let sqlObj = common.CreateSQL(dataArr, key);
			if (Object.keys(sqlObj).length === 0) continue;
			OracleSql += sqlObj.oracleSql;
			if (key == "SALE001" || key == "SALE002" || key == "SALE003" || key == "SALE008" || key ==
				"YDSALE001") {
				SqliteSql = SqliteSql.concat(sqlObj.sqlliteArr ?? []);
			}
		}
		SqliteSql.concat(sqlite_addition_sqls);
		OracleSql += oracle_addition_sqls.join(';');
		console.log("[CreateSaleOrder]循环生成OracleSql：", OracleSql);
		console.log("[CreateSaleOrder]循环生成SqliteSql：", SqliteSql)
		console.log("[CreateSaleOrder]生成绑定BILL信息：", {
			销售BILL:dataObj["SALE001"].BILL || "-",
			赊销结算BILL:dataObj["YWSXJS"].BILL || "-"
		})
		let tx_obj = {
			TX_SQL: OracleSql,
			STOREID: dataObj["SALE001"].KHID,
			POSID: dataObj["SALE001"].POSID,
			TAB_NAME: 'XS',
			STR1: dataObj["SALE001"].BILL || dataObj["YWSXJS"].BILL,
			BDATE: saletime, //增加时分秒的操作
			YW_NAME: "销售单据",
			CONNSTR: 'CONNSTRING'
		};
		console.log("[CreateSaleOrder]生成通信表记录:", tx_obj);
		let sql4 = common.CreateSQL(tx_obj, 'POS_TXFILE');
		let exeSql = SqliteSql.concat(sql4.sqlliteArr);
		console.log("[CreateSaleOrder]准备执行SQL...");
		let dbo = db.get();
		await dbo.executeDml(exeSql, "订单创建中", res => {
			if (func) func(res);
			result.code = true;
			result.msg = "销售单创建成功!"
			result.data = res;
			console.log("[CreateSaleOrder]销售单创建成功!", res);
		}, err => {
			if (func) func(err);
			result.code = false;
			result.msg = "销售单创建失败!"
			result.data = err;
			console.log("[CreateSaleOrder]销售单创建失败!", err);
		});
		console.log("[CreateSaleOrder]SQL执行完毕!");
	} catch (e) {
		//TODO handle the exception
		result.code = false;
		result.data = e;
		result.msg = "销售单创建异常!"
	}
	return result;
}
export const SaleRefundOrderGenaration = async function(params = sale_order_generation_def_params, callback) {
	let result = {
		code: false,
		data: null
	}; //执行结果
	try {
		//生成退款类的数据对象
		let sale1 = PaymentToRefundSALE001(params.sales.sale1, params),
			sale2 = PaymentToRefundSALE002(params.sales.sale2, params),
			sale3 = PaymentToRefundSALE003(params.sales.sale3, params),
			sale8 = PaymentToRefundSALE008(params.sales.sale8, params);
		result = await CreateSaleOrder(sale1, sale2, sale3, sale8);
		return result;
	} catch (e) {
		result.code = false;
		result.data = e;
		return result;
	}
}
//新积分上传 适配 sale123
export const PointUploadNew = async function(sale1, sale2, sale3) {
	if (!sale1 || !sale1.CUID) { //为空或者hyid为空则跳出
		util.simpleMsg("积分上传失败：会员ID为空", "none");
		return;
	}
	let obj = {};
	console.log("sale1参数：", sale1);
	let type1 = common.GetPayOrRefund(sale1);
	let mode = (type1 == common.actTypeEnum.Payment) ? "INCREASE" : "DECREASE";
	obj.order_no = sale1.BILL;
	obj.sale_order_no = sale1.XS_BILL;
	// obj.xs_type = sale1.XSTYPE == '2' ? '2' : '1';
	obj.member_id = sale1.CUID;
	obj.mode = mode;
	obj.product = sale2;
	obj.pay_list = sale3.map(r => {
		return {
			paymentType: r.FKID,
			payAmount: r.AMT
		}
	})
	console.log("传入积分的参数：", obj);
	return await PointUpload(obj);
}
/**
 * 积分上传参数
 */
const point_upload_def_params = {
	order_no: "", //单号
	sale_order_no: "", //销售单号，退款才会传入（[主单号]+[下划线]+[序号]，例如:100000001_0）
	// xs_type: "", //销售类型
	channel: "POS", //平台、渠道（基本固定）
	member_id: "", //会员id（一般付款取当前的hyid，退单取支付单的hyid）
	product: [], //标准的 sale2 字段对象数组
	pay_list: [], //对象数组，对象结构：{ paymentType:"",payAmount:"" },其中 paymentType 是 fkid、payAmount 是支付金额,从 payment 中支付后 paylist 结构就包含了此格式
	mode: "INCREASE", //积分上传模式：INCREASE-增加，DECREASE-减少
	request: {} //积分上传参数补充对象
};
export const PointUpload = async function(def = point_upload_def_params) {
	let params = Object.assign(point_upload_def_params, def); //默认参数+传入参数
	let total_amount = 0;
	let global = getApp().globalData;
	let member_info = global.hyinfo;
	let store = global.store;
	let result = {
		code: false,
		data: null
	};
	console.log("[PointUpload]积分上传参数组装开始...", params);
	let member_request = Object.assign(Object.assign({
		channel: params.channel,
		bill: params.order_no, //退款单号
		zf_bill: params.sale_order_no, //支付单号
		// xs_type: params.xs_type, //销售类型 1或者2
		date: dateformat.getYMDS(),
		productList: params.product.map((item, i) => {
			total_amount += item.NET;
			return {
				lineNumber: i,
				product: item.BARCODE,
				category: item.PLID,
				quantity: item.QTY,
				userPrice: item.PRICE,
				basePrice: item.OPRICE,
				netPrice: item.NET //存在 sale2 数据传入或者 Product 数据传入，两者金额字段不同
			}
		}),
		payList: params.pay_list,
		khid: store.KHID,
		region: store.DQID,
		kquser: global.kquser,
		posid: store.POSID,
		cxbill: "",
		hyid: params.member_id, //会员id
		sign: "",
		time: dateformat.gettimes(),
		actionType: params.mode //判断积分是扣还是加,values： INCREASE(增加) or DECREASE(减少)
	}, {
		amount: total_amount?.toFixed(0),
		orderAmount: total_amount?.toFixed(0),
		price: total_amount?.toFixed(0),
		pay_amount: total_amount?.toFixed(0),
	}), params.request);
	console.log("[PointUpload]积分上传参数:", member_request);
	await member_api.UploadPoint("积分上传中...", {
		brand: global.brand,
		data: member_request
	}, (res) => {
		console.log("[PointUpload]积分上传成功...", res)
		util.simpleMsg(res.code ? "积分上传成功" : "积分上传失败：" + res.msg, res.code ? false : "none");
		result.code = true;
		result.data = res;
	}, (err) => {
		console.log("[PointUpload]积分上传失败...", err)
		util.simpleMsg("积分上传失败：" + err.msg, "none");
		result.code = false;
		result.data = err;
	})
	return result;
}


/**
 * 根据经纬度坐标匹配裱花配送中心
 */
export const MatchDeliveryCenter = function(longitude, latitude) { //匹配裱花中心
	let store = getApp().globalData.store;
	let GSKHINFO = reserve.getGSKHINFO(store.GSID, store.KHID);
	console.log("[MatchDeliveryCenter]获取到的GSKHINFO:", GSKHINFO);
	return new Promise((resolve, reject) => {
		reserve.MatchBHKH({
			LONGITUDE: longitude,
			LATITUDE: latitude,
			GSKHINFO: GSKHINFO
		}, res => {
			console.log("[MatchDeliveryCenter]匹配结果:", res);
			if (res.code) {
				let data = JSON.parse(res.data);
				resolve(data);
			}
		})
	})
}
