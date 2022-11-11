<template>
	<view class="full-screen">
		<view class="head">
			<view class="head-left">
				<view class="head-portrait">
					<view class="member-portrait"></view>
					<view class="member-account">会员账户</view>
				</view>
			</view>
			<view class="head-right">
				<view class="head-exit">
					<view class="exit" @click="Exit">退出</view>
				</view>
			</view>
		</view>
		<view class="body">
			<view class="body-title">
				<view class="body-title-left">
					<view class="hot-sales">
						<!-- <image src="../../images/dx-tqi.png" class="hot-sales-icon" mode="widthFix"></image> 本店热销 -->
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
				</view>
				<view class="body-title-right">
					<view class="btn-group">
						<view class="clear">清空</view>
						<view class="filter">去筛选</view>
					</view>
				</view>
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
		z-index: 10000000000000;
		background-color: white;
		display: flex;
		flex-direction: column;
	}

	.full-screen view {
		/* border: 1px solid red; */
	}

	.head {
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0px 20px;
	}

	.head-portrait {
		display: flex;
		width: 120px;
		display: flex;
		justify-content: space-between;
	}

	.head-portrait>view {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.member-portrait {
		border-radius: 50%;
		width: 35px;
		height: 35px;
		background-color: green;
	}

	.exit {
		background: var(--light-green);
		color: var(--drak-green);
		padding: 5px 14px;
		border-radius: 5px;
		font-weight: 600;
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

	.body-title-right {
		margin-right: var(--statement-width);
	}

	.btn-group {
		display: flex;
		gap: 40px;
	}

	.clear {
		font-weight: 600;
		color: red;
	}

	.filter {
		font-weight: 600;
		color: var(--drak-green);
	}

	.content-head {
		position: absolute;
		height: 36%;
		width: calc(100% - 20px);
		background-color: #ffffff;
		border-radius: 5px;
		top: 0px;
		left: 20px
	}

	.filter-box {
		height: 100%;
		box-shadow: 0px 10px 16px .2px gray;
	}

	.filter-box>view {
		height: 25%;
		box-sizing: border-box;
		padding: 10px 20px;
		box-sizing: border-box;
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
