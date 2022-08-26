<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);

	.prolist {
		width: 100%;
	}
</style>
<template>
	<!-- <view class="content"> -->
	<!-- 结算 -->
	<view class="boxs">
		<view class="memberes">
			<ReserveDrawer @Close="CloseReserveDrawer" :show="SaleFrom"></ReserveDrawer>
			<view class="meminfo" v-if="Memberinfo">
				<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
				<view class="member">
					<label>
						<image class="touxiang" src="../../images/touxiang.png"></image>
						<label class="meminfo"><text>{{hyinfo.NickName}}</text><text>{{hyinfo.hyId}}</text></label>
					</label>
					<button @click="Memberinfo=false">×</button>
				</view>
				<view class="nom">
					<label>
						<text>￥{{hyinfo.Balance/100}}</text>
						<text>余额</text>
					</label>
					<label>
						<text>{{hyinfo.JFBalance/100}}</text>
						<text>积分</text>
					</label>
					<label>
						<text>{{coupon_list.length}}</text>
						<text>优惠券</text>
					</label>
					<label>
						<text>{{hyinfo.hy_Assets.GiftAmt/100}}</text>
						<text>礼品卡</text>
					</label>
				</view>
				<view class="rests" v-if="false">
					<view class="h2">其他</view>
					<view class="restlist">
						<label><text>上次购买时间：</text><text>03-23 19:23:47</text></label>
						<label><text>是否推送活动信息：</text><text>是</text></label>
						<label><text>上次购买金额：</text><text>￥56</text></label>
						<label><text>是否参与上次活动：</text><text>否</text></label>
					</view>
				</view>
				<view class="coulist">
					<view class="h2">优惠券</view>
					<view class="uls">
						<view class="lis" v-for="(item,index) in coupon_list">
							<view class="voucher">
								<view><text>￥</text>{{item.money}}</view>
								<text>满{{item.limitmoney}}可用</text>
							</view>
							<image class="banyuan" src="../../images/quan-fenge.png" mode="widthFix"></image>
							<view class="coupon-dets">
								<view class="limit">
									<view class="h3" v-for="(item1,index1) in item.limitDesc">
										<text>{{item1}}</text>
									</view>
									<text class="datas">{{item.s_date}} 至 {{item.e_date}}</text>
								</view>
								<view class="directions">
									<image class="bg" src="../../images/quan-bg.png" mode="widthFix"></image>
									<view>使用说明<image src="../../images/xiala.png" mode="widthFix"></image>
									</view>
									<!-- <button @click="CouponToUse(item.lqid)">点击使用<image src="../../images/ewm.png"
												mode="widthFix"></image></button> -->
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 辅助促销数据 -->
			<view class="meminfo" v-if="Shoppingbags">
				<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
				<view v-for="(item,index) in CXDatas">
					<view class="member">
						<label class="h9">{{item.CXZT}}<!-- 武汉满20元赠小号手提袋 --></label>
						<button @click="Shoppingbags=false">×</button>
					</view>
					<view class="shoppbag">
						<view class="baglist curr" v-for="(item1,index1) in item.Details">
							<view class="bag">
								<text class="h8">{{item1.SNAME}}</text>
								<label><text>{{item1.DESCRIBE}}</text></label>
							</view>
							<view class="quantit">
								<text>数量</text>
								<view class="nums">
									<text @click="Calculate(item1,'-')">-</text>
									<input type="number" v-model="item1.BQTY" @blur="Calculate(item1,'*',$event)" />
									<text @click="Calculate(item1,'+')">+</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 折扣列表 -->
			<view class="meminfo" v-if="showZK">
				<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
				<view>
					<view class="member">
						<label class="h9">折扣<text>（根据商品类型和满足金额自动匹配折扣率）</text></label>
						<button @click="showZK=false">×</button>
					</view>
					<view class="shoppbag">
						<radio-group @change="ChangeZK">
							<view class="h8">
								<label>
									<radio name="zhe" value="BZ" :checked="curZKType=='BZ'"></radio> 可用标准折扣
								</label>
								<label>
									<radio name="zhe" value="LS" :checked="curZKType=='LS'"></radio> 选择临时降点
								</label>
								<label>
									<radio name="zhe" value="TP" :checked="curZKType=='TP'"></radio> 选择特批折扣
								</label>
							</view>
						</radio-group>
						<view class="lists">
							<view class="conlst" v-if="curZKType=='TP'" v-for="(item,index) in ZKDatas"
								@click="ChooseZK(item)">
								<label>{{item.SPJGZ}}<text>折扣率：{{item.BFB}}</text></label>
								<view><text>商品分组：{{item.KONDM}}</text><!-- <text>满足金额：{{item.KBETR}}</text> -->
								</view>
							</view>
							<view class="conlst" v-else v-for="(item,index) in ZKDatas" @click="ChooseZK(item)">
								<label>{{item.ZKNAME}}<text>折扣率：{{item.ZKQTY_JS}}</text></label>
								<view><text>商品分组：{{item.ZKSTR}}</text><text>满足金额：{{item.MZNET}}</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="pop-r">
				<view class="member">
					<label>
						<image class="touxiang" src="../../images/touxiang.png"></image>{{hyinfo.hyId}}
						<!-- <button class="btn" @click="Memberlogin()" v-if="!yn_hy">会员登录</button>
						<button class="btn" @click="Memberlogin()" v-else>{{hyinfo.hyId}}</button> -->
					</label>
					<!-- <text >清空</text> -->
					<text @click="CloseSale()">关闭</text>
				</view>
				<view class="edit-info" v-if="Mode('Z171')">
					<button @click="EditExtract">+录入预定信息</button>
				</view>
				<view class="h5"><text>单号：{{Order.BILL}}</text></view>
				<view class="goods">
					<!-- 商品循环 -->
					<view class="prolist" v-for="(item,index) in Products">
						<view class="h3">
							<label>
								<image src="../../images/dx-mrxk.png" mode="widthFix"></image>{{item.SNAME}}
							</label>
							<text>X{{item.QTY}}</text>
						</view>
						<view class="cods">
							<view>
								<label>
									<image src="../../images/dx-bm.png" mode="widthFix"></image>{{item.SPID}}
								</label>
								<label>
									<image src="../../images/dx-dw.png" mode="widthFix"></image>{{item.UNIT}}
								</label>
							</view>
							<text>￥{{item.PRICE}}</text>
						</view>
					</view>
				</view>
				<view class="ul">
					<view class="li"><text>总金额</text><text>￥{{Order.ZNET}}</text></view>
					<view class="li"><text>件数</text><text>{{Order.TLINE}}</text></view>
					<view class="li" @click="Discounts()">
						<label>
							<text>折扣</text>
							<image src="../../images/dx-zhekou.png" mode="widthFix"></image>
						</label>
						<text>-￥{{Order.BILLDISC}}</text>
					</view>
					<!-- <view class="li"><text>折扣</text><text>-￥5</text></view> -->
					<view class="li"><text>应收金额</text><text>￥{{Order.TNET}}</text></view>
				</view>
				<view class="h5"><text>赠品</text><text @click="Bagslist()">查看全部 ></text></view>
				<view class="shoppbag" style="flex-wrap: nowrap;">
					<view class="hengs">
						<view v-if="CXDatas.length>0">
							<view class="baglist curr" v-for="(item,index) in CXDatas[0].Details">
								<view class="bag">
									<text class="h8">{{item.SNAME}}</text>
									<label><text>说明</text>{{item.DESCRIBE}}</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text @click="Calculate(item,'-')">-</text>
										<input type="number" v-model="item.BQTY" @blur="Calculate(item,'*',$event)" />
										<text @click="Calculate(item,'+')">+</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="confirm">
					<button class="btn" @click="Comfirm">确 认</button>
				</view>
				<!-- <view class="states" @click="Statements()">
					<text>结算单</text>
					<label>»</label>
				</view> -->
			</view>
		</view>
	</view>

	<!-- </view> -->
</template>

<script>
	//页面组件引入 ↓
	import ReserveDrawer from '@/pages/Reserve/ReserveDrawer.vue';
	// import ReserveDrawer from '@/pages/Extract/Reserve/ReserveDrawer.vue';
	//页面组件引入 ↑
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _checker from '@/utils/graceChecker.js';
	import _extract from '@/api/business/extract.js';
	import _msg from '@/api/business/message.js';
	import _main from '@/api/business/main.js';
	import _refund from '@/api/business/refundorder.js';
	import {
		Sale3Model,
		Sale3ModelAdditional
	} from '@/bll/PaymentBusiness/bll.js'
	import {
		Accept,
		SaleOrderGenaration
	} from '@/bll/Common/bll.js';
	var that;
	export default {
		name: "ShopCart",
		props: {
			_Order: Object, //主单
			_Products: Array, //商品数据
			_PayDatas: Array, //付款数据
			_Others: Object, //其他数据
			_Accept: Function,
			_Params:Object
		},
		components: {
			ReserveDrawer
		},
		computed:{
			Mode:function(){
				return util.callBind(this,function(bill_type){
					console.log("[Mode]类型:",bill_type);
					return this._Params.data?.bill_type == bill_type;
				})
			}
		},
		data() {
			return {
				KHID: getApp().globalData.store.KHID,
				showSale: false,
				Memberinfo: false,
				Shoppingbags: false,
				showZK: false,
				yn_hy: false,
				SaleFrom: false,
				CXDatas: [],
				Order: {
					BILL: common.CreateBill(getApp().globalData.store.KHID, getApp().globalData.store.POSID),
					SALEDATE: "",
					SALETIME: "",
					TNET: 0, //应付金额
					ZNET: 0, //整单金额
					BILLDISC: 0, //整单折扣需要加上手工折扣,
					ROUND: 0, //取整差值（手工折扣总额）
					CUID: "",
					CLTIME: "",
					XS_BILL: "", //退款时记录原单号（重点）
					XS_POSID: "", //退款时记录原posid（重点）
					XS_DATE: "", //退款时记录原销售日期（重点）
					XS_KHID: "", //退款时记录原khid（重点）
					XS_GSID: "", //退款时记录原GSID（重点）
					XSTYPE: "", //1，2 业务方向类型（支付还是退款）
					BILL_TYPE: "", //Z151,Z152....业务类型（销售还是预定还是赊销）
					TDISC: 0, //SKY_DISCOUNT 手工折扣额,
					TLINE: 0 //数量
				},
				Product: util.hidePropety({
					SNAME: "", //显示字段传入支付需要隐藏
					BILL: "",
					SALEDATE: "",
					SALETIME: "",
					KHID: "",
					POSID: "",
					SPID: "",
					NO: 0,
					PLID: "",
					BARCODE: "",
					UNIT: "",
					QTY: 0,
					PRICE: 0,
					OPRICE: 0,
					NET: 0,
					DISCRATE: 0,
					YN_SKYDISC: '',
					DISC: 0,
					YN_CXDISC: 'N',
					CXDISC: 0,
					MONTH: '',
					WEEK: '',
					TIME: '',
					RYID: "",
					GCID: "",
					DPID: "",
					KCDID: "",
					BMID: "",
					SKYDISCOUNT: ""
				}, "SKYDISCOUNT", "SNAME"), //商品数据对象
				Products: [], //商品数据集合
				PayData: {}, //付款数据对象
				PayDatas: [], //付款数据集合
				Others: {}, //其他数据
			};
		},
		created: function() {
			console.log("[ShopCar-Created]Meta:",this._Params ?? {});
			that = this;
			//获取辅助促销
			that.GetFZCX();
			that.Order = Object.assign(that.Order, that._Order);
			that.Products.push(that.Product);
			that.Products = Object.assign(that.Products, that._Products);
			console.log("商品数据：", that.Products);
			that.PayDatas = Object.assign(that.PayDatas, that._PayDatas);
			that.Others = Object.assign(that.Others, that._Others);
			
			let hyinfo = util.getStorage("hyinfo");
			if (hyinfo && JSON.stringify(hyinfo) != "{}") {
				that.yn_hy = true;
				that.hyinfo = hyinfo;
				that.GetHyCoupons(hyinfo);
			} else {
				that.yn_hy = false;
			}
		},
		methods: {
			//触发主页的关闭事件来关闭结算页面
			CloseSale: function() {
				Object.assign(this.$data, this.$options.data()); //清空数据
				this.$emit("_CloseSale", {});
			},
			CloseReserveDrawer: function(order_info) {
				this.SaleFrom = false;
				if (order_info) Object.assign(this.Order, order_info);
			},
			EditExtract: function() {
				console.log("[EditExtract]修改预订单...");
				this.SaleFrom = true;
			},
			Comfirm: async function() {
				console.log("[Comfirm]确认!");
				let result = null;
				console.log("[ShopCar-Comfirm]sale1:", this.Order);
				console.log("[ShopCar-Comfirm]sale2:", this.Products);
				console.log("[ShopCar-Comfirm]sale3:", this.PayDatas);
				if (this.Order.XSTYPE == 1) {
					result = await Accept({
						xs_type: this.Order.XSTYPE,
						bill_type: this.Order.BILL_TYPE,
						products: this.Products,
						payments: (util.callBind(this, function() {
							if (this.Order.DNET) { //如果存在定金金额
								console.log("[Comfirm]生成预定支付信息...");
								return [Sale3ModelAdditional(Sale3Model({
									fkid: 'ZG03',
									type: 'YDJ',
									bill: this.Order.BILL,
									name: "预定金",
									amount: this.Order.DNET
								}), { //业务配置字段（支付状态设定为成功）
									fail: false //定金显示为成功
								})];
							} else {
								return [];
							}
						}))()
					});
				} else {
					if (this.Order.BILL_TYPE == 'Z154') { //赊销退单需要调用api生成数据
						_refund.CreditOrderRefund({
							khid: this.KHID,
							posid: this.POSID,
							ryid: this.RYID,
							dkhname: this.Order.DKFNAME,
							bill: this.Order.BILL,
							saledata: this.Order.SALEDATE //new Date().toLocaleDateString()
						}, util.callBind(this, function(res) {
							console.log("[Comfirm]退单结果：", res);
							if (res.code) {
								util.simpleMsg("[Comfirm]退单成功");
								this.CloseSale();
							} else {
								util.simpleMsg("[Comfirm]退单失败:" + res.msg, true);
							}
						}));
						return; //避免进入支付页面
					} else {
						console.log("[Comfirm]退单单据数据:", this.Order);
						if (this.Order.BILL_TYPE == 'Z171' && this.Order.DNET === 189) { //预定 0元退单
							let result = await SaleOrderGenaration({
								no: common.CreateBill(this.KHID, this.POSID),
								bill_type: "",
								xs_type: 2,
								sales: {
									sale1: util.hidePropety(this.Order, "YD_STATUS", "THDATE", "THKHID",
										"SJTHDATE", "SJTHGSID", "SJTHGCID", "SJTHDPID", "SJTHKCDID",
										"SJTHKHID", "SJTHPOSID", "SJTHBILL", "ID_RY_TH", "NOTE1", "NOTE2",
										"PLATTYPE", "YDSPTYPE"),
									sale2: this.Products,
									sale3: this.PayDatas
								}
							});
							if (result.code) {
								util.simpleMsg("销售单创建成功!");
								_extract.reserveOrdersStatusUpdate({
									khid: this.KHID,
									gsid: this.GSID,
									bill: this.Order.BILL,
									is_pay: false
								}, util.callBind(this, function(res) {
									if (res.code)
										console.log("[ReserveOrdersStatusUpdate]订单状态修改成功!", res);
									else
										console.log("[ReserveOrdersStatusUpdate]订单状态修改失败!", res);
								}));
								return;
							} else {
								util.simpleMsg("销售单创建失败!", true, result.data)
								return;
							}
						} else {
							result = await Accept({ //其他退单
								xs_type: this.Order.XSTYPE,
								bill_type: this.Order.BILL_TYPE,
								sales: {
									sale1: this.Order,
									sale2: this.Products,
									sale3: this.PayDatas
								}
							})
						}
					}
				}
				this.$store.commit('set-location', result); //把数据存入
				uni.navigateTo({
					url: "../Payment/PaymentAll",
					events: {
						ExtractBack: util.callBind(this, function(data) {
							if (data.order.BILL_TYPE == 'Z171') { //如果是预订单
								_extract.reserveOrdersStatusUpdate({
									khid: this.KHID,
									gsid: this.GSID,
									bill: this.Order.BILL,
									is_pay: data.order.XSTYPE == '1' ? true : false
								}, util.callBind(this, function(res) {
									if (res.code)
										console.log("[ReserveOrdersStatusUpdate]订单状态修改成功!", res);
									else
										console.log("[ReserveOrdersStatusUpdate]订单状态修改失败!", res);
								}));
							}
							console.log(`[ExtractBack]操作完成!`, data);
							this.$emit("_CloseSale");
						})
					}
				})
			},
			//会员登录
			Memberlogin: function(e) {
				if (that.hyinfo && JSON.stringify(that.hyinfo) != "{}") {
					if (e) {
						that.showMember = true;
					} else {
						this.Memberinfo = true;
						this.Shoppingbags = false;
					}
				} else {
					uni.navigateTo({
						url: "../MemberLogin/MemberLogin",
						events: {
							refreshHY: function(data) { //会员登录后的回调，刷新会员状态
								let hyinfo = util.getStorage("hyinfo");
								if (hyinfo && JSON.stringify(hyinfo) != "{}") {
									that.yn_hy = true;
									that.hyinfo = hyinfo;
								} else {
									that.yn_hy = false;
								}
							}
						}
					})
				}
			},
			//查看更多 辅助促销
			Bagslist: function(e) {
				if (that.CXDatas.length > 0) {
					that.Shoppingbags = true;
					that.Memberinfo = false;
				} else {
					util.simpleMsg("暂无更多", true);
				}
			},
			Moreand: function(e) {
				this.Chargeback = !this.Chargeback
			},
			//展示默认折扣数据
			Discounts: e => {
				that.showZK = true;
				that.GetZKDatas();
			},
			//折扣类型切换事件
			ChangeZK: e => {
				that.curZKType = e.detail.value;
				that.GetZKDatas();
			},
			//获取辅助促销
			GetFZCX: function() {
				_main.GetFZCX(that.KHID, res => {
					console.log("辅助促销查询结果:", res);
					that.CXDatas = res;
				})
			},
			//获取并展示门店促销活动
			GetZKDatas: function(type) {
				let data = {
					zktype: that.curZKType,
					dqid: that.DQID,
					spjgz: "",
					dkhid: that.DKFID, //"0020004824", //测试使用
					jgid: that.JGID
				};
				_main.GetZKDatas(data, res => {
					if (res.code) {
						if (that.curZKType == 'TP') {
							that.ZKDatas = JSON.parse(res.data);
						} else {
							that.ZKDatas = res.msg;
						}
					} else {
						that.ZKDatas = [];
						util.simpleMsg("暂无数据", true);
					}
				})
			},
			//选择折扣
			ChooseZK: e => {
				console.log("已选折扣：", e);
				util.simpleMsg("折扣率：" + (e.BFB || e.ZKQTY_JS));
			},
		}
	}
</script>

<style>
	.edit-info>uni-button {
		flex: 0.9;
		font-size: 12px;
		margin-bottom: 4px;
	}
</style>
