<template>
		<uni-popup ref="popup"  >
			<view class="st-layer" :style="{ width: width }">
				<view class="st-layer__content">
					<!-- #ifndef APP-NVUE -->
					<text class="st-layer__icon" :class="option.iconClass ||getIconClass()"
						v-if="option.type !== 'none' && option.showIcon"></text>
					<!-- #endif -->
					<view class="st-layer__msg" v-if="option.msg">
						<text>{{ option.msg }}</text>
					</view>
				</view>
 <view class="st-layer__footer" :class="{'is-reverse-cofirmcancel':isReverseConfirmCancel}" v-if="option.showConfirmButton||option.showCancelButton||option.showDetailButton">
	 <view class="st-layer__footer__btn st-layer__footer__btn--confirm" @tap.stop="confirmClick" v-if="option.showConfirmButton"><text>确认</text></view>
	 <view class="st-layer__footer__btn st-layer__footer__btn--cancel"  @tap.stop="cancelClick" v-if="option.showCancelButton"><text>取消</text></view>
	 <view class="st-layer__footer__btn st-layer__footer__btn--detail"  @tap.stop="detailClick" v-if="option.showDetailButton"><text>详情</text></view>
 </view>
 </view>
</uni-popup>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				option: {}
			}
		},
		methods: {
			open: function() {
				let defaultOption = {
					showCancelButton: false, // 是否显示取消按钮
					cancelButtonText: '取消', // 取消按钮文字
					showConfirmButton: true, // 是否显示确认按钮
					confirmButtonText: '确认', // 确认按钮文字
					showDetailButton: true, // 是否显示确认按钮
					DetailButtonText: '详情', // 确认按钮文字
					showIcon: true, // 是否显示图标
					iconClass: null, // 图标class自定义
					type: 'none', // 类型
					confirm: null, // 点击确认后的逻辑
					cancel: null, // 点击取消后的逻辑
					msg: ''
				};

				this.option = Object.assign({}, defaultOption, option);
				this.$refs.popup.open();
			},
			close: function() {
				this.$refs.popup.close();
			},
			confirmClick: function() {
				const confirmHandler = this.option.confirm;
				if (confirmHandler && typeof confirmHandler === 'function') {
					confirmHandler();
				}
				this.close();
				this.$emit('confirm');
			},
			cancelClick() {
				const cancelHandler = this.option.cancel;
				if (cancelHandler && typeof cancelHandler === 'function') {
					cancelHandler();
				}
				this.close();
				this.$emit('cancel');
			},
			detailClick(){
				const detailHandler = this.option.detail;
				if (detailHandler && typeof detailHandler === 'function') {
					detailHandler();
				}
				this.close();
				this.$emit('detail');
			}
		}
	}
</script>

<style>

</style>
