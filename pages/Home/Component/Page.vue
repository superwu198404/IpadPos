<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="navmall">
		<view class="logo">
			<image src="@/images/kengee-logo.png" mode="widthFix"></image>
		</view>
		<view class="menu">
			<view v-for="(item,index) in urls" :class="Selected(item.name,item.title)?'curr':''" @click="ToPage(item)">
				<image class="xz" :src="item.icon" mode="widthFix"></image>
				<image class="wx" :src="item.icon1" mode="widthFix"></image>
				<text>{{item.title}}</text>
				<view class="chargeback" v-if="item.details&&item.showDetail">
					<label v-for="(item1,index1) in item.details" :class="sec_index==item1.index?'currs':''"
						@click.capture.stop="ToPage(item1)">
						<image class="xz" :src="item1.icon" mode="widthFix"></image>
						<image class="wx" :src="item1.icon1" mode="widthFix"></image>
						<text>{{item1.title}}</text>
					</label>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import router from '@/utils/router.js'
	import util from '@/utils/util.js';
	export default {
		name: "Page",
		props: {
			name: String,
			title: String
		},
		computed: {
			Selected: function() {
				return util.callBind(this, function(name, title) {
					let child = this.urls.find(i => i.name == name && i.title == title)?.$child?.find(i => i.name == this.name && i.title == this.title);
					return child ? true : (this.name === name) && (this.title === title)
				});
			}
		},
		data() {
			return {
				urls: (function(){
					var func = (arr = [],layer = 1) => {
						arr.forEach(i => {
							i.$parent = "";//添加属性，方便后续监听
							i.$layer = layer;//添加属性，方便后续监听
							i.$child = [];//当前菜单下的子菜单
							if(i.details && i.details.length > 0) func(i.details,layer+1);
						})
						return arr;
					}
					return func(router);
				})(),
				menuIndex: 0,
				sec_index: 0
			};
		},
		methods: {
			ToPage: function(e) {
				console.log("[ToPage]切换:", e);
				let store = util.getStorage("store");
				if (store.OPENFLAG != '1') {
					util.simpleMsg("请先进行签到", true);
					return;
				}
				if (e.url_type && e.url_type == 'single') {
					if (e.name == 'Stress') {
						util.simpleModal("提示", "重读将销毁已保存的业务数据，是否继续？", res => {
							if (res) {
								console.log("测试");
								util.removeStorage("Init_Data");
								console.log("测试1:", e.url);
								uni.redirectTo({
									url: e.url,
									complete: r => {
										console.log(r);
									}
								})
							}
						})
					}
				} else {
					if (e.url) {
						this.menuIndex = e.index;
						if (e.details)
							this.sec_index = -1
						else
							this.sec_index = e.index;
					}
					this.$emit("switch", {
						switch: e.url ? true : false,
						name: e.name,
						title: e.title
					});
					this.menuIndex = e.index;
					this.CloseAllChildMenu(e);
				}
			},
			CloseAllChildMenu: function(menu) {
				this.urls.map((item, index) => {
					if (item.title != menu.title) {
						item.showDetail = false;
					} else {
						item.showDetail = !item.showDetail;
					}
				})
				if(menu.$parent) menu.$parent.showDetail = false;
			},
		},
		mounted() {
			var func = (arr = [],parent = null,child) => {
				arr.forEach(i => {
					i.$parent = parent;
					if(child)
						i.$child = child;
					else
						i.$child = [];
					i.$child.push(i);
					if(i.details && i.details.length > 0) func(i.details,i,i.$child);
				})
			}
			func(this.urls);
		}
	}
</script>

<style>
</style>
