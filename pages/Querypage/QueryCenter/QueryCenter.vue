<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<view class="leftcx navmall" style="position: fixed;width: 14.5%;height: 100%;z-index: 10">
			<view class="logo">
				<image src="@/images/img2/kgeeeee.png" mode="widthFix"></image>
			</view>
			<text class="biaoti">门店查询</text>
			<view class="menu">
				<view v-for="(item,index) in MenuArr" class="glcx" @click="saleStatement(item,index)"
					:class=" curIndex=== index?'curr':''">
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
		<view class="right">
			<Head style="position: fixed;height: 45px;width: 85.5%;right:0;top:0;background-color: #fff;z-index: 99;"
				:_ynMsg='false'></Head>
			<view class="component-content" style="margin-top: 87px;">
				<component :is="component_name" :_menu="curMenu"></component>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from "@/utils/util.js"
	import Head from '@/pages/Home/Component/Head.vue'
	import Storeinquiry from '@/pages/Querypage/Storeinquiry/Storeinquiry.vue'
	import Statement from '@/pages/Querypage/Statement/Statement.vue'
	import TakeawayCX from '@/pages/Querypage/TakeawayCX/TakeawayCX.vue'
	export default {
		name: "QueryCenter",
		components: {
			Head,
			Storeinquiry,
			Statement,
			TakeawayCX
		},
		data() {
			return {
				curIndex: 0,
				currentComponent: '',
				MenuArr: [],
				curMenu: {}, //当前菜单
				pathIndex: null
			}
		},
		onLoad(e) {
			if (e && e.queryIndex) {
				this.pathIndex = e.queryIndex
			}

		},
		computed: {
			component_name() {
				return this.currentComponent
			}
		},
		created() {
			let tabArr = utils.getStorage('MDMENU');
			if (tabArr && tabArr.length > 0) {
				tabArr.map(item => {
					item.name = item.MenuName;
					item.key = 'Storeinquiry';
					try {
						item.src1 = require('@/images/img2/' + item.MenuId + '-bai.png');
						item.src2 = require('@/images/img2/' + item.MenuId + '-lv.png');
					} catch (e) {
						item.src1 = "";
						item.src2 = "";
					}
				})
				console.log("合并结果：", tabArr);
				this.MenuArr = tabArr;
			} else {
				utils.simpleMsg("暂无权限查看", true);
				return;
			}
			if (this.pathIndex) {
				const index = Number(this.pathIndex)
				this.curMenu = this.MenuArr[index]
				this.curIndex = index
				this.currentComponent = this.MenuArr[index].key;
				return;
			} else if (this.MenuArr.length >= 1) {
				console.log('www')
				this.curMenu = this.MenuArr[0]
				this.currentComponent = this.MenuArr[0].key;
			}
		},

		methods: {
			saleStatement(item, index) {
				this.curMenu = item;
				this.curIndex = index
				this.currentComponent = item.key
				utils.setStorage('queryIndex', index)
			},
			Return: function() {
				uni.redirectTo({
					url: "/pages/Center/Center"
				})
				utils.setStorage('queryIndex', 0)
			}
		}
	}
</script>

<style>
	.contentBox {
		display: flex;
		width: 100%;
		/* height: 100vh; */
		background-color: #F5F4F8;
	}

	.component-content {
		width: 83%;
		margin-left: 16%;
	}
</style>