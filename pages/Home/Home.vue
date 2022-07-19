<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeout.css);
</style>

<template>
	<view class="content">
		<view class="navmall">
			<view class="logo">
				<image src="@/images/kengee-logo.png" mode="widthFix"></image>
			</view>
			<view class="menu">
				<view @click="directional('销售')" :class="selected('销售')">
					<image class="xz" src="@/images/xiaoshou.png" mode="widthFix"></image>
					<image class="wx" src="@/images/xiaoshou-hui.png" mode="widthFix"></image>
					<text>销售</text>
				</view>
				<view @click="directional('预定')" :class="selected('预定')">
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>预定</text>
				</view>
				<view @click="directional('预定提取','Extract')" :class="selected('预定提取')">
					<image class="xz" src="@/images/xz-ydtq.png" mode="widthFix"></image>
					<image class="wx" src="@/images/wxz-ydtq.png" mode="widthFix"></image>
					<text>预定提取</text>
				</view>
				<view @click="directional('外卖单','TakeAway')" :class="selected('外卖单')">
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>外卖单</text>
				</view>
				<view @click="directional('线上订单','OnlineOrders')" :class="selected('线上订单')">
					<image class="xz" src="@/images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="@/images/yuding-hui.png" mode="widthFix"></image>
					<text>线上订单</text>
				</view>
				<view @click="directional('退单业务')" :class="selected('退单业务')">
					<image class="xz" src="@/images/xz-th.png" mode="widthFix"></image>
					<image class="wx" src="@/images/wxz-th.png" mode="widthFix"></image>
					<text>退单业务</text>
					<view class="chargeback" v-if="menu.refundBussiness.option">
						<label class="currs">
							<image class="xz" src="@/images/xstd.png" mode="widthFix"></image>
							<image class="wx" src="@/images/xstd-wxz.png" mode="widthFix"></image>
							<text>销售退单</text>
						</label>
						<label>
							<image class="xz" src="@/images/ydqx.png" mode="widthFix"></image>
							<image class="wx" src="@/images/ydqx-wxz.png" mode="widthFix"></image>
							<text>预订取消</text>
						</label>
						<label>
							<image class="xz" src="@/images/sxtd.png" mode="widthFix"></image>
							<image class="wx" src="@/images/sxtd-wxz.png" mode="widthFix"></image>
							<text>赊销退单</text>
						</label>
					</view>
				</view>
				<view @click="directional('消息')" :class="selected('消息')">
					<image class="xz" src="@/images/xz-xx.png" mode="widthFix"></image>
					<image class="wx" src="@/images/xiaoxi-hui.png" mode="widthFix"></image>
					<text>消息</text>
				</view>
			</view>
			<view class="exit" @click="back()">
				<image src="@/images/tuichu.png" mode="widthFix"></image>
				<text>退出</text>
			</view>
		</view>
		<view class="right">
			<view class="nav">
				<view class="getback">
					<view class="message">
						<view class="imgs">
							<image src="@/images/tongzhi.png" mode="widthFix"></image>
						</view>
						<text>门店有一条新的外卖配送单消息来啦...</text>
					</view>
				</view>
				<view class="stores">
					<view class="checkout">
						<label>
							<image src="@/images/dx-mendian.png" mode="widthFix"></image>{{NAME}}
						</label>
						<label>
							<image src="@/images/dx-kuantai.png" mode="widthFix"></image>款台号：{{POSID}}
						</label>
					</view>
					<view class="account">
						<text>{{RYID}}</text>
						<view>
							<image src="@/images/touxiang.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="listof">
				<view class="prolist">
					<component :is="currentPage.componentName"></component>
				</view>
			</view>

		</view>
	</view>

	</view>
</template>

<script>
	import {
		global
	} from '@/models/PaymentAll/models.js';
	
	import OnlineOrders from '@/pages/OnlineOrders/OnlineOrders.vue'
	import TakeAway from '@/pages/TakeAway/TakeAway.vue'
	import Extract from '@/pages/Extract/Extract.vue' 
	
	export default {
		mixins:[global],
		components:{
			OnlineOrders,
			TakeAway,
			Extract
		},
		data(){
			return {
				currentPage:{
					componentName:"",//组件名称
					name:"" //菜单中文名
				},
				menu:{
					refundBussiness:{
						option:false
					},
					router:[
						{
							
						}
					]
				}
			}
		},
		computed:{
			selected:function(){
				return (function(name) {
					 return this.currentPage.name === name ? "curr" : "";
				}).bind(this)
			}
		},
		watch:{
			currentPage(n,o){
				
			}
		},
		methods:{
			directional(name,component){
				console.log("功能切换：" + name)
				this.currentPage.name = name;
				this.currentPage.componentName = component;
			},
			back(){
				console.log("返回上一个界面！")
				uni.navigateTo({
					url:'../index/index'
				})
			},
			init(){
				this.currentPage.componentName = 'OnlineOrders'
				this.currentPage.name = '线上订单'
			}
		},
		mounted(){
			this.init();
		}
	}
</script>

<style>
	.products{
		padding: 0px;
	}
</style>