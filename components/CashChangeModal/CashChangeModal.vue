<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
	@import url(@/static/style/message.css);
</style>

<template>
	<view v-show="visible" class="cash-modal-box">
		<view class="cash-modal-contain">
			<view class="cash-modal-head">
				<span>找零提示</span>
				<span class="cash-modal-close-btn" @click="Cancel">×</span>
			</view>
			<view class="cash-modal-content">
				{{ text }}
			</view>
			<view class="cash-modal-btn-groups">
				<button class="btn btn-qr btn-flex" @click="Confirm">确认</button>
				<button class="btn btn-qk btn-flex" @click="Cancel">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			visible: Boolean,
			text: String,
			confirm: Boolean
		},
		methods:{
			Confirm(){
				this.$emit("update:visible",false);
				this.$emit("update:confirm",true);
				uni.$emit("cash-modal-confirm");
			},
			Cancel(){
				this.$emit("update:visible",false);
				this.$emit("update:confirm",false);
				uni.$emit("cash-modal-cancel");
			}
		}
	}
</script>

<style>
	.cash-modal-box{
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999999;
		top: 0;
		left: 0;
		border: 1px solid red;
	}
	
	.cash-modal-head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2px 5px;
		box-sizing: border-box;
	}
	
	.cash-modal-close-btn{
		padding: 3px;
		box-sizing: border-box;
		font-weight: bold;
	}
	
	.cash-modal-contain{
		width: 30%;	
		display: flex;
		flex-direction: column;
		border-radius: 5px;
		background-blend-mode: multiply;
		background-image: url(../../images/dx-tchw.png);
		background-size: contain;
		background-repeat: no-repeat;
		background-color: white;
		padding: 5px;
		box-sizing: border-box;
		box-shadow: 0px 0px 6px -1px var(--green);
	}
	
	.cash-modal-btn-groups{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		gap:10px;
	}
	
	.cash-modal-content{
		flex:1;
		padding: 30px 10px;
		box-sizing: border-box;
	}
	
	.btn-flex{
		width: 20%;
		height: 90%;
		line-height: 40px;
		font-size: 16px;
	}
</style>