import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

/**
 * 获取卡充值规则明细
 */
var GetKCZGZMX = function(e, func) {
	let apistr = "MobilePos_API.Models.CardSaleCLASS.GetKCZGZMX";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
export default {
	GetKCZGZMX,
}
