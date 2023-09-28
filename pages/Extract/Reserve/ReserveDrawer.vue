<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/Extract/Extract.css);
</style>
<template>
	<view class="boxs">
		<view class="meminfo" style="display: flex;flex-direction: column;position: absolute;right: 0px;">
			<view class="member">
				<label>编辑预定信息</label>
				<button @click="Close">×</button>
			</view>
			<view class="middle" style="flex: 1 0px;">
				<view class="restlist">
					<label><text>收货人：</text><input type="text" v-model="details.info.CUSTMNAME" /></label>
					<label><text>联系电话：</text><input type="text" v-model="details.info.CUSTMPHONE"
							v-on:blur="QueryAddress()" /></label>
					<label>
						<text>提货日期：</text>
						<picker mode="date" fields="day" @change="ExtractDateChange">
							<view>{{ ExtractDate }}</view>
						</picker>
					</label>
					<label>
						<text>提货时间：</text>
						<picker mode="time" fields="time" start="07:01" end="22:01"
							@change="ExtractTimeChange">
							<view>{{ ExtractTime }}</view>
						</picker>
					</label>
					<!-- <label><text>提货门店：</text><input type="text" v-model="details.info.THKHID" /></label> -->
					<label><text>配送中心：</text>
						<picker @change="CenterChange" :range="distribution" range-key="SNAME">
							<view style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
								{{ details.info.STR2}}-{{ CenterName }}
							</view>
						</picker>
					</label>
					<label><text>地址：</text><input v-model="details.info.CUSTMADDRESS" :disabled="true"></input></label>
					<!-- <label><text>提货门店：</text>
						<StorePicker @change="StoreChange" :init="details.info.THKHID"
							style="height: 30px;background-color: #F5F5F5;line-height: 30px;border-radius: 2px;border: 0.5px solid #eee;width: 65%;"
							class="uni-input-input"></StorePicker>
					</label> -->
					<!-- <label><text>定金：</text><input type="text" v-model="details.info.DNET" /></label> -->
					<!-- <label><text>配送方式：</text><input type="text" v-model="details.info.THTYPE" /></label> -->
					<label><text>备注：</text><textarea v-model="details.info.CUSTMCOMM" placeholder="请勿输入表情符号等特殊字符!"></textarea></label>
				</view>
				<view class='rests' v-if="view.add_address" style="margin-bottom: 0; padding-bottom: 0;">
					<view class="h6"><text>新增地址</text></view>
					<view class="restlist">
						<label><text>收货人：</text><input type="text" v-model="form.address.NAME" /></label>
						<label><text>联系电话：</text><input type="text" v-model="form.address.PHONE" /></label>
						<label class="long" style="display: flex;padding-right: 70rpx;"><text>收货地址：</text>
							<AddressPicker @change="AddressChange" @catch="FirstAddressCatch"
								:address="form.address.ADDRESS" style="flex:1"></AddressPicker>
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
						<view>
							<!-- <view class="site" v-for="(i,index) in details.address" v-show="ShowFirstAddress(i.ADDRID)" -->
							<view class="site" v-for="(i,index) in details.address" v-show="ShowFirstAddress(i.ADDRESS)"
								@click="RadioChange(i)">
								<view class="sitelist">
									<view>
										<text>{{ i.CNAME }}，{{ i.PHONE }}</text>
										<label>{{ i.ADDRESS }}</label>
									</view>
								</view>
								<view class="caozuo"><button class="btn-xg" @click.stop="EditAddress(i)">修改</button><button
										class="btn-sc" @click.stop="DeleteAddress(i.ADDRID,i.PHONE)">删除</button></view>
							</view>
						</view>
					</view>
					<view class="more" @click="view.more = !view.more">{{ view.more?"折叠全部地址":"显示全部地址" }}
						<image style="transition: .8s all;" :class="view.more?'arrow-direction':''"
							src="../../../images/zhankaiqb-dt.png"></image>
					</view>
				</view>
				<view v-show="!view.add_address && !view.more" class="map-content">
					<view style="width: 90%; height: 290px;">
						<map style="width: 100%; height: 100%;" :key="map.key" :latitude="details.info.LATITUDE"
							:longitude="details.info.LONGITUDE" :scale="map.scale" :markers="map.markers"
							:enable-poi="false">
						</map>
					</view>
				</view>
			</view>
			<view class="operat" style="display: flex;padding: 8px;gap: 8px;">
				<button class="btn btn-qx" @click="Close">取 消</button>
				<button class="btn" @click="Save">保 存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import _extract from '@/api/business/extract.js';
	import {
		MatchDeliveryCenter
	} from '@/bll/Common/bll.js'
	import util from '@/utils/util.js';
	import cx from '@/utils/cx/cxCount.js';
	import {
		resolve
	} from 'path';
	export default {
		name: "ReserveDrawer",
		props: {
			order: {
				type: Object,
				default: () => ({})
			}
		},
		computed: {
			CenterName: function() {
				return this.distribution.find(i => i.KHID === this.details.info.STR2)?.SNAME;
			},
			ExtractDate: function() {
				return this.details.info.THDATE.split(' ')?.first();
			},
			ExtractTime: function() {
				return this.details.info.THDATE.split(' ')?.last();
			},

			ShowFirstAddress: function() {
				return util.callBind(this, function(address_id) {
					return this.view.more ? true : (address_id === this.details.current);
				})
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
					longitude: util.getStorage('StoreCoodinate').longitude ?? 114.3093413671875, //经度
					latitude: util.getStorage('StoreCoodinate').latitude ?? 30.570206594347283, //纬度
					scale: 12, //缩放级别
					markers: [],
					key: Number(new Date())
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
					},
					catch: null
				},
				distribution: [],
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
						CUSTMADDRESS: "",
						LATITUDE: "", //纬度
						LONGITUDE: "", //经度
						STR2: "",
					}, //主单数据（商品集合中共有的部分，如买家的信息）
					address: [], //用户配送地址集合
					current: 0
				},
			}
		},
		methods: {
			Close: function() {
				console.log("[Close]关闭编辑...");
				this.$emit("Close");
			},
			ExtractDateChange: function(date) {
				this.details.info.THDATE = date.detail.value + " " + this.ExtractTime;
			},
			ExtractTimeChange: function(e) {
				let time = e.detail.value;
				if (!time) {
					time = "00:00";
				}
				if (time.indexOf(':') == 0) {
					time = "00" + time;
				}
				if (time.indexOf(':') < 0) {
					time = time + ":00";
				}
				this.details.info.THDATE = this.ExtractDate + " " + time;
			},
			AddAddress: function(e) {
				this.view.add_address = true; //新增地址
				this.view.address_edit = false;
				this.form.address.PHONE = this.details.info.CUSTMPHONE;
				this.form.address.NAME = this.details.info.CUSTMNAME;
			},
			GetDistributionCenter: function() { //获取配送中心
				_extract.GetPSCenter(this.GSID, this.KHID, util.callBind(this, function(r) {
					console.log("[GetDistributionCenter]配送中心...", r);
					if (r.msg.length > 0) {
						this.distribution = r.msg;
					}
				}))
			},
			CenterChange: function(e) {
				this.details.info.STR2 = this.distribution[e.detail.value]?.KHID;
				util.hidePropety(this.details.info, '_STR2');
			},
			Save: function() {
				console.log("[Save]选择的地址:", this.details.current);
				if (this.ValidFromData())
					_extract.reserveOrdersUpdate({
						khid: this.details.info.KHID,
						gsid: this.GSID,
						bill: this.details.info.BILL,
						regenerate: this.ExistsGenarate(),
						order: {
							remark: this.details.info.CUSTMCOMM,
							addr_id: this.details.current,
							bhid: this.details.info.STR2,
							date: this.details.info.THDATE,
							phone: this.details.info.CUSTMPHONE,
							addr: this.details.current,
							custname: this.details.info.CUSTMNAME,
							thkhid: this.details.info.thkhid
						}
					}, util.callBind(this, function(res) {
						console.log("[Save]保存成功:", res);
						util.simpleMsg(res.msg, res.code, res);
						if (res.code) {
							this.Close();
						}
					}));
				else
					console.log("[Save]信息验证失败...");
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
			RadioChange: function(address_info) {
				this.details.current = address_info.ADDRESS;
				this.details.info.CUSTMADDRESS = address_info.ADDRESS;
				this.details.info.NOTE2 = address_info.ADDRID;
				console.log("[RadioChange]选择地址:", address_info);
				if (address_info.LONGITUDE && address_info.LATITUDE) {
					this.map.markers.pop();
					this.details.info.LATITUDE = address_info.LATITUDE;
					this.details.info.LONGITUDE = address_info.LONGITUDE;
					this.map.markers.push({
						id: 'client',
						latitude: address_info.LATITUDE,
						longitude: address_info.LONGITUDE,
						title: '配送地址',
						callout: {
							content: '收货地址',
							color: 'red',
							display: 'ALWAYS'
						}
					})
					this.key = Number(new Date());
				}
				console.log("[RadioChange]标点更新...", address_info);
			},
			FirstAddressCatch: function(address_info) { //缓存首个地址信息
				console.log("[FirstAddressCatch]已获取首个地址缓存信息:", address_info);
				this.form.catch = address_info;
			},
			AddressChange: function(data) {
				console.log("[AddressChange]地址为:", data);
				this.form.address.ADDRESS = data.address;
				this.form.address.LONGITUDE = data.adrjd; //经度
				this.form.address.LATITUDE = data.adrwd; //纬度
			},
			AddressVaild: async function() {
				if (!this.form.address.NAME) {
					util.simpleMsg("收货人不能为空!", 'none');
					return false;
				}
				if (!this.form.address.LONGITUDE && !this.form.address.LATITUDE) { //如果经纬度为空
					console.log("[AddressVaild]检测到经纬度为空,自动采用缓存地址信息:", this.form.catch);
					if (!this.form.catch || !this.form.catch.adrjd && !this.form.catch.adrwd) { //可能是未获取到经纬度信息
						this.form.catch = await new Promise(util.callBind(this, function(resolve, reject) {
							let overtimer = null;
							uni.$once('catch', util.callBind(this, function(catch_info) { //监听缓存数据获取
								console.log("[AddressVaild]已获取到查询缓存信息:", catch_info);
								if (overtimer != null) clearTimeout(overtimer); //避免失败通知
								resolve(catch_info);
							}));
							overtimer = setTimeout(util.callBind(this, function() {
								console.log("[AddressVaild]获取缓存信息超时...");
								resolve(null);
							}), 5000);
						}));
					}
					console.log("[AddressVaild]获取到的缓存信息:", this.form.catch);
					if (!this.form.catch) {
						util.simpleMsg("未能获取地址信息!", true)
						console.log("[AddressVaild]未能获取到地址详细信息!");
						return false;
					};
					this.form.address.ADDRESS = this.form.catch.address ?? this.form.catch.address;
					this.form.address.LONGITUDE = this.form.catch.adrjd;
					this.form.address.LATITUDE = this.form.catch.adrwd;
					console.log("[AddressVaild]现有地址信息:", this.form.address);
				}
				return true;
			},
			EditAddress: function(address) {
				this.view.address_edit = true;
				this.view.add_address = true;
				Object.assign(this.form.address, address);
			},
			ChangeCustomerAddress: async function() {
				if (await this.AddressVaild())
					_extract.ConfirmADDR(Object.assign(this.form.address, {
						ACT: this.view.address_edit ? "Edit" : "Add"
					}), util.callBind(this, function(res) {
						console.log("[ChangeCustomerAddress]ConfirmADDR回调:", res);
						util.simpleMsg(res.msg, res.code, res);
						this.Newaddr = false;
						this.GetCustomerAddress(this.details.info.CUSTMPHONE, util.callBind(this, function(
							res) {
							if (!this.view.address_edit) {
								let address = this.form.address.ADDRESS
								console.log("[GetCustomerAddress-Inner]插入前的Address:", address);
								console.log("[GetCustomerAddress-Inner]Address列表:", this.details
									.address);
								let address_info = this.details.address.find(a => a.ADDRESS ===
									address);
								console.log("[GetCustomerAddress-Inner]Address信息:", address_info);
								if (address_info) {
									this.RadioChange(address_info);
									this.details.info.CUSTMNAME = this.form.address.NAME;
									this.details.info.CUSTMPHONE = this.form.address.PHONE;
								}
								this.view.more = false;
								this.view.add_address = false;
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
						console.log("[GetCustomerAddress]用户电话地址：", res);
						console.log("[GetCustomerAddress]用户电话地址列表：", this.details.address);
						this.details.address = JSON.parse(res.data);
					} else {
						util.simpleMsg(res.msg, true, res);
						this.details.address = [];
					}
					if (callback) callback(res);
				}))
			},
			QueryAddress: function() {
				console.log("[QueryAddress]查询客户地址信息...");
				this.GetCustomerAddress(this.details.info.CUSTMPHONE, util.callBind(this, function() {
					console.log("[QueryAddress]自动展开地址列表...");
					this.view.more = true; //自动展开地址栏
				}));
			},
			ValidFromData: function() {
				let order = this.details.info;
				let code = order.THTYPE.split('-')[0];
				if (!order.THKHID) {
					util.simpleMsg("提货门店为空", true);
					return false;
				}
				if (order.THTYPE != '1' && new Date(order.THDATE.replace(/-/g, "/")) < new Date()) {
					util.simpleMsg("提货时间早于当前", 'none');
					return false;
				}

				if (order.THTYPE == '1') {
					let hour = new Date(order.THDATE.replace(/-/g, "/")).getHours(); //提货时间的小时部分
					if (hour < 7 || hour > 19) {
						util.simpleMsg("提货时间不在7到19点", 'none');
						return false;
					}
					if (new Date(order.THDATE.replace(/-/g, "/")) < new Date().setHours(new Date().getHours() +
							1)) {
						util.simpleMsg("提货时间小于一小时内", 'none');
						return false;
					}
				}
				if (order.THTYPE == '2') { //现卖限制时间不能早于当前和19点以后
					if (new Date(order.THDATE.replace(/-/g, "/")) < new Date()) {
						util.simpleMsg("提货时间小于当前时间", 'none');
						return false;
					}
					if (new Date(order.THDATE.replace(/-/g, "/")) > new Date().setHours(19)) {
						util.simpleMsg("提货时间晚于19点", 'none');
						return false;
					}
				}
				if (!order.CUSTMPHONE) {
					util.simpleMsg("联系电话为空", true);
					return false;
				}
				if (order.THTYPE == '1' || order.THTYPE == '2') {
					if (!order.CUSTMADDRESS) {
						util.simpleMsg("配送地址为空", true);
						return false;
					}
				}
				if (order.CUSTMCOMM && util.isEmojiCharacter(order.CUSTMCOMM)) {
					util.simpleMsg("备注不允许输入表情符号等特殊字符", true);
					return false;
				}
				return true;
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
			CheckAlsoSetLongitudeAndLatitude: function(order) { //检查经纬度，如果不存在设置默认
				if (order.LONGITUDE && order.LATITUDE) {
					this.map.markers.push({
						id: 'client',
						latitude: order.LATITUDE,
						longitude: order.LONGITUDE,
						title: '配送地址',
						callout: {
							content: '收货地址',
							color: 'red',
							display: 'ALWAYS'
						}
					})
				}
				if (!order.LONGITUDE) order.LONGITUDE = this.map.longitude;
				if (!order.LATITUDE) order.LATITUDE = this.map.latitude;
			}
		},
		mounted() {
			Object.assign(this.details.info, this.order);
			console.log("[Extract-Reserve]预订单修改信息:", this.details.info);
			this.details.current = this.details.info.CUSTMADDRESS
			console.log("[Extract-Reserve]预定提取地址ID:", this.details.current);
			this.details.info.$THDATE = this.details.info.THDATE; //储存旧的提货时间
			this.CheckAlsoSetLongitudeAndLatitude(this.details.info); //检查和设置经纬度
			this.GetCustomerAddress(this.details.info.CUSTMPHONE); //获取客户的地址信息
			this.GetDistributionCenter(); //获取配送中心
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
