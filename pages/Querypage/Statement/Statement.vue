<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<query></query>
		<view class="right" style="position: relative;">
			<!-- :custom="mainSale.ComponentsManage.DKF" :_showSale="mainSale.currentOperation.ynCancel"
					:_ynDKF="mainSale.currentOperation.DKF" :type="mainSale.current_type.clickType" -->
			<Head></Head>
			<view class="listof" style="position: absolute;z-index: 0;">
				<view class="prolist">
					<view class="hh" style="padding-right:3.7%;">
						<view class="hotcakes">
							<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 功能中心
						</view>
						<view class="classifys">
							<text >2023年2月23日·星期一</text>
						</view>
					</view>
					<view class="commodity">
						<view class="broadcate" >
							<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
							<view class="mokuai"><image src="@/images/img2/zhanbi-cai.png" mode="widthFix"></image>总体运营明细</view>
							<view class="operatys">
								<view class="operat-sales wk">
									<view class="huanxing">
										<view class="charts-box">
										  <qiun-data-charts type="arcbar" 
										  :opts="{title:{name:' ',color:'#1890ff',fontSize:35},subtitle:{name: ' ',},extra:{arcbar:{type:'circle',startAngle:1.5}}}" 
										  :chartData="chartsDataArcbar"/>
										</view>
									</view>
									<view class="memb plan-bf">
										<view class="huiyuan">
											<label><image src="@/images/img2/hylaikes.png"></image>43.8%</label>
											<text>达成进度(去节令)</text>
										</view>
										<view class="huiyuan">
											<label><image src="@/images/img2/huiyxiaof.png"></image>42.9%</label>
											<text>时间进度</text>
										</view>
									</view>
									<view class="sale-qk">
										<view class="waimai-list">
											<view class="namewm"><image src="@/images/img2/drixshou.png"></image>当日销售(去节令)</view>
											<label class="pric">¥4136.7</label>
											<view class="sale-jd"><label></label><text>12.5%</text></view>
										</view>
										<view class="waimai-list">
											<view class="namewm"><image src="@/images/img2/drixshou-qjiel.png"></image>当日销售(去节令)</view>
											<label class="pric">¥4136.7</label>
											<view class="sale-jd"><label></label><text>12.5%</text></view>
										</view>
										<view class="waimai-list">
											<view class="namewm"><image src="@/images/img2/drixshou-jiel.png"></image>当日销售(去节令)</view>
											<label class="pric">¥4136.7</label>
											<view class="sale-jd"><label></label><text>12.5%</text></view>
										</view>
										<view class="waimai-list">
											<view class="namewm"><image src="@/images/img2/dyuexshou-qjiel.png"></image>当日销售(去节令)</view>
											<label class="pric">¥4136.7</label>
											<view class="sale-jd"><label></label><text>12.5%</text></view>
										</view>
									</view>
								</view>
								<view class="operat-flow wk">
									<view class="memb">
										<view class="huiyuan">
											<label><image src="@/images/img2/hylaikes.png"></image>678</label>
											<text>当日会员来客数</text>
										</view>
										<view class="huiyuan">
											<label><image src="@/images/img2/huiyxiaof.png"></image>678</label>
											<text>当日会员销费</text>
										</view>
									</view>
									<view class="memb-stat">
										<view><label><em>●</em> 当日来客数</label> <text>766</text></view>
										<view><label><em>●</em> 当日来客数</label> <text>766</text></view>
										<view><label><em>●</em> 当日去节令客单价(参考值)</label> <text>￥766</text></view>
										<view><label><em>●</em> 当日去节令客单价(参考值)</label> <text>￥766</text></view>
									</view>
								</view>
							</view>
							<view class="particul">
								<view class="part-sale">
									<view class="mokuai"><image src="@/images/img2/zhuzhuangt.png" mode="widthFix"></image>重点品类销售明细</view>
									<view class="wk cons-pl">
										<view class="sorts">
											<label><em>●</em>现烤</label>
											<label><em>●</em>裱花</label>
											<label><em>●</em>水吧</label>
										</view>
										<view class="timeperiod">
											<view class="Barchart">
												<view class="beijing">
													<view><text>20k</text></view>
													<view><text>20k</text></view>
													<view><text>20k</text></view>
													<view><text>20k</text></view>
													<view><text>0k</text></view>
												</view>
												<view class="dyxs">
													<view class="dyname">当日销售</view>
													<view><label style="height: 50%;"></label></view>
													<view><label style="height: 80%;"></label></view>
													<view><label style="height: 20%;"></label></view>
												</view>
												<view class="drxs">
													<view class="dyname">当日销售</view>
													<view><label style="height: 50%;"></label></view>
													<view><label style="height: 80%;"></label></view>
													<view><label style="height: 20%;"></label></view>
												</view>
											</view>
											<view class="Barchart">
												<view class="beijing">
													<view><text>100%</text></view>
													<view><text>80%</text></view>
													<view><text>60%</text></view>
													<view><text>40%</text></view>
													<view><text>20%</text></view>
													<view><text>0%</text></view>
												</view>
												<view class="dyxs">
													<view class="dyname">当日占比</view>
													<view><label style="height: 50%;"><text>50%</text></label></view>
													<view><label style="height: 80%;"><text>80%</text></label></view>
													<view><label style="height: 20%;"><text>20%</text></label></view>
												</view>
												<view class="drxs">
													<view class="dyname">当月占比</view>
													<view><label style="height: 50%;"></label></view>
													<view><label style="height: 80%;"></label></view>
													<view><label style="height: 20%;"></label></view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="part-cons">
									<view class="mokuai"><image src="@/images/img2/haocai.png" mode="widthFix"></image>当日耗用明细</view>
									<view  class="wk cons-jl">
										<view class="jlbs">
											<view class="h6"><em>●</em> 去节令报损</view>											
											<view class="bszb">
												<view class="charts-box">
												  <qiun-data-charts type="arcbar" 
												  :opts="{title:{name:'80%',color:'#2fc25b',fontSize:24},subtitle:{name:'当月指标报损',color:'#666666',fontSize:14}}" 
												  :chartData="chartsDataArcbar1"/>
												</view>
												<view class="breakage">													
													<view class="memb">
														<view class="huiyuan">
															<label><image src="@/images/img2/baosu.png"></image>678</label>
															<text>当日报损率</text>
														</view>
														<view class="huiyuan">
															<label>678</label>
															<text>当日报损金额</text>
														</view>
													</view>
													<view class="memb">
														<view class="huiyuan">
															<label><image src="@/images/img2/baosun-leiji.png"></image>678</label>
															<text>当日报损率</text>
														</view>
														<view class="huiyuan">
															<label>678</label>
															<text>当日报损金额</text>
														</view>
													</view>
												</view>
																						
											</view>
											
										</view>
										<view class="jlly">
											<view class="h6"><em>●</em> 去节令领用</view>
											<view class="sale-qk">
												<view class="waimai-list">
													
													<view class="namewm">
														<em class="gang"></em>当日领用							
													</view>
													<label class="pric">¥4136.7</label>												
												</view>
												<view class="waimai-list">
													<!-- <em></em> -->
													<view class="namewm">
														<em class="gang"></em>当日累积领用
														
													</view>
													<label class="pric">¥4136.7</label>
												</view>
											</view>
										</view>
									</view>
									
								</view>
							</view>
							<view class="particul">
								<view class="part-sale part-waimai">
									<view class="mokuai"><image src="@/images/img2/waimai.png" mode="widthFix"></image>外卖</view>
									<view class="cons-wm">
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日外卖销售 <text>去节令</text></view>
											<label class="pric">¥4136.7</label>
											<view class="waimai-xs"><text>当月外卖销售：</text> 967788</view>
										</view>
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日外卖销售 <text>去节令</text></view>
											<label class="pric">¥4136.7</label>
											<view class="waimai-xs"><text>当月外卖销售：</text> 967788</view>
										</view>
									</view>
								</view>
								<view class="part-cons pasrt-kq">
									<view class="mokuai"><image src="@/images/img2/kaquan.png" mode="widthFix"></image>卡券</view>
									<view  class="cons-qjl">
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日外卖销售 <text>去节令</text></view>
											<label class="pric">¥4136.7</label>
											<view class="waimai-xs"><text>当月外卖销售：</text> 967788</view>
										</view>
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日外卖销售 <text>去节令</text></view>
											<label class="pric">¥4136.7</label>
											<view class="waimai-xs"><text>当月外卖销售：</text> 967788</view>
										</view>
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日外卖销售 <text>去节令</text></view>
											<label class="pric">¥4136.7</label>
											<view class="waimai-xs"><text>当月外卖销售：</text> 967788</view>
										</view>
									</view>
								</view>
								</view>
							
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue'
	import query from '@/pages/Home/query.vue'
	
	export default {
		components: {
			Head,
			query
		},
			data() {
				return {
					option: {},
					optionone: {},
					optiontwo: {},
					cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:'',
				chartsDataArcbar: {
				    "series":[
				        {
				            name: '达成进度(去节令)',
				            data: 0.429,
				            color: '#42B14B'
				        },
						{
						    name: '达成进度(去节令)',
						    data: 0.234,
						    color: '#19C7A5'
						}
				    ],
				},
				chartsDataArcbar1: {
					series: [{
					        name: '当月报损指标',
					        data: 0.8,
					        color: '#42B14B'
					    }]
				}
				}

			}, 
			
			onLoad() {
				
			},
			methods: {
					
			}

		}	
	</script>
	<style>
		.hh{
			padding:16rpx 2%;
		}
		.listof{
			height: 92%;
		}
		.commodity{
			height:95%;
		}
		.huanxing{
			width:23%;
			height: 360rpx;
		}
		.huanxing .charts-box{
			margin-top:-60rpx;
		}
		.breakage .memb{
			margin:3% 0;
		}
	</style>