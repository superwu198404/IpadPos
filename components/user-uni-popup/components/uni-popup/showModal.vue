<template>
	<!-- 自定义弹窗 -->
	<view class="_showModal" v-show="show">
			<view class="_shade"></view>
			<view class="_modalBox">
				<view class="_modal">
					<slot name="title">
						<view class="title" v-show="title">{{title}}</view>
					</slot>
					<slot name="content">
						<view class="content">{{content}}</view>
					</slot>
					<slot name="btn">
						<view class="btnbox">
							<view v-if="cancelText" class="btn" :style="{color:cancelColor,background:cancelBackgroundColor}" @click.stop="clickBtn('cancel')">{{cancelText}}</view>
							<view class="btn" :style="{color:confirmColor,background:confirmBackgroundColor}" @click.stop="clickBtn('confirm')">{{confirmText}}</view>
						</view>
					</slot>
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		name:"show-modal",
		computed: {
				show(){
					return this.$modalStore.state.show;
				},
				title(){
					return this.$modalStore.state.title;
				},
				content(){
					return this.$modalStore.state.content;
				},
				showCancel(){
					return this.$modalStore.state.showCancel;
				},
				cancelText(){
					return this.$modalStore.state.cancelText;
				},
				cancelColor(){
					return this.$modalStore.state.cancelColor;
				},
				cancelBackgroundColor(){
					return this.$modalStore.state.cancelBackgroundColor;
				},
				confirmText(){
					return this.$modalStore.state.confirmText;
				},
				confirmColor(){
					return this.$modalStore.state.confirmColor;
				},
				confirmBackgroundColor(){
					return this.$modalStore.state.confirmBackgroundColor;
				}
		},
		methods:{
			closeModal(){
				this.$modalStore.commit('hideModal')
			},
			clickBtn(res){
				this.$modalStore.commit('hideModal')
				this.$modalStore.commit('success',res)
			}
		},
		beforeDestroy(){
			this.$modalStore.commit('hideModal')
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
._showModal{
		position: fixed;
		top: 0;
		left:0;
		width: 100%;
		height: 100%;
		z-index:10000;
		._shade{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: #000;
			opacity: .6;
			z-index:11000;
		}
		._modalBox{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index:12000;
			display: flex;
			justify-content: center;
			align-items: center;
			._modal{
				flex: none;
				width:345px;
				min-height:256px;
				background: #fff;
				border-radius: 12px;
				.title{
					text-align: center;
					font-size: 16px;
					font-family: Source Han Sans CN;
					font-weight: bold;
					color: #333333;
					margin-top: 20px;
				}
				.content{
					min-height: 80px;
					width: 284px;
					margin:45px auto;
					font-size: 20px;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #333333;
					display: flex;
					justify-content: center;
					align-items: center;
					letter-spacing: 3px;
				}
				.btnbox{
					display: flex;
					justify-content: center;
					// padding-top: 10px;
					flex-direction: row;
					.btn{
						width: 95px;
						height: 52px;
						border-radius: 12px;
						display: flex;
						justify-content: center;
						align-items: center;
						font-family: Source Han Sans CN;
						font-weight: 500;
						font-size: 16px;
						margin:  -5px 30px 30px 30px;
					}
				}
			}
		}
		
}
</style>