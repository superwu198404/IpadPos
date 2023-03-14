<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/card.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<PrinterPage ref="printerPage" style="display: none;" />
		<!-- <Pagekq></Pagekq> -->
		<view class="right">
			<!-- 顶部导航栏 :custom.sync="view.big_customer" :_ynDKF='view.enable_customer'>-->
			<Head> </Head>
			<view class="prolist">
				<view class="hh" style="padding-right:3.7%;">
					<view class="hotcakes">
						<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 卡务操作
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
				</view>
				<view class="commodity">
					<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
					<!-- <view class="typeoper">
						<label><button>卡延期</button><image src="@/images/img2/danju.png" mode="widthFix"></image></label>
					</view> -->
					<view class="number">
						<view class="labnum">
							<text>卡/券类型：</text>
							<view class="chaxun">
								<view class="chanxz">
									<label class="curr">卡延期 <em>✓</em></label>
									<label>卡挂失 <em>✓</em></label>
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
							</view>
							<button class="btn" @click="according_to_type_search">查询</button>
							</view>
						</view>	
					</view>
					 <!-- v-if="form.infos && form.infos.card_id" -->
					<view class="partics">
						<view class="cardqs">
							<view class="cardlist">
								<view class="ulli" style="height: 483rpx;">
									<view class="touch-list list-touch">
										<image class="bgs" style="position: absolute;top: 0px;" src="@/images/img2/kaqchaxun.png" mode="widthFix"></image>
										<view class="h6">
											<label><em></em>{{ default_view(form.infos.type_name) }}</label>											
										</view>
										<view class="denominat">
											<label>￥<text>{{ default_view(form.infos.balance) }}</text></label>
										</view>
										<view class="cardinfo">
											<view class="leftinfo">
												<view class="kname">券号：{{ default_view(form.infos.card_id) }}</view>
												<view class="card-num">											
													<label>{{ default_view(form.current_type_info ? form.current_type_info.text : '') }}</label>
													<!-- <view><em>●</em>{{ default_view(form.current_type_info ? form.current_type_info.text : '') }}</view> -->
												</view>
											</view>
		
										</view>
										<view class="statistic">
											<text>{{ default_view(form.infos.valid_date,'') }}</text>
											<text v-if="form.infos.is_use">{{ default_view(form.infos.is_use,'') }}</text>
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
									<label>卡号：<text>{{ default_view(form.infos.card_id) }}</text></label>
								</view>
								<!-- <button class="btn btn-qx">{{ default_view(form.infos.is_use,'') }}</button> -->
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
								<label>
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
	var $;
	export default {
		name: "CardDelay",
		components: {
			Head
		},
		computed:{
			default_view(){
				return $(function(v, def_val = '暂无更多信息...'){
					if(v)
						return v;
					else
						return def_val;
				});
			},
			scan_code_icon(){
				return (this.form.current_type_info?.scan_code || this.form.current_type_info == null) ? true : false;
			},
			show_not_more_infos(){
				let infos = this.form.infos;
				if(!infos.apply || !infos.sale_store_name || !infos.form.infos.sale_date || !infos.use_date || !infos.use_store_name || !infos.form.infos.operator)
					return true;
				else
					return false;
			}
		},
		data() {
			return {
				form:{
					current_type_info: null,
					number: '',
					infos: bussiness.infos()
				},
				source:{
					types: [],
				}
			}
		},
		methods: {
			select_type(data){
				this.form.current_type_info = data;
				console.log("[SelectType]选择卡券类型:",this.form.current_type_info);
				this.form.infos = this.$options.data().form.infos;
			},
			scan_code_handle(){
				uni.scanCode({
					success: $(function(result) {
						this.form.number = result.result;
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
				}))
			},
			async according_to_type_search(){
				if(this.form.current_type_info){
					let result = await this.form.current_type_info.search(this.form.number);
					console.log("[TypeSearch]查询结果:", result);
					if(result.code){
						this.form.infos = result.data;
					}
					else{
						util.simpleMsg(result.msg);
					}
				}
				else{
					util.simpleMsg('请选择类型后再进行此操作!');
				}
			},
			async get_types(){
				return await bussiness.get_types();
			}
		},
		async created() {
			$ = util.callContainer(this);
			this.source.types = await this.get_types();
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
		margin:2% 0;
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
	.totals button{
		background-color: #FBB955;
		width: 300rpx;
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
		padding:8% 4% 1%;
		transform: translateY(-60rpx);
	}
	.statistic{
		padding:3% 3%;
		justify-content: space-between;
		color: #fff;
		margin-top:18rpx;
	}
	.statistic text:nth-child(2){
		background-color: #FFE8E4;
		color: #FE694B;
		font-size: 26rpx;
		padding:4rpx 10rpx;
	}
	.chanxz{
		width:85%;
		padding:2% 15% 0 0;
		position: relative;
	}
	.chanxz label{
		width:23%;
		font-size: 28rpx;
		margin:0 1% !important;
		border-color: #FFCFC5;
	}
	.chanxz label:nth-child(1){
		border-color: #FBB955;
		color: #FBB955;
	}
	.chanxz label:nth-child(2){
		border-color: #FE694B;
		color: #FE694B;
	}
	.chanxz label:nth-child(1).curr{
		border-color: #FBB955;
		background: linear-gradient(180deg, #FFEEB9 0%, #FFFFFF 100%);
		color:#FBB955
	}
	.chanxz label:nth-child(2).curr{
		background: linear-gradient(180deg, #FFD2C9 0%, #FFFFFF 100%);
		border: 2rpx solid #FE694B;
	}
	.chanxz label:nth-child(1).curr em{
		background:#FBB955;
	}
	.chanxz label:nth-child(2).curr em{
		background:#FE694B;
	}
	.chanxz .quanbu{
		width:90rpx;
		position: absolute;
		top:19rpx;
		right:3%;
		font-size: 18rpx;
		color: #42B14B;
	}
	.chanxz .quanbu image{
		width:22rpx;
		height: 22rpx;
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
</style>