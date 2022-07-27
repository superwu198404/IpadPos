<style>
	.content {
		border: 1px solid red;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.content>* {
		width: 100%;
	}

	.top {
		border: 1px solid blue;
		display: flex;
		justify-content: space-between;
	}

	.hotcakes uni-image {
		width: 20px;
	}

	.hotcakes {
		font-size: 16px;
		font-weight: 700;
		display: flex;
		align-items: center;
		padding: 12px 0 12px 2%;
	}

	.hotcakes uni-view {
		font-size: 14px;
		color: #006B44;
		font-weight: 400;
		margin-left: 20px;
	}

	.hotcakes uni-view uni-text {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 15px;
		border: 0.5px solid #006B44;
		margin-right: 10px;
	}
	.search-bar{
		display: flex;
		align-items: center;
		padding-right: 10px;
	}
	.bottom {
		border: 1px solid green;
		flex: 1 0px;
		display: flex;
		gap: 10px;
		padding: 0px 10px 10px 10px;
		box-sizing: border-box;
	}
	
	.bottom > * {
		height: 100%;
		border-radius: 5px;
		flex: 1;
		padding: 5px;
		box-sizing: border-box;
	}
	
	.item {
		
	}
</style>
<template>
	<view class="content">
		<view class="top">
			<view class="hotcakes">
				<image src="@/images/ydtq.png" mode="widthFix"></image> 赊销结算
				<view>类型：<text>立即送</text><text>在线订单</text></view>
			</view>
			<view class="search-bar">
				<text style="color: #006B44;">大客户编号:</text>
				<picker mode="selector" :range="big_clients" range-key="NAME"
					style="height: calc(100% - 20px);width: 200px;border:1px solid #b2d2c6;border-radius: 5px;" @change="SelectedClient">
					<view style="text-overflow: ellipsis;overflow: hidden;width: 100%;height: 100%;white-space: nowrap;align-items: center;">{{ big_client_info.NAME }}</view>
				</picker>
			</view>
		</view>
		<view class="bottom">
			<view class="settlement">
				<view class="item">
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	import {
		getBigClients,
		getBigClientSettlement
	} from '@/api/business/bigclient.js';

	export default {
		name: "CreditSettlement",
		data() {
			return {
				search: {
					client_no: "0020000955" //大客户编号
				},
				big_clients: [], //大客户列表
				big_client_info: {},
				big_client_settlement: []
			}
		},
		methods: {
			GetBigClients: function() {
				getBigClients({
					gsid: this.GSID,
					client_type: '1',
					khid: "",
					storeid: this.KHID
				}, util.callBind(this, function(res) {
					util.simpleMsg("大客户查询成功!");
					this.big_clients = JSON.parse(res.data);
					console.log("大客户：", res)
				}), (err) => {
					util.simpleMsg("大客户查询失败!", true, err);
				})
			},
			GetBigClientSettlement: function() {
				getBigClientSettlement({
					dkhid: this.big_client_info.DKHID,
					khid: this.KHID
				}, util.callBind(this, function(res) {
					util.simpleMsg("大客户单据查询成功!");
					this.big_client_settlement = JSON.parse(res.data);
					console.log("大客户单据：", res)
				}), (err) => {
					util.simpleMsg("大客户单据查询失败!", true, err);
				})
			},
			SelectedClient: function(val) {
				this.big_client_info = this.big_clients[val.detail.value];
				this.GetBigClientSettlement();
			}
		},
		mounted() {
			this.GetBigClients();
		}
	}
</script>

<style>
</style>
