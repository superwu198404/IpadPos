<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);

	.prolist {
		width: 100%;
	}
</style>

<template>
	<view class="content">
		<menu_page :menuIndex="0"></menu_page>
		<view class="right">
			<menu_head></menu_head>
			<view class="listof">
				<view class="prolist" style="overflow: hidden;">
					<!-- <component is="credit-settlement"></component> -->
					<!-- <component :is="components.current"></component> -->
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
						<view class="products">
							<view class="h2">每日现烤 <label></label></view>
							<view class="procycle">
								<!-- 产品循环 -->
								<view class="li">
									<view class="h3">
										<image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕
									</view>
									<view class="cods">
										<label>
											<image src="../../images/dx-bm.png" mode="widthFix"></image>12345678
										</label>
										<label>
											<image src="../../images/dx-dw.png" mode="widthFix"></image>10个装
										</label>
									</view>
									<view class="price">
										<text>￥12.9</text>
										<view>
											<image src="../../images/dx-gd.png" mode="widthFix"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="seasonal">
							<image src="../../images/dx-dwj.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="Letters()">A <text>◀</text></view>
						<view class="a-z" @click="Memberlogin(1)">
							<image src="../../images/VIP-dlu.png" mode="widthFix"></image>
						</view>
						<view class="a-z" @click="ShowCXData()">
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
						<label class="curr"><text>A</text></label>
						<label><text>B</text></label>
						<label><text>C</text></label>
						<label><text>D</text></label>
						<label><text>E</text></label>
						<label><text>F</text></label>
						<label><text>G</text></label>
						<label><text>H</text></label>
						<label><text>J</text></label>
						<label><text>K</text></label>
						<label><text>L</text></label>
						<label><text>M</text></label>
						<label><text>N</text></label>
						<label><text>O</text></label>
						<label><text>P</text></label>
						<label><text>Q</text></label>
						<label><text>R</text></label>
						<label><text>S</text></label>
						<label><text>T</text></label>
						<label><text>U</text></label>
						<label><text>W</text></label>
						<label><text>X</text></label>
						<label><text>Y</text></label>
						<label><text>Z</text></label>
					</view>
				</view>
			</view>
		</view>
		<!-- 蛋糕属性选择 -->
		<view class="boxs" v-if="attribute">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<button class="close">×</button>
				<view class="commods">
					<view class="h3">
						<image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕
					</view>
					<view class="cods">
						<label>
							<image src="../../images/dx-bm.png" mode="widthFix"></image>12345678
						</label>
						<label>
							<image src="../../images/dx-dw.png" mode="widthFix"></image>10个装
						</label>
					</view>
					<view class="price">
						<text class="jiage">￥12.9</text>
						<view><text>–</text><input /><text>+</text></view>
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
						<button class="btn">确 认</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 结算 -->
		<view class="boxs" v-if="showSale">
			<view class="memberes">
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
				<view class="pop-r">
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<button class="btn" @click="Memberlogin()" v-if="!yn_hy">会员登录</button>
							<button class="btn" @click="Memberlogin()" v-else>{{hyinfo.hyId}}</button>
						</label>
						<!-- <text >清空</text> -->
						<text @click="CloseSale()">关闭</text>
					</view>
					<view class="h5"><text>账单</text></view>
					<view class="goods">
						<!-- 商品循环 -->
						<view class="prolist">
							<view class="h3">
								<label>
									<image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕
								</label>
								<text>X2</text>
							</view>
							<view class="cods">
								<view>
									<label>
										<image src="../../images/dx-bm.png" mode="widthFix"></image>12345678
									</label>
									<label>
										<image src="../../images/dx-dw.png" mode="widthFix"></image>10个装
									</label>
								</view>
								<text>￥56</text>
							</view>
						</view>
					</view>
					<view class="ul">
						<view class="li"><text>总金额</text><text>￥567</text></view>
						<view class="li"><text>件数</text><text>7</text></view>
						<view class="li" @click="Discounts()">
							<label>
								<text>折扣</text>
								<image src="../../images/dx-zhekou.png" mode="widthFix"></image>
							</label>
							<text>-￥5</text>
						</view>
						<!-- <view class="li"><text>折扣</text><text>-￥5</text></view> -->
						<view class="li"><text>应收金额</text><text>￥560</text></view>
					</view>
					<view class="h5"><text>赠品</text><text @click="Bagslist()">查看全部 ></text></view>
					<view class="shoppbag">
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
						<button class="btn">确 认</button>
					</view>
					<!-- <view class="states" @click="Statements()">
					<text>结算单</text>
					<label>»</label>
				</view> -->
				</view>
			</view>
		</view>
		<!-- 会员弹框 -->
		<view class="boxs" v-if="showMember">
			<view class="memberes">
				<view class="meminfo" v-if="showMember">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">
						<label>
							<image class="touxiang" src="../../images/touxiang.png"></image>
							<label class="meminfo"><text>{{hyinfo.NickName}}</text><text>{{hyinfo.hyId}}</text></label>
							<label @click="ChangeMember()">切换</label>
						</label>
						<button @click="showMember=false">×</button>
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
			</view>
		</view>
		<!-- 促销活动 -->
		<view class="boxs" v-if="showMDCXData">
			<view class="popup promot">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="commods" style="padding-top:26rpx;">
					<view class="h3">
						促销活动列表<button class="close" @click="showMDCXData=false">×</button>
					</view>
					<view class="uls">
						<view class="lis" v-for="(item,index) in MDCXDatas">
							<view class="h8">促销主题:{{item.CXZT}}</view>
							<label>顾客范围:{{item.CXRY}}</label>
							<label>开始日期:{{item.SDATE}}</label>
							<label>结束日期:{{item.EDATE}}</label>
						</view>
					</view>
					<view class="confirm">
						<button class="btn" @click="showMDCXData=false">确 认</button>
					</view>
				</view>
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
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _checker from '@/utils/graceChecker.js';
	import _msg from '@/api/business/message.js';
	import _main from '@/api/business/main.js';

	var that;
	export default {
		computed: {
			Selected: function() {
				return (function(name) {
					return this.components.current === name ? "curr" : "";
				}).bind(this)
			}
		},
		data() {
			return {
				components: {
					source: {
						navbar: {

						}
					},
					component: [],
					current: "Extract",
					history: []
				},
				attribute: false,
				statements: false,
				Alphabetical: false,
				Memberinfo: false,
				showMember: false,
				Shoppingbags: false,
				Chargeback: false,
				coupon_list: [],
				hyinfo: {},
				KHID: app.globalData.store.KHID,
				DQID: app.globalData.store.DQID,
				DKFID: app.globalData.store.DKFID,
				JGID: app.globalData.store.JGID,
				showSale: false, //显示结算页面
				yn_hy: false, //是否有会员
				CXDatas: [],
				showZK: false, //是否展示折扣数据
				showMDCXData: false,
				MDCXDatas: [],
				ZKDatas: [],
				curZKType: "BZ"
			}
		},
		methods: {
			onLoad: function() {
				that = this;
				// _msg.ShowMsg(that.KHID, res => {
				// 	console.log("消息数据：", res);
				// 	that.MsgData = res;
				// });
				// common.DelSale();//主动删除销售单
			},
			//关闭结算
			CloseSale: function() {
				// console.log("进入关闭事件:");
				that.showSale = false;
				that.statements = false;
				that.Shoppingbags = false;
				that.Memberinfo = false;
			},
			ShowSale: function() {
				that.showSale = true;
				that.GetFZCX(); //获取辅助促销
			},
			//切换登录
			ChangeMember: function() {
				uni.navigateTo({
					url: "../MemberLogin/MemberLogin"
				})
			},
			//获取辅助促销
			GetFZCX: function() {
				//that.KHID
				//"K0101QT2"
				_main.GetFZCX(that.KHID, res => {
					console.log("辅助促销查询结果:", res);
					that.CXDatas = res;
				})
			},
			onShow: function() {
				let hyinfo = util.getStorage("hyinfo");
				if (hyinfo && JSON.stringify(hyinfo) != "{}") {
					that.yn_hy = true;
					that.hyinfo = hyinfo;
					that.GetHyCoupons(hyinfo);
				} else {
					that.yn_hy = false;
				}
			},
			//获取会员卡券
			GetHyCoupons: function(hyinfo) {
				// let hyinfo = getApp().globalData.hyinfo;
				if (hyinfo?.hyId) {
					// console.log("会员信息：", JSON.stringify(hyinfo));
					_member.CouponList("获取中...", {
						brand: that.brand,
						data: {
							hyid: hyinfo.hyId,
							phone: hyinfo.Phone
						}
					}, (res) => {
						if (res.code) {
							that.coupon_list = res.data;
						}
					}, (err) => {
						console.log("异常数据：", res)
					})
				}
			},
			MenuSwitch: function(name) {
				if (name) {
					this.components.current = name;
				}
				this.$forceUpdate();
			},
			Letters: function(e) {
				this.Alphabetical = true

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
						url: "../MemberLogin/MemberLogin"
					})
				}
			},
			Bagslist: function(e) {
				this.Shoppingbags = true;
				this.Memberinfo = false;
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
			//获取并展示门店促销活动
			GetZKDatas: function(type) {
				let data = {
					zktype: that.curZKType,
					dqid: that.DQID,
					spjgz: "",
					dkhid: "0020004824",//that.DKFID,  //测试使用
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
	.right {
		height: 100%;
	}

	/* .menu {
		box-sizing: border-box;
		overflow-y: auto;
		height: 72%;
		box-shadow: 0px -10px 10px -10px lightgray inset, 0px 10px 10px -10px lightgray inset;
		padding-bottom: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.menu *{
		transition: all .5s;
	}

	.exit {
		left: unset;
		transform: unset;
	}

	.menu .curr {
		margin:unset;
		margin-bottom: 3%;
	} */
</style>
