const createSql = [
	`create table if not exists SALE001 (
		  SALEDATE   DATE,
		
		  SALETIME   DATE,
		
		  KHID   VARCHAR2(30),
		
		  POSID   VARCHAR2(30),
		
		  BILL   VARCHAR2(30),
		
		  RYID   VARCHAR2(30),
		
		  BILL_TYPE   VARCHAR2(30),
		
		  XSTYPE   VARCHAR2(30),
		
		  XS_BILL   VARCHAR2(30),
		
		  XS_POSID   VARCHAR2(30),
		
		  XS_DATE   DATE,
		
		  XS_KHID   VARCHAR2(30),
		
		  XS_GSID   VARCHAR2(30),
		
		  TLINE   REAL,
		
		  TNET   REAL,
		
		  DNET   REAL,
		
		  ZNET   REAL,
		
		  BILLDISC   VARCHAR2(30),
		
		  ROUND   REAL,
		
		  CHANGENET   REAL,
		
		  CXTNET   REAL,
		
		  TCXDISC   REAL,
		
		  CUID   VARCHAR2(30),
		
		  CARDID   VARCHAR2(30),
		
		  HYJF   REAL,
		
		  THYDISC   REAL,
		
		  TBZDISC   REAL,
		
		  TTPDISC   REAL,
		
		  TLSDISC   REAL,
		
		  TDISC   REAL,
		
		  REASON   VARCHAR2(30),
		
		  YN_SC   VARCHAR2(30),
		
		  YAER   REAL,
		
		  MONTH   REAL,
		
		  WEEK   REAL,
		
		  TIME   REAL,
		
		  ERRID   VARCHAR2(30),
		
		  ERRINO   VARCHAR2(30),
		
		  STR1   VARCHAR2(30),
		
		  STR2   VARCHAR2(30),
		
		  GSID   VARCHAR2(30),
		
		  GCID   VARCHAR2(30),
		
		  DPID   VARCHAR2(30),
		
		  KCDID   VARCHAR2(30),
		
		  BMID   VARCHAR2(30),
		
		  DKFID   VARCHAR2(30),
		
		  YN_HH   VARCHAR2(30),
		
		  YN_DCDG   VARCHAR2(30),
		
		  XSPTID   VARCHAR2(30),
		
		  CUSTID   VARCHAR2(30),
		
		  CUSTMNAME   VARCHAR2(30),
		
		  CUSTMPHONE   VARCHAR2(30),
		
		  CUSTMADDRESS   VARCHAR2(30),
		
		  CUSTMCOMM   VARCHAR2(30),
		
		  CUSTMTIME   DATE,
		
		  YN_OK   VARCHAR2(30),
		
		  YN_JLTH   VARCHAR2(30),
		
		  KQXSTYPE   VARCHAR2(30),
		
		  ZTMSTR   VARCHAR2(30),
		
		  THTYPE   VARCHAR2(30),
		
		  CLTIME   DATE,
	
	CONSTRAINT SALE001_KEY PRIMARY KEY (SALEDATE,GCID,KHID,POSID,BILL))`,
	`create table if not exists SALE002 (
 SALEDATE DATE,
 SALETIME DATE,

 KHID VARCHAR2(30),

 POSID VARCHAR2(30),

 BILL VARCHAR2(30),

 SPID VARCHAR2(30),

 NO REAL,

 PLID VARCHAR2(30),

 BARCODE VARCHAR2(30),

 SERIAL VARCHAR2(30),

 UNIT VARCHAR2(30),

 QTY REAL,

 MINSQTY REAL,

 PRICE REAL,

 OPRICE REAL,

 NET REAL,

 GYSID VARCHAR2(30),

 HTID VARCHAR2(30),

 BRANDID VARCHAR2(30),

 DISCRATE REAL,

 HYBL REAL,

 YN_SKYDISC VARCHAR2(30),

 DISC REAL,

 DISC_TYPE VARCHAR2(30),

 BILLDISC REAL,

 YN_CXDISC VARCHAR2(30),

 CXDISC REAL,

 CXID VARCHAR2(30),

 YN_HYDISC VARCHAR2(30),

 HYDISC REAL,

 BZDISC REAL,

 TPDISC REAL,

 LSDISC REAL,

 HYJF REAL,

 JFDISC REAL,

 HYJFCD REAL,

 YEAR REAL,

 MONTH REAL,

 WEEK REAL,

 TIME REAL,

 STR1 VARCHAR2(30),

 STR2 VARCHAR2(30),

 GCID VARCHAR2(30),

 DPID VARCHAR2(30),

 KCDID VARCHAR2(30),

 RYID VARCHAR2(30),

 BMID VARCHAR2(30),

 YN_XPDG VARCHAR2(30),

 SPJGZ VARCHAR2(30),

 MYSTR VARCHAR2(30),

 YN_SB VARCHAR2(30),

 SBERR VARCHAR2(30),

 XPDGSTR VARCHAR2(30),

 XPDGCOM VARCHAR2(30),
 
 CONSTRAINT SALE002_KEY PRIMARY KEY (SALEDATE,GCID,KHID,POSID,BILL,SPID,NO))`,

	`create table if not exists SALE003 (SALEDATE   DATE,

  SALETIME   DATE,

  KHID   VARCHAR2(30),

  POSID   VARCHAR2(30),

  BILL   VARCHAR2(30),

  NO   REAL,

  FKID   VARCHAR2(30),

  AMT   REAL,

  FAMT   REAL,

  RATE   REAL,

  DSFKD   REAL,

  ID   VARCHAR2(30),

  IDTYPE   VARCHAR2(30),

  SAVE_JEO   REAL,

  SAVE_JE   REAL,

  YAER   REAL,

  MONTH   REAL,

  WEEK   REAL,

  TIME   REAL,

  AUTH   VARCHAR2(30),

  STR1   VARCHAR2(30),

  STR2   VARCHAR2(30),

  CZK_AK   REAL,

  GCID   VARCHAR2(30),

  DPID   VARCHAR2(30),

  KCDID   VARCHAR2(30),

  RYID   VARCHAR2(30),

  BMID   VARCHAR2(30),

  YN_YLTH   VARCHAR2(30),

  YN_LP   VARCHAR2(30),

  YN_JL   VARCHAR2(30),

  YN_ST   VARCHAR2(30),

  YN_ZQ   VARCHAR2(30),

  ZKLX   VARCHAR2(30),

  DISC   REAL,
  
  CONSTRAINT SALE003_KEY PRIMARY KEY (SALEDATE,GCID,KHID,POSID,BILL,FKID,NO))`,

	`create table if not exists POS_TXFILE(  SEQ_NO     integer, 
             TX_SQL        VARCHAR2(6),  
             STOREID      VARCHAR(10),  
             POSID        VARCHAR2(10),  
             TAB_NAME     VARCHAR(40),   
             STR1         VARCHAR(40), 
             ERRTEXT      VARCHAR2(100),  
             BDATE        VARCHAR2(10), 
             YW_NAME    VARCHAR(100),
             CONNSTR    VARCHAR(100),  
             CONSTRAINT POS_TXFILE_KEY PRIMARY KEY (SEQ_NO))`
]

const ZFRuleSql =
	`create table if not exists ZF_RULE(
	           "TYPE"        VARCHAR2(40),  
	           "APPID"      VARCHAR(40),  
	           "GSID"        VARCHAR2(40),  
	           "URL"     VARCHAR(100),   
	           "PAYTYPE"         VARCHAR(100), 
	           "SOURCE"      VARCHAR2(100),  
	           "BRAND"        VARCHAR2(40), 
			   "CODE"    VARCHAR(100),
	           "NOTE"    VARCHAR(100),
			   "YN_USE"    VARCHAR(10)
			   );`;

//上述sql 已在数据库实现，通讯表数据库没有则在本地创建
//创建通讯表的过程
const TXSql = [`drop table POS_TXFILE`,
	`create table POS_TXFILE(SEQ_NO integer,
			    TX_SQL        VARCHAR2(6),  
			    STOREID      VARCHAR(10),  
			    POSID        VARCHAR2(10),  
			    TAB_NAME     VARCHAR(40),   
			    STR1         VARCHAR(40), 
			    ERRTEXT      VARCHAR2(100),  
			    BDATE        VARCHAR2(10), 
			    YW_NAME    VARCHAR(100),
			    CONNSTR    VARCHAR(100),  
			    CONSTRAINT POS_TXFILE_KEY PRIMARY KEY (SEQ_NO))`
];

//创建重打表的过程
const PRINTSql = [`drop table POS_XSBILLPRINT`,
	`CREATE TABLE POS_XSBILLPRINT( 
             XSBILL    VARCHAR2(20)  NOT NULL,  
             XSDATE    DATE   NOT NULL, 
             BILLSTR   VARCHAR2(6), 
             CONSTRAINT POS_XSBILLPRINT PRIMARY KEY (XSBILL,XSDATE))`
];

export default {
	createSql,
	ZFRuleSql,
	TXSql,
	PRINTSql
}
