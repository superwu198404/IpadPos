import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

var requestAssemble = function(loading_title = "请求中...", options) {
	try{
		let app = getApp();
		let global_data = app.globalData;
		console.log("[RequestAssemble]global_data参数:",global_data??{});
		console.log("[RequestAssemble]options参数:",options??{});
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
		console.log("[RequestAssemble]调用参数:",request);
		return request;
	}
	catch(e){
		console.log("[RequestAssemble]发生异常:",e);
	}
}

//积分上传
const UploadPoint = async function(loading_title, request, success, error) {
	console.log("[UploadPoint]积分上传中...",request);
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "ConsumeScore"
	});
	console.log("[UploadPoint]积分上传参数:",data);
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
var QueryHyInfo= function(loading_title, request, success, error) {
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
