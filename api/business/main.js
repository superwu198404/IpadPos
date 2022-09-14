import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import dateformat from '@/utils/dateformat.js';

var app = getApp();

/**
 * 获取辅助促销信息
 * @param {} khid 
 */
var GetFZCX = function(khid, func) {
	//khid = "K0101QT2" //测试使用
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
	//下列sql为 测试使用
	// sql =
	// 	"select  CXZT,DATE(SDATE) \
	// 		          SDATE, DATE(EDATE) EDATE, CASE WHEN CXRY = 2 THEN '会员' END AS CXRY from cxformd001 where CXRY='2' and YN_JSLB!='F' and EDATE<=date('now') \
	// 		                                     union all \
	// 		                                     select CXZT,DATE(SDATE) \
	// 		          SDATE ,DATE(EDATE) EDATE, CASE WHEN CXRY = 1 THEN '所有顾客' ELSE '非会员' END AS CXRY  from cxformd001 where CXRY<>'2' and YN_JSLB!='F' and EDATE<=date('now')  ORDER  by CXRY , SDATE desc";
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

/**
 * 获取门店折扣信息
 * @param {} khid 
 */
var GetZKDatas = async function(data, func) {
	if (data.zktype == 'TP') {
		//data:{dkhid:"",jgid:""}
		let apistr = "MobilePos_API.Models.SALE001CLASS.GetZKDatas";
		let reqdata = Req.resObj(true, "查询中...", data, apistr);
		await Req.asyncFuncOne(reqdata, func, func);
	} else {
		let pm_zktype = "ZD02','ZD03";
		if (data.zktype == 'BZ') {
			pm_zktype = "ZD02"
		}
		if (data.zktype == 'LS') {
			pm_zktype = "ZD03"
		}
		let sql = "SELECT SPJGZ ZKSTR ,(CASE SPJGZ WHEN  '01' THEN  '商品' WHEN  '02' THEN  '商品类卡券（包括节令商品）' WHEN  '03' THEN  '现金类卡券' END) ZKNAME,\
              SPJGZ  TJBILL,TJSEQ,ZKTYPE,MZNET,ZKQTY,(100+ZKQTY)/100 ZKQTY_JS  FROM  BZDISC WHERE DQID  ='" + data
			.dqid + "' AND ifnull( DELBZ,'#') <>'X'   AND DATE(SDATE) <=DATE('" + dateformat.getYMD() +
			"')  and  MZNET  >-100 AND   ZKTYPE  IN ('" + pm_zktype + "')\
               AND  DATE(EDATE) >= DATE('" + dateformat.getYMD() + "') " + data.spjgz + " order by SPJGZ,MZNET desc";
		console.log("折扣查询sql：", sql);
		await db.get().executeQry(sql, "查询中...", res => {
			console.log("门店折扣数据查询结果：", res);
			if (func) func(res);
		}, err => {
			console.log("查询折扣异常：", err);
		})
	}
}

/**
 * 获取门店日销商品 
 * @param {门店id} khid 
 * @param {时间段} time 
 */
var GetRXSPDatas = async function(khid, time, func) {
	let sql =
		"select i.XSQTY,s.*,p.SNAME PLNAME from IPAD_RXSP i LEFT JOIN spda s on i.spid=s.spid left join PLDA p on i.PLID=p.PLID where i.khid='" +
		khid +
		"' and i.time='" + time + "' order by i.XSQTY desc";
	let data = [];
	await db.get().executeQry(sql, "查询中...", res => {
		console.log("门店日销数据查询结果：", res);
		if (res.code && res.msg.length > 0) {
			data = res.msg;
		}
	}, err => {
		console.log("查询日销数据异常：", err);
	})
	if (data.length > 0) {
		if (func) func({
			code: true,
			data: JSON.stringify(data)
		});
	} else {
		let apistr = "MobilePos_API.Models.SALE001CLASS.QuerySQL";
		let reqdata = Req.resObj(true, "查询中...", {
			sql
		}, apistr);
		Req.asyncFuncOne(reqdata, func, func);
	}
}

//获取并门店促销活动 包含标准临时和特批
var GetZKDatasAll = async function(dkhid) {
	let ZKDatas = [],
		DKFZKDatas = [];
	let store = util.getStorage("store");
	let data = {
		zktype: "",
		dqid: store.DQID,
		spjgz: "",
		dkhid: dkhid, //测试使用 "0020004824"
		jgid: store.JGID
	};
	await GetZKDatas(data, res => {
		console.log("标准，临时折扣数据获取结果：", res);
		if (res.code) {
			ZKDatas = res.msg;
		} else {
			ZKDatas = [];
		}
	})
	//特批折扣
	if (dkhid && dkhid != '80000000') {
		data = {
			zktype: "TP",
			dqid: store.DQID,
			spjgz: "",
			dkhid: dkhid, //测试使用 "0020004824"
			jgid: store.JGID
		};
		await GetZKDatas(data, res => {
			console.log("特批折扣数据获取结果：", res);
			if (res.code) {
				let arr = JSON.parse(res.data);
				let arr1 = arr.map(r => {
					return {
						ZKSTR: r.KONDM,
						ZKQTY_JS: r.BFB,
						ZKNAME: r.SPJGZ
					}
				})
				DKFZKDatas = arr1;
			} else {
				DKFZKDatas = [];
			}
		})
	}
	let obj = {
		ZKDatas: ZKDatas,
		DKFZKDatas: DKFZKDatas
	}
	return obj;
}
//数据筛选
var SortData = (type, data, pro) => {
	let zkData = [];
	if (pro.length > 0 && data.length > 0) {
		let arr = []; //商品价格组集合
		let spArr = [];
		pro.forEach(r => {
			if (arr.indexOf(r.SPJGZ) < 0) {
				arr.push(r.SPJGZ);
				let arr1 = pro.filter(r1 => {
					return r1.SPJGZ == r.SPJGZ;
				})
				let Net = 0;
				arr1.forEach(r2 => {
					Net += r2.NET;
				})
				spArr.push({
					SPJGZ: r.SPJGZ,
					NET: Net
				})
			}
		})
		//spArr=[{SPJGZ:"01",NET:2250}]
		console.log("分组统计后的商品信息：", spArr);
		spArr.forEach(r3 => {
			if (type == "TP") {
				let arr4 = data.filter(r4 => {
					return r4.ZKSTR == r3.SPJGZ;
				});
				if (arr4.length > 0) {
					arr4[0].ZKNET = ((1 - parseFloat(arr4[0].ZKQTY_JS)) * parseFloat(r3
							.NET))
						.toFixed(2);
					zkData.push(arr4[0]);
				}
			} else {
				let arr2 = data.filter(r4 => {
					return (r4.ZKSTR == r3.SPJGZ && r4.MZNET < r3.NET && r4
						.ZKTYPE == 'ZD02');
				});
				let arr3 = data.filter(r4 => {
					return (r4.ZKSTR == r3.SPJGZ && r4.MZNET < r3.NET && r4
						.ZKTYPE == 'ZD03');
				});
				// let sortArr = arr2.sort((a, b) => {
				// 	return b - a
				// });
				if (arr2.length > 0) {
					arr2[0].ZKNET = ((1 - parseFloat(arr2[0].ZKQTY_JS)) * parseFloat(r3
						.NET)).toFixed(
						2);
					zkData.push(arr2[0]);
				}
				if (arr3.length > 0) {
					arr3[0].ZKNET = ((1 - parseFloat(arr3[0].ZKQTY_JS)) * parseFloat(r3
						.NET)).toFixed(
						2);
					zkData.push(arr3[0]);
				}
			}
			console.log("当前商品价格组匹配到的折扣数据：", zkData);
		})
	}
	console.log("筛选后的折扣数据：", zkData);
	// if (zkData.length == 0) {
	// 	util.simpleMsg("暂未有效折扣", true);
	// }
	return zkData;
}
//计算商品信息折扣信息
var CalProduct = function(curData, Product) {
	Product.forEach(r => {
		let discArr = [],
			discObj = {},
			DiscNet = 0;
		let arr = curData.filter(r1 => {
			return r1.ZKSTR == r.SPJGZ
		})
		arr.forEach(r2 => {
			if (r2.ZKTYPE == 'ZD02') { //标准折扣
				r.BZDISC = (r.NET * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(2)
			} else if (r2.ZKTYPE == 'ZD03') { //临时折扣
				r.LSDISC = (r.NET * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(2)
			} else { //特批折扣
				r.TPDISC = (r.NET * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(2)
			}
		})
	});
	console.log("添加折扣后的商品数据：", Product);
	return Product;
}

//匹配商品的有效规则 包含标准临时和特批
var MatchZKDatas = function(ZKObj, products) {
	// products = [{
	// 		SPJGZ: "01",
	// 		NET: 2000,
	// 		SPID: "123456"
	// 	},
	// 	{
	// 		SPJGZ: "01",
	// 		NET: 1250,
	// 		SPID: "123457"
	// 	},
	// 	{
	// 		SPJGZ: "02",
	// 		NET: 5000,
	// 		SPID: "12345678"
	// 	}, {
	// 		SPJGZ: "03",
	// 		NET: 3000,
	// 		SPID: "123456789"
	// 	}
	// ];
	console.log("计算商品折扣传入的折扣数据：", ZKObj);
	console.log("计算商品折扣传入的商品信息：", products);
	let CurData;
	if (ZKObj.ZKData && ZKObj.ZKType) {
		if (ZKObj.ZKType == "BZ") {
			CurData = SortData("", ZKObj.ZKData.ZKDatas, products);
			if (CurData.length > 0) {
				CurData = CurData.filter(r => {
					return r.ZKTYPE == 'ZD02'
				})
			}
		} else if (ZKObj.ZKType == "LS") {
			CurData = SortData("", ZKObj.ZKData.ZKDatas, products);
		} else {
			CurData = SortData("TP", ZKObj.ZKData.DKFZKDatas, products);
		}
		console.log("当前商品匹配到的有效折扣规则：", CurData);
		products = CalProduct(CurData, products);
	}
	return products;
}

export default {
	GetFZCX,
	GetMDCXHD,
	GetZKDatas,
	GetRXSPDatas,
	GetZKDatasAll,
	MatchZKDatas
}
