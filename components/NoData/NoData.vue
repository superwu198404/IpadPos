<template>
	<view class="matter">
		<image src="@/images/meiyoudd.png" mode="widthFix"></image>
		<text>暂无数据</text>
	</view>
</template>

<script>
	export default {
		name: "NoData",
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
