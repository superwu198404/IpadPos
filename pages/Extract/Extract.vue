<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<view class="commodity"> 
		<view class="hh">
			<view class="hotcakes">
				<image src="../../images/ydtq.png" mode="widthFix"></image> 预定提取
				<view class="classifys">
					<text :class="SelectedClass('今日')" @click="Selected('今日',0)">今日</text>
					<text :class="SelectedClass('待提货')" @click="Selected('待提货',1)">待提货</text>
					<text :class="SelectedClass('已过期')" @click="Selected('已过期',-1)">已过期</text>
				</view>
			</view>
			<view>
				<view class="prints">
					<view class="sousuo">
						<image src="../../images/ydtq-dyj.png" mode="widthFix"></image>打印
					</view>
					<view class="sousuo">
						<label @click="Search()">
							<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
						</label>
						<view class="criterias" v-if="view.Criterias">
							<view class="critlist"><text>订单号：</text><input type="text" v-model="condition.bill" />
							</view>
							<view class="critlist"><text>手机号：</text><input type="text" v-model="condition.phone" />
							</view>
							<view class="critlist"><text>收货人：</text><input type="text" v-model="condition.customer" />
							</view>
							<view class="confs"><button class="btn btn-qx">清空</button><button class="btn"
									@click="GetList()">查询</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 小类循环 -->
		<view class="products">
			<view class="procycle">
				<!-- 产品循环 -->
				<view v-for="item in extracts" class="li">
					<view class="title-box">
						<view class="title-left">
							<text class="price">{{ item.CUSTMNAME || '-' }}·{{ item.CUSTMPHONE || '-' }}</text>
							<text :class="'state ' + Type(item.THTYPE)">{{ TypeText(item.THTYPE) }}</text>
						</view>
						<view style="display: inline-block;">
							<text class="price">{{ item.THDATE || '-' }}</text>
						</view>
					</view>
					<view class="cods">
						<view>编号:{{ item.BMID || '-' }}</view>
						<view>备注:{{ item.CUSTMCOMM || '-' }}</view>
					</view>
					<view class="handles"><text>配送地址:{{ item.CUSTMADDRESS || ' -' }}</text><button @click="view.Details = true" class="btn">预定提取</button></view>
				</view>
			</view>
		</view>
		<component :is="'Reserve'" v-if="view.Details"></component>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	import Reserve from '@/pages/Extract/Reserve/Reserve.vue'
	import {
		getReserveOrders
	} from '@/api/business/reserve.js'
	export default {
		mixins: [global],
		components:{
			Reserve
		},
		data() {
			return {
				condition: {
					name: "今日",
					value: 0,
					bill: "",
					phone: "",
					customer: ""
				},
				view: {
					Details: false,
					Criterias: false
				},
				extracts: []
			}
		},
		computed: {
			SelectedClass: function() {
				return function(type) {
					return this.condition.name === type ? 'curr' : '';
				}
			},
			Type: function() {
				return function(type) {
					if (type)
						switch (type[0]) {
							case '0':
								return 'youself';
							case '1':
								return 'home';
							case '2':
								return 'delivery';
							default:
								return '';
						}
					else
						return ''
				}
			},
			TypeText: function() {
				return function(type) {
					return type?.slice(2) || "-"
				}
			}
		},
		methods: {
			Selected: function(type, value) {
				this.condition.name = type;
				this.condition.value = value;
				this.GetList(); //刷新列表
			},
			Statements: function(e) {
				this.view.Details = !this.view.Details;

			},
			Search: function(e) {
				this.view.Criterias = !this.view.Criterias
			},
			GetList: function() {
				getReserveOrders({
					khid: this.KHID,
					type: this.condition.value, //-1 已过期，0 今日，1 待提货
					bill: this.condition.bill,
					phone: this.condition.phone,
					customer: this.condition.customer
				}, util.callBind(this, function(res) {
					let data = JSON.parse(res.data);
					if (data.constructor === Array)
						this.extracts = data;
					else
						this.extracts = [];
				}, (err) => {

				}))
			}
		},
		mounted() {
			this.GetList();
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
	}

	.title-left {
		display: flex;
		gap: 3px;
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
		background-color: royalblue;
	}

	.cods {
		flex-direction: column;
		align-items: flex-start;
		gap: 18rpx;
		margin: unset !important;
		padding: 18rpx 0px;
	}

	.products .procycle .li {
		width: calc(50% - 20px) !important;
		box-sizing: border-box;
		margin: unset;
		height: 160px;
		align-items: center;
		padding: 1.5%;
	}

	.products .procycle::after {
		content: "";
		flex: 0.95;
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
		justify-content: center;
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
</style>
