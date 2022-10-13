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
						<view class="price" style="font-weight: 400;font-size:24rpx;">{{ item.THDATE || '-' }}</view>
					</view>
					<view class="cods">
						<view>客户名称:{{ item.CUSTMNAME || '-' }}</view>
						<view>定金:{{ item.DNET.toString() || '-' }}</view>
						<view>手机号:{{ item.CUSTMPHONE || '-' }}</view>
						<view style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							备注:{{ item.CUSTMCOMM || '-' }}</view>
					</view>
					<view class="handles"><text>配送地址:{{ item.CUSTMADDRESS || ' -' }}</text>
						<button @click="EditOrder(item)" class="btn btn-hk">编辑</button>
						<button @click="ExtractOrder(item)" class="btn"
							:disabled="view.loading === item.BILL">{{ view.mode ? '提取' : '取消'}} </button>
					</view>
				</view>
			</view>
		</view>
		<ReserveDrawer v-if="view.Details" :order="extract_order" @Close="CloseDrawer"></ReserveDrawer>
	</view>
	<!-- </menu_content> -->
</template>

<script>
	import util from '@/utils/util.js';
	import ReserveDrawer from '@/pages/Extract/Reserve/ReserveDrawer.vue'
	import common from '@/api/common.js'
	import {
		RequestSend
	} from '@/api/business/da.js'
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
			ReserveDrawer
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
					mode: true,
					loading: ''
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
				console.log("[EditOrder]订单编辑:", item);
				RequestSend(`SELECT BILL_STATUS FROM YWBHQH WHERE bill='${item.BILL}'`, util.callBind(this, function(res) {
					console.log("[EditOrder]裱花审核状态查询...",res);
					if (res.code) {
						let data = JSON.parse(res.data);
						if(data.length === 0 || !data?.first().BILL_STATUS || data?.first().BILL_STATUS != 1){
							this.extract_order = item;
							this.view.Details = true;
						}
						else
							util.simpleMsg("此预定单对应的裱花请货单已经审核，不能再进行修改!", 'none')
					}
					else{
						util.simpleMsg("裱花查询失败!", true)
					}
				}))
				
			},
			ExtractOrder: function(item) {
				let callback = util.callBind(this, function(sale1, sale2, sale3) {
					// IF 条件含义:
					//    ①如果当前模式为提取(mode === true)且获取的 sale3 信息为空(sale3_res)，
					//    ②且整单金额(ZNET)不等于 0，
					//    ③且定金(DNET)不为 0，
					//    则提示信息异常(其中②、③含义：这部分意思是要支付的完整金额不是 0 元，且预先付过定金，那么查不到sale3就是异常情况了)
					console.log("[ExtractOrder]销售信息:", {
						sale1,
						sale2,
						sale3
					});
					if (sale3.length === 0 && !this.view.mode && Number(sale1.ZNET) !== 0 && Number(sale1
							.DNET) !== 0) {
						console.log("[ExtractOrder]sale3信息异常...")
						util.simpleMsg("未查到交易记录[SALE3]!");
					} else {
						console.log("[ExtractOrder]预定信息:", {
							sale1,
							sale2,
							sale3
						});
						this.view.loading = sale1.BILL;
						RequestSend(`select YD_STATUS from ydsale001 where bill='${sale1.BILL}'`, util
							.callBind(this, function(res) {
								this.view.loading = "";
								if (res.code) {
									let data = JSON.parse(res.data)?.first();
									if (data && data.YD_STATUS === '1') {
										this.$to_sale_pages(this.view.mode ? 'sale_reserve_extract' :
											'sale_reserve_cancel', {
												sale1,
												sale2: (function() {
													sale2?.forEach(i => i.STR1 = i.SNAME);
													console.log(
														"[ExtractOrder]预定 sale2 处理:",
														sale2);
													return sale2;
												})(),
												sale3
											});
									} else
										util.simpleMsg("单据状态已变更，请刷新后重试!", true)
								} else
									util.simpleMsg("状态查询失败!", true)
							}));

					}
				})
				_extract.getReserveOrderInfos({ //查到商品信息后传值
					khid: item.KHID,
					posid: item.POSID,
					bill: item.BILL,
					saledate: item.SALEDATE,
					cancel: !this.mode //true 为提取，false 为取消
				}, util.callBind(this, function(res) {
					if (res.code) {
						let sales = JSON.parse(res.data),
							sale2 = sales.sale2,
							sale3 = sales.sale3 || [];
						if (!sale3 || !sale3.length)
							sale3 = common.QueryBatch([{
								name: "sale3",
								sql: `select * from sale003 where bill='${item.BILL}'`
							}]).then((sale3_res) => {
								console.log("[ExtractOrder]sale3查询调用完毕:", sale3_res);
								callback(item, sale2, sale3_res?.sale3);
							}).catch((err) => {
								console.warn("[ExtractOrder]获取到本地sale3数据异常:", err);
								callback(item, sale2, []);
							})
						else {
							callback(item, sale2, sale3);
						}
					} else
						util.simpleMsg(res.msg, true, res);
				}))
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
