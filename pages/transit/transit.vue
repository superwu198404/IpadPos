<template>
	<view class="centre">
		<image class="bg" src="@/images/chushihua.png" mode="widthFix"></image>
		<view class="tranlist">
			<view class="leftlist">
				<view class="logos"><image src="@/images/hello-card.png" mode="widthFix"></image></view>
				<view class="sginout">
					<view><label>签到</label><text>SIGN IN</text></view>
					<view><label>签退</label><text>CHECK OUT</text></view>
				</view>
				<view class="dates">
					<image class="datebg" src="@/images/quan-bg.png" mode="widthFix"></image>
					<view>
						<label><text>星期二</text><text>2021-09-10</text></label>
						<image src="@/images/day-icon.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="rightlist">
				<view class="market">
					<view class="prods">
						<view class="div">
							<image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu2-1.png" mode="heightFix"></image>
						    <image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu1-1.png" mode="heightFix"></image>

						</view>
						<view class="div">
							<image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu2-1.png" mode="heightFix"></image>
						    <image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu1-1.png" mode="heightFix"></image>			
						</view>
						<view class="div">
							<image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu2-1.png" mode="heightFix"></image>
						    <image :style="{'transform':'rotateY('+ angle +'deg)'}" src="@/images/xstu1-1.png" mode="heightFix"></image>			
						</view>
					</view>
					<view class="dates">
						<view>
							<label><text>销售</text><text>SALES</text></label>
							<image src="@/images/jinruxs-jt.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="dates tuichu">
					<view>
						<label><text>退出</text><text>LOG OUT</text></label>
						<image src="@/images/logout.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
				timer: null,
				angle:0
			}
		},
	
		onShow(e) {
		
			this.timer = setInterval(() => {
			   if (this.angle == 0) {
			       this.angle  = 180;
			   }
			   else if (this.angle == 180){
			   	this.angle = 0;
			   }
			}, 6000);
		   
		},
		//uniapp中onHide()能监听到页面离开
		onHide() {//离开页面前清除计时器
		    // console.log('onHide');
		    clearInterval(this.timer);
		    this.timer = null;
		},
		methods: {
		},
	}
</script>

<style>
	page-body, page-refresh,page{
		height: 100%;
	}
	.centre {
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.centre .bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	.tranlist{
		position: relative;
		z-index: 99;
		width:80%;
		height: 86%;
		padding:7% 10%;
		display: flex;
	}
	.leftlist{
		width:42%;
		margin-right: 5%;
	}
	.leftlist .logos{
		width:100%;	
		/* border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0,107,68,0.1); */
	}
	.leftlist .logos image{
		width:100%;
	}
	.leftlist .sginout{
		display: flex;
		margin:8% 0;
	}
	.leftlist .sginout view{
		width:45%;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0,107,68,0.1);
		display: flex;
		flex-direction: column;
		color: #006B44;
		padding:50rpx 0;
	}
	.leftlist .sginout view label{
		font-size: 44rpx;
		font-weight: 700;
		margin-bottom: 20rpx;
	}
	.leftlist .sginout view text,.leftlist .sginout view label{
		display: block;
		padding-left: 20%;
	}
	.leftlist .sginout view:nth-child(1){
		margin-right: 10%;
	}
	.dates{
		width:100%;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0,107,68,0.1);
		position: relative;
		padding:120rpx 0; 
	}
	.dates .datebg{
		position: absolute;
		bottom:0;
		left: 0;
		width: 100%;
	}
	.dates view{
		display: flex;
		justify-content: space-between;
		padding:0 15%;
	}
	.dates view label{
		display: flex;
		flex-direction: column;
		color: #006B44;
		font-size: 44rpx;
		font-weight: 600;
	}
	.dates view label text:nth-child(2){
		font-weight: 400;
		font-size: 34rpx;
		margin-top:20rpx;
	}
	.dates view image{
		width:140rpx;
		height: 140rpx;
	}
	.rightlist{
		width:53%;
	}
	.rightlist .market{
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 10px 20px 99px 1px rgba(0,107,68,0.1);
	}
	.rightlist .market .prods{
		display: flex;
		padding:5% 5% 0;		
	}
	
	.rightlist .market .prods view{
		border-radius: 30rpx;
		height: 540rpx;
		overflow: hidden;
		position: relative;
	}
	.rightlist .market .prods view image{
		width:100%;
		
	}
	.rightlist .market .prods .div:nth-child(1){
		width:23%;
		margin-right: 2%;
	}
	.rightlist .market .prods .div:nth-child(2){
		width:33%;
		margin-right: 2%;
	}
	.rightlist .market .prods .div:nth-child(3){
		width:40%;
	}
	.rightlist .market .prods .div image{
		position: absolute;
		top:0;
	}
	.rightlist .market .prods .div:nth-child(1) image{
		left: 0;
	}
	.rightlist .market .prods .div:nth-child(2) image{
		left:-53%;
	}
	.rightlist .market .prods .div:nth-child(3) image{
		right:0;
	}
	.market .dates{
		padding:80rpx 0;
		box-shadow: none;
	}
	.rightlist .dates view{
		padding:0 6%;
	}
	.rightlist .dates view image{
		width:100rpx;
	}
	.tuichu{
		padding:60rpx 0;
		margin-top:7%;
		box-shadow: 10px 20px 99px 1px rgba(0,107,68,0.1);
	}
	.prods {
	            perspective: 400px;
	        }
	
	.div {
	    width: 100;
	    height: 450px;
	    margin: 0 auto;
	    position: relative;
	}
	.div image{
	    width: 100%;
	    height: 100%;
	    position: absolute;
		top: 0;
	    /* left: 0; */
	    transition: all 1s;
	}
	
	.div image:first-child{
	    z-index: 1;
	            /*不对向屏幕就隐藏*/
	    backface-visibility: hidden;
	}
	
	        /* .div:hover image{
	            transform: rotateY(180deg);
	        } */
		
</style>