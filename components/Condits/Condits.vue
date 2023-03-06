<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>
<template>
	<view class="condits">
		<view class="srqlist">
			<view class="h1">查询条件</view>
		<!-- 双日期选择 -->
			<view class="srq">
				<label>
					<text>下单开始日期：</text>
					<picker mode="date" fields="day" :value="date" :start="startDate" :end="endDate" @change="ExtractDateChange">
						<view>{{ ExtractDate }} <image src="@/images/img2/jiant-lvvvvv.png"></image></view>
					</picker>
				</label>
				<label>
					<text>下单结束日期：</text>
					<picker mode="date" fields="day" @change="ExtractDateChange">
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
		<!-- 数量多时下拉框 -->
			<view class="pulldown">
				<text class="tjmc">门店：</text>
				<label><input placeholder="请选择门店"></input><button>∨</button></label>
			</view>
		</view>
		<view class="confirm">
			<button class="btn btn-qx">重置</button>
			<button class="btn">确定</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		name: "Condits",
		//属性
		props: {
			属性名称: {
				type: String,//属性类型
				value: "值"
			},
		},
		data() {
			return {
				
			}
		},
		//组件生命周期
		computed: {
			
		},
		methods: {
			ExtractDateChange: function(date) {
				this.ExtractDate = date.target.value;
			},
		}
	}
	
</script>


<style>
</style>