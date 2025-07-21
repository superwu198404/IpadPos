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
						<image src="../../images/tongzhi.png" mode="widthFix"></image>
					</view>
					<!-- <text>门店有一条新的外卖配送单消息来啦...</text> -->
					<text v-for="(item,index) in MsgData" @click="ReadMsg(item)">{{item.title}}</text>
				</view>
			</view>
			<view class="stores">
				<view class="checkout">
					<label style="margin-right: 40rpx;" @click="ShowDKF()">
						大客户：{{DKFNAME}}▼
					</label>
					<label>
						<image src="../../images/dx-mendian.png" mode="widthFix"></image>{{STORE_NAME}}
					</label>
					<label>
						<image src="../../images/dx-kuantai.png" mode="widthFix"></image>款台号：{{POSID}}
					</label>
				</view>
				<view class="account">
					<view>
						<image src="../../images/touxiang.png" mode="widthFix"></image>
					</view>
					<text @click="exits()">{{RYID}}▼</text>
					<view class="dropout" v-if="dropout">
						<view class="exit" @click="Login()">
							<image src="../../images/qiehuan.png" mode="widthFix"></image>
							<text>切换账号</text>
						</view>
						<view class="exit" @click="LoginOut()">
							<image src="../../images/tuichu.png" mode="widthFix"></image>
							<text>退出登录</text>
						</view>
						<view class="exit" @click="LoginOut()">
							<image src="../../images/zhuxiao.png" mode="widthFix"></image>
							<text>注销</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 消息弹窗 -->
		<view class="boxs" v-if="showMsg">
			<view class="popup promot">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="infor">
					<view class="shoppbag">
						<view class="liis messadet">
							<view class="emergs"><label class="zhoyao">重要</label><label class="putong"
									v-if="putong">普通</label><text>● 进行中</text></view>
							<view class="h6">这是条关于通知的文字这是条关于通知的文字这是条关于通知的文字这是条关于通知的文字标题超出五十个字显示...</view>
							<view class="sender"><text>质管部 · 橘子</text><text>创建时间：2022-06-13 09:00:00</text></view>
						</view>
						<view class="matters">
							<image src="../../images/dl-login.png" mode="widthFix"></image>
							<text>
								编程技术的保存失败的次数第v你说的基本上调查
								上档次
								十九点v你是
							</text>
						</view>
						<view class="tally">
							<label>
								<image src="../../images/yewu-xx.png"></image><text>销售业务</text>
							</label>
							<view>
								<label>
									<image src="../../images/kaishisj-xx.png"></image><text>2022.07.01 00:00 开始</text>
								</label>
								<label>
									<image src="../../images/jieshusj-xx.png"></image><text>2022.07.30 24:00 截止</text>
								</label>
							</view>
						</view>

					</view>
					<view class="confirm">
						<button class="btn" @click="showMsg=false">关 闭 (5s)</button>
					</view>
				</view>
			</view>
		</view>
		
		<BigCustomer v-if="showBig" @ClosePopup="ClosePopup"></BigCustomer>
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
				DKFNAME: getApp().globalData.store.DKFNAME,
				dropout: false,
				MsgData: [],
				showMsg: false,
				showBig: false
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
			}
		}
	}
</script>

<style>
	
</style>
