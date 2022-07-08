<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/style/basis.css);
	@import url(@/style/index.css);
</style>

<template>
	<view class="content">
		<view class="navmall">
			<view class="logo">
				<image src="../../images/kengee-logo.png" mode="widthFix"></image>
			</view>
			<view class="menu">
				<view class="curr">
					<image class="xz" src="../../images/xiaoshou-hui.png" mode="widthFix"></image>
					<image class="wx" src="../../images/xiaoshou.png" mode="widthFix"></image>
					<text>销售</text>
				</view>
				<view>
					<image class="xz" src="../../images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="../../images/yuding-hui.png" mode="widthFix"></image>
					<text>预定</text>
				</view>
				<view>
					<image class="xz" src="../../images/xz-ydtq.png" mode="widthFix"></image>
					<image class="wx" src="../../images/wxz-ydtq.png" mode="widthFix"></image>
					<text>预定提取</text>
				</view>
				<view>
					<image class="xz" src="../../images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="../../images/yuding-hui.png" mode="widthFix"></image>
					<text>外卖单</text>
				</view>
				<view>
					<image class="xz" src="../../images/yuding.png" mode="widthFix"></image>
					<image class="wx" src="../../images/yuding-hui.png" mode="widthFix"></image>
					<text>线上订单</text>
				</view>
				<view>
					<image @click="Moreand()" class="xz" src="../../images/xz-th.png" mode="widthFix"></image>
					<image @click="Moreand()" class="wx" src="../../images/wxz-th.png" mode="widthFix"></image>
					<text @click="Moreand()">退单业务</text>
					<view class="chargeback" v-if="Chargeback">
						<label class="currs">
							<image class="xz" src="../../images/xstd.png" mode="widthFix"></image>
							<image class="wx" src="../../images/xstd-wxz.png" mode="widthFix"></image>
							<text>销售退单</text>
						</label>
						<label>
							<image class="xz" src="../../images/ydqx.png" mode="widthFix"></image>
							<image class="wx" src="../../images/ydqx-wxz.png" mode="widthFix"></image>
							<text>预订取消</text>
						</label>
						<label>
							<image class="xz" src="../../images/sxtd.png" mode="widthFix"></image>
							<image class="wx" src="../../images/sxtd-wxz.png" mode="widthFix"></image>
							<text>赊销退单</text>
						</label>
					</view>
									
				</view>
				<view>
					<image class="xz" src="../../images/xz-xx.png" mode="widthFix"></image>
					<image class="wx" src="../../images/xiaoxi-hui.png" mode="widthFix"></image>
					<text>消息</text>
				</view>
			</view>
			
			<view class="exit">
				<image src="../../images/tuichu.png" mode="widthFix"></image>
				<text>退出</text>
			</view>
		</view>
		<view class="right">
			<view class="nav">
				<view class="getback">
					<!-- <image class="fh" src="../../images/fh.png" mode="widthFix" @click="backPrevPage()"></image> -->
					<view class="message">
						<view class="imgs">
							<image src="../../images/tongzhi.png" mode="widthFix"></image>
						</view>
						<text>门店有一条新的外卖配送单消息来啦...</text>
					</view>
				</view>
				<view class="stores">
					<view class="checkout">
						<label><image src="../../images/dx-mendian.png" mode="widthFix"></image>门店名称</label>
						<label><image src="../../images/dx-kuantai.png" mode="widthFix"></image>款台号：3</label>
					</view>
					<view class="account">
						<text>员工账号</text>
						<view>
							<image src="../../images/touxiang.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
			
			<view class="listof">
				<view class="prolist">
					<!-- 大类循环 -->
					<view class="commodity">
						<view class="hh">
							<view class="hotcakes">
								<image src="../../images/dx-tqi.png" mode="widthFix"></image> 本店热销
								<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
							</view>
							<view class="classifys">
								<text class="curr">每日现烤</text><text>土司餐包</text>
								<label><image src="../../images/jt-zhangkai.png" mode="widthFix"></image></label>
							</view>
						</view>
						<!-- 小类循环 -->
						<view class="products">
							<view class="h2">每日现烤 <label></label></view>
							
							<view class="procycle">
								<!-- 产品循环 -->
								<view class="li">
									<view class="h3">
										<image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕
									</view>
									<view class="cods">
										<label><image src="../../images/dx-bm.png" mode="widthFix"></image>12345678</label>
										<label><image src="../../images/dx-dw.png" mode="widthFix"></image>10个装</label>
									</view>
									<view class="price">
										<text>￥12.9</text>
										<view><image src="../../images/dx-gd.png" mode="widthFix"></image></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="operation">
					<view class="sorting">
						<view class="seasonal"><image src="../../images/dx-dwj.png" mode="widthFix"></image></view>
						<view class="a-z" @click="Letters()">A <text>◀</text></view>
						<view class="states" @click="Statements()">
							<text>结算单</text>
							<label>«</label>
						</view>
					</view>
					<view class="toproof"><image src="../../images/dx-qdb.png" mode="widthFix"></image></view>
					<view class="ranks" v-if="Alphabetical">
						<label class="curr"><text>A</text></label>
						<label><text>B</text></label>
						<label><text>C</text></label>
						<label><text>D</text></label>
						<label><text>E</text></label>
						<label><text>F</text></label>
						<label><text>G</text></label>
						<label><text>H</text></label>
						<label><text>J</text></label>
						<label><text>K</text></label>
						<label><text>L</text></label>
						<label><text>M</text></label>
						<label><text>N</text></label>
						<label><text>O</text></label>
						<label><text>P</text></label>
						<label><text>Q</text></label>
						<label><text>R</text></label>
						<label><text>S</text></label>
						<label><text>T</text></label>
						<label><text>U</text></label>
						<label><text>W</text></label>
						<label><text>X</text></label>
						<label><text>Y</text></label>
						<label><text>Z</text></label>
					</view>
				</view>
			</view>
			
		</view>
	
	<!-- 蛋糕属性选择 -->
		<view class="boxs" v-if="attribute">
			<view class="popup">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<button class="close">×</button>
				<view class="commods">
					<view class="h3">
						<image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕
					</view>
					<view class="cods">
						<label><image src="../../images/dx-bm.png" mode="widthFix"></image>12345678</label>
						<label><image src="../../images/dx-dw.png" mode="widthFix"></image>10个装</label>
					</view>
					<view class="price">
						<text class="jiage">￥12.9</text>
						<view><text>–</text><input /><text>+</text></view>
					</view>
					<view class="tochoose">
						<label><text>1</text>-<text>尺寸/6寸</text></label>
						<label><text>￥156</text><button class="del">×</button></label>
					</view>
					<view class="sizes">
						<view class="h4"><text class="sgin">*</text>尺寸</view>
						<view class="sizelist">
							<label>6寸</label><label>8寸</label><label>10寸</label><label>12寸</label>
						</view>						
					</view>
					<view class="confirm">
						<button class="btn">确 认</button>
					</view>
				</view>
			</view>
		</view>
	<!-- 未登录结算单 -->
	 <view class="boxs" v-if="statement">	
	 		<view class="pop-r pop-rs">
	 		<view class="member">
	 			<label><image class="touxiang" src="../../images/touxiang.png"></image><button class="btn">会员登录</button></label>
				<text>清空</text>
			</view>
	 		<view class="h5"><text>账单</text></view>
	 		<view class="goods">
	 			<!-- 商品循环 -->
	 			<view class="prolist">
	 				<view class="h3">
	 					<label><image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕</label>
	 					<text>X2</text>
	 				</view>
	 				<view class="cods">
	 					<view>
	 					<label><image src="../../images/dx-bm.png" mode="widthFix"></image>12345678</label>
	 					<label><image src="../../images/dx-dw.png" mode="widthFix"></image>10个装</label>
	 					</view>
	 					<text>￥56</text>
	 				</view>
	 			</view>
	 			
	 		</view>
	 	
	 		<view class="ul">
	 			<view class="li"><text>总金额</text><text>￥567</text></view>
	 			<view class="li"><text>件数</text><text>7</text></view>
	 			<view class="li"><text>折扣</text><text>-￥5</text></view>
	 			<view class="li"><text>应收金额</text><text>￥560</text></view>
	 		</view>
	 		<view class="h5"><text>赠品</text><text>查看全部 ></text></view>
	 		
	 		<view class="shoppbag">
	 			<view class="hengs">
	 			<view class="baglist curr">
	 				<view class="bag">					
	 					<text class="h8">小号手提袋</text>
	 					<label><text>说明</text>已满80元，可赠4个</label>
	 				</view>
	 				<view class="quantit">
						<text>数量</text>
						<view class="nums">
							<text>-</text>
							<input type="number"/>
							<text>+</text>
						</view>
					</view>
	 			</view>
	 			<view class="baglist">
	 				<view class="bag">					
	 					<text class="h8">小号手提袋</text>
	 					<label><text>说明</text>已满80元，可赠4个</label>
	 				</view>
	 				<view class="quantit">
	 					<text>数量</text>
	 					<view class="nums">
	 						<text>-</text>
	 						<input type="number"/>
	 						<text>+</text>
	 					</view>
	 				</view>
	 			</view>
	 			<view class="baglist">
	 				<view class="bag">					
	 					<text class="h8">小号手提袋</text>
	 					<label><text>说明</text>已满80元，可赠4个</label>
	 				</view>
	 				<view class="quantit">
	 					<text>数量</text>
	 					<view class="nums">
	 						<text>-</text>
	 						<input type="number"/>
	 						<text>+</text>
	 					</view>
	 				</view>
	 			</view>
	 			
				</view>
	 		</view>
	 		
	 		<view class="confirm">
	 			<button class="btn">确 认</button>
	 		</view>
	 		
	 		<view class="states" @click="Statements()">
	 			<text>结算单</text>
	 			<label>»</label>
	 		</view>
	 	
	 	</view>
	 </view>
	<!-- 会员登陆结算 -->
	<view class="boxs" v-if="statements">
			<view class="memberes">
				<view class="meminfo" v-if="Memberinfo">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view class="member">						
						<label><image class="touxiang" src="../../images/touxiang.png"></image>
							<label class="meminfo"><text>会员名称</text><text>13012341234</text></label>
						</label>
						<button>×</button>
					</view>
					<view class="nom">
						<label>
							<text>￥123</text>
							<text>余额</text>
						</label>
						<label>
							<text>6123</text>
							<text>积分</text>
						</label>
						<label>
							<text>23</text>
							<text>优惠券</text>
						</label>
						<label>
							<text>12</text>
							<text>礼品卡</text>
						</label>
					</view>
					<view class="rests">
						<view class="h2">其他</view>
						<view class="restlist">
							<label><text>上次购买时间：</text><text>03-23  19:23:47</text></label>
							<label><text>是否推送活动信息：</text><text>是</text></label>
							<label><text>上次购买金额：</text><text>￥56</text></label>
							<label><text>是否参与上次活动：</text><text>否</text></label>
						</view>
					</view>
					<view class="coulist">
						<view class="h2">优惠券</view>
						<view class="uls">						
							<view class="lis" v-for="(item,index) in coupon_list">
								<view class="voucher">
									<view><text>￥</text>{{item.money}}</view>
									<text>满{{item.limitmoney}}可用</text>
								</view>
								<image class="banyuan" src="../../images/quan-fenge.png" mode="widthFix"></image>
								<view class="coupon-dets">
									<view class="limit">
										<view class="h3" v-for="(item1,index1) in item.limitDesc">
											<text>{{item1}}</text>
										</view>
										<text class="datas">{{item.s_date}} 至 {{item.e_date}}</text>
									</view>
									<view class="directions">
										<image class="bg" src="../../images/quan-bg.png" mode="widthFix"></image>
										<view>使用说明<image src="../../images/xiala.png" mode="widthFix"></image>
										</view>
										<button @click="CouponToUse(item.lqid)">点击使用<image src="../../images/ewm.png"
												mode="widthFix"></image></button>
									</view>
								</view>
							</view>
						</view>
									
					</view>
				</view>
				<view class="meminfo" v-if="Shoppingbags">
					<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
					<view>
						<view class="member">						
							<label class="h9">武汉满20元赠小号手提袋</label>
							<button>×</button>
						</view>
						<view class="shoppbag">					
							<view class="baglist curr">
								<view class="bag">					
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number"/>
										<text>+</text>
									</view>
								</view>
							</view>
							<view class="baglist">
								<view class="bag">					
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number"/>
										<text>+</text>
									</view>
								</view>
							</view>
							<view class="baglist">
								<view class="bag">					
									<text class="h8">小号手提袋</text>
									<label><text>说明</text>已满80元，可赠4个</label>
								</view>
								<view class="quantit">
									<text>数量</text>
									<view class="nums">
										<text>-</text>
										<input type="number"/>
										<text>+</text>
									</view>
								</view>					
							</view>
						</view>
					</view>
				</view>
				
				<view class="pop-r">
				<view class="member">
					<label>
						<image class="touxiang" src="../../images/touxiang.png"></image>
						<button class="btn" @click="Memberlogin()">会员登录</button>
					</label>
					<text>清空</text>
				</view>
				<view class="h5"><text>账单</text></view>
				<view class="goods">
					<!-- 商品循环 -->
					<view class="prolist">
						<view class="h3">
							<label><image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕</label>
							<text>X2</text>
						</view>
						<view class="cods">
							<view>
							<label><image src="../../images/dx-bm.png" mode="widthFix"></image>12345678</label>
							<label><image src="../../images/dx-dw.png" mode="widthFix"></image>10个装</label>
							</view>
							<text>￥56</text>
						</view>
					</view>
					
				</view>
			
				<view class="ul">
					<view class="li"><text>总金额</text><text>￥567</text></view>
					<view class="li"><text>件数</text><text>7</text></view>
					<view class="li"><text>折扣</text><text>-￥5</text></view>
					<view class="li"><text>应收金额</text><text>￥560</text></view>
				</view>
				<view class="h5"><text>赠品</text><text @click="Bagslist()">查看全部 ></text></view>
				
				<view class="shoppbag">
					<view class="hengs">
					<view class="baglist curr">
						<view class="bag">					
							<text class="h8">小号手提袋</text>
							<label><text>说明</text>已满80元，可赠4个</label>
						</view>
						<view class="quantit">
							<text>数量</text>
							<view class="nums">
								<text>-</text>
								<input type="number"/>
								<text>+</text>
							</view>
						</view>
					</view>
					<view class="baglist">
						<view class="bag">					
							<text class="h8">小号手提袋</text>
							<label><text>说明</text>已满80元，可赠4个</label>
						</view>
						<view class="quantit">
							<text>数量</text>
							<view class="nums">
								<text>-</text>
								<input type="number"/>
								<text>+</text>
							</view>
						</view>
					</view>
					<view class="baglist">
						<view class="bag">					
							<text class="h8">小号手提袋</text>
							<label><text>说明</text>已满80元，可赠4个</label>
						</view>
						<view class="quantit">
							<text>数量</text>
							<view class="nums">
								<text>-</text>
								<input type="number"/>
								<text>+</text>
							</view>
						</view>
					</view>
					
					</view>
				</view>
				<view class="confirm">
					<button class="btn">确 认</button>
				</view>
				
				<!-- <view class="states" @click="Statements()">
					<text>结算单</text>
					<label>»</label>
				</view> -->
			
			</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statements:false,
				Alphabetical:false,
				Memberinfo:false,
				Shoppingbags:false,
				Chargeback:false,
				coupon_list: [],
			}
		},
		methods: {
			
			Statements: function(e) {				
					this.statements=!this.statements
				
			},
			Letters: function(e) {
					this.Alphabetical= true
				
			},
			Memberlogin: function(e) {
				this.Memberinfo= true,
				this.Shoppingbags= false				
			},
			Bagslist: function(e) {
				this.Shoppingbags= true,
				this.Memberinfo= false
			},
			Moreand: function(e) {
				this.Chargeback= !this.Chargeback
			},
		}
	}
</script>

<style>
	.right{
		height:100%;
	}
</style>
