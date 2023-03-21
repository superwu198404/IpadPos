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
			<view v-for="(item,index) in tableName" :key="item.id" class="glcx" @click="saleStatement(item,index)"
				:class="{curr:activeIndex===index}">
				<view>
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
				tableName: [
					{
						name: "销售报表",
						id: 3,
						src1: "@/images/img2/xiaoshou.png ",
						src2: "@/images/img2/xiaoshoucx-cu.png",
						src:"/pages/Querypage/Statement/Statement"
					},{
					name: "外卖单查询",
					id: 1,
					src1: "/images/img2/danjucx.png",
					src2: "@/images/img2/danjucx-cu.png",
					src:'/pages/Querypage/Storeinquiry/Storeinquiry'
				}, {
					name: "支付查询",
					id: 2,
					src1: "@/images/img2/zhifu.png",
					src2: "@/images/img2/zhifucx-cu.png",
					src:"/pages/Querypage/Storeinquiry/Storeinquiry"
				}],
				activeIndex: 0
			}
		},
		//组件生命周期
		created: function(e) {
			if(!this.index){
				this.activeIndex = 0
				return
			}
			this.activeIndex = this.index
		},
		methods: {
			saleStatement(item, index) {
				uni.redirectTo({
					url:item.src
				})
				this.activeIndex = index
				console.log(this.activeIndex,index,`pppppppppp`)
				utils.setStorage("index",this.activeIndex)
				
			},
			Return: function() {
				uni.redirectTo({
					url: "/pages/Center/Center"
				})
			}
		}
	}
</script>

<style>
</style>
