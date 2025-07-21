<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>
<template name="query">
	<view class="leftcx navmall">
		<view class="logo">
			<image src="../../images/img2/kgeeeee.png" mode="widthFix"></image>
		</view>
		<text class="biaoti">门店查询</text>
		<view class="menu">
			<view v-for="(item,index) in MenuArr" class="glcx" @click="saleStatement(item,index)"
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
			<image class="mendian" src="../../images/img2/dianmian.png"></image>
			<button @click="Return">
				<image src="../../images/img2/tuitui.png"></image>退出
			</button>
		</view>
	</view>

</template>

<script>
	import utils from "@/utils/util.js"
	export default {
		name: "query",
		data() {
			return {
				curIndex: 1,
				MenuArr: [],
			}
		},
		created() {
			const queryIndex = utils.getStorage('queryIndex')
			this.curIndex = queryIndex
			let arr = utils.getStorage('MDMENU');
			if (arr && arr.length > 0) {
				arr.map(r => {
					r.name = r.MenuName;
					r.key = 'Storeinquiry';
					try {
						r.src1 = require('../../images/img2/' + r.MenuId + '-bai.png');
						r.src2 = require('../../images/img2/' + r.MenuId + '-lv.png');
					} catch (e) {
						r.src1 = "";
						r.src2 = "";
					}
				})
				console.log("合并结果：", arr);
				this.MenuArr = arr;	
		}
		},
		mounted() {
			this.curIndex = utils.getStorage('queryIndex')
		},
		
		methods: {
			saleStatement(item, index) {
				uni.redirectTo({
					url: `/pages/Querypage/QueryCenter/QueryCenter?queryIndex=${index}`
				})
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
