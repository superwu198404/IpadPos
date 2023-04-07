<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
<!-- 		<PrinterPage ref="printerPage" style="display: none;" /> -->
		<view class="right">
			<!-- 顶部导航栏 :custom.sync="view.big_customer" :_ynDKF='view.enable_customer'>-->
			<Head :_ynDKF="false" :custom="false" :_showSale="true" :_ynMsg='false'> </Head>
			<view class="prolist">
				<view class="hh" style="padding-right:3.7%;">
					<view class="hotcakes">
						<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 卡券信息查询
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
				</view>
				<view class="commodity">
					<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
					<view class="number">
						<view class="labnum">
							<text>卡/券类型：</text>
							<view class="chaxun">
								<view class="chanxz">
									<label v-for="(type_info,index) in source.types"
										:class="source.current_type_info == type_info ? 'curr' : ''"
										v-show="hide_type_condition(index)"
										@click="select_type(type_info)">{{ type_info.text }} 
										<em>✓</em>
									</label>						
									<label class="quanbu" v-if="show_types_limit">
										<span @click="switch_types">{{ view.open ? '收起' : '全部' }} <image :class="view.open ? 'close-types' : ''" src="@/images/img2/zhankaiiii.png"></image></span>
									</label>
								</view>
							</view>
						</view>
						<view class="labnum">
							<text>卡号：</text>
							<view class="chaxun">
							<view class="label">
								<image v-if="!scan_code_icon" src="@/images/img2/swiping_card.png" mode="widthFix" @click="swiping_card()">
								<image v-else src="@/images/img2/zhifucx-cu.png" mode="widthFix" @click="scan_code_handle()">
								<input type="text" placeholder="请输入查询卡号" v-model="form.number"/>
								<button v-if="form.number" @click="form.number=''" style="margin-right: 5px;">×</button>
							</view>
							<button class="btn" @click="according_to_type_search">查询</button>
							</view>
						</view>	
					</view>
					<view class="partics">
						<view class="cardqs">
							<view class="cardlist">
								<view class="ulli">
									<view class="touch-list list-touch">
										<image class="bgs" style="position: absolute;top: 0px;" src="@/images/img2/kaqchaxun.png" mode="widthFix"></image>
										<view class="h6">
											<label><em></em>{{ default_view(form.infos.type_name,'暂无') }}</label>											
										</view>
										<view class="denominat" v-if="form.infos.show_balance">
											<label>￥<text>{{ default_view(form.infos.balance, 0) }}</text></label>
										</view>
										<view class="cardinfo">
											<view class="leftinfo">
												<view class="card-num">											
													<label>券号：{{ default_view(form.infos.card_id,'暂无') }}</label>
													<view><em>●</em>{{ default_view(source.current_type_info ? source.current_type_info.text : '') }}</view>
												</view>
											</view>
											<!-- <view class="denominat">
												<label>￥<text>{{ default_view(form.infos.balance) }}</text></label>
												<text>（满38元使用）</text>
											</view> -->
										</view>
										<view class="statistic">
											<text :class="form.infos.valid_date ? '' : 'hidden'">有效期至：{{ default_view(form.infos.valid_date,'') }}</text>
											<text :class="form.infos.status ? '' : 'hidden'">{{ default_view(form.infos.status,'') }}</text>
										</view>
									</view>
									<view class="touch-list list-delete" @click="RemoveSP(item)">
										<image src="@/images/img2/ka-shanchu.png" mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
						<view class="carddet">
							<view class="totals">
								<view>
									<em></em>
									<label>卡号：<text>{{ default_view(form.infos.card_id,'暂无') }}</text></label>
								</view>
								<button v-if="form.infos.status" class="btn btn-qx">{{ default_view(form.infos.status,'') }}</button>
							</view>
							<view class="kainfolist">
								<label v-if="form.infos.is_customer_emotional_coupon">
									<text>是否客情券：</text><text>{{ default_view(form.infos.is_customer_emotional_coupon) }}</text>
								</label>
								<label v-if="form.infos.is_customer_complaint_coupon">
									<text>是否客诉赠券：</text><text>{{ default_view(form.infos.is_customer_complaint_coupon) }}</text>
								</label>
								<label v-if="form.infos.apply">
									<text>申领人：</text><text>{{ default_view(form.infos.apply) }}</text>
								</label>
								<label v-if="form.infos.sale_store_name">
									<text>售卖门店：</text><text>{{ default_view(form.infos.sale_store_name) }}</text>
								</label>
								<label v-if="form.infos.sale_date">
									<text>售出时间：</text><text>{{ default_view(form.infos.sale_date) }}</text>
								</label>
								<label v-if="form.infos.use_date">
									<text>使用时间：</text><text>{{ default_view(form.infos.use_date) }}</text>
								</label>
								<label v-if="form.infos.use_store_name">
									<text>使用门店：</text><text>{{ default_view(form.infos.use_store_name) }}</text>
								</label>
								<label v-if="form.infos.spend_amount">
									<text>消费金额：</text><text>￥{{ default_view(form.infos.spend_amount, 0) }}</text>
								</label>
								<label v-if="form.infos.operator">
									<text>操作员：</text><text>{{ default_view(form.infos.operator) }}</text>
								</label>
								<label v-if="show_not_more_infos">
									暂无更多信息...
								</label>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//基础组件
	import Head from '@/pages/Home/Component/Head.vue';
	
	//业务处理
	import bussiness from '@/api/business/card_coupon_query.js';
	import util from '@/utils/util.js';
	import member from "@/api/hy/MemberInterfaces.js";
	import common from '@/api/common.js';
	var $;
	export default {
		name: "Cardquery",
		components: {
			Head
		},
		computed:{
			default_view(){
				return $(function(v, def_val = '暂无更多信息...'){
					if(v)
						if(v == 'Y'){
							return '是';
						}
						else if(v == 'N'){
							return '否'
						}
						else
							return v;
					else
						return def_val;
				});
			},
			hide_type_condition(){
				return $(function(index){
					return this.view.open || index <= 4 ? true : false;
				})
			},
			scan_code_icon(){
				return (this.source.current_type_info?.scan_code || this.source.current_type_info == null) ? true : false;
			},
			show_not_more_infos(){
				let infos = this.form.infos;
				if(!infos.apply || !infos.sale_store_name || !infos.form.infos.sale_date || !infos.use_date || !infos.use_store_name || !infos.form.infos.operator)
					return true;
				else
					return false;
			},
			show_types_limit(){
				return this.source.types.length > 5;
			}
		},
		data() {
			return {
				form:{
					number: '',
					infos: bussiness.infos()
				},
				source:{
					current_type_info: null,
					types: [],
				},
				view:{
					open: true
				}
			}
		},
		methods: {
			switch_types(){
				this.view.open = !this.view.open;
			},
			select_type(data) {
				if (common.CheckSign()) {
					this.source.current_type_info = data;
					console.log("[SelectType]选择卡券类型:", this.source.current_type_info);
					this.form = this.$options.data().form;
				}
			},
			scan_code_handle(){
				uni.scanCode({
					success: $(function(result) {
						this.form.number = result.result;
						this.according_to_type_search();
					})
				})
			},
			swiping_card(){
				member.GetTLCard(getApp().globalData.store, $(function(res){
					if (!res.code) {
						util.simpleMsg(res.msg, !res.code);
						return;
					}
					this.form.number = res.data;
					this.according_to_type_search();
				}))
			},
			async according_to_type_search(){
				if(this.source.current_type_info){
					let result = await this.source.current_type_info.search(this.form.number);
					console.log("[TypeSearch]查询结果:", result);
					if(result.code){
						this.form.infos = result.data;
					}
					else{
						this.form.infos =bussiness.infos();
						util.simpleMsg(result.msg);
					}
				}
				else{
					util.simpleMsg('请选择类型后再进行此操作!');
				}
			},
			async get_types(){
				return await bussiness.get_types();
			},
			monitor(){
				uni.$on('ReturnSale',$(function(){
					console.log('[EventMonitor]表单信息清空...');
					util.simpleModal("提示", "是否确认清空当前数据？", $(function(res) {
						if (res) {
							this.form = this.$options.data().form;
							uni.$emit('set-dkf', "默认大客户"); //通知外部 恢复默认大客户
						}
					}))
				}))
			},
			init(){
				if(this.source.types.length)
					this.source.current_type_info = this.source.types[0];
			}
		},
		async created() {
			$ = util.callContainer(this);
			this.source.types = await this.get_types();
			this.init();
			this.monitor();
		},
		destroyed() {
			uni.$off('ReturnSale');
		}
	}
</script>

<style>
	.commodity .number{
		padding: 0;
		width:100%;
		display: flex;
	}
	.chaxun{
		display: flex;
		align-items: center;
	}
	.commodity .number .labnum{
		margin:1% 0 2%;
		display: flex;
		flex-direction: column;
		height: auto;
		width:46%;
	}
	.commodity .number button{
		width: 25%;
		height: 70rpx;
		line-height: 70rpx;
		margin:0 0 0 20rpx;
	}
	.commodity .number{
		display: flex;
	}
	.commodity .totals view label{
		font-size: 32rpx;
		font-weight: 700;
		color: #333;
		padding-left: 2%;
		white-space: nowrap;
	}
	.totals view em{
		height: 40rpx;
		margin:0 8rpx 0 30rpx;
	}
	.cardlist{
		box-shadow: 0px 10px 30px 1px rgba(66,177,75,0.16);
		position: relative;
		padding:0;
	}
	
	.cardlist .ulli{
		width:100%;
		margin:0;			
	}
	.cardlist .ulli .h6{
		background: none;
		padding:2% 2% 0;
		height: 120rpx;
		width:70%;
		/* overflow: hidden; */
	}
	.cardlist .ulli .h6 label{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		position: relative;
		font-size: 46rpx;
		color: #006B44;
		height: 120rpx;
		line-height: 60rpx;
	}
	.cardlist .ulli .h6 em{
		display: block;
		width:68rpx;
		height: 6rpx;
		position: absolute;
		bottom:20rpx;
		left:8%;
		z-index: 6;
		border-radius: 6rpx;
		background-color: #006B44;
	}
	.cardlist .touch-list{
		padding:6% 0 0;
	}
	.ulli .card-num{
		border-bottom: none;
	}
	.ulli .card-num view{
		color: #42B14B;
		font-size: 30rpx;
		padding-left: 4%;
		padding-top:14rpx;
	}
	.ulli .card-num label{
		padding:0;
	}
	.cardinfo{
		padding:6% 4% 1%;
		transform: translateY(-60rpx);
	}
	.statistic{
		padding:3% 3%;
		justify-content: space-between;
		color: #fff;
		transform: translateY(15rpx);
	}
	.statistic text:nth-child(2){
		background-color: #FFE8E4;
		color: #FE694B;
		font-size: 26rpx;
		padding:4rpx 10rpx;
	}
	.labnum text{
		line-height: 90rpx;
		color: #333;
	}
	.chanxz{
		width:85%;
		padding:0 15% 0 0;
		position: relative;
		overflow: hidden;
	}
	.chanxz label{
		height: 70rpx;
		width: 17.5%;
		font-size: 26rpx;
	}

	.chanxz .quanbu{
		/* calc(20% - 46rpx) */
		width:94rpx;
		position: absolute;
		top:0rpx;
		right:6%;
		font-size: 18rpx;
		color: #42B14B;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.quanbu * {
		transition: .5s all;
	}
	.chanxz .quanbu span{
		display: block;
		width:100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.chanxz .quanbu image {
		width: 14rpx;
		height: 14rpx;
		margin-left: 6rpx;
	}

	.label picker{
		width: 100%;
		height: 100%;
		border-radius: 5px;
		background: #F5F5F5;
	}
	
	.picker{
		width: 100%;
		height: 100%;
	}
	
	.hidden {
		visibility: hidden;
	}
	
	.chanxz .uni-label-pointer{
		flex:0 0 0.2;
	}
	
	.close-types {
		transform: rotate(180deg)
	}
</style>