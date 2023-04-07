<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);

	@import url(@/static/style/index.css);

	@import url(@/static/style/quiry.css);
</style>

<template>

	<view class="body">
		<view class="hh"
			style="padding-right:3.7%;position: fixed; top:59px;height: 32px;width: 80%;z-index:10;background-color: #F5F4F8;">
			<view class="hotcakes">
				<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 功能中心
			</view>
			<view class="classifys" v-if="list.length>0">
				<text v-for="item,index in list" :class="activeIndex === index?'curr':''"
					@click="listTable(index)">{{item.tab}}</text>
			</view>
		</view>
		<NoData v-if="list.length==0" :_tips="'功能暂未授权'"></NoData>
		<scroll-view scroll-y="true" show-scrollbar="true" v-else>
			<view class="commodity" style="margin-top: 28px;width: 95%;" height="100%">
				<!-- 大类循坏 -->
				<view class="broadcate" v-for="item,index in list">
					<view class="mokuai" :class="'mokuai'+index" :data-index='index'>
						{{item.tab}}<text>/{{item.valueList.length}}</text>
					</view>
					<image class="bg-top" src="@/images/jsd-hybj.png" mode="widthFix"></image>
					<view class="ol">
						<view class="li" v-for='_item,_index in item.valueList' @click="goCommonQuery(_item)">
							<text class="zhuangs">裱</text>
							<label>
								<image src="@/images/img2/biaodan-cai.png" mode="widthFix"></image> 表单
							</label>
							<view class="summary">{{_item.name}}</view>
							<view class="examine">
								<!-- '1009','裱花请货商品查询' -->
								<text>点击查看</text>
								<image src="@/images/img2/dianji-jinru.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	var that;
	import _util from "@/utils/util.js"

	export default {
		props: {
			_menu: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				list: [],
				activeIndex: 0,
				handleFnDebounce: () => {},
				store: getApp().globalData.store,
			}
		},
		watch: {
			_menu: function(newValue) {
				console.log("传入的菜单数据发生变化：", newValue);
				if (newValue) {
					let arr = newValue.Second.map(r => {
						return {
							tab: r.MenuName,
							valueList: r.Third.map(r1 => {
								return {
									id: r1.MenuId,
									name: r1.MenuName,
									path: r1.MenuId === "XSALLCX" ?
										'/pages/Querypage/Statement/Statement' :
										''
								}
							})
						}
					})
					console.log("菜单模块筛选后的数据：", arr);
					this.list = arr;
				}
			}
		},
		onPageScroll() {
			this.handleFnDebounce()
		},
		created() {
			that = this;
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
								id: r1.MenuId,
								name: r1.MenuName,
								path: r1.MenuId === "XSALLCX" ?
									'/pages/Querypage/Statement/Statement' :
									''
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
				uni.createSelectorQuery().select('.mokuai' + index).boundingClientRect(data => { //目标位置的节点：类或者id
					uni.createSelectorQuery().select(".commodity").boundingClientRect(res => { //最外层盒子的节点：类或者id
						uni.pageScrollTo({
							duration: 100, //过渡时间
							scrollTop: data.top - res.top, //到达距离顶部的top值
						})
					}).exec()
				}).exec();
			},

			//点击进入详情e
			goCommonQuery(e) {
				if (!e.path) {
					_util.simpleMsg("抱歉，功能暂未开放", true);
					return;
				}
				let obj = {
					KHID: that.store.KHID, //门店编码
					KHNAME: that.store.SNAME, //门店名称
					GSID: that.store.GSID, //gsid
					DQID: that.store.DQID, //dqid
					username: 'zd',
					adrp: "170", //门店名称
					// gsid : "k200", //门店名称
					zztlx: "QT", //门店名称
					type: "Defqry1009", //门店名称
					code: "Defqry", //门店名称
					qrytype: '1009',
					qtyname: '现烤请货查询'
				}

				const path =
					`${e.path}?qrytype=${'1009'}&qtyname=${'现烤请货查询'}&khid=${that.store.KHID}&sname=${that.store.SNAME}&username=${obj.username}&adrp=${obj.adrp}&gsid=${that.store.GSID}&zztlx=${obj.zztlx}&type=${obj.type}&code=${obj.code} `
				console.log("跳转的地址：", path);
				uni.navigateTo({
					url: path
				})

			}
		}
	}
</script>



<style>



</style>