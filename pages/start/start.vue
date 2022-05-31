<template>
	<view>
		<text>{{showmsg}}</text>>
		<input  placeholder="请输入门店的编码进行初始化"  v-model="khid" />
		<button @click="init()">确定</button>
	</view>
</template>

<script>
	import Req from '@/utils/request.js';
	import sqlLite from '@/utils/db/db_excute.js';
	var  mysqlite =	sqlLite.get();
	var that  =null;
 
	export default 
	{
	   
		data()
		{
			return { tx001:null,khid:'',yninit:false,showmsg:"正在检查是否初始化"}
		},
		onLoad() 
		{
			
		},
		methods: 
		{
		       startx:function()
			   {
				   that =this;
				   //this.init();
				   //第一步检查本地数据库是否存在
				    var sql  = " select  cvalue  from  ipadconfig where  type='KHID'";
				    //console.log("开始查询")
				    mysqlite.executeQry(sql,"校验本地数据库信息",(res)=>{ this.tx(res)},()=>{ this.init()}); 
			   },
		     	tx:function(res)
				{
					 console.log("准备开始");
					 let getkhid  = req.getResData(res);
					 console.log(getkhid);
				},
				init:function()
				{
										   
										   console.log("准备开始初始化");
										   let apistr= "MobilePos_API.Utils.PosInit.getTx001";
										   let reqdata  = Req.resObj(true,"正在进行初始化001",null,apistr);
										   console.log( JSON.stringify( reqdata));
										   Req.asyncFunc(reqdata,
										                    (res)=>
															     {
																	 console.log(that.khid);
																     that.tx001=  req.getResData(res);
																	 let reqPosData  ={"KHID":that.khid,"POSID":"8"};
																	 let apistr= "MobilePos_API.Utils.PosInit.reloadsqlite";
																	 return Req.resObj(true,"正在获取通讯数据004",reqPosData,apistr);
																 },  
															
															(res)=> 
															     {
																	let  sql =[];
																	let   tx004 = req.getResData(res);
																	//根据001循环创建表，并生成初始化语句
																	that.tx001.forEach(function(item)
																	{   
																		sql.push("drop table  " + item.TABNAME); 
																		sql.push(item.DDLSTR); 
																	    let arr004=	tx004.filter((item4)=>{ return item4.TABNAME == item.TABNAME });
																		sql  = sql.concat(arr004);
																	});
																	return  Req.resObj(true,"正在开始重建数据库",sql);
															     },
															(res)=>
																 {
																	 debugger;
																    that.tx001 =null;
																    mysqlite.executeSqlArray(res.data,res.msg,
																	()=>{
																		//跳转到新页面 
																	},
																	()=>{
																		//报错
																	}
																	);
																 },
																null,
															 (res)=>
															     {
																	 that.tx001
																	  =null;
																 }
															)
				},
				
			
		}
	}
	
</script>

<style>

</style>
