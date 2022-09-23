<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<view class="commodity" style="position: relative;">
		<view class="hh">
			<view class="hotcakes">
				<image src="../../images/ydtq.png" mode="widthFix"></image> 线上提取
			</view>
			<view>
				<view class="prints">
					<view class="sousuo">
						<image src="../../images/ydtq-dyj.png" mode="widthFix"></image>打印
					</view>
					<view class="sousuo">
						<label @click="Search">
							<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
						</label>
						<view class="criterias" v-if="view.Criterias">
							<view class="critlist"><text>订单号：</text><input type="text" v-model="form.search.bill" />
							</view>
							<view class="critlist"><text>自提码：</text><input type="text" v-model="form.search.code" />
							</view>
							<view class="confs"><button class="btn btn-qx" @click="ClearSearch()">清空</button><button
									class="btn" @click="QueryOrder()">查询</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<NoData v-if="!view.Order"></NoData>
		<!-- 小类循环 -->
		<view class="products" v-else>
			<view class="procycle">
				<!-- 产品循环 -->
				<view v-for="(item,index) in [extracts]" class="li">
					<view class="title-box">
						<view class="price">{{ item.BILL || '-' }}</view>
						<!-- <view :class="'state ' + Type(item.THTYPE)">{{ TypeText(item.THTYPE) }}</view> -->
						<view class="price" style="width: auto;">{{ item.SALEDATE || '-' }}</view>
					</view>
					<view class="cods">
						<view>客户名称:{{ item.CUSTMNAME || '-' }}</view>
						<view>定金:{{ item.DNET || '-' }}</view>
						<view>手机号:{{ item.CUSTMPHONE || '-' }}</view>
						<view style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							备注:{{ item.CUSTMCOMM || '-' }}</view>
					</view>
					<view class="handles"><text>配送地址:{{ item.CUSTMADDRESS || ' -' }}</text>
						<button class="btn" @click="OpenReserve">提取</button>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>


<script>
	import util from '@/utils/util.js';
	import {
		global
	} from '@/models/PaymentAll/models.js';
	import {
		getReserveOnlineOrders,
		getReserveOnlineRawOrderInfo
	} from '@/api/business/onlineorders.js'
	import Extract from '@/pages/OnlinePick/Extract/Extract.vue'
	export default {
		name: "OnlinePick",
		components: {
			Extract
		},
		computed: {
			ShowInfo: function() {
				return this.$data.extracts === this.extracts;
			}
		},
		data() {
			return {
				condition: "今日",
				form: {
					search: {
						code: "",
						bill: "LH202209220002" //LH2022080
						// bill: ""
					},
					code: "", //自提码
				},
				view: {
					Details: false,
					Order: false,
					Criterias: true,
				},
				extracts: {
					SALEDATE: "",
					POSID: "",
					GSID: "",
					DNET: "",
					KHID: "",
					THTYPE: "",
					Products: []
				},
				main: {
					otoCode: "", //订单号
					orderStatus: "",
					receivable: "",
					totalAmount: "",
					deposit: "",
					postage: "",
					discount: "",
					orderEntries: []
				},
				details: {}
			}
		},
		methods: {
			Selected: function(type) {
				this.condition = type;
			},
			Statements: function(e) {
				this.view.Details = !this.view.Details;
			},
			Search: function(e) {
				this.view.Criterias = !this.view.Criterias;
			},
			QueryOrder: function() {
				console.log("[QueryOrder]查询线上订单...", this.KHID);
				getReserveOnlineOrders({
					bill: this.form.search.bill,
					code: this.form.search.code,
					khid: this.KHID,
					isBill: this.form.search.code ? false : true
				}, util.callBind(this, function(res) {
					let data = JSON.parse(res.data);
					console.log("[QueryOrder]查询 线上取货 结果:", data);
					this.extracts = data.details;
					this.main = data.result;
					this.details = {
						extracts: this.extracts,
						main: this.main,
						code: this.form.code
					};
					this.$forceUpdate();
					this.view.Order = true;
				}), util.callBind(this, (err) => {
					util.simpleMsg(err.msg, true, err);
					this.view.Order = false;
				}));
			},
			Valid: function() {
				if (this.extracts.THTYPE === '0')
					if (!this.form.search.code) {
						util.simpleMsg("请输入自提码!")
						return false
					}
				return true;
			},
			OpenReserve: function() {
				// this.view.Details = true;
				getReserveOnlineRawOrderInfo({
					khid: this.KHID,
					bill: this.extracts.BILL
				}, util.callBind(this, function(data) {
					if (data.code) {
						let sales = JSON.parse(data.data), allow_cancel = false;
						console.log("[OpenReserve]获取到的原单数据:", sales);
						this.extracts.Products.forEach(p => {
							if(!(p.QTY - p.QXQTY > 0)){//如果出现退货商品数量大于商品预定数则不允许提取
								allow_cancel = true;
							}
						})
						if(allow_cancel){
							util.simpleMsg("此单商品已全部取消，无法进行提取!",true)
						}
						else {
							this.$to_sale_pages('sale_online_order_extract', {
								sale1: sales.jk_sys_sale001.first(),
								sale2: (function() {
									sales.jk_sys_sale002?.forEach(i => i.STR1 = i
										.SNAME);
									return sales.jk_sys_sale002;
								})(),
								sale3: sales.jk_sys_sale003,
								reserve_params: {
									khid: this.KHID,
									bill: this.extracts.BILL,
									code: this.form.code,
									isBill: this.extracts.THTYPE !== "0",
									details: this.extracts
								}
							})
						}
					}
				}));
			},
			CloseReserve: function() {
				this.view.Details = false;
			},
			Reset: function(isSuccess) {
				// for(key in this.main){
				// 	this.main[key] = this.main[key].constructor();
				// }
				if (isSuccess) {
					this.main = null;
					this.extracts = null;
					this.view.Order = false;
				}
			}
		},
		mounted() {
			// this.QueryOrder();
		}
	}
</script>
<style>
	.right {
		height: 100%;
	}

	.classifys {
		display: inline-flex !important;
		width: unset;
	}

	.handles uni-button {
		width: auto;
		display: inline-block;
	}

	.handles uni-text {
		color: black;
		flex: 0.94;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.state {
		color: #b0b0b0;
		font-size: 12px;
		display: inline-flex;
		gap: 12rpx;
		align-items: center;
		padding: 0px 10px;
	}

	.state::before {
		content: "";
		display: inline-block;
		width: 20rpx;
		height: 20rpx;
		background-color: #b0b0b0;
		border-radius: 50%;
	}

	.delivery::before {
		background-color: #fdb402;
	}

	.youself::before {
		background-color: #41b44d;
	}

	.home::before {
		background-color: #FF8367;
	}

	.cods {
		margin: unset !important;
		padding: 18rpx 0px;
	}

	.products .procycle .li {
		width: calc(50% - 6px) !important;
		box-sizing: border-box;
		margin: unset;
		height: auto;
		align-items: center;
		padding: 1.5%;
	}

	.prolist .cods uni-view {
		width: 100%;
	}

	.products {
		flex: 1 0px;
		overflow-y: auto;
		padding: 0px 2% 2% 2% !important;
	}

	.procycle {
		gap: 10px;
		width: 100% !important;
		box-sizing: border-box !important;
		display: flex !important;
		flex-direction: row !important;
		height: unset !important;
		overflow-y: auto;
	}

	.commodity {
		display: flex;
		flex-direction: column;
	}

	.price {
		font-size: 16px;
		margin-top: 0px;
	}

	.title-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
	}

	.criterias {
		z-index: 10;
	}

	.handles uni-button {
		width: 6rem;
	}

	.title-box .price {}

	.title-box>.state {
		flex-shrink: 0;
	}

	.title-box>.price:nth-child(1) {
		width: 50% !important;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	.title-box>.price:nth-child(3) {
		justify-content: right;
		flex-shrink: 0;
	}
</style>
