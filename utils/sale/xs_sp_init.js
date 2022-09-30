/*
初始化销售商品的录入信息
初始化后的结果为   
{FSTR:A,[plid:'xx',plname:'xxx',
     splist:[{spid:'001',spname:'吐司1',pinyin:"xxx",
	          unit:"个",price:"11",specslist:[],ynshowlist:0,
			       ynAddPro:0,addlist:[]},
             {spid:'002',spname:'蛋糕',pinyin:"xxx",
			     unit:"个",price:"11",specslist:[]},ynshowlist:1,
				   ynAddPro:0,addlist:[]}
			 {spid:'003',spname:'水吧',pinyin:"xxx",
			     unit:"个",price:"11",specslist:[]},ynshowlist:0,
				  ynAddPro:1,addlist:[]} 
				 ]
}
ynshowlist：指示是否显示规格列表一般为蛋糕的时候会生效
specslist：为规格列表：例如6号，8号  等
ynAddPro：为水吧产品的附加属性，这里是指水吧产品附加的属性
addlist：为属性列表例如 ：全糖、半糖，去冰，加椰果等等
*/
import sqlLite from '@/utils/db/db_excute.js';
var $sqlLite  =sqlLite.get();
var loadSaleSP  =
{    
	getFstrAndSort:function(pm_arr)  //将当前数组的拼音的第一位截取出来
	{
		//{"FSTR":"z","PINYIN":"zjpbtzw（x）8-qj","SNAME":"竹节排包提子味（型）8-仟吉","SPID":"000000001010100002","addlist":"","plid":"308","plname":"三明治用半成品","specslist":"","ynAddPro":0,"ynshowlist":0}
		let newarrList  ;
	    console.log("开始获取拼音首字母");
		 newarrList=  pm_arr.map( 
		 item=> {  
			let py   =  item.PINYIN;
			//console.log("数组的结构"+JSON.stringify(item))
			let flag="";
			for(let x=0;x<py.length;x++)
			{
				if(py.charCodeAt(x)>= 97&& py.charCodeAt(x) <= 122 )
				{
				    flag  = py.substr(x,1);
					break;
				}
			}
			if(flag.length ==0 )
			{
				flag="Z";
			}
			item["FSTR"] = flag.toUpperCase();
			return  item;
		    });
	    return newarrList;
	},
	/*
	  此方法传入的数组是 
	  z主商品sql  1
	  蛋糕合并    2
	  水吧sql	 3
	*/
	arrListGroupBy:function(pm_arr,cake_arr,drinkP_arr)
	{   
		//{"FSTR":"z","PINYIN":"zjpbtzw（x）8-qj","SNAME":"竹节排包提子味（型）8-仟吉","SPID":"000000001010100002","addlist":"","plid":"308","plname":"三明治用半成品","specslist":"","ynAddPro":0,"ynshowlist":0}
		//console.log(pm_arr.length+"#"+cake_arr.length+"#"+drinkP_arr.length+"#")
		let  pkey ="";
		let retArr  =[];
		pm_arr  =  this.getFstrAndSort(pm_arr);
		console.log("##############################"+pm_arr.length+"##############################")
		retArr= pm_arr.sort((a,b)=>{ let x=0;  if( (a.FSTR< b.FSTR) ||( a.FSTR ==b.FSTR   &&  a.plid<b.plid)|| ( a.FSTR ==b.FSTR   &&  a.plid==b.plid && a.SNAME<b.SNAME)) { x=-1} else{x=1}  return x});
		let  plarr;  //品类的子集
		let  fsArr=[];  //字符的总集集
			retArr.forEach( item =>{
				//console.log("排序数组的结构"+JSON.stringify(item))
				let fslag  =  item.FSTR;
				let plid   =  item.plid;
				let plname = item.plname;
				let cpk  = fslag+""+plid;
				if(cpk !=pkey)
				{
					plarr=[];
					fsArr.push( {"FSTR":fslag,"plid":plid,"plname":item.plname,"plarr":plarr }  );
					pkey  =cpk;
					//console.log(item.plname+"字母"+fslag)
				}
				if(item.ynshowlist == "1")
				{
	        		item.specslist= cake_arr.filter(cakeitem=>{return  cakeitem.DGXLID ==item.SPID })
					if( item.specslist.length>0 )
					{
				    	item.SPID  = item.specslist[0].SPID;
					}
					//console.log( JSON.stringify(item.specslist)  );
				}
				if( item.ynAddPro=="1")
				{
				  var  retDarr    = drinkP_arr.filter(drinkitem=>{return drinkitem.MATNR == item.SPID } )
				  var  retDrr_arr = []  //根据retd.CSTCODE  +   retd.ATTCODE  +  retd.OPTCODE;  汇总后的数组
				  var gtoupDarr   = []  
				  let dpk ="";
				  retDarr.forEach(retd=>
					   {
						   let newdk  =retd.CSTCODE  +   retd.ATTCODE ;
						   if(  newdk!= dpk )
						   {
							   dpk=newdk;
							   gtoupDarr  =[] 
							   retDrr_arr.push({CSTCODE:retd.CSTCODE==1?"免费":"收费",ATTCODE:retd.ATTNAME,Darr: gtoupDarr})
						   }
						   
		gtoupDarr.push( {ATTCODE:retd.ATTCODE,ATTNAME:retd.ATTNAME,CSTCODE:retd.CSTCODE,OPTCODE:retd.OPTCODE,OPTNAME:retd.OPTNAME,OPTMAT:retd.OPTMAT,PRICE:0,SELECTED:retd.RECMARK,SPID:retd.MATNR,QTY:0,RECMARK:retd.RECMARK} )
					   })
				  item.addlist =retDrr_arr;
				  //console.log( JSON.stringify(item.addlist)  );
				}
				plarr.push(item);
			})
		 console.log(  JSON.stringify(fsArr.slice(0,3)) );
	     return 	fsArr;			 
	},
	loadSp:async function(pm_storeid,callbackfun,pm_dqid,pm_khzid)
	{
	 
	 let d= new Date();
	 var x=d.getFullYear()+"-"+ ((d.getMonth()+1)<10?"0":"")+(d.getMonth()+1)+"-"+(d.getDate()<10?"0":"")+d.getDate();
	 var spPrice ={};
	 console.log("##############################开始获取售价主数据"+x+"##############################")
	 let pricesql ="SELECT PRICE / (CASE UQTY  WHEN 0 THEN 1 else UQTY end) PRICE," +
 " PRICETYPE,SPID,SDATE FROM PRICDA WHERE DATE(SDATE) <= DATE('"+x+"')  "+
 " AND DATE(EDATE) >= DATE('"+x+"') and (dqid is null or dqid = '"+pm_dqid+"') " +
 " and (khzid is null or khzid = '"+pm_khzid+"') and  QYSTAT  ='1' ORDER BY SPID, PRICETYPE,SDATE DESC";
	await  $sqlLite.executeQry(pricesql,"正在获取主数据",(res)=>
	{   
	      let price = res.msg; 
			price.forEach(pitem =>{  
				
				   
					 if( spPrice[pitem.SPID] )
					 {
						 //continue;
					 }
					 else
					 {
						 spPrice[pitem.SPID]={"SPID":pitem.SPID,"PRICE":pitem.PRICE};
					 }
					 //console.log(spPrice[pitem.SPID]+"售价列表:"+ JSON.stringify(pitem))
			})
		  console.log(JSON.stringify(spPrice).substr(0,300));
	},null);	 
	 
	 // var  cakeid=pm_cakeid.split(",").map((item)=> {return  "'"+item+"'"});
	  var  mainArr  =[];
	  var  cakeSpesc =[];
	  var  dinkP =[]
	  
	    console.log("##############################开始获取主商品##############################")
	 //z主商品sql 1
	  let  msplistSql=
	  "SELECT substr(S1.pinyin,1,1) FSTR, S1.SPID,S1.SNAME,S1.UNIT,S1.PINYIN,SM.ZLID plid,s1.plid XPLID,PLDA.SNAME plname,S1.SPJGZ, \
	                 0 ynshowlist , '' specslist, \
					 0 ynAddPro,'' addlist  \
	                 FROM SPDA S1,SPKHDA SM,PLDA \
					WHERE S1.SPID =SM.SPID AND PLDA.PLID=SM.ZLID  \
			    AND SM.YN_XS='Y'  AND  S1.SPJGZ IN ('01','02')  \
			    AND S1.SPJGZ IS NOT NULL  AND SM.KHID ='"+pm_storeid+"' \
			    AND not exists(select 1 from spda_dgxl where  spda_dgxl.spid = SM.SPID) \
				AND NOT EXISTS (SELECT 1 FROM KXPSX WHERE ifnull(KXPSX.DELMK,'N')='N' AND KXPSX.BZIRK='"+pm_dqid+"' AND SM.SPID = KXPSX.MATNR )";
		
		 await  $sqlLite.executeQry(msplistSql,"正在获取主数据",(res)=>
		 {  
			 console.log(JSON.stringify(res).substring(0,2000));
			  mainArr = res.msg;   
			  console.log(JSON.stringify(mainArr.length));
		 },null);	
		
	   console.log("##############################开始获取蛋糕主商品##############################")	   
     //蛋糕合并 2
	let drinksAddSql= " select  substr(dgxlda.pinyin,1,1) FSTR,dgxlda.dgxlid SPID,dgxlda.SNAME,'个' UNIT,dgxlda.PINYIN,dgxlda.plid,dgxlda.plid XPLID,'01' SPJGZ,PLDA.SNAME plname," +
	                  "  1 ynshowlist , '' specslist,0 ynAddPro,'' addlist " +
				    " from  dgxlda,plda where dgxlda.plid=plda.plid " +
					" and  exists(select 1 from spda_dgxl,spkhda where spda_dgxl.spid= spkhda.spid " +
					" and spda_dgxl.dgxlid =dgxlda.dgxlid) "
				    " and spkhda.YN_XS='Y' and   spkhda.khid ='"+ pm_storeid+ "'" +
				    "";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
			 await  $sqlLite.executeQry(drinksAddSql,"正在获取蛋糕数据",(res)=>
			 {  
						
		       	console.log(JSON.stringify(res).substring(0,2000));
			    mainArr=	mainArr.concat(res.msg);    
			    console.log(JSON.stringify(mainArr.length));
			 },null);	
	    console.log("##############################开始获取蛋糕规格##############################")	
	  //蛋糕规格 
	 let  cakeSpescSql=" SELECT  spda_dgxl.DGXLID, spda_dgxl.SPID, IFNULL(spda_dgxl.cccz,'无尺寸') SPECS  \
	               from spda_dgxl,spkhda where spda_dgxl.spid= spkhda.spid  \
				     and spkhda.YN_XS='Y' and   spkhda.khid ='"+pm_storeid+"'";
					 
			await  $sqlLite.executeQry(cakeSpescSql,"正在获取蛋糕数据",(res)=>
			{  				
			  	console.log(JSON.stringify(res).substring(0,2000));
							cakeSpesc=res.msg;    
			},null);			 
	  //水吧sql	3		 
	  
	   console.log("##############################开始获取水吧商品##############################")
	  let  msDrinksql="SELECT  substr(S1.PINYIN,1,1) FSTR, S1.SPID,S1.UNIT,S1.SNAME,S1.PINYIN,SM.ZLID plid,PLDA.SNAME plname,s1.plid XPLID,S1.SPJGZ,  "  +
	" 0 ynshowlist , '' specslist, 1 ynAddPro,'' addlist "  +
    "FROM SPDA S1,SPKHDA SM,PLDA " +
	"WHERE S1.SPID =SM.SPID AND PLDA.PLID=SM.ZLID "+
	"AND SM.YN_XS='Y'  AND  S1.SPJGZ IN ('01','02')  "+ 
	"AND S1.SPJGZ IS NOT NULL  AND SM.KHID ='"+pm_storeid+"' AND  "+
	"EXISTS (SELECT 1 FROM KXPSX WHERE ifnull(KXPSX.DELMK,'N')='N' AND KXPSX.BZIRK='"+pm_dqid+"' AND SM.SPID = KXPSX.MATNR   )";
	  			await  $sqlLite.executeQry(msDrinksql,"开始获取水吧商品",(res)=>
	  			{  					
	  			  	console.log(JSON.stringify(res).substring(0,2000));
	  			    mainArr=	mainArr.concat(res.msg);     
	  			},null);						 
			 console.log("##############################开始获取水吧属性##############################")		 
     //水吧属性	 
	      let drinkProSql  =" SELECT  MATNR, CSTCODE,ATTCODE, ATTNAME, OPTCODE, OPTMAT, OPTNAME, RECMARK  "+" FROM  KXPSX   WHERE   ifnull(DELMK,'N')='N' " +
		 "  and  not  EXISTS (SELECT 1 FROM KXPSX k2 where   BZIRK='"+pm_dqid+"' and  k2.OPTMAT = KXPSX. OPTMAT and  k2.MATNR = KXPSX. MATNR  and k2.CSTCODE = KXPSX.CSTCODE AND K2.CSTCODE='2' AND K2.OPTMAT ='000000002120900109') "+
         " AND    BZIRK='"+pm_dqid+"'"+ " ORDER BY KXPSX.MATNR,CSTCODE,ATTCODE " ;
				await  $sqlLite.executeQry(drinkProSql,"正在获取水吧数据",(res)=>
				{  
										
					//console.log(JSON.stringify(res).substring(0,2000));
								dinkP=res.msg;    
				 
				},null);	
	     	console.log("##############################开始进行数组整合##############################")  
	         let  arrAllsp=   this.arrListGroupBy(mainArr,cakeSpesc,dinkP);
	        console.log("##############################调用完成进入回调函数##########################")
			   
			 if(callbackfun)
			 {
				 console.log("售价"+JSON.stringify(spPrice).substr(0,300));
				  console.log("商品"+JSON.stringify(arrAllsp).substr(0,300));
				 callbackfun(arrAllsp,spPrice);
				 
			 }
		     return new Promise((resolve, reject) => {
			 		          return resolve({
			 		          	code: true,
			 		          	msg: arrAllsp});
			 		      
			              })
	 
	 },
	
	
}


export default 
 {
    loadSaleSP
 }