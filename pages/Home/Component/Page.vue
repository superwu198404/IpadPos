<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="navmall">
		<view class="logo">
			<image src="@/images/kengee-logo.png" mode="widthFix"></image>
		</view>
		<view class="menu" style="overflow-y:auto;overflow-x:hidden;">
			<view v-for="(value,key) in menu_info" @click="MenuSelect(key,value)" :class="Selected(key) ? 'curr' : ''">
				<image class="xz" :src="value.icon_open" mode="widthFix"></image>
				<image class="wx" :src="value.icon_close" mode="widthFix"></image>
				<text>{{value.nameSale}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import base_sale from '@/utils/sale/base_sale.js'
	import util from '@/utils/util.js';
	export default {
		name: "Page",
		computed: {
			Selected: function() {
				return util.callBind(this, function(name) {
					return name === this.current_info?.name;
				});
			}
		},
		data() {
			return {
				previous_info: null, //上一个菜单信息
				current_info: null, //当前菜单信息
				menu_info: null
			};
		},
		methods: {
			MenuSelect(menu_name, menu_info) {
				this.previous_info = this.current_info;
				this.current_info = {
					name: menu_name,
					info: menu_info
				};
				uni.$emit("change",this.current_info);
			}
		},
		created() {
			console.log("[Page-Mounted]菜单初始化开始...");
			this.menu_info = base_sale.XsTypeObj;
			this.current_info = {
				name:'sale',
				info:this.menu_info.sale
			}
			console.log("[Page-Mounted]菜单初始化完毕:", this.menu_info);
		}
	}
</script>

<style>
	.menu{
		padding: 0px;
	}
</style>
