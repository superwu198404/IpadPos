import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

var requestAssemble = function(loading_title = "请求中...", options) {
	try {
		let app = getApp();
		let global_data = app.globalData;
		console.log("[RequestAssemble]global_data参数:", global_data ?? {});
		console.log("[RequestAssemble]options参数:", options ?? {});
		let request = {
			code: true,
			http: {
				load: true,
				url: "/Member/handle",
				title: loading_title
			},
			method: "POST",
			data: {
				paytype: options?.paytype, //"WxPay_ScanCode",
				method: options?.method, //Payment
				param: {
					appid: global_data?.appid, //getApp().globalData.appid,
					gsid: global_data?.store?.GSID, //getApp().globalData.store.GSID
					brand: global_data?.brand,
					kquser: global_data?.kquser

				},
				member: JSON.stringify(options?.data)
			}
		};
		console.log("[RequestAssemble]调用参数:", request);
		return request;
	} catch (e) {
		console.log("[RequestAssemble]发生异常:", e);
	}
}

//积分上传
const UploadPoint = async function(loading_title, request, success, error) {
	console.log("[UploadPoint]积分上传中...", request);
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "ConsumeScore"
	});
	console.log("[UploadPoint]积分上传参数:", data);
	await Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}

//会员券列表
const CouponList = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		kquser: getApp().globalData.kquser,
		data: request.data,
		paytype: "MemberInterface",
		method: "CouponList"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
var QueryHyInfo = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		kquser: getApp().globalData.kquser,
		data: request.data,
		paytype: "MemberInterface",
		method: "QueryHyInfo"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
var QueryHyInfoByCode = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		kquser: getApp().globalData.kquser,
		data: request.data,
		paytype: "MemberInterface",
		method: "QueryHyInfoByCode"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//积分抵扣
const PointsDeduction = async function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "PointsDeduction"
	});
	await Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//积分回退
const PointsReturn = async function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "PointsReturn"
	});
	await Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}

//卡券类销售接口

//单卡查询（与会员中心，查卡 所属物料号，面额等信息）
const CARD_QUERY = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "CARD_QUERY"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//卡券库存查询（与仟吉Hybris中台，卡券公用接口）
const StockQuery = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "StockQuery"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//VIP卡单卡申请校验（与会员中心， 校验卡是否符合激活条件）
const singleCardActiveApply = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "singleCardActiveApply"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//VIP卡单卡激活（与会员中心， 激活）
const singleCardActiveConfirm = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "singleCardActiveConfirm"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//VIP充值（与会员中心，VIP卡充值）
const posPayRecharge = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "posPayRecharge"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//卡号段可激活数量校验（与会员，获取会员中心确认的 可激活礼品卡号）
const checkCardsActiveNums = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "checkCardsActiveNums"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//礼品卡批量申请校验（与会员，校验）
const batchCardActiveApply = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "batchCardActiveApply"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
//礼品卡批量激活  （与会员，激活）
const batchCardActiveConfirm = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "batchCardActiveConfirm"
	});
	Req.asyncFuncOne(data, function(res) {
		if (success)
			success(res)
	}, function(res) {
		if (error)
			error(res)
	});
}
export default {
	UploadPoint,
	CouponList,
	QueryHyInfo,
	QueryHyInfoByCode,
	PointsDeduction,
	PointsReturn,
	CARD_QUERY,
	StockQuery,
	singleCardActiveApply,
	singleCardActiveConfirm,
	posPayRecharge,
	checkCardsActiveNums,
	batchCardActiveApply,
	batchCardActiveConfirm,
}
