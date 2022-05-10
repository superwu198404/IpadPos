<script>
	import store from '@/store'
	import common from '@/api/common.js'
	export default {
		globalData: {
			appid: 'keengee'
		},
		onLaunch: function() {
			//初始化数据
			//ommon.InitData("K210QTD001")
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.uni-forms-item__inner {
		padding-bottom: 10px !important;
	}
  /*每个页面公共css */
  .uni-forms-item__inner {
    padding-bottom: 10px !important;
  }
</style>
