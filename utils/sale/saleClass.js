var sale001 = function(pm_obj) {
	this.CLTIME = null;
	this.CUSTID = null;
	this.XSPTID = null;
	this.YN_DCDG = null;
	this.YN_HH = null;
	this.DKFID = null;
	this.BMID = null;
	this.KCDID = null;
	this.DPID = null;
	this.GCID = null;
	this.GSID = null;
	this.STR2 = null;
	this.STR1 = null;
	this.ERRINO = null;
	this.ERRID = null;
	this.TIME = 0
	this.WEEK = 0
	this.MONTH = 0
	this.YAER = 0
	this.YN_SC = null;
	this.REASON = null;
	this.TDISC = 0
	this.TLSDISC = 0
	this.TTPDISC = 0
	this.TBZDISC = 0
	this.THYDISC = 0
	this.HYJF = 0
	this.CARDID = null;
	this.CUID = null;
	this.TCXDISC = 0
	this.CXTNET = 0
	this.CHANGENET = 0
	this.ROUND = 0
	this.BILLDISC = 0;
	this.ZNET = 0
	this.DNET = 0
	this.TNET = 0
	this.TLINE = 0
	this.XS_GSID = null;
	this.XS_KHID = null;
	this.XS_DATE = null;
	this.XS_POSID = null;
	this.XS_BILL = null;
	this.XSTYPE = null;
	this.BILL_TYPE = null;
	this.RYID = null;
	this.BILL = null;
	this.POSID = null;
	this.KHID = null;
	this.SALETIME = null;
	this.SALEDATE = null;
	this.THTYPE = null;
	this.ZTMSTR = null;
	this.KQXSTYPE = null;
	this.YN_JLTH = null;
	this.YN_OK = null;
	this.CUSTMTIME = null;
	this.CUSTMCOMM = null;
	this.CUSTMADDRESS = null;
	this.CUSTMPHONE = null;
	this.CUSTMNAME = null;
	for (var item in pm_obj) {
		this[item] = pm_obj[item];
	}
}
var ydsale001 = function(pm_obj) {
	this.CLTIME = null;
	this.CUSTID = null;
	this.XSPTID = null;
	this.YN_DCDG = null;
	this.YN_HH = null;
	this.DKFID = null;
	this.BMID = null;
	this.KCDID = null;
	this.DPID = null;
	this.GCID = null;
	this.GSID = null;
	this.STR2 = null;
	this.STR1 = null;
	this.ERRINO = null;
	this.ERRID = null;
	this.TIME = 0
	this.WEEK = 0
	this.MONTH = 0
	this.YAER = 0
	this.YN_SC = null;
	this.REASON = null;
	this.TDISC = 0
	this.TLSDISC = 0
	this.TTPDISC = 0
	this.TBZDISC = 0
	this.THYDISC = 0
	this.HYJF = 0
	this.CARDID = null;
	this.CUID = null;
	this.TCXDISC = 0
	this.CXTNET = 0
	this.CHANGENET = 0
	this.ROUND = 0
	this.BILLDISC = null;
	this.ZNET = 0
	this.DNET = 0
	this.TNET = 0
	this.TLINE = 0
	this.XS_GSID = null;
	this.XS_KHID = null;
	this.XS_DATE = null;
	this.XS_POSID = null;
	this.XS_BILL = null;
	this.XSTYPE = null;
	this.BILL_TYPE = null;
	this.RYID = null;
	this.BILL = null;
	this.POSID = null;
	this.KHID = null;
	this.SALETIME = null;
	this.SALEDATE = null;
	this.THTYPE = null;
	this.ZTMSTR = null;
	this.KQXSTYPE = null;
	this.YN_JLTH = null;
	this.YN_OK = null;
	this.CUSTMTIME = null;
	this.CUSTMCOMM = null;
	this.CUSTMADDRESS = null;
	this.CUSTMPHONE = null;
	this.CUSTMNAME = null;
	for (var item in pm_obj) {
		this[item] = pm_obj[item];
	}
}
var sale002 = function(pm_obj) {
	this.SALEDATE = null;
	this.XPDGCOM = null;
	this.XPDGSTR = null;
	this.SBERR = null;
	this.YN_SB = null;
	this.MYSTR = null;
	this.SPJGZ = null;
	this.YN_XPDG = null;
	this.BMID = null;
	this.RYID = null;
	this.KCDID = null;
	this.DPID = null;
	this.GCID = null;
	this.STR2 = null;
	this.STR1 = null;
	this.TIME = 0
	this.WEEK = 0
	this.MONTH = 0
	this.YAER = 0
	this.HYJFCD = 0
	this.JFDISC = 0
	this.HYJF = 0
	this.LSDISC = 0
	this.TPDISC = 0
	this.BZDISC = 0
	this.HYDISC = 0
	this.YN_HYDISC = null;
	this.CXID = null;
	this.CXDISC = 0
	this.YN_CXDISC = null;
	this.BILLDISC = 0
	this.DISC_TYPE = null;
	this.DISC = 0
	this.YN_SKYDISC = null;
	this.HYBL = 0
	this.DISCRATE = 0
	this.BRANDID = null;
	this.HTID = null;
	this.GYSID = null;
	this.NET = 0
	this.OPRICE = 0
	this.PRICE = 0
	this.MINSQTY = 0
	this.QTY = 0
	this.UNIT = null;
	this.SERIAL = null;
	this.BARCODE = null;
	this.PLID = null;
	this.NO = 0
	this.SPID = null;
	this.BILL = null;
	this.POSID = null;
	this.KHID = null;
	this.SALETIME = null;
	for (var item in pm_obj) {
		if (this[item]) { //存在即赋值
			this[item] = pm_obj[item];
		}
	}
}

var sale003 = function() {
	this.SALEDATE = null;
	this.DISC = 0
	this.ZKLX = null;
	this.YN_ZQ = null;
	this.YN_ST = null;
	this.YN_JL = null;
	this.YN_LP = null;
	this.YN_YLTH = null;
	this.BMID = null;
	this.RYID = null;
	this.KCDID = null;
	this.DPID = null;
	this.GCID = null;
	this.CZK_AK = 0
	this.STR2 = null;
	this.STR1 = null;
	this.AUTH = null;
	this.TIME = 0
	this.WEEK = 0
	this.MONTH = 0
	this.YAER = 0
	this.SAVE_JE = 0
	this.SAVE_JEO = 0
	this.IDTYPE = null;
	this.ID = null;
	this.DSFKD = 0
	this.RATE = 0
	this.FAMT = 0
	this.AMT = 0
	this.FKID = null;
	this.NO = 0
	this.BILL = null;
	this.POSID = null;
	this.KHID = null;
	this.SALETIME = null;
}

var sale008 = function() {
	this.SALEDATE = null;
	this.NOTE = null;
	this.PRICE = 0;
	this.QTY = 0;
	this.OPTMAT = "";
	this.CSTCODE = "";
	this.OPTCODE = "";
	this.ATTNAME = "";
	this.ATTCODE = "";
	this.NO = 0;
	this.SPID = "";
	this.BILL = "";
	this.POSID = "";
	this.KHID = "";
	this.GCID = "";
	this.SALETIME = ""
}

var ydsale001 = function() {
	this.SALEDATE = "";
	this.SALETIME = "";
	this.KHID = "";
	this.POSID = "";
	this.BILL = "";
	this.RYID = "";
	this.YD_STATUS = "";
	this.TLINE = "";
	this.TNET = "";
	this.DNET = "";
	this.ZNET = "";
	this.BILLDISC = "";
	this.ROUND = "";
	this.CHANGENET = "";
	this.CXTNET = "";
	this.TCXDISC = "";
	this.CUID = "";
	this.CARDID = "";
	this.HYJF = "";
	this.THYDISC = "";
	this.TDISC = "";
	this.CUSTMNAME = "";
	this.CUSTMADDRESS = "";
	this.THDATE = "";
	this.CUSTMCOMM = "";
	this.THKHID = "";
	this.CUSTMPHONE = "";
	this.STR1 = "";
	this.STR2 = "";
	this.GSID = "";
	this.GCID = "";
	this.DPID = "";
	this.KCDID = "";
	this.BMID = "";
	this.SJTHDATE = "";
	this.SJTHGSID = "";
	this.SJTHGCID = "";
	this.SJTHDPID = "";
	this.SJTHKCDID = "";
	this.SJTHKHID = "";
	this.SJTHPOSID = "";
	this.SJTHBILL = "";
	this.ID_RY_TH = "";
	this.THTYPE = "";
	this.NOTE1 = "";
	this.NOTE2 = "";
	this.PLATTYPE = "";
	this.YDSPTYPE = "";
}

var ydsale002 = function() {
	this.BILL = "";
	this.SPID = "";
	this.NO = "";
	this.QTY = "";
	this.SCQTY = "";
}

var ydsale003 = function() {
	this.BILL = "";
	this.SPID = "";
	this.NO = "";
	this.SPIDNR = "";
	this.ZQTY = "";
	this.XPSTR = "";
	this.XPSCOM = "";
	this.DQTY = "";
}

var ywbhqh = function(pm_obj) {
	this.BILL = "";
	this.GSID = "";
	this.KHID = "";
	this.GSID_BH = "";
	this.KHID_BH = "";
	this.DATE_DH = "";
	this.DHSJD = "";
	this.SPID = "";
	this.PRICE = 0;
	this.ZQTY_SQ = 0;
	this.SCDATE = "";
	this.ZQTY_SC = "";
	this.BHPS_STATUS = "";
	this.PSDATE = "";
	this.ZQTY_PS = "";
	this.QXDATE = "";
	this.ZQTY_QX = "";
	this.YN_YD = "";
	this.BILL_YD = "";
	this.DATE_YD = "";
	this.YN_PRINT = "";
	this.BILL_STATUS = "";
	this.NOTE = "";
	this.ID_RY_LR = "";
	this.DATE_LR = "";
	this.ID_RY_XG = "";
	this.DATE_XG = "";
	this.RYNAME_LR = "";
	this.RYNAME_XG = "";
	this.DATE_QT = "";
	this.POSID = "";
	this.BILL_QT = "";
	this.PSTYPE = "";
	this.YN_PUSH = "";
	this.QH_NOTE = "";
	this.GCID = "";
	this.DPID = "";
	this.KCDID = "";
	this.GCID_BH = "";
	this.DPID_BH = "";
	this.KCDID_BH = "";
	this.ID_RY_QX = "";
	this.YN_TX = "";
	this.NO = "";
	this.YN_JJ = "";
	for (var item in pm_obj) {
		if (this[item]) {
			this[item] = pm_obj[item];
		}
	}
}

var sxsale001 = function(pm_obj) {
	this.SALETIME = null;
	this.SALEDATE = null;
	this.RYID = null;
	this.BILL = null;
	this.POSID = null;
	this.KHID = null;
	this.SX_STATUS = 0;
	this.CUID = null;
	this.TCXDISC = 0;
	this.CXTNET = 0;
	this.CHANGENET = 0;
	this.ROUND = 0;
	this.BILLDISC = 0;
	this.ZNET = 0;
	this.DNET = 0;
	this.TNET = 0;
	this.TLINE = 0;
	this.CARDID = null;
	this.THYDISC = 0;
	this.HYJF = 0;
	this.CARDID = null;
	this.TDISC = 0;
	this.CUSTMADDRESS = null;
	this.CUSTMPHONE = null;
	this.CUSTMNAME = null;
	this.THDATE = null;
	this.ID_RY_TH = null;
	this.DKFID = null;
	this.DKFNAME = null;
	this.STR1 = null;
	this.STR2 = null;
	this.KCDID = null;
	this.DPID = null;
	this.GCID = null;
	this.GSID = null;
	this.NOTE1 = null;
	this.NOTE2 = null;
	this.PLATTYPE = null;
	this.YDSPTYPE = null;

	for (var item in pm_obj) {
		if (this[item]) {
			this[item] = pm_obj[item];
		}
	}
}

var ywsxjs = function(init) {
	this.BILL = "";
	this.DKFID = "";
	this.DKFNAME = "";
	this.KHID = "";
	this.BILL_STATUS = "";
	this.TPNET = 0;
	this.TJSNET = 0;
	this.NOTE = "";
	this.ID_RY_LR = "";
	this.DATE_LR = "";
	this.RYNAME_LR = "";
	this.DATE_QT = "";
	this.POSID = "";
	this.BILL_QT = "";
	this.DPID = "";
	if(init) Object.cover(ywsxjs,init);
}

var ywsxjsmx = function() {
	this.BILL = "";
	this.BILL_SX = "";
	this.YWID = "";
	this.DNET = 0;
	this.JSNET = 0;
	this.NOTE = "";
}

var ywsxfk = function() {
	this.BILL = "";
	this.FKID = "";
	this.AMT = 0;
	this.NOTE = "";
	this.NO = 0;
	this.JK_STATUS = "";
	this.JK_DATE = "";
	this.JK_ERRID = "";
	this.ZKLX = "";
	this.DISC = 0;
}

var saleBillType = [
	"NONE",

	"Z101", //门零现场商品销售订单

	"Z151", //现场退货

	"Z121", //门零预订单

	"Z171", //门零预订单退单

	"Z101",

	"Z104", //门零现场商品赊销订单

	"Z104", //门零现场商品赊销订单

	"Z101", //线上订单提取

	"Z112", //门零现场卡券赊销订单

	"Z123", //门零电商商品预订单

	"Z111", //门零现场卡券销售订单

	"Z301", //区域渠道商品销售订单

	"Z351", // 赊销预定取消

	"Z102", // 外卖预订单

	"Z152" // 外卖退货单
]

export default {
	sale001,
	sale002,
	sale003,
	ydsale001,
	ydsale002,
	ydsale003,
	ywbhqh,
	sxsale001,
	ywsxjs,
	ywsxjsmx,
	ywsxfk,
	sale008,
	saleBillType
}
