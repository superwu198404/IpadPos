<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/takeout.css);
</style>
<template>
	<!-- 激活失败 -->
	<view class="commodity">
		<view class="hh">
			<view class="hotcakes">失败列表</view>
		</view>
		<view class="products">
			<view class="procycle" v-if="source.sales_union.length">
				<!-- 外卖单循环 -->
				<view :class="source.select_order_info == sales ? 'li curr' : 'li'" class="li" v-for="(sales,index) in source.sales_union" @click="source.select_order_info = sales">
					<view class="h3">
						<view class="platform">
							<label class="state jiedan"><em class="gang"></em>销售日期：{{ to_date(sales.sale001.SALEDATE) }}</label>
						</view>
					</view>
					<view class="cods">
						<label>单号：{{ sales.sale001.BILL }} <text>￥{{ sales.sale001.TNET }}</text></label>
						<label><text>收银员：{{ sales.sale001.RYID }}</text><text>折扣价：￥{{ sales.sale001.ZNET }}</text></label>

					</view>
					<view class="address">
						销售时间：{{ to_time(sales.sale001.SALETIME) }}
					</view>
				</view>
			</view>
			<view class="details" v-if="source.sales_union.length">
				<view class="detinfo">
					<view class="member">
						<label>
							单据明细
						</label>
					</view>
					<view class="goods">
						<view class="prolist" v-for="(sale6,index) in current_order_coupons.sale006">
							<view class="h3">
								<label>
									<text>{{ index + 1 }}</text>
									券激活
								</label>
								<view class="shuls"><text>数量：{{ sale6.QTY }}</text></view>
							</view>
							<view class="otheinfo">
								<view>类型编码：SQ</view>
								<view class="quanhao">
									<label>开始券号：{{ sale6.KQIDS }}</label>
									<label>结束券号：{{ sale6.KQIDE }} <text>总价：￥{{ single_coupon_total_count(sale6) }}</text></label>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="operat">
					<button class="btn btn-qx" @click="back">关闭</button>
					<button class="btn btn-h" @click="coupon_activate()">重试</button>
				</view>
			</view>
			<NoData v-if="!source.sales_union.length"></NoData>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util';
	import common from '@/api/common.js';
	import member from '@/api/hy/MemberInterfaces.js';
	var $ = null;
	export default {
		name: "CouponActivateFail",
		data(){
			return {
				source:{
					sales_union: [],
					select_order_info: null
				}
			}
		},
		watch:{
			'source.sales_union'(n, o){//默认发生变化后选择第 0 位
				if(n.length){
					this.source.select_order_info = n[0];
					console.log("[WatchSaleUnion]获取当前首位数据:", this.source.select_order_info);
				}
			}
		},
		computed:{
			single_coupon_total_count(){
				return $(function(sale6){
					return (this.source.select_order_info?.sale002?.find(sale2 => sale2.BILL == sale6.BILL && sale2.SPID == sale6.SPID)?.NET) || 0
				})
			},
			to_date(){
				return $(function(datetime){
					return new Date(datetime).toLocaleDateString();
				});
			},
			to_time(){
				return $(function(datetime){
					return new Date(datetime).toLocaleTimeString();
				});
			},
			current_order_coupons(){
				return this.source.select_order_info || {
					sale001: null,
					sale002: [],
					sale003: [],
					sale006: [],
				};
			}
		},
		methods:{
			async coupon_segment_activate() {
				return member.coupon_sale.CouponActivation({
					bill: this.source.select_order_info.sale001.BILL,
					khid: this.KHID
				});
			},
			async coupon_activate() {
				if(!this.source.select_order_info){
					util.simpleMsg("未选择重试单据!");
					return;
				}
				console.log("[CouponActivate]准备开始券号激活流程...");
				await this.coupon_segment_activate().then($(async function(res){
					console.log("[CouponActivate]券号激活结果:",res);
					if (res.code) {
						util.simpleMsg("券激活成功!" , true);
						console.log("[CouponActivate]即将更新销售单状态:", res);
						let sql = "update sale001 set str1=null,reason=null,yn_ok='X' where bill='" + this.source.select_order_info.sale001.BILL + "';"
						sql += "update syssale001 set str1=null,reason=null,yn_ok='X' where bill='" + this.source.select_order_info.sale001.BILL + "';"
						let result = await common.SimpleAPIRequest({
							class:"SALE001CLASS",
							method:"ExecuteBatchSQL",
							data: {
								sql
							}
						});
						console.log("销售单更新结果：", result);
						this.get_activate_fail_orders();
						util.simpleMsg((result?.msg || ""), !result.code);
					} else {
						util.simpleMsg("券激活失败!" + (res?.msg || ""), true);
					}
				}))
				console.log("[CouponActivate]券号激活流程执行完毕...");
			},
			async get_activate_fail_orders(){//获取激活失败的单据
				console.log("[GetActivateFailOrders]查询激活失败的单据...");
				let result = await common.SimpleAPIRequest({
					class:"CardSaleCLASS",
					method:"GetFailOrder",
					data:{
						khid:this.KHID,
						kqtype:"'SQ'"
					}
				});
				console.warn("[GetActivateFailOrders]查询完成:",result);
				if(result.code){
					let data = JSON.parse(result.data);
					console.log("[GetActivateFailOrders]查询结果:",data);
					this.source.sales_union = data.sale1.map(sale1 => ({
						sale001: sale1,
						sale002: data.sale2.filter(sale2 => sale2.BILL == sale1.BILL),
						sale003: data.sale3.filter(sale3 => sale3.BILL == sale1.BILL),
						sale006: data.sale6.filter(sale6 => sale6.BILL == sale1.BILL)
					}))
					console.log("[GetActivateFailOrders]处理后结果:", this.source.sales_union);
				}
				else {
					this.source.sales_union = [];
				}
			},
			back(){
				uni.$emit('coupon-activate-fail-close');
			}
		},
		created() {
			this.get_activate_fail_orders();
			$ = util.callContainer(this);
		}
	}
</script>

<style>
	.choice .tab.curr{
		background-color: #FE694B;
	}
	.products{
		padding:0 1.5%;
		height:93%;
	}
	.products .procycle{
		overflow-x: hidden;
	}
	.products .procycle .li{
		width:100%;
		padding:0;
		border-color: #FFE3E3;
		margin-bottom: 30rpx;
	}
	.products .procycle .li .h3{
		background: linear-gradient(90deg, #FFE9E9 0%, #FFFFFF 100%);
		color: #FE694B;
		padding-right: 4%;
		border-radius: 10rpx 10rpx 0 0;
	}
	.products .procycle .li .h3 .state{
		display: flex;
		align-items: center;
		color: #FE694B;
		font-size: 28rpx;
	}
	.products .procycle .li .jiedan em{
		background: #FE694B;	
	}
	
	.cods{
		padding: 0 4%;
	}
	.cods label{
		display: flex;
		justify-content: space-between;
	}
	.prolist .cods label text{
		text-align: right;
		color: #4F4F4F;
		font-size:26rpx;
	}
	.cods label:nth-child(1){
		font-size: 34rpx;
		font-weight: 700;
		color: #333;
		line-height: 70rpx;
		padding-top:10rpx;
	}
	.cods label:nth-child(1) text{
		color: #333;
		font-size: 34rpx;
	}
	.address{
		width:92%;
		margin:0 4%;
		padding:2% 0;
		color: #b0b0b0;
	}
	.li.curr{
		border-color: #FE694B !important;
		background: #fff !important;
		box-shadow: 0px 0px 0px 0.5px #FE694B !important;
	}
	.li.curr .h3{
		background: linear-gradient(90deg, #FE694B 0%, #FFFFFF 100%) !important;
	}
	.li.curr .h3 .state{
		color: #fff !important;
	}
	.li.curr .h3 em{
		background: #fff !important;
	}
	.products  .details{
		height: 98%;
		background: #F9F9F9;
		border: 2rpx solid #FFE3E3;
	}
	.goods .prolist .h3,.goods .prolist .h3 label{
		align-items: center;
		font-size: 34rpx;
	}
	.details .prolist .h3 label text{
		display: inline-block;
		width:60rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 60rpx;
		color: #006B44;
		background: #f1f1f1;
		text-align: center;
		margin-right: 14rpx;
		font-weight: 700;
	}
	.prolist .h3 .shuls text{
		color: #42B14B;
		font-weight: 400;
	}
	.otheinfo{
		padding:1% 2% 0 8%;
		display: flex;
		flex-direction: column;
	}
	.otheinfo label{
		font-size: 26rpx;
		line-height: 40rpx;
		color: #b0b0b0;
		display: flex;
		justify-content: space-between;
	}
	.otheinfo label text{
		color: #FE694B;
		font-weight: 700;
		font-size: 32rpx;
	}
	.quanhao{
		margin-top:20rpx;
		display: flex;
		flex-direction: column;
	}
	.goods .prolist	{
		padding-bottom: 40rpx;
		border-bottom: 2rpx solid #E4E4E4;
		margin-bottom:40rpx;
	}
	.detinfo .member{
		font-size: 34rpx;
		font-weight: 700;
	}
	.detinfo{
		overflow: auto;
	}
</style>
