
//sale001 a:支付订单号
const  sale1=(a)=>{
	let store = getApp().globalData.store;
	let s1sql =
		"insert SALE001 (BILL,SALEDATE,SALETIME,KHID,POSID,RYID,BILL_TYPE,XSTYPE,XS_BILL,XS_POSID,XS_DATE,XS_KHID,XS_GSID,TLINE,TNET,DNET,ZNET,BILLDISC,ROUND," +
		"CHANGENET,CXTNET,TCXDISC,CUID,CARDID,THYDISC,YN_SC,GSID,GCID,DPID,KCDID,BMID,DKFID,XSPTID,YN_OK,THTYPE,CLTIME)" +
		"values('" + a.out_trade_no + "',date(),time(),'" +
		store.KHID + "','" + store.POSID + "','" + store.RYID +
		"','Z101','1','','','','',''," + a.TLINE + "," + a
		.PayAmount + "," + a.Discount + ",0,0,0,0,'',''," + a
		.Discount +
		",'N','" + store.GSID + "','" + store.GCID + "','" + store
		.DPID + "','" + store.KCDID + "','" + store.BMID + "','" +
		store.DKFID +
		"','POS','X',0,date())";
		return s1sql;
}
//sale002  a:支付订单号 p商品明细列表
const  sale2=(a,p)=>{
	let store = getApp().globalData.store;
	let s2sql=";"
	for(var i = 0; i < p.length; i++){
		let product=p;
		let week=dateformat.getYearWeek(new Date().getFullYear(), new Date().getMonth() + 1,new Date().getDay());
	    s2sql+="insert into SALE002 (BILL,SALEDATE,SALETIME,KHID,POSID,SPID,NO,PLID,BARCODE,UNIT,QTY,PRICE,OPRICE,NET,DISCRATE,YN_SKYDISC,"+
		"DISC,YN_CXDISC,CXDISC,YEAR,MONTH,WEEK,TIME,RYID,GCID,DPID,KCDID,BMID)"+
		"values('"+a+"',date(),time(),'"+store.KHID+"', '"+store.POSID+"', '"+store.SPID+"',"+i+",'"+product.PLID+
		"','"+product.BARCODE+"',"+product.UNIT+","+product.QTY+","+product.PRICE+","+product.OPRICE+","+product.PRICE+",'0','N',0,'N',0,"+
		"strftime('%Y',date()),strftime('%m',date()),"+week+",time(),'"+store.RYID+"','"+store.GCID+"','"+store.DPID+"','"+store.KCDID+"','"+store.BMID+"');";
	}
	return s2sql;
}
//sale003  a:支付订单号  p：支付明细列表
const  sale3=(a,p)=>{
	let store = getApp().globalData.store;
	let sql3="";
	//支付明细
	for (var i = 0; i <p.length; i++) {
		let pay=that.PayList[i]
		sql3+="insert SALE003(BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,RYID,GCID,DPID,KCDID,BMID,DISC)"+
		"values('"+a+"',date(),time(),'"+store.KHID+"','"+store.POSID+"',"+i+",'"+pay.fkid+"',"+pay.amount+",'"+store.RYID+
		"','"+store.GCID+"','"+store.DPID+"','"+store.KCDID+"','"+store.BMID+"');";
	}
	return sql3;
}
export default {
	sale1,
	sale2,
	sale3
}






















	        ////退款的合集
			// RefundAll: function(t, e, func) {
			// 	let Result;
			// 	if (t == 'WX') {
			// 		_wx.Refund("微信退款", e.out_trade_no, e.out_refund_no, e.total_fee, function(res) {
			// 			Result = JSON.parse(res.data);
			// 			if (Result.return_code == 'SUCCESS' && Result.result_code ==
			// 				'SUCCESS') { //提交退款成功不代表退款成功 需要查询后才能知道结果
			// 				Result.new_code = '1';
			// 			} else { //退款提交失败
			// 				Result.new_code = '-1';
			// 				Result.new_msg = Result.return_msg;
			// 			}
			// 			if (func) func(Result);
			// 		});
			// 	} else if (t == 'ALI') {
			// 		_ali.Payment("支付宝退款", "TradeRefund", "AliPayService", {
			// 				out_trade_no: e.out_trade_no,
			// 				refund_amount: e.refund_amount,
			// 				out_request_no: e.out_refund_no
			// 			},
			// 			function(res) {
			// 				let rResult = JSON.parse(res.data);
			// 				rResult = rResult.alipay_trade_refund_response;
			// 				if (Result.code = "10000" && Result.refund_status == "REFUND_SUCCESS") { //退款成功
			// 					rResult.code = 1;
			// 				} else {
			// 					rResult.code = 0;
			// 				}
			// 				if (func) func(rResult);
			// 			},
			// 			function(res) {
			// 				if (res.data != null) {
			// 					let errResult = JSON.parse(res.data);
			// 					errResult = errResult.alipay_trade_refund_response
			// 					//非业务失败
			// 					if (errResult.code != "40004") {
			// 						//业务失败
			// 						res.msg = errResult.msg;
			// 					} else {
			// 						res.msg = errResult.sub_msg;
			// 					}
			// 					res.code = -1
			// 				}
			// 				if (func) func(res);
			// 			});
			// 	} else if (t == 'CARD') {
			// 		let that = this;
			// 		//会员卡退款
			// 		let obj = {
			// 			orderbill: e.out_trade_no,
			// 			refundbill: e.out_refund_no,
			// 			refundnet: e.refund_amount
			// 		}
			// 		if (that.brand == "KG") {
			// 			obj.payTxnId = "";
			// 		} else {
			// 			obj.kquser = that.kquser;
			// 			obj.storeid = that.KHID;
			// 			obj.deviceno = "13001001";
			// 			obj.ryid = that.RYID;
			// 			obj.mer_id = that.MerId;
			// 			obj.posid = that.POSID;
			// 			obj.trans_date = dateformat.getdate();
			// 			obj.hyid = "856666000100005005";
			// 		}

			// 		hy.REFUND_ALL(that.brand,obj, function(res) {
			// 			if (res.code) {
			// 				res.code = '1';
			// 			} else {
			// 				res.code = '-1';
			// 			}
			// 			if (func) func(res);
			// 		})
			// 	} else if (t == 'COUPON') {
			// 		//券的也没有
			// 		if (func) func({
			// 			code: 1
			// 		});
			// 	} else {
			// 		if (func) func({
			// 			code: 1
			// 		});
			// 	}
			// },
			// //查询退款的合集
			// queryRefundAll: function(t, e, func) {
			// 	let Result;
			// 	if (t == 'WX') {
			// 		_wx.QueryRefund("微信退款查询", e.out_trade_no, function(res) {
			// 			Result = JSON.parse(res.data);
			// 			if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
			// 				.out_refund_0 == 'SUCCESS') { //退款成功
			// 				Result.new_code = '1';
			// 			} else if (Result.return_code == 'SUCCESS' && Result.result_code == 'SUCCESS' && Result
			// 				.out_refund_0 == 'PROCESSING') { //退款中
			// 				Result.new_code = '0';
			// 			} else {
			// 				Result.new_code = '-1';
			// 				Result.new_msg = Result.return_msg;
			// 			}
			// 			if (func) func(Result);
			// 		});
			// 	} else if (t == 'ALI') {
			// 		_ali.Payment("支付宝退款查询...", "RefundQuery", 'AliPayService', {
			// 				out_trade_no: e.out_trade_no,
			// 				out_request_no: e.out_request_no
			// 			},
			// 			function(res) {
			// 				let Result = JSON.parse(res.data);
			// 				Result = Result.alipay_trade_fastpay_refund_query_response;
			// 				if (Result.code = "10000" && Result.refund_status == "REFUND_SUCCESS") {
			// 					//已经退款了
			// 					Result.code = 1;
			// 				} else {
			// 					//没有退款  
			// 					Result.code = 0;
			// 					that.ToRefund("正在退款中..", data.no, data.amount, "T" + data.no, array[0].value);
			// 				}
			// 				//支付成功生成记录
			// 				that.dPayAmount += data.amount; //等支付减去支付金额
			// 				that.yPayAmount -= data.amount //已支付加上支付金额
			// 				if (that.PayWay == 'AliPayService' || that.PayWay == 'WxPayService') {
			// 					that.PayAmount = that.totalAmount - that.yPayAmount;
			// 				} else {
			// 					that.PayAmount = 0;
			// 				}
			// 				if (func) func(Result);
			// 			},

			// 			function(res) {
			// 				if (res.data != null) {
			// 					let Result = JSON.parse(res.data);
			// 					Result = Result.alipay_trade_fastpay_refund_query_response;
			// 					//非业务失败
			// 					if (Result.code != "40004") {
			// 						res.msg = Result.msg;
			// 						//业务失败
			// 						return;
			// 					} else {
			// 						//业务失败
			// 						res.msg = Result.sub_msg;
			// 					}
			// 					res.code = -1;
			// 				}
			// 				if (func) func(res);
			// 			});

			// 	} else if (t == 'CARD') {

			// 	} else if (t == 'COUPON') {
			// 		if (func) func({
			// 			code: 1
			// 		});
			// 	} else {
			// 		if (func) func({
			// 			code: 1
			// 		});
			// 	}
			// },
			// refund: function(data) {
			// 	let that = this;
			// 	var array = this.PayWayList.filter((item) => {
			// 		return item.name == data.name;
			// 	})
			// 	let t = array[0].value;
			// 	// ,
			// 	// refund_amount:data.amount
			// 	//查询退款
			// 	//1.根据单号查询数据库中的订单
			// 	//2.根据订单查询退款单号  
			// 	let out_request_no = null;
			// 	//如果没有查出来就  生成退款单号直接退款接口
			// 	if (!out_request_no) {
			// 		out_request_no = common.CreateBill("K210QTD002", "001");
			// 		console.info(out_request_no);
			// 		that.sale3_obj = {
			// 			out_trade_no: data.amount,
			// 			refund_amount: data.amount,
			// 			out_request_no: out_request_no
			// 		};
			// 		that.RefundAll(t, that.sale3_obj,
			// 			function(res1) {
			// 				console.log("发起退款的结果" + res1);
			// 				if (res1.code > 0) {
			// 					//退款成功
			// 					uni.showToast({
			// 						title: "退款成功!",
			// 						icon: "success"
			// 					});
			// 					//生成退款记录
			// 				} else {
			// 					//退款失败
			// 					uni.showToast({
			// 						title: "退款失败：" + res1.msg,
			// 						icon: "error"
			// 					});
			// 				}
			// 			});
			// 	} else {
			// 		//如果有退款单号就查退款接口
			// 		let obj = {
			// 			out_trade_no: data.amount,
			// 			out_request_no: out_request_no
			// 		}
			// 		let t = "ALI";
			// 		that.queryRefundAll(t, obj, function(res) {
			// 			console.log("查询结果" + res);
			// 			if (code == 1) {
			// 				//查询到已经是退款成功的生成退款记录
			// 			} else if (code == 0) {
			// 				//发起退款
			// 				that.RefundAll(t, that.sale3_obj, function(res1) {
			// 					console.log("发起退款的结果" + res1);
			// 					if (res1.code > 0) {
			// 						//退款成功
			// 						uni.showToast({
			// 							title: "退款成功!",
			// 							icon: "success"
			// 						});
			// 						//生成退款记录
			// 					} else {
			// 						//退款失败
			// 						uni.showToast({
			// 							title: "退款失败：" + res1.msg,
			// 							icon: "error"
			// 						});
			// 					}
			// 				});
			// 			} else {
			// 				//异常或者其它信息
			// 				uni.showToast({
			// 					title: res.msg,
			// 					icon: "error"
			// 				});
			// 			}
			// 		});
			// 	}
			// },