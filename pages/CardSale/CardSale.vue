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
							<view class="tab " @click="ChangeYWTYPE('VIPCard_Active')"
								:class="YWTYPE=='VIPCard_Active'?'curr':''">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
									<text>VIP售卡充值</text>
								</label>
							</view>
							<view class="tab" @click="ChangeYWTYPE('VIPCard_Recharge')"
								:class="YWTYPE=='VIPCard_Recharge'?'curr':''">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
									<text>VIP卡充值</text>
								</label>
							</view>
						</view>
						<view class="ckr">“持卡人姓名”：877888999</view>
					</view>

					<view class="module" v-if="SALE002.length>0">
						<view class="hh">充值金额 <em></em></view>
						<view class="jinelist">
							<view class="li-je " v-for="(item) in CZGZMX" @click="ChooseCZGZ(item)"
								:class="CurCZGZ.CZNET==item.CZNET?'curr':''">
								<label>¥{{item.CZNET}}</label>
								<!-- <text>20元为代金券</text> -->
								<em>送￥{{item.ZSNET}}</em>
							</view>
						</view>
					</view>
					<view class="module" style="height: 66%;">
						<view class="hh">待售详情 <em></em></view>
						<!-- 没刷卡时显示 -->
						<view class="swipetip" v-if="SALE002.length==0">
							<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>请先刷卡录入</text>
						</view>
						<!-- 刷卡后显示卡列表 @touchstart="touchS" @touchmove="touchM" @touchend="touchE"-->
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
										<label><em>●</em><text>总折扣：</text>{{item.DISCRATE}}</label>
										<label><em>●</em><text>标准折扣：</text>{{item.BZDISC}}</label>
										<label><em>●</em><text>临时折扣：</text>{{item.LSDISC}}</label>
										<label><em>●</em><text>特批折扣：</text>{{item.TPDISC}}</label>
									</view>
								</view>
								<view class="touch-list list-delete" @click="RemoveSP(item)">
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
					<!-- 起始卡号 -->
					<CardNumEntry :show.sync="showCardNum" :ywtype="YWTYPE"></CardNumEntry>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="a-z">
							<image src="../../images/img2/shuakalr.png" mode="widthFix" @click="showCardNum=true">
							</image>
						</view>
						<view class="a-z">
							<image src="../../images/cuxiaohd-dlu.png" mode="widthFix" @click="showDisc=true"></image>
						</view>
						<view class="a-z">
							<image src="@/images/img2/chikaren.png" mode="widthFix"></image>
						</view>


					</view>
				</view>
			</view>
		</view>
		<!-- 持卡人信息 -->
		<chikaren :show.sync="showCardRen"></chikaren>
		<!-- 特殊折扣 -->
		<SpecialDisc v-if="showDisc" :zkdatas="ZKData" :product="SALE002">
		</SpecialDisc>
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
	import Pagekq from '@/pages/Home/Component/Pagekq.vue';
	import chikaren from '@/components/chikaren/chikaren.vue';

	import _card_coupon from "@/utils/sale/card_coupon.js";
	import util from "@/utils/util.js";
	import _util from "@/utils/util.js";
	import _card_sale from "@/api/business/card_sale.js";
	import _saleClass from "@/utils/sale/saleClass.js";
	import _main from '@/api/business/main.js';
	import {
		CreateSaleOrder,
		PointUploadNew
	} from '@/bll/Common/bll.js';

	import _common from '@/api/common.js';
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
				SALE2: [], //支付前拷贝使用
				SALE003: [],
				SALE006: [],
				SXSALE001: [],
				showCardNum: false,
				showCardRen: false,
				swipetip: false,
				showDisc: false,
				ZKData: [],
				BILL_TYPE: "Z111", //Z112
				XSTYPE: "1",
				KQXSTYPE: "SKCZ",
				Amount: 0, //VIP卡余额
				view: {
					big_customer: false,
					enable_customer: true,
				},
				YWTYPE: "VIPCard_Active", //业务类型 默认为VIP 售卡充值
				CurZKDisc: {}, //特殊折扣类型
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 256, //二维码宽
				qrCodeHeight: 256, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				FKDA_INFO: [],
				delBtnWidth: 50, //删除按钮宽度单位（rpx）
				startX: '',
				canComputed: true, //定义监听
			}
		},
		onReady: function() {
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
		created: async function() {
			that = this;

			let store = getApp().globalData.store;
			KQSale = new _card_coupon.InitKQSale(that, uni, store, "VIPCard_Active");
			KQSale.InitData("卡销售初始化", res => {
				that.ShowCZGZ();
			});
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
				} else {
					that.BILL_TYPE = "Z111"; //不启用赊销	
				}
				that.SALE001.BILL_TYPE = that.BILL_TYPE;
				if (data.DKFID) {
					that.SALE001.DKFID = data.DKFID;
					that.ZKData = await _main.GetZKDatasAll(data.DKFID);
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
			},
			CurZKDisc: function(n, o) {
				console.log("特殊折扣发生变化(新)：", n);
				console.log("特殊折扣发生变化(旧)：", o);
				that.discCompute();
			}
		},
		destroyed() {
			uni.$off("GetCardNums");
			uni.$off("big-customer-close");
			uni.$off("close-tszk");
			uni.$off("ReturnSale");
		},
		computed: {
			//商品总数量
			TotalNum: function() {
				let total = 0;
				that.SALE002.map(r => {
					total += r.QTY;
				})
				return total;
			},
			//商品总金额 
			TotalNet: function() {
				let total = 0;
				if (!that.SALE002 || Object.keys(that.SALE002).length == 0) {
					return total;
				}
				that.SALE002.map(r => {
					total += r.NET;
				})
				// total = _util.newFloat(Number(that.SALE001.TNET) + Number(that.SALE001.BILLDISC));
				return total;
			},
			//总折扣额 赠送金额和特殊折扣
			TotalDisc: function() {
				let total = 0;
				if (!that.SALE002 || Object.keys(that.SALE002).length == 0) {
					return total;
				}
				that.SALE002.map(r => {
					total += _util.newFloat(r.DISCRATE + (r.ZSNET || 0), 2);
				})
				return total;
			},
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
					// console.log(list[index].txtStyle);
					this.SALE002 = list
				}

			},

			//组件卡号返回
			GetCardNums: function(e) {
				console.log("卡号返回事件1：", e);
				if (e) {
					that.showCardNum = false;
					that.begin_num = e.begin_num;
					that.end_num = e.end_num;
					if (e.type == 'Y') {
						that.MatchSP();
					} else {

					}
				}
			},
			//商品状态和库存校验并并生成sale2,6
			MatchSP: function() {
				if (!this.begin_num) {
					_util.simpleMsg("卡号不为空");
				}
				KQSale.QueryInfo({
					card_num: that.begin_num
				}, res => {
					console.log(res);
					if (KQSale.CheckStatus(res)) {
						KQSale.CheckStock({
							begin_num: that.begin_num,
							end_num: that.begin_num,
							material_id: res.data.materielId,
							khid: that.store.KHID
						}, async res1 => {
							console.log("库存校验结果：", res1);
							if (!res1.code) {
								_util.simpleMsg(res1.msg, true);
								return;
							}
							that.Amount = _util.newFloat(res.data.balance, 2); //卡余额
							let spObj = await KQSale.MatchSP(res.data.materielId);
							if (spObj) {
								let arr = that.SALE002.filter(r => {
									return r.SPID == spObj.SPID;
								});
								if (arr.length == 0) {
									console.log("开始进入合并：", spObj);
									spObj = that.CoverSale(spObj, that.SALE001);
									console.log("属性合并后的对象：", spObj);
									if (spObj) {
										spObj.begin_num = that.begin_num;
										spObj.end_num = that.end_num;
										that.SALE002.push(spObj);
										let sale6 = that.CreateSale006({
											begin_num: that.begin_num,
											end_num: that.end_num
										}, spObj, that.SALE001);
										that.SALE006.push(sale6);
										console.log("sale2", that.SALE002);
										console.log("sale6", that.SALE006);
									}
								} else {
									_util.simpleMsg("已添加该商品", "none");
								}
							} else {
								_util.simpleMsg("暂未匹配到商品信息", "none");
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
				sale6.QTY = sale2.QTY;
				sale6.NO = sale2.NO;
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
			//展示充值规则
			ShowCZGZ: function() {
				let czgz = _util.getStorage("KCZGZMX");
				if (czgz) {
					that.showCZGZ = true;
					that.CZGZMX = czgz.map(r => {
						return {
							CZNET: r.CZNET,
							ZSNET: r.ZSNET
						}
					})
				}
			},
			//充值规则选择事件
			ChooseCZGZ: function(e) {
				let amount = e.CZNET + e.ZSNET + that.Amount;
				console.log("充值金额:", amount);
				if (_util.newFloat(amount) > 5000) {
					_util.simpleMsg("充值后卡余额大于 5000￥，更换充值金额；");
					return;
				}
				that.CurCZGZ = e;
				console.log("选择得规则：", that.CurCZGZ);
				let s2 = JSON.parse(JSON.stringify(that.SALE002));
				let s6 = JSON.parse(JSON.stringify(that.SALE006));
				s2.map(r => {
					r.PRICE = _util.newFloat(e.CZNET, 2);
					r.OPRICE = r.PRICE;
					// r.OPRICE = _util.newFloat(e.CZNET + e.ZSNET, 2);
					// r.BZDISC = _util.newFloat(e.ZSNET, 2);
					// r.BILLDISC = _util.newFloat(e.ZSNET, 2);
					// r.DISCRATE = _util.newFloat(e.ZSNET, 2);
					r.NET = _util.newFloat(Number(r.PRICE) * Number(r.QTY), 2);
					// r.ONET = r.NET;
					r.ZSNET = _util.newFloat(e.ZSNET, 2);
				})
				s6.map(r => {
					let obj = s2.find(r1 => {
						return r1.SPID == r.SPID
					});
					if (obj)
						r.MYSTR = obj.PRICE;
				})
				that.SALE002 = s2;
				that.SALE006 = s6;
				console.log("s1:", that.SALE001);
				console.log("s2:", that.SALE002);
				console.log("s6:", that.SALE006);
			},
			//待售列表清除
			RemoveSP: function(e) {
				_util.simpleModal("提示", "是否确认删除此项？", res => {
					if (res) {
						let spid = e.SPID;
						let arr = that.SALE002.filter(r => {
							return r.SPID != e.SPID
						});
						that.SALE002 = arr;
						let arr1 = that.SALE006.filter(r => {
							return r.SPID != e.SPID
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
				that.SALE2.map(r => {
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
				that.SALE001.TLINE = that.SALE2.length; //这个是存商品行
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
			//去支付
			ToPay: function() {
				if (!that.CurCZGZ || Object.keys(that.CurCZGZ).length == 0) {
					_util.simpleMsg("请选择充值规则", true)
					return;
				}
				if (that.SALE002.length == 0) {
					_util.simpleMsg("请录入有效卡号", true);
					return;
				}
				KQSale.ActiveApply({
					salebill: that.SALE001.BILL,
					material_id: that.SALE002[0].SPID,
					channel: "ZC007",
					khid: that.SALE001.KHID,
					card_num: that.begin_num,
				}, res => {
					console.log("单卡激活校验结果：", res);
					if (res.code) {
						// that.discCompute() //特殊折扣 监听计算
						that.Sale2AddDisc(); //追加一下赠送金额 拷贝一下sale002 (SALE002)
						that.CalTNET(); //因为会产生特殊折扣 所以重新计算 (SALE001)
						that.SKdiscCompute() //手工折扣 (SALE001)
						console.log("sale1", that.SALE001);
						console.log("sale2", that.SALE2);
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
									sale2_arr: that.SALE2,
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
				that.SALE2 = (result.data.sale2_arr ?? []).map(sale2 => Object.cover(new _saleClass.sale002(),
					sale2));
				that.SALE003 = (result.data.sale3_arr ?? []).map(sale3 => Object.cover(new _saleClass.sale003(),
					sale3));
				console.log("支付后返回结果：", that.SALE001);
				if (result.code) {
					console.log("准备激活：", that.SALE2);
					//手工折扣额分摊
					if (that.SALE001.ROUND > 0) {
						that.SALE2 = _main.ManualDiscount(that.SALE001, that.SALE2);
						console.log("[PayedResult]分摊后的商品信息：", that.SALE2);
					}
					//发起激活
					KQSale.ActiveConfirm({
						salebill: that.SALE001.BILL,
						material_id: that.SALE2[0].SPID,
						amount: _util.newFloat(that.CurCZGZ.CZNET + that.CurCZGZ.ZSNET),
						dis_amount: _util.newFloat(that.CurCZGZ.ZSNET),
						channel: "ZC007",
						app_key: "POS",
						khid: that.store.KHID,
						kh_name: that.store.NAME,
						ryid: that.store.RYID,
						ry_name: that.store.RYNAME,
						dqid: that.store.DQID,
						dq_name: that.store.DQNAME,
						flag: 2,
						card_num: that.SALE006[0].KQIDS
					}, res2 => {
						_util.simpleMsg(res2.code ? "激活成功" : "激活失败：" + res2.msg, !res2.code);
						//激活
						console.log("VIP单卡激活结果：", res2);
						that.SALE001.STR1 = res2.code ? "success" : "fail";
						that.SALE001.CUID = that.SALE001.KQXSTYPE; //回调重写 
						if (res2.code) { //激活成功
							//发起充值
							KQSale.Recharge({
								salebill: that.SALE001.BILL,
								amount: _util.newFloat(that.CurCZGZ.CZNET + that.CurCZGZ.ZSNET),
								dis_amount: _util.newFloat(that.CurCZGZ.ZSNET),
								khid: that.SALE001.KHID,
								kh_name: that.store.NAME,
								ryid: that.store.RYID,
								ry_name: that.store.RYNAME,
								card_num: that.SALE006[0].KQIDS
							}, res3 => {
								//充值
								console.log("VIP单卡充值结果：", res3);
								_util.simpleMsg(res3.code ? "充值成功！" : "充值失败：" + res3.msg, !res3
									.code);
								if (!res3.code) {
									that.SALE001.YN_OK = "F";
								}
								that.SaleCompleted();
							});
						} else { //激活失败 直接提交单据
							that.SALE001.YN_OK = "F";
							that.SaleCompleted();
						}
						//重置销售单
						// that.ResetSaleBill();
					})
				} else {
					_util.simpleMsg(result.msg, true);
				}
			},
			//完成销售单
			SaleCompleted: async function() {
				console.log("生成销售单");
				//激活成功-充值成功（与否）均生成销售单
				await KQSale.Completed({
					SALE001: that.SALE001,
					SALE002: that.SALE2,
					SALE003: that.SALE003,
					SALE006: that.SALE006,
					SXSALE001: that.SXSALE001,
				})
				await that.PrintBill();
				//重置销售单
				that.ResetSaleBill();
			},
			PrintBill: async function() {
				console.log("调用打印");
				//调用打印
				let printerPram = {
					"PRINTNUM": 1,
					"XSTYPE": that.KQXSTYPE,
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
				await that.$refs.printerPage.sksqBluePrinter(that.SALE001, that.SALE2, arr3, that.SALE006,
					printerPram);
			},
			//sale2追加赠送金额
			Sale2AddDisc: function() {
				let sale2 = JSON.parse(JSON.stringify(that.SALE002));
				sale2.map(e => {
					let zsnet = e.ZSNET || 0;
					console.log("赠送金额：", zsnet);
					e.OPRICE = _util.newFloat(e.OPRICE + zsnet, 2);
					e.BZDISC = _util.newFloat(e.BZDISC + zsnet, 2);
					e.BILLDISC = _util.newFloat(e.BILLDISC + zsnet, 2);
					e.DISCRATE = _util.newFloat(e.DISCRATE + zsnet, 2);
				})
				// that.SALE002 = sale2;
				that.SALE2 = sale2;
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
				that.SALE2 = [];
				that.SALE003 = [];
				that.SALE006 = [];
				that.SXSALE001 = [];
				that.CurCZGZ = {};
				that.Amount = 0;
				console.log("单据重置成功:", that.SALE001);
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
							KQSale = new _card_coupon.InitKQSale(that, uni, that.store, e);
							that.KQXSTYPE = e == "VIPCard_Active" ? "SKCZ" : "CZ";
							that.ResetSaleBill();
							console.log("业务类型已切换：", that.SALE001)
						}
					})
				}
			}, //特殊折扣关闭回调
			CloseTSZK: function(data) {
				that.showDisc = false;
				console.log("特殊折扣返回的商品数据：", data); //返回折扣类型 再次根据商品匹配一下折扣
				let obj = {};
				if (data == "NO") { //清除折扣
					obj = {};
					//清除一下之前产生的促销和折扣
					_card_sale.ResetCXZK(that);
				} else {
					obj = {
						ZKType: data,
						ZKData: that.ZKData
					};
				}
				that.CurZKDisc = obj;
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
					}
				})
			}
		}
	}
</script>

<style>

</style>
