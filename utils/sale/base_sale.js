import sale from '@/utils/sale/saleClass.js';
import util from '@/utils/util.js';
import cx from '@/utils/cx/cxCount.js';

/**
 * 销售类型列表进入销售页面之后会根据此列表配置进行初始化
 */
var XsTypeObj = 
{
	//销售+退货
	sale: { //普通销售模式，最基本的模式
		xstype: "1",
		clickType: "sale", //目前尚未用到
		nameSale: "销售",
		icon_open: require('@/images/xiaoshou.png'),
		icon_close: require("@/images/xiaoshou-hui.png"),
		operation: { //只设置为true的就好 其他的默认设置为false
			"HY": true, //是否可以录入会员
			"DKF": true, //是否可以打开录入大客户
			"Disc": true, //是否可以打开录入折扣
			"ynFzCx": true, //是否可以辅助促销
			"ynCx": true, //是否进行可以进行促销

			"sale": false, //从这里开始都是销售模式
			"sale_reserve": false,
			"sale_reserve_extract": false,
			"sale_online_order": false,
			"sale_online_order_extract": false,
			"sale_credit": false,
			"sale_return_good": false,
			"sale_reserve_cancel": false,
			"sale_credit": false,
			"sale_credit_return_good": false,
			"sale_takeaway": false,
			"sale_takeaway_reserve": false,
			"sale_message": false,
			"tools": false,
			"sale002Rows": true, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
			"lockRows": 0, //是否存在锁定行数
			"inputsp": true //是否可以输入商品
		},
		$click() 
		{
			return true;
		},
		$initSale: function(type, params) {

		},
		///对打印的控制
		$print: function() 
		{

		},
		//在此模式下添加商品是否所有限制
		$addSp: function(pm_input) {
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
	sale_return_good: 
	{
		xstype: "2",
		clickType: "sale_return_good",
		nameSale: "销售退货",
		icon_open: require("@/images/xstd.png"),
		icon_close: require("@/images/xstd-wxz.png"),
		operation: {
			"sale_return_good": true
		},
		$initSale: function(params) 
		{
			console.log("[sale_return_good]SALE001:", params.sale1);
			this.sale001 = params.sale1 ?? {};
			console.log("[sale_return_good]SALE002:", params.sale2);
			this.sale002 = params.sale2 ?? {};
			console.log("[sale_return_good]SALE003:", params.sale3);
			this.sale003 = params.sale3 ?? {};
		},
		$click()
		{
			this.SetManage("sale_return_good");
			return false;
		},
	},
	//预订单+提取+取消
	sale_reserve: {
		xstype: "3",
		clickType: "sale_reserve",
		nameSale: "预定",
		icon_open: require("@/images/yuding.png"),
		icon_close: require("@/images/yuding-hui.png"),
		operation: {
			"sale_reserve": true
		},
		$click()
		{
			
			return true;
		},
	},
	sale_reserve_extract: {
		xstype: "5",
		clickType: "sale_reserve_extract",
		nameSale: "预定提取",
		icon_open: require("@/images/xz-ydtq.png"),
		icon_close: require("@/images/wxz-ydtq.png"),
		operation: {
			"sale_reserve_extract": true
		},
		$initSale: function(params) {
			console.log("[sale_reserve_extract]SALE001:", params.sale1);
			this.sale001 = params.sale1 ?? {};
			console.log("[sale_reserve_extract]SALE002:", params.sale2);
			this.sale002 = params.sale2 ?? {};
			console.log("[sale_reserve_extract]SALE003:", params.sale3);
			this.sale003 = params.sale3 ?? {};
		}
	},
	sale_reserve_cancel: {
		xstype: "4",
		clickType: "sale_reserve_cancel",
		nameSale: "预定取消",
		icon_open: require("@/images/ydqx.png"),
		icon_close: require("@/images/ydqx-wxz.png"),
		operation: {
			"sale_reserve_cancel": true
		},
		$initSale: function(params) 
		{
			
		     this.actType  ="Refund";
			console.log("[sale_reserve_cancel]SALE001:", params.sale1);
			this.sale001 = params.sale1 ?? {};
			console.log("[sale_reserve_cancel]SALE002:", params.sale2);
			this.sale002 = params.sale2 ?? {};
			console.log("[sale_reserve_cancel]SALE003:", params.sale3);
			this.sale003 = params.sale3 ?? {};
		}
	},
	//线上订单+线上提取
	sale_online_order: {
		xstype: "8",
		clickType: "sale_online_order",
		nameSale: "线上订单",
		icon_open: require("@/images/xsdingdan.png"),
		icon_close: require("@/images/xsdingdan-wxz.png"),
		operation: {
			"sale_online_order": true
		},
	},
	sale_online_order_extract: {
		xstype: "8",
		clickType: "sale_online_order_extract",
		nameSale: "线上订单提取",
		icon_open: require("@/images/xsddtiqu.png"),
		icon_close: require("@/images/xsddtiqu-wxz.png"),
		operation: {
			"sale_online_order_extract": true
		},
	},
	//外卖单
	sale_takeaway: {
		xstype: "8",
		clickType: "sale_takeaway",
		nameSale: "外卖单",
		icon_open: require("@/images/waimaid.png"),
		icon_close: require("@/images/waimaid-hui.png"),
		operation: {
			"sale_takeaway": true
		},
	},
	//外卖单预定
	sale_takeaway_reserve: {
		xstype: "8",
		clickType: "sale_takeaway_reserve",
		nameSale: "外卖预定单",
		icon_open: require("@/images/wmyudd.png"),
		icon_close: require("@/images/wmyudd-hui.png"),
		operation: {
			"sale_takeaway_reserve": true
		},
	},
	//消息
	sale_message: {
		xstype: "6",
		clickType: "sale_message",
		nameSale: "消息",
		icon_open: require("@/images/xz-xx.png"),
		icon_close: require("@/images/xiaoxi-hui.png"),
		operation: {
			"sale_message": true
		},
	},
	//赊销+退货
	sale_credit: {
		xstype: "6",
		clickType: "sale_credit",
		nameSale: "赊销",
		icon_open: require("@/images/xstd.png"),
		icon_close: require("@/images/xstd-wxz.png"),
		operation: {
			"sale_credit": true
		},
	},
	sale_credit_return_good: {
		xstype: "7",
		clickType: "sale_credit_return_good",
		nameSale: "赊销退货",
		icon_open: require("@/images/sxtd.png"),
		icon_close: require("@/images/sxtd-wxz.png"),
		operation: {
			"sale_credit_return_good": true
		},
		$initSale: function(params) {
			console.log("[sale_credit_return_good]SALE001:", params.sale1);
			this.sale001 = params.sale1;
			console.log("[sale_credit_return_good]SALE002:", params.sale2);
			this.sale002 = params.sale2;
			console.log("[sale_credit_return_good]SALE003:", params.sale3);
			this.sale003 = params.sale3;
		}
	},
}

/**
 * 
 * @param {*} pm_store 店铺ID
 * @param {*} pm_page vue实例
 */
function GetSale(global, vue, target_name) {
	let store = global.store; //店铺配置信息
	var that = this;
	this.billindex = 0;
	/*
	 * 工具方法 
	 */
	//转换为小数，并保留2位
	this.float = function(pm_num, pm_declen) {
		return parseFloat(pm_num).toFixed(pm_declen);
	}
	//获取当前时间：年月日-yyyy-mm-dd
	this.getDate = function() {
		let d = new Date();
		var x = d.getFullYear() + "-" + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + "-" + (d
			.getDate() < 10 ? "0" : "") + d.getDate();
		return d;
	}
	//获取当前时间：时分秒-hh:mm:ss
	this.getTime = function() {
		let d = new Date();
		var x = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d
			.getMinutes() + ":" + d.getSeconds();
		return d;
	}
	//创建订单号
	this.getBill = function() {
		var newbill = "";
		if (this.bill == null) {
			let d = new Date();
			newbill = this.Storeid + this.Posid + "" + d.getFullYear() % 100 + (d.getMonth() + 1) + d.getDate() + d
				.getHours() + d.getMinutes() + d.getSeconds();
			//单号格式：门店号+pos号+yymmddHHmmss+流水号 自打开程序以后的开单号，每天清零
			newbill = newbill + "" + this.billindex;
			this.billindex++;
		} else {
			newbill = this.bill;
		}
		return newbill;
	}
	//日志
	this.log = function(str) {
		if (typeof(str) == 'string') {
			console.log(...arguments);
		} else {
			console.log(...arguments);
		}
	}
	//由于未知弹窗所以暂时用这个	 
	this.myAlert = function(pm_str1, pm_str2) {
		that.log("--------------看到这个说明弹窗功能还没有做！--------------")
	}
	//基础配置参数本地化
	this.Storeid = store.KHID;
	this.storeName = store.NAME;
	this.Posid = store.POSID;
	this.ryid = store.RYID;
	this.KCDID = store.KCDID;
	this.DPID = store.DPID;
	this.GCID = store.GCID;
	//销售系列主要数据对象
	this.sale001 = {}; //sale001 主单
	this.sale002 = []; //sale002 子单1：记录商品信息
	this.sale003 = []; //sale003 子单2：记录支付信息
	this.sale008 = []; //sale008
	//销售时间（默认当前）
	this.saledate = this.getDate();
	//销售页面
	this.Page = vue; //销售页面实例
	this.pageName = target_name; //页面名称(这个控制器所控制的页面名称)
	//销售页面销售类型
	this.xsType = "sale"
	this.bill_type = null; //sale.saleBillType[this.xsType];
	this.bill = null;
	this.clickSaleType = {}; //当前点击的销售模式
	this.current_type = {}; //当前的销售模式
	this.payPassWord = false; //当前模式支付是否要输入登录密码
	this.selectFlag = "A";
	//不支持的付款方式
	this.notFayType = [];
	//商品售价的信息列表
	this.spPrice = {};
	//字母的列表
	this.flagList = [];
	//根据字母筛选出来的商品列表
	this.selectFlagList = [];
	//点击的单个商品
	this.clikSpItem = {};
	//商品档案002 以商品id为键值的结构
	this.spSelectArr = {};
	//更新（根据代码应该是强制刷新页面）
	this.actType  ="Payment";

	this.update = function() {
		if (that.Page) {
			that.Page.$forceUpdate()
		} else {
			that.log("页面变量丢失！！！！！！！")
		}
	}
	//初始化所有可以点击的商品，会员的结构
	this.HY = {
		cval: {},
		base: {},
		get val() {
			return this.cval;
		},
		set val(newval) {
			this.base.ComponentsManage["HY"] = false;
			this.cval = newval;
			that.update();
		}
	}
	this.HY.base = this;
	//大客户
	this.DKF = {
		base: {},
		cval: {},
		Defval: "80000000",
		get val() 
		{
			/*
			  这里要根据大客户ID是否为空 如果为空 返回一个默认的大客户
			*/
			return this.cval;
		},
		set val(newval) {
			this.base.ComponentsManage["DKF"] = false;
			if (newval == null || newval == this.Defval) {
				this.cval = this.Defval;
				return;
			}
			this.cval = newval;
		}
	}
	this.DKF.base = this;
	//折扣、当前选择的折扣方式
	this.Disc = {
		base: {},
		cval: {},
		Defval: 100,
		get val() {
			return this.cval;
		},
		set val(newval) {
			//赋值的时候进行计算
			this.cval = newval;
			this.base.ComponentsManage["Disc"] = false;
			if (this.cval >= 100) {
				this.base.allOperation["Disc"] = false;
				this.base.allOperation["ynFzCx"] = true;
				this.base.allOperation["ynCx"] = true;
			} else {
				this.base.allOperation["Disc"] = true;
				this.base.allOperation["ynFzCx"] = false;
				this.base.allOperation["ynCx"] = false;
			}
		}
	};
	this.Disc.base = this;
	///所有商品的列表,具体参考 utils.sale.xs_sp_init.js
	this.Allsplist = null;

	//this.oldOperation = null;
	//当前锁定的行为多少

	//初始化字母的列表
	this.filterSp = function(pm_flag) {
		this.selectFlag = pm_flag;
		this.selectFlagList = this.Allsplist.filter(item => {
			return item.FSTR == pm_flag
		});
		that.log("[FilterSp]筛选出来的长度", this.selectFlagList.length)
		this.Page.$set(this.Page[this.pageName], "selectFlagList", this.selectFlagList);
		this.Page.$set(this.Page[this.pageName], "selectFlag", this.selectFlag);
		this.Page.$set(this.Page, "Alphabetical", false);
		//筛选字母的列表
	}
	//设置所有商品列表数据
	this.SetAllGoods = function(pm_list, pm_price) 
	{
		cx.Cxdict();
		this.spPrice = pm_price;
		this.Page.$set(this.Page[this.pageName], "spPrice", this.spPrice);
		this.Allsplist = pm_list;
		this.filterSp("A");
		that.log("[SetAllGoods]绑定完成！", this.Page[this.pageName].selectFlagList[0]);
		this.Allsplist.forEach(item => {
			if (that.flagList.indexOf(item.FSTR) < 0) {
				that.flagList.push(item.FSTR)
			}
		})
		that.log("[SetAllGoods]初始化字母列表" + JSON.stringify(this.flagList));
		this.Page.$set(this.Page[this.pageName], "flagList", this.flagList);
		console.log("[SetAllGoods]绑定字母表！");
	}
	//点击后获取数据（字母）
	this.FlagClick = function(e) 
	{
		var flagX = e.currentTarget.dataset.flag;
		that.log("点击的字母！" + flagX);
		that.filterSp.call(that, flagX);
	}
	///当前模式下可以操作的功能，初始化以后会写到此列表中，在此列表中此可以进行点击操作，不在是不可以点击或者操作、计算等！
	this.currentOperation = {
		"statement": false
	};
	///销售界面可以进行操作功能 ，
	this.allOperation = 
	{
		"HY": false, //是否可以录入会员
		"DKF": false, //是否可以打开录入大客户
		"Disc": false, //是否可以打开录入折扣
		"ynFzCx": false, //是否可以辅助促销
		"ynCx": false, //是否进行可以进行促销    
		"sale": false, //从这里开始都是销售模式
		"sale_reserve": false,
		"sale_reserve_extract": false,
		"sale_online_order": false,
		"sale_online_order_extract": false,
		"sale_credit": false,
		"sale_return_good": false,
		"sale_reserve_cancel": false,
		"sale_credit": false,
		"sale_credit_return_good": false,
		"sale_takeaway": false,
		"sale_takeaway_reserve": false,
		"sale_message": false,
		"tools": false,
		"openydCustmInput": false, //预定输入客户的信息
		"sale002Rows": false, // 当前模式下有商品输入的时候是否可以切换销售模式,只有两个都是true才可以进行切换
		"lockRows": 0, //是否存在锁定的行数
		"inputsp": false,
		"statement": true, //购物车
	}
	//插件的显示在这里控制
	this.ComponentsManage =
	{
		"HY": false, //会员插件是否打开
		"DKF": false, //大客户插件是否打开
		"Disc": false, //折扣插件是否打开
		"member_login": false,
		"sale": true, //从这里开始都是销售模式
		"sale_reserve": false,
		"sale_reserve_extract": false,
		"sale_online_order": false,
		"sale_online_order_extract": false,
		"sale_credit": false,
		"sale_return_good": false,
		"sale_reserve_cancel": false,
		"sale_credit": false,
		"sale_credit_return_good": false,
		"sale_takeaway": false,
		"sale_takeaway_reserve": false,
		"sale_message": false,
		"tools": false,
		"openydCustmInput": false, //预定输入客户的信息
		"inputsp": false,
		"statement": false, //购物车
	}
	var lastManage = null;

	///设置基础的权限
	this.SetCurrentOperation = function(pm_OperEnum) {
		console.log("[SetCurrentOperation]传入权限:", pm_OperEnum);
		//所有模式都具有的默认权限 在这里直接初始化好 ，
		this.currentOperation = {
			"statement": false
		};
		for (var item in this.allOperation) {
			//that.log("开始设置权限"+item);
			if (pm_OperEnum[item]) {
				//普通销售具有所有的权限
				this.currentOperation[item] = pm_OperEnum[item]
			} else {
				this.currentOperation[item] = false;
			}
			//切换的时候关闭所有插件
			for (item in this.ComponentsManage) 
			{
				that.ComponentsManage[item] = false;
			}
			this.update();
		}
		console.log("[SetCurrentOperation]权限设置完毕!");
	}

	//设定具体的插件件让其进行显示,并关闭其他插件
	this.SetManage = function(pm_mtype) {
		console.log("[SetManage]LastManage:", lastManage);
		//if (pm_mtype === lastManage) return;
		if (lastManage != null && pm_mtype != lastManage) {
			console.log("[SetManage]关闭上一个组件!");
			that.ComponentsManage[lastManage] = false;
		}
		that.log("[SetManage]点击的类型:", pm_mtype);
		//that.ComponentsManage[pm_mtype] = true;
		 that.ComponentsManage[pm_mtype] = !that.ComponentsManage[pm_mtype];
		 lastManage = pm_mtype;
		// that.Page.$set(that.Page[that.pageName], "ComponentsManage", that.ComponentsManage);
		
		that.log("[SetManage]组件控制对象:", that.ComponentsManage);
		that.log("[SetManage]绑定完成:", that.ComponentsManage[pm_mtype]);
		that.update();
	}

	//设置所有插件的切换非销售模式的切换  会员  折扣 大客户等事件
	this.setComponentsManage = function(e) {
		let mtype = e.currentTarget.dataset.mtype;
		that.log("mtype=" + mtype + "#" + JSON.stringify(that.currentOperation))
		if (that.currentOperation.hasOwnProperty(mtype)) {
			that.SetManage(mtype);
		} else {
			that.myAlert("当前模式下进行此操作")
		}
	}

	//调用各个销售类型的方法名称,参数列表
	this.CurrentTypeCall = function(pm_fun) 
	{
		console.log("[CurrentTypeCall]当前销售类型:", this.current_type);
		console.log("[CurrentTypeCall]当前销售类型调用:", pm_fun);
		let defstr = "def"
		let arr = Array.from(arguments).slice(1);
		if (that.current_type[pm_fun]) {
			return that.current_type[pm_fun].apply(that, arr);
		} 
		else 
		{
			//方便定义公用的处理方法，如果销售类型里没有这个方法则调用这个
			if (that[defstr + pm_fun]) {
				return that[defstr + pm_fun].apply(that, arr);
			}
		}
	}
	 //选择的商品进行品类的切换
	 this.selectPlidChenged =function(e)
	  {
		   var plid  =  e.currentTarget.dataset.plid;
		   that.selectPlid = plid;
		   that.scrollinto = that.selectFlag + plid;
		   that.log("切换到的品类"+that.scrollinto)
		   that.Page.$set(that.Page[that.pageName],"selectPlid" , that.selectPlid );
		   that.Page.$set(that.Page[that.pageName],"scrollinto" , that.scrollinto );
	  }
	
	//展示商品的详情的事件
	this.showSpDetails = function(e) {
		//that.log("开始点击"+ JSON.stringify(that.currentOperation));
		if (!that.currentOperation.inputsp) 
		{
			that.myAlert("当前模式下不可录入商品")
			return;
		}
		let plindex = e.currentTarget.dataset.plindex;
		that.log("开始点击plindex" + plindex);
		let spindex = e.currentTarget.dataset.spindex;
		that.log("开始点击spindex" + plindex);
		that.log("当前显示的商品集合" + JSON.stringify(that.selectFlagList[plindex]));
		let plitem = that.selectFlagList[plindex];
		let spitem = plitem.plarr[spindex];

		that.clikSpItem = spitem;
		that.clikSpItem.inputQty = 0;
		if (that.clikSpItem.ynshowlist) //如果是蛋糕默认选择一个商品id
		{
			that.clikSpItem.selectSPID = that.clikSpItem.specslist[0].SPID;
		} else {
			that.clikSpItem.selectSPID = that.clikSpItem.SPID;
		}

		that.log("设置显示对象" + JSON.stringify(that.clikSpItem));
		that.Page.$set(that.Page[that.pageName], "clikSpItem", that.clikSpItem);
		that.SetManage("inputsp")
	}

	//商品详情页的加号和 减号
	this.chengedQty = function(e) {
		let qty = e.currentTarget.dataset.qty;
		that.log("开始点击that.clikSpItem.inputQty" + that.clikSpItem.inputQty);
		qty = parseFloat(qty)
		let oldqty = parseFloat(that.clikSpItem.inputQty)
		qty = qty + oldqty;
		that.clikSpItem.inputQty = qty;
		//that.Page.$set(that.Page[that.pageName].clikSpItem,"inputQty",qty);
		that.update()
		that.log("-----绑定完成++++" + qty);
	}

	//修改销售类型
	//参数1销售类型，参数2单据列表
	this.SetType = function(pm_type) 
	{
		console.log("[SetType]设置销售类型:", pm_type);
		if (XsTypeObj[pm_type]) {
			this.clickSaleType = XsTypeObj[pm_type];
			this.Page.$set(that.Page[that.pageName], "clickSaleType", that.clickSaleType);
			that.log("销售类型" + pm_type);
			if (this.sale002.length > 0 && (this.currentOperation.sale002Rows == this.clickSaleType.operation
					.sale002Rows)) {
				this.myAlert("已经输入了商品不能进行此操作")
				return;
			}
			that.log(JSON.stringify(this.current_type));
			if (this.clickSaleType.$click.call(this)) 
			{
				this.$initSale(this.clickSaleType);
			}
		} else {
			this.myAlert("没有此种操作模式" + pm_type);
		}
	}

	/**
	 * 支付结果
	 * @param {*} e 
	 */
	this.PayedResult = function(e) {
		that.log("----------支付完成查看返回结果---------");
		that.log(e);
	}


    this.pay  =function()
	{
		that.log("开始进入销售页面")
		
		that.log("------------------------------")
		let inputParm ={
			sale1_obj: that.sale001, //001 主单 数据对象
			sale2_arr: that.sale002, //002 商品 数据对象集合
			sale3_arr: that.sale003, //003 支付数据集合
			sale8_arr: that.sale008, //008水吧商品
			actType:  that.actType
		}
		that.$beforeFk(inputParm);
		that.log(JSON.stringify( inputParm));
		that.Page.$store.commit('set-location',inputParm );
		uni.navigateTo({
			url: "../Payment/Payment",
			events: {
				FinishOrder: that.payRef
			}
		})
	}
	

	/**
	 * 修改销售类型(SetType 修改版本)
	 * @param {*} type 销售类型
	 * @param {*} direct 是否选择直接初始化
	 */
	this.SetSaleType = function(type, init_params = null, direct = false) 
	{
		console.log("[SetSaleType]设置销售类型:", type);
		if(type== that.clickSaleType.xstype )
		{
			return 
		}
		if (XsTypeObj[type]) {
			this.clickSaleType = XsTypeObj[type];
			this.Page.$set(that.Page[that.pageName], "clickSaleType", that.clickSaleType);
			console.log("[SetSaleType]销售类型:", type);
			if (this.sale002.length > 0 && (this.currentOperation.sale002Rows == this.clickSaleType.operation
					.sale002Rows)) {
				this.myAlert("[SetSaleType]已经输入了商品不能进行此操作!")
				return;
			}
			console.log("[SetSaleType]设置销售类型信息:", this.current_type);
			if (direct) 
			{
				console.log("[MainSale]开始初始化...", {
					params: init_params,
					type_info: this.clickSaleType,
					type
				});
				this.$initSale(this.clickSaleType, init_params);
				console.log("[MainSale]初始化完毕!");
			} else {
				console.log("[SetSaleType]页面切换:", this.current_type.operation);
				this.SetCurrentOperation(this.current_type.operation);
			}
		} else {
			this.myAlert("[SetSaleType]没有此种操作模式:" + type);
		}
	}

	//点击了菜单后获取到对应的 TYPE 然后根据 TYPE 切换销售页为对应模式
	this.SaleTypeClick = function(type) {
		console.log("[SaleTypeClick]销售页面切换类型:", type);
		that.SetType.call(that, type);
	}

	//初始化销售的操作
	this.$initSale = function(pm_newtype, pm_saleobj)
	{
		//在这里需要关闭 打开的插件
		console.log("[$initSale]销售初始化开始!",
		{
			type: pm_newtype || this.clickSaleType
		});
		pm_newtype = pm_newtype || this.clickSaleType;
		this.current_type = pm_newtype;
		this.CurrentTypeCall("$initSale", pm_saleobj);
		this.bill_type = sale.saleBillType[this.current_type.xstype];
		console.log("[$InitSale]bill_type:", this.bill_type);
		this.xsType = this.current_type.xstype;
		//设置权限生效
		this.SetCurrentOperation(this.current_type.operation);
		this.Page.$set(this.Page[this.pageName], "currentType", this.current_type);
		console.log("[$initSale]销售初始化完毕!");
	}

	this.cxBillinit = function() 
	{

	}

	//统计生成促销发生
	this.mdcxfs = function() {

	}

	this.initcxSpRow = function() 
	{

	}

	this.cxBillinit = function() 
	{

	}

	this.createNewBill = function() {
		var commonSaleParm = {}
		if (Object.keys(this.sale001).length == 0) { //BILL,KCDID  ,DPID,SALETIME,GCID
		    this.log("**************创建新的sale001*************")
			let newbill = this.getBill();
			let stime = this.getTime();
			commonSaleParm = {
				KHID: this.Storeid,
				SALEDATE: this.SALEDATE,
				POSID: this.POSID,
				RYID: this.ryid,
				BILL: newbill,
				KCDID: this.KCDID,
				GCID: this.GCID,
				SALETIME: stime
			};
			this.sale001 = new sale.sale001(commonSaleParm)
			console.log( JSON.stringify( this.sale001))

		} else {
			commonSaleParm = {
				KHID: this.sale001.Storeid,
				SALEDATE: this.sale001.SALEDATE,
				POSID: this.sale001.POSID,
				RYID: this.sale001.ryid,
				BILL: this.sale001.bill,
				KCDID: this.sale001.KCDID,
				GCID: this.sale001.GCID,
				SALETIME: this.sale001.SALETIME
			}
		}
		that.log(JSON.stringify(commonSaleParm));
		return commonSaleParm;
	}

	//汇总sale002的所有内容
	this.sale002Sum = function(pm_input) {
		this.sale002.forEach(item => {
	    	that.log("循环中查看002");
			that.log(JSON.stringify(item));
			let keys = Object.keys(pm_input);
			for (var i = 0; i < keys.length; i++) 
			{
				that.log(JSON.stringify(keys[i]));
				pm_input[keys[i]] += that.float(item[keys[i]], 2);
				that.log(JSON.stringify(pm_input));
			}
		})

		return pm_input;
	}
	//点击商品的详情触发的事件
	this.getSp = function(e) {
		console.log("[GetSp]获取商品详情:");
		let pm_spid = that.clikSpItem.selectSPID;
		let pm_yndgxp = e.currentTarget.dataset.yndgxp; //是否是改胚蛋糕
		let pm_qty = that.clikSpItem.inputQty;
		let find = false;
		let inqty = parseFloat(pm_qty);
		that.log(pm_spid + "#" + pm_qty + "pm_yndgxp")
		///检查是否已经添加过  如果已经添加过 直接修改某一行
		for (var row = 0; row < that.sale002.length; row++) {
			if (that.sale002[row].SPID == pm_spid) {
				find = that.updateSp(row, pm_spid, inqty)
				break;
			}
		}
		if (!find) {
			//STR1 商品名称 STR2 门店名称  YN_XPDG  ,YNZS, SPJGZ
			let newprm = that.createNewBill.call(that);
			let new002 = new sale.sale002(newprm);
			console.log(new002);
			new002.SPID = pm_spid;
			new002.NO = that.sale002.length;
			new002.STR1 = that.clikSpItem.SNAME;
			new002.UNIT = that.clikSpItem.UNIT;
			new002.STR2 = that.storeName;
			new002.YN_XPDG = pm_yndgxp;
			new002.SPJGZ = that.clikSpItem.SPJGZ;
			let price = that.spPrice[pm_spid].PRICE;
			pm_qty = that.float(pm_qty, 3);
			price = that.float(price, 2);
			new002.PRICE = price;
			new002.QTY = pm_qty;
			new002.NET = that.float(pm_qty * price, 2);
			new002.DISCRATE = 0;
			new002.BARCODE = that.clikSpItem.SPID;
			that.sale002.push(new002);
			that.log("[GetSp]添加了商品", new002);
			//that.log("[GetSp]商品价格", that.spPrice);
		}
		that.SetManage("inputsp");
	}

	//大于0的时候修改,小于等于0删除
	this.updateSp = function(pm_row, pm_spid, pm_qty) {
		console.log("[UpdateSp]更新商品...");
		if (pm_qty > 0)
		{
			this.sale002[pm_row].QTY = pm_qty;
			let price = this.float(this.sale002[pm_row].PRICE);
			this.sale002[pm_row].NET = this.float(pm_qty * price, 2);
			that.log("更新商品" + JSON.stringify(this.sale002[pm_row]))
		}
		if (pm_qty <= 0) {
			this.sale002.splice(pm_row, 1);
		}
		return true;
	}

	/**
	 * 显示购物车
	 * @param {*} e 
	 */
	this.ShowStatement = async function(e) 
	{
		console.log("[ShowStatement]商品信息:", that.sale002);
	    //await cx.Createcx(that.sale002);
		that.SaleNetAndDisc();
		that.SetManage("statement")
	}

	//计算sale002
	this.SaleNetAndDisc = function() 
	{
		let znet = 0
		if (that.currentOperation.ynCx) {
			that.computeCx();
		}
		if (that.currentOperation.Disc) {
			that.discCompute();
		}
		that.sale001.TLINE = that.sale002.length;
		var retx = that.sale002Sum({
			NET: 0,
			DISCRATE: 0
		});
		that.log("***************计算结果展示******************")
		that.log(retx)
		that.log("***************计算结果展示******************")
		that.sale001.ZNET = this.float(retx.NET, 2);
		that.sale001.TNET = this.float(retx.NET, 2);
		that.sale001.DISC = this.float(retx.DISCRATE, 2);
		//this.update();
	}

	//实际计算促销需要在这个方法里进行
	this.computeCx = function() {

	}

	//计算促销的折扣
	this.discCompute = function() {

	}

	//付款之前触发
	this.$beforeFk = function(pm_inputParm) 
	{
		//在付款前写这个防止左右更改！
		this.sale001.XSTYPE = this.xstype //付款的时候写
		this.sale001.BILL_TYPE = this.bill_type //
		//写大客户
		//写会员
		this.CurrentTypeCall("$beforeFk",pm_inputParm);
		//可以使用的支付方式 
	}

	//重置销售单据
	this.resetSaleBill = function() 
	{
		this.HY.cval = null;
		this.DKF.cval = null;
		this.Disc.cval = null;
		this.bill = null;
		this.sale001 = {};
		this.sale002 = [];
		this.sale003 = [];
		this.clikSpItem = {};
		this.SetDefaultType();
		that.update()
	}

	//打印的方法
	this.$print = function(e) {

	}

	//
	this.SetDefaultType = function(type = "sale") {
		this.SetType(type);
	}

	//计算积分
	this.getJfcompute = function() {

	}

	//输入会员的方法
	this.InputHy = function() {

	}

	//输入大客户的方法
	this.InputDkf = function() {

	}
}
export default {
	XsTypeObj,
	GetSale
}
