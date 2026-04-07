<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/takeexchange.css);
</style>

<template>
	<!-- 当日外卖订单 页面-->
	<view class="content" @click="hideAllPopups">
		<PrinterPage ref="printerPage" style="display: none;" />

		<view class="right">
			<!-- 第一步外卖单 -->
			<view v-if="!showExchange" class="full-screen">
				<view class="neik">
					<view class="listof">
						<view class="prolist" style="display: flex;flex-direction: column;">
							<view :class="exit_btn ? 'hh add-top' : 'hh'">
								<view class="hotcakes">
									<image src="../../images/waimaidan.png" mode="widthFix"></image>外卖订单换货(当日)
								</view>
								<view style="gap:20rpx;">
									<view class="sousuo" @click="GetOrders(KHID)">
										<image src="../../images/imgbh/cd@1x.png"
											style="filter: grayscale(1)invert(1)brightness(30.5);" mode="widthFix">
										</image>刷新
									</view>
									<view class="sousuo" v-if="exit_btn" @click="Exit()">
										<image src="../../images/tuichu.png"
											style="filter: grayscale(1)invert(1)brightness(30.5);" mode="widthFix">
										</image>退出
									</view>
								</view>
							</view>
							<NoData v-if="WMOrders.length==0"></NoData>
							<view class="products" style="flex:1;margin-bottom:60rpx;" v-else>
								<view class="procycle">
									<!-- 外卖单循环 -->
									<view class="li" :class="curIndex === index? 'curr':' '"
										v-for="(item,index) in WMOrders" :order="item" @click="chooseOrder(item,index)">
										<view class="h3">
											<view class="platform">
												<label>单号:{{ item.BILL }}</label>
												<!-- <label class="state peisong"><text>●</text>配送</label> -->
											</view>
											<view class="znet">￥{{item.TNET}}</view>
										</view>
										<view class="ps-cods">
											<label><text>顾客：</text><text>{{item.CUSTMNAME}}</text></label>
											<label><text>电话：</text><text>{{item.CUSTMPHONE}}</text></label>
										</view>
										<view class="ps-cods">
											<label><text>备注：</text><text>{{item.CUSTMCOMM}}</text></label>
										</view>
										<view class="address">
											<view>销售时间：{{item.SALETIME}}</view>
											<view class="hhuo">
												<view v-if="curIndex === index" class="hhuo-btn"
													@click="ShowDetail(item,index)">换货</view>
											</view>
										</view>

										<view class="before_line" v-if="curIndex !== index"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 第二部外卖单换货 -->
			<view v-else class="full-screen">
				<view class="neik" stle="width:100%;height: 100%;">
					<view class="listof">
						<view class="prolist" style="display: flex;flex-direction: column;">
							<view class="top-wm">
								<view :class="exit_btn ? 'hh add-top hotcakes' : 'hh hotcakes'"
									style="padding-top: 36rpx;">
									<view class="">外卖单换货</view>
									<view style="gap:20rpx;">
										<view class="sousuo" @click="Exit()">
											<image src="../../images/tuichu.png"
												style="filter: grayscale(1)invert(1)brightness(30.5);" mode="widthFix">
											</image>退出
										</view>
									</view>
								</view>
								<view class="content-container">
									<!-- 左侧 -->
									<view class="exchange-left-panel">
										<!-- 换前商品 -->
										<view class="exchange-original-section">
											<view class="section-header">
												<text class="section-titles">换前商品</text>
												<text class="section-date">{{ todayDate }}</text>
											</view>
											<div class="table-wrapper">
												<table class="data-table">
													<thead>
														<tr>
															<th>序号</th>
															<th>订单商品</th>
															<th>商品编码</th>
															<th>品类</th>
															<th>规格</th>
															<th>可换数量</th>
															<th>单价</th>
															<th>总价</th>
															<th>外卖单号</th>
														</tr>
													</thead>
													<tbody>
														<tr v-for="(item, idx) in originalGoodsList" :key="idx"
															@click="selectProduct(item,idx)" :class="{ 
														active: currentIndex === idx,
														exchanged: isExchanged(item) 
													}">
															<td>{{ idx + 1 }}</td>
															<td>{{ item.SNAME }}</td>
															<td>{{ item.SPID.slice(8) }}</td>
															<td>{{ item.ZLID }}-{{ item.ZL_NAME }}</td>
															<td>{{ item.SPECS }}</td>
															<td>{{ item.QTY }}</td>
															<td>¥{{ item.PRICE }}</td>
															<td>¥{{ item.NET }}</td>
															<td>{{ item.BILL }}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</view>

										<!-- 已换商品 -->
										<view class="exchange-finished-section">
											<view class="section-header">
												<text class="section-titles section-titles-yh">已换商品</text>
											</view>
											<div class="table-wrapper">
												<table class="data-table data-table-hh">
													<thead>
														<tr>
															<th class="th-checkbox th" @click="handleAllCheck()">
																<view class="task-checkbox"
																	:class="{ 'checked': allChecked }">
																	<image v-show="allChecked" class="check-icon"
																		src="@/images/imgbh/gou@1x.png" mode="widthFix">
																	</image>
																</view>
															</th>
															<th>序号</th>
															<th>换后商品</th>
															<th>商品编码</th>
															<th>规格</th>
															<th>数量</th>
															<th>单价</th>
															<th>总价</th>
															<th>差额</th>
															<th>换前商品</th>
														</tr>
													</thead>
													<tbody>
														<tr v-for="(item, idx) in exchangedGoodsList" :key="idx"
															:class="[idx % 2 == 1 ? 'tr-even' : '', item.isChecked ? 'tr-checked' : '']">
															<td class="td-checkbox">
																<view @click="toggleTaskChecked(item)"
																	class="task-checkbox"
																	:class="{ 'checked': item.isChecked }">
																	<image v-show="item.isChecked" class="check-icon"
																		src="@/images/imgbh/gou@1x.png" mode="widthFix">
																	</image>
																</view>
															</td>
															<td>{{ idx + 1 }}</td>
															<td>{{ item.exchangedName }}</td>
															<td>{{ item.exchangedCode }}</td>
															<td>{{ item.spec }}</td>
															<td>{{ item.qty }}</td>
															<td>¥{{ item.price }}</td>
															<td>¥{{ item.totalPrice }}</td>
															<td>¥{{ item.diffPrice }}</td>
															<td>{{ item.originalName }}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</view>
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
												<text class="stat-label">换货量</text>
												<NumberFormat class="stat-value" :value="totalStats.exchangeQuantity" />
											</view>
											<view class="stat-item waste">
												<text class="stat-label">换货差额</text>
												<NumberFormat class="stat-value" :value="totalStats.exchangeAmount" />
											</view>
										</view>

										<!-- 操作区 -->
										<view class="panel-section operation-section" style="flex:1;position:relative;">
											<view class="section-title">操作</view>
											<view class="form-item">
												<text class="form-label">商品名称</text>
												<view class="form-picker" style="flex:1;position: relative;">
													<input @click.stop="showBorad('good')"
														style="height:100%;width:100%;padding-left: 6rpx;" disabled
														v-model="selectedProductItem.SNAME" placeholder="请选择商品"
														class="filter-picker" @focus="showDropdown_goods = true"
														@blur="delayCloseGoodsDropdown" />
													<view
														style="opacity: 0;position: absolute;left:0;top:0;height:100%;width:100%"
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
												<image src="../../images/imgbh/rjp@1.5x.png"
													style="width:40rpx;height:40rpx;margin-left:10rpx"
													@click.stop="showBorad('good')" mode="widthFix"></image>
											</view>
											<view class="form-item">
												<text class="form-label">商品编码</text>
												<input class="form-picker" placeholder="请输入商品编码"
													style="background:#F5F5F5;padding-left: 6rpx;" disabled
													v-model="selectedProductItem.SPID" />
											</view>
											<view class="form-item count-item">
												<text class="form-label">换货量</text>
												<view class="count-control">
													<view class="count-btn">
														<image v-if="currentCount.totalAmount>0"
															src="../../images/imgpro/jian_ky.png" mode="widthFix"
															@click="changeCount('totalAmount', YN_ZS === 'Y' ? -1 : -0.1)">
														</image>
														<image v-else src="../../images/imgpro/jian_jy.png"
															mode="widthFix"></image>
													</view>
													<!-- 正品数量输入框：根据YN_ZS限制输入类型 -->
													<input class="count-input" type="number"
														v-model="currentCount.totalAmount"
														:maxlength="YN_ZS === 'Y' ? 5 : 7" inputmode="numeric"
														pattern="\d*(\.\d+)?"
														@input="limitNumberRange('totalAmount')" />
													<view class="count-btn">
														<image src="../../images/imgpro/jia.png" mode="widthFix"
															@click="changeCount('totalAmount', YN_ZS === 'Y' ? 1 : 0.1)">
														</image>
													</view>
												</view>
											</view>
											<view class="operation-btns operation-btns-btng">
												<button class="btn btn-set" @click="clearGoods()">取消</button>
												<button class="btn btn-set" @click="tempSave()">添加</button>
											</view>
										</view>

										<!-- 操作区域按钮 -->
										<view class="panel-section operation-section" style="padding:24rpx;">
											<view class="operation-btns">
												<button class="btn btn-secondary" @click="clearSelected">删除选中</button>
												<button class="btn btn-secondary"
													@click="saveProductListToCache">查询外卖单</button>
											</view>
											<view class="operation-btns" style="margin-top: 32rpx;">
												<button class="btn btn-warning" @click="clearAll">清空整单</button>
												<button class="btn btn-primary" @click="submitData">提交</button>
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


		<!-- 软键盘 -->
		<KeyboardInput :custom-style="myKeyboardStyle" @click.stop :isShow="isKeyBoardShow" @close="turnOffKeys"
			@confirm="handleKeyboardConfirm" />
	</view>
</template>

<script>
	var app = getApp();
	import Req from '@/utils/request.js';
	import common from '@/api/common.js';
	import db from '@/utils/db/db_excute.js';
	import dateformat from '@/utils/dateformat.js';
	import util from '@/utils/util.js';
	import _take from '@/api/business/takeaway.js';
	import _member from '@/api/hy/MemberInterfaces.js';
	import _ywbhqh from '@/api/business/ywbhqh.js';
	//打印相关
	import PrinterPage from '@/pages/xprinter/receipt';
	//软键盘
	import KeyboardInput from '@/components/KeyboardInput/KeyboardInput.vue';
	var that;
	export default {
		components: {
			PrinterPage,
			KeyboardInput
		},
		data() {
			return {
				KHID: getApp().globalData.store.KHID,
				POSID: getApp().globalData.store.POSID,
				NAME: getApp().globalData.store.NAME,
				RYID: getApp().globalData.store.RYID,
				KCDID: getApp().globalData.store.KCDID,
				DQID: getApp().globalData.store.DQID,
				GSID: getApp().globalData.store.GSID,
				GCID: getApp().globalData.store.GCID,
				RYNAME: getApp().globalData.store.RYNAME,
				KHZID: getApp().globalData.store.KHZID,
				BMID: getApp().globalData.store.BMID,
				brand: getApp().globalData.brand,
				WMOrders: [],
				Order: {},
				OrderDeails: [],
				Details: [],
				statements: false,
				Alphabetical: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				coupon_list: [],
				yn_bs: false,
				yn_wmd: false,
				BSDATA: [],
				bs_Reason: "",
				bs_Note: "",
				new_bill: "", //单据操作后新生成的单号
				curIndex: 0,
				WMDDATA: [],
				//打印相关
				jpgWidth: 1,
				jpgHeight: 1,
				qrCodeWidth: 256, //二维码宽
				qrCodeHeight: 256, // 二维码高
				canvasGZHWidth: 1,
				canvasGZHHeight: 1,
				yn_qr: false, //确认按钮
				yn_ty: false, //同意按钮
				yn_jj: false, //拒绝按钮
				js_res: {}, //确认接收返回结果
				exit_btn: true, //是否显示退出按钮
				event_channel: null,

				myKeyboardStyle: {
					zIndex: 999999,
					backgroundColor: '#fff',
					boxShadow: '0 -6px 10px rgb(255,255,255), 0 4px 15px rgba(0,0,0,0.3)',
					borderRadius: '22rpx',
					width: '1400rpx',
					padding: '0 30rpx 0',
					position: 'absolute',
					bottom: '180rpx',
					left: '60rpx',
					transform: 'none' // 因为你 left:10% 不需要居中
				},

				todayDate: '',
				// 换前商品（原订单商品）
				originalGoodsList: [],
				// 已换商品
				exchangedGoodsList: [],
				showExchange: false, // 是否显示换货
				isKeyBoardShow: false,
				allChecked: false, // 全选状态
				// 商品列表数据
				SPDATA: [],
				showDropdown_goods: false, // 
				filteredGoodsList: [], // 过滤后的 商品列表

				selectedOriginalItem: null, // 选中的商品
				currentIndex: -1, // 当前选中的商品索引
				// 统计数据
				totalStats: {
					totalAmount: 0,
					exchangeQuantity: 0,
					exchangeAmount: 0
				},

				YN_ZS: 'Y', // 是否限制整数输入（Y=仅整数，N=可输入小数）

				// 当前操作数量
				// selectedGoodsPrice: 0,
				// selectedProductName: '',
				// selectedProductZlid :'',
				// selectedProductCode: '', // 商品名称/编码
				selectedProductItem: {
					SNAME: "",
					SPID: "",
					ZLID: "",
					SPECS: "",
					CCCZ: ""
				},
				currentCount: {
					totalAmount: 0,
				},
				scrollState: {},
				searchType: '', // 当前搜索类型
				priceLimit: {
					min: 0,
					max: 0
				}, //价格区间

			}
		},
		// 监听列表数据变化，自动更新全选状态
		watch: {
			// 深度监听exchangedGoodsList的变化
			exchangedGoodsList: {
				handler() {
					this.updateAllCheckedStatus();
				},
				deep: true
			}
		},
		methods: {
			onLoad: function(option) {
				console.log("TakeExchange.onLoad!");
				that = this;
				// this.event_channel = this.getOpenerEventChannel();
				// this.event_channel?.emit('get_take_away', this);

				that.getTodayDate();
				that.calcExchangeStats(); // 已换商品统计
				that.getSPDA();

				that.GetOrders(that.KHID); //列表初始化
			},
			// 判断商品是否已经换过
			isExchanged(item) {
				return this.exchangedGoodsList.some(ex => ex.originalSpid === item.SPID);
			},
			// 获取当天日期
			getTodayDate() {
				const date = new Date();
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				this.todayDate = `${year}-${month}-${day}`;
			},
			// 更新全选按钮状态
			updateAllCheckedStatus() {
				if (this.exchangedGoodsList.length === 0) {
					this.allChecked = false;
					return;
				}
				this.allChecked = this.exchangedGoodsList.every(item => item.isChecked);
			},

			// 全选/取消全选
			handleAllCheck() {
				const isAllChecked = !this.allChecked;
				this.exchangedGoodsList.forEach(item => {
					item.isChecked = isAllChecked;
				});
			},
			// 切换任务勾选状态
			toggleTaskChecked(item) {
				item.isChecked = !item.isChecked
			},
			showBorad(searchType) {
				this.searchType = searchType
				this.isKeyBoardShow = !this.isKeyBoardShow;
				if (!this.isKeyBoardShow) {
					this.showDropdown_shop = false
					this.showDropdown_goods = false
				}
			},
			// 重置右侧
			resetRightForm() {
				this.selectedProductItem = {
					SNAME: "",
					SPID: "",
					ZLID: "",
					SPECS: "",
					CCCZ: "",
				};
				this.currentCount = {
					totalAmount: 0
				};
			},
			handleKeyboardConfirm(query) {
				const keyword = query.query.trim()
				console.log("handleKeyboardConfirm:", keyword + "," + this.searchType);
				if (this.searchType == 'good') {
					this.showDropdown_goods = true
					if (!keyword) {
						this.filteredGoodsList = this.SPDATA;
					} else {
						this.filteredGoodsList = this.SPDATA.filter(item => {
							if (!item.SPID && !item.PINYIN) return false;
							if (item.SPID.includes(keyword) || item.PINYIN.toUpperCase().includes(keyword))
								return true;
							else
								return false;
						});
					}
				}
			},
			hideAllPopups() {
				this.isKeyBoardShow = false;
				this.showDropdown_goods = false;
			},
			turnOffKeys() {
				this.isKeyBoardShow = false
			},
			delayCloseGoodsDropdown() {
				setTimeout(() => {
					this.showDropdown_goods = false;
				}, 200);
			},

			// ======================
			// 1. 取消按钮（你要的）
			// ======================
			clearGoods() {
				this.resetRightForm();
			},

			// ======================
			// 点击换前商品表格选中
			// ======================
			selectProduct(item, index) {
				if (item.QTY <= 0) {
					util.simpleMsg("该商品暂无可换数量！")
					return;
				}
				this.currentIndex = index;
				this.selectedOriginalItem = item; // 只存换前商品
			},

			getSPDA: function() {
				let store = util.getStorage("store");
				_ywbhqh.GetSPDA(store.KHID, res => {
					if (res.code && res.msg.length > 0) {
						that.SPDATA = res.msg;
					} else {
						that.SPDATA = []
					}
				}, "Y", store.KHZID, store.DQID);
			},

			// 统计已换商品
			calcExchangeStats() {
				let totalAmount = 0;
				let totalQty = 0;
				let totalDiff = 0;

				this.exchangedGoodsList.forEach(item => {
					totalQty += item.qty;
					totalAmount += item.totalPrice;
					totalDiff += item.diffPrice;
				});

				this.totalStats = {
					totalAmount: totalAmount,
					exchangeQuantity: totalQty,
					exchangeAmount: totalDiff
				};
			},

			changeCount(type, step) {
				let currentVal = this.currentCount[type] || 0;
				const magnifiedCurrent = Math.round(parseFloat(currentVal) * 100);
				const magnifiedStep = Math.round(step * 100);
				let magnifiedNew = magnifiedCurrent + magnifiedStep;
				let newVal = magnifiedNew / 100;
				const minVal = this.YN_ZS === 'Y' ? 0 : 0;
				newVal = Math.max(minVal, newVal);
				this.$set(this.currentCount, type, Number(newVal.toFixed(2)));
			},
			selectGoods(item) {
				this.selectedProductItem = item;
				console.log("选择的商品：", item);
				// this.selectedProductCode = item.SPID;
				// this.selectedProductName = item.SNAME;
				// this.selectedProductZlid = item.ZLID;
				// this.selectedProductSpecs = item.SPECS;
				// this.selectedGoodsPrice = item.PRICE || 0;
				this.YN_ZS = item.YN_ZS || 'Y';
				this.showDropdown_goods = false;
				this.isKeyBoardShow = false;
			},
			//追加换货商品
			tempSave() {
				if (!this.selectedOriginalItem) {
					util.simpleMsg('请在左侧选择被换的商品!', 'none');
					return;
				}
				if (!this.selectedProductItem.SNAME) {
					util.simpleMsg('请搜索后选择要更换的商品!', 'none');
					return;
				}
				if (this.selectedProductItem.SPID == this.selectedOriginalItem.SPID) {
					util.simpleMsg('不能更换为相同的商品!', 'none');
					return;
				}
				let _qty = 0;
				let spArr = this.exchangedGoodsList.filter(r => r.originalSpid == this.selectedOriginalItem?.SPID);
				if (spArr.length > 0) {
					_qty = spArr.reduce((acc, cur) => acc + cur.qty, 0);
				}
				if (this.currentCount.totalAmount <= 0) {
					util.simpleMsg('请输入要换货的数量!', 'none');
					return;
				}
				if ((_qty + this.currentCount.totalAmount) > this.selectedOriginalItem.QTY) {
					util.simpleMsg('待换货数量加上已换货数量不能多于原商品的可换数量!', 'none');
					return;
				}
				if (this.selectedProductItem.ZLID != this.selectedOriginalItem.ZLID) {
					util.simpleMsg('换货商品与原商品品类不一致!', 'none');
					return;
				}
				let obj = util.getStorage("sysParam");
				//是裱花类要判断规格和尺寸，都要满足才行
				if (obj && obj.BHLBBM && obj.BHLBBM?.includes(this.selectedOriginalItem.ZLID)) {
					if (this.selectedProductItem.SPECS != this.selectedOriginalItem.SPECS && this.selectedProductItem
						.CCCZ != this.selectedOriginalItem.CCCZ) {
						util.simpleMsg('换货商品与原商品尺寸不一致', 'none');
						return;
					}
				}

				const oldItem = this.selectedOriginalItem;
				const qty = parseFloat(this.currentCount.totalAmount || 1);
				const oldPrice = parseFloat(oldItem.PRICE || 0);
				const newPrice = parseFloat(this.selectedProductItem.PRICE || 0);
				const oldTotal = util.newFloat(oldPrice * qty);
				const newTotal = util.newFloat(newPrice * qty);
				const diffPrice = util.newFloat(newTotal - oldTotal);
				if (Math.abs(diffPrice) < this.priceLimit.min || Math.abs(diffPrice) > this.priceLimit.max) {
					util.simpleMsg('超出可换货价差范围', 'none');
					return;
				}
				console.log("this.exchangedGoodsList", this.exchangedGoodsList);
				console.log("this.selectedProductItem", this.selectedProductItem);
				console.log("this.selectedOriginalItem", this.selectedOriginalItem);
				let spObj = this.exchangedGoodsList.find(r => r.exchangedCode == this.selectedProductItem?.SPID && r
					.originalSpid == oldItem.SPID);
				if (spObj) //有相同的就累加
					spObj.qty += qty;
				else {
					let newItem = {
						exchangedName: this.selectedProductItem.SNAME,
						exchangedCode: this.selectedProductItem.SPID,
						exchangedPlid: this.selectedProductItem.PLID,
						spec: oldItem.SPECS || '',
						qty: qty,
						price: newPrice,
						oldPrice: oldPrice,
						totalPrice: newTotal,
						diffPrice: diffPrice,
						originalName: oldItem.SNAME || '',
						originalSpid: oldItem.SPID,
						originalPlid: oldItem.PLID,
						isChecked: false,
					};

					this.exchangedGoodsList.push(newItem);
				}
				this.calcExchangeStats();
				this.currentIndex = -1;
				this.selectedOriginalItem = null;
				this.resetRightForm();
			},

			// 查询外卖单
			saveProductListToCache() {
				this.showExchange = false;
				this.currentIndex = -1;
				this.selectedOriginalItem = null;
				this.exchangedGoodsList = [];
				this.resetRightForm();
				// 清空
				this.calcExchangeStats();
				// 查询外卖单
				this.GetOrders(this.KHID, () => {});
			},

			// 删除选中
			clearSelected() {
				const checkedItems = this.exchangedGoodsList.filter(item => item.isChecked)

				// 如果没有勾选任何商品，给出提示
				if (checkedItems.length === 0) {
					uni.showToast({
						title: '请先勾选要删除的商品',
						icon: 'none'
					})
					return
				}

				this.exchangedGoodsList = this.exchangedGoodsList.filter(item => !item.isChecked)
				this.calcExchangeStats()
				this.updateAllCheckedStatus()
			},
			// 清空整单
			clearAll() {
				uni.showModal({
					title: '提示',
					content: '确定要清空所有已换商品吗？',
					success: (res) => {
						if (res.confirm) {
							// 清空数组
							this.exchangedGoodsList = []
							// 重新统计
							this.calcExchangeStats()
							// 同步全选状态
							this.updateAllCheckedStatus()
						}
					}
				})
			},
			// 提交换货单据
			submitData() {
				if (this.exchangedGoodsList.length === 0) {
					uni.showToast({
						title: '请先添加换货商品',
						icon: 'none'
					});
					return;
				}
				util.simpleModal("提示", "是否确定提交外卖换货?", res => {
					if (res) {
						let khid = this.KHID;
						let posid = this.POSID;
						let rybh = this.RYID || '';
						let gcid = this.GCID;
						let orderNo = this.Order.BILL;
						let date = this.Order.SALEDATE;

						let backDetails = [];
						let normalDetails = [];

						let submitParams = {
							khid: khid,
							posid: posid,
							ryid: rybh,
							bill: orderNo,
							gcid: gcid,
							date: date,
							products: this.exchangedGoodsList.map(r => {
								return {
									oldSpid: r.originalSpid,
									oldPlid: r.originalPlid,
									newSpid: r.exchangedCode,
									newPlid: r.exchangedPlid,
									qty: r.qty,
									oldPrice: r.oldPrice,
									newPrice: r.price
								}
							}),
						};
						console.log("换货提交参数：", submitParams);
						_take.ConfirmWMOrderForChange(submitParams, res => {
							if (res.code) {
								uni.showToast({
									title: '提交成功',
									icon: 'success'
								});
								this.exchangedGoodsList = [];
								this.calcExchangeStats();
								this.updateAllCheckedStatus();
								setTimeout(() => {
									this.saveProductListToCache();
								}, 1000);
							} else {
								util.simpleMsg(res.msg)
							}
						})
					}
				})
			},

			//获取外卖单
			GetOrders: function(e, func) {
				_take.GetWMOrderForChange({
					khid: e
				}, res => {
					console.log("GetWMOrderForChange查询结果：", res);
					if (res.code) {
						that.WMOrders = JSON.parse(res.data);
						if (func) func(res);
					} else {
						that.WMOrders = []
						util.simpleMsg("暂无数据!", "none");
					}
				})
			},
			chooseOrder(e, i) {
				that.Order = e;
				that.curIndex = i;
			},
			ShowDetail: function(e, i) {
				util.simpleModal("提示", "是否进行换货？", res => {
					if (res) {
						_take.GetWMOrderDetailForChange({
							bill: e.BILL
						}, res => {
							console.log("GetWMOrderDetailForChange查询结果：", res);
							if (res.code) {
								that.originalGoodsList = JSON.parse(res.data);
								that.showExchange = true;
							} else {
								that.originalGoodsList = [];
								that.showExchange = false;
								util.simpleMsg("暂无商品信息！", "none");
							}
						})
					}
				})
			},
			ConfirmReceipt: function() {},
			ConfirmReback: function() {},
			RejectReback: function() {},
			commonRefund: function(e) {},
			JFConsume: function(PayList, hyid) {},
			GetBSData: function(b, d) {},
			ConfirmBS: function() {},
			GetWMDData: function(b, d) {},
			Calculate: function(e, t, event) {},
			ConfirmWMD: function() {},
			UpAndPrint: function() {},
			Refresh: function() {
				setTimeout(() => {
					that.GetOrders(that.KHID, r => {
						// that.ShowDetail(that.WMOrders[0], 0);
					});
				}, 1000);
			},
			Skip: function(e) {},
			Close: function() {},
			ReBack: function() {
				uni.navigateBack({});
			},
			Statements: function(e) {},
			Letters: function(e) {},
			Memberlogin: function(e) {},
			Bagslist: function(e) {},
			Moreand: function(e) {},
			Exit: function() {
				// uni.navigateBack();
				uni.$emit('tools', 'changeGoods');
			}
		},
		created() {
			that = this; //全局赋值
			console.log("TakeExchange.created", that.KHID);
			//外卖单渲染
			that.getTodayDate();
			that.calcExchangeStats(); // 已换商品统计
			that.getSPDA();
			that.GetOrders(that.KHID, r => {});
			//换货价差范围参数
			common.GetDapzcs("DQHHQJ", res => {
				console.log("created.DQHHQJ:", res);
				if (res.msg && res.msg.length > 0) {
					that.priceLimit = {
						min: parseFloat(res.msg[0].NOTE),
						max: parseFloat(res.msg[0].SZ)
					};
				}
			}, " and sname='" + this.DQID + "'")
		}
	}
</script>

<style>
	.right {
		height: 100%;
	}

	.meminfo {
		width: 70%;
	}

	.meminfo .confirm {
		position: absolute;
		bottom: 1%;
		left: 0;
	}

	.sousuo {
		margin-right: 0px !important;
	}

	.full-screen {
		box-sizing: border-box;
		width: 100% !important;
		height: 90% !important;
	}

	.add-top {
		padding-top: 30rpx;
	}




	/* 退货单新样式 */
	.products .procycle .li .h3 {
		line-height: unset;
		margin-bottom: 24rpx;
	}

	.products .procycle .li .h3 label {
		align-items: center;
	}

	.products .procycle {
		width: 100%;
		display: flex;
		align-content: flex-start;
	}

	.products .procycle .li {
		width: 48%;
		padding: 24rpx;
		height: fit-content;
		box-sizing: border-box;
		position: relative;
	}

	.products .procycle .li .before_line {
		width: 4rpx;
		height: 34rpx;
		background: #A0D8A4;
		border-radius: 0px 0px 0px 0px;
		position: absolute;
		top: 20rpx;
		right: 0;
	}

	.platform .peisong text {
		color: #FFB300;
		margin-right: 4rpx;
		font-size: 18rpx;
	}

	.ps-cods {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #333;
		gap: 24rpx;
		margin-bottom: 16rpx;
	}

	.address {
		line-height: 1;
		margin-top: 0;
		padding: 24rpx 0 0;
		box-sizing: border-box;
		color: #999999;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.address .hhuo {
		width: 100rpx;
		height: 48rpx;
	}

	.hhuo .hhuo-btn {
		width: 100rpx;
		height: 48rpx;
		background: #006B44;
		border-radius: 12rpx;
		color: #fff;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 模块 */
	.content-container {
		display: flex;
		width: 100%;
		height: 100%;
		padding: 10rpx 2%;
		box-sizing: border-box;
		gap: 24rpx;
	}

	/* 左侧换货面板 */
	.exchange-left-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		height: 100%;
	}

	/* 换前商品区域 */
	.exchange-original-section {
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx;
		box-sizing: border-box;
		flex: 1;
		overflow: auto;
	}

	/* 已换商品区域 */
	.exchange-finished-section {
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx;
		box-sizing: border-box;
		flex: 1;
		overflow: auto;
	}

	/* 区域标题栏 */
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.section-header .section-titles {
		font-size: 30rpx;
		font-weight: bold;
		color: #111111;
	}

	.section-header .section-titles-yh {
		color: #006B44;
		position: relative;
	}

	/* .section-titles-yh::before {
		content: "";
		width: 136rpx;
		height: 12rpx;
		background: linear-gradient(90deg, #006B44 0%, rgba(0, 107, 68, 0) 100%);
		border-radius: 9px 9px 9px 9px;
		opacity: 0.3;
		position: absolute;
		bottom: 0;
		left: 0;
	} */

	.section-date {
		font-size: 24rpx;
		color: #999;
	}


	.table-wrapper {
		width: 100%;
		max-height: 94%;
		overflow: auto;
	}

	/* 原生 table 样式 */
	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 24rpx;
		color: #111;
	}

	.data-table th {
		padding: 16rpx 10rpx;
		text-align: center;
		font-weight: 500;
		color: #999;
		white-space: nowrap;

		position: sticky;
		top: -2rpx;
		z-index: 15;
		background: #fff;
	}

	.data-table td {
		text-align: center;
	}

	.data-table-hh th {
		color: #555555;
	}

	.data-table .exchanged td {
		background: #EEF4F0;
	}

	.data-table .active td {
		color: #42B14B;
		background: rgba(66, 177, 75, 0.16);
	}

	.data-table td {
		padding: 18rpx 10rpx;
		border-bottom: 1rpx solid #f0f0f0;
		word-break: break-all;
		white-space: pre-wrap;
	}

	.data-table tr:active {
		background: #f9f9f9;
	}

	/* 右侧面板 */
	.side-panel {
		width: 30%;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		height: 100%;
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

	.stat-item.waste .stat-value {
		font-size: 32rpx;
	}

	.stat-label {
		color: #111111;
		font-weight: 600;
		font-size: 28rpx;
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
		width: 120rpx;
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

	.td-checkbox {
		position: relative;
	}

	/* 勾选框样式 */
	.task-checkbox {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s ease;
		border: 2rpx solid #42B14B;
		position: absolute;
		top: 16rpx;
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

	/* 复选框表头单独样式 */
	.th-checkbox {
		width: 80rpx;
		cursor: pointer;
	}

	/* 偶数行背景色 */
	.tr-even td {
		background-color: #F8F8F8;
	}

	.tr-checked {
		background-color: #E7F0EA;
	}

	.neik {
		width: 100%;
		height: 100%;
	}

	.top-wm {
		height: 90%;
	}
</style>