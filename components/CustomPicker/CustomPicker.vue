<template>
	<view class="custom-picker-box">
		<view class="custom-text-box" tabindex='-1' @click="switch_open_close" @blur="open_options = false">{{ text }}</view>
		<view :class="options_style">
			<view class="custom-picker-option" v-for="item in range" @click="select_option(item)">{{ item[title] }}</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"CustomPicker",
		props:{
			range: Array,
			value: [String,Number,Object],
			title: String,
			value: String
		},
		data(){
			return {
				text: "请选择...",
				open_options: null
			}
		},
		computed:{
			options_style(){
				if(this.open_options == true){
					return 'custom-picker-options open-options';
				}
				else if(this.open_options == false){
					return 'custom-picker-options close-options';
				}
				else{
					return 'custom-picker-options'
				}
			}
		},
		methods:{
			select_option(data){
				if(this.value){
					this.text = data[this.title];
					this.$emit('change',data[this.value]);
				}
				else{
					this.text = data[this.title];
					this.$emit('change',data);
				}
			},
			switch_open_close(){
				console.warn("开关picker:",this.open_options);
				if(this.open_options?.constructor == Boolean){
					this.open_options = !this.open_options;
				}
				else{
					this.open_options = true;
				}
			}
		},
		created() {
			
		}
	}
</script>

<style scoped>
	.custom-picker-box *{
		box-sizing: border-box;
	}
	
	.custom-picker-box, .custom-text-box{
		border-radius: 5rpx;
		padding: 2rpx 4rpx;
		position: relative;
	}
	
	.custom-picker-box, .custom-text-box,.custom-picker-box *{
		background-color: #f5f4f8;
	}
	
	.custom-picker-box{
		border: 1px solid #C5E7C8;
		height: 30rpx;
		width: 200rpx;
		display: flex;
		justify-content: center;
	}
	
	.custom-text-box{
		display: flex;
		align-items: center;
		justify-content: left;
		width: 100%;
		height: 100%;
	}
	
	.custom-picker-options{
		border-radius: 5rpx;
		position: absolute;
		top: 108%;
		margin: 0rpx 5rpx;
		display: flex;
		flex-direction: column;
		width: 96%;
		gap:4rpx;
		height: 0;/* single char 2em */
		overflow-y: auto;
		box-shadow: 0px 0px 10px -2px #C5E7C8;
	}
	
	.custom-picker-option{
		width: 100%;
		padding: 2px 4px;
		position: relative;
	}
	
	.custom-picker-option:not(:last-child)::before{
		content: "";
		display: inline-block;
		position: absolute;
		top:100%;
		width: 96%;
		left: 50%;
		transform: translate(-50%);
		border-bottom: 1rpx solid darkgray;
		border-color: rgba(0, 0, 0, .1);
	}
	
	.open-options {
		animation: options-open .5s ease-in-out 0s 1 reverse forwards;
	}
	
	.close-options{
		animation: options-close .5s ease-in-out 0s 1 alternate forwards;
	}
	
	@keyframes options-open {
		0% {
			height: calc(8em);
			opacity: 1;
		}
		100% {
			height: 0em;
			opacity: 0;
		}
	}
	
	@keyframes options-close {
		0% {
			height: calc(8em);
			opacity: 1;
		}
		100% {
			height: 0em;
			opacity: 0;
		}
	}
</style>