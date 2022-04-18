<template>
	<view>
		<button @click="ApiRquset()">接口请求调用示例</button>
	</view>
</template>

<script>
	import Req from '@/static/js/require.js';
	export default {
		data() {
			return {

			}
		},
		methods: {

			async ApiRquset() {
				const data = {
					 component_appid : "wx9651e053f6f9b4f4",
					 component_secret : "c311ff8584b4384c0f52d314c45ca067"
				};
				let data1 = await Req.post('https://api.weixin.qq.com/cgi-bin/component/api_start_push_ticket', data, {

			async  ApiRquset() {
				const data = {
					type: "queryCustomCard",
					kquser: "CSKQ",
					ynencript: "N",
					others: {
						hyid: "856666000100378999"
					},
					databody: {
						kquser: "CSKQ",
						phone: "18676346720"
					}
				};
				let data1 = await Req.post('http://localhost:5119/webRequest.asmx/webRequestInvoke', data, {

			async ApiRquset() {
				const data = {
					 component_appid : "wx9651e053f6f9b4f4",
					 component_secret : "c311ff8584b4384c0f52d314c45ca067"
				};
				let data1 = await Req.post('https://api.weixin.qq.com/cgi-bin/component/api_start_push_ticket', data, {

					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {

					console.log(JSON.stringify(res));
				}).catch(err => {
					console.log(1);
				}).then(res => {
					console.log(2);

					console.info(JSON.stringify(res));
				}).catch(err => {
					console.info(err);
				}).then(res => {
					console.info(JSON.stringify(res));

					console.log(JSON.stringify(res));
				}).catch(err => {
					console.log(1);
				}).then(res => {
					console.log(2);

				});
			}
		}
	}
</script>

<style>

</style>
