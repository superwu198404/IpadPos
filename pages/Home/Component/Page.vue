<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="navmall">
		<view class="logo">
			<image src="@/images/kengee-logo.png" mode="widthFix" @click="OpenDevoloper"></image>
		</view>
		<view class="menu" style="overflow-y:auto;overflow-x:hidden;">
			<view class="bills" v-for="(value,key) in menu_info" @click="MenuSelect(key,value)"
				:class="Selected(key) ? 'curr' : ''">
				<label></label>
				<image class="xz" :src="value.icon_open" mode="widthFix"></image>
				<image class="wx" :src="value.icon_close" mode="widthFix"></image>
				<text>{{value.nameSale}}</text>
			</view>
		</view>
		<view class="menu gongju">
			<view class="bills">
				<label></label>
				<view @click="showGJ=!showGJ">
					<image class="xz" src="@/images/gongju.png" mode="widthFix"></image>
					<image class="wx" src="@/images/gongju-hui.png" mode="widthFix"></image>
					<text>工具</text>
				</view>
				<view class="chargeback" v-if="showGJ">
					<view class="currs" @click="ShowTool('CX')">
						<image class="xz" src="@/images/dqcuxiao.png" mode="widthFix"></image>
						<image class="wx" src="@/images/dqcuxiao-wxz.png" mode="widthFix"></image>
						<text>当前促销活动</text>
					</view>
					<view @click="ShowTool('TX')">
						<image class="xz" src="@/images/tongxun.png" mode="widthFix"></image>
						<image class="wx" src="@/images/tongxun-wxz.png" mode="widthFix"></image>
						<text>通讯</text>
					</view>
					<!-- <view @click="ShowTool('CD')">
						<image class="xz" src="@/images/chongdu.png" mode="widthFix"></image>
						<image class="wx" src="@/images/chongdu-wxz.png" mode="widthFix"></image>
						<text>重读</text>
					</view> -->
					<view @click="ShowTool('SC')">
						<image class="xz" src="@/images/wschuan.png" mode="widthFix"></image>
						<image class="wx" src="@/images/wschuan-wxz.png" mode="widthFix"></image>
						<text>未上传</text>
					</view>
					<view class="currs" @click="CloseDB">
						<image class="xz" src="@/images/dqcuxiao.png" mode="widthFix"></image>
						<image class="wx" src="@/images/dqcuxiao-wxz.png" mode="widthFix"></image>
						<text>断开连接</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import base_sale from '@/utils/sale/base_sale.js'
	import util from '@/utils/util.js';
	import db from '@/utils/db/db_excute.js';
	import Promotion from '@/pages/Promotion/Promotion.vue'; //页面注册为组件
	export default {
		components: {
			Promotion
		},
		name: "Page",
		props: {
			current: String
		},
		computed: {
			Selected: function() {
				return util.callBind(this, function(name) {
					return name === this.current_info?.name;
				});
			},
		},
		watch: {
			current: function(n, o) {
				this.current_info.name = n;
				this.current_info.info = this.menu_info[n];
			}
		},
		data() {
			return {
				previous_info: null, //上一个菜单信息
				current_info: null, //当前菜单信息
				menu_info: null,
				showGJ: false,
				showCX: false,
				click_num: 0,
				timer: 0
			};
		},
		methods: {
			MenuSelect(menu_name, menu_info) {
				this.previous_info = this.current_info;
				// this.current_info = {
				// 	name: menu_name,
				// 	info: menu_info
				// };
				console.log("[MenuSelect]切换页面...");
				uni.$emit("change", {
					name: menu_name,
					info: menu_info
				});
			},
			OpenDevoloper() {
				this.click_num++;
				if (!this.timer)
					this.timer = setTimeout(util.callBind(this, function() {
						this.click_num = 0;
						this.timer = 0;
					}), 5000);
				if (this.click_num === 10){
					uni.showModal({
						title:"输入密码",
						editable:true,
						success(res){
							if(res.confirm && res.content==='1234321'){
								uni.navigateTo({
									url: "../index/index"
								})
							}
						}
					})
				}
			},
			//工具
			ShowTool: function(e) {
				util.simpleMsg("暂未开放", true);
				return;
				if (!e) {
					this.showGJ = !this.showGJ;
					this.showCX = false;
					return;
				}
				if (e == 'CX') {
					this.showCX = !this.showCX;
				}
			},
			CloseDB: async function() {
				await db.get().close();
			}
		},
		created() {
			console.log("[Page-Mounted]菜单初始化开始...");
			this.menu_info = base_sale.XsTypeObj;
			this.current_info = {
				name: 'sale',
				info: this.menu_info.sale
			}
			console.log("[Page-Mounted]菜单初始化完毕:", this.menu_info);
			uni.$off('set-menu');
			uni.$on('set-menu', util.callBind(this, function(data) {
				console.log("[Page]手动切换菜单!", data);
				this.current_info.name = data;
				this.current_info.info = this.menu_info[data];
				console.log("[Page]当前菜单:", this.current_info);
				this.$forceUpdate();
			}))
		}
	}
</script>

<style>
	.menu {
		padding: 0px;
	}
</style>
