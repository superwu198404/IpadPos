<template>
	<view class="matter">
		<image src="@/images/meiyoudd.png" mode="widthFix"></image>
		<text>{{_tips}}</text>
	</view>
</template>

<script>
	export default {
		name: "NoData",
		props: {
			_tips: {
				type: String,
				default: "暂无数据"
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
	.matter {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding-top: 10%;
	}

	.matter image {
		width: 500rpx;
		height: 500rpx;
	}
</style>
