var esc = require("../../utils/xprinter/esc.js");
var encode = require("../../utils/xprinter/encoding.js");
var util = require("../../utils/xprinter/util.js");
var qrCode = require("../../utils/xprinter/weapp-qrcode.js");
import common from '@/api/common.js';
import db from '@/utils/db/db_excute.js';

const xprinter = {
	receiptPrinter: function(data) { //打印小票
		//票据测试
		var that = this;

		var xsType = "XS";
		var xsBill = "2214055034000983";
		var xsDate = util.getTime();
		var khName = "武汉万科汉阳国际店门厅";
		var khAddress = "湖北省武汉市江汉区青年路与后襄河北路交汇处海马公园";
		var posId = "8";
		var posUser = "003";
		var lineNum = "1";
		var qty = "1";
		var payableAmount = "1.00";
		var discountedAmount = "0.00";
		var originalAmount = "1.00";
		var cash = "1.00";
		var payTotal = "1.00";
		var change = "0.00";

		var goodsList = [{
				spid: "10101021",
				spname: "你好吐司",
				qty: "1",
				price: "1.00",
				amount: "1.00",
				discount: "0.00"
			},
			{
				spid: "10101023",
				spname: "德式黑杂粮切片方包",
				qty: "1",
				price: "1.00",
				amount: "1.00",
				discount: "0.00"
			}
		]

		var printerInfo = {
			xsType, //销售、退单、预订、预订提取、预订取消、赊销、赊销退单、线上订单、外卖；
			xsBill, //单号
			xsDate, //打印时间
			khName, //门店名称
			khAddress, //门店地址
			posId, //款台
			posUser, //收银员

			goodsList, //商品集合

			lineNum, //条目
			qty, //数量
			payableAmount, //应付金额
			discountedAmount, //已优惠金额
			originalAmount, //原金额
			cash, //现金
			payTotal, //支付
			change, //找零
		}

		//初始化打印机
		var command = esc.jpPrinter.createNew();
		command.init();

		//打印Logo

		command.setSelectJustification(1); //居中
		command.setCharacterSize(17); //设置倍高倍宽
		command.setText("KenGee 仟吉" + "\n");
		command.setPrint(); //打印并换行

		command.formString(printerInfo);

		command.setCharacterSize(0); //设置正常大小
		command.setSelectJustification(0); //设置居左
		command.setText("--------------------总计-----------------------");
		command.setPrint(); //打印并换行

		command.formStringTotal(printerInfo);

		command.setCharacterSize(0); //设置正常大小
		command.setSelectJustification(0); //设置居左
		command.setText("--------------------付款方式-------------------");
		command.setPrint(); //打印并换行

		command.formStringPaymentMethod(printerInfo);

		command.setCharacterSize(0); //设置正常大小
		command.setSelectJustification(0); //设置居左
		command.setText("-----------------------------------------------");
		command.setPrint(); //打印并换行

		command.setCharacterSize(0); //设置正常大小
		command.setSelectJustification(0); //设置居左
		command.setText("轻轻地走了，正如我轻轻的来");
		command.setPrint(); //打印并换行

		command.setCharacterSize(0); //设置正常大小
		command.setSelectJustification(0); //设置居左
		command.setText("-----------------------------------------------");
		command.setPrint(); //打印并换行

		//打印二维码

		//console.log("打印格式记录", command.getData());
		addData(xsBill, xsDate, command.getData());
		prepareSend(command.getData()); //准备发送数据
	},
	// 添加数据
	addData: function(xsBill, xsDate, billStr) {
		let addSql = 'insert into POS_XSBILLPRINT (XSBILL,XSDATE,BILLSTR) values ("' + xsBill + '","' + xsDate +
			'","' +
			billStr + '")';
		db.get().executeDml(addSql, "执行中", (res) => {
			console.log("sql 执行结果：", res);
		});
	},
	prepareSend: function(buff) {
		//准备发送，根据每次发送字节数来处理分包数量
		//console.log(buff)
		var that = this;
		var time = that.oneTimeData;
		var looptime = parseInt(buff.length / time);
		var lastData = parseInt(buff.length % time); //console.log(looptime + "---" + lastData)
	
		setData({
			looptime: looptime + 1,
			lastData: lastData,
			currentTime: 1
		});
		Send(buff);
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
		} //console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
	
		uni.writeBLECharacteristicValue({
			deviceId: app.globalData.BLEInformation.deviceId,
			serviceId: app.globalData.BLEInformation.writeServiceId,
			characteristicId: app.globalData.BLEInformation.writeCharaterId,
			value: buf,
			success: function(res) {
				if (currentTime <= loopTime) {
	
				} else {
					uni.showToast({
						title: "已打印第" + currentPrint + "张成功"
					});
				} //console.log(res)
			},
			fail: function(e) {
				uni.showToast({
					title: "打印第" + currentPrint + "张失败",
					icon: "none"
				}); //console.log(e)
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
						setData({
							currentPrint: currentPrint,
							currentTime: 1
						});
						Send(buff);
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

module.exports = {
	receiptPrinter: xprinter.receiptPrinter,
	addData: xprinter.addData,
};
