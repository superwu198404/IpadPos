<template>
	<view>
	 
		请输入会员手机号码/会员号：
		<input type="text" v-model="mumbers" />
		<button @click="query()">查询</button>
		<button @click="Codequery()">扫码查询</button>
		卡号:
		<p>{{hyinfo.CardNo}}</p>
		昵称:
		<p>{{hyinfo.NickName}}</p>
		性别:
		<p>{{hyinfo.Sex}}</p>
		电话:
		<p>{{hyinfo.Phone}}</p>
		生日:
		<p>{{hyinfo.Birthday}}</p>
		等级:
		<p>{{hyinfo.hy_Level.LevelName}}</p>
		账户余额:
		<p>{{hyinfo.Balance}}</p>
		积分余额:
		<p>{{hyinfo.JFBalance}}</p>
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
	import hy from '@/utils/hy/hy_query.js'; 
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: null,
				typeName: null,
				mumbers: null,
				content: null, 
				barnd: getApp().globalData.brand,
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
				}
			}
		},
		methods: {
			close: function() {
				this.$refs['popup'].close();
			},
			query: function() {
				let that = this;
				if (!that.mumbers) {
					uni.showToast({
						title: "请输入手机号码/会员号码",
						icon: "error"
					});
					return;
				}
				that.hyinfo = hy.hyinfoModel;
				hy.HyQuery(that.mumbers,
					function(res) {
						if (res.code) {
							that.hyinfo = JSON.parse(res.data);
							getApp().globalData.hyinfo = that.hyinfo;
						} else {
							uni.showToast({
								title: res.msg,
								icon: "error"
							});
						}
					});
			},
			Codequery: function() {
				this.$refs['popup'].open();
			},
			search: function() {
				let that = this;
				if (!that.code) {
					uni.showToast({
						title: "请输入会员码",
						icon: "error"
					});
					return;
				}
				let obj;
				if (that.brand == 'KG') {
					obj = {
						KHID: that.KHID,
						code: that.code
					}
				} else {
					obj = that.code;
				}
				that.hyinfo = hy.hyinfoModel;
				hy.HyCodeQuery(obj,
					function(res) {
						if (res.code) {
							that.hyinfo = JSON.parse(res.data);
							getApp().globalData.hyinfo = that.hyinfo;
						} else {
							uni.showToast({
								title: res.msg,
								icon: "error"
							});
						}
						that.$refs['popup'].close();
					});
			}
		},
		onLoad() {

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
