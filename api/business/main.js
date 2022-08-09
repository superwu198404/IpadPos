import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';

var app = getApp();

/**
 * 获取辅助促销信息
 * @param {} khid 
 */
var GetFZCX = function(khid, func) {
	let cxArr = [];
	let sql = "select BILL,CXZT from cxformd001 cx where cx.Yn_Jslb='F' order by CXZT";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("辅助促销查询结果：", res);
		if (res.code && res.msg.length > 0) {
			res.msg.forEach((item, index) => {
				sql = "select cx2.bill, cx2.classid, sp.sname, '' CZQTY, '' BQTY, cx2.XX_NET1, cx2.MJ_DISC1, '' PRICE , '满'||cx2.XX_NET1||'可售'||cx2.MJ_DISC1||'%' describe \
                 from cxformd002 cx2, spda sp, spkhda sk  where  cx2.bill='" + item.BILL + "' and cx2.classid=sp.spid  and sp.spid=sk.spid  and  sp.PINYIN IS NOT NULL \
                 AND  sk.YN_XS='Y' \
                 AND  sp.PRODUCT_TYPE IN ( 'Z001','Z004','Z005') \
                 AND  sp.PINYIN IS NOT NULL \
                 AND  sk.KHID ='" + khid + "'";
				db.get().executeQry(sql, "查询中...", res1 => {
					let obj = {
						BILL: item.BILL,
						CXZT: item.CXZT,
						Details: res1.msg
					};
					cxArr.push(obj);
					if (func) func(cxArr);
				}, err1 => {
					console.log("查询促销异常：", err1);
				});
			})
		}
	}, err => {
		console.log("查询促销异常：", err);
	})
}

/**
 * 获取门店促销活动信息
 * @param {} khid 
 */
var GetMDCXHD = function(func) {
	let cxArr = [];
	let sql =
		"select  CXZT,DATE(SDATE) \
             SDATE, DATE(EDATE) EDATE, CASE WHEN CXRY = 2 THEN '会员' END AS CXRY from cxformd001 where CXRY='2' and YN_JSLB!='F' and EDATE>=date('now') \
                                        union all \
                                        select CXZT,DATE(SDATE) \
             SDATE ,DATE(EDATE) EDATE, CASE WHEN CXRY = 1 THEN '所有顾客' ELSE '非会员' END AS CXRY  from cxformd001 where CXRY<>'2' and YN_JSLB!='F' and EDATE>=date('now')  ORDER  by CXRY , SDATE desc";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("门店促销活动查询结果：", res);
		if (res.code && res.msg.length > 0) {
			if (func) func(res.msg);
		} else {
			util.simpleMsg("暂无数据", true);
		}
	}, err => {
		util.simpleMsg("异常：" + err, true);
		console.log("查询促销异常：", err);
	})
}
export default {
	GetFZCX,
	GetMDCXHD
}
