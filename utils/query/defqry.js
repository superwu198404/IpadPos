import sqlLite from '@/utils/db/db_excute.js';
var $sqlLite = sqlLite.get();



function DefQuery(global, vue, drfqtyid) 
{
	let syskhid = global.store; //店铺配置信息
	let brand = global.brand;
	let sysryid = global.ryid;
    let sysgcid = global.gcid;
	let sysposid = global.sysposid;
    const  reloadstr = "#$";   //用于代替单引号
	const  ddatename = "#Ddate"; //双日期的特殊标志；
    const  ComputeStr = "COMPUTE";//计算列的标志
	//所有列表的名称
	let  tabList =[];
	//构造所有表格的数组  用上面的列表值作为主键，为键值对方式
	let  tab_describe ={} 
    //查询条件的数组
	let  sql_condition=[];
	// 最终要执行的sql的数组
	let  sql_forid  = {};
	
	
	
	var that = this;
	this.page  =vue;
	this.M_qryid = drfqtyid; //页面名称(这个控制器所控制的页面名称)

	
	//提示信息
	this.myAlert = function(pm_str1, pm_str2) 
	{
		util.simpleMsg(pm_str1, "none")
		
	}
	//刷新页面的内容
	this.update = function() {
		if (that.Page) 
		{
			that.Page.$forceUpdate()
		} else {
			that.log("页面变量丢失！！！！！！！")
		}
	}
	///获取所有查询条件的
	this.getsql =function()
	{
     let  pm_qryid = that.M_qryid;
     let sql01= "SELECT QRYNAME,CNAME,MENUID FROM POS_MENU_FILE1 WHERE  QRYNAME  IN "+
	 "( SELECT QRYNAME_BOY  FROM  POS_MENU_FILE2 WHERE QYRNAME  '"+pm_qryid+"')  OR  QRYNAME ='"+pm_qryid+"'" ;
     let sql02= "SELECT QRYNAME,BOY_COLUMN,BOY_TABLE,F_COLUMN,F_TABLE,QRYNAME_BOY FROM POS_MENU_FILE2 WHERE QRYNAME='"+pm_qryid+"'";
     let sql_DESCRIBE001="SELECT DUABLENUM,DUABLEDATE,SEQ_SORT,COLBACKCOLOR,COLFONTCOLOR,WINNAME,LISTINTO,LISTTYPE,COLNOTNULL,"+
	    " COLTYPE,COLNAME,TABLENAME,MENUID,QRYNAME,SYMBIOSIS,COL_LEN,COL_LOCTION,TEXT_LEN,TEXT_LOCTION,CREATEDATE,SYSQX "+
	    " FROM POS_SQL_DESCRIBE001 WHERE QRYNAME='"+pm_qryid+"'";
     let sql_DESCRIBE002="SELECT QRYNAME,SEQNO,COLWIDTH,SYSQX,SEQ_SORT,YN_VIEW,HYPELINK,LINK_TAB_COLNAME,ALIGN,FONTSIZE,"+
	    " COLBACKCOLOR,COLFONTCOLOR,COLTERM,YNHAVING,YNORDERBY,YNGROUPBY,YNFUNCTION,TOPFUNCTION,YN_ADDJOIN3,JOINCOLNAME3,"+
		" JOINTABLENAME3,YN_ADDJOIN2,JOINCOLNAME2,JOINTABLENAME2,YN_ADDJOIN1,JOINCOLNAME1,JOINTABLENAME1,COLNAME,TABLENAME "+
		" FROM POS_SQL_DESCRIBE002 WHERE QRYNAME='"+pm_qryid+"'OR  "+
		" QRYNAME IN ( SELECT QRYNAME_BOY  FROM  POS_MENU_FILE2 WHERE QYRNAME  '"+pm_qryid+"')" 

	   
		
	}
	
	
	
	//进行初始化操作的代码
	this.initQuery =function(pm_qryid)
	{
		
		
	}
	/*
	let syskhid = global.store; //店铺配置信息
	let brand = global.brand;
	let sysryid = global.ryid;
	let sysgcid = global.gcid;
	let sysposid = global.sysposid;
	替换掉一些关键的字符串 
	*/
	this. ReplaceSysStr =function(pm_sql)
	{
		var sql= pm_sql;
		// SYSCOID-当前登陆公司/SYSKHID-当前登陆门店/SYSPOSID-当前款台/SYSCZY-当前操作
		if (sql != null)
		{
			sql = sql.Replace("@SYSCOID", syskhid);
			sql = sql.Replace("@SYSKHID", syskhid);
			sql = sql.Replace("@SYSPOSID", sysposid);
			sql = sql.Replace("@SYSCZY", sysryid);
			sql = sql.Replace(reloadstr, "'");
		}
	}
}