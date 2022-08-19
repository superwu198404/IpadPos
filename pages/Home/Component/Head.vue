<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
	@import url(@/static/style/message.css);
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
					<!-- <text v-for="(item,index) in MsgData" @click="ReadMsg(item)">{{item.title}}</text> -->
					<text>测试消息...</text>
				</view>
			</view>
			<view class="stores">
				<view class="checkout">
					<label class="buyer" @click="ShowDKF()">
						<image src="@/images/dakehu.png" mode="widthFix"></image>大客户：{{DKFNAME}}
						<image src="@/images/xiala.png" mode="widthFix"></image>
					</label>
					<label>
						<image src="@/images/dx-mendian.png" mode="widthFix"></image>{{STORE_NAME}}
					</label>
					<label>
						<image src="@/images/dx-kuantai.png" mode="widthFix"></image>{{POSID}}
					</label>
					<label style="margin-right: 40rpx;" @click="ShowPrint()">
						<!-- ：{{YN_PRINT_CON=='Y'?'已连接':'未连接'}}▼ -->
						<image src="@/images/dx-dayinji.png" mode="widthFix" v-if="YN_PRINT_CON=='Y'"></image>
						<image src="@/images/dx-dayinji-hong.png" mode="widthFix" v-else></image>
					</label>
				</view>
				<view class="account">
					<view>
						<image src="@/images/touxiang.png" mode="widthFix"></image>
					</view>
					<text @click="exits()">{{RYID}}▼</text>
					<view class="dropout" v-if="dropout">
						<view class="exit" @click="LoginOut()">
							<image src="@/images/qiehuan.png" mode="widthFix"></image>
							<text>退出</text>
						</view>
						<view class="exit" @click="Login()">
							<image src="@/images/tuichu.png" mode="widthFix"></image>
							<text>注销</text>
						</view>
						<view class="exit" @click="UPPWD()">
							<image src="@/images/zhuxiao.png" mode="widthFix"></image>
							<text>修改密码</text>
						</view>
					</view>
				</view>
			</view>
			<BigCustomer v-if="showBig" @ClosePopup="ClosePopup"></BigCustomer>
		</view>
	</view>
</template>

<script>
	import _msg from '@/api/business/message.js';
	import util from '@/utils/util.js';

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
				DKFNAME: getApp().globalData.store.DKFNAME,
				dropout: false,
				MsgData: [],
				showMsg: false,
				showBig: false,
				YN_PRINT_CON: getApp().globalData.YN_PRINT_CON
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

			//消息已读
			ReadMsg1: function(e, i) {
				_msg.DelMsg(that.KHID, e, res => {
					console.log("消息数据：", res);
					that.MsgData.splice(i, 1);
					// let arr = that.MsgData;
					// that.MsgData = arr.splice(i, 1);
					if (e.url) {
						uni.navigateTo({
							url: e.url
						})
					}
				});
			},
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
			//注销
			Login: function() {
				if (getApp().globalData.stroe) {
					getApp().globalData.stroe.RYID = "";
					getApp().globalData.stroe.RYNAME = "";
				}
				util.removeStorage("hyinfo"); //清除会员信息
				uni.redirectTo({
					url: "/pages/Login/Login",
					complete: r => {
						console.log(r)
					}
				})
			},
			//退出登录
			LoginOut: function() {
				if (getApp().globalData.stroe) {
					getApp().globalData.stroe.RYID = "";
					getApp().globalData.stroe.RYNAME = "";
				}
				util.removeStorage("hyinfo"); //清除会员信息
				if (uni.getSystemInfoSync().platform == 'ios') {
					plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
				} else if (uni.getSystemInfoSync().platform == 'android') {
					plus.runtime.quit();
				}
			},
			//修改密码
			UPPWD: function() {
				uni.redirectTo({
					url: "/pages/index/index",
					complete: r => {
						console.log(r)
					}
				})
			},
			//选择大客户
			ShowDKF: function() {
				this.showBig = true;
			},
			//选择大客户
			ClosePopup: function(data) {
				this.showBig = false;
				console.log("选中的大客户：", data);
				if (data && JSON.stringify(data) != "{}") {
					getApp().globalData.store.DKFID = data.DKHID;
					getApp().globalData.store.DKFNAME = data.NAME;
					this.DKFNAME = data.NAME;
				}
				console.log("新的全局变量：", getApp().globalData.store);
			},
			ShowPrint: function() {
				util.simpleMsg(that.YN_PRINT_CON == 'Y' ? "打印机已连接" : "打印机未连接", that.YN_PRINT_CON != 'Y');
			},
		}
	}
</script>

<style>

</style>
