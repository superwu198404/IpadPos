const createSql = [
	`create table if not exists OSALE001 (
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
		
		  CLTIME   DATE
	)`,
	`create table if not exists OSALE002 (
		  BILL   VARCHAR2(30))`
]
export default {
	createSql
}
