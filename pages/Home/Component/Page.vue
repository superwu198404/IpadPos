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
						@click="ToPage(item1)">
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
					// console.log("1111:", name + title);
					// console.log("2222:", this.name + this.title);
					return (this.name === name) && (this.title === title)
				});
			}
		},
		data() {
			return {
				urls: router,
				menuIndex: 0,
				sec_index: 0
			};
		},
		// props: {
		// 	Chargeback: false,
		// 	menuIndex: 0,
		// 	sec_index: 0
		// },
		methods: {
			ToPage: function(e) {
				console.log("[ToPage]切换:", e);
				let store = util.getStorage("store");
				console.log("签到记录：", store.OPENFLAG);
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
					this.CloseAllChildMenu(e.title);
				}
			},
			CloseAllChildMenu: function(title) {
				this.urls.map((item, index) => {
					if (item.title != title) {
						item.showDetail = false;
					} else {
						item.showDetail = !item.showDetail;
					}
				})
			},
		}
	}
</script>

<style>
</style>
