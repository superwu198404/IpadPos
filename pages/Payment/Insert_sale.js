
//sale001 a:支付订单号
const  sale1=(a)=>{
	let store = getApp().globalData.store;
	let s1sql =
		"insert SALE001 (BILL,SALEDATE,SALETIME,KHID,POSID,RYID,BILL_TYPE,XSTYPE,XS_BILL,XS_POSID,XS_DATE,XS_KHID,XS_GSID,TLINE,TNET,DNET,ZNET,BILLDISC,ROUND," +
		"CHANGENET,CXTNET,TCXDISC,CUID,CARDID,THYDISC,YN_SC,GSID,GCID,DPID,KCDID,BMID,DKFID,XSPTID,YN_OK,THTYPE,CLTIME)" +
		"values('" + a.out_trade_no + "',date(),time(),'" +
		store.KHID + "','" + store.POSID + "','" + store.RYID +
		"','Z101','1','','','','',''," + a.TLINE + "," + a
		.PayAmount + "," + a.Discount + ",0,0,0,0,'',''," + a
		.Discount +
		",'N','" + store.GSID + "','" + store.GCID + "','" + store
		.DPID + "','" + store.KCDID + "','" + store.BMID + "','" +
		store.DKFID +
		"','POS','X',0,date())";
		return s1sql;
}
//sale002  a:支付订单号 p商品明细列表
const  sale2=(a,p)=>{
	let store = getApp().globalData.store;
	let s2sql=";"
	for(var i = 0; i < p.length; i++){
		let product=p;
		let week=dateformat.getYearWeek(new Date().getFullYear(), new Date().getMonth() + 1,new Date().getDay());
	    s2sql+="insert into SALE002 (BILL,SALEDATE,SALETIME,KHID,POSID,SPID,NO,PLID,BARCODE,UNIT,QTY,PRICE,OPRICE,NET,DISCRATE,YN_SKYDISC,"+
		"DISC,YN_CXDISC,CXDISC,YEAR,MONTH,WEEK,TIME,RYID,GCID,DPID,KCDID,BMID)"+
		"values('"+a+"',date(),time(),'"+store.KHID+"', '"+store.POSID+"', '"+store.SPID+"',"+i+",'"+product.PLID+
		"','"+product.BARCODE+"',"+product.UNIT+","+product.QTY+","+product.PRICE+","+product.OPRICE+","+product.PRICE+",'0','N',0,'N',0,"+
		"strftime('%Y',date()),strftime('%m',date()),"+week+",time(),'"+store.RYID+"','"+store.GCID+"','"+store.DPID+"','"+store.KCDID+"','"+store.BMID+"');";
	}
	return s2sql;
}
//sale003  a:支付订单号  p：支付明细列表
const  sale3=(a,p)=>{
	let store = getApp().globalData.store;
	let sql3="";
	//支付明细
	for (var i = 0; i <p.length; i++) {
		let pay=that.PayList[i]
		sql3+="insert SALE003(BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,RYID,GCID,DPID,KCDID,BMID,DISC)"+
		"values('"+a+"',date(),time(),'"+store.KHID+"','"+store.POSID+"',"+i+",'"+pay.fkid+"',"+pay.amount+",'"+store.RYID+
		"','"+store.GCID+"','"+store.DPID+"','"+store.KCDID+"','"+store.BMID+"');";
	}
	return sql3;
}
export default {
	sale1,
	sale2,
	sale3
}