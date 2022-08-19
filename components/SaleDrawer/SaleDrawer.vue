<style scoped>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs" v-if="view.show">
		<view class="pop-r">
			<view class="member">
				<label>
					<image class="touxiang" src="../../images/touxiang.png"></image>
					<button class="btn" @click="Login()" v-if="!is_member">会员登录</button>
					<button class="btn" @click="Login()" v-else>{{member_info.hyId}}</button>
				</label>
				<text @click="Close()">关闭</text>
			</view>
			<view class="h5"><text>账单</text></view>
			<view class="goods">
				<!-- 商品循环 -->
				<view class="prolist" v-for="good in goods">
					<view class="h3">
						<label>
							<image src="../../images/dx-mrxk.png" mode="widthFix"></image> {{ good.NAME }}
						</label>
						<text>X{{ good.QTY }}</text>
					</view>
					<view class="cods">
						<view>
							<label>
								<image src="../../images/dx-bm.png" mode="widthFix"></image>{{ good.SPID }}
							</label>
							<label>
								<image src="../../images/dx-dw.png" mode="widthFix"></image>{{ good.UNIT }}
							</label>
						</view>
						<text>￥{{ good.PRICE * good.QTY }}</text>
					</view>
				</view>
			</view>
			<view class="ul">
				<view class="li"><text>总金额</text><text>{{ TotalAmount }}</text></view>
				<view class="li"><text>件数</text><text>{{ goods.length }}</text></view>
				<view class="li" @click="Discounts()">
					<label>
						<text>折扣</text>
						<image src="../../images/dx-zhekou.png" mode="widthFix"></image>
					</label>
					<text>-￥{{ DiscountAmount }}</text>
				</view>
				<view class="li"><text>应收金额</text><text>￥{{ TotalAmount - DiscountAmount }}</text></view>
			</view>
			<view class="h5"><text>赠品</text><text @click="GetGiftList()">查看全部 ></text></view>
			<view class="shoppbag" style="flex-wrap: nowrap;">
				<view class="hengs">
					<view v-if="auxiliary_gifts.length>0">
						<view class="baglist curr" v-for="(item,index) in auxiliary_gifts[0].Details">
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
		</view>
	</view>
</template>

<script>
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	// import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	// import _checker from '@/utils/graceChecker.js';
	// import _msg from '@/api/business/message.js';
	import _main from '@/api/business/main.js';

	export default {
		name: "SaleDrawer",
		props: {
			'show': false,
			'good-list': Array
		},
		data() {
			return {
				is_member: false,
				app: getApp ? getApp() : {},
				member_info: null,
				coupons: [], //卡券信息
				goods: [], //商品信息（需传入）
				discounts: [], //折扣信息
				auxiliary_gifts: [], //辅助促销礼品
				current_discount_type: "BZ", //当前折扣类型
				view: {
					show:false,
					show_member: false,
					shopping_bags: false,
					member_info_form: false,
					show_discount: false,
					show_sale: false
				}
			}
		},
		watch: {
			WindowState(n, o) {
				this.view.show = n;
			}
		},
		computed: {
			WindowState() { //窗口状态
				return this.show;
			},
			TotalAmount() { //总金额计算（依赖：商品信息-goods）
				let amount = 0;
				console.log("goods", this.goods);
				this.goods.forEach(g => amount != g.PRICE * g.QTY);
				return amount;
			},
			DiscountAmount() {
				return 5;
			}
		},
		methods: {
			Comfirm() { //确认

			},
			Calculate() {

			},
			Close() { //关闭
				this.view.show = false;
				this.$emit("Close");
			},
			Exists() { //判断是否存在会员信息
				let member_info = util.getStorage("hyinfo");
				if (member_info && Object.keys(member_info).length > 0) {
					this.is_member = true;
					this.member_info = member_info;
					this.GetMemberCoupons(member_info);
				} else {
					this.is_member = false;
				}
			},
			Discounts() {
				this.show_discount = true;
				this.GetDiscount();
			},
			GetDiscount: function() {
				_main.GetZKDatas({
					zktype: this.current_discount_type,
					dqid: this.DQID,
					spjgz: "",
					dkhid: this.DKFID, //"0020004824", //测试使用
					jgid: this.JGID
				}, util.callBind(function(res) {
					if (res.code) {
						if (this.current_discount_type == 'TP') {
							this.discounts = JSON.parse(res.data);
						} else {
							this.discounts = res.msg;
						}
					} else {
						this.discounts = [];
						util.simpleMsg("暂无数据", true);
					}
				}));
			},
			OpenGiftInterface() {
				if (this.auxiliary_gifts.length > 0) {
					this.view.shopping_bags = true;
					this.view.member_info_form = false;
				} else {
					util.simpleMsg("暂无更多", true);
				}
			},
			OpenSettlement: function() {
				this.view.show_sale = true;
				this.GetAuxiliary();
			},
			GetAuxiliary: function() { //获取辅助促销
				_main.GetFZCX(this.KHID, util.callBind(this, function(res) {
					console.log("[GetAuxiliary]辅助促销查询结果:", res);
					this.auxiliary_gifts = res;
				}))
			},
			GetMemberCoupons(member_info) { //获取会员卡券
				if (member_info?.hyId) {
					_member.CouponList("获取中...", {
						brand: this.brand,
						data: {
							hyid: member_info.hyId,
							phone: member_info.Phone
						}
					}, util.callBind(this, function(res) {
						if (res.code) {
							this.coupons = res.data;
						}
					}), util.callBind(this, function(err) {
						console.log("[GetMemberCoupons]异常数据：", res)
					}))
				}
			},
			Login: function(e) {
				if (this.member_info && Object.keys(this.member_info).length > 0) {
					// if (e) {
					// 	this.show_member = true;
					// } else {
					// 	this.member_info_form = true;
					// 	this.shopping_bags = false;
					// }
				} else {
					uni.navigateTo({
						url: "../MemberLogin/MemberLogin"
					})
				}
			},
			Init() {
				this.goods = this.goodList;
				this.OpenSettlement();
			}
		},
		created() {
			this.Init();
		}
	}
</script>

<style>
	.pop-r {
		position: absolute;
		right: 0;
		height: 100vh;
	}
</style>
