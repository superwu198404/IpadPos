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
					<view class="condits">
						<view class="h1">查询条件</view>
						<!-- 双日期选择 -->
						<view class="srq">
							<label>
								<text>下单开始日期：</text>
								<picker mode="date" fields="day" @change="ExtractDateChange">
									<view>{{ ExtractDate }} <image src="@/images/img2/jiant-lvvvvv.png"></image></view>
								</picker>
							</label>
							<label>
								<text>下单结束日期：</text>
								<picker mode="date" fields="time" @change="ExtractDateChange">
									<view>{{ ExtractTime }} <image src="@/images/img2/jiant-lvvvvv.png"></image></view>
								</picker>
							</label>
						</view>
						<view class="srq">
							<label>
								<text>销售开始日期：</text>
								<picker mode="date" fields="day" @change="ExtractDateChange">
									<view>{{ ExtractDate }} <image src="@/images/img2/jiant-lvvvvv.png"></image></view>
								</picker>
							</label>
							<label>
								<text>销售结束日期：</text>
								<picker mode="date" fields="time" @change="ExtractDateChange">
									<view>{{ ExtractTime }} <image src="@/images/img2/jiant-lvvvvv.png"></image></view>
								</picker>
							</label>
						</view>
						<!-- 数量少的单选 -->
						<view class="channel">
							<text class="tjmc">销售渠道：</text>
							<view class="chanxz">
								<label class="curr">门店销售 <em>✓</em></label>
								<label>外卖销售 <em>✓</em></label>
								<label>大宗销售 <em>✓</em></label>
							</view>
						</view>
						<!-- 输入框 -->
						<view class="pulldown">
							<text class="tjmc">单号：</text>
							<label><input placeholder="请输入单号"></input><button>×</button></label>
						</view>
						<!-- 下拉框 -->
						<view class="pulldown">
							<text class="tjmc">门店：</text>
							<label><input placeholder="请选择门店"></input><button>∨</button></label>
						</view>
						
						<view class="confirm">
							<button class="btn btn-qx">重置</button>
							<button class="btn">确定</button>
						</view>
					</view>
					<view class="form">
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
								<em></em>
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
						<em></em>
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
			ExtractDateChange: function(date) {
				this.details.info.THDATE = date.detail.value + " " + this.ExtractTime;
			},
			}	
		}
	
</script>

<style>
	.prolist{
		height: 90%;
	}
</style>