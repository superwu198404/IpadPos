<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>
<template>
	<view v-if="show" class="meminfo">
		<view class="member">
			<label>填写预定信息</label>
			<button @click="Close">×</button>
		</view>
		<view class="middle">
			<view class="restlist">
				<label><text>收货人：</text><input type="text" v-model="details.info.CUSTMNAME" /></label>
				<label><text>联系电话：</text><input type="text" v-model="details.info.CUSTMPHONE"
						v-on:blur="QueryAddress()" /></label>
				<label><text>提货时间：</text><input type="text" v-model="details.info.THDATE" /></label>
				<!-- <label><text>提货门店：</text><input type="text" v-model="details.info.THKHID" /></label> -->
				<label><text>提货门店：</text>
					<StorePicker @change="StoreChange" :init="details.info.THKHID"
						style="height: 30px;background-color: #F5F5F5;line-height: 30px;border-radius: 2px;border: 0.5px solid #eee;width: 65%;"
						class="uni-input-input"></StorePicker>
				</label>
				<label><text>定金：</text><input type="text" v-model="details.info.DNET" /></label>
				<label><text>配送方式：</text><input type="text" v-model="details.info.THTYPE" /></label>
				<label><text>备注：</text><textarea v-model="details.info.CUSTMCOMM"></textarea></label>
			</view>
			<view class='rests' v-if="view.add_address" style="margin-bottom: 0; padding-bottom: 0;">
				<view class="h6"><text>新增地址</text></view>
				<view class="restlist">
					<label><text>收货人：</text><input type="text" v-model="form.address.NAME" /></label>
					<label><text>联系电话：</text><input type="text" v-model="form.address.PHONE" /></label>
					<label class="long"><text>收货地址：</text>
						<AddressPicker @change="AddressChange"></AddressPicker>
					</label>
					<view class="note">
						<!-- <label><text>备注：</text><textarea></textarea></label> -->
						<view class="caozuo"><button class="btn-xg"
								@click="ChangeCustomerAddress">{{ view.address_edit ? "保存" : "添加" }}</button><button
								class="btn-sc" @click="view.add_address = false">关闭</button></view>
					</view>
				</view>
			</view>
			<view class='rests'>
				<view class="h6"><text>地址</text> <button @click="AddAddress()">+ 新增地址</button></view>
				<view class="location">
					<radio-group @change="RadioChange">
						<view class="site" v-for="(i,index) in details.address"
							v-show="view.more?true:(index===1?true:false)">
							<view class="sitelist">
								<radio :value="i.ADDRID" :checked="index === details.current"></radio>
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
				<view class="more" @click="view.more = !view.more">{{ view.more?"折叠全部地址":"显示全部地址" }}
					<image style="transition: .8s all;" :class="view.more?'arrow-direction':''"
						src="../../../images/zhankaiqb-dt.png"></image>
				</view>
			</view>
			<view v-show="!view.add_address" class="map-content">
				<view style="width: 90%; height: 290px;">
					<map style="width: 100%; height: 100%;" :latitude="map.latitude" :longitude="map.longitude"
						:scale="map.scale">
					</map>
				</view>
			</view>
		</view>
		<view class="operat">
			<button class="btn btn-qx" @click="Close">取 消</button>
			<button class="btn" @click="Save">保 存</button>
		</view>
	</view>
</template>

<script>
	import _extract from '@/api/business/extract.js';
	import util from '@/utils/util.js';
	export default {
		name: "ReserveDrawer",
		props: {
			show: Boolean,
			order: {
				type: Object,
				default:() => ({})
			}
		},
		data() {
			return {
				view: {
					form: false,
					add_address: false,
					address_edit: false,
					more: false
				},
				map: {
					longitude: 114.3093413671875, //经度
					latitude: 30.570206594347283, //纬度
					scale: 12, //缩放级别
				},
				form: {
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
					address: [], //用户配送地址集合
					current: 0
				},
			}
		},
		methods: {
			Close:function(){
				this.$emit("Close");
			},
			AddAddress: function(e) {
				this.view.add_address = true; //新增地址
				this.view.address_edit = false;
				this.form.address.PHONE = this.details.info.CUSTMPHONE;
			},
			Save: function() {
				let address = this.details.info.CUSTMADDRESS,
					address_id = this.details.info.NOTE2,
					phone = "";
				console.log("[Save]选择的地址ID:", this.details.current);
				console.log("[Save]选择的地址:", this.details.address.find(util.callBind(this, function(i) {
					return i.ADDRID === this.details.current
				})));
				if (this.details.current) {
					let address_info = this.details.address.find(util.callBind(this, function(i) {
						return i.ADDRID === this.details.current
					}));
					address = address_info.ADDRESS;
					address_id = address_info.ADDRID;
					phone = address_info.PHONE;
				}
				console.log("[Save]选择的address:", address);
				console.log("[Save]选择的address_id:", address_id);
				_extract.reserveOrdersUpdate({
					khid: this.details.info.KHID,
					gsid: this.GSID,
					bill: this.details.info.BILL,
					regenerate: this.ExistsGenarate(),
					order: {
						remark: this.details.info.CUSTMCOMM,
						addr_id: address_id,
						bhid: this.details.info.STR2,
						date: this.details.info.THDATE,
						phone: this.details.info.CUSTMPHONE,
						addr: address,
						custname: this.details.info.CUSTMNAME,
						thkhid: this.details.info.thkhid
					}
				}, util.callBind(this, function(res) {
					util.simpleMsg(res.msg, res.code, res);
					if (res.code) {
						this.Close();
					}
				}));
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
			RadioChange: function(evt) {
				for (let i = 0; i < this.details.address.length; i++) {
					if (this.details.address[i].ADDRID === evt.detail.value) {
						this.details.current = this.details.address[i].ADDRID;
						console.log("[RadioChange]选择地址ID:", this.details.current);
						break;
					}
				}
			},
			AddressChange: function(data) {
				console.log("[AddressChange]地址为:", data);
				this.form.address.ADDRESS = data.address;
				this.form.address.LONGITUDE = data.adrjd; //经度
				this.form.address.LATITUDE = data.adrwd; //纬度
			},
			ChangeCustomerAddress: function() {
				_extract.ConfirmADDR(Object.assign(this.from.address, {
					ACT: this.view.address_edit ? "Edit" : "Add"
				}), util.callBind(this, function(res) {
					util.simpleMsg(res.msg, res.code, res);
					this.Newaddr = false;
					this.GetCustomerAddress(this.details.info.CUSTMPHONE, util.callBind(this, function(
						res) {
						if (!this.view.address_edit) {
							let address = this.from.address.ADDRESS
							console.log("[GetCustomerAddress-Inner]插入前的Address:", address);
							console.log("[GetCustomerAddress-Inner]Address列表:", this.details
								.address);
							let index = this.details.address.findIndex(a => a.ADDRESS ===
								address);
							console.log("[GetCustomerAddress-Inner]Address索引:", index);
							if (index != -1) this.views.current = index;
						}
					}));
				}))
			},
			StoreChange: function(data) {
				console.log("[StoreChange]被选中的门店:", data);
			},
			GetCustomerAddress: function(number, callback) {
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
					if (callback) callback(res);
				}))
			},
			QueryAddress: function() {
				console.log("查询客户地址信息...");
				this.GetCustomerAddress(this.details.info.CUSTMPHONE);
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
		},
		mounted() {
			Object.assign(this.details.info, this.order);
			console.log("[Reserve]预订单信息:", this.details.info);
			this.details.info.$THDATE = this.details.info.THDATE; //储存旧的提货时间
			this.GetCustomerAddress(this.details.info.CUSTMPHONE);
		}
	}
</script>

<style>
	.map-content {
		width: 100%;
		height: 300px;
		display: flex;
		justify-content: center;
	}
</style>
