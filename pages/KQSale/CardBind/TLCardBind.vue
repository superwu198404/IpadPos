<template>
	<view class="bind-card-container">
		<h3 class="bind-card-title">绑卡信息</h3>
		<view class="bind-card-form">
			<view class="form-item-block">
				<view class="form-item-tips">第一步<span class="title-gap">-</span><b>输入会员信息</b>:</view>
				<view class="form-item-input">
					<view class="input-border-radius">
						<view class="form-item-input-left">
							<image src="@/images/img2/zhifucx-cu.png" mode="widthFix" style="width: 20px;"></image>|
							<input placeholder="输入手机号或账户" v-model="form.member_code" />
						</view>
						<view class="comfirm-btn" @click="search_member">确定</view>
					</view>
				</view>
			</view>
			<view class="info-content menber-infos">
				<view class="menber-info">
					<view class="menber-info-head">
						<view class="menber-headshots">
							<image src="@/icon/KENGEE-180.png" mode="widthFix" style="width: 80rpx;height: 80rpx;"></image>
						</view>
						<view class="member-details">
							<view class="member-id">ID {{ source.member_infos.hyId || '暂无' }}</view>
							<view class="member-details-infos">
								
							</view>
						</view>
					</view>
					<view class="gray-text" style="font-size: 1.1em;">
						<label>姓名:{{ source.member_infos.Name || source.member_infos.Phone || '暂无' }}</label>
						<label>电话:{{ source.member_infos.Phone || '暂无' }}</label>
						<label>注册时间:{{ source.member_infos.RegisterDay ? (date_convert(source.member_infos.RegisterDay) || '暂无') : '暂无' }}</label>
						
					</view>
				</view>
				<view class="store-infos gray-text">
					<view class="info-data-row">
						<view>门店编号:{{ KHID }}</view>
						<view>注册门店:{{ NAME }}</view>
					</view>
					<view class="info-data-row">
						<view>员工编号:{{ RYID }}</view>
						<view>员工姓名:{{ RYNAME }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bind-card-form">
			<view class="form-item-block">
				<view class="form-item-tips">第二步<span class="title-gap">-</span><b>输入待绑定卡号</b>:</view>
				<view class="form-item-input">
					<view class="input-border-radius">
						<view class="form-item-input-left">
							<image src="@/images/img2/swiping_card.png" mode="widthFix" style="width: 20px;"
								@click="swipe_card"></image>|
							<input placeholder="请刷卡以获取卡信息" v-model="form.card_number" disabled="true"/>
							<!-- <input placeholder="请刷卡以获取卡信息" v-model="form.card_number" /> -->
						</view>
						<view class="comfirm-btn" @click="search_card">确定</view>
					</view>
				</view>
			</view>
			<view class="info-content card-infos">
				<view class="card-info-head">
					<view>{{ source.card_infos.cardName || "暂无" }}</view>
					<view>￥{{ source.card_infos.amount || "暂无" }}</view>
				</view>
				<view class="card-details">
					<view class="info-data-row">
						<view>类型名称:{{ source.card_infos.cardType || "暂无" }}</view>
					</view>
					<view class="info-data-row">
						<view>卡号:{{ source.card_infos.cardNum || "暂无" }}</view>
					</view>
				</view>
				<view class="card-valid-date">
					<em></em>
					<text>有效期至:{{ source.card_infos.expireDate || "暂无" }}</text>
				</view>
			</view>
		</view>
		<view class="bind-card-footer">
			<view>
				<em></em>
				<label>绑定账户：<text>{{ source.member_infos.hyId || '暂无' }}</text></label>
				<label>绑定卡号：<text>{{ source.card_infos.cardNum || "暂无" }}</text></label>
			</view>
			<button class="btn" @click="comfirm_card_bind">确认绑定</button>
			<!-- <button class="btn" style="margin-left: 10px;" @click="to_printer">打印格式</button> -->
		</view>
	</view>
</template>

<script>
	import card_bind from '@/api/business/card_bind.js';
	import common from '@/api/common.js';
	import util from '@/utils/util.js';
	var $;
	export default {
		mixins: [card_bind],
		data() {
			return {
				form: {
					member_code: "", //18572113861
					card_number: "", //8661087110000744418=99125008620000
					card_track: ""
				},
				source: {
					member_infos: {
						hyId: "",
						Name: "",
						Phone: "",
						RegisterDay: ""
					},
					card_infos: {
						amount: 0,
						cardType: '',
						cardNum: '',
						expireDate: ''
					}
				}
			}
		},
		watch: {
			'source.member_infos': function(n, o) {
				console.log("会员信息发生变化：", n);
				if (this.source.member_infos.hyId != "" || this.source.card_infos.cardNum != "") {
					uni.$emit("BindChange", 1); //通知父组件已录入数据
				} else {
					uni.$emit("BindChange", 0);
				}
			},
			'source.card_infos': function(n, o) {
				console.log("卡信息发生变化：", n);
				if (this.source.member_infos.hyId != "" || this.source.card_infos.cardNum != "") {
					uni.$emit("BindChange", 1); //通知父组件已录入数据
				} else {
					uni.$emit("BindChange", 0);
				}
			}
		},
		computed: {
			date_convert() {
				return $(function(date) {
					return util.convertShortDate(date);
				})
			}
		},
		methods: {
			async search_member() {

				if (common.CheckSign()) {
					console.log("[SearchMember]会员信息查询...");
					let data = await this.search_member_infos(this.form.member_code);
					console.log("[SearchMember]会员信息:", data);
					if (data) {
						this.source.member_infos = data;
						util.simpleMsg('会员信息查询成功!', false);
						// uni.$emit("BindChange",1);//通知父组件已录入数据
					} else {
						util.simpleMsg('未查询到相关信息!', true);
					}
				}
			},
			async search_card() {
				if (common.CheckSign()) {
					console.log("[SearchMember]卡信息查询...");
					let data = await this.search_card_infos(this.form.card_number.slice(3, 19));
					this.form.card_track = this.form.card_number;
					console.log("[SearchMember]卡信息:", data);
					if (data) {
						this.source.card_infos = data;
						util.simpleMsg('卡信息查询成功!', false);
						// uni.$emit("BindChange",1);//通知父组件已录入数据
					} else {
						util.simpleMsg('未查询到相关信息!', true);
					}
				}
			},
			async comfirm_card_bind() {
				if (!this.source.card_infos.cardNum || !this.form.card_track)
					util.simpleMsg("请刷卡后再进行此操作!");
				if (!this.source.member_infos.hyId)
					util.simpleMsg("请录入会员信息后再进行此操作!");
				let result = await common.SimpleAPIRequest({
					class: "CardSaleCLASS",
					method: "MemberBindCard",
					data: {
						store_num: this.KHID,
						store_name: this.NAME,
						employ_num: this.RYID,
						employ_name: this.RYNAME,
						member_num: this.source.member_infos.hyId,
						card_num: this.source.card_infos.cardNum,
						card_track: this.form.card_track
					}
				})
				console.log("[ComfirmCardBind]卡绑定结果:", result);
				if (result.code) {
					util.simpleMsg(result.msg, false);

				} else {
					util.simpleMsg(result.msg, true);
				}
			},
			async swipe_card() {
				if (common.CheckSign()) {
					let data = await this.get_swipe_card();
					console.log("[SwipeCard]获取的卡信息:", data);
					if (data.code) {
						this.form.card_track = data.data.track_info;
						this.form.card_number = data.data.card_no;
						util.simpleMsg('卡信息查询成功!', false);
					} else {
						util.simpleMsg(data.msg, true);
					}
				}
			},
			reset_form() {
				this.form = this.$options.data().form;
				this.source = this.$options.data().source;
			}
		},
		created() {
			$ = util.callContainer(this);
			uni.$on("ReturnSale", $(function() {
				util.simpleModal('提示', '确定清除当前信息吗?', $(function(is_confirm) {
					if (is_confirm)
						this.reset_form();
				}))
			}))
		},
		destroyed() {
			uni.$off("ReturnSale");
		}
	}
</script>

<style>
	.bind-card-container {
		padding: 10px 15px;
		height: 100%;
		box-sizing: border-box;
	}

	.bind-card-title {
		color: #066e49;
		padding: 6px 0px;
	}

	.bind-card-form {
		display: inline-flex;
		flex-direction: column;
		width: 50%;
		gap: 15px;
	}

	.bind-card-infos {
		display: flex;
		justify-content: space-between;
	}

	.info-content {
		height: 483rpx;
		width: 856rpx;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.info-between {
		justify-content: space-between;
	}

	.menber-infos {
		border: 2px solid #c4e6c8;
		box-shadow: 0px 0px 10px -1px #c4e6c8;
		background-image: url('@/images/jsd-hybj.png');
		justify-content: space-between;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
	}

	.menber-info,
	.store-infos {
		padding: 0px 15px;
	}

	.menber-info {
		display: flex;
		flex-direction: column;
		gap: 25px;
		box-sizing: border-box;
		padding-top: 15px;
		padding-bottom: 15px;
		flex: 1;
	}

	.menber-info-head {
		display: flex;
		gap: 10px;
	}

	.member-id {
		font-weight: 600;
		font-size: 1.4em;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.member-id::before {
		content: "V";
		display: inline-flex;
		font-size: 0.6em !important;
		background-color: #40b04d;
		border-radius: 50%;
		width: 1rem;
		height: 1rem;
		color: white;
		justify-content: center;
		align-items: center;
		padding: 2px;
		font-family: fangsong;
	}

	.member-details {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
	}

	.member-details-infos {
		display: flex;
		color: #40b04d;
		gap: 10rpx
	}

	.info-data-row {
		display: flex;
		gap: 15px;
		padding: 5rpx 0rpx;
	}

	.info-data-row>* {
		width: 50%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.card-infos {
		background-image: url('@/images/img2/kaqchaxun2.png');
		padding: 20px 20px;
		box-sizing: border-box;
		position: relative;
	}

	.store-infos {
		background-color: #f0f8f0;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}

	.comfirm-btn {
		background-color: #40b04d;
		color: white;
		padding: 4px 8px;
	}

	.form-item-tips {
		color: #006a44;
	}

	.form-item-input {
		display: flex;
		border-radius: 5px;
	}

	.form-item-input-left {
		display: flex;
		background-color: #f1f5f5;
		border-right: 0px;
		align-items: center;
		border-radius: 5px;
		color: #bbd6cc;
		padding: 2px 2px;
		gap: 5px;
	}

	.form-item-block {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.menber-headshots {
		border-radius: 5px;
		overflow: hidden;
		display: inline-block;
	}

	.input-border-radius {
		display: inline-flex;
		border-radius: 5px;
		overflow: hidden;
	}

	.gray-text {
		color: darkgray;
	}
	.gray-text label{
		width:49%;
		display: inline-block;
	}
	.card-info-head {
		display: flex;
		justify-content: space-between;
		font-size: 1.4em;
		font-weight: 600;
		color: #006a44;
		height: 2em;
	}

	.card-info-head:first-child {
		position: relative;
	}

	.card-info-head:first-child::before {
		content: "";
		display: block;
		border-top: 4px solid #006a44;
		width: 2em;
		bottom: 0px;
		position: absolute;
	}

	.card-valid-date {
		position: absolute;
		bottom: 0px;
		color: white;
		height: 120rpx;
		line-height: 120rpx;
		width:94%;
		left: 0;		
		padding:0 3%;
	}
	.card-valid-date em{
		position: absolute;
		bottom: 0px;
		background: linear-gradient(90deg, #006B44 0%, #FFFFFF 100%);
		height: 120rpx;
		width:100%;
		left: 0;
		z-index: 1;
		border-radius: 0 0 24rpx 24rpx;
		opacity: 0.8;
	}
	.card-valid-date text{
		position: relative;
		z-index: 4;
	}
	.card-details {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px 5px;
	}

	.bind-card-footer {
		position: absolute;
		bottom: 0px;
		left: 0px;
		height: 80rpx;
		background: linear-gradient(90deg, #DDFCDF 0%, #FFFFFF 100%);
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.bind-card-footer>.btn {
		font-size: 24rpx;
		height: 100%;
		line-height: 50rpx;
		padding: 0;
		width: 340rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bind-card-footer view {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		width: 90%;
	}

	.bind-card-footer view em {
		display: inline-block;
		margin: 0 16rpx 0 40rpx;
		width: 8rpx;
		height: 48rpx;
		background: #42B14B;
		border-radius: 12rpx;
	}

	.bind-card-footer view label {
		margin-right: 40rpx;
		display: flex;
		align-items: center;
	}

	.bind-card-footer view label text {
		font-weight: 700;
		font-size: 34rpx;
	}

	.bind-card-footer button {
		width: 340rpx;
		border-radius: 10rpx 0 10rpx 10rpx;
		height: 100%;
		line-height: 80rpx;
		padding: 0;
		font-size: 32rpx;
	}

	.title-gap {
		padding: 0px 5px;
	}
</style>
