import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';

var global = getApp().globalData;

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
				appid: global.appid, //getApp().globalData.appid,
				gsid: global.store.GSID, //getApp().globalData.store.GSID
				brand: options.brand,
				kquser:options.kquser
				
			},
			member: JSON.stringify(options.data)
		}
	}
}

//积分上传
const UploadPoint = function(loading_title, request, success, error) {
	let data = requestAssemble(loading_title, {
		brand: request.brand,
		data: request.data,
		paytype: "MemberInterface",
		method: "ConsumeScore"
	});
	Req.asyncFuncOne(data, function(res) {
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
		kquser: global.kquser,
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
		kquser: global.kquser,
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
export default {
	UploadPoint,
	CouponList,
	QueryHyInfo
}
