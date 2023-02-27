<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<view class="leftcx navmall">
			<view class="logo">
				<image src="@/images/img2/kgeeeee.png" mode="widthFix"></image>				
			</view>
			<text class="biaoti">门店查询</text>
			<view class="menu">
				<view class="glcx">
					<view>
						<image class="wx" src="@/images/img2/xiaoshou.png" mode="widthFix"></image>
						<image class="xz" src="@/images/img2/xiaoshoucx-cu.png" mode="widthFix"></image>
						销售报表
					</view>
				</view>
				<view class="glcx curr">
					<view>
						<image class="wx" src="/images/img2/danjucx.png" mode="widthFix"></image>
						<image class="xz" src="@/images/img2/danjucx-cu.png" mode="widthFix"></image>
						单据查询
					</view>
				</view>
				<view class="glcx">
					<view>
						<image class="wx" src="@/images/img2/zhifu.png" mode="widthFix"></image>
						<image class="xz" src="@/images/img2/zhifucx-cu.png" mode="widthFix"></image>
						支付查询
					</view>
				</view>
			</view>
			<view class="tuichu">
				<image class="mendian" src="@/images/img2/dianmian.png"></image>
				<button><image src="@/images/img2/tuitui.png"></image>退出</button>
			</view>
		</view>
		<view class="right" style="position: relative;">
			<!-- :custom="mainSale.ComponentsManage.DKF" :_showSale="mainSale.currentOperation.ynCancel"
					:_ynDKF="mainSale.currentOperation.DKF" :type="mainSale.current_type.clickType" -->
			<Head></Head>
			<view class="listof" style="position: absolute;z-index: 0;">
				<view class="prolist">
					<view class="hh" style="padding-right:3.7%;">
						<view class="hotcakes">
							<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 功能中心
							<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
						</view>
						<!-- <view class="classifys">
							<text v-for="(xplitem, xplindex) in mainSale.selectFlagList"
								:class="mainSale.selectPlid==xplitem.plid?'curr':''"
								@click="mainSale.selectPlidChenged"
								:data-plid="xplitem.plid">{{xplitem.plname}}</text>
							<label>
								<image src="../../images/jt-zhangkai.png" mode="widthFix"></image>
							</label>
						</view> -->
					</view>
					<view class="commodity">
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
								<view class="examine"><text>点击查看</text><image src="@/images/TL.png"></image></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
</script>

<style>
</style>