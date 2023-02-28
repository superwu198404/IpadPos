<!-- <template>
	<view style="border: 1px solid red;height: 100%;width: 100%;">
		<p>卡销售：</p>
		起始卡号：<input type="text" v-model="begin_num" />
		结束卡号：<input type="text" v-model="end_num" />
		<button @click="Confirm">确认</button>
		<view>
			<p v-for="(item) in SALE002Arr">{{item.STR1}}-{{item.SPID}}-{{item.PLID}}-{{item.UNIT}}</p>
			<p v-for="(item) in CZGZMX" @click="ChooseCZGZ(item)">充{{item.CZNET}}元，送{{item.ZSNET}}元.</p>
		</view>
	</view>
</template> -->
<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>

<template>
	<view class="content">
		<!-- <menu_page :menuIndex="7"></menu_page> -->
		<view class="right">
			<!-- 顶部导航栏 -->
			<Head></Head>
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
							<image class="bgs" src="@/images/img2/tab-zuo.png"></image>
							<label><image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image><text>VIP售卡充值</text></label>
						</view>
						<view class="tab">
							<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>VIP售卡充值
						</view>
						</view>
						<view class="ckr">“持卡人姓名”：877888999</view>
					</view>

					<view class="module">
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
						<view class="swipetip" v-if="swipetip">
							<image src="@/images/img2/tip-skaluru.png" mode="widthFix"></image>
							<text>请先刷卡录入</text>
						</view>
						<!-- 刷卡后显示卡列表 -->
						<view class="cardlist" v-for="(item) in SALE002">
							<view class="ulli">
								<image class="bgs" src="@/images/quan-bg.png" mode="widthFix"></image>
								<view class="h6">
									<label>￥{{item.PRICE}}<text>/{{item.QTY}}张</text></label>
									<view class="zje">
										<view><text>总金额</text>￥{{item.NET}}</view>
										<button>
											<image src="@/images/img2/ka-shanchu.png"></image>
										</button>
									</view>
								</view>
								<view class="card-num">
									<label>始：<text>ID4332143223456767565</text></label>
									<label>终：<text>ID4332143223456767575</text></label>
								</view>
								<view class="statistic">
									<label><em>●</em><text>总折扣：</text>567</label>
									<label><em>●</em><text>默认折扣：</text>5</label>
									<label><em>●</em><text>标准折扣：</text>54</label>
									<label><em>●</em><text>特批折扣：</text>5</label>
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
						<button class="btn">确认支付</button>
					</view>
					<!-- 起始卡号 -->
					<CardNumEntry v-if="showCardNum"></CardNumEntry>
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
						<view class="a-z kaquan">
							<image src="@/images/img2/quanquan.png" mode="widthFix"></image>
							<!-- 售 券 -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 特殊折扣 -->
		<SpecialDisc v-if="showDisc" :zkdatas="ZKData" :product="SALE002">
		</SpecialDisc>

	</view>
</template>
<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue'

	import _card_coupon from "@/utils/sale/card_coupon.js";
	import util from "@/utils/util.js";
	import _util from "@/utils/util.js";
	import _card_sale from "@/api/business/card_sale.js";
	import _saleClass from "@/utils/sale/saleClass.js";

	var that, KQSale;
	export default {
		name: "CardSale",
		components: {
			Head
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
				showCardNum: true,
				swipetip: false,
				showDisc: false,
				ZKData: [],
				BIll_TYPE: "Z111",
				XSTYPE: "1",
				KQXSTYPE: "SK"
			}
		},
		created: function() {
			that = this;
			//事件监听
			uni.$off("GetCardNums");
			uni.$on("GetCardNums", that.GetCardNums);
			KQSale = new _card_coupon.InitKQSale(that, uni, getApp().globalData.store, "VIPCard_Active");
			KQSale.InitData("卡销售初始化", res => {
				that.ShowCZGZ();
			});
			// console.log("数据测试：",getApp().globalData.store);
			that.SALE001 = _card_coupon.InitSale001(getApp().globalData.store, {
				BIll_TYPE: that.BIll_TYPE,
				XSTYPE: that.XSTYPE,
				KQXSTYPE: that.KQXSTYPE,
				CUID: that.KQXSTYPE,
			});
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
			//商品总金额 包含折扣
			TotalNet: function() {
				let total = 0;
				console.log("sale001", that.SALE001);
				if (!that.SALE001 || Object.keys(that.SALE001).length == 0) {
					return total;
				}
				total = _util.newFloat(Number(that.SALE001.TNET) + Number(that.SALE001.BILLDISC));
				return total;
			},
		},
		methods: {
			//卡号返回
			GetCardNums: function(e) {
				console.log("卡号返回事件：", e);
				if (e) {
					that.showCardNum = false;
					that.begin_num = e.begin_num;
					that.end_num = e.end_num;
					if (e.type == 'Y') {
						that.Confirm();
					} else {

					}
				}
			},
			Confirm: function() {
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
							if (res1.data[0].CARDNUM == "0") {
								_util.simpleMsg("卡库存不在当前门店", "none");
								return;
							}
							let spObj = await KQSale.MatchSP(res.data.materielId);
							if (spObj) {
								let arr = that.SALE002.filter(r => {
									return r.SPID == spObj.SPID;
								});
								if (arr.length == 0) {
									spObj = that.CoverSale(spObj, that.SALE001);
									console.log("属性合并后的对象：", spObj);
									that.SALE002.push(spObj);
								} else {
									_util.simpleMsg("已添加该商品", "none");
								}
							}
						})
					}
				})
			},
			//sale对象属性合并
			CoverSale: function(sale, sale1) {
				try {
					if (!sale1 || !sale) {
						return sale;
					}
					let arr = [
						KHID,
						POSID,
						RYID,
						BILL,
						KCDID,
						GCID,
						DPID,
						SALEDATE,
						SALETIME,
						CLTIME,
						YN_OK,
						YN_SC,
						YAER,
						MONTH,
						WEEK,
						TIME,
						DKFID
					];
					console.log("开始循环：", arr);
					arr.map(r => {
						console.log("当前属性：", r);
						console.log("当前属性1：", sale1[r]);
						console.log("当前属性2：", sale.hasOwnProperty(r));
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
				if (e)
					that.CurCZGZ = e;
				console.log("选择得规则：", that.CurCZGZ);
				let s2 = JSON.parse(JSON.stringify(that.SALE002));

				s2.map(r => {
					r.PRICE = _util.newFloat(e.CZNET, 2);
					r.CXDISC = _util.newFloat(e.ZSNET, 2);
					r.NET = _util.newFloat(Number(r.PRICE) * Number(r.QTY), 2);
				})
				that.SALE002 = s2;
				that.CalTNET();
			},
			//根据002 计算001 金额等字段
			CalTNET: function() {
				let tnet = 0,
					tcxdisc = 0,
					tbzdisc = 0,
					ttpdisc = 0
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
				that.SALE001.BILLDISC = _util.newFloat(tcxdisc + tbadisc + ttpdisc + tlsdisc);
				that.SALE001.TDISC = that.SALE001.BILLDISC;
				that.SALE001.TLINE = that.SALE002.length; //这个是存商品行
			}
		}
	}
</script>

<style>

</style>
