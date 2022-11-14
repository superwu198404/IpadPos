<template>
	<view>
		<view class="swiperPanel" @touchstart="startMove" @touchend="endMove">
			<view class="swiperItem" v-for="(item, index) in swiperList" :key="index"
				:style="{transform: itemStyle[index].transform, zIndex: itemStyle[index].zIndex, opacity: itemStyle[index].opacity}">
				<view class="children">
					<!-- <image class="pic" src="@/image/455.png" mode="widthFix"></image> -->
					<image class="pic" :src="item.url" mode="widthFix"></image>
					<view class="products">
						<view class="names">{{item.names}}</view>
						<text>{{item.miaoshu}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			swiperList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				slideNote: {
					x: 0,
					y: 0
				},
				screenWidth: 0,
				itemStyle: []
			};
		},
		created() {
			var macInfo = uni.getSystemInfoSync();
			this.screenWidth = macInfo.screenWidth;
			// 计算swiper样式
			this.swiperList.forEach((item, index) => {
				this.itemStyle.push(this.getStyle(index))
			})
		},
		methods: {
			getStyle(e) {
				if (e > this.swiperList.length / 2) {
					var right = this.swiperList.length - e
					return {
						transform: 'scale(' + (1 - right / 10) + ') translate(-' + (right * 9) + '%,0px)',
						zIndex: 9999 - right,
						opacity: 0.8 / right
					}
				} else {
					return {
						transform: 'scale(' + (1 - e / 10) + ') translate(' + (e * 9) + '%,0px)',
						zIndex: 9999 - e,
						opacity: 0.8 / e
					}
				}
			},
			startMove(e) {
				this.slideNote.x = e.changedTouches[0] ? e.changedTouches[0].pageX : 0;
				this.slideNote.y = e.changedTouches[0] ? e.changedTouches[0].pageY : 0;
			},
			endMove(e) {
				var newList = JSON.parse(JSON.stringify(this.itemStyle))
				if ((e.changedTouches[0].pageX - this.slideNote.x) < 0) {
					// 向左滑动
					var last = [newList.pop()]
					newList = last.concat(newList)
				} else {
					// 向右滑动
					newList.push(newList[0])
					newList.splice(0, 1)
				}
				this.itemStyle = newList
			}
		}
	}
</script>

<style lang="scss">
	.swiperPanel {
		margin-top:20rpx;
		height: 1400rpx;
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.swiperItem {
		height: 99%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		transition: all .5s;
	}

	.children {
		height: 90%;
		width: 90%;
		margin: 3% auto;
		position: relative;
		overflow: hidden;
		border-radius: 20rpx;
		box-shadow: 20px 0px 40px 1px rgba(51, 51, 51, 0.2);
		background-color: #FFFFFF;
	}

	.pic {
		position: absolute;
		top: -10%;
		left: 0;
		width: 100%;
	}

	.children .products {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 2% 4%;
		width: 92%;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
	}

	.children .products .names {
		font-size: 40rpx;
		font-weight: 700;
	}

	.children .products text {
		color: rgba(176, 176, 176, 1);
		font-size: 24rpx;
		line-height: 48rpx;
	}
</style>
