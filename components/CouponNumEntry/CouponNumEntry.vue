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
				<view class="h1">录入券号<button class="close" @click="Cancel">×</button></view>
				<view class="number">
					<view class="labnum">
						<text>开始卡号：</text>
						<view class="label">
							<image src="@/images/img2/zhifucx-cu.png" mode="widthFix"
								@click="ScanCodeHandle('beginNum')"></image>
							<input type="number" placeholder="请录入券号" v-model="beginNum" :focus="curFocus=='beginNum'"
								@confirm="ScanCodeHandle('beginNum')" @focus="curFocus='beginNum'" />
							<button v-if="beginNum" @click="beginNum=''">×</button>
						</view>
						<!-- <view class="classifys">
							<text @click="single=true" :class="single ? 'curr' : ''">单</text>
							<text @click="single=false" :class="single ? '' : 'curr'">多</text>
						</view> -->
					</view>
					<!-- <view class="labnum" v-if="!single">
						<text>截止卡号：</text>
						<view class="label">
							<image src="@/images/img2/zhifucx-cu.png" mode="widthFix" @click="ScanCodeHandle('endNum')">
							</image>
							<input type="number" placeholder="请输入截止卡号" v-model="endNum" :focus="curFocus=='endNum'"
								@confirm="ScanCodeHandle('endNum')" @focus="curFocus='endNum'" />
							<button v-if="endNum" @click="endNum=''">×</button>
						</view class="label">
					</view> -->
					<label><text>使用摄像头扫码：</text>
						<radio class="purple" :checked="scan_code" @click="scan_code = !scan_code"></radio>
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
				beginNum: "",//900000000002243485
				endNum: "", 
				scan_code: false, //是否刷卡
				single: true, //是否单卡
				curFocus: "beginNum", //默认定位到起始卡号
				store: getApp().globalData.store,
			};
		},
		watch: {
			// ywtype: {
			// 	immediate: true,
			// 	handler: function(n, o) {
			// 		console.log("业务类型发生变动:", n);
			// 		if (n == 'VIPCard_Active' || n == 'VIPCard_Recharge') {
			// 			this.single = true;
			// 		} else {
			// 			this.single = false;
			// 		}
			// 	}
			// }
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
				uni.$emit("GetCouponNums", {
					type: "N",
					begin_num: that.beginNum,
					end_num: that.endNum
				})
				that.ResetBill();
			},
			Confirm: function() {
				if (!that.beginNum) {
					_util.simpleMsg("请录入券号", true);
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
				console.log("即将回调的卡号:", that.beginNum + "-" + that.endNum);
				this.$emit("update:show", false);
				uni.$emit("GetCouponNums", {
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
				} else {
					that.curFocus = "beginNum";
					_util.simpleMsg("请使用扫码枪扫码", 'none');
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
	.purple .uni-radio-input.uni-radio-input-checked{
		background-color: #006B44 !important;
		border-color: #006B44 !important;
		color: #ffffff !important;
	}
	.purple:not([disabled]) .uni-radio-input:hover {
	    border-color: #006B44 !important;
	}
	.purple:not([disabled]) .uni-radio-input:hover, uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
	  border-color: #006B44!important;
	}
	.purple .uni-radio-input.uni-radio-input-checked{
			background-color: #248067!important;
			border-color: #248067!important;
			background-clip: content-box!important;
			padding: 6rpx!important;
			box-sizing: border-box;
		}
	
	/* radio 选中后的图标样式*/
	.purple .uni-radio-input.uni-radio-input-checked::before{
		display: none!important;
	}
</style>
