import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import dateformat from '@/utils/dateformat.js';

var app = getApp();

/**
 * 获取辅助促销信息 废弃
 * @param {} khid 
 */
var _GetFZCX = function(khid, func) {
	//Yn_Jslb='D' //测试使用 正式使用 F
	let cxArr = [];
	let sql = "select BILL,CXZT from cxformd001 cx where cx.Yn_Jslb='F' order by CXZT";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("辅助促销主单查询结果：", res);
		if (res.code && res.msg.length > 0) {
			res.msg.forEach((item, index) => {
				sql = "select cx2.bill, cx2.classid, sp.sname, '' CZQTY, '' BQTY, cx2.XX_NET1, cx2.MJ_DISC1, '' PRICE , '满'||cx2.XX_NET1||'可售'||cx2.MJ_DISC1||'%' describe \
                 from cxformd002 cx2, spda sp, spkhda sk  where  cx2.bill='" + item.BILL +
					"' and cx2.classid=sp.spid  and sp.spid=sk.spid  and  sp.PINYIN IS NOT NULL \
                 AND  sk.YN_XS='Y' AND  sp.PRODUCT_TYPE IN ( 'Z001','Z004','Z005') AND  sp.PINYIN IS NOT NULL  AND  sk.KHID ='" +
					khid + "'";
				db.get().executeQry(sql, "查询中...", res1 => {
					console.log("当前单详情：", res1);
					let obj = {
						BILL: item.BILL,
						CXZT: item.CXZT,
						Details: res1.msg
					};
					cxArr.push(obj);
				}, err1 => {
					console.log("查询辅助促销异常：", err1);
				});
			})
			if (func) func(cxArr);
		}
	}, err => {
		console.log("查询促销异常：", err);
		if (func) func([]);
	})
	// console.log("辅助促销详情：", cxArr);
	// return cxArr;
}
/**
 * 获取辅助促销信息
 * @param {} khid 
 */
var GetFZCX = function(khid, func) {
	let cxArr = [];
	let sql = "SELECT cx1.CXZT, cx2.bill, cx2.classid, sp.sname, '0' CZQTY, '0' BQTY, cx2.XX_NET1, cx2.MJ_DISC1, '' PRICE, '满' || cx2.XX_NET1 || '可售' || cx2.MJ_DISC1 || '%' describe \
				FROM  cxformd001 cx1 LEFT JOIN cxformd002 cx2  ON cx1.bill = cx2.bill AND cx1.khid = cx2.khid LEFT JOIN spda sp ON cx2.classid = sp.spid LEFT JOIN spkhda sk ON sp.spid = sk.spid AND cx1.KHID = sk.KHID \
				WHERE cx1.KHID = '" + khid +
		"'  AND cx1.Yn_Jslb = 'F' AND sp.PINYIN IS NOT NULL  AND sk.YN_XS = 'Y' AND sp.PRODUCT_TYPE IN ( 'Z001', 'Z004', 'Z005' )  AND sp.PINYIN IS NOT NULL Order by cx1.CXZT";
	console.log("辅助促查询sql：", cxArr);
	db.get().executeQry(sql, "查询中...", res => {
		console.log("辅助促销主单查询结果：", res);
		res.msg.forEach((item, index) => {
			let cxobj = cxArr.find(r => {
				return r.BILL == item.BILL
			});
			if (!cxobj) { //没有才追加
				let obj = {
					BILL: item.BILL,
					CXZT: item.CXZT,
					Details: res.msg.filter(r1 => {
						return r1.BILL == item.BILL
					})
				};
				cxArr.push(obj);
			}
		})
		console.log("辅助促销分组数据：", cxArr);
		if (func) func(cxArr);
	}, err => {
		console.log("查询辅助促销异常：", err);
		if (func) func([]);
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
			.dqid + "' AND ifnull( DELBZ,'#') <>'X'   AND DATE(SDATE) <=DATE('" + dateformat
			.getYMD() +
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
				if (arr2.length > 0 && arr3.length > 0) { //临时生效必须要标准折扣满足最低生效金额
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
	if (zkData.length == 0) {
		util.simpleMsg("暂无符合条件的特殊折扣", true);
	}
	return zkData;
}
//计算商品信息折扣信息
var CalProduct = function(curData, Product) {
	if (curData.length == 0) {
		Product.forEach(r => {
			r.BZDISC = 0;
			r.LSDISC = 0;
			r.TPDISC = 0;
			r.DISCRATE = 0;
		})
	} else {
		Product.forEach(r => {
			let discArr = [],
				discObj = {},
				DiscNet = 0;
			let arr = curData.filter(r1 => {
				return r1.ZKSTR == r.SPJGZ
			})
			let disc = 0;
			arr.forEach(r2 => {
				if (r2.ZKTYPE == 'ZD02') { //标准折扣
					r.BZDISC = Number((r.OPRICE * r.QTY * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(
						2));
					// r.DISCRATE = (r.$DISCRATE || 0) + parseFloat(r.BZDISC);
					// r.DISCRATE += parseFloat(r.BZDISC);
					disc += r.BZDISC;
					console.log("当前标准折扣值：", r.BZDISC);
				} else if (r2.ZKTYPE == 'ZD03') { //临时折扣
					r.LSDISC = Number((r.OPRICE * r.QTY * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(
						2));
					// r.DISCRATE = (r.$DISCRATE || 0) + parseFloat(r.LSDISC);
					// r.DISCRATE += parseFloat(r.LSDISC);
					disc += r.LSDISC;
					console.log("当前临时折扣值：", r.LSDISC);
				} else { //特批折扣
					r.TPDISC = Number((r.OPRICE * r.QTY * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(
						2));
					// r.DISCRATE = (r.$DISCRATE || 0) + parseFloat(r.TPDISC);
					// r.DISCRATE = parseFloat(r.TPDISC);
					disc += r.TPDISC;
					console.log("当前特批折扣值：", r.TPDISC);
				}
				console.log("[CalProduct]Sale-Item:", r2);
			})
			console.log("当前总折扣值：", disc);
			r.DISCRATE = Number(disc.toFixed(2));
			r.NET = Number((r.OPRICE * r.QTY - r.DISCRATE).toFixed(2));
			r.PRICE = Number((r.NET / r.QTY).toFixed(2));
		});
	}
	console.log("添加折扣后的商品数据：", Product);
	return Product;
}

//匹配商品的有效规则 包含标准临时和特批
var MatchZKDatas = function(ZKObj, products) {
	console.log("计算商品折扣传入的折扣数据：", ZKObj);
	console.log("计算商品折扣传入的商品信息：", products);
	let CurData;
	if (ZKObj && ZKObj.ZKData && ZKObj.ZKType) {
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
var getPrice = async function(spid, dqid, khzid) {
	let price = 0;
	let sql = "SELECT PRICE / (CASE UQTY \
	                   WHEN 0 THEN \
	                    1 \
	                   else \
	                    UQTY \
	                 end) price, \
	                 PRICETYPE, \
	                 khzid, \
	                 dqid \
	                 FROM PRICDA \
	             WHERE DATE(SDATE) <= DATE('" + dateformat.getYMD() + "') \
	             AND DATE(EDATE) >= DATE('" + dateformat.getYMD() + "') \
	             and (dqid is null or dqid = '" + dqid + "') \
	             and (khzid is null or khzid = '" + khzid + "') \
	             and  QYSTAT  ='1' \
	             AND (SPID = '" + spid + "' OR \
	                  SPID IN (select TM.spid \
	                             from sptmda tm \
	                            where tm.yn_main = 'Y' \
	                              and tm.BARCODE = '" + spid + "')) \
	           ORDER BY PRICETYPE DESC";
	await db.get().executeQry(sql, "", res => {
		console.log("查出的商品价格：", res);
		price = res.msg[0].price;
	}, err => {})
	return price;
}

var GetFZCXNew = function(arr, sale1, spPrice) {
	// let spArr = "";
	// if (arr.length > 0) {
	// 	arr.forEach(r => {
	// 		r.Details.forEach(async r1 => {
	// 			spArr += "'" + r.CLASSID + "',";
	// 		})
	// 	})
	// 	spArr = spArr.substr(0, spArr.length - 1);
	// 	let priceArr = await getPrice(spArr, dqid, khzid);
	// console.log("商品集合：", spArr);
	// console.log("商品价格集合：", priceArr);
	// return;
	// console.log("新促销传入的数据：", arr);
	// console.log("新促销传入的数据1：", sale1);
	// console.log("新促销传入的数据2：", spPrice);
	arr.forEach(r => {
		r.Details.forEach(r1 => {
			r1.CZQTY = Math.floor((sale1.TNET || 0) / r1.XX_NET1);
			let price = spPrice[r1.CLASSID].PRICE;
			r1.PRICE = price;
			r1.DESCRIBE = "满" + r1.XX_NET1 + "可售" + (price * (r1.MJ_DISC1 || 0) / 100);
		})
	})
	return arr;
}
//计算促销价格
var CalFZCX = function(fzcxArr, sale1) {
	let yjnet = 0,
		tsnum = 0,
		sparr = [],
		syjsnet = sale1.TNET,
		khid = sale1.KHID,
		gsid = sale1.GSID;
	///开始计算了
	fzcxArr.forEach((r, i) => {
		tsnum += Number(r.BQTY);
		let Onexxnum = r.XX_NET1 || 0; //下限金额
		let cxbill = r.BILL || ""; //单号
		let price = r.PRICE || 0; //单价
		let qty = r.BQTY || 0; //数量
		let MJ_DISC1 = r.MJ_DISC1 || 0; //折扣率
		let spid = r.CLASSID || ""; //商品ID
		if (syjsnet >= Onexxnum) {

			//进行折扣计算
			if (syjsnet / Onexxnum >= qty) {
				let cxprice = Number(parseFloat(price * (MJ_DISC1 / 100)).toFixed(2));
				// console.log("精度计算1", cxprice);
				let obj = {};
				obj.cxbill = cxbill;
				obj.spid = spid;
				obj.qty = qty;
				obj.price = price;
				obj.cxprice = cxprice;
				obj.zprice = cxprice * qty;
				obj.i = i;
				obj.storeid = khid;
				obj.gsid = gsid;
				sparr.push(addfzcxdtinfo(obj));
				syjsnet = syjsnet - Onexxnum * qty;
				let all1 = Number(parseFloat(cxprice * qty).toFixed(2))
				yjnet = Number(parseFloat(yjnet + all1).toFixed(2));
				console.log("进入了计算1：", cxprice + "，" + qty);
			} else {
				let cxprice = Number(parseFloat(price * (MJ_DISC1 / 100)).toFixed(2));
				let cxnet = cxprice * Math.floor(syjsnet / Onexxnum);
				//超出数量的价格计算
				let synet = Number(parseFloat((qty - Math.floor(syjsnet / Onexxnum)) * price)
					.toFixed(2));
				// addfzcxdtinfo(cxbill, spid, qty, price, cxprice, synet + cxnet, i);
				let obj = {};
				obj.cxbill = cxbill;
				obj.spid = spid;
				obj.qty = qty;
				obj.price = price;
				obj.cxprice = cxprice;
				obj.zprice = synet + cxnet;
				obj.i = i;
				obj.storeid = khid;
				obj.gsid = gsid;
				sparr.push(addfzcxdtinfo(obj));
				syjsnet = syjsnet - Math.floor(syjsnet / Onexxnum) * Onexxnum;
				let all = Number(parseFloat(synet + cxnet).toFixed(2))
				yjnet = Number(parseFloat(yjnet + all).toFixed(2));
				console.log("进入了计算2：", yjnet);
			}
		} else {
			//进行单价计算
			//jsnet
			// addfzcxdtinfo(cxbill, spid, qty, price, price, price * qty, i);
			let obj = {};
			obj.cxbill = cxbill;
			obj.spid = spid;
			obj.qty = qty;
			obj.price = price;
			obj.cxprice = price;
			obj.zprice = Number(parseFloat(price * qty).toFixed(2));
			obj.i = i;
			obj.storeid = khid;
			obj.gsid = gsid;
			sparr.push(addfzcxdtinfo(obj));
			let all2 = Number(parseFloat(price * qty).toFixed(2));
			yjnet = Number(parseFloat(yjnet + all2).toFixed(2));
			console.log("进入了计算3：", price + "，" + qty);
		}
	})
	// jsnet = yjnet;
	let text = "已添加" + tsnum + "个特殊商品预计额外支付：" + yjnet + "元";
	return {
		msg: text,
		count: tsnum,
		payAmount: yjnet,
		data: sparr
	}
}
//整理辅助促销商品
var addfzcxdtinfo = function(cxobj) {
	let obj = {};
	obj.SALEDATE = "";
	obj.KHID = cxobj.storeid;
	obj.GSID = cxobj.gsid;
	obj.CXBILL = cxobj.cxbill;
	obj.CLASSID = cxobj.spid;
	obj.XSBILL = "";
	obj.SPID = cxobj.spid;
	obj.XSQTY = cxobj.qty;
	obj.OPRICE = cxobj.price;
	obj.ONET = cxobj.price * cxobj.qty;
	obj.CXPRICE = cxobj.MJ_DISC1;
	obj.CXNET = cxobj.zprice;
	obj.CXLV = "1";
	obj.LCM = "";
	obj.NO = cxobj.i;
	return obj;
}
//查找辅助商品的完整信息
var FindSP = function(spArr, spid) {
	let spObj;
	if (spArr.length > 0) {
		for (var i = 0; i < spArr.length; i++) {
			spObj = spArr[i].plarr.find(r1 => {
				return r1.SPID == spid
			})
			if (spObj && Object.keys(spObj).length > 0) {
				break;
			}
		}
	}
	return spObj;
}
//创建sale2商品
var CreateSale2 = function(fzcxobj, sale1, spobj, NO) {
	let obj = {};
	obj.SALEDATE = sale1.SALEDATE;
	obj.SPJGZ = spobj.SPJGZ;
	obj.BMID = sale1.BMID;
	obj.RYID = sale1.RYID;
	obj.KCDID = sale1.KCDID;
	obj.DPID = sale1.DPID;
	obj.GCID = sale1.GCID;
	obj.TIME = sale1.TIME;
	obj.WEEK = sale1.WEEK;
	obj.MONTH = sale1.MONTH;
	obj.YAER = sale1.YAER;
	obj.YN_HYDISC = 'N';
	obj.CXDISC = fzcxobj.ONET - fzcxobj.CXNET; //CXNET 为应付金额  单价10 五个商品两个可赠 那就是 10*3 折扣为10*2
	obj.YN_CXDISC = 'F';
	obj.BILLDISC = 0;
	obj.DISC = 0;
	obj.YN_SKYDISC = 'N';
	obj.HYBL = 0;
	obj.DISCRATE = fzcxobj.ONET - fzcxobj.CXNET;
	obj.NET = fzcxobj.CXNET;
	obj.OPRICE = fzcxobj.OPRICE;
	obj.PRICE = (Number(fzcxobj.CXNET / fzcxobj.XSQTY)).toFixed(2);
	obj.QTY = fzcxobj.XSQTY;
	obj.UNIT = spobj.UNIT;
	obj.BARCODE = spobj.SPID; //(spobj无BARCODE)
	obj.PLID = spobj.SPID.substr(8, 5); //调整为记录小类
	obj.NO = NO;
	obj.SPID = spobj.SPID;
	obj.BILL = sale1.BILL;
	obj.POSID = sale1.POSID;
	obj.KHID = sale1.KHID;
	obj.SALETIME = sale1.SALETIME;
	obj.STR1 = spobj.SNAME;
	return obj;
}

/**
 * 手工折扣分摊 (pos 是默认将总的手工折扣 记录在第一个商品上)
 * @param {*} sale1 
 * @param {*} sale2_arr 
 */
var ManualDiscount = function(sale1, sale2_arr) {
	console.log("[ManualDiscount]ManualDiscount:", {
		sale1,
		sale2: sale2_arr
	});
	let curDis = 0;
	sale2_arr.forEach(function(item, index, arr) {
		if (!sale1.ROUND) return; //round 为 0 就不进行分摊
		let high = Number(parseFloat(item.NET / (sale1.TNET + sale1.ROUND) * sale1.ROUND).toFixed(
			2));
		console.log("[ManualDiscount]ManualDiscount:", high);
		let SKYDISCOUNT = high;
		curDis += high;
		if (index == arr.length - 1) {
			let dif = Number(parseFloat((sale1.ROUND - curDis).toFixed(2))); //实际的差值
			SKYDISCOUNT += dif;
		}
		item.NET = Number(item.NET) - SKYDISCOUNT;
		item.PRICE = Number(item.NET / item.QTY).toFixed(2);
		item.DISCRATE = Number(item.DISCRATE) + SKYDISCOUNT;
		item.YN_SKYDISC = SKYDISCOUNT > 0 ? "Y" : "N"; //是否有手工折扣
		item.DISC = Number(item.DISC) + SKYDISCOUNT;
	});
	return sale2_arr;
}

//生成促销跟踪表执行sql
var CXMDFS = function(sale1, sale2, cxarr) {
	let arr = [];
	if (cxarr && cxarr.length > 0) {
		cxarr.map(r => {
			let obj = {
				SALEDATE: sale1.SALEDATE,
				KHID: sale1.KHID,
				GSID: sale1.GSID,
				CXBILL: r.CXBILL,
				CLASSID: r.CLASSID,
				XSBILL: sale1.BILL,
				SPID: r.SPID,
				XSQTY: r.XSQTY,
				OPRICE: r.OPRICE,
				ONET: r.ONET,
				CXPRICE: r.CXPRICE,
				CXNET: r.CXNET,
				CXLV: "",
				// LCM: "",
				NO: r.NO
			};
			arr.push(obj);
		})
	}
	console.log("新组装的促销跟踪数据：", arr);
	if (arr.length <= 0) {
		return [];
	}
	let sqlObj = common.CreateSQL(arr, "CXMDFSMX");
	return sqlObj.oracle_arr; //sql 集合
}

export default {
	GetFZCX,
	GetMDCXHD,
	GetZKDatas,
	GetRXSPDatas,
	GetZKDatasAll,
	MatchZKDatas,
	GetFZCXNew,
	CalFZCX,
	FindSP,
	CreateSale2,
	ManualDiscount,
	CXMDFS
}
