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
			<view class="glcx">
				<view>
					<image class="wx" src="@/images/img2/xiaoshou.png" mode="widthFix"></image>
					<image class="xz" src="@/images/img2/xiaoshoucx-cu.png" mode="widthFix"></image>
					销售报表
				</view>
			</view>
			<view class="glcx curr">
				<view>
					<image class="wx" src="/images/img2/danjucx.png" mode="widthFix"></image>
					<image class="xz" src="@/images/img2/danjucx-cu.png" mode="widthFix"></image>
					外卖单查询
				</view>
			</view>
			<view class="glcx">
				<view>
					<image class="wx" src="@/images/img2/zhifu.png" mode="widthFix"></image>
					<image class="xz" src="@/images/img2/zhifucx-cu.png" mode="widthFix"></image>
					支付查询
				</view>
			</view>
		</view>
		<view class="tuichu">
			<image class="mendian" src="@/images/img2/dianmian.png"></image>
			<button><image src="@/images/img2/tuitui.png"></image>退出</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		name: "query",
		//属性
		props: {
			属性名称: {
				type: String,//属性类型
				value: "值"
			},
		},
		//组件生命周期
		created:function(e){
		
		},
		methods: {

		}
	}
	
</script>

<style>
</style>