<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<query></query>
		<view class="right" style="position: relative;">
			<Head ></Head>
			<view class="prolist">
				<view class="hh" style="padding-right:3.7%;">
					<view class="hotcakes">
						<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 外卖单查询
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
				</view>
				<view class="takelist"> 
				<!-- 查询条件 -->
					<Condits v-if="condits"></Condits>
					
					<view class="form">
						<view class="Putaway">
							<label @click="shouqi" v-if="shouqi"><image src="@/images/img2/zhankaiiii.png" mode="widthFix"></image></label>
							<label @click="zhankai" v-if="sousuo"><image src="@/images/img2/sousuoooo.png" mode="widthFix"></image></label>
						</view>
						<view class="biaoge">
						<table border="0" cellpadding="0" cellspacing="0">
							<thead>
								<tr>
									<th>序号</th>
									<th>销售日期</th>
									<th>品类</th>
									<th>品类名称</th>
									<th>销售数量</th>
									<th>销售额</th>
									<th>退货</th>
									<th>退款</th>
									<th>销量</th>
									<th>总销售额</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>2023-09-09</td>
									<td>101</td>
									<td>品类名称</td>
									<td>19</td>
									<td>￥56</td>
									<td>11</td>
									<td>￥566</td>
									<td>56</td>
									<td>￥5668</td>
								</tr>
								<tr>
									<td>1</td>
									<td>2023-09-09</td>
									<td>101</td>
									<td>品类名称</td>
									<td>19</td>
									<td>￥56</td>
									<td>11</td>
									<td>￥566</td>
									<td>56</td>
									<td>￥5668</td>
								</tr>
							</tbody>
						</table>
						</view>
						<view class="totals">
							<view>
								<!-- <em></em> -->
								<label>退货量：<text>34</text></label>
								<label>退货金额：<text>￥834</text></label>
								<label>总销量：<text>2134</text></label>
								<label>总销售额：<text>￥82134</text></label>
							</view>
							<!-- <button class="btn">确认支付</button> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 子表 -->
		<view class="box" v-if="zibiao">
			<view class="zibiao">
				<view class="h1">外卖单查询<button class="close">×</button></view>
				<view class="form">
					<view class="choice">
						<view class="table">
							<view class="tab curr">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<text>子表一</text>
								</label>
							</view>
							<view class="tab">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<text>子表二</text>
								</label>
							</view>
						</view>
					</view>
					<view class="biaoge">
					<table border="0" cellpadding="0" cellspacing="0">
						<thead>
							<tr>
							<th>序号</th>
							<th>销售日期</th>
							<th>品类</th>
							<th>品类名称</th>
							<th>销售数量</th>
							<th>销售额</th>
							<th>退货</th>
							<th>退款</th>
							<th>销量</th>
							<th>总销售额</th>
						</tr>
						</thead>
						<tbody>
							<tr>
							<td>1</td>
							<td>2023-09-09</td>
							<td>101</td>
							<td>品类名称</td>
							<td>19</td>
							<td>￥56</td>
							<td>11</td>
							<td>￥566</td>
							<td>56</td>
							<td>￥5668</td>
							</tr>
							<tr>
							<td>1</td>
							<td>2023-09-09</td>
							<td>101</td>
							<td>品类名称</td>
							<td>19</td>
							<td>￥56</td>
							<td>11</td>
							<td>￥566</td>
							<td>56</td>
							<td>￥5668</td>
						</tr>
					</tbody>
					</table>
					</view>
				<view class="totals">
					<view>
						<!-- <em></em> -->
						<label>退货量：<text>34</text></label>
						<label>退货金额：<text>￥834</text></label>
						<label>总销量：<text>2134</text></label>
						<label>总销售额：<text>￥82134</text></label>
					</view>
					<!-- <button class="btn">确认支付</button> -->
				</view>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue'
	import query from '@/components/query/query.vue';
	import Condits from '@/components/Condits/Condits.vue'
	
		export default {
			components: {
				query,
				Head,
				Condits
			},
			
			data() {
				return {
					condits:true,
					zibiao:false
				}
			},
			onLoad() {
	
			},
			methods: {				
				shouqi:function(e) {
					this.condits = false;
					this.shouqi=false;
					this.sousuo=true
			    },
				zhankai:function(e) {
					this.condits = true;
					this.shouqi=true;
					this.sousuo=false
				}
			}	
		}
	
</script>

<style>
	.prolist{
		height: 90%;
	}
</style>