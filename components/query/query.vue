<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>
<template name="query">
	<view class="leftcx navmall">
		<view class="logo">
			<image src="@/images/img2/kgeeeee.png" mode="widthFix"></image>
		</view>
		<text class="biaoti">门店查询</text>
		<view class="menu">
			<view v-for="(item,index) in tableName" class="glcx" @click="saleStatement(item,index)"
				:class=" curIndex=== index?'curr':''">
				<view>
					<!-- {{utils.getStorage('queryIndex')}} -->
					<image class="wx" :src="item.src1" mode="widthFix"></image>
					<image class="xz" :src="item.src2" mode="widthFix"></image>
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="tuichu">
			<image class="mendian" src="@/images/img2/dianmian.png"></image>
			<button @click="Return">
				<image src="@/images/img2/tuitui.png"></image>退出
			</button>
		</view>
	</view>

</template>

<script>
	import utils from "@/utils/util.js"
	export default {
		name: "query",
		//属性
		props: ['index'],
		data() {
			return {
				curIndex: 1,
				
			}
		},
		mounted() {
			this.curIndex = utils.getStorage('queryIndex')
		},
		methods: {
			saleStatement(item, index) {
				uni.redirectTo({
					url: item.src
				})
				this.curIndex = index
				utils.setStorage("queryIndex", index)
			},
			Return: function() {
				uni.redirectTo({
					url: "/pages/Center/Center"
				})
				utils.setStorage('queryIndex',1)
			}
		}
	}
</script>

<style>
</style>
