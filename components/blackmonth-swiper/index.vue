<template>
	<view>
		<view class="swiperPanel" @touchstart="startMove" @touchend="endMove">
			<view class="swiperItem" v-for="(item, index) in swiperList" :key="index"
				:style="{transform: itemStyle[index].transform, zIndex: itemStyle[index].zIndex, opacity: itemStyle[index].opacity}"
				@click="ChooseCake(item)">
				<view class="children">
					<image class="logo" src="@/images/kengee-logo.png" mode="widthFix"></image>
					<image class="pic" :src="P_URL+item.img" mode="widthFix"></image>
					<view class="products">
						<view class="names">{{item.SNAME}} <!-- <text class="price">￥145</text> -->
						</view>
						<text>{{item.note}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _cake from '@/api/business/CakeYD.js';
	import util from '@/utils/util.js';
	export default {
		props: {
			_swiperList: {
				type: Array,
				default: () => ([]) //工厂模式设置默认值
			}
		},
		watch: {
			_swiperList: function(n, o) {
				console.log("蛋糕数据发生变动：", n.length);
				if (n && n.length > 0) {
					this.swiperList = n.filter((r, i) => {
						return i <= 100;
					});
					this.itemStyle = [];
					this.swiperList.forEach((item, index) => {
						this.itemStyle.push(this.getStyle(index))
					})
				} else {
					this.swiperList = [];
				}
				console.log("蛋糕显示数据", this.swiperList);
			}
		},
		data() {
			return {
				slideNote: {
					x: 0,
					y: 0
				},
				screenWidth: 0,
				itemStyle: [],
				swiperList: [],
				// P_URL: "http://58.19.103.220:8805/CakeImage/"
				P_URL: ""
			};
		},
		async created() {
			let sysParam = util.getStorage("sysParam");
			if (sysParam && sysParam.DGIMGURL) {
				this.P_URL = sysParam.DGIMGURL
			}
			var macInfo = uni.getSystemInfoSync();
			this.screenWidth = macInfo.screenWidth;

			// this.swiperList = await _cake.GetCakeList();
			// console.log("集合数据：", this.swiperList);
			// 计算swiper样式
			// this.swiperList.forEach((item, index) => {
			// 	this.itemStyle.push(this.getStyle(index))
			// })
		},
		methods: {
			ChooseCake: function(e) {
				console.log("选中的蛋糕:", e);
				uni.$emit("ShowCakeDetail", e);
			},
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

				console.log("滑动数据：", );
				let touchCode = e.changedTouches[0].pageX - this.slideNote.x;
				if (touchCode == 0) {
					//说明是点击事件
					console.log("点击事件");
					return;
				}
				if (touchCode < 0) {
					// 向左滑动
					var last = [newList.pop()]
					newList = last.concat(newList)
				} else {
					// 向右滑动
					newList.push(newList[0])
					newList.splice(0, 1)
				}
				console.log("滑动集合：", newList);
				this.itemStyle = newList
			}
		}
	}
</script>

<style lang="scss">
	.swiperPanel {
		height: 1400rpx;
		width: 100%;
		margin:0 auto;
		overflow: hidden;
		position: relative;
	}

	.swiperItem {
		height: 99%;
		width: 98%;
		position: absolute;
		top: 0;
		left: 1%;
		transition: all .5s;
	}

	.children {
		height: 92%;
		width: 88%;
		margin: 0.5% auto 3%;
		position: relative;
		overflow: hidden;
		border-radius: 20rpx;
		box-shadow: 20rpx 0px 30rpx 1px rgba(51, 51, 51, 0.1);
		background-color: #FFFFFF;
	}
	.children .logo{
		position: absolute;
		top:16rpx;
		left: 20rpx;
		width:120rpx;
		height: 120rpx;
		z-index: 9;
	}
	.pic {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
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
		display: flex;
		justify-content: space-between;
	}

	.children .products text {
		color: rgba(176, 176, 176, 1);
		font-size: 24rpx;
		line-height: 48rpx;
	}
</style>
