import util from '@/utils/util.js';
import getCxSql_db from '@/utils/cx/getCxSql.js'
import cx_util from '@/utils/cx/cx_common.js';

//为选择提供依据
let cxSelectTip = [];
//保存促销阵列的dt
let cxbilldts = [];
//保存促销发生的dt
let cxfsdt = [];
//保存促销的集合
let cxdict = new Map();
//促销主单
let dscxm = [];
//促销规则
let dscxclass = [];
//促销内容对应的产品
let dscxsp = [];
//促销赠券
let dszqda = [];

//用来存储消费时，用于积分兑换时的信息
let jfinfo = {};
//添加标识是否有录入会员
let isHy = false;
//销售类型
let is_Xstype = null;

//是否是整店促销
let yn_zdcx = false;
let zdcxbill = "";
let zdcxsubno = "";

//存储CRM返回会员信息的类
let hymen = {};
//某一行产品计算后 剩余可以计算促销的数量
let sysl = "SYSL";
//某一行产品原有的数量
let yysl = "YYSL";
let rowid = "ROWID";
let KnCxbill = "BILL";
//某一个促销单发生促销的数量
let fscs = "FSCS";
// 促销主题
let cxzt = "CXZT";
//原始售价字段
let oprice = "OPRICE";
//促销后的折扣金额
let disc = "DISC";
//积分
let jfnum = "jfnum";
//保存已经发生的促销
let fsdcx = new Array();

//从数据库中取出所有的促销信息，然后创建促销信息 创建缓存表格
const Cxdict = async () => {
	console.log("有进入初始化方法Cxdict")
	let storeDqid = getApp().globalData.store.DQID;
	let dateTime = cx_util.getTime(0);
	let storeid = getApp().globalData.store.KHID;
	let gsid = getApp().globalData.store.GSID;

	//初始化，全局变量先清除
	cxfsdt = [];
	cxSelectTip = [];
	cxbilldts = [];

	cxdict = new Map();
	dscxm = [];
	dscxclass = [];
	dscxsp = [];
	dszqda = [];

	//获取主单的Sql
	dscxm = await getCxSql_db.getCxmSql(storeDqid, dateTime, storeid);
	//console.log("dscxm集合：", dscxm);

	//促销规则Sql
	dscxclass = await getCxSql_db.cxClassSql(storeid, dateTime);
	//console.log("dscxclass集合：", dscxclass);

	//促销内容对应的产品Sql
	dscxsp = await getCxSql_db.cxSPsql(storeid, dateTime);
	//console.log("dscxsp集合：", dscxsp);

	//促销赠券
	dszqda = await getCxSql_db.cxZqSql(gsid, storeid, dateTime);
	//console.log("dszqda集合：", dszqda);

	//循环主单数据处理
	if (dscxm.length < 1) {
		console.log("没有生效的促销单：", dscxm.length);
		return;
	}

	for (let i = 0; i < dscxm.length; i++) {
		try {
			let CXWeek = cx_util.snvl(dscxm[i].CX_WEEK, null);
			//当前日是否有促销
			if (CXWeek == null) {
				continue;
			}
			//获取是星期几
			let x = cx_util.getTime(10);
			if (x == 0) {
				x = 7;
			}
			if (CXWeek.indexOf(x.toString()) < 0) {
				continue;
			}

			//添加促销主单信息
			let bill = cx_util.snvl(dscxm[i].BILL, null);
			let ZT = cx_util.snvl(dscxm[i].CXZT, null);
			let YNZD = cx_util.snvl(dscxm[i].YN_ZD, "N");
			let YNJSLB = cx_util.snvl(dscxm[i].YN_JSLB, "N");
			let rytype = cx_util.snvl(dscxm[i].CXRY, 1);
			let yn_time = cx_util.snvl(dscxm[i].YN_TIME, "N");
			let CxSaleStr = cx_util.snvl(dscxm[i].HYLV, 0);
			let nfktype = cx_util.snvl(dscxm[i].NOTFKID, "");
			let cxjfup = cx_util.snvl(dscxm[i].JFSX, 0);

			let intrytype = parseInt(rytype);
			if (bill == null) {
				continue;
			}
			var C1 = new Object();
			C1.CxBill = bill;
			C1.CxZt = ZT;
			C1.ynzd = cx_util.ynToBool(YNZD);
			C1.YN_JSLB = cx_util.ynToBool(YNJSLB);
			C1.cxtype = YNJSLB;
			C1.upleave = cxjfup;
			C1.OneSp = false;

			try {
				let typeArr = CxSaleStr.split('-');
				if (typeArr.length == 2) {
					C1.YdminTimeOut = parseInt(typeArr[1]);
				}
				C1.Cxztype = cx_util.xsType(parseInt(typeArr[0]));
			} catch (e) {
				C1.Cxztype = "None";
				C1.YdminTimeOut = 6;
			}

			C1.OneJs = false;
			C1.OneSp = false;
			if (YNJSLB == "J") {
				C1.YN_JSLB = true;
				C1.OneJs = true;
			}
			if (YNJSLB == "T") {
				C1.OneSp = true;
			}
			C1.CXRY = cx_util.ryType(intrytype);
			C1.yntime = cx_util.ynToBool(yn_time);
			C1.nofktype = nfktype.split(',');
			C1.nofkSTR = nfktype;
			let minValue = "0001-01-01 00:00:00";
			if (C1.yntime) {
				let s1 = cx_util.dnvl(dscxm[i].STIME1, minValue);
				let e1 = cx_util.dnvl(dscxm[i].ETIME1, minValue);
				C1.Tstart1 = cx_util.timeTodec(s1);
				C1.Tstop1 = cx_util.timeTodec(e1);
				s1 = cx_util.dnvl(dscxm[i].STIME2, minValue);
				e1 = cx_util.dnvl(dscxm[i].ETIME2, minValue);
				C1.Tstart2 = cx_util.timeTodec(s1);
				C1.Tstop2 = cx_util.timeTodec(e1);
				s1 = cx_util.dnvl(dscxm[i].STIME3, minValue);
				e1 = cx_util.dnvl(dscxm[i].ETIME3, minValue);
				C1.Tstart3 = cx_util.timeTodec(s1);
				C1.Tstop3 = cx_util.timeTodec(e1);
			}
			C1.SubList = {};
			C1.dictZslq = {};
			//添加促销曾券
			try {
				let dtzq = cx_util.retDtforConditions(dszqda, "BILL", bill);
				if (dtzq.length > 0) {
					for (let zz = 0; zz < dtzq.length; zz++) {
						let struZslq = new Object();
						struZslq.lqtype = cx_util.snvl(dtzq[zz].LQTYPE, "");
						struZslq.zqty = cx_util.nnvl(dtzq[zz].ZQTY, 0);
						struZslq.hqty = cx_util.nnvl(dtzq[zz].HQTY, 0);
						struZslq.aqty = cx_util.nnvl(dtzq[zz].AQTY, 0);
						C1.dictZslq[struZslq.lqtype] = struZslq;
					}
				}
			} catch (e) {

			}

			let cxclass = cx_util.retDtforConditions(dscxclass, "BILL", bill);
			//console.log(bill, cxclass);
			if (cxclass.length == 0) {
				continue;
			}

			//添加促销类别
			for (let j = 0; j < cxclass.length; j++) {
				let sub1 = new Object();
				sub1.subno = cx_util.snvl(cxclass[j].CLASSID, "");
				if (sub1.subno == "") {
					continue;
				}
				if (zdcxsubno == "") {
					zdcxsubno = sub1.subno;
				}
				sub1.sublv = cx_util.nnvl(cxclass[j].CHANGELV, 0);
				if (sub1.sublv == 0) {
					continue;
				}

				let cxdiszk = cx_util.nnvl(cxclass[j].DISCTYPE, 0);
				let cxdisctj = cx_util.nnvl(cxclass[j].ZKTYPE, 0);
				let cxsxjf = cx_util.nnvl(cxclass[j].SYJF, 0);
				C1.syjf = cxsxjf;
				sub1.SubZktype = cx_util.cxZkType(parseInt(cxdiszk));
				sub1.ZkTj = cx_util.cxZkTj(parseInt(cxdisctj));

				sub1.NetCondition = [];
				sub1.QtyCondition = [];
				sub1.zjprice = [];
				sub1.discnet = [];
				sub1.discnum = [];
				sub1.jfxs = [];
				for (let xxx = 1; xxx <= sub1.sublv; xxx++) {
					let sno = xxx.toString();
					sub1.NetCondition.push(cx_util.nnvl(cxclass[j]["XX_NET" + sno], 0));
					sub1.QtyCondition.push(cx_util.nnvl(cxclass[j]["XX_QTY" + sno], 0));
					sub1.zjprice.push(cx_util.nnvl(cxclass[j]["ZJPRICE" + sno], 0));
					sub1.discnet.push(cx_util.nnvl(cxclass[j]["MJ_NET" + sno], 0));
					sub1.discnum.push(cx_util.nnvl(cxclass[j]["MJ_DISC" + sno], 0));
					sub1.jfxs.push(cx_util.nnvl(cxclass[j]["JFFACTOR" + sno], 0));
					//console.log("sub1", sub1)
				}

				if (sub1.SubZktype == "MinFree") {
					try {
						sub1.minMaxQty = cx_util.nnvl(cxclass[j]["MJ_NET1"], 0);
						sub1.minDisc = cx_util.nnvl(cxclass[j]["MJ_NET2"], 0) / 100;
					} catch (e) {

					}
				}
				//console.log("sub1.subno||sub1", sub1)
				C1.SubList[sub1.subno] = sub1;
				//console.log("C1.SubList", C1.SubList)
			}
			if (C1.SubList == null) {
				continue;
			}
			//console.log("cxdict C1 111111111", C1)
			//添加促销类别
			cxdict.set(C1.CxBill, C1);

			cxbilldts.map((obj) => {
				obj[C1.CxBill] = "";
			})
			//console.log("cxbilldts", cxbilldts)
			if (C1.ynzd) {
				zdcxbill = C1.CxBill;
				yn_zdcx = true;
				zdcxsubno = zdcxsubno;
				//console.log("zdcxsubno", zdcxsubno)
				break;
			}
		} catch (e) {
			//异常提示信息
			console.log("Cxdict 创建促销数据发生错误", e);
		}

	}
}

//计算促销的方法
const Createcx = async (sale02_arr, xstype, hyinfoModel) => {
	console.log("Createcx计算促销传入的商品sale02_arr", {
		xstype,
		sale02_arr,
		hyinfoModel
	})
	//计算时无生效的促销，再次请求初始化一次
	if (cxdict == null || cxdict.size <= 0) {
		await Cxdict();
	}
	if (xstype == "sale") {
		is_Xstype = "Sale";
	} else {
		is_Xstype = "SaleYd";
	}
	//清除计算过的集合
	ClearResult();

	let spid = "";
	let dateTime_now = cx_util.getTime(3);
	if (sale02_arr.length <= 0) {
		return sale02_arr.sort((p1, p2) => {
			return p1.NO - p2.NO; //升序
		});
	}

	//循环传入的购物车商品
	for (let i = 0; i < sale02_arr.length; i++) {
		let spid = sale02_arr[i].SPID.toString();
		let price = Math.round(parseFloat(sale02_arr[i].OPRICE.toString()) * 100) / 100;
		let num = Math.round(parseFloat(sale02_arr[i].QTY.toString()) * 100) / 100;

		//添加商品到促销计算数组
		AddRowCxbilldts(spid, price, num, i);
		//去计算促销
		SaleCxCreate(spid, "10000000", dateTime_now.toString(), "", 0);
	}

	for (let i = 0; i < cxbilldts.length; i++) {
		//获取每个商品中的值
		let cxdiscvalue = Math.round((cx_util.nnvl(cxbilldts[i].DISC, 0) * 100)) / 100;
		let spnet = Math.round((parseFloat(sale02_arr[i].OPRICE) * parseFloat(sale02_arr[i].QTY)) * 100) / 100;
		let jfnum = cx_util.nnvl(cxbilldts[i].jfnum, 0);
		let cxzt = cx_util.snvl(cxbilldts[i].CXZT, "");
		if (cxdiscvalue >= 0) {
			if (spnet - cxdiscvalue < 0) {
				cxdiscvalue = spnet;
			}
			//把促销值写入
			sale02_arr[i].DISCRATE = cxdiscvalue;
			// sale02_arr[i].$DISCRATE = cxdiscvalue;
			// util.hidePropety(sale02_arr[i], '$DISCRATE');

			sale02_arr[i].CXDISC = cxdiscvalue;
			sale02_arr[i].YN_CXDISC = (cxdiscvalue > 0 ? 'Y' : 'N');
		}
		let cxztStr = "";
		let cxbillStr = "";
		//促销主题不为空
		if (cxzt != "") {
			if (cxzt.indexOf('|') != -1) {
				cxztStr = cxzt.split('|')[0];
				cxbillStr = cxzt.split('|')[1];
			}
		}
		//商品原单价
		let ProPrice = parseFloat(cx_util.nnvl(sale02_arr[i].OPRICE, 0));
		//数量
		let ProNum = parseFloat(cx_util.nnvl(sale02_arr[i].QTY, 0));
		//单商品折扣后的总价
		let ProSalePrice = parseFloat(cx_util.nnvl(sale02_arr[i].NET, 0));
		//单个商品折扣后的单价
		let ProOPrice = parseFloat(cx_util.nnvl(sale02_arr[i].PRICE, 0));

		// sale02_arr[i].NET = Math.round((ProPrice * ProNum - cxdiscvalue) * 100) / 100;
		sale02_arr[i].QTY = ProNum;
		sale02_arr[i].PRICE = Math.round((sale02_arr[i].NET / ProNum) * 100) / 100;
		sale02_arr[i].SPJF = jfnum;
		sale02_arr[i].CXZT = cxztStr;
		sale02_arr[i].CXBILL = cxbillStr;
	}
	if (cxfsdt != null && cxfsdt.length > 0) {
		//修改其中的SPID编码，通过行数
		for (let i = 0; i < cxfsdt.length; i++) {
			let row = parseInt(cxfsdt[i]["SPID"].toString());
			//cxfsdt[i]["SPID"] = sale02_arr[row].SPID;
		}
		let cxfs = cxfsdt;
	}
	console.log("sale02_arr new", sale02_arr);
	return sale02_arr.sort((p1, p2) => {
		return p1.NO - p2.NO; //升序
	});
}

//向计算缓冲区添加一行
const AddRowCxbilldts = async (itemid, price, qty, row) => {
	if (qty == 0) {
		//删除
		CxdtReMoveRow(row);
	} else {
		//console.log("row 111", row + "||" + cxbilldts.length);
		if (row == cxbilldts.length) {
			//console.log("yn_zdcx", yn_zdcx);
			//增加
			if (yn_zdcx) {
				let dr = {};
				dr.SPID = itemid;
				dr.SYSL = qty;
				dr.YYSL = qty;
				dr.FSCS = qty;
				dr.OPRICE = price;
				dr.DISC = 0;
				dr.CXZT = "";
				dr.jfnum = 0;
				dr.zdcxbill = zdcxsubno;
				cxbilldts.push(dr);
			} else {
				//查询促销单对应的商品
				let spdt = cx_util.retDtforConditions(dscxsp, "SPID", itemid);
				//console.log("spdt", spdt);
				let dr = {};
				dr.SPID = itemid;
				dr.SYSL = qty;
				dr.YYSL = qty;
				dr.FSCS = qty;
				dr.OPRICE = price;
				dr.DISC = 0;
				dr.CXZT = "";
				dr.jfnum = 0;
				if (spdt.length > 0) {
					for (let i = 0; i < spdt.length; i++) {
						let bill = cx_util.snvl(spdt[i].BILL, "");
						//console.log("spdt bill", bill);
						let csno = "";
						csno = cx_util.snvl(spdt[i].CLASSID, "");
						//console.log("cxdict", cxdict);
						//console.log("CLASSID", cxdict.hasOwnProperty(bill));
						if (cxdict.has(bill)) {
							dr[bill] = csno;
						} else {
							continue;
						}
					}
				}
				cxbilldts.push(dr);
			}
		} else {
			//修改
			cxbilldts[row].SYSL = qty;
			cxbilldts[row].YYSL = qty;
			cxbilldts[row].FSCS = 0;

			cxbilldts[row].OPRICE = price;
		}
	}
	console.log("cxbilldts 数据", cxbilldts);
}

//开始计算促销的方法
const SaleCxCreate = async (spid, bill, saledate, fxbill, hylevel) => {
	//console.log("SaleCxCreate", cxbilldts);
	let rowmum = cxbilldts.length;

	cxSelectTip = [];
	//将上次的计算结果复位
	for (let i = 0; i < rowmum; i++) {
		cxbilldts[i].FSCS = 0;
		cxbilldts[i].SYSL = cxbilldts[i].YYSL;
		cxbilldts[i].DISC = 0;
		cxbilldts[i].jfnum = 0;
	}
	//每次讲积分信息清除
	if (null != jfinfo) {
		jfinfo.jfnum = 0;
		jfinfo.dhnet = 0;
		jfinfo.hdbill = [];
		jfinfo.hdtype = [];
	}
	//清除促销跟踪信息
	cxfsdt = [];
	for (let col = 0; col < cxbilldts.length; col++) {
		let cxbilldData = cxbilldts[col];
		let cxbilldDataKeys = Object.keys(cxbilldData);
		//console.log("cxbilldDataKeys",cxbilldDataKeys)	
		for (let k = 8; k < cxbilldDataKeys.length; k++) {
			//console.log("cxbilldDataKeys", cxbilldDataKeys[k])
			let cxbill = cxbilldDataKeys[k];
			//console.log("cxbilldDataKeys cxbill", cxbill)
			let cxbill_val = cxbilldData[cxbill];
			//console.log("cxbilldData[cxbill]", cxbill_val)
			if (cxbill_val == null || cxbill_val == "") {
				continue;
			}
			if (!ynjsCx(cxbill)) {
				continue;
			}
			if (!ynjsCxforHy(cxbill)) {
				continue;
			}
			if (!xsTypeCheck(cxbill, is_Xstype)) {
				continue;
			}

			let retyyslclass = retCxClassForDtRow(cxbill, yysl);
			console.log("retyyslclass 1", retyyslclass);
			if (retyyslclass != null) {
				testallcx(cxbill, retyyslclass);
			}
			let retclssid = retCxClassForDtRow(cxbill, sysl);
			//console.log("retyyslclass 2", retclssid);
			if (retclssid == null) {
				continue;
			}
			//校验通过满足条件的促销单，去计算促销
			cxClasCompute(spid, bill, saledate, cxbill, retclssid, sysl);
		}
	}
	console.log("SaleCxCreate cxbilldts new", cxbilldts);
	return cxbilldts;
}

//删除一个缓存信息
const CxdtReMoveRow = async (row) => {
	if (row < cxbilldts.length) {
		delete cxbilldts[row];
	}
}

//通过列，生成空值集合
const CreateArr = cols => {
	let arr = [],
		obj = {};
	cols.map((r, i) => {
		obj[r] = ""
	})
	arr.push(obj);
	return arr;
}

//如果是时段促销  是否满足时段要求
const ynjsCx = function(bill) {
	let mcc = cxdict.get(bill);
	if (!mcc.yntime) {
		return true;
	} else {
		let dateTime = cx_util.getTime(3);
		let decnow = cx_util.timeTodec(dateTime);
		if (mcc.Tstart1 <= decnow && decnow <= mcc.Tstop1) {
			return true;
		}
		if (mcc.Tstart2 <= decnow && decnow <= mcc.Tstop2) {
			return true;
		}
		if (mcc.Tstart3 <= decnow && decnow <= mcc.Tstop3) {
			return true;
		}
	}
}

//判断会员促销方式
const ynjsCxforHy = function(bill) {
	let mcc = cxdict.get(bill);
	// console.log("ynjsCxforHy mcc.CXRY",mcc.CXRY);
	if (!isHy) {
		switch (mcc.CXRY) {
			case "all":
				return true;
			case "Hy": //测试改为true
				return true;
			case "Nhy":
				return true;
			default:
				return false;
		}
	} else {
		switch (mcc.CXRY) {
			case "all":
				return true;
			case "Hy":
				return true;
			case "Nhy":
				return false;
			default:
				return false;
		}
	}
}

//销售方式的转变
const xsTypeCheck = function(bill, is_Xstype) {
	let mcc = cxdict.get(bill);
	//console.log("xsTypeCheck",mcc);
	if (mcc.Cxztype == "None") {
		return true;
	} else if (mcc.Cxztype == is_Xstype) {
		return true;
	} else {
		return false;
	}
}

//初步判断该促销是否可以进行计算  判断类别是否满足条件
const retCxClassForDtRow = function(bill, slttpe) {
	let c1 = cxdict.get(bill);
	//console.log("retCxClassForDtRow cxbilldts", cxbilldts);
	let ynnull = true;
	let oldclassid = "^^^^^VVV";
	let classnum = 0;
	let classidlist = new Array();
	try {
		for (let i = 0; i < cxbilldts.length; i++) {
			let classid = cx_util.snvl(cxbilldts[i][bill], null);
			let syqty = cx_util.snvl(cxbilldts[i][slttpe], 0);
			//console.log("retCxClassForDtRow syqty",classid + "||" + syqty);
			//发生参数是临时变量每次使用的时候要清理一下
			cxbilldts[i][fscs] = 0;
			if (c1.ynzd == false) {
				if (classid == null || syqty == 0) {
					classidlist.push(null);
				} else {
					ynnull = false;
					if (classid != oldclassid) {
						classnum++;
						oldclassid = classid;
					}
					classidlist.push(classid);
				}
			} else {
				if (syqty == 0) {
					classidlist.push(null);
				} else {
					ynnull = false;
					classnum++;
					classidlist.push(classid == null ? c1.SubList[bill + "1"].subno : classid);
				}
			}
		}
	} catch (e) {

	}
	if (classnum < Object.keys(c1.SubList).length) {
		ynnull = true;
	}
	if (ynnull) {
		return null;
	} else {
		return classidlist;
	}
}

//统计大概可有多少促销发生 在销售界面上回生成小旗子
const testallcx = function(bill, pmList) {
	let Lcm = 0;
	//console.log("testallcx cx", cxdict.get(bill));
	let cx = cxdict.get(bill);
	let currentlv = 0;

	if (cx.YN_JSLB) {
		currentlv = parseInt(cx.SubList[Object.keys(cx.SubList)[0]].sublv) - 1;
	}
	//console.log("testallcx",cx.SubList)
	let subzqty = getSubidZqty(pmList, cx, yysl);
	for (let lv = currentlv; lv >= 0; lv--) {
		Lcm = getLcm(subzqty, cx, lv);
		//console.log("testallcx Lcm",Lcm);
		if (Lcm > 0) {
			break;
		} else {
			Lcm = 0;
		}
	}
	if (Lcm > 0) {
		for (let i = 0; i < pmList.length; i++) {
			if (pmList[i] == null) {
				continue;
			} else {
				let dr = {};
				dr[rowid] = i.toString();
				dr[KnCxbill] = bill;
				cxSelectTip.push(dr);
			}
		}
	}
}

//参与促销计算
const cxClasCompute = function(spid, salebill, saledate, bill, bufflist, sltype) {
	console.log("CxClasCompute", spid + "||" + salebill + "|" + saledate)
	//console.log("CxClasCompute cx1", cxdict.get(bill))
	let cx1 = cxdict.get(bill);
	if (cx1.YN_JSLB) {
		if (cx1.OneJs) {
			JustOnelbcx(spid, salebill, saledate, cx1, bufflist, sltype);
		} else {
			Jslbcx(spid, salebill, saledate, cx1, bufflist, sltype);
		}
	} else {
		FreeZhCx(spid, salebill, saledate, cx1, bufflist, sltype);
	}
}

//只计算一次的价随量变促销
const JustOnelbcx = function(spid, bill, saledate, cx, pmList, qtytype) {
	try {
		let Lcm = 1;
		let currentlv = 0;
		if (Object.keys(cx.SubList).length != 1) {
			return;
		}
		let subx = cx.SubList[Object.keys(cx.SubList)[0]];
		currentlv = parseInt(subx.sublv - 1);
		while (currentlv >= 0) {
			///当前级别
			let subzqty = getSubidZqty(pmList, cx, sysl);
			for (let lv = currentlv; lv >= 0; lv--) {
				Lcm = getLcm(subzqty, cx, lv);
				if (Lcm > 0) {
					currentlv = lv;
					break;
				}
			}
			if (Lcm == 0) {
				break;
			}
			Lcm = 1;
			let Tjqty = 0;
			if (subx.ZkTj == "Qty") {
				Tjqty = subx.QtyCondition[currentlv];
			} else {
				Tjqty = subx.NetCondition[currentlv];
			}
			//发生的总金额 或者总数量
			let Fsnet = 0;
			for (let i = 0; i < pmList.length; i++) {
				if (pmList[i] == null) {
					continue;
				}
				let currqty = cx_util.nnvl(cxbilldts[i][qtytype], 0);
				if (currqty == 0) {
					///没有剩余要跳出
					continue;
				}
				let oldprice = cx_util.nnvl(cxbilldts[i][oprice], 0);
				///取出条件数量
				let fsqty = 0;
				fsqty = currqty;
				if (subx.ZkTj == "Qty") {
					if (currqty - Tjqty > 0) {
						Fsnet += Fsnet + Tjqty * oldprice;
						// Fsnet += Fsnet + currqty * oldprice;
						Tjqty = 0;
					} else {
						Fsnet += currqty * oldprice;
						Tjqty = Tjqty - currqty;
					}
				} else {
					if (currqty * oldprice - Tjqty > 0) {
						Fsnet += Math.ceil(Tjqty / oldprice) * oldprice;
						//Fsnet += Math.ceil(currqty / oldprice) * oldprice;
						Tjqty = 0;
					} else {
						Fsnet += currqty * oldprice;
						Tjqty = Tjqty - currqty * oldprice;
					}
				}
				cxbilldts[i][fscs] = fsqty;
				//促销主题
				cxbilldts[i][cxzt] = cx != null ? cx.CxZt.replace("|", "") + "|" + cx.CxBill : "";
			}
			let fsnet = new Map();
			fsnet.set(subx.subno, Fsnet);
			SubjustJslbCx(spid, bill, saledate, pmList, cx, fsnet, currentlv);
			break;
		}
	} catch (e) {

	}
}

//价随量变促销
const Jslbcx = function(spid, bill, saledate, cx, pmList, qtytype) {
	try {
		let Lcm = 1;
		let currentlv = 0;
		if (Object.keys(cx.SubList).length != 1) {
			return;
		}
		let subx = cx.SubList[Object.keys(cx.SubList)[0]];
		currentlv = parseInt(subx.sublv - 1);
		while (currentlv >= 0) {
			//当前级别
			let subzqty = getSubidZqty(pmList, cx, sysl);
			for (let lv = currentlv; lv >= 0; lv--) {
				Lcm = getLcm(subzqty, cx, lv);
				if (Lcm > 0) {
					currentlv = lv;
					break;
				}
			}
			if (Lcm == 0) {
				break;
			}
			let Tjqty = 0;
			if (subx.ZkTj == "Qty") {
				Tjqty = subx.QtyCondition[currentlv] * Lcm;
			} else {
				Tjqty = subx.NetCondition[currentlv] * Lcm;
			}
			//发生的总金额 或者总数量
			let Fsnet = 0;

			for (let i = 0; i < pmList.length; i++) {
				if (pmList[i] == null) {
					continue;
				}
				let currqty = cx_util.nnvl(cxbilldts[i][qtytype], 0);
				if (currqty == 0) {
					//没有剩余要跳出
					continue;
				}
				let oldprice = cx_util.nnvl(cxbilldts[i][oprice], 0);
				//取出售价
				let Spprice = 0;
				//取出条件数量
				let fsqty = 0;

				//let ynzs = true;
				// let zsds = getCxSql_db.cxspdaSql(spid);
				// if (zsds != null && zsds.length > 0) {
				// 	let iszs = cx_util.snvl(zsds[0]["YN_ZS"], "");
				// 	if (iszs == "N") {
				// 		ynzs = false;
				// 	}
				// }

				let ynzs = false; //测试使用，正式注释，使用上面注释的代码

				if (subx.ZkTj == "Qty") {
					if (currqty >= Tjqty) //&& ynzs==true
					{
						fsqty = Tjqty;
					} else {
						fsqty = currqty;
					}
					Tjqty = Tjqty - fsqty;
				} else {
					Spprice = oldprice;

					if (ynzs == false && currqty * Spprice >= Tjqty) {
						fsqty = Math.round((Tjqty / Spprice) * 100) / 100;
						Tjqty = 0;
					} else if (currqty * Spprice >= Tjqty) //&& ynzs == true
					{
						fsqty = parseInt(Math.ceil(Tjqty / Spprice));
						Tjqty = 0;
					} else {
						fsqty = currqty;
						Tjqty = Tjqty - fsqty * Spprice;
					}
				}
				Fsnet = Fsnet + fsqty * oldprice;
				cxbilldts[i][fscs] = fsqty;
				//促销主题
				cxbilldts[i][cxzt] = cx != null ? cx.CxZt.replace("|", "") + "|" + cx.CxBill : "";
			}

			let fsnet = new Map();
			fsnet.get(subx.subno, Fsnet);

			if (Tjqty == 0) {
				SubCxQty(spid, bill, saledate, pmList, cx, fsnet, currentlv, Lcm);
			}
			currentlv--;
		}
	} catch (e) {

	}
}

//获取某个级别的最小公倍数
const getLcm = function(zqty, cx1, lv) {
	let lcm = Number.MAX_SAFE_INTEGER; //Number类型最大值
	let templcm = 0;
	//console.log("getLcm size|SubList Count|lv",zqty.size + "||" + Object.keys(cx1.SubList).length + "|" + lv);
	if (zqty.size != Object.keys(cx1.SubList).length) {
		return 0;
	} else {
		for (let [key, value] of zqty) {
			//console.log("getLcm value",key + "|" + value);
			let cxqty = value;
			let subx = cx1.SubList[key];
			//console.log("getLcm subx",subx);
			if (subx.ZkTj == "Qty") {
				templcm = parseInt(cxqty / subx.QtyCondition[lv]);
			} else {
				templcm = parseInt(cxqty / subx.NetCondition[lv]);
			}
			if (templcm < lcm) {
				lcm = templcm;
			}
		}
	}
	//console.log("getLcm lcm",lcm);
	if (lcm == Number.MAX_SAFE_INTEGER) {
		return 0;
	}
	return lcm;
}

//自由组合促销
const FreeZhCx = function(spid, bill, saledate, cx, pmList, qtytype) {
	//最小公倍数
	try {
		let Lcm = 1;
		//保存本次运算的数量或者金额条件
		let hashqty = new Map();
		let subzqty = getSubidZqty(pmList, cx, sysl);
		Lcm = getLcm(subzqty, cx, 0);
		//console.log("FreeZhCx Lcm",Lcm)
		if (Lcm == 0) {
			return;
		}
		//发生促销的时候按类别的总售价金额
		let Fsnet = new Map();
		for (let i = 0; i < pmList.length; i++) {
			if (pmList[i] == null) {
				//无效的行数 要跳出
				continue;
			}
			let subid = pmList[i];
			let currqty = cx_util.nnvl(cxbilldts[i][qtytype], 0);
			if (currqty == 0) {
				//没有剩余要跳出
				continue;
			}
			let oldprice = cx_util.nnvl(cxbilldts[i][oprice], 0);
			//取出售价
			let Spprice = 0;
			//取出条件数量
			let Tjqty = 0;
			let subx = cx.SubList[subid];
			//某一行产品进行计算时进行这些计算
			if (subx.ZkTj == "Qty") {
				Spprice = 1;
				if (hashqty.has(subid)) {
					Tjqty = hashqty.get(subid);
				} else {
					Tjqty = subx.QtyCondition[0] * Lcm;
					hashqty.set(subid, Tjqty);
					Fsnet.set(subid, 0);
				}
			} else {
				Spprice = oldprice;
				if (hashqty.has(subid)) {
					Tjqty = hashqty.get(subid);
				} else {
					Tjqty = subx.NetCondition[0] * Lcm;
					hashqty.set(subid, Tjqty);
					Fsnet.set(subid, 0);
				}
			}
			if (Tjqty == 0) {
				//条件数量用尽要退出
				continue;
			}
			//发生数量
			let fsqty = 0;
			//这里判断商品是不是整数
			// let ynzs = true;
			// let zsds = getCxSql_db.cxspdaSql(spid);
			// if (zsds != null && zsds.length > 0) {
			// 	let iszs = cx_util.snvl(zsds[0]['YN_ZS'], "");
			// 	if (iszs == "N") {
			// 		ynzs = false;
			// 	}
			// }
			let ynzs = false; //测试使用，正式使用，上面注释代码
			if (cx.OneSp) {
				fsqty = getOneSp_Num(pmList, cx, subid, currqty, Spprice);
				if (fsqty < 0) {
					fsqty = 0;
				}
			} else {
				if (currqty * Spprice >= Tjqty && ynzs == false) {
					fsqty = Math.round((Tjqty / Spprice) * 100) / 100;
				} else if (currqty * Spprice >= Tjqty) {
					fsqty = Math.ceil(Tjqty / Spprice);
				} else {
					fsqty = currqty;
				}
			}

			Tjqty = Tjqty - fsqty * Spprice;
			if (Tjqty <= 0) {
				Tjqty = 0;
			}
			hashqty.set(subid, Tjqty);
			Fsnet.set(subid, Fsnet.get(subid) + fsqty * oldprice);
			cxbilldts[i][fscs] = fsqty;
			//促销主题
			cxbilldts[i][cxzt] = cx != null ? cx.CxZt.replace("|", "") + "|" + cx.CxBill : "";
		}
		//console.log("FreeZhCx cxbilldts 111",cxbilldts)
		SubCxQty(spid, bill, saledate, pmList, cx, Fsnet, 0, Lcm);
	} catch (e) {

	}
}

//因为单行产品的特殊性导致  再以金额为条件  进行计算的时候  返回的数量为正常  返回的金额 只能为条件金额的倍数
const getOneSpNetForQty = function(cx, subid, pm_fsqty, pm_price) {
	//console.log("getOneSpNetForQty cx",cx)
	if (cx.OneSp) {
		let subx = cx.SubList[subid];
		if (subx.ZkTj == "Net") {
			let OneRowNet = cx.SubList[subid].NetCondition[0];
			let LcmRowNet = parseInt(pm_fsqty * pm_price / OneRowNet);
			return LcmRowNet * cx.SubList[subid].NetCondition[0];
		} else {
			return pm_fsqty;
		}
	} else {
		//console.log("getOneSpNetForQty pm_fsqty * pm_price",pm_fsqty * pm_price)
		return pm_fsqty * pm_price;
	}
}

//获取单行计算的促销产品的某一行的数量和结果
const getOneSp_Num = function(pm_list, cx, subid, syqty_buff, oldprcle) {
	let syqty = -1;
	try {

		if (cx.OneSp) {
			let subx = cx.SubList[subid];
			if (subx.ZkTj == "Net") {
				let OneRowNet = cx.SubList[subid].NetCondition[0];
				if (syqty_buff * oldprcle < OneRowNet) {
					return -1;
				} else {
					let OneRowNetqty = parseInt(syqty_buff * oldprcle / OneRowNet);
					syqty = Math.ceil(OneRowNetqty * OneRowNet / oldprcle);
				}
			} else {
				if (syqty_buff < cx.SubList[subid].QtyCondition[0]) {
					return -1;
				} else {
					syqty = syqty_buff - syqty_buff % cx.SubList[subid].QtyCondition[0];
				}
			}
		}
	} catch (e) {
		syqty = -1;
	}
	return syqty;
}

//用于计算本次促销计算中的  需要减少金额的行数
const MinComputedRow = function(pm_list, cx, lcm, level) {
	//本次促销计算中所实用的类别
	let MinFreeClassQty = new Map();
	let Zfsqty = new Map();
	let Row = new Map();
	//已经使用过的行
	let Rowlist = new Array();
	/*
	 * 第一循环取出有多少个类别和 免单数量
	 */
	for (let i = 0; i < pm_list.length; i++) {
		if (pm_list[i] == null) {
			continue;
		}
		let subid = pm_list[i];
		let cxsub = cx.SubList[subid];
		let Mdqty = cxsub.discnet[level] * lcm;
		let fsqty = cx_util.nnvl(cxbilldts[i][fscs], 0);
		cxbilldts[i][fscs] = 0;
		if (!MinFreeClassQty.has(subid)) {
			MinFreeClassQty.set(subid, Mdqty);
			Zfsqty.set(subid, fsqty);
		} else {
			Zfsqty.set(subid, Zfsqty.get(subid) + fsqty);
		}
	}

	/*
	 * 根据类别和免单数量 取出某一行 需要减少的数量
	 */
	for (let [key, value] of MinFreeClassQty) {
		let Clqty = value;
		let aRow = new Map();
		while (Clqty > 0) {
			let minrow = -1;
			let minprice = Number.MAX_SAFE_INTEGER;
			for (let xx = 0; xx < pm_list.length; xx++) {
				if (pm_list[xx] == null) {
					continue;
				}
				if (pm_list[xx] != key) {
					continue;
				}
				if (Rowlist.hasOwnProperty(xx)) {
					continue;
				}
				let price = cx_util.nnvl(cxbilldts[xx][oprice], 0);
				if (price < minprice) {
					minprice = price;
					minrow = xx;
				}
			}
			if (minrow < 0) {
				break;
			} else {
				let fsqty = cx_util.nnvl(cxbilldts[minrow][sysl], 0);
				if (fsqty <= 0) {
					continue;
				}
				Rowlist.push(minrow);
				let syqty = Clqty - fsqty;
				if (syqty > 0) {
					syqty = fsqty;
				} else {
					syqty = Clqty;
				}
				aRow.set(minrow, syqty);
				Clqty = Clqty - fsqty;
			}
		}
		for (let [skey, svalue] of aRow) {
			cxbilldts[skey][fscs] = svalue;
			Row.set(skey, svalue);
			Zfsqty.set(key, Zfsqty.get(key) - svalue);
		}
		/*
		   重新分配发生数量 
		 */
		for (let xx = 0; xx < pm_list.length; xx++) {
			if (!Zfsqty.has(key)) {
				continue;
			}
			if (pm_list[xx] == null) {
				continue;
			}
			if (pm_list[xx] != key) {
				continue;
			}
			let syqty = cx_util.nnvl(cxbilldts[xx][sysl], 0);
			let fsqty = cx_util.nnvl(cxbilldts[xx][fscs], 0);
			let kyqty = syqty - fsqty;
			if (kyqty < Zfsqty.get(key)) {
				Zfsqty.set(key, Zfsqty.get(key) - kyqty);
				cxbilldts[xx][fscs] = fsqty + kyqty;
			} else {
				cxbilldts[xx][fscs] = fsqty + Zfsqty.get(key);
				Zfsqty.set(key, 0);
			}
		}
	}
	return Row;
}

//组合促销计算折扣和金额的方法
const SubCxQty = function(spid, bill, saledate, pm_list, cx, fsznet, level, lcm) {
	try {
		//取出表中促销单不为空的最后一行
		let lastIndex = 0;
		for (let n = pm_list.length - 1; n >= 0; n--) {
			//取出促销单不为null且有促销发生的那一行
			if (pm_list[n] != null && cx_util.nnvl(cxbilldts[n][fscs], 0) > 0) {
				lastIndex = n;
				break;
			}
		}
		let MinRow = null;
		for (let i = 0; i < pm_list.length; i++) {
			//累计的分摊的积分
			if (pm_list[i] == null) {
				continue;
			}
			if (cx_util.nnvl(cxbilldts[i][fscs], 0) == 0) {
				continue;
			}
			//产品在当前促销单下所属的类别
			let subid = pm_list[i];
			//原售价
			let price = cx_util.nnvl(cxbilldts[i][oprice], 0);
			//表示此行单品 在当前促销单下 发生的数量
			let fsqty = cx_util.nnvl(cxbilldts[i][fscs], 0);
			let subznet = fsznet.get(subid);
			let cxsub = cx.SubList[subid];
			let jfxs = cxsub.jfxs[level]; ///产品的积分系数
			//促销后金额/数量的  售价
			let newprice = 0;
			switch (cxsub.SubZktype) {
				case "Subdisc":
					cxbilldts[i][disc] = Math.round(cx_util.nnvl(cxbilldts[i][disc], 0) * 100) / 100 + Math.round(((
						(1 - cxsub.discnum[level] / 100) * price * fsqty)) * 100) / 100;
					newprice = price * cxsub.discnum[level] / 100;
					break;
				case "Subnet":
					let subdisc = 0;
					if (cx.OneSp) {
						let getfsnet = getOneSpNetForQty(cx, subid, fsqty, price);
						let sublcm = 0;
						if (cxsub.ZkTj == "Net") {
							sublcm = parseInt(getfsnet / cxsub.NetCondition[0]);
						} else {
							sublcm = parseInt(getfsnet / cxsub.QtyCondition[0]);
						}
						subdisc = sublcm * cxsub.discnet[level];
					} else {
						subdisc = Math.round((price * fsqty * cxsub.discnet[level] * lcm / subznet) * 100) / 100;
					}
					//计算积分
					//积分相关的时候不计算折扣
					if (cx.cxtype == "G" || cx.cxtype == "D") {
						try {
							if (i == lastIndex) {
								let jfnum = cx.syjf * lcm; ///变化的积分数
								let dsnum = cxsub.discnet[level] * lcm; ///变化的折扣金额
								//计算最小积分上限
								setHyjfUpleve(cx.upleave);
								//计算积分上限是否满足条件
								calculateJf(dsnum, jfnum, cx);
								setHjInfo(cx, jfxs, dsnum, jfnum);
							}
							newprice = price;
						} catch {

						}
					} else {
						newprice = (price * fsqty - subdisc) / fsqty;
						cxbilldts[i][disc] = Math.round((cx_util.nnvl(cxbilldts[i][disc], 0) + subdisc) *
							100) / 100;
					}
					break;
				case "zjprice":
					let zjprice = cxsub.zjprice[level];
					if (zjprice > price) {
						//cxbilldts.Rows[i][disc] = 0;
					} else {
						//计算积分
						//积分相关的时候不计算折扣
						if (cx.cxtype == "G" || cx.cxtype == "D") {
							try {
								let jfnum = cx.syjf * fsqty; ///变化的积分数
								let dsnum = (price - zjprice) * fsqty; ///变化的折扣金额
								//计算最小积分上限
								setHyjfUpleve(cx.upleave);
								//计算积分上限是否满足条件
								calculateJf(dsnum, jfnum, cx);
								setHjInfo(cx, jfxs, dsnum, jfnum);
								newprice = price;
							} catch {

							}
						}
						//计算积分
						else {
							cxbilldts[i][disc] = Math.round((cx_util.nnvl(cxbilldts[i][disc], 0) + (
								price - zjprice) * fsqty) * 100) / 100;
							newprice = zjprice;
						}
					}
					break;
				case "MinFree":
					/*
					  第一次循环到这里的时候 就要获取所有需要计算的行信息
					  然后判断就简单了 
					 */
					if (MinRow == null) {
						MinRow = MinComputedRow(pm_list, cx, lcm, level);
					}
					if (MinRow.has(i)) {
						cxbilldts[i][disc] = Math.round((cx_util.nnvl(cxbilldts[i][disc], 0) + MinRow.get(i) * Math
							.round((price * (1 - cxsub.minDisc)) * 100) / 100) * 100) / 100;
						if (fsqty != 0) {
							newprice = (fsqty * price - MinRow.get(i) * Math.round((price * (1 - cxsub.minDisc)) *
									100) / 100) /
								fsqty;
						} else {
							newprice = price;
						}
					} else {
						newprice = price;
					}
					break;
			}

			//生成促销的结果
			try {
				//  CXBILL VARCHAR2(30),                        -- 促销单号
				// CLASSID VARCHAR2(30),                        -- 类别编码
				//    SPID VARCHAR2(30),	                       -- 商品编码
				//SALEDATE         DATE,                        -- 销售日期
				//   KHID VARCHAR2(30),                         -- 客户编码
				//   GSID  VARCHAR2(30),                        -- 款台编码
				//  XSBILL VARCHAR2(30),                        -- 销售单号
				//   XSQTY NUMBER(25,8),                        -- 销售数量
				//  OPRICE NUMBER(25,8),                        -- 原价
				// CXPRICE NUMBER(25,8),                        -- 促销价格
				//    ONET NUMBER(25,8),                        -- 原价金额
				//   CXNET NUMBER(25,8),                        -- 促销金额
				//   CXJF  NUMBER(25,8),                        -- 促销积分
				if (jfxs >= 1) {
					jfxs = jfxs - 1;
				}
				//本次促销单中，该产品的积分 = 促销单中的积分系数 * 折扣后的价格 * 商品数量
				let currentJf = jfxs * newprice * fsqty;
				//每次这个产品有新的促销单生效的时候，都要将这一促销单的积分累加到产品这一列上
				cxbilldts[i][jfnum] = cx_util.nnvl(cxbilldts[i][jfnum], 0) + currentJf;
				if (!fsdcx.hasOwnProperty(cxsub.subno)) {
					///积分的促销类型不在这里添加
					if (cx.cxtype != ("G") && cx.cxtype != "D" && !fsdcx.hasOwnProperty(cx.CxBill) && jfxs >
						0) {
						fsdcx.push(cx.CxBill);
					}
				}
				AddCxTable(spid, bill, saledate, cx, subid, i, fsqty, newprice, price, level, lcm);
			} catch (e) {

			}

			cxbilldts[i][sysl] = cx_util.nnvl(cxbilldts[i][sysl], 0) - fsqty;
			cxbilldts[i][fscs] = 0;

		}
	} catch (e) {

	}
}

//每次计算之前先设置会员积分上限
const setHyjfUpleve = function(num) {
	//会员信息
	if (null == hymen) {
		return;
	}
	let tj = 0;
	if (null == jfinfo) {
		let hyjfnum = cx_util.TryParse(hymen.BALANCE); //当前积分
		if (hyjfnum <= 0) {
			return;
		}
		//积分加价购 
		//jfinfo = new JfSaleInfo(0, 0, PARTNER, hyjfnum, tj);
		jfinfo = {
			"jfnum": 0,
			"dhnet": 0,
			"hyid": hymen.PARTNER,
			"fznet": tj,
			"hyojf": hyjfnum,
			"upleve": 0
		};
	}
	//第一次赋值
	if (jfinfo.upleve == 0) {
		jfinfo.upleve = num;
	}
	//每次取最小的积分上限
	if (num < jfinfo.upleve) {
		jfinfo.upleve = num;
	}
}

//计算本次活动可加积分和金额
const calculateJf = function(dsnum, jfnum, cx) {
	try {
		//会员为null
		if (null == hymen) {
			return;
		}
		let tj = cx_util.TryParse(hymen.BALANCE);
		//会员积分错误
		if (tj >= 0) {
			return;
		}
		let syjf = 0; //当前已经累计的积分
		let dqjf = jfnum; //当前累计活动积分+本次活动积分
		//当前活动所包含积分
		if (null != jfinfo) {
			syjf = jfinfo.jfnum;
			dqjf = jfnum + syjf;
		}
		//当积分超过最小上限时
		if ((cx.upleave > 0 && dqjf > jfinfo.upleve) || dqjf > tj) {
			//取一个比较小的金额
			let min = tj > cx.upleave ? cx.upleave : tj;
			//先取商，算出剩余积分还能发生几次该促销
			let bs = parseInt(min - syjf) / parseInt(cx.syjf);
			if (bs <= 0) {
				//当商为0时，表示一次促销都不能再发生，直接返回0
				dsnum = 0;
				jfnum = 0;
			} else {
				//当商不为0时，要取余数
				let ys = parseInt(min - syjf) % parseInt(cx.syjf);
				//算出还能发生几次促销  （剩余积分 - 余数） / 发生一次促销的积分数
				let time = parseInt((min - syjf - ys) / cx.syjf);
				dsnum = time * cx.syjf / jfnum * dsnum;
				jfnum = time * cx.syjf;
			}
		}
	} catch (e) {

	}
}

//设置积分相关的信息
const setHjInfo = function(cx, jfxs, net, jfnum) {
	if (net == 0 || jfnum == 0) {
		return;
	}
	//会员为null
	if (null == hymen) {
		return;
	}
	let tj = cx_util.TryParse(hymen.BALANCE);
	//会员积分错误
	if (tj <= 0) {
		return;
	}
	let yyjf = 0;
	//获取当前累计的积分
	if (null != jfinfo) {
		yyjf = jfinfo.jfnum;
	}
	//当前累计积分超过会员积分的时候，就返回
	if (tj < (jfnum + yyjf)) {
		return;
	}
	//积分超过积分上限的时候
	if (cx.upleave > 0 && (jfnum + yyjf) > cx.upleave) {
		return;
	}
	net = Math.round(net * 100) / 100;
	jfnum = Math.round(jfnum * 100) / 100;
	//累加金额
	jfinfo.dhnet += net;
	//累加积分
	jfinfo.jfnum += jfnum;
	//累计单号
	if (!jfinfo.hdbill.hasOwnProperty(cx.CxBill)) {
		//当这个促销单存在积分系数的时候，将单号的索引记录下来
		if (jfxs > 0) {
			jfinfo.xsIndex.push(jfinfo.hdbill.length);
		}
		//累计单号
		jfinfo.hdbill.push(cx.CxBill);
		//累计类型
		jfinfo.hdtype.push(cx.cxtype);
	}
}

//作为一次价随量变促销的计算方法
const SubjustJslbCx = function(spid, bill, saledate, pm_list, cx, fsznet, level) {
	try {
		let TjQty = Number.MIN_VALUE;
		let lcm = 1
		for (let i = 0; i < pm_list.length; i++) {
			if (pm_list[i] == null) {
				continue;
			}
			if (cx_util.nnvl(cxbilldts[i][fscs], 0) == 0) {
				continue;
			}
			let subid = pm_list[i];
			let price = cx_util.nnvl(cxbilldts[i][oprice], 0);
			let fsqty = cx_util.nnvl(cxbilldts[i][fscs], 0);
			let subznet = fsznet.get(subid);
			let cxsub = cx.SubList[subid];
			////取出一次价随量变的 数量或者金额条件
			if (TjQty == Number.MIN_VALUE) {
				switch (cxsub.ZkTj) {
					case "Net":
						TjQty = cxsub.NetCondition[level];
						break;
					case "Qty":
						TjQty = cxsub.QtyCondition[level];
						break;
				}
			}
			//判断当前产品的数量和条件之间的差异关系
			if (TjQty > 0) {
				switch (cxsub.ZkTj) {
					case "Net":
						if (fsqty * price > TjQty) {
							fsqty = parseInt(Math.ceil(TjQty / price));
							// fsqty = (int)(Math.Ceiling(fsqty / price));
							TjQty = 0;
						} else {
							TjQty = TjQty - fsqty * price;
						}
						break;
					case "Qty":
						if (fsqty >= TjQty) {
							fsqty = TjQty;
							TjQty = 0;
						} else {
							TjQty = TjQty - fsqty;
						}
						break;
				}
			} else {
				fsqty = 0
			}
			//促销后金额/数量的  售价
			let newprice = 0;
			if (fsqty > 0) {
				switch (cxsub.SubZktype) {
					case "Subdisc":
						cxbilldts[i][disc] = Math.round((cx_util.nnvl(cxbilldts[i][disc], 0) + ((1 - cxsub
							.discnum[level] / 100) * price * fsqty)) * 100) / 100;
						newprice = price * cxsub.discnum[level] / 100;
						break;
					case "Subnet":
						let subdisc = Math.round((price * fsqty * cxsub.discnet[level] * lcm / subznet) * 100) /
							100;
						newprice = (price * fsqty - subdisc) / fsqty;
						cxbilldts[i][disc] = Math.round((cx_util.nnvl(cxbilldts[i][disc], 0) + subdisc) *
							100) / 100;
						break;
					case "zjprice":
						let zjprice = cxsub.zjprice[level];
						if (zjprice > price) {
							//cxbilldts[i][disc] = 0;
						} else {
							cxbilldts[i][disc] = Math.round((cx_util.nnvl(cxbilldts[i][disc], 0) + (price -
								zjprice) * fsqty) * 100) / 100;
							newprice = zjprice;
						}
						break;
				}
			}
			//一次计算促销但是 所有的数量都要计算进 
			//生成促销的结果
			try {
				AddCxTable(spid, bill, saledate, cx, subid, i, fsqty, newprice, price, level, lcm);
			} catch (e) {

			}
			fsqty = cx_util.nnvl(cxbilldts[i][fscs], 0);

			let cxjssysl = cx_util.nnvl(cxbilldts[i][sysl], 0);
			cxbilldts[i][sysl] = cxjssysl - fsqty;
			cxbilldts[i][fscs] = 0
		}
	} catch (e) {

	}
}

//添加促销追踪
const AddCxTable = function(spid, bill, saledate, cx, subid, row, fsqty, newprice, price, level, PM_LCM) {
	let i = row;
	let dr = {};
	dr["SALEDATE"] = saledate;
	dr["KHID"] = getApp().globalData.store.KHID;
	dr["GSID"] = getApp().globalData.store.GSID;
	dr["CXBILL"] = cx.CxBill;
	dr["CLASSID"] = subid.substring(cx.CxBill.length);
	dr["XSBILL"] = bill;
	dr["SPID"] = spid;
	dr["XSQTY"] = fsqty;
	dr["OPRICE"] = price;
	dr["ONET"] = price * fsqty;
	dr["CXPRICE"] = newprice;
	dr["CXNET"] = newprice * fsqty;
	dr["CXLV"] = level + 1;
	dr["LCM"] = PM_LCM;
	dr["NO"] = i;
	cxfsdt.push(dr);
}

//计算在一个促销中各个类共有的数量
const getSubidZqty = function(pm_list, cx, sltype) {
	let zqty = new Map();
	for (let i = 0; i < pm_list.length; i++) {
		let subid = pm_list[i];
		if (subid == null) {
			continue;
		}
		let oldprcle = cx_util.nnvl(cxbilldts[i][oprice], 0);
		let syqty = cx_util.nnvl(cxbilldts[i][sltype], 0);
		let syqty_buff = syqty;
		//console.log("oldprcle\syqty",oldprcle+"|"+cxbilldts[i][sltype])
		if (syqty == 0) {
			continue;
		}
		let subx = cx.SubList[subid];
		//console.log("subx",subx)
		if (cx.OneSp) {
			//此时返回的是发生的数量
			syqty = getOneSp_Num(pm_list, cx, subid, syqty_buff, oldprcle);
			if (syqty < 0) {
				continue;
			}
		}


		if (subx.ZkTj == "Net") {
			syqty = getOneSpNetForQty(cx, subid, syqty, oldprcle);
		}
		//console.log("getSubidZqty zqty.hasOwnProperty(subid)",zqty.has(subid));
		if (zqty.has(subid)) {
			zqty.set(subid, zqty.get(subid) + syqty);
		} else {
			zqty.set(subid, syqty);
		}

	}
	//console.log("getSubidZqty zqty",zqty.size);
	return zqty;
}

//清除集合数据
const ClearResult = function() {
	cxfsdt = [];
	cxSelectTip = [];
	cxbilldts = [];
}


export default {
	Cxdict, //从数据库中取出所有的促销信息，初始化
	CreateArr,
	Createcx, //计算促销的方法
	ClearResult //清除集合数据
}
