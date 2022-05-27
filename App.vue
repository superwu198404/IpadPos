<script>
	import common from '@/api/common.js';
	let int;
	export default {
		globalData: {
			appid: 'keengee',
			kquser: "CSKQ",
			brand: "ZY",
			store: {
				GSID: "1001",
				KHID: "K0101QTDS1",
				POSID: "1",
				RYID: "10086",
				KCDID: "123",
				DPID: "123",
				DKFID: '80000000',
				BMID: "001",
				GCID: "1001",
				NAME: "武汉xxx",
				MERID: "999990053990001",
				deviceno: "13001001"
			},
			hyinfo: null
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			
			//1min执行一次销售单传输
			// int = setInterval(() => {
			 	//common.TransLiteData();
			// }, 1000 * 60); 
		},
		onHide: function() {
			console.log('App Hide');
			clearInterval(int);
		}
	}
</script>

<style>

</style>
