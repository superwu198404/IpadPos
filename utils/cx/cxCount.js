import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';
import xprinter_util from '@/utils/xprinter/util.js';
import getCxSql_db from '@/utils/cx/getCxSql.js'

var app = getApp();
//为选择提供依据
let cxSelectTipColumn = ["ROWID", "BILL"];
//保存促销阵列的dt
let cxbilldtsColumn = ["SYSL", "YYSL", "FSCS", "DISC", "OPRICE", "jfnum"];
//保存促销发生的dt
let cxfsdtColumn = ["CXBILL", "CXLV", "CXJF", "CXNET", "ONET", "CXPRICE", "OPRICE", "XSQTY", "XSBILL", "GSID", "KHID",
	"SALEDATE", "SPID", "CLASSID", "NO", "LCM"
];
let cxSelectTip = [];
let cxbilldts = [];
let cxfsdt = [];
//保存促销的集合
let cxdict = {};
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
let xsCust = null;
let is_Xstype = null;

//是否是整店促销
let zdcxbill = "";
let yn_zdcx = false;
let zdcxsubno = "";

///从数据库中取出所有的促销信息，然后创建促销信息 创建缓存表格
const Cxdict = async () => {
	console.log("CxSelectTip集合：", CreateArr(cxSelectTipColumn));
	console.log("cxbilldts集合：", CreateArr(cxbilldtsColumn));
	console.log("cxfsdt集合：", CreateArr(cxfsdtColumn));

	// cxSelectTip = CreateArr(cxSelectTipColumn);
	// cxbilldts = CreateArr(cxbilldtsColumn);
	// cxfsdt = CreateArr(cxfsdtColumn);

	let storeDqid = getApp().globalData.store.DQID;
	let dateTime = xprinter_util.getTime(0);
	let storeid = getApp().globalData.store.KHID;
	let gsid = getApp().globalData.store.GSID;
	//获取主单的Sql
	dscxm = await getCxSql_db.getCxmSql(storeDqid, dateTime, storeid);
	console.log("dscxm集合：", dscxm);

	//促销规则Sql
	dscxclass = await getCxSql_db.cxClassSql(storeid, dateTime);
	console.log("dscxclass集合：", dscxclass);

	//促销内容对应的产品Sql
	dscxsp = await getCxSql_db.cxSPsql(storeid, dateTime);
	console.log("dscxsp集合：", dscxsp);

	//促销赠券
	dszqda = await getCxSql_db.cxZqSql(gsid, storeid, dateTime);
	console.log("dszqda集合：", dszqda);

	//循环主单数据处理
	if (dscxm.length < 1) {
		console.log("没有生效的促销单：", dscxm.length);
		return;
	}

	for (let i = 0; i < dscxm.length; i++) {
		try {
			let CXWeek = xprinter_util.snvl(dscxm[i].CX_WEEK, null);
			//当前日是否有促销
			if (CXWeek == null) {
				continue;
			}
			//获取是星期几
			let x = xprinter_util.getTime(10);
			if (x == 0) {
				x = 7;
			}
			if (CXWeek.indexOf(x.toString()) < 0) {
				continue;
			}

			//添加促销主单信息
			let bill = xprinter_util.snvl(dscxm[i].BILL, null);
			let ZT = xprinter_util.snvl(dscxm[i].CXZT, null);
			let YNZD = xprinter_util.snvl(dscxm[i].YN_ZD, "N");
			let YNJSLB = xprinter_util.snvl(dscxm[i].YN_JSLB, "N");
			let rytype = xprinter_util.snvl(dscxm[i].CXRY, 1);
			let yn_time = xprinter_util.snvl(dscxm[i].YN_TIME, "N");
			let CxSaleStr = xprinter_util.snvl(dscxm[i].HYLV, 0);
			let nfktype = xprinter_util.snvl(dscxm[i].NOTFKID, "");
			let cxjfup = xprinter_util.snvl(dscxm[i].JFSX, 0);

			let intrytype = parseInt(rytype);
			if (bill == null) {
				continue;
			}
			var C1 = new Object();
			C1.CxBill = bill;
			C1.CxZt = ZT;
			C1.ynzd = xprinter_util.ynToBool(YNZD);
			C1.YN_JSLB = xprinter_util.ynToBool(YNJSLB);
			C1.cxtype = YNJSLB;
			C1.upleave = cxjfup;

			try {
				let typeArr = CxSaleStr.split('-');
				if (typeArr.length == 2) {
					C1.YdminTimeOut = parseInt(typeArr[1]);
				}
				C1.Cxztype = xprinter_util.xsType(parseInt(typeArr[0]));
			} catch (e) {
				C1.Cxztype = "None";
				C1.YdminTimeOut = 6;
			}
			if (YNJSLB == "J") {
				C1.YN_JSLB = true;
				C1.OneJs = true;
			}
			if (YNJSLB == "T") {
				C1.OneSp = true;
			}
			C1.CXRY = xprinter_util.ryType(intrytype);
			C1.yntime = xprinter_util.ynToBool(yn_time);
			C1.nofktype = nfktype.split(',');
			C1.nofkSTR = nfktype;
			let minValue = "0001-01-01 00:00:00";
			if (C1.yntime) {
				let s1 = xprinter_util.dnvl(dscxm[i].STIME1, minValue);
				let e1 = xprinter_util.dnvl(dscxm[i].ETIME1, minValue);
				C1.Tstart1 = xprinter_util.timeTodec(s1);
				C1.Tstop1 = xprinter_util.timeTodec(e1);
				s1 = xprinter_util.dnvl(dscxm[i].STIME2, minValue);
				e1 = xprinter_util.dnvl(dscxm[i].ETIME2, minValue);
				C1.Tstart2 = xprinter_util.timeTodec(s1);
				C1.Tstop2 = xprinter_util.timeTodec(e1);
				s1 = xprinter_util.dnvl(dscxm[i].STIME3, minValue);
				e1 = xprinter_util.dnvl(dscxm[i].ETIME3, minValue);
				C1.Tstart3 = xprinter_util.timeTodec(s1);
				C1.Tstop3 = xprinter_util.timeTodec(e1);
			}
			//添加促销曾券
			try {
				let dtzq = xprinter_util.retDtforConditions(dszqda, "BILL", bill);
				if (dtzq.length > 0) {
					for (let zz = 0; zz < dtzq.length; zz++) {
						let struZslq = new Object();
						struZslq.lqtype = xprinter_util.snvl(dtzq[zz].LQTYPE, "");
						struZslq.zqty = xprinter_util.nnvl(dtzq[zz].ZQTY, 0);
						struZslq.hqty = xprinter_util.nnvl(dtzq[zz].HQTY, 0);
						struZslq.aqty = xprinter_util.nnvl(dtzq[zz].AQTY, 0);
						C1.dictZslq.push(struZslq.lqtype, struZslq);
					}
				}
			} catch (e) {

			}

			let cxclass = xprinter_util.retDtforConditions(dscxclass, "BILL", bill);
			//console.log(bill, cxclass);
			if (cxclass.length == 0) {
				continue;
			}

			//添加促销类别
			for (let j = 0; j < cxclass.length; j++) {
				let sub1 = new Object();
				sub1.subno = xprinter_util.snvl(cxclass[j].CLASSID, "");
				if (sub1.subno == "") {
					continue;
				}
				if (zdcxsubno == "") {
					zdcxsubno = sub1.subno;
				}
				sub1.sublv = xprinter_util.nnvl(cxclass[j].CHANGELV, 0);
				if (sub1.sublv == 0) {
					continue;
				}

				let cxdiszk = xprinter_util.nnvl(cxclass[j].DISCTYPE, 0);
				let cxdisctj = xprinter_util.nnvl(cxclass[j].ZKTYPE, 0);
				let cxsxjf = xprinter_util.nnvl(cxclass[j].SYJF, 0);
				C1.syjf = cxsxjf;
				sub1.SubZktype = xprinter_util.cxZkType(parseInt(cxdiszk));
				sub1.ZkTj = xprinter_util.cxZkTj(parseInt(cxdisctj));

				sub1.NetCondition = [];
				sub1.QtyCondition = [];
				sub1.zjprice = [];
				sub1.discnet = [];
				sub1.discnum = [];
				sub1.jfxs = [];
				for (let xxx = 1; xxx <= sub1.sublv; xxx++) {
					let sno = xxx.toString();
					sub1.NetCondition.push(xprinter_util.nnvl(cxclass[j]["XX_NET" + sno], 0));
					sub1.QtyCondition.push(xprinter_util.nnvl(cxclass[j]["XX_QTY" + sno], 0));
					sub1.zjprice.push(xprinter_util.nnvl(cxclass[j]["ZJPRICE" + sno], 0));
					sub1.discnet.push(xprinter_util.nnvl(cxclass[j]["MJ_NET" + sno], 0));
					sub1.discnum.push(xprinter_util.nnvl(cxclass[j]["MJ_DISC" + sno], 0));
					sub1.jfxs.push(xprinter_util.nnvl(cxclass[j]["JFFACTOR" + sno], 0));
					//console.log("sub1", sub1)
				}

				if (sub1.SubZktype == "MinFree") {
					try {
						sub1.minMaxQty = xprinter_util.nnvl(cxclass[j]["MJ_NET1"], 0);
						sub1.minDisc = xprinter_util.nnvl(cxclass[j]["MJ_NET2"], 0) / 100;
					} catch {

					}
				}
				C1.SubList = {};
				//console.log("sub1", sub1)
				C1.SubList[sub1.subno] = sub1;
				//console.log("C1.SubList", C1.SubList)
			}
			if (C1.SubList == null) {
				continue;
			}

			//添加促销类别
			cxdict[C1.CxBill] = C1;
			// console.log("cxdict", cxdict)
			cxbilldts.map((obj) => {
				obj[C1.CxBill] = "";
			})
			//console.log("cxbilldts", cxbilldts)
			if (C1.ynzd) {
				zdcxbill = C1.CxBill;
				yn_zdcx = true;
				zdcxsubno = zdcxsubno;
				console.log("zdcxsubno", zdcxsubno)
				break;
			}
		} catch (e) {
			//异常提示信息
		}

	}
}

///计算促销的方法
const Createcx = async (sale02) => {
	await Cxdict();
	let sale02_arr = [{
			"ProCode": "1010100003",
			"ProName": "水果沙拉",
			"ProNum": "1",
			"ProPrice": "1",
			"Disc": "0",
			"ProSalePrice": "1",
			"ProOPrice": "1",
			"Sort": 1
		},
		{
			"ProCode": "1010100004",
			"ProName": "礼盒2号",
			"ProNum": "1",
			"ProPrice": "2",
			"Disc": "0",
			"ProSalePrice": "2",
			"ProOPrice": "2",
			"Sort": 2
		}
	];

	let spid = "";
	let dateTime_now = xprinter_util.getTime(3);
	if (sale02_arr.length <= 0) {
		return sale02_arr.sort((p1, p2) => {
			return p1.Sort - p2.Sort; //升序
		});
	}

	for (let i = 0; i < sale02_arr.length; i++) {
		let spid = sale02_arr[i].ProCode.toString();
		let price = parseFloat(sale02_arr[i].ProPrice.toString());
		let num = parseFloat(sale02_arr[i].ProNum.toString());

		//添加
		AddRowCxbilldts(spid, price, num, i);
		//计算
		SaleCxCreate(spid, "10000000", dateTime_now.toString());
	}

	for (let i = 0; i < cxbilldts.length; i++) {
		//获取每个商品中的值
		let cxdiscvalue = parseFloat(xprinter_util.nnvl(cxbilldts[i].DISC, 0)
			.toFixed(2));
		let spnet = parseFloat(sale02_arr[i].ProPrice.toFixed(2)) * parseFloat(sale02_arr[i].ProNum
			.toFixed(2));
		let jfnum = xprinter_util.nnvl(cxbilldts[i].jfnum, 0);
		let cxzt = xprinter_util.snvl(cxbilldts[i].CXZT, "");
		if (cxdiscvalue >= 0) {
			if (spnet - cxdiscvalue < 0) {
				cxdiscvalue = spnet;
			}
			//把促销值写入
			sale02_arr[i].Disc = cxdiscvalue;
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
		sale02_arr[i].SPJF = jfnum;
		sale02_arr[i].CXZT = cxztStr;
		sale02_arr[i].CxBill = cxbillStr;
	}
	if (cxfsdt != null && cxfsdt.length > 0) {
		//修改其中的SPID编码，通过行数
		for (let i = 0; i < cxfsdt.length; i++) {
			let row = parseInt(cxfsdt[i]["SPID"].toString());
			cxfsdt[i]["SPID"] = sale02_arr[row].ProCode;
		}
		cxfs = cxfsdt;
	}
	return sale02_arr.sort((p1, p2) => {
		return p1.Sort - p2.Sort; //升序
	});
}

///向计算缓冲区添加一行
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
				dr.SYSL = qty;
				dr.YYSL = qty;
				dr.FSCS = qty;
				dr.OPRICE = price;
				dr.DISC = 0;
				dr.jfnum = 0;
				dr.zdcxbill = zdcxsubno;
				cxbilldts.push(dr);
			} else {
				let spdt = xprinter_util.retDtforConditions(dscxsp, "SPID", itemid);
				console.log("spdt", spdt);
				let dr = {};
				dr.SYSL = qty;
				dr.YYSL = qty;
				dr.FSCS = qty;
				dr.OPRICE = price;
				dr.DISC = 0;
				dr.jfnum = 0;
				if (spdt.length > 0) {
					for (let i = 0; i < spdt.length; i++) {
						let bill = xprinter_util.snvl(spdt[i].BILL, "");
						console.log("spdt bill", bill);
						let csno = "";
						csno = xprinter_util.snvl(spdt[i].CLASSID, "");
						//console.log("cxdict", cxdict);
						//console.log("CLASSID", cxdict.hasOwnProperty(bill));
						if (cxdict.hasOwnProperty(bill)) {
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

///开始计算促销的方法
const SaleCxCreate = async (spid, bill, saledate) => {
	console.log("SaleCxCreate",cxbilldts);
	let rowmum = cxbilldts.length;

	cxSelectTip = [];
	//将上次的计算结果复位
	for (let i = 0; i < rowmum; i++) {
		cxbilldts[i].FSCS = 0;
		cxbilldts[i].SYSL = cxbilldts[i].YYSL;
		cxbilldts[i].DISC = 0;
		cxbilldts[i].jfnum = 0;
	}
	///每次讲积分信息清除
	if (null != jfinfo) {
		jfinfo.jfnum = 0;
		jfinfo.dhnet = 0;
		jfinfo.hdbill = [];
		jfinfo.hdtype = [];
	}
	///清除促销跟踪信息
	cxfsdt = [];
	for (let col = 0; col < cxbilldts.length; col++) {
		let cxbilldData = cxbilldts[col];
		//console.log("cxbilldData first",cxbilldData);	
		let cxbilldDataKeys = Object.keys(cxbilldData);
		//console.log("cxbilldDataKeys",cxbilldDataKeys)	
		for(let k = 6; k < cxbilldDataKeys.length; k++){
			console.log("cxbilldDataKeys bill",cxbilldDataKeys[k])
			let cxbill = cxbilldDataKeys[k];
			if (!YnjsCx(cxbill)) {
				continue;
			}
			if (!YnjsCxforHy(cxbill)) {
				continue;
			}
			if (!XsTypeCheck(cxbill)) {
				continue;
			}
			
			let retyyslclass = RetCxClassForDtRow(cxbill, yysl);
			if (retyyslclass != null) {
				testallcx(cxbill, retyyslclass);
			}
			let retclssid = RetCxClassForDtRow(cxbill);
			if (retclssid == null) {
				continue;
			}
			CxClasCompute(cxbill, retclssid, sysl, spdt);	
		}
	}
	return cxbilldts;
}

///删除一个缓存信息
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

///如果是时段促销  是否满足时段要求
const ynjsCx = function(bill) {
	let mcc = cxdict[bill];
	if (!mcc.yntime) {
		return true;
	} else {
		let dateTime = xprinter_util.getTime(3);
		let decnow = xprinter_util.timeTodec(dateTime);
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

///判断会员促销方式
const ynjsCxforHy = function(bill, xsCust) {
	let mcc = cxdict[bill];
	if (xsCust == null) {
		switch (mcc.CXRY) {
			case "all":
				return true;
			case "Hy":
				return false;
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

///销售方式的转变
const xsTypeCheck = function(bill, is_Xstype) {
	let mcc = cxdict[bill];
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
	let c1 = cxdict[bill];
	let ynnull = true;
	let oldclassid = "^^^^^VVV";
	let classnum = 0;
	let classidlist = new Array();
	try {
		for (let i = 0; i < cxbilldts.length; i++) {
			let classid = xprinter_util.snvl(cxbilldts[i][bill], null);
			let syqty = xprinter_util.snvl(cxbilldts[i][slttpe], 0);
			///发生参数是临时变量每次使用的时候要清理一下；
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
					classidlist.push(classid == null ? c1.SubList[0].subno : classid);
				}
			}
		}
	} catch (e) {

	}
	if (classnum < c1.SubList.length) {
		ynnull = true;
	}
	if (ynnull) {
		return null;
	} else {
		return classidlist;
	}
}

//统计大概可有多少促销发生 在销售界面上回生成小旗子
const testallcx = function(bill, pmList){
	let Lcm = 0;
    let cx = cxdict[bill];
    let currentlv = 0;
    if (cx.YN_JSLB)
    {
        currentlv = parseInt(cx.SubList[0].sublv) - 1;
    }
    let subzqty = GetSubidZqty(pmList, cx, yysl);
    for (let lv = currentlv; lv >= 0; lv--)
    {
        Lcm = getLcm(subzqty, cx, lv);
        if (Lcm > 0)
        {
            break;
        }
        else
        {
            Lcm = 0;
        }
    }
    if (Lcm > 0)
    {
        for (let i = 0; i < pmList.length; i++)
        {
            if (pmList[i] == null)
            {
                continue;
            }
            else
            {
                let dr = {};
                dr[rowid] = i.ToString();
                dr[KnCxbill] = bill;
                CxSelectTip.push(dr);
            }
        }
    }
}

///参与促销计算
const CxClasCompute = function(bill, bufflist, sltype, spdt) {
	let cx1 = cxdict[bill];
	if (cx1.YN_JSLB) {
		if (cx1.OneJs) {
			JustOnelbcx(cx1, bufflist, sltype);
		} else {
			Jslbcx(cx1, bufflist, sltype, spdt);
		}
	} else {
		FreeZhCx(cx1, bufflist, sltype, spdt);
	}
}

///只计算一次的价随量变促销
const JustOnelbcx = function(cx, pmList, qtytype) {
	try {
		let Lcm = 1;
		let currentlv = 0;
		if (cx.SubList.Count != 1) {
			return;
		}
		let subx = cx.SubList[0];
		currentlv = parseInt(subx.sublv - 1);
		while (currentlv >= 0) {
			///当前级别
			let subzqty = GetSubidZqty(pmList, cx);
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
			///发生的总金额 或者总数量
			let Fsnet = 0;
			for (let i = 0; i < pmList.Count; i++) {
				if (pmList[i] == null) {
					continue;
				}
				let currqty = xprinter_util.nnvl(cxbilldts.Rows[i][qtytype], 0);
				if (currqty == 0) {
					///没有剩余要跳出
					continue;
				}
				let oldprice = xprinter_util.nnvl(cxbilldts.Rows[i][oprice], 0);
				///取出条件数量
				let fsqty = 0;
				fsqty = currqty;
				if (subx.ZkTj == CxZkTj.Qty) {
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
						Fsnet += Math.Ceiling(Tjqty / oldprice) * oldprice;
						//Fsnet += Math.Ceiling(currqty / oldprice) * oldprice;
						Tjqty = 0;
					} else {
						Fsnet += currqty * oldprice;
						Tjqty = Tjqty - currqty * oldprice;
					}
				}
				cxbilldts[i][fscs] = fsqty;
			}
			let fsnet = {};
			fsnet.push(subx.subno, Fsnet);
			SubjustJslbCx(pmList, cx, fsnet, currentlv);
			break;
		}
	} catch (e) {

	}
}

///价随量变促销
const Jslbcx = function(cx, pmList, qtytype, spdt) {
	try {
		let Lcm = 1;
		let currentlv = 0;
		if (cx.SubList.Count != 1) {
			return;
		}
		let subx = cx.SubList[0];
		currentlv = parseInt(subx.sublv - 1);
		while (currentlv >= 0) {
			///当前级别
			let subzqty = GetSubidZqty(pmList, cx);
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
			if (subx.ZkTj == CxZkTj.Qty) {
				Tjqty = subx.QtyCondition[currentlv] * Lcm;
			} else {
				Tjqty = subx.NetCondition[currentlv] * Lcm;
			}
			///发生的总金额 或者总数量
			let Fsnet = 0;

			for (let i = 0; i < pmList.Count; i++) {
				if (pmList[i] == null) {
					continue;
				}
				let currqty = xprinter_util.nnvl(cxbilldts.Rows[i][qtytype], 0);
				if (currqty == 0) {
					///没有剩余要跳出
					continue;
				}
				let oldprice = xprinter_util.nnvl(cxbilldts.Rows[i][oprice], 0);
				///取出售价
				let Spprice = 0;
				///取出条件数量
				let fsqty = 0;

				let ynzs = true;
				let spid = xprinter_util.snvl(spdt.Rows[i]["SPID"], "");
				let zssql = " select YN_ZS from spda where spid='" + spid + "'  ";
				let zsds = SqlHelper.Exec_SqlStr(zssql, SqlHelper.dbtype.Sqlite);
				if (zsds != null && zsds.Tables.Count > 0 && zsds.Tables[0].Rows.Count > 0) {
					let iszs = xprinter_util.snvl(zsds.Tables[0].Rows[0][0], "");
					if (iszs == "N") {
						ynzs = false;
					}
				}

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
						fsqty = Math.Round(Tjqty / Spprice, 2);
						Tjqty = 0;
					} else if (currqty * Spprice >= Tjqty) //&& ynzs == true
					{
						fsqty = parseInt(Math.Ceiling(Tjqty / Spprice));
						Tjqty = 0;
					} else {
						fsqty = currqty;
						Tjqty = Tjqty - fsqty * Spprice;
					}
				}
				Fsnet = Fsnet + fsqty * oldprice;
				cxbilldts.Rows[i][fscs] = fsqty;
			}

			let fsnet = {};
			fsnet.push(subx.subno, Fsnet);

			if (Tjqty == 0) {
				SubCxQty(pmList, cx, fsnet, currentlv, Lcm);
			}
			currentlv--;
		}
	} catch (e) {

	}
}

///自由组合促销
const FreeZhCx = function(cx, pmList, qtytype, spdt) {
	///最小公倍数
	try {
		let Lcm = 1;
		///保存本次运算的数量或者金额条件
		let hashqty = {};
		let subzqty = GetSubidZqty(pmList, cx);
		Lcm = getLcm(subzqty, cx, 0);
		if (Lcm == 0) {
			return;
		}
		///发生促销的时候按类别的总售价金额
		let Fsnet = {};
		for (let i = 0; i < pmList.length; i++) {
			if (pmList[i] == null) {
				///无效的行数 要跳出
				continue;
			}
			let subid = pmList[i];
			let currqty = xprinter_util.nnvl(cxbilldts[i][qtytype], 0);
			if (currqty == 0) {
				///没有剩余要跳出
				continue;
			}
			let oldprice = xprinter_util.nnvl(cxbilldts[i][oprice], 0);
			///取出售价
			let Spprice = 0;
			///取出条件数量
			let Tjqty = 0;
			let subx = cx.SubList[subid];
			//某一行产品进行计算时进行这些计算
			if (subx.ZkTj == "Qty") {
				Spprice = 1;
				if (hashqty.ContainsKey(subid)) {
					Tjqty = hashqty[subid];
				} else {
					Tjqty = subx.QtyCondition[0] * Lcm;
					hashqty.Add(subid, Tjqty);
					Fsnet.Add(subid, 0);
				}
			} else {
				Spprice = oldprice;
				if (hashqty.ContainsKey(subid)) {
					Tjqty = hashqty[subid];
				} else {
					Tjqty = subx.NetCondition[0] * Lcm;
					hashqty.Add(subid, Tjqty);
					Fsnet.Add(subid, 0);
				}
			}
			if (Tjqty == 0) {
				///条件数量用尽要退出
				continue;
			}
			///发生数量
			let fsqty = 0;
			//这里判断商品是不是整数
			let ynzs = true;
			let spid = xprinter_util.snvl(spdt[i]["SPID"], "");
			let zssql = " select YN_ZS from spda where spid='" + spid + "'  ";
			let zsds = SqlHelper.Exec_SqlStr(zssql, SqlHelper.dbtype.Sqlite);
			if (zsds != null && zsds.Tables.Count > 0 && zsds.Tables[0].Rows.Count > 0) {
				let iszs = xprinter_util.snvl(zsds.Tables[0].Rows[0][0], "");
				if (iszs == "N") {
					ynzs = false;
				}
			}
			if (cx.OneSp) {
				fsqty = GetOneSp_Num(pmList, cx, subid, currqty, Spprice);
				if (fsqty < 0) {
					fsqty = 0;
				}
			} else {
				if (currqty * Spprice >= Tjqty && ynzs == false) {
					fsqty = Math.Round(Tjqty / Spprice, 2);
				} else if (currqty * Spprice >= Tjqty) {
					fsqty = Math.Ceiling(Tjqty / Spprice);
				} else {
					fsqty = currqty;
				}
			}

			Tjqty = Tjqty - fsqty * Spprice;
			if (Tjqty <= 0) {
				Tjqty = 0;
			}
			hashqty[subid] = Tjqty;
			Fsnet[subid] = Fsnet[subid] + fsqty * oldprice;
			cxbilldts.Rows[i][fscs] = fsqty;
		}
		SubCxQty(pmList, cx, Fsnet, 0, Lcm);
	} catch (e) {

	}
}

//组合促销计算折扣和金额的方法
const SubCxQty = function() {
	try {
		///取出表中促销单不为空的最后一行
		let lastIndex = 0;
		for (let n = pm_list.length - 1; n >= 0; n--) {
			///取出促销单不为null且有促销发生的那一行
			if (pm_list[n] != null && xprinter_util.nnvl(cxbilldts[n][fscs], 0) > 0) {
				lastIndex = n;
				break;
			}
		}
		let MinRow = null;
		for (let i = 0; i < pm_list.length; i++) {
			///累计的分摊的积分
			if (pm_list[i] == null) {
				continue;
			}
			if (xprinter_util.nnvl(cxbilldts[i][fscs], 0) == 0) {
				continue;
			}
			//产品在当前促销单下所属的类别
			let subid = pm_list[i];
			///原售价
			let price = xprinter_util.nnvl(cxbilldts[i][oprice], 0);
			//表示此行单品 在当前促销单下 发生的数量
			let fsqty = xprinter_util.nnvl(cxbilldts[i][fscs], 0);
			let subznet = fsznet[subid];
			let cxsub = cx.SubList[subid];
			let jfxs = cxsub.jfxs[level]; ///产品的积分系数
			///促销后金额/数量的  售价
			let newprice = 0;
			switch (cxsub.SubZktype) {
				case "Subdisc":
					cxbilldts.Rows[i][disc] = Math.Round(xprinter_util.nnvl(cxbilldts[i][disc], 0), 2) + Math
						.Round(((1 - cxsub.discnum[level] / 100) * price * fsqty), 2);
					newprice = price * cxsub.discnum[level] / 100;
					break;
				case "Subnet":
					let subdisc = 0;
					if (cx.OneSp) {
						let getfsnet = GetOneSpNetForQty(cx, subid, fsqty, price);
						let sublcm = 0;
						if (cxsub.ZkTj == "Net") {
							sublcm = (int)(getfsnet / cxsub.NetCondition[0]);
						} else {
							sublcm = (int)(getfsnet / cxsub.QtyCondition[0]);
						}
						subdisc = sublcm * cxsub.discnet[level];
					} else {
						subdisc = Math.Round(price * fsqty * cxsub.discnet[level] * lcm / subznet, 2);
					}
					//计算积分
					//积分相关的时候不计算折扣
					if (cx.cxtype.Equals("G") || cx.cxtype.Equals("D")) {
						try {
							if (i == lastIndex) {
								let jfnum = cx.syjf * lcm; ///变化的积分数
								let dsnum = cxsub.discnet[level] * lcm; ///变化的折扣金额
								///计算最小积分上限
								setHyjfUpleve(cx.upleave);
								///计算积分上限是否满足条件
								calculateJf(dsnum, jfnum, cx);
								setHjInfo(cx, jfxs, dsnum, jfnum);
							}
							newprice = price;
						} catch {

						}
					} else {
						newprice = (price * fsqty - subdisc) / fsqty;
						cxbilldts[i][disc] = Math.Round(xprinter_util.nnvl(cxbilldts[i][disc], 0) + subdisc,
							2);
					}
					break;
				case "zjprice":
					let zjprice = cxsub.zjprice[level];
					if (zjprice > price) {
						//cxbilldts.Rows[i][disc] = 0;
					} else {
						//计算积分
						//积分相关的时候不计算折扣
						if (cx.cxtype.Equals("G") || cx.cxtype.Equals("D")) {
							try {
								let jfnum = cx.syjf * fsqty; ///变化的积分数
								let dsnum = (price - zjprice) * fsqty; ///变化的折扣金额
								///计算最小积分上限
								setHyjfUpleve(cx.upleave);
								///计算积分上限是否满足条件
								calculateJf(dsnum,jfnum, cx);
								setHjInfo(cx, jfxs, dsnum, jfnum);
								newprice = price;
							} catch {

							}
						}
						//计算积分
						else {
							cxbilldts[i][disc] = Math.Round(SqlHelper.NNVL(cxbilldts[i][disc], 0) + (
								price - zjprice) * fsqty, 2);
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
					if (MinRow.ContainsKey(i)) {
						cxbilldts[i][disc] = Math.Round(SqlHelper.NNVL(cxbilldts[i][disc], 0) + MinRow[
							i] * Math.Round(price * (1 - cxsub.minDisc), 2), 2);
						if (fsqty != 0) {
							newprice = (fsqty * price - MinRow[i] * Math.Round(price * (1 - cxsub.minDisc), 2)) /
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
				///本次促销单中，该产品的积分 = 促销单中的积分系数 * 折扣后的价格 * 商品数量
				let currentJf = jfxs * newprice * fsqty;
				///每次这个产品有新的促销单生效的时候，都要将这一促销单的积分累加到产品这一列上
				cxbilldts[i][jfnum] = SqlHelper.NNVL(cxbilldts[i][jfnum], 0) + currentJf;
				if (!fsdcx.Contains(cxsub.subno)) {
					///积分的促销类型不在这里添加
					if (!cx.cxtype.Equals("G") && !cx.cxtype.Equals("D") && !fsdcx.Contains(cx.CxBill) && jfxs >
						0) {
						fsdcx.Add(cx.CxBill);
					}
				}
				AddCxTable(cx, subid, i, fsqty, newprice, price, level, lcm);
			} catch {
				
			}
			
			cxbilldts[i][sysl] = SqlHelper.NNVL(cxbilldts[i][sysl], 0) - fsqty;
			cxbilldts[i][fscs] = 0;

		}
	} catch (e) {
		
	}
}

//每次计算之前先设置会员积分上限
const setHyjfUpleve = function(num){
	 if (null == ManClient.hymen)
	 {
	     return;
	 }
	 let tj = 0;
	 if (null == jfinfo)
	 {
	     let hyjfnum = xprinter_util.TryParse(BALANCE);
	     if (hyjfnum <= 0)
	     {
	         return;
	     }
	     ///积分加价购
	     jfinfo = new JfSaleInfo(0, 0, PARTNER, hyjfnum, tj);
	 }
	 ///第一次赋值
	 if (jfinfo.upleve == 0)
	 {
	     jfinfo.upleve = num;
	 }
	 ///每次去最小的积分上限
	 if (num < jfinfo.upleve)
	 {
	     jfinfo.upleve = num;
	 }
}

//计算本次活动可加积分和金额
const calculateJf = function(dsnum, jfnum, cx){
	try
	{
	    ///会员为null
	    if (null == ManClient.hymen)
	    {
	        return;
	    }
	    let tj = xprinter_util.TryParse(BALANCE);
	    ///会员积分错误
	    if (tj>=0)
	    {
	        return;
	    }
	    let syjf = 0;       ///当前已经累计的积分
	    let dqjf = jfnum;   ///当前累计活动积分+本次活动积分
	    ///当前活动所包含积分
	    if (null != jfinfo)
	    {
	        syjf = jfinfo.jfnum;
	        dqjf = jfnum + syjf;
	    }
	    ///当积分超过最小上限时
	    if ((cx.upleave > 0 && dqjf > jfinfo.upleve) || dqjf > tj)
	    {
	        ////取一个比较小的金额
	        let min = tj > cx.upleave ? cx.upleave : tj;
	        ///先取商，算出剩余积分还能发生几次该促销
	        let bs = Convert.ToInt32(min - syjf) / Convert.ToInt32(cx.syjf);
	        if (bs <= 0)
	        {
	            ///当商为0时，表示一次促销都不能再发生，直接返回0
	            dsnum = 0; jfnum = 0;
	        }
	        else
	        {
	            ///当商不为0时，要取余数
	            let ys = Convert.ToInt32(min - syjf) % Convert.ToInt32(cx.syjf);
	            ///算出还能发生几次促销  （剩余积分 - 余数） / 发生一次促销的积分数
	            let time = Convert.ToInt32((min - syjf - ys) / cx.syjf);
	            dsnum = time * cx.syjf / jfnum * dsnum;
	            jfnum = time * cx.syjf;
	        }
	    }
	}
	catch
	{
		
	}
}

//设置积分相关的信息
const setHjInfo = function(cx,jfxs,net,jfnum){
	if (net == 0 || jfnum == 0)
	  {
	      return;
	  }
	  ///会员为null
	  if (null == ManClient.hymen)
	  {
	      return;
	  }
	  let tj = xprinter_util.TryParse(BALANCE);
	  ///会员积分错误
	  if (tj <= 0)
	  {
	      return;
	  }
	  let yyjf = 0;
	  ///获取当前累计的积分
	  if (null != jfinfo)
	  {
	      yyjf = jfinfo.jfnum;
	  }
	  ///当前累计积分超过会员积分的时候，就返回
	  if (tj < (jfnum + yyjf))
	  {
	      return;
	  }
	  ///积分超过积分上限的时候
	  if (cx.upleave > 0 && (jfnum + yyjf) > cx.upleave)
	  {
	      return;
	  }
	  net = Math.Round(net, 2);
	  jfnum = Math.Round(jfnum, 2);
	  ///累加金额
	  jfinfo.dhnet += net;
	  ///累加积分
	  jfinfo.jfnum += jfnum;
	  ///累计单号
	  if (!jfinfo.hdbill.Contains(cx.CxBill))
	  {
	      ///当这个促销单存在积分系数的时候，将单号的索引记录下来
	      if (jfxs > 0)
	      {
	          jfinfo.xsIndex.Add(jfinfo.hdbill.Count);
	      }
	      ///累计单号
	      jfinfo.hdbill.Add(cx.CxBill);
	      ///累计类型
	      jfinfo.hdtype.Add(cx.cxtype);
	  }
}

//
const AddCxTable = function(cx,subid,row, fsqty, newprice, price, level, PM_LCM){
	 let i = row;
	 let spid = xprinter_util.snvl(SALE002.this_dt[i][CXFS.SPID], "");
	 let xsbill = xprinter_util.snvl(SALE002.this_dt[i][ManClient.TSALE002.BILL], "");
	 let xsdate = xprinter_util.snvl(SALE002.this_dt[i][ManClient.TSALE002.SALEDATE], "");
	 let dr = {};
	 dr[SALEDATE] = xsdate;
	 dr[KHID] = app.globalData.store.KHID;
	 dr[GSID] = app.globalData.store.GSID;
	 dr[CXBILL] = cx.CxBill;
	 dr[CLASSID] = subid.substring(cx.CxBill.Length);
	 dr[XSBILL] = xsbill;
	 dr[SPID] = spid;
	 dr[XSQTY] = fsqty;
	 dr[OPRICE] = price;
	 dr[ONET] = price * fsqty;
	 dr[CXPRICE] = newprice;
	 dr[CXNET] = newprice * fsqty;
	 dr[CXLV] = level + 1;
	 dr[LCM] = PM_LCM;
	 dr[NO] = i;
	 cxfsdt.push(dr);
}

export default {
	Cxdict,
	CreateArr,
	Createcx
}
