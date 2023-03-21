<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/takeout.css);
</style>
<template>
	<view class="listof listof-correct">
		<view class="prolist prolist-correct zxpro " style="width: 92%;">
			<view class="choice">
				<view v-for="tab in tabs" :class="tab == source.select_tab ? 'tab curr' : 'tab'" @click.capture="select_tab(tab)">
					<label>
						<image src="@/images/img2/VIP-skaczhi.png" mode="widthFix"></image>
						<text>{{ tab.title }}</text>
					</label>
					<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
				</view>
			</view>
			<slot name="content"></slot>
		</view>
		<view class="operation operation-correct">
			<view class="sorting">
				<slot name="tools"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"Tabs",
		props:{
			tabs:Array
		},
		data(){
			return {
				source:{
					select_tab: null,
				}
			}
		},
		watch:{
			'source.select_tab'(n,o){
				this.$emit('change',n);
			}
		},
		methods:{
			select_tab(info){
				this.source.select_tab = info;
			}
		},
		created() {
			console.log("[Created]初始化默认选中项目:",this.tabs);
			if(this.tabs.length) this.source.select_tab = this.tabs[0];
			console.log("[Created]初始化默认选中项目完成:",this.source.select_tab);
		}
	}
</script>

<style>
	.right-correct {
		display: flex;
		flex-direction: column;
	}

	.listof-correct {
		width: auto;
		flex: 1;
		display: flex;
		align-items: center;
		padding-bottom: 22px;
		padding-top: 20px;
		box-sizing: border-box;
	}

	.prolist-correct {
		height: 100%;
	}

	.operation-correct {
		height: 100%;
		margin-top: -40px;
	}
</style>
