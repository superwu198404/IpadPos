<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>

<template>
	<view class="content">
		<view class="right">
			<view class="listof">
				<view class="prolist">
					<!-- 大类循环 -->
					<view class="commodity">
						<view class="hh">
							<view class="hotcakes">
								<image src="../../images/dx-tqi.png" mode="widthFix"></image> 本店热销
								<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
							</view>
							<view class="classifys">
								<text class="curr">每日现烤</text><text>土司餐包</text>
								<label>
									<image src="../../images/jt-zhangkai.png" mode="widthFix"></image>
								</label>
							</view>
						</view>
						<!-- 小类循环 -->
						<view style="height:92%;flex: 1;">
							<scroll-view scroll-y="true" class="catecyc" :scroll-into-view="scrollinto">
								<view class="products" v-for="(plitem, plindex) in  mainSale.selectFlagList">

									<view class="h2">{{plitem.plname}} <label></label></view>

									<view class="procycle">
										<!-- 产品循环 -->
										<view class="li" v-for="(sptiem, spindex) in  plitem['plarr'] "
											@click="mainSale.showSpDetails" :data-plindex="plindex"
											:data-spindex="spindex">
											<view class="h3">
												<image src="../../images/dx-mrxk.png" mode="widthFix"></image>
												{{sptiem.SNAME}}
											</view>
											<view class="cods">
												<label>
													<image src="../../images/dx-bm.png" mode="widthFix"></image>0
												</label>
												<label>
													<image src="../../images/dx-dw.png" mode="widthFix"></image>
													{{sptiem.UNIT}}
												</label>
											</view>
											<view class="price">
												<text>￥{{ Price(sptiem.SPID) }}</text>
												<view>
													<image src="../../images/dx-gd.png" mode="widthFix"></image>
												</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="seasonal">
							<image src="../../images/dx-dwj.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="Letters()">{{mainSale.selectFlag}}
							<image class="text" src="../../images/dx-fldw.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="Memberlogin(1)">
							<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="GetTSZKData()">
							<image src="../../images/cuxiaohd-dlu.png" mode="widthFix"></image>
						</view>
						<view class="states" @click="ShowSale()">
							<text>结算单</text>
							<label>«</label>
						</view>
					</view>
					<view class="toproof">
						<image src="../../images/dx-qdb.png" mode="widthFix"></image>
					</view>
					<view class="ranks" v-if="Alphabetical">
						<label :class="mainSale.selectFlag==flagitem?'curr':''" @click="mainSale.FlagClick"
							:data-flag="flagitem" v-for="(flagitem, flagindex) in  mainSale.flagList">
							<text>{{flagitem}}</text>
						</label>

					</view>
				</view>
			</view>

		</view>

		<!-- 蛋糕属性选择 -->
		<view class="boxs" v-if="mainSale.ComponentsManage.inputsp">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<button class="close" @click="mainSale.setComponentsManage" data-mtype='inputsp'>×xxx</button>
				<view class="commods">
					<view class="h3">
						<image src="../../images/dx-mrxk.png" mode="widthFix"></image> {{mainSale.clikSpItem.SNAME}}
					</view>
					<view class="cods">
						<label>
							<image src="../../images/dx-bm.png" mode="widthFix"></image>{{mainSale.clikSpItem.SPID}}
						</label>
						<label>
							<image src="../../images/dx-dw.png" mode="widthFix"></image>{{mainSale.clikSpItem.UNIT}}
						</label>
					</view>
					<view class="price">
						<text class="jiage">{{mainSale.clikSpItem.PRICE}}</text>
						<view><text>–</text><input v-model="mainSale.inputSpForClick.QTY" /><text>+</text></view>
					</view>
					<view class="tochoose">
						<label><text>1</text>-<text>尺寸/6寸</text></label>
						<label><text>￥156</text><button class="del">×</button></label>
					</view>
					<view class="sizes">
						<view class="h4"><text class="sgin">*</text>尺寸</view>
						<view class="sizelist">
							<label>6寸</label><label>8寸</label><label>10寸</label><label>12寸</label>
						</view>
					</view>
					<view class="confirm">
						<button class="btn">确认</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 特殊折扣 -->
		<view class="boxs" v-if="show_special_discount">
			<view class="popup special">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="commods" style="padding-top:26rpx;">
					<view class="h3">
						特殊折扣选则<button class="close" @click="show_special_discount = false">×</button>
					</view>
					<view class="uls">
						<view class="lis curr">
							<view class="h8">
								<view>标准折扣<em></em></view>
								<label>总折扣额:<text>￥566</text></label>
								<span>已选</span>
							</view>
							<view class="discount">
								<label>·01 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·02 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·03 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<view>
									<label>
										<checkbox></checkbox>临时折扣
									</label>
									<text>满¥1000即打9折，折扣额¥123</text>
								</view>
							</view>
						</view>
						<view class="lis">
							<view class="h8">
								<view>特批折扣<em></em></view>
								<span>已选</span>
							</view>
							<view class="discount">
								<label>·01 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·02 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
								<label>·03 5个商品，满<span>1000</span>打<span>9折</span>，折扣额<text>￥345</text></label>
							</view>
						</view>
					</view>
					<view class="confirm">
						<button class="btn" @click="showMDCXData=false">确 认</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 会员登陆结算 -->
		<view class="boxs" v-if="show_shop_car">
			<view class="memberes">
				<view class="meminfo" v-if="member_info">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label class="meminfo"><text>{{hyinfo.NickName}}</text><text>{{hyinfo.hyId}}</text></label>
						</label>
						<button @click="member_info=false">×</button>
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
				<view class="meminfo" v-if="shop_bag">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view v-for="(item,index) in CXDatas">
						<view class="member">
							<label class="h9">{{item.CXZT}}<!-- 武汉满20元赠小号手提袋 --></label>
							<button @click="shop_bag=false">×</button>
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
				<view class="meminfo" v-if="show_discount">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view>
						<view class="member">
							<label class="h9">折扣<text>（根据商品类型和满足金额自动匹配折扣率）</text></label>
							<button @click="show_discount=false">×</button>
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
						</label>
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
											<input type="number" v-model="item.BQTY"
												@blur="Calculate(item,'*',$event)" />
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
	</view>
</template>

<script>
	import mysale from '@/utils/sale/base_sale.js';
	import xs_sp_init from '@/utils/sale/xs_sp_init.js';
	import util from '@/utils/util.js';
	import common from '@/api/common.js';
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _checker from '@/utils/graceChecker.js';
	import _msg from '@/api/business/message.js';
	import _main from '@/api/business/main.js';
	export default {
		name: "MainSale",
		data() {
			return {
				statements: false,
				Alphabetical: false,
				Chargeback: false,
				dropout: false,
				mainSale: {},
				hyinfo: {
					NickName: "",
					hyId: "",
					Balance: 0,
					JFBalance: 0,
					hy_Assets: {
						GiftAmt: 0
					}
				},
				MainSale: {}, //controller=>外层控制对象
				saleAdd: [],
				saleSub: [],
				scrollinto: "",

				show_shop_car: false, //是否展示购物车
				member_info: false, //购物车 => 是否展示会员信息
				shop_bag: false, //购物车 => 是否展示购物袋
				show_discount: false, //购物车 => 是否展示折扣信息
				show_special_discount: false, //显示特殊折扣（未从 Main 中移植）
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
				Products: [], //商品数据集合
				PayDatas: [], //付款数据集合
				hyinfo: {},
				current_discount_type:"BZ",//当前折扣类型
			}
		},
		computed: {
			Price: function() {
				return util.callBind(this, function(spid) {
					return this.mainSale.spPrice[spid]?.PRICE ?? "-";
				})
			}
		},
		methods: {
			ShowSale: function() {
				this.show_shop_car = true;
			},
			CloseSale: function() {
				this.show_shop_car = false;
			},
			//获取辅助促销
			GetFZCX: function() {
				_main.GetFZCX(this.KHID, util.callBind(this, function(res) {
					console.log("[GetFZCX]辅助促销查询结果:", res);
					this.CXDatas = res;
				}))
			},
			//展示特殊折扣
			GetTSZKData: function() {
				this.show_special_discount = true;
			},
			//获取并展示门店促销活动
			GetZKDatas: function() {
				_main.GetZKDatas({
					zktype: this.current_discount_type,
					dqid: this.DQID,
					spjgz: "",
					dkhid: this.DKFID, //"0020004824", //测试使用
					jgid: this.JGID
				}, util.callBind(this,function(res){
					if (res.code) {
						if (this.current_discount_type == 'TP') {
							this.ZKDatas = JSON.parse(res.data);
						} else {
							this.ZKDatas = res.msg;
						}
					} else {
						this.ZKDatas = [];
						util.simpleMsg("暂无数据", true);
					}
				}))
			},
			exits: function(e) {
				this.dropout = !this.dropout
			},
			Statements: function(e) {
				this.statements = !this.statements
			},
			Letters: function(e) {
				this.Alphabetical = true
			},
			Memberlogin: function(e) {
				this.member_info = true,
					this.shop_bag = false
			},
			Bagslist: function(e) {
				this.shop_bag = true,
					this.member_info = false
			},
			Moreand: function(e) {
				this.Chargeback = !this.Chargeback
			},
			Init: function() {
				this.GetFZCX();
			}
		},
		created() {
			console.log("[MainSale-Created]开始构造函数...");
			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale");
			console.log("[MainSale-Created]开始设置基础的销售类型...");
			this.mainSale.SetDefaultType();
			xs_sp_init.loadSaleSP.loadSp(this.KHID, util.callBind(this, function(products, prices) {
				console.log("[MainSale-Created]商品实际的长度:", products.length);
				this.mainSale.SetAllGoods(products, prices);
			}), this.DQID, this.KHZID);
			console.log("[MainSale-Created]将控制对象传入Home中...");
			this.$emit("Controller", this.mainSale);
			Init(); //集中初始化
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}

	.menu .saleadd {
		padding: 0;
	}

	.listof {
		height: 91%;
	}

	.catecyc {
		height: 100%;
	}
</style>
