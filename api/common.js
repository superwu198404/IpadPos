import Req from '@/utils/request.js';
import util from '@/utils/util.js';
import db from '@/utils/db/db_excute.js';
import sql from '@/utils/db/create_sql.js';
import create_sql from '@/utils/db/create_sql.js';

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

//创建销售表结构
var CreatSaleTable = function() {
	let sql = create_sql.createSql; //创建表
	db.get().executeDml(sql, "表结构创建中", function(res) {
		console.log("表结构创建成功");
		console.log(res);
	}, function(err) {
		console.log("表结构创建失败");
		console.log(err);
	});
}

//创建单号
var CreateBill = function(khid, posid, seq) {
	if (!khid || !posid) {
		return "";
	}
	let bill = khid + posid + util.ymsFormat();
	if (seq) {
		bill + '_' + seq;
	}
	return bill;
}

//传入集合数组，和表名字，返回包含oracle 和sqllite得sql 数组
var CreateSQL = function(e, t) {
	if (!e || !t) {
		return [];
	}
	let oracle_sql = "",
		lite_sql = "",
		oracle_arr = [],
		lite_arr = [];
	if (Array.isArray(e)) {
		for (var i = 0; i < e.length; i++) {
			let nameStr = "",
				valStr = "",
				liteStr = "",
				sql1 = "",
				sql2 = "";
			for (var name in e[i]) { //遍历对象属性名
				nameStr += name + ",";
				let data = e[i][name];
				if (name.toUpperCase().indexOf('DATE') >= 0 || name.toUpperCase().indexOf('TIME') > 0) {
					if (data != null && data != undefined && data.toString().trim() != "") { //包含0的影响
						valStr += "TO_DATE('" + data + "','yyyy-MM-dd HH24:mi:ss'),";
						liteStr += 'DATETIME("' + data + '"),';
					} else {
						valStr += "null,";
						liteStr += "null,";
					}
				} else {
					if (data != null && data != undefined && data.toString().trim() != "") {
						valStr += "'" + data + "',";
						liteStr += '"' + data + '",';
					} else {
						valStr += "null,";
						liteStr += "null,";
					}
				}
			}
			sql1 = "insert into " + t + " (" + nameStr.substring(0, nameStr.lastIndexOf(',')) + ") values(" +
				valStr.substring(0, valStr.lastIndexOf(',')) + ");";
			sql2 = "insert into " + t + " (" + nameStr.substring(0, nameStr.lastIndexOf(',')) +
				") values(" + liteStr.substring(0, liteStr.lastIndexOf(',')) + ")";

			oracle_sql += sql1;
			lite_sql += sql2;
			oracle_arr.push(sql1);
			lite_arr.push(sql2);
		}
	} else {
		let nameStr = "",
			liteStr = "",
			valStr = "";
		for (var name in e) { //遍历对象属性名
			nameStr += name + ",";
			let data = e[name];
			if (name.toUpperCase().indexOf('DATE') >= 0 || name.toUpperCase().indexOf('TIME') > 0) {
				if (data != null && data != undefined && data.toString().trim() != "") {
					valStr += "TO_DATE('" + data + "','yyyy-MM-dd HH24:mi:ss'),";
					liteStr += 'DATETIME("' + data + '"),';
				} else {
					valStr += "null,";
					liteStr += "null,";
				}
			} else {
				if (data != null && data != undefined && data.toString().trim() != "") {
					valStr += "'" + data + "',";
					liteStr += '"' + data + '",';
				} else {
					valStr += "null,";
					liteStr += "null,";
				}
			}
		}
		oracle_sql += "insert into " + t + " (" + nameStr.substring(0, nameStr.lastIndexOf(',')) + ") values(" +
			valStr.substring(0, valStr.lastIndexOf(',')) + ");";
		lite_sql += "insert into " + t + " (" + nameStr.substring(0, nameStr.lastIndexOf(',')) +
			") values(" + liteStr.substring(0, liteStr.lastIndexOf(',')) + ")";
		oracle_arr.push(oracle_sql);
		lite_arr.push(lite_sql);
	}
	return {
		oracleArr: oracle_arr,
		sqlliteArr: lite_arr,
		oracleSql: oracle_sql,
		sqlliteSql: lite_sql
	};
}

//传输本地缓存的数据
var TransLiteData = function(e) {
	let sql = "select * from POS_TXFILE where BDATE<=datetime('now','-5 minute')"; //五分钟前 
	if (e) {
		sql = "select * from POS_TXFILE where STR1='" + e + "'"; //如果有单号的话 处理该笔订单
	}
	db.get().executeQry(sql, "数据查询中", function(res) {
			console.log("传输数据查询成功", res);
			if (res.code && res.msg.length > 0) {
				for (var i = 0; i < res.msg.length; i++) { //一条条的处理 防止阻塞后续的单据
					let sql1 = res.msg[i].TX_SQL;
					let delVal = "'" + res.msg[i].STR1 + "'";
					console.log("传输sql", sql1);
					// console.log("待删除数据", delVal);
					let apistr = "MobilePos_API.Models.SALE001CLASS.ExecuteBatchSQL";
					let reqdata = Req.resObj(true, "数据传输中", {
						sql: sql1
					}, apistr);
					Req.asyncFuncOne(reqdata,
						function(res1) {
							console.log("数据传输结果：", res1);
							if (res1.code) {
								let delStr = "delete from POS_TXFILE where str1 =" + delVal;
								delStr += "update SALE001 set yn_sc='Y'"; //修改001的数据
								db.get().executeDml(delStr, "数据删除中", function(res2) {
									console.log("数据删除更改状态成功", res2);
								}, function(err1) {
									console.log("数据删除更改并状态失败", err1);
								});
							}
						});
				}
			}
		},
		function(err) {
			console.log("传输数据查询失败", err);
		});
}

//获取支付方式
var GetPayWay = function(e, func) {
	let sql = "SELECT IFNULL(F1.YN_JKPRINT, 'N') YN_JKPRINT,\
                                       F1.JK_PRINT_PATH  JK_PRINT_PATH,\
                                       IFNULL(F1.YN_ZL, 'N') YN_ZL,\
                                       IFNULL(F1.NET_ADDTYPE, 'N') NET_ADDTYPE,\
                                       IFNULL(F1.YN_INPUTJE, 'N') YN_INPUTJE,\
                                       F1.FKID  FKID,\
                                       F1.SNAME  SNAME,\
                                       F1.PINYIN  PINYIN,\
                                       F1.MEDIA  MEDIA,\
                                       F1.YN_DBM  YN_DBM,\
                                       F1. YN_SQ  YN_SQ,\
                                       F1. YN_CEZF  YN_CEZF,\
                                       IFNULL(F1.YN_JK, 'N') YN_JK,\
                                       F1.JK_KEY1  JK_KEY1,\
                                       F1.JK_KEY2  JK_KEY2,\
                                       F1.JK_KEY3  JK_KEY3,\
                                       F1.FKJBID   FKJBID,\
                                       F1.FKID_F   FKID_F,\
                                       F1.ID_RY_LR  ID_RY_LR,\
                                       F1.DATE_LR  DATE_LR,\
                                       F1.ID_RY_XG  ID_RY_XG,\
                                       F1.DATE_XG  DATE_XG,\
                                       F1.DA_STATUS  DA_STATUS,\
                                       F1. ID_RY_SH  ID_RY_SH,\
                                       F1.DATE_SH  DATE_SH,\
                                       F1.JKSNAME  JKSNAME,\
                                       F1. NBJKNO  NBJKNO,\
                                       'N' YN_FP  ,\
                                       'Y' YN_YLTH ,\
                                       F1.ZKLX  ZKLX\
                                  FROM FKDA F1, KHZFKDA K1,KHDA K2 \
                                     WHERE  f1.fkid = k1.fkid  \
                                        AND  k2.dqid = k1.khzid \
                                        AND  k2.khid ='" + e + "' \
                                 ORDER BY F1.DATE_LR, F1.FKJBID,F1.MEDIA, F1.FKID";
	db.get().executeQry(sql, "数据查询中", function(res) {
		GetPolyPayWay(e, (res1) => {
			console.log("聚合数据：", res1);
			for (var i = 0; i < res.msg.length; i++) {
				let obj = res1.msg.find((item) => {
					return item.ID_NR == res.msg[i].FKID;
				})
				if (obj) {
					res.msg[i].POLY = 'Y';
				} else {
					res.msg[i].POLY = 'N';
				}
			}
			if (func) func(res);
			return;
		})
		if (func) func(res);
	}, function(err) {
		console.log("获取付款方式出错:", err);
		uni.showToast({
			icon: 'error',
			title: "获取付款方式出错"
		})
	});
}
//获取聚合支付
var GetPolyPayWay = function(e, func) {
	let sql = "select  ID_NR,ZF  from  dapzcs_nr where id  ='FKJHZF'";
	db.get().executeQry(sql, "数据查询中", function(res) {
		if (func) func(res);
	}, function(err) {
		console.log("获取聚合付款方式出错:", err);
		uni.showToast({
			icon: 'error',
			title: "获取聚合付款方式出错"
		})
	});
}
var Excute = async function(sql, func) {
	let datas = null;
	await db.get().executeQry(sql, "数据查询中", function(res) {
		if (func) func(res);
		datas = res.msg;
	}, function(err) {
		console.log("获取付款方式出错:", err);
		uni.showToast({
			icon: 'error',
			title: "获取付款方式出错"
		})
	});
	return datas;
}

export default {
	InitData,
	CreateBill,
	CreateSQL,
	CreatSaleTable,
	TransLiteData,
	GetPayWay,
	Excute,
	GetPolyPayWay
}
