<template>
	<view>
		请输入手机号码/会员号：
		<input type="text" v-model="numbers" />
		<button @click="query()">查询</button>
		<button @click="Codequery()">扫码查询</button>
		<view>
			<p>昵称：{{hyinfo.NickName}}</p>
			<p>性别：{{hyinfo.Sex}}</p>
			<p>会员号：{{hyinfo.hyId}}</p>
			<p>电话：{{hyinfo.Phone}}</p>
			<p>余额：{{hyinfo.Balance}}</p>
			<p>积分：{{hyinfo.JFBalance}}</p>
			<p>等级：{{hyinfo.hy_Level.LevelName}}</p>
			<p>生日：{{hyinfo.Birthday}}</p>
		</view>
		<!-- <p>优惠券====================</p>
		<view v-if="couponlst.length>0">
			<view v-for="(item,index) in couponlst" :key="index">
				<p>名称：{{item.sname}}</p>
				<p>面额：{{item.money}}元</p>
				<p>有效期：{{item.sdate}}至{{item.edate}}</p>
				<button @click="couponUse(item)">去使用</button>
			</view>
		</view> -->
		<view>
			<uni-popup ref="popup" type="center" :maskClick="false">
				<view class="uni-tip">
					<button @click="close">关闭</button>
					会员码：
					<input confirm-type="confirm" @confirm="search" v-model="code">
				</view>
			</uni-popup>
		</view>
	</view>
</template>
<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue';
	import hy from '@/api/hy/hy_query.js';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: null,
				typeName: null,
				numbers: null,
				content: null,
				brand: getApp().globalData.brand,
				KHID: getApp().globalData.store.KHID,
				code: null,
				hyinfo: {
					hyId: null,
					CardNo: null,
					AllinPayAccount: null,
					AliPayId: null,
					AllinPayCardNo: null,
					ActivityId: null,
					youzanId: null,
					Balance: null,
					JFBalance: null,
					JFFactor: null,
					Name: null,
					NickName: null,
					CertNum: null,
					Phone: null,
					Birthday: null,
					Avatar: null,
					Sex: null,
					CountryCode: null,
					ProvinceCode: null,
					CityCode: null,
					DistrictCode: null,
					OrgCode: null,
					Area_code: null,
					Area: null,
					OpenId: null,
					AppId: null,
					UnionId: null,
					ynhyk: null,
					Vamt: null,
					Couponnum: null,
					CardType: null,
					RegisterDay: null,
					CreateTime: null,
					Status: null,
					ktypename: null,
					giftcard: [],
					hy_Level: {
						hyId: null,
						CardNo: null,
						CardType: null,
						ShowIndex: null,
						dValue: null,
						Level: null,
						LevelName: null,
						CardLevel: null,
						nextLevelName: null,
						JFBalance: null,
						Balance: null,
						ExpDate: null,
						CardStatus: null,
						TotalRefundAmount: null,
						TotalConsumeAmount: null
					},
					hy_Assets: {
						hyId: null,
						GiftAmt: null,
						GiftDisAmt: null,
						OverdueValue: null,
						FreezeValue: null,
						eVipDisAmt: null
					}
				},
				couponlst: []
			}
		},
		watch: {
			numbers: function(n, o) {
				// uni.setStorageSync("hyid",n);
			}
		},
		methods: {
			close: function() {
				this.$refs['popup'].close();
			},
			query: function() {
				let that = this;
				if (!that.numbers) {
					util.simpleMsg("请输入手机号码/会员号码", "none");
					return;
				}
				that.hyinfo = hy.hyinfoModel;
				hy.HyQuery(that.numbers,
					function(res) {
						if (res.code) {
							that.hyinfo = JSON.parse(res.data);
							that.hyinfo.Balance = (that.hyinfo.Balance / 100).toFixed(2);
							getApp().globalData.hyinfo = that.hyinfo;
							uni.setStorageSync("hyinfo", that.hyinfo);
							// console.log("会员信息：", getApp().globalData.hyinfo.hyId);
							//查询优惠券信息
							// let No;
							// if (that.barnd == 'KG') {
							// 	No = that.hyinfo.hyId;
							// } else {
							// 	No = that.hyinfo.Phone;
							// }
							// hy.couponlst(No, function(res) {
							// 	if (res.code) {
							// 		that.couponlst = JSON.parse(res.data);
							// 	}
							// })
						} else {
							util.simpleMsg("错误：" + res.msg, true);
						}
					});
			},
			Codequery: function() {
				let that = this;
				// that.code = that.numbers;
				// that.search();
				// return;
				//this.$refs['popup'].open();
				// that.code='ZY3322595874469644';
				// that.search();
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.code = res.result;
						that.search();
					}
				});
			},
			search: function() {
				let that = this;
				if (!that.code) {
					util.simpleMsg("请扫会员码", true);
					return;
				}
				let obj = {
					khid: that.KHID,
					code: that.code
				}
				// console.log("会员查询请求参数：", obj);
				that.hyinfo = hy.hyinfoModel;
				hy.HyCodeQuery(obj,
					function(res) {
						if (res.code) {
							that.hyinfo = JSON.parse(res.data);
							that.hyinfo.Balance = (that.hyinfo.Balance / 100).toFixed(2);
							getApp().globalData.hyinfo = that.hyinfo;
						} else {
							util.simpleMsg(res.msg, "none");
						}
						that.$refs['popup'].close();
					});
			},
			//券使用
			couponUse: function(e) {
				console.log("券信息：", e.sname);
				uni.navigateTo({
					url: "../Payment/Payment?lqid=" + e.lqid + e.code
				})
			}
		},
		onLoad() {
			// this.numbers = uni.getStorageSync("hyid");
		}
	}
</script>

<style>
	.style_div {
		width: 100%;
		/*盒子宽自己设置想要的宽度*/
		height: auto;
		/*高度自动*/
		display: inline-block;
		/*转为行内块元素*/
		white-space: pre-wrap;
		/*处理元素内的空白,保留空白符序列，但是正常地进行换行*/
		word-wrap: break-word;
		/*允许长单词或 URL 地址换行到下一行,在长单词或 URL 地址内部进行换行*/
	}

	.uni-tip {
		background: #fff;
		width: 70%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		border-radius: 10px;
	}

	.uni-tip-title {
		text-align: center;
		font-size: 16px;
	}

	.uni-tip-group-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-content: center;
	}

	.uni-tip-group-button button {
		margin: 0;
	}

	.uni-tip-content {
		min-height: 60px;
	}
</style>
