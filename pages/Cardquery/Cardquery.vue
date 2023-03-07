<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<!-- <Pagekq></Pagekq> -->
		<view class="right">
			<!-- 顶部导航栏 :custom.sync="view.big_customer" :_ynDKF='view.enable_customer'>-->
			<Head> </Head>
			<view class="prolist">
				<view class="hh" style="padding-right:3.7%;">
					<view class="hotcakes">
						<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 卡券信息查询
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
				</view>
				<view class="commodity">
					<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
					<view class="number">
						<view class="labnum">
							<text>卡券类型：</text>
							<view class="chanxz">
								<label class="curr">礼品卡 <em>✓</em></label>
								<label>礼品券 <em>✓</em></label>
								<label>可伴卡 <em>✓</em></label>
								<label>品诺券 <em>✓</em></label>
								<label>团体券 <em>✓</em></label>
								<label class="quanbu">全部 <em>✓</em></label>
							</view>
						</view>
						<view class="labnum">
							<text>卡号：</text>
							<view class="chaxun">
							<view class="label">
								<image src="@/images/img2/zhifucx-cu.png" mode="widthFix" @click="ScanCodeHandle('endNum')">
								</image>
								<input type="text" placeholder="请输入查询卡号" v-model="endNum" :focus="curFocus=='beginNum'"
									@confirm="ScanCodeHandle" @focus="curFocus='beginNum'" />
							</view>
							<button class="btn">查询</button>
							</view>
						</view>	
					</view>
					<view class="partics">
						<view class="cardqs">
							<view class="cardlist">
								<view class="ulli">
									<view class="touch-list list-touch">
										<image class="bgs" src="@/images/img2/kaqchaxun .png" mode="widthFix"></image>
										<view class="h6">
											<label><em></em>实体23.9型海藻糖绿豆糕提货券-19</label>											
										</view>
										<view class="denominat">
											<label>￥<text>100</text></label>
										</view>
										<view class="cardinfo">
											<view class="leftinfo">
												<view class="kname">卡类型名称</view>
												<view class="card-num">											
													<label>券号：400000037265246750</label>
													<!-- <view><em>●</em>全场商品代金券</view> -->
												</view>
											</view>
											
										</view>
										<view class="statistic">
											<text>有效期至2023-09-09</text>
											<text>已使用</text>
										</view>
									</view>
									<view class="touch-list list-delete" @click="RemoveSP(item)">
										<image src="@/images/img2/ka-shanchu.png" mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="carddet">
							<view class="totals">
								<view>
									<em></em>
									<label>卡号：<text>{{TotalNum}}</text></label>
								</view>
								<button class="btn btn-qx">已使用</button>
							</view>
							<view class="kainfolist">
								<label>
									<text>是否客情券：</text><text>N</text>
								</label>
								<label>
									<text>是否客诉赠券：</text><text>N</text>
								</label>
								<label>
									<text>申领人：</text><text>1100433</text>
								</label>
								<label>
									<text>售卖门店：</text><text>武汉渠道虚拟卡券线上小程序</text>
								</label>
								<label>
									<text>售出时间：</text><text>2023-02-12 14:23:23</text>
								</label>
								<label>
									<text>使用时间：</text><text>2023-02-12 14:23:23</text>
								</label>
								<label>
									<text>使用门店：</text><text>2武汉领秀城门厅</text>
								</label>
								<label>
									<text>消费金额：</text><text>￥567</text>
								</label>
								<label>
									<text>操作员：</text><text>2023-02-12 14:23:23</text>
								</label>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue';
	import Pagekq from '@/pages/Home/Component/Pagekq.vue'
	
	
	export default {
		name: "Cardquery",
		components: {
			Head,
			Pagekq
		},
		data() {
			return {
			}
		},
		
		methods: {
		}
	}
</script>

<style>
	.commodity .number{
		padding: 0;
		width:100%;
		display: flex;
	}
	.chaxun{
		display: flex;
		align-items: center;
	}
	.commodity .number .labnum{
		margin:2% 0;
		display: flex;
		flex-direction: column;
		height: auto;
		width:46%;
	}
	.commodity .number button{
		width: 25%;
		height: 70rpx;
		line-height: 70rpx;
		margin:2% 0 2% 20rpx;
	}
	.commodity .totals view label{
		font-size: 32rpx;
		font-weight: 700;
		color: #333;
		padding-left: 2%;
		white-space: nowrap;
	}
	.totals view em{
		height: 40rpx;
		margin:0 8rpx 0 30rpx;
	}
	.cardlist{
		box-shadow: 0px 10px 30px 1px rgba(66,177,75,0.16);
		position: relative;
		padding:0;
	}
	
	.cardlist .ulli{
		width:100%;
		margin:0;			
	}
	.cardlist .ulli .h6{
		background: none;
		padding:2% 2% 0;
		height: 120rpx;
		width:70%;
		/* overflow: hidden; */
	}
	.cardlist .ulli .h6 label{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		position: relative;
		font-size: 46rpx;
		color: #006B44;
		height: 120rpx;
		line-height: 60rpx;
	}
	.cardlist .ulli .h6 em{
		display: block;
		width:68rpx;
		height: 6rpx;
		position: absolute;
		bottom:0;
		left:3%;
		z-index: 6;
		border-radius: 6rpx;
		background-color: #006B44;
	}
	.cardlist .touch-list{
		padding:6% 0 0;
	}
	.ulli .card-num{
		border-bottom: none;
	}
	.ulli .card-num view{
		color: #42B14B;
		font-size: 30rpx;
		padding-left: 4%;
		padding-top:14rpx;
	}
	.ulli .card-num label{
		padding:0;
	}
	.cardinfo{
		padding:4% 4% 1%;
	}
	.statistic{
		padding:3% 3%;
		justify-content: space-between;
		color: #fff;
		margin-top:18rpx;
	}
	.statistic text:nth-child(2){
		background-color: #FFE8E4;
		color: #FE694B;
		font-size: 26rpx;
		padding:4rpx 10rpx;
	}
	.chanxz{
		width:85%;
		padding:2% 15% 0 0;
		position: relative;
	}
	.chanxz label{
		width:18%;
		font-size: 26rpx;
		margin:0 1% !important;
	}
	.chanxz .quanbu{
		width:90rpx;
		position: absolute;
		top:19rpx;
		right:3%;
		font-size: 18rpx;
		color: #42B14B;
	}
	.chanxz .quanbu image{
		width:22rpx;
		height: 22rpx;
	}
</style>