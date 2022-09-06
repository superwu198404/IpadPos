import sale from '@/utils/sale/saleClass.js';
import saleCommit from '@/utils/util.js';
var XsTypeObj = {

	sale: //普通销售模式，最基本的模式
	{
		xstype: "1",
		clickType: "sale",
		nameSale: "销售",
		iconHui: require("@/images/xiaoshou-hui.png"),
		iconCurr: require("@/images/xiaoshou.png"),
		Operation :   //只设置为true的就好 其他的默认设置为false
		{
			  "HY": true, //是否可以录入会员
			 "DKF": true, //是否可以打开录入大客户
			"Disc": true, //是否可以打开录入折扣
			"ynFzCx": true, //是否可以辅助促销
			"ynCx": true, //是否进行可以进行促销    
			"sale": true, //从这里开始都是销售模式
			"saleYd": true,
			"seleYdtq": true,
			"seleWebWeb": true,
			"seleSx": true,
			"seleTh": true,
			"saleYdqx": true,
			"saleSxth": true,
			"sale002Rows":true,// 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows":0 ,//是否存在锁定行数
			"inputsp":true //是否可以输入商品
		},
		$click() 
		{
			return true;
		},
		$initSale: function(pm_Operation) 
		{
			
		},
		///对打印的控制
		$print: function() 
		{

		},
		//在此模式下添加商品是否所有限制
		$addSp: function(pm_input) 
		{
			//无条件返回表示，不需要限制
			return true;
		},
		///在付款之前的操作
		$beforeFk: function() 
		{
			//可以使用的支付方式 
		},
		//支付完成之前销售单之前
		$SaleBefor: function() 
		{
			  //一些特殊的设置
		},
		//支付完成中
		$saleFinishing: function() 
		{
			  //一些特殊的设置
		},
		//支付完成以后
		$saleFinied: function()
		{
			  //一些特殊的设置
		},
	},
	saleYd: 
	{
		xstype: "3",
		clickType: "saleYd",
		nameSale: "预定",
		iconHui: require("@/images/yuding-hui.png"),
		iconCurr: require("@/images/yuding.png"),
		$click()
		{
			this.setManage("saleYd");
			return true;
		},
	},

	seleYdtq: {
		xstype: "5",
		clickType: "seleYdtq",
		nameSale: "预定提取",
		iconHui: require("@/images/wxz-ydtq.png"),
		iconCurr: require("@/images/xz-ydtq.png"),
		$click()
		{
			this.setManage("saleYd");
			return false;
		},
	},
	seleWebWeb: {
		xstype: "8",
		clickType: "seleWebWeb",
		nameSale: "线上订单提取",
		iconHui: require("@/images/xianshangdd-hui.png"),
		iconCurr: require("@/images/xianshangdd.png"),

	},
	seleSx: {
		xstype: "6",
		clickType: "seleSx",
		nameSale: "赊销",
		iconHui: require("@/images/shexiao-hui.png"),
		iconCurr: require("@/images/shexiao.png"),

	},
	seleTh: {
		xstype: "2",
		clickType: "seleTh",
		nameSale: "销售退货",
		iconHui: require("@/images/xstd-wxz.png"),
		iconCurr: require("@/images/xstd.png"),
	},
	saleYdqx: {
		xstype: "4",
		clickType: "saleYdqx",
		nameSale: "预定取消",
		iconHui: require("@/images/ydqx-wxz.png"),
		iconCurr: require("@/images/ydqx.png"),
	},
	saleSxth: {
		xstype: "7",
		clickType: "saleSxth",
		nameSale: "赊销退货",
		iconHui: require("@/images/sxtd-wxz.png"),
		iconCurr: require("@/images/sxtd.png"),
	},
}

function  GetSale(pm_store,pm_posid,pm_ryid,pm_page,mPageName,pm_kcdid,pm_dpid,pm_gcid)
{
	 var that =this;
	 this.billindex =0;
	 this.getDate  =function()
	 {
		   let d= new Date();
		   var x=d.getFullYear()+"-"+ ((d.getMonth()+1)<10?"0":"")+(d.getMonth()+1)+"-"+(d.getDate()<10?"0":"")+d.getDate();
		   return d; 
	 }
	this . getTime  =function()
	{
		   let d= new Date();
		   var x=d.getFullYear()+"-" +(d.getMonth()+1)+"-"+d.getDate() + " " +d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		   return d;
	}
	 this.getBill  = function()
	 {
		   var  newbill  ="";
		   if(  this.bill ==null)
		   {
		      let d= new Date();
		      newbill= this.Storeid+this.Posid+""+d.getFullYear()%100 +(d.getMonth()+1)+d.getDate()+d.getHours() +d.getMinutes()+d.getSeconds();
		      //单号格式：门店号+pos号+yymmddHHmmss+流水号 自打开程序以后的开单号，每天清零
			  newbill =newbill+""+ this.billindex;
			  this.billindex++;
		   }
		   else
		   {
			  newbill =this.bill;
		   }
		   return newbill;
	 }
	 
	 
  this.log =function(str)
  { 
	 if(typeof(str)=='string')
	 {
	   console.log(str);
	 }
	 else
	 {
		// console.lo.call(this.parent,JSON.stringify(str))
		 console.log(JSON.stringify(str));
	 }
  }
  //由于未知弹窗所以暂时用这个	 
  this.myAlert = function(pm_str1,pm_str2)
  {
	  
	  that.log("--------------看到这个说明弹窗功能还没有做！--------------")
  }
  this.Storeid     =  pm_store;
  this.storeName   =  "";
  this.Posid       =  pm_posid;
  this.ryid        =  pm_ryid;
  this.saledate    =  this.getDate();
  this.KCDID       =  pm_kcdid
  this.DPID        =  pm_dpid
  this.GCID        =  pm_gcid
  this.xsType      =  "sale"
  this.bill_type   =  null;  //sale.saleBillType[this.xsType];
  this.bill        =  null;
  this.Page        =  pm_page;
  this.sale001     =  {};  
  this.sale002     =  [];  
  this.sale003     =  [];
  this.sale008     =  [];
  this.clickSaleType   =  {};//当前点击的销售模式
  this.currentType =  {};//当前的销售模式
  this.payPassWord =  false;//当前模式支付是否要输入登录密码
  this.selectFlag  =  "A";
  //不支持的付款方式
  this.notFayType  =  [];
  //商品售价的信息列表
  this.spPrice ={};
  //字母的列表
  this.flagList=[];
  //根据字母筛选出来的商品列表
  this.selectFlagList=[];
  //点击的单个商品
  this.clikSpItem={};

  //商品档案002 以商品id为键值的结构
  this.spSelectArr={};
   //选择的plid
   this.selectPlid="";
   
   //切换到选择的品类id
   this.scrollinto ="";
  this.update=function()
  {
	  if(that.Page)
	  {
	     that.Page.$forceUpdate()  
	  }
	  else
	  {
		that.log("页面变量丢失！！！！！！！")  
	  }
  }
    //初始化所有可以点击的商品
  this.HY  =
	  {  
			  cval:{},
			  base:{},
			  get val()
			  {
				  return  this.cval;
			  },
			  set val(newval)
			  {
				  this.base.ComponentsManage["HY"]=false;
				  this.cval  =  newval;
			  } 
	  }//会员的结构
  this.HY.base = this;
  this.DKF =
  {
	  base:{},
	  cval:{},
	  Defval : "80000000",
	  get val()
	  {
	      return   this.cval;
	  },
	  set val(newval)
	  {   
		  this.base.ComponentsManage["DKF"]=false;
		  if(newval ==null|| newval ==this.Defval)
		  {
			  this.cval =  this.Defval;
			  return;
		  }
		  this.cval = newval;
	  } 
  }
  this.DKF.base = this;
  this.Disc =
  {    
	  base:{},
	  cval:{},
	  Defval:100,
	  get val()
	  {
	  	  return  this.cval;
	  },
	  set val(newval)  
	  {
		  //赋值的时候进行计算
	      this.cval  =  newval;
		  this.base.ComponentsManage["Disc"]=false;
		  if(  this.cval >= 100  )
		  {
			 this.base.allOperation["Disc"]  =false;
			 this.base.allOperation["ynFzCx"]=true;
			 this.base.allOperation["ynCx"]  =true;
		  }
		  else
		  {
			  this.base.allOperation["Disc"]  =true;
		      this.base.allOperation["ynFzCx"]=false;
		      this.base.allOperation["ynCx"]  =false;
		  }
	  } 
  };//当前选择的折扣方式
  this.Disc.base = this;
  this.pageName  = mPageName;
  ///所有商品的列表,具体参考 utils.sale.xs_sp_init.js
  this.Allsplist = null;
  //this.oldOperation = null;
  
  
  this.selectPlidChenged =function(e)
  {
	   var plid  =  e.currentTarget.dataset.plid;
	   that.selectPlid = plid;
	   that.scrollinto = that.selectFlag + plid;
	   that.log("切换到的品类"+that.scrollinto)
	   that.Page.$set(that.Page[that.pageName],"selectPlid" , that.selectPlid );
	   that.Page.$set(that.Page[that.pageName],"scrollinto" , that.scrollinto );
  }
 //初始化字母的列表
 
  this.filterSp=function(pm_flag)
  {
  	  this.selectFlag =pm_flag;
	  
  	  this.selectFlagList=this.Allsplist.filter(item=>{ return item.FSTR==pm_flag});
	   that.log("为什么没有生成代码")
	  if( this.selectFlagList.length >0)
	  {
	      this.selectPlid = this.selectFlagList[0].plid;
	      this.scrollinto = this.selectFlag + this.selectPlid;
		  that.log("默认的品类id"+ this.selectPlid)
	  }
	  that.log("筛选出来的长度"+ this.selectFlagList.length)
	  this.Page.$set(this.Page,"Alphabetical" , false );
	  this.update()
	 // this.Page.$set(this.Page[this.pageName],"selectPlid" , this.selectPlid );
	 // this.Page.$set(this.Page[this.pageName],"selectFlagList" , this.selectFlagList );
	 // this.Page.$set(this.Page[this.pageName],"selectFlag" , this.selectFlag );
	 
	   
	  //筛选字母的列表
	  
  }
  
  this.setAllSpList=function(pm_list,pm_price)
  {
	  this.spPrice    =pm_price;
	  this.Page.$set(this.Page[this.pageName],"spPrice" , this.spPrice );
	  this.Allsplist  = pm_list;
  	  this.filterSp("A");
  	  that.log( "绑定完成！"+JSON.stringify( this.Page[this.pageName].selectFlagList[0]));
	  
	  
		 this.Allsplist.forEach(item=>{
			  
			  if( that.flagList.indexOf(item.FSTR )<0)
			  {
			     that.flagList.push( item.FSTR) 
			  }
			  
		  })
	  that.log("初始化字母列表"+JSON.stringify(this.flagList));
	  this.Page.$set(this.Page[this.pageName],"flagList" , this.flagList );
	  that.log( "绑定字母表！");
	  
  }
  
  this.FlagClick=function(e)
  {
  	  var flagX  =  e.currentTarget.dataset.flag; 
	  that.log( "点击的字母！"+flagX);
  	  that.filterSp.call(that,flagX);
  }
  
  ///当前模式下可以操作的功能，初始化以后会写到此列表中，在此列表中此可以进行点击操作，不在是不可以点击或者操作、计算等！
  this.currentOperation = {"statement":false};
  ///销售界面可以进行操作功能 ，
  this.allOperation = 
  {
  	"HY": false, //是否可以录入会员
  	"DKF": false, //是否可以打开录入大客户
  	"Disc": false, //是否可以打开录入折扣
  	"ynFzCx": false, //是否可以辅助促销
  	"ynCx": false, //是否进行可以进行促销    
  	"sale": false, //从这里开始都是销售模式
  	"saleYd": false,
  	"seleYdtq": false,
  	"seleWebWeb": false,
  	"seleSx": false,
  	"seleTh": false,
  	"saleYdqx": false,
  	"saleSxth": false,
  	"openydCustmInput": false, //预定输入客户的信息
	"sale002Rows":false,// 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
	"lockRows":0,//是否存在锁定的行数
	"inputsp":false,
	"statement":true, //购物车
  }
  //插件的显示在这里控制
  this.ComponentsManage = 
  {
  	"HY": false, //会员插件是否打开
  	"DKF": false, //大客户插件是否打开
  	"Disc": false, //折扣插件是否打开
  	"saleYd": false,
  	"seleYdtq": false,
  	"seleWebWeb": false,
  	"seleSx": false,
  	"seleTh": false,
  	"saleYdqx": false,
  	"saleSxth": false,
  	"openydCustmInput": false, //预定输入客户的信息
	"inputsp":false, 
	"statement":false, //购物车
  }
  var lastManage=null;
  ///设置基础的权限
  this.setCurrentOperation=function(pm_OperEnum)
  {
	 // that.log("传入权限"+ JSON.stringify( pm_OperEnum));
	  //所有模式都具有的默认权限 在这里直接初始化好 ，
	   this.currentOperation = {"statement":false};
	  for (var item in this.allOperation) 
	  {
	      //that.log("开始设置权限"+item);
		  if(pm_OperEnum[item])
		  {
	  	  //普通销售具有所有的权限
	         this.currentOperation[item] = pm_OperEnum[item]
		  }
		  else
		  {
			 this.currentOperation[item] = false;
		  }
		  //切换的时候关闭所有插件
		  for(item in this.ComponentsManage)
		  {
			  that.ComponentsManage[item] =false;
		  }
		  this.update();
	  }
  } 
  
  //设定具体的插件件让其进行显示,并关闭其他插件 //saleYd  
  this.setManage=function(pm_mtype)
  {
	  that.log(lastManage);
	  if(lastManage!=null&&pm_mtype != lastManage)
	  {
		  that.ComponentsManage[lastManage] =false;
	  }
	  that.log("点击的类型"+pm_mtype);
	  that.ComponentsManage[pm_mtype]  = !that.ComponentsManage[pm_mtype];
	  lastManage  = pm_mtype;
	  that.Page.$set(that.Page[that.pageName],"ComponentsManage" , that.ComponentsManage);
	  that.update();
	  that.log("绑定完成"+that.ComponentsManage[pm_mtype]);
  }
  
  //设置所有插件的切换非销售模式的切换  会员  折扣 大客户等事件
  this.setComponentsManage = function(e)
  {
  	  let mtype = e.currentTarget.dataset.mtype;
	  that.log("mtype="+mtype+"#" + JSON.stringify(that.currentOperation))
	  if(that.currentOperation.hasOwnProperty(mtype))
	  {
		  that.setManage(mtype);
	  }
	  else
	  {
		  that.myAlert("当前模式下进行此操作")
	  }
  }
  
  //调用各个销售类型的方法名称,参数列表
  this.currentTypeCall =function(pm_fun)
  {
	  let defstr="def"
	  let arr=[]; 
	  for(var i=1;i<arguments.length;i++)
	  {
		  arr.push(arguments[i])
	  };
	  if(that.currentType[pm_fun] )
	  {
	     that.currentType[pm_fun].call(that,arr);
	  }
	  else
	  {
		 //方便定义公用的处理方法，如果销售类型里没有这个方法则调用这个
		 if(that[defstr+pm_fun])
		 {
			 that[defstr+pm_fun].call(that, arr);
		 }
	  }
  } 
  //展示商品的详情的事件
  this.showSpDetails=function(e)
  {
	  //that.log("开始点击"+ JSON.stringify(that.currentOperation));
	  if(!that.currentOperation.inputsp)
	  {
		  that.myAlert("当前模式下不可录入商品")
		  return;
	  }
	  
	  let plindex  =  e.currentTarget.dataset.plindex; 
	   that.log("开始点击plindex"+plindex);
	  let spindex  =  e.currentTarget.dataset.spindex;
	   that.log("开始点击spindex"+plindex);
	   that.log("当前显示的商品集合"+JSON.stringify( that.selectFlagList[plindex]));
	  let plitem    =  that.selectFlagList[plindex];
	  let spitem   = plitem.plarr[spindex];
	  that.clikSpItem      = spitem;
	  that.clikSpItem.inputQty=0;
	  if(that.clikSpItem.ynshowlist)  //如果是蛋糕默认选择一个商品id
	  {
	    that.clikSpItem.selectSPID=that.clikSpItem.specslist[0].SPID;
	  }
	  else
	  {
		  that.clikSpItem.selectSPID=that.clikSpItem.SPID;
	  }
	   
       that.log("设置显示对象"+JSON.stringify( that.clikSpItem));
	  that.Page.$set(that.Page[that.pageName],"clikSpItem" , that.clikSpItem);
	  that.setManage("inputsp") 
  }
  ///商品详情页的加号和 减号
  this.chengedQty=function(e)
  {
	  
	  let qty  =  e.currentTarget.dataset.qty; 
	  that.log("开始点击that.clikSpItem.inputQty"+that.clikSpItem.inputQty);
	  qty= parseFloat(qty)
	  let oldqty= parseFloat(that.clikSpItem.inputQty)
	  qty=qty+oldqty ;
	  that.clikSpItem.inputQty=qty;
	  //that.Page.$set(that.Page[that.pageName].clikSpItem,"inputQty",qty);
	  that.update()
	  that.log("-----绑定完成++++"+qty);
  }
  
 ///修改销售类型
 ///参数1销售类型，参数2单据列表
  this.setType =  function(pm_type)
  {
	  that.log(pm_type);
	  if( XsTypeObj[pm_type] )
	  {
		  this.clickSaleType = XsTypeObj[pm_type];
		  this.Page.$set(that.Page[that.pageName],"clickSaleType" , that.clickSaleType);
		  that.log("销售类型"+ pm_type );
		  if( this.sale002.length>0 &&  (this.currentOperation.sale002Rows == this.clickSaleType.Operation.sale002Rows))
		  {
			   this.myAlert("已经输入了商品不能进行此操作")
			   return ;
		  }
		  that.log(JSON.stringify(this.currentType));
		  if(this.clickSaleType.$click.call(this))
		  {
		      this.$initSale(this.clickSaleType);
		  }
	  }
	  else
	  {
		 this.myAlert("没有此种操作模式"+ pm_type);
	  }
  }
  ///销售类型相关的 click事件
 this.saleTypeClick = function(e)
 {
 	 // e.target.dataset.key
      var stype  =  e.currentTarget.dataset.stype; 
 	  that.log("click"+stype)
 	  that.setType.call(that,stype);
 }
 
 //初始化销售的操作
 this.$initSale =function(pm_newtype,pm_saleobj)
 {
	  pm_newtype=pm_newtype||this.clickSaleType;
 	  this.currentType = pm_newtype;
 	  this.currentTypeCall("$initSale",pm_saleobj)
 	  //this.currentType.$initSale.call(this,pm_saleobj);
 	  this.bill_type  = sale.saleBillType[this.currentType.xstype];
 	  that.log(JSON.stringify(this.bill_type));	 
 	  this.xsType  =  this.currentType.xstype;
 	  //设置权限生效
 	  that.log("开始设置权限"+ JSON.stringify( this.currentType.Operation));	
 	  this.setCurrentOperation(this.currentType.Operation);
 	  this.Page.$set(this.Page[this.pageName],"currentType" ,this.currentType );
 }
  
  //输入会员的方法
  this.InputHy =function(e)
  {
	  
  }
  this.InputDkf  =function(e)
  {
	  
	  
  }
  this.cxBillinit = function()
  {
  
  }
 
  //统计生成促销发生
  this.mdcxfs = function() 
  {
  
  }
 
  this.initcxSpRow = function()
  {
	  
  }
  this.cxBillinit  =function()
  {
	  
  }
  
  this.createNewBill =function()
  {
	  var commonSaleParm ={}
	  if(Object.keys(this.sale001).length ==0)
	  {       //BILL,KCDID  ,DPID,SALETIME,GCID
	         let newbill  =this.getBill();
			 let stime    =this.getTime();
			 commonSaleParm = {KHID:this.Storeid,
	  		                                  SALEDATE:this.SALEDATE,
	  		                                  POSID:this.POSID,
											  RYID:this.ryid,
											  BILL:	newbill,
											  KCDID: this.KCDID,
											  GCID:this.GCID,
											  SALETIME: stime    };
 	  		 this.sale001 =new sale.sale001( commonSaleParm)
			
	  }
	  else
	  {
		  commonSaleParm={KHID:this.sale001.Storeid,
	  		                                  SALEDATE:this.sale001.SALEDATE,
	  		                                  POSID:this.sale001.POSID,
											  RYID:this.sale001.ryid,
											  BILL:	this.sale001.bill,
											  KCDID: this.sale001.KCDID,
											  GCID:this.sale001.GCID,
											  SALETIME: this.sale001.SALETIME }
	  }
	  that.log(JSON.stringify(commonSaleParm));
	  return commonSaleParm;
  }
  //转换为小数，并保留2位
  this.float =function(pm_num,pm_declen)
  {
	  
	  return  parseFloat(pm_num).toFixed(pm_declen);
  }
  
  ///汇总sale002的所有内容
  this.sale002Sum =function(pm_input)
  {
	  this.sale002.forEach(item=>
	  {
		   that.log(JSON.stringify(item));
		   let keys =  Object.keys(pm_input);
		   for( var i=0;i<keys.length;i++ )
		   {
			   that.log(JSON.stringify(keys[i]));
			   pm_input[keys[i]] += that.float(item[keys[i]],2);
			   that.log(JSON.stringify(pm_input));
		   }
	  } )
	  
	  return pm_input;
  }
  //点击商品的详情触发的事件
  this.getSp =function(e)
  {
	  let pm_spid = that.clikSpItem.selectSPID; 
	  let pm_yndgxp =e.currentTarget.dataset.yndgxp;//是否是改胚蛋糕
	  let pm_qty  =that.clikSpItem.inputQty;
	  let find =false;
	  let inqty = parseFloat(pm_qty);
	  that.log(pm_spid+"#"+pm_qty+"pm_yndgxp")
	  ///检查是否已经添加过  如果已经添加过 直接修改某一行
	  for(var row=0;row< that.sale002.length;row++ )
	  {
		  if (that.sale002[row].SPID ==pm_spid )
		  {
			  find= that.updateSp(row,pm_spid,inqty)
			  break;
		  }
	  }
	  if(!find)
	  {
		//STR1 商品名称 STR2 门店名称  YN_XPDG  ,YNZS, SPJGZ
		  let newprm= that.createNewBill.call(that);
		  let new002  =new sale.sale002(newprm);
		  new002.SPID = pm_spid;
		  new002.NO   = that.sale002.length;
		  new002.STR1 = that.clikSpItem.SNAME;
		  new002.UNIT = that.clikSpItem.UNIT;
		  new002.STR2 = that.storeName;
		  new002.YN_XPDG = pm_yndgxp;
		  new002.SPJGZ   =that.clikSpItem.SPJGZ;
		  let price  = that.spPrice[pm_spid].PRICE;
		  pm_qty  = that.float(pm_qty,3);
		  price   = that.float(price,2);
		  new002.PRICE   =price;
		  new002.QTY     =pm_qty;
		  new002.NET     = that.float(pm_qty*price,2);
		  new002.DISCRATE =0;
		  new002.BARCODE =that.clikSpItem.SPID;
		  that.sale002.push(new002);
		  that.log("添加了商品"+JSON.stringify(new002));
	  }
	  that.setManage("inputsp");
  }
  //大于0的时候修改,小于等于0删除
  this.updateSp=function(pm_row,pm_spid,pm_qty)
  {
	  if(pm_qty>0  )
	  {
		  this.sale002[pm_row].QTY=pm_qty;
		  let price = this.float(this.sale002[pm_row].PRICE);
		  this.sale002[pm_row].NET= this.float(pm_qty*price,2) ;
		  that.log("更新商品"+JSON.stringify(this.sale002[pm_row]))
	  }
	  if( pm_qty <=0 )
	  {
		  this.sale002.splice(pm_row,1);
	  }
	  return true;
  }
  //显示购物车呢 
  this.showStatement=function(e)
  {
	  
	  that.saleNetAndDisc();
	  that.setManage("statement")
  }
  //计算sale002
  this.saleNetAndDisc =function()
  {
	 let znet=0 
     if(that.currentOperation.ynCx)
  	 {
  		 that.computeCx();
  	 }
  	 if(that.currentOperation.Disc)
  	 {
  		 that.discCompute();
  	 }
	 that.sale001.TLINE  = that.sale002.length;
	 var retx=   that.sale002Sum( {NET:0,DISCRATE:0});
	 that.sale001.ZNET = this.float(retx.NET,2);
	 that.sale001.DISC =this.float(retx.DISCRATE,2);
	 //this.update();
  }
  //实际计算促销需要在这个方法里进行
  this.computeCx=function()
  {
  	  
  }
  //计算促销的折扣
  this.discCompute = function()
  {
  
  }
  this.beforeFk= function()
  {
	  //在付款前写这个防止左右更改！
	  this.sale001.XSTYPE   = this.xstype     //付款的时候写
	  this.sale001.BILL_TYPE= this.bill_type  //
	  this.currentTypeCall("$beforeFk");
  	//可以使用的支付方式 
  }
  
  this.resetSaleBill=function()
  {
	  this.HY.cval=null;
	  this.DKF.cval=null;
	  this.Disc.cval =null;
	  this.bill =null;
	  this.sale001={};
	  this.sale002=[];
	  this.sale003=[];
	  this.clikSpItem={};
	  this.setDeftype();
      that.update()
  }

   ///打印的方法
	  this.$print =function(e)
	  {
		  
	  }
  
	this.setDeftype = function() 
	{
		this.setType("sale");
	}

	
	
	//计算积分
	this.getJfcompute = function() 
	{

	}
	//输入会员的方法
	this.InputHy = function() 
	{

	}
	this.InputDkf = function() 
	{


	}
	
	
}
export default {
	XsTypeObj,
	GetSale
}
