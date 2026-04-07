 <style scoped>
 	@import url(@/static/style/payment/paymentall/basis.css);
 	@import url(@/static/style/index.css);
 </style>
 <template>

 	<view class="centre">
 		<!-- <image class="bg" src="../../images/chushihua.png" mode="widthFix"></image> -->
 		<Head ref="bhHead" :BUSSINESS_NAME="BUSSINESS_NAME" :_showSale="true" :_ynMsg='false'></Head>

 		<!-- 筛选列表页面 -->
 		<view class="tranlist tranlist-list">
 			<view class="filter-result-page ">
 				<view class="status-tabs">
 					<view class="tab-item" v-for="(item, index) in tabList" :key="index"
 						:class="{ active: item.active }" @click="toggleActive(index,item)">
 						<image v-if="item.active" class="bg" style="z-index:0" src="../../images/imgbh/bh-check-bg.png"
 							mode="widthFix"></image>

 						<view class="tab-label">{{ item.label }}</view>
 						<view class="tab-value" style="position:relative;">
 							<NumberFormat :value="item.value" :color="item.active ? '#006637' : '#666'" />

 							<view v-if="!item.active" class="tab-dashed"></view>
 						</view>

 						<view v-if="index < tabList.length - 1 
						  && !item.active 
						  && !tabList[index + 1].active" class="tab-split-line"></view>
 					</view>
 				</view>

 				<NoData v-if="listData.length==0"
 					style="position: absolute; left: 50%; top: 60%; transform: translate(-50%, -50%);padding-top:0 ;">
 				</NoData>

 				<!-- 操作列表 -->
 				<view class="page-list">
 					<view class="btns-list">
 						<view class="btns-groups">
 							<view class="btn1" @click="filterTasks()">刷新</view>
 							<view class="btn1" @click="BHQHInput('1')">入库</view>
 							<view class="btn1" @click="BHQHInput('0')">作废</view>
 							<view class="btn1" @click="BHQHOrderPrint()">打印</view>
 							<view class="btn2" @click="ScanInput('1')">扫码入库</view>
 							<view class="btn2" @click="ScanInput('0')">扫码作废</view>
 						</view>
 						<view class="filter" @click="openFilterModal()">
 							<image src="../../images/imgbh/operate-icon.png" mode="widthFix"></image>
 							<text>筛选</text>
 						</view>
 					</view>
 					<view v-if="listData.length>0" class="table-container">
 						<div class="table-scroll-x" ref="scrollX">
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
 											<th class="fixed-col3">任务商品</th>
 											<th>类型</th>
 											<th>到货日期</th>
 											<th>数量</th>
 											<th>单位</th>
 											<th>尺寸</th>
 											<th>到货时间</th>
 											<th>到货时段</th>
 											<th>要货门店</th>
 											<!-- <th>要求</th> -->
 											<th>任务状态</th>
 											<th>已生产</th>
 											<th>是否预定</th>
 											<th>送货方式</th>
 											<th>是否打印</th>
 											<th>任务单号</th>
 											<th>预定单号</th>
 											<th>提交人</th>
 											<th>确认时间</th>
 										</tr>
 									</thead>
 									<tbody>
 										<tr v-for="(item, index) in listData" :key="item.id" class="table-row" :class="[
											    index % 2 == 1 ? 'tr-even' : '', 
											    item.isChecked ? 'tr-checked' : ''
											  ]">
 											<td class="fixed-col1 td-checkbox">
 												<view v-if="item.BILL_STATUS=='1'" @click="toggleTaskChecked(index)"
 													class="task-checkbox" :class="{ 'checked': item.isChecked }">
 													<image v-if="item.isChecked" class="check-icon"
 														src="../../images/imgbh/gou@1x.png" mode="widthFix"></image>
 												</view>
 												<view v-else class="task-checkbox task-checkbox-none"> </view>
 											</td>
 											<td class="fixed-col2">{{ index + 1 }}</td>
 											<td class="fixed-col3 " @click.stop="openOrderModal(item)">
 												<view class="fixed-tdd">
 													{{ item.SPID.slice(8) }}-{{item.SPNAME}}
 													<view class="tab-dashed"></view>
 												</view>
 											</td>
 											<td>{{ item.GYS=='C'?"ToC任务":"其他" }}</td>
 											<td>{{ item.DATE_DH }}</td>
 											<td>{{ item.ZQTY_SQ }}</td>
 											<td>{{ item.UNIT }}</td>
 											<td>{{ item.SPECS }}</td>
 											<td>{{ item.NOTE }}</td>
 											<td>{{ item.DHSJD }}</td>
 											<td style="text-align: left;">{{ item.KHID }}-{{ item.KHNAME }}</td>
 											<!-- <td>{{ item.QH_NOTE }}</td> -->
 											<td>{{ item.BILL_STATUS_NAME }}</td>
 											<td>{{ item.YN_SC=="Y"?"是":"否" }}</td>
 											<td>{{ item.YN_YD=="Y"?"是":"否" }}</td>
 											<td>{{ item.PSTYPE_NAME }}</td>
 											<td>{{ item.YN_PRINT=="N"?"否":("是-"+(item.YN_PRINT=='Y'?'1':item.YN_PRINT)) }}
 											</td>
 											<td>{{ item.BILL }}</td>
 											<td>{{ item.BILL_YD }}</td>
 											<td>{{ item.RY_NAME }}</td>
 											<td>{{ item.DATE_XG }}</td>
 										</tr>
 									</tbody>
 								</table>
 							</div>
 						</div>
 					</view>
 				</view>

 			</view>
 		</view>

 		<!-- 底部操作栏 -->
 		<!-- 	<view class="bottom-bar">
 			<view class="bar-btn bar-refresh" v-if="bhstep == 1" @click="GetBHQHOrders(1)">
 				<image src="../../images/imgbh/shuaxin.png" mode="widthFix"></image>刷新列表
 			</view>
 			<view class="bar-btn bar-filter" @click="openFilterModal">
 				<image src="../../images/imgbh/sxuan@1x.png" mode="widthFix"></image>任务筛选
 			</view>
 			<view class="bar-btn bar-cancel" @click="BHQHInput('0')">
 				<image src="../../images/imgbh/qux@1x.png" mode="widthFix"></image>取消生产
 			</view>
 			<view class="bar-btn bar-scan" @click="ScanInput">
 				<image src="../../images/imgbh/sma@1x.png" mode="widthFix"></image>扫码入库
 			</view>
 			<view class="bar-btn bar-warehouse" @click="BHQHInput('1')">
 				<image src="../../images/imgbh/ruk@1x.png" mode="widthFix"></image>入库
 			</view>
 		</view> -->


 		<!-- 任务筛选弹窗 -->
 		<view class="filter-modal" v-show="showFilterModal" @click="closeFilterModal">
 			<view :style="{ bottom: isKeyBoardShow ? '700rpx' : '' }" class="filter-content" @click.stop>

 				<h1 style="width: 100%;display: flex;justify-content: space-between;">
 					<!-- <image style=" position: absolute;top: -32rpx;left: -32rpx;" src="../../images/imgbh/tanc-bg@1x.png" mode="widthFix"></image> -->
 					<text class="filter-title" style="border-bottom: none;">任务筛选</text>

 					<!-- 关闭 -->
 					<image src="../../images/imgpro/schuxx.png" style="width:56rpx;height:56rpx;"
 						@click="closeFilterModal" mode="widthFix"></image>
 				</h1>



 				<!-- 1. 任务来源 暂不启用-->
 				<!-- <view class="filter-section">
 					<text class="section-label">任务来源：</text>
 					<radio-group v-model="filterForm.source" class="radio-group" @change="handleSourceChange">
 						<view class="radio-item" style="margin-right: 20rpx;" v-for="(item, index) in sourceOptions"
 							:key="item.value">
 							<radio :value="item.value" color="#006537"
 								style="margin-right:32rpx;display: flex;align-items: center;" />
 							<text class="radio-text">{{ item.label }}</text>
 						</view>
 					</radio-group>
 				</view> -->

 				<!-- 2. 开关组（是否预订/裱花直配/电商） -->
 				<view class="filter-section switch-group">
 					<label class="switch-item">
 						<text class="section-label">是否预订：</text>
 						<switch :checked="filterForm.isPreOrder" style="display:flex;position: relative;left: -14rpx;"
 							color="#42B14B" @change="filterForm.isPreOrder = $event.detail.value" />
 					</label>
 					<label class="switch-item">
 						<text class="section-label" style="width:200rpx;">是否裱花直配：</text>
 						<switch :checked="filterForm.isDirect" style="display:flex;position: relative;left: -14rpx;"
 							color="#42B14B" @change="filterForm.isDirect = $event.detail.value" />
 					</label>
 					<label class="switch-item">
 						<text class="section-label">是否电商：</text>
 						<switch :checked="filterForm.isEcommerce" style="display:flex;position: relative;left: -14rpx;"
 							color="#42B14B" @change="filterForm.isEcommerce = $event.detail.value" />
 					</label>
 				</view>

 				<!-- 3. 提货方式 -->
 				<view class="filter-section">
 					<text class="section-label">提货方式：</text>
 					<radio-group v-model="filterForm.pickupType" class="radio-group" @change="handlePickupChange">
 						<label class="radio-item" style="margin-right: 20rpx;" v-for="(item, index) in pickupOptions"
 							:key="item.value">
 							<radio :value="item.value" color="#006537"
 								style="margin-right:32rpx;display: flex;align-items: center;"
 								:checked="item.value == filterForm.pickupType" />
 							<text class="radio-text">{{ item.label }}</text>
 						</label>
 					</radio-group>
 				</view>
 				<view class="filter-section">
 					<text class="section-label">任务类型：</text>
 					<radio-group v-model="filterForm.yn_toc" class="radio-group" @change="handleToCChange">
 						<label class="radio-item" style="margin-right: 20rpx;">
 							<radio value="ALL" color="#006537"
 								style="margin-right:32rpx;display: flex;align-items: center;"
 								:checked="filterForm.yn_toc=='ALL'" />
 							<text class="radio-text">全部</text>
 						</label>
 						<label class="radio-item" style="margin-right: 20rpx;">
 							<radio value="C" color="#006537"
 								style="margin-right:32rpx;display: flex;align-items: center;"
 								:checked="filterForm.yn_toc=='C'" />
 							<text class="radio-text">ToC</text>
 						</label>
 						<label class="radio-item" style="margin-right: 20rpx;">
 							<radio value="N" color="#006537"
 								style="margin-right:32rpx;display: flex;align-items: center;"
 								:checked="filterForm.yn_toc=='N'" />
 							<text class="radio-text">其他</text>
 						</label>
 					</radio-group>
 				</view>
 				<!-- 4. 到货日期 -->
 				<view class="filter-section input-section">
 					<text class="section-label">到货日期：</text>
 					<view style="flex:1">
 						<picker style="width: 100%;" mode="date" :value="filterForm.arrivalDate" @change="onDateChange"
 							class="filter-picker">
 							<view :class="filterForm.arrivalDate ? 'picker-label' : 'picker-placeholder'">
 								{{ filterForm.arrivalDate || '请选择日期' }}
 							</view>
 						</picker>
 					</view>
 				</view>

 				<!-- 5. 到货时段 -->
 				<view class="filter-section input-section">
 					<text class="section-label">到货时段：</text>
 					<view style="flex:1">
 						<picker :value="filterForm.arrivalTimeIndex" :range="timeOptions" range-key="label"
 							@change="onTimeChange" class="filter-picker">
 							<view :class="filterForm.arrivalTime ? 'picker-label' : 'picker-placeholder'">
 								{{ filterForm.arrivalTime || '请选择时段' }}
 							</view>
 						</picker>
 					</view>

 				</view>

 				<!-- 6. 要货门店-支持模糊搜索 -->
 				<view class="filter-section input-section" style="position:relative;">
 					<text class="section-label">要货门店：</text>
 					<view style="flex:1;position: relative;">
 						<input @click="showBorad('store')" style="background:#F5F5F5" disabled
 							v-model="filterForm.shopName" placeholder="请选择门店" class="filter-picker"
 							@focus="showDropdown_shop = true" @blur="delayCloseShopDropdown" />
 						<view style="opacity: 0;position: absolute;left:0;top:0;height:100%;width:100%"
 							@click="showBorad('store')"></view>
 						<view v-if="showDropdown_shop && filteredShopList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 100%;  max-height: 340rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
 							<view v-for="(item, index) in filteredShopList" :key="index"
 								style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;font-size:28rpx"
 								@click.stop="selectShop(item)">
 								{{item.ADDR}}
 							</view>
 						</view>

 						<view v-if="showDropdown_shop && !filteredShopList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 98%; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999; z-index: 100000;">
 							暂无匹配门店
 						</view>

 						<!-- 关闭 -->

 						<!-- <picker :value="0" :range="THKHDATA" range-key="ADDR" @change="selectShop"
					  class="filter-picker">
						<text>{{ filterForm.shopName || '请选择门店' }}</text>
					</picker> -->
 					</view>
 					<image src="../../images/jsd-gb.png"
 						style="width:40rpx;height:40rpx;position: absolute;right: 80rpx;" @click.stop="clearShop()"
 						mode="widthFix"></image>

 					<image src="../../images/imgbh/rjp@1.5x.png" style="width:40rpx;height:40rpx;margin-left:10rpx;"
 						@click="showBorad('store')" mode="widthFix"></image>
 				</view>

 				<!-- 7. 任务商品-支持模糊搜索 -->
 				<view class="filter-section input-section" style="position:relative;">
 					<text class="section-label">任务商品：</text>
 					<view style="flex:1;position: relative;">
 						<input @click="showBorad('good')" style="background:#F5F5F5" disabled
 							v-model="filterForm.goodsName" placeholder="请选择任务商品" class="filter-picker"
 							@focus="showDropdown_goods = true" @blur="delayCloseGoodsDropdown" />
 						<view style="opacity: 0;position: absolute;left:0;top:0;height:100%;width:100%"
 							@click="showBorad('good')"></view>
 						<view v-if="showDropdown_goods && filteredGoodsList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 100%;  max-height: 340rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
 							<view v-for="(item, index) in filteredGoodsList" :key="index"
 								style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;font-size:28rpx"
 								@click.stop="selectGoods(item)">
 								{{item.SNAME}}_{{item.SPID}}
 							</view>
 						</view>
 						<view v-if="showDropdown_goods && !filteredGoodsList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 98%; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999; z-index: 100000;">
 							暂无匹配任务商品
 						</view>



 					</view>
 					<!-- 关闭 -->
 					<image src="../../images/jsd-gb.png"
 						style="width:40rpx;height:40rpx;position: absolute;right: 80rpx;" @click.stop="clearGoods()"
 						mode="widthFix"></image>

 					<image src="../../images/imgbh/rjp@1.5x.png" style="width:40rpx;height:40rpx;margin-left:10rpx"
 						@click="showBorad('good')" mode="widthFix"></image>
 				</view>

 				<!-- 底部按钮组 -->
 				<view class="filter-btn-group">
 					<button class="btn-cancel" @click="resetFilterModal">重置</button>
 					<button class="btn-confirm" @click="confirmFilter">确认筛选</button>
 				</view>
 			</view>
 		</view>

 		<!-- 右侧订单详情弹窗 -->
 		<view class="order-modal" v-show="showOrderModal" @click="closeOrderModal">
 			<view class="modal-content" :class="{ 'modal-show': showOrderModal }" @click.stop>
 				<!-- 弹窗头部 -->
 				<view class="modal-header">
 					<view class="modal-title">{{currentOrder.TYPE_NAME}}</view>
 					<view class="pickup-time">提货时间：{{ currentOrder.THDATE }}</view>
 				</view>

 				<!-- 订单基础信息 -->
 				<view class="order-info">
 					<view class="info-row">
 						<text class="info-label">单号：</text>
 						<text class="info-value">{{ currentOrder.BILL }}</text>
 					</view>
 					<view class="info-row">
 						<text class="info-label">提货门店：</text>
 						<text class="info-value">{{ currentOrder.TH_KH_NAME }}</text>
 					</view>
 					<view class="info-row">
 						<text class="info-label">顾客：</text>
 						<text class="info-value">{{ currentOrder.CUSTMNAME }}</text>
 					</view>
 					<view class="info-row">
 						<text class="info-label">手机号：</text>
 						<text class="info-value">{{ currentOrder.CUSTMPHONE }}</text>
 					</view>
 					<view class="info-row">
 						<text class="info-label">地址：</text>
 						<text class="info-value">{{ currentOrder.CUSTMADDRESS }}</text>
 					</view>
 					<view class="info-row">
 						<text class="info-label">顾客要求：</text>
 						<text class="info-value">{{ currentOrder.CUSTMCOMM }}</text>
 					</view>
 					<view class="info-row">
 						<text class="info-label">下单时间：</text>
 						<text class="info-value">{{ currentOrder.SALETIME }}</text>
 					</view>
 					<view class="info-row">
 						<text class="info-label">下单门店：</text>
 						<text class="info-value">{{ currentOrder.XD_KH_NAME }}</text>
 					</view>
 				</view>

 				<!-- 商品列表 -->
 				<view class="goods-list">
 					<view class="goods-item" v-for="(goods, index) in currentOrder.GOODS" :key="index">
 						<view class="goods-info">
 							<text class="goods-name">{{ goods.SP_NAME }}</text>
 							<text class="goods-spec"><text style="margin-right:60rpx;">
 									<image src="../../images/dx-bm.png"
 										style="width:32rpx;height:32rpx;vertical-align: bottom;margin-right:6rpx"
 										mode="widthFix"></image>{{ goods.SPID }}
 								</text> <text>
 									<image src="../../images/dx-dw.png"
 										style="width:32rpx;height:32rpx;vertical-align: bottom;margin-right:6rpx"
 										mode="widthFix"></image>{{ goods.SPECS }}
 								</text></text>
 						</view>
 						<view class="goods-price">
 							<text class="goods-qty">x{{ goods.QTY }}<text
 									style="color:#777777;font-size:28rpx;">/{{ goods.UNIT }}</text></text>
 							<text class="goods-amount">¥{{ goods.NET }}</text>
 						</view>
 					</view>
 				</view>

 				<!-- 订单合计 -->
 				<view class="order-summary">
 					<view class="summary-row">
 						<text class="summary-label">总金额</text>
 						<text class="summary-value">¥{{ currentOrder.totalAmount }}</text>
 					</view>
 					<view class="summary-row">
 						<text class="summary-label">件数</text>
 						<text class="summary-value">x{{ currentOrder.totalQty }}</text>
 					</view>
 				</view>

 				<!-- 底部关闭按钮 -->
 				<view class="modal-footer">
 					<view class="close-modal-btn" @click="closeOrderModal">关 闭</view>
 				</view>
 			</view>
 		</view>
 		<!-- 软键盘 -->
 		<KeyboardInput :custom-style="myKeyboardStyle" :isShow="isKeyBoardShow" @close="turnOffKeys"
 			@confirm="handleKeyboardConfirm" />

 		<!-- 模拟扫码框 -->
 		<ScanModal :show.sync="showScanModal" tip-text="扫码录入裱花任务！" @confirm="handleScanResult" />
 	</view>
 </template>

 <script>
 	var app = getApp();
 	import Head from '@/pages/Home/Component/YWHead.vue';
 	import NumberFormat from '@/components/NumberFormat/NumberFormat.vue';
 	import KeyboardInput from '@/components/KeyboardInput/KeyboardInput.vue';
 	import ScanModal from '@/components/ScanModal/ScanModal.vue'
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
 			KeyboardInput,
 			ScanModal
 		},
 		data() {
 			return {
 				myKeyboardStyle: {
 					zIndex: 999999,
 					backgroundColor: '#fff',
 					boxShadow: '0 -6px 10px rgb(255,255,255), 0 4px 15px rgba(0,0,0,0.3)',
 					borderRadius: '22rpx',
 					width: '1400rpx',
 					padding: '0 30rpx 0',
 					position: 'absolute',
 					bottom: '80rpx',
 					left: '50%',
 					transform: 'translateX(-50%)'
 				},
 				BUSSINESS_NAME: '生产任务',
 				isKeyBoardShow: false,
 				searchType: 'store', // store 门店 good 商品
 				tabList: [{
 						label: "全部(个)",
 						key: "ALL",
 						value: 0,
 						active: true
 					},
 					{
 						label: "未打印(个)",
 						key: "DJD",
 						value: 0,
 						active: false
 					},
 					{
 						label: "待生产(个)",
 						key: "DSC",
 						value: 0,
 						active: false
 					},
 					{
 						label: "生产中(个)",
 						key: "SCZ",
 						value: "--",
 						active: false
 					},
 					{
 						label: "已入库(个)",
 						key: "YRK",
 						value: 0,
 						active: false
 					},
 					{
 						label: "已作废(个)",
 						key: "YZF",
 						value: 0,
 						active: false
 					},
 					{
 						label: "超时预警(个)",
 						key: "CSYJ",
 						value: 0,
 						active: false
 					}
 				],

 				mainSale: {},
 				showSign: false,
 				showSignOut: false,
 				signOutDate: [],
 				signOutDates: [],
 				curWeek: dateformat.getWeekDate(),
 				curDate: dateformat.getYMD(),
 				timer: null,
 				bhstep: 1, // 1默认裱花请货页面 2查询列表页面
 				angle: 0,
 				angles: 0,
 				angless: 0,
 				syyjk: {}, //收银员是否结款
 				version: "1.0.0", //版本号
 				IMAGES: [],
 				MainSale: {},
 				//  任务列表
 				urgentData: [],
 				scheduledData: [],
 				pickupData: [],
 				allChecked: false, // 全选状态
 				listData: [], // 筛选列表
 				_listData: [], // 筛选列表 原集合
 				urgentStats: {
 					completed: 0,
 					total: 0,
 					progress: '0'
 				},
 				scheduledStats: {
 					completed: 0,
 					total: 0,
 					progress: '0'
 				},
 				pickupStats: {
 					completed: 0,
 					total: 0,
 					progress: '0'
 				},

 				// 筛选弹窗相关数据
 				showFilterModal: false,
 				_filterForm: {},
 				// 筛选表单数据
 				filterForm: {
 					khid: "",
 					source: '门店',
 					isPreOrder: false,
 					isDirect: false,
 					isEcommerce: false,
 					pickupType: '-1',
 					yn_toc: 'ALL',
 					arrivalDate: dateformat.getYMD(),
 					arrivalTime: '',
 					arrivalTimeId: '',
 					arrivalTimeIndex: -1,
 					shopId: '',
 					shopName: '',
 					goodsId: '',
 					goodsName: ''
 				},
 				// 筛选选项列表
 				sourceOptions: [{
 						label: '门店',
 						value: '门店'
 					},
 					{
 						label: '小程序',
 						value: '小程序'
 					},
 					{
 						label: '美团外卖',
 						value: '美团外卖'
 					},
 					{
 						label: '饿了么',
 						value: '饿了么'
 					},
 					{
 						label: '京东闪送',
 						value: '京东闪送'
 					},
 					{
 						label: '抖音团购',
 						value: '抖音团购'
 					}
 				],
 				pickupOptions: [],
 				timeOptions: [],
 				THKHDATA: [],
 				SPDATA: [],

 				// 右侧弹窗数据
 				showOrderModal: false, // 弹窗显示状态
 				currentOrder: {},

 				showScanModal: false, // 扫码弹窗
 				showDropdown_shop: false,
 				showDropdown_goods: false,
 				filteredShopList: [], // 过滤后的 门店列表
 				filteredGoodsList: [], // 过滤后的 商品列表
 			};
 		},
 		computed: {

 		},
 		components: {
 			Head,
 		},
 		// 监听列表数据变化，自动更新全选状态
 		watch: {
 			// 深度监听listData的变化
 			listData: {
 				handler() {
 					this.updateAllCheckedStatus();
 				},
 				deep: true
 			}
 		},
 		methods: {
 			// 软键盘相关
 			handleKeyboardConfirm(query) {
 				const keyword = query.query.trim() // 搜索关键词
 				console.log("搜索值：", keyword);
 				// searchType:'store', // store 门店 good 商品
 				if (this.searchType == 'store') {
 					this.showDropdown_shop = true

 					if (!keyword) {
 						this.filteredShopList = this.THKHDATA;
 					}
 					this.filteredShopList = this.THKHDATA.filter(item => {
 						if (!item.SNAME && !item.PINYIN) return false;

 						// 匹配
 						const targetText = item.KHID || item.PINYIN.toUpperCase();
 						if (item.KHID.includes(keyword) || item.PINYIN.toUpperCase().includes(keyword))
 							return true;
 						else
 							return false;
 					});
 				}
 				if (this.searchType == 'good') {
 					this.showDropdown_goods = true

 					if (!keyword) {
 						this.filteredGoodsList = this.SPDATA;
 					}
 					this.filteredGoodsList = this.SPDATA.filter(item => {
 						if (!item.SPID && !item.PINYIN) return false;
 						// 匹配
 						if (item.SPID.includes(keyword) || item.PINYIN.toUpperCase().includes(keyword))
 							return true;
 						else
 							return false;
 					});
 				}
 			},
 			// 关闭键盘
 			turnOffKeys() {
 				this.isKeyBoardShow = false

 				this.showDropdown_shop = false
 				this.showDropdown_goods = false
 			},

 			// 新增：延迟关闭门店下拉列表
 			delayCloseShopDropdown() {
 				setTimeout(() => {
 					this.showDropdown_shop = false;
 				}, 200);
 			},

 			// 新增：延迟关闭商品下拉列表
 			delayCloseGoodsDropdown() {
 				setTimeout(() => {
 					this.showDropdown_goods = false;
 				}, 200);
 			},
 			openOrderModal(item) {
 				this.showOrderModal = true;
 				// 禁止背景滚动
 				// document.body.style.overflow = 'hidden';
 				this.GetYWBHQHDetail(item);
 			},

 			// 关闭弹窗
 			closeOrderModal() {
 				this.showOrderModal = false;
 				this.currentOrder = {};
 				// 恢复背景滚动
 				// document.body.style.overflow = 'auto';
 			},
 			// 更新全选按钮状态
 			updateAllCheckedStatus() {
 				if (this.listData.length === 0) {
 					this.allChecked = false;
 					return;
 				}
 				this.allChecked = this.listData.filter(item => item.BILL_STATUS == '1').every(item => item.isChecked);
 			},

 			// 全选/取消全选
 			handleAllCheck() {
 				const isAllChecked = !this.allChecked;
 				// this.allChecked = isAllChecked;
 				// 遍历所有数据项，统一设置选中状态
 				this.listData.forEach(item => {
 					if (item.BILL_STATUS == '1')
 						item.isChecked = isAllChecked;
 				});
 			},
 			// 切换任务勾选状态
 			toggleTaskChecked(index) {
 				// if (this.listData[index].BILL_STATUS == '1') {
 				let it = this.listData[index];
 				const check = it.isChecked;
 				const bill_yd = it.BILL_YD;
 				console.log("toggleTaskChecked:", it);
 				this.listData.map((r, i, arr) => {
 					if ((r.BILL_STATUS == '1' && r.BILL_YD && r.BILL_YD == bill_yd) || i == index) {
 						r.isChecked = !check;
 					}
 				})
 				// }
 			},
 			toggleActive(index, obj) {
 				this.tabList = this.tabList.map((item, i) => ({
 					...item,
 					active: i === index
 				}));
 				if (obj.key == "ALL") {
 					that.listData = that._listData;
 				}
 				if (obj.key == "SCZ") {
 					that.listData = [];
 				}
 				if (obj.key == "DJD") {
 					that.listData = that._listData.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_PRINT == 'N');
 				}
 				if (obj.key == "DSC") {
 					that.listData = that._listData.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_SC == 'N');
 				}
 				if (obj.key == "YRK") {
 					that.listData = that._listData.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_SC == 'Y');
 				}
 				if (obj.key == "YZF") {
 					that.listData = that._listData.filter(r1 => r1.BILL_STATUS == '9');
 				}
 				if (obj.key == "CSYJ") {
 					that.listData = that._listData.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_SC == 'N' && dateformat
 						.isLessThanOneHour(r1.NOTE, 50));
 				}
 			},
 			handleSourceChange(e) {
 				this.filterForm.source = e.detail.value;
 			},
 			handlePickupChange(e) {
 				this.filterForm.pickupType = e.detail.value;
 			},
 			handleToCChange(e) {
 				this.filterForm.yn_toc = e.detail.value;
 			},
 			// 切换任务勾选状态
 			toggleTaskDone(type, index) {
 				if (type === 'urgent') {
 					this.urgentData[index].done = !this.urgentData[index].done;
 				} else if (type === 'scheduled') {
 					this.scheduledData[index].done = !this.scheduledData[index].done;
 				} else if (type === 'pickup') {
 					this.pickupData[index].done = !this.pickupData[index].done;
 				}
 			},
 			onLoad: async function() {
 				that = this;
 				console.log("ywbhqh.onload");
 				// that.GetBHQHOrders(); //获取裱花单


 				that.filterTasks();
 				that.getTHTYPE(); //获取提货类型
 				that.getDHSJD(); //获取到货时间段
 				that.getKHDA(); //获取到货时间段
 				that.getSPDA(); //获取商品数据
 			},
 			onShow: function() {

 			},
 			//数据库查询
 			GetBHQHOrders: function(t) {
 				console.log("123123");
 				let store = util.getStorage("store");
 				let data1 = {
 					khid: store.KHID,
 					gsid: store.GSID,
 					date: this.curDate,
 				};
 				// util.simpleModal("提示", JSON.stringify(data1));
 				_ywbhqh.GetBHQHOrders(data1, res => {
 					// util.simpleModal("提示1", "完成查询结果：" + res.data.substr(1, 50));
 					console.log("查询到的裱花请货数据：", res);
 					if (res.code) {
 						let data = JSON.parse(res.data);
 						if (data.toc.length > 0) {
 							let arr = data.toc.map(r => {
 								return {
 									bill: r.STR6,
 									time: r.NOTE2,
 									size: r.SPECS,
 									name: r.STR5,
 									qty: r.BQTY,
 									shop: r.STR4,
 									done: false,
 									finish: r.YN_SC
 								}
 							});
 							that.urgentData = arr.filter(r => r.finish != 'Y').concat(arr.filter(r => r
 								.finish == 'Y'));
 							that.urgentStats.total = that.urgentData.length;
 							let finish = that.urgentData.filter(r => r.finish == 'Y').length;
 							that.urgentStats.completed = finish;
 							that.urgentStats.progress = util.newFloat(finish / that.urgentData.length);
 						} else {
 							that.urgentData = [];
 							that.urgentStats.total = 0;
 							that.urgentStats.completed = 0;
 							that.urgentStats.progress = 0;
 						}
 						if (data.ps.length > 0) {
 							let arr = data.ps.map(r => {
 								return {
 									bill: r.STR6,
 									time: r.NOTE2,
 									size: r.SPECS,
 									name: r.STR5,
 									qty: r.BQTY,
 									shop: r.STR4,
 									done: false,
 									finish: r.YN_SC
 								}
 							});
 							that.scheduledData = arr.filter(r => r.finish != 'Y').concat(arr.filter(r => r
 								.finish == 'Y'));
 							that.scheduledStats.total = that.scheduledData.length;
 							let finish = that.scheduledData.filter(r => r.finish == 'Y').length;
 							that.scheduledStats.completed = finish;
 							that.scheduledStats.progress = util.newFloat(finish / that.scheduledData.length);
 						} else {
 							that.scheduledData = [];
 							that.scheduledStats.total = 0;
 							that.scheduledStats.completed = 0;
 							that.scheduledStats.progress = 0;
 						}
 						if (data.zt.length > 0) {
 							let arr = data.zt.map(r => {
 								return {
 									bill: r.STR6,
 									time: r.NOTE2,
 									size: r.SPECS,
 									name: r.STR5,
 									qty: r.BQTY,
 									shop: r.STR4,
 									done: false,
 									finish: r.YN_SC
 								}
 							});
 							that.pickupData = arr.filter(r => r.finish != 'Y').concat(arr.filter(r => r
 								.finish == 'Y'));
 							that.pickupStats.total = that.pickupData.length;
 							let finish = that.pickupData.filter(r => r.finish == 'Y').length;
 							that.pickupStats.completed = finish;
 							that.pickupStats.progress = util.newFloat(finish / that.pickupData.length);
 						} else {
 							that.pickupData = [];
 							that.pickupStats.total = 0;
 							that.pickupStats.completed = 0;
 							that.pickupStats.progress = 0;
 						}
 					} else {
 						that.urgentData = [];
 						that.urgentStats.total = 0;
 						that.urgentStats.completed = 0;
 						that.urgentStats.progress = 0;
 						that.scheduledData = [];
 						that.scheduledStats.total = 0;
 						that.scheduledStats.completed = 0;
 						that.scheduledStats.progress = 0;
 						that.pickupData = [];
 						that.pickupStats.total = 0;
 						that.pickupStats.completed = 0;
 						that.pickupStats.progress = 0;
 						if (t)
 							util.simpleMsg("暂无更多数据!", true);
 					}
 				})
 			},
 			//裱花出入库
 			BHQHInput: function(yn_rk, e, obj) {
 				if (!common.CheckSign(1)) {
 					return;
 				}
 				let bills = "",
 					tit = "入库";
 				console.log("e", e);
 				if (yn_rk != "1")
 					tit = "作废";
 				if (!e) {
 					let Arr = that.listData.filter(r => r.isChecked).map(r => r.BILL);
 					if (Arr.length <= 0) {
 						util.simpleMsg("请选择要" + tit + "的单据！");
 						return;
 					}
 					bills = Arr.join(',');
 					tit += "这批裱花任务";
 				} else {
 					bills = e;
 					tit += "裱花任务：" + e;
 				}
 				if (obj)
 					that._BHQHInput(tit, yn_rk, bills);
 				else
 					util.simpleModal("提示", "是否" + tit + "？", (conf) => {
 						if (conf) {
 							that._BHQHInput(tit, yn_rk, bills);
 						}
 					})
 			},
 			//裱花任务详情
 			GetYWBHQHDetail: function(e) {
 				if (!e.BILL_YD) {
 					this.currentOrder = {};
 					util.simpleMsg("暂无预定单详情！", true);
 					return;
 				}
 				let data1 = {
 					bill: e.BILL_YD
 				};
 				_ywbhqh.GetYWBHQHDetail(data1, res => {
 					console.log("GetYWBHQHDetail：", res);
 					if (!res.code) {
 						this.currentOrder = {};
 						util.simpleMsg(res.msg, true);
 						return;
 					}
 					let data = JSON.parse(res.data);
 					let tqty = 0,
 						tnet = 0;
 					let spArr = data.map(r => {
 						tqty += r.QTY;
 						tnet += r.NET;
 						return {
 							SPID: r.SPID,
 							SP_NAME: r.SP_NAME,
 							QTY: r.QTY,
 							UNIT: r.UNIT,
 							SPECS: r.SPECS,
 							NET: r.NET
 						}
 					})
 					let detail = data[0];
 					detail.GOODS = spArr;
 					detail.totalQty = tqty;
 					detail.totalAmount = tnet;
 					this.currentOrder = detail;
 					console.log("详情结果：", detail);
 				})
 			},

 			_BHQHInput: function(tit, yn_rk, bills) {
 				let store = util.getStorage("store");
 				let data1 = {
 					khid: store.KHID,
 					gsid: store.GSID,
 					posid: store.POSID,
 					ryid: store.RYID,
 					ryname: store.RYNAME,
 					sfrk: yn_rk,
 					billNos: bills
 				};
 				_ywbhqh.BHQHInput(data1, res => {
 					console.log("BHQHInput：", res);
 					if (res.code)
 						util.simpleMsg(tit + "操作成功！");
 					else
 						util.simpleMsg(res.msg, true);
 					setTimeout(() => {
 						this.filterTasks(); //刷新列表
 					}, 1500);
 				})
 			},
 			//裱花任务打印
 			BHQHOrderPrint: function() {
 				let Arr = that.listData.filter(r => r.isChecked); //勾选的单
 				let Arr1 = that.listData.filter(r => !r.isChecked && r.BILL_STATUS == '1'); //未勾选的单
 				if (Arr.length <= 0) {
 					util.simpleMsg("请选择要打印的单据！");
 					return;
 				}
 				let sameIds = [...new Set(Arr.filter(a => Arr1.some(b => a.BILL_YD && b.BILL_YD && b.BILL_YD === a
 					.BILL_YD)).map(item => item.BILL_YD))];
 				if (sameIds.length > 0) {
 					util.simpleMsg("请勾选相同预定单的裱花任务：" + sameIds);
 					return;
 				}
 				let date_dh = that.listData[0].DATE_DH;
 				let bills = Arr.map(r => r.BILL).join(',');
 				let store = util.getStorage("store");
 				util.simpleModal("提示", "是否要打印这批裱花任务？", (conf) => {
 					if (conf) {
 						let data1 = {
 							khid_bh: store.KHID,
 							date_dh,
 							bills
 						};
 						_ywbhqh.BHQHOrderPrint(data1, res => {
 							console.log("BHQHOrderPrint：", res);
 							if (res.code)
 								util.simpleModal("提示", "裱花任务打印成功，" + res.msg);
 							else
 								util.simpleMsg(res.msg, true);
 							setTimeout(() => {
 								this.filterTasks(); //刷新列表
 							}, 1500);
 						})
 					}
 				})
 			},
 			// 扫码入库 / 扫码作废
 			ScanInput(type) {
 				// if (!common.CheckSign(1)) return
 				this.scanType = type;
 				this.showScanModal = true;
 			},

 			// 接收扫码/输入结果
 			handleScanResult(code) {
 				this.BHQHInput(this.scanType, code, true);
 			},
 			// ScanInput(e) {
 			// 	if (!common.CheckSign(1)) {
 			// 		return;
 			// 	}
 			// 	util.simpleModal("提示", "扫码录入裱花任务！", (bo, res) => {
 			// 		console.log("扫码res：", res);
 			// 		if (bo) {
 			// 			if (res.content) //扫码内容
 			// 			{
 			// 				that.BHQHInput(e, res.content.trim());
 			// 			} else {
 			// 				util.simpleMsg("未识别到有效单号！");
 			// 			}
 			// 		}
 			// 	}, true);
 			// 	// uni.scanCode({
 			// 	// 	success: res => {
 			// 	// 		console.log("[ScanInput.success]扫码结果:", res);
 			// 	// 		if (res.result) //扫码内容
 			// 	// 		{
 			// 	// 			that.BHQHInput("1", res.result);
 			// 	// 		} else {
 			// 	// 			util.simpleMsg("未识别到有效单号！");
 			// 	// 		}
 			// 	// 	},
 			// 	// 	fail: err => {
 			// 	// 		console.log("[ScanInput.fail]扫码异常:", err);
 			// 	// 	}
 			// 	// })
 			// },
 			// //获取配送类型
 			getTHTYPE: function() {
 				that.pickupOptions = [{
 					value: "-1",
 					label: "全部"
 				}];
 				common.GetDapzcs("THTYPE", res => {
 					console.log("[getTHTYPE]提货类型数据：", res);
 					if (res.code && res.msg.length > 0) {
 						let arr = res.msg.map((item, index) => {
 							return {
 								value: item.ID_NR,
 								label: item.SNAME
 							};
 						}).filter(i => i.value != '2')
 						that.pickupOptions = that.pickupOptions.concat(arr);
 						console.log("[getTHTYPE]提货类型数据THTYPES：", that.pickupOptions);
 					}
 				})
 			},
 			//获取到货时间段
 			getDHSJD: function() {
 				let store = util.getStorage("store");
 				common.GetDapzcs("DHSJD", res => {
 					console.log("[getDHSJD]到货时间段数据：", res);
 					if (res.code && res.msg.length > 0) {
 						that.timeOptions = res.msg.map((item, index) => {
 							return {
 								value: item.ID_NR,
 								label: item.SNAME
 							};
 						});
 						console.log("[getDHSJD]到货时间段数据：", that.timeOptions);
 					} else
 						that.timeOptions = [];
 				}, " and zf like '%" + store.GSID + "%'");
 			},
 			//获取门店信息
 			getKHDA: function() {
 				let store = util.getStorage("store");
 				_reserve.GetTHKHDA(store.GSID, store.KHID, res => {
 					console.log("[GetTHKHDA]门店数据：", res);
 					if (res.code && res.msg.length > 0) {
 						that.THKHDATA = res.msg;
 					} else {
 						that.THKHDATA = [];

 					}
 				});
 			},
 			//获取可售商品
 			getSPDA: function() {
 				let store = util.getStorage("store");
 				_ywbhqh.GetSPDA(store.KHID, res => {
 					console.log("[GetSPDA]商品数据：", res);
 					if (res.code && res.msg.length > 0) {
 						that.SPDATA = res.msg;
 					} else {
 						that.SPDATA = [];
 					}
 				}, "N", store.KHZID, store.DQID);
 			},
 			// ========== 新增筛选弹窗相关方法 ==========
 			// 打开筛选弹窗
 			openFilterModal() {
 				this.showFilterModal = true;
 				if (that._filterForm && JSON.stringify(that._filterForm) != "{}") //旧条件赋值
 					that.filterForm = that._filterForm;
 				this.$refs.bhHead.dropout = false;
 			},

 			//条件重置
 			resetFilterModal() {
 				this.filterForm = {
 					khid: "",
 					source: '门店',
 					isPreOrder: false,
 					isDirect: false,
 					isEcommerce: false,
 					pickupType: '-1',
 					yn_toc: 'ALL',
 					arrivalDate: dateformat.getYMD(),
 					arrivalTime: '',
 					arrivalTimeId: '',
 					arrivalTimeIndex: -1,
 					shopId: '',
 					shopName: '',
 					goodsId: '',
 					goodsName: ''
 				};
 			},
 			// 关闭筛选弹窗
 			closeFilterModal() {
 				this.showFilterModal = false;
 				this.isKeyBoardShow = false;
 			},
 			// 日期选择
 			onDateChange(e) {
 				this.filterForm.arrivalDate = e.detail.value;
 			},
 			// 时段选择
 			onTimeChange(e) {
 				const index = e.detail.value;
 				this.filterForm.arrivalTimeIndex = index;
 				this.filterForm.arrivalTime = this.timeOptions[index].label;
 				this.filterForm.arrivalTimeId = this.timeOptions[index].value;
 			},
 			// 选择门店
 			selectShop(item) {
 				this.filterForm.shopId = item.KHID;
 				this.filterForm.shopName = item.ADDR;
 				this.showDropdown_shop = false;
 				this.isKeyBoardShow = false;
 			},
 			// 选择商品
 			selectGoods(item) {
 				this.filterForm.goodsId = item.SPID;
 				this.filterForm.goodsName = item.SNAME;
 				this.showDropdown_goods = false;
 				this.isKeyBoardShow = false;
 			},
 			clearShop() {
 				this.filterForm.shopId = '';
 				this.filterForm.shopName = '';
 			},
 			clearGoods() {
 				this.filterForm.goodsId = '';
 				this.filterForm.goodsName = '';
 			},

 			// 确认筛选
 			confirmFilter() {
 				console.log('筛选条件：', this.filterForm);
 				// 在这里调用筛选接口或更新页面数据
 				// 示例：根据筛选条件过滤任务列表
 				this.filterTasks();
 				this.closeFilterModal();

 				// 切换列表模式
 				this.bhstep = 2;
 			},
 			// 根据筛选条件过滤任务列表（示例实现）
 			filterTasks() {
 				// 模拟筛选：实际替换为接口返回数据
 				// this.updateTaskStats();
 				console.log("filterTasks查询参数：", that.filterForm);
 				let store = util.getStorage("store");
 				that.filterForm.khid = store.KHID;
 				_ywbhqh.GetBHQHOrdersByParam(that.filterForm, res => {
 					console.log("GetBHQHOrdersByParam查询到的裱花请货数据：", res);
 					if (res.code) {
 						let data = JSON.parse(res.data);
 						data.map(r => {
 							r.isChecked = false;
 						})
 						console.log("GetBHQHOrdersByParam查询到的裱花请货数据data：", data);
 						that._listData = JSON.parse(JSON.stringify(data));
 						that.listData = data;
 					} else {

 						that._listData = [];
 						that.listData = [];

 						util.simpleMsg("暂无更多数据!", true);
 					}
 					that._filterForm = that.filterForm;
 					that.filterData(that.listData);
 					that.tabList.map((r, i, arr) => {
 						r.active = (i == 0 ? true : false);
 					})
 				})
 			},
 			//数据二次筛选
 			filterData(data) {
 				if (data && data.length > 0) {
 					that.tabList.map(r => {
 						if (r.key == 'ALL')
 							r.value = data.length;
 						if (r.key == 'DJD') {
 							let num = data.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_PRINT == 'N').reduce((sum,
 								it) => sum + it.ZQTY_SQ, 0);
 							r.value = num;
 						}
 						if (r.key == 'DSC') {
 							let num = data.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_SC == 'N').reduce((sum,
 									it) =>
 								sum + it.ZQTY_SQ, 0);
 							r.value = num;
 						}
 						if (r.key == 'YRK') {
 							let num = data.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_SC == 'Y').reduce((sum,
 									it) =>
 								sum + it.ZQTY_SQ, 0);
 							r.value = num;
 						}
 						if (r.key == 'YZF') {
 							let num = data.filter(r1 => r1.BILL_STATUS == '9').reduce((sum, it) => sum + it
 								.ZQTY_SQ,
 								0);
 							r.value = num;
 						}
 						if (r.key == 'CSYJ') {
 							let num = data.filter(r1 => r1.BILL_STATUS == '1' && r1.YN_SC == 'N' && dateformat
 								.isLessThanOneHour(r1.NOTE, 50)).reduce((sum, it) =>
 								sum + it.ZQTY_SQ, 0);
 							r.value = num;
 						}
 					})
 				} else {
 					that.tabList.map(r => {
 						r.value = 0;
 					})
 				}
 			},

 			// 更新任务统计数据
 			updateTaskStats() {
 				// 重新计算完成数和进度

 				// this.urgentStats.completed = this.urgentData.filter(item => item.done).length;
 				// this.urgentStats.total = this.urgentData.length;
 				// this.urgentStats.progress = this.urgentData.length > 0 ?
 				// 	Math.round((this.urgentStats.completed / this.urgentStats.total) * 100) : 0;

 				// this.scheduledStats.completed = this.scheduledData.filter(item => item.done).length;
 				// this.scheduledStats.total = this.scheduledData.length;
 				// this.scheduledStats.progress = this.scheduledData.length > 0 ?
 				// 	Math.round((this.scheduledStats.completed / this.scheduledStats.total) * 100) : 0;

 				// this.pickupStats.completed = this.pickupData.filter(item => item.done).length;
 				// this.pickupStats.total = this.pickupData.length;
 				// this.pickupStats.progress = this.pickupData.length > 0 ?
 				// 	Math.round((this.pickupStats.completed / this.pickupStats.total) * 100) : 0;
 			},
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

 				// 触摸移动 - 核心逻辑：强制分离X轴和Y轴
 				scrollY.addEventListener('touchmove', (e) => {
 					if (e.touches.length !== 1) return;
 					if (!this.scrollState.startX && this.scrollState.startX !== 0) return;

 					const touch = e.touches[0];

 					// 计算移动距离
 					const deltaX = touch.clientX - this.scrollState.startX;
 					const deltaY = touch.clientY - this.scrollState.startY;

 					const absDeltaX = Math.abs(deltaX);
 					const absDeltaY = Math.abs(deltaY);

 					// 判断滚动方向（只在开始时判断一次）
 					if (!this.scrollState.scrollDirection) {
 						if (absDeltaX > 5 || absDeltaY > 5) {
 							// 移动超过阈值才判定方向
 							if (absDeltaX > absDeltaY) {
 								this.scrollState.scrollDirection = 'horizontal';
 							} else {
 								this.scrollState.scrollDirection = 'vertical';
 							}
 							this.scrollState.isScrolling = true;
 						} else {
 							return; // 小于阈值认为是点击，不处理
 						}
 					}

 					// 根据确定的方向处理滚动
 					if (this.scrollState.scrollDirection === 'horizontal') {
 						// 只处理横向滚动
 						const maxScrollLeft = scrollX.scrollWidth - scrollX.clientWidth;
 						const newScrollLeft = this.scrollState.startScrollLeft - deltaX;
 						const limitedScrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));

 						// 应用横向滚动
 						scrollX.scrollLeft = limitedScrollLeft;

 						// 阻止页面滚动
 						e.preventDefault();

 					} else if (this.scrollState.scrollDirection === 'vertical') {
 						// 只处理纵向滚动
 						const maxScrollTop = scrollY.scrollHeight - scrollY.clientHeight;
 						const newScrollTop = this.scrollState.startScrollTop - deltaY;
 						const limitedScrollTop = Math.max(0, Math.min(maxScrollTop, newScrollTop));

 						// 应用纵向滚动
 						scrollY.scrollTop = limitedScrollTop;

 						// 阻止页面滚动
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
 			// this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale", uni);
 		},
 		mounted() {
 			this.$nextTick(() => {
 				this.initScrollHandler();
 			});
 		},
 		// 组件销毁前移除事件监听
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

 	.btns-list {
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		border-top: 4rpx dashed rgba(147, 192, 151, 0.35);
 		padding-top: 20rpx;
 		margin-bottom: 20rpx;
 	}

 	.btns-list .btns-groups {
 		display: flex;
 		align-items: center;
 		gap: 24rpx;
 	}

 	.btns-groups .btn1 {
 		padding: 20rpx 32rpx;
 		box-sizing: border-box;
 		background: #F3F3F3;
 		border-radius: 12rpx;

 		font-weight: 700;
 		font-size: 36rpx;
 		color: #333333;
 	}

 	.btns-groups .btn2 {
 		padding: 20rpx 32rpx;
 		box-sizing: border-box;
 		background: #006B44;
 		border-radius: 12rpx;

 		font-weight: 700;
 		font-size: 36rpx;
 		color: #fff;
 	}

 	.filter {
 		padding: 20rpx 32rpx;
 		box-sizing: border-box;
 		background: #E8F5E9;
 		border-radius: 12rpx;
 		border: 2rpx solid #CFE2D3;
 		font-size: 24rpx;

 		display: flex;
 		justify-content: center;
 		align-items: center;


 		font-family: PingFang SC, PingFang SC;
 		font-weight: 700;
 		font-size: 36rpx;
 		color: #006B44;
 	}

 	.filter image {
 		width: 30rpx;
 		height: 30rpx;
 		margin-right: 6rpx;
 	}

 	/* 整体容器 */
 	.status-tabs {
 		width: 100%;
 		background: #F5F7F6;
 		border-top-left-radius: 30rpx;
 		border-top-right-radius: 30rpx;
 		display: flex;
 		align-items: center;
 	}

 	/* 单个Tab项 */
 	.tab-item {
 		flex: 1;
 		display: flex;
 		flex-direction: column;
 		align-items: center;
 		justify-content: center;
 		padding: 32rpx 0;
 		position: relative;
 	}

 	/* 最后一项去掉右边框 */
 	.tab-item:last-child {
 		border-right: none;
 	}

 	/* 选中态样式 */
 	.tab-item.active {
 		/* background: #E6F7EF; */
 		/* border-radius: 24rpx; */
 		color: #006637;



 	}

 	/* Tab标签文字 */
 	.tab-label {
 		font-size: 40rpx;
 		font-weight: 500;
 		color: #536961;
 		margin-bottom: 24rpx;
 		position: relative;
 	}

 	.tab-item.active .tab-label {
 		color: #006637;
 		font-weight: 600;
 		font-size: 46rpx;
 	}

 	/* Tab数值 */
 	.tab-value {
 		font-size: 64rpx;
 		font-weight: 700;
 		color: #333333;
 		font-family: 'Bahnschrift', sans-serif;
 		/* 用你引入的数字字体 */
 	}

 	.tab-item.active .tab-value {
 		color: #006637;
 		font-size: 66rpx;
 	}

 	/* 非选中态底部绿色虚线 */
 	.tab-dashed {
 		position: absolute;
 		bottom: -10rpx;
 		left: 50%;
 		transform: translateX(-50%);
 		width: 44%;
 		height: 4rpx;
 		background: repeating-linear-gradient(to right,
 				#42B14B,
 				#42B14B 6rpx,
 				transparent 6rpx,
 				transparent 12rpx);
 	}

 	.tab-split-line {
 		position: absolute;
 		right: 0;
 		top: 50%;
 		height: 40%;
 		width: 0.5px;
 		background-color: #E5E5E5;
 		transform: translateY(-50%);
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
 		background-image: url('../../images/chushihua.png');
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

 	.tranlist {
 		position: relative;
 		z-index: 99;
 		width: 100%;
 		height: 88vh;
 		padding: 1% 2% 2%;
 		display: flex;
 		gap: 20rpx;
 		/* margin-bottom: 20rpx; */
 		box-sizing: border-box;
 	}

 	/* 三列卡片布局 */
 	.card-column {
 		flex: 1;
 		border-radius: 32rpx;
 		position: relative;
 		/* box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08); */
 		display: flex;
 		flex-direction: column;
 		position: relative;
 		/* border: 4rpx solid #B1E0B5; */
 		padding: 2% 1% 1%;
 		box-sizing: border-box;
 	}

 	.column-header {
 		width: 50%;
 		padding: 24rpx 20rpx;
 		/* border-bottom: 1rpx solid #eee; */
 		position: absolute;
 		top: -108rpx;
 		left: 8%;
 		z-index: 99999;
 		/* background: rgba(255, 255, 255, 0) */
 		/* background: #F8F9FA; */
 	}

 	.column-header .title {
 		font-size: 32rpx;
 		font-weight: 700;
 		color: #111111;
 		display: block;
 		margin-bottom: 8rpx;
 	}

 	.column-header .count {
 		font-size: 24rpx;
 		color: #111111;
 		display: block;
 		margin-bottom: 12rpx;
 	}

 	.column-header .count .text {
 		color: #006537;
 		font-weight: bold;
 	}

 	/* 进度条样式 */
 	.progress-container {
 		width: 100%;
 		height: 8rpx;
 		background-color: #e9ecef;
 		border-radius: 4rpx;
 		overflow: hidden;
 	}

 	.progress-bar {
 		height: 100%;
 		background-color: #4caf50;
 		border-radius: 4rpx;
 		transition: width 0.3s ease;
 	}

 	.task-list {
 		flex: 1;
 		overflow-y: auto;
 		padding: 16rpx;
 	}

 	.task-item {
 		position: relative;
 		padding: 20rpx;
 		box-sizing: border-box;
 		margin-bottom: 16rpx;
 		background: #fff;
 		border-radius: 16rpx;
 		border: 1rpx solid #eee;
 		display: flex;
 		align-items: flex-start;
 		gap: 16rpx;
 		cursor: pointer;
 		transition: all 0.2s ease;
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
 		right: 4%;
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

 	.task-main {
 		flex: 1;
 		display: flex;
 		flex-direction: column;
 		gap: 8rpx;
 	}

 	.task-time {
 		font-size: 32rpx;
 		font-weight: 600;
 		color: #006537;
 		white-space: nowrap;
 	}

 	.task-content {
 		flex: 1;
 		display: flex;
 		border-bottom: 2rpx solid #EFE7E7;
 		padding-bottom: 16rpx;
 		box-sizing: border-box;
 	}

 	.task-size {
 		height: 40rpx;
 		padding: 4rpx 8rpx;
 		box-sizing: border-box;
 		font-size: 24rpx;
 		font-weight: 700;
 		background: #42B14B;
 		display: flex;
 		align-items: center;
 		border-radius: 6rpx;
 		color: #fff;
 		margin-right: 16rpx;
 	}

 	.task-name {
 		font-size: 30rpx;
 		color: #111111;
 		margin-bottom: 6rpx;
 		font-weight: bold;
 	}

 	.task-shop {
 		font-size: 22rpx;
 		color: #555555;
 	}

 	.task-actions {
 		display: flex;
 		justify-content: space-between;
 		gap: 12rpx;
 		margin-top: 8rpx;
 	}

 	.action-btn {
 		padding: 6rpx 16rpx;
 		font-size: 24rpx;
 		border-radius: 8rpx;
 		font-weight: 600;
 	}

 	.action-discard {
 		color: #F39017;
 		background: #fff;
 		border: 1rpx solid #DEDEDE;
 		margin-right: 20rpx;
 	}

 	.action-warehouse {
 		color: #111111;
 		background: #fff;
 		border: 1rpx solid #DEDEDE;
 	}

 	/* 底部操作栏 */
 	.bottom-bar {
 		position: relative;
 		width: 100%;
 		height: 100rpx;
 		display: flex;
 		align-items: center;
 		justify-content: center;
 		gap: 40rpx;
 		z-index: 100;
 	}

 	.bar-btn {
 		padding: 12rpx 40rpx;
 		width: 200rpx;
 		height: 68rpx;
 		line-height: 68rpx;
 		border-radius: 28rpx;
 		font-size: 30rpx;
 		font-weight: 500;
 		color: #fff;
 		text-align: center;
 		display: flex;
 		align-items: center;
 		justify-content: center;
 	}

 	.bar-btn image {
 		width: 32rpx;
 		height: 32rpx;
 		margin-right: 10rpx;
 	}

 	.bar-refresh {
 		background: #17B586;
 	}

 	.bar-filter {
 		background: #006537;
 	}

 	.bar-cancel {
 		background: #F39017;
 	}

 	.bar-scan {
 		background: #42B14B;
 	}

 	.bar-warehouse {
 		background: #19C7A5;
 	}

 	.filter-modal {
 		position: fixed;
 		top: 0;
 		left: 0;
 		width: 100%;
 		height: 100%;
 		background-color: rgba(0, 0, 0, 0.5);
 		display: flex;
 		justify-content: center;
 		align-items: center;
 		z-index: 99999;
 		padding: 40rpx;
 		box-sizing: border-box;
 	}

 	.filter-modal .img {
 		position: absolute !important;
 		top: 0;
 	}

 	.filter-content {
 		position: absolute;


 		width: 1350rpx;
 		max-width: 750rpx;
 		height: 950rpx;
 		background-color: #fff;
 		border-radius: 16rpx;
 		padding: 32rpx;
 		/* overflow-y: auto; */
 		box-sizing: border-box;
 		/* position: relative; */

 		background-image: url('../../images/imgbh/tanc-bg@1x.png');
 		background-size: 100% 274rpx;
 		/* 禁止背景图重复平铺 */
 		background-repeat: no-repeat;
 		/* 可选：控制背景图垂直位置（比如置顶，也可设center/bottom） */
 		background-position: left top;
 	}

 	/* 标题 */
 	.filter-title {
 		font-size: 34rpx;
 		font-weight: 700;
 		color: #333;
 		display: block;
 		margin-bottom: 32rpx;
 		padding-bottom: 20rpx;
 		border-bottom: 1rpx solid #EEEEEE;
 	}

 	/* 通用区块 */
 	.filter-section {
 		margin-bottom: 28rpx;
 		display: flex;
 		padding: 0 100rpx 0 40rpx;
 		box-sizing: border-box;
 		/* flex-direction: column; */
 	}

 	/* 标签样式 */
 	.section-label {
 		font-size: 28rpx;
 		color: #333;
 		/* margin-bottom: 16rpx; */
 		display: block;
 		width: 160rpx;
 	}

 	/* Radio 组核心样式 */
 	.radio-group {
 		display: flex;
 		flex-wrap: wrap;
 		gap: 24rpx;
 		/* 选项之间的间距 */
 	}

 	.radio-item {
 		display: flex;
 		align-items: center;
 		font-size: 26rpx;
 		color: #333;
 	}

 	/* 原生 Radio 样式重置 */
 	radio {
 		width: 28rpx;
 		height: 28rpx;
 		margin-right: 8rpx;
 		/* Radio 和文字的间距 */
 	}

 	.radio-text {
 		font-size: 28rpx;
 		color: #333;
 	}

 	/* 开关组样式 - 还原设计图 */
 	.switch-group {
 		flex-direction: row;
 		flex-wrap: wrap;
 		gap: 48rpx;
 		align-items: center;
 	}

 	.switch-item {
 		display: flex;
 		align-items: center;
 		margin-bottom: 0;
 		margin-right: 40rpx;

 		display: flex;
 		align-items: center;
 		flex-direction: row;
 	}

 	.switch-item switch .switch-input {
 		height: 32rpx !important;
 	}

 	switch {
 		width: 56rpx;
 		height: 32rpx;
 	}

 	.switch-text {
 		font-size: 28rpx;
 		color: #333;
 		width: 40rpx;
 	}

 	/* 输入/选择器区域 */
 	.input-section {
 		flex-direction: row;
 		align-items: center;
 	}

 	.filter-picker,
 	.filter-input {
 		flex: 1;
 		height: 72rpx;
 		line-height: 72rpx;
 		border: 1rpx solid #E5E5E5;
 		border-radius: 8rpx;
 		padding: 0 20rpx;
 		font-size: 26rpx;
 		color: #999;
 		box-sizing: border-box;
 	}

 	.picker-placeholder {
 		color: gray;
 		font-size: 28rpx;
 	}

 	.picker-label {
 		color: #111;
 		font-size: 28rpx;
 	}

 	/* 按钮组 */
 	.filter-btn-group {
 		display: flex;
 		gap: 40rpx;

 		margin-top: 50rpx;
 		border-top: 2rpx solid #EAEAEA;

 		padding: 50rpx 100rpx 0 40rpx;
 		box-sizing: border-box;
 	}

 	.btn-cancel {
 		width: 40%;
 		height: 88rpx;
 		line-height: 88rpx;
 		border-radius: 14rpx;
 		color: #333333;
 		background: #EEEEEE;
 		font-weight: bold;
 	}

 	.btn-confirm {
 		width: 60%;
 		height: 88rpx;
 		line-height: 88rpx;
 		border-radius: 14rpx;
 		background-color: #42B14B;
 		color: #fff;
 		font-weight: bold;
 	}



 	.component-box {
 		position: absolute;
 		z-index: 9998 !important;
 	}


 	/deep/ .filter-modal .uni-radio-input {
 		width: 36rpx !important;
 		height: 36rpx !important;
 	}

 	/deep/.filter-modal .uni-radio-input-checked {
 		background-color: #fff !important;
 		border-color: #42B14B !important;
 		border-width: 10rpx !important;
 		/* padding: 10rpx!important; */
 		box-sizing: border-box;
 	}

 	/deep/.filter-modal .uni-radio-input-checked::before {
 		display: none !important;
 	}

 	/deep/.filter-modal .uni-switch-wrapper {
 		transform: scale(0.7) !important;
 	}

 	/deep/ .uni-input-input {
 		color: #111;
 		font-size: 28rpx;
 	}

 	/deep/ .uni-input-placeholder {
 		font-size: 28rpx;
 	}



 	/* 列表页面样式 */
 	.filter-result-page {
 		width: 100%;
 		height: 100%;
 		box-sizing: border-box;
 		background: #FCFDFD;
 		border-radius: 40rpx;
 		position: relative;


 		display: flex;
 		flex-direction: column;

 	}

 	/* 顶部标题栏 */
 	.header {
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		padding: 0 32rpx 24rpx 0;
 		background-color: #fff;
 		border-bottom: 1rpx solid #eee;
 	}

 	.title {
 		font-size: 40rpx;
 		font-weight: 600;
 		color: #333;
 	}

 	.title .total {
 		font-weight: 400;
 		font-size: 30rpx;
 		color: #555555;
 		margin-left: 4rpx;
 	}

 	.back-btn {
 		width: 148rpx;
 		height: 72rpx;
 		background: #FFFFFF;
 		border-radius: 20rpx;
 		border: 2rpx solid #DCF0DE;
 		font-weight: 700;
 		font-size: 28rpx;
 		color: #006537;
 		display: flex;
 		align-items: center;
 		justify-content: center;
 	}

 	.back-btn image {
 		width: 32rpx;
 		height: 32rpx;
 	}

 	/* 核心表格样式 */
 	.data-table {
 		width: 100%;
 		border-collapse: collapse;
 		/* 合并单元格边框，避免间隙 */
 		background-color: #fff;

 	}

 	.page-list {
 		padding: 20rpx;
 		height: 100%;
 	}

 	/* 表格容器 - 负责滚动 */
 	.table-container {
 		flex: 1;
 		overflow-y: auto;
 		/* 纵向滚动 */
 		overflow-x: auto;
 		/* 横向滚动 */

 		height: 78%;

 		width: 100%;
 		position: relative;
 		touch-action: pan-x pan-y;

 		-webkit-overflow-scrolling: touch;
 		/* iOS/平板平滑滚动 */
 		overscroll-behavior: contain;
 		/* 防止滚动穿透 */
 		scrollbar-gutter: stable;
 		/* 防止滚动条导致容器宽度跳动 */
 	}

 	.fixed-col1 {
 		position: sticky;
 		left: 0rpx !important;
 		min-width: 36rpx;
 		z-index: 10 !important;
 	}

 	.fixed-col2 {
 		position: sticky;
 		left: 80rpx !important;
 		min-width: 54rpx;
 		z-index: 11 !important;
 	}

 	.fixed-col3 {
 		position: sticky;
 		left: 200rpx !important;
 		min-width: 320rpx;
 		z-index: 12 !important;
 		text-align: left;
 	}

 	.fixed-tdd {
 		position: relative;
 		display: inline-flex;
 		align-items: baseline
 	}

 	.fixed-tdd .tab-dashed {
 		position: absolute;
 		bottom: -10rpx;
 		left: 50%;
 		transform: translateX(-50%);
 		width: 74%;
 		height: 4rpx;
 		background: repeating-linear-gradient(to right,
 				#42B14B,
 				#42B14B 6rpx,
 				transparent 6rpx,
 				transparent 12rpx);
 	}

 	.table-scroll-x {
 		width: 100%;
 		height: 100%;
 		overflow-x: auto;
 		overflow-y: auto;
 		-webkit-overflow-scrolling: touch;
 		position: relative;
 		white-space: nowrap;
 	}

 	/* 纵向滚动层 - 负责纵向滚动 */
 	.table-scroll-y {
 		height: 100%;

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
 		font-size: 40rpx;
 		color: #333;
 		white-space: nowrap;
 		font-weight: 400;
 	}

 	.table-header .th {
 		z-index: 14 !important;
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

 	/* 偶数行背景色 */
 	.tr-even td {
 		background-color: #F8F8F8;
 	}

 	.tr-checked {
 		background-color: #E7F0EA;
 	}

 	/* 表体单元格 */
 	tbody td {
 		padding: 20rpx 20rpx;
 		text-align: center;
 		font-size: 40rpx;
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


 	/* 右侧弹窗遮罩层 */
 	.order-modal {
 		position: fixed;
 		top: 0;
 		left: 0;
 		width: 100%;
 		height: 100%;
 		background-color: rgba(0, 0, 0, 0.5);
 		z-index: 999999;
 		display: flex;
 		justify-content: flex-end;
 		align-items: stretch;
 	}

 	/* 弹窗主体 */
 	.modal-content {
 		width: 40vw;
 		height: 100%;
 		background-color: #fff;
 		transform: translateX(100%);
 		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 		display: flex;
 		flex-direction: column;
 		overflow-y: auto;
 		-webkit-overflow-scrolling: touch;

 		display: flex;
 		flex-direction: column;
 	}

 	/* 弹窗显示动效 */
 	.modal-show {
 		transform: translateX(0);
 	}

 	/* 弹窗头部 */
 	.modal-header {
 		padding: 40rpx 40rpx 0;
 		position: relative;
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		flex-wrap: wrap;
 		box-sizing: border-box;
 	}

 	/* 绿色竖线图标 */
 	.modal-title::before {
 		content: '';
 		width: 10rpx;
 		height: 36rpx;
 		background-color: #42B14B;
 		border-radius: 2rpx;
 		margin-right: 16rpx;
 		flex-shrink: 0;
 		position: absolute;
 		top: 10rpx;
 		left: -16rpx;
 	}

 	/* 标题文字 */
 	.modal-title {
 		font-size: 40rpx;
 		font-weight: 700;
 		color: #111111;
 		letter-spacing: 2rpx;
 		position: relative;
 		left: 16rpx;
 	}

 	.pickup-time {
 		font-size: 32rpx;
 		color: #42B14B;
 		font-weight: 600;
 	}

 	.close-btn {
 		width: 56rpx;
 		height: 56rpx;
 		position: absolute;
 		top: 32rpx;
 		right: 32rpx;
 	}

 	/* 订单基础信息 */
 	.order-info {
 		padding: 40rpx;
 		border-bottom: 1rpx solid #DBE1D9;
 	}

 	.info-row {
 		display: flex;
 		margin-bottom: 16rpx;
 		line-height: 1.5;
 	}

 	.info-label {
 		font-size: 28rpx;
 		color: #777777;
 		min-width: 160rpx;
 	}

 	.info-value {
 		font-size: 28rpx;
 		color: #111111;
 		flex: 1;
 		white-space: pre-wrap;
 		word-break: break-all;
 	}

 	/* 商品列表 */
 	.goods-list {
 		padding: 40rpx;
 		box-sizing: border-box;
 		border-bottom: 1rpx solid #DBE1D9;
 		flex: 1;
 		overflow-y: auto;
 	}

 	.goods-item {
 		display: flex;
 		justify-content: space-between;
 		align-items: flex-start;
 		margin-bottom: 32rpx;
 	}

 	.goods-item:last-child {
 		margin-bottom: 0;
 	}

 	.goods-info {
 		display: flex;
 		flex-direction: column;
 		gap: 8rpx;
 	}

 	.goods-name {
 		font-size: 32rpx;
 		font-weight: 700;
 		color: #111111;
 	}

 	.goods-spec {
 		font-size: 26rpx;
 		color: #777777;
 	}

 	.goods-price {
 		display: flex;
 		flex-direction: column;
 		align-items: flex-end;
 		gap: 8rpx;
 	}

 	.goods-qty {
 		font-size: 32rpx;
 		color: #111111;
 		font-weight: bold;
 	}

 	.goods-amount {
 		font-size: 32rpx;
 		font-weight: 700;
 		color: #111111;
 	}

 	/* 订单合计 */
 	.order-summary {
 		padding: 40rpx;
 		border-bottom: 2rpx solid #f0f0f0;
 	}

 	.summary-row {
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		margin-bottom: 16rpx;
 	}

 	.summary-row:last-child {
 		margin-bottom: 0;
 	}

 	.summary-label {
 		font-size: 32rpx;
 		color: #333;
 	}

 	.summary-value {
 		font-size: 32rpx;
 		color: #111111;
 		font-weight: 700;
 	}

 	/* 弹窗底部 */
 	.modal-footer {
 		padding: 40rpx;
 	}

 	.close-modal-btn {
 		width: 100%;
 		height: 88rpx;
 		line-height: 88rpx;
 		background: #EEEEEE;
 		border-radius: 16rpx;
 		text-align: center;
 		font-size: 32rpx;
 		font-weight: 700;
 		color: #333;
 	}
 </style>