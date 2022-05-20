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
		<view class="style_div">{{content}}</view>
		<view>
			<uni-popup ref="popup" type="center" :maskClick="false">
				<view class="uni-tip">
					<button @click="close">关闭</button>
					会员码：
					<input confirm-type="confirm" @confirm="search" v-model="code">
				</view>
			</uni-popup>
		</view>
	</view>

</template>
<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue';
	import hy from '@/utils/hy/hy_query.js';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: null,
				typeName: null,
				mumbers: null,
				content: null,
				isshow: true,
				barnd: getApp().globalData.brand,
				KHID: getApp().globalData.store.KHID,
				code: null

			}
		},
		methods: {
			close: function() {
				this.$refs['popup'].close();
			},
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
						that.content = JSON.stringify(res);
					});
			},
			Codequery: function() {
				this.$refs['popup'].open();
			},
			search:function(){
				let that = this;
				if(!that.code){
					uni.showToast({
						title: "请输入会员码",
						icon: "error"
					});
					return;
				}
				let obj;
				if (that.brand == 'KG') {
					obj = {
						KHID: that.KHID,
						code: that.code
					}
				} else {
					obj = that.code;
				}
				hy.HyCodeQuery(obj,
					function(res) {
						that.content = JSON.stringify(res);
						that.$refs['popup'].close();
					});
			}
		},
		onLoad() {

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
	.uni-tip {
		background: #fff;
		width: 70%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		border-radius: 10px;
	}

	.uni-tip-title {
		text-align: center;
		font-size: 16px;
	}

	.uni-tip-group-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-content: center;
	}

	.uni-tip-group-button button {
		margin: 0;
	}

	.uni-tip-content {
		min-height: 60px;
	}
</style>

