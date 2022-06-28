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
								let delStr = "delete from POS_TXFILE where str1 =" + delVal + ";";
								delStr += "update SALE001 set yn_sc='Y';"; //修改001的数据
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
			console.log("序列化支付：", res);
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
	await db.get().executeQry(`select * from SALE002 where BILL='${trade}'`, "查询SALE2...", function(res) {
		datas.sale2 = res.msg;
	}, function(err) {
		console.log("Sale2查询执行异常:", err);
	});
	await db.get().executeQry(`select * from SALE003 where BILL='${trade}'`, "查询SALE3...", function(res) {
		datas.sale3 = res.msg;
	}, function(err) {
		console.log("Sale3查询执行异常:", err);
	});
	return datas;
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
		if (func) func(res);
	}, function(err) {
		console.log("获取档案参数出错:", err);
		uni.showToast({
			icon: 'error',
			title: "获取档案参数出错"
		})
	});
}
//初始化支付规则（测试使用）
var InitZFRULE = async function(e, func) {
	//创建表结构和测试数据 后期可挪到数据库中初始化
	let arr = [create_sql.ZFRuleSql,
		"delete from ZF_RULE",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('WX_CLZF','keengee','027001','/PaymentAll/Handle','WxPay_ScanCode','Mobile_Pos','KG','10,11,12,13,14,15','Y')",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('ZFB_CLZF','keengee','027001','/PaymentAll/Handle','AliPay_ScanCode','Mobile_Pos','KG','25,26,27,28,29,30','Y')",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('HYK','keengee','027001','/PaymentAll/Handle','ECard_Payment','Mobile_Pos','KG','KG','Y')",
		"insert into ZF_RULE('TYPE','APPID','GSID','URL','PAYTYPE','SOURCE','BRAND','CODE','YN_USE') values('SZQ','keengee','027001','/PaymentAll/Handle','ECoupon_Payment','Mobile_Pos','KG','coupon','Y')",
		"delete from dapzcs_nr where id='FKJHZF';",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF06', '微信支付（新）', 'wxzf（x）', NULL, '10,11,12,13,14,15', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF07', '支付宝2.0', 'zfb2.0', NULL, '25,26,27,28,29,30', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF08', '翼支付', 'yzf', NULL, '51', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF15', '银联二维码', 'ylewm', NULL, '62', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF54', '积慕支付', 'jmzf', NULL, 'JM', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF04', '仟吉电子卡', 'qjdzk', NULL, 'KG,kg', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);",
		"delete from dapzcs_nr where id='POSCS';",
		"INSERT INTO dapzcs_nr VALUES ('POSCS', 'SBLBBM', '水吧类别编码', 'sblbbm', 21, 'XXX', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);"
	];
	await db.get().executeDml(arr, "sql执行中", function(res) {
		console.log("支付规则数据和聚合数据初始化成功：", res);
		if (func) func(res);
	}, function(err) {
		console.log("支付规则数据和聚合数据初始化失败:", err);
	});
}
//获取支付规则
var GetZFRULE = async function(e, func) {
	let sql = "select * from ZF_RULE where YN_USE ='Y'";
	await db.get().executeQry(sql, "数据查询中", function(res) {
		console.log("获取支付规则数据成功：", res);
		if (res.code) {
			let obj = {};
			getApp().globalData.PayInfo = res.msg; //首先赋值一下支付规则集合
			for (var i = 0; i < res.msg.length; i++) {
				let codeArr = res.msg[i].CODE.split(',');
				for (var j = 0; j < codeArr.length; j++) {
					if (codeArr[j]) {
						obj[codeArr[j]] = res.msg[i].TYPE;
					}
				}
			}
			getApp().globalData.CodeRule = obj;
		}
		if (func) func(res);
	}, function(err) {
		console.log("获取支付规则数据出错:", err);
	});
}
//初始化聚合支付数据
var GetJHZF = async function(e, func) {
	let arr = [
		"delete from dapzcs_nr where id='FKJHZF';",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF06', '微信支付（新）', 'wxzf（x）', NULL, '10,11,12,13,14,15', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF07', '支付宝2.0', 'zfb2.0', NULL, '25,26,27,28,29,30', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF08', '翼支付', 'yzf', NULL, '51', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF15', '银联二维码', 'ylewm', NULL, '62', NULL, NULL, 'SYSTEM', DATETIME('2018-10-29 20:22:10'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF54', '积慕支付', 'jmzf', NULL, 'JM', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);",
		"INSERT INTO dapzcs_nr VALUES ('FKJHZF', 'ZF04', '仟吉电子卡', 'qjdzk', NULL, 'KG,kg', NULL, NULL, 'SYSTEM', DATETIME('2019-09-26 16:30:55'), 'SYSTEM', DATETIME('2019-12-10 14:30:54'), NULL, NULL, NULL, NULL, NULL, NULL);"
	]
	//批量执行sql 必须是数组
	await db.get().executeDml(arr, "执行中", (res) => {
		if (func) func(res);
		console.log("聚合数据初始化成功：", res);
	}, (err) => {
		console.log("聚合数据初始化失败：", err);
	});
}

//获取POS参数组内容
var GetPOSCS = async function(e, func) {
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
			console.log("获取POS参数成功:", res);
			util.setStorage("POSCS", res.msg);
			if (func) func(res);
		}, function(err) {
			console.log("获取POS参数出错:", err);
		});
	}
}
export default {
	InitData,
	CreateBill,
	CreateSQL,
	CreatSaleTable,
	TransLiteData,
	GetPayWay,
	QueryRefund,
	GetPZCS,
	InitZFRULE,
	GetZFRULE,
	GetJHZF,
	GetPOSCS
}
