<template>
	<view>
		<!-- <menu_page :menuIndex="0"></menu_page> -->
		<custom-tab-bar class="tab-bar-flex" direction="horizontal" :show-icon="false" :selected="current"
			@onTabItemTap="toSecondMenu" />
	</view>
</template>

<script>
	import menu_page from "@/components/menu_page/menu_page.vue"
	
	export default {
		components:{
			menu_page
		},
		data() {
			return {
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
