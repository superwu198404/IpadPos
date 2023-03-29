<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<!-- <query></query> -->
		<view class="right" style="position: relative;">
			<!-- :custom="mainSale.ComponentsManage.DKF" :_showSale="mainSale.currentOperation.ynCancel"
					:_ynDKF="mainSale.currentOperation.DKF" :type="mainSale.current_type.clickType" -->
			<!-- <Head></Head> -->
			<view class="listof" style="position: absolute;z-index: 0;">
				<view class="prolist">
					<view class="hh" style="padding-right:3.7%;">
						<view class="hotcakes">
							<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 功能中心
						</view>
						<view class="classifys">
							<picker mode="date" fields="day" @change="changeDate" :value='date'>
								<text>日期：{{date}}</text>
							</picker>
						</view>
					</view>
					<view class="commodity" v-if="isDate===true">
						<view class="broadcate">
							<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
							<view class="mokuai">
								<image src="@/images/img2/zhanbi-cai.png" mode="widthFix"></image>总体运营明细
							</view>
							<view class="operatys">
								<view class="operat-sales wk">
									<view class="huanxing">
										<view class="charts-box">
											<qiun-data-charts type="arcbar"
												:opts="{title:{name:'',color:'#1890ff',fontSize:35},subtitle:{name: '',},extra:{arcbar:{type:'circle',startAngle:1.5}}}"
												:chartData="chartsDataArcbar" />
										</view>
									</view>
									<view class="memb plan-bf">
										<view class="huiyuan">
											<label>
												<image src="@/images/img2/hylaikes.png"></image>
												{{Boolean(parseInt(totalSale.progress))=== false?'0%':totalSale.progress}}
											</label>
											<text>达成进度(去节令)</text>
										</view>
										<view class="huiyuan">
											<label>
												<image src="@/images/img2/huiyxiaof.png"></image>
												{{Boolean(parseInt(totalSale.timeProgress))=== false?'0%':totalSale.timeProgress}}
											</label>
											<text>时间进度</text>
										</view>
									</view>
									<view class="sale-qk">
										<view class="waimai-list">
											<view class="namewm">
												<image src="@/images/img2/drixshou.png"></image>当日销售
											</view>
											<label class="pric">¥{{(totalSale.curSale).replace('元','')}}</label>
											<!-- <view class="sale-jd"><label></label><text>12.5%</text></view> -->
										</view>
										<view class="waimai-list">
											<view class="namewm">
												<image src="@/images/img2/drixshou-qjiel.png"></image>当日销售(去节令)
											</view>
											<label class="pric">¥{{(totalSale.pureCurSale).replace('元','')}}</label>
											<!-- <view class="sale-jd"><label></label><text>12.5%</text></view> -->
										</view>
										<view class="waimai-list">
											<view class="namewm">
												<image src="@/images/img2/drixshou-jiel.png"></image>当日销售(节令)
											</view>
											<label class="pric">¥{{(totalSale.noPureCureSale).replace('元','')}}</label>
											<!-- <view class="sale-jd"><label></label><text>12.5%</text></view> -->
										</view>
										<view class="waimai-list">
											<view class="namewm">
												<image src="@/images/img2/dyuexshou-qjiel.png"></image>当月销售(去节令)
											</view>
											<label class="pric">{{(totalSale.pureCurMouth).replace('元','')}}</label>
											<!-- <view class="sale-jd"><label></label><text>12.5%</text></view> -->
										</view>
									</view>
								</view>
								<view class="operat-flow wk">
									<view class="memb">
										<view class="huiyuan">
											<label>
												<image src="@/images/img2/hylaikes.png"></image>{{member.curMembers}}
											</label>
											<text>当日会员来客数</text>
										</view>
										<view class="huiyuan">
											<label>
												<image src="@/images/img2/huiyxiaof.png"></image>
												{{member.curMemberSale}}
											</label>
											<text>当日会员消费</text>
										</view>
									</view>
									<view class="memb-stat">
										<view><label><em>●</em> 当日来客数</label>
											<text>{{numberOfVisitors.curVisiror}}</text></view>
										<view><label><em>●</em> 当月来客数</label>
											<text>{{numberOfVisitors.curMountVisiror}}</text></view>
										<view><label><em>●</em> 当日去节令客单价(参考值)</label>
											<text>￥{{(numberOfVisitors.curDoAwaySale).replace('元','')}}</text></view>
										<view><label><em>●</em> 当月去节令客单价(参考值)</label>
											<text>￥{{(numberOfVisitors.curMountDoAwaySale).replace('元','')}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="particul">
								<view class="part-sale">
									<view class="mokuai">
										<image src="@/images/img2/zhuzhuangt.png" mode="widthFix"></image>重点品类销售明细
									</view>
									<view class="wk cons-pl">
										<view class="sorts">
											<label><em>●</em>现烤</label>
											<label><em>●</em>裱花</label>
											<label><em>●</em>水吧</label>
										</view>
										<view class="timeperiod">
											<view class="Barchart">
												<view class="beijing">
													<view><text>100k</text></view>
													<view><text>80k</text></view>
													<view><text>60k</text></view>
													<view><text>40k</text></view>
													<view><text>20k</text></view>
													<view><text>0K</text></view>
												</view>
												<view class="dyxs">
													<view class="dyname">当日销售</view>
													<view><label :style="{height:(((freshRoast.curRoastSale).replace('元','')/100000)*100).toFixed(3)+'%'}">
													</label>
													</view>
													<view><label 
															:style="{height:(((mountingPatterns.curPatternSale).replace('元','')/100000)*100).toFixed(3)+'%'}">
															</label>
													</view> 
													<view><label :style="{height:(((waterBar.curBarSaleRatio).replace('元','')/100000)*100).toFixed(3)+'%'}">
													</label>
													</view>
												</view>
												<view class="drxs">
													<view class="dyname">当月销售</view>
													<view><label
															:style="{height:(((freshRoast.curMonthRoastSale).replace('元','')/100000)*100).toFixed(3)+'%'}"></label>
													</view>
													<view><label
															:style="{height:(((mountingPatterns.curMonthPatternSale).replace('元','')/100000)*100).toFixed(3)+'%'}"><text>￥{{(mountingPatterns.curMonthPatternSale).replace('元','')}}</text></label>
													</view>
													<view><label :style="{height:(((waterBar.curMountBarRation).replace('元','')/100000)*100).toFixed(3)+'%'}"></label>
													</view>
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
													<view><label :style="{height:freshRoast.curRoastSaleRatio}"></label>
													</view>
													<view><label
															:style="{height:mountingPatterns.curPatternSaleRatio}"></label>
													</view>
													<view><label :style="{height:waterBar.curBarSaleRatio}"></label>
													</view>
												</view>
												<view class="drxs">
													<view class="dyname">当月占比</view>
													<view><label
															:style="{height:freshRoast.curMountRoastRation}"></label>
													</view>
													<view><label
															:style="{height:mountingPatterns.curPatternSaleRatioRatio}"><text>{{mountingPatterns.curPatternSaleRatioRatio}}</text></label>
													</view>
													<view><label :style="{height:waterBar.curMountBarRation}"></label>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<view class="part-cons">
									<view class="mokuai">
										<image src="@/images/img2/haocai.png" mode="widthFix"></image>当日耗用明细
									</view>
									<view class="wk cons-jl">
										<view class="jlbs">
											<view class="h6"><em>●</em> 去节令报损</view>
											<view class="bszb">
												<view class="charts-box">
													<qiun-data-charts type="arcbar"
														:opts="{title:{name:reportDamage.curMonthDamage,color:'#2fc25b',fontSize:24},subtitle:{name:'当月报损指标',color:'#666666',fontSize:14}}"
														:chartData="chartsDataArcbar1" />
												</view>
												<view class="breakage">
													<view class="memb">
														<view class="huiyuan">
															<label>
																<image src="@/images/img2/baosu.png"></image>{{reportDamage.curDamageRation}}
															</label>
															<text>当日报损率</text>
														</view>
														<view class="huiyuan">
															<label>{{reportDamage.curDamage}}</label>
															<text>当日报损金额</text>
														</view>
													</view>
													<view class="memb">
														<view class="huiyuan">
															<label>
																<image src="@/images/img2/baosun-leiji.png"></image>
																{{reportDamage.DamageAllRation}}
															</label>
															<text>当月累计报损率</text>
														</view>
														<view class="huiyuan">
															<label>{{reportDamage.curMountDamageRation}}</label>
															<text>当月累计报损</text>
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
													<label class="pric">¥{{(reportReceive.curReceive).replace('元','')}}</label>
												</view>
												<view class="waimai-list">
													<!-- <em></em> -->
													<view class="namewm">
														<em class="gang"></em>当月累积领用

													</view>
													<label class="pric">¥{{(reportReceive.curMonthReceive).replace('元','')}}</label>
												</view>
											</view>
										</view>
									</view>

								</view>
							</view>
							<view class="particul">
								<view class="part-sale part-waimai">
									<view class="mokuai">
										<image src="@/images/img2/waimai.png" mode="widthFix"></image>外卖
									</view>
									<view class="cons-wm">
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日外卖销售 <text>去节令</text></view>
											<label class="pric">¥{{(takeOut.curTakeSale).replace('元','')}}</label>
											<view class="waimai-xs"><text>当月外卖销售：</text>￥{{(takeOut.curTakeSaleRatio).replace('元','')}}</view>
										</view>
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日外卖销售 <text>含节令</text></view>
											<label class="pric">¥{{(takeOut.curMonthTakeSale).replace('元','')}}</label>
											<view class="waimai-xs"><text>当月外卖销售：</text> ￥{{(takeOut.curMountTakeRation).replace('元','')}}</view>
										</view>
									</view>
								</view>
								<view class="part-cons pasrt-kq">
									<view class="mokuai">
										<image src="@/images/img2/kaquan.png" mode="widthFix"></image>卡券
									</view>
									<view class="cons-qjl">
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日充值 </view>
											<label class="pric">¥{{(cardCoupon.curTakeUp).replace('元','')}}</label>
											<view class="waimai-xs"><text>当月累计充值：</text> ¥{{(cardCoupon.curMonthTakeUp).replace('元','')}}</view>
										</view>
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日售卡 <text>面值</text></view>
											<label class="pric">¥{{(cardCoupon.curSaleCard).replace('元','')}}</label>
											<view class="waimai-xs"><text>当月累计售卡：</text>¥{{(cardCoupon.curMountSaleCard).replace('元','')}}</view>
										</view>
										<view class="waimai-list">
											<em></em>
											<view class="namewm">当日售劵 <text>面值</text></view>
											<label class="pric">¥{{(cardCoupon.curSaleBond).replace('元','')}}</label>
											<view class="waimai-xs"><text>当月累计售劵：</text>¥{{(cardCoupon.curMountSaleBond).replace('元','')}}</view>
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
	import query from '@/components/query/query.vue'
	import utils from "@/utils/util.js"
	import _query_sale from "@/api/business/query_sale.js";
	import util from '@/utils/util.js';

	export default {
		components: {
			Head,
			query
		},
		data() {
			return {
				sideIndex: null,
				option: {},
				optionone: {},
				optiontwo: {},
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				chartsDataArcbar: {
					"series": [{
							name: '达成进度(去节令)',
							data: 0,
							color: '#42B14B',
							BackgroundColor: '#E7FDE8'
						},
						{
							name: '达成进度(去节令)',
							data: 0,
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
				},
				KHID: getApp().globalData.store.KHID,
				date: new Date().toISOString().slice(0, 10),
				isDate: false,
				showDate: '',
				totalSale: {},
				mountingPatterns: {}, //裱花
				freshRoast: {}, //现烤
				waterBar: {},
				takeOut: {},
				cardCoupon: {},
				numberOfVisitors: {},
				reportDamage: {},
				reportReceive: {},
				member: {}
			}

		},
		async created() {
			let showDateString = await _query_sale.GetRJData(this.KHID,this.date);
			console.log(showDateString,'111111111111111111111111111111')
			if(showDateString){
				this.showDate = showDateString.split('【总销售达成】')[1]
				this.spliceDate(this.showDate)
				this.setDate()
			}else{
				util.simpleMsg("查询结果为空",true)
			}
		
		},
		onLoad() {

		},
		methods: {
			spliceDate(showDate) {
				if (showDate) {
					this.isDate = true
					//总销售达成
					const curSale = showDate.split('当日销售:')[1].split('当日销售(去节令):')[0]
					const pureCurSale = showDate.split('当日销售(节令):')[0].split('当日销售(去节令):')[1]
					const noPureCureSale = showDate.split('当月销售(去节令)')[0].split('当日销售(节令):')[1]
					const pureCurMouth = showDate.split('时间进度:')[0].split('当月销售(去节令):')[1]
					const timeProgress = showDate.split('达成进度(去节令)')[0].split('时间进度:')[1]
					const progress = showDate.split('【裱花】')[0].split('达成进度(去节令):')[1]
					this.totalSale.curSale = curSale
					this.totalSale.pureCurSale = pureCurSale
					this.totalSale.noPureCureSale = noPureCureSale
					this.totalSale.pureCurMouth = pureCurMouth
					this.totalSale.timeProgress = timeProgress
					this.totalSale.progress = progress

					//裱花
					const curPatternSale = showDate.split('当日裱花销售占比:')[0].split('当日裱花销售:')[1]
					const curPatternSaleRatio = showDate.split('当月裱花销售:')[0].split('当日裱花销售占比:')[1]
					const curMonthPatternSale = showDate.split('当月裱花占比:')[0].split('当月裱花销售:')[1]
					const curPatternSaleRatioRatio = showDate.split('当月裱花目标占比:')[0].split('当月裱花占比:')[1]
					const curPatternTargetRatio = showDate.split('【现烤】')[0].split('当月裱花目标占比:')[1]
					this.mountingPatterns.curPatternSale = curPatternSale
					this.mountingPatterns.curPatternSaleRatio = curPatternSaleRatio
					this.mountingPatterns.curMonthPatternSale = curMonthPatternSale
					this.mountingPatterns.curPatternSaleRatioRatio = curPatternSaleRatioRatio
					this.mountingPatterns.curPatternTargetRatio = curPatternTargetRatio

					//现烤
					const curRoastSale = showDate.split('当日现烤销售占比:')[0].split('当日现烤销售:')[1]
					const curRoastSaleRatio = showDate.split('当月现烤销售:')[0].split('当日现烤销售占比:')[1]
					const curMonthRoastSale = showDate.split('当月现烤占比:')[0].split('当月现烤销售:')[1]
					const curMountRoastRation = showDate.split('当月现烤目标占比:')[0].split('当月现烤占比:')[1]
					const curMountRoastTargetRation = showDate.split('【水吧】')[0].split('当月现烤目标占比:')[1]
					this.freshRoast.curRoastSale = curRoastSale
					this.freshRoast.curRoastSaleRatio = curRoastSaleRatio
					this.freshRoast.curMonthRoastSale = curMonthRoastSale
					this.freshRoast.curMountRoastRation = curMountRoastRation
					this.freshRoast.curMountRoastTargetRation = curMountRoastTargetRation

					//水吧
					const curBarSale = showDate.split('当日水吧占比:')[0].split('当日水吧销售:')[1]
					const curBarSaleRatio = showDate.split('当月水吧销售:')[0].split('当日水吧占比:')[1]
					const curMonthBarSale = showDate.split('当月水吧占比:')[0].split('当月水吧销售:')[1]
					const curMountBarRation = showDate.split('【外卖】')[0].split('当月水吧占比:')[1]
					this.waterBar.curBarSale = curBarSale
					this.waterBar.curBarSaleRatio = curBarSaleRatio
					this.waterBar.curMonthBarSale = curMonthBarSale
					this.waterBar.curMountBarRation = curMountBarRation
					//外卖
					const curTakeSale = showDate.split('当月外卖销售(去节令):')[0].split('当日外卖销售(去节令):')[1]
					const curTakeSaleRatio = showDate.split('当日外卖销售(含节令):')[0].split('当月外卖销售(去节令):')[1]
					const curMonthTakeSale = showDate.split('当月外卖销售(含节令):')[0].split('当日外卖销售(含节令):')[1]
					const curMountTakeRation = showDate.split('【卡券】')[0].split('当月外卖销售(含节令):')[1]
					this.takeOut.curTakeSale = curTakeSale
					this.takeOut.curTakeSaleRatio = curTakeSaleRatio
					this.takeOut.curMonthTakeSale = curMonthTakeSale
					this.takeOut.curMountTakeRation = curMountTakeRation


					//卡劵
					const curTakeUp = showDate.split('当月累计充值:')[0].split('当日充值:')[1]
					const curMonthTakeUp = showDate.split('当日售卡（面值）:')[0].split('当月累计充值:')[1]
					const curSaleCard = showDate.split('当月累计售卡（面值）:')[0].split('当日售卡（面值）:')[1]
					const curMountSaleCard = showDate.split('当日售券（面值）:')[0].split('当月累计售卡（面值）:')[1]
					const curSaleBond = showDate.split('当月累计售券（面值）:')[0].split('当日售券（面值）:')[1]
					const curMountSaleBond = showDate.split('【来客数】:')[0].split('当月累计售券（面值）:')[1]
					this.cardCoupon.curTakeUp = curTakeUp
					this.cardCoupon.curMonthTakeUp = curMonthTakeUp
					this.cardCoupon.curSaleCard = curSaleCard
					this.cardCoupon.curMountSaleCard = curMountSaleCard
					this.cardCoupon.curSaleBond = curSaleBond
					this.cardCoupon.curMountSaleBond = curMountSaleBond

					// 来客数
					const curVisiror = showDate.split('当月来客数:')[0].split('当日来客数:')[1]
					const curMountVisiror = showDate.split('当日去节令客单价(参考值):')[0].split('当月来客数:')[1]
					const curDoAwaySale = showDate.split('当月去节令客单价(参考值):')[0].split('当日去节令客单价(参考值):')[1]
					const curMountDoAwaySale = showDate.split('【去节令报损】')[0].split('当月去节令客单价(参考值):')[1]
					this.numberOfVisitors.curVisiror = curVisiror
					this.numberOfVisitors.curMountVisiror = curMountVisiror
					this.numberOfVisitors.curDoAwaySale = curDoAwaySale
					this.numberOfVisitors.curMountDoAwaySale = curMountDoAwaySale

					// 去节令报损
					const curMonthDamage = showDate.split('当日报损:')[0].split('当月报损指标:')[1]
					const curDamage = showDate.split('当日报损率:')[0].split('当日报损:')[1]
					const curDamageRation = showDate.split('当月累积报损:')[0].split('当日报损率:')[1]
					const curMountDamageRation = showDate.split('当月累积报损率:')[0].split('当月累积报损:')[1]
					const DamageAllRation = showDate.split('【去节令领用】')[0].split('当月累积报损率:')[1]
					this.reportDamage.curMonthDamage = curMonthDamage
					this.reportDamage.curDamage = curDamage
					this.reportDamage.curDamageRation = curDamageRation
					this.reportDamage.curMountDamageRation = curMountDamageRation
					this.reportDamage.DamageAllRation = DamageAllRation

					// 去节令领用
					const curReceive = showDate.split('当月累积领用:')[0].split('当日领用:')[1]
					const curMonthReceive = showDate.split('【会员】')[0].split('当月累积领用:')[1]
					this.reportReceive.curReceive = curReceive
					this.reportReceive.curMonthReceive = curMonthReceive

					// 会员
					const curMembers = showDate.split('当日会员消费:')[0].split('当日会员来客数:')[1]
					const curMemberSale = showDate.split('当日会员消费:')[1]
					this.member.curMembers = curMembers
					this.member.curMemberSale = curMemberSale

					console.log(this.member, 'totalSale')
				} else {
					this.isDate = false
					util.simpleMsg('未查询到数据', true)
				}
			},
			async changeDate(e) {
				if (e.detail.value) {
					this.date = e.detail.value
					let showDateString = await _query_sale.GetRJData(this.KHID, this.date);
					if(showDateString){
						this.showDate = showDateString.split('【总销售达成】')[1]
						this.spliceDate(this.showDate)
						this.setDate()
					}else{
						util.simpleMsg("查询结果为空",true)
					}
				

				}
			},

			setDate() {
				this.chartsDataArcbar.series[0].data = parseInt(this.totalSale.progress) / 100
				this.chartsDataArcbar.series[1].data = parseInt(this.totalSale.timeProgress) / 100
				this.chartsDataArcbar1.series[0].data = parseInt(this.reportDamage.curMonthDamage)/100
			},

		}

	}
</script>
<style>
	.hh {
		padding: 16rpx 2%;
	}

	.listof {
		height: 92%;
	}

	.commodity {
		height: 95%;
	}

	.huanxing {
		width: 23%;
		height: 360rpx;
	}

	.huanxing .charts-box {
		margin-top: -60rpx;
	}

	.breakage .memb {
		margin: 3% 0;
	}
</style>
