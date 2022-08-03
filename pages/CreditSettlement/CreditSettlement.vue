<template>
	<menu_content index="8">
		<view class="page-content">
			<view class="top">
				<view class="hotcakes">
					<image src="@/images/ydtq.png" mode="widthFix"></image> 赊销结算
				</view>
				<view class="search-bar">
					<text style="color: #006B44;">大客户编号:</text>
					<picker mode="selector" :range="big_clients" range-key="NAME"
						style="height: calc(100% - 20px);width: 200px;border:1px solid #b2d2c6;border-radius: 5px;"
						@change="SelectedClient">
						<view
							style="text-overflow: ellipsis;overflow: hidden;width: 100%;height: 100%;white-space: nowrap;align-items: center;">
							{{ big_client_info.NAME }}
						</view>
					</picker>
				</view>
			</view>
			<view class="bottom">
				<view class="settlement">
					<view class="item-box">
						<view :class="'item '+ Selected(i.BILL)" v-for="i in big_client_settlement" @click="ShowDetails(i)">
							<view class="item-title">
								<text>{{ i.BILL }}</text>
								<text>{{ i.SALETIME }}</text>
							</view>
							<view class="item-content">
								<view>编号:{{ i.DKFID }}</view>
								<view>名称:{{ i.DKFNAME }}</view>
								<view>订单号:{{ i.BILL }}</view>
								<view>商品名称:{{ i.SNAME }}</view>
							</view>

						</view>
					</view>
				</view>
				<view class="details" style="padding: 10px;box-sizing: border-box;">
					<view class="row">
						<view class="details-title" style="display: flex;align-items: center;gap: 8px;">
							<view class="cover">
								<image class="touxiang" src="@/images/touxiang.png"></image>
							</view>
							<view>
								<view>{{ current_settlement.DKFNAME || "-" }}</view>
								<view>{{ current_settlement.DKFID || "-"  }}</view>
							</view>
						</view>
					</view>
					<view class="row">
						<text>商品名称:</text>{{ current_settlement.SNAME || "-" }}
					</view>
					<view class="row">
						<text>销售类型:</text>{{ current_settlement.BILL_TYPE || "-" }}
					</view>
					<view class="row">
						<text>店铺编号:</text>{{ current_settlement.DPID || "-" }}
					</view>
					<view class="row">
						<text>销售时间:</text>{{ current_settlement.SALETIME || "-" }}
					</view>
				</view>
			</view>
		</view>
	</menu_content>
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
				big_client_settlement: [],
				current_settlement:{}
			}
		},
	    computed:{
			Selected:function(){
				return function(bill){
					if(this.current_settlement.BILL === bill) 
						return 'selected';
					else 
						return '';
				}
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
					this.big_clients = JSON.parse(res.data);
					this.big_client_info = this.big_clients[0];
					util.simpleMsg("大客户查询成功!", false, this.big_client_info);
					this.GetBigClientSettlement();
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
					if(this.big_client_settlement?.length && this.big_client_settlement?.length > 0)
						this.current_settlement = this.big_client_settlement[0];
					console.log("大客户单据：", res)
				}), (err) => {
					util.simpleMsg("大客户单据查询失败!", true, err);
				})
			},
			SelectedClient: function(val) {
				this.big_client_info = this.big_clients[val.detail.value];
				this.GetBigClientSettlement();
			},
			ShowDetails:function(i){
				this.current_settlement = i;
			}
		},
		mounted() {
			this.GetBigClients();
		}
	}
</script>

<style>
	.page-content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		height: 92%;
	}

	.page-content>* {
		width: 100%;
	}

	.top {
		display: flex;
		justify-content: space-between;
		height: 60px;
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
		margin-right: 10px;
	}

	.search-bar {
		display: flex;
		align-items: center;
		padding-right: 10px;
	}

	.bottom {
		flex: 1 0px;
		display: flex;
		gap: 10px;
		padding: 0px 10px 10px 10px;
		box-sizing: border-box;
		height: calc(100vh - 112px);
	}

	.bottom>* {
		height: 100%;
		border-radius: 5px;
		flex: 1;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
	}

	.settlement {}

	.details {
		background-color: white;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.row text,.row:not(:first-child){
		color: gray;
		margin-right: 6px;
	}

	.item-box {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.item {
		width: 100%;
		display: inline-block;
		height: 20%;
		background-color: white;
		border-radius: 5px;
		padding: 8px;
		display: flex;
		gap: 6px;
		flex-direction: column;
		box-shadow: 0px 0px 0px 1px lightgray inset;
	}
	
	.selected{
		box-shadow: 0px 0px 0px 2px #70c477 inset;
	}
	
	.item-title{
		display: flex;
		justify-content: space-between;
		font-weight: 600;
		font-size: 1em;
	}
	.item-content::before{
		content: "";
		border-top: 1px solid lightgray;
	}
	.item-content{
		color: gray;
		font-size: 0.8em;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	
	.item-content > * {
		
	}
	
	.cover,.cover > image{
		height: 60px;
		width: 60px;
	}
</style>
