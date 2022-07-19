<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<view class="commodity">
		<view class="hh">
			<view class="hotcakes">
				<image src="../../images/ydtq.png" mode="widthFix"></image> 预定提取
				<view class="classifys">
					<text class="curr">今日</text><text>待提货</text><text>已过期</text>
				</view>
			</view>
			<view>
				<view class="prints">
					<view class="sousuo">
						<image src="../../images/ydtq-dyj.png" mode="widthFix"></image>打印
					</view>
					<view class="sousuo">
						<label @click="Search()">
							<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
						</label>
						<view class="criterias" v-if="Criterias">
							<view class="critlist"><text>订单号：</text><input type="text" /></view>
							<view class="critlist"><text>手机号：</text><input type="text" /></view>
							<view class="critlist"><text>收货人：</text><input type="text" /></view>
							<view class="confs"><button class="btn btn-qx">清空</button><button class="btn">查询</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 小类循环 -->
		<view class="products">
			<view class="procycle">
				<!-- 产品循环 -->
				<view class="li">
					<view class="h3">
						<text>单号：K77687657897657</text>
						<text class="price">￥12.9</text>
					</view>
					<view class="cods">
						<label>2022-07-19 14:00</label>
					</view>
					<view class="handles"><text>5件退单商品</text><button class="btn">详单</button></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statements: false,
				Criterias: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				coupon_list: [],
				Newaddr: false
			}
		},
		methods: {

			Statements: function(e) {
				this.statements = !this.statements

			},
			Search: function(e) {
				this.Criterias = !this.Criterias

			},
			Memberlogin: function(e) {
				this.Memberinfo = true,
					this.Shoppingbags = false
			},
			Bagslist: function(e) {
				this.Shoppingbags = true,
					this.Memberinfo = false
			},
			Moreand: function(e) {
				this.Chargeback = !this.Chargeback
			},

		}
	}
</script>

<style>
	.right {
		height: 100%;
	}

	.classifys {
		display: inline-flex !important;
		width: unset;	
	}
</style>
