<template>
	<view class="full-screen">
		<view class="head">
				<view class="head-portrait">
					<image src="@/images/touxiang.png" mode="widthFix"></image>
					<view class="member-account">会员账户</view>
				</view>
				<view class="head-exit">
					<view class="exit" @click="Exit"><image src="@/images/tuichu.png"></image> 退出</view>
				</view>
		</view>
		<view class="body">
			<view class="body-title">
				<view class="body-title-left">
					<view class="hot-sales">
						产品列表
						<label></label>						
					</view>
					<view>
						<text>已选</text>
						<label>生日精选 <button>×</button></label>
					</view>
					<view><image src="@/images/TL.png"></image></view>
				</view>
				<!-- <view class="body-title-right">
					<view class="btn-group">
						<view class="clear">清空</view>
						<view class="filter">去筛选</view>
					</view>
				</view> -->
			</view>
			<view class="body-content">
				<view class="body-content-left">
					<view class="content-head" v-if="false">
						<view class="filter-box">
							<view class="filter-tips">
								<view class="filter-title">
									全部已选:
								</view>
								<view class="tips-list">
									<view class="tips-item">生日精选<view>x</view>
									</view>
									<view class="tips-item">仪式庆祝<view>x</view>
									</view>
									<view class="tips-item">2-3人食(四寸)<view>x</view>
									</view>
									<view class="tips-item">￥200.00-￥1000.00<view>x</view>
									</view>
									<view class="tips-item">蛋糕胚<view>x</view>
									</view>
								</view>
							</view>
							<view class="filter-types">
								<view class="filter-left">
									<view class="filter-type check">场景</view>
									<view class="filter-type">人群</view>
									<view class="filter-type">尺寸</view>
									<view class="filter-type">蛋糕材料</view>
									<view class="filter-type">蛋糕类型</view>
								</view>
								<view class="filter-right">
									<view class="more-type">+ 更多</view>
								</view>
							</view>
							<view class="filter-options">
								<view class="filter-title">
									选&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选:
								</view>
								<view class="option-list">
									<view class="option-item">生日精选</view>
									<view class="option-item">仪式庆祝</view>
									<view class="option-item">2-3人食(四寸)</view>
									<view class="option-item">￥200.00-￥1000.00</view>
									<view class="option-item">蛋糕胚</view>
								</view>
							</view>
							<view class="filter-price-range"></view>
						</view>
					</view>
					<view class="content-body">
						<slot></slot>
					</view>
				</view>
				<view class="body-content-right">
					<view class="statement" @click="$emit('open')">
						<text>结算单</text>
						<label>«</label>
						<view class="good-number">
							<!-- <image src="../../images/jsd-dxiao.gif" mode="widthFix" style="width: 30px;height: 100px;"></image> -->
							<text>0</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			Exit() {
				uni.$emit('exit-cake-reservation');
			}
		},
		created() {

		}
	}
</script>

<style scoped>
	:root {
		--statement-width: 60px;
	}

	.full-screen {
		height: 100vh;
		width: 100vw;
		position: absolute;
		z-index: 88888;
		background-color: white;
		display: flex;
		flex-direction: column;
	}

	.full-screen view {
		/* border: 1px solid red; */
	}

	.head {
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 44rpx 2% 12rpx;
	}
	.head-left{
		width:100%;
	}
	.head-portrait {
		display: flex;
		width: 50%;
	}

	.head-portrait>view {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.head-portrait image{
		width:70rpx;
		height: 70rpx;
		margin-right: 10rpx;
	}
	.member-portrait {
		border-radius: 50%;
		width: 35px;
		height: 35px;
		background-color: green;
	}

	.exit {
		background: #E0EAE9;
		color: #006B44;
		padding: 10rpx 20rpx;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.exit image{
		width:40rpx;
		height: 40rpx;
		margin-right: 8rpx;
	}
	.body {
		flex: 1;
		background-color: var(--light-gray);
		display: flex;
		flex-direction: column;
	}

	.body-title {
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0px 20px;
		width:96%;
		margin:0 auto;
		font-size: 34rpx;
		color: #006B44;
		position: relative;
		font-weight: 700;
	}
	.hot-sales{
		position: relative;
	}
	.body-title .hot-sales label{
		position: absolute;
		bottom:0;
		left: 20rpx;
		width: 158rpx;
		height: 18rpx;
		background: linear-gradient(90deg, #006B44 0%, rgba(0,107,68,0) 100%);
		border-radius: 9px 9px 9px 9px;
		opacity: 0.3;
	}
	.body-content {
		flex: 1;
		display: flex;
	}

	.body-content-left {
		flex: 1;
		padding-left: 20px;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.body-content-right {
		width: var(--statement-width);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.statement {
		width: 60rpx;
		display: flex;
		flex-direction: column;
		background-color: #E0EAE9;
		color: #006B44;
		justify-content: center;
		align-items: center;
		border: 1px solid #006B44;
		border-radius: 40rpx;
		padding: 40rpx 0 0;
		margin-top: 100rpx;
	}

	.statement text {
		text-align: center;
		font-weight: 600;
	}

	.good-number {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hot-sales {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.hot-sales-icon {
		height: 22px;
		width: 22px;
	}


	.content-body {
		flex: 1;
	}

	.filter-tips,
	.filter-options {
		display: flex;
		align-items: center;
	}

	.filter-tips {
		border-bottom: 1px solid #f8f8f8;
	}

	.tips-list,
	.option-list {
		display: flex;
	}

	.tips-item {
		background: var(--light-green);
		color: var(--drak-green);
	}

	.tips-item,
	.option-item {
		display: flex;
		margin-left: 15px;
		gap: 5px;
		padding: 0px 5px;
	}

	.filter-types {
		display: flex;
		gap: 10px;
		justify-content: space-between;
		align-items: center;
	}

	.filter-type,
	.more-type {
		border-radius: 20px;
		border: 1px solid lightgray;
		padding: 5px 12px;
	}

	.more-type {
		border: 1px solid var(--drak-green);
		color: var(--drak-green);
	}

	.filter-left {
		display: flex;
		gap: 15px
	}
</style>
