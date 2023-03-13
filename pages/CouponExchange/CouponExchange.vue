<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<!-- <Pagekq></Pagekq> -->
		<view class="right">
			<!-- 顶部导航栏 -->
			<Head :custom.sync="view.big_customer" :_ynDKF='view.enable_customer' :_showSale="true"></Head>
			<!-- 内容栏 -->
			<view class="steps">
				<view class="listep curr">
					<text class="xuhao">01</text>
					<view class="setname"><label>录入待售卡券</label><text>刷卡，扫券，或手动录入</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">02</text>
					<view class="setname"><label>确认折扣和金额</label><text>是否选大客户赊销等</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">03</text>
					<view class="setname"><label>支付</label><text>先支付，后激活/充值</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep">
					<text class="xuhao">04</text>
					<view class="setname"><label>等待激活/充值</label><text>已支付订单</text></view>
					<!-- <em>>>>>>></em> -->
				</view>
			</view>
			<view class="listof" style="width: 100%;">
				<view class="prolist zxpro" style="width: 92%;">
					<view class="choice">
						<view class="table">
							<view class="tab curr">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
									<text>兑换券换卡</text>
								</label>
							</view>
						</view>
						<view class="ckr">兑换券折扣额：{{CouponInfo.coupon_value||0}}</view>
					</view>
					<view class="module" style="height: 66%;">
						<view class="hh">待售详情 <em></em></view>
						<!-- 没刷卡时显示 -->
						<view class="swipetip" v-if="SALE002.length==0">
							<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>请先录入兑换券，再录入待激活礼品卡</text>
						</view>
						<!-- 刷卡后显示卡列表 -->
						<view class="cardlist">
							<view class="ulli" v-for="(item,index) in SALE002">
								<view class="touch-list list-touch" @click="Touchlist" :data-style="item.txtStyle"
									:data-index="index" :style="item.txtStyle">
									<image class="bgs" src="@/images/quan-bg.png" mode="widthFix"></image>
									<view class="h6">
										<label>￥{{item.PRICE}}<text>/{{item.QTY}}张</text></label>
										<view class="zje">
											<view><text>总金额</text>￥{{item.NET}}</view>
										</view>
									</view>
									<view class="card-num">
										<label>始：<text>{{item.begin_num}}</text></label>
										<label>终：<text>{{item.end_num}}</text></label>
									</view>
									<view class="statistic">
										<label><em>●</em><text>总折扣：</text>{{item.DISCRATE||0}}</label>
										<label><em>●</em><text>标准折扣：</text>{{item.BZDISC||0}}</label>
										<label><em>●</em><text>临时折扣：</text>{{item.LSDISC||0}}</label>
										<label><em>●</em><text>特批折扣：</text>{{item.TPDISC||0}}</label>
									</view>
								</view>
								<view class="touch-list list-delete" @click="RemoveItem(item)">
									<image src="@/images/img2/ka-shanchu.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="totals">
						<view>
							<em></em>
							<label>总数量：<text>{{TotalNum}}</text></label>
							<label>总金额：<text>￥{{TotalNet}}</text></label>
						</view>
						<button class="btn" @click="ToPay()">确认支付</button>
					</view>
					<!-- 起始卡号 -->
					<CardNumEntry :show.sync="showCardNum"></CardNumEntry>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="a-z">
							<image src="../../images/img2/shuakalr.png" mode="widthFix" @click="showCardFunc">
							</image>
						</view>
						<!-- <view class="a-z">
							<image src="../../images/cuxiaohd-dlu.png" mode="widthFix" @click="showDisc=true"></image>
						</view> -->
						<view class="a-z">
							<image src="@/images/img2/chikaren.png" mode="widthFix"></image>
						</view>
						<view class="a-z">
							<image src="@/images/img2/dhquannn.png" mode="widthFix" @click="showSMQ=true"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 特殊折扣 -->
		<!-- <SpecialDisc v-if="showDisc" :zkdatas="ZKData" :product="SALE002"></SpecialDisc> -->
		<!-- 画布 -->
		<view class="canvasdiv" :style="'visibility:hidden;'">
			<canvas canvas-id="couponQrcode" class="canvas"
				:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasLogo" class="canvas"
				:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasXPEWM" class="canvas"
				:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>
		</view>

		<!-- //扫码枪组件 -->
		<saomaqiang v-if="showSMQ" style="z-index: 999;"></saomaqiang>
	</view>
</template>
<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue';
	import Pagekq from '@/pages/Home/Component/Pagekq.vue'

	import _card_coupon from "@/utils/sale/card_coupon.js";
	import util from "@/utils/util.js";
	import _util from "@/utils/util.js";
	import _card_sale from "@/api/business/card_sale.js";
	import _saleClass from "@/utils/sale/saleClass.js";
	import _main from '@/api/business/main.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _common from '@/api/common.js';
	import _pay from '@/api/Pay/PaymentALL.js';

	import {
		CreateSaleOrder,
		PointUploadNew
	} from '@/bll/Common/bll.js';
	import {
		Sale3Model,
		Sale3ModelAdditional
	} from '@/bll/PaymentBusiness/bll.js'

	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	import {
		RequestSend
	} from '@/api/business/da.js';

	var that, KQSale;
	export default {
		name: "CardSale",
		components: {
			Head,
			Pagekq,
			PrinterPage,
		},
		data() {
			return {
				begin_num: "",
				end_num: "",
				store: getApp().globalData.store,
				CZGZMX: [],
				CurCZGZ: {},
				SALE001: {},
				SALE002: [],
				SALE003: [],
				SALE006: [],
				SXSALE001: [],
				showCardNum: false,
				swipetip: false,
				showDisc: false,
				ZKData: [],
				BILL_TYPE: "Z111", //Z112
				XSTYPE: "1",
				KQXSTYPE: "SK",
				Amount: 0, //VIP卡余额
				view: {
					big_customer: false, //是否默认展示大客户
					enable_customer: false, //是否能选择大客户
				},
				YWTYPE: "GiftCard_Active", //礼品卡激活
				CurZKDisc: {}, //特殊折扣类型
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 256, //二维码宽
				qrCodeHeight: 256, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				FKDA_INFO: [], //支付方式
				showSMQ: false, //s是否显示扫码
				CouponInfo: {}, //券信息
				payed: [] //已支付信息用于组装券兑换
			}
		},
		onReady: function() {
			that = this;
			//查询付款方式
			(_util.callBind(that, async function() {
				try {
					await RequestSend(`SELECT FKID,SNAME,JKSNAME FROM FKDA`, _util.callBind(that, function(
						res) {
						if (res.code) {
							that.FKDA_INFO = JSON.parse(res.data);
							_util.setStorage('FKDA_INFO', that.FKDA_INFO)
							console.log("[GetSale]获取支付方式==========:", that.FKDA_INFO);
						} else {
							console.log("获取付款方式失败!======", err);
						}
					}))
				} catch (err) {
					console.log("获取付款方式失败!======", err);
				}
			}))()
		},
		created: function() {
			that = this;

			let store = getApp().globalData.store;
			KQSale = new _card_coupon.InitKQSale(that, uni, store, "GiftCard_Active");

			that.SALE001 = _card_coupon.InitSale001(store, {
				XSTYPE: that.XSTYPE,
				BILL_TYPE: that.BILL_TYPE,
				KQXSTYPE: that.KQXSTYPE,
				CUID: that.KQXSTYPE,
				DKFID: store.DKFID
			});
		},
		mounted() {
			//事件监听
			uni.$on("GetCardNums", that.GetCardNums);
			//券号回调
			uni.$on("getAuthCode", that.GetAuthCode);
			uni.$on("ReturnSale", that.ClearSale);

		},
		watch: {},
		destroyed() {
			uni.$off("GetCardNums");
			uni.$off('getAuthCode');
			uni.$off("ReturnSale");
		},
		computed: {
			//商品总数量
			TotalNum: function() {
				console.log("TotalNum发生改变：", that.SALE002);
				let total = 0;
				that.SALE002.map(r => {
					total += r.QTY;
				})
				return total;
			},
			//商品总金额 包含折扣
			TotalNet: function() {
				let total = 0;
				console.log("TotalNet发生改变：", that.SALE002);
				if (!that.SALE002 || that.SALE002.length == 0) {
					return total;
				}
				that.SALE002.map(r => {
					total += r.NET;
				})
				return total;
			}, //总折扣额 赠送金额和特殊折扣
			TotalDisc: function() {
				let total = 0;
				if (!that.SALE002 || Object.keys(that.SALE002).length == 0) {
					return total;
				}
				that.SALE002.map(r => {
					total += _util.newFloat(r.DISCRATE, 2);
				})
				return total;
			},
		},
		methods: {

			Touchlist: function(e) {
				var txtStyle = e.currentTarget.dataset.style;
				var index = e.currentTarget.dataset.index;
				var list = this.SALE006;
				console.log(txtStyle);
				if (txtStyle == "left:0") {
					txtStyle = "left:-50px";
					list[index].txtStyle = txtStyle;
					this.SALE006 = list
				} else {
					txtStyle = "left:0";
					list[index].txtStyle = txtStyle;
					this.SALE006 = list
				}
			},
			//组件卡号返回
			GetCardNums: function(e) {
				console.log("卡号返回事件3：", e);
				if (e) {
					that.showCardNum = false;
					that.begin_num = e.begin_num;
					that.end_num = e.end_num;
					if (e.type == 'Y') {
						that.MatchSP();
					}
				}
			},
			//判断是否已录入
			IntervalOverlap: function(min, max) {
				console.log("开始校验区间：", that.SALE002);
				if (that.SALE002.length == 0) return true;
				let arr = that.SALE002.map(r => {
					return {
						min: r.begin_num.substr(r.begin_num.length - 6, 5),
						max: r.end_num.substr(r.end_num.length - 6, 5)
					};
				})
				arr.push({
					min: min.substr(min.length - 6, 5),
					max: max.substr(max.length - 6, 5)
				});
				return _util.IntervalOverlap(arr);
			},
			//商品状态和库存校验并并生成sale2,6
			MatchSP: function() {
				if (!this.begin_num) {
					_util.simpleMsg("卡号不为空");
				}
				if (!that.IntervalOverlap(that.begin_num, that.end_num))
					return _util.simpleMsg("当前号段与已录入号段重复，请重新录入！");
				KQSale.QueryInfo({
					card_num: that.begin_num
				}, res => {
					console.log("卡信息查询结果：", res);
					if (KQSale.CheckStatus(res)) {
						KQSale.CheckActiveNum({
							channel: "ZC007",
							begin_num: that.begin_num,
							end_num: that.end_num,
							material_id: res.data.materielId,
							khid: that.store.KHID,
							cardnum: _util.CheckNum(that.begin_num, that.end_num)
						}, async res3 => {
							console.log("可激活数量校验结果：", res3);
							if (res3.code) {
								let SPObj = await KQSale.MatchSP(res.data.materielId, res.data
									.amount, 1); //当前号段
								// console.log("当前号段商品0：", SPObj);
								SPObj = that.CoverSale(SPObj, that.SALE001); //属性合并

								console.log("当前号段商品：", SPObj);
								console.log("号段开始校验库存：", res3.data);
								let arr = res3.data; //可用号段集合
								arr.map(async (r3, i3) => { //循环发起库存校验
									let spObj = JSON.parse(JSON.stringify(
										SPObj)); //防止被引用
									let num1 = r3.cardNoBegin;
									let num2 = r3.cardNoEnd;
									console.log("号段检测：", num1 + "-" + num2);
									await KQSale.CheckStock({
										begin_num: num1,
										end_num: num2,
										material_id: res.data.materielId,
										khid: that.store.KHID
									}, res1 => {
										console.log("库存校验结果：", res1);
										if (!res1.code) {
											_util.simpleMsg(res1.msg, true);
											return;
										}
										console.log("号段检测1：", num1 + "-" +
											num2);
										let no = that.SALE006.length + 1;
										console.log("序号检测：", no);
										let sale6 = that.CreateSale006({
											begin_num: num1,
											end_num: num2,
											qty: r3.cardNum,
											index: no
										}, spObj, that.SALE001);
										if (sale6)
											that.SALE006.push(sale6);
										spObj.begin_num = num1;
										spObj.end_num = num2;
										spObj.STR2 = num1 + "-" + num2;
										spObj.NO = no;
										spObj.QTY = r3.cardNum; //重写一下QTY
										spObj.NET = _util.newFloat(spObj
											.PRICE * spObj.QTY, 2); //重写一下NET
										that.SALE002.push(
											spObj); //追加当前号段的商品信息
										console.log("sale2", that.SALE002);
										console.log("sale6", that.SALE006);
									})
								})
							} else {
								_util.simpleMsg("激活校验错误：" + res3.msg, "none");
							}
						})
					}
				})
			},
			//创建s6
			CreateSale006: function(cards, sale2, sale1) {
				let sale6 = new _saleClass.sale006();
				sale6 = that.CoverSale(sale6, sale1);
				sale6.KQIDS = cards.begin_num;
				sale6.KQIDE = cards.end_num;
				sale6.KQIDSTR = cards.begin_num + "-" + cards.end_num;
				sale6.SPID = sale2.SPID;
				sale6.MYSTR = sale2.PRICE;
				sale6.QTY = cards.qty;
				sale6.NO = cards.index;

				sale6.txtStyle = "left:0"; //用于滑动删除事件
				console.log("生成的的sale6:", sale6);
				return sale6;
			},
			//sale对象属性合并
			CoverSale: function(sale, sale1) {
				try {
					if (Object.keys(sale1).length == 0) {
						return sale;
					}
					let arr = [
						"KHID",
						"POSID",
						"RYID",
						"BILL",
						"KCDID",
						"GCID",
						"DPID",
						"SALEDATE",
						"SALETIME",
						"CLTIME",
						"YN_OK",
						"YN_SC",
						"YAER",
						"MONTH",
						"WEEK",
						"TIME",
						"DKFID"
					];
					arr.map(r => {
						if (sale1[r] && sale.hasOwnProperty(r)) { //sale1有这个属性值 且sale 有这个属性
							sale[r] = sale1[r];
						}
					});
					return sale;
				} catch (e) {
					//TODO handle the exception
					console.log("转换异常：", e.message);
					return null;
				}
			},

			//待售列表清除
			RemoveItem: function(e) {
				_util.simpleModal("提示", "是否确认删除此项？", res => {
					if (res) {
						let arr = that.SALE002.filter(r => {
							return r.SPID != e.SPID;
						});
						that.SALE002 = arr;
						let arr1 = that.SALE006.filter(r => {
							return r.KQIDSTR != e.STR2;
						});
						that.SALE006 = arr1;
					}
				})
			},
			//删除商品
			deleteSP: function(spid) {
				if (spid) {
					let arr = that.SALE002.filter(r => {
						return r.SPID != spid
					});
					that.SALE002 = arr;
					let arr1 = that.SALE006.filter(r => {
						return r.SPID != spid
					});
					that.SALE006 = arr1;
				}
			},
			//根据002 计算001 金额等字段
			CalTNET: function() {
				let tnet = 0,
					tcxdisc = 0,
					tbzdisc = 0,
					ttpdisc = 0,
					tlsdisc = 0;
				that.SALE002.map(r => {
					tnet += r.NET;
					tcxdisc += r.CXDISC;
					tbzdisc += r.BZDISC;
					ttpdisc += r.TPDISC;
					tlsdisc += r.LSDISC;
				})
				that.SALE001.TNET = _util.newFloat(tnet);
				that.SALE001.ZNET = that.SALE001.TNET; //调整为原价
				that.SALE001.TCXDISC = _util.newFloat(tcxdisc);
				that.SALE001.TBZDISC = _util.newFloat(tbzdisc);
				that.SALE001.TTPDISC = _util.newFloat(ttpdisc);
				that.SALE001.TLSDISC = _util.newFloat(tlsdisc);
				that.SALE001.BILLDISC = _util.newFloat(tcxdisc + tbzdisc + ttpdisc + tlsdisc);
				that.SALE001.TDISC = that.SALE001.BILLDISC;
				that.SALE001.TLINE = that.SALE002.length; //这个是存商品行
			},
			//使用手工折扣进行计算 新版舍弃全部分的逻辑
			SKdiscCompute: function() {
				//手工折扣额的处理
				console.log("原金额：", this.SALE001.TNET);
				let SKY_DISCOUNT = _util.newFloat(((this.SALE001.TNET * 10) % 1) / 10, 2);
				console.log("手工折扣额：", SKY_DISCOUNT);
				this.SALE001.TNET = _util.newFloat(Number(this.SALE001.TNET) - SKY_DISCOUNT, 2);
				this.SALE001.ZNET = _util.newFloat(Number(this.SALE001.ZNET) - SKY_DISCOUNT, 2);
				this.SALE001.BILLDISC = _util.newFloat(Number(this.SALE001.BILLDISC) + SKY_DISCOUNT, 2);
				this.SALE001.TCXDISC = _util.newFloat(Number(this.SALE001.TCXDISC) + SKY_DISCOUNT, 2);
				this.SALE001.ROUND = SKY_DISCOUNT;
				this.SALE001.TDISC = _util.newFloat(Number(this.SALE001.TDISC) + SKY_DISCOUNT, 2);
				console.log("[skdiscCompute]001计算手工折扣后的新数据：", that.SALE001);
			},
			//组装激活申请参数
			PackgeActivData: function() {
				let dataObj = {
						channel: "ZC007"
					},
					orderList = [],
					cardList = [];
				orderList = that.SALE002.map(r => {
					return {
						merOrderId: r.BILL,
						lineNo: r.NO,
						materielId: r.SPID,
						totalNum: r.QTY,
						amount: r.NET,
						discountAmount: 0,
						storeNo: r.KHID,
						guestFlag: 2,
						saleChannelId: that.store.DQID,
						saleChannelName: that.store.DQNAME,
						saleUserCode: that.store.RYID,
						saleUserName: that.store.RYNAME,
						saleStoreCode: that.SALE001.KHID,
						saleStoreName: that.store.NAME
					}
				})
				cardList = that.SALE006.map(r => {
					return {
						merOrderId: r.BILL,
						lineNo: r.NO,
						cardNoBegin: r.KQIDS,
						cardNoEnd: r.KQIDE,
						cardNum: r.QTY
					}
				})
				dataObj.orderList = orderList;
				dataObj.cardList = cardList;
				dataObj.merOrderId = that.SALE001.BILL; //业务单号
				return dataObj;
			},
			//兑换券核销
			CreateSale003: function() {
				that.payed.push(Sale3ModelAdditional(Sale3Model({
					fkid: 'ZF11',
					type: 'SZQ',
					bill: that.SALE001.BILL,
					name: "仟吉兑换券",
					amount: that.CouponInfo.coupon_value
				}), { //业务配置字段（支付状态设定为成功）
					fail: false, //显示为成功
					show: false
				}));
			},
			//创建支付参数
			CreatePayData() {
				return {
					// subject: "兑换券核销",
					// no: "0", //储存当前序号
					out_trade_no: that.SALE001.BILL,
					total_money: _util.newFloat(that.SALE001.TNET * 100, 2), //总支付金额
					money: (Number(that.CouponInfo.coupon_value) * 100).toFixed(0), //这一笔的支付金额
					auth_code: that.CouponInfo.coupon_num,
					store_id: that.SALE001.KHID,
					// store_name: this.NAME,
					// merchant_no: this.MerId,
					channel: "POS",
					// point: this.CashOffset.Score, //抵现积分数
					// point_money: this.CashOffset.Money, //积分积分对应金额
					// member_id: this.SALES.sale1.CUID,
					// memo: this.currentPayInfo?.fkid ?? this.currentSelectedInfo
					// 	?.fkid, //因为前者会受到authcode影响被清空，导致用券支付时，如果扫了错误的码会导致找不到支付信息，从而使其获取不到fkid，导致失败后端券查询报无auth_code的问题
					// discountable_amount: (Number(this.ZFBZK) * 100).toFixed(0), //支付宝折扣金额（只有支付宝才有噢）
					// discountable_amount: zfb_disc,
					product_info: that.SALE002.map(i => { //商品清单
						return {
							spid: i.SPID,
							// name: i.NAME,
							// price: (Number(i.PRICE) * 100).toFixed(0), //单价
							amount: (Number(i.NET) * 100).toFixed(0), //总金额
							num: i.QTY
						}
					})
				}
			},
			//去支付
			ToPay: function() {
				if (that.SALE002.length == 0) {
					_util.simpleMsg("请录入有效卡号", true);
					return;
				}
				console.log("sale2", that.SALE002);
				KQSale.ActiveApply(that.PackgeActivData(), res => {
					console.log("激活校验申请结果：", res);
					if (res.code) {
						that.CalTNET(); //汇总计算SALE001的折扣值
						that.SKdiscCompute() //手工折扣
						//先进行券核销再进入支付 等待支付返回结果
						_util.simpleModal("提示", "是否要核销该兑换券？", res => {
							if (res) {
								//券核销成功后
								_pay.Payment("SZQ", that.CreatePayData(), res1 => {
									console.log("兑换券核销结果：", res1);
									if (res1.code) {
										_util.simpleMsg("券核销成功即将跳转支付...", "none");
										that.CreateSale003(); //创建已支付的兑换券记录
										console.log("兑换券支付记录：", that.payed);
										//跳转支付
										setTimeout(_card_sale.PayParamAssemble(that, that
											.PayedResult), 1500);
									} else {
										_util.simpleMsg("券核销失败：" + res1.msg, "none");
									}
								}, err => {
									_util.simpleMsg("券核销失败：" + err.msg, "none");
								})
							}
						})
					} else {
						_util.simpleMsg("校验失败：" + res.msg, true);
					}
				});
			},

			//跳转支付
			PayParamAssemble: function(sales) {
				uni.$emit('stop-message');
				uni.$emit('stop-timed-communication');
				console.log("[PayParamAssemble]支付参数组装...")
				util.setStorage('open-loading', false);
				let inputParm = {
					sale1_obj: that.SALE001, //001 主单 数据对象
					sale2_arr: that.SALE002, //002 商品 数据对象集合
					actType: "Payment", //动作类型(退款、支付)
				}
				console.log("[PayParamAssemble]支付前封装的数据:", inputParm);
				that.$store.commit('set-location', inputParm);
				uni.navigateTo({
					url: "../Payment/Payment",
					events: {
						FinishOrder: that.PayedResult
					}
				})
			},
			//支付完成处理
			PayedResult: async function(result) {
				_util.setStorage('open-loading', true);
				console.log("[PayedResult]支付结果:", result);
				uni.$emit('continue-message');
				uni.$emit('continue-timed-communication');
				if (!result.code) { //取消支付或者支付失败了 不走后续的处理
					_util.simpleMsg(result.msg, !result.code);
					//清除手工折扣
					that.SALE001.ROUND = 0;
					return;
				}
				that.SALE001 = Object.cover(new _saleClass.sale001(), result.data.sale1_obj);
				that.SALE002 = (result.data.sale2_arr ?? []).map(sale2 => Object.cover(new _saleClass
					.sale002(),
					sale2));
				that.SALE003 = (result.data.sale3_arr ?? []).map(sale3 => Object.cover(new _saleClass
					.sale003(),
					sale3));
				console.log("支付后返回结果：", that.SALE001);
				if (result.code) {
					console.log("准备激活：", that.SALE002);
					//手工折扣额分摊
					if (that.SALE001.ROUND > 0) {
						that.SALE002 = _main.ManualDiscount(that.SALE001, that.SALE002);
						console.log("[PayedResult]分摊后的商品信息：", that.SALE002);
					}
					//发起激活
					KQSale.ActiveConfirm({
						salebill: that.SALE001.BILL,
						channel: "ZC007"
					}, async res2 => {
						_util.simpleMsg(res2.code ? "激活成功" : "激活失败：" + res2.msg, !res2.code);
						//激活
						console.log("VIP单卡激活结果：", res2);
						that.SALE001.STR1 = res2.code ? "success" : "fail";
						that.SALE001.CUID = that.SALE001.KQXSTYPE; //回调重写 
						if (!res2.code) { //激活失败要记录一下
							that.SALE001.YN_OK = "F";
							that.SALE001.REASON = "JHF"; //激活失败
						}
						//销售单生成
						that.SaleCompleted();
					})
				} else {
					_util.simpleMsg(result.msg, true);
				}
			},
			//完成销售单
			SaleCompleted: async function() {
				console.log("生成销售单");
				//激活完成-创建卡券销售单
				let res = that.ConcatSale2_6();
				await KQSale.Completed({
					SALE001: that.SALE001,
					SALE002: res.sale2,
					SALE003: that.SALE003,
					SALE006: res.sale6,
					SXSALE001: that.SXSALE001,
				})
				await that.PrintBill(res.sale2, res.sale6);
				//重置销售单
				that.ResetSaleBill();
			},
			//数据合并
			ConcatSale2_6: function() {
				let SALE2 = JSON.parse(JSON.stringify(that.SALE002));
				let SALE6 = JSON.parse(JSON.stringify(that.SALE006));
				console.log("合并传入的对象：", {
					SALE2,
					SALE6
				});
				let arr = [];
				SALE2.map(r => {
					if (arr.length == 0) {
						console.log("1：", r);
						arr.push(r);
					} else {
						let obj = arr.find(r1 => {
							return r1.SPID == r.SPID;
						});
						console.log("2：", obj);
						const index = arr.findIndex(r1 => {
							return r1.SPID == r.SPID;
						});
						console.log("3：", index);
						if (!obj) {
							console.log("5：", obj);
							arr.push(obj);
						} else {
							console.log("6：", obj);
							arr[index].QTY = _util.newFloat(obj.QTY + r.QTY, 2);
							arr[index].NET = _util.newFloat(obj.NET + r.NET, 2);
							arr[index].DISCRATE = _util.newFloat(obj.DISCRATE + r.DISCRATE, 2);
							arr[index].BILLDISC = _util.newFloat(obj.BILLDISC + r.BILLDISC, 2);
							// arr[index].BZDISC = _util.newFloat(obj.BZDISC + r.BZDISC, 2);//无特殊折扣
							// arr[index].LSDISC = _util.newFloat(obj.LSDISC + r.LSDISC, 2);
							// arr[index].TPDISC = _util.newFloat(obj.TPDISC + r.TPDISC, 2);
							arr[index].CXDISC = _util.newFloat(obj.CXDISC + r.CXDISC, 2); //主要是手工折扣
							arr[index].YN_SKYDISC = arr[index].CXDISC > 0 ? "Y" : "N";
							console.log("7：", arr[index]);
						}
					}
				});
				console.log("10:", SALE2);
				SALE6.map(r => {
					let obj = that.SALE002.find(r1 => {
						return r1.STR2 == r.KQIDSTR;
					})
					console.log("8：", obj);
					console.log("9：", obj.NET);
					r.MYSTR = obj.NET;
				});
				let aObj = {
					sale2: arr,
					sale6: SALE6
				};
				console.log("合并后的SALE002_6：", aObj);
				return aObj;
			},
			PrintBill: async function(sale2, sale6) {
				console.log("调用打印");
				//调用打印
				//调用打印
				let printerPram = {
					"PRINTNUM": 1,
					"XSTYPE": "SKJH",
				};

				let arr3 = that.SALE003;
				let fkdaRes = that.FKDA_INFO;
				arr3.forEach(function(item, index) {
					try {
						item.SNAME = fkdaRes.find(c => c.FKID == item.FKID).SNAME;
						item.balance = item.balance;
					} catch (e) {
						item.SNAME = "";
						item.balance = 0;
					}
				});
				await that.$refs.printerPage.sksqBluePrinter(that.SALE001, sale2, arr3, sale6,
					printerPram);

			},
			//重置本次销售单
			ResetSaleBill: function() {
				that.SALE001 = _card_coupon.InitSale001(that.store, {
					XSTYPE: that.XSTYPE,
					BILL_TYPE: that.BILL_TYPE,
					KQXSTYPE: that.KQXSTYPE,
					CUID: that.KQXSTYPE,
					DKFID: that.store.DKFID
				});
				that.SALE002 = [];
				that.SALE003 = [];
				that.SALE006 = [];
				that.SXSALE001 = [];
				that.CurCZGZ = {};
				that.Amount = 0;
				console.log("单据重置成功")
			},
			//显示扫码组件
			showCardFunc: function() {
				if (!that.CouponInfo || Object.keys(that.CouponInfo).length == 0) {
					_util.simpleMsg("请录入有效兑换券", "none");
					return;
				}
				that.showCardNum = true;
			},
			//扫码组件回调
			GetAuthCode: async function(e) {
				// e = "900000000002082278";
				console.log("收到扫码组件回调：", e);
				this.showSMQ = false; //关闭组件
				if (e) {
					let code = _common.ResetAuthCode(e);
					let couponInfo = await that.coupon_info_search(code);
					console.log("券信息：", couponInfo);
					if (couponInfo && couponInfo.code) {
						if (couponInfo.data.total_info.ZZIFDHQ != "Y") {
							that.CouponInfo = {};
							_util.simpleMsg("券类型不是兑换券", true);
							return;
						}
						if (couponInfo.data.total_info.ZZCPSTATE == "J01" || couponInfo.data.total_info.ZZCPSTATE ==
							"J06") {
							that.CouponInfo = couponInfo.data;
							that.CouponInfo.coupon_num = code;
							_util.simpleMsg("校验成功，券面额为：" + that.CouponInfo.coupon_value + "元");
						} else {
							that.CouponInfo = {};
							_util.simpleMsg("券状态不可用", true);
							return;
						}
					} else {
						_util.simpleMsg("券信息查询错误：" + couponInfo.msg, true);
					}
				}
			},
			//券信息查询
			async coupon_info_search(e) {
				return await _member.coupon_sale.CouponInfoSearch({
					coupon_start: e
				})
			},
			//清空数据
			ClearSale: function() {
				_util.simpleModal("提示", "是否确认清空当前数据？", res => {
					if (res) {
						that.ResetSaleBill();
					}
				})
			},
		}
	}
</script>

<style>

</style>
