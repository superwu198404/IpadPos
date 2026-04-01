<template>
	<view>
		<view class="modal-mask" v-show="show" @click="close"></view>

		<view class="modal-content" v-show="show" @click.stop>
			<view class="modal-title">提示</view>
			<view class="modal-tip">{{ tipText }}</view>

			<input class="modal-input" v-model="scanCode" placeholder="请输入" auto-focus :focus="isFocus"
				@keyup.enter.prevent="onScanEnter" @confirm.prevent="onScanEnter" />

			<view class="modal-btns">
				<view class="btn cancel" @click="close">取消</view>
				<view class="btn confirm" @click="onConfirm">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	export default {
		name: "ScanModal",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			tipText: {
				type: String,
				default: "扫码录入裱花任务！"
			}
		},
		data() {
			return {
				scanCode: "",
				isFocus: false,
				scanTimer: null, // 防抖定时器
				// 扫码间隔（毫秒）：连续输入间隔 > 此值视为结束
				scanDelay: 100
			};
		},
		watch: {
			show(val) {
				if (val) {
					this.scanCode = "";
					this.timer = setTimeout(() => {
						this.isFocus = true;
						clearTimeout(this.timer)
					}, 200)
				}
			}
		},
		methods: {
			close() {
				this.scanCode = "";
				this.isFocus = false;
				this.$emit("update:show", false);
			},
			/**
			 * 输入防抖：扫码枪高速输入，延迟处理
			 */
			onInput(e) {
				// 清除上一次定时器
				clearTimeout(this.scanTimer)

				// 从事件对象取值（比 v-model 更准、更快）
				const val = e.target.value

				this.scanTimer = setTimeout(() => {
					// 这里拿到完整值
					console.log('完整扫码内容：', val)
					this.doScanProcess(val)
				}, this.scanDelay)
			},

			/**
			 * 回车事件：也走同一处理逻辑
			 */
			onScanEnter(e) {
				util.sleep(500);
				clearTimeout(this.scanTimer)
				const val = e.target.value
				console.log('回车触发完整内容：', val)
				this.doScanProcess(val)
			},

			/**
			 * 真正的扫码业务处理
			 */
			doScanProcess(code) {
				if (!code || code.trim() === '') return

				// 1. 你的业务：提交、查询、打印...
				console.log('最终处理条码：', code)
				this.$emit("confirm", code);
				this.close();
				// 2. 自动清空，准备下一次扫码
				// this.scanCode = ''

				// 3. 重新聚焦（保证连续扫码）
				// this.$nextTick(() => {
				// 	this.$refs.scanInput && this.$refs.scanInput.focus()
				// })
			},
			onConfirm() {
				const code = this.scanCode.trim();
				if (!code) {
					uni.showToast({
						title: "请输入有效单号!",
						icon: "none"
					});
					return;
				}
				console.log("扫码获取的单号:", code);
				this.$emit("confirm", code);
				this.close();
			}
		}
	};
</script>

<style scoped>
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}

	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 40rpx 40rpx 0;
		z-index: 10000;
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.modal-tip {
		font-size: 28rpx;
		text-align: center;
		color: #333;
		margin-bottom: 30rpx;
	}

	.modal-input {
		height: 80rpx;
		border: 1px solid #eee;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 30rpx;
		margin-bottom: 40rpx;
	}

	.modal-btns {
		display: flex;
		border-top: 1rpx solid #eee;
	}

	.btn {
		flex: 1;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.btn.cancel {
		border-right: 1rpx solid #eee;
		color: #666;
	}

	.btn.confirm {
		color: #006637;
		font-weight: bold;
	}
</style>