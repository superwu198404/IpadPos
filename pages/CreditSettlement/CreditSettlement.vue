<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/extract.css);
</style>
<template>
	<view class="content">
		<view class="right">
			<view class="listof">
				<view class="bkjb">
					<view class="neik">
					<view class="prolist">
					<view class="commodity">
						<view class="hh">
							<view class="hotcakes">
								<image src="../../images/tuidan.png" mode="widthFix"></image> 结算业务
							</view>
							<view>
								<view class="prints">
									<view class="sousuo">
										<label @click="Settlement">
											<image src="@/images/settlement.png" mode="widthFix"></image>结算
											<!-- <image src="@/images/sousuo.png" mode="widthFix"></image>结算 -->
										</label>
									</view>
								</view>
							</view>
						</view>
						<view class="h2" style="display: flex;align-items: center;">赊销结算
							<view @click="SelectAll" :class="this.big_client_settlement.length ? 'select-all-orders' : 'select-all-orders select-all-disabled'">
								{{ (this.big_client_settlement.length === this.select_orders.length && this.big_client_settlement.length != 0) ? '取消全选' : '全选'}}
							</view>
						</view>
						<NoData v-if="big_client_settlement.length==0"></NoData>
						<!-- 小类循环 -->
						<view class="products" v-else>
							<view class="procycle">
								<!-- 订单循环 -->
								<view v-for="(item,index) in big_client_settlement" :class="Selected(item) + ' li'"
									@click="SelectOrder(item)">
									<view class="h3">
										<text>单号：{{item.BILL}}</text>
										<text class="price">￥{{item.TNET}}</text>
									</view>
									<view class="cods">
										<label>下单时间：{{item.SALEDATE}}</label>
										<label>客户编码：{{item.DKFID}}</label>
										<label>客户名称：{{item.DKFNAME}}</label>
									</view>
									<view class="handles"><text></text>
										<!-- <button class="btn" @click="Settlement(item.BILL)">结算</button> -->
									</view>
								</view>
							</view>
						</view>
					</view>
					</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import sale from '@/utils/sale/saleClass.js';
	import util from '@/utils/util.js';
	import dateformat from '@/utils/dateformat.js';
	import {
		getBigClientSettlement
	} from '@/api/business/bigclient.js';
	import {
		RequestSend
	} from '@/api/business/da.js'

	export default {
		name: "CreditSettlement",
		props: {
			bigCustomerInfo: Object
		},
		data() {
			return {
				big_client_info: {},
				select_orders: [],
				big_client_settlement: [],
				current_settlement: {}
			}
		},
		computed: {
			Selected: function() {
				return function(info) {
					if (this.select_orders.includes(info))
						return 'curr';
					else
						return '';
				}
			}
		},
		methods: {
			SelectOrder: function(info) {
				if (this.select_orders.includes(info)) {
					let index = this.select_orders.indexOf(info);
					if (index != -1) this.select_orders.splice(index, 1);
				} else
					this.select_orders.push(info);
			},
			GetBigClientSettlement: function() {
				getBigClientSettlement({
					dkhid: this.big_client_info.DKHID,
					khid: this.KHID
				}, util.callBind(this, function(res) {
					util.simpleMsg("大客户单据查询成功!");
					this.big_client_settlement = JSON.parse(res.data);
					if (this.big_client_settlement?.length && this.big_client_settlement?.length > 0)
						this.current_settlement = this.big_client_settlement[0];
					console.log("[CreditSettlement]大客户单据：", res)
				}), (err) => {
					util.simpleMsg("大客户单据查询失败!", true, err);
				})
			},
			SelectedClient: function(val) {
				this.big_client_info = this.big_clients[val.detail.value];
				this.GetBigClientSettlement();
			},
			SelectAll: function() {
				if (this.big_client_settlement.length === this.select_orders.length)
					this.select_orders = [];
				else
					this.select_orders = [...this.big_client_settlement];
			},
			Settlement: async function() {
				if (!this.select_orders.length) {
					util.simpleMsg("请选择需要结算的单据后进行结算!");
					return;
				}
				let bills = [],
					main_order = Object.assign({}, this.select_orders[0]),
					update_status_sql = [],
					ywsxjsmx = [];
				main_order.ZNET = 0;
				this.select_orders.forEach(i => {
					bills.push(i.BILL);
					main_order.ZNET += i.ZNET;
					update_status_sql.push(`update sxsale001 set SX_STATUS='2' where bill='${i.BILL}';`);
					let s3 = new sale.ywsxjsmx();
					s3.BILL_SX = i.BILL;
					//(需求)结算明细 YWSXJSMX：选中的 赊销单，DNET=JSNET=赊销单的ZNET ;
					s3.DNET = i.ZNET;
					s3.JSNET = i.ZNET;
					ywsxjsmx.push(s3);
				})
				let ywsxjs = new sale.ywsxjs({
					DKFID: this.big_client_info.DKHID,
					DKFNAME: this.big_client_info.NAME,
					KHID: this.KHID,
					BILL_STATUS: 1,
					TPNET: main_order.ZNET,
					TJSNET: main_order.ZNET,
					ID_RY_LR: this.RYID,
					DATE_LR: dateformat.toDateString(new Date()),
					RYNAME_LR: this.RYNAME,
					DATE_QT: dateformat.toDateString(new Date()),
					POSID: this.POSID,
					DPID: this.DPID
				});
				let condition = bills.join("','");
				console.log("[Settlement]查询总商品信息:", condition);
				RequestSend(
					`select sale2.*,spda.SNAME GOOD_NAME from (select * from syssale002 where bill in('${condition}') and khid='${this.KHID}') sale2 left join spda on sale2.spid=spda.spid`
				).then(util
					.callBind(this, function(res) {
						let data = JSON.parse(res.result.data);
						console.log("[Settlement]商品信息:", data);
						this.$to_sale_pages('sale_credit_settlement', {
							sale1: main_order,
							sale2: data.map(i => {
								i.STR1 = i.GOOD_NAME;
								return i;
							}),
							sale3: [],
							sql: update_status_sql,
							ywsxjs,
							ywsxjsmx,
						})
					}))
			}
		},
		created() {
			uni.$on("close-big-customer",(function(data){
				console.warn("[CreditSettlement-Created]赊销界面:",data);
				if(Object.keys(data).length){
					this.big_client_info = data;
					this.GetBigClientSettlement();
				}
			}).bind(this))
			console.log("[CreditSettlement-Created]大客户信息:", this.bigCustomerInfo);
			console.log("[CreditSettlement-Created]门店信息:", {
				ryid: this.RYID,
				dpid: this.DPID,
				posid: this.POSID,
				ryname: this.RYNAME,
				khid: this.KHID
			});
			this.big_client_info = this.bigCustomerInfo;
			console.log("[CreditSettlement-Created]获取大客户单据信息...");
			this.GetBigClientSettlement();
		}
	}
</script>


<style>
	.right {
		height: 100%;
	}

	.handles button {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
	}

	.price {
		margin-top: 0;
	}

	.h2 {
		padding: 0 3% 1%;
		position: relative;
		line-height: 40rpx;
	}

	.h2 label {
		position: absolute;
		width: 140rpx;
		bottom: 20rpx;
		left: 3%;
		height: 8rpx;
		background: linear-gradient(90deg, #006B44 0%, rgba(0, 107, 68, 0) 100%);
		border-radius: 8rpx;
	}

	.details .goods {
		height: 65%;
	}

	.detinfo {
		height: 85%;
	}

	.products {
		height: 84%;
	}

	.products .details {
		justify-content: start;
	}

	.products .procycle {
		max-height: 100%;
		overflow: auto;
	}

	.products .procycle .li .h3 {
		font-size: 28rpx;
		font-weight: 600;
	}

	.products .h3 text {
		font-weight: 600;
	}

	.select-all-orders {
		display: inline-flex;
		justify-content: center;
		border-radius: 30rpx;
		padding: 0 18rpx;
		height: 48rpx;
		line-height:48rpx;
		background-color: #006B44;
		color: #fff;
		align-items: center;
		margin-left: 10px;
		font-size: 26rpx;
	}
	
	.select-all-disabled{
		background: grey !important;
	}
</style>
