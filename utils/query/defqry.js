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
	
	this.getsql =function()
	{
        var sql  ="SELECT  * FROM  "
		sqldict.
		
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