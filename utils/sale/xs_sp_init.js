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
		let newarrList  =[]
	    console.log("开始获取拼音首字母");
		 newarrList=  pm_arr.map( 
		 item=> {  
			let py   =  item.pinyin;
			console.log("数组的结构"+JSON.stringify(item))
			let flag="";
			for(let x=0;x<py.length;x++)
			{
				if(py[x].charCodeAt(x)>= 97&& py[x].charCodeAt(x) <= 122 )
				{
				    flag  = py.substr(x,1);
					break;
				}
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
		
		console.log(pm_arr.length+"#"+cake_arr.length+"#"+drinkP_arr.length+"#")
		let  pkey ="";
		let retArr  =[];
		pm_arr  =  this.getFstrAndSort(pm_arr);
		retArr= pm_arr.sort((a,b)=>{ let x=0;  if( (a.FSTR< b.FSTR) ||( a.FSTR ==b.FSTR   &&  a.plid<b.plid) ) { x=-1} else{x=1}  return x});
		let  plarr;  //品类的子集
		let  fsArr;  //字符的总集集
			retArr.forEach( item =>{
				let fslag  =  item.FSTR;
				let plid   =  item.plid;
				let plname = item.plname;
				let cpk  = fslag+""+plid;
				if(cpk !=pkey)
				{
					plarr=[];
					fsArr.push( {"FSTR":fslag,"plid":plid,"plname":item.plname,"plarr":plarr }  );
					console.log(item.plname+"字母"+fslag)
				}
				if(item.ynshowlist == "1")
				{
	        		item.specslist= cake_arr.filter(cakeitem=>{return  cakeitem.SPID ==item.SPID })
					console.log( JSON.stringify(item.specslist)  );
				}
				if( item.ynAddPro=="1")
				{
					item.addlist = drinkP_arr.filter(drinkitem=>{return drinkitem.MATNR == item.SPID } )
					console.log( JSON.stringify(item.addlist)  );
				}
				plarr.push(item);
			})
		 console.log(  JSON.stringify(plarr.slice(0,3)) );
	     return 	retArr;			 
	},
	loadSp:async function(pm_storeid,callbackfun,pm_dqid)
	{
	 
	 // var  cakeid=pm_cakeid.split(",").map((item)=> {return  "'"+item+"'"});
	   console.log("开始获取主商品")
	  var  mainArr  =[];
	  var  cakeSpesc =[];
	  var  dinkP =[]
	  
	    console.log("##############################开始获取主商品##############################")
	 //z主商品sql 1
	  let  msplistSql=
	  "SELECT substr(S1.pinyin,1,1) FSTR, S1.SPID,S1.SNAME,S1.pinyin,SM.ZLID plid,PLDA.SNAME plname, \
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
	let drinksAddSql= " select  substr(dgxlda.pinyin,1,1) FSTR,dgxlda.dgxlid SPID,dgxlda.SNAME ,dgxlda.pinyin,dgxlda.plid,PLDA.SNAME plname,\
	                   1 ynshowlist , '' specslist,0 ynAddPro,'' addlist  \
				     from  dgxlda,plda where dgxlda.plid=plda.plid \
					 and  exists(select 1 from spda_dgxl,spkhda where spda_dgxl.spid= spkhda.spid \
				     and spkhda.YN_XS='Y' and   spkhda.khid ='"+pm_storeid+"' \
				     and spda_dgxl.dgxlid =dgxlda.dgxlid)";
			 await  $sqlLite.executeQry(drinksAddSql,"正在获取蛋糕数据",(res)=>
			 {  
						
		       	console.log(JSON.stringify(res).substring(0,2000));
			    mainArr=	mainArr.concat(res.msg);    
			    console.log(JSON.stringify(mainArr.length));
			 },null);	
	    console.log("##############################开始获取蛋糕规格##############################")	
	  //蛋糕规格 
	 let  cakeSpescSql=" SELECT  spda_dgxl.spid, IFNULL(spda_dgxl.cccz,'无尺寸')   \
	               from spda_dgxl,spkhda where spda_dgxl.spid= spkhda.spid  \
				     and spkhda.YN_XS='Y' and   spkhda.khid ='"+pm_storeid+"'";
					 
			await  $sqlLite.executeQry(cakeSpescSql,"正在获取蛋糕数据",(res)=>
			{  				
			  	console.log(JSON.stringify(res).substring(0,2000));
							cakeSpesc=res.msg;    
			},null);			 
	  //水吧sql	3		 
	  
	   console.log("##############################开始获取水吧商品##############################")
	  let  msDrinksql="SELECT  substr(S1.pinyin,1,1) FSTR, S1.SPID,S1.SNAME,S1.pinyin,SM.ZLID plid,PLDA.SNAME plname, "  +
	" 0 ynshowlist , '' specslist, 1 ynAddPro,'' addlist "  +
    "FROM SPDA S1,SPKHDA SM,PLDA " +
	"WHERE S1.SPID =SM.SPID AND PLDA.PLID=SM.ZLID "+
	"AND SM.YN_XS='Y'  AND  S1.SPJGZ IN ('01','02')  "+ 
	"AND S1.SPJGZ IS NOT NULL  AND SM.KHID ='"+pm_storeid+"' AND  "+
	"EXISTS (SELECT 1 FROM KXPSX WHERE ifnull(KXPSX.DELMK,'N')='N' AND KXPSX.BZIRK='"+pm_dqid+"' AND SM.SPID = KXPSX.MATNR )";
	  			await  $sqlLite.executeQry(msDrinksql,"开始获取水吧商品",(res)=>
	  			{  
	  									
	  			  	console.log(JSON.stringify(res).substring(0,2000));
	  			     mainArr=	mainArr.concat(res.msg);     
	  			 
	  			},null);						 
			 console.log("##############################开始获取水吧属性##############################")		 
     //水吧属性	 
	      let drinkProSql  =" SELECT  MATNR, CSTCODE,ATTCODE, ATTNAME, OPTCODE, OPTMAT, OPTNAME, RECMARK  "+" FROM  KXPSX   WHERE   ifnull(DELMK,'N')='N' AND    BZIRK='"+pm_dqid+"'"+
" ORDER BY KXPSX.MATNR,CSTCODE,ATTCODE " ;
				await  $sqlLite.executeQry(drinkProSql,"正在获取水吧数据",(res)=>
				{  
										
					console.log(JSON.stringify(res).substring(0,2000));
								dinkP=res.msg;    
				 
				},null);	
		console.log("##############################开始进行数组整合##############################")  
	         let  arrAllsp=   this.arrListGroupBy(mainArr,cakeSpesc,dinkP);
	    console.log("##############################调用完成进入回调函数##############################")
			   
			 if(callbackfun)
			 {
				 callbackfun(arrAllsp);
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