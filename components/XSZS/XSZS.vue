<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>
<template>
	<!-- 辅助促销数据 -->
	<!-- ready 为 false 时整块（含遮罩）不渲染：数据未返回前不画空壳，避免"先开后关"的闪烁 -->
	<view class="xszs-wrap" v-if="ready">
		<view class="xszs-mask"></view>
		<view class="meminfo" style="padding-top: 30px;">
			<view class="meminfo">
				<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
				<view>
					<view class="member">
						<label class="h9">选择赠品</label>
						<button @click="Close(false,'Cancel')">×</button>
					</view>
					<view class="shoppbag">
						<!-- 赠积分区：有会员才渲染，只能取 0 或最大值 -->
						<block v-if="JFDatas.length > 0">
							<view class="zs-group">赠积分</view>
							<view class="baglist" :class="{curr: Number(item.BQTY) > 0}" v-for="(item,index) in JFDatas"
								:key="'jf'+index">
								<view class="bag">
									<text class="h8"><text>赠送积分</text></text>
									<label><text>说明</text>最多赠送{{item.ZQTY}}分，0 或 {{item.ZQTY}} 分二选一</label>
								</view>
								<view class="quantit">
									<text>积分</text>
									<view class="nums">
										<text @click="SwitchJF(item,false)">-</text>
										<input disabled="true" v-model="item.BQTY" />
										<text @click="SwitchJF(item,true)">+</text>
									</view>
								</view>
							</view>
						</block>
						<!-- 赠商品区 -->
						<block v-if="ZSDatas.length > 0">
							<view class="zs-group" v-if="JFDatas.length > 0">赠商品</view>
							<view class="baglist" :class="{curr: Number(item.BQTY) > 0}" v-for="(item,index) in ZSDatas"
								:key="'zs'+index">
								<view class="bag">
									<text class="h8">{{item.SNAME}}</text>
									<label><text>说明</text>最多可选{{item.ZQTY}}{{item.UNIT}}</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text @click="Calculate(item,'-')">-</text>
										<input disabled="true" v-model="item.BQTY" />
										<text @click="Calculate(item,'+')">+</text>
									</view>
								</view>
							</view>
						</block>
					</view>
					<!-- <view class="confirm">
							<button class="btn" @click="Confirm()">确 认</button>
							<button class="btn btn-xk" @click="Close(false,'Skip')">跳 过</button>
						</view> -->
				</view>
			</view>
			<view class="affirm">
				<button class="btn btn-hk" @click="Close(false,'Cancel')">取消</button>
				<button class="btn" @click="Confirm()">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _login from '@/api/business/login.js';
	import _main from '@/api/business/main.js';
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import * as _gift from '@/api/hy/gift_point.js';

	var that;
	export default {
		name: "XSZS",
		props: {
			_sale2: Array,
			_sale: Object,
			_mainSale: Object
		},
		data() {
			return {
				XSZSDatas: [],
				XSZSDatasOld: [],
				JFDatas: [], //赠积分行（YNJF='Y'）
				ZSDatas: [], //赠商品行
				JFLocked: false, //积分已选（>0）时商品行禁用
				JFSubmitting: false, //赠积分提交中，防重复点击把加赠接口调两遍
				ready: false, //数据查询完成前不渲染，避免空壳闪现
				hyid: "", //会员号快照（created 里在 resetSaleBill 之前取）
				store: {},
				BILL: ""
			}
		},
		created: async function() {
			that = this;
			console.log("传入的_sale2：", that._sale2);
			var store = util.getStorage("store");
			console.log("store：", store);
			that.store = store;
			//【关键】以下快照必须在任何 await 之前读完。
			//弹窗是在 PayedResult 的 $saleFinishing 里打开的，而该函数随后还有 await CreateSaleOrder，
			//之后会调用 resetSaleBill（this.sale001 = {} 且 this.HY.cval = {}）。
			//若把读取放在 await 之后，sale001 与 HY 已经被清空，必然读不到会员号。
			let snap = {
				bill: (that._sale2 && that._sale2[0] && that._sale2[0].BILL) || (that._sale && that._sale.BILL) ||
					"",
				clickType: that._mainSale && that._mainSale.current_type &&
					that._mainSale.current_type.clickType,
				hyid: (that._mainSale && that._mainSale.HY && that._mainSale.HY.cval &&
						that._mainSale.HY.cval.hyId) ||
					(that._sale && that._sale.CUID) ||
					(util.getStorage("hyinfo") || {}).hyId ||
					""
			};
			that.BILL = snap.bill;
			//赠积分只在 销售 / 预定提取 两种模式生效(赊销等虽可录会员但不参与)
			let jfEnabled = (snap.clickType === 'sale' || snap.clickType === 'sale_reserve_extract');
			let hasHy = jfEnabled && !!snap.hyid;
			that.hyid = snap.hyid || "";
			console.log("[XSZS]快照(await之前):", {
				"BILL": snap.bill,
				"current_type.clickType": snap.clickType,
				"jfEnabled": jfEnabled,
				"hyid": snap.hyid,
				"hasHy": hasHy
			});
			if (that._sale2 && that._sale2.length > 0) {
				let plids = that._sale2.map(r => r.PLID);
				let spids = that._sale2.map(r => r.SPID);
				let datas = null;
				let queryErr = null;
				//查询期间给可见反馈：收银员需要知道赠品环节正在处理
				uni.showLoading({
					title: "赠品查询中",
					mask: true
				});
				try {
					datas = await _take.GetZSData(store.DQID, store.KHZID, store.KHID, store.SYBID, plids.join(
						"','"), spids.join("','"));
				} catch (e) {
					queryErr = e;
					console.log("[XSZS]赠品规则查询异常:", e);
				} finally {
					uni.hideLoading();
				}
				if (queryErr) {
					util.simpleMsg("赠品查询失败", true);
					that.Close(false, "Error");
					return;
				}
				that.XSZSDatas = datas || [];

				console.log("XSZSDatas:", that.XSZSDatas);
				//无会员时整条积分规则剔除,行为与改造前一致
				that.XSZSDatas = that.XSZSDatas.filter(function(r) {
					return hasHy || String(r.YNJF || 'N').toUpperCase() !== 'Y';
				});
				that.JFDatas = that.XSZSDatas.filter(r => String(r.YNJF || 'N').toUpperCase() === 'Y');
				that.ZSDatas = that.XSZSDatas.filter(r => String(r.YNJF || 'N').toUpperCase() !== 'Y');
				//积分行初值取最大值(SQL 已给),同步锁定状态
				that.JFLocked = that.JFDatas.some(r => Number(r.BQTY) > 0);
				that.ApplyJFLock();
				if (that.XSZSDatas.length == 0) { //无赠品：提示后关闭,ready 保持 false 不绘制
					util.simpleMsg("本单暂无赠品", "none");
					that.Close(false, "No Data");
					return;
				}
				that.ready = true; //数据齐了一次性绘制
			} else {
				//购物车已空(单子已收尾),没有可展示的数据,直接关闭
				that.Close(false, "No Data");
			}
			that.XSZSDatasOld = ""; // JSON.parse(JSON.stringify(that._XSZSDatas.oval));

		},
		methods: {
			//积分切换:只在 0 与最大值之间二选一
			SwitchJF: function(item, up) {
				let max = Number(item.ZQTY) || 0;
				if (!max) { //无最大值时不允许赠送
					item.BQTY = 0;
					util.simpleMsg("该积分规则未配置赠送上限", "none");
					return;
				}
				let cur = Number(item.BQTY) || 0;
				//边界提示与赠商品行 Calculate 保持一致
				if (up) {
					if (cur >= max) {
						item.BQTY = max;
						util.simpleMsg("不能再多了", true);
						return;
					}
					//加积分则清空商品(二选一)
					that.ZSDatas.forEach(r => r.BQTY = 0);
					item.BQTY = max;
					that.JFLocked = true;
				} else {
					if (cur <= 0) {
						item.BQTY = 0;
						util.simpleMsg("不能再少了", true);
						return;
					}
					item.BQTY = 0;
					that.JFLocked = false;
				}
				that.$forceUpdate();
				console.log("积分切换后:", {
					JFDatas: that.JFDatas,
					ZSDatas: that.ZSDatas,
					JFLocked: that.JFLocked
				});
			},
			//按互斥状态禁用/启用商品行
			ApplyJFLock: function() {
				that.ZSDatas.forEach(r => {
					if (that.JFLocked) r.BQTY = 0;
				});
			},
			Calculate1: function(item, type) {
				//二选一：与 Calculate 保持一致的"加商品则清空积分"语义
				if (that.JFLocked) {
					that.JFDatas.forEach(r => r.BQTY = 0);
					that.JFLocked = false;
				}
				if (type > 0 && item.ZQTY && item.BQTY >= item.ZQTY) {
					util.simpleMsg("已达到该赠品上限：" + item.ZQTY, "none");
					return;
				}
				item.BQTY = Number(item.BQTY) + type;
				if (item.BQTY < 0) {
					item.BQTY = 0;
				}
				// that.CalXSZS(); //实时计算促销结果

				console.log("赠品数量变化", item);
			}, //数量计算
			Calculate: function(e, t, event) {
				// console.log("计算事件:", e + t);
				//加商品则清空积分(二选一)
				if (that.JFLocked) {
					that.JFDatas.forEach(r => r.BQTY = 0);
					that.JFLocked = false;
					console.log("[Calculate]清空积分,改为赠送商品");
				}
				if (t == '+') {
					if (e.BQTY == e.ZQTY) {
						e.BQTY = e.ZQTY;
						util.simpleMsg("不能再多了", true);
					} else {
						e.BQTY += 1;
					}
				} else if (t == '-') {
					if (e.BQTY <= 0) {
						e.BQTY = 0;
						util.simpleMsg("不能再少了", true);
					} else {
						e.BQTY -= 1;
					}
				} else if (t == '*') {
					let num = event.detail.value;
					num = parseFloat(num);
					console.log("输入得值:", num);
					if (num > e.ZQTY || num <= 0) {
						num = 0;
						util.simpleMsg("数量输入有误", true);
					}
					e.BQTY = num;
				}
				that.XSZSDatas.forEach((item, index, arr) => {
					// console.log("商品信息：", item.SPID + "/" + e.SPID);
					if (item.SPID == e.SPID) {
						item.BQTY = e.BQTY;
					}
				});

				// that.$set(that.WMDDATA[index], "BQTY", e.BQTY); // 实例方法$set
				that.$forceUpdate(); //刷新input的值 狗bug
				console.log("新数量:", that.XSZSDatas);
			},
			//计算促销的应付金额和折扣额
			CalXSZS: function() {
				let Arr = [];
				that.XSZSDatas.forEach(r => {
					let arr = r.Details.filter(r1 => {
						return r1.BQTY > 0;
					})
					Arr = Arr.concat(arr);
				})
				if (Arr.length > 0) {
					Arr = Arr.sort((a, b) => {
						return b.PRICE - a.PRICE
					});
					that.XSZSRes = _main.CalXSZS(Arr, that._sale);
				} else {
					that.XSZSRes = {
						msg: "已添加0个特殊商品预计额外支付：0元",
						data: [],
						count: 0,
						payAmount: 0
					};
				}
				console.log("售价排序后的促销商品：", that.XSZSRes);
			},
			//关闭销售赠品
			Close: function(code, msg) {
				console.log("取消销售赠品");
				uni.$emit("close-XSZS", {
					code,
					msg
				}); //返回一个空对象
			},
			//确认赠品
			Confirm: async function() {
				console.log("确认销售赠品");
				let jfArr = that.JFDatas.filter(item => Number(item.BQTY) > 0);
				let zsArr = that.ZSDatas.filter(item => Number(item.BQTY) > 0);
				//单号太长，指保留X
				//let bill = "XSLY" + that.BILL;
				let bill = "X" + that.BILL;
				//二选一:积分优先,积分有值就不再走赠品
				if (jfArr.length > 0) {
					await that.ConfirmJF(jfArr[0]);
					return;
				}
				if (!zsArr || zsArr.length == 0) {
					util.simpleMsg("无可用数据", true);
					return;
				}
				let obj = {
					khid: that.store.KHID,
					posid: that.store.POSID,
					gsid: that.store.GSID,
					czyid: that.store.RYID,
					czyname: that.BILL, //that.store.RYNAME,//仟吉要求记录销售单号
					storeKhzid: that.store.KHZID,
					storeDqid: that.store.DQID,
					datas: zsArr,
					bill: bill,
					ywtype: common.ywTypeEnum.XSZS
				};
				_take.ConfirmLY(obj, bill, common.ywTypeEnum.QTLY, res => {
					console.log("赠品生成领用操作结果：", res);
					util.simpleMsg("赠品单据生成成功！", false);
					that.Close(true, "Success");
				});
			},
			//赠积分:调加赠接口 -> 写 SALE_PAYINFO -> 关闭,不生成领用单
			ConfirmJF: async function(jfItem) {
				//防重复提交：本函数是 async，ConfirmJF 里既有网络往返也有本地补写，
				//期间收银员再点一次"确定"就会把加赠接口调两遍(积分翻倍)。
				//加赠是不可逆的对外调用，必须在最前面挡住，不能等 after 再判。
				if (that.JFSubmitting) {
					console.log("[ConfirmJF]已在提交中,忽略重复点击");
					return;
				}
				that.JFSubmitting = true;
				try {
					let point = Number(jfItem.BQTY);
					//会员号用 created 里在 resetSaleBill 之前存下的快照，不能再读 sale001(已清空)
					let hyid = that.hyid;
					if (!hyid) {
						util.simpleMsg("未获取到会员信息,无法赠送积分", true);
						that.JFSubmitting = false;
						return;
					}
					console.log("[ConfirmJF]准备赠送积分:", {
						point,
						hyid,
						bill: that.BILL
					});
					//接口未就绪时占位实现直接返回,不阻塞
					try {
						await _member.AddGiftPoint("赠送积分中...", {
							brand: getApp().globalData.brand,
							data: _gift.buildAddGiftPoint({
								hyid: hyid,
								bill: that.BILL,
								point: point
							})
						}, null, err => {
							console.log("[ConfirmJF]加赠接口异常(不阻塞):", err);
						});
					} catch (e) {
						console.log("[ConfirmJF]加赠接口异常(不阻塞):", e);
					}
					//服务器写失败时提示错误信息，但同样关闭弹窗，不能卡住下一笔单据
					await _take.SaveZSPayed({
						bill: that.BILL,
						khid: that.store.KHID,
						saledate: dateformat.getYMD(),
						point: point
					}, ok => {
						console.log("[ConfirmJF]赠积分流水保存结果:", ok);
						util.simpleMsg(ok ? "赠积分成功！" : "赠积分流水上传服务器失败，请检查网络", !ok);
						that.Close(true, "Success");
					});
				} finally {
					that.JFSubmitting = false;
				}
			}
		}
	}
</script>

<style>
	/* 外层容器与遮罩：原来由 MainSale 的 .boxs 提供，移到组件内随数据一起渲染
	   层级与 .boxs 实际生效值一致(basis.css 中 .boxs 为 9999999 !important，
	   会覆盖原外层内联的 99999)，保证与结算单等其他弹窗的层叠关系不变 */
	.xszs-wrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999999;
	}

	.xszs-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.meminfo {
		position: fixed;
		right: 0;
		width: 61%;
		z-index: 9889;
		height: 96%;
	}

	.fuzhu {
		height: 84%;
		overflow: auto;
	}

	.meminfo .close {
		position: absolute;
		top: 2%;
		right: 1%;
	}

	.member {
		padding: 1% 4%;
	}

	.affirm {
		width: 94%;
		padding: 2% 3%;
		margin: 0 auto;
		display: flex;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 9999;
		background-color: #fff;
	}

	.affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.tishi {
		font-size: 26rpx;
		font-weight: 700;
		color: #FE694B;
		padding: 0 4%;
	}

	/* 分组标题：占满整行，把下面的 .baglist 挤到新的一行去 */
	.meminfo .shoppbag .zs-group {
		width: 100%;
		flex: 0 0 100%;
		font-size: 26rpx;
		font-weight: 700;
		color: #4A9B53;
		line-height: 56rpx;
		margin-top: 16rpx;
	}

	.bag .h8 {
		width: 100%;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}

	.bag .h8 text:nth-child(1) {
		font-weight: 700;
		max-width: 70%;
		overflow: auto;
	}

	.bag .h8 text {
		font-weight: 400;
	}
</style>