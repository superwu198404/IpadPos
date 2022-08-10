<style scopeed>
	/* @import url(@/static/style/payment/paymentall/basis.css); */
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>
<template>
	<view class="boxs">
		<view class="memberes">
			<!-- v-if="Memberinfo" -->
			<view v-if="views.Memberinfo" class="meminfo">
				<view class="member">
					<label>填写预定信息</label>
					<button @click="views.Memberinfo = false">×</button>
				</view>
				<view class="middle">
					<view class="restlist">
						<label><text>收货人：</text><input type="text" /></label>
						<label><text>联系电话：</text><input type="text" /></label>
						<label><text>提货时间：</text><input type="text" /></label>
						<label><text>提货门店：</text><input type="text" /></label>
						<label><text>定金：</text><input type="text" /></label>
						<label><text>配送方式：</text><input type="text" /></label>
						<label><text>备注：</text><textarea></textarea></label>
					</view>
					<view class='rests' style="margin-bottom: 0; padding-bottom: 0;">
						<view class="h6"><text>新增地址</text></view>
						<view class="restlist">
							<label><text>收货人：</text><input type="text" /></label>
							<label><text>联系电话：</text><input type="text" /></label>
							<label class="long"><text>收货地址：</text><input type="text" /></label>
							<view class="note">
								<label><text>备注：</text><textarea></textarea></label>
								<view class="caozuo"><button class="btn-xg"> 修改</button><button
										class="btn-sc">删除</button></view>
							</view>
						</view>

					</view>
					<view class='rests'>
						<view class="h6"><text>地址</text> <button @click="Newlys()">+ 新增地址</button></view>
						<view class="location">
							<view class="site">
								<view class="sitelist">
									<radio></radio>
									<view>
										<text>张三，13876545678</text>
										<label>武汉市江汉区后襄河北路海马中心写字楼1号楼25楼2510</label>
									</view>
								</view>
								<view class="caozuo"><button class="btn-xg"> 修改</button><button
										class="btn-sc">删除</button></view>
							</view>
						</view>
						<view class="more">显示全部地址<image src="../../../images/zhankaiqb-dt.png"></image>
						</view>
					</view>

					<view class="atlas">
						<div class="map"></div>
					</view>
				</view>
				<view class="operat">
					<button class="btn btn-qx">取 消</button>
					<button class="btn">确 定</button>
				</view>
			</view>

			<view class="pop-r">
				<view class="member">
					<label>
						<image class="touxiang" src="../../../images/touxiang.png"></image>
						<label
							class="meminfo"><text>{{ details.info.CUSTMNAME || "-" }}</text><text>{{ details.info.CUSTMPHONE || "-" }}</text></label>
					</label>
					<text>清空</text>
				</view>
				<view class="edit-info">
					<button @click="views.Memberinfo = true">+修改预订单信息</button>
				</view>
				<view class="h5"><text>单号：{{ details.info.BILL || "-" }}</text></view>
				<view class="goods">
					<!-- 商品循环 -->
					<view class="prolist" v-for="i in details.list">
						<view class="h3">
							<label>
								<image src="../../../images/dx-mrxk.png" mode="widthFix"></image> {{ i.SNAME || "-"  }}
							</label>
							<text>X{{ i.QTY }}</text>
						</view>
						<view class="cods">
							<view>
								<label>
									<image src="../../../images/dx-bm.png" mode="widthFix"></image>{{ i.SPID || "-"  }}
								</label>
								<label>
									<image src="../../../images/dx-dw.png" mode="widthFix"></image>{{ i.UNIT || "-" }}
								</label>
							</view>
							<text>￥{{ i.PRICE }}</text>
						</view>
					</view>

				</view>

				<view class="ul">
					<view class="li"><text>总金额</text><text>￥{{ details.info.ZNET }}</text></view>
					<view class="li"><text>件数</text><text>{{ details.list.length }}</text></view>
					<view class="li"><text>折扣</text><text>-￥{{ details.info.BILLDISC }}</text></view>
					<view class="li"><text>应收金额</text><text>￥{{ details.info.DNET }}</text></view>
				</view>

				<view class="confirm">
					<button class="btn btn-qx" @click="Close">返 回</button>
					<button class="btn">确 认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _extract from '@/api/business/extract.js'
	import util from '@/utils/util.js';
	export default {
		name: "Reserve",
		props: {
			show: Boolean,
			info: Object
		},
		data() {
			return {
				Newaddr: true,
				Statements: this.show,
				views: {
					Memberinfo: false
				},
				details: {
					info:{
						BILL: "",
						THDATE: "",
						CUSTMNAME: "",
						CUSTMPHONE: "",
						CUSTMCOMM: "",
						DNET: "",
						ZNET: "",
						BILLDISC: "",
						CUSTMADDRESS: ""
					},//主单数据（商品集合中共有的部分，如买家的信息）
					list: []//列表数据（后端查询的是一个商品集合）
				}
			}
		},
		methods: {
			Newlys: function(e) {
				this.Newaddr = true
			},
			GetOrderDetails: function(bill) { //查询获取订单商品详细信息
				_extract.getReserveOrdersDetails({
					khid: this.KHID,
					bhlb: `(${util.getStorage("POSCS")?.find(i => i.POSCS === 'BHLBBM')?.POSCSNR || "109"})`,
					bill
				}, util.callBind(this, function(res) {
					if (res.code) {
						this.details.list = JSON.parse(res.data);
						console.log("详细信息：", res);
					} else
						util.simpleMsg(res.msg, true, res);
				}))
			},
			Save: function() {
				_extract.reserveOrdersUpdate({
					khid: this.KHID,
					gsid: this.GSID,
					bill: this.order.BILL,
					order: {
						remark: this.order.CUSTMCOMM,
						addr_id: this.order.NOTE2,
						bhid: this.order.STR2,
						date: this.order.THDATE,
						phone: this.order.CUSTMPHONE,
						addr: this.order.CUSTMADDRESS,
						custname: this.order.CUSTMNAME,
					}
				}, util.callBind(this, function(res) {
					util.simpleMsg(res.msg, res.code, res);
				}));
			},
			Close: function() {
				this.$emit("Close");
			}
		},
		mounted() {
			Object.assign(this.details.info,this.info);
			this.GetOrderDetails(this.bill);
		}
	}
</script>

<style>
	.edit-info>uni-button {
		flex: 0.9;
		font-size: 12px;
		margin-bottom: 4px;
	}

	.edit-info {
		display: flex;
		justify-content: center;
	}

	.pop-r {
		display: flex;
		flex-flow: column;
	}

	.goods {
		height: unset;
		flex: 0.98;
	}
</style>
