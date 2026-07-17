<template>
	<view class="centre">
		<image class="bg" src="../../images/chushihua.png" mode="widthFix"></image>
		<view class="subject">
			<view class="hh">
				<view class="h1">系统初始化</view><text>Initialize</text>
			</view>
			<view class="infos">
				<label>
					<image src="../../images/dx-mendian.png" mode="widthFix"></image>
					<input placeholder="请输入门店的编码" v-model="khid" />
				</label>
				<label>
					<image src="../../images/dx-kuantai.png" mode="widthFix"></image>
					<input placeholder="请输入款台号" v-model="posid" type="number" />
				</label>
				<label>
					<image src="../../images/dx-kuantai.png" mode="widthFix"></image>
					<input placeholder="请输入初始化密码" v-model="poskey" password="true" />
				</label>
			</view>
			<view class="operate">
				<button class="btn" @click="init">初始化</button>
				<!-- <button @click="toDbqry">数据查看</button> -->
			</view>
		</view>

		<!-- 隐私政策弹窗 -->
		<view class="privacy-mask" v-if="showPrivacyModal" @touchmove.stop.prevent>
			<view class="privacy-modal">
				<view class="privacy-title">用户协议及隐私政策</view>
				<view class="privacy-content">
					<view class="privacy-intro">
						欢迎使用本APP，我们将依据本APP用户协议、隐私政策、第三方信息共享清单来帮助您了解我们在收集、使用、存储和共享您个人信息的情况以及您享有的相关权利。请您点击下方链接查看并仔细阅读以了解详细信息。
					</view>
					<view class="privacy-agreement">
						点击同意或注册、使用本APP视为您已详细阅读，并同意
						<text class="privacy-link" @click="openPrivacyDoc('用户协议')">用户协议</text>、
						<text class="privacy-link" @click="openPrivacyDoc('隐私政策')">隐私协议</text>、
						<text class="privacy-link" @click="openPrivacyDoc('第三方信息共享清单')">第三方信息共享清单</text>
					</view>
				</view>
				<view class="privacy-buttons">
					<button class="btn-agree" @click="agreePrivacy">同意</button>
					<button class="btn-disagree" @click="disagreePrivacy">不同意并退出</button>
				</view>
			</view>
		</view>

		<!-- 文档查看弹窗 -->
		<view class="doc-mask" v-if="showDocModal" @touchmove.stop.prevent>
			<view class="doc-modal">
				<view class="doc-header">
					<text class="doc-title">{{ docTitle }}</text>
					<text class="doc-close" @click="closeDocModal">×</text>
				</view>
				<scroll-view class="doc-content" scroll-y="true">
					<text class="doc-text">{{ docContent }}</text>
				</scroll-view>
			</view>
		</view>
	</view>
</template>
<style>
	.centre {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.centre .bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.subject {
		width: 40%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		box-shadow: 0px 20rpx 40rpx 1px rgba(66, 177, 75, 0.16);
		border-radius: 40rpx;
		padding: 4% 5%;
	}

	.subject .hh {
		display: flex;
		flex-direction: column;
		font-size: 58rpx;
		color: #006B44;
	}

	.subject .hh .h1 {
		font-size: 70rpx;
		line-height: 90rpx;
		font-weight: 700;
	}

	.infos {
		margin-top: 10%;
	}

	.infos label {
		background-color: #E0EAE9;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 12rpx;
		width: 94%;
		display: flex;
		align-items: center;
		margin: 5% 0;
		padding: 0 3%;
	}

	.infos label input {
		width: 86%;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 20rpx;
	}

	.infos image {
		width: 38rpx;
		height: 36rpx;
	}

	.operate {
		margin-top: 15%;
	}

	.operate .btn {
		background-color: #006B44;
		color: #fff;
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 20rpx;
	}
</style>

<script>
	import Req from '@/utils/request.js';
	import sqlLite from '@/utils/db/db_excute.js';
	import _create_sql from '@/utils/db/create_sql.js';
	import util from '@/utils/util.js';
	import privacyContent from '@/privacy/privacyContent.js';

	var mysqlite = sqlLite.get();
	var that = null;

	export default {

		data() {
			return {
				initok: false,
				errstr: "",
				tx001: null,
				khid: "", //'K0101QT2',//108通讯 测试使用
				posid: "", //"8",//108通讯 测试使用
				poskey: "", //pos初始化的密码
				yninit: false,
				showmsg: "门店基础数据初始化",
				showPrivacyModal: false, // 隐私弹窗显示状态
				showDocModal: false, // 文档弹窗显示状态
				docTitle: "", // 文档标题
				docContent: "" // 文档内容
			}
		},
		methods: {
			onLoad() {

				that = this;

				// 检查隐私授权状态
				this.checkPrivacyAgreed();

				// util.setStorage("Init_Data", {KHID:"K200QTD005",POSID:"1"});
				// let Init_Data = util.getStorage("Init_Data");
				// if (Init_Data && JSON.stringify(Init_Data) != '{}') { //初始化过
				// 	uni.navigateTo({
				// 		url: "/pages/Login/Login"
				// 	});
				// } else {
				// 	let store = util.getStorage("store");
				// 	if (store && JSON.stringify(store) != "{}") {
				// 		that.khid = store.KHID;
				// 		that.posid = store.POSID;
				// 	}
				// }
				util.setStorage('open-loading', true);
				//用于重读时的赋值
				let store = util.getStorage("Init_Data");
				if (store && JSON.stringify(store) != "{}") {
					that.khid = store.KHID;
					that.posid = store.POSID;
				}
			},
			// 检查是否已同意隐私政策
			checkPrivacyAgreed() {
				const privacyAgreed = util.getStorage("Privacy_Agrereed");
				if (!privacyAgreed) {
					// 未同意过，显示隐私弹窗
					this.showPrivacyModal = true;
				}
			},
			// 同意隐私政策
			agreePrivacy() {
				util.setStorage("Privacy_Agrereed", true);
				this.showPrivacyModal = false;
			},
			// 不同意并退出
			disagreePrivacy() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == 'ios') {
					plus.ios.import("UIApplication").sharedApplication()
						.performSelector("exit")
				} else if (uni.getSystemInfoSync().platform == 'android') {
					plus.runtime.quit();
				}
				// #endif
				// #ifdef H5
				window.close();
				// #endif
			},
			// 打开隐私文档
			openPrivacyDoc(docName) {
				this.docTitle = docName;
				this.docContent = privacyContent[docName] || '文档加载失败';
				this.showDocModal = true;
			},
			// 关闭文档弹窗
			closeDocModal() {
				this.showDocModal = false;
			},
			toDbqry: function() {
				uni.navigateTo({
					url: "/pages/sqlitetest/sqlitetest"
				});
			},
			toIndex: function() {
				uni.navigateTo({
					url: "/pages/index/index"
				});
			},
			toMainSale: function() {
				uni.navigateTo({
					url: "/pages/mainSale/MainSale"
				});
			},
			tologin: function() {
				uni.navigateTo({
					url: "/pages/Login/Login"
				});
			},
			toPrinter: function() {
				uni.navigateTo({
					url: "pages/mainSale/MainSale"
				});
			},
			startx: function() {
				//this.init();
				//第一步检查本地数据库是否存在
				var sql = " select  cvalue  from  ipadconfig where  type='KHID'";
				//console.log("开始查询")
				mysqlite.executeQry(sql, "校验本地数据库信息", (res) => {
					this.tx(res)
				}, () => {
					this.init()
				});
			},
			tx: function(res) {
				console.log("准备开始");
				let getkhid = req.getResData(res);
				console.log(getkhid);
			},
			reinit: () => {
				mysqlite.executeQry("SELECT * FROM sqlite_master WHERE type ='table'", "操作中...", res => {
					// console.log("查询的表信息：", res);
					let arr = res.msg.map(r => {
						return "drop table IF EXISTS " + r.name;
					})
					console.log("删除sql:", arr);
					mysqlite.executeSqlArray(arr, "删除中...", res => {
						console.log("表删除成功:", res);
					}, err => {
						console.log("表删除失败:", err);
					})
				})

			},
			init: async function() {
				if (!that.khid) {
					util.simpleMsg("请输入门店编码", "none");
					return;
				}
				if (!that.posid) {
					util.simpleMsg("请输入款台号", "none");
					return;
				}
				if (!that.poskey) {
					util.simpleMsg("请输入密码", "none");
					return;
				}
				console.log("准备开始初始化" + that.khid);
				let apistr = "MobilePos_API.Utils.PosInit.getTx001";
				let reqdata = Req.resObj(true, "开始初始化...", null, apistr, true);
				console.log(JSON.stringify(reqdata));
				Req.asyncFunc(reqdata,
					(res) => {
						console.log("001回调成功");
						that.tx001 = Req.getResData(res);
						// let sysinfo = util.getStorage("sysinfo");
						let reqPosData = {
							"khid": that.khid.trim(),
							"posid": that.posid.trim(),
							"passkey": that.poskey.trim(),
							//"deviceId": sysinfo?.deviceId || "IPADPOS" //传入设备号 注意设备号会随着storage清除而发生改变
						};
						let apistr = "MobilePos_API.Utils.PosInit.reloadsqlite";
						return Req.resObj(true, "初始化中...", reqPosData, apistr, true);
					},
					(res) => {
						let sql = [];
						// console.log("004回调：", res);
						console.log("004回调成功");
						uni.showLoading({
							title: "数据重建中...",
							mask: true
						});
						let tx004 = Req.getResData(res);
						//根据001循环创建表，并生成初始化语句
						this.tx001.forEach(function(item) {
							let arr004 = tx004.filter((item4) => {
								return item4.TABNAME == item.TABNAME
							});
							//console.log( JSON.stringify( arr004));
							let new004 = arr004.map(function(item004) {
								return item.SQLINS + item004.INSSTR
							});
							if (new004.length > 0) //存在数据说明这里有初始化的内容
							{
								sql.push("drop table IF EXISTS " + item.TABNAME);
							}
							sql.push(item.DDLSTR);
							sql = sql.concat(new004);
						});
						sql = sql.concat(_create_sql.TXSql); //追加数据通讯表POS_TXFILE
						sql = sql.concat(_create_sql.PRINTSql); //追加重打记录表POS_XSBILLPRINT
						return Req.resObj(true, "即将完成...", sql);
					},
					async (res) => {
							console.log("数据库重建结果：", res.code);
							that.tx001 = null;
							// console.log("重建数据的sql:", res.data);
							let x = await mysqlite.executeSqlArray(res.data, "开始创建数据库",
								(resks) => {
									console.log("执行语句成功" + res.data.length);
									let reqdata = Req.retData(true, "OK") //对应finally函数的判断;
									return reqdata;
								},
								(res) => {
									cconsole.log("初始化失败了：", res);
									that.initok = false;
									that.errstr = res;
									return Req.retData(false, "start创建失败" + JSON.stringify(errstr))
								}
							);
							return x;
						},
						null,
						(res) => {
							console.log("最终结果：", res);
							that.tx001 = null;
							console.log(JSON.stringify("start创建完成"));

							if (res.msg != "OK") {
								util.simpleModal("提示", res.msg)
							} else {
								util.simpleMsg("初始化完成");
								//储存初始化门店和款台
								util.setStorage("Init_Data", {
									KHID: that.khid,
									POSID: that.posid
								});
								setTimeout(r => {
									uni.redirectTo({
										url: "/pages/Login/Login"
									});
								}, 1000)
							}
						}
				)
			},
		}
	}
</script>

<style>
	/* 隐私弹窗遮罩 */
	.privacy-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 隐私弹窗主体 */
	.privacy-modal {
		width: 80%;
		max-width: 600rpx;
		background-color: #fff;
		border-radius: 24rpx;
		overflow: hidden;
	}

	/* 弹窗标题 */
	.privacy-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		padding: 40rpx 30rpx 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	/* 弹窗内容区 */
	.privacy-content {
		padding: 30rpx;
	}

	/* 第一段浅灰色背景框 */
	.privacy-intro {
		background-color: #f5f5f5;
		padding: 24rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 24rpx;
	}

	/* 第二段协议文本 */
	.privacy-agreement {
		font-size: 26rpx;
		color: #333;
		line-height: 1.8;
	}

	/* 绿色下划线链接 */
	.privacy-link {
		color: #006B44;
		text-decoration: underline;
	}

	/* 按钮区域 */
	.privacy-buttons {
		padding: 20rpx 30rpx 40rpx;
	}

	/* 同意按钮 - 绿色填充 */
	.btn-agree {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #006B44;
		color: #fff;
		font-size: 32rpx;
		border-radius: 44rpx;
		border: none;
		margin-bottom: 20rpx;
	}

	.btn-agree::after {
		border: none;
	}

	/* 不同意按钮 - 白底绿边框 */
	.btn-disagree {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #fff;
		color: #006B44;
		font-size: 32rpx;
		border-radius: 44rpx;
		border: 2rpx solid #006B44;
		box-sizing: border-box;
	}

	.btn-disagree::after {
		border: none;
	}

	/* 文档弹窗遮罩 */
	.doc-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 文档弹窗主体 */
	.doc-modal {
		width: 85%;
		max-width: 700rpx;
		height: 80%;
		background-color: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* 文档头部 */
	.doc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
		flex-shrink: 0;
	}

	.doc-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}

	.doc-close {
		font-size: 48rpx;
		color: #999;
		line-height: 1;
		padding: 0 10rpx;
	}

	/* 文档内容区 */
	.doc-content {
		flex: 1;
		padding: 30rpx;
		overflow-y: auto;
	}

	.doc-text {
		font-size: 26rpx;
		color: #333;
		line-height: 1.8;
		white-space: pre-wrap;
	}
</style>