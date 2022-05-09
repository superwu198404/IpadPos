import Req from '@/utils/request.js';
import util from '@/utils/util.js';

//初始化数据
var InitData = function(e) {
	Req.asyncFunc({
		http: true,
		url: "/Transfer/InitData",
		url_type: "center",
		title: "初始化中，请稍等...",
		data: {
			khid: e
		}
	}, function(res) {
		console.log("初始化结果：");
		console.log(res);
		if (res.code) {
			let data = JSON.parse(res.data);
			uni.setStorageSync("config", data);
		}
	});
}
//创建单据
var CreateBill = function(khid, posid) {
	if (!khid || !posid) {
		return "";
	}
	return khid + posid + util.ymsFormat();

}


export default {
	InitData,
	CreateBill
}
