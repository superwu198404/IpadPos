<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<query></query>
		<view class="right" style="position: relative;">
			<!-- :custom="mainSale.ComponentsManage.DKF" :_showSale="mainSale.currentOperation.ynCancel"
					:_ynDKF="mainSale.currentOperation.DKF" :type="mainSale.current_type.clickType" -->
			<Head></Head>
			<view class="listof" style="position: absolute;z-index: 0;">
				<view class="prolist">
					<view class="hh" style="padding-right:3.7%;">
						<view class="hotcakes">
							<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 功能中心
						</view>
						<!-- v-for="(xplitem, xplindex) in mainSale.selectFlagList"
							:class="mainSale.selectPlid==xplitem.plid?'curr':''"
							@click="mainSale.selectPlidChenged"
							:data-plid="xplitem.plid"  {{xplitem.plname}}-->
						<view class="classifys">
							<text  class="curr">日销售</text>
							<text >品类</text>
						</view>
					</view>
					<view class="commodity">
						<!-- 大类循坏 -->
						<view class="broadcate" >
							<view class="mokuai">日销售<text>/8</text></view>
							<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
							<view class="ol">
								<view class="li">
									<text class="zhuangs">裱</text>
									<label><image src="@/images/img2/biaodan-cai.png" mode="widthFix"></image> 表单</label>
									<view class="summary">裱花请货商品汇总</view>
									<view class="examine"><text>点击查看</text><image src="@/images/img2/dianji-jinru.png"></image></view>
								</view>
								<view class="li">
									<text class="zhuangs">裱</text>
									<label><image src="@/images/TL.png" mode="widthFix"></image> 表单</label>
									<view class="summary">裱花请货商品汇总</view>
									<view class="examine"><text>点击查看</text><image src="@/images/img2/dianji-jinru.png"></image></view>
								</view>
								<view class="li">
									<text class="zhuangs">裱</text>
									<label><image src="@/images/TL.png" mode="widthFix"></image> 表单</label>
									<view class="summary">裱花请货商品汇总</view>
									<view class="examine"><text>点击查看</text><image src="@/images/img2/dianji-jinru.png"></image></view>
								</view>
								<view class="li">
									<text class="zhuangs">裱</text>
									<label><image src="@/images/TL.png" mode="widthFix"></image> 表单</label>
									<view class="summary">裱花请货商品汇总</view>
									<view class="examine"><text>点击查看</text><image src="@/images/img2/dianji-jinru.png"></image></view>
								</view>								
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue'
	import query from '@/pages/Home/query.vue'
	
		export default {
			components: {
				query,
				Head
			},
			
			data() {
				return {
		
				}
			},
			onLoad() {
	
			},
			methods: {
			
			}	
		}
	
</script>

<style>
</style>