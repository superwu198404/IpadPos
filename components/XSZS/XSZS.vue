<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>
<template>
	<!-- 辅助促销数据 -->
	<view class="meminfo" style="padding-top: 30px;">
		<view class="meminfo">
			<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
			<view>
				<view class="member">
					<label class="h9">选择赠品</label>
					<button @click="Close(false,'Cancel')">×</button>
				</view>
				<view class="shoppbag">
					<view class="baglist curr" v-for="(item,index) in XSZSDatas">
						<view class="bag">
							<text class="h8">{{item.SNAME}}</text>
							<label><text>说明</text>最多可选{{item.ZQTY}}{{item.UNIT}}</label>
						</view>
						<view class="quantit">
							<text>数量</text>
							<view class="nums">
								<text @click="Calculate(item,'-')">-</text>
								<!-- <input type="number" v-model="item.BQTY" @blur="Calculate(item,'*',$event)" /> -->
								<input disabled="true" v-model="item.BQTY" />
								<text @click="Calculate(item,'+')">+</text>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="confirm">
						<button class="btn" @click="Confirm()">确 认</button>
						<button class="btn btn-xk" @click="Close(false,'Skip')">跳 过</button>
					</view> -->
			</view>
		</view>
		<view class="affirm">
			<button class="btn btn-hk" @click="Close(false,'Cancel')">取消</button>
			<button class="btn" @click="Confirm()">确定</button>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _login from '@/api/business/login.js';
	import _main from '@/api/business/main.js';
	import _take from '@/api/business/takeaway.js';

	var that;
	export default {
		name: "XSZS",
		props: {
			_sale2: Array
		},
		data() {
			return {
				XSZSDatas: [],
				XSZSDatasOld: [],
				store: {},
				BILL: ""
			}
		},
		created: async function() {
			that = this;
			console.log("传入的_sale2：", that._sale2);
			var store = util.getStorage("store");
			console.log("store：", store);
			that.store = store;
			if (that._sale2 && that._sale2.length > 0) {
				that.BILL = that._sale2[0].BILL;
				let plids = that._sale2.map(r => r.PLID);
				let spids = that._sale2.map(r => r.SPID);
				that.XSZSDatas = await _take.GetZSData(store.DQID, store.KHZID, store.KHID, store.SYBID, plids.join(
					"','"), spids.join("','"));

				console.log("XSZSDatas:", that.XSZSDatas);
				if (that.XSZSDatas.length == 0) //没数据时候直接关掉
					that.Close(false, "No Data");
			}
			that.XSZSDatasOld = ""; // JSON.parse(JSON.stringify(that._XSZSDatas.oval));

		},
		methods: {
			Calculate1: function(item, type) {
				if (type > 0 && item.ZQTY && item.BQTY >= item.ZQTY) {
					util.simpleMsg("已达到该赠品上限：" + item.ZQTY, "none");
					return;
				}
				item.BQTY = Number(item.BQTY) + type;
				if (item.BQTY < 0) {
					item.BQTY = 0;
				}
				// that.CalXSZS(); //实时计算促销结果

				console.log("赠品数量变化", item);
			}, //数量计算
			Calculate: function(e, t, event) {
				// console.log("计算事件:", e + t);
				if (t == '+') {
					if (e.BQTY == e.ZQTY) {
						e.BQTY = e.ZQTY;
						util.simpleMsg("不能再多了", true);
					} else {
						e.BQTY += 1;
					}
				} else if (t == '-') {
					if (e.BQTY <= 0) {
						e.BQTY = 0;
						util.simpleMsg("不能再少了", true);
					} else {
						e.BQTY -= 1;
					}
				} else if (t == '*') {
					let num = event.detail.value;
					num = parseFloat(num);
					console.log("输入得值:", num);
					if (num > e.ZQTY || num <= 0) {
						num = 0;
						util.simpleMsg("数量输入有误", true);
					}
					e.BQTY = num;
				}
				that.XSZSDatas.forEach((item, index, arr) => {
					// console.log("商品信息：", item.SPID + "/" + e.SPID);
					if (item.SPID == e.SPID) {
						item.BQTY = e.BQTY;
					}
				});

				// that.$set(that.WMDDATA[index], "BQTY", e.BQTY); // 实例方法$set
				that.$forceUpdate(); //刷新input的值 狗bug
				console.log("新数量:", that.XSZSDatas);
			},
			//计算促销的应付金额和折扣额
			CalXSZS: function() {
				let Arr = [];
				that.XSZSDatas.forEach(r => {
					let arr = r.Details.filter(r1 => {
						return r1.BQTY > 0;
					})
					Arr = Arr.concat(arr);
				})
				if (Arr.length > 0) {
					Arr = Arr.sort((a, b) => {
						return b.PRICE - a.PRICE
					});
					that.XSZSRes = _main.CalXSZS(Arr, that._sale);
				} else {
					that.XSZSRes = {
						msg: "已添加0个特殊商品预计额外支付：0元",
						data: [],
						count: 0,
						payAmount: 0
					};
				}
				console.log("售价排序后的促销商品：", that.XSZSRes);
			},
			//关闭销售赠品
			Close: function(code, msg) {
				console.log("取消销售赠品");
				uni.$emit("close-XSZS", {
					code,
					msg
				}); //返回一个空对象
			},
			//确认赠品
			Confirm: function() {
				console.log("确认销售赠品");
				let arr = that.XSZSDatas.filter((item) => {
					return item.BQTY > 0
				});
				let bill = "XSLY" + that.BILL;
				if (!arr || arr.length == 0) {
					util.simpleMsg("无可用数据", true);
					return;
				}
				let obj = {
					khid: that.store.KHID,
					posid: that.store.POSID,
					gsid: that.store.GSID,
					czyid: that.store.RYID,
					czyname: that.BILL,//that.store.RYNAME,//仟吉要求记录销售单号
					storeKhzid: that.store.KHZID,
					storeDqid: that.store.DQID,
					datas: arr,
					bill: bill,
					ywtype: common.ywTypeEnum.XSZS
				};
				_take.ConfirmLY(obj, bill, common.ywTypeEnum.QTLY, res => {
					console.log("赠品生成领用操作结果：", res);
					util.simpleMsg("赠品单据生成成功！", false);
					that.Close(true, "Success");
				});
			}
		}
	}
</script>

<style>
	.meminfo {
		position: fixed;
		right: 0;
		width: 61%;
		z-index: 9889;
		height: 96%;
	}

	.fuzhu {
		height: 84%;
		overflow: auto;
	}

	.meminfo .close {
		position: absolute;
		top: 2%;
		right: 1%;
	}

	.member {
		padding: 1% 4%;
	}

	.affirm {
		width: 94%;
		padding: 2% 3%;
		margin: 0 auto;
		display: flex;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 9999;
		background-color: #fff;
	}

	.affirm button {
		width: 46%;
		margin: 0 2%;
	}

	.tishi {
		font-size: 26rpx;
		font-weight: 700;
		color: #FE694B;
		padding: 0 4%;
	}

	.bag .h8 {
		width: 100%;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}

	.bag .h8 text:nth-child(1) {
		font-weight: 700;
		max-width: 70%;
		overflow: auto;
	}

	.bag .h8 text {
		font-weight: 400;
	}
</style>