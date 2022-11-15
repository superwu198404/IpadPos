<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view  class="content" style="display: block;">
		<view class="head">
			<view class="head-portrait">
				<image src="@/images/touxiang.png" mode="widthFix"></image>
				<view class="member-account">会员账户</view>
			</view>
			<view class="head-exit">
				<view class="exit" @click="Exit">
					<image src="@/images/tuichu.png"></image> 切换
				</view>
			</view>
		</view>
		<view class="body-titles">
			<view style="width: 90%;display: flex; align-items: center;">
				ㄑ
				<view class="hot-sales">
					产品详情
					<label></label>
				</view>
			</view>
		</view>
		<view class="particular">
			<view class="shuffs">
				<view class="banner">
					<swiper autoplay="true" :interval="5000" :duration="500" circular="true" indicator-active-color="#fff"
						easing-function="true" indicator-dots='true' @change="swiperChange">
						<swiper-item v-for="(item, index) in bannerList" :key="index">
							<image :src="item.url"></image>
						</swiper-item>
					</swiper>
				</view>
				<view class="tupian">
					<label><image src="@/images/xstu2-1.png"></image></label>
					<label><image src="@/images/xstu2-1.png"></image></label>
					<label><image src="@/images/xstu2-1.png"></image></label>
					<label><image src="@/images/xstu2-1.png"></image></label>
					<label><image src="@/images/xstu2-1.png"></image></label>
				</view>
			</view>
			<view class="exhibiting">
				<view class="h3"><image src="@/images/dx-mrxk.png" mode="widthFix"> 仟吉加油鸭乳脂奶油网红水果生日蛋糕</view>
				<view class="miaos">加油鸭草莓限定款！芝士慕斯+草莓慕斯，丝绒奶香遇上清甜草莓香，
				棉花糖装饰盖顶趣味多多，萌动可爱甜蜜加倍！！！</view>
				<view class="commods">
				<!-- 价格数量 -->
					<!-- <view class="price">
						<view>
							<text class="jiage">￥{{mainSale.clikSpItem.PRICE}}</text>
							<text v-if="mainSale.clikSpItem.ynAddPro" class="jiage zongjia"
								style="font-size: 28rpx;">+加料总价{{mainSale.clikSpItem.NEWPRICE}}={{mainSale.clikSpItem.PRICE+mainSale.clikSpItem.NEWPRICE}}</text>
						</view>
						<view>
							<button @click="mainSale.chengedQty" data-qty="-1"
								:disabled="mainSale.clikSpItem.ynAddPro">-</button>
							<label>{{mainSale.clikSpItem.ynAddPro?1:mainSale.clikSpItem.inputQty}}</label>
							<button @click="mainSale.chengedQty" data-qty="1"
								:disabled="mainSale.clikSpItem.ynAddPro">+</button>
						</view>
					</view> -->
					<!-- 加入购物车的产品属性 -->
					<!-- <view class="tochoose">
						<view v-for=" (sp, spinx) in mainSale.sale002" v-if="sp.BARCODE == mainSale.clikSpItem.SPID">
							<label class="shux"><text>{{sp.UNIT}}</text>*<text>{{sp.QTY}}</text>
								<text v-for="(sx08, sxindex) in mainSale.sale008"
									v-if="sp.NO==sx08.NO">[{{sx08.ATTNAME}}{{sx08.QTY?("x"+sx08.QTY):""}}]</text>
							</label>
							<label><text>￥{{sp.PRICE}}</text>
								<button :data-spid="sp.SPID" :data-row="spinx"
									@click="mainSale.updateSp(spinx,sp.SPID,0)" class="del">×</button></label>
						</view>
					</view> -->
				
				</view>
				<view class="yxlb">
					 <!-- 以选标签   -->
					<!-- <label v-for="item2 in mainSale.CheckTagList"># {{item2._NAME}}</label> -->
				</view>
				<view class="sizes">
					<view class="chic"><i class="sgin">*</i>尺寸</view>
					<view class="sizelist">
						<!-- 尺寸列表 -->
						<!-- <label v-for=" (specs, specsinx) in mainSale.clikSpItem.specslist"
							:data-dgplid="specs.DGPLID" :data-dgjgz="specs.DGJGZ" :data-specs="specs.SPECS"
							:data-spid="specs.SPID" :class="specs.SPID==mainSale.clikSpItem.selectSPID?'curr':''" 
							@click="mainSale.selectSPID_Chenged">{{specs.SPECS}}</label> -->
					</view>
				</view>
				<view class="join"><button class="btn">加入购物车</button></view>
			</view>
		</view>
		<view class="states" @click="mainSale.ShowStatement">
			<text>结算单</text>
			<label>«</label>
			<view class="statnum">
				<image src="@/images/jsd-dxiao.gif" mode="widthFix"></image>
				<text>{{TotalNum}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
			data() {
				return {
					bannerList: [{
							url: 'http://58.19.103.220:8805/蛋糕/6.jpg',
							color: 'red'
						},
						{
							url: 'https://img-blog.csdnimg.cn/8717f0e8d2b64efebcdc9c506a39bd61.png',
							color: 'green'
						},
						{
							url: 'https://img-blog.csdnimg.cn/ae94ba1d709744e2a6e36eb7d981f0a9.png',
							color: 'blue'
						},
						{
							url: 'https://img-blog.csdnimg.cn/6cc01905e7e942bdadb574af1079ae15.png',
							color: '#F0AD4E'
						}
					],
					backColor: ''
				}
			},
			mounted() {
				this.backColor = this.bannerList[0].color;
			},
			methods: {
				//轮播图切换修改背景色
				swiperChange(e) {
					const index = e.detail.current;
					this.backColor = this.bannerList[index].color;
				},
			}
		}
</script>

<style>
	.hot-sales{
		height:56rpx;
		margin-left: 30rpx;
		display: flex;
		align-items: center;
	}
	.particular{
		display: flex;
		margin-top:40rpx;
		padding:0 2%;
		height: 85%;
		width:94%;
	}
	.particular .shuffs{
		width:55%;
	}
	.shuffs .banner{
		width:100%;
		padding-bottom:100%;
		position: relative;
	}
	.shuffs .banner swiper{
		position: absolute;
		top:0;
		left: 0;
		width:100%;
		height: 100%;
	}
	.tupian{
		display: flex;
		margin-top:4%;
		padding:0 5%;
	}
	.tupian label{
		display: flex;
		width:20%;
		justify-content: center;
		align-items: center;
	}
	.tupian label image{
		width:130rpx;
		height: 130rpx;
	}
	.particular .exhibiting{
		width:44%;
		margin-left: 1%;
		height: 100%;
		position: relative;
	}
	.exhibiting .h3{
		font-weight: 700;
		font-size: 40rpx;
		line-height: 60rpx;
	}
	.exhibiting .h3 image{
		width:40rpx;
		height: 40rpx;
		margin-right: 4rpx;
	}
	.exhibiting .miaos{
		color: #B0B0B0;
		font-size: 26rpx;
		line-height: 40rpx;
		margin-top:30rpx;
	}
	.commods{
		min-height: auto;
		max-height: auto;
	}
	.commods .price{
		margin:8% 0 5%;
	}
	.tochoose view{
		height: 80rpx;
		line-height: 80rpx;
	}
	.yxlb{
		display: flex;
		align-items: center;
		width:100%;
		flex-wrap: wrap;
		margin:3.5% 0 2%;	
	}
	.yxlb label{
		position: relative;
		background-color: #E0EAE9;
		color: #006B44;
		display: flex;
		align-items: center;
		padding:4rpx 18rpx 6rpx 14rpx;
		margin-right: 30rpx;
		border-radius: 40rpx;
		font-size: 26rpx;
		margin-bottom: 20rpx;
	}
	.sizes .chic{
		height: 80rpx;
		line-height: 80rpx;
	}
	.sizes .sizelist label{
		padding:0 1%;
		min-width: 27%;
		font-size: 28rpx;
	}
	.join{
		position: absolute;
		bottom:0;
		left: 0;
		width:100%;
		display: flex;
		justify-content: center;
		padding:20rpx 0;
		background-color: #F5F4F8;
	}
	.states{
		position: fixed;
		bottom:20%;
		right:1%;
		overflow: hidden;
	}
	.statnum{
		margin-top:40rpx;
	}
</style>