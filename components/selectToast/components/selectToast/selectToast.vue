<template>
	<view class="box" v-if="isShow">
		<view class="gray"  @click="cancel">
		</view>
		<view class="showToast">
			<button type="primary" class="finish" @click="btn()">确定</button>
		</view>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				isShow: false,
				list: ['我是选项1','我是发选项2','我是发发选项3','我是选项4','我是选项5','我是选项6'],
				selectLists:[]
			}
		},
		mounted() {},
		methods: {
			toShow(s) {
				this.isShow = true
			},
			isSelect(val){
				if(this.selectLists.includes(val)){
					this.selectLists.splice(this.selectLists.indexOf(val),1)
					return
				}
				this.selectLists.push(val)
			},
			btn(e){
				this.isShow = false
				this.$emit('finishSelect',this.selectLists)
			},
			cancel(){
				this.isShow = false
			}
		}
	}
</script>
 
<style lang="scss" scoped>
	.box {
		width: 100%;
		height: 100%;
 
		.gray {
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			bottom: 0;
			background-color: #989898;
			opacity: 0.4;
			animation: gray 0.3s;
		}
 
		.showToast {
			width: 100%;
			height: 50vh;
			background-color: #FFFFFF;
			border-radius: 40rpx 40rpx 0 0;
			padding: 25rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			animation: toast 0.5s;
			
			.selectBox{
				width: 100%;
				height: 32vh;
				// overflow-y: auto;
			}
			.select {
				float: left;
				margin: 10rpx;
				padding: 0 16rpx;
				line-height: 40rpx;
				font-size: 20rpx;
				border-radius: 8rpx;
				border: 4rpx solid #bbbbbb;
			}
			.goblue {
				border: 4rpx solid #FFFFFF;
				background-color: #007AFF;
				color: #FFFFFF;
			}
 
 
		}
 
		@keyframes toast {
			from {
				height: 0;
			}
 
			to {
				height: 50vh;
			}
		}
 
		.finish {
			width: 95%;
			position: fixed;
			bottom: 2.5%;
			left: 2.5%;
			background-color: #0076ed;
		}
	}
</style>