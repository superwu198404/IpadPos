<template>
	<view>
		<!-- @touchstart="startMove" @touchend="endMove" -->
		<swiper class="swiperPanel" previous-margin='28px' next-margin='28px' @change="change" circular="true">
			<swiper-item class="swiperItem" v-for="(item, index) in swiperList" :key="index" @click="ChooseCake(item)">
				<view class="children" :class="index == currentIndex?'animationData':''">
					<image class="logo" src="@/images/kengee-logo.png" mode="widthFix"></image>
					<image class="pic" :src="item.img" mode="widthFix" @error="imgerr($event,index)"></image>
					<view class="products">
						<view class="names">{{item.SNAME}}({{index+1+"/"+swiperList.length}})
							<!-- <text class="price">￥145</text> -->
						</view>
						<text>{{item.note}}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
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
					let arr = n.filter((r, i) => {
						return i <= 100;
					});
					this.swiperList = JSON.parse(JSON.stringify(arr));
					console.log("接收传入的蛋糕数据：", this.swiperList);
					this.itemStyle = [];
					this.swiperList.forEach((item, index) => {
						item.img = (this.P_URL + item.img);
						this.itemStyle.push(this.getStyle(index))
					})
				} else {
					this.swiperList = [];
				}
				console.log("蛋糕显示数据", this.swiperList.length);
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
				P_URL: "",
				currentIndex: 0,
				animationData: {},
				animationData2: {},
			};
		},
		async created() {
			let sysParam = util.getStorage("sysParam");
			if (sysParam && sysParam.DGIMGURL) {
				this.P_URL = sysParam.DGIMGURL;
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
			imgerr(e, i) {
				console.log("图片加载出错事件：", e);
				this.swiperList[i].img = "/images/zanwutp.png";
			},
			ChooseCake: function(e) {
				console.log("选中的蛋糕:", e);
				uni.$emit("ShowCakeDetail", e);
			},
			getStyle(e) {
				// if (e > this.swiperList.length / 2) {
				// 	var right = this.swiperList.length - e
				// 	return {
				// 		// transform: 'scale(' + (1 - right / 10) + ') translate(-' + (right * 9) + '%,0px)',
				// 		zIndex: 9999 - right,
				// 		opacity: 1 
				// 	}
				// } else {
				// 	return {
				// 		// transform: 'scale(' + (1 - e / 10) + ') translate(' + (e * 9) + '%,0px)',
				// 		zIndex: 9999 - e,
				// 		opacity: 1
				// 	}
				// }
			},
			change(e) {
				this.currentIndex = e.detail.current
			},
			// 	startMove(e) {
			// 		this.slideNote.x = e.changedTouches[0] ? e.changedTouches[0].pageX : 0;
			// 		this.slideNote.y = e.changedTouches[0] ? e.changedTouches[0].pageY : 0;
			// 	},
			// 	endMove(e) {
			// 		var newList = JSON.parse(JSON.stringify(this.itemStyle))

			// 		console.log("滑动数据：", );
			// 		let touchCode = e.changedTouches[0].pageX - this.slideNote.x;
			// 		if (touchCode == 0) {
			// 			//说明是点击事件
			// 			console.log("点击事件");
			// 			return;
			// 		}
			// 		if (touchCode < 0) {
			// 			// 向左滑动
			// 			var last = [newList.pop()]
			// 			newList = last.concat(newList)
			// 		} else {
			// 			// 向右滑动
			// 			newList.push(newList[0])
			// 			newList.splice(0, 1)
			// 		}
			// 		console.log("滑动集合：", newList);
			// 		this.itemStyle = newList
			// 	}

		},
		computed: {
			stretch() {
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				})
				animation.scale(1).step()
				this.animationData = animation.export()
			},
			// 展开
			shrink(h) {
				var animation2 = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				})
				animation2.scale(0.9).step()
				this.animationData2 = animation2.export()
			},
		}

	}
</script>

<style lang="scss">
	.swiperPanel {
		height: 1450rpx;
		width: 100%;
		margin: 0 auto;
		// overflow: hidden;
		position: relative;
	}

	.swiper-wrapper {
		overflow: inherit;
	}

	.swiperItem {
		height: 99%;
		width: 99%;
		// position: absolute;
		// top: 0;
		// left: 1%;
		// transition: all .1s;
		// -webkit-transition: all .1s;
		// -webkit-backface-visibility: hidden;
		// -webkit-overflow-scrolling: touch;
	}

	.children {
		height: 92%;
		width: 99%;
		margin: 0.5% auto 3%;
		position: relative;
		overflow: hidden;
		border-radius: 20rpx;
		box-shadow: 10rpx 0px 20rpx 1px rgba(51, 51, 51, 0.1);
		background-color: #FFFFFF;
		border-radius: 10px;
		opacity: 0.7;
		transform: scale(0.98);
	}

	.animationData {
		opacity: 1;
		transform: scale(1);
	}

	.children .logo {
		position: absolute;
		top: 16rpx;
		left: 20rpx;
		width: 120rpx;
		height: 120rpx;
		z-index: 9;
	}

	.pic {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 0;
		width: 100%;
		border-radius: 20rpx;
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