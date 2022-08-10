<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
</style>
<template>
	<view class="content" style="overflow: hidden;">
		<menu_page :menuIndex="menuIndex" :sec_index="sec_index"></menu_page>
		<view class="right">
			<menu_head></menu_head>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "menu_content",
		props: {
			index: 0,
			_index: 0,
		},
		data() {
			return {
				menuIndex: 0,
				sec_index: 0
			}
		},
		created() {
			this.menuIndex = this.index; //变量本地化
			this.sec_index = this._index; //变量本地化
		}
	}
</script>

<style>
	.right {
		display: flex;
		flex-direction: column;
	}
</style>
