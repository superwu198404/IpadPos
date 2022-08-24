<template>
	<view>
		<button @click="toDbqry">数据查看</button>
		<button @click="toIndex">去结算</button>
		<button @click="toPrinter">蓝牙与打印</button>
	</view>
</template>

<script>
	var app = getApp();
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _checker from '@/utils/graceChecker.js';
	import _msg from '@/api/business/message.js';
	import _main from '@/api/business/main.js';

	var that;
	export default {
		data() {
			return {}
		},
		methods: {
			toDbqry: function() {
				uni.navigateTo({
					url: "/pages/sqlitetest/sqlitetest"
				});
			},
			toIndex: function() {
				uni.navigateTo({
					url: "/pages/index/index"
				});
			},
			toPrinter: function() {
				uni.navigateTo({
					url: "/pages/xprinter/home"
				});
			},
		}
	}
</script>

<style>

</style>
