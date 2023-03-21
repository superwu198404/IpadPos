import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import _member from '@/api/hy/MemberInterfaces.js';
import {
	RequestSend
} from '@/api/business/da.js'

//获取日结数据 不传日期默认当天
var GetRJData = async function(khid, date = _date.getYMD()) {
	let info;
	var sql = "select f_xsrb('" + khid + "'，TO_DATE('" + date + "','YYYY-MM-DD')) data from dual";
	await common.WebDBQuery(sql, res => {
		console.log("[GetRJData]查询结果：", res);
		var data = JSON.parse(res.data || "");
		if (res.code && data.length > 0) {
			info = data[0].DATA;
		}
	});
	return info;
}
export default {
	GetRJData
}
