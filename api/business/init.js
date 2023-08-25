import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import dateformat from '@/utils/dateformat.js';
import _sysParam from '@/utils/sysParm/sysParm.js';
import {
	RequestSend
} from '@/api/business/da.js'
//校验是否有初始化过
var YN_Init = function(sucFunc, errFunc) {
	let sql = "select count(1) count from SPKHDA"
	db.get().executeQry(sql, "校验中...", res => {
		console.log("SPKHDA查询结果：", res);
		if (res.code && res.msg.length > 0 && res.msg[0].count > 0) {
			if (sucFunc)
				sucFunc(res);
			return;
		}
		if (errFunc)
			errFunc(res);
	}, err => {
		console.log("SPKHDA查询结果1：", err);
		if (errFunc)
			errFunc(err);
	})
}



//获取支付方式
var GetPayWay = async function(e) {
	let PayWayList = [];
	await common.GetPayWay(e, function(res) {
		console.log("[GetPayWay]本地查到的付款信息：", res);
		if (res.code) {
			let PayInfo = util.getStorage("PayInfo");
			console.log("[GetPayWay]支付规则信息：", PayInfo);
			for (var i = 0; i < res.msg.length; i++) {
				if (!PayInfo || JSON.stringify(PayInfo) == "{}") { //没有支付规则则退出
					return;
				}
				// let obj1 = PayInfo.find(r => r.TYPE == res.msg[i].JKSNAME && r.NOTE == res.msg[i].SNAME);
				let obj1 = PayInfo.find(r => r.TYPE == res.msg[i].JKSNAME);
				// console.log("支付规则匹配项：", obj1);
				if (!obj1) { //如果规则数据中不存在这种支付方式则不追加
					if (res.msg[i].SNAME != '现金') //现金放行
						continue;
				}
				let obj = {};
				obj.name = res.msg[i].SNAME;
				obj.fkid = res.msg[i].FKID;
				obj.type = res.msg[i].JKSNAME || res.msg[i].FKID; //唯一性识别 用于通过type找到当前对象
				obj.api = res.msg[i].JKSNAME || "NOPAY"; //api 只用于接口调用方式
				obj.poly = res.msg[i].POLY;
				obj.dbm = res.msg[i].YN_DBM; //是否要扫码 Y:扫码 N:不扫码
				obj.zklx = res.msg[i].ZKLX; //折扣类型（主要是会员卡使用）
				obj.yn_use = res.msg[i].YN_SQ || 'N'; //obj1.YN_USE; //该支付方式是否可用
				obj.seq = i; //排序方式obj1.SEQNO
				obj.addtype = res.msg[i].NET_ADDTYPE; //支付记录 显示方式 是追加（NEWADD）还是覆盖(COVER)
				obj.raw = res.msg[i];
				obj.yn_cezf = res.msg[i].YN_CEZF; //是否允许超额支付

				// if (res.msg[i].JKSNAME == "DouYinJK") {
				// 	obj.poly = "S";
				// 	obj.fkid_f = res.msg[i].FKID_F
				// }
				if (!res.msg[i].FKID_F || res.msg[i].FKID_F == '89') //为空或者属于聚合的
					PayWayList.push(obj);
			}
			console.log("一级常用的支付方式：", PayWayList);

			let arr1 = res.msg.filter(r => {
				return ((r.FKID_F == "93" || r.FKID_F == "95" || r.FKID_F == "98") && r
					.FKJBID == '2' && r.YN_SQ == 'Y' && !PayWayList.find(f => f.fkid == r
						.FKID));
			}).map((r, i) => {
				return {
					name: r.SNAME,
					fkid: r.FKID,
					type: r.JKSNAME || r.FKID, //唯一性识别 用于通过type找到当前对象
					api: r.JKSNAME || "NOPAY", //api 只用于接口调用方式
					dbm: r.YN_DBM,
					zklx: r.ZKLX,
					fkid_f: r.FKID_F,
					// yn_use: !r.JKSNAME ? "Y" : (PayInfo.find(r1 => r1.TYPE == r.JKSNAME && r1
					// 	.NOTE == r.SNAME) ? 'Y' : "N"),
					yn_use: !r.JKSNAME ? "Y" : (PayInfo.find(r1 => r1.TYPE == r.JKSNAME) ? 'Y' :
						"N"),
						yn_use: r.FKID == "ZF83" ? 'Y' : (!r.JKSNAME ? "Y" : (PayInfo.find(r1 => r1.TYPE == r.JKSNAME) ? 'Y' :
						"N")),
					poly: "S", //更多中的支付方式
					seq: PayWayList.length + i + 1,
					addtype: r.NET_ADDTYPE,
					yn_cezf: r.YN_CEZF, //是否允许超额支付
				}
			})
			PayWayList = PayWayList.concat(arr1);
			console.log("二级其他支付方式：", arr1);

			let arr2 = [];
			//开始筛选其余不可见的方式
			for (var i = 0; i < res.msg.length; i++) {
				let obj1 = PayWayList.find((item) => {
					return item.fkid == res.msg[i].FKID;
				});
				if (!obj1) {
					let obj = {};
					obj.name = res.msg[i].SNAME;
					obj.fkid = res.msg[i].FKID;
					obj.type = res.msg[i].JKSNAME || res.msg[i].FKID; //唯一性识别 用于通过type找到当前对象
					if (obj.fkid == 'ZF09' || obj.fkid == 'ZZ01' || obj.fkid == 'ZF94') { //券相关的默认走SZQ
						obj.api = "SZQ"; //api 只用于接口调用方式	
					} else {
						obj.api = res.msg[i].JKSNAME || "NOPAY"; //api 只用于接口调用方式
					}
					obj.poly = "O";
					obj.seq = PayWayList.length + i + 1; //排序方式
					obj.addtype = res.msg[i].NET_ADDTYPE; //支付记录 显示方式 是追加（NEWADD）还是覆盖(COVER)
					obj.yn_cezf = res.msg[i].YN_CEZF; //是否允许超额支付
					arr2.push(obj);
				}
			}
			PayWayList = PayWayList.concat(arr2);
			console.log("三级不可见支付方式：", arr2);
			//如果fkda没有则追加测试数据
			let arr = [{
				name: "不可原路退回",
				fkid: "ZG11",
				type: "NO",
				poly: "O", //不显示的支付方式
				seq: PayWayList.length + 1,
				addtype: "NEWADD",
			}]
			for (var i = 0; i < arr.length; i++) {
				let obj = PayWayList.find((item) => {
					return item.type == arr[i].type && item.fkid == arr[i].fkid;
				});
				if (!obj) {
					PayWayList.push(arr[i]);
				}
			}
			//排序操作
			PayWayList = PayWayList.sort((r, r1) => {
				return r.seq - r1.seq;
			})
		}
		console.warn("最终获取到的支付方式：", PayWayList);
		util.setStorage("PayWayList", PayWayList);
	})
};

//获取门店签到状态
var GetMDQD = function(khid, func) {
	let sql = "SELECT K1.RUN_STATUS FROM KHYYMX K1 WHERE K1.KHID = '" + khid + "' and DATE_YY >= DATETIME('" +
		dateformat.getYMD() + "') and DATE_YY <= DATETIME( '" + dateformat.getYMD(1) + "')";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("门店签到信息查询成功：", res);
		if (res.code && res.msg.length > 0) {
			let obj = util.getStorage("store");
			obj.OPENFLAG = res.msg[0].RUN_STATUS;
			util.setStorage("store", obj);
		} else {
			obj.OPENFLAG = 0;
		}
		if (func) func(res);
	}, err => {
		console.log("门店信息查询失败：", err);
	})
}
//获取门店名称
var GetMDName = function(khid, func) {
	let name = "";
	let sql = "SELECT * FROM KHDA WHERE KHID = '" + khid + "'";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("[GetMDName]门店信息查询成功：", res);
		if (res.code && res.msg.length > 0) {
			name = res.msg[0].SNAME;
		}
		if (func) func(name);
	}, err => {
		console.log("门店信息查询失败：", err);
		if (func) func(name);
	})
}

var GetStoreCoordinate = function(khid) {
	RequestSend(`select * from KHDADZ where khid='${khid}'`, function(res) {
		let info = JSON.parse(res.data)?.first();
		console.warn("[GetStoreCoordinate]门店信息:", info);
		util.setStorage('StoreCoodinate', {
			longitude: info.ADRJD,
			latitude: info.ADRWD
		})
		console.log("[GetStoreCoordinate]门店经纬度信息(KHDADZ):", util.getStorage('StoreCoodinate'));
	})
}

//初始化基础数据
var InitData = async function(khid, func) {
	//生成支付规则数据(测试使用)
	// await common.InitZFRULE();
	//获取支付规则数据 在前执行
	await common.GetZFRULE();

	//获取支付方式 在后执行
	await GetPayWay(khid);

	//初始化配置参数
	await common.GetPZCS();

	//获取POS参数组数据
	await common.GetPOSCS(khid);

	//初始化系统参数
	_sysParam.init(khid);
	//签到状态
	GetMDQD(khid);

	//主动删除过期的销售数据
	common.DelSale(); //主动删除销售单

	await get_payment_infos();

	if (func)
		func();
}

var get_payment_infos = async function() {
	try {
		await RequestSend(`SELECT FKID,SNAME,JKSNAME,MEDIA FROM FKDA`, util.callBind(this, function(res) {
			if (res.code) {
				var infos = JSON.parse(res.data);
				util.setStorage('FKDA_INFO', infos)
				console.warn("[GetPaymentInfos]获取全部的支付方式:", infos);
			} else {
				util.simpleMsg("获取付款方式失败!", true)
			}
		}))
	} catch (e) {
		console.error("[GetPaymentInfos]支付信息初始化失败：", e);
		util.simpleMsg("获取付款方式失败!", true);
	}
}

var tx001 = null;
var dataInit = async function(pm_initType, ynshow = false) {
	console.log("进入重读")
	var pm_khid, pm_posid;
	let store = util.getStorage("Init_Data");
	if (store && JSON.stringify(store) != "{}") {
		pm_khid = store.KHID;
		pm_posid = store.POSID;
	} else {
		console.log("**********************未读到本地存储的门店和款台号信息************************")
		return;
	}
	if (!pm_khid || !pm_posid) {
		util.simpleMsg("请输入门店id和款台号", "none");
		return;
	}
	console.log("准备开始初始化" + pm_khid);
	let apistr = "MobilePos_API.Utils.PosInit.getTx001";
	let reqdata = Req.resObj(true, "开始通讯...", null, apistr, true);
	console.log(JSON.stringify(reqdata));
	Req.asyncFunc(reqdata,
		(res) => {
			console.log("进行通讯的001回调成功");
			tx001 = Req.getResData(res);
			let reqPosData = {
				"khid": pm_khid,
				"posid": pm_posid,
				"initType": pm_initType,
				"passkey": "111"
			};
			let apistr = "MobilePos_API.Utils.PosInit." + pm_initType;
			return Req.resObj(true, "通讯读取中...", reqPosData, apistr, true);
		},
		(res) => {
			let sql = [];
			// console.log("004回调：", res);

			uni.showLoading({
				title: "数据通讯中...",
				mask: true
			});
			let tx004 = Req.getResData(res);
			let red
			//console.log("进行通讯的004回调成功" + JSON.stringify(tx004 ).substring(0,200));
			//根据001循环创建表，并生成初始化语句
			tx001.forEach(function(item) {
				let arr004 = tx004.filter((item4) => {
					return item4.TABNAME == item.TABNAME
				});
				//console.log( JSON.stringify( arr004));
				let new004 = arr004.map(function(item004) {
					var ret_Sql = "";
					if (item004.DELSTR) {
						ret_Sql += item.SQLDEL + " " + item004.DELSTR + ";";
					}
					if (item004.INSSTR) {
						ret_Sql += item.SQLINS + " " + item004.INSSTR;
					}
					return ret_Sql;
				});
				if (pm_initType == "reloadsqlite") {
					if (new004.length > 0) //存在数据说明这里有初始化的内容
					{
						let sqldrop = "drop table  " + item.TABNAME;
						// console.log("删除一天数据" + sqldrop + "建表的语句" + item.DDLSTR);
						sql.push(sqldrop);
						sql.push(item.DDLSTR);
					}

				}
				//console.log("加载了............"+ JSON.stringify( new004.length));
				sql = sql.concat(new004);
			});
			//sql = sql.concat(_create_sql.TXSql); //追加数据通讯表POS_TXFILE
			return Req.resObj(true, "即将完成...", sql, null, true);
		},
		async (res) => {
				//console.log("数据库通讯结果：" + JSON.stringify(res.data));
				// console.log("重建数据的sql:", res.data);
				console.log("1231231312131");
				let x = await db.get().executeSqlArray(res.data, "开始创建数据库1",
					(resks) => {
						console.log("执行语句成功", resks.data.length);
						let reqdata = Req.retData(true, "OK") //对应finally函数的判断;
						return reqdata;
					},
					(resF) => {
						cconsole.log("执行失败了：", resF);
						return Req.retData(false, "start创建失败" + JSON.stringify(resF.msg))
					}
				);
				console.log("执行结果", JSON.stringify(x));
				return x;
			},
			null,
			(res) => {
				console.log("最终结果：", res);
				console.log(JSON.stringify("重读创建完成"));
				if (ynshow) {
					if (res.msg != "OK") {
						util.simpleModal("提示", res.msg)
					} else {
						util.simpleMsg("通讯完成");
					}
				}
			}
	)
}



export default {
	InitData,
	YN_Init,
	dataInit,
	GetMDName,
	GetStoreCoordinate
}
