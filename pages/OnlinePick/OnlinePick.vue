<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<menu_content :index="5">
		<view class="commodity">
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
							<label @click="Search()">
								<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
							</label>
							<view class="criterias" v-if="view.Criterias">
								<view class="critlist"><text>订单号：</text><input type="text" v-model="form.search.bill" />
								</view>
								<view class="critlist"><text>自提码：</text><input type="text" v-model="form.search.code" />
								</view>
								<view class="confs"><button class="btn btn-qx">清空</button><button class="btn"
										@click="QueryOrder()">查询</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 小类循环 -->
			<view class="products" style="display: flex;flex-direction: column;">
				<view>订单号:{{ main.otoCode }}</view>
				<view>总金额:{{ main.totalAmount }}</view>
				<view>总金额:{{ main.totalAmount }}</view>
				<view>商品信息:
					<view v-for="i in extracts.Products" style="display: flex;gap: 20px;">
						<text>编号:{{ i.NO }}</text>
						<text>商品名称:{{ i.SNAME }}</text>
						<text>数量:{{ i.QTY }}</text>
						<text>销售时间:{{ i.SALEDATE }}</text>
					</view>
				</view>
				<view style="border-radius: 5px;background-color: #70c477;color: white;width: 100px;text-align: center;"
					@click="Reserve()">提取</view>
			</view>
		</view>
	</menu_content>
</template>

<script>
	import util from '@/utils/util.js';
	import {
		global
	} from '@/models/PaymentAll/models.js';
	import {
		getReserveOnlineOrders,
		onlineOrderReserve
	} from '@/api/business/onlineorders.js'
	export default {
		name: "OnlinePick",
		mixins: [global],
		data() {
			return {
				condition: "今日",
				form: {
					search: {
						code: "",
						bill: "LH202208010004"
						// bill: ""
					},
					code: "", //自提码
				},
				view: {
					Details: false,
					Criterias: false,
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
				}
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
				this.view.Criterias = !this.view.Criterias
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
					this.main = data.result[0];
				}), (err) => {
					util.simpleMsg(err.msg, true, err);
				});
			},
			Valid: function() {
				if (this.extracts.THTYPE === '0')
					if (!this.form.search.code) {
						util.simpleMsg("请输入自提码!")
						return false
					}
				return true;
			},
			Reserve: function() {
				if (this.Valid())
					onlineOrderReserve({
						khid: this.KHID,
						bill: this.main.otoCode,
						code: this.form.code,
						isBill: this.extracts.THTYPE !== "0",
						details: this.extracts
					}, util.callBind(this, function(res) {
						console.log("提取成功！", res)
					}), (err) => {
						util.simpleMsg(err.msg, true);
					})
			}
		},
		mounted() {

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
</style>
