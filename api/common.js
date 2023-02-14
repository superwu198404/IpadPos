import Req from '@/utils/request.js';
import util from '@/utils/util.js';
import db from '@/utils/db/db_excute.js';
import sql from '@/utils/db/create_sql.js';
import create_sql from '@/utils/db/create_sql.js';
import dateformat from '../utils/dateformat';

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
	if (!e || !t || Object.keys(e).length === 0) {
		return {};
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

//传输支付数据
var TransLiteData = function(e) {
	console.log("[TransLiteData]数据传输中...");
	TransLite(e, r => {
		let delArr = ["update SALE001 set yn_sc='Y' where bill='" + delVal + "'"];
		db.get().executeDml(delArr, "数据删除中", function(res2) {
			console.log("销售数据传输状态更改成功：", res2);
		}, function(err1) {
			console.log("销售数据传输状态更改失败", err1);
		});
	})
}

//传输本地缓存的数据
var TransLite = function(e, func, load = false) {
	let sql = "select * from POS_TXFILE where BDATE<=datetime('now','-5 minute')"; //五分钟前 
	if (e) {
		sql = "select * from POS_TXFILE where STR1='" + e + "'"; //如果有单号的话 处理该笔订单
	}
	db.get().executeQry(sql, "数据查询中", function(res) {
			console.log("[TransLite]传输数据查询成功", res);
			if (res.code && res.msg.length > 0) {
				for (var i = 0; i < res.msg.length; i++) { //一条条的处理 防止阻塞后续的单据
					let sql1 = res.msg[i].TX_SQL;
					let delVal = res.msg[i].STR1;
					// console.log("传输sql", sql1);
					// console.log("待删除数据", delVal);
					// sql1 = "select * from dual"
					let apistr = "MobilePos_API.Models.SALE001CLASS.ExecuteBatchSQL";
					let reqdata = Req.resObj(true, "数据传输中", {
						sql: sql1
					}, apistr, load);
					Req.asyncFuncOne(reqdata, function(res1) {
						console.log("[TransLite-Success]数据传输结果：", res1);
						util.simpleMsg(res1.code ? "数据传输成功" : "数据传输失败", !res1.code);
						if (res1.code) {
							let delStr = "delete from POS_TXFILE where str1 ='" + delVal + "'";
							db.get().executeDml1(delStr, "数据删除中", function(res2) {
								console.log("[TransLite]缓存数据删除成功:", res2);
								if (func) func(res2);
							}, function(err1) {
								console.log("[TransLite]缓存数据删除失败:", err1);
							});
						}
					}, function(err) {
						util.simpleMsg(err.msg, true);
						console.log("[TransLite-Error]数据传输结果:", err1);
					});
				}
			} else {
				console.log("[TransLite]通讯表Pos_TXFILE暂无数据", res);
			}
		},
		function(err) {
			console.log("[TransLite]传输数据查询失败", err);
		});
}

//获取支付方式
var GetPayWay = function(e, func) {
	console.log("查询门店的支付方式:", e);
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
	db.get().executeQry(sql, "数据查询中", async function(res) {
			let arr = res;
			console.log("[GetPayWay]本地fkda:", res);
			await GetPolyPayWay(e, (res1) => {
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
				arr = res;
				// if (func) func(res);
				// console.log("测试调用1");
				// return res;
			})
			// console.log("聚合处理后的付款数据：",arr);
			if (func) func(arr);
		},
		function(err) {
			console.log("获取付款方式出错:", err);
			util.simpleMsg("获取付款方式出错", true);
		});
}

//获取支付方式
var GetPayWayAsync = async function(e, func) {
	// e = 'K0101QT2'; //测试使用
	let list = [];
	console.log("[async]查询门店的支付方式:", e);
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
	await db.get().executeQry(sql, "数据查询中", async function(res) {
			let arr = res;
			await GetPolyPayWay(e, (res1) => {
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
				arr = res;
				// if (func) func(res);
				// return res;
			})
			if (func) func(arr);
			return arr;
		},
		function(err) {
			console.log("获取付款方式出错:", err);
			util.simpleMsg("获取付款方式出错", "none");
		});
}

//获取聚合支付
var GetPolyPayWay = async function(e, func) {
	let sql = "select ID_NR,ZF from  dapzcs_nr where id  ='FKJHZF'";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		if (func) func(res);
	}, function(err) {
		console.log("获取聚合付款方式出错:", err);
		util.simpleMsg("获取聚合付款方式出错", "none");
	});
}

//获取档案参数
var GetDapzcs = async function(e, func) {
	let sql = "select * from  dapzcs_nr where id  ='" + e + "'";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		console.log("获取配置参数成功:", res);
		if (func) func(res);
	}, function(err) {
		console.log("获取配置参数出错:", err);
	});
}

//查询退单所需信息
var QueryRefund = async function(trade) {
	let datas = {
		sale1: null,
		sale2: null,
		sale3: null
	};
	await db.get().executeQry(`select * from SALE001 where BILL='${trade}'`, "查询SALE1...", function(res) {
		datas.sale1 = res.msg[0];
	}, function(err) {
		console.log("Sale1查询执行异常:", err);
	});
	await db.get().executeQry(
		`select s2.*,ifnull(s.SNAME,'名称无') NAME from SALE002 s2 left join spda s on s2.spid=s.spid where BILL='${trade}'`,
		"查询SALE2...",
		function(res) {
			datas.sale2 = res.msg;
		},
		function(err) {
			console.log("Sale2查询执行异常:", err);
		});
	await db.get().executeQry(`select * from SALE003 where BILL='${trade}'`, "查询SALE3...", function(res) {
		datas.sale3 = res.msg;
	}, function(err) {
		console.log("Sale3查询执行异常:", err);
	});
	return datas;
}

var QueryBatch = async function(sqls) {
	let result = {},
		promises = [];
	sqls.forEach((sql_info) => {
		promises.push(db.get().executeQry(sql_info.sql, `[QueryBatch]查询${sql_info.name}...`,
			function(res) {
				result[sql_info.name] = res.msg;
			},
			function(err) {
				console.log(`${sql_info.name}查询执行异常:`, err);
			}));
	});
	await Promise.all(promises);
	return result;
}

//查询sql
var Query = async function(sql) {
	let data = [],
		dbo = db.get();
	console.log("[Query]打开连接...", sql);
	try {
		await dbo.open();
		console.log("[Query]执行查询...");
		await dbo.executeQry(sql, "查询中...", function(res) {
			console.log("[Query]查询执行成功:", res);
			data = res.msg;
		}, function(err) {
			console.log("[Query]查询执行异常:", err);
		});
		// await dbo.close();
		return data;
	} catch (e) {
		console.log("[Query-Error]执行异常:", e);
	}
}

//执行sql
var Excute = async function(...sql) {
	let data = null,
		dbo = db.get();
	console.log("[Excute]打开连接...");
	try {
		await dbo.open();
		console.log("[Excute]执行操作...");
		await dbo.executeDml(sql, "执行中...", function(res) {
			console.log("[Excute]修改执行成功:", res);
			data = res.msg;
		}, function(err) {
			console.log("[Excute]修改执行异常:", err);
		});
		// await dbo.close();
		return data;
	} catch (e) {
		console.log("[Excute-Error]执行异常:", e);
	}
	// await dbo.close();
	return data;
}

//获取档案参数
var GetPZCS = async function(e, func) {
	let sql = "select * from dapzcs_nr where id_nr in('YN_ZFBKBQ')";
	if (e && e.length > 0) {
		let str = "";
		for (var i = 0; i < e.length; i++) {
			str += "'" + e[i] + "',";
		}
		sql = "select * from dapzcs_nr where id_nr in(" + str.substr(0, str.length - 1) + ")";
	}
	await db.get().executeQry(sql, "数据查询中", function(res) {
		if (res.code) {
			// let arr = res.msg.map(r => {
			// 	return {
			// 		ID_NR: r.ID_NR,
			// 		ZF: r.ZF
			// 	};
			// })
			// util.setStorage("PZCS", arr);
			for (var i = 0; i < res.msg.length; i++) {
				getApp().globalData.PZCS[res.msg[i].ID_NR] = res.msg[i].ZF;
			}
			// console.log("配置参数集合：", arr)
		}
		if (func) func(res);
	}, function(err) {
		console.log("获取档案参数出错:", err);
	});
}

//初始化支付规则（测试使用）
var InitZFRULE = async function(e, func) {
	//创建表结构和测试数据 后期可挪到数据库中初始化
	let arr = [
		"delete from 'FKDA';",
		"insert into FKDA('DATE_LR','DATE_SH','DATE_XG','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','ID_RY_XG','JKSNAME','MEDIA','NBJKNO','NET_ADDTYPE','PINYIN','SNAME','YN_CEZF','YN_DBM','YN_INPUTJE','YN_JK','YN_SQ','YN_YLFH','YN_ZK','YN_ZL','ZKLX') values('2022-7-28 11:11:00','2022-7-28 11:11:00','2022-7-28 11:11:00','1','ZF09','02265213591481','02265213591481','666','SZQ','6','SZQ','NEWADD','dzq','电子券','Y','Y','N','N','Y','N','Y','N','ZV09');",
		"insert into FKDA('DATE_LR','DATE_SH','DATE_XG','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','ID_RY_XG','JKSNAME','MEDIA','NBJKNO','NET_ADDTYPE','PINYIN','SNAME','YN_CEZF','YN_DBM','YN_INPUTJE','YN_JK','YN_SQ','YN_YLFH','YN_ZK','YN_ZL','ZKLX') values('2022-7-28 11:11:00','2022-7-28 11:11:00','2022-7-28 11:11:00','1','ZF04','02265213591481','02265213591481','666','HYK','8','HYK','NEWADD','qjdzk','仟吉电子卡','N','Y','Y','Y','N','Y','Y','Y','ZV03');",
		"insert into FKDA('DATE_LR','DATE_SH','DATE_XG','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','ID_RY_XG','JKSNAME','MEDIA','NBJKNO','NET_ADDTYPE','PINYIN','SNAME','YN_CEZF','YN_DBM','YN_INPUTJE','YN_JK','YN_SQ','YN_YLFH','YN_ZK','YN_ZL','ZKLX') values('2022-7-28 11:11:00','2022-7-28 11:11:00','2022-7-28 11:11:00','1','ZF07','02265213591481','02265213591481','022','ZFB_CLZF','8','ZFB_CLZF','NEWADD','zfb','支付宝支付','N','Y','Y','Y','N','Y','Y','Y','');",
		"insert into FKDA('DATE_LR','DATE_SH','DATE_XG','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','ID_RY_XG','JKSNAME','MEDIA','NBJKNO','NET_ADDTYPE','PINYIN','SNAME','YN_CEZF','YN_DBM','YN_INPUTJE','YN_JK','YN_SQ','YN_YLFH','YN_ZK','YN_ZL','ZKLX') values('2022-7-28 11:11:00','2022-7-28 11:11:00','2022-7-28 11:11:00','1','ZF06','02265213591481','02265213591481','022','WX_CLZF','8','WX_CLZF','NEWADD','wx','微信支付','N','Y','Y','Y','N','Y','Y','Y','');",
		"insert into FKDA('DATE_LR','DATE_SH','DATE_XG','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','ID_RY_XG','JKSNAME','MEDIA','NBJKNO','NET_ADDTYPE','PINYIN','SNAME','YN_CEZF','YN_DBM','YN_INPUTJE','YN_JK','YN_SQ','YN_YLFH','YN_ZK','YN_ZL','ZKLX') values('2022-7-28 11:11:00','2022-7-28 11:11:00','2022-7-28 11:11:00','1','ZF02','02265213591481','02265213591481','022','MIS','8','MIS','NEWADD','yl','银联支付','N','N','Y','Y','N','Y','Y','Y','ZF02');",
		"insert into FKDA('DATE_LR','DATE_SH','DATE_XG','DA_STATUS','FKID','ID_RY_LR','ID_RY_SH','ID_RY_XG','JKSNAME','MEDIA','NBJKNO','NET_ADDTYPE','PINYIN','SNAME','YN_CEZF','YN_DBM','YN_INPUTJE','YN_JK','YN_SQ','YN_YLFH','YN_ZK','YN_ZL','ZKLX') values('2022-7-28 11:11:00','2022-7-28 11:11:00','2022-7-28 11:11:00','1','Z001','02265213591481','02265213591481','022','REALCARD','8','REALCARD','NEWADD','qjstk','仟吉实体卡','N','N','Y','Y','N','Y','Y','Y','Z001');",
		create_sql.ZFRuleSql,
		"delete from 'ZF_RULE';",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('WX_CLZF','keengee','027001','/PaymentAll/Handle','WxPay_ScanCode','Mobile_Pos','KG','10,11,12,13,14,15','Y');",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('ZFB_CLZF','keengee','027001','/PaymentAll/Handle','AliPay_ScanCode','Mobile_Pos','KG','25,26,27,28,29,30','Y');",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('HYK','keengee','027001','/PaymentAll/Handle','ECard_Payment','Mobile_Pos','KG','KG','Y');",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('SZQ','keengee','027001','/PaymentAll/Handle','ECoupon_Payment','Mobile_Pos','KG','coupon','Y');",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('MIS','keengee','027001','/PaymentAll/Handle','Mis_AllinPayment','Mobile_Pos','KG','','Y');",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('REALCARD','keengee','027001','/PaymentAll/Handle','KengeeCard_Payment','Mobile_Pos','KG','','Y');",
		"delete from dapzcs_nr where id='FKJHZF';",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF06', '微信支付（新）', 'wxzf（x）', NULL, '10,11,12,13,14,15', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF07', '支付宝2.0', 'zfb2.0', NULL, '25,26,27,28,29,30', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF08', '翼支付', 'yzf', NULL, '51', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF15', '银联二维码', 'ylewm', NULL, '62', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF54', '积慕支付', 'jmzf', NULL, 'JM', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF04', '仟吉电子卡', 'qjdzk', NULL, 'KG,kg', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"delete from dapzcs_nr where id='POSCS';",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'SBLBBM', '水吧类别编码', 'sblbbm', 21, 'XXX', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'YN_YXDY', '是否打印小票', 'sfdyxp', 12, 'Y', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'XPEWM', '小票结尾二维码', 'xpjwewm', 46, 'qjgzh.png', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'HYY', '小票欢迎语', 'xphyy', 11, '欢迎光临', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'YN_CALLNUM', '水吧打印录入叫号器', 'sbdylrjhq', 65, '001', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'YN_CDXP', '是否允许重打小票', 'sfyxcdxp', 53, 'Y', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'YN_DYDZFPEWM', '是否打印电子发票二维码', 'sfdydzfpewm', 52, 'Y', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'DZFPEWMDZ', '电子发票二维码地址', 'dzfpewmdz', 51, 'https://www.baidu.com/', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'BHLBBM', '裱花类别编码', 'bhlbbm', 30, 'XXX', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), '1', NULL, NULL, NULL, NULL, NULL)",
		"delete from dapzcs_nr where id='WM_ZSDZ';",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '14', 'K01000', NULL, '22', 'MEITUAN', NULL, '000000002010100010', 'SYSTEM', DATETIME('2022-04-26 19:08:15'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '15', 'K01000', NULL, '10', 'ELM', NULL, '000000004010100016', 'SYSTEM', DATETIME('2022-04-26 19:13:54'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '12', 'K01000', NULL, '11', 'XCX', NULL, '000000001010100007', 'SYSTEM', DATETIME('2022-04-26 18:51:29' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '16', 'K01000', NULL, '20', 'ELM', NULL, '000000004010100017', 'SYSTEM', DATETIME('2022-04-27 15:07:35' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '32', 'K01000', NULL, '3', 'YOUZAN', NULL, '000000009010200002', 'SYSTEM', DATETIME('2022-04-28 09:41:12' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '24', 'K01000', NULL, '5', 'MEITUAN', NULL, '000000001010100014', 'SYSTEM', DATETIME('2022-04-27 17:39:35' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '26', 'K01000', NULL, '2', 'MEITUAN', NULL, '000000001010100004', 'SYSTEM', DATETIME('2022-04-27 17:52:17' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '17', 'K01000', NULL, '5', 'YOUZAN', NULL, '000000001010100004', 'SYSTEM', DATETIME('2022-04-27 15:56:46' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '18', 'K01000', NULL, '5', 'ELM', NULL, '000000001010100011', 'SYSTEM', DATETIME('2022-04-27 15:56:46'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '19', 'K01000', NULL, '5', 'ELM', NULL, '000000001010100012', 'SYSTEM', DATETIME('2022-04-27 15:56:46' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '23', 'K01000', NULL, '6', 'ELM', NULL, '000000001010100014', 'SYSTEM', DATETIME('2022-04-27 17:38:39' ), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO DAPZCS_NR VALUES ('WM_ZSDZ', '30', 'K01000', NULL, '1', 'MEITUAN', NULL, '000000001010100013', 'SYSTEM', DATETIME('2022-04-27 18:24:51'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"delete from spda where spid in ('000000001010100004','000000009010200002');",
		"INSERT INTO SPDA ('SPID', 'BARCODE', 'SNAME', 'PINYIN', 'SPECS', 'WEIGHT', 'PRODUCT_TYPE', 'SPBQ', 'SPKW', 'MLQTY', 'JGSTAT', 'ADDR_SC', 'PLID', 'UNIT', 'UNIT_PF', 'PFXS', 'PFXSFZ', 'PFXSFM', 'QCID', 'SHELFLIFE', 'YN_ZS', 'OSPID', 'PRODUCT_STATUS', 'YN_XPDG', 'SPJGZ', 'SMODE', 'YN_ZH', 'PGPL', 'YN_DEL', 'ID_RY_LR', 'DATE_LR', 'ID_RY_XG', 'DATE_XG') VALUES('000000001010100004', '6951143188169', '竹节排包(原味)', 'zjpb(yw)', '个(201312)', '300', 'Z001', NULL, '原味', NULL, NULL, '-仟吉', '10101', '袋', NULL, NULL, NULL, NULL, '1030201020000000000', '365', 'Y', '10101004', '1', NULL, '01', NULL, NULL, '7930', NULL, 'JK', datetime('2018-12-31 14:40:42'), NULL, datetime('2022-06-10 23:37:04'))",
		"INSERT INTO SPDA ('SPID', 'BARCODE', 'SNAME', 'PINYIN', 'SPECS', 'WEIGHT', 'PRODUCT_TYPE', 'SPBQ', 'SPKW', 'MLQTY', 'JGSTAT', 'ADDR_SC', 'PLID', 'UNIT', 'UNIT_PF', 'PFXS', 'PFXSFZ', 'PFXSFM', 'QCID', 'SHELFLIFE', 'YN_ZS', 'OSPID', 'PRODUCT_STATUS', 'YN_XPDG', 'SPJGZ', 'SMODE', 'YN_ZH', 'PGPL', 'YN_DEL', 'ID_RY_LR', 'DATE_LR', 'ID_RY_XG', 'DATE_XG') VALUES ('000000009010200002', '2090102000020', '纸盒20x20cm', 'zh20x20cm', NULL, '0', 'Z009', NULL, NULL, NULL, NULL, NULL, '90102', '个', NULL, NULL, NULL, NULL, NULL, '0', 'Y', NULL, '1', NULL, '01', NULL, NULL, NULL, NULL, 'JK', datetime('2021-09-15 14:53:26'), NULL, datetime('2021-09-26 16:58:17'))",
		"delete from dapzcs_nr where id='THTYPE';",
		"INSERT INTO dapzcs_nr VALUES ('THTYPE', '0', '自提', 'zt', NULL, '10,11,12,13,14,15', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('THTYPE', '1', '宅配到家', 'shsm', NULL, '25,26,27,28,29,30', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('THTYPE', '2', '现卖配送', 'xmps', NULL, '51', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"delete from POSCSZmx where POSCS='KJGSFW';",
		"INSERT INTO POSCSZmx (POSCSZID, POSCS, POSCSNR, NOTE, SZ, ID_RY_LR, DATE_LR, ID_RY_XG, DATE_XG) VALUES ('001', 'KJGSFW', 'K960,K900,K210,K200', NULL, '43', 'SYSTEM', DATE('2018-09-10 20:17:19'), 'SYSTEM', DATE('2020-11-30 09:27:58'));"
	];
	await db.get().executeDml(arr, "sql执行中", function(res) {
		console.log("支付规则数据和聚合数据初始化成功：", res);
		if (func) func(res);
	}, function(err) {
		console.log("支付规则数据和聚合数据初始化失败:", err);
	});
}
//获取支付规则 旧版
var GetZFRULE1 = async function(e, func) {
	let sql = "select * from ZF_RULE where YN_USE ='Y' and source='Mobile_Pos'";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		console.log("获取支付规则数据成功：", res);
		if (res.code) {
			let obj = {};
			util.setStorage("PayInfo", res.msg);
			// getApp().globalData.PayInfo = res.msg; //首先赋值一下支付规则集合
			for (var i = 0; i < res.msg.length; i++) {
				if (res.msg[i].CODE) { //防止有些支付防止没有配置code
					let codeArr = res.msg[i].CODE.split(',');
					for (var j = 0; j < codeArr.length; j++) {
						if (codeArr[j]) {
							obj[codeArr[j]] = res.msg[i].TYPE;
						}
					}
				}
			}
			util.setStorage("CodeRule", obj);
			// getApp().globalData.CodeRule = obj;
		}
		if (func) func(res);
	}, function(err) {
		console.log("获取支付规则数据出错:", err);
	});
}
//获取支付规则 新版
var GetZFRULE = async function(e, func) {
	let sql =
		"select PINYIN TYPE,ZF APPID,NOTE URL,ID_NR PAYTYPE,FIELDNAME1 CODE,SNAME NOTE,ID_RY_SH BRAND,DA_STATUS YN_USE from DAPZCS_NR where id='ZF_RULE' and DA_STATUS='Y' and FIELDNAME2='Mobile_Pos'";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		console.log("新版本获取支付规则数据成功：", res);
		if (res.code) {
			let obj = {};
			util.setStorage("PayInfo", res.msg);
			// getApp().globalData.PayInfo = res.msg; //首先赋值一下支付规则集合
			for (var i = 0; i < res.msg.length; i++) {
				if (res.msg[i].CODE) { //防止有些支付防止没有配置code
					let codeArr = res.msg[i].CODE.split(',');
					for (var j = 0; j < codeArr.length; j++) {
						if (codeArr[j]) {
							obj[codeArr[j]] = res.msg[i].TYPE;
						}
					}
				}
			}
			util.setStorage("CodeRule", obj);
			// getApp().globalData.CodeRule = obj;
		}
		if (func) func(res);
	}, function(err) {
		console.log("获取支付规则数据出错:", err);
	});
}

//获取POS参数组内容
var GetPOSCS = async function(e, func) {
	// e = "K0101QT2"; //测试使用
	if (e) {
		let sql = `SELECT kh.khid,
						D1.SNAME,
						P1.POSCS,
						P1.POSCSNR 
					FROM 
						POSCSZMX P1,
						DAPZCS_NR D1,
						KHDA kh 
					WHERE
						D1.ID = 'POSCS' 
						AND D1.ID_NR = P1.POSCS 
						AND P1.POSCSZID = kh.POSCSZID 
						AND kh.khid = '` + e + `'
					ORDER BY
						P1.SZ`;
		await db.get().executeQry(sql, "数据查询中", function(res) {
			// console.log("获取POS参数成功:", res);
			util.setStorage("POSCS", res.msg);
			if (func) func(res);
		}, function(err) {
			console.log("获取POS参数出错:", err);
		});
	}
}

//获取缓存中的POS参数
var GetPOSCS_Local = function(e) {
	// let str;
	// let arr = util.getStorage("POSCS");
	// console.log("缓存参数组数据:", arr);
	// if (!arr || arr.length == 0) {
	// 	await GetPOSCS(getApp().globalData.store.KHID, res => {
	// 		arr = res.msg;
	// 		let obj = arr.find((r) => r.POSCS == e);
	// 		if (obj) {
	// 			str = obj.POSCSNR;
	// 		}
	// 	});
	// } else {
	// 	let obj = arr.find((r) => r.POSCS == e);
	// 	if (obj) {
	// 		str = obj.POSCSNR;
	// 	}
	// }
	//return str;

	let obj = util.getStorage("sysParam");
	if (obj) {
		return obj[e];
	}
	return "";
}

//支付行为
var actTypeEnum = {
	Payment: "Payment", //支付
	Refund: "Refund", //退款
}

//y业务类型
var ywTypeEnum = {
	QTBS: "QTBS",
	QTLY: "QTLY"
}

//删除过期的销售单
var DelSale = function(e) { //khid
	let day = 10; //默认10天
	let day1 = 6; //默认6天
	let obj = util.getStorage("sysParam");
	day = obj.SJBLTS || 10; //数据保留天数
	day1 = obj.WSCSJBLTS || 6; //通讯数据保留天数

	let curDay = dateformat.getYMD(-day);
	console.log("业务数据保留天数：", curDay);
	let curDay1 = dateformat.getYMD(-day1);
	console.log("通讯数据保留天数：", curDay1);
	let arr1 = [
		"delete from sale001 where yn_sc='Y' and saledate < date('" + curDay + "')",
		"delete from sale002 where  bill not in( select bill from sale001 where yn_sc='Y') and saledate < date('" +
		curDay + "')",
		"delete from sale003 where  bill not in( select bill from sale001 where yn_sc='Y') and saledate < date('" +
		curDay + "')",
		"delete from sale008 where  bill not in( select bill from sale001 where yn_sc='Y') and saledate < date('" +
		curDay + "')",
		"DELETE FROM POS_TXFILE WHERE BDATE < date('" + curDay1 + "')"
	];
	db.get().executeDml(arr1, "", res => {
		console.log("本地销售单删除成功：" + day, res);
	}, err => {
		console.log("本地销售单删除失败：" + day, err);
	})
}

//获取是否有未上传的单据
var GetTXFILE = async function(e) {
	let arr = [];
	let sql = "select * from POS_TXFILE";
	await db.get().executeQry(sql, "", res => {
		console.log("查询未处理单成功:", res);
		arr = res.msg;
	}, err => {
		console.log("查询未处理单失败:", err);
	})
	return arr;
}

//确定是支付业务还是退款业务
var GetPayOrRefund = function(sale1) {
	if (sale1) {
		if (sale1.XSTYPE == '1' || sale1.XSTYPE == '3' || sale1.XSTYPE == '5' || sale1.XSTYPE == '6' || sale1
			.XSTYPE == '8') {
			return actTypeEnum.Payment
		} else {
			return actTypeEnum.Refund
		}
	}
}

//会员码转大写
var ResetAuthCode = function(e) {
	let code = e;
	if (e) {
		if (e.startsWith("kg") || e.startsWith("Kg") || e.startsWith("kG")) {
			code = e.toUpperCase();
		}
		if (!code.startsWith("KG1") && code.length == 22) { //防止扫码不全导致缺少的位数
			code = code.replace("KG", "KG1");
			console.log("校验后的码：", code);
		}
	}
	return code;
}

//四舍六入五成双  返回number类型
// 规则:
// 四舍六入五考虑，
// 五后非零就进一，
// 五后皆零看奇偶，
// 五前为偶应舍去，
// 五前为奇要进一。
var newFixed = function(num, decimalPlaces) {
	var d = decimalPlaces || 0;
	var m = Math.pow(10, d);
	var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
	var i = Math.floor(n),
		f = n - i;
	var e = 1e-8; // Allow for rounding errors in f
	var r = (f > 0.5 - e && f < 0.5 + e) ?
		((i % 2 == 0) ? i : i + 1) : Math.round(n);
	return d ? r / m : r;
}

const default_request_options = {
	namespace: "MobilePos_API.Models", //反射命名空间（默认models）
	class: "", //反射类名（非空）
	method: "", //反射接口（非空）
	data: null, //反射调用传入参数（给 method 用的）
	success: () => console.log(`[SimpleAPIRequest]接口调用成功...`),
	error: () => console.log(`[SimpleAPIRequest]接口调用失败...`)
}
//简易反射接口请求模板(默认Models下的类)
var SimpleAPIRequest = function(options = default_request_options) {
	var default_params = Object.assign({}, default_request_options);
	options = Object.assign(default_params, options);
	let reqdata = Req.resObj(true, "操作中...", options.data, `${options.namespace}.${options.class}.${options.method}`);
	return Req.asyncFuncOne(reqdata, options.success, options.error);
}

export default {
	InitData,
	CreateBill,
	CreateSQL,
	CreatSaleTable,
	TransLiteData,
	TransLite,
	GetPayWay,
	GetPayWayAsync,
	QueryRefund,
	QueryBatch,
	Query,
	Excute,
	GetPZCS,
	InitZFRULE,
	GetZFRULE,
	GetPOSCS,
	actTypeEnum,
	ywTypeEnum,
	GetDapzcs,
	DelSale,
	GetPOSCS_Local,
	GetTXFILE,
	GetPayOrRefund,
	ResetAuthCode,
	newFixed,
	SimpleAPIRequest
}
