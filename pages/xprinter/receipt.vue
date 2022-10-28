<template>
	<view class="body">
		<view>
			<view style="height: 50px;line-height: 50px;">请输入单号（用于测试重新打印）</view>
			<view>
				<input style="border:1px solid gray" type="text" v-model="bill_printer" />
			</view>
		</view>
		<button class="button" hover-class="hover" @tap="againPrinter">重打</button>
		<button class="button" hover-class="hover" @tap="bluePrinter" :loading="isReceiptSend" :disabled="isReceiptSend"
			v-show="false">
			打印小票-测试
		</button>
		<button class="button" hover-class="hover" @tap="queryStatus" :loading="isQuery" :disabled="isQuery">
			查询状态
		</button>
		<button class="button" hover-class="hover" @tap="printPhoto" v-show="true">打印二维码-测试</button>
		<canvas canvas-id="couponQrcode" class="canvas"
			:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>

		<button class="button" hover-class="hover" @tap="printJPGPhoto" v-show="false">打印logo-测试</button>
		<canvas canvas-id="canvasLogoJPG" class="canvas"
			:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>

		<canvas canvas-id="canvasXPEWM" class="canvas"
			:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>

		<picker style="margin:20px;display: none;" mode="selector" :range="buffSize" :value="buffIndex"
			@change="buffBindChange">
			当前每次发送字节数为(点击可更换)：{{ buffSize[buffIndex] }}
		</picker>

		<picker style="margin:20px;display: none;" mode="selector" :range="printNum" :value="printNumIndex"
			@change="printNumBindChange">
			当前打印份数(点击可更换)：{{ printNum[printNumIndex] }}
		</picker>
	</view>
</template>

<script>
	var app = getApp();
	import esc from '@/utils/xprinter/esc.js';
	import xprinter_util from '@/utils/xprinter/util.js';
	import qrCode from '@/utils/xprinter/weapp-qrcode.js';

	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import Req from '@/utils/request.js';
	import util from '@/utils/util.js';
	import bleConnect from '@/utils/xprinter/bleConnect.js';
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				looptime: 0,
				currentTime: 1,
				lastData: 0,
				oneTimeData: 10000,
				buffSize: [],
				buffIndex: 0,
				//发送字节数下标
				printNum: [],
				printNumIndex: 0,
				printerNum: 1,
				currentPrint: 1,
				isReceiptSend: false,
				isQuery: false,
				imageSrc: "/static/xprinter/erweima.png",
				jpgSrc: "/static/xprinter/logo.jpg",
				canvasGZHWidth: 200, //小票结尾二维码宽
				canvasGZHHeight: 200, //小票结尾二维码高
				jpgWidth: 340,
				jpgHeight: 113,
				qrCodeWidth: 200, //开票二维码宽
				qrCodeHeight: 200, // 开票二维码高
				bill_printer: "", //单号
				blueStatus: false, //打印机状态
			};
		},
		components: {},
		//生命周期函数--监听页面加载
		onLoad: function(options) {
			var that = this;
			setTimeout(() => {
				that.couponQrCode()
			}, 50);
		},
		//生命周期函数--监听页面初次渲染完成
		onReady: function() {
			var list = [];
			var numList = [];
			var j = 0;
			//打印字节数组
			for (var i = 10000; i <= 200000; i += 10000) {
				list[j] = i;
				j++;
			}
			//打印份数数组
			for (var i = 1; i <= 10; i++) {
				numList[i - 1] = i;
			}
			this.setData({
				buffSize: list,
				oneTimeData: list[3],
				printNum: numList,
				printerNum: numList[0]
			});
		},
		created: function(e) {
			let that = this;
			//初始化画布
			this.initPhoto();
		},
		methods: {
			// 二维码生成工具
			couponQrCode: function() {
				let that = this;
				new qrCode('couponQrcode', {
					text: app.globalData.BLEInformation.qrCodeContent,
					width: that.qrCodeWidth,
					height: that.qrCodeHeight,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.H
				})
			},
			//广告语
			ggyAction: async function() {
				return new Promise(function(resolve, reject) {
					uni.request({
						url: app.globalData.BLEInformation.printerFile + "poem.txt",
						method: "GET",
						data: "",
						success: (res) => {
							console.log("ggyAction success: ", res.data)
							app.globalData.BLEInformation.ggy = res.data;
							return resolve(res.data);
						},
						fail: (res) => {
							console.log("ggyAction false: ", res);
							return resolve("");
						}
					})
				})
			},
			//线上订单打印小票
			xsBluePrinter: async function(order, type, print) {
				//票据
				var that = this;
				let sale1_objO = JSON.stringify(order);
				//输出日志
				console.log("线上订单打印接收数据 sale1_obj", order);
				console.log("线上订单打印控制参数 print", print);
				
				that.printerNum = 1;
				let dateNow = xprinter_util.getTime(3);
				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
				console.log("查询终端参数", printer_poscs);

				// 通过终端参数，Y 打印小票
				if (printer_poscs.YN_YXDY != "Y") {
					util.simpleMsg("终端参数未设置打印小票", "none");
					console.log("终端参数未设置打印小票");
					return;
				}
				var ggyContent = await that.ggyAction();
				//打印数据转换
				let sale1_obj = JSON.parse(sale1_objO);
				var printerInfo = xprinter_util.xsPrinterData(sale1_obj, ggyContent, type);
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init();
				//打印格式
				command.FormStringXS(printerInfo, printer_poscs, print, type);
				//写入打印记录表
				xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, dateNow, command.getData());

				let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
				let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
				let isPrinterFP = false;
				// 电子发票二维码不为空、小票结尾二维码不为空
				if (is_dzfpewmdz && isPrinterFP) {
					//生成属于单号的二维码
					Promise.all([
						xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
							that.qrCodeWidth, that.qrCodeHeight),
						//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
						//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
						xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
					]).then(res => {
						console.log("xsBluePrinter 开始发送打印命令");
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					}).catch(reason => {
						console.log('xsBluePrinter reject failed reason', reason)
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					})
				} else {
					command.setPrint();
					command.setPrint();
					command.endPrinter(); //打印切纸
					that.prepareSend(command.getData()); //发送数据
				}
				//that.prepareSend(command.getData()); //发送数据
				console.log("线上订单打印格式记录结束");
			},
			//外卖打印小票
			wmBluePrinter: async function(order, datails, type, print,bs_Reason,bs_Note,new_bill) {
				//票据
				var that = this;
				let sale1_objO = JSON.stringify(order);
				let sale2_arrO = JSON.stringify(datails);
				//输出日志
				console.log("外卖打印接收数据 sale1_obj", order);
				console.log("外卖打印接收数据 sale2_arr", datails);
				console.log("外卖打印控制参数 type", {type,bs_Reason,bs_Note,new_bill});

				if(print != null && type == "WMTHBS"){
					that.printerNum = xprinter_util.nnvl(print.PRINTNUM,1);
				}else{
					that.printerNum = 1;
				}

				let dateNow = xprinter_util.getTime(3);
				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
				console.log("查询终端参数", printer_poscs);

				// 通过终端参数，Y 打印小票
				if (printer_poscs.YN_YXDY != "Y") {
					util.simpleMsg("终端参数未设置打印小票", "none");
					console.log("终端参数未设置打印小票");
					return;
				}
				var ggyContent = await that.ggyAction();
				//打印数据转换
				let sale1_obj = JSON.parse(sale1_objO);
				let sale2_arr = JSON.parse(sale2_arrO);
				var printerInfo = xprinter_util.wmPrinterData(sale1_obj, sale2_arr, ggyContent, type,bs_Reason,bs_Note,new_bill);
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init();
				//打印格式
				command.wmFormString(printerInfo, printer_poscs, print, type);
				//写入打印记录表
				xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, dateNow, command.getData());

				let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
				let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
				// 电子发票二维码不为空、小票结尾二维码不为空
				let isPrinterFP = false;
				if (is_dzfpewmdz && isPrinterFP) {
					//生成属于单号的二维码
					Promise.all([
						xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
							that.qrCodeWidth, that.qrCodeHeight),
						//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
						//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
						xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
					]).then(res => {
						console.log("wmBluePrinter 开始发送打印命令");
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					}).catch(reason => {
						console.log('wmBluePrinter reject failed reason', reason)
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					})
				} else {
					command.setPrint();
					command.setPrint();
					command.endPrinter(); //打印切纸
					that.prepareSend(command.getData()); //发送数据
				}
				//that.prepareSend(command.getData()); //发送数据
				console.log("外卖打印格式记录结束");
			},
			//销售打印小票
			bluePrinter: async function(sale1_obj, sale2_arr, sale3_arr, print,type) {
				//票据
				var that = this;
				//输出日志
				console.log("销售打印接收数据 sale1_obj", sale1_obj);
				console.log("销售打印接收数据 sale2_arr", sale2_arr);
				//console.log("销售打印控制参数 print", print);
				console.log("销售打印接收数据 sale3_arr", sale3_arr);

				that.printerNum = 1;
				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
				console.log("查询终端参数", printer_poscs);

				// 通过终端参数，Y 打印小票
				if (printer_poscs.YN_YXDY != "Y") {
					util.simpleMsg("终端参数未设置打印小票", "none");
					console.log("终端参数未设置打印小票");
					return;
				}
				var ggyContent = await that.ggyAction();
				//打印数据转换
				var printerInfo = xprinter_util.printerData(sale1_obj, sale2_arr, sale3_arr, ggyContent,type);
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init();
				//打印格式
				command.formString(printerInfo, printer_poscs, print);
				//写入打印记录表
				xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, sale1_obj.SALETIME, command.getData());

				let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
				let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
				// 电子发票二维码不为空、小票结尾二维码不为空
				if (is_dzfpewmdz && type == "XS") {
					//生成属于单号的二维码
					Promise.all([
						xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
							that.qrCodeWidth, that.qrCodeHeight),
						//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
						//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
						xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
					]).then(res => {
						console.log("开始发送打印命令");
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					}).catch(reason => {
						console.log('bluePrinter reject failed reason', reason)
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					})
				} else {
					command.setPrint();
					command.setPrint();
					command.endPrinter(); //打印切纸
					that.prepareSend(command.getData()); //发送数据
				}
				console.log("打印格式记录结束");
			},
			//预定打印小票
			ydBluePrinter: async function(sale1_obj, sale2_arr, sale3_arr, ydsale001, print) {
				//票据
				var that = this;
				//输出日志
				console.log("预定打印接收数据 sale1_obj", sale1_obj);
				console.log("预定打印接收数据 sale2_arr", sale2_arr);
				console.log("预定打印接收数据 sale3_arr", sale3_arr);
				console.log("预定打印接收数据 ydsale001", ydsale001);
				
				if(print != null && xprinter_util.snvl(print.XSTYPE,"") == "YD"){
					that.printerNum = xprinter_util.nnvl(print.PRINTNUM,1);
				}else{
					that.printerNum = 1;
				}
				
				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
				console.log("查询终端参数", printer_poscs);
			
				// 通过终端参数，Y 打印小票
				if (printer_poscs.YN_YXDY != "Y") {
					util.simpleMsg("终端参数未设置打印小票", "none");
					console.log("终端参数未设置打印小票");
					return;
				}
				var ggyContent = await that.ggyAction();
				//打印数据转换
				var printerInfo = xprinter_util.ydPrinterData(sale1_obj, sale2_arr, sale3_arr,ydsale001, ggyContent);
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init();
				//打印格式
				command.YDFormString(printerInfo, printer_poscs, print);
				//写入打印记录表
				xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, sale1_obj.SALETIME, command.getData());
			
				let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
				let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
				
				let isPrinterFP = xprinter_util.snvl(print.XSTYPE,"") == "YDTQ" ? true : false;
				// 电子发票二维码不为空、小票结尾二维码不为空
				if (is_dzfpewmdz && isPrinterFP) {
					//生成属于单号的二维码
					Promise.all([
						xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
							that.qrCodeWidth, that.qrCodeHeight),
						//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
						//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
						xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
					]).then(res => {
						console.log("开始发送打印命令");
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					}).catch(reason => {
						console.log('ydBluePrinter reject failed reason', reason)
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					})
				} else {
					command.setPrint();
					command.setPrint();
					command.endPrinter(); //打印切纸
					that.prepareSend(command.getData()); //发送数据
				}
				console.log("打印格式记录结束");
			},
			//赊销打印小票
			sxBluePrinter: async function(sale1_obj, sale2_arr, sale3_arr,sxsale001, print,type) {
				//票据
				var that = this;
				//输出日志
				console.log("赊销打印接收数据 sale1_obj", sale1_obj);
				console.log("赊销打印接收数据 sale2_arr", sale2_arr);
				console.log("赊销打印控制参数 print", xprinter_util.nnvl(print.PRINTNUM,1));
				console.log("赊销打印接收数据 sale3_arr", sale3_arr);
			    
			    if(print != null){
					that.printerNum = xprinter_util.nnvl(print.PRINTNUM,1);
				}else{
					that.printerNum = 1;
				}
			    
				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
				console.log("查询终端参数", printer_poscs);
			
				// 通过终端参数，Y 打印小票
				if (printer_poscs.YN_YXDY != "Y") {
					util.simpleMsg("终端参数未设置打印小票", "none");
					console.log("终端参数未设置打印小票");
					return;
				}
				var ggyContent = await that.ggyAction();
				//打印数据转换
				var printerInfo = xprinter_util.sxPrinterData(sale1_obj, sale2_arr, sale3_arr, print, ggyContent,type);
				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.init();
				//打印格式
				command.SXFormString(printerInfo, printer_poscs, print);
				//写入打印记录表
				xprinter_util.addPos_XsBillPrintData(sale1_obj.BILL, sale1_obj.SALETIME, command.getData());
			
				let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
				let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
				// 电子发票二维码不为空、小票结尾二维码不为空
				if (is_dzfpewmdz && type == "XS") {
					//生成属于单号的二维码
					Promise.all([
						xprinter_util.qrCodeGenerate(is_dzfpewmdz, sale1_obj.BILL, printer_poscs.DZFPEWMDZ,
							that.qrCodeWidth, that.qrCodeHeight),
						//that.gzhQrCodeGenerate(is_xpewm,that.imageSrc),
						//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
						xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
					]).then(res => {
						console.log("开始发送打印命令");
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					}).catch(reason => {
						console.log('bluePrinter reject failed reason', reason)
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸
						that.prepareSend(command.getData()); //发送数据
					})
				} else {
					command.setPrint();
					command.setPrint();
					command.endPrinter(); //打印切纸		
					that.prepareSend(command.getData()); //发送数据
				}
				console.log("打印格式记录结束");
			},
			//重新打印
			againPrinter: async function(xsBill,xsType) {
				var that = this;
				//xsBill = that.bill_printer;
				console.log("重打单号:", xsBill)
				if (xsBill == "" || xsBill == null) {
					uni.showToast({
						icon: 'error',
						title: "重打单号为空"
					})
					return;
				}
				//通过单号，查询重打格式数据
				let pos_xsbillprint = await xprinter_util.getBillPrinterData(xsBill);
				//console.log("pos_xsbillprint",pos_xsbillprint);	
				if (pos_xsbillprint == "" || pos_xsbillprint == null) {

					util.simpleMsg("未查询到重打数据", "none");
					return;
				}

				//查询终端参数
				var poscsData = await xprinter_util.getPOSCS(app.globalData.store.POSCSZID);
				var printer_poscs = await xprinter_util.commonPOSCS(poscsData);
				console.log("查询终端参数", printer_poscs);

				// 通过终端参数，Y 打印小票
				if (printer_poscs.YN_YXDY != "Y") {
					util.simpleMsg("未查询到重打数据", "none");
					console.log("终端参数未设置打印小票");
					return;
				}

				//初始化打印机
				var command = esc.jpPrinter.createNew();
				command.addContent(pos_xsbillprint);

				let is_dzfpewmdz = (printer_poscs.DZFPEWMDZ != "" && printer_poscs.YN_DYDZFPEWM == "Y") ? true : false;
				let is_xpewm = printer_poscs.XPEWM != "" ? true : false;
				console.log("is_dzfpewmdz", is_dzfpewmdz)
				console.log("is_xpewm", is_xpewm)
				// 电子发票二维码不为空，则打印二维码
				if ((is_dzfpewmdz || is_xpewm) && xprinter_util.nnvl(xsType,0) == 1) {
					//生成属于单号的二维码
					Promise.all([
						xprinter_util.qrCodeGenerate(is_dzfpewmdz, xsBill, printer_poscs.DZFPEWMDZ, that
							.qrCodeWidth, that.qrCodeHeight),
						//that.gzhQrCodeGenerate(is_xpewm,app.globalData.BLEInformation.printerFile + printer_poscs.XPEWM),
						//xprinter_util.gzhQrCodeAction(is_xpewm,command,that.canvasGZHWidth,that.canvasGZHHeight),
						xprinter_util.qrCodeAction(is_dzfpewmdz, command, that.qrCodeWidth, that.qrCodeHeight),
					]).then(res => {
						console.log("开始发送打印命令");
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸	
						that.prepareSend(command.getData()); //发送数据
					}).catch(reason => {
						console.log('againPrinter reject failed reason', reason)
						command.setPrint();
						command.setPrint();
					    command.endPrinter(); //打印切纸		
						that.prepareSend(command.getData()); //发送数据
					})
				} else {
					//不打印二维码
					that.prepareSend(command.getData()); //发送数据
				}
			},
			gzhQrCodeGenerate: function(is_xpewm, url) {
				return new Promise((resolve, reject) => {
					if (!is_xpewm) {
						resolve(url)
						return;
					}
					const ctx_out = uni.createCanvasContext("canvasXPEWM", this);
					var png = url;
					uni.getImageInfo({
						src: png,
						success(res) {
							console.log("2.创建小票结尾二维码画布宽度" + res.width, "画布高度" + res.height);
							ctx_out.drawImage(png, 0, 0, res.width, res.height);
							ctx_out.draw();
							resolve(res)
						}
					});
					console.log("2.gzhQrCodeGenerate 111", url);
				});
			},
			//初始化画布数据
			initPhoto: function() {
				//初始化画布数据
				var that = this;
				const ctx_Qrcode = uni.createCanvasContext("couponQrcode", this);
				var png_Qrcode = that.imageSrc;
				uni.getImageInfo({
					src: png_Qrcode,
					success(res) {
						that.setData({
							qrCodeWidth: that.qrCodeWidth,
							qrCodeHeight: that.qrCodeHeight
						});
						//console.log("画布宽度" + res.width, "画布高度" + res.height);
						ctx_Qrcode.drawImage(png_Qrcode, 0, 0, res.width, res.height);
						ctx_Qrcode.draw();
					}
				});

				const ctx_out = uni.createCanvasContext("canvasXPEWM", that);
				var png = that.imageSrc;
				uni.getImageInfo({
					src: png,
					success(res) {
						that.setData({
							canvasGZHWidth: that.canvasGZHWidth,
							canvasGZHHeight: that.canvasGZHHeight
						});
						//console.log("画布宽度" + res.width, "画布高度" + res.height);
						ctx_out.drawImage(png, 0, 0, res.width, res.height);
						ctx_out.draw();
					}
				});

				//创建一个jpg格式图片
				const ctx_jpg = uni.createCanvasContext("canvasLogoJPG", that);
				var img = that.jpgSrc;
				uni.getImageInfo({
					src: img,
					success(res) {
						that.setData({
							jpgWidth: that.jpgWidth,
							jpgHeight: that.jpgHeight
						});
						//console.log("JPG画布宽度" + res.width, "JPG画布高度" + res.height);
						ctx_jpg.drawImage(img, 0, 0, res.width, res.height);
						ctx_jpg.draw();
					}
				});
			},
			initCanvasXPEWM: function() {
				//创建一个png格式
				var that = this;
				const ctx_out = uni.createCanvasContext("canvasXPEWM", that);
				var png = that.imageSrc;
				uni.getImageInfo({
					src: png,
					success(res) {
						that.setData({
							canvasGZHWidth: that.canvasGZHWidth,
							canvasGZHHeight: that.canvasGZHHeight
						});
						//console.log("画布宽度" + res.width, "画布高度" + res.height);
						ctx_out.drawImage(png, 0, 0, res.width, res.height);
						ctx_out.draw();
					}
				});
			},
			initCanvasLogoJPG: function() {
				//创建一个png格式
				var that = this;
				//创建一个jpg格式图片
				const ctx_jpg = uni.createCanvasContext("canvasLogoJPG", that);
				var img = that.jpgSrc;
				uni.getImageInfo({
					src: img,
					success(res) {
						that.setData({
							jpgWidth: that.jpgWidth,
							jpgHeight: that.jpgHeight
						});
						//console.log("JPG画布宽度" + res.width, "JPG画布高度" + res.height);
						ctx_jpg.drawImage(img, 0, 0, res.width, res.height);
						ctx_jpg.draw();
					}
				});
			},
			//打印二维码事件
			printPhoto: function() {
				//打印bitmap，图片内容不建议太大，小程序限制传输的字节数为20byte
				var that = this;
				var canvasWidth = that.qrCodeWidth;
				var canvasHeight = that.qrCodeHeight;
				var command = esc.jpPrinter.createNew();
				command.init(); //初始化打印机

				uni.canvasGetImageData({
					canvasId: "couponQrcode",
					x: 0,
					y: 0,
					width: canvasWidth,
					height: canvasHeight,
					success: function(res) {
						console.log("获取画布数据成功");
						command.setSelectJustification(1); //居中
						command.setBitmap(res);
						command.setPrint();
						command.setPrint();
						command.endPrinter(); //打印切纸				
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						util.simpleMsg("获取画布数据失败", "none");
					}
				});
			},
			//打印Logo事件
			printJPGPhoto: function() {
				var that = this;
				var canvasWidth = that.jpgWidth;
				var canvasHeight = that.jpgHeight; //抖动处理JPG图片

				const cfg = {
					x: 0,
					y: 0,
					width: canvasWidth,
					height: canvasHeight
				};
				uni.canvasGetImageData({
					canvasId: "canvasJPG",
					...cfg,
					success: res => {
						const data = xprinter_util.convertToMonoImage(res.width, res.height, res.data,
							true);
						uni.canvasPutImageData({
							canvasId: "canvasJPG",
							data,
							...cfg,
							success: res => {
								console.log(res);
								console.log("deal graphic width: " + cfg.width);
								console.log("deal graphic width: " + cfg.height);
								that.printerJPG();
							},
							fail: err => {
								console.error(err);
							}
						});
					},
					fail: err => {
						console.error(err);
					}
				});
			},
			printerJPG: function() {
				var that = this;
				var canvasWidth = that.jpgWidth;
				var canvasHeight = that.jpgHeight;
				var command = esc.jpPrinter.createNew();
				command.init(); //初始化打印机

				uni.canvasGetImageData({
					canvasId: "canvasJPG",
					x: 0,
					y: 0,
					width: canvasWidth,
					height: canvasHeight,
					success: function(res) {
						console.log("获取画布数据成功");
						command.setSelectJustification(1); //居中
						command.setBitmap(res);
						command.setPrint();
						that.prepareSend(command.getData()); //发送数据
					},
					complete: function(res) {
						console.log("finish");
					},
					fail: function(res) {
						console.log(res);
						util.simpleMsg("获取画布数据失败","none");
					}
				});
			},
			//准备发送，根据每次发送字节数来处理分包数量
			prepareSend: function(buff) {
				console.log("printer prepareSend")
				var that = this;
				var time = that.oneTimeData;
				var looptime = parseInt(buff.length / time);
				var lastData = parseInt(buff.length % time);

				that.setData({
					looptime: looptime + 1,
					lastData: lastData,
					currentTime: 1
				});
				that.Send(buff);
			},
			queryStatus: function() {
				//查询打印机状态
				var that = this;
				var buf;
				var dateView;
				blueStatus = false;
				try{
					/*
					  n = 1：传送打印机状态
					  n = 2：传送脱机状态
					  n = 3：传送错误状态
					  n = 4：传送纸传感器状态
					*/
					buf = new ArrayBuffer(3);
					dateView = new DataView(buf);
					dateView.setUint8(0, 16);
					dateView.setUint8(1, 4);
					dateView.setUint8(2, 2);
					uni.writeBLECharacteristicValue({
						deviceId: app.globalData.BLEInformation.deviceId,
						serviceId: app.globalData.BLEInformation.writeServiceId,
						characteristicId: app.globalData.BLEInformation.writeCharaterId,
						value: buf,
						success: function(res) {
							console.log("发送成功");
							that.setData({
								isQuery: true
							});
						},
						fail: function(e) {
							console.log("发送失败",e);
							return;
						},
						complete: function() {}
					});
					uni.notifyBLECharacteristicValueChange({
						deviceId: app.globalData.BLEInformation.deviceId,
						serviceId: app.globalData.BLEInformation.notifyServiceId,
						characteristicId: app.globalData.BLEInformation.notifyCharaterId,
						state: true,
						success: function(res) {
							uni.onBLECharacteristicValueChange(function(r) {
								console.log(
									`characteristic ${r.characteristicId} has changed, now is ${r}`
								);
								var result = xprinter_util.ab2hex(r.value);
								console.log("返回" + result);
								var tip = "";
					
								if (result == 12) {
									//正常
									tip = "正常";
									blueStatus = true;
								} else if (result == 32) {
									//缺纸
									tip = "缺纸";
								} else if (result == 36) {
									//开盖、缺纸
									tip = "开盖、缺纸";
								} else if (result == 16) {
									tip = "开盖";
								} else if (result == 40) {
									//其他错误
									tip = "其他错误";
								} else {
									//未处理错误
									tip = "未知错误";
								}
							});
						},
						fail: function(e) {
							console.log("打印机状态 获取失败",e);
						},
						complete: function(e) {
							console.log("打印机状态 执行完成");
						}
					});	
				}catch(e){

				}
				return 	blueStatus;
			},
			Send: function(buff) {
				//分包发送
				var that = this;
				var currentTime = that.currentTime;
				var loopTime = that.looptime;
				var lastData = that.lastData;
				var onTimeData = that.oneTimeData;
				var printNum = that.printerNum;
				var currentPrint = that.currentPrint;
				var buf;
				var dataView;

				if (currentTime < loopTime) {
					buf = new ArrayBuffer(onTimeData);
					dataView = new DataView(buf);

					for (var i = 0; i < onTimeData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
					}
				} else {
					buf = new ArrayBuffer(lastData);
					dataView = new DataView(buf);

					for (var i = 0; i < lastData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
					}
				}
				//console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
				uni.writeBLECharacteristicValue({
					deviceId: app.globalData.BLEInformation.deviceId,
					serviceId: app.globalData.BLEInformation.writeServiceId,
					characteristicId: app.globalData.BLEInformation.writeCharaterId,
					value: buf,
					success: function(res) {
						if (currentTime <= loopTime) {

						} else {
							util.simpleMsg("已打印第" + currentPrint + "张成功", "none");
						} //console.log(res)
					},
					fail: function(e) {
						var yn_print_con = app.globalData.YN_PRINT_CON;
						if(yn_print_con != "Y"){
							util.simpleMsg("打印失败，请检查打印机连接状态", "none");
						}else{
							util.simpleMsg("打印第" + currentPrint + "张失败", "none");
						}
					},
					complete: function() {
						currentTime++;

						if (currentTime <= loopTime) {
							that.setData({
								currentTime: currentTime
							});
							that.Send(buff);
						} else {
							if (currentPrint == printNum) {
								that.setData({
									looptime: 0,
									lastData: 0,
									currentTime: 1,
									isReceiptSend: false,
									currentPrint: 1
								});
							} else {
								currentPrint++;
								that.setData({
									currentPrint: currentPrint,
									currentTime: 1
								});
								that.Send(buff);
							}
						}
					}
				});
			},
			buffBindChange: function(res) {
				//更改打印字节数
				var index = res.detail.value;
				var time = this.buffSize[index];
				this.setData({
					buffIndex: index,
					oneTimeData: time
				});
			},
			printNumBindChange: function(res) {
				//更改打印份数
				var index = res.detail.value;
				var num = this.printNum[index];
				this.setData({
					printNumIndex: index,
					printerNum: num
				});
			}
		}
	};
</script>
<style>
	.button {
		margin-top: 20px;
		width: 90%;
		background-color: #54bec2;
		color: white;
		border-radius: 98rpx;
		background: bg_red;
	}

	/* 按下变颜色 */
	.hover {
		background: #dcdcdc;
	}

	.canvas {
		display: flex;
		margin-top: 15px;
		height: 100%;
		justify-content: center;
		align-items: center;
	}

	.qrcode {
		padding: 50px 0 20px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		text-align: center;
	}
</style>
