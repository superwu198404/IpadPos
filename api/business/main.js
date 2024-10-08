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
var GetFZCX = function(khid, hyid, func) {
	let cxArr = [];
	let sql = "SELECT cx1.CXZT, cx1.CXRY, cx2.bill, cx2.classid, sp.sname, '0' CZQTY, '0' BQTY, cx2.XX_NET1,cx2.XX_QTY4, cx2.MJ_DISC1, '' PRICE, '满' || cx2.XX_NET1 || '可售' || cx2.MJ_DISC1 || '%' describe \
				FROM  cxformd001 cx1 LEFT JOIN cxformd002 cx2  ON cx1.bill = cx2.bill AND cx1.khid = cx2.khid LEFT JOIN spda sp ON cx2.classid = sp.spid LEFT JOIN spkhda sk ON sp.spid = sk.spid AND cx1.KHID = sk.KHID \
				WHERE cx1.KHID = '" + khid +
		"'  AND cx1.Yn_Jslb = 'F' AND sp.PINYIN IS NOT NULL  AND sk.YN_XS = 'Y' AND sp.PRODUCT_TYPE IN ( 'Z001', 'Z004', 'Z005' ) and date(cx1.sdate)<=date('now') and date(cx1.edate)>=date('now') Order by cx1.CXZT";
	console.log("辅助促查询sql：", sql);
	db.get().executeQry(sql, "查询中...", res => {
		console.log("辅助促销主单查询结果：", res);
		let newArr = [],
			arr = [],
			arr1 = []; // JSON.parse(JSON.stringify(res.msg));
		if (hyid)
			arr = res.msg.filter(r1 => r1.CXRY == '2');
		arr1 = res.msg.filter(r1 => r1.CXRY != '2');
		newArr = [...arr, ...arr1];
		console.log("生效的辅助促销条件：" + khid + ",hyid：" + hyid);
		console.log("生效的辅助促销：", newArr);
		newArr.forEach((item, index) => {
			let cxobj = cxArr.find(r => {
				return r.BILL == item.BILL
			});
			if (!cxobj) { //没有才追加
				let obj = {
					BILL: item.BILL,
					CXZT: item.CXZT,
					Details: newArr.filter(r1 => {
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
var GetMDCXHD = function(billArr, func) {
	let str = "",
		pstr = "";
	if (Array.isArray(billArr) && billArr.length > 0) {
		billArr.map(r => {
			str += "'" + r + "',";
		})
		str = str.substr(0, str.length - 1);
		pstr = " and BILL in(" + str + ")";
	} else {
		if (billArr) {
			pstr = " and BILL like '%" + billArr + "%'";
		}
	}
	console.log("促销活动查询条件：", pstr);
	let sql =
		"select  CXZT,DATE(SDATE) \
             SDATE, DATE(EDATE) EDATE, CASE WHEN CXRY = 2 THEN '会员' END AS CXRY from cxformd001 where CXRY='2' and YN_JSLB!='F' and EDATE>=date('now') " +
		pstr +
		" union all \
              select CXZT,DATE(SDATE) \
             SDATE ,DATE(EDATE) EDATE, CASE WHEN CXRY = 1 THEN '所有顾客' ELSE '非会员' END AS CXRY  from cxformd001 where CXRY<>'2' and YN_JSLB!='F' and EDATE>=date('now') " +
		pstr + " ORDER  by CXRY , SDATE desc";
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
/**
 * 获取门店卡券促销
 * @param {门店id} khid 
 * @param {sale2} sale2 
 */
var GetCXDatasAll = async function(khid, func) {
	let day = new Date().getDay();
	// let spidArr = [];
	// if (sale2 && sale2.length > 0)
	// 	sale2.map(r => {
	// 		spidArr.push(r.SPID);
	// 	})
	// let spids = spidArr.join("','");
	let sql =
		"SELECT c3.SPID, c1.YN_JSLB, c1.CXZT, c2.* FROM CXFORMD001 c1 left join  CXFORMD002 c2 on c1.BIll=c2.BILL and c1.KHID=c2.KHID left join CXFORMD003 c3 on c1.BIll=c3.BILL and c1.KHID=c3.KHID\
			WHERE c1.BILL_STATUS = '1'  AND ( c1.YN_JSLB = 'N' OR c1.YN_JSLB = 'J' ) AND DATE(c1.SDATE) <= DATE('now')  AND DATE(c1.EDATE) >= DATE('now') AND c1.KHID = '" +
		khid + "' and c1.CX_WEEK like '%" + day + "%'";
	let data = [];
	await db.get().executeQry(sql, "查询中...", res => {
		console.log("门店卡券促销数据查询结果：", res);
		if (res.code && res.msg.length > 0) {
			data = res.msg;
		}
	}, err => {
		console.log("查询卡券促销数据异常：", err);
	})
	return data;
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
	console.log("[GetZKDatasAll]折扣数据:", obj);
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
					Net += Number((r2.OPRICE * r2.QTY).toFixed(2)); //r2.NET
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
					// arr4[0].ZKNET = ((1 - parseFloat(arr4[0].ZKQTY_JS)) * parseFloat(r3
					// 		.NET)).toFixed(1);
					arr4[0].ZKNET = common.newFixed((1 - parseFloat(arr4[0].ZKQTY_JS)) * parseFloat(r3.NET),
						1);
					zkData.push(arr4[0]);
				}
			} else {
				let arr2 = data.filter(r4 => {
					return (r4.ZKSTR == r3.SPJGZ && r4.MZNET <= r3.NET && r4
						.ZKTYPE == 'ZD02');
				});
				let arr3 = data.filter(r4 => {
					return (r4.ZKSTR == r3.SPJGZ && r4.MZNET <= r3.NET && r4
						.ZKTYPE == 'ZD03');
				});
				// let sortArr = arr2.sort((a, b) => {
				// 	return b - a
				// });
				if (arr2.length > 0) {
					// arr2[0].ZKNET = ((1 - parseFloat(arr2[0].ZKQTY_JS)) * parseFloat(r3
					// 	.NET)).toFixed(1);
					arr2[0].ZKNET = common.newFixed((1 - parseFloat(arr2[0].ZKQTY_JS)) * parseFloat(r3.NET),
						1);
					zkData.push(arr2[0]);
				}
				if (arr2.length > 0 && arr3.length > 0) { //临时生效必须要标准折扣满足最低生效金额
					// arr3[0].ZKNET = ((1 - parseFloat(arr3[0].ZKQTY_JS)) * parseFloat(r3
					// 	.NET)).toFixed(1);
					arr3[0].ZKNET = common.newFixed((1 - parseFloat(arr3[0].ZKQTY_JS)) * parseFloat(r3.NET),
						1);
					zkData.push(arr3[0]);
				}
			}
			console.log("当前商品价格组匹配到的折扣数据：", zkData);
		})
	}
	console.log("筛选后的折扣数据：", zkData);
	if (zkData.length == 0) {
		util.simpleMsg("暂无符合条件的折扣活动", "none");
	}
	return zkData;
}
//计算商品信息折扣信息
var CalProduct = function(curData, Product) {
	if (curData.length == 0) {
		Product.forEach(r => {
			r.NET = Number((r.OPRICE * r.QTY).toFixed(2));
			r.PRICE = Number((r.NET / r.QTY).toFixed(2));
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
				let zknet = Number(r.OPRICE * r.QTY * (1 - parseFloat(r2.ZKQTY_JS)));
				if (r2.ZKTYPE == 'ZD02') { //标准折扣
					// r.BZDISC = Number((r.OPRICE * r.QTY * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(
					// 	1)); //测试要求保留一位
					r.BZDISC = common.newFixed(zknet, 1);
					console.log("新规则返回的数据类型：", typeof(r.BZDISC));
					disc += r.BZDISC;
					console.log("商品信息：", r.OPRICE + "+" + r.QTY + "+" + (1 - parseFloat(r2
						.ZKQTY_JS)));
					console.log("当前标准折扣值：", r.BZDISC);
				} else if (r2.ZKTYPE == 'ZD03') { //临时折扣
					// r.LSDISC = Number((r.OPRICE * r.QTY * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(
					// 	1)); //测试要求保留一位
					r.LSDISC = common.newFixed(zknet, 1);
					disc += r.LSDISC;
					console.log("当前临时折扣值：", r.LSDISC);
				} else { //特批折扣
					// r.TPDISC = Number((r.OPRICE * r.QTY * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(
					// 	1)); //测试要求保留一位
					r.TPDISC = common.newFixed(zknet, 1);
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
//计算商品的促销
var MatchCXDatas = function(CXData, products, sale1) {
	console.log("MatchCXDatas-cxdata：", CXData);
	console.log("MatchCXDatas-pro：", products);
	let products1 = JSON.parse(JSON.stringify(products)); //deepCopy
	//商品合并
	let arr = [];
	products1.map(r => {
		if (arr.length == 0) {
			arr.push({
				...r
			});
		} else {
			let obj = arr.find(r1 => {
				return r1.SPID == r.SPID;
			});
			const index = arr.findIndex(r1 => {
				return r1.SPID == r.SPID;
			});
			if (!obj) { //不存在则追加r
				arr.push({
					...r
				});
			} else {
				arr[index].QTY = util.newFloat(obj.QTY + r.QTY, 2);
				arr[index].NET = util.newFloat(obj.NET + r.NET, 2);
			}
		}
	})
	console.log("促销合并后的商品信息1：", products1);
	console.log("促销合并后的商品信息：", arr);
	let cxfsArr = []; //促销跟踪数据
	let net_pri_disc_Arr = []; //生效的促销集合
	if (CXData && CXData.length > 0) {
		let matchCXArr = CXData.filter(r => {
			return arr.find(r1 => r1.SPID == r.SPID);
		});
		console.log("符合录入卡券商品的促销：", matchCXArr);
		let cx_net_Arr = []; //所有生效的促销单计算总价格
		matchCXArr.map(r => {
			let cxspArr = arr.filter(f => f.SPID == r.SPID);
			let t_net = 0;
			cxspArr.map(m => {
				t_net = util.newFloat(t_net + m.NET);
			})
			if (cx_net_Arr.length == 0)
				cx_net_Arr.push({
					BILL: r.BILL,
					NET: t_net,
					CXINFO: r
				})
			else {
				let i = cx_net_Arr.findIndex(f1 => f1.BILL == r.BILL);
				if (i >= 0) {
					cx_net_Arr[i].NET = util.newFloat(t_net + cx_net_Arr[i].NET);
				} else {
					cx_net_Arr.push({
						BILL: r.BILL,
						NET: t_net,
						CXINFO: r
					})
				}
			}
			// cx_net_Arr.map(m1 => {
			// 	if (m1.BILL == r.BILL)
			// 		m1.NET = util.newFloat(t_net + m1.NET);
			// 	else
			// 		cx_net_Arr.push({
			// 			BILL: r.BILL,
			// 			NET: t_net,
			// 			CXINFO: r
			// 		})
			// })
		})
		cx_net_Arr.map(r1 => {
			let r = r1.CXINFO;
			console.log("促销单项：", r1);
			if (r.YN_JSLB == 'J') { //阶梯计算促销
				for (var i = 4; i > 0; i--) {
					let xfnet = r["XX_NET" + i]; //满足金额
					if (!xfnet)
						continue;
					if (r.DISCTYPE == 2) //打折
					{
						let disc = r["MJ_DISC" + i];
						if (xfnet <= r1.NET) {
							let newNet = util.newFloat(r1.NET * Number(disc) / 100); //优惠后net
							// let newPrice = util.newFloat(newNet / r1.QTY); //优惠后单价
							// let newDisc = util.newFloat(r1.PRICE - newPrice); //折扣额
							let newDisc = util.newFloat(r1.NET - newNet); //折扣额
							net_pri_disc_Arr.push({
								newNet,
								// newPrice,
								newDisc,
								cxbill: r.BILL
								// spid: r1.SPID
							})
							break;
						}
					}
					if (r.DISCTYPE == 1) { //满减
						let _net = r["MJ_NET" + i];
						if (xfnet <= r1.NET) {
							let newNet = util.newFloat(r1.NET - Number(_net)); //优惠后net
							// let newPrice = util.newFloat(newNet / r1.QTY); //优惠后单价
							// let newDisc = util.newFloat(r1.PRICE - newPrice); //折扣额
							let newDisc = util.newFloat(r1.NET - newNet); //折扣额
							net_pri_disc_Arr.push({
								newNet,
								// newPrice,
								newDisc,
								cxbill: r.BILL,
								// spid: r1.SPID
							})
							break;
						}
					}
				}
			}
			if (r.YN_JSLB == 'N') { //普通计算
				let xfnet = r["XX_NET1"]; //满足金额
				if (r.DISCTYPE == 2) //打折
				{
					let disc = r["MJ_DISC1"];
					if (xfnet <= r1.NET) {
						let newNet = util.newFloat(r1.NET * Number(disc) / 100); //优惠后net
						// let newPrice = util.newFloat(newNet / r1.QTY); //优惠后单价
						// let newDisc = util.newFloat(r1.PRICE - newPrice); //折扣额
						let newDisc = util.newFloat(r1.NET - newNet); //折扣额
						net_pri_disc_Arr.push({
							newNet,
							// newPrice,
							newDisc,
							cxbill: r.BILL,
							// spid: r1.SPID
						})
					}
				}
				if (r.DISCTYPE == 1) { //满减
					let _net = r["MJ_NET1"];
					if (xfnet <= r1.NET) {
						let newNet = util.newFloat(r1.NET - Number(_net));
						// let newPrice = util.newFloat(newNet / r1.QTY);
						// let newDisc = util.newFloat(r1.PRICE - newPrice); //折扣额
						let newDisc = util.newFloat(r1.NET - newNet); //折扣额
						net_pri_disc_Arr.push({
							newNet,
							// newPrice,
							newDisc,
							cxbill: r.BILL,
							// spid: r1.SPID
						})
					}
				}
			}
		})
		console.log("单组促销计算后的促销结果(集合)：", net_pri_disc_Arr);
		// })
		//计算最优促销
		if (net_pri_disc_Arr && net_pri_disc_Arr.length > 0) {
			//折扣额降序
			let sortArr = net_pri_disc_Arr.sort((r, r1) => r1.newDisc - r.newDisc); //最优惠促销
			let cxArr = matchCXArr.filter(r => r.BILL == sortArr[0].cxbill); //找到生效的商品
			console.log("最优促销的商品信息：", cxArr)
			let spArr = products1.filter(r => {
				return cxArr.find(f => f.SPID == r.SPID)
			}); //生效促销的商品行数
			console.log("生效促销的商品行:", spArr);
			let total_disc = 0,
				len = 0;
			cxArr.map(m => {
				//折扣分摊
				products1.map((r, i, arr1) => {
					if (r.SPID == m.SPID) {
						len += 1;
						// console.log("商品折扣额平摊len：", len);
						//每种商品的占比
						let rate = util.newFloat(sortArr[0].newNet / (sortArr[0].newNet + sortArr[0]
							.newDisc));
						// console.log("商品折扣额平摊rate：", rate);
						let s_net = util.newFloat(r.NET * rate); //单行商品的折扣值
						let s_disc = util.newFloat(r.NET - s_net);
						// console.log("商品折扣额平摊s_disc：", s_disc);
						if (len == spArr.length) { //如果是最后一个
							s_disc = util.newFloat(sortArr[0].newDisc - total_disc);
							// console.log("商品折扣额平摊s_disc1：", s_disc);
						}
						r.NET = util.newFloat(r.NET - s_disc);
						r.PRICE = util.newFloat(r.NET / r.QTY);
						r.CXDISC = util.newFloat(s_disc);
						r.DISCRATE = util.newFloat(s_disc);
						r.YN_CXDISC = s_disc > 0 ? 'Y' : 'N';
						total_disc = util.newFloat(total_disc + s_disc);
						// console.log("商品折扣额平摊total_disc：", total_disc);
					}
				})
			})
			console.log("促销折扣分摊后商品：", products1);
			products1.map(m => {
				if (m.CXDISC > 0) {
					// console.log("促销跟踪cxfsArr：", cxfsArr);
					if (cxfsArr.length == 0) {
						cxfsArr.push({
							XSBILL: sale1.BILL,
							KHID: sale1.KHID,
							GSID: sale1.GSID,
							SALEDATE: sale1.SALEDATE,
							CXBILL: sortArr[0].cxbill,
							CLASSID: m.SPID,
							SPID: m.SPID,
							XSQTY: m.QTY,
							OPRICE: m.OPRICE,
							ONET: util.newFloat(m.OPRICE * m.QTY),
							CXPRICE: m.PRICE,
							CXNET: m.NET,
							CXLV: 1,
							NO: cxfsArr.length + 1
						})
					} else {
						// console.log("促销跟踪cxfsArr1：", cxfsArr);
						let index = cxfsArr.findIndex(m2 => m2.SPID == m.SPID);
						if (index >= 0) {
							cxfsArr[index].XSQTY = cxfsArr[index].XSQTY + m.QTY;
							cxfsArr[index].ONET = util.newFloat(cxfsArr[index].ONET + m.OPRICE * m.QTY);
							cxfsArr[index].CXNET = cxfsArr[index].CXNET + m.NET;
						} else {
							cxfsArr.push({
								XSBILL: sale1.BILL,
								KHID: sale1.KHID,
								GSID: sale1.GSID,
								SALEDATE: sale1.SALEDATE,
								CXBILL: sortArr[0].cxbill,
								CLASSID: m.SPID,
								SPID: m.SPID,
								XSQTY: m.QTY,
								OPRICE: m.OPRICE,
								ONET: util.newFloat(m.OPRICE * m.QTY),
								CXPRICE: m.PRICE,
								CXNET: m.NET,
								CXLV: 1,
								NO: cxfsArr.length + 1
							})
						}
					}

				}
			})
			console.log("促销跟踪数据：", cxfsArr);
		}
	}
	let obj = {
		sale2: products1,
		cxfsArr
	}
	console.log("计算促销后的商品：", obj);
	return obj;
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
	let obj = {
		sale2: products,
		zkrule: CurData
	}
	return obj;
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
var GetFZCXNew = async function(arr, sale1, sale2, spPrice) {
	let billStr = "";
	if (arr.length > 0) {
		arr.forEach(r => {
			billStr += "'" + r.BILL + "',";
		})
		billStr = billStr.substr(0, billStr.length - 1);
		let hasBill = []; //用来存储加购商品是否存在于促销活动限制商品中的促销活动单号
		let sql = "select * from CXFORMD003 where bill in(" + billStr + ") and KHID='" + sale1.KHID + "'";
		await db.get().executeQry(sql, "", res => {
			console.log("筛选sql:", sql);
			console.log("筛选结果:", res);
			let xzSPArr = res.msg; //所有生效的辅助促销活动限制商品集合
			if (xzSPArr.length > 0) {
				sale2.forEach(r1 => {
					let arr1 = xzSPArr.filter(r2 => {
						return r2.SPID == r1.SPID;
					});
					if (arr1.length > 0) {
						arr1.map(r3 => {
							if (hasBill.indexOf(r3.BILL) < 0) {
								hasBill.push(r3.BILL);
							}
						})
					}
					console.log("筛选出来的含有限制商品的辅助促销活动单号：", hasBill);
				})
			}
		}, err => {});
		console.log("筛选后准备去重：", hasBill);
		if (hasBill.length > 0) {
			arr = arr.filter(r4 => {
				return hasBill.indexOf(r4.BILL) < 0;
			})
			console.log("筛选去重后的促销活动：", arr);
		}
		arr.forEach(r => {
			r.Details.forEach(r1 => {
				let qty = Math.floor((sale1.TNET || 0) / r1.XX_NET1);
				if (r1.XX_QTY4 && r1.XX_QTY4 < qty) { // 处理赠品上限
					qty = r1.XX_QTY4;
				}
				r1.CZQTY = qty; // Math.floor((sale1.TNET || 0) / r1.XX_NET1);
				let price = spPrice[r1.CLASSID]?.PRICE || 0;
				r1.PRICE = price;
				r1.DESCRIBE = "满" + r1.XX_NET1 + "可售" + (price * (r1.MJ_DISC1 || 0) / 100);
			})
		})
		console.log("参数检测2：", arr);
	}
	return arr;
}
//计算辅助促销价格
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
	obj.CXPRICE = cxobj.cxprice;
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
	let Arr = [];
	let arr = sale2_arr.filter(r => {
		return r.NET > 0
	});
	let arr1 = sale2_arr.filter(r => {
		return r.NET == 0
	});
	//售价不为0的才参与分摊 排除辅助促销赠送的商品
	arr.forEach(function(item, index, arr) {
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
		item.NET = Number((item.NET - SKYDISCOUNT).toFixed(2));
		item.PRICE = Number((item.NET / item.QTY).toFixed(2));
		item.DISCRATE = Number((item.DISCRATE + SKYDISCOUNT).toFixed(2));
		item.CXDISC = Number((item.CXDISC + SKYDISCOUNT).toFixed(2));
		item.YN_SKYDISC = SKYDISCOUNT > 0 ? "Y" : "N"; //是否有手工折扣
		// item.DISC = Number((item.DISC + SKYDISCOUNT).toFixed(2));  //22.10.28 应wy要求不累加手工折扣的值，reason不详！
	});
	Arr = arr.concat(arr1);
	console.log("排除售价为0的商品分摊集合：", Arr);
	return Arr;
}

//生成促销跟踪表执行sql
var CXMDFS = function(sale1, cxfsArr, fzcxArr, yncx, ynfzcx) {
	console.log("促销跟踪数据的数量：", cxfsArr.length);
	let arr = [];
	//允许辅助促销的情况下
	if (ynfzcx && fzcxArr && fzcxArr.length > 0) {
		fzcxArr.map(r => {
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
	//允许促销的情况下
	if (yncx && cxfsArr && cxfsArr.length > 0) {
		cxfsArr.map(r => {
			let obj = {
				SALEDATE: sale1.SALEDATE,
				KHID: sale1.KHID,
				GSID: sale1.GSID,
				CXBILL: r.CXBILL,
				CLASSID: r.CLASSID,
				XSBILL: sale1.BILL,
				SPID: r.SPID, //.substr(r.CXBILL.length),
				XSQTY: r.XSQTY,
				OPRICE: r.OPRICE,
				ONET: r.ONET,
				CXPRICE: r.CXPRICE,
				CXNET: r.CXNET,
				CXLV: r.CXLV,
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
	return sqlObj.oracleArr; //sql 集合
}
var GetUnLoad1 = function(func) {
	let sql = "SELECT p.BILL,s1.* from POS_TXFILE p left join sale001 s1 on p.BILL=s1.BILL ";
	db.get().executeQry(sql, "", res => {
		console.log("查出未上传的数据：", res);
		if (res.code) {
			if (func)
				func(res);
		} else {
			util.simpleMsg("暂无数据", true);
		}
	}, err => {})
}
var GetUnLoad = function(func) {
	let sql = "SELECT * from POS_TXFILE";
	db.get().executeQry(sql, "查询中...", res => {
		console.log("查出未上传的数据：", res);
		if (func)
			func(res);
	}, err => {})
}

//获取销售单
var GetPTOrder = function(khid, p_bill, p_date, type, func) {
	//不是外卖单
	if (type != 0) {
		GetPTOrder1(khid, p_bill, p_date, type, func);
	} else {
		//是外卖单
		GetPTOrder2(khid, p_bill, p_date, type, func);
	}
}

var GetPTOrder1 = async function(khid, p_bill, p_date, type, func) {
	let str = "";
	str += p_bill ? " and BILL like '%" + p_bill + "%'" : "";
	str += khid ? " and KHID='" + khid + "'" : "";
	str += p_date ? " and date(SALEDATE) >=date('" + p_date + "')" : " and date(SALEDATE) = date('now')";
	if (type == 0) {
		str += " and BILL_TYPE != 'Z111' and XSTYPE ='" + type + "'";
	} else if (type != -1 && type != 99) {
		str += type ? " and BILL_TYPE != 'Z111' and XSTYPE ='" + type + "'" : "";
	} else if (type == 99) {
		str += " and BILL_TYPE = 'Z111'";
	}
	let sql = "SELECT * from SALE001 where 1=1" + str;
	console.log("查询条件：", sql);
	db.get().executeQry(sql, "查询中...", res => {
		console.log("查出的销售单数据：", res);
		if (func)
			func(res);
	}, err => {
		console.log("查询错误：", err);
	})
}

var GetPTOrder2 = async function(khid, p_bill, p_date, type, func) {
	let str = "";
	str += p_bill ? " and BILL like '%" + p_bill + "%'" : "";
	str += khid ? " and KHID='" + khid + "'" : "";
	str += p_date ? " and SALEDATE >=to_date('" + p_date + "','yyyy-mm-dd')" : " and SALEDATE = TRUNC(sysdate)";
	str += " and BILL_TYPE in ('Z102','Z152') ";
	let sql = "SELECT * from jk_syssale001 where 1=1 " + str;
	console.log("查询条件：", sql);
	try {
		common.WebDBQuery(sql, async res => {
			var resp = {};
			resp.code = res.code;
			var data = JSON.parse(res.data || "");
			if (res.code && data.length > 0) {
				//查询打印记录
				let printData = await getPOS_XSBILLPRINT();
				if (printData.code && printData.msg.length > 0) {
					// console.warn("resp data======", data);
					let data_new = data.filter(item1 => {
						return printData.msg.find(item2 => {
							return item1.BILL === item2.XSBILL
						})
					});
					// console.warn("resp data new======", data_new);
					resp.msg = data_new;
				} else {
					resp.msg = [];
				}
				if (func)
					func(resp);
			} else {
				resp.msg = [];
				if (func)
					func(resp);
			}
		});
	} catch (e) {
		console.log("获取jk_syssale001失败:", e);
	}
}

/**
 * 查询打印记录
 */
const getPOS_XSBILLPRINT = async () => {
	let arr = {};
	arr.code = false;
	arr.msg = [];
	let execSql_arr = "SELECT * from POS_XSBILLPRINT";
	await db.get().executeQry(execSql_arr, "执行中", function(res) {
		// console.log("POS_XSBILLPRINT sql执行结果：", res);
		arr.code = true;
		arr.msg = res.msg;
	}, function(err) {
		console.log("POS_XSBILLPRINT sql执行失败：", err);
	});
	return arr;
}

var ManualDiscountAlter = function(sale1, sale2_arr) {
	console.log("[ManualDiscount]ManualDiscount:", {
		sale1,
		sale2: sale2_arr
	});
	let curDis = 0;
	let Arr = [];
	let arr = sale2_arr.filter(r => {
		return r.NET > 0
	});
	let arr1 = sale2_arr.filter(r => {
		return r.NET == 0
	});
	//售价不为0的才参与分摊 排除辅助促销赠送的商品
	arr.forEach(function(item, index, arr) {
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
		item.PRICE = Number((item.NET / item.QTY).toFixed(2));
		item.DISCRATE = Number((item.DISCRATE + SKYDISCOUNT).toFixed(2));
		item.CXDISC = Number((item.CXDISC + SKYDISCOUNT).toFixed(2));
		item.YN_SKYDISC = SKYDISCOUNT > 0 ? "Y" : "N"; //是否有手工折扣
	});
	Arr = arr.concat(arr1);
	console.log("排除售价为0的商品分摊集合：", Arr);
	return Arr;
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
	CXMDFS,
	GetUnLoad,
	GetPTOrder,
	ManualDiscountAlter,
	GetCXDatasAll,
	MatchCXDatas
}