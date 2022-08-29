import sale from '@/utils/sale/saleClass.js';

var XsTypeObj=
{
	
	sale://普通销售模式，最基本的模式
	{
		xstype:"1",
		clickType:"sale",
		nameSale:"销售",
		iconHui:require("@/images/xiaoshou-hui.png"),
		iconCurr:require("@/images/xiaoshou.png"),
		$click()
		{
			return  true;
		},
		$initSale:function()
		{
		   let OperEnum  = this.OperEnum;
		   this.currentOperation={}
		   for(var item in OperEnum)
		   {
			   console.log(item);
		   //普通销售具有所有的权限
		      this.currentOperation[item]=OperEnum[item];
		   }
	    	this.lockRows  =0;					 
		    this.setOperationArr(this.currentOperation);
		},
		///对打印的控制
		$print:function(e)
		{
			  
		},
		//在此模式下添加商品是否所有限制
		$addSp:function(pm_input)
		{
			//无条件返回表示，不需要限制
		    return true;
			 
		},
		///在付款之前的操作
		$beforeFk:function()
		{
		   //可以使用的支付方式 
		},
		//銷售生成销售单之前
		$SaleBefor:function()
		{
		  //一些特殊的设置
		},
		$saleFinish:function()
		{
		  //一些特殊的设置
		},
	},
	saleYd:
	{
		xstype:"3",
		clickType:"saleYd",
		nameSale:"预定",
		iconHui:require("@/images/yuding-hui.png"),
		iconCurr:require("@/images/yuding.png"),
	},
	
	seleYdtq:
	{
		xstype:"5",
		clickType:"seleYdtq",
		nameSale:"预定提取",
		iconHui:require("@/images/wxz-ydtq.png"),
		iconCurr:require("@/images/xz-ydtq.png"),
	},
	seleWebWeb:
	{
		xstype:"8",
		clickType:"seleWebWeb",
		nameSale:"线上订单提取",
		iconHui:require("@/images/xianshangdd-hui.png"),
		iconCurr:require("@/images/xianshangdd.png"),
		
	},
	seleSx:
	{
		xstype:"6",
		clickType:"seleSx",
		nameSale:"赊销",
		iconHui:require("@/images/shexiao-hui.png"),
		iconCurr:require("@/images/shexiao.png"),
		
	},
	seleTh:
	{
		xstype:"2",
		clickType:"seleTh",
		nameSale:"销售退货",
		iconHui:require("@/images/xstd-wxz.png"),
		iconCurr:require("@/images/xstd.png"),
	},
	saleYdqx:
	{
		xstype:"4",
		clickType:"saleYdqx",
		nameSale:"预定取消",
		iconHui:require("@/images/ydqx-wxz.png"),
		iconCurr:require("@/images/ydqx.png"),
	},
	saleSxth:
	{
		xstype:"7",
		clickType:"saleSxth",
		nameSale:"赊销退货",
		iconHui:require("@/images/sxtd-wxz.png"),
		iconCurr:require("@/images/sxtd.png"),
	},
}

function   GetSale(pm_store,pm_posid,pm_ryid,pm_page,mPageName)
{
	
	var  getDate  =function()
	 {
		   let d= new Date();
		   var x=d.getFullYear()+"-" +(d.getMonth()+1)+"-"+d.getDate();
		   return d; 
	 }
	
	var  getTime  =function()
	{
		   let d= new Date();
		   var x=d.getFullYear()+"-" +(d.getMonth()+1)+"-"+d.getDate() + " " +d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		   return d;
	}
	 var getBill  = function()
	 {
		   var  newbill  ="";
		   if(  this.bill ==null)
		   {
		      let d= new Date();
		      newbill= this.Storeid+this.Posid+""+d.getFullYear()%100 +(d.getMonth()+1)+d.getDate()+d.getHours() +d.getMinutes()+d.getSeconds();
		     //单号格式：门店号+pos号+yymmddHHmmss+流水号 自打开程序以后的开单号，每天清零
		   }
		   else
		   {
			  newbill =this.bill;
		   }
		   return newbill;
	 }
  this.Storeid    =  pm_store;
  this.Posid      =  pm_posid;
  this.ryid       =  pm_ryid;
  this.saledate   =  getDate();
  this.saletime   =  new Date();
  this.xsType     =  "sale"
  this.bill_type  =  null;  //sale.saleBillType[this.xsType];
  this.bill       =  null;
  this.Page       =  pm_page;
  this.Msale      ={};
  this.currentType =null;//当前的销售模式
  this.payPassWord=false;//当前模式支付是否要输入登录密码
  this.HY  ={  
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
			  return;
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
  ///当前锁定的行为多少
  this.lockRows  = 0;
  this.setAllSpList=function(pm_list)
  {
	  this.Allsplist  = pm_list;
	  this.Page.$set(this.Page[this.pageName],"Allsplist" , this.Allsplist );
  }
  
  
  //可以进行操作的销售功能简称，这些功能在初始化的时候会进行赋值，
  this.OperEnum=
  {
	  sale:"sale",
	  saleYd:"saleYd",
	  seleYdtq:"seleYdtq",
	  seleWebWeb:"seleWebWeb",
	  seleSx:"seleSx",
	  seleTh:"seleTh",
	  saleYdqx:"saleYdqx",
	  saleSxth:"saleSxth",
	  HY:"HY",
	  DKF:"DKF",
	  Disc:"Disc",
	  ynFzCx:"ynFzCx",
	  ynCx  :"ynCx",    
	  openydCustmInput:"openydCustmInput",//预定输入客户的信息
  }
  ///当前模式下可以操作的功能，初始化以后会写到此列表中，在此列表中此可以进行点击操作，不在是不可以点击或者操作、计算等！
  this.currentOperation={ };
  ///所有可能会涉及到操作的页面
  this.allOperation ={
	                   "HY":false,//是否可以录入会员
				       "DKF":false,//是否可以打开录入大客户
					   "Disc":false,//是否可以打开录入折扣
					   "ynFzCx":false,//是否可以辅助促销
					   "ynCx":false, //是否进行可以进行促销    
					   "sale":false,   //从这里开始都是销售模式
					   "saleYd":false,
					   "seleYdtq":false,
					   "seleWebWeb":false,
					   "seleSx":false,
					   "seleTh":false,
					   "saleYdqx":false,
					   "saleSxth":false,
					   "openydCustmInput":false,//预定输入客户的信息
                     }
  this.ComponentsManage=
  {
	  "HY":false,//会员插件是否打开
	  "DKF":false,//大客户插件是否打开
	  "Disc":false,//折扣插件是否打开
	  "openydCustmInput":false,//预定输入客户的信息
  }					 
  
 
  ///批量设置  哪些功能显示 哪些暂时关闭
  this.setOperationArr=function(pm_input_arr)
  {
	   for( let item in  this.allOperation)
	   {
	      this.setOperation(item,pm_input_arr[item]?true:false);
	   }
  }
  
  this.setOperation =function(pm_Operation,pm_bool_value)
  {
	   this.allOperation[pm_Operation]  = pm_bool_value;
	   
  }
  
  this.checkOperation = function(pm_Operation,e)
  {
	 let index = this.currentOperation.indexOf(pm_Operation);
	 if(  index >0)
	 {
		 let newvalue  = this.allOperation[pm_Operation];
		 this.setOperation(pm_Operation, newvalue);
	 }
	 else
	 {
		 //模态弹窗不可以执行
		 // await  mypop.awaitShowPopup("当前模式下不支持此操作!");
	 }
  }
  
 ///修改销售类型
 ///参数1销售类型，参数2单据列表
  this.setType =  function(pm_type)
  {
	  console.log(pm_type);
	  if(XsTypeObj[pm_type])
	  {
		  console.log("销售类型");
		  this.currentType = XsTypeObj[pm_type];
		  console.log(JSON.stringify(this.currentType));
		 if( this.currentType.$click.call(this))
		 {
		    this.$initSale(null);
		 }
	  }
	  else
	  {
		 // mypop.awaitShowPopup("没有此种操作模式"+ pm_type);
	  }
  }
  ///销售类型相关的 click事件
  this.saleTypeClick = function(e)
  {
	 // e.target.dataset.key
      var stype  =  e.target.dataset.stype; 
	  console.log("click"+stype)
	  this.setType(stype);
  }
  
  this.setDeftype =function()
  {
	   this.setType("sale");
  }
  
  this.addS002  =function(pm_id,pm_qty,pm_setlist)
  {
	  
	  
  	   //新增002
  	   //水吧新增008
  }
  this.updateS002 =function(pm_id,pm_qty)
  {
  	    //更新002 
  		//更新008
  }
  this.deleteS002 =function(pm_id)
  {
  	   //删除008
  	   //删除002
  }
  //创建新的销售单重置销售模式 
  this.ydSaleList  =function(pm_obj,e)
  {   
	  
  }
  //统计生成促销发生
  this.mdcxfs =function()
  {
	  
  }
  
  //输入商品的主方法
  this.getItemSp= async function(pm_spid,pm_qry,pm_row)
  {
	  if( !this.Msale)
	  {
		  this.Msale  = new sale.sale001();
		  //主单据赋值
	  }
	  this.$getSp(pm_spid,pm_qry);
  }
  //计算积分
  this.getJfcompute =function()
  {
	  
  }
  
  //输入会员的方法
  this.InputHy =function(e)
  {
	  
  }
  this.InputDkf  =function(e)
  {
	  
	  
  }
  //计算促销单
  this.saleCx =function(e)
  {
  	  
  	  
  }
  this.initcxSpRow = function(e)
  {
	  
  }
  this.cxBillinit  =function()
  {
	  
  }
  //实际计算促销需要在这个方法里进行
  this.computeCx=function()
  {
	  
  }
  //获取商品信息的语法糖
  this.$getSp =function(pm_id,pm_qty)
  {
	  
  }
  //计算促销的方法糖
  this.$saleCx =function()
  {
	  
  }
  
  //初始化销售的操作
  this.$initSale =function(pm_obj)
  {
  	  this.currentType.$initSale.call(this,pm_obj);
  	  this.bill_type  = sale.saleBillType[this.currentType.xstype];
  	  console.log(JSON.stringify(this.bill_type));	 
  	  this.xsType  =  this.currentType.xstype;
  	  //this.Page.$set(this.Page[this.pageName],"currentType" ,this.currentType );
	  if(pm_obj)
	  {
		  this.Msale  = pm_obj;
	  }
  }
  ///打印的方法
  this.$print =function(e)
  {
	  
  }
  this.$deleteSp=function(pm_row)
  {
	  
  }
  this.$updateSp=function(pm_row,pm_sp)
  {
	  
  }
  //添加商品
  this.$addSp=function(pm_input)
  {
	  var inputsp=  Array.isArray(pm_input);
	 
  }
 
  ///在付款之前的操作
  this.$beforeFk =  function()
  {
	  
  }

  //銷售完成后
  this.$saleFinish =function()
  {
	  
  }
  ///金额汇总
  this.computeNet=function()
  {
	  
  }
  //获取当前销售日期
   
   
   
   
   this.createNewSale=function(pm_xstype )
   {
	   this.MainSale   =  new sale.sale001();
	   this.bill       =  getBill();
	   this.saledate   =  getDate();
	   this.saletime   =  getTime();
	   this.xsType     =  pm_xstype;
   }
   
   
   

	
}


export default {
	XsTypeObj,
	GetSale
}