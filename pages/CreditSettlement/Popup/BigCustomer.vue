<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
		<view class="customer">
			<view class="h3">选择大客户 <button @click="Close()" class="guan">×</button></view>
			<view class="search">
				<label>
					是否赊销：
					<view class="classifys"><text class="curr">是</text><text>否</text></view>
				</label>
				<view class="client">
				<label><image src="../../images/dakehu.png" mode="widthFix"></image><input v-model="search.client_name" type="text" placeholder="大客户名称" /></label>
				<label><image src="../../images/dakhu-mc.png" mode="widthFix"></image><input v-model="search.client_no" type="text" placeholder="大客户编码" /></label>
				</view>
				<button class="btn" @click="GetBigClients()">搜索</button>
			</view>
			<view class="credit">
				<!-- <radio-group @change="SelectedBigCustomer" style="width: 100%; display: flex;"> -->
					<view class="li" :class="curIndex === index? 'curr':' '" v-for="(i,index) in big_customers">
						<em></em>
						<image src="../../images/dakehu-xz.png" mode="widthFix"></image>
						<view class="encods">
						<label style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
							<!-- <radio :value="i.DKHID" :checked="index === current"></radio> -->
							{{ i.NAME }}
						</label>
						<text>客户编码：{{ i.DKHID }}</text>
						</view>
					</view>
				
				<!-- </radio-group> -->
			</view>
			<button class="btn btn-qr" @click="Close()">确定</button>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	import {
		getBigClients
	} from '@/api/business/bigclient.js';
	export default {
		name: "BigCustomer",
		data() {
			return {
				search: {
					client_no: "", //大客户编号 0020000955
					client_name: ""
				},
				big_customers: [],
				big_client_info: {},
				current: -1,
				curIndex: 0,
			}
		},
		computed: {
			Checked: function() {
				return function(id) {
					return this.big_client_info.DKHID === id;
				}
			}
		},
		methods: {
			Close: function() {
				this.$emit('ClosePopup', this.big_client_info);
			},
			GetBigClients: function() {
				getBigClients({
					gsid: this.GSID,
					client_type: '1',
					khid: this.search.client_no,
					name: this.search.client_name,
					storeid: this.KHID
				}, util.callBind(this, function(res) {
					this.big_customers = JSON.parse(res.data);
					console.log("查询出的大客户信息：", res);
					//需要注释 不然默认第一个大客户
					//this.big_client_info = this.big_customers[0];
					// util.simpleMsg("大客户查询成功!", false, this.big_customers);
				}), (err) => {
					util.simpleMsg("大客户查询失败!", true, err);
					this.big_customers = [];
				})
			},
			SelectedBigCustomer: function(evt) {
				for (let i = 0; i < this.big_customers.length; i++) {
					if (this.big_customers[i].DKHID === evt.detail.value) {
						this.current = i;
						this.big_client_info = this.big_customers[i];
						break;
					}
				}
			}
		},
		mounted() {
			this.GetBigClients();
		}
	}
</script>

<style>
	.customer {
		background-color: #fff;
		width: 75%;
		min-height: 700rpx;
		max-height: 88%;
		border-radius: 20rpx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 0 3% 140rpx;
	}

	.customer .h3 {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 34rpx;
		border-bottom: 1px dashed #eee;
	}

	.customer .h3 .guan {
		float: right;
		background: none;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
	}

	.customer .credit radio-input {
		width: 34rpx;
		height: 34rpx;
		padding: 1% 0;
	}

	.search {
		display: flex;
		padding: 1% 0;
		justify-content: space-between;
	}
	.search .client{
		background-color: #F2F6F6;
		width: 85%;
		display: flex;
		border:1rpx solid #98C3B3;
		border-radius: 6rpx 0 0 6rpx;
	}
	.search label {
		display: flex;
		align-items: center;
		width: 48%;
		margin-right: 2%;
	}
	.search .client label text {
		display: flex;
		width: 160rpx;
	}
	.search .client label image{
		width:40rpx;
		height: 40rpx;
		margin: 0 6rpx;
	}
	.search .client label:nth-child(1) input{
		border-radius: 1rpx solid #98C3B3;
	}
	/* .search label text {
		display: flex;
		width: 160rpx;
	} */

	.search label input {
		border: none;
		border-radius: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 88%;
	}

	.search .btn {
		width: 180rpx;
		height: 62rpx;
		line-height: 62rpx;
		padding: 0;
		font-size: 28rpx;
		background: #006B44;
		border-radius: 0 6rpx 6rpx 0;
	}

	.credit {
		display: flex;
		flex-wrap: wrap;
		max-height: 920rpx;
		overflow: auto;
		/* min-height: 500rpx; */
	}

	.credit .li {
		width: 44%;
		display: flex;
		background-color: #fff;
		border-radius: 10rpx;
		/* box-shadow: 0px 10rpx 20rpx 1rpx rgba(0, 107, 68, 0.06); */
		padding: 1.5% 2% 1%;
		margin: 1% 2% 2% 0;
		border:1rpx solid #ddd;
		position: relative;
	}
	.credit .li em{
		position: absolute;
		top:10%;
		right:0;
		width:4rpx;
		height: 40rpx;
		background-color: #9bdda1;
	}
	.credit .li:nth-child(2n){
		margin-right: 0;
	}
	.credit .li.curr{
		box-shadow: 0px 15px 20px 1px rgba(197,231,200,0.3000);
		border-radius: 8rpx;
		border: 2rpx solid #9bdda1;
	}
	.encods{
		display: flex;
		flex-direction: column;
		width:85%;
	}
	.credit .li image{
		width:100rpx;
		height:100rpx;
		margin-right: 2%;
	}
	.credit .li label {
		font-weight: 700;
		font-size: 34rpx;
	}

	.credit .li text {
		color: #b0b0b0;
		font-size: 24rpx;
		line-height: 60rpx;
	}
	.classifys{
		display: flex;
		align-items: center;
		background-color: #E0EAE9;
		color: #006B44;
		font-weight: 400;
		border-radius: 40rpx;
		font-size: 14px;
		padding: 1px;
		border: 1px solid #006B44;
	}
	.classifys text.curr{
	    background-color: #006B44;
	    color: #fff;
		
	}
	
	.customer .btn-qr{
		width:50%;
		margin:0 auto;
		position: absolute;
		bottom:30rpx;
		left: 50%;
		transform: translateX(-50%);		
	}
</style>
