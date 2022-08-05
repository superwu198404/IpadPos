<template>
	<view>
		<movable-area>
			<movable-view :x="x" :y="y" direction="all" position="position">
				<view class="ordermes">
					<label @click="Orderments()">
						<image src="../../images/xianshangdd.gif" mode="widthFix"></image><text>1</text>
					</label>
					<view class="orderlist" v-if="orderlist">
						<view class="h2">
							<image src="../../images/xianshangdingd.png"></image>线上订单
						</view>
						<view class="ul">
							<label><span>●</span>你有一条新的订单待处理</label><text>34</text>
						</view>
						<view class="h2">
							<image src="../../images/waimaidan.png"></image>外卖单
						</view>
						<view class="ul">
							<label><span>●</span>你有一条新的订单待处理</label><text>34</text>
						</view>
						<view class="h2">
							<image src="../../images/ydtq.png"></image>预定单
						</view>
						<view class="ul">
							<label><span>●</span>你有一条新的订单待处理</label><text>34</text>
						</view>
					</view>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	export default {
		name: "movable",
		data() {
			return {
				x: 700,
				y: 0,
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 0,
				move: {
					x: 0,
					y: 0
				},
				orderlist: false
			}
		},
		methods: {
			Orderments: function(e) {
				this.orderlist = !this.orderlist

			},
			mounted() {
				this.$refs.setPlan.open()
				var _this = this
				uni.getSystemInfl({
					success: function(res) {

						x = res.windowWidth
					}

				})
			}
		}

	}
</script>

<style>
	movable-area {
		position: fixed;
		top: 10%;
		left: 10%;
		right: 0;
		bottom: 0;
		width: 89%;
		height: 90%;
		pointer-events: none;
	}

	movable-view {
		width: 100px;
		height: 100px;
		border-radius: 100%;
		pointer-events: auto;
		/* position: fixed;
		bottom:20%;
		right:0; */
	}

	.ordermes {
		position: fixed;
		bottom: 20%;
		right: 0;
		background-color: #fff;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0px 3px 20px 1px rgba(0, 107, 68, 0.1000);
	}

	.ordermes image {
		width: 90rpx;
		height: 90rpx;
	}

	.ordermes label text {
		background-color: #FE694B;
		color: #fff;
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		min-width: 40rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 50%;
		font-size: 24rpx;
	}

	.orderlist {
		position: absolute;
		right: 100%;
		top: 0;
		background-color: #fff;
		box-shadow: 0px 10px 20px 1px rgba(0, 107, 68, 0.1600);
		width: 740rpx;
		padding: 0 30rpx 20rpx 30rpx;
	}

	.orderlist .h2 {
		font-weight: 700;
		line-height: 80rpx;
		display: flex;
		justify-content: start;
		align-items: center;
		margin-top: 20rpx;
	}

	.orderlist .h2 image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 6rpx;
	}

	.orderlist .ul {
		display: flex;
		justify-content: space-between;
		background: #F8F8F8;
		padding: 20rpx 4%;
	}

	.orderlist .ul span {
		color: #FE694B;
		margin-right: 8rpx;
	}

	.orderlist .ul text {
		background-color: #FE694B;
		color: #fff;
		min-width: 40rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 50%;
		font-size: 24rpx;
	}
</style>
