<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="full container border-box">
		<view class="navmall" style="height: 100%;">
			<view class="logo">
				<image src="@/images/KGlogo-2.png" mode="widthFix" style="width: 100%;"></image>
			</view>
			<view class="menu">
				<view :class="source.current_menu_info === menu_info ? 'bills curr' : 'bills'"
					v-for="menu_info in source.menu_infos" @click="select_menu(menu_info)">
					<label></label>
					<image class="xz" :src="menu_info.icon_open" mode="widthFix"></image>
					<image class="wx" :src="menu_info.icon_close" mode="widthFix"></image>
					<text>{{menu_info.name}}</text>
				</view>
			</view>
			<view class="fanhui" tabindex="-1">
					<view class="bills">
						<label></label>
						<view @click="SwitchSale('sale')" style="display: flex;justify-content: center;align-items: center;">
							<image class="xz" src="@/images/zhucaidan.png" mode="widthFix"></image>
							<text>返回销售</text>
						</view>
					</view>
			</view>
		</view>
		<div class="component-content">
			<component :is="component_name"  ref="ChildObj"></component>
		</div>
	</view>
</template>

<script>
	//页面组件 👇
	import CouponSale from '@/pages/CouponSale/CouponSale.vue';
	import CardSale from '@/pages/CardSale/CardSale.vue';
	import Cardquery from '@/pages/Cardquery/Cardquery.vue';
	import CardActive from '@/pages/CardActive/CardActive.vue';
	import CouponExchange from '@/pages/CouponExchange/CouponExchange.vue';
	import CardDelay from '@/pages/CardDelay/CardDelay.vue';
	import CardBind from '@/pages/CardBind/CardBind.vue';
	
	import common from '@/api/common.js';
	
	//页面组件 👆
	export default {
		name: "Menu",
		components: {
			CouponSale,
			CardSale,
			Cardquery,
			CardActive,
			CouponExchange,
			CardDelay,
			CardBind
		},
		computed: {
			component_name() {
				console.warn("[ComponentName]当前激活的组件名称:", this.source.current_menu_info?.key);
				return this.source.current_menu_info?.key;
			}
		},
		data() {
			return {
				source: {
					current_menu_info: null,
					menu_infos: [{
							icon_open: require('@/images/img2/kakaka.png'),
							icon_close: require('@/images/img2/kakaka-hui.png'),
							name: 'VIP卡充值',
							key: 'CardSale'
						},
						{
							icon_open: require('@/images/img2/lpkjih-bai.png'),
							icon_close: require('@/images/img2/lpkjih.png'),
							name: '礼品卡激活',
							key: 'CardActive'
						},
						{
							icon_open: require('@/images/img2/quanquan.png'),
							icon_close: require('@/images/img2/quanquan-hui.png'),
							name:'兑换券换卡',
							key: 'CouponExchange'
						},
						{
							icon_open: require('@/images/img2/quanjh-bai.png'),
							icon_close: require('@/images/img2/quanjh.png'),
							name: '券激活',
							key: 'CouponSale'
						},
						{
							icon_open: require('@/images/img2/kachaxun-bai.png'),
							icon_close: require('@/images/img2/kachaxun.png'),
							name: '卡券查询',
							key: 'Cardquery'
						},
						{
							icon_open: require('@/images/img2/kayanqi-bai.png'),
							icon_close: require('@/images/img2/kayanqi.png'),
							name:'卡延期/挂失',
							key: 'CardDelay'
						},					
						{
							icon_open: require('@/images/img2/kabangd-bai.png'),
							icon_close: require('@/images/img2/kabangd.png'),
							name:'卡绑定',
							key: 'CardBind'
						},
					]
				}
			}
		},
		methods: {
			select_menu(info) {
				this.source.current_menu_info = info;
				console.log("[SelectMenu]当前选择的菜单信息:", info);
			},
			setting_default_menu(){//设置默认菜单
				this.source.current_menu_info = this.source.menu_infos[0];
			},
			//普通销售和卡券销售切换
			SwitchSale: function(e) {
				if (common.CheckSign()) {
					if (this.$refs.ChildObj._sale2_count == 0) {
						util.simpleMsg("请先清空卡券信息，再进行切换");
						return;
					}
					util.simpleModal("提示", "是否确认切换到商品销售？", res => {
						if (res) {
							uni.redirectTo({
								url: "/pages//mainSale/MainSale"
							})
						}
					})
				}
			}
		},
		created() {
			console.log("[Created]Menu菜单加载...");
			this.setting_default_menu();
		}
	}
</script>

<style>
	.container {
		display: flex;
	}

	.component-content {
		flex: 1;
	}

	.navmall {
		box-sizing: border-box;
	}

	.menu {
		padding: 0px;
		outline: 0px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.menu .bills {
		padding: 14% 0;
	}
</style>
