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
						<label><text>收货人：</text><input type="text" v-model="details.info.CUSTMNAME" /></label>
						<label><text>联系电话：</text><input type="text" v-model="details.info.CUSTMPHONE"
								v-on:blur="QueryAddress()" /></label>
						<label><text>提货时间：</text><input type="text" v-model="details.info.THDATE" /></label>
						<label><text>提货门店：</text><input type="text" v-model="details.info.THKHID" /></label>
						<label><text>定金：</text><input type="text" v-model="details.info.DNET" /></label>
						<label><text>配送方式：</text><input type="text" v-model="details.info.THTYPE" /></label>
						<label><text>备注：</text><textarea v-model="details.info.CUSTMCOMM"></textarea></label>
					</view>
					<view class='rests' v-if="Newaddr" style="margin-bottom: 0; padding-bottom: 0;">
						<view class="h6"><text>新增地址</text></view>
						<view class="restlist">
							<label><text>收货人：</text><input type="text" v-model="from.address.NAME" /></label>
							<label><text>联系电话：</text><input type="text" v-model="from.address.PHONE" /></label>
							<label class="long"><text>收货地址：</text><input type="text"
									v-model="from.address.ADDRESS" /></label>
							<view class="note">
								<!-- <label><text>备注：</text><textarea></textarea></label> -->
								<view class="caozuo"><button class="btn-xg"
										@click="ChangeCustomerAddress">{{ state.address_edit ? "保存" : "添加" }}</button><button
										class="btn-sc" @click="Newaddr = false">关闭</button></view>
							</view>
						</view>
					</view>
					<view class='rests'>
						<view class="h6"><text>地址</text> <button @click="Newlys()">+ 新增地址</button></view>
						<view class="location">
							<radio-group @change="RadioChange">
								<view class="site" v-for="(i,index) in details.address"
									v-if="from.more?true:(index===1?true:false)">
									<view class="sitelist">
										<radio :value="i.ADDRID" :checked="index === views.current"></radio>
										<view>
											<text>{{ i.CNAME }}，{{ i.PHONE }}</text>
											<label>{{ i.ADDRESS }}</label>
										</view>
									</view>
									<view class="caozuo"><button class="btn-xg" @click="EditAddress(i)">
											修改</button><button class="btn-sc"
											@click="DeleteAddress(i.ADDRID,i.PHONE)">删除</button></view>
								</view>
							</radio-group>
						</view>
						<view class="more" @click="from.more = !from.more">{{ from.more?"折叠全部地址":"显示全部地址" }}
							<image style="transition: .8s all;" :class="from.more?'arrow-direction':''"
								src="../../../images/zhankaiqb-dt.png"></image>
						</view>
					</view>
					<view v-show="!Newaddr" style="width: 100%;height: 300px;display: flex;justify-content: center;">
						<view style="width: 90%; height: 290px;">
							<map style="width: 100%; height: 100%;" :latitude="map.latitude" :longitude="map.longitude"
								:scale="map.scale" @tap="GetLocation">
							</map>
						</view>
					</view>
				</view>
				<view class="operat">
					<button class="btn btn-qx" @click="views.Memberinfo = false">取 消</button>
					<button class="btn" @click="Save">保 存</button>
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
					<button @click="EditExtract">+修改预订单信息</button>
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
					<button class="btn" @click="Accept">{{ mode ? '提取' : '取消' }}</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import _extract from '@/api/business/extract.js'
	import util from '@/utils/util.js';
	import {
		Refund
	} from '@/bll/RefundBusiness/bll.js'
	import {
		Payment
	} from '@/bll/PaymentBusiness/bll.js'
	export default {
		name: "Reserve",
		props: {
			show: Boolean,
			info: Object,
			mode: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				Newaddr: false,
				Statements: this.show,
				map: {
					longitude: 114.3093413671875, //经度
					latitude: 30.570206594347283, //纬度
					scale: 12, //缩放级别
				},
				views: {
					Memberinfo: false,
					current: null
				},
				details: {
					info: {
						BILL: "",
						THDATE: "",
						CUSTMNAME: "",
						CUSTMPHONE: "",
						CUSTMCOMM: "",
						DNET: "",
						ZNET: "",
						BILLDISC: "",
						CUSTMADDRESS: ""
					}, //主单数据（商品集合中共有的部分，如买家的信息）
					list: [], //列表数据（后端查询的是一个商品集合）
					address: [] //用户配送地址集合
				},
				state: {
					address_edit: false
				},
				from: {
					more: false,
					selected: { //当前选中的配送地址
						ACT: "",
						NAME: "", //客户名称
						PHONE: "", //客户电话
						LATITUDE: "", //纬度
						LONGITUDE: "", //经度
						ADDRESS: "", //地址
						ADDRID: "" //地址ID
					},
					address: {
						ACT: "",
						NAME: "", //客户名称
						PHONE: "", //客户电话
						LATITUDE: "", //纬度
						LONGITUDE: "", //经度
						ADDRESS: "", //地址
						ADDRID: "" //地址ID
					}
				}
			}
		},
		methods: {
			Newlys: function(e) {
				this.Newaddr = true; //新增地址
				this.state.address_edit = false;
				this.from.address.PHONE = this.details.info.CUSTMPHONE;
			},
			RadioChange: function(evt) {
				for (let i = 0; i < this.details.address.length; i++) {
					if (this.details.address[i].value === evt.detail.value) {
						this.views.current = i;
						break;
					}
				}
			},
			EditAddress: function(address) {
				this.Newaddr = true; //编辑地址
				this.state.address_edit = true;
				Object.assign(this.from.address, address);
			},
			GetOrderDetails: function(bill) { //查询获取订单商品详细信息
				_extract.getReserveOrdersDetails({
					khid: this.KHID,
					bhlb: `(${util.getStorage("POSCS")?.find(i => i.POSCS === 'BHLBBM')?.POSCSNR || "109"})`,
					bill
				}, util.callBind(this, function(res) {
					if (res.code) {
						this.details.list = JSON.parse(res.data);
						console.log("详细信息：", this.details.list);
					} else
						util.simpleMsg(res.msg, true, res);
				}))
			},
			Save: function() {
				let address = "",
					address_id = "",
					phone = "";
				if (this.views.current) {
					let address_info = this.details.address[this.views.current];
					address = address_info.ADDRESS;
					address_id = address_info.ADDRID;
					phone = address_info.PHONE;
				}
				_extract.reserveOrdersUpdate({
					khid: this.KHID,
					gsid: this.GSID,
					bill: this.details.info.BILL,
					regenerate: this.ExistsGenarate(),
					order: {
						remark: this.details.info.CUSTMCOMM,
						addr_id: address_id ?? this.details.info.NOTE2,
						bhid: this.details.info.STR2,
						date: this.details.info.THDATE,
						phone: this.details.info.CUSTMPHONE,
						addr: address ?? this.details.info.CUSTMADDRESS,
						custname: this.details.info.CUSTMNAME,
						thkhid: this.details.info.thkhid
					}
				}, util.callBind(this, function(res) {
					util.simpleMsg(res.msg, res.code, res);
					if (res.code) {
						this.views.Memberinfo = false;
						this.Close();
					}
				}));
			},
			QueryAddress: function() {
				console.log("查询客户地址信息...");
				this.GetCustomerAddress(this.details.info.CUSTMPHONE);
			},
			GetCustomerAddress: function(number) {
				_extract.GetAddr({
					phone: number
				}, util.callBind(this, function(res) {
					if (res.code) {
						console.log("用户电话地址：", res);
						this.details.address = JSON.parse(res.data);
					} else {
						util.simpleMsg(res.msg, true, res);
						this.details.address = [];
					}
				}))
			},
			ChangeCustomerAddress: function() {
				_extract.ConfirmADDR(Object.assign(this.from.address, {
					ACT: this.state.address_edit ? "Edit" : "Add"
				}), util.callBind(this, function(res) {
					util.simpleMsg(res.msg, res.code, res);
					this.Newaddr = false;
					this.GetCustomerAddress(this.details.info.CUSTMPHONE);
				}))
			},
			DeleteAddress: function(id, phone) {
				_extract.Del_Addr({
					addrid: id,
					phone: phone
				}, util.callBind(this, function(res) {
					util.simpleMsg(res.msg, res.code, res);
					this.GetCustomerAddress(this.details.info.CUSTMPHONE);
				}));
			},
			ExistsGenarate: function() { //判断是否需要重新生成配送单（详细逻辑可看接口 ReserveOrdersUpdate 内的注释）
				let before = util.timeZoneCompensation(new Date(util.formatIOSDateTime(this.details.info.$THDATE)));
				let after = util.timeZoneCompensation(new Date(util.formatIOSDateTime(this.details.info.THDATE)));
				if (after < before && util.twelveClock(new Date()).getTime() === util.twelveClock(after).getTime() &&
					details.info.THTYPE.indexOf('自提') === -1)
					return true;
				else
					return false;
			},
			EditExtract: function() {
				this.views.Memberinfo = true;
				this.GetCustomerAddress(this.details.info.CUSTMPHONE);
			},
			GetLocation: function(e) {
				console.log("获取坐标信息:", e);
			},
			Close: function() {
				this.$emit("Close");
			},
			Accept:function(){//由于支付操作的订单是初始化所以是同步的，而退款的方法涉及数据库查询所以是异步的
				if(this.mode){//提取操作 => 支付
					console.log("[预定提取]结算确认!开始结算...")
					Payment(this.details.list).then(util.callBind(this, function(pay_data) {//处理退款所需的业务信息数据
						console.log("[预定提取]处理的数据:",pay_data);
						this.$store.commit('set-location', pay_data);//把数据传入下个页面
						uni.navigateTo({
							url: "../Payment/PaymentAll"
						})
					})).catch(util.callBind(this, function(err) {
						console.log("退单表数据查询异常:", err);
					}));
				}
				else{//取消操作 => 退款
					console.log("[预定取消]退单确认!开始退款...");
					Refund(this.details.info.BILL).then(util.callBind(this, function(refund_data) {//处理退款所需的业务信息数据
						this.$store.commit('set-location', refund_data);//把数据传入下个页面
						uni.navigateTo({
							url: "../Payment/PaymentAll"
						})
					})).catch(util.callBind(this, function(err) {
						console.log("退单表数据查询异常:", err);
					}));
				}
			}
		},
		mounted() {
			Object.assign(this.details.info, this.info);
			console.log("预订单信息:", this.details.info);
			this.details.info.$THDATE = this.details.info.THDATE; //储存旧的提货时间
			this.GetOrderDetails(this.details.info.BILL);
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

	.arrow-direction {
		transform: rotate(-180deg);
	}
</style>
