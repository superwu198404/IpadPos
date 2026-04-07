<template>
	<view @click.stop v-if="isShow" class="keyboard-input" :style="customStyle || defaultStyle">
		<view class="searchTerms">
			<view class="affirmArea" style="margin-left: 20px;font-size: 18px;display: flex;flex-direction: row;">
				<view v-show="innerQueryKeys.length">
					搜索词:
				</view>{{ innerQueryKeys.toUpperCase() }}
			</view>
			<view class="deleteBoard" @click.stop="handleClose">
				<image src="../../images/shouqi.png" mode="widthFix"></image>
			</view>
		</view>

		<view class="keyboard">
			<ul class="keys" v-for="(item, index) in keyBoardList" :key="index">
				<li v-for="(_item, _index) in item.value" :key="_index" @click.stop="handleKeyClick(_item)">
					{{ _item }}
				</li>
				<li class="enter" v-if="index === 1" @click.stop="handleDelete">删除</li>
				<li class="enter" v-if="index === 2" style="color: red;width: 190rpx;" @click.stop="handleClear">清空</li>
				<li class="enter" v-if="index === 2" @click.stop="handleSearch" style="width: 190rpx; color: #127551;">搜索
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import mysale from '@/utils/sale/base_sale.js';
	import util from '@/utils/util.js';
	export default {
		name: 'KeyboardInput',
		props: {
			// 是否显示软键盘
			isShow: {
				type: Boolean,
				default: false
			},
			// 输入长度限制（可选，默认10）
			maxLength: {
				type: Number,
				default: 10
			},
			customStyle: {
				type: Object,
				default: () => null
			}
		},
		data() {
			return {
				// 组件内部维护输入的搜索词
				innerQueryKeys: '',
				// 默认样式
				defaultStyle: {
					zIndex: 999999,
					backgroundColor: '#fff',
					boxShadow: '0 -6px 10px rgb(255,255,255), 0 4px 15px rgba(0,0,0,0.3)',
					borderRadius: '22rpx',
					width: '1400rpx',
					padding: '0 30rpx 0',
					position: 'absolute',
					bottom: '80rpx',
					// left: '50%',
					// transform: 'translateX(-50%)'
					left: '5vw',
					
				},
				keyBoardList: [
				{
					"value": [
						"Q",
						"W",
						"E",
						"R",
						"T",
						"Y",
						"U",
						"I",
						"O",
						"P"
					]
				},
				{
					"value": [
						"A",
						"S",
						"D",
						"F",
						"G",
						"H",
						"J",
						"K",
						"L"
					]
				},
				{
					"value": [
						"Z",
						"X",
						"C",
						"V",
						"B",
						"N",
						"M"
					]
				}
			]
			}
		},
		watch: {
			isShow(newVal) {
				if (newVal) {
					this.innerQueryKeys = '';
				}
			}
		},
		created() {
		},
		methods: {
			handleClose() {
				this.innerQueryKeys = '' // 清空输入
				this.$emit('close') 
			},
			// 按键点击（内部处理输入逻辑）
			handleKeyClick(key) {
				if (this.innerQueryKeys.length >= this.maxLength) return
				this.innerQueryKeys += key
			},
			// 删除最后一个字符（内部处理）
			handleDelete() {
				this.innerQueryKeys = this.innerQueryKeys.substr(0, this.innerQueryKeys.length - 1)
			},
			// 清空输入（内部处理）
			handleClear() {
				this.innerQueryKeys = ''
			},
			handleSearch() {
				if (this.innerQueryKeys.length < 1) {
					util.simpleMsg('请输入首字符进行搜索', true)
					return
				}
				if (this.innerQueryKeys.length > 10) {
					util.simpleMsg('请最多输入十个字符', true)
					return
				}
				this.$emit('confirm', {
					query: this.innerQueryKeys, // 最终输入的搜索词
				})
			}
		}
	};
</script>

<style scoped>
	/* 软键盘样式 */
	.keyboard-input {

	}

	.keyboard {
		user-select: none;
		cursor: pointer;
		padding: 10rpx 0 30rpx;
	}

	.keyboard .keys {
		display: flex;
		list-style: none;
		margin: 0 0 0 -72rpx;
	}

	.keyboard li {
		box-shadow: 0 -6px 10px rgb(255, 255, 255), 0 4px 10px rgba(0, 0, 0, 0.3);
		width: 112rpx;
		height: 112rpx;
		font-size: 36rpx;
		margin: 18rpx;
		background-color: #f2f2f2;
		border-radius: 28rpx;
		text-align: center;
		line-height: 112rpx;
		transition: all 0.25s;
	}

	.keyboard li:active {
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15);
		color: rgb(12, 164, 190);
		text-shadow: 0 0 15px #57c1f1;
	}

	.searchTerms {
		font-size: 36rpx;
		font-weight: 700;
		color: gray;
		width: 100%;
		height: 56rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		padding-top: 20rpx;
	}

	.searchTerms image {
		margin-top: 20rpx;
		width: 40rpx;
		height: 40rpx;
	}

	.deleteBoard {
		width: 26px;
		margin-right: 27px;
		height: 26px;
	}
</style>