<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<query :index='sideIndex'></query>
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
						<!-- v-for="(xplitem, xplindex) in mainSale.selectFlagList"
							:class="mainSale.selectPlid==xplitem.plid?'curr':''"
							@click="mainSale.selectPlidChenged"
							:data-plid="xplitem.plid"  {{xplitem.plname}}-->
						<view class="classifys">
							<text v-for="item,index in list" :class="activeIndex === index?'curr':''"
								@click="listTable(index)">{{item.tab}}</text>
							<!-- <text>品类</text> -->
						</view>
					</view>
					<view class="commodity">
						<!-- 大类循坏 -->
						<view class="broadcate" v-for="item,index in list">
							<view class="mokuai" :class="'mokuai'+index" :data-index='index'>
								{{item.tab}}<text>/{{item.valueList.length}}</text>
							</view>
							<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
							<view class="ol">
								<view class="li" v-for='_item,_index in item.valueList'>
									<text class="zhuangs">裱</text>
									<label>
										<image src="@/images/img2/biaodan-cai.png" mode="widthFix"></image> 表单
									</label>
									<view class="summary">{{_item.name}}</view>
									<view class="examine" @click="goCommonQuery('1009','裱花请货商品查询')"><text>点击查看</text>
										<image src="@/images/img2/dianji-jinru.png"></image>
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
	import utils from "@/utils/util.js"

	export default {
		components: {
			query,
			Head
		},

		data() {
			return {
				sideIndex: null,
				list: [{
					tab: "日销售1",
					valueList: [{
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}]

				}, {
					tab: "日销售2",
					valueList: [{
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}]

				}, {
					tab: "日销售3",
					valueList: [{
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}]

				}, {
					tab: "日销售4",
					valueList: [{
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}]

				}, {
					tab: "日销售5",
					valueList: [{
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}]

				}, {
					tab: "日销售6",
					valueList: [{
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}, {
						name: "裱花请货商品汇总"
					}]

				}],
				activeIndex: 0
			}
		},
		created() {
			const index = utils.getStorage("index")
			this.sideIndex = index
		},
		onLoad() {

		},
		mounted() {
			const doms = document.getElementsByClassName('mokuai')
			const domArr = [...doms]
			console.log(domArr)
			const handleFn = () => {
				for (let dom of domArr) {
					let top = dom.getBoundingClientRect().top
					if (Math.abs(top) < 100) {
						let index = dom.dataset.index			
						this.activeIndex = Number(index)
					}

				}
			}

			const containerDom = document.getElementsByClassName('commodity')[0]
			
			function debounce(fn, wait) {
			  let timer = false;
			  return function() {
			    clearTimeout(timer);
			    timer && clearTimeout(timer);
			    timer = setTimeout(() => {
			      timer = false;
			      fn.apply(this, arguments); // 把参数传进去
			    }, wait);
			  };
			}
			
			const handleFnDebounce = debounce(handleFn, 200)
		
			containerDom.addEventListener('scroll', () => {
				handleFnDebounce()
			})
		},
		methods: {
			//点击锚点
			listTable(index) {
				this.activeIndex = index
				document.querySelector(".mokuai" + index)?.scrollIntoView({
					behavior: "smooth"
				})
			},
			//点击进入详情
			goCommonQuery(id, name) {
				const khid = "K200QTD005" //门店id
				const sname = "武汉领秀门厅" //门店名称
				const username = "用户名" //用户名
				const adrp = "170" //门店名称
				const gsid = "k200" //门店名称
				const zztlx = "QT" //门店名称
				const type = "Defqry1009" //门店名称
				const code = "Defqry" //门店名称

				const url =
					`/pages/Querypage/TakeawayCX/TakeawayCX?qrytype=${id}&qtyname=${name}&khid=${khid}&sname=${sname}&username=${username}&adrp=${adrp}&gsid=${gsid}&zztlx=${zztlx}&type=${type}&code=${code}`
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>
</style>
