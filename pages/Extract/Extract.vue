<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>

<template>
	<!-- <menu_content :index="2"> -->
	<view class="commodity" style="height: 100%;">
		<view class="hh">
			<view class="hotcakes">
				<image src="../../images/ydtq.png" mode="widthFix"></image> {{ view.mode ? '预定提取' : '预定取消'}}
				<view class="classifys">
					<text :class="SelectedClass('全部')" @click="Selected('全部',-1)">全部</text>
					<text :class="SelectedClass('今日')" @click="Selected('今日',0)">今日</text>
					<text :class="SelectedClass('近三天')" @click="Selected('近三天',1)">近三天</text>
					<text :class="SelectedClass('已过期')" @click="Selected('已过期',2)">已过期</text>
				</view>
			</view>
			<view>
				<view class="prints">
					<view class="sousuo">
						<image src="../../images/ydtq-dyj.png" mode="widthFix"></image>打印
					</view>
					<view class="sousuo">
						<image src="../../images/ydtq-dyj.png" mode="widthFix"></image>蛋糕标签打印
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
							<view class="confs"><button class="btn btn-qx" @click="ClearSearch()">清空</button><button
									class="btn" @click="GetList()">查询</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<NoData v-if="extracts.length==0"></NoData>
		<!-- 小类循环 -->
		<view class="products" v-else>
			<view class="procycle">
				<!-- 产品循环 -->
				<view v-for="(item,index) in extracts" class="li">
					<view class="title-box">
						<view class="price">{{ item.BILL || '-' }}</view>
						<view :class="'state ' + Type(item.THTYPE)">{{ TypeText(item.THTYPE) }}</view>
						<view class="price">{{ item.THDATE || '-' }}</view>
					</view>
					<view class="cods">
						<view>客户名称:{{ item.CUSTMNAME || '-' }}</view>
						<view>定金:{{ item.DNET.toString() || '-' }}</view>
						<view>手机号:{{ item.CUSTMPHONE || '-' }}</view>
						<view style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							备注:{{ item.CUSTMCOMM || '-' }}</view>
					</view>
					<view class="handles"><text>配送地址:{{ item.CUSTMADDRESS || ' -' }}</text>
						<button @click="EditOrder(item)" class="btn">编辑</button>
						<button @click="ExtractOrder(item)" class="btn">{{ view.mode ? '预定提取' : '预定取消'}} </button>
					</view>
				</view>
			</view>
		</view>
		<!-- <component :is="'ReserveDrawer'" :show="view.Details" :order="extract_order" @Close="CloseDrawer">
		</component> -->
	</view>
	<!-- </menu_content> -->
</template>

<script>
	import util from '@/utils/util.js';
	import Reserve from '@/pages/Extract/Reserve/Reserve.vue'
	import ReserveDrawer from '@/pages/Extract/Reserve/Reserve.vue'
	import _extract from '@/api/business/extract.js'
	import {
		ErrorData
	} from '@/bll/Common/bll.js'
	import {
		LocalDataQuery,
		ServiceDataQuery
	} from '@/bll/ExtractBusiness/bll.js'
	import {
		getReserveOrders
	} from '@/api/business/extract.js'
	export default {
		mixins: [global],
		props: {
			mode: Boolean
		},
		components: {
			Reserve
		},
		data() {
			return {
				condition: {
					name: "全部",
					value: -1,
					bill: "",
					phone: "",
					customer: ""
				},
				view: {
					Details: false,
					Criterias: false,
					mode: true
				},
				extract_order: {}, //预定订单的信息
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
			ClearSearch: function() {
				this.condition.bill = "";
				this.condition.phone = "";
			},
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
			EditOrder: function(item) {
				this.view.Details = true;
				this.extract_order = item;
			},
			ExtractOrder: function(item) {
				_extract.getReserveOrdersDetails({ //查到商品信息后传值
					khid: this.KHID,
					bhlb: `(${util.getStorage("POSCS")?.find(i => i.POSCS === 'BHLBBM')?.POSCSNR || "109"})`,
					bill: item.BILL
				}, util.callBind(this, async function(res) {
					if (res.code) {
						if (this.view.mode) { //结算
							item.XSTYPE = '1';
							item.BILL_TYPE = 'Z121';
							this.$to_sale_pages('sale_reserve_extract',{
								sale1: item,
								sale2: JSON.parse(res.data)
							})
						} else { //退款
							let data = await LocalDataQuery(item.BILL);
							if (ErrorData(data)) {
								console.log("[ExtractOrder]本地未查询到数据!");
								data = await ServiceDataQuery(item.BILL); //从服务器查询
							}
							if (ErrorData(data)) {
								console.log("[ExtractOrder]服务端未查询到数据!");
							} else {
								data.sale1[0].XSTYPE = '2'; //由于查询结果默认返回数组，所带索引去取
								data.sale1[0].BILL_TYPE = 'Z171';
								this.$to_sale_pages('sale_reserve_extract',{
									sale1: data.sale1[0],
									sale2: data.sale2,
									sale3: data.sale3
								})
							}
						}
					} else
						util.simpleMsg(res.msg, true, res);
				}))
			},
			ExtractOrder_version2: function(item) {
				_extract.getReserveOrdersDetails({ //查到商品信息后传值
					khid: this.KHID,
					bhlb: `(${util.getStorage("POSCS")?.find(i => i.POSCS === 'BHLBBM')?.POSCSNR || "109"})`,
					bill: item.BILL
				}, util.callBind(this, async function(res) {
					if (res.code) {
						if (this.view.mode) { //结算
							item.XSTYPE = '1';
							item.BILL_TYPE = 'Z121';
							this.$emit("Switch", {
								name: "Main",
								title: "销售",
								params: {
									order: item,
									goods: JSON.parse(res.data),
									open: true
								}
							})
						} else { //退款
							let data = await LocalDataQuery(item.BILL);
							if (ErrorData(data)) {
								console.log("[ExtractOrder]本地未查询到数据!");
								data = await ServiceDataQuery(item.BILL); //从服务器查询
							}
							if (ErrorData(data)) {
								console.log("[ExtractOrder]服务端未查询到数据!");
							} else {
								data.sale1[0].XSTYPE = '2'; //由于查询结果默认返回数组，所带索引去取
								data.sale1[0].BILL_TYPE = 'Z171';
								this.$emit("Switch", {
									name: "Main",
									title: "销售",
									params: {
										order: data.sale1[0],
										goods: data.sale2,
										payments: data.sale3,
										open: true
									},
								})
							}
						}
					} else
						util.simpleMsg(res.msg, true, res);
				}))
			},
			_ExtractOrder: function(item) { //提取商品
				this.view.Details = true;
				this.extract_order = item;
			},
			CloseDrawer: function() {
				this.view.Details = false;
				this.GetList(); //刷新列表
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
					if (data.constructor === Array) {
						this.extracts = (function() {
							let indexs = data.map(item => {
								item.$index = item.SALEDATE ? new Date(item.SALEDATE)
									.getTime() : 0
								return item;
							});
							indexs.sort((a, b) => a - b > 0);
							return indexs;
						})();
					} else
						this.extracts = [];
				}, (err) => {
					util.simpleMsg(err.msg, true, err);
				}))
			}
		},
		mounted() {
			console.log("[Extract-Mounted]触发!");
			this.view.mode = this.mode; //跳转传值
			console.log("[Extract-Mounted]元数据:", this.meta);
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
		/* flex-direction: column;
		align-items: flex-start;
		gap: 18rpx; */
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

	/* .title-box>*:nth-child(1) {
		flex: 0.46 0px;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.title-box>*:nth-child(2) {
		flex: 0.16 0px;
	}

	.title-box>*:nth-child(3) {
		flex: 0.38 0px;
		text-align: right;
	} */

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
