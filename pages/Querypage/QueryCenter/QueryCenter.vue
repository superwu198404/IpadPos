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
				<component :is="component_name"  :_menu="curMenu"></component>
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
	var that;
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
				tableName: [{
					name: "销售报表",
					src1: require('@/images/img2/xiaoshou.png'),
					src2: require('@/images/img2/xiaoshoucx-cu.png'),
					key: "Statement"
				}, {
					name: "外卖单查询",
					src1: require('@/images/img2/danju.png'),
					src2: require('@/images/img2/danjucx-cu.png'),
					key: 'Storeinquiry'
				}, {
					name: "支付查询",
					src1: require('@/images/img2/zhifu.png'),
					src2: require('@/images/img2/zhifucx-cu.png'),
					key: "Storeinquiry"
				}],
				currentComponent: '',
				MenuArr: [],
				curMenu: {} //当前菜单
			}
		},
		computed: {
			component_name() {
				return this.currentComponent
			}
		},
		created() {
			that = this;
			let arr = utils.getStorage('MDMENU');
			console.log("菜单数量：", arr.length);
			if (arr && arr.length > 0) {
				arr.map(r => {
					let obj = that.tableName.find(r1 => {
						return r1.name == r.MenuName
					});
					if (obj)
						Object.assign(r, obj);
					else {
						r.name = r.MenuName;
						r.key = 'Storeinquiry';
					}
				})
				console.log("合并结果：", arr);
				that.MenuArr = arr;
			} else {
				that.MenuArr = that.tableName;
			}
			that.curIndex = this.MenuArr.findIndex(r => {
				return r.key
			});
			let obj = this.MenuArr.find(r => {
				return r.key
			})
			this.curMenu = obj;
			this.currentComponent = obj.key;
		},
		methods: {
			saleStatement(item, index) {
				if (!item.key) {
					utils.simpleMsg("抱歉，暂未开放", true);
					return;
				}
				this.curMenu = item;
				this.curIndex = index
				this.currentComponent = item.key
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
