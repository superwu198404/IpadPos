<template>
	<!-- 内容栏 -->
	<view class="steps">
		<span id='rule' style="visibility: hidden;position: absolute;">></span>
		<view v-for="(step,index) in steps" :class="index == 0 ? 'listep curr' : 'listep'">
			<text v-if="step" class="xuhao">{{ step.index.padStart(2,0) }}</text>
			<view v-if="step" class="setname"><label>{{ step.title }}</label><text>{{ step.remark }}</text></view>
			<em v-if="!step" class="step-right-arrow" :style="step_style">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>></em>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/util';
	var $;
	export default {
		name:"CouponSaleSteps",
		data(){
			return {
				step: 1,
				steps: [
					{
						title:"操作1",
						remark: "操作1说明"
					},
					{
						title:"操作2",
						remark: "操作2说明"
					},
					{
						title:"操作3",
						remark: "操作3说明"
					},
					{
						title:"操作4",
						remark: "操作4说明"
					}
				],
				step_style: {
					width:'auto'
				},
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
			},
			steps_style_computed(){
				let steps_include_gap = [];
				this.steps.map($(function(step,index){
					step.index = (index + 1).toString();
					if(index + 1 == this.steps.length){
						steps_include_gap.push(step);
					}
					else{
						steps_include_gap.push(step);
						steps_include_gap.push(null);
					}
				}))
				this.steps = steps_include_gap;
			}
		},
		mounted() {
			uni.createSelectorQuery().select(".steps .listep").boundingClientRect($(function(standard_data){
				uni.createSelectorQuery().select(".step-right-arrow").boundingClientRect($(function(arrow_data){
					let single_arrow_width = (arrow_data.width / 112),width = (standard_data.width - (standard_data.width % single_arrow_width)) + "px";
					this.step_style.width = width;
					this.step_style = this.step_style;
				})).exec();
			})).exec();
		},
		created() {
			$ = util.callContainer(this);
			this.steps_style_computed();
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
		flex: 1;
		overflow: hidden;
		justify-content: center;
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
		/* left: 60%; */
		transform: translateY(-50%);
		width: 80%;
		overflow: hidden;
		text-overflow: clip;
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