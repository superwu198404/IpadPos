<template>
	<view>
		<button @click="Pay(0)">开始结算</button>
		<button @click="Pay(1)">开始退款</button> 
	</view>
</template>
<script>
	import db from '@/utils/db/db_excute.js';
	import create_sql from '@/utils/db/create_sql.js';
	export default {
		//变量初始化
		data() {
			return {}
		},
		//方法初始化
		methods: {

			Pay: function(e) {
				if (e == 0) {
					uni.navigateTo({
						url: "../Payment/Payment"
					})
				} else if (e == 1) {
					uni.navigateTo({
						url: "../Refund/Refund"
					})
				}
			},
			change: function(e) {
				let i = 10;
				while (i > 0) {
					console.info(i);
					i--;
				}
				// uni.showModal({
				// 	title: '提示',
				// 	content: '这是一个模态弹窗',
				// 	success: function (res) {
				// 		if (res.confirm) {
				// 			console.log('用户点击确定');
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消');
				// 		}
				// 	}
				// });
				// this.$store.dispatch('popup/open', {
				// 	title: '提示',
				// 	content: '修改按钮和颜色',
				// 	showOther:true,
				// showCancel:false,
				// showConfirm:false,
				// 	confirm(res) 
				// {
				// 	that.context=res.confirmText
				// 	},
				// 	cancel(res) {
				// 		that.context=res.cancelText
				// 	},
				// other(res){
				// 	that.context=res.otherText
				// }
				// });

				this.$showModal({
					concent: '测试测试~',
					showCancel: true,
					showOther: true,
					confirmVal: '知道了',
					align: 'left',
					$confirm: function(res) {
						console.log("$confirm");
					},
					$cancel: function(res) {
						console.log("$cancel");
					},
					$other: function(res) {
						console.log("$other");
					}
				});
			},
			create: function() {
				let sql = create_sql.createSql; //创建表
				db.SqliteHelper.get().executeDml(sql, "表结构创建中", function(res) {
					console.log("表结构创建成功");
					console.log(res);
				}, function(err) {
					console.log("表结构创建失败");
					console.log(err);
				});
			},
			search: function() {
				let sql3 = 'select * from SALE003 where BILL="K0101QTDS112251992132402"';
				db.SqliteHelper.get().executeQry(sql3, "数据查询", function(res) {
					console.log("支付方式查询成功");
					console.log(res);
					if (res.code && res.msg.length > 0) { //说明查到了值
						let arr = res.msg;
						console.log(res.msg.length);
					}
				}, function(err) {
					console.log("查询失败");
					console.log(err);
				});
			},
			insert: function() {
				let sql = {
					"0": "insert into SALE001 (BILL,SALEDATE,SALETIME,KHID,POSID,RYID,BILL_TYPE,XSTYPE,XS_BILL,XS_POSID,XS_DATE,XS_KHID,XS_GSID,TLINE,TNET,DNET,ZNET,BILLDISC,ROUND,CHANGENET,CXTNET,TCXDISC,CUID,CARDID,THYDISC,YN_SC,GSID,GCID,DPID,KCDID,BMID,DKFID,XSPTID,YN_OK,THTYPE,CLTIME) values(\"K0101QTDS112251992132402\",DATETIME(\"2022-05-19\"),DATETIME(\"2022-05-19 09:24:22\"),\"K0101QTDS1\",\"1\",\"10086\",\"Z101\",\"1\",null,null,null,null,null,null,\"0.03\",\"0\",\"0.03\",\"0\",\"0\",\"0\",\"0\",\"0\",null,null,\"0\",\"N\",\"1001\",\"1001\",null,null,\"001\",null,\"POS\",\"X\",\"0\",DATETIME(\"2022-05-19 09:24:22\"))",
					"1": "insert into SALE002 (BILL,SALEDATE,SALETIME,KHID,POSID,SPID,NO,PLID,BARCODE,UNIT,QTY,PRICE,OPRICE,NET,DISCRATE,YN_SKYDISC,DISC,YN_CXDISC,CXDISC,YAER,MONTH,WEEK,TIME,RYID,GCID,DPID,KCDID,BMID) values(\"K0101QTDS112251992132402\",DATETIME(\"2022-05-19\"),DATETIME(\"2022-05-19 09:24:22\"),\"K0101QTDS1\",\"1\",\"10101001\",\"0\",\"100\",\"111111111\",\"个\",\"1\",\"0.01\",\"0.01\",\"0.01\",\"0\",\"N\",\"0\",\"N\",\"0\",\"2022\",\"5\",\"19\",\"9\",\"10086\",\"1001\",null,null,\"001\")",
					"2": "insert into SALE002 (BILL,SALEDATE,SALETIME,KHID,POSID,SPID,NO,PLID,BARCODE,UNIT,QTY,PRICE,OPRICE,NET,DISCRATE,YN_SKYDISC,DISC,YN_CXDISC,CXDISC,YAER,MONTH,WEEK,TIME,RYID,GCID,DPID,KCDID,BMID) values(\"K0101QTDS112251992132402\",DATETIME(\"2022-05-19\"),DATETIME(\"2022-05-19 09:24:22\"),\"K0101QTDS1\",\"1\",\"10101002\",\"1\",\"101\",\"2222222222\",\"袋\",\"2\",\"0.01\",\"0.01\",\"0.01\",\"0\",\"N\",\"0\",\"N\",\"0\",\"2022\",\"5\",\"19\",\"9\",\"10086\",\"1001\",null,null,\"001\")",
					"3": "insert into SALE003 (BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,ID,RYID,GCID,DPID,KCDID,BMID,DISC) values(\"K0101QTDS112251992132402\",DATETIME(\"2022-05-19\"),DATETIME(\"2022-05-19 09:24:22\"),\"K0101QTDS1\",\"1\",\"0\",\"ZF04\",\"0.01\",null,\"10086\",\"1001\",null,null,\"001\",null)",
					"4": "insert into SALE003 (BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,ID,RYID,GCID,DPID,KCDID,BMID,DISC) values(\"K0101QTDS112251992132402\",DATETIME(\"2022-05-19\"),DATETIME(\"2022-05-19 09:24:22\"),\"K0101QTDS1\",\"1\",\"1\",\"ZF01\",\"0.01\",null,\"10086\",\"1001\",null,null,\"001\",null)",
					"5": "insert into SALE003 (BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,ID,RYID,GCID,DPID,KCDID,BMID,DISC) values(\"K0101QTDS112251992132402\",DATETIME(\"2022-05-19\"),DATETIME(\"2022-05-19 09:24:22\"),\"K0101QTDS1\",\"1\",\"2\",\"ZF02\",\"0.01\",null,\"10086\",\"1001\",null,null,\"001\",null)",
					"6": "insert into POS_TXFILE (TX_SQL,STOREID,POSID,TAB_NAME,STR1,BDATE,YW_NAME,CONNSTR) values(\"insert into SALE001 (BILL,SALEDATE,SALETIME,KHID,POSID,RYID,BILL_TYPE,XSTYPE,XS_BILL,XS_POSID,XS_DATE,XS_KHID,XS_GSID,TLINE,TNET,DNET,ZNET,BILLDISC,ROUND,CHANGENET,CXTNET,TCXDISC,CUID,CARDID,THYDISC,YN_SC,GSID,GCID,DPID,KCDID,BMID,DKFID,XSPTID,YN_OK,THTYPE,CLTIME) values('K0101QTDS112251992132402',TO_DATE('2022-05-19','yyyy-MM-dd HH24:mi:ss'),TO_DATE('2022-05-19 09:24:22','yyyy-MM-dd HH24:mi:ss'),'K0101QTDS1','1','10086','Z101','1',null,null,null,null,null,null,'0.03','0','0.03','0','0','0','0','0',null,null,'0','N','1001','1001',null,null,'001',null,'POS','X','0',TO_DATE('2022-05-19 09:24:22','yyyy-MM-dd HH24:mi:ss'));insert into SALE002 (BILL,SALEDATE,SALETIME,KHID,POSID,SPID,NO,PLID,BARCODE,UNIT,QTY,PRICE,OPRICE,NET,DISCRATE,YN_SKYDISC,DISC,YN_CXDISC,CXDISC,YAER,MONTH,WEEK,TIME,RYID,GCID,DPID,KCDID,BMID) values('K0101QTDS112251992132402',TO_DATE('2022-05-19','yyyy-MM-dd HH24:mi:ss'),TO_DATE('2022-05-19 09:24:22','yyyy-MM-dd HH24:mi:ss'),'K0101QTDS1','1','10101001','0','100','111111111','个','1','0.01','0.01','0.01','0','N','0','N','0','2022','5','19','9','10086','1001',null,null,'001');insert into SALE002 (BILL,SALEDATE,SALETIME,KHID,POSID,SPID,NO,PLID,BARCODE,UNIT,QTY,PRICE,OPRICE,NET,DISCRATE,YN_SKYDISC,DISC,YN_CXDISC,CXDISC,YAER,MONTH,WEEK,TIME,RYID,GCID,DPID,KCDID,BMID) values('K0101QTDS112251992132402',TO_DATE('2022-05-19','yyyy-MM-dd HH24:mi:ss'),TO_DATE('2022-05-19 09:24:22','yyyy-MM-dd HH24:mi:ss'),'K0101QTDS1','1','10101002','1','101','2222222222','袋','2','0.01','0.01','0.01','0','N','0','N','0','2022','5','19','9','10086','1001',null,null,'001');insert into SALE003 (BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,ID,RYID,GCID,DPID,KCDID,BMID,DISC) values('K0101QTDS112251992132402',TO_DATE('2022-05-19','yyyy-MM-dd HH24:mi:ss'),TO_DATE('2022-05-19 09:24:22','yyyy-MM-dd HH24:mi:ss'),'K0101QTDS1','1','0','ZF04','0.01',null,'10086','1001',null,null,'001',null);insert into SALE003 (BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,ID,RYID,GCID,DPID,KCDID,BMID,DISC) values('K0101QTDS112251992132402',TO_DATE('2022-05-19','yyyy-MM-dd HH24:mi:ss'),TO_DATE('2022-05-19 09:24:22','yyyy-MM-dd HH24:mi:ss'),'K0101QTDS1','1','1','ZF01','0.01',null,'10086','1001',null,null,'001',null);insert into SALE003 (BILL,SALEDATE,SALETIME,KHID,POSID,NO,FKID,AMT,ID,RYID,GCID,DPID,KCDID,BMID,DISC) values('K0101QTDS112251992132402',TO_DATE('2022-05-19','yyyy-MM-dd HH24:mi:ss'),TO_DATE('2022-05-19 09:24:22','yyyy-MM-dd HH24:mi:ss'),'K0101QTDS1','1','2','ZF02','0.01',null,'10086','1001',null,null,'001',null);\",\"K0101QTDS1\",\"1\",\"XS\",\"K0101QTDS112251992132402\",DATETIME(\"2022-05-19\"),\"销售单据\",\"CONNSTRING\")",
					"length": 7
				};
				let str = ""
				for (var i = 0; i < sql.length; i++) {
					str += sql[i] + ";"
				}
				console.info(str);
				db.SqliteHelper.get().executeDml(str, "订单创建中", function(res) {
					console.log("订单创建成功");
					console.log(res);
				}, function(err) {
					console.log("订单创建失败");
					console.log(err);
				});
			}
		},
		//接收上个页面传入的参数
		onLoad(option) {
			//this.change("world");    
			console.info("onLoad");
		},
		onShow() {

		},
		onReady() {
			//监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发

		},
		onHide() {
			//监听页面隐藏
		},
		onUnload() {
			//监听页面卸载
		},
		onResize() {
			//监听窗口尺寸变化
		},
		onPullDownRefresh() {
			//监听用户下拉动作，一般用于下拉刷新，参考
		},
		onReachBottom() {
			//页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。具体见下方注意事项
		},
		onTabItemTap() {
			//点击 tab 时触发，参数为Object
		},
		onShareAppMessage() {
			//用户点击右上角分享
		},
		onPageScroll() {
			//监听页面滚动 参数为Objec
		},
		onNavigationBarButtonTap() {
			//监听原生标题栏按钮点击事件 参数为Object
		},
		onBackPress() {
			//监听页面返回  
			console.info("onBackPress");
		},
		onNavigationBarSearchInputChanged() {
			//监听原生标题栏搜搜输入框输入内容变化事件
		},
		onNavigationBarSearchInputConfirmed() {
			//监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的搜素按钮是出发
		},
		onNavigationBarSearchInputClicked() {
			//监听原生标题栏搜搜输入框点击事件 （pages.json 中的 searchInput 配置 disabled 为 true 时才会触发）
		},
		onShareTimeline() {
			//监听用户点击又上角转发到朋友圈
		},
		onAddToFavorites() {
			//监听用户点击右上角收藏
		}
	}
	//可定义方法和变量
	function bb() {
		console.info("bb");
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
