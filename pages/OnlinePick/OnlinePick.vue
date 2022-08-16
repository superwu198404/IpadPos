<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<!-- <menu_content :index="5" :_index="5"></menu_content> -->
	<view>
		<view class="commodity" style="height: 100%;">
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
			<!-- 小类循环 -->
			<view class="products">
				<view class="procycle">
					<!-- 产品循环 -->
					<view class="li" v-if="view.Order">
						<view class="title-box">
							<view class="price">{{ main.otoCode || '-' }}</view>
							<view class="price">{{ extracts.SALEDATE || '-' }}</view>
						</view>
						<view class="cods">
							<view>定金:{{ extracts.DNET || '-' }}</view>
							<view>折扣金额:{{ main.discount || '-' }}</view>
						</view>
						<button @click="OpenReserve" class="btn">提取</button>
					</view>
				</view>
			</view>
		</view>
		<component v-if="view.Details" :details="details" is="Extract" @Close="CloseReserve" @Reset="Reset"></component>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	import {
		global
	} from '@/models/PaymentAll/models.js';
	import {
		getReserveOnlineOrders
	} from '@/api/business/onlineorders.js'
	import Extract from '@/pages/OnlinePick/Extract/Extract.vue'
	export default {
		name: "OnlinePick",
		components: {
			Extract
		},
		data() {
			return {
				condition: "今日",
				form: {
					search: {
						code: "",
						bill: "" //LH2022080
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
				getReserveOnlineOrders({
					bill: this.form.search.bill,
					code: this.form.search.code,
					khid: this.KHID,
					isBill: this.form.search.code ? false : true
				}, util.callBind(this, function(res) {
					let data = JSON.parse(res.data);
					console.log("查询 线上取货 结果：", data);
					this.extracts = data.details;
					this.main = data.result;
					this.details = {
						extracts: this.extracts,
						main: this.main,
						code: this.form.code
					};
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
				this.view.Details = true;
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
	.picker,
	.input {
		border: 1px solid #70c477;
		height: 25px;
		display: inline-block;
		border-radius: 5px;
		padding: 2px 3px;
	}

	.price {
		margin: 0px;
	}
</style>
