<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
	@import url(@/static/style/message.css);
</style>
<template>
	<view>
		<view class="nav" style="display: flex;justify-content: space-between;align-items: center;position: relative;">
			<view class="getback">
				<!-- <image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image> -->
				<view class="message">
					<view class="imgs">
						<image src="@/images/tongzhi.png" mode="widthFix"></image>
					</view>
					<!-- <text>门店有一条新的外卖配送单消息来啦...</text> -->
					<text v-if="XT_MsgData.length==0">暂无系统消息！</text>
					<text v-else v-for="(item,index) in XT_MsgData.filter((r,i)=>{return i==0})"
						@click="ReadMsg(item)">{{item.title}}</text>
				</view>
			</view>
			<view class="stores" style="position: absolute;right: 1%;">
				<view class="checkout">
					<label class="buyer" @click="ShowDKF()" v-if="!YN_SX">
						<image src="@/images/dakehu.png" mode="widthFix"></image>
						<text>大客户：{{DKFNAME}}</text>
					</label>
					<label class="buyer shexiao" @click="ShowDKF()" v-else>
						<image src="@/images/dakehu-xuanz.png" mode="widthFix"></image>
						<text>赊销中：{{DKFNAME}}</text>
					</label>
					<label class="buyer" v-if="hyinfo&&Object.keys(hyinfo).length>0">
						<image src="@/images/huiyuanID.png" mode="widthFix"></image><text>会员：{{hyinfo.hyId}}</text>
						<!-- <image src="@/images/xiala.png" mode="widthFix"></image> -->
					</label>
					<label>
						<image src="@/images/dx-mendian.png" mode="widthFix"></image><text>{{STORE_NAME}}</text>
					</label>
					<label>
						<image src="@/images/dx-kuantai.png" mode="widthFix"></image>{{POSID}}
					</label>
					<label @click="ShowPrint()">
						<image src="@/images/dx-dayinji.png" mode="widthFix" v-if="YN_PRINT_CON=='Y'"></image>
						<image src="@/images/dx-dayinji-hong.png" mode="widthFix" v-else></image>
						<text v-if="YN_PRINT_CON=='Y'">已连接</text>
						<text v-else style="color: #FE694B;">未连接</text>
					</label>
					<label class="rijie" v-if="showSale">
						<image src="@/images/dx-qingkong.png" mode="widthFix"></image>
						<button @click="ReturnSale()">清空</button>
					</label>
				</view>
				<!-- <view class="account" v-if="hyinfo">
					<view>
						<image src="@/images/touxiang.png" mode="widthFix"></image>
					</view>
					<view style="display:flex;flex-wrap: nowrap;align-items: center;">
						<text>{{ hyinfo.hyId}}</text>
					</view>
				</view> -->
				<view class="account">
					<view>
						<image src="@/images/touxiang.png" mode="widthFix"></image>
					</view>
					<view @click="exits()" style="display:flex;flex-wrap: nowrap;align-items: center;">
						<text>{{RYID}}</text>
						<image style="width:24rpx;height: 24rpx;,margin-left:10rpx" src="@/images/xiala.png"
							mode="widthFix"></image>
					</view>
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
						<!-- <view class="exit" @click="Back()">
							<image src="@/images/zhuxiao.png" mode="widthFix"></image>
							<text>返回上级</text>
						</view> -->
					</view>
				</view>
			</view>
			<!-- 紧急消息弹窗 -->
			<view class="boxs" v-if="urgenMsg&&JSON.stringify(urgenMsg)!='{}'">
				<view class="popup promot">
					<image class="tchw" src="@/images/dx-tchw.png" mode="widthFix"></image>
					<view class="infor">
						<view class="shoppbag">
							<view class="liis messadet">
								<view class="emergs">
									<label class="zhoyao">重要</label>
									<!-- <label class="putong" v-if="putong">普通</label> -->
									<text>● 进行中</text>
								</view>
								<view class="h6">{{urgenMsg.newVal.TITLE}}</view>
								<view class="sender"><text>{{urgenMsg.newVal.YYBM}} ·
										{{urgenMsg.newVal.ID_RY_XG}}</text><text>创建时间：{{urgenMsg.newVal.DATE_LR}}</text>
								</view>
							</view>
							<view class="matters">
								<image src="@/images/dl-login.png" mode="widthFix"></image>
								<text>
									暂无数据。。。。。。。。。。。。
								</text>
							</view>
							<view class="tally">
								<label>
									<image src="@/images/yewu-xx.png"></image><text>{{urgenMsg.newVal.YYBM}}</text>
								</label>
								<view>
									<label>
										<image src="@/images/kaishisj-xx.png"></image>
										<text>{{urgenMsg.newVal.SDATE}}开始</text>
									</label>
									<label>
										<image src="@/images/jieshusj-xx.png"></image>
										<text>{{urgenMsg.newVal.EDATE}}截止</text>
									</label>
								</view>
							</view>

						</view>
						<view class="confirm">
							<button class="btn" :disabled="viewTime>0" @click="CloseMsg()">关 闭 <text
									v-if="viewTime>0">({{viewTime}}s)</text></button>
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
						<view v-for="(item, index) in list" :key="index" :title="item.name" :data-title="item.deviceId"
							:data-name="item.name" :data-key="index" :data-advertisData="item.advertisServiceUUIDs"
							@tap="bindViewTap">
							<label>
								<image src="@/images/zfcg-dyj.png"></image><text>设备：{{item.name}}</text>
							</label>
							<button v-if="isLink[index]==0">连接</button><button class="b_has"
								v-if="isLink[index]==1">已连接</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 大客户组件 -->
			<BigCustomer v-if="custom" @ClosePopup="ClosePopup"></BigCustomer>
			<!-- 业务消息组件 -->
			<movable v-if="showYWMsg && (type != 'sale_cake_reserve')" :_msgDatas="YW_MsgData"></movable>
			<!-- 签到组件 -->
			<!-- <qiandao @GetSignOut="GetSignOutInWeek" v-show="showSign"></qiandao> -->
			<!-- 日结组件 -->
			<!-- <rijie @CloseRJ="CloseSignOut" v-show="showSignOut" :_signOutDate="signOutDate"></rijie> -->
		</view>
	</view>
</template>

<script>
	import _msg from '@/api/business/message.js';
	import util from '@/utils/util.js';
	import common from '@/api/common.js';
	import _login from '@/api/business/login.js';
	import bleConnect from '@/utils/xprinter/bleConnect.js';
	import dateformat from '@/utils/dateformat.js';

	var app = getApp();
	let that;
	export default {
		name: "menu_head",
		props: {
			data: [],
			custom: Boolean,
			_showSale: Boolean,
			_ynDKF: Boolean,
			type: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				RYID: getApp().globalData.store.RYID,
				DKFNAME: getApp().globalData.store.DKFNAME,
				STORE_NAME: getApp().globalData.store.NAME,
				dropout: false,
				hyinfo: {},
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
				showSale: false,
				showBle: false,
				showSign: false,
				showSignOut: false,
				signOutDate: [],
				//蓝牙
				list: [],
				services: [],
				serviceId: 0,
				writeCharacter: false,
				readCharacter: false,
				notifyCharacter: false,
				isScanning: false,
				isLink: [],
				urgenMsg: {}, //紧急信息
				viewTime: 5, //默认5s
				intervalId: null,
				showYWMsg: false,
				ynDKF: true,
				YN_SX: false //是否赊销
			};
		},
		computed: {
			custom_display() {
				return this.custom;
			}
		},
		watch: {
			_showSale: function(n, o) {
				this.showSale = this._showSale;
				console.log("Head->showSale:", this.showSale);
			},
			_ynDKF: function(n, o) {
				this.ynDKF = this._ynDKF;
			},
			custom_display: function(n, o) {
				console.log("[Customer]显示状态:", n);
				if (n === true) {
					uni.$emit("customer-open");
				} else if (n === false) {
					uni.$emit("customer-close");
				}
			}
		},
		onShow: function() {
			let that = this;
			//搜索蓝牙
			that.startSearch();
		},
		onLoad: function(options) {
			let that = this;
			//监听蓝牙连接状态
			that.onBLEConnectionStateChange();
		},
		created: function(e) {
			this.showSale = this._showSale;
			this.ynDKF = this._ynDKF;
			that = this;
			uni.$off('set-member');
			uni.$on('set-member', util.callBind(this, function(info) {
				console.log("[Head]设置会员名称!", info);
				this.hyinfo = info;
			}))
			uni.$off('set-dkf');
			uni.$on('set-dkf', util.callBind(this, function(info) {
				console.log("[Head]设置大客户名称!", info);
				this.DKFNAME = info;
			}))
			this.GetStoreMessage();
			this.MonitorEvent(); //事件监听
			//搜索蓝牙
			that.startSearch();
			that.onBLEConnectionStateChange();
			//去除日结的判断
			// let store = util.getStorage("store");
			// if (store.OPENFLAG == 1) { //已签到才进行日结的提示 未签到的等到 签到后再做日结
			// 	//查询一周内是否有未日结的数据
			// 	that.GetSignOutInWeek();
			// } else {
			// 	that.showSign = true;
			// }
			this.Bind();
		},
		methods: {
			Back: function() {
				console.log("[Back]返回上一级...");
				uni.navigateTo({
					url: "../index/index"
				})
			},
			Bind: function() {
				console.log("[Head-Bind]执行开始!");
				uni.$off('head-action');
				uni.$on('head-action', util.callBind(this, function(data) {
					console.log("[Head]动作执行!");
					if (Object.existsKey(this, data.name)) {
						this[data.name]();
					}
				}))
			},
			MonitorEvent: function() {
				console.log("[MonitorEvent]事件监听开始...");
				uni.$off('stop-message');
				uni.$on('stop-message', util.callBind(this, function() { //停止消息轮询
					let timer = getApp().globalData.msgInt;
					console.log("[MonitorEvent]消息轮询停止!", timer);
					clearInterval(timer);
					getApp().globalData.msgInt = 0;
				}));
				console.log("[MonitorEvent]消息轮询停止事件监听开始...");
				uni.$off('continue-message');
				uni.$on('continue-message', util.callBind(this, function() { //继续消息轮询
					if (!getApp().globalData.msgInt) {
						console.log("[MonitorEvent]消息轮询继续!");
						this.GetStoreMessage();
					} else {
						console.log("[MonitorEvent]消息轮询正在运行!", timer);
					}
				}));
				console.log("[MonitorEvent]消息轮询继续事件监听开始...");
			},
			GetStoreMessage: function() { //获取门店消息
				_msg.ShowMsg(that.KHID, "", res => {
					that.MsgData = res;
					that.XT_MsgData = res.filter((r, i) => {
						return r.type == 'SYSTEM';
					});
					that.YW_MsgData = res.filter((r, i) => {
						//外卖，外卖预定单，线上
						return (r.type == 'PTIP' || r.type == 'WMYS' || r.type == 'XTIP');
					});
					if (that.YW_MsgData.length > 0) {
						that.showYWMsg = false;
						// console.log("触发没有：");
						that.$nextTick(() => {
							// console.log("触发没有1：");
							that.showYWMsg = true;
						})
					} else {
						that.showYWMsg = false;
					}
					if (that.XT_MsgData.length > 0) {
						let newArr = that.XT_MsgData[0].Details.map(r => {
							return {
								key: r.key,
								val: JSON.parse(r.val),
								newVal: JSON.parse(r.val)[0]
							}
						})
						console.log("分组后的消息：", newArr);
						that.urgenMsg = newArr.find(r => {
							return r.newVal.IMTYPE == '1'
						})
						if (that.urgenMsg && JSON.stringify(that.urgenMsg) != "{}") {
							that.viewTime = that.urgenMsg.VIEWTIME || 5;
							let id = setInterval(r => {
								that.viewTime -= 1;
								if (that.viewTime == 0) {
									that.viewTime == 0;
									clearInterval(id);
								}
							}, 1000);
						}
					}
					// console.log("[Head-Created]系统消息数据 XT_MsgData:", that.XT_MsgData);
					// console.log(
					// 	"[Head-Created]业务消息数据 YW_MsgData:", that.YW_MsgData);
					// console.log(
					// 	"[Head-Created]紧急消息数据 urgenMsg:", that.urgenMsg);
				});
			},
			//消息已读
			ReadMsg: function(e, i) {
				//home下有监听该回调事件 废弃
				// uni.$emit("Switch", "sale_message");
				uni.$emit("change", {
					name: "sale_message",
					info: {
						clickType: "sale_message"
					}
				});
				return;
				//旧版本
				//let store = util.getStorage("store");
				// _msg.DelMsg(that.KHID, e, res => {
				// 	console.log("消息数据：", res);
				// 	that.MsgData.splice(i, 1);
				// let arr = that.MsgData;
				// that.MsgData = arr.splice(i, 1);
				if (e.url) {
					// uni.navigateTo({
					// 	url: e.url
					// })
					uni.$emit("change", {
						name: "sale_message",
						params: {
							// msgdatas: e
						}
					})
				}
				// });
			},
			//关闭紧急类消息
			CloseMsg: function() {
				if (that.urgenMsg && JSON.stringify(that.urgenMsg)) {
					let obj = {
						type: "SYSTEM",
						bill: that.urgenMsg.newVal.BILL,
						Details: [{
							key: that.urgenMsg.key
						}]
					}
					_msg.DelMsg(that.KHID, obj, res => {
						console.log("消息数据已读结果：", res);
					});
					that.urgenMsg = null;
				}
			},
			exits: function(e) {
				this.dropout = !this.dropout
			},
			//注销 切换登录
			Login: function() {
				util.simpleModal("提示", "是否确认注销？", e => {
					if (e) { //点击了确定
						// let store = util.getStorage("store");
						// if (store) {
						// if (store.RYTYPE == "SYSTEM") { //管理员退出要清空一下
						// store = {};
						// } else {
						// 	store.RYID = "";
						// 	store.RYNAME = "";
						// }
						util.setStorage("store", {});
						// }
						console.log("门店信息:", util.getStorage("store"));
						util.removeStorage("hyinfo"); //清除会员信息
						clearInterval(getApp().globalData.Int); //取消定时传输
						getApp().globalData.Int = null;
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
				// let arr = await common.GetTXFILE();
				// console.log("未处理单据：", arr);
				// if (arr.length > 0) {
				// 	util.simpleMsg("当前有未处理的单据，暂无法退出", "none");
				// 	return;
				// }
				util.simpleModal("提示", "是否确认退出销售？", e => {
					if (e) { //点击了确定
						let store = util.getStorage("store");
						if (store) {
							store.DKFID = "80000000";
							store.DKFNAME = "默认大客户";
							util.setStorage("store", store);
						}
						clearInterval(getApp().globalData.Int); //取消定时传输
						getApp().globalData.Int = null;
						uni.redirectTo({
							url: "../Center/Center"
						})
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
			ConfirmPWD: function() {
				if (getApp().globalData.store.PWD != that.oldPwd) {
					util.simpleMsg("旧密码错误", true);
					return;
				}
				if (!that.newPwd) {
					util.simpleMsg("新密码为空", true);
					return;
				}
				if (that.newPwd == that.oldPwd) {
					util.simpleMsg("不能和旧密码相同", "none");
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
							if (_res.code) {
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
								util.simpleMsg(_res.msg, "none");
							}
						})
					} else {
						util.simpleMsg(res.msg, "none");
					}
				})
			},
			//选择大客户
			ShowDKF: function() {
				// this.showBig = true;
				console.log("[ShowDKF]选择大客户!");
				if (!this.ynDKF) {
					util.simpleMsg("禁止选择大客户", true);
					return;
				}
				this.$emit('update:custom', true);
				uni.$emit('open-big-customer');
			},
			//选择大客户
			ClosePopup: function(data) {
				console.log("[ClosePopup]大客户信息:", data);
				if (data && Object.keys(data).length && data.DKHID) {
					let store = util.getStorage("store");
					store.DKFID = data.DKHID;
					store.DKFNAME = data.NAME;
					util.setStorage("store", store);
					console.log("[ClosePopup]设置门店大客户信息完成...");
					this.DKFNAME = data.NAME;
					if (data.exists_credit) { //是否赊销
						this.YN_SX = data.exists_credit;
					} else {
						this.YN_SX = false;
					}
				}
				this.$emit('update:custom', false);
				this.$forceUpdate();
			},
			//通知外部返回销售
			ReturnSale: function() {
				uni.$emit('ReturnSale');
			},
			ShowPrint: function() {
				// util.simpleMsg(that.YN_PRINT_CON == 'Y' ? "打印机已连接" : "打印机未连接", that.YN_PRINT_CON != 'Y');
				that.showBle = true;
				that.startSearch();
			},
			onBLEConnectionStateChange: function() {
				let that = this;
				uni.onBLEConnectionStateChange(res => {
					console.log(`设备状态 ${res.deviceId},connected: ${res.connected}`);
					if (res.connected == false) {
						app.globalData.YN_PRINT_CON = "N";
						that.YN_PRINT_CON = "N";
						try {
							//closeBluetoothAdapter();
							that.closeBLEConnection(res.deviceId, 0);
						} catch (e) {}

						if (app.globalData.BLEInformation.deviceId != "" && app.globalData
							.BLEInformation.deviceName != "") {
							that.startSearch();
						}
					} else {
						app.globalData.YN_PRINT_CON = "Y";
						that.YN_PRINT_CON = "Y";
						//that.clearIntervalFun();
					}
					console.log(`连接状态 ${res.deviceId},connected: ${app.globalData.YN_PRINT_CON}`);
				})
			},
			//搜索设备
			startSearch: function() {
				var that = this;
				uni.openBluetoothAdapter({
					success: function(res) {
						uni.getBluetoothAdapterState({
							success: function(res) {
								console.log("openBluetoothAdapter success",
									res);

								if (res.available) {
									if (res.discovering) {
										uni.stopBluetoothDevicesDiscovery({
											success: function(res) {
												console.log(res);
											}
										});
									} else {
										that.getBluetoothDevices();
									}
								} else {
									uni.showModal({
										title: "提示",
										content: "本机蓝牙不可用",
										showCancel: false
									});
								}
							}
						});
					},
					fail: function() {
						uni.showModal({
							title: "提示",
							content: "蓝牙初始化失败，请到设置打开蓝牙",
							showCancel: false
						});
					}
				});
			},
			checkPemission: function() {
				//android 6.0以上需授权地理位置权限
				var that = this;
				var platform = app.globalData.BLEInformation.platform;

				if (platform == "ios") {
					app.globalData.platform = "ios";
					that.getBluetoothDevices();
				} else if (platform == "android") {
					app.globalData.platform = "android";
					console.log(
						app.globalData
						.getSystem()
						.substring(
							app.globalData.getSystem().length - (app.globalData.getSystem()
								.length - 8),
							app.globalData.getSystem().length - (app.globalData.getSystem()
								.length - 8) + 1
						)
					);

					if (
						app.globalData
						.getSystem()
						.substring(
							app.globalData.getSystem().length - (app.globalData.getSystem().length -
								8),
							app.globalData.getSystem().length - (app.globalData.getSystem().length -
								8) + 1
						) > 5
					) {
						uni.getSetting({
							success: function(res) {
								console.log(res);

								if (!res.authSetting["scope.userLocation"]) {
									uni.authorize({
										scope: "scope.userLocation",
										complete: function(res) {
											that.getBluetoothDevices();
										}
									});
								} else {
									that.getBluetoothDevices();
								}
							}
						});
					}
				}
			},
			getBluetoothDevices: function() {
				//获取蓝牙设备信息
				var that = this;
				console.log("start search");
				// uni.showLoading({
				// 	title: "正在加载",
				// 	icon: "loading"
				// });
				that.setData({
					isScanning: true
				});
				uni.startBluetoothDevicesDiscovery({
					success: function(res) {
						console.log(res);
						setTimeout(function() {
							const _this = this
							uni.getBluetoothDevices({
								success: function(res) {
									var devices = [];
									var num = 0;
									for (var i = 0; i < res.devices
										.length; ++i) {
										if (res.devices[i].name !=
											"未知设备" && res
											.devices[i].name != "") {
											devices[num] = res.devices[
												i];
											num++;
											//console.log("蓝牙设备",res.devices[i].name)
											if (res.devices[i].name ==
												app.globalData
												.BLEInformation
												.deviceName && app
												.globalData
												.BLEInformation
												.deviceName != "") {
												console.log("蓝牙打印设备",
													res.devices[i]
													.name)
												app.globalData
													.BLEInformation
													.deviceId = res
													.devices[i]
													.deviceId;
												that.bindAutoTap(res
													.devices[i]
													.deviceId, res
													.devices[i]
													.name);
											}
										}
									}

									that.setData({
										list: devices,
										isScanning: false
									});

									//console.log("that.list======", that.list);
									that.isLink = [];
									var i = 0;
									that.list.forEach(e => {
										that.isLink.push(0)
										i++;
									});
									//console.log("isLink", that.isLink);

									uni.stopPullDownRefresh();
									uni.stopBluetoothDevicesDiscovery({
										success: function(res) {
											//console.log("停止搜索蓝牙");
										}
									});
								}
							});
						}, 5000);
					}
				});
			},
			bindViewTap: function(e) {
				var that = this;
				uni.stopBluetoothDevicesDiscovery({
					success: function(res) {
						console.log(res);
					}
				});
				that.setData({
					serviceId: 0,
					writeCharacter: false,
					readCharacter: false,
					notifyCharacter: false
				});
				//console.log("当前连接蓝牙:", e.currentTarget.dataset.title + "||" + e.currentTarget.dataset.name + "||" + e.currentTarget.dataset.key);

				uni.createBLEConnection({
					deviceId: e.currentTarget.dataset.title,
					success: function(res) {
						//console.log("Connection success:", res);
						that.isLink = that.isLink.map(item => 0);
						that.isLink.splice(e.currentTarget.dataset.key, 0, 1)
						//that.isLink[e.currentTarget.dataset.key] = 1;
						app.globalData.BLEInformation.deviceId = e.currentTarget.dataset.title;
						app.globalData.BLEInformation.deviceName = e.currentTarget.dataset.name;
						that.getSeviceId(e.currentTarget.dataset.title, e.currentTarget.dataset.name);
					},
					fail: function(e) {
						uni.showModal({
							title: "提示",
							content: "连接失败",
							showCancel: false
						});
						console.log("蓝牙Connection fail:", e);
						that.isLink.splice(e.currentTarget.dataset.key, 0, 0)
						uni.hideLoading();
					},
					complete: function(e) {
						console.log("Connection complete:", e);
					}
				});
			},
			bindAutoTap: function(deviceId, deviceName) {
				console.log("当前连接蓝牙", deviceId + "||" + deviceName);
				var that = this;
				uni.stopBluetoothDevicesDiscovery({
					success: function(res) {
						console.log(res);
					}
				});
				that.setData({
					serviceId: 0,
					writeCharacter: false,
					readCharacter: false,
					notifyCharacter: false
				});

				uni.createBLEConnection({
					deviceId: deviceId,
					success: function(res) {
						//console.log("Connection success:", res);
						app.globalData.BLEInformation.deviceId = deviceId;
						that.getSeviceId(deviceId, deviceName);
					},
					fail: function(e) {
						uni.showModal({
							title: "提示",
							content: "连接失败",
							showCancel: false
						});
						console.log("蓝牙Connection fail:", e);
						uni.hideLoading();
					},
					complete: function(e) {
						console.log("Connection complete:", e);
					}
				});
			},
			getSeviceId: function(deviceId, deviceName) {
				//console.log("getSeviceId",deviceName)
				var that = this;
				var platform = app.globalData.BLEInformation.platform;
				uni.getBLEDeviceServices({
					deviceId: app.globalData.BLEInformation.deviceId,
					success: function(res) {
						console.log(res);

						that.setData({
							services: res.services
						});
						that.getCharacteristics(deviceId, deviceName);
					},
					fail: function(e) {
						console.log(e);
					},
					complete: function(e) {
						console.log(e);
					}
				});
			},
			getCharacteristics: function(deviceId, deviceName) {
				//console.log("getCharacteristics",deviceName)
				var that = this;
				var list = that.services;
				var num = that.serviceId;
				var write = that.writeCharacter;
				var read = that.readCharacter;
				var notify = that.notifyCharacter;
				uni.getBLEDeviceCharacteristics({
					deviceId: app.globalData.BLEInformation.deviceId,
					serviceId: list[num].uuid,
					success: function(res) {
						console.log(res);

						for (var i = 0; i < res.characteristics.length; ++i) {
							var properties = res.characteristics[i].properties;
							var item = res.characteristics[i].uuid;

							if (!notify) {
								if (properties.notify) {
									app.globalData.BLEInformation.notifyCharaterId = item;
									app.globalData.BLEInformation.notifyServiceId = list[
										num].uuid;
									notify = true;
								}
							}

							if (!write) {
								if (properties.write) {
									app.globalData.BLEInformation.writeCharaterId = item;
									app.globalData.BLEInformation.writeServiceId = list[
										num].uuid;
									write = true;
								}
							}

							if (!read) {
								if (properties.read) {
									app.globalData.BLEInformation.readCharaterId = item;
									app.globalData.BLEInformation.readServiceId = list[num]
										.uuid;
									read = true;
								}
							}
						}

						if (!write || !notify || !read) {
							num++;
							that.setData({
								writeCharacter: write,
								readCharacter: read,
								notifyCharacter: notify,
								serviceId: num
							});

							if (num == list.length) {
								uni.showModal({
									title: "提示",
									content: "找不到该读写的特征值",
									showCancel: false
								});
							} else {
								that.getCharacteristics(deviceId, deviceName);
							}
						} else {
							uni.showToast({
								title: "连接成功" + deviceName
							});
							app.globalData.BLEInformation.deviceId = deviceId;
							app.globalData.BLEInformation.deviceName = deviceName;
							app.globalData.YN_PRINT_CON = "Y";
							that.YN_PRINT_CON = "Y";
							console.log("连接成功 deviceName", app.globalData.BLEInformation.deviceName +
								"||" + app.globalData.YN_PRINT_CON)

							that.isLink = [];
							var i = 0;
							that.list.forEach(e => {
								if (e.deviceId == app.globalData.BLEInformation.deviceId) {
									that.isLink.push(1)
								} else {
									that.isLink.push(0)
								}
								i++;
							});

						}
					},
					fail: function(e) {
						console.log(e);
					},
					complete: function(e) {
						console.log("write:" + app.globalData.BLEInformation
							.writeCharaterId);
						console.log("read:" + app.globalData.BLEInformation
							.readCharaterId);
						console.log("notify:" + app.globalData.BLEInformation
							.notifyCharaterId);
					}
				});
			},
			//断开所有已经建立的连接，释放系统资源，要求在蓝牙功能使用完成后调用
			closeBluetoothAdapter() {
				let that = this;
				plus.bluetooth.closeBluetoothAdapter({
					success: function(e) {
						app.globalData.YN_PRINT_CON = "N";
						that.YN_PRINT_CON = "N";
						console.log('close success: ' + JSON.stringify(e));
					},
					fail: function(e) {
						console.log('close failed: ' + JSON.stringify(e));
					}
				});
			},
			//断开蓝牙连接
			closeBLEConnection(deviceId, index) {
				const that = this
				plus.bluetooth.closeBLEConnection({
					deviceId: deviceId,
					success: res => {
						console.log('断开蓝牙连接closeBLEConnection======', deviceId)
						app.globalData.YN_PRINT_CON = "N";
						that.YN_PRINT_CON = "N";
						that.isLink.splice(index, 0, 0)
					}
				})
			},
			clearIntervalFun: function() {
				clearInterval(that.intervalId); //清除计时器
				that.intervalId = null; //设置为null
			},
			//手动直接发起签到
			Sign: function() {
				// that.showSign = true;
				util.simpleModal("提示", "是否确认签到？", res => {
					if (res) {
						_login.SignOrSignOut(true, "", res => {
							console.log("手动签到结果：", res);
							if (res.code) {
								util.simpleMsg("签到成功！");
								let data = JSON.parse(res.data);
								if (data.sql) {
									_login.SignOrSignOutSql(data.sql);
								}
							} else {
								util.simpleModal("提示", res.msg);
							}
						})
					}
				})
			},
			//获取一周内是否有未日结的数据
			GetSignOutInWeek: function(t, func) {

				console.log("进入日结搜索方法");
				that.showSign = false; //关闭签到组件
				_login.GetSignOutInWeek(res => {
					console.log("是否有日结数据：", res);
					if (res.code) {
						if (t) { //主动触发
							that.showSignOut = true;
							that.signOutDate = JSON.parse(res.data); // ["2022/9/1","2022/8/31"]; 
						} else { //自动触发
							uni.showModal({
								title: "提示",
								content: res.msg,
								showCancel: false,
								success: e => {
									if (e.confirm) {
										console.log("点击了确定");
										that.showSignOut = true;
										that.signOutDate = JSON.parse(res
											.data); // ["2022/9/1","2022/8/31"]; 
									}
								}
							})
						}
					} else {
						if (t) {
							util.simpleMsg("暂无日结数据", true);
						}
					}
				})
			},
			//去日结 废弃
			ToSignOut: () => {
				//查询一周内是否有未日结的数据
				that.GetSignOutInWeek(1);
			},
			//关闭日结框
			CloseSignOut: function(res) {
				console.log("父组件被通知事件");
				that.showSignOut = false;
			},
			//直接发起日结
			ConfirmRJ: e => {
				util.simpleModal("提示", "是否进行今日日结？", res => {
					if (res) {
						let qtdate = dateformat.getYMD();
						if (qtdate) {
							_login.SignOrSignOut(false, qtdate, res => {
								console.log("时间4");
								console.log("日结结果：", res);
								if (res.code) {
									util.simpleMsg("日结成功！");
									let data = JSON.parse(res.data);
									if (data.sql) {
										_login.SignOrSignOutSql(data.sql);
									}
								} else {
									util.simpleModal("提示", res.msg);
								}
							})
						} else {
							util.simpleMsg("日结日期为空", true);
						}
					}
				})
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

	.critlist view text {
		display: inline-block;
		width: 180rpx;
		text-align: right;
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
		max-height: 700rpx;
		overflow: auto;
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
		font-size: 28rpx;
		margin: 0;
	}

	.b_critlist view .b_has {
		background-color: #B0b0b0;
	}

	/* 消息 */
	.tally label text {
		display: inline-block;
		width: 80%;
	}

	.checkout .rijie {
		display: flex;
		align-items: center;
		background: none;
		height: 68rpx;
		line-height: 68rpx;
		margin-left: 20rpx;
		vertical-align: middle;
	}

	.checkout .rijie image {
		margin-right: 0;
	}

	.checkout .rijie button {
		color: #FE694B;
		height: 44rpx;
		line-height: 44rpx;
		font-size: 26rpx;
		padding: 0 10rpx 0 2rpx;
		background: none;
		margin-left: 0;
	}

	.checkout .shexiao {
		background: #006B44;
		color: #fff;
	}
</style>
