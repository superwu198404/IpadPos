<template>
	<view class="boxs" v-if="statements">
		<view class="memberes">
			<!-- v-if="Memberinfo" -->
			<view class="meminfo">
				<view class="member">
					<label>填写预定信息</label>
					<button>×</button>
				</view>
				<view class="middle">
					<view class="restlist">
						<label><text>收货人：</text><input type="text" /></label>
						<label><text>联系电话：</text><input type="text" /></label>
						<label><text>提货时间：</text><input type="text" /></label>
						<label><text>提货门店：</text><input type="text" /></label>
						<label><text>定金：</text><input type="text" /></label>
						<label><text>配送方式：</text><input type="text" /></label>
						<label><text>备注：</text><textarea></textarea></label>
					</view>
					<view class='rests' v-if="Newaddr" style="margin-bottom: 0; padding-bottom: 0;">
						<view class="h6"><text>新增地址</text></view>
						<view class="restlist">
							<label><text>收货人：</text><input type="text" /></label>
							<label><text>联系电话：</text><input type="text" /></label>
							<label class="long"><text>收货地址：</text><input type="text" /></label>
							<view class="note">
								<label><text>备注：</text><textarea></textarea></label>
								<view class="caozuo"><button class="btn-xg"> 修改</button><button
										class="btn-sc">删除</button></view>
							</view>
						</view>
	
					</view>
					<view class='rests'>
						<view class="h6"><text>地址</text> <button @click="Newlys()">+ 新增地址</button></view>
						<view class="location">
							<view class="site">
								<view class="sitelist">
									<radio></radio>
									<view>
										<text>张三，13876545678</text>
										<label>武汉市江汉区后襄河北路海马中心写字楼1号楼25楼2510</label>
									</view>
								</view>
								<view class="caozuo"><button class="btn-xg"> 修改</button><button
										class="btn-sc">删除</button></view>
							</view>
						</view>
						<view class="more">显示全部地址<image src="../../images/zhankaiqb-dt.png"></image>
						</view>
					</view>
	
					<view class="atlas">
						<div class="map"></div>
					</view>
				</view>
				<view class="operat">
					<button class="btn btn-qx">取 消</button>
					<button class="btn">确 定</button>
				</view>
			</view>
	
			<view class="pop-r">
				<view class="member">
					<label>
						<image class="touxiang" src="../../images/touxiang.png"></image>
						<label class="meminfo"><text>会员名称</text><text>13012341234</text></label>
					</label>
					<text>清空</text>
				</view>
				<view class="h5"><text>单号：K200QTD00542205171540340</text></view>
				<view class="goods">
					<!-- 商品循环 -->
					<view class="prolist">
						<view class="h3">
							<label>
								<image src="../../images/dx-mrxk.png" mode="widthFix"></image> 芝士绵绵绿豆糕
							</label>
							<text>X2</text>
						</view>
						<view class="cods">
							<view>
								<label>
									<image src="../../images/dx-bm.png" mode="widthFix"></image>12345678
								</label>
								<label>
									<image src="../../images/dx-dw.png" mode="widthFix"></image>10个装
								</label>
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
	
				<view class="confirm">
					<button class="btn btn-qx">返 回</button>
					<button class="btn">确 认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"Reserve",
		props:{
			show:Boolean
		},
		data(){
			return {
				Newaddr:false,
				Statements:this.show
			}
		},
		methods:{
			Newlys: function(e) {
				this.Newaddr = true
			},
		},
		mounted() {
			
		}
	}
</script>

<style>
</style>
