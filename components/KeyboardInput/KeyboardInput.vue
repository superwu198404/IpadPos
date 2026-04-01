<template>
	<view @click.stop v-if="isShow" class="keyboard-input">
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
			}
		},
		data() {
			return {
				// 组件内部维护输入的搜索词
				innerQueryKeys: '',
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
		z-index: 999999;
		background-color: #fff;
		box-shadow: 0 -6px 10px rgb(255, 255, 255), 0 4px 15px rgba(0, 0, 0, 0.3);
		border-radius: 22px;
		width: 1600rpx;
		padding: 0 30rpx 30rpx;
		position: absolute;
		bottom: 10rpx;
		left: 50%;
		transform: translateX(-50%);
		padding-bottom: 40rpx;
	}

	.keyboard {
		user-select: none;
		cursor: pointer;
		padding: 10rpx 0 40rpx;
	}

	.keyboard .keys {
		display: flex;
		list-style: none;
		margin: 0 0 0 -33rpx;
	}

	.keyboard li {
		box-shadow: 0 -6px 10px rgb(255, 255, 255), 0 4px 10px rgba(0, 0, 0, 0.3);
		width: 120rpx;
		height: 120rpx;
		font-size: 36rpx;
		margin: 18rpx;
		background-color: #f2f2f2;
		border-radius: 30rpx;
		text-align: center;
		line-height: 120rpx;
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
		height: 70rpx;
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