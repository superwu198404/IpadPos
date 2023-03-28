<template>
	<!-- 内容栏 -->
	<view class="steps">
		<view :class="step == 1 ? 'listep curr' : 'listep'">
			<text class="xuhao">01</text>
			<view class="setname"><label>录入待售券</label><text>扫券，或手动录入</text></view>
			<em>>>>>>></em>
		</view>
		<view :class="step == 2 ? 'listep curr' : 'listep'">
			<text class="xuhao">02</text>
			<view class="setname"><label>确认折扣和金额</label><text>是否选大客户赊销等</text></view>
			<em>>>>>>></em>
		</view>
		<view :class="step == 3 ? 'listep curr' : 'listep'">
			<text class="xuhao">03</text>
			<view class="setname"><label>支付</label><text>先支付，后激活</text></view>
			<em>>>>>>></em>
		</view>
		<view :class="step == 4 ? 'listep curr' : 'listep'">
			<text class="xuhao">04</text>
			<view class="setname"><label>等待激活</label><text>已支付订单</text></view>
			<!-- <em>>>>>>></em> -->
		</view>
	</view>
</template>

<script>
	export default {
		name:"CouponSaleSteps",
		data(){
			return {
				step: 1
			}
		},
		methods:{
			next(){
				if(this.step <= 4)
					this.step++;
			},
			back(){
				if(this.step >= 0)
				this.step--;
			},
			set_step(index){
				if(index >= 0 && index <= 4)
					this.step = index;
			}
		},
		created() {
			
		}
	}
</script>

<style>
	.steps{
		display: flex;
		width:88%;
		padding:2%;
	}
	.steps .listep{
		width:29%;
		display: flex;
		align-items: center;
		position: relative;
	}
	.steps .listep:nth-child(4){
		width:14%;
	}
	.steps .listep .xuhao{
		display: flex;
		background-color: #E0EAE9;
		color: #006B44;
		width:50rpx;
		height: 50rpx;
		border-radius: 50%;
		justify-content: center;
		align-items: center;
		margin-right: 16rpx;
		font-weight: 700;
		font-size: 26rpx;
	}
	.steps .listep .setname{
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		color: #B0B0B0;
	}
	.steps .listep .setname text{
		font-size: 24rpx;
		color: #DADADA;
		line-height: 50rpx;
	}
	.steps .listep em{
		color: #B0B0B0;
		font-size: 24rpx;
		position: absolute;
		top:50%;
		left: 60%;
		transform: translateY(-50%);
	}
	.steps .listep.curr .xuhao{
		background-color: #006B44;
		color: #fff;
	}
	.steps .listep.curr .setname{
		color: #333;
		font-weight: 700;
	}
	.steps .listep.curr .setname text{
		color: #B0B0B0;
		font-weight: 400;
	}
	.steps .listep.curr em{
		color: #006B44;
	}
</style>