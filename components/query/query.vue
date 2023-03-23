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
				tableName: [{
					name: "销售报表",
					src1: "@/images/img2/xiaoshou.png ",
					src2: "@/images/img2/xiaoshoucx-cu.png",
					src: "/pages/Querypage/Statement/Statement"
				}, {
					name: "外卖单查询",
					src1: "/images/img2/danjucx.png",
					src2: "@/images/img2/danjucx-cu.png",
					src: '/pages/Querypage/Storeinquiry/Storeinquiry'
				}, {
					name: "支付查询",
					src1: "@/images/img2/zhifu.png",
					src2: "@/images/img2/zhifucx-cu.png",
					src: "/pages/Querypage/Storeinquiry/Storeinquiry"
				}],
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
