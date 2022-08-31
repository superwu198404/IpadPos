import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

var global = getApp();

var requestAssemble = function(loading_title = "请求中...", options) {
	return {
		code: true,
		http: {
			load: true,
			url: "/Member/handle",
			title: loading_title
		},
		method: "POST",
		data: {
			paytype: options.paytype, //"WxPay_ScanCode",
			method: options.method, //Payment
			param: {
				appid: global.globalData.appid, //getApp().globalData.appid,
				gsid: global.globalData.store.GSID, //getApp().globalData.store.GSID
				brand: options.brand,
				kquser:options.kquser
				
			},
			member: JSON.stringify(options.data)
		}
	}
}

//积分上传
const UploadPoint = async function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "ConsumeScore"
	});
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
		kquser: global.globalData.kquser,
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
var QueryHyInfo= function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		kquser: global.globalData.kquser,
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

export default {
	UploadPoint,
	CouponList,
	QueryHyInfo,
	PointsDeduction,
	PointsReturn
}
