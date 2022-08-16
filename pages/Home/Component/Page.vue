<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="navmall">
		<view class="logo">
			<image src="@/images/kengee-logo.png" mode="widthFix"></image>
		</view>
		<view class="menu">
			<view v-for="(item,index) in urls" :class="menuIndex==item.index?'curr':''" @click="ToPage(item)">
				<image class="xz" :src="item.icon" mode="widthFix"></image>
				<image class="wx" :src="item.icon1" mode="widthFix"></image>
				<text>{{item.title}}</text>
				<view class="chargeback" v-if="item.details&&item.showDetail">
					<label v-for="(item1,index1) in item.details" :class="sec_index==item1.index?'currs':''"
						@click="ToPage(item1)">
						<image class="xz" :src="item1.icon" mode="widthFix"></image>
						<image class="wx" :src="item1.icon1" mode="widthFix"></image>
						<text>{{item1.title}}</text>
					</label>
				</view>
			</view>
		</view>
		<!-- <view class="exit" @click="LoginOut()">
			<image src="@/images/tuichu.png" mode="widthFix"></image>
			<text>退出</text>
		</view> -->
	</view>
</template>

<script>
	import router from '@/utils/router.js'
	export default {
		name: "Page",
		data() {
			return {
				urls: router,
				menuIndex: 0,
				sec_index: 0
			};
		},
		// props: {
		// 	Chargeback: false,
		// 	menuIndex: 0,
		// 	sec_index: 0
		// },
		methods: {
			ToPage: function(e) {
				console.log("[ToPage]切换:", e);
				if (e.url) {
					// uni.redirectTo({
					// 	url: e.url,
					// 	complete: r => {
					// 		console.log(r);
					// 	}
					// })
					this.$emit("switch", e);
					this.menuIndex = e.index;
					if (e.details)
						this.sec_index = -1
					else
						this.sec_index = e.index;
				}
				this.menuIndex = e.index;
				this.urls.map((item, index) => {
					if (item.title != e.title) {
						item.showDetail = false;
					} else {
						e.showDetail = !e.showDetail;
					}
				})
			},
			LoginOut: function() {
				uni.redirectTo({
					url: "@/pages/index/index",
					complete: r => {
						console.log(r)
					}
				})
			}
		}
	}
</script>

<style>
</style>
