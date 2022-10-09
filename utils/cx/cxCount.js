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
//销售方式
let hylv = "HYLV";
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

// dscxm = [
//     {
//         "BILL": "FZCX2208110002", 
//         "BILL_STATUS": "1", 
//         "CXRY": "2", 
//         "CXZT": "测试积分抵现，购买吐司满30元可使用5积分减5元", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "D", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "BILL_STATUS": "1", 
//         "CXRY": "2", 
//         "CXZT": "积分加价购", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "1", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "G", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "BILL_STATUS": "1", 
//         "CXRY": "2", 
//         "CXZT": "测试，购买脆性干点满35，可使用5积分抵现5元", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "D", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "BILL_STATUS": "1", 
//         "CXRY": "2", 
//         "CXZT": "测试积分加价购", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "1", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "G", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试阶梯促销", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "J", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试普通促销，购买四个送一个", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试组合促销，购买干点商品满40元送饮品一杯", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试同种商品促销，吐司类商品大降价", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-08-11 00:00:00", 
//         "YN_JSLB": "T", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209130001", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10802类商品，满20减3", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-13 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10803类商品，满30减5", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-13 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10804类商品，满40元，八折", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-13 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10805类商品，5个九折", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-13 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209130006", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10806类商品，3个减10元", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-13 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10807类最小金额优惠", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-14 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209140002", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10808类满足金额最小金额优惠", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-14 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "测试促销，10809类商品，价随量变", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-14 00:00:00", 
//         "YN_JSLB": "Y", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "价随量变", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-19 00:00:00", 
//         "YN_JSLB": "Y", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "价随", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-22 00:00:00", 
//         "YN_JSLB": "Y", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "组合1", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-23 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "BILL_STATUS": "1", 
//         "CXRY": "1", 
//         "CXZT": "水吧促销", 
//         "CX_WEEK": "1,2,3,4,5,6,7", 
//         "EDATE": "2022-10-31 00:00:00", 
//         "HYLV": "0", 
//         "KHID": "K200QTD005", 
//         "SDATE": "2022-09-30 00:00:00", 
//         "YN_JSLB": "N", 
//         "YN_TIME": "N", 
//         "YN_ZD": "N"
//     }
// ];

// dscxclass = [
//     {
//         "BILL": "FZCX2209190003", 
//         "CHANGELV": "3", 
//         "CLASSID": "FZCX22091900031", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 90, 
//         "MJ_DISC2": 70, 
//         "MJ_DISC3": 30, 
//         "XX_QTY1": 2, 
//         "XX_QTY2": 5, 
//         "XX_QTY3": 9, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CHANGELV": "3", 
//         "CLASSID": "FZCX22092200021", 
//         "DISCTYPE": "3", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "XX_QTY1": 3, 
//         "XX_QTY2": 5, 
//         "XX_QTY3": 8, 
//         "ZJPRICE1": 10, 
//         "ZJPRICE2": 5, 
//         "ZJPRICE3": 3, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22092300031", 
//         "DISCTYPE": "1", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 0, 
//         "XX_QTY1": 1, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CHANGELV": "3", 
//         "CLASSID": "FZCX22091400031", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 90, 
//         "MJ_DISC2": 85, 
//         "MJ_DISC3": 70, 
//         "XX_QTY1": 2, 
//         "XX_QTY2": 3, 
//         "XX_QTY3": 5, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209140002", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22091400021", 
//         "DISCTYPE": "4", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 1, 
//         "XX_NET1": 50, 
//         "ZKTYPE": "2"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22091400011", 
//         "DISCTYPE": "4", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 1, 
//         "XX_QTY1": 5, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209130006", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22091300061", 
//         "DISCTYPE": "1", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 10, 
//         "XX_QTY1": 3, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22081100041", 
//         "DISCTYPE": "1", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 5, 
//         "SYJF": 5, 
//         "XX_NET1": 35, 
//         "ZKTYPE": "2"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22081100031", 
//         "DISCTYPE": "3", 
//         "JFFACTOR1": 3, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "SYJF": 5, 
//         "XX_QTY1": 2, 
//         "ZJPRICE1": 10, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22081100021", 
//         "DISCTYPE": "1", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 5, 
//         "SYJF": 5, 
//         "XX_NET1": 30, 
//         "ZKTYPE": "2"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22091300041", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 90, 
//         "XX_QTY1": 5, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22091300031", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 80, 
//         "XX_NET1": 40, 
//         "ZKTYPE": "2"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22091300021", 
//         "DISCTYPE": "1", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 5, 
//         "XX_NET1": 30, 
//         "ZKTYPE": "2"
//     }, 
//     {
//         "BILL": "FZCX2209130001", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22091300011", 
//         "DISCTYPE": "1", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 3, 
//         "XX_NET1": 20, 
//         "ZKTYPE": "2"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CHANGELV": "4", 
//         "CLASSID": "FZCX22081100101", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 90, 
//         "MJ_DISC2": 80, 
//         "MJ_DISC3": 70, 
//         "MJ_DISC4": 50, 
//         "XX_QTY1": 3, 
//         "XX_QTY2": 5, 
//         "XX_QTY3": 7, 
//         "XX_QTY4": 10, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22081100091", 
//         "DISCTYPE": "1", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 0, 
//         "XX_NET1": 40, 
//         "ZKTYPE": "2"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22081100081", 
//         "DISCTYPE": "4", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_NET1": 1, 
//         "MJ_NET2": 0, 
//         "XX_QTY1": 5, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22093000011", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 80, 
//         "XX_QTY1": 2, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22081100051", 
//         "DISCTYPE": "3", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "SYJF": 5, 
//         "XX_QTY1": 2, 
//         "ZJPRICE1": 10, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CHANGELV": "3", 
//         "CLASSID": "FZCX22081100061", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 90, 
//         "MJ_DISC2": 80, 
//         "MJ_DISC3": 60, 
//         "XX_QTY1": 2, 
//         "XX_QTY2": 5, 
//         "XX_QTY3": 8, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22092300032", 
//         "DISCTYPE": "2", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "MJ_DISC1": 0, 
//         "XX_QTY1": 1, 
//         "ZKTYPE": "1"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CHANGELV": "1", 
//         "CLASSID": "FZCX22081100092", 
//         "DISCTYPE": "3", 
//         "JFFACTOR1": 1, 
//         "JFFACTOR2": 1, 
//         "JFFACTOR3": 1, 
//         "JFFACTOR4": 1, 
//         "KHID": "K200QTD005", 
//         "XX_QTY1": 1, 
//         "ZJPRICE1": 0, 
//         "ZKTYPE": "1"
//     }
// ];

// dscxsp = [
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100003"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100004"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100005"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100006"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100007"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100008"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100009"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100010"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100011"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100012"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100013"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100014"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100015"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100016"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100017"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100018"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100019"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100020"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100021"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100022"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100023"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100024"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100025"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100026"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100027"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100028"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100029"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100030"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100031"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100032"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100033"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100034"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100035"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100036"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100037"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100038"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100039"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100040"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100041"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100042"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100043"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100044"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100045"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100046"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100047"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100048"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100049"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100050"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100051"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100052"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100053"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100054"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100055"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100056"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100057"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100058"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100059"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100060"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100061"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100062"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100063"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100066"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100067"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100075"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100076"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100079"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100088"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100089"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100090"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100111"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100116"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100118"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100121"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100128"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100179"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100181"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100183"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100185"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100187"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100191"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100219"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101011"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101012"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101013"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101016"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101018"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101111"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010102222"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108801"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108811"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108821"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108831"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010109999"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010200001"
//     }, 
//     {
//         "BILL": "FZCX2208110002", 
//         "CLASSID": "FZCX22081100021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010200002"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020100001"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020100003"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020200001"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020200005"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020300001"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020400001"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020400005"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020400006"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020400007"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020400008"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020400009"
//     }, 
//     {
//         "BILL": "FZCX2208110003", 
//         "CLASSID": "FZCX22081100031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001020400018"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200001"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200002"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200003"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200004"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200005"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200006"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200007"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200008"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200009"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200010"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200011"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200012"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200013"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200014"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200015"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200016"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200017"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200018"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200019"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200020"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200021"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200022"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200023"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200024"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200025"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200026"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200027"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200028"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200029"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200030"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200031"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200032"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200033"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200034"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200044"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200050"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200051"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030200104"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030299999"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030300002"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030300004"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030300005"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001030300006"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100039"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100040"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100041"
//     }, 
//     {
//         "BILL": "FZCX2208110004", 
//         "CLASSID": "FZCX22081100041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100119"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100002"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100004"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100010"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100018"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100019"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100020"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100027"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100033"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100039"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100041"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100061"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100062"
//     }, 
//     {
//         "BILL": "FZCX2208110005", 
//         "CLASSID": "FZCX22081100051", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040100064"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200003"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200004"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200007"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200008"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200010"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200012"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200018"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200020"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200025"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200028"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200043"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200044"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200045"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200046"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200051"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200052"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200053"
//     }, 
//     {
//         "BILL": "FZCX2208110006", 
//         "CLASSID": "FZCX22081100061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200054"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001050500001"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001050500002"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001050500005"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001050800002"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001050900003"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001051000001"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001051000004"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001051000005"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001051100006"
//     }, 
//     {
//         "BILL": "FZCX2208110008", 
//         "CLASSID": "FZCX22081100081", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001051100007"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100001"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100002"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100003"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100004"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100005"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100006"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100007"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100008"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100009"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100010"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100011"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100012"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100013"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100014"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100015"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100016"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100017"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100018"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100019"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100020"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100021"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100051"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100062"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100063"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100064"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100065"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100066"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100067"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100068"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100069"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100070"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100071"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100072"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100073"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100089"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100100"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100101"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100102"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100103"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100104"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100105"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100106"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100107"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100108"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100109"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100110"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100111"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100121"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100123"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100173"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100091", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001061100174"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400001"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400002"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400003"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400004"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400005"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400006"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400007"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400008"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400009"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400010"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400011"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400012"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400013"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400014"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400015"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400016"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400017"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400018"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400019"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400020"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400021"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400022"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400023"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400024"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400025"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400026"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400027"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400028"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400029"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400030"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400031"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400032"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400033"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400034"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400035"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400036"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400037"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400038"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400039"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400040"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400041"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400042"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400047"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400048"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400049"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400051"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400052"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400053"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400054"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400055"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400078"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400079"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400081"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400082"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400084"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400086"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400089"
//     }, 
//     {
//         "BILL": "FZCX2208110009", 
//         "CLASSID": "FZCX22081100092", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001060400090"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100001"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100002"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100003"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100004"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100005"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100006"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100007"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100008"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100009"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100010"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100011"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100012"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100013"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100014"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100015"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100016"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100017"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100018"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100019"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100020"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100021"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100022"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100023"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100024"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100025"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100026"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100027"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100028"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100029"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100030"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100031"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100032"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100033"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100034"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100035"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100036"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100037"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100038"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100039"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100040"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100041"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100042"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100043"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100044"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100045"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100046"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100047"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100048"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100049"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100050"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100051"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100052"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100053"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100054"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100055"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100056"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100057"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100061"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100062"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100063"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100064"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100065"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100066"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100068"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100073"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100074"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100080"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100082"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100088"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100089"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100090"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100091"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100092"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100093"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100094"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100095"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100096"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100097"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100098"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100099"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100100"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100101"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100102"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100103"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100104"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100105"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100106"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100107"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100108"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100109"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100110"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100111"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100112"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100113"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100114"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100115"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100116"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100117"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100118"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100119"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100120"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100121"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100122"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100123"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100124"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100125"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100127"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100128"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100129"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100130"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100131"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100143"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100144"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100145"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100146"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100161"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100163"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100164"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100165"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100166"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100173"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100174"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100180"
//     }, 
//     {
//         "BILL": "FZCX2208110010", 
//         "CLASSID": "FZCX22081100101", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080100182"
//     }, 
//     {
//         "BILL": "FZCX2209130001", 
//         "CLASSID": "FZCX22091300011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080200007"
//     }, 
//     {
//         "BILL": "FZCX2209130001", 
//         "CLASSID": "FZCX22091300011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080200009"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300001"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300003"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300004"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300005"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300008"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300009"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300014"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300028"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300029"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300031"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300032"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300042"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300049"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300052"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300056"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300057"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300058"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300059"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300060"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300062"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300063"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300064"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300065"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300066"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300067"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300068"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300069"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300070"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300071"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300072"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300073"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300074"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300075"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300076"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300077"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300078"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300084"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300086"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300092"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300093"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300094"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300095"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300096"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300097"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300098"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300099"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300100"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300101"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300102"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300103"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300104"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300105"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300106"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300107"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300108"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300109"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300110"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300111"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300112"
//     }, 
//     {
//         "BILL": "FZCX2209130002", 
//         "CLASSID": "FZCX22091300021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080300115"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400005"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400007"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400021"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400031"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400032"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400033"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400034"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400035"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400036"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400037"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400038"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400039"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400040"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400041"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400042"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400043"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400044"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400051"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400053"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400054"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400055"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400059"
//     }, 
//     {
//         "BILL": "FZCX2209130003", 
//         "CLASSID": "FZCX22091300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080400060"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500002"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500004"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500012"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500016"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500017"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500035"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500047"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500051"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500052"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500053"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500054"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500055"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500058"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500059"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500060"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500063"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500067"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500074"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500075"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500076"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500078"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500079"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500080"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500081"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500082"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500083"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500084"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500085"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500086"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500088"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500089"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500090"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500091"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500092"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500093"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500094"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500095"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500096"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500097"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500098"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500099"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500100"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500101"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500102"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500103"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500104"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500105"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500106"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500107"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500108"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500109"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500110"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500111"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500112"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500113"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500114"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500115"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500116"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500117"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500118"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500119"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500120"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500121"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500122"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500123"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500124"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500125"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500126"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500127"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500128"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500129"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500130"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500131"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500132"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500133"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500136"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500137"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500146"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500148"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500149"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500151"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500152"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500153"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500154"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500155"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500156"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500157"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500158"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500160"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500161"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500162"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500163"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500165"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500166"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500167"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500168"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500169"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500170"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500171"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500172"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500173"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500174"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500175"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500177"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500178"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500179"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500180"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500181"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500182"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500183"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500184"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500185"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500187"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500188"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500189"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500191"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500192"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500193"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500194"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500197"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500198"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500199"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500200"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500201"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500202"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500203"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500204"
//     }, 
//     {
//         "BILL": "FZCX2209130004", 
//         "CLASSID": "FZCX22091300041", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080500205"
//     }, 
//     {
//         "BILL": "FZCX2209130006", 
//         "CLASSID": "FZCX22091300061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080600001"
//     }, 
//     {
//         "BILL": "FZCX2209130006", 
//         "CLASSID": "FZCX22091300061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080600002"
//     }, 
//     {
//         "BILL": "FZCX2209130006", 
//         "CLASSID": "FZCX22091300061", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080600007"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700001"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700002"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700003"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700006"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700007"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700008"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700015"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700017"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700018"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700019"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700020"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700021"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700022"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700025"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700030"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700031"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700032"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700034"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700035"
//     }, 
//     {
//         "BILL": "FZCX2209140001", 
//         "CLASSID": "FZCX22091400011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080700039"
//     }, 
//     {
//         "BILL": "FZCX2209140002", 
//         "CLASSID": "FZCX22091400021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080800002"
//     }, 
//     {
//         "BILL": "FZCX2209140002", 
//         "CLASSID": "FZCX22091400021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080800006"
//     }, 
//     {
//         "BILL": "FZCX2209140002", 
//         "CLASSID": "FZCX22091400021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080800008"
//     }, 
//     {
//         "BILL": "FZCX2209140002", 
//         "CLASSID": "FZCX22091400021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080800033"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900006"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900007"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900011"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900012"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900013"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900016"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900017"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900018"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900019"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900020"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900021"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900029"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900031"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900032"
//     }, 
//     {
//         "BILL": "FZCX2209140003", 
//         "CLASSID": "FZCX22091400031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001080900033"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100003"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100004"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100005"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100006"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100007"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100008"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100009"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100010"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100011"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100012"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100013"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100014"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100015"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100016"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100017"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100018"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100019"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100020"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100021"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100022"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100023"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100024"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100025"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100026"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100027"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100028"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100029"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100030"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100031"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100032"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100033"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100034"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100035"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100036"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100037"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100038"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100039"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100040"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100041"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100042"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100043"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100044"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100045"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100046"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100047"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100048"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100049"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100050"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100051"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100052"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100053"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100054"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100055"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100056"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100057"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100058"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100059"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100060"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100061"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100062"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100063"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100066"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100067"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100075"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100076"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100079"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100088"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100089"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100090"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100111"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100116"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100118"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100121"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100128"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100179"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100181"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100183"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100185"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100187"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100191"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010100219"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101011"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101012"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101013"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101016"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101018"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010101111"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010102222"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108801"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108811"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108821"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010108831"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010109999"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010200001"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001010200002"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001100000000"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001100000001"
//     }, 
//     {
//         "BILL": "FZCX2209190003", 
//         "CLASSID": "FZCX22091900031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000004223333333"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600001"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600002"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600003"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600004"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600005"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600006"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600007"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600008"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600009"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600010"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600011"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600012"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600013"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600014"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600015"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600016"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600017"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600018"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600019"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600020"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600021"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600022"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600023"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600024"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600025"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600026"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600027"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600028"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600029"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600030"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600031"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600032"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600033"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600034"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600035"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600036"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600037"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600038"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600039"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600040"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600041"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600042"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600043"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600044"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600045"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600046"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600047"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600048"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600049"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600050"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600051"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600052"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600053"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600054"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600055"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600056"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600057"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600058"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600059"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600060"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600061"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600062"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600063"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600064"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600065"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600066"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600067"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600068"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600069"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600071"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600072"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600073"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600074"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600081"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600082"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600083"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600089"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600093"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600107"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600108"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600109"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600110"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600111"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600113"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600114"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600115"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600116"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600117"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600119"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600122"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600123"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600126"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600134"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600135"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600136"
//     }, 
//     {
//         "BILL": "FZCX2209220002", 
//         "CLASSID": "FZCX22092200021", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600142"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001040200008"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200001"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200002"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200003"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200004"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200005"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200006"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200007"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200008"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200009"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200010"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200011"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200012"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200013"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200014"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200015"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200016"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200017"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200018"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200019"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200020"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200021"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200022"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200023"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200024"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200025"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200026"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200027"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200028"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200029"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200030"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200031"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200032"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200033"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200034"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200035"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200036"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200037"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200038"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200039"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200040"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200041"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200042"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200043"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200044"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200045"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200046"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200047"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200048"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200049"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200050"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200051"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200052"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200053"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200054"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200055"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200059"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200060"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200061"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200062"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200063"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200064"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200065"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200066"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200067"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200068"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200069"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200074"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200075"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200076"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200078"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200088"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200089"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200092"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200096"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200097"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200098"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200099"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200100"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200101"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200109"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200110"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200111"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200112"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200113"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200114"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200115"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200116"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200117"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200118"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200142"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200143"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200148"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200149"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200162"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200163"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200165"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200166"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200170"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200171"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200172"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200173"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200174"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200175"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200176"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200177"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200178"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200179"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200180"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200181"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200182"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200183"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200184"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200185"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200186"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200187"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200188"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200189"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200190"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200191"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200192"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200193"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200194"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200195"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200196"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200197"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200198"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200199"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200200"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200201"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200202"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200203"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200204"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200205"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200206"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200226"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200227"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200230"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200231"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200232"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200233"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200234"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200235"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200236"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200257"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200258"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200266"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200272"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200279"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200280"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200281"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200282"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200283"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200284"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200285"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300031", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001090200286"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600001"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600002"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600003"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600004"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600005"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600006"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600007"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600008"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600009"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600010"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600011"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600012"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600013"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600014"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600015"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600016"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600017"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600018"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600019"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600020"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600021"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600022"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600023"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600024"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600025"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600026"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600027"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600028"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600029"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600030"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600031"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600032"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600033"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600034"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600035"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600036"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600037"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600038"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600039"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600040"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600041"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600042"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600043"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600044"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600045"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600046"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600047"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600048"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600049"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600050"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600051"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600052"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600053"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600054"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600055"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600056"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600057"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600058"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600059"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600060"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600061"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600062"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600063"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600064"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600065"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600066"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600067"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600068"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600069"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600071"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600072"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600073"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600074"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600081"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600082"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600083"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600089"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600093"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600107"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600108"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600109"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600110"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600111"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600113"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600114"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600115"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600116"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600117"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600119"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600122"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600123"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600126"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600134"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600135"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600136"
//     }, 
//     {
//         "BILL": "FZCX2209230003", 
//         "CLASSID": "FZCX22092300032", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070600142"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200001"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200002"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200003"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200004"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200005"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200006"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200007"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200008"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200009"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200010"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200011"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200012"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200013"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200014"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200015"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200016"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200017"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200018"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200019"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200020"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200021"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200022"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200023"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200024"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200025"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200026"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200027"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200028"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200029"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200030"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200031"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200032"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200033"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200034"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200035"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200036"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200037"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200038"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200039"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200040"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200041"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200042"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200043"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200044"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200045"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200046"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200047"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200048"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200049"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200050"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200051"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200059"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200061"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200062"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200063"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200064"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200065"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200066"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200072"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200073"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200074"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200075"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200076"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200077"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200078"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200079"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200080"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200081"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200082"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200083"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200091"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200092"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200093"
//     }, 
//     {
//         "BILL": "FZCX2209300001", 
//         "CLASSID": "FZCX22093000011", 
//         "KHID": "K200QTD005", 
//         "SPID": "000000001070200110"
//     }
// ];

// dszqda = [];


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
			C1.HYLV = cx_util.snvl(dscxm[i].HYLV, 0);

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
	
	//会员信息判断
	if(hyinfoModel != null){
		hymen = hyinfoModel;
	}
	//清除计算过的集合
	ClearResult();

    let respData = new Object();
	let sale02_order = [];
	let spid = "";
	let dateTime_now = cx_util.getTime(3);
	if (sale02_arr.length <= 0) {
		sale02_order = sale02_arr.sort((p1, p2) => {
			return p1.NO - p2.NO; //升序
		});
		 respData.products= sale02_order;
		 respData.cxfs = [];
		 return respData;
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
		//let hylv = cx_util.nnvl(cxbilldts[i].HYLV, -1);
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

		sale02_arr[i].NET = Math.round((ProPrice * ProNum - cxdiscvalue) * 100) / 100; //外面扣除
		sale02_arr[i].QTY = ProNum;
		sale02_arr[i].PRICE = Math.round((sale02_arr[i].NET / ProNum) * 100) / 100;
		sale02_arr[i].SPJF = jfnum;
		sale02_arr[i].CXBILL = cxbillStr;
		//sale02_arr[i].CXZT = cxztStr;
		//sale02_arr[i].HYLV = hylv;
	}
	if (cxfsdt != null && cxfsdt.length > 0) {
		//修改其中的SPID编码，通过行数
		for (let i = 0; i < cxfsdt.length; i++) {
			let row = parseInt(cxfsdt[i]["SPID"].toString());
			//cxfsdt[i]["SPID"] = sale02_arr[row].SPID;
		}
		let cxfs = cxfsdt;
	}
	sale02_order = sale02_arr.sort((p1, p2) => {
		return p1.NO - p2.NO; //升序
	});
	respData.products= sale02_order;
	respData.cxfs = cxfsdt;
	console.log("sale02_arr new", respData);
	return respData;
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
				dr.HYLV = -1;
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
				dr.HYLV = -1;
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
		for (let k = 9; k < cxbilldDataKeys.length; k++) {
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
				cxbilldts[i][hylv] = cx != null ? cx.HYLV : -1;
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
				cxbilldts[i][hylv] = cx != null ? cx.HYLV : -1;
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
			cxbilldts[i][hylv] = cx != null ? cx.HYLV : -1;
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
				let jfnum_cur = cx_util.nnvl(cxbilldts[i][jfnum], 0) + currentJf;
				cxbilldts[i][jfnum] = jfnum_cur;
				if (!fsdcx.hasOwnProperty(cxsub.subno)) {
					///积分的促销类型不在这里添加
					if (cx.cxtype != ("G") && cx.cxtype != "D" && !fsdcx.hasOwnProperty(cx.CxBill) && jfxs >
						0) {
						fsdcx.push(cx.CxBill);
					}
				}
				AddCxTable(spid, bill, saledate, cx, subid, i, fsqty, newprice, price, level, lcm, jfnum_cur);
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
	jfinfo.xsIndex = [];
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
				AddCxTable(spid, bill, saledate, cx, subid, i, fsqty, newprice, price, level, lcm,"");
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
const AddCxTable = function(spid, bill, saledate, cx, subid, row, fsqty, newprice, price, level, PM_LCM,jfnum) {
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
	dr[hylv] = cx.HYLV;
    dr["SPJF"] = jfnum;
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
