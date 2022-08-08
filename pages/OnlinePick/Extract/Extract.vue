<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>
<template>
	<view class="boxs">
		<view class="memberes">
			<view class="pop-r">
				<view class="member" v-if="false">
					<label>
						<image class="touxiang" src="../../../images/touxiang.png"></image>
						<label class="meminfo"><text>会员名称</text><text>13012341234</text></label>
					</label>
					<text>清空</text>
				</view>
				<view class="h5"><text>单号：K200QTD00542205171540340</text></view>
				<view class="goods">
					<!-- 商品循环 -->
					<view class="prolist" v-for="i in order.extracts.Products">
						<view class="h3">
							<label>
								<image src="../../../images/dx-mrxk.png" mode="widthFix"></image> {{ i.SNAME }}
							</label>
							<text>X{{ i.QTY }}</text>
						</view>
						<view class="cods">
							<view>
								<label>
									<image src="../../../images/dx-bm.png" mode="widthFix"></image>12345678
								</label>
								<label>
									<image src="../../../images/dx-dw.png" mode="widthFix"></image>10个装
								</label>
							</view>
							<text>￥56</text>
						</view>
					</view>

				</view>

				<view class="ul">
					<view class="li"><text>总金额</text><text>￥{{ order.extracts.DNET || "-" }}</text></view>
					<view class="li"><text>件数</text><text>{{ order.extracts.Products.length || "-" }}</text></view>
					<view class="li"><text>折扣</text><text>-￥{{ order.main.discount || "-" }}</text></view>
					<view class="li"><text>应收金额</text><text>￥{{ order.main.receivable || "-"}}</text></view>
				</view>

				<view class="confirm">
					<button class="btn btn-qx" @click="Close">返 回</button>
					<button class="btn" @click="Reserve()">确 认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	import {
		onlineOrderReserve
	} from '@/api/business/onlineorders.js'
	export default {
		name: "Reserve",
		props: ["details"],
		data() {
			return {
				Newaddr: false,
				Statements: this.show,
				order: {
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
					code:""
				}
			}
		},
		methods: {
			Newlys: function(e) {
				this.Newaddr = true
			},
			Close: function() {
				this.$emit("Close");
			},
			Valid: function() {
				if (this.order.extracts.THTYPE === '0')
					if (!this.order.code) {
						util.simpleMsg("请输入自提码!")
						return false
					}
				return true;
			},
			Reserve: function() {
				if (this.Valid())
					onlineOrderReserve({
						khid: this.KHID,
						bill: this.order.main.otoCode,
						code: this.order.code,
						isBill: this.order.extracts.THTYPE !== "0",
						details: this.order.extracts
					}, util.callBind(this, function(res) {
						console.log("提取成功！", res);
						this.$emit("Reset",true);
						this.$emit("Close");
					}), util.callBind(this, function(err) {
						util.simpleMsg(err.msg, true);
						this.$emit("Reset",false);
						this.$emit("Close");
					}))
			}
		},
		created() {
			Object.assign(this.order, this.details);
			console.log("details:", this.details);
			console.log("order:", this.order);
		}
	}
</script>

<style>
	.pop-r {
		display: flex;
		flex-flow: column;
	}
	.goods{
		flex: 0.98 0px;
	}
</style>
