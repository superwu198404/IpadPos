<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/message.css);
</style>

<template>
	<view class="cash-limit-box" v-show="visible">
		<view class="cash-limit-contain">
			<view class="cash-limit-head">
				<span>现金支付提示</span>
			</view>
			<view class="cash-limit-content">
				{{ text }}
			</view>
			<view class="cash-limit-countdown" v-if="!unlocked">
				请阅读提示，{{ remain }} 秒后可确认
			</view>
			<view class="cash-limit-btn-groups">
				<button class="btn btn-qx" @click="Cancel">取消</button>
				<button class="btn btn-qr btn-flex" :disabled="!unlocked" :class="{ 'btn-disabled': !unlocked }"
					@click="Confirm">
					{{ unlocked ? '确定' : remain + 's' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			visible: Boolean,
			text: String,
			seconds: {
				type: Number,
				default: 10
			}
		},
		data() {
			return {
				remain: 0,
				unlocked: false,
				timer: null
			}
		},
		watch: {
			visible: function(n) {
				if (n) {
					this.StartCountdown();
				} else {
					this.StopCountdown();
				}
			}
		},
		methods: {
			// 每次打开都从 seconds 重新开始，【确定】重新置灰
			StartCountdown: function() {
				this.StopCountdown();
				this.unlocked = false;
				this.remain = this.seconds;
				this.timer = setInterval(() => {
					this.remain = this.remain - 1;
					if (this.remain <= 0) {
						this.StopCountdown();
						// 倒计时结束只是解锁【确定】，弹窗不关、不自动做任何事
						this.unlocked = true;
						this.remain = 0;
					}
				}, 1000);
			},
			// 必须清定时器，否则弹窗关闭后定时器仍在跑
			StopCountdown: function() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			Confirm() {
				if (!this.unlocked) return; // 倒计时期间【确定】置灰不可点
				this.StopCountdown();
				this.$emit("update:visible", false);
				uni.$emit("cash-limit-confirm");
			},
			Cancel() {
				this.StopCountdown();
				this.$emit("update:visible", false);
				uni.$emit("cash-limit-cancel");
			}
		},
		beforeDestroy() {
			this.StopCountdown();
		}
	}
</script>

<style>
	.cash-limit-box {
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999999;
		top: 0;
		left: 0;
	}

	.cash-limit-head {
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 70rpx;
		padding: 0 2%;
		font-size: 32rpx;
		font-weight: bold;
	}

	.cash-limit-contain {
		width: 40%;
		display: flex;
		flex-direction: column;
		background-color: white;
		padding: 5px;
		box-sizing: border-box;
		box-shadow: 0px 3px 40px 1px rgba(66, 177, 75, 0.4);
		border-radius: 10rpx;
	}

	.cash-limit-content {
		flex: 1;
		padding: 50px 10px;
		font-size: 46rpx;
		font-weight: 700;
		text-align: center;
		display: block;
	}

	.cash-limit-countdown {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		padding-bottom: 10rpx;
	}

	.cash-limit-btn-groups {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 4% 0 2%;
	}

	.cash-limit-btn-groups .btn {
		width: 250rpx;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 32rpx;
		margin: 0 30rpx;
	}

	.cash-limit-btn-groups .btn-disabled {
		background-color: #ccc !important;
		color: #fff !important;
		border-color: #ccc !important;
	}
</style>
