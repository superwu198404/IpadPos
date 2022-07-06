<template>
	<view>

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

	var that;
	export default {
		data() {
			return {
				KHID: getApp().globalData.store.KHID,
				WMOrders: []
			}
		},
		methods: {
			onload: function() {
				that = this; //全局赋值

				that.GetOrders(that.KHID)
			},
			//获取外卖单数据
			GetOrders: function(e) {
				_take.GetWMOrders(e, res => {
					console.log("外卖单查询结果：", res);
					if (res.code) {
						WMOrders: res.data
					}
					else {
						uni.showToast({
							title: res.msg
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
