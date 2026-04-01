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
				<block v-if="productList && productList.length>0">
					<view v-for="(item, index) in productList" :key="index" class="product-card"
						:class="{ active: currentIndex === index }" @click="selectProduct(index)">
						<view class="card-header">
							<view class="card-num">{{ index + 1 < 10 ? '0' + (index + 1) : index + 1 }}</view>
							<view class="card-info">
								<view class="product-name">{{ item.name }}</view>
								<view class="product-code" :style="{ paddingLeft: item.isStar ? '32rpx' : '' }">
									{{ item.code }}
								</view>
							</view>
							<image @click.stop="removeProduct(index)" class="card-close"
								src="../../images/imgpro/schuxx.png" mode="widthFix"></image>
						</view>
						<view class="card-data">
							<view class="data-item data-item-z">
								<NumberFormat class="data-value" :value="item.quantity" />
								<text class="data-label">商品数量</text>
							</view>
							<view class="data-item">
								<NumberFormat class="data-value" :value="item.totalPrice" />
								<text class="data-label">售价金额</text>
							</view>
						</view>
					</view>
				</block>

				<NoData v-if="productList.length==0"
					style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"></NoData>
			</view>

			<!-- 右侧：统计与操作区 -->
			<view class="side-panel">
				<!-- 数量统计 -->
				<view class="panel-section stats-section">
					<view class="section-title">数量统计</view>
					<view class="stat-item">
						<text class="stat-label">总配送量</text>
						<NumberFormat class="stat-value" :value="totalStats.totalQuantity" />
					</view>
					<view class="stat-item">
						<text class="stat-label">总售价金额</text>
						<NumberFormat class="stat-value" :value="totalStats.totalAmount" />
					</view>
				</view>

				<!-- 操作区 -->
				<view class="panel-section operation-section" style="flex:1;position:relative;">
					<view class="section-title">操作</view>
					<!-- 目标门店选择 -->
					<view class="form-item">
						<text class="form-label">目标门店</text>
						<view class="form-picker" style="flex:1;position: relative;">
							<input @click.stop="productList.length === 0 && showBorad('shop')"
								style="height:100%;width:100%;padding-left: 6rpx;box-sizing: border-box;" disabled="true"
								v-model="selectedShopName" placeholder="请选择门店" class="filter-picker"
								@focus="productList.length === 0 && (showDropdown_shop = true)"
								@blur="delayCloseShopDropdown" />
							<view style="opacity: 0;position: absolute;left:0;top:0;height:100%;width:100%"
								@click.stop="productList.length === 0 && showBorad('shop')"></view>

							<view v-if="productList.length === 0 && showDropdown_shop && filteredShopList.length"
								style="position: absolute; top: 80rpx; left: 0; width: 100%;  max-height: 340rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
								<view v-for="(item, index) in filteredShopList" :key="index"
									style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;font-size:28rpx"
									@click.stop="selectShop(item)">
									{{item.KHID}}-{{item.SNAME}}
								</view>
							</view>
							<view v-if="productList.length === 0 && showDropdown_shop && !filteredShopList.length"
								style="position: absolute; top: 64rpx; left: 0; width: 94%;font-size:28rpx; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999; z-index: 100000;">
								暂无匹配门店
							</view>

							<image src="../../images/jsd-gb.png"
							style="width:40rpx;height:40rpx;position: absolute;right: 12rpx;top:50%;transform:translateY(-50%);"
							@click.stop="productList.length === 0 && clearShop()" mode="widthFix"></image>
						</view>


						<image src="../../images/imgbh/rjp@1.5x.png" style="width:40rpx;height:40rpx;margin-left:16rpx;"
							@click.stop="productList.length === 0 && showBorad('shop')" mode="widthFix"></image>
					</view>

					<view class="form-item">
						<text class="form-label">商品名称</text>
						<view class="form-picker" style="flex:1;position: relative;">
							<input @click.stop="showBorad('good')"
								style="height:100%;width:100%;padding-left: 6rpx;" disabled
								v-model="selectedProductName" placeholder="请选择商品" class="filter-picker"
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

					<view class="form-item">
						<text class="form-label">商品编码</text>
						<input class="form-picker" placeholder="请输入商品编码" style="background:#F5F5F5;padding-left: 6rpx;"
							disabled v-model="selectedProductCode" />
					</view>

					<!-- 商品价格显示 -->
					<view class="form-item">
						<text class="form-label">商品价格</text>
						<input class="form-picker" placeholder="0.00" style="background:#F5F5F5;padding-left: 6rpx;"
							disabled v-model="selectedProductPrice" />
					</view>

					<!-- 仅保留商品数量输入 -->
					<view class="form-item count-item">
						<text class="form-label">商品数量</text>
						<view class="count-control">
							<view class="count-btn">
								<image v-if="currentCount.quantity>0" src="../../images/imgpro/jian_ky.png"
									mode="widthFix" @click="changeCount('quantity', YN_ZS === 'Y' ? -1 : -0.1)"></image>
								<image v-else src="../../images/imgpro/jian_jy.png" mode="widthFix"></image>
							</view>
							<input class="count-input" type="number" v-model="currentCount.quantity"
								:maxlength="YN_ZS === 'Y' ? 5 : 7" inputmode="numeric" pattern="\d*(\.\d+)?"
								@input="limitNumberRange('quantity')" />
							<view class="count-btn">
								<image src="../../images/imgpro/jia.png" mode="widthFix"
									@click="changeCount('quantity', YN_ZS === 'Y' ? 1 : 0.1)"></image>
							</view>
						</view>
					</view>

					<view class="operation-btns operation-btns-btng">
						<button class="btn btn-set" @click="clearGoods()">取消</button>
						<button class="btn btn-set" @click="tempSave()">{{ isEditMode ? '编辑' : '添加' }}</button>
					</view>
				</view>

				<!-- 操作区域按钮 -->
				<view class="panel-section operation-section" style="padding:24rpx;">
					<view class="operation-btns">
						<button class="btn btn-secondary" @click="clearSelected">删除选中</button>
						<button class="btn btn-secondary" @click="saveProductListToCache">暂存</button>
					</view>
					<view class="operation-btns" style="margin-top: 32rpx;">
						<button class="btn btn-warning" @click="clearAll">清空整单</button>
						<button class="btn btn-primary" @click="submitData">提交</button>
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
				BUSSINESS_NAME: '裱花主动配送',
				// 商品/门店列表数据
				productList: [],
				SPDATA: [],
				THKHDATA: [],
				filteredShopList: [],
				filteredGoodsList: [],

				// 下拉列表显示状态
				showDropdown_shop: false,
				showDropdown_goods: false,

				// 选中状态
				currentIndex: -1,
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

				YN_ZS: 'Y', // 是否限制整数输入
				currentCount: {
					quantity: 0
				}, // 仅保留商品数量
				scrollState: {},
				// 数值范围
				numberRange: {
					intMin: 0,
					intMax: 99999,
					decMin: 0,
					decMax: 99999.99
				},
				isEditMode: false,
				searchType: ''
			};
		},
		methods: {
			// 清空门店选择
			clearShop() {
				if (this.productList.length > 0) {
					uni.showToast({
						title: '当前已有商品，无法清空门店',
						icon: 'none',
						duration: 1500
					});
					return;
				}
				this.selectedShopName = '';
				this.selectedShopCode = '';
			},

			// 清空商品选择
			clearGoods() {
				this.currentIndex = -1;
				this.isEditMode = false;
				this.resetRightForm();
			},

			// 选中商品 - 回显数据
			selectProduct(index) {
				this.currentIndex = index;
				const item = this.productList[index];
				this.currentCount = {
					quantity: item.quantity || 0
				};
				this.selectedProductName = item.name;
				this.selectedProductCode = item.code;
				this.selectedProductPrice = item.price || '0.00';
				this.selectedProductSpecs = item.specs;
				this.YN_ZS = item.YN_ZS || 'Y';
				this.isEditMode = true;
			},

			// 移除商品
			removeProduct(index) {
				this.productList.splice(index, 1);
				if (this.currentIndex >= index) {
					this.currentIndex = Math.max(-1, this.currentIndex - 1);
				}
				this.calcTotalStats();

				if (this.productList.length > 0 && this.currentIndex >= 0) {
					this.selectProduct(this.currentIndex);
				} else {
					this.resetRightForm();
					this.currentIndex = -1;
					this.isEditMode = false;
				}
			},

			// 计算统计总数（数量+金额）
			calcTotalStats() {
				this.totalStats = this.productList.reduce((acc, cur) => {
					const quantity = Number(cur.quantity) || 0;
					const price = Number(cur.price) || 0;

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

			// 限制数值范围（仅商品数量）
			limitNumberRange(type) {
				let value = this.currentCount[type];
				if (value === '' || value === null || value === undefined) {
					this.$set(this.currentCount, type, this.YN_ZS === 'Y' ? this.numberRange.intMin : this.numberRange
						.decMin);
					return;
				}

				// 过滤非法字符
				if (this.YN_ZS === 'Y') {
					value = value.toString().replace(/[^\d]/g, '');
					if (value === '') {
						this.$set(this.currentCount, type, this.numberRange.intMin);
						return;
					}
				} else {
					value = value.toString()
						.replace(/[^\d.]/g, '')
						.replace(/(\.\d*)\./g, '$1');
					if (value === '') {
						this.$set(this.currentCount, type, this.numberRange.decMin);
						return;
					}
					if (value.startsWith('.')) {
						value = '0' + value;
					}
				}

				let numValue = Number(value);
				if (isNaN(numValue)) {
					this.$set(this.currentCount, type, this.YN_ZS === 'Y' ? this.numberRange.intMin : this.numberRange
						.decMin);
					return;
				}

				// 范围限制
				if (this.YN_ZS === 'Y') {
					numValue = Math.floor(numValue);
					if (numValue > this.numberRange.intMax) {
						this.$set(this.currentCount, type, this.numberRange.intMax);
						uni.showToast({
							title: `数值不能超过${this.numberRange.intMax}`,
							icon: 'none',
							duration: 1500
						});
					} else if (numValue < this.numberRange.intMin) {
						this.$set(this.currentCount, type, this.numberRange.intMin);
					} else {
						this.$set(this.currentCount, type, numValue);
					}
				} else {
					numValue = Math.round(numValue * 100) / 100;
					if (numValue > this.numberRange.decMax) {
						this.$set(this.currentCount, type, this.numberRange.decMax);
						uni.showToast({
							title: `数值不能超过${this.numberRange.decMax}`,
							icon: 'none',
							duration: 1500
						});
					} else if (numValue < this.numberRange.decMin) {
						this.$set(this.currentCount, type, this.numberRange.decMin);
					} else {
						this.$set(this.currentCount, type, numValue);
					}
				}
			},

			// 数量增减（仅商品数量）
			changeCount(type, step) {
				let currentVal = this.currentCount[type] || 0;

				const magnifiedCurrent = Math.round(parseFloat(currentVal) * 100);
				const magnifiedStep = Math.round(step * 100);
				let magnifiedNew = magnifiedCurrent + magnifiedStep;

				let newVal = magnifiedNew / 100;
				const minVal = this.YN_ZS === 'Y' ? this.numberRange.intMin : this.numberRange.decMin;
				newVal = Math.max(minVal, newVal);

				this.$set(this.currentCount, type, Number(newVal.toFixed(2)));
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
				this.selectedProductPrice = item.PRICE || '0.00'; // 商品价格
				this.selectedProductSpecs = item.SPECS; // 商品规格
				this.YN_ZS = item.YN_ZS || 'Y';
				this.showDropdown_goods = false;
				this.isKeyBoardShow = false;
				this.currentCount = {
					quantity: 0
				};
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
			//仅缓存左侧商品列表（
			saveProductListToCache(productList = this.productList, showToast = true) {
				try {
					uni.setStorageSync('bhzdstorage', JSON.parse(JSON.stringify(productList)));
					uni.setStorageSync('bhzdshopname', this.selectedShopName);
					uni.setStorageSync('bhzdshopcode', this.selectedShopCode);

					console.log('左侧商品列表已暂存到本地缓存');
					if (showToast) {
						uni.showToast({
							title: '暂存成功',
							icon: 'success',
							duration: 1500
						});
					}
				} catch (e) {
					console.error('商品列表缓存失败:', e);
					if (showToast) {
						uni.showToast({
							title: '暂存失败',
							icon: 'none',
							duration: 1500
						});
					}
				}
			},
			restoreFormFromCache() {
				try {
					const cachedData = uni.getStorageSync('bhzdstorage');
					console.log(cachedData, 'cachedData');

					this.selectedShopName = uni.getStorageSync('bhzdshopname');
					this.selectedShopCode = uni.getStorageSync('bhzdshopcode');

					if (cachedData) {
						this.productList = cachedData || [];
					}
				} catch (e) {
					console.error('恢复缓存失败:', e);
				}
			},
			clearProductListCache() {
				uni.removeStorageSync('bhzdstorage');
				uni.removeStorageSync('bhzdshopname');
				uni.removeStorageSync('bhzdshopcode');
				console.log('商品列表缓存已清空');
			},
			// 清空选中商品
			clearSelected() {
				if (this.currentIndex === -1 || this.productList.length === 0) {
					uni.showToast({
						title: '暂无选中商品',
						icon: 'none'
					});
					return;
				}
				this.productList.splice(this.currentIndex, 1);
				this.resetRightForm();
				this.calcTotalStats();
				this.currentIndex = -1;
				this.isEditMode = false;
				uni.showToast({
					title: '已删除选中商品',
					icon: 'success'
				});
			},

			// 暂存商品
			tempSave() {
				// 校验门店和商品选择
				if (!this.selectedShopName) {
					uni.showToast({
						title: '请先选择目标门店',
						icon: 'none'
					});
					return;
				}
				if (!this.selectedProductName) {
					uni.showToast({
						title: '请先选择商品',
						icon: 'none'
					});
					return;
				}
				if (Number(this.currentCount.quantity) <= 0) {
					uni.showToast({
						title: '商品数量必须大于0',
						icon: 'none'
					});
					return;
				}
				if (!this.selectedProductCode) {
					uni.showToast({
						title: '商品编码不能为空',
						icon: 'none'
					});
					return;
				}

				const quantity = Number(this.currentCount.quantity) || 0;
				const price = Number(this.selectedProductPrice) || 0;
				const totalPrice = Math.round(quantity * price * 100) / 100;
				const specs = this.selectedProductSpecs;

				if (this.isEditMode) {
					// 编辑已有商品
					this.productList[this.currentIndex] = {
						...this.productList[this.currentIndex],
						quantity,
						specs,
						price,
						totalPrice,
						YN_ZS: this.YN_ZS
					};
					uni.showToast({
						title: '编辑成功~',
						icon: 'success'
					});
				} else {
					// 新增商品
					const sameCodeIndex = this.productList.findIndex(item =>
						item.code && item.code.trim() === this.selectedProductCode.trim()
					);

					if (sameCodeIndex > -1) {
						// 更新已有商品
						this.productList[sameCodeIndex] = {
							...this.productList[sameCodeIndex],
							quantity,
							specs,
							price,
							totalPrice,
							name: this.selectedProductName,
							YN_ZS: this.YN_ZS
						};
						uni.showToast({
							title: '商品已更新~',
							icon: 'success'
						});
					} else {
						// 新增商品
						const newProduct = {
							name: this.selectedProductName,
							code: this.selectedProductCode.trim(),
							quantity,
							specs,
							price,
							totalPrice,
							isStar: false,
							YN_ZS: this.YN_ZS
						};
						this.productList.push(newProduct);
						uni.showToast({
							title: '新增成功~',
							icon: 'success'
						});
					}
				}

				this.calcTotalStats();
				this.resetRightForm();
				this.currentIndex = -1;
				this.isEditMode = false;
			},

			// 清空整单
			clearAll() {
				if (this.productList.length === 0) {
					uni.showToast({
						title: '暂无商品数据',
						icon: 'none'
					});
					return;
				}
				uni.showModal({
					title: '提示',
					content: '确定要清空整单吗？',
					success: (res) => {
						if (res.confirm) {
							this.productList = [];
							this.resetRightForm();
							this.calcTotalStats();
							this.currentIndex = -1;
							this.isEditMode = false;
							this.clearProductListCache();
							uni.showToast({
								title: '已清空整单',
								icon: 'success'
							});
						}
					}
				});
			},

			// 提交数据
			submitData() {
				if (!common.CheckSign(1)) {
					return;
				}
				if (!this.productList || this.productList.length === 0) {
					uni.showToast({
						title: '请先添加商品后再提交',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (!this.selectedShopName) {
					uni.showToast({
						title: '请先选择目标门店',
						icon: 'none'
					});
					return;
				}

				let store = util.getStorage("store");
				util.simpleModal("提示", "是否配送？", (conf) => {
					if (conf) {
						console.log("提交数据的所有商品数据：", this.productList);
						let data1 = {
							khid: store.KHID,
							gsid: store.GSID,
							posid: store.POSID,
							ryid: store.RYID,
							ryname: store.RYNAME,
							shopCode: this.selectedShopCode, // 目标门店编码
							shopName: this.selectedShopName, // 目标门店名称
							list: this.productList.map(item => ({
								goodsName: item.name,
								goodsCode: item.code,
								specs: item.specs,
								quantity: Number(item.quantity) || 0,
								price: Number(item.price) || 0,
								totalPrice: Number(item.totalPrice) || 0,
								YN_ZS: item.YN_ZS || 'Y'
							}))
						};
						console.log("提交数据：", data1);
						_ywbhqh.BHQHZDPS(data1, res => {
							console.log("提交结果：", res);
							if (res.code) {
								//uni.showToast({ title: res.msg, icon: 'success' });

								util.simpleModal("提示", res.msg);

								// 清空数据
								this.productList = [];
								this.totalStats = {
									totalQuantity: 0,
									totalAmount: 0
								};
								this.resetRightForm();
								this.currentIndex = -1;
								this.isEditMode = false;
								this.selectedShopName = '';
								this.selectedShopCode = '';
								// 清空缓存
								this.clearProductListCache();
							} else {
								util.simpleMsg(res.msg, true);
							}
						})
					}
				})
			},

			// 重置右侧表单
			resetRightForm(options = {}) {
				this.currentCount = {
					quantity: 0
				};
				this.YN_ZS = 'Y';
				if (!options.keepSelect) {
					this.selectedProductName = '';
					this.selectedProductCode = '';
					this.selectedProductPrice = '';
					this.selectedProductSpecs = '';
				}
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
		created() {
			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale", uni);
		},
		onLoad: async function() {
			that = this;
			that.restoreFormFromCache(); // 新增：恢复缓存数据

			that.calcTotalStats();
			that.getSPDA(); // 获取商品数据
			that.getShopList(); // 获取门店数据
			console.log("页面加载完成");
		},
		onUnload() {
			this.saveProductListToCache(this.productList, false); // 自动暂存不提示
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

	/* 左侧卡片列表 */
	.card-list {
		flex: 1;
		overflow-y: auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 248rpx;
		gap: 24rpx;
		align-content: start;
		padding: 24rpx;
		box-sizing: border-box;
		height: 86vh;

		background: #FFFFFF;
		border-radius: 24rpx;
		position: relative;
	}

	.product-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 20rpx;
		border: 1px solid rgba(0, 107, 68, 0.4);
		transition: all 0.2s;
		height: 100%;
		/* 让卡片占满所在行的高度（即248rpx） */
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
	}

	.product-card.active {
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(0, 107, 68, 0.3);
		border: 2rpx solid #006B44;
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.card-num {
		width: 68rpx;
		height: 68rpx;
		background: rgba(0, 107, 68, 0.08);
		border: 2rpx solid #006B44;
		color: #006B44;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10rpx;
	}

	.card-info {
		flex: 1;
	}

	.product-name {
		font-size: 28rpx;
		font-weight: 600;
		max-width: 92%;
	}

	.star {
		color: #ffb400;
		width: 28rpx;
		height: 28rpx;
	}

	.product-code {
		font-size: 24rpx;
		color: #999;
		box-sizing: border-box;
	}

	.card-close {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}

	.card-data {
		display: flex;
		justify-content: space-around;

		background: rgba(237, 238, 245, 0.3);
		border-radius: 12rpx;
		border: 2rpx solid #EDEEF5;
		padding: 12rpx 24rpx;
		box-sizing: border-box;
	}

	.data-item {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.data-value {
		display: block;
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		font-family: 'Bahnschrift';
	}

	.data-label {
		font-size: 24rpx;
		color: #888888;
		margin-top: 4rpx;
	}

	.data-item-z .data-value {
		font-size: 40rpx;
		font-weight: 600;
		color: #006B44;
	}

	.data-item-z .data-label {
		font-size: 24rpx;
		color: #006B44;
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
</style>