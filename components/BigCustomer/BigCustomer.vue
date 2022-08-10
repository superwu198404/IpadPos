<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
		<view class="customer">
			<view class="h3">选择大客户 <button @click="Close()" class="guan">×</button></view>
			<view class="search">
				<!-- <label>
					<checkbox></checkbox>是否赊销
				</label> -->
				<label><text>客户名称:</text><input v-model="search.client_name" type="text" /></label>
				<label><text>客户编码:</text><input v-model="search.client_no" type="text" /></label>
				<button class="btn" @click="GetBigClients()">搜索</button>
			</view>
			<view class="credit">
				<radio-group @change="SelectedBigCustomer" style="width: 100%; display: flex;">
					<view class="li" v-for="(i,index) in big_customers">
						<label style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
							<radio :value="i.DKHID" :checked="index === current"></radio>{{ i.NAME }}
						</label>
						<text>客户编码：{{ i.DKHID }}</text>
					</view>
				</radio-group>
			</view>
			<button class="btn" @click="Close()">确定</button>
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
				current: -1
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
		width: 80%;
		min-height: 700rpx;
		max-height: 88%;
		border-radius: 20rpx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 0 3%;
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
	}

	.search label {
		display: flex;
		align-items: center;
		width: 30%;
		margin-right: 2%;
	}

	/* .search label:nth-child(1) {
		width: 16%;
	} */

	.search label text {
		display: flex;
		width: 160rpx;
	}

	.search label input {
		border: 1px solid #ddd;
		border-radius: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 70%;
	}

	.search .btn {
		width: 150rpx;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0;
		font-size: 28rpx;
	}

	.credit {
		display: flex;
		flex-wrap: wrap;
		max-height: 920rpx;
		overflow: auto;
	}

	.credit .li {
		width: 28%;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 0px 10rpx 20rpx 1rpx rgba(0, 107, 68, 0.06);
		padding: 1.5% 2% 0.5%;
		margin: 1% 2% 2% 0;
	}

	.credit .li:nth-child(3n) {
		margin-right: 0;
	}

	.credit .li label {
		font-weight: 700;
		font-size: 34rpx;
	}

	.credit .li text {
		margin-left: 58rpx;
		color: #b0b0b0;
		font-size: 24rpx;
		line-height: 60rpx;
	}
</style>
