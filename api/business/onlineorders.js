import Req from '@/utils/request.js';
import util from '@/utils/util.js';
/**
 * 获取线上订单列表
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */
export const getOnlineOrders = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetOnlineOrders";
	let reqdata = Req.resObj(true, "线上订单查询中", data, apistr);
	// Req.asyncFuncOne(reqdata, func, func);
	func({
		data: JSON.stringify([{
			"YDBILL": "K200QTD00511910151744202",
			"BILL": "K200QTD005119101517442020001",
			"DATE_DH": "2019-10-16 17:44:20",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": 279,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": null,
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2019-10-15 17:44:20",
			"CUSTMADDRESS": null,
			"CUSTMNAME": null,
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "K200QTD00522008051041560",
			"BILL": "K200QTD005220080510415600001",
			"DATE_DH": "2020-08-06 10:44:21",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15072255701",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": "自动匹配的裱花间",
			"NOTE": null,
			"SALETIME": "2020-08-05 10:41:56",
			"CUSTMADDRESS": "湖北省 武汉市 中山大道215号 武汉市第一医院 前台",
			"CUSTMNAME": "李女士",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "47"
		}, {
			"YDBILL": "K200QTD00522008061120320",
			"BILL": "K200QTD005220080611203200001",
			"DATE_DH": "2020-08-07 11:20:33",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100212",
			"SNAME": "心动8号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15926487687",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": "自动匹配裱花间",
			"NOTE": null,
			"SALETIME": "2020-08-06 11:20:32",
			"CUSTMADDRESS": "湖北省 武汉市 卓刀泉路208号湖北省荣军医院内 湖北省荣军医院门诊部 ",
			"CUSTMNAME": "章洁",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "71"
		}, {
			"YDBILL": "K200QTD00522008071638321",
			"BILL": "K200QTD005220080716383210001",
			"DATE_DH": "2020-08-08 16:38:32",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100096",
			"SNAME": "樱桃诱惑6号-仟吉",
			"PRICE": 139,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15072255701",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-08-07 16:38:32",
			"CUSTMADDRESS": "湖北省 武汉市 雄楚大道499号 外经贸学院职工宿舍 ",
			"CUSTMNAME": "李女士",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "103"
		}, {
			"YDBILL": "K200QTD00522008071639362",
			"BILL": "K200QTD005220080716393620001",
			"DATE_DH": "2020-08-08 16:39:36",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100096",
			"SNAME": "樱桃诱惑6号-仟吉",
			"PRICE": 139,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15090961095",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-08-07 16:39:36",
			"CUSTMADDRESS": "湖北省 武汉市 雄楚大街489号 领秀城2期 ",
			"CUSTMNAME": "章先生",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "66"
		}, {
			"YDBILL": "K200QTD00522008071640213",
			"BILL": "K200QTD005220080716402130001",
			"DATE_DH": "2020-08-08 16:40:26",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100119",
			"SNAME": "果果庄园6号-仟吉",
			"PRICE": 139,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15926487687",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-08-07 16:40:21",
			"CUSTMADDRESS": "湖北省 武汉市 卓刀泉路208号湖北省荣军医院内 湖北省荣军医院门诊部 ",
			"CUSTMNAME": "章洁",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "71"
		}, {
			"YDBILL": "K200QTD00542008171729350",
			"BILL": "K200QTD005420081717293500001",
			"DATE_DH": "2020-08-19 17:29:39",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K930BHD002",
			"KHSNAME": "长沙香樟路店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": 279,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13000000022",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-08-17 17:29:35",
			"CUSTMADDRESS": "湖南省 长沙市 人民东路516号 万科·西街花园 A区1栋1801",
			"CUSTMNAME": "王莽莽",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K933",
			"NO": 0,
			"GSID_BH": "K930",
			"NOTE2": "156"
		}, {
			"YDBILL": "K200QTD00542008182051050",
			"BILL": "K200QTD005420081820510500001",
			"DATE_DH": "2020-08-19 20:51:12",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD032",
			"KHSNAME": "武汉菱角湖万达店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": 279,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-08-18 20:51:05",
			"CUSTMADDRESS": "湖北省 武汉市 振兴路288号(百盛量贩店旁) 航天花园 ",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "29"
		}, {
			"YDBILL": "K200QTD00542008182057150",
			"BILL": "K200QTD005420081820571500001",
			"DATE_DH": "2020-08-19 21:05:54",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K930BHD002",
			"KHSNAME": "长沙香樟路店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": 279,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13000000022",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-08-18 20:57:15",
			"CUSTMADDRESS": "湖南省 长沙市 人民东路516号 万科·西街花园 A区1栋1801",
			"CUSTMNAME": "王莽莽",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K933",
			"NO": 0,
			"GSID_BH": "K930",
			"NOTE2": "156"
		}, {
			"YDBILL": "K200QTD00542008210930320",
			"BILL": "K200QTD005420082109303200001",
			"DATE_DH": "2020-08-20 10:30:52",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": 279,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-08-21 09:30:32",
			"CUSTMADDRESS": "湖北省 武汉市 振兴路288号(百盛量贩店旁) 航天花园 ",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "29"
		}, {
			"YDBILL": "K200QTD00522008261128110",
			"BILL": "K200QTD005220082611281100001",
			"DATE_DH": "2020-08-26 12:49:08",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD093",
			"KHSNAME": "武汉长风路店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15072255702",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": "加急的",
			"NOTE": null,
			"SALETIME": "2020-08-26 11:28:11",
			"CUSTMADDRESS": "湖北省 武汉市 高新大道501号 华中科技大学同济医学院附属同济医院(光谷院区) 一楼大厅",
			"CUSTMNAME": "李女士",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "337"
		}, {
			"YDBILL": "K200QTD00522009011821230",
			"BILL": "K200QTD005220090118212300001",
			"DATE_DH": "2020-09-01 19:21:26",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD051",
			"KHSNAME": "武汉东湖尚郡店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15926487687",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-01 18:21:23",
			"CUSTMADDRESS": "湖北省 武汉市 梨园街道欢乐大道东湖尚郡东门 东湖尚郡3栋  ",
			"CUSTMNAME": "章洁",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "357"
		}, {
			"YDBILL": "K200QTD00522008061007560",
			"BILL": "K200QTD005220080610075600004",
			"DATE_DH": "2020-09-01 10:17:19",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100084",
			"SNAME": "黄金城堡8号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": "裱花间区域内（交界处）",
			"NOTE": null,
			"SALETIME": "2020-08-06 10:07:56",
			"CUSTMADDRESS": "湖北省 武汉市 振兴路288号(百盛量贩店旁) 航天花园 ",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "71"
		}, {
			"YDBILL": "K200QTD00522009011944390",
			"BILL": "K200QTD005220090119443900001",
			"DATE_DH": "2020-09-01 21:00:07",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD008",
			"KHSNAME": "武汉三弓路店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15072255702",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-01 19:44:39",
			"CUSTMADDRESS": "湖北省 武汉市 高新大道501号 华中科技大学同济医学院附属同济医院(光谷院区) 一楼大厅",
			"CUSTMNAME": "李女士",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": "48"
		}, {
			"YDBILL": "K200QTD00522009012012030",
			"BILL": "K200QTD005220090120120300001",
			"DATE_DH": "2020-09-02 16:09:07",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD001",
			"KHSNAME": "武汉金色华府店裱花间-KG",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-01 20:12:03",
			"CUSTMADDRESS": "湖北省 武汉市 振兴路288号(百盛量贩店旁) 航天花园 ",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "51"
		}, {
			"YDBILL": "K200QTD00542009021918590",
			"BILL": "K200QTD005420090219185900001",
			"DATE_DH": "2020-09-03 19:19:07",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": null,
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-02 19:18:59",
			"CUSTMADDRESS": null,
			"CUSTMNAME": null,
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "K200QTD00532009081628540",
			"BILL": "K200QTD005320090816285400001",
			"DATE_DH": "2020-09-08 17:29:09",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD032",
			"KHSNAME": "武汉菱角湖万达店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-08 16:28:54",
			"CUSTMADDRESS": "湖北省武汉市江汉区沿江大道129号江汉关博物馆",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "29"
		}, {
			"YDBILL": "K200QTD00532009081631191",
			"BILL": "K200QTD005320090816311910001",
			"DATE_DH": "2020-09-08 18:31:24",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-08 16:31:19",
			"CUSTMADDRESS": "zzz",
			"CUSTMNAME": null,
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "K200QTD00532009071736560",
			"BILL": "K200QTD005320090717365600001",
			"DATE_DH": "2020-09-08 18:39:57",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD032",
			"KHSNAME": "武汉菱角湖万达店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-07 17:36:56",
			"CUSTMADDRESS": "湖北省 武汉市 振兴路288号(百盛量贩店旁) 航天花园 ",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "29"
		}, {
			"YDBILL": "K200QTD00532009081658030",
			"BILL": "K200QTD005320090816580300001",
			"DATE_DH": "2020-09-09 16:58:38",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD032",
			"KHSNAME": "武汉菱角湖万达店裱花间",
			"SPID": "000000001090100003",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 359,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-08 16:58:03",
			"CUSTMADDRESS": "湖北省 武汉市 振兴路288号(百盛量贩店旁) 航天花园 ",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "29"
		}, {
			"YDBILL": "K200QTD00542009161826000",
			"BILL": "K200QTD005420091618260000001",
			"DATE_DH": "2020-09-16 19:26:11",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD032",
			"KHSNAME": "武汉菱角湖万达店裱花间",
			"SPID": "000000001090100003",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 359,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "18601612052",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2020-09-16 18:26:00",
			"CUSTMADDRESS": "湖北省武汉市江汉区常青街中共江汉区常青街扬子社区委员会",
			"CUSTMNAME": "黄大仙",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "414"
		}, {
			"YDBILL": "K200QTD00532103080910491",
			"BILL": "K200QTD005321030809104910001",
			"DATE_DH": "2021-03-09 09:10:49",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K210BHD093",
			"KHSNAME": "武汉长风路店裱花间",
			"SPID": "000000001090100065",
			"SNAME": "扑通扑通心动6号-仟吉",
			"PRICE": 139,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15926487687",
			"THTYPE": "1-宅配到家",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2021-03-08 09:10:49",
			"CUSTMADDRESS": "湖北省 武汉市 光谷三路",
			"CUSTMNAME": "章洁",
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K213",
			"NO": 0,
			"GSID_BH": "K210",
			"NOTE2": "298"
		}, {
			"YDBILL": "K200QTD00572112131450360",
			"BILL": "K200QTD005721121314503600001",
			"DATE_DH": "2021-12-14 14:50:37",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15926487687",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2021-12-13 14:50:36",
			"CUSTMADDRESS": null,
			"CUSTMNAME": null,
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "K200QTD00572112201038490",
			"BILL": "K200QTD005721122010384900001",
			"DATE_DH": "2021-12-21 10:38:51",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15926487687",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2021-12-20 10:38:49",
			"CUSTMADDRESS": null,
			"CUSTMNAME": null,
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "K200QTD00572112201600531",
			"BILL": "K200QTD005721122016005310001",
			"DATE_DH": "2021-12-21 16:00:56",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "15926487687",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2021-12-20 16:00:53",
			"CUSTMADDRESS": null,
			"CUSTMNAME": null,
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "71053262379597168",
			"BILL": "710532623795971680001",
			"DATE_DH": "2022-03-08 18:40:00",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": null,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13487315125_6461",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220308184000",
			"NOTE": null,
			"SALETIME": "2022-03-08 23:57:25",
			"CUSTMADDRESS": "锑都家园 (15栋2单元603)湖南省长沙市岳麓区学士街道锑都家园1期",
			"CUSTMNAME": "何薇(女士)",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "71053262379597111",
			"BILL": "710532623795971110001",
			"DATE_DH": "2022-03-09 18:40:00",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": 10.9,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13487315125_6461",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220309184000",
			"NOTE": null,
			"SALETIME": "2022-03-09 23:57:25",
			"CUSTMADDRESS": "锑都家园 (15栋2单元603)湖南省长沙市岳麓区学士街道锑都家园1期",
			"CUSTMNAME": "何薇(女士)",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "71053262379597111",
			"BILL": "710532623795971110002",
			"DATE_DH": "2022-03-09 18:40:00",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100003",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 10.9,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13487315125_6461",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220309184000",
			"NOTE": null,
			"SALETIME": "2022-03-09 23:57:25",
			"CUSTMADDRESS": "锑都家园 (15栋2单元603)湖南省长沙市岳麓区学士街道锑都家园1期",
			"CUSTMNAME": "何薇(女士)",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "71053262379597222",
			"BILL": "710532623795972220001",
			"DATE_DH": "2022-03-09 18:40:00",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100002",
			"SNAME": "樱桃诱惑10号-仟吉",
			"PRICE": 10.9,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13487315125_6461",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220309184000",
			"NOTE": null,
			"SALETIME": "2022-03-09 23:57:25",
			"CUSTMADDRESS": "锑都家园 (15栋2单元603)湖南省长沙市岳麓区学士街道锑都家园1期",
			"CUSTMNAME": "何薇(女士)",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "71053262379597222",
			"BILL": "710532623795972220002",
			"DATE_DH": "2022-03-09 18:40:00",
			"DHSJD": "3",
			"SSSD": "14-24",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100003",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 10.9,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13487315125_6461",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220309184000",
			"NOTE": null,
			"SALETIME": "2022-03-09 23:57:25",
			"CUSTMADDRESS": "锑都家园 (15栋2单元603)湖南省长沙市岳麓区学士街道锑都家园1期",
			"CUSTMNAME": "何薇(女士)",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "E20220314102038088500059",
			"BILL": "E202203141020380885000590001",
			"DATE_DH": "2022-03-15 02:00:00",
			"DHSJD": "1",
			"SSSD": "0-7",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13247102760",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220315030000",
			"NOTE": null,
			"SALETIME": "2022-03-14 10:20:39",
			"CUSTMADDRESS": "华鼎·丽都国际5栋 501",
			"CUSTMNAME": "晏",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "WMYS",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "E20220315155918088500021",
			"BILL": "E202203151559180885000210001",
			"DATE_DH": "2022-03-16 09:00:00",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13247102760",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220316100000",
			"NOTE": null,
			"SALETIME": "2022-03-15 15:59:19",
			"CUSTMADDRESS": "华鼎·丽都国际5栋 501",
			"CUSTMNAME": "晏",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 2,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "E20220315155918088500021",
			"BILL": "E202203151559180885000210002",
			"DATE_DH": "2022-03-16 09:00:00",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090101671",
			"SNAME": "109工厂蛋糕测试0315",
			"PRICE": 100,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13247102760",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220316100000",
			"NOTE": null,
			"SALETIME": "2022-03-15 15:59:19",
			"CUSTMADDRESS": "华鼎·丽都国际5栋 501",
			"CUSTMNAME": "晏",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "E20220315185252088500005",
			"BILL": "E202203151852520885000050001",
			"DATE_DH": "2022-03-17 10:00:00",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090101671",
			"SNAME": "109工厂蛋糕测试0315",
			"PRICE": 100,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13247102760",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220317110000",
			"NOTE": null,
			"SALETIME": "2022-03-15 18:52:53",
			"CUSTMADDRESS": "华鼎·丽都国际5栋 501",
			"CUSTMNAME": "晏",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "WMYS",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "E20220317114330088500011",
			"BILL": "E202203171143300885000110001",
			"DATE_DH": "2022-03-18 11:00:00",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13247102760",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220318110000",
			"NOTE": null,
			"SALETIME": "2022-03-17 11:43:30",
			"CUSTMADDRESS": "韩家墩街道古四小路华鼎·丽都国际华鼎·丽都国际9栋",
			"CUSTMNAME": "晏红阳",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "WMYS",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "K200QTD00521812281116521",
			"BILL": "K200QTD005218122811165210001",
			"DATE_DH": "2022-04-28 10:29:40",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100084",
			"SNAME": "黄金城堡8号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": " ",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2018-12-28 11:16:52",
			"CUSTMADDRESS": null,
			"CUSTMNAME": null,
			"BILLDISC": null,
			"CARDID": "普通蛋糕",
			"PLATTYPE": "N",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 0,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "E2022031410203808850005",
			"BILL": "E20220314102038088500050001",
			"DATE_DH": "2022-04-30 02:00:00",
			"DHSJD": "1",
			"SSSD": "0-7",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 189,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13247102760",
			"THTYPE": "0-自提",
			"CUSTMCOMM": "20220430030000",
			"NOTE": null,
			"SALETIME": "2022-04-30 10:20:39",
			"CUSTMADDRESS": "华鼎·丽都国际5栋 501",
			"CUSTMNAME": "杨",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "WMYS",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "LH202207190005",
			"BILL": "LH2022071900050001",
			"DATE_DH": "2022-07-19 11:00:00",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 149,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13866191210",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2022-07-19 00:00:00",
			"CUSTMADDRESS": "（请忽略包河区定位地址提货门店请以下单时备注的自提门店为准）",
			"CUSTMNAME": "武先生",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "ONLINE",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "LH202207190006",
			"BILL": "LH2022071900060001",
			"DATE_DH": "2022-07-19 11:00:00",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 149,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13866191210",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2022-07-19 00:00:00",
			"CUSTMADDRESS": "（请忽略包河区定位地址提货门店请以下单时备注的自提门店为准）",
			"CUSTMNAME": "武先生",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "ONLINE",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}, {
			"YDBILL": "LH202207190007",
			"BILL": "LH2022071900070002",
			"DATE_DH": "2022-07-19 11:00:00",
			"DHSJD": "2",
			"SSSD": "7-14",
			"KHID": "K200QTD005",
			"KHID_BH": "K200BHD005",
			"KHSNAME": "武汉领秀城店裱花间",
			"SPID": "000000001090100001",
			"SNAME": "樱桃诱惑12号-仟吉",
			"PRICE": 149,
			"ZQTY_SQ": 1,
			"OKGO": 0,
			"CANCEL": 0,
			"CUSTMPHONE": "13866191210",
			"THTYPE": "0-自提",
			"CUSTMCOMM": null,
			"NOTE": null,
			"SALETIME": "2022-07-19 00:00:00",
			"CUSTMADDRESS": "（请忽略包河区定位地址提货门店请以下单时备注的自提门店为准）",
			"CUSTMNAME": "武先生",
			"BILLDISC": null,
			"CARDID": "N",
			"PLATTYPE": "ONLINE",
			"FAILREASON": null,
			"UNIT": "个",
			"GCID": "K203",
			"NO": 1,
			"GSID_BH": "K200",
			"NOTE2": null
		}])
	})
}

/**
 * 获取到货时间段
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const getTimeRange = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetTimeRange";
	let reqdata = Req.resObj(true, "时间段查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

/**
 * 获取裱花间列表
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const getRoom = function(data, func) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.GetRoom";
	let reqdata = Req.resObj(true, "裱花间查询中", data, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}

/**
 * 线上订单处理中
 * @param {*} data 查询参数
 * @param {*} func 回调函数
 */
export const ordersAccept = function(data, func, err) {
	let apistr = "MobilePos_API.Models.SALE001CLASS.OrdersAccept";
	let reqdata = Req.resObj(true, "订单处理中", data, apistr);
	Req.asyncFuncOne(reqdata, func, err);
}
