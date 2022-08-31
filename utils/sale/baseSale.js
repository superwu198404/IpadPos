import sale from '@/utils/sale/saleClass.js';

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
	saleYd: {
		xstype: "3",
		clickType: "saleYd",
		nameSale: "预定",
		iconHui: require("@/images/yuding-hui.png"),
		iconCurr: require("@/images/yuding.png"),
	},

	seleYdtq: {
		xstype: "5",
		clickType: "seleYdtq",
		nameSale: "预定提取",
		iconHui: require("@/images/wxz-ydtq.png"),
		iconCurr: require("@/images/xz-ydtq.png"),
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

function   GetSale(pm_store,pm_posid,pm_ryid,pm_page,mPageName)
{
	 var that =this;
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
  //由于未知弹窗所以暂时用这个	 
  this.myAlert = function(pm_str1,pm_str2)
  {
	  
	  
  }
  this.Storeid     =  pm_store;
  this.Posid       =  pm_posid;
  this.ryid        =  pm_ryid;
  this.saledate    =  getDate();
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
  ///当前锁定的行为多少
 
  
 
 
 //初始化字母的列表
  this.filterSp=function(pm_flag)
  {
  	  this.selectFlag =pm_flag;
  	  this.selectFlagList=this.Allsplist.filter(item=>{ return item.FSTR==pm_flag});
	  console.log("筛选出来的长度"+ this.selectFlagList.length)
	  this.Page.$set(this.Page[this.pageName],"selectFlagList" , this.selectFlagList );
	  this.Page.$set(this.Page[this.pageName],"selectFlag" , this.selectFlag );
	  this.Page.$set(this.Page,"Alphabetical" , false );
	   
	  //筛选字母的列表
	  
  }
  
  this.setAllSpList=function(pm_list,pm_price)
  {
	  this.spPrice    =pm_price;
	  this.Page.$set(this.Page[this.pageName],"spPrice" , this.spPrice );
	  this.Allsplist  = pm_list;
  	  this.filterSp("A");
  	  console.log( "绑定完成！"+JSON.stringify( this.Page[this.pageName].selectFlagList[0]));
	  
	  
		 this.Allsplist.forEach(item=>{
			  
			  if( that.flagList.indexOf(item.FSTR )<0)
			  {
			     that.flagList.push( item.FSTR) 
			  }
			  
		  })
	  console.log("初始化字母列表"+JSON.stringify(this.flagList));
	  this.Page.$set(this.Page[this.pageName],"flagList" , this.flagList );
	  console.log( "绑定字母表！");
	  
  }
  
  this.FlagClick=function(e)
  {
  	  var flagX  =  e.currentTarget.dataset.flag; 
	  console.log( "点击的字母！"+flagX);
  	  that.filterSp.call(that,flagX);
  }
  
  ///当前模式下可以操作的功能，初始化以后会写到此列表中，在此列表中此可以进行点击操作，不在是不可以点击或者操作、计算等！
  this.currentOperation = {};
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
	"inputsp":false
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
	"inputsp":false
  }
  var lastManage=null;
  ///设置基础的权限
  this.setCurrentOperation=function(pm_OperEnum)
  {
	 // console.log("传入权限"+ JSON.stringify( pm_OperEnum));
	  this.currentOperation = {}
	  for (var item in this.allOperation) 
	  {
	      //console.log("开始设置权限"+item);
		  if(pm_OperEnum[item])
		  {
	  	  //普通销售具有所有的权限
	         this.currentOperation[item] = pm_OperEnum[item]
		  }
		  else
		  {
			 this.currentOperation[item] = false;
		  }
	  }
  } 
  
  //设定具体的插件件让其进行显示,并关闭其他插件
  this.setManage=function(pm_mtype)
  {
	  if(lastManage!=null&&pm_mtype != lastManage)
	  {
		  that.ComponentsManage[lastManage] =false;
	  }
	  that.ComponentsManage[pm_mtype]  = !that.ComponentsManage[pm_mtype];
	  lastManage  = pm_mtype;
	  that.Page.$set(that.Page[that.pageName],"ComponentsManage" , that.ComponentsManage);
  }
  
  //设置所有插件的切换非销售模式的切换  会员  折扣 大客户等事件
  this.setComponentsManage = function(e)
  {
	  console.log("点击了关闭按钮")
  	  let mtype = e.currentTarget.dataset.mtype;
	  console.log("mtype="+mtype+"#" + JSON.stringify(that.currentOperation))
	  if(that.currentOperation[mtype])
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
	  //console.log("开始点击"+ JSON.stringify(that.currentOperation));
	  if(!that.currentOperation.inputsp)
	  {
		  that.myAlert("当前模式下不可录入商品")
		  return;
	  }
	  
	  let plindex  =  e.currentTarget.dataset.plindex; 
	   console.log("开始点击plindex"+plindex);
	  let spindex  =  e.currentTarget.dataset.spindex;
	   console.log("开始点击spindex"+plindex);
	   console.log("当前显示的商品集合"+JSON.stringify( that.selectFlagList[plindex]));
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
	   console.log("开始点击spindex"+JSON.stringify( spitem));
       console.log("设置显示对象"+JSON.stringify( that.clikSpItem));
	  that.Page.$set(that.Page[that.pageName],"clikSpItem" , that.clikSpItem);
	  that.setManage("inputsp") 
  }
  
  this.chengedQty=function(e)
  {
	  let qty  =  e.currentTarget.dataset.qty; 
	  
  }
 ///修改销售类型
 ///参数1销售类型，参数2单据列表
  this.setType =  function(pm_type)
  {
	  console.log(pm_type);
	  if( XsTypeObj[pm_type] )
	  {
		  this.clickSaleType = XsTypeObj[pm_type];
		  this.Page.$set(that.Page[that.pageName],"clickSaleType" , that.clickSaleType);
		  console.log("销售类型"+ pm_type );
		  if( this.sale002.length>0 &&  (this.currentOperation.sale002Rows == this.clickSaleType.Operation.sale002Rows))
		  {
			   this.myAlert("已经输入了商品不能进行此操作")
			   return ;
		  }
		  console.log(JSON.stringify(this.currentType));
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
 	  console.log("click"+stype)
 	  that.setType.call(that,stype);
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
  this.$initSale =function(pm_newtype,pm_saleobj)
  {
	  this.currentType = pm_newtype;
	  this.currentTypeCall("$initSale",pm_saleobj)
  	  //this.currentType.$initSale.call(this,pm_saleobj);
  	  this.bill_type  = sale.saleBillType[this.currentType.xstype];
  	  console.log(JSON.stringify(this.bill_type));	 
  	  this.xsType  =  this.currentType.xstype;
	  //设置权限生效
	  console.log("开始设置权限"+ JSON.stringify( this.currentType.Operation));	
	  this.setCurrentOperation(this.currentType.Operation);
  	  this.Page.$set(this.Page[this.pageName],"currentType" ,this.currentType );
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
	
	

	this.setDeftype = function() 
	{
		this.setType("sale");
	}

	this.addS002 = function(pm_id, pm_qty, pm_setlist) 
	{


		//新增002
		//水吧新增008
	}
	this.updateS002 = function(pm_id, pm_qty)
	{
		//更新002 
		//更新008
	}
	this.deleteS002 = function(pm_id) {
		//删除008
		//删除002
	}
	//创建新的销售单重置销售模式 
	this.ydSaleList = function(pm_obj, e) {

	}
	//统计生成促销发生
	this.mdcxfs = function() 
	{

	}
	//计算积分
	this.getJfcompute = function() {

	}

	//输入会员的方法
	this.InputHy = function(e) {

	}
	this.InputDkf = function(e) {


	}
	//计算促销单
	this.saleCx = function(e) {


	}
	this.initcxSpRow = function(e) {

	}
	this.cxBillinit = function() {

	}
	//实际计算促销需要在这个方法里进行
	this.computeCx = function() {

	}
	//获取商品信息的语法糖
	this.$getSp = function(pm_id, pm_qty) {

	}
	//计算促销的方法糖
	this.$saleCx = function() {

	}






	this.createNewSale = function(pm_xstype) 
	{
		this.MainSale = new sale.sale001();
		this.bill = getBill();
		this.saledate = getDate();
		this.saletime = getTime();
		this.xsType = pm_xstype;
	}





}
export default {
	XsTypeObj,
	GetSale
}
