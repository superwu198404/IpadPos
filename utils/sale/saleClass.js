 var  sale001= function(pm_obj)
 {
   this.CLTIME= null;
   this.CUSTID= null;
   this.XSPTID= null;
   this.YN_DCDG= null;
   this.YN_HH= null;
   this.DKFID= null;
   this.BMID= null;
   this.KCDID= null;
   this.DPID= null;
   this.GCID= null;
   this.GSID= null;
   this.STR2= null;
   this.STR1= null;
   this.ERRINO= null;
   this.ERRID= null;
   this.TIME=  0
   this.WEEK=  0
   this.MONTH= 0
   this.YAER=  0
   this.YN_SC= null;
   this.REASON= null;
   this.TDISC=   0
   this.TLSDISC= 0
   this.TTPDISC= 0
   this.TBZDISC= 0
   this.THYDISC= 0
   this.HYJF   = 0
   this.CARDID = null;
   this.CUID   = null;
   this.TCXDISC  = 0
   this.CXTNET   = 0
   this.CHANGENET= 0
   this.ROUND    = 0
   this.BILLDISC = null;
   this.ZNET= 0
   this.DNET= 0
   this.TNET= 0
   this.TLINE= 0
   this.XS_GSID= null;
   this.XS_KHID= null;
   this.XS_DATE= null;
   this.XS_POSID= null;
   this.XS_BILL= null;
   this.XSTYPE= null;
   this.BILL_TYPE= null;
   this.RYID= null;
   this.BILL= null;
   this.POSID= null;
   this.KHID= null;
   this.SALETIME= null;
   this.SALEDATE= null;
   this.THTYPE= null;
   this.ZTMSTR= null;
   this.KQXSTYPE= null;
   this.YN_JLTH= null;
   this.YN_OK= null;
   this.CUSTMTIME= null;
   this.CUSTMCOMM= null;
   this.CUSTMADDRESS= null;
   this.CUSTMPHONE= null;
   this.CUSTMNAME= null;
   for(var item in  pm_obj)
   {
	   this[item] = pm_obj[item];
   }
 }
 
 var  sale002= function( pm_obj)
 {this.SALEDATE= null;
   this.XPDGCOM= null;
   this.XPDGSTR= null;
   this.SBERR= null;
   this.YN_SB= null;
   this.MYSTR= null;
   this.SPJGZ= null;
   this.YN_XPDG= null;
   this.BMID= null;
   this.RYID= null;
   this.KCDID= null;
   this.DPID= null;
   this.GCID= null;
   this.STR2= null;
   this.STR1= null;
   this.TIME= 0
   this.WEEK= 0
   this.MONTH= 0
   this.YAER= 0
   this.HYJFCD= 0
   this.JFDISC= 0
   this.HYJF= 0
   this.LSDISC= 0
   this.TPDISC= 0
   this.BZDISC= 0
   this.HYDISC= 0
   this.YN_HYDISC= null;
   this.CXID= null;
   this.CXDISC= 0
   this.YN_CXDISC= null;
   this.BILLDISC= 0
   this.DISC_TYPE= null;
   this.DISC= 0
   this.YN_SKYDISC= null;
   this.HYBL= 0
   this.DISCRATE= 0
   this.BRANDID= null;
   this.HTID= null;
   this.GYSID= null;
   this.NET= 0
   this.OPRICE= 0
   this.PRICE= 0
   this.MINSQTY= 0
   this.QTY= 0
   this.UNIT= null;
   this.SERIAL= null;
   this.BARCODE= null;
   this.PLID= null;
   this.NO= 0
   this.SPID= null;
   this.BILL= null;
   this.POSID= null;
   this.KHID= null;
   this.SALETIME= null;
   for(var item in  pm_obj)
   {
   	   this[item] = pm_obj[item];
   }
 }
 
 var  sale003= function()
 {this.SALEDATE= null;
   this.DISC= 0
   this.ZKLX= null;
   this.YN_ZQ= null;
   this.YN_ST= null;
   this.YN_JL= null;
   this.YN_LP= null;
   this.YN_YLTH= null;
   this.BMID= null;
   this.RYID= null;
   this.KCDID= null;
   this.DPID= null;
   this.GCID= null;
   this.CZK_AK= 0
   this.STR2= null;
   this.STR1= null;
   this.AUTH= null;
   this.TIME= 0
   this.WEEK= 0
   this.MONTH= 0
   this.YAER= 0
   this.SAVE_JE= 0
   this.SAVE_JEO= 0
   this.IDTYPE= null;
   this.ID= null;
   this.DSFKD= 0
   this.RATE= 0
   this.FAMT= 0
   this.AMT= 0
   this.FKID= null;
   this.NO= 0
   this.BILL= null;
   this.POSID= null;
   this.KHID= null;
   this.SALETIME= null;
 }
 
 var sale008= function()
 {
	  this.SALEDATE=null;
	  this.NOTE=null;
	  this.PRICE=0;
	  this.QTY=0;
	  this.OPTMAT="";
	  this.CSTCODE="";
	  this.OPTCODE="";
	  this.ATTNAME="";
	  this.ATTCODE="";
	  this.NO=0;
	  this.SPID="";
	  this.BILL="";
	  this.POSID="";
	  this.KHID="";
	  this.GCID="";
	  this.SALETIME=""
  }
 var saleBillType =
       [
           "NONE",
           //门零现场商品销售订单
           "Z101",
 			///现场退货
 			"Z151",
 			//门零预订单
 			"Z121",
 			//门零预订单退单
 			"Z171",
 			"Z101",
           //门零现场商品赊销订单
           "Z104",
 			//门零现场商品赊销订单
 			"Z104",
           //门零现场卡券赊销订单
           "Z112",
           //门零电商商品预订单
           "Z123",
 			//门零现场卡券销售订单
 			"Z111",
 			//区域渠道商品销售订单
 			"Z301",
           /// <summary>
           /// 赊销预定取消
           /// </summary>
           "Z351",
           /// <summary>
           /// 外卖预订单
           /// </summary>
           "Z102",
           /// <summary>
           /// 外卖退货单
           /// </summary>
           "Z152"
       ]
	   
	   
 export default 
 {
 	sale001,
 	sale002,
 	sale003,
	sale008,
	saleBillType
 }