<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">

		<query style="position: fixed;width: 14.5%;height: 100%;z-index: 10"></query>

		<view class="right" style="position: relative;">
			<!-- :custom="mainSale.ComponentsManage.DKF" :_showSale="mainSale.currentOperation.ynCancel"
					:_ynDKF="mainSale.currentOperation.DKF" :type="mainSale.current_type.clickType" -->
			<Head style="position: fixed;height: 45px;width: 85.5%;right:0;background-color: #fff;z-index: 10;"></Head>
			<view class="listof" style="position: absolute;z-index: 0;">

				<view class="prolist">
					<view class="hh"
						style="padding-right:3.7%;position: fixed; top:59px;height: 32px;width: 96%;z-index:10;background-color: #F5F4F8;">
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
					<NoData v-if="list.length==0"></NoData>
					<scroll-view scroll-y="true" show-scrollbar="true" v-else>
						<view class="commodity" style="margin-top: 110px;margin-left:16%;width: 78%;">
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
										<view class="examine" @click="goCommonQuery(_item)"><!-- '1009','裱花请货商品查询' -->
											<text>点击查看</text>
											<image src="@/images/img2/dianji-jinru.png"></image>
										</view>
									</view>
								</view>
							</view>

						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue'
	import query from '@/components/query/query.vue'
	import utils from "@/utils/util.js"

	export default {
		components: {
			query,
			Head
		},
		props: {
			_menu: {
				type: Object,
				default: {}
			}
		},
		watch: {
			_menu: function(n, o) {
				console.log("传入的菜单数据发生变化：", n);
				if (n) {
					let arr = n.Second.map(r => {
						return {
							tab: r.MenuName,
							valueList: r.Third.map(r1 => {
								return {
									id: r1.MenuId,
									name: r1.MenuName
								}
							})
						}
					})
					console.log("菜单模块筛选后的数据：", arr);
					this.list = arr;
				}
			}
		},
		data() {
			return {
				list: [],
				list1: [{
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
				activeIndex: 0,
				handleFnDebounce: () => {}
			}
		},
		onPageScroll() {
			this.handleFnDebounce()
		},
		mounted() {
			console.log("传入的菜单数据：", this._menu);
			if (this._menu) {
				let n = this._menu;
				let arr = n.Second.map(r => {
					return {
						tab: r.MenuName,
						valueList: r.Third.map(r1 => {
							return {
								name: r1.MenuName
							}
						})
					}
				})
				this.list = arr;
			}
			const handleFn = () => {
				uni.createSelectorQuery().selectAll('.mokuai').boundingClientRect((res) => {
					for (let item of res) {
						if (Math.abs(item.top) < 200) {
							let index = item.dataset.index
							this.activeIndex = Number(index)
						}
					}

				}).exec()
			}

			this.handleFnDebounce = this.debounce(handleFn, 30)
		},
		methods: {
			debounce(fn, wait) {
				let timer = false;
				return function() {
					clearTimeout(timer);
					timer && clearTimeout(timer);
					timer = setTimeout(() => {
						timer = false;
						fn.apply(this, arguments); // 把参数传进去
					}, wait);
				};
			},
			//点击锚点
			listTable(index) {
				this.activeIndex = index
				// document.querySelector(".mokuai" + index)?.scrollIntoView({
				// 	behavior: "smooth"
				// })

				uni.createSelectorQuery().select('.mokuai' + index).boundingClientRect(data => { //目标位置的节点：类或者id
					console.log(data, '数据123')
					console.log('.mokuai' + index, "111111111")
					uni.createSelectorQuery().select(".commodity").boundingClientRect(res => { //最外层盒子的节点：类或者id
						uni.pageScrollTo({
							duration: 100, //过渡时间
							scrollTop: data.top - res.top, //到达距离顶部的top值
						})
						console.log(data.top - res.top, `pppppp`)
					}).exec()
				}).exec();
			},
			//点击进入详情
			goCommonQuery(e) {
				const khid = "K200QTD005" //门店id
				const sname = "武汉领秀门厅" //门店名称
				const username = "用户名" //用户名
				const adrp = "170" //门店名称
				const gsid = "k200" //门店名称
				const zztlx = "QT" //门店名称
				const type = "Defqry1009" //门店名称
				const code = "Defqry" //门店名称

				const url =
					`/pages/Querypage/TakeawayCX/TakeawayCX?qrytype=${e.id}&qtyname=${e.name}&khid=${khid}&sname=${sname}&username=${username}&adrp=${adrp}&gsid=${gsid}&zztlx=${zztlx}&type=${type}&code=${code}`
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>

</style>
