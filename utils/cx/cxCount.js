import Req from '@/utils/request.js';
import aes from '@/utils/encrypt/encrypt.js';
import util from '@/utils/util.js';
import xprinter_util from '@/utils/xprinter/util.js';
import getCxSql_db from '@/utils/cx/getCxSql.js'
import internal from 'stream';

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

///从数据库中取出所有的促销信息，然后创建促销信息 创建缓存表格
const Cxdict = async () => {
	console.log("CxSelectTip集合：", CreateArr(cxSelectTipColumn));
	console.log("cxbilldts集合：", CreateArr(cxbilldtsColumn));
	console.log("cxfsdt集合：", CreateArr(cxfsdtColumn));

	cxSelectTip = CreateArr(cxSelectTipColumn);
	cxbilldts = CreateArr(cxbilldtsColumn);
	cxfsdt = CreateArr(cxfsdtColumn);

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
		C1.CxZt = ZT;
		C1.ynzd = xprinter_util.ynToBool(YNZD);
		C1.YN_JSLB = xprinter_util.ynToBool(YNJSLB);
		C1.cxtype = YNJSLB;
		C1.upleave = cxjfup;

		try {
			let typeArr = CxSaleStr.Split('-');
			if (typeArr.Length == 2) {
				C1.YdminTimeOut = parseInt(typeArr[1]);
			}
			C1.Cxztype = "";
		} catch (e) {
		    C1.Cxztype = "None";
		    C1.YdminTimeOut = 6;
		}
		if(YNJSLB == "J"){
			C1.YN_JSLB = true;
            C1.OneJs = true;
		}
		if(YNJSLB == "T"){
			C1.OneSp = true;
		}
		C1.CXRY = "";
		C1.yntime = xprinter_util.ynToBool(yn_time);
		C1.nofktype = nfktype.Split(',');
		C1.nofkSTR = nfktype;
        if (C1.yntime)
        {
			
        }
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

export default {
	Cxdict,
	CreateArr
}
