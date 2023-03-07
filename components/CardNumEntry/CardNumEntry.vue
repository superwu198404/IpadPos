<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>
<template>
	<view v-if="show">
		<view class="boxs">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="h1">录入卡券号<button class="close" @click="Cancel">×</button></view>
				<view class="number">
					<view class="labnum">
						<text>开始卡号：</text>
						<view class="label">
							<image src="@/images/img2/zhifucx-cu.png" mode="widthFix"
								@click="ScanCodeHandle('beginNum')"></image>
							<input type="number" placeholder="请输入开始卡号" v-model="beginNum" :focus="curFocus=='beginNum'"
								@confirm="ScanCodeHandle('beginNum')" @focus="curFocus='beginNum'" />
							<button v-if="beginNum" @click="beginNum=''">×</button>
						</view>
						<view class="classifys" v-if="ywtype!='VIPCard_Active'&&ywtype!='VIPCard_Recharge'">
							<text @click="single=true" :class="single ? 'curr' : ''">单</text>
							<text @click="single=false" :class="single ? '' : 'curr'">多</text>
						</view>
					</view>
					<view class="labnum" v-if="!single">
						<text>截止卡号：</text>
						<view class="label">
							<image src="@/images/img2/zhifucx-cu.png" mode="widthFix" @click="ScanCodeHandle('endNum')">
							</image>
							<input type="number" placeholder="请输入截止卡号" v-model="endNum" :focus="curFocus=='endNum'"
								@confirm="ScanCodeHandle('endNum')" @focus="curFocus='endNum'" />
							<button v-if="endNum" @click="endNum=''">×</button>
						</view class="label">
					</view>
					<label><text>启用扫码操作：</text>
						<radio :checked="scan_code" @click="scan_code = !scan_code"></radio>
					</label>
				</view>
				<view class="confirm">
					<button class="btn btn-qx" @click="Cancel">取消</button>
					<button class="btn" @click="Confirm">确认</button>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import _util from "@/utils/util.js";
	import _member from "@/api/hy/MemberInterfaces.js";
	var that, $;
	export default {
		name: "CardNumEntry",
		props: {
			ywtype: {
				type: String,
				default: ""
			},
			show: Boolean
		},
		data() {
			return {
				// ywType: "",
				beginNum: "", //1087111000002638
				endNum: "", //1087111000002658
				scan_code: false, //是否刷卡
				single: false, //是否单卡
				curFocus: "beginNum", //默认定位到起始卡号
				store: getApp().globalData.store,
			};
		},
		watch: {
			ywtype: {
				immediate: true,
				handler: function(n, o) {
					console.log("业务类型发生变动:", n);
					if (n == 'VIPCard_Active' || n == 'VIPCard_Recharge') {
						this.single = true;
					} else {
						this.single = false;
					}
				}
			}
		},
		created() {
			that = this;
			$ = _util.callContainer(this);
			that.store = _util.getStorage("store");
		},
		methods: {
			Cancel: function() {
				console.log("事件触发");
				this.$emit("update:show", false);
				uni.$emit("GetCardNums", {
					type: "N",
					begin_num: that.beginNum,
					end_num: that.endNum
				})
				that.ResetBill();
			},
			Confirm: function() {
				if (!that.beginNum) {
					_util.simpleMsg("请输入起始卡号", true);
					return;
				}
				if (!that.single) {
					if (!that.endNum) {
						_util.simpleMsg("请输入截止卡号", true);
						return;
					}
				} else {
					that.endNum = that.beginNum;
				}
				console.log("即将回调的卡号:", that.beginNum);
				console.log("即将回调的卡号1:", that.endNum);
				this.$emit("update:show", false);
				uni.$emit("GetCardNums", {
					type: "Y",
					begin_num: that.beginNum,
					end_num: that.endNum
				})
				that.ResetBill();
			},
			//变量重置
			ResetBill: function() {
				//重置操作
				setTimeout(() => {
					that.curFocus = "beginNum";
					that.scan_code = false;
					that.curFocus = false;
					that.beginNum = "";
					that.endNum = "";
				}, 500);
			},
			ScanCodeHandle: function(prop) {
				// prop = that.curFocus;
				that.curFocus = prop;

				console.log("[ScanCodeHandle]对应属性名称:", prop);
				if (this.scan_code) { //扫码
					uni.scanCode({
						success: $(function(result) {
							console.log("[ScanCodeHandle]扫码结果:", result);
							if (prop in this) {
								this[prop] = result.result;
								if (prop == "beginNum") {
									if (that.single) {
										this.endNum = result.result;
									} else {
										that.curFocus = "endNum";

									}
								}
							} else
								console.log("[ScanCodeHandle]属性不存在...");
						})
					})
				} else { //刷卡
					_member.GetTLCard(that.store, res => {
						if (!res.code) {
							_util.simpleMsg(res.msg, !res.code);
							return;
						}
						that[prop] = res.data;
						if (prop == "beginNum") {
							if (that.single) {
								this.endNum = res.data;
							} else {
								that.curFocus = "endNum";
							}
						}
					})
				}
			}
		}
	}
</script>

<style>
	.popup {
		position: relative;
	}

	.popup .tchw {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
</style>
