<template>
	<view>
		 <button type="default" @click="ScanCode()">调起条码扫描</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			ScanCode:function(){
				// 调起条码扫描
				uni.scanCode({
					onlyFromCamera: false,//是否只能从相机扫码，不允许从相册选择图片
					scanType: ['barCode','qrCode','pdf417','datamatrix'],
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
			},
		}
	}
</script>
<style>
</style>
