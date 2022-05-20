<template>
	<view>
		请选择查询方式：
		<view>
			<radio-group class="radio-group" @change="radioChange">
				<label class="radio">
					<radio value="1" /> 手机号
					<radio value="2" /> 会员号
				</label>
			</radio-group>
		</view>
		请输入会员手机号码/会员号：
		<input type="text" v-model="mumbers" />
		<button @click="query()">查询</button>
		<button @click="Codequery()">扫码查询</button>
		结果：
			<view  class="style_div">{{content}}</view>  
	</view>
</template>

<script>
	import hy from '@/utils/hy/hy_query.js';
	export default {
		data() {
			return {
				type: null,
				typeName: null,
				mumbers: null,
				content: null,
				isshow:true,
				barnd: getApp().globalData.brand
			}
		},
		methods: {
			radioChange: function(e) {
				this.type = e.target.value;
				if (this.barnd == "KG") {
					if (this.type == '1') {
						this.typeName = 'Mobile';
					}
					if (this.type == '2') {
						this.typeName = 'ACCOUNT';
					}
				} else {
					if (this.type == '1') {
						this.typeName = 'phone';
					}
					if (this.type == '2') {
						this.typeName = 'hyid';
					}
				}
			},
			query: function() {
				let that = this;
				if (!that.type) {
					uni.showToast({
						title: "请选择查询方式",
						icon: "error"
					})
					return;
				}
				if (!that.mumbers) {
					let msg = "";
					if (that.type == 1) {
						msg = "请输入手机号码"
					} else {
						msg = "请输入会员号码"
					}
					uni.showToast({
						title: msg,
						icon: "error"
					});
					return;
				}
				let obj = {
					acc: that.mumbers,
					type: that.typeName
				}
				hy.HyQuery(obj,
					function(res) {
						that.content =JSON.stringify(res) ;
					});
			} ,
			Codequery:function(){
				let that = this;
				// 调起条码扫描
				// uni.scanCode({
				// 	onlyFromCamera: false,//是否只能从相机扫码，不允许从相册选择图片
				// 	scanType: ['barCode','qrCode','pdf417','datamatrix'],
				// 	success: function (res) {
						
				// 	}
				// });
				let obj="ZY5244621958248771";
				hy.HyCodeQuery(obj,
					function(res) {
						that.content =JSON.stringify(res) ;
					});
			}
		},
		onLoad(){
		 
		}
	}
</script>
<style>
	.style_div {
		width: 100%;
		/*盒子宽自己设置想要的宽度*/
		height: auto;
		/*高度自动*/
		display: inline-block;
		/*转为行内块元素*/
		white-space: pre-wrap;
		/*处理元素内的空白,保留空白符序列，但是正常地进行换行*/
		word-wrap: break-word;
		/*允许长单词或 URL 地址换行到下一行,在长单词或 URL 地址内部进行换行*/
	}
</style>
