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
						<image src="../../images/dx-tqi.png" class="hot-sales-icon" mode="widthFix"></image> 本店热销
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
					<slot></slot>
				</view>
				<view class="body-content-right">
					<view class="statement">
						<text>结算单</text>
						<label>«</label>
						<view class="good-number">
							<image src="@/images/jsd-dxiao.gif" mode="widthFix" style="width: 30px;height: 100px;"></image>
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
				this.$emit('exit');
			}
		},
		created() {

		}
	}
</script>

<style>
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
	}

	.body-content-right {
		width: 60px;
		border: 1px solid red;
		display: flex;
		align-items: center;
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
	
	.good-number{
		width: 100%;
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
</style>
