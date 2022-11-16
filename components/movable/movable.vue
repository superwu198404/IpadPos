<template>
	<view>
		<!-- v-if="msgDatas.length>0" -->
		<movable-area style="z-index: 999;">
			<movable-view :x="x" :y="y" direction="all" position="position" @change="onChange">
				<view class="ordermes">
					<em></em>
					<label class="neiquan" @click="Orderments()">
						<image src="../../images/xianshangdd-bai.png" mode="widthFix"></image>
						<text>{{totalCount}}</text>
					</label>
					<view class="orderlist" v-if="orderlist">
						<view v-for="(item,index) in msgDatas" :key="index" @click="ReadMsg(item,index)">
							<view class="h2" v-if="item.type=='XTIP'">
								<image src="../../images/xianshangdingd.png"></image>线上订单
							</view>
							<view class="h2" v-if="item.type=='PTIP'">
								<image src="../../images/waimaidan.png"></image>外卖单
							</view>
							<view class="h2" v-if="item.type=='WMYS'">
								<image src="../../images/ydtq.png"></image>外卖预定单
							</view>
							<view class="ul">
								<label><span>●</span>{{item.title}}</label><text>{{item.count}}</text>
							</view>
						</view>
					</view>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import _msg from '@/api/business/message.js';
	import util from '@/utils/util.js';
	import common from '@/api/common.js';
	var that;

	export default {
		name: "movable",
		data() {
			return {
				x: 0,
				y: 0,
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 0,
				move: {
					x: 0,
					y: 0
				},
				orderlist: false,
				msgDatas: [],
				KHID: getApp().globalData.store.KHID,
				// totalCount: 0
			}
		},
		props: {
			_msgDatas: {
				type: Array,
				default () {
					return [];
				}
			},
		},
		computed: {
			totalCount: function() {
				let count = 0;
				that.msgDatas.map(r => {
					count += r.count;
				})
				return count;
			}
		},
		created: function(position) {
			that = this;
			that.msgDatas = that._msgDatas; //消息数据赋值
			// console.log("传入的业务消息集合：", that.msgDatas);
			// that._msgDatas.map(r => {
			// 	that.totalCount += r.count;
			// })
			let move = util.getStorage("move")
			uni.getSystemInfo({
				success: function(res) {
					// console.log("设备信息：", res);
					that.x = move.x || (res.screenWidth - 240); //280
					that.y = move.y || (res.screenHeight - 260); //260
					// console.log("偏移宽度：", that.x);
				}
			})
		},
		methods: {
			onChange: function(e) {
				this.move.x = e.detail.x;
				this.move.y = e.detail.y;
				util.setStorage("move", this.move);
			},

			mounted() {
				this.$refs.setPlan.open()
				var _this = this
			},
			doFresh: function() {
				that.msgDatas = that._msgDatas; //消息数据赋值
				that._msgDatas.map(r => {
					that.totalCount += r.count;
				})
				console.log("主动调用成功：", that.totalCount);
			},
			Orderments: function(e) {
				if (this.totalCount > 0) {
					this.orderlist = !this.orderlist;
				}
				// console.log("点击消息：", this.orderlist);
			},
			//消息已读
			ReadMsg: function(e, i) {
				// console.log("消息点击");
				_msg.DelMsg(that.KHID, e, res => {
					console.log("消息数据已读结果：", res);
					that.msgDatas.splice(i, 1);
					if (e.url) {
						let name, title, xstype;
						if (e.type == 'XTIP') {
							name = "OnlineOrders";
							title = "线上订单";
							xstype = "sale_online_order";
						}
						if (e.type == 'PTIP') {
							name = "TakeAway";
							title = "外卖单";
							xstype = "sale_takeaway";
						}
						if (e.type == 'WMYS') {
							name = "TakeYD";
							title = "外卖预订单";
							xstype = "sale_takeaway_reserve";
						}
						that.orderlist = false; //关闭消息框
						//home下有监听该回调事件
						uni.$emit("Switch", xstype)
					}
				});
			},
			//消息已读
			_ReadMsg: function(e, i) {
				// console.log("消息点击");
				let store = util.getStorage("store");
				if (store.OPENFLAG != '1') {
					util.simpleMsg("请先进行签到", true);
					return;
				}
				_msg.DelMsg(that.KHID, e, res => {
					console.log("消息数据已读结果：", res);
					that.msgDatas.splice(i, 1);
					if (e.url) {
						// uni.navigateTo({
						// 	url: e.url
						// })
						let name, title;
						if (e.type == 'XTIP') {
							name = "OnlineOrders";
							title = "线上订单";

							uni.$emit("Switch", {
								// name: "name",
								title: "线上业务",
								params: {
									// msgdatas: e
								},
							})
						}
						if (e.type == 'PTIP') {
							name = "TakeAway";
							title = "外卖单";
						}
						if (e.type == 'WMYS') {
							name = "TakeYD";
							title = "外卖预订单";
						}
						console.log("跳转name", name, title);
						that.orderlist = false;
						//home下有监听该回调事件
						uni.$emit("Switch", {
							name: name,
							title: title,
							params: {
								// msgdatas: e
							},
						})
						//必须后置，否则无法切换
						if (e.type == 'XTIP') {
							uni.$emit("Switch", {
								// name: "name",
								title: "线上业务",
								switch: false,
								params: {
									// msgdatas: e
								},
							})
						}
					}
				});
			}
		}

	}
</script>

<style>
	movable-area {
		position: fixed;
		top: 10%;
		left: 10%;
		right: 0;
		bottom: 0;
		width: 89%;
		height: 90%;
		pointer-events: none;
	}

	movable-view {
		width: 100px;
		height: 100px;
		border-radius: 100%;
		pointer-events: auto;
		/* position: fixed;
		bottom:20%;
		right:0; */
	}

	.ordermes {
		position: fixed;
		bottom: 20%;
		right: 0;
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0px 3px 20px 1px rgba(0, 107, 68, 0.1000);
	}

	.ordermes em {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid #006B44;
		border-radius: 50%;
		animation: scales 1s ease infinite;
		-webkit-animation: scales 1s ease infinite;
		box-shadow: 0px 3px 20px 1px rgba(0, 107, 68, 0.1000);
	}

	@keyframes scales {

		/*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
		0% {
			width: 70rpx;
			height: 70rpx;
		}

		100% {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.ordermes .neiquan {
		background-color: #006B44;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ordermes image {
		width: 50rpx;
		height: 50rpx;
	}

	.ordermes label text {
		background-color: #FE694B;
		color: #fff;
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		min-width: 40rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 50%;
		font-size: 24rpx;
	}

	.orderlist {
		position: absolute;
		right: 100%;
		top: 0;
		background-color: #fff;
		box-shadow: 0px 10px 20px 1px rgba(0, 107, 68, 0.1600);
		width: 740rpx;
		padding: 0 30rpx 20rpx 30rpx;
		border-radius: 16rpx;
	}

	.orderlist .h2 {
		font-weight: 700;
		line-height: 80rpx;
		display: flex;
		justify-content: start;
		align-items: center;
		margin-top: 20rpx;
	}

	.orderlist .h2 image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 6rpx;
	}

	.orderlist .ul {
		display: flex;
		justify-content: space-between;
		background: #F8F8F8;
		padding: 20rpx 4%;
	}

	.orderlist .ul span {
		color: #FE694B;
		margin-right: 8rpx;
		font-size: 10rpx;
	}

	.orderlist .ul text {
		background-color: #FE694B;
		color: #fff;
		min-width: 40rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 50%;
		font-size: 24rpx;
	}
</style>
