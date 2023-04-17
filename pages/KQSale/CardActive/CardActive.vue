<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeout.css);
	@import url(@/static/style/card.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<view class="right">
			<!-- 顶部导航栏 -->
			<Head :custom.sync="view.big_customer" :_ynDKF='view.enable_customer' :_showSale="true" :_ynMsg='false'
				:type="'kq_sale'">
			</Head>
			<!-- 内容栏 -->
			<view class="steps">
				<view class="listep" :class="{'curr':add_class==0}">
					<text class="xuhao">01</text>
					<view class="setname"><label>录入待售卡券</label><text>刷卡，或手动录入</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep" :class="{'curr':add_class==1}">
					<text class="xuhao">02</text>
					<view class="setname"><label>确认折扣和金额</label><text>选择大客户，特殊折扣等</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep" :class="{'curr':add_class==2}">
					<text class="xuhao">03</text>
					<view class="setname"><label>支付</label><text>校验成功后发起支付</text></view>
					<em>>>>>>></em>
				</view>
				<view class="listep" :class="{'curr':add_class==3}">
					<text class="xuhao">04</text>
					<view class="setname"><label>等待激活</label><text>已支付订单</text></view>
					<!-- <em>>>>>>></em> -->
				</view>
			</view>
			<view class="listof" style="width: 100%;">
				<view class="prolist zxpro" style="width: 92%;">
					<view class="choice">
						<view class="table">
							<view class="tab" @click="ChangeYWTYPE('GiftCard_Active')"
								:class="YWTYPE=='GiftCard_Active'?' curr':''">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
									<text>礼品卡激活</text>
								</label>
							</view>
							<view class="tab jh-sb" @click="ChangeYWTYPE('GiftCard_Retry')"
								:class="YWTYPE=='GiftCard_Retry'?' curr':''">
								<image class="bgs" src="@/images/img2/shibai-biaoq.png" mode="widthFix"></image>
								<label>
									<image src="@/images/img2/jihuoshibai.png" mode="widthFix"></image>
									<text>激活失败</text>
								</label>
							</view>
						</view>
						<!-- <view class="ckr">“持卡人姓名”：877888999</view> -->
					</view>
					<!-- 卡激活 -->
					<view style="width: 100%; height: 100%;" v-if="YWTYPE!='GiftCard_Retry'">
						<view class="module">
							<view class="hh">待售详情 <em></em></view>
							<!-- 没刷卡时显示 -->
							<view class="swipetip" v-if="SALE006.length==0">
								<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
								<text>请先刷卡录入</text>
							</view>
							<!-- 刷卡后显示卡列表 -->
							<view class="cardlist">
								<view class="ulli" v-for="(item,index) in SALE002">
									<view class="touch-list list-touch" @click="Touchlist" :data-style="item.txtStyle"
										:data-index="index" :style="item.txtStyle">
										<image class="bgs" src="@/images/quan-bg.png" mode="widthFix"></image>
										<view class="h6">
											<label>￥{{item.OPRICE}}<text>/{{item.QTY}}张</text></label>
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
								<label>总折扣：<text>￥{{TotalDisc}}</text></label>
							</view>
							<button class="btn" @click="ToPay()">确认支付</button>
						</view>
					</view>
					<!-- 激活失败 -->
					<view class="commodity" v-else>
						<view class="hh">
							<view class="hotcakes">失败列表</view>
						</view>
						<view class="products" v-if="FailSaleList.length>0">
							<view class="procycle">
								<!-- 销售单循环 -->
								<view class="li" v-for="item in FailSaleList"
									:class="curFailSale.SALE1.BILL==item.SALE1.BILL?' curr':''"
									@click="curFailSale=item">
									<view class="h3">
										<view class="platform">
											<label class="state jiedan">
												<em class="gang"></em>销售日期：{{item.SALE1.SALEDATE}}</label>
										</view>
									</view>
									<view class="cods">
										<label>单号：{{item.SALE1.BILL}} <text>￥{{item.SALE1.TNET}}</text></label>
										<label><text>收银员：{{item.SALE1.RYID}}</text><text>折扣价：￥{{item.SALE1.BILLDISC}}</text></label>

									</view>
									<view class="address">
										销售时间：{{item.SALE1.SALETIME}}
									</view>
								</view>
							</view>
							<view class="details">
								<view class="detinfo">
									<view class="member">
										<label>
											单据明细
										</label>
									</view>
									<view class="goods">
										<!-- -->
										<view class="prolist" v-for="(item1,index1) in curFailSale.SALE6">
											<view class="h3">
												<label>
													<text>{{item1.NO}}</text>
													{{curFailSale.SALE1.KQXSTYPE=='SK'?"礼品卡售卡":"无"}}
												</label>
												<view class="shuls"><text>数量：{{item1.QTY}}</text></view>
											</view>
											<view class="otheinfo">
												<view>失败类型：{{curFailSale.SALE1.REASON=='JHF'?'激活失败':'充值失败'}}</view>
												<view class="quanhao">
													<label>开始券号：{{item1.KQIDS}}</label>
													<label>结束券号：{{item1.KQIDE}}<text>总价：￥{{item1.MYSTR}}</text></label>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="operat">
									<button class="btn btn-qx" @click="CloseRetry">关闭</button>
									<button class="btn btn-h" @click="ConfirmRetry">重试</button>
								</view>
							</view>
						</view>
						<NoData v-else></NoData>
					</view>
					<!-- 起始卡号 -->
					<CardNumEntry :show.sync="showCardNum" :ywtype="YWTYPE"></CardNumEntry>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="a-z">
							<image src="@/images/img2/shuakalr.png" mode="widthFix" @click="showCardNumFunc">
							</image>
						</view>
						<view class="a-z">
							<image src="@/images/cuxiaohd-dlu.png" mode="widthFix" @click="showDisc=true"></image>
						</view>
						<!-- <view class="a-z">
							<image src="@/images/img2/chikaren.png" mode="widthFix"></image>
						</view> -->
						<!-- <view class="a-z">
							<image src="@/images/img2/dhquannn.png" mode="widthFix"></image>
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 特殊折扣 -->
		<SpecialDisc v-if="showDisc" :zkdatas="ZKData" :product="SALE002"></SpecialDisc>
		<!-- 画布 -->
		<view class="canvasdiv" :style="'visibility:hidden;'">
			<canvas canvas-id="couponQrcode" class="canvas"
				:style="'border:0px solid; width:' + qrCodeWidth + 'px; height:' + qrCodeHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasLogo" class="canvas"
				:style="'border:0px solid; width:' + jpgWidth + 'px; height:' + jpgHeight + 'px;'"></canvas>
			<canvas canvas-id="canvasXPEWM" class="canvas"
				:style="'border:0px solid; width:' + canvasGZHWidth + 'px; height:' + canvasGZHHeight + 'px;'"></canvas>
		</view>
	</view>
</template>
<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue';

	import _card_coupon from "@/utils/sale/card_coupon.js";
	import _util from "@/utils/util.js";
	import _card_sale from "@/api/business/card_sale.js";
	import _saleClass from "@/utils/sale/saleClass.js";
	import _main from '@/api/business/main.js';
	import {
		CreateSaleOrder,
		PointUploadNew
	} from '@/bll/Common/bll.js';

	import common from '@/api/common.js';
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
					big_customer: false,
					enable_customer: true,
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
				FailSaleList: [], //激活、充值失败的单据集合
				curFailSale: {},
				add_class: 0,
				_sale2_count: 0
			}
		},
		created: async function() {
			that = this;
			this.FKDA_INFO = _util.getStorage('FKDA_INFO');
			console.warn("[Created]付款档案信息:", this.FKDA_INFO);

			let store = getApp().globalData.store;
			KQSale = new _card_coupon.InitKQSale(that, uni, store, "GiftCard_Active");
			// KQSale.InitData("礼品卡激活初始化", res => {
			// 	that.ShowCZGZ();
			// });
			that.SALE001 = _card_coupon.InitSale001(store, {
				XSTYPE: that.XSTYPE,
				BILL_TYPE: that.BILL_TYPE,
				KQXSTYPE: that.KQXSTYPE,
				CUID: that.KQXSTYPE,
				DKFID: store.DKFID
			});
			//初始化折扣数据
			that.ZKData = await _main.GetZKDatasAll(store.DKFID);
		},
		mounted() {
			//事件监听
			uni.$on("GetCardNums", that.GetCardNums);
			uni.$on("big-customer-close", async function(data) {
				console.log("[Created]大客户回调:", data);
				if (data.exists_credit) {
					that.BILL_TYPE = "Z112"; //启用赊销
					that.XSTYPE = '6';
				} else {
					that.BILL_TYPE = "Z111"; //不启用赊销	
					that.XSTYPE = '1';
				}
				that.SALE001.BILL_TYPE = that.BILL_TYPE;
				that.SALE001.XSTYPE = that.XSTYPE;
				if (data.DKFID) {
					that.SALE001.DKFID = data.DKFID;
				} else {
					that.SALE001.DKFID = '80000000';
					let store = _util.getStorage("store");
					store.DKFID = "80000000";
					store.DKFNAME = '默认大客户';
					_util.setStorage("store", store);
					uni.$emit('set-dkf', "默认大客户"); //通知外部 恢复默认大客户
				}
				that.ZKData = await _main.GetZKDatasAll(data.DKFID || '80000000');
				console.log("大客户折扣数据：", that.ZKData);
				if (that.SALE002.length > 0) {
					that.add_class = 1; //步骤设置
					//清除一下之前产生的促销和折扣
					_card_sale.ResetCXZK(that);
				}
			});
			uni.$on("close-tszk", that.CloseTSZK);
			uni.$on("ReturnSale", that.ClearSale);
		},
		watch: {
			SALE002: function(n, o) {
				console.log("SALE002发生变化(新)：", n);
				console.log("SALE002发生变化(旧)：", o);
				that.discCompute();
				that._sale2_count = n.length;
				that.add_class = (n.length == 0 ? 0 : 1); //步骤设置
			},
			CurZKDisc: function(n, o) {
				console.log("特殊折扣发生变化(新)：", n);
				console.log("特殊折扣发生变化(旧)：", o);
				that.discCompute();
			}
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
				total = _util.newFloat(total, 2);
				return total;
			}, //总折扣额 赠送金额和特殊折扣
			TotalDisc: function() {
				let total = 0;
				if (!that.SALE002 || Object.keys(that.SALE002).length == 0) {
					return total;
				}
				that.SALE002.map(r => {
					total += r.DISCRATE;
				})
				total = _util.newFloat(total, 2);
				return total;
			},

		},
		destroyed() {
			uni.$off("close-tszk");
			uni.$off("big-customer-close");
			uni.$off("GetCardNums");
			uni.$off("ReturnSale");
		},
		methods: {
			Touchlist: function(e) {
				var txtStyle = e.currentTarget.dataset.style;
				var index = e.currentTarget.dataset.index;
				var list = this.SALE002;
				console.log(txtStyle);
				if (txtStyle == "left:0") {
					txtStyle = "left:-50px";
					list[index].txtStyle = txtStyle;
					this.SALE002 = list
				} else {
					txtStyle = "left:0";
					list[index].txtStyle = txtStyle;
					this.SALE002 = list
				}
			},

			showCardNumFunc: function() {
				if (common.CheckSign()) {
					that.showCardNum = true;
				}
			},
			//组件卡号返回
			GetCardNums: function(e) {
				console.log("卡号返回事件2：", e);
				if (e) {
					that.showCardNum = false;
					that.begin_num = e.begin_num;
					that.end_num = e.end_num;
					if (e.type == 'Y') {
						that.MatchSP();
					}
				}
			},

			//商品状态和库存校验并并生成sale2,6
			MatchSP: function() {
				if (!this.begin_num) {
					_util.simpleMsg("卡号不为空");
				}
				if (!_util.IntervalOverlap(that.SALE002, that.begin_num, that.end_num))
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

				// sale6.txtStyle = "left:0"; //用于滑动删除事件
				console.log("生成的的sale6:", sale6);
				return sale6;
			},
			//sale对象属性合并
			CoverSale: function(sale, sale1) {
				try {
					if (Object.keys(sale1).length == 0 || Object.keys(sale).length == 0) {
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
							return r.STR2 != e.STR2;
						});
						that.SALE002 = arr;
						let arr1 = that.SALE006.filter(r => {
							return r.KQIDSTR != e.STR2;
						});
						that.SALE006 = arr1;
					}
				})
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
			//去支付
			ToPay: function() {
				if (that.SALE002.length == 0) {
					_util.simpleMsg("请录入有效卡号", true);
					return;
				}
				that.add_class = 2; //步骤设置
				console.log("sale2", that.SALE002);
				KQSale.ActiveApply(that.PackgeActivData(), res => {
					console.log("单卡激活校验结果：", res);
					if (res.code) {
						// that.discCompute() //特殊折扣 调整为sale2 变化后计算
						that.CalTNET(); //汇总计算SALE001的折扣值
						that.SKdiscCompute() //手工折扣
						console.log("单据类型：", that.BILL_TYPE);
						if (that.BILL_TYPE == 'Z112') { //卡券赊销
							//直接生成赊销销售单
							//调用激活
							//调用充值

							//赊销参数组装
							that.CreateSXSale001();
							let result = {
								code: true,
								data: {
									sale1_obj: that.SALE001,
									sale2_arr: that.SALE002,
									sale3_arr: that.SALE003,
								}
							};
							that.PayedResult(result);
						} else { //普通销售
							//进入支付 等待支付返回结果
							// that.PayParamAssemble();
							_card_sale.PayParamAssemble(that, that.PayedResult);
						}
					} else {
						_util.simpleMsg("校验失败：", res.msg, true);
					}
				});
			},

			//支付完成处理
			PayedResult: async function(result) {
				that.add_class = 3; //步骤设置
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
				that.SALE002 = (result.data.sale2_arr ?? []).map(sale2 => Object.cover(new _saleClass.sale002(),
					sale2));
				that.SALE003 = (result.data.sale3_arr ?? []).map(sale3 => Object.cover(new _saleClass.sale003(),
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
					}, res2 => {
						_util.simpleMsg(res2.code ? "激活成功" : "激活失败：" + res2.msg, !res2.code);
						//激活
						console.log("礼品卡激活结果：", res2);
						that.SALE001.STR1 = res2.code ? "success" : "fail";
						that.SALE001.CUID = that.SALE001.KQXSTYPE; //回调重写 
						if (!res2.code) { //激活失败要记录一下
							that.SALE001.YN_OK = "F";
							that.SALE001.REASON = "JHF"; //激活失败
						}
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
				}, resp => {
					//销售单数据处理成功，再调用打印
					if (resp.code)
						that.PrintBill(res.sale2, res.sale6);
					//重置销售单
					that.ResetSaleBill();
				})
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
						if (!obj) { //不存在则追加r
							console.log("5：", r);
							arr.push(r);
						} else {
							console.log("6：", obj);
							arr[index].QTY = _util.newFloat(obj.QTY + r.QTY, 2);
							arr[index].NET = _util.newFloat(obj.NET + r.NET, 2);
							arr[index].DISCRATE = _util.newFloat(obj.DISCRATE + r.DISCRATE, 2);
							arr[index].BILLDISC = _util.newFloat(obj.BILLDISC + r.BILLDISC, 2);
							arr[index].BZDISC = _util.newFloat(obj.BZDISC + r.BZDISC, 2);
							arr[index].LSDISC = _util.newFloat(obj.LSDISC + r.LSDISC, 2);
							arr[index].TPDISC = _util.newFloat(obj.TPDISC + r.TPDISC, 2);
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
				let printerPram = {
					"PRINTNUM": 1,
					"XSTYPE": "LPKJH",
					"ISFP": "Y",
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
				await that.$refs.printerPage.sksqBluePrinter(that.SALE001, sale2, arr3, sale6, printerPram);
			},
			//重置本次销售单
			ResetSaleBill: function() {
				that.add_class = 0; //步骤设置
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
				that.CurZKDisc = {};
				let store = _util.getStorage("store");
				store.DKFID = "80000000";
				store.DKFNAME = '默认大客户';
				_util.setStorage("store", store);
				uni.$emit('set-dkf', "默认大客户"); //通知外部 恢复默认大客户
				console.log("单据重置成功")
			},
			//创建sxsale1
			CreateSXSale001: function() {
				console.log("进入赊销组装：");
				//生成赊销单
				that.SXSALE001 = Object.cover(new _saleClass.sxsale001(), that.SALE001);
				that.SXSALE001.SX_STATUS = 1;
				that.SXSALE001.DKFNAME = that.store.DKFNAME; //赊销追加一下 大客户名称
				let sale3 = Object.cover(new _saleClass.sale003(), that.SALE001);
				sale3.FKID = "ZG01";
				sale3.AMT = that.SALE001.TNET;
				that.SALE003.push(sale3);
				console.log("赊销单组装数据sx1：", that.SXSALE001);
				console.log("赊销单组装数据s3：", that.SALE003);
			},
			//特殊折扣关闭回调
			CloseTSZK: function(data) {
				that.showDisc = false;
				console.log("特殊折扣返回的商品数据：", data); //返回折扣类型 再次根据商品匹配一下折扣
				let obj = {};
				if (data == "NO") { //清除折扣
					obj = {};
				} else {
					obj = {
						ZKType: data,
						ZKData: that.ZKData
					};
					that.add_class = 1; //步骤设置
				}
				that.CurZKDisc = obj;
				//清除一下之前产生的促销和折扣
				_card_sale.ResetCXZK(that);
			},
			//使用特殊折扣进行计算
			discCompute: function() {
				// 计算商品的折扣值
				let res = _main.MatchZKDatas(that.CurZKDisc, that.SALE002);
				that.SALE002 = res.sale2;
				// that.ZKHDArr = res.zkrule;
				console.log("002增加折扣后的新数据：", that.SALE002);
			},
			//清空数据
			ClearSale: function() {
				_util.simpleModal("提示", "是否确认清空当前数据？", res => {
					if (res) {
						that.ResetSaleBill();
						_util.simpleMsg("清空成功！");
					}
				})
			},
			//切换业务类型
			ChangeYWTYPE: function(e) {
				if (that.YWTYPE != e) {
					if (that.SALE002.length > 0) {
						_util.simpleMsg("已录入商品暂无法切换");
						return;
					}
					_util.simpleModal("提示", "是否确认切换业务类型？", res => {
						if (res) {
							that.YWTYPE = e;
							console.log("切换后的业务：", e);
							KQSale = new _card_coupon.InitKQSale(that, uni, that.store, e);
							KQSale.InitData("礼品卡业务切换后初始化", res => {
								if (e == 'GiftCard_Retry')
									that.GetFailOrder();
								else {
									console.log("业务类型已切换：", that.SALE001)
									that.KQXSTYPE = "SK";
									that.ResetSaleBill();
								}
							});
						}
					})
				}
			},
			//获取充值失败的订单
			GetFailOrder: function() {
				_card_sale.GetFailOrder({
					khid: that.store.KHID,
					kqtype: "'SK'"
				}, res => {
					if (res.code) {
						let data = JSON.parse(res.data);
						that.FailSaleList = _card_sale.FormatSale(data);
						if (that.FailSaleList.length > 0)
							that.curFailSale = that.FailSaleList[0];
					} else {
						that.FailSaleList = [];
						that.curFailSale = {};
						_util.simpleMsg("暂无数据", true);
					}
				})
			},
			//关闭重试
			CloseRetry: function() {
				that.ChangeYWTYPE("GiftCard_Active");
			},
			//确定重试
			ConfirmRetry: function() {
				_util.simpleModal("提示", "是否确认进行重试", res => {
					if (res) {
						let curSale = that.curFailSale;
						let str1, reason, yn_ok;
						if (curSale.SALE1.REASON == 'JHF') { //激活失败
							//直接激活

							//发起激活
							KQSale.ActiveConfirm({
								salebill: curSale.SALE1.BILL,
								channel: "ZC007"
							}, res2 => {
								_util.simpleMsg(res2.code ? "激活成功" : "激活失败：" + res2.msg, !res2.code);
								//激活
								console.log("礼品卡激活结果：", res2);
								str1 = res2.code ? "success" : "fail";
								if (res2.code) { //激活成功
									yn_ok = "X";
									reason = ""; //激活成功
								} else { //激活失败 直接提交单据
									yn_ok = "F";
									reason = "JHF"; //激活失败
								}
								KQSale.Completed({
									bill: curSale.SALE1.BILL,
									str1,
									reason,
									yn_ok
								}, res => {
									console.log("销售单更新结果：", res);
									that.GetFailOrder();
								});
							})
						} else {
							_util.simpleMsg("礼品卡业务暂不支持该操作");
						}
					}
				})
			},

		}
	}
</script>

<style>

</style>
