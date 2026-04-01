<style scoped>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>

<template>
	<view class="centre" @click="hideAllPopups">
		<Head ref="Head" :BUSSINESS_NAME="BUSSINESS_NAME" :_showSale="true" :_ynMsg='false'></Head>

		<view class="content-container">
			<!-- 左侧：商品卡片列表 -->
			<view class="card-list" ref="scrollY">
				<view class="page-title">商品配送列表</view>

				<NoData v-if="listData.length==0"
					style="position: absolute; left: 50%; top: 60%; transform: translate(-50%, -50%);padding-top:0 ;">
				</NoData>

				<div v-if="listData.length>0"  class="table-scroll-x" ref="scrollX">
					<div class="table-scroll-y" ref="scrollY">
						<table class="data-table" border="0" cellpadding="0" cellspacing="0">
							<thead class="table-header">
								<tr>
									<th class="th-checkbox fixed-col1 th" @click="handleAllCheck()">
										<view class="task-checkbox" :class="{ 'checked': allChecked }">
											<image v-if="allChecked" class="check-icon"
												src="../../images/imgbh/gou@1x.png" mode="widthFix"></image>
										</view>
									</th>
									<th class="fixed-col2 th">序号</th>
									<th class="fixed-col3">要货商品</th>
									<th>规格</th>
									<th>数量</th>
									<th>单价</th>
									<th>到货时间</th>
									<th>到货时段</th>
									<th>要货门店</th>
									<th>要货单号</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in listData" :key="item.id" class="table-row" :class="[
										index % 2 == 1 ? 'tr-even' : '', 
										item.isChecked ? 'tr-checked' : ''
										]">
									<td class="fixed-col1 td-checkbox">
										<view @click="toggleTaskChecked(index,item)"
											class="task-checkbox" :class="{ 'checked': item.isChecked }">
											<image v-if="item.isChecked" class="check-icon"
												src="../../images/imgbh/gou@1x.png" mode="widthFix"></image>
										</view>
										<!-- <view v-else class="task-checkbox task-checkbox-none"> </view> -->
									</td>
									<td class="fixed-col2">{{ index + 1 }}</td>
									<td class="fixed-col3 ">{{item.SPNAME}}</td>
									<td>{{ item.SPECS }}</td>
									<td>{{ item.ZQTY_SQ }}</td>
									<td>{{ item.NET }}</td>
									<td>{{ item.NOTE }}</td>
									<td>{{ item.DHSJD }}</td>
									<td style="text-align: left;">{{ item.KHID }}-{{ item.KHNAME }}</td>
									<td>{{ item.BILL }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</view>

			<!-- 右侧：统计与操作区 -->
			<view class="side-panel">
				<!-- 数量统计 -->
				<view class="panel-section stats-section">
					<view class="section-title">数量统计</view>
					<view class="stat-item">
						<text class="stat-label">总金额</text>
						<NumberFormat class="stat-value" :value="totalStats.totalAmount" />
					</view>
					<view class="stat-item">
						<text class="stat-label">总数量</text>
						<NumberFormat class="stat-value" :value="totalStats.totalQuantity" />
					</view>
				</view>

				<!-- 操作区 -->
				<view class="panel-section operation-section" style="flex:1;position:relative;">
					<view class="section-title">操作</view>
					<!-- 到货日期 -->
					<view class="form-item">
						<view class="form-label">到货日期</view>
						<view style="flex:1;position: relative;width:100%;">
							<picker style="width: 100%;" mode="date" :value="arrivalDate" @change="onDateChange"
								class="filter-picker-date">
								<view :class="arrivalDate ? 'picker-label' : 'picker-placeholder'">
									{{ arrivalDate || '请选择日期' }}
								</view>
							</picker>
						</view>
					</view>
					<!-- 要货门店选择 -->
					<view class="form-item">
						<text class="form-label">要货门店</text>
						<view class="form-picker" style="flex:1;position: relative;">
							<input @click.stop="showBorad('shop')"
								style="height:100%;width:100%;padding-left: 6rpx;box-sizing: border-box;" disabled="true" class="filter-picker"
								v-model="selectedShopName" placeholder="请选择门店"
								@focus="(showDropdown_shop = true)"
								@blur="delayCloseShopDropdown" />
							<view style="opacity: 0;position: absolute;left:0;top:0;height:100%;width:100%"
								@click.stop="showBorad('shop')"></view>

							<view v-if="showDropdown_shop && filteredShopList.length"
								style="position: absolute; top: 80rpx; left: 0; width: 100%;  max-height: 340rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
								<view v-for="(item, index) in filteredShopList" :key="index"
									style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;font-size:28rpx"
									@click.stop="selectShop(item)">
									{{item.KHID}}-{{item.SNAME}}
								</view>
							</view>
							<view v-if="showDropdown_shop && !filteredShopList.length"
								style="position: absolute; top: 64rpx; left: 0; width: 94%;font-size:28rpx; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999; z-index: 100000;">
								暂无匹配门店
							</view>

							<image src="../../images/jsd-gb.png"
							style="width:40rpx;height:40rpx;position: absolute;right: 12rpx;top:50%;transform:translateY(-50%);"
							@click.stop="clearShop()" mode="widthFix"></image>
						</view>


						<image src="../../images/imgbh/rjp@1.5x.png" style="width:40rpx;height:40rpx;margin-left:16rpx;"
							@click.stop="showBorad('shop')" mode="widthFix"></image>
					</view>

					<view class="form-item">
						<text class="form-label">商品名称</text>
						<view class="form-picker" style="flex:1;position: relative;">
							<input @click.stop="showBorad('good')"
								style="height:100%;width:100%;padding-left: 6rpx;" disabled class="filter-picker"
								v-model="selectedProductName" placeholder="请选择商品" 
								@focus="showDropdown_goods = true" @blur="delayCloseGoodsDropdown" />
							<view style="opacity: 0;position: absolute;left:0;top:0;height:100%;width:100%"
								@click.stop="showBorad('good')"></view>
							<view v-if="showDropdown_goods && filteredGoodsList.length"
								style="position: absolute; top: 80rpx; left: 0; width: 100%;  max-height: 340rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
								<view v-for="(item, index) in filteredGoodsList" :key="index"
									style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;font-size:28rpx"
									@click.stop="selectGoods(item)">
									{{item.SNAME}}_{{item.SPID}}
								</view>
							</view>
							<view v-if="showDropdown_goods && !filteredGoodsList.length"
								style="position: absolute; top: 64rpx; left: 0; width: 94%;font-size:28rpx; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999; z-index: 100000;">
								暂无匹配任务商品
							</view>
							<!-- 关闭 -->
							<image src="../../images/jsd-gb.png"
								style="width:40rpx;height:40rpx;position: absolute;right: 12rpx;top:50%;transform:translateY(-50%);"
								@click.stop="clearGoods()" mode="widthFix"></image>
						</view>
						<image src="../../images/imgbh/rjp@1.5x.png" style="width:40rpx;height:40rpx;margin-left:16rpx"
							@click.stop="showBorad('good')" mode="widthFix"></image>
					</view>


					<view class="operation-btns operation-btns-btng">
						<button class="btn btn-set" @click="resetRightForm()">取消</button>
						<button class="btn btn-set" @click="getList()">查询</button>
					</view>
				</view>

				<!-- 操作区域按钮 -->
				<view class="panel-section operation-section" style="padding:24rpx;">
					<view class="operation-btns">
						<button class="btn btn-warning" @click="clearAll">取消配送</button>
						<button class="btn btn-primary" @click="submitData">提交配送</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 软键盘 -->
		<KeyboardInput @click.stop :isShow="isKeyBoardShow" @close="turnOffKeys" @confirm="handleKeyboardConfirm" />
	</view>
</template>

<script>
	var app = getApp();
	import Head from '@/pages/Home/Component/YWHead.vue';
	import NumberFormat from '@/components/NumberFormat/NumberFormat.vue';
	import KeyboardInput from '@/components/KeyboardInput/KeyboardInput.vue';
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _login from '@/api/business/login.js';
	import _init from '@/api/business/init.js';
	import _cake from '@/api/business/CakeYD.js';
	import _sysParam from '@/utils/sysParm/sysParm.js';
	import _query_sale from '@/api/business/query_sale.js';
	import mysale from '@/utils/sale/base_sale.js';
	import _ywbhqh from '@/api/business/ywbhqh.js';
	import _reserve from '@/api/business/extract.js';
	var that;

	export default {
		components: {
			Head,
			NumberFormat,
			KeyboardInput
		},
		data() {
			return {
				isKeyBoardShow: false,
				MainSale: {},
				BUSSINESS_NAME: '裱花要货配送',
				// 商品/门店列表数据
				listData: [],
				SPDATA: [],
				THKHDATA: [],
				filteredShopList: [],
				filteredGoodsList: [],

				// 下拉列表显示状态
				showDropdown_shop: false,
				showDropdown_goods: false,

				allChecked: false, // 全选状态

				// 选中状态
				currentIndex: -1,
				arrivalDate:'', // 选中日期
				selectedShopName: '',
				selectedShopCode: '',
				selectedProductName: '',
				selectedProductCode: '',
				selectedProductPrice: '',

				// 统计数据
				totalStats: {
					totalQuantity: 0, // 总配送量
					totalAmount: 0 // 总售价金额
				},

				scrollState: {},
				searchType: ''
			};
		},
		methods: {
			// 清空门店选择
			clearShop() {
				this.selectedShopName = '';
				this.selectedShopCode = '';
			},

			// 清空商品选择
			clearGoods() {
				this.selectedProductCode = '';
				this.selectedProductName = '';
			},
			// 日期选择
 			onDateChange(e) {
 				this.arrivalDate = e.detail.value;
 			},
			// 更新全选按钮状态
 			updateAllCheckedStatus() {
 				if (this.listData.length === 0) {
 					this.allChecked = false;
 					return;
 				}
 				this.allChecked = this.listData.every(item => item.isChecked);
 			},

 			// 全选/取消全选
 			handleAllCheck() {
 				const isAllChecked = !this.allChecked;
 				this.listData.forEach(item => {
 					item.isChecked = isAllChecked;
 				});

				this.calcTotalStats()
 			},
 			// 切换任务勾选状态
 			toggleTaskChecked(index,item) {
				item.isChecked = !item.isChecked;
 				// let it = this.listData[index];
 				// const check = it.isChecked;
 				// const bill_yd = it.BILL_YD;
 				// console.log("toggleTaskChecked:", it);
 				// this.listData.map((r, i, arr) => {
 				// 	if ((r.BILL_STATUS == '1' && r.BILL_YD && r.BILL_YD == bill_yd) || i == index) {
 				// 		r.isChecked = !check;
 				// 	}
 				// })

				this.calcTotalStats()
 			},
			// 计算统计总数（数量+金额）
			calcTotalStats() {
				const listData = this.listData.filter(item => item.isChecked);
				this.totalStats = listData.reduce((acc, cur) => {
					const quantity = Number(cur.ZQTY_SQ) || 0;
					const price = Number(cur.NET) || 0;

					acc.totalQuantity += quantity;
					acc.totalAmount += quantity * price;

					// 保留2位小数，避免精度问题
					acc.totalQuantity = Math.round(acc.totalQuantity * 100) / 100;
					acc.totalAmount = Math.round(acc.totalAmount * 100) / 100;
					return acc;
				}, {
					totalQuantity: 0,
					totalAmount: 0
				});
			},
			// 选择门店
			selectShop(item) {
				this.selectedShopName = item.SNAME;
				this.selectedShopCode = item.KHID;
				this.showDropdown_shop = false;
				this.isKeyBoardShow = false;
			},

			// 选择商品
			selectGoods(item) {
				this.selectedProductCode = item.SPID;
				this.selectedProductName = item.SNAME;
				this.showDropdown_goods = false;
				this.isKeyBoardShow = false;
			},

			//获取可售商品
			getSPDA: function() {
				let store = util.getStorage("store");
				_ywbhqh.GetBHRKSPDA(store.KHID, 'PS', store.DQID, store.KHZID, res => {
					if (res.code && res.msg.length > 0) {
						that.SPDATA = res.msg;
					} else {
						that.SPDATA = [];
					}
				});
			},

			// 获取门店列表
			getShopList: function() {
				let store = util.getStorage("store");
				_ywbhqh.GetPsKHList(res => {
					console.log("[GetPsKHList]门店数据：", res);
					if (res.code) {
						const tData = JSON.parse(res.data);
						that.THKHDATA = tData;
					} else {
						that.THKHDATA = [];
					}
				});
			},

			// 查询商品
			getList() {
				let data1 = {
					selectedShopCode : this.selectedShopCode || '',
					selectedProductCode : this.selectedProductCode || '',
					arrivalDate : this.arrivalDate || ''
				}
				_ywbhqh.BHQHZDPS(data1, res => {
					console.log("提交结果：", res);
					if (res.code) {
						let data = JSON.parse(res.data);
 						data.map(r => {
 							r.isChecked = false;
 						})
 						that.listData = data;

					} else {
						that.listData = []
					}
				})

				
			},

			// 提交数据
			submitData() {
				if (!common.CheckSign(1)) {
					return;
				}
				// 已选中项
				const listData = this.listData.filter(item => item.isChecked);
			
				if (!listData || listData.length === 0) {
					uni.showToast({
						title: '请先选择商品后再提交',
						icon: 'none',
						duration: 2000
					});
					return;
				}
			
				// 数据提交
				const data1 = listData

				let store = util.getStorage("store");
				util.simpleModal("提示", "是否提交配送？", (conf) => {
					if (conf) {
						console.log("提交数据：", data1);
						_ywbhqh.BHQHZDPS(data1, res => {
							console.log("提交结果：", res);
							if (res.code) {
								util.simpleModal("提示", res.msg);

								// 拉取数据
								this.resetRightForm();
								this.getList()
							} else {
								util.simpleMsg(res.msg, true);
							}
						})
					}
				})
			},

			// 重置右侧表单
			resetRightForm() {
				this.selectedShopName = '';
				this.selectedShopCode = '';
				this.selectedProductCode = '';
				this.selectedProductName = '';
				this.arrivalDate = '';
			},

			// 软键盘确认处理
			handleKeyboardConfirm(query) {
				const keyword = query.query.trim()
				if (this.searchType == 'good') {
					this.showDropdown_goods = true;
					if (!keyword) {
						this.filteredGoodsList = this.SPDATA;
					} else {
						this.filteredGoodsList = this.SPDATA.filter(item => {
							if (!item.SPID && !item.PINYIN) return false;
							return item.SPID.includes(keyword) || item.PINYIN.toUpperCase().includes(keyword);
						});
					}
				} else if (this.searchType == 'shop') {
					this.showDropdown_shop = true
					if (!keyword) {
						this.filteredShopList = this.THKHDATA;
					}

					this.filteredShopList = this.THKHDATA.filter(item => {
						if (!item.KHID && !item.PINYIN) return false;
						return item.KHID.includes(keyword) || item.PINYIN.toUpperCase().includes(keyword);
					});
				}
			},

			// 隐藏所有弹窗
			hideAllPopups() {
				this.isKeyBoardShow = false;
				this.showDropdown_goods = false;
				this.showDropdown_shop = false;
			},

			// 关闭键盘
			turnOffKeys() {
				this.isKeyBoardShow = false;
			},

			// 延迟关闭下拉列表
			delayCloseGoodsDropdown() {
				setTimeout(() => {
					this.showDropdown_goods = false;
				}, 200);
			},
			delayCloseShopDropdown() {
				setTimeout(() => {
					this.showDropdown_shop = false;
				}, 200);
			},

			// 显示软键盘
			showBorad(searchType) {
				this.searchType = searchType;
				this.isKeyBoardShow = !this.isKeyBoardShow;
				if (!this.isKeyBoardShow) {
					this.showDropdown_shop = false;
					this.showDropdown_goods = false;
				}
			},

			// 初始化滚动处理器
			initScrollHandler() {
				const scrollY = this.$refs.scrollY;
				if (!scrollY) return;

				scrollY.addEventListener('touchstart', (e) => {
					if (e.touches.length !== 1) return;
					const touch = e.touches[0];
					this.scrollState = {
						startX: touch.clientX,
						startY: touch.clientY,
						startScrollTop: scrollY.scrollTop,
						scrollDirection: null,
						isScrolling: false
					};
				}, {
					passive: true
				});

				scrollY.addEventListener('touchmove', (e) => {
					if (e.touches.length !== 1) return;
					if (!this.scrollState.startX && this.scrollState.startX !== 0) return;

					const touch = e.touches[0];
					const deltaX = touch.clientX - this.scrollState.startX;
					const deltaY = touch.clientY - this.scrollState.startY;
					const absDeltaX = Math.abs(deltaX);
					const absDeltaY = Math.abs(deltaY);

					if (!this.scrollState.scrollDirection) {
						if (absDeltaX > 5 || absDeltaY > 5) {
							this.scrollState.scrollDirection = absDeltaX > absDeltaY ? 'horizontal' : 'vertical';
							this.scrollState.isScrolling = true;
						} else {
							return;
						}
					}

					if (this.scrollState.scrollDirection === 'vertical') {
						const maxScrollTop = scrollY.scrollHeight - scrollY.clientHeight;
						const newScrollTop = this.scrollState.startScrollTop - deltaY;
						const limitedScrollTop = Math.max(0, Math.min(maxScrollTop, newScrollTop));
						scrollY.scrollTop = limitedScrollTop;
						e.preventDefault();
					}
				}, {
					passive: false
				});

				scrollY.addEventListener('touchend', () => {
					this.scrollState.scrollDirection = null;
					this.scrollState.isScrolling = false;
				}, {
					passive: true
				});

				scrollY.addEventListener('touchcancel', () => {
					this.scrollState.scrollDirection = null;
					this.scrollState.isScrolling = false;
				}, {
					passive: true
				});
			}
		},
		// 监听列表数据变化，自动更新全选状态
 		watch: {
 		
 		},
		created() {
			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale", uni);
		},
		onLoad: async function() {
			that = this;

			await that.getList() // 获取页面数据
			
			that.calcTotalStats();
			that.getSPDA(); // 获取商品数据
			that.getShopList(); // 获取门店数据
			
			console.log("页面加载完成");
		},
		onUnload() {
		},
		mounted() {
			this.$nextTick(() => {
				this.initScrollHandler();
			});
		},
		beforeDestroy() {
			const scrollY = this.$refs.scrollY;
			if (scrollY) {
				scrollY.removeEventListener('touchstart', this.handleTouchStart);
				scrollY.removeEventListener('touchmove', this.handleTouchMove);
				scrollY.removeEventListener('touchend', this.handleTouchEnd);
				scrollY.removeEventListener('touchcancel', this.handleTouchEnd);
			}
		}
	}
</script>

<style scoped>
	@font-face {
		font-family: 'Bahnschrift';
		src: url('../../images/imgbh/bahnschrift.ttf') format('truetype');
		/* ttf格式用truetype */
		font-weight: normal;
		/* 常规字重 */
		font-style: normal;
	}

	page-body,
	page-refresh,
	page {
		height: 100%;

	}

	.banbenhao {
		position: fixed;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #999;
		padding: 0 3%;
		font-weight: 600;
	}

	.centre {
		width: 100%;
		height: 100vh;
		position: relative;
		position: fixed;
		top: 0;
		left: 0;
		background-image: url('../../images/bigbg.jpg');
		background-size: cover;
		background-repeat: no-repeat;
		background-position: left top;
	}

	.centre .bg {
		position: absolute;
		width: 100%;
		height: 100% !important;
		top: 0;
		left: 0;
	}



	/* 模块 */
	.content-container {
		display: flex;
		width: 100%;
		height: calc(100vh - 100rpx);
		padding: 10rpx 2%;
		box-sizing: border-box;
		gap: 24rpx;
	}
	.page-title {
		font-weight: 500;
		font-size: 34rpx;
		color: #111111;
		margin-bottom:24rpx;
	}

	/* 左侧卡片列表 */
	.card-list {
		flex: 1;
		overflow-y: auto;
		gap: 24rpx;
		padding: 24rpx;
		box-sizing: border-box;
		height: 86vh;

		background: #FFFFFF;
		border-radius: 24rpx;
		position: relative;
	}
	.fixed-col1 {
 		position: sticky;
 		left: 0rpx !important;
 		min-width: 36rpx;
 		z-index: 10 !important;
 	}

 	.fixed-col2 {
 		position: sticky;
 		left:76rpx !important;
 		min-width: 54rpx;
 		z-index: 11 !important;
 	}

 	.fixed-col3 {
 		position: sticky;
 		left: 176rpx !important;
 		min-width: 160rpx;
 		z-index: 12 !important;
 		text-align: left;
 	}
	.table-scroll-x {
 		width: 100%;
 		height: 96%;
 		overflow-x: auto;
 		overflow-y: auto;
 		-webkit-overflow-scrolling: touch;
 		position: relative;
 		white-space: nowrap;
 	}

 	/* 纵向滚动层 - 负责纵向滚动 */
 	.table-scroll-y {
 		height: 96%;

 		-webkit-overflow-scrolling: touch;
 		position: relative;
 		display: inline-block;
 		min-width: 100%;
 	}

 	/* 表头样式 */
 	.table-header {
 		background-color: #FDFDFE;
 		position: sticky;
 		top: -2rpx;
 		/* table的sticky定位要设top:0 */
 		z-index: 15;
 	}

 	/* 表头单元格 */
 	thead th {
 		background-color: #FDFDFE;
 		position: sticky;
 		top: -2rpx;
 		z-index: 10;
 		padding: 20rpx 20rpx;
 		text-align: center;
 		font-size: 30rpx;
 		color: #333;
 		white-space: nowrap;
 		font-weight: 400;
 	}

 	.table-header .th {
 		z-index: 14 !important;
 	}


	/* 核心表格样式 */
 	.data-table {
 		width: 100%;
 		border-collapse: collapse;
 		/* 合并单元格边框，避免间隙 */
 		background-color: #fff;

 	}

 	/* 确保 sticky 在浏览器中正常工作 */
 	/* 针对不同浏览器的兼容性写法 */
 	@supports (position: sticky) or (position: -webkit-sticky) {
 		.data-table thead th {
 			position: -webkit-sticky;
 			position: sticky;
 			top: 0;
 		}
 	}

 	/* 复选框表头单独样式 */
 	.th-checkbox {
 		width: 80rpx;
 		cursor: pointer;
 	}

 	/* 表体单元格 */
 	tbody td {
 		padding: 20rpx 20rpx;
 		text-align: center;
 		font-size: 30rpx;
 		color: #111111;
 		white-space: nowrap;
 		font-weight: bold;
 		/* 禁止文字换行 */
 		overflow: hidden;
 		/* 超长内容隐藏 */
 		text-overflow: ellipsis;
 		/* 超长显示省略号 */
 		position: relative;
 		background-color: #FFF;


 	}

	/* 偶数行背景色 */
 	.tr-even td {
 		background-color: #F8F8F8;
 	}

	.tr-checked td {
		background: #E1F2E2;
		color:#42B14B;
	}


 	/* 生产状态颜色 */
 	.status-text {
 		padding: 4rpx 12rpx;
 		border-radius: 4rpx;
 		font-size: 24rpx;
 	}

 	.status-canceled {
 		color: #F39017;
 	}

 	.status-stored {
 		color: #006537;
 	}

 	.centre>.bottom-bar:last-child {
 		position: fixed;
 		bottom: 0;
 		left: 0;
 		background-color: #fff;
 	}

 	/* 勾选框样式 */
 	.tranlist-list .task-checkbox {
 		position: relative;
 		top: 0;
 		left: 0;
 		bottom: 0;
 		right: 0;
 	}

 	/* 勾选框样式 */
 	.task-checkbox {
 		width: 32rpx;
 		height: 32rpx;
 		border-radius: 50%;
 		display: flex;
 		align-items: center;
 		justify-content: center;
 		flex-shrink: 0;
 		transition: all 0.2s ease;
 		border: 2rpx solid #42B14B;
 		position: absolute;
 		right: 20%;
    	top: 22rpx;
 	}

 	.task-checkbox.checked {
 		background-color: #4caf50;
 		border-color: #4caf50;
 	}

 	.task-checkbox-none {
 		background-color: #D8D8D8;
 		border-color: #ECECEC;
 	}

 	.check-icon {
 		color: #fff;
 		font-size: 24rpx;
 		font-weight: bold;
 	}

 	/* 隐藏所有滚动容器的滚动条 - 通用方案 */
 	::-webkit-scrollbar {
 		width: 0 !important;
 		/* 纵向滚动条宽度设为0 */
 		height: 0 !important;
 		/* 横向滚动条高度设为0 */
 		display: none !important;
 		/* 直接隐藏滚动条 */
 	}

 	/* 针对表格滚动容器单独处理（增强兼容性） */
 	.table-container::-webkit-scrollbar,
 	.table-scroll-x::-webkit-scrollbar,
 	.table-scroll-y::-webkit-scrollbar {
 		display: none;
 		width: 0;
 		height: 0;
 	}

 	/* 兼容非webkit内核（如Firefox） */
 	.table-container,
 	.table-scroll-x,
 	.table-scroll-y {
 		scrollbar-width: none;
 		/* Firefox隐藏滚动条 */
 		-ms-overflow-style: none;
 		/* IE/Edge隐藏滚动条 */
 	}

 	/* 页面整体滚动条隐藏（可选） */
 	page,
 	.centre,
 	.tranlist {
 		-ms-overflow-style: none;
 		scrollbar-width: none;
 	}

 	page::-webkit-scrollbar,
 	.centre::-webkit-scrollbar,
 	.tranlist::-webkit-scrollbar {
 		display: none;
 	}


	/* 右侧面板 */
	.side-panel {
		width: 30%;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		height: 86vh;
	}

	.panel-section {
		background: #fff;
		border-radius: 24rpx;
		padding: 24rpx 24rpx 0;
		box-sizing: border-box;
	}

	.operation-section {
		/* flex:1; */
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
		background: #006B44;
		padding: 16rpx 20rpx;
		margin: -24rpx -24rpx 24rpx -24rpx;
		border-radius: 24rpx 24rpx 0 0;
	}

	.stat-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
		font-size: 28rpx;
	}

	.stat-item.waste .stat-label,
	.stat-item.waste .stat-value {
		color: #E7840A;
		font-size: 28rpx;
	}

	.stat-label {
		color: #111111;
		font-weight: 600;
	}

	.stat-value {
		color: #111111;
		font-weight: 600;
		font-size: 32rpx;
	}

	.form-item {
		margin-bottom: 24rpx;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.form-label {
		font-size: 28rpx;
		color: #111111;
		margin-bottom: 12rpx;
		margin-right: 16rpx;
		display: block;
	}

	.form-label.waste-label {
		color: #ff7d00;
	}

	.form-picker {
		flex: 1;
		border: 2rpx solid #e5e5e5;
		border-radius: 8rpx;
		height: 64rpx;
		/* padding: 16rpx; */
	}

	/deep/ .uni-input-input {
		color: #111;
		font-size: 28rpx;
	}

	/deep/ .uni-input-placeholder {
		font-size: 28rpx;
	}

	.picker-value {
		font-size: 28rpx;
		color: #333;
	}

	/* 	.count-item {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	} */
	.count-control {
		flex: 1;
		display: flex;
		align-items: center;
		border: 2rpx solid #e5e5e5;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.count-btn {
		width: 60rpx;
		height: 64rpx;
		background: #EEEEEE;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.count-btn image {
		transform: scale(0.6);
	}

	.count-input {
		flex: 1;
		height: 60rpx;
		text-align: center;
		border: none;
		font-size: 28rpx;
	}

	.operation-btns {
		display: flex;
		gap: 20rpx;
	}

	.operation-btns-btng {
		position: absolute;
		width: 92%;
		left: 50%;
		transform: translateX(-50%);
		bottom: 24rpx;
	}

	.operation-btns-btng .btn-set {
		background: rgba(66, 177, 75, 0.001);
		border-radius: 16rpx;
		border: 2rpx solid rgba(66, 177, 75, 0.4);
		color: #006637;
		font-weight: bold;
	}


	.btn {
		flex: 1;
		border-radius: 8rpx;
		font-size: 32rpx;
		border: none;
		padding: 12rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-secondary {
		color: #006637;
		background: #EEEEEE;
		border-radius: 16rpx;
		font-weight: 600;
	}

	.btn-warning {
		color: #fff;
		background: #F39017;
		border-radius: 16rpx;
		font-weight: 600;
	}

	.btn-primary {
		color: #fff;
		background: #42B14B;
		border-radius: 16rpx;
		font-weight: 600;
	}

	.filter-picker-date,
 	.filter-input {
 		flex: 1;
 		height: 72rpx;
 		line-height: 72rpx;
 		border: 1rpx solid #E5E5E5;
 		border-radius: 8rpx;
 		padding: 0 20rpx 0 8rpx;
 		font-size: 26rpx;
 		color: #999;
 		box-sizing: border-box;
 	}
	.picker-label {
 		color: #111;
 		font-size: 28rpx;
 	}
	.picker-placeholder {
 		color: gray;
 		font-size: 28rpx;
 	}

</style>