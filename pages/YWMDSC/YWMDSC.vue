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
								<view class="product-name">
									{{ item.name }}
								</view>
								<view class="product-code" :style="{ paddingLeft: item.isStar ? '32rpx' : '' }">
									{{ item.code }}
								</view>
							</view>
							<image @click.stop="removeProduct(index)" class="card-close"
								src="../../images/imgpro/schuxx.png" mode="widthFix"></image>
						</view>
						<view class="card-data">
							<view class="data-item data-item-z">
								<NumberFormat class="data-value" :value="item.qualified" />
								<text class="data-label">正品量</text>
							</view>
							<view class="data-item">
								<NumberFormat class="data-value" :value="item.defective" />
								<text class="data-label">次品量</text>
							</view>
							<view class="data-item">
								<NumberFormat class="data-value" :value="item.waste" />
								<text class="data-label waste-label">废品量</text>
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
						<text class="stat-label">正品量</text>
						<NumberFormat class="stat-value" :value="totalStats.qualified" />
					</view>
					<view class="stat-item">
						<text class="stat-label">次品量</text>
						<NumberFormat class="stat-value" :value="totalStats.defective" />
					</view>
					<view class="stat-item waste">
						<text class="stat-label">废品量</text>
						<NumberFormat class="stat-value" :value="totalStats.waste" />
					</view>
				</view>

				<!-- 操作区 -->
				<view class="panel-section operation-section" style="flex:1;position:relative;">
					<view class="section-title">操作</view>
					<view class="form-item">
						<text class="form-label">商品名称</text>
						<view class="form-picker" style="flex:1;position: relative;">
							<input @click.stop="showBorad('good')"
								style="height:100%;width:100%;padding-left: 6rpx;box-sizing:border-box;" disabled
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
					<view class="form-item count-item">
						<text class="form-label">正品数量</text>
						<view class="count-control">
							<view class="count-btn">
								<image v-if="currentCount.qualified>0" src="../../images/imgpro/jian_ky.png"
									mode="widthFix" @click="changeCount('qualified', YN_ZS === 'Y' ? -1 : -0.1)">
								</image>
								<image v-else src="../../images/imgpro/jian_jy.png" mode="widthFix"></image>
							</view>
							<!-- 正品数量输入框：根据YN_ZS限制输入类型 -->
							<input class="count-input" type="number" v-model="currentCount.qualified"
								:maxlength="YN_ZS === 'Y' ? 5 : 7" inputmode="numeric" pattern="\d*(\.\d+)?"
								@input="limitNumberRange('qualified')" />
							<view class="count-btn">
								<image src="../../images/imgpro/jia.png" mode="widthFix"
									@click="changeCount('qualified', YN_ZS === 'Y' ? 1 : 0.1)"></image>
							</view>
						</view>
					</view>
					<view class="form-item count-item">
						<text class="form-label">次品数量</text>
						<view class="count-control">
							<view class="count-btn">
								<image v-if="currentCount.defective>0" src="../../images/imgpro/jian_ky.png"
									mode="widthFix" @click="changeCount('defective', YN_ZS === 'Y' ? -1 : -0.1)">
								</image>
								<image v-else src="../../images/imgpro/jian_jy.png" mode="widthFix"></image>
							</view>
							<!-- 次品数量输入框：根据YN_ZS限制输入类型 -->
							<input class="count-input" type="number" v-model="currentCount.defective"
								:maxlength="YN_ZS === 'Y' ? 6 : 8" inputmode="numeric" pattern="\d*(\.\d+)?"
								@input="limitNumberRange('defective')" />
							<view class="count-btn">
								<image src="../../images/imgpro/jia.png" mode="widthFix"
									@click="changeCount('defective', YN_ZS === 'Y' ? 1 : 0.1)"></image>
							</view>
						</view>
					</view>
					<view class="form-item count-item waste">
						<text class="form-label waste-label">废品数量</text>
						<view class="count-control">
							<view class="count-btn">
								<image v-if="currentCount.waste>0" src="../../images/imgpro/jian_ky.png" mode="widthFix"
									@click="changeCount('waste', YN_ZS === 'Y' ? -1 : -0.1)"></image>
								<image v-else src="../../images/imgpro/jian_jy.png" mode="widthFix"></image>
							</view>
							<!-- 废品数量输入框：根据YN_ZS限制输入类型 -->
							<input class="count-input" type="number" v-model="currentCount.waste" placeholder="请输入"
								:maxlength="YN_ZS === 'Y' ? 6 : 8" inputmode="numeric" pattern="\d*(\.\d+)?"
								@input="limitNumberRange('waste')" />
							<view class="count-btn">
								<image src="../../images/imgpro/jia.png" mode="widthFix"
									@click="changeCount('waste', YN_ZS === 'Y' ? 1 : 0.1)"></image>
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
				BUSSINESS_NAME: '裱花主动入库',
				// 商品列表数据
				productList: [],
				SPDATA: [],
				showDropdown_goods: false, // 
				filteredGoodsList: [], // 过滤后的 商品列表

				currentIndex: -1, // 当前选中的商品索引
				// 统计数据
				totalStats: {
					qualified: 0,
					defective: 0,
					waste: 0
				},

				YN_ZS: 'Y', // 是否限制整数输入（Y=仅整数，N=可输入小数）
				// 当前操作数量
				selectedProductName: '',
				selectedProductCode: '', // 商品名称/编码

				currentCount: {
					qualified: 0,
					defective: 0,
					waste: 0
				},
				scrollState: {},
				// 数值范围：区分整数/小数的最大值
				numberRange: {
					intMin: 0,
					intMax: 99999, // 整数范围
					decMin: 0,
					decMax: 99999.99 // 小数范围
				},
				isEditMode: false, // 标记是否为编辑模式
				searchType: '' // 当前搜索类型
			};
		},
		computed: {

		},
		watch: {},
		methods: {
			clearGoods() {
				this.resetRightForm(); // 列表为空时重置表单
				this.currentIndex = -1;
				this.isEditMode = false;
			},
			// 选中商品 - 回显到右侧并标记编辑模式
			selectProduct(index) {

				this.currentIndex = index;
				const item = this.productList[index];
				console.log(item, '选中商品数据');
				this.currentCount = {
					...item
				};
				// 回显到右侧下拉框
				this.selectedProductName = item.name;
				this.selectedProductCode = item.code;
				this.YN_ZS = item.YN_ZS || 'Y'; // 同步商品的整数限制配置
				this.isEditMode = true; // 标记为编辑模式
			},

			// 移除商品
			removeProduct(index) {
				this.productList.splice(index, 1);
				if (this.currentIndex >= index) this.currentIndex = Math.max(0, this.currentIndex - 1);
				this.calcTotalStats();

				this.currentIndex = 0;
				if (this.productList.length > 0) {
					this.selectProduct(this.currentIndex);
				} else {
					this.resetRightForm(); // 列表为空时重置表单
					this.currentIndex = -1;
					this.isEditMode = false;
				}
			},

			// 计算统计总数（兼容小数）
			calcTotalStats() {
				this.totalStats = this.productList.reduce((acc, cur) => {
					acc.qualified += Number(cur.qualified) || 0;
					acc.defective += Number(cur.defective) || 0;
					acc.waste += Number(cur.waste) || 0;
					// 保留2位小数，避免精度问题
					acc.qualified = Math.round(acc.qualified * 100) / 100;
					acc.defective = Math.round(acc.defective * 100) / 100;
					acc.waste = Math.round(acc.waste * 100) / 100;
					return acc;
				}, {
					qualified: 0,
					defective: 0,
					waste: 0
				});
			},

			limitNumberRange(type) {
				console.log(this.YN_ZS, '是否能为整数');

				let value = this.currentCount[type];
				if (value === '' || value === null || value === undefined) {
					this.$set(this.currentCount, type, this.YN_ZS === 'Y' ? this.numberRange.intMin : this.numberRange
						.decMin);
					return;
				}

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
					if (value.includes('.') && value.split('.')[0].length > 1) {
						const [intPart, decPart] = value.split('.');
						value = parseInt(intPart, 10) + '.' + decPart;
					} else if (!value.includes('.') && value.length > 1) {
						value = parseInt(value, 10).toString();
					}
				}

				let numValue = Number(value);
				if (isNaN(numValue)) {
					this.$set(this.currentCount, type, this.YN_ZS === 'Y' ? this.numberRange.intMin : this.numberRange
						.decMin);
					return;
				}

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
					// 小数模式：保留2位小数 + 范围限制
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

			// 数量增减
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
			selectGoods(item) {
				console.log("选中的item：", item);
				this.selectedProductCode = item.SPID;
				this.selectedProductName = item.SNAME;
				this.YN_ZS = item.YN_ZS || 'Y'; // 同步选中商品的整数限制
				this.showDropdown_goods = false;
				this.isKeyBoardShow = false;
				// 重置数量为0
				this.currentCount = {
					qualified: 0,
					defective: 0,
					waste: 0
				};
			},

			//获取可售商品
			getSPDA: function() {
				let store = util.getStorage("store");
				console.log("GetBHRKSPDA：", "1111333");
				_ywbhqh.GetBHRKSPDA(store.KHID, 'RK', '', '', res => {
					console.log("[GetSPDA]门店数据：", res);
					if (res.code && res.msg.length > 0) {
						that.SPDATA = res.msg;
					} else {
						that.SPDATA = [];
					}
				});
			},
			//仅缓存左侧商品列表（
			saveProductListToCache(productList = this.productList, showToast = true) {
				try {
					uni.setStorageSync('mdscstorage', JSON.parse(JSON.stringify(productList)));
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
					const cachedData = uni.getStorageSync('mdscstorage');
					if (cachedData) {
						this.productList = cachedData || [];
					}
				} catch (e) {
					console.error('恢复缓存失败:', e);
				}
			},

			clearProductListCache() {
				uni.removeStorageSync("mdscstorage");
				console.log('商品列表缓存已清空');
			},
			// 清空选中（删除选中商品 + 清空右侧表单）
			clearSelected() {
				if (this.currentIndex === -1 || this.productList.length === 0) {
					uni.showToast({
						title: '暂无选中商品',
						icon: 'none'
					});
					return;
				}
				// 1. 删除左侧选中商品
				this.productList.splice(this.currentIndex, 1);
				// 2. 清空右侧表单
				this.resetRightForm();
				// 3. 更新统计数据
				this.calcTotalStats();
				// 4. 重置状态
				this.currentIndex = -1;
				this.isEditMode = false;
				uni.showToast({
					title: '已删除选中商品',
					icon: 'success'
				});
			},

			// 暂存：
			tempSave() {
				if (!this.isEditMode) {
					if (!this.selectedProductName) {
						uni.showToast({
							title: '请先选择商品',
							icon: 'none'
						});
						return;
					}
					// 兼容小数：判断数值>0（而非仅整数）
					if (Number(this.currentCount.qualified) <= 0) {
						uni.showToast({
							title: '正品数量必须大于0',
							icon: 'none'
						});
						return;
					}
					if (!this.selectedProductCode || this.selectedProductCode.trim() === '') {
						uni.showToast({
							title: '商品编码不能为空',
							icon: 'none'
						});
						return;
					}
				} else {
					if (this.currentIndex === -1) {
						uni.showToast({
							title: '请先选中要编辑的商品',
							icon: 'none'
						});
						return;
					}
				}

				const qualified = Number(this.currentCount.qualified) || 0;
				const defective = Number(this.currentCount.defective) || 0;
				const waste = Number(this.currentCount.waste) || 0;

				if (this.isEditMode) {
					this.productList[this.currentIndex] = {
						...this.productList[this.currentIndex],
						qualified,
						defective,
						waste,
						YN_ZS: this.YN_ZS
					};
					uni.showToast({
						title: '编辑成功~',
						icon: 'success'
					});
				} else {
					const sameCodeIndex = this.productList.findIndex(item =>
						item.code && item.code.trim() === this.selectedProductCode.trim()
					);

					if (sameCodeIndex > -1) {
						this.productList[sameCodeIndex] = {
							...this.productList[sameCodeIndex],
							qualified,
							defective,
							waste,
							name: this.selectedProductName,
							YN_ZS: this.YN_ZS
						};
						uni.showToast({
							title: '商品已更新~',
							icon: 'success'
						});
					} else {
						const newProduct = {
							name: this.selectedProductName,
							code: this.selectedProductCode.trim(),
							qualified,
							defective,
							waste,
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

				this.calcTotalStats(); // 重新计算总数
				this.resetRightForm(); // 清空右侧表单
				this.currentIndex = -1; // 取消选中
				this.isEditMode = false; // 退出编辑模式
			},

			// 清空整单（删除左侧所有 + 清空右侧）
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
							// 1. 清空左侧所有商品
							this.productList = [];
							// 2. 清空右侧表单
							this.resetRightForm();
							// 3. 更新统计数据
							this.calcTotalStats();
							// 4. 重置状态
							this.currentIndex = -1;
							this.isEditMode = false;
							// 5. 清空缓存
							this.clearProductListCache();
							uni.showToast({
								title: '已清空整单',
								icon: 'success'
							});
						}
					}
				});
			},
			// 提交：整单提交到业务表（兼容小数）
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
				let store = util.getStorage("store");
				util.simpleModal("提示", "是否入库？", (conf) => {
					if (conf) {
						let data1 = {
							khid: store.KHID,
							gsid: store.GSID,
							posid: store.POSID,
							ryid: store.RYID,
							ryname: store.RYNAME,
							list: this.productList.map(item => ({
								goodsName: item.name,
								goodsCode: item.code,
								qualified: Number(item.qualified) || 0,
								defective: Number(item.defective) || 0,
								waste: Number(item.waste) || 0,
								YN_ZS: item.YN_ZS || 'Y' // 携带整数限制配置
							}))
						};
						console.log("BHQHZDInput的data：", data1);
						_ywbhqh.BHQHZDInput(data1, res => {
							console.log("BHQHZDInput：", res);
							if (res.code) {
								//uni.showToast({ title: res.msg, icon: 'success' });
								util.simpleModal("提示", res.msg);

								// 提交成功后清空本地数据
								this.productList = [];
								this.totalStats = {
									qualified: 0,
									defective: 0,
									waste: 0
								};
								this.resetRightForm();
								this.currentIndex = -1;
								this.isEditMode = false;
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
					qualified: 0,
					defective: 0,
					waste: 0
				};
				this.YN_ZS = 'Y'; // 重置为默认整数限制
				if (!options.keepSelect) {
					this.selectedProductName = '';
					this.selectedProductCode = '';
				}
			},

			// 软键盘相关
			handleKeyboardConfirm(query) {
				const keyword = query.query.trim()
				console.log("搜索值：", keyword);
				console.log(this.searchType, '---')
				if (this.searchType == 'good') {
					this.showDropdown_goods = true

					if (!keyword) {
						this.filteredGoodsList = this.SPDATA;
					} else {
						this.filteredGoodsList = this.SPDATA.filter(item => {
							if (!item.SPID && !item.PINYIN) return false;
							// 匹配
							if (item.SPID.includes(keyword) || item.PINYIN.toUpperCase().includes(keyword))
								return true;
							else
								return false;
						});
					}
				}
			},

			// 点击非目标区域时，收起软键盘和下拉列表
			hideAllPopups() {
				this.isKeyBoardShow = false; // 收起软键盘
				this.showDropdown_goods = false; // 收起商品下拉列表
			},

			// 关闭键盘
			turnOffKeys() {
				this.isKeyBoardShow = false
			},

			// 延迟关闭商品下拉列表
			delayCloseGoodsDropdown() {
				setTimeout(() => {
					this.showDropdown_goods = false;
				}, 200);
			},

			onLoad: async function() {

				that = this;
				that.restoreFormFromCache(); // 新增：恢复缓存数据

				that.calcTotalStats();
				that.getSPDA(); //获取商品数据
				console.log("ywbhqh.onload");
			},
			onHide() {},

			onUnload() {
				this.saveProductListToCache(this.productList, false); // 自动暂存不提示
			},
			onShow: function() {},

			showBorad(searchType) {
				this.searchType = searchType
				this.isKeyBoardShow = !this.isKeyBoardShow;
				if (!this.isKeyBoardShow) {
					this.showDropdown_shop = false
					this.showDropdown_goods = false
				}
			},

			// 初始化滚动处理器
			initScrollHandler() {
				const scrollX = this.$refs.scrollX;
				const scrollY = this.$refs.scrollY;

				if (!scrollX || !scrollY) return;

				// 触摸开始
				scrollY.addEventListener('touchstart', (e) => {
					if (e.touches.length !== 1) return;

					const touch = e.touches[0];

					this.scrollState = {
						startX: touch.clientX,
						startY: touch.clientY,
						startScrollLeft: scrollX.scrollLeft,
						startScrollTop: scrollY.scrollTop,
						scrollDirection: null,
						isScrolling: false
					};
				}, {
					passive: true
				});

				// 触摸移动 - 分离X/Y轴滚动
				scrollY.addEventListener('touchmove', (e) => {
					if (e.touches.length !== 1) return;
					if (!this.scrollState.startX && this.scrollState.startX !== 0) return;

					const touch = e.touches[0];
					const deltaX = touch.clientX - this.scrollState.startX;
					const deltaY = touch.clientY - this.scrollState.startY;
					const absDeltaX = Math.abs(deltaX);
					const absDeltaY = Math.abs(deltaY);

					// 判断滚动方向
					if (!this.scrollState.scrollDirection) {
						if (absDeltaX > 5 || absDeltaY > 5) {
							this.scrollState.scrollDirection = absDeltaX > absDeltaY ? 'horizontal' : 'vertical';
							this.scrollState.isScrolling = true;
						} else {
							return;
						}
					}

					// 横向滚动
					if (this.scrollState.scrollDirection === 'horizontal') {
						const maxScrollLeft = scrollX.scrollWidth - scrollX.clientWidth;
						const newScrollLeft = this.scrollState.startScrollLeft - deltaX;
						const limitedScrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));
						scrollX.scrollLeft = limitedScrollLeft;
						e.preventDefault();
					}
					// 纵向滚动
					else if (this.scrollState.scrollDirection === 'vertical') {
						const maxScrollTop = scrollY.scrollHeight - scrollY.clientHeight;
						const newScrollTop = this.scrollState.startScrollTop - deltaY;
						const limitedScrollTop = Math.max(0, Math.min(maxScrollTop, newScrollTop));
						scrollY.scrollTop = limitedScrollTop;
						e.preventDefault();
					}
				}, {
					passive: false
				});

				// 触摸结束
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

				// 阻止iOS页面整体拖动
				document.body.addEventListener('touchmove', (e) => {
					const target = e.target;
					const isInTable = target.closest('.table-fixed-container');
					if (isInTable) {
						e.preventDefault();
					}
				}, {
					passive: false
				});
			}
		},
		created() {
			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale", uni);
		},
		mounted() {
			this.$nextTick(() => {
				this.initScrollHandler();
			});
		},
		beforeDestroy() {
			const scrollY = this.$refs.scrollY;
			const scrollX = this.$refs.scrollX;

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
		justify-content: space-between;

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