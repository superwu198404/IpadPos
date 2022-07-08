import sale from '@/utils/sale/saleClass.js';




var XsTypeObj=
{
	
	sale://普通销售模式，最基本的模式
	{
		typeCode:"1",
		nameSale:"销售",
		iconHui:"@/images/xiaoshou-hui.png",
		iconCurr:"@/images/xiaosho.png",
		selectClass:"curr", //重要属性当前的选择
		spExistOnSwitchType:"false",//切换到此处时是否需要清空商品
		$initSale:function(pm_type,pm_obj)
		{
		   //普通销售具有所有的权限
		   this.currentOperation=[
			                      OperEnum.hy,
								  //OperEnum.DKF,
								 // OperEnum.Disc,
								  OperEnum.SpList,
								 // OperEnum.yd,
								 // OperEnum.sth,
								 // OperEnum.ydcust
								 ]
		   this.lockRows  =0;						 
		   this.setOperationArr([OperEnum.hy,OperEnum.SpList]);
		   
		},
		///打印的方法
		$print:function(e)
		{
			  
		},
		//添加商品
		$addSp:function(pm_input)
		{
		     var inputsp=  Array.isArray(pm_input);
			 
		},
		 
		///在付款之前的操作
		$beforeFk :function()
		{
			  
		},
		//銷售完成后
		$saleFinish :function()
		{
			  
		},
		$saleCx:function()
		{
			
		},
	    $deleteSp:function(pm_row)
		{
			  
		},
		$updateSp:function(pm_row,pm_sp)
		{
			  
		}
	},
	saleYd:
	{
		typeCode:"3",
		nameSale:"预定",
		iconHui:"@/images/images/yuding-hui.png",
		iconCurr:"@/images/yuding.png",
		selectClass:"curr", //重要属性当前的选择
	},
	
	seleYdtq:
	{
		typeCode:"5",
		nameSale:"预定提取",
		iconHui:"@/images/wxz-ydtq.png",
		iconCurr:"@/images/xz-ydtq.png",
		selectClass:"curr", //重要属性当前的选择
		
	},
	seleWebWeb:
	{
		typeCode:"8",
		nameSale:"线上订单提取",
		iconHui:"@/images/xiaoshou-hui.png",
		iconCurr:"@/images/xiaosho.png",
		selectClass:"curr", //重要属性当前的选择
		
	},
	seleSx:
	{
		typeCode:"6",
		nameSale:"赊销",
		iconHui:"@/images/xiaoshou-hui.png",
		iconCurr:"@/images/xiaosho.png",
		selectClass:"curr", //重要属性当前的选择
		
	},
	seleTh:
	{
		typeCode:"2",
		nameSale:"销售退货",
		iconHui:"@/images/xstd-wxz.png",
		iconCurr:"@/images/xstd.png",
		selectClass:"curr", //重要属性当前的选择
	},
	saleYdqx:
	{
		typeCode:"4",
		nameSale:"预定取消",
		iconHui:"@/images/ydqx-wxz.png",
		iconCurr:"@/images/ydqx.png",
		selectClass:"curr", //重要属性当前的选择
	},
	saleSxth:
	{
		typeCode:"7",
		nameSale:"赊销退货",
		iconHui:"@/images/sxtd-wxz.png",
		iconCurr:"@/images/sxtd.png",
		selectClass:"curr", //重要属性当前的选择
	},
}

function  GetSale(pm_store,pm_posid,pm_ryid,pm_page)
{
  this.Storeid   =  pm_store;
  this.Posid     =  pm_posid;
  this.ryid      =  pm_ryid;
  this.saledate  =  "";
  this.saletime  =  new Date();
  this.xsType    =  ""
  this.bill_type =  "";
  this.bill      =  null;
  this.Page      = pm_page;
  this.saleDefDkh ="80000000"
  this.Msale     ={};
 // this.oldOperation = null;
  ///当前锁定的行为多少
  this.lockRows  =0;
  const  typeStr  ="sale"
  //操作的简称
  this.OperEnum=
  {
	  HY:"openInputHy",
	  DKF:"openInputDkf",
	  Disc:"openInputDisc",
	  SpList:"openSpList",
	  yd:"openydSaleList",
	  sth:"openSaleThList",
	  ydcust:"openydCustmInput"
  }
  this.currentOperation=[];
  ///所有可能会涉及到操作的页面
  this.allOperation ={
	                   "openInputHy":false,//打开录入会员
				       "openInputDkf":false,//打开录入大客户
					   "openInputDisc":false,//打开录入折扣的列表
					   "openSpList":false,//商品输入的操作页面
					   "openydSaleList" :false,//打開預定单据的列表
					   "openSaleThList":false,//打开销售退货的界面
					   "openydCustmInput":false,//预定输入客户的信息
					   "openSpItemInput":false,//单品详细是否打开
					   "openFzCx":false,
                     }
  //会员的结构
  this.hy  ={}
  ///批量设置  哪些功能显示 哪些暂时关闭
  this.setOperationArr=function(pm_input_arr)
  {
	   for( let item in   this.allOperation)
	   {
	      this.setOperation =function(item,pm_input_arr.indexOf(item))
	   }
  }
  
  this.setOperation =function(pm_Operation,pm_bool_value)
  {
	   this.allOperation[pm_Operation]  = pm_bool_value;
	   this.Page.$set(this.Page.Msale.allOperation,pm_Operation ,pm_bool_value );
  }
  
  this.checkOperation =async function(pm_Operation,e)
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
		  await  mypop.awaitShowPopup("当前模式下不支持此操作!");
	 }
  }
  
 ///修改销售类型
  this.setType =  function(pm_type)
  {
	  this.Msale      ={};
	  this.xsType     = pm_type
	  this.bill_type  = sale.saleBillType[pm_type];
	  if(XsTypeObj[typeStr+pm_type])
	  {
		  let typeObj =  XsTypeObj[typeStr+pm_type];
		  let arr     = Object.keys(typeObj)
		  for(var i=0;i<arr.length;i++   )
		  {
			  let key = arr[i];
			  this[key]  =  typeObj[key];
		  }
		  this.$initSale(pm_type);
	  }
	  else
	  {
		  mypop.awaitShowPopup("没有此种操作模式"+ pm_type);
	  }
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
  this.initcxSpRow:function(e)
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
  this.$initSale =function(pm_type,pm_obj)
  {
  	  
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
   
   
   
   this.createNewSale(pm_xstype )
   {
	   this.MainSale   =  new sale.sale001();
	   this.bill       =  getBill();
	   this.saledate   =  getDate();
	   this.saletime   =  getTime();
	   this.xsType     =  pm_xstype;
   }
   
   
   

	
}