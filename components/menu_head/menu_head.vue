<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>
<template>
	<view>
		<view class="nav">
			<view class="getback">
				<!-- <image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image> -->
				<view class="message">
					<view class="imgs">
						<image src="@/images/tongzhi.png" mode="widthFix"></image>
					</view>
					<!-- <text>门店有一条新的外卖配送单消息来啦...</text> -->
					<text v-for="(item,index) in MsgData" @click="ReadMsg(item)">{{item.title}}</text>
				</view>
			</view>
			<view class="stores">
				<view class="checkout">
					<label>
						<image src="@/images/dx-mendian.png" mode="widthFix"></image>{{STORE_NAME}}
					</label>
					<label>
						<image src="@/images/dx-kuantai.png" mode="widthFix"></image>款台号：{{POSID}}
					</label>
				</view>
				<view class="account">
					<view>
						<image src="@/images/touxiang.png" mode="widthFix"></image>
					</view>
					<text @click="exits()">{{RYID}} > </text>
					<view class="dropout" v-if="dropout">
						<view class="exit" @click="Login()">
							<image src="@/images/qiehuan.png" mode="widthFix"></image>
							<text>切换账号</text>
						</view>
						<view class="exit" @click="LoginOut()">
							<image src="@/images/tuichu.png" mode="widthFix"></image>
							<text>退出登录</text>
						</view>
						<view class="exit" @click="LoginOut()">
							<image src="@/images/zhuxiao.png" mode="widthFix"></image>
							<text>注销</text>
						</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import _msg from '@/api/business/message.js';
	let that;
	export default {
		name: "menu_head",
		props: {
			data: []
		},
		data() {
			return {
				STORE_NAME: getApp().globalData.store.NAME,
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID,
				dropout: false,
				MsgData: []
			};
		},
		// created: function(e) {
		// 	that = this;
		// },
		created: function(e) {
			that = this;
			_msg.ShowMsg(that.KHID, "SYSTEM", res => {
				that.MsgData = res.filter((r, i) => {
					return i == 0;
				});
				console.log("消息数据that.MsgData：", that.MsgData);
			});
		},
		methods: {
			ReadMsg: function(e) {
				if (e.url) {
					uni.redirectTo({
						url: e.url + "?msgdata=''"
					})
				}
			},
			exits: function(e) {
				this.dropout = !this.dropout
			},
			//切换登录
			Login: function() {
				uni.redirectTo({
					url: "/pages/Login/Login",
					complete: r => {
						console.log(r)
					}
				})
			},
			//退出登录
			LoginOut: function() {
				// getApp().globalData.store = {}; //清空用户信息
				// uni.removeStorageSync("hyinfo"); //清除会员信息
				uni.redirectTo({
					url: "/pages/index/index",
					complete: r => {
						console.log(r)
					}
				})
			}
		}
	}
</script>

<style>

</style>
