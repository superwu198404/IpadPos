<template>
	<view>
		<p>应收：{{totalAmount}}</p>
		<view>
			待支付：
			<label>{{totalAmount-yPayAmount}}</label>
		</view>
		<view>
			<radio-group class="radio-group" @change="radioChange">
				<label class="radio" v-for="(item, index) in PayWay" :key="item.value">
					<radio :value="item.value" :checked="item.checked" /> {{item.name}}
				</label>
			</radio-group>
		</view>
		<view v-show="selectPayWay!=null">
			支付金额:
			<input v-model="PayAmont">
		</view>
		<button @click="Pay()">支付</button>
		<view> 支付列表:
			<p>序号---支付方式---金额---编码</p>
			<view v-for="(way, index) in PayList">
				{{ index }} --- {{ way.way }} ---{{way.amount}}--- {{ way.no }}
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :type="type" :maskClick="false">
				<view class="uni-tip">
					付款码：
					<input confirm-type="confirm" @confirm="ToPay" v-model="authCode">
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/components/uni-popup/uni-popup.vue'
	import hy from '@/utils/hy/hy_query.js';
	import Req from '@/utils/request.js';
	import _wx from '@/utils/Pay/WxPay.js';
	import _ali from '@/utils/Pay/Alipay.js';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				type: 'center',
				totalAmount: 100, //应付
				yPayAmount: 0, //已支付金额
				PayWay: [{
						name: '支付宝',
						value: 'AliPayService'
					},
					{
						name: '微信',
						value: 'WxPayService',

					},
					{
						name: '仟吉券',
						value: 'qjq'
					},
					{
						name: '电子卡',
						value: 'dzk'
					}
				], //支付方式
				PayAmont: 0,
				selectPayWay: null,
				PayList: [],
				authCode: "287772248876929282",
				out_trade_no: "2022050914270241"
			}
		},
		methods: {
			radioChange(e) {
				let way = e.target.value;
				this.selectPayWay = way;
				if (way == 'AliPayService' || way == 'WxPayService') {
					this.PayAmont = this.totalAmount - this.yPayAmount;
				} else {
					this.PayAmont = 0;
				}
			},
			OrderQuery: function(out_trade_no, func,fun4) {
				_ali.Payment("订单查询中", "_tradeQuery", "AliPayService", { out_trade_no: out_trade_no }, func,fun4);
			},
			OrderCancel: function(out_trade_no,func,fun4) {
				_ali.Payment("订单撤销中", "_tradeCancel", "AliPayService", {out_trade_no:out_trade_no},func,fun4);
			},
			Pay: function() {
				if (!this.selectPayWay) {
					uni.showToast({
						title: '请选择支付方式',
						duration: 2000,
						icon: "error"
					});
					return;
				}
				if (!this.PayAmont) {
					uni.showToast({
						title: '请输入支付金额',
						duration: 2000,
						icon: "error"
					});
					return;
				}
				if (this.PayAmont > (this.totalAmount - this.yPayAmount)) {
					uni.showToast({
						title: '输入的金额有误',
						duration: 2000,
						icon: "error"
					});
					return;
				}
				this.$refs['popup'].open();

			},
			ToPay: function(e) {
				let code = e.target.value;
				if (!code) {
					uni.showToast({
						title: "请输入付款码",
						duration: 2000,
						icon: "error"
					});
					return;
				}
				this.$refs['popup'].close();
				let that = this;
				//title,auth_code,body,total_fee
				// let result= _ali.CodePayment("支付宝付款码支付",this.out_trade_no,"测试~",1);
				let result = _ali.Payment("支付宝付款码支付", "_CodePayment", "AliPayService", {
					out_trade_no: that.out_trade_no, //2022050914270235
					auth_code: that.authCode,
					subject: "测试测试",
					total_amount: 0.01
				}, 
				function(res) {
					let Result = JSON.parse(res.data);
					Result = Result.alipay_trade_pay_response;
					if (Result.code == "10000") {
						//支付成功生成记录
						that.PayList.Push({way: "微信",amount: that.PayAmont,no: Result.trade_no});
						return;
					} else if (Result.code == "10003") { //支付中 交易创建，等待买家付款
						let times = 0;
						let timerIndex;
						var timer =function(){
							if (times < 25) {
								//查询 订单
								that.OrderQuery(that.out_trade_no, 
								function(res) {
									let qResult = JSON.parse(res.data);
									qResult = qResult.alipay_trade_query_response;
									if (qResult.code == "10000") {
										if (qResult.trade_status == "WAIT_BUYER_PAY") {
											//交易创建，等待买家付款
										} else {
											//交易支付成功//生成支付记录
											if (qResult.trade_status == "TRADE_SUCCESS") {
												that.PayList.Push({way: "微信",amount: that.PayAmont,no: Result.trade_no});
											}else{
												//未付款交易超时关闭，或支付完成后全额退款 TRADE_CLOSED
												//交易结束，不可退款 TRADE_FINISHED
											}
											clearInterval(timerIndex);
											timer = null;
										}   
									} else {
										//异常
										clearInterval(timerIndex);
										timer = null;
										return false;
									}
								 return res;
								},
								function(res){
									clearInterval(timer);
									uni.showToast({
										title: "支付异常",
										duration: 2000,
										icon: "error"
									});
								});
								//提示是否继续等待
								if (times ==6 || times==12 || times==18 || times ==24) {
									clearInterval(timerIndex);
									uni.showModal({
										title: '提示',
										content: '是否继续等待',
										confirmText: "是",
										cancelText: "否",
										success: function(res) {
											if (res.confirm) {
												 timerIndex= setInterval(timer, 5000)
											} 
											else if (res.cancel) {
												//不等待就取消查询   取消订单
												 that.OrderCancel(that.out_trade_no,
												 function(res){
													 let qResult = JSON.parse(res.data);
													 qResult=qResult.alipay_trade_cancel_response
													 if (qResult.SubCode == "10000") { 
														uni.showToast({
															title: "支付失败，订单已撤销",
															duration: 2000,
															icon: "error"
														});
													 }
													 return res
												 },
												 function(res){
													 if (res.data == null) {
													 	uni.showToast({
													 		title: res.msg,
													 		duration: 2000,
													 		icon: "error"
													 	});
													 }
													 let Result = JSON.parse(res.data);
													 Result = Result.alipay_trade_pay_response;
													 //非业务失败
													 if (Result.code != "40004") {
													 	//业务失败
													 	uni.showToast({
													 		title: Result.msg,
													 		duration: 2000,
													 		icon: "error"
													 	});
													 } else {
													 	//业务失败
													 	uni.showToast({
													 		title: Result.sub_msg,
													 		duration: 2000,
													 		icon: "error"
													 	});
													 }
													 
												 });
												 
											}
										}
									});
								}
								
							} else {
								clearInterval(timer);
								//还是没结果撤销订单
								that.OrderCancel(that.out_trade_no);
							}
						   times++;
						};
					 timerIndex= setInterval(timer, 5000)
					}
					return Result;
				}, 
				function(res) {
					if (res.data == null) {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: "error"
						});
					}
					let Result = JSON.parse(res.data);
					Result = Result.alipay_trade_pay_response;
					//非业务失败
					if (Result.code != "40004") {
						//业务失败
						uni.showToast({
							title: Result.msg,
							duration: 2000,
							icon: "error"
						});
						return;
					} else {
						//业务失败
						uni.showToast({
							title: Result.sub_msg,
							duration: 2000,
							icon: "error"
						});
					}

				});
			}
		}
	}
</script>

<style>
	.uni-tip {
		background: #fff;
		width: 70%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		border-radius: 10px;
	}

	.uni-tip-title {
		text-align: center;
		font-size: 16px;
	}

	.uni-tip-group-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-content: center;
	}

	.uni-tip-group-button button {
		margin: 0;
	}

	.uni-tip-content {
		min-height: 60px;
	}
</style>
