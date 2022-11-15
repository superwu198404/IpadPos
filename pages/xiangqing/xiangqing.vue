<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view>
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
				<
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
			</view>
			<view class="exhibiting">
				<view class="h3"><image src="@/images/dx-mrxk.png" mode="widthFix"> 仟吉加油鸭乳脂奶油网红水果生日蛋糕</view>
				<view class="miaos">加油鸭草莓限定款！芝士慕斯+草莓慕斯，丝绒奶香遇上清甜草莓香，
棉花糖装饰盖顶趣味多多，萌动可爱甜蜜加倍！！！</view>
				<view class="commods">
					<view class="price">
							<view>
								<text class="jiage">￥123</text>
							</view>
							<view>
								<button @click="mainSale.chengedQty" >-</button>
								<label>1</label>
								<button @click="mainSale.chengedQty">+</button>
							</view>
						</view>
						<view class="tochoose">
							<view >
								<label class="shux"><text>1</text>*<text>名称</text>
									<text>嗡嗡嗡分</text>
								</label>
								<label><text>￥123</text>
									<button
										@click="mainSale.updateSp(spinx,sp.SPID,0)" class="del">×</button></label>
							</view>
						</view>
					
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
					</view>
					<view class="tochoose">
						<view v-for=" (sp, spinx) in mainSale.sale002" v-if="sp.BARCODE == mainSale.clikSpItem.SPID">
							<label class="shux"><text>{{sp.UNIT}}</text>*<text>{{sp.QTY}}</text>
								<text v-for="(sx08, sxindex) in mainSale.sale008"
									v-if="sp.NO==sx08.NO">[{{sx08.ATTNAME}}{{sx08.QTY?("x"+sx08.QTY):""}}]</text>
							</label>
							<label><text>￥{{sp.PRICE}}</text>
								<button :data-spid="sp.SPID" :data-row="spinx"
									@click="mainSale.updateSp(spinx,sp.SPID,0)" class="del">×</button></label>
						</view>
					</view>
				 -->
				</view>
				<view class="yxlb">
					 <!-- v-for="item2 in mainSale.CheckTagList"    {{item2._NAME}}-->
					<label># 生日精选</label>
				</view>
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
		margin-left: 50rpx;
	}
	.particular{
		display: flex;
		margin-top:40rpx;
		padding:0 2%;
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
	.particular .exhibiting{
		width:44%;
		margin-left: 1%;
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
		width:80%;
		margin-top:4%;	
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
	}
</style>