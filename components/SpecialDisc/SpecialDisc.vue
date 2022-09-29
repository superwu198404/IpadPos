<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(../../style/basis.css); */
	@import url(@/static/style/index.css);
</style>
<template>
	<view>
		<!-- 特殊折扣 -->
		<view class="boxs">
			<view class="popup special">
				<image class="tchw" src="../../images/dx-tchw.png" mode="widthFix"></image>
				<view class="commods" style="padding-top:26rpx;">
					<view class="h3">
						特殊折扣选择
					</view>
					<view class="uls">
						<view :class="curZKType!='TP'?'lis curr':'lis'" @click="ChooseZK('BZ')">
							<view class="h8">
								<view>标准折扣<em></em></view>
								<!-- <label>总折扣额:￥{{totalDisc}}<text></text></label> -->
								<span>已选</span>
							</view>
							<view class="discount">
								<view class="zhekou">
									<label
										v-for="(item,index) in ZKDatas.filter(r=>{return r.ZKTYPE=='ZD02'})">· {{item.ZKNAME}}，满<span>{{item.MZNET}}</span>打<span>{{(item.ZKQTY_JS*10).toFixed(1)}}折；</span>
									</label>
								</view>
								<!-- ，折扣额<text>￥{{item.ZKNET}};</text> -->
								<view @click.stop="Def">
									<label>
										<checkbox-group @change="ChooseLS">
											<checkbox :checked="curZKType=='LS'"></checkbox>临时折扣
										</checkbox-group>
									</label>
									<view class="zhekou" style="margin-top:0;border:none;">
									<label v-for="(item,index) in ZKDatas.filter(r=>{return r.ZKTYPE=='ZD03'})">
										<text>{{item.ZKNAME}}，满¥{{item.MZNET}}即打{{(item.ZKQTY_JS*10).toFixed(1)}}折；</text>
										<!-- ，折扣额<text>￥{{item.ZKNET}};</text> -->
									</label>
									</view>
								</view>
							</view>
						</view>
						<view :class="curZKType=='TP'?'lis curr':'lis'" v-if="DKFZKDatas.length>0"
							@click="ChooseZK('TP')">
							<view class="h8">
								<view>特批折扣<em></em></view>
								<!-- <label>总折扣额:￥{{totalDiscDKF}}<text></text></label> -->
								<span>已选</span>
							</view>
							<view class="discount">
								<view class="zhekou">
									<label
										v-for="(item,index) in DKFZKDatas">· {{item.ZKNAME}}，打{{(item.ZKQTY_JS*10).toFixed(1)}}折；</label>
									<!-- ，折扣额<text>￥{{item.ZKNET}};</text> -->
								</view>
							</view>
						</view>

					</view>
				</view>
				<view class="confirm">
					<button class="btn btn-qx" @click="CloseZK()">清除折扣</button><button class="btn"
						@click="ConfirmZK()">确 认</button>
				</view>
			</view>
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

	var that;
	export default {
		name: "SpecialDisc",
		props: {
			dkhid: String,
			product: Array,
			zkdatas: Object
		},
		data() {
			return {
				curZKType: "BZ", //BZ lS TP
				DQID: util.getStorage("store").DQID,
				DKFID: util.getStorage("store").DKFID,
				JGID: util.getStorage("store").JGID,
				ZKDatas: [],
				DKFZKDatas: [],
				curZK: {},
				totalDisc: 0,
				totalDiscDKF: 0,
				Product: [],
				Product1: [{
						SPJGZ: "01",
						NET: 2000,
						SPID: "123456"
					},
					{
						SPJGZ: "01",
						NET: 1250,
						SPID: "123457"
					},
					{
						SPJGZ: "02",
						NET: 5000,
						SPID: "12345678"
					}, {
						SPJGZ: "03",
						NET: 3000,
						SPID: "123456789"
					}
				],
				ProductOld: [],
				YN_LSZK: false
			};
		},
		created: function() {
			that = this;
			console.log("传入的折扣数据：", that.zkdatas);
			that.ZKDatas = that.zkdatas.ZKDatas;
			that.DKFZKDatas = that.zkdatas.DKFZKDatas;
			// that.GetZKDatas();
			// if (that.dkhid && that.dkhid != '80000000') {
			// 	// that.dkhid = '0020004289';
			// 	if (that.dkhid) {
			// 		that.DKFID = that.dkhid;
			// 		that.GetZKDatas('TP');
			// 	}
			// }
			// console.log("传入的商品数据：", that.product);
			// that.Product = that.product;
			// that.ProductOld = that.Product;
		},
		methods: {
			Def: function() {
				console.log("冒泡事件：", that.curZKType);
				if (that.curZKType == 'LS') {
					that.curZKType = "LS";
				}
			},
			ChooseZK: function(e) {
				console.log("测试：", that.curZKType);
				that.curZKType = e;
			},
			Cancel: function() {
				// uni.$emit('close-tszk', that.ProductOld);
				uni.$emit('close-tszk', that.curZKType);
			},
			//确认折扣
			ConfirmZK: function() {
				// that.CalProduct();
				// that.Product
				// uni.$emit('close-tszk', that.Product);
				console.log("选择的折扣类型：", that.curZKType);
				uni.$emit('close-tszk', that.curZKType);
			},
			ChooseLS: e => {
				if (e.detail.value.length > 0) { //勾选了临时
					// that.YN_LSZK = true;
					that.curZKType = "LS";
					// that.CalDisc("", 1);
				} else {
					// that.YN_LSZK = false;
					that.curZKType = "BZ";
					// that.CalDisc();
				}

				console.log("折扣类型切换：", that.curZKType);
			},

			//计算商品信息折扣信息
			CalProduct: function() {
				let curData = [];
				if (that.curZKType == 'TP') {
					curData = that.DKFZKDatas;
				} else {
					if (that.YN_LSZK) {
						curData = that.ZKDatas;
					} else {
						curData = that.ZKDatas.filter(r => {
							return r.ZKTYPE == 'ZD02'
						})
					}
				}
				that.Product.forEach(r => {
					let discArr = [],
						discObj = {},
						DiscNet = 0;
					let arr = curData.filter(r1 => {
						return r1.ZKSTR == r.SPJGZ
					})
					// arr.forEach(r2 => {
					// discObj = {
					// 	ZKTYPT: r2.ZKTYPE || "TP",
					// 	ZKNET: (r.NET * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(2)
					// };
					// discArr.push(discObj);
					// })
					// r.ZKDATA = discArr;
					arr.forEach(r2 => {
						if (r2.ZKTYPE == 'ZD02') { //标准折扣
							r.BZDISC = (r.NET * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(2)
						} else if (r2.ZKTYPE == 'ZD03') { //临时折扣
							r.LSDISC = (r.NET * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(2)
						} else { //特批折扣
							r.TPDISC = (r.NET * (1 - parseFloat(r2.ZKQTY_JS))).toFixed(2)
						}
					})
				});
				console.log("最终的商品数据：", that.Product);
			},
			//计算总的折扣额
			CalDisc: function(t, e) {
				let disc = 0,
					disc1 = 0;
				if (t == "TP") {
					that.DKFZKDatas.forEach(r => {
						disc1 += parseFloat(r.ZKNET);
					})
					that.totalDiscDKF = disc1;
				} else {
					if (e) { //包含临时折扣
						that.ZKDatas.forEach(r => {
							disc += parseFloat(r.ZKNET);
						})
					} else { //只计算标准折扣
						let arr = that.ZKDatas.filter(rr => {
							return rr.ZKTYPE == 'ZD02'
						})
						console.log("筛选数据：", arr);
						arr.forEach(r => {
							disc += parseFloat(r.ZKNET);
						})
					}
					that.totalDisc = disc;
				}
				console.log("总折扣额：", that.totalDisc);
			},
			CloseZK: function() {
				// uni.$emit('close-tszk', that.ProductOld);
				uni.$emit('close-tszk', "NO");
			},
			//数据筛选
			SortData: (type, data, pro) => {
				console.log("筛选传入的参数：", data);
				console.log("筛选传入的参数1：", pro);

				let zkData = [];
				if (pro.length > 0 && data.length > 0) {
					let arr = []; //商品价格组集合
					let spArr = [];
					pro.forEach(r => {
						if (arr.indexOf(r.SPJGZ) < 0) {
							arr.push(r.SPJGZ);
							let arr1 = pro.filter(r1 => {
								return r1.SPJGZ == r.SPJGZ;
							})
							let Net = 0;
							arr1.forEach(r2 => {
								Net += r2.NET;
							})
							spArr.push({
								SPJGZ: r.SPJGZ,
								NET: Net
							})
						}
					})
					//spArr=[{SPJGZ:"01",NET:2250}]
					console.log("分组统计后的商品信息：", spArr);
					spArr.forEach(r3 => {
						if (type == "TP") {
							let arr4 = data.filter(r4 => {
								return r4.ZKSTR == r3.SPJGZ;
							});
							if (arr4.length > 0) {
								arr4[0].ZKNET = ((1 - parseFloat(arr4[0].ZKQTY_JS)) * parseFloat(r3
										.NET))
									.toFixed(2);
								zkData.push(arr4[0]);
							}
						} else {
							let arr2 = data.filter(r4 => {
								return (r4.ZKSTR == r3.SPJGZ && r4.MZNET < r3.NET && r4
									.ZKTYPE == 'ZD02');
							});
							let arr3 = data.filter(r4 => {
								return (r4.ZKSTR == r3.SPJGZ && r4.MZNET < r3.NET && r4
									.ZKTYPE == 'ZD03');
							});
							// let sortArr = arr2.sort((a, b) => {
							// 	return b - a
							// });
							if (arr2.length > 0) {
								arr2[0].ZKNET = ((1 - parseFloat(arr2[0].ZKQTY_JS)) * parseFloat(r3
									.NET)).toFixed(
									2);
								zkData.push(arr2[0]);
							}
							if (arr3.length > 0) {
								arr3[0].ZKNET = ((1 - parseFloat(arr3[0].ZKQTY_JS)) * parseFloat(r3
									.NET)).toFixed(
									2);
								zkData.push(arr3[0]);
							}
						}
						console.log("当前商品价格组匹配到的折扣数据：", zkData);
					})
				}
				console.log("筛选后的折扣数据：", zkData);
				if (zkData.length == 0) {
					util.simpleMsg("暂未有效折扣", true);
				}
				return zkData;
			},
			//获取并展示门店促销活动
			GetZKDatas: function(type) {
				let data = {
					zktype: type,
					dqid: that.DQID,
					spjgz: "",
					dkhid: that.DKFID, //测试使用 "0020004824"
					jgid: that.JGID
				};
				_main.GetZKDatas(data, res => {
					console.log("折扣数据获取结果：", res);
					if (res.code) {
						if (type == 'TP') {
							let arr = JSON.parse(res.data);
							// that.DKFZKDatas = arr;
							let arr1 = arr.map(r => {
								return {
									ZKSTR: r.KONDM,
									ZKQTY_JS: r.BFB,
									ZKNAME: r.SPJGZ
								}
							})
							that.DKFZKDatas = that.SortData(type, arr1, that.Product);
							that.CalDisc(type);
						} else {
							let arr = res.msg;
							that.ZKDatas = that.SortData(type, arr, that.Product);
							that.CalDisc();
						}
					} else {
						if (type == 'TP') {
							that.DKFZKDatas = [];
						} else {
							that.ZKDatas = [];
						}
						util.simpleMsg("暂无数据", true);
					}
					console.log("页面折扣数据：", that.ZKDatas);
					console.log("页面折扣数据1：", that.DKFZKDatas);
				})
			},
		}
	}
</script>

<style>
	.special{
		position: relative;
		padding-bottom: 160rpx;
	}
	.special .confirm{
		position: absolute;
		left: 0;
		bottom:0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		width:100%;
	}
	.special .confirm .btn {
		width: 30%;
		margin: 0 2%;
	}

	.commods .uls .lis.curr {
		background: #fff;
	}
</style>
