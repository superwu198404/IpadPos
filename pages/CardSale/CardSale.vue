<template>
	<view style="border: 1px solid red;height: 100%;width: 100%;">
		<p>卡销售：</p>
		起始卡号：<input type="text" v-model="begin_num" />
		结束卡号：<input type="text" v-model="end_num" />
		<button @click="Confirm">确认</button>
		<view>
			<p v-for="(item) in ValidCards">{{item.SNAME}}-{{item.SPID}}-{{item.PLID}}-{{item.UNIT}}</p>
			<p v-for="(item) in CZGZMX" @click="ChooseCZGZ(item)">充{{item.CZNET}}元，送{{item.ZSNET}}元.</p>
		</view>
	</view>
</template>

<script>
	import _card_coupon from "@/utils/sale/card_coupon.js";
	import util from "@/utils/util.js";
	import _util from "@/utils/util.js";
	import _card_sale from "@/api/business/card_sale.js";

	var that, KQSale;
	export default {
		name: "CardSale",
		data() {
			return {
				begin_num: "1087110000744323",
				end_num: "",
				store: getApp().globalData.store,
				ValidCards: [],
				showCZGZ: false,
				CZGZMX: [],
				CurCZGZ: {},
			}
		},
		created: function() {
			that = this;
			KQSale = new _card_coupon.InitKQSale(that, uni, that.store, "VIPCard_Active");
			KQSale.InitData("卡销售初始化", res => {
				that.ShowCZGZ();
			});
		},
		methods: {
			Confirm: function() {
				if (!this.begin_num) {
					_util.simpleMsg("卡号不为空");
				}
				KQSale.QueryInfo({
					card_num: that.begin_num
				}, res => {
					console.log(res);
					if (KQSale.CheckStatus(res)) {
						KQSale.CheckStock({
							begin_num: that.begin_num,
							end_num: that.begin_num,
							material_id: res.data.materielId,
							khid: that.store.KHID
						}, res1 => {
							console.log("库存校验结果：", res1);
							if (!res1.code) {
								_util.simpleMsg(res1.msg, true);
								return;
							}
							if (res1.data[0].CARDNUM == "0") {
								_util.simpleMsg("卡库存不在当前门店", "none");
								return;
							}
							let spObj = KQSale.MatchSP(res.data.materielId);
							if (spObj)
								that.ValidCards.push(spObj);
						})
					}
				})
			},
			//展示充值规则
			ShowCZGZ: function() {
				let czgz = _util.getStorage("KCZGZMX");
				if (czgz) {
					that.showCZGZ = true;
					that.CZGZMX = czgz.map(r => {
						return {
							CZNET: r.CZNET,
							ZSNET: r.ZSNET
						}
					})
				}
			},
			//充值规则选择事件
			ChooseCZGZ: function(e) {
				if (e)
					that.CurCZGZ = e;
			},
		}
	}
</script>

<style>

</style>
