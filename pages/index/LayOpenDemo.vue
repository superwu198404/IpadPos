<template>
	<view>
		<button type="primary" @click="clickDig('center')">弹窗</button>
		<uni-popup ref="popup"  :type="type" :maskClick="false">
			<view class="uni-tip">
				<view class="uni-tip-title">{{option.title}}</view>
				<view class="uni-tip-content">{{option.contex}}</view>
				<view class="uni-tip-group-button" v-if="option.showConfirmButton||option.showCancelButton||option.showDetailButton">
					<button v-if ="option.showConfirmButton" type="primary" size="mini" @click="confirm">{{option.confirmButtonText}}</button>
					<button  v-if ="option.showCancelButton" type="primary" size="mini" @click="cancel">{{option.cancelButtonText}}</button>
					<button v-if ="option.showDetailButton" type="primary" size="mini" @click="custom">{{option.detailButtonText}}</button>
				</view>
			</view>
		</uni-popup>

	</view>
</template>
<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue'

		<view class="dialog">

		</view>
	</view>
</template>
<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: 'center',
				option: {}
			}
		},
		methods: {
			clickDig(options) {
				let defaultOption = {
					title:'标题',
					contex:'内容',
					showConfirmButton: true, // 是否显示确认按钮
					confirmButtonText: '确认', // 确认按钮文字
					showCancelButton: false, // 是否显示取消按钮
					cancelButtonText: '取消', // 取消按钮文字
					showDetailButton: false, // 是否显示确认按钮
					detailButtonText: '详情', // 确认按钮文字
					showIcon: true, // 是否显示图标
					iconClass: null, // 图标class自定义
					type: 'center', // 类型 
					msg: ''
				};
				this.type = defaultOption.type
				this.option = Object.assign({}, defaultOption, this.option);
				this.$refs['popup'].open()
			},
			// 确认
			confirm() {
				this.$refs['popup'].close()
			},
			// 取消
			cancel() {
				this.$refs['popup'].close()
			},
			// 自定义
			custom() {
				this.$refs['popup'].close()
			}
		}
	}
</script>

<style>
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
