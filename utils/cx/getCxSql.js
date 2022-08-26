import req from '@/utils/request.js';
import util from '@/utils/util.js';
import db from '@/utils/db/db_excute.js';
import create_sql from '@/utils/db/create_sql.js';

/**
 * 获取主单的sql
 * @param {parmid 参数组id} 
 */
const getCxmSql = async (storeDqid,dateTime,storeid) => {
	let dapzcs_nr_arr = [];
	let cxformd001_arr = [];
	let cxkey = "";
	let dapzcs_nr_sql = "select sname from dapzcs_nr where id='JRCXGJZ' and id_nr ='" + storeDqid + "'	and date(zf)<=DATE('" + dateTime + "')  and rq>=DATE('" + dateTime + "') ";
    await db.get().executeQry(dapzcs_nr_sql, "执行中", function(res) {
		console.log("dapzcs_nr_sql执行结果：", res.msg);
		dapzcs_nr_arr = res.msg;
		cxkey = res.msg.length > 0 ? res.msg[0].SNAME : "";
		console.log("SNAME结果：", cxkey);
	}, function(err) {
		console.log("dapzcs_nr_sql执行失败：", err);
	});
	
	let cxformd001_sql = "SELECT KHID,BILL,YN_ZD,YN_JSLB,CXRY,HYLV,CXZT,CX_WEEK,SDATE,EDATE,YN_TIME,\
						 STIME1,ETIME1,STIME2,ETIME2,STIME3,ETIME3,NOTFKID,BILL_STATUS ,JFSX\
						 FROM   cxformd001 WHERE BILL_STATUS ='1' AND khid ='" + storeid + "' and YN_JSLB!='F'\
						 AND SDATE<= DATETIME('" + dateTime + "') AND EDATE>= DATETIME('" + dateTime + "')  AND  cxformd001.cxzt like  '%" + cxkey + "%' order by YN_ZD desc ";
	await db.get().executeQry(cxformd001_sql, "执行中", function(res1) {
		console.log("cxformd001_sql执行结果：", res1.msg);
		cxformd001_arr = res1.msg;
	}, function(err) {
		console.log("cxformd001_sql执行失败：", err);
	});
	
	return cxformd001_arr;
}

/**
 * 促销规则Sql
 * @param {parmid 参数组id} 
 */
const cxClassSql = async (storeid,date1) => {
	let cxformd002_arr = [];
	let cxformd002_sql = "SELECT KHID,BILL,BILL||CLASSID CLASSID,ZKTYPE,DISCTYPE,CHANGELV,XX_QTY1,XX_NET1,MJ_DISC1,\
                             MJ_NET1,ZJPRICE1,JFFACTOR1,XX_QTY2,XX_NET2,MJ_DISC2,ZJPRICE2,JFFACTOR2,MJ_NET2,\
                                XX_QTY3,XX_NET3,ZJPRICE3,JFFACTOR3,MJ_DISC3,MJ_NET3,XX_QTY4,XX_NET4,ZJPRICE4,JFFACTOR4,MJ_DISC4,MJ_NET4,SYJF\
                             FROM   cxformd002 WHERE bill IN  ( SELECT  BILL  FROM  cxformd001 WHERE     BILL_STATUS ='1' and YN_JSLB!='F'  AND khid ='" + storeid + "'\
							AND SDATE<= DATETIME('" + date1 + "')  and EDATE>= DATETIME('" + date1 + "') )  ORDER  by CLASSID*1";
    await db.get().executeQry(cxformd002_sql, "执行中", function(res) {
		console.log("cxformd002_sql执行结果：", res.msg);
		cxformd002_arr = res.msg;
	}, function(err) {
		console.log("cxformd002_sql执行失败：", err);
	});
	return cxformd002_arr;
}

/**
 * 促销内容对应的产品Sql
 * @param {parmid 参数组id} 
 */
const cxSPsql = async (storeid,date1) => {
	let cxformd003_arr = [];
	let cxformd003_sql = "SELECT KHID,BILL,BILL||CLASSID CLASSID,SPID  FROM  cxformd003 WHERE  bill IN  (  SELECT  BILL  FROM  cxformd001 WHERE  BILL_STATUS ='1'  and YN_JSLB!='F'\
					   AND khid ='" + storeid + "'  AND SDATE<= DATETIME('" + date1 + "')  and EDATE>= DATETIME('" + date1 + "') )";
    await db.get().executeQry(cxformd003_sql, "执行中", function(res) {
		//console.log("cxformd003_sql执行结果：", res.msg);
		cxformd003_arr = res.msg;
	}, function(err) {
		console.log("cxformd003_sql执行失败：", err);
	});
	return cxformd003_arr;
}


/**
 * 促销赠券Sql
 * @param {parmid 参数组id} 
 */
const cxZqSql = async (gsid,storeid,date1) => {
	let cxformd005_arr = [];
	let cxformd005_sql = "SELECT Khid, Bill, Kquser, Lqtype, Zqty, Hqty, Aqty, Note  FROM  cxformd005\
					  WHERE Kquser in (select sname  from Dapzcs_Nr  where  id   like  'DSF%'  and  id_nr  like  'KQUSER_%' and note ='" + gsid + "')  and  bill IN  (   SELECT  BILL  FROM  cxformd001 WHERE\
                      BILL_STATUS ='1' and YN_JSLB!='F'  AND khid ='" + storeid + "'  AND SDATE<= DATETIME('" + date1 + "')  and EDATE>= DATETIME('" + date1 + "') )";
    await db.get().executeQry(cxformd005_sql, "执行中", function(res) {
		console.log("cxformd005_sql执行结果：", res.msg);
		cxformd005_arr = res.msg;
	}, function(err) {
		console.log("cxformd005_sql执行失败：", err);
	});
	return cxformd005_arr;
}

export default {
	getCxmSql,
	cxClassSql,
	cxSPsql,
	cxZqSql
}