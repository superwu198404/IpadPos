import sqlLite from '@/utils/db/db_excute.js';
import util from '../util';
/*
参数内容如下 经过上述代码 读取参数值的是偶使用
1	服务器指向	FWZX	1  app.globalData.$sysParm.FWZX
2	是否调试模式	YN_TSMS	Y  app.globalData.$sysParm.YN_TSMS
3	舍入规则	SRGZ	3      app.globalData.$sysParm.SRGZ
4	终端参数密码	QXMM	1234  以下类推
5	通讯时间间隔(秒)	TXSJJG	120
6	是否同步服务器时间	YN_TBFWQSJ	Y
7	促销是否叠加口碑券	YN_ZFBKBQ	Y
8	未上传数据保留天数	WSCSJBLTS	7
9	业务数据保留天数	SJBLTS	100
10	挂单数据保留天数	GDBLTS	1
11	可查数据天数	KCXSJTS	100
12	是否提交后立即通讯	YN_TJHLJTX	Y
13	是否启用触摸键盘	YN_CMJP	N
14	请货申请几天后到货	SQDHTS	2
15	不支持的付款方式(逗号隔开)	KHBZCDFKFS	09
16	支持预定的付款方式	YN_ALLFKYD	N
17	结款模式	JKMS	1
18	应结款是否可见	YN_YJKKJ	N
19	是否启用串口	YN_QYCK	N
20	客显默认串口	MRCK	COM8
21	客显默认波特率	MRBTL	9600
22	是否不使用驱动打印	YN_BK	N
23	是否打印小票	YN_YXDY	Y
24	是否打印发票	YN_DYFP	N
25	小票打印机字符	DYJZF	40
26	小票走纸行数	XPZZHS	0
27	小票欢迎语	HYY	Kengee 欢迎惠顾400-12
28	是否启用水吧打印	YN_SBDY	Y
29	水吧类别编码	SBLBBM	107
30	水吧打印机名称	SBDYJMC	TSC TDP-225
31	水吧打印规则	SBZZDX	drinkPrint
32	裱花类别编码	BHLBBM	109,106
33	裱花打印机名称	BHDYJMC	
34	裱花打印规则	BHZZDX	bhPrint
35	裱花打印字号	BHDYZH	13
36	是否启用双屏广告	YN_SPGG	N
37	裱花纸张宽度(厘米)	BHZZKD	8
38	双屏广告文件路径	GGWJLJ	MTV
39	是否打印餐桌号	YN_DYCZH	N
40	远程打印机名称	YCDYJMC	Microsoft XPS Document Writer
41	是否允许异店提货	YN_YDTH	Y
42	可见公司范围	KJGSFW	K200,K210,K900,K960
43	会员服务器地址	HYFWQDZ	http://120.76.96.114:80/webservice/service.asmx/SQLS_S
44	重打小票是否打印水吧标签	YN_CDSBBQ	N
45	小票抬头LOGO	XPLOGO	logo.jpg
46	小票结尾二维码	XPEWM	erweima.png1
47	裱花二维码地址	BHEWM	http://61.183.174.66:8008/publish/StartIndex.aspx
48	预定到货最小间隔时间	YDZXJG	2
49	收款员完成结款后才可进销售界面	YN_JKXS	Y
50	预定支持的品类	YDZCDPL	109,10606,105
51	电子发票二维码地址	DZFPEWMDZ	http://122.112.234.28:8017/GetElecInvoice/Index
52	非手工结转付款方式隐藏付款金额	YN_JKYCJE	N
53	"是否打印电子发票二维码
"	YN_DYDZFPEWM	Y
54	是否使用并口开钱箱	YN_SYBKKQX	N
55	是否启用通联持卡人	YN_TLCKR	N
56	是否启用周期请货	YN_ZQ	Y
57	请货截止时间	QHJZSJ	19:00
58	按星期几请货截止时间	QHJZSJXQ	15
59	现烤默认品类	MRXKPL	108,105,201
60	售卡售券可用付款方式	SKSQFKID	ZF06,ZF01
61	赊销结算可用付款方式	XSJSFKID	ZF06,ZF02
62	socket连接的地址	SOCKETDZ	122.112.234.28
63	socket端口	SOCKETDK	9989
64	通联支付的商户号	TLSHID	999990053990001
65	接口所用的域名	JKYM	http://58.19.103.220:8807
66	是否强制录入会员	YN_LRHY	N
67	仅可供可入库	JKGRK	Y
68	水吧打印录入叫号器	YN_CALLNUM	Y
69	是否特殊会员	YN_TSHY	N
70	是否自动接单	YN_WMORDERS	Y
71	是否电子秤	YN_DZC	Y
72	惜食折扣率上限	XSZKLSX	80
73	刷脸支付	SLZF	ZFB20
74	刷脸仟吉会员卡	SLQJHYK	PAYCARD
*/
var sysParam = {
	getSysParam: function(pm_khid) {
		let $sqlLite = sqlLite.get();
		let cssql = "SELECT  D1.SNAME,P1.POSCS,P1.POSCSNR\
							   FROM     POSCSZMX P1 ,DAPZCS_NR D1\
								   WHERE         D1.ID ='POSCS'\
							AND       D1.ID_NR =P1.POSCS\
							AND       P1.POSCSZID =(select poscszid from khda  where  khid ='" + pm_khid + "' )\
						  ORDER BY  P1.SZ";

		$sqlLite.executeQry(cssql, "正在获取系统参数", (res) => {
			console.log("查询系统参数sql：", [cssql]);
			console.log("查询系统参数结果：", res);
			// let app = getApp();
			var paramKeyValue = {};
			res.msg.forEach(item => {
				paramKeyValue[item.POSCS] = item.POSCSNR
			})
			console.log("系统参数：", paramKeyValue);
			// app.globalData.sysParam = paramKeyValue;
			util.setStorage("sysParam", paramKeyValue); //可以持久化存储
		}, null);
	},

}

export default {
	init: sysParam.getSysParam
}
