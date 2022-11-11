<template>
	<view class="loading-container" :style="style" v-show="show">
		<view class="loading-content loading">{{ title }}</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	export default {
		name: "Loading",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: "加载中"
			},
			opacity: {
				type: Number,
				default: 0.4
			}
		},
		data() {
			return {
				style: {
					background: `rgba(0,0,0,${0.4})`
				}
			}
		},
		methods: {

		},
		created: function() {
			this.style.background = `rgba(0,0,0,${this.opacity})`;
		}
	}
</script>

<style scopeed>
	.loading-container {
		position: absolute;
		width: 100vw;
		height: 100vh;
		top: 0px;
		left: 0px;
		background: rgba(0, 0, 0, 0.4);
		z-index: 999999999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-content {
		color: white;
		font-size: 20px;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 8px;
		padding: 20px 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading::after {
		filter: brightness(4.5);
	}
</style>
