<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
</style>
<template>
	<view v-show="show">
		<view class="boxs">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="h1">录入卡号(单卡业务：起始号，截至号一致) <button class="close" @click="Cancel">×</button></view>
				<view class="number">
					<label>
						<text>开始卡号：</text>
						<input type="text" placeholder="请输入开始卡号" v-model="beginNum" />
					</label>
					<label>
						<text>截止卡号：</text>
						<input type="text" placeholder="请输入截止卡号" v-model="endNum" />
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
	var that;
	export default {
		name: "CardNumEntry",
		props: {
			begin_num: String,
			end_num: String,
			yetype: String,
			show: Boolean
		},
		created() {
			that = this;
			that.ywType = that.yetype;
		},
		data() {
			return {
				ywType: "",
				beginNum: "400000005787446369",
				endNum: "",
			};
		},
		methods: {
			Cancel: function() {
				console.log("事件触发");
				this.$emit("update:show",false);
				uni.$emit("GetCardNums", {
					type: "N",
					begin_num: that.beginNum,
					end_num: that.endNum
				})
			},
			Confirm: function() {
				console.log("事件触发");
				if (!that.beginNum) {
					_util.simpleMsg("请输入起始卡号");
					return;
				}
				if (!that.endNum) {
					_util.simpleMsg("请输入截止卡号");
					return;
				}
				this.$emit("update:show",false);
				uni.$emit("GetCardNums", {
					type: "Y",
					begin_num: that.beginNum,
					end_num: that.endNum
				})
			}
		}
	}
</script>

<style>

</style>
