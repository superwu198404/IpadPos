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
					<text v-for="(item,index) in XT_MsgData.filter((r,i)=>{return i==0})"
						@click="ReadMsg(item)">{{item.title}}</text>
					<!-- <text>测试消息...</text> -->
				</view>
			</view>
			<view class="stores">
				<view class="checkout">
					<label class="buyer" @click="ShowDKF()">
						<image src="@/images/dakehu.png" mode="widthFix"></image>大客户：{{DKFNAME}}
						<!-- <image src="@/images/xiala.png" mode="widthFix"></image> -->
					</label>
					<label>
						<image src="@/images/dx-mendian.png" mode="widthFix"></image><text>{{STORE_NAME}}</text>
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
					<text @click="exits()">{{RYID}}
						<image style="width:24rpx;height: 24rpx;,margin-left:10rpx" src="@/images/xiala.png"
							mode="widthFix"></image>
					</text>
					<view class="dropout" v-if="dropout">
						<view class="exit" @click="LoginOut()">
							<image src="@/images/tuichu.png" mode="widthFix"></image>
							<text>退出</text>
						</view>
						<view class="exit" @click="Login()">
							<image src="@/images/zhuxiao.png" mode="widthFix"></image>
							<text>注销</text>
						</view>
						<view class="exit" @click="UPPWD()">
							<image src="@/images/xgmima.png" mode="widthFix"></image>
							<text>修改密码</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 紧急消息弹窗 -->
			<view class="boxs" v-if="false">
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
										<image src="../../images/kaishisj-xx.png"></image><text>2022.07.01 00:00
											开始</text>
									</label>
									<label>
										<image src="../../images/jieshusj-xx.png"></image><text>2022.07.30 24:00
											截止</text>
									</label>
								</view>
							</view>

						</view>
						<view class="confirm">
							<button class="btn">关 闭 (5s)</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 修改密码弹窗 -->
			<view class="boxs" v-if="showPWD">
				<view class="customer">
					<image class="bg" src="@/images/dx-tchw.png" mode="widthFix"></image>
					<view class="h3">修改密码 <button @click="showPWD=false" class="guan">×</button></view>
					<view class="critlist">
						<view>
							<text>旧密码：</text>
							<label><input focus="true" placeholder="请输入旧密码" password="true" v-model="oldPwd" /><button
									@click="oldPwd=''">×</button></label>
						</view>
						<view><text>新密码：</text><label><input placeholder="请输入新密码" password="true"
									v-model="newPwd" /><button @click="newPwd=''">×</button></label></view>
						<view><text>确认密码：</text><label><input placeholder="再次输入新密码" password="true"
									v-model="secPwd" /><button @click="secPwd=''">×</button></label></view>
					</view>
					<view class="affirm">
						<button class="btn btn-qk" @click="EmptyPWD()">清空</button>
						<button class="btn btn-qr" @click="ConfirmPWD()">确认</button>
					</view>
				</view>
			</view>
			<!-- 蓝牙弹窗 -->
			<view class="boxs" v-if="showBle">
				<view class="b_customer">
					<image class="b_bg" src="@/images/dx-tchw.png" mode="widthFix"></image>
					<view class="b_h3">设备连接 <button @click="showBle=false" class="b_guan">×</button></view>
					<view class="b_critlist">
						<view>
							<label>
								<image src="@/images/zfcg-dyj.png"></image><text>设备：KHO2345643343</text>
							</label>
							<button>连接</button><button class="b_has">已连接</button>
						</view>
						<view>
							<label>
								<image src="@/images/zfcg-dyj.png"></image><text>设备：KHO2345643343</text>
							</label>
							<button>连接</button><button class="b_has">已连接</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 大客户组件 -->
			<BigCustomer v-if="showBig" @ClosePopup="ClosePopup"></BigCustomer>
			<!-- 业务消息组件 -->
			<movable v-if="YW_MsgData.length>0" :_msgDatas="YW_MsgData"></movable>
		</view>
	</view>
</template>

<script>
	import _msg from '@/api/business/message.js';
	import util from '@/utils/util.js';
	import common from '@/api/common.js';
	import _login from '@/api/business/login.js';

	let that;
	export default {
		name: "menu_head",
		props: {
			data: []
		},
		data() {
			return {
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID,
				DKFNAME: getApp().globalData.store.DKFNAME,
				STORE_NAME: getApp().globalData.store.NAME,
				dropout: false,
				MsgData: [], //总的消息
				XT_MsgData: [], //系统类
				YW_MsgData: [], //业务类消息
				showMsg: false,
				showBig: false,
				YN_PRINT_CON: getApp().globalData.YN_PRINT_CON,
				showPWD: false,
				oldPwd: "",
				newPwd: "",
				secPwd: "",
				showBle: false,
			};
		},
		// created: function(e) {
		// 	that = this;
		// },
		created: function(e) {
			that = this;
			_msg.ShowMsg(that.KHID, "", res => {
				that.MsgData = res;
				that.XT_MsgData = res.filter((r, i) => {
					return r.type == 'SYSTEM';
				});
				that.YW_MsgData = res.filter((r, i) => {
					return (r.type == 'PTIP' || r.type == 'JJPT' || r.type == 'XTIP'); //外卖，预定，线上
				});
				console.log("[Head-Created]系统消息数据 XT_MsgData:", that.XT_MsgData);
				console.log("[Head-Created]业务消息数据 YW_MsgData:", that.YW_MsgData);
			});
		},
		methods: {
			//消息已读
			ReadMsg: function(e, i) {
				// _msg.DelMsg(that.KHID, e, res => {
				// 	console.log("消息数据：", res);
				// 	that.MsgData.splice(i, 1);
				// let arr = that.MsgData;
				// that.MsgData = arr.splice(i, 1);
				if (e.url) {
					// uni.navigateTo({
					// 	url: e.url
					// })
					this.$emit("Switch", {
						name: "Message",
						title: "消息",
						params: {
							// msgdatas: e
						},
					})
				}
				// });
			},
			exits: function(e) {
				this.dropout = !this.dropout
			},
			//注销 切换登录
			Login: function() {
				util.simpleModal("提示", "是否确认注销？", e => {
					if (e) { //点击了确定
						let store = util.getStorage("store");
						if (store) {
							if (store.RYTYPE == "SYSTEM") { //管理员退出要清空一下
								store = {};
							} else {
								store.RYID = "";
								store.RYNAME = "";
							}
							util.setStorage("store", store);
						}
						console.log("门店信息:", util.getStorage("store"));
						util.removeStorage("hyinfo"); //清除会员信息
						uni.redirectTo({
							url: "/pages/Login/Login",
							complete: r => {
								console.log(r)
							}
						})
					}
				})
			},
			//退出app
			LoginOut: async function() {
				let arr = await common.GetTXFILE();
				console.log("未处理单据：", arr);
				if (arr.length > 0) {
					util.simpleMsg("当前有未处理的单据，暂无法退出", "none");
					return;
				}
				util.simpleModal("提示", "是否确认退出应用？", e => {
					if (e) { //点击了确定
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
					}
				})
			},
			//修改密码
			UPPWD: function() {
				that.showPWD = true;
				// uni.redirectTo({
				// 	url: "/pages/index/index",
				// 	complete: r => {
				// 		console.log(r)
				// 	}
				// })
			},
			//密码清空
			EmptyPWD: function() {
				that.oldPwd = "";
				that.newPwd = "";
				that.secPwd = "";
			},
			//确定修改密码
			ConfirmPWD: function(res) {
				if (getApp().globalData.store.PWD != that.oldPwd) {
					util.simpleMsg("旧密码错误", true);
					return;
				}
				if (!that.newPwd) {
					util.simpleMsg("新密码为空", true);
					return;
				}
				if (that.newPwd != that.secPwd) {
					util.simpleMsg("两次密码不一致", "none");
					return;
				}
				_login.UpdatePWD({
					ryid: that.RYID,
					pwd: that.newPwd
				}, res => {
					console.log("后台修改密码的结果：", res);
					if (res.code) {
						_login.UpdatePWD_Local(JSON.parse(res.data), that.RYID, _res => {
							console.log("本地密码修改结果：", _res);
							if (res.code) {
								util.simpleMsg("密码修改成功");
								setTimeout(r => {
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
								}, 1200);
							} else {
								util.simpleMsg(res.msg, "none");
							}
						})
					} else {
						util.simpleMsg(res.msg, "none");
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
				// util.simpleMsg(that.YN_PRINT_CON == 'Y' ? "打印机已连接" : "打印机未连接", that.YN_PRINT_CON != 'Y');
				that.showBle = true;
			},
		}
	}
</script>

<style>
	.customer {
		background-color: #fff;
		width: 45%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 3% 140rpx;
	}

	.customer .bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
	}

	.customer .h3 {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 34rpx;
		border-bottom: 1px dashed #eee;
		position: relative;
		z-index: 2;
		font-weight: 700;
	}

	.customer .h3 .guan {
		float: right;
		background: none;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: right;
		padding: 0;
		width: 60rpx;
	}

	.affirm {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.affirm .btn-qk {
		border: 1px solid #FE694B;
		background-color: #FFF0EC;
		color: #FE694B;
	}

	.clues {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 300rpx;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
	}

	.critlist {
		padding: 4% 2% 4%;
		position: relative;
		z-index: 9;
	}

	.critlist view {
		padding: 2% 0;
		display: flex;
		align-items: center;
	}

	.critlist view label {
		height: 60rpx;
		line-height: 60rpx;
		background: #f5f5f5;
		border: 1px solid #EEEEEE;
		position: relative;
		width: 75%;
		border-radius: 4rpx;
		padding: 0 10rpx;
	}

	.critlist view label input {
		height: 58rpx;
		line-height: 58rpx;
	}

	.critlist view label button {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		position: absolute;
		top: 15rpx;
		right: 2%;
		background-color: #98C3B3;
		color: #fff;
		font-size: 16rpx;
	}
	/* 以下为蓝牙模块样式 */
	.b_customer {
		background-color: #fff;
		width: 45%;
		min-height: 400rpx;
		position: relative;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20rpx;
		padding: 0 3% 140rpx;
	}

	.b_customer .b_bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
	}

	.b_customer .b_h3 {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 34rpx;
		border-bottom: 1px dashed #eee;
		position: relative;
		z-index: 2;
		font-weight: 700;
	}

	.b_customer .b_h3 .b_guan {
		float: right;
		background: none;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: right;
		padding: 0;
		width: 60rpx;
	}

	.b_affirm {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.b_affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.b_affirm .b_btn-qk {
		border: 1px solid #FE694B;
		background-color: #FFF0EC;
		color: #FE694B;
	}

	.b_clues {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 300rpx;
		fony-size: 34rpx;
		position: relative;
		z-index: 2;
	}

	.b_critlist {
		padding: 4% 2% 4%;
		position: relative;
		z-index: 9;
	}

	.b_critlist view {
		padding: 2% 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.b_critlist view image {
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}

	.b_critlist view label {
		height: 60rpx;
		line-height: 60rpx;
		position: relative;
		display: flex;
		align-items: center;
	}

	.b_critlist view button {
		width: 140rpx;
		height: 60rpx;
		border-radius: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		background-color: #42B14B;
		color: #fff;
		font-size: 16rpx;
		margin: 0;
	}

	.b_critlist view .has {
		background-color: #B0b0b0;
	}
</style>
