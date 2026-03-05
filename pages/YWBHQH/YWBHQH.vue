 <style scoped>
 	@import url(@/static/style/payment/paymentall/basis.css);
 	@import url(@/static/style/index.css);
 </style>
 <template>

 	<view class="centre">
 		<image class="bg" src="../../images/chushihua.png" mode="widthFix"></image>
 		<Head ref="bhHead" :_showSale="true" :_ynMsg='false' :type="'ywbhqh'"></Head>
 		<!-- 页面主数据 裱花请货默认页面-->
 		<view v-show="bhstep == 1" class="tranlist" style="margin-top: 4%;height: 78%">
 			<!-- 加急宅配 -->
 			<view class="card-column">
 				<image v-if="urgentData && urgentData.length" class="bg" src="../../images/imgbh/biank@1x.png"
 					mode="widthFix"></image>
 				<view class="column-header">
 					<text class="title">今日加急宅配</text>
 					<text class="count"><text
 							class="text">{{ urgentStats.completed }}个</text>/{{ urgentStats.total }}个</text>
 					<!-- 进度条容器 - 动态计算宽度 -->
 					<view class="progress-container">
 						<view class="progress-bar" :style="{ width: urgentStats.progress + '%' }"></view>
 					</view>
 				</view>
 				<view v-if="urgentData && urgentData.length" class="task-list">
 					<view v-for="(item, index) in urgentData" :key="index" class="task-item"
 						:class="{ 'task-done': item.done }">
 						<!-- 勾选框 -->
 						<view class="task-checkbox" :class="{ 'checked': item.done }"
 							@click="toggleTaskDone('urgent', index)" v-if="item.finish!='Y'">
 							<image v-if="item.done" class="check-icon" src="../../images/imgbh/gou@1x.png"
 								mode="widthFix"></image>
 						</view>
 						<view class="task-main">
 							<view class="task-content">
 								<view class="task-size">{{ item.size }}</view>
 								<view>
 									<view class="task-name">{{ item.name }}*{{ item.qty }}</view>
 									<view class="task-shop">{{ item.shop }}</view>
 								</view>
 							</view>
 							<view class="task-actions">
 								<view class="task-time">{{ item.time }}</view>
 								<view>
 									<text class="action-btn action-discard"
 										@click="BHQHInput('0',item.bill,item)">作废</text>
 									<text class="action-btn action-warehouse" @click="BHQHInput('1',item.bill,item)"
 										v-if="item.finish!='Y'">入库</text>
 									<text class="action-btn action-warehouse" v-else>已生产</text>
 								</view>
 							</view>
 						</view>
 					</view>
 				</view>
 			</view>

 			<!-- 预定宅配 -->
 			<view class="card-column">
 				<image v-if="scheduledData && scheduledData.length" class="bg" src="../../images/imgbh/biank@1x.png"
 					mode="widthFix"></image>
 				<view class="column-header">
 					<text class="title">今日预定宅配</text>
 					<text class="count"><text class="text">{{ scheduledStats.completed }}个</text>
 						/{{ scheduledStats.total }}个</text>
 					<view class="progress-container">
 						<view class="progress-bar" :style="{ width: scheduledStats.progress + '%' }"></view>
 					</view>
 				</view>
 				<view v-if="scheduledData && scheduledData.length" class="task-list">
 					<view v-for="(item, index) in scheduledData" :key="index" class="task-item"
 						:class="{ 'task-done': item.done }">
 						<view class="task-checkbox" :class="{ 'checked': item.done }"
 							@click="toggleTaskDone('scheduled', index)" v-if="item.finish!='Y'">
 							<image v-if="item.done" class="check-icon" src="../../images/imgbh/gou@1x.png"
 								mode="widthFix"></image>
 						</view>
 						<view class="task-main">
 							<view class="task-content">
 								<view class="task-size">{{ item.size }}</view>
 								<view>
 									<view class="task-name">{{ item.name }}</view>
 									<view class="task-shop">{{ item.shop }}</view>
 								</view>
 							</view>
 							<view class="task-actions">
 								<view class="task-time">{{ item.time }}</view>
 								<view>
 									<text class="action-btn action-discard"
 										@click="BHQHInput('0',item.bill,item)">作废</text>
 									<text class="action-btn action-warehouse" @click="BHQHInput('1',item.bill,item)"
 										v-if="item.finish!='Y'">入库</text>
 									<text class="action-btn action-warehouse" v-else>已生产</text>
 								</view>
 							</view>
 						</view>
 					</view>
 				</view>
 			</view>

 			<!-- 到店自提 -->
 			<view class="card-column">
 				<image v-if="pickupData && pickupData.length" class="bg" src="../../images/imgbh/biank@1x.png"
 					mode="widthFix"></image>
 				<view class="column-header">
 					<text class="title">今日到店<text style="font-size: 26rpx;">(自提或摆柜)</text></text>
 					<text class="count"><text class="text">{{ pickupStats.completed }}个</text>
 						/{{ pickupStats.total }}个</text>
 					<view class="progress-container">
 						<view class="progress-bar" :style="{ width: pickupStats.progress + '%' }"></view>
 					</view>
 				</view>
 				<view v-if="pickupData && pickupData.length" class="task-list">
 					<view v-for="(item, index) in pickupData" :key="index" class="task-item"
 						:class="{ 'task-done': item.done }">
 						<view class="task-checkbox" :class="{ 'checked': item.done }"
 							@click="toggleTaskDone('pickup', index)" v-if="item.finish!='Y'">
 							<image v-if="item.done" class="check-icon" src="../../images/imgbh/gou@1x.png"
 								mode="widthFix"></image>
 						</view>
 						<view class="task-main">
 							<view class="task-content">
 								<view class="task-size">{{ item.size }}</view>
 								<view>
 									<view class="task-name">{{ item.name }}</view>
 									<view class="task-shop">{{ item.shop }}</view>
 								</view>
 							</view>
 							<view class="task-actions">
 								<view class="task-time">{{ item.time }}</view>
 								<view>
 									<text class="action-btn action-discard"
 										@click="BHQHInput('0',item.bill,item)">作废</text>
 									<text class="action-btn action-warehouse" @click="BHQHInput('1',item.bill,item)"
 										v-if="item.finish!='Y'">入库</text>
 									<text class="action-btn action-warehouse" v-else>已生产</text>
 								</view>
 							</view>
 						</view>
 					</view>
 				</view>
 			</view>
 		</view>

 		<!-- 筛选列表页面 -->
 		<view v-show="bhstep == 2" class="tranlist tranlist-list">
 			<view class="filter-result-page ">
 				<!-- 顶部标题栏 -->
 				<view class="header">
 					<text class="title">筛选结果 <text class="total">共<text
 								style="color: #42B14B;">{{ listData.length }}条</text>数据</text></text>
 					<view class="back-btn" @click="bhstep = 1">
 						<image src="../../images/imgbh/fhui@2x.png" mode="widthFix" style="margin-right: 6rpx;">
 							<text>返回</text>
 					</view>
 				</view>
 				<NoData v-if="listData.length==0"
 					style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"></NoData>
 				<view v-if="listData.length>0" class="table-container">
 					<div class="table-scroll-x" ref="scrollX">
 						<div class="table-scroll-y" ref="scrollY">
 							<table class="data-table" border="0" cellpadding="0" cellspacing="0">
 								<thead class="table-header">
 									<tr>
 										<th class="th-checkbox" @click="handleAllCheck()">
 											<view class="task-checkbox" :class="{ 'checked': allChecked }">
 												<image v-if="allChecked" class="check-icon"
 													src="../../images/imgbh/gou@1x.png" mode="widthFix"></image>
 											</view>
 										</th>
 										<th>序号</th>
 										<th>到货日期</th>
 										<th>任务商品</th>
 										<th>数量</th>
 										<th>单位</th>
 										<th>尺寸</th>
 										<th>到货时间</th>
 										<th>到货时段</th>
 										<th>要货门店</th>
 										<th>要求</th>
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
 									<tr v-for="(item, index) in listData" :key="item.id" class="table-row"
 										:class="{ 'tr-even': index % 2 == 0 }">
 										<td class="td-checkbox">
 											<view v-if="item.BILL_STATUS=='1'" @click="toggleTaskChecked(index)"
 												class="task-checkbox" :class="{ 'checked': item.isChecked }">
 												<image v-if="item.isChecked" class="check-icon"
 													src="../../images/imgbh/gou@1x.png" mode="widthFix"></image>
 											</view>
 											<view v-else class="task-checkbox task-checkbox-none"> </view>
 										</td>
 										<td>{{ index + 1 }}</td>
 										<td>{{ item.DATE_DH }}</td>
 										<td>{{ item.SPID }}-{{item.SPNAME}}</td>
 										<td>{{ item.ZQTY_SQ }}</td>
 										<td>{{ item.UNIT }}</td>
 										<td>{{ item.CCCZ }}</td>
 										<td>{{ item.NOTE }}</td>
 										<td>{{ item.DHSJD }}</td>
 										<td>{{ item.KHID }}-{{ item.KHNAME }}</td>
 										<td>{{ item.QH_NOTE }}</td>
 										<td>{{ item.BILL_STATUS_NAME }}</td>
 										<td>{{ item.YN_SC=="Y"?"是":"否" }}</td>
 										<td>{{ item.YN_YD=="Y"?"是":"否" }}</td>
 										<td>{{ item.PSTYPE_NAME }}</td>
 										<td>{{ (item.YN_PRINT=="Y"||item.YN_PRINT=="1")?"是":"否" }}</td>
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

 		<!-- 底部操作栏 -->
 		<view class="bottom-bar">
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
 		</view>
 		<!-- 任务筛选弹窗 -->
 		<view class="filter-modal" v-show="showFilterModal" @click="closeFilterModal">
 			<view class="filter-content" @click.stop>
 				<!-- <image style=" position: absolute;top: -32rpx;left: -32rpx;" src="../../images/imgbh/tanc-bg@1x.png" mode="widthFix"></image> -->
 				<text class="filter-title">任务筛选</text>

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
 								style="margin-right:32rpx;display: flex;align-items: center;" />
 							<text class="radio-text">{{ item.label }}</text>
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
 				<view class="filter-section input-section">
 					<text class="section-label">要货门店：</text>
 					<view style="flex:1;position: relative;">
 						<input v-model="filterForm.shopName" placeholder="请输入门店名称" class="filter-picker"
 							@focus="showDropdown_shop = true" @blur="delayCloseShopDropdown" />
 						<view v-if="showDropdown_shop && filteredShopList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 100%;  max-height: 400rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
 							<view v-for="(item, index) in filteredShopList" :key="index"
 								style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;font-size:28rpx"
 								@click="selectShop(item)">
 								{{item.ADDR}}
 							</view>
 						</view>

 						<view v-if="showDropdown_shop && !filteredShopList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 100%; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999;">
 							暂无匹配门店
 						</view>

 						<!-- <picker :value="0" :range="THKHDATA" range-key="ADDR" @change="selectShop"
					  class="filter-picker">
						<text>{{ filterForm.shopName || '请选择门店' }}</text>
					</picker> -->
 					</view>
 					<!-- <image src="../../images/imgbh/rjp@1.5x.png" style="width:40rpx;height:40rpx;margin-left:10rpx;"
					@click="showBorad" mode="widthFix"></image> -->
 				</view>

 				<!-- 7. 任务商品-支持模糊搜索 -->
 				<view class="filter-section input-section">
 					<text class="section-label">任务商品：</text>
 					<view style="flex:1;position: relative;">
 						<input v-model="filterForm.goodsName" placeholder="请输入商品名称" class="filter-picker"
 							@focus="showDropdown_goods = true" @blur="delayCloseGoodsDropdown" />
 						<view v-if="showDropdown_goods && filteredGoodsList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 100%;  max-height: 400rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
 							<view v-for="(item, index) in filteredGoodsList" :key="index"
 								style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;font-size:28rpx"
 								@click="selectGoods(item)">
 								{{item.SNAME}} ({{item.SPID}})
 							</view>
 						</view>

 						<view v-if="showDropdown_goods && !filteredGoodsList.length"
 							style="position: absolute; top: 80rpx; left: 0; width: 100%; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999;">
 							暂无匹配商品
 						</view>

 						<!-- <picker :value="0" :range="SPDATA" range-key="SNAME" @change="selectGoods"
					  class="filter-picker">
						<text>{{ filterForm.goodsName || '请选择任务商品' }}</text>
					</picker> -->
 					</view>
 					<!-- 	<image src="../../images/imgbh/rjp@1.5x.png" style="width:40rpx;height:40rpx;margin-left:10rpx"
					@click="showBorad" mode="widthFix"></image> -->
 				</view>

 				<!-- 底部按钮组 -->
 				<view class="filter-btn-group">
 					<button class="btn-cancel" @click="closeFilterModal">关闭</button>
 					<button class="btn-confirm" @click="confirmFilter">确认筛选</button>
 				</view>
 			</view>
 		</view>

 		<!-- 软键盘 -->
 		<view v-if='isKeyBoardShow' class="keyboard-input">
 			<view class="searchTerms">
 				<view class="affirmArea" style="margin-left: 20px;font-size: 18px;display: flex;flex-direction: row;">
 					<view v-show="mainSale.showQueryKeys.length">
 						搜索词:
 					</view>{{(mainSale.showQueryKeys).toUpperCase()}}
 				</view>
 				<view class="inputArea"
 					style="max-width: 280px;overflow: hidden;display: flex;flex-direction: row;  margin-left: -15px;">
 					<view>
 						{{mainSale.boardQueryKeys}}
 					</view>
 					<view v-show="mainSale.boardQueryKeys.length" class="borderCursor"></view>
 				</view>
 				<view class="deleteBoard" @click="mainSale.turnOffKeys">
 					<image src="../../images/shouqi.png" mode="widthFix"></image>
 				</view>
 			</view>

 			<view class="keyboard">
 				<ul class="keys" v-for='(item,index) in mainSale.keyBoardList'>
 					<li v-for='(_item,_index) in item.value' @click="mainSale.keyBoardClick(_item)">
 						{{_item}}
 					</li>
 					<li class="enter" v-if="index===1" @click="mainSale.delQueryKeys">删除</li>
 					<li class="enter" v-if="index===2" style="color: red;width: 190rpx; color:"
 						@click="mainSale.clearQueryKeys">清空</li>
 					<li class="enter" v-if="index===2" @click="mainSale.affirmQueryKeys"
 						style="width: 190rpx; color: #127551;">搜索</li>
 				</ul>
 			</view>

 			<view class="switchArea">
 				分类：
 				<switch :checked=mainSale.isDateClassify color="#1aa034" @change="mainSale.switchAreaChange" />
 			</view>
 		</view>
 	</view>
 </template>

 <script>
 	var app = getApp();
 	import Head from '@/pages/Home/Component/BHHead.vue';
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
 			Head
 		},
 		data() {
 			return {
 				mainSale: {},
 				isKeyBoardShow: false,
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
 				// 筛选表单数据
 				filterForm: {
 					khid: "",
 					source: '门店',
 					isPreOrder: true,
 					isDirect: false,
 					isEcommerce: false,
 					pickupType: '0',
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

 				showDropdown_shop: false,

 				showDropdown_goods: false,
 			};
 		},
 		computed: {
 			filteredShopList() {
 				if (!this.filterForm.shopName) {
 					return this.THKHDATA;
 				}
 				const keyword = this.filterForm.shopName.trim();
 				return this.THKHDATA.filter(item => {
 					if (!item.ADDR && !item.KHID && !item.shopName) return false;

 					const targetText = item.ADDR || item.shopName || item.KHID;
 					return targetText.includes(keyword);
 				});
 			},

 			filteredGoodsList() {
 				if (!this.filterForm.goodsName) {
 					return this.SPDATA;
 				}
 				const keyword = this.filterForm.goodsName.trim();
 				return this.SPDATA.filter(item => {
 					if (!item.SNAME && !item.SPID) return false;

 					const targetText = item.SNAME || item.SPID;
 					return targetText.includes(keyword);
 				});
 			}
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
 				// this.allChecked = isAllChecked;
 				// 遍历所有数据项，统一设置选中状态
 				this.listData.forEach(item => {
 					if (item.BILL_STATUS == '1')
 						item.isChecked = isAllChecked;
 				});
 			},
 			// 切换任务勾选状态
 			toggleTaskChecked(index) {
 				if (this.listData[index].BILL_STATUS == '1')
 					this.listData[index].isChecked = !this.listData[index].isChecked;
 			},
 			handleSourceChange(e) {
 				this.filterForm.source = e.detail.value;
 			},
 			handlePickupChange(e) {
 				this.filterForm.pickupType = e.detail.value;
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
 				that.GetBHQHOrders(); //获取裱花单
 				that.getTHTYPE(); //获取提货类型
 				that.getDHSJD(); //获取到货时间段
 				that.getKHDA(); //获取到货时间段
 				that.getSPDA(); //获取商品数据
 			},
 			onShow: function() {

 			},
 			//数据库查询
 			GetBHQHOrders: function(t) {
 				let store = util.getStorage("store");
 				let data1 = {
 					khid: store.KHID,
 					gsid: store.GSID,
 					date: this.curDate,
 				};
 				_ywbhqh.GetBHQHOrders(data1, res => {
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
 							let arr = data.yd.map(r => {
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
 				let bills = "",
 					tit = "入库";
 				console.log("e", e);
 				if (yn_rk != "1")
 					tit = "取消";
 				if (that.bhstep == 1) {
 					if (!e) {
 						let arr1 = that.urgentData.filter(r => r.done).map(r => r.bill);
 						let arr2 = that.scheduledData.filter(r => r.done).map(r => r.bill);
 						let arr3 = that.pickupData.filter(r => r.done).map(r => r.bill);
 						let Arr = arr1.concat(arr2).concat(arr3);
 						console.log("BHQHInput.Arr：", Arr);
 						if (Arr.length <= 0) {
 							util.simpleMsg("请选择要" + tit + "的单据！");
 							return;
 						}
 						bills = Arr.join(',');
 					} else {
 						if (obj && obj.finish == 'Y') {
 							util.simpleMsg("该订单已生产暂无法入库！");
 							return;
 						}
 						bills = e;
 						tit += "裱花单：" + e;
 					}
 				} else {
 					if (!e) {
 						let Arr = that.listData.filter(r => r.isChecked).map(r => r.BILL);
 						if (Arr.length <= 0) {
 							util.simpleMsg("请选择要" + tit + "的单据！");
 							return;
 						}
 						bills = Arr.join(',');
 					} else {
 						bills = e;
 						tit += "裱花单：" + e;
 					}
 				}
 				util.simpleModal("提示", "是否确认" + tit + "？", (conf) => {
 					if (conf) {
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
 								if (that.bhstep == 1)
 									that.GetBHQHOrders(); //刷新列表
 								else
 									this.filterTasks(); //刷新列表
 							}, 1500);
 						})
 					}
 				})
 			},
 			//扫码入库
 			ScanInput() {
 				uni.scanCode({
 					success: res => {
 						console.log("[ScanInput.success]扫码结果:", res);
 						if (res.result) //扫码内容
 						{
 							that.BHQHInput("1", res.result);
 						} else {
 							util.simpleMsg("未识别到有效内容！");
 						}
 					},
 					fail: err => {
 						console.log("[ScanInput.fail]扫码异常:", err);
 					}
 				})
 			},
 			//获取配送类型
 			getTHTYPE: function() {
 				common.GetDapzcs("THTYPE", res => {
 					console.log("[getTHTYPE]提货类型数据：", res);
 					if (res.code && res.msg.length > 0) {
 						that.pickupOptions = res.msg.map((item, index) => {
 							return {
 								value: item.ID_NR,
 								label: item.SNAME
 							};
 						}).filter(i => i.value != '2')
 						console.log("[getTHTYPE]提货类型数据THTYPES：", that.pickupOptions);
 					} else
 						that.pickupOptions = [];
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
 					console.log("[GetSPDA]门店数据：", res);
 					if (res.code && res.msg.length > 0) {
 						that.SPDATA = res.msg;
 					} else {
 						that.SPDATA = [];
 					}
 				});
 			},
 			// ========== 新增筛选弹窗相关方法 ==========
 			// 打开筛选弹窗
 			openFilterModal() {
 				this.showFilterModal = true;
 				this.$refs.bhHead.dropout = false;
 			},
 			// 关闭筛选弹窗
 			closeFilterModal() {
 				this.showFilterModal = false;
 				this.filterForm = {
 					khid: "",
 					source: '门店',
 					isPreOrder: true,
 					isDirect: false,
 					isEcommerce: false,
 					pickupType: '0',
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
 			},
 			// 选择商品
 			selectGoods(item) {
 				this.filterForm.goodsId = item.SPID;
 				this.filterForm.goodsName = item.SNAME;
 				this.showDropdown_goods = false;
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
 						that.listData = data;
 					} else {
 						that.listData = [];
 						util.simpleMsg("暂无更多数据!", true);
 					}
 				})
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
 			showBorad() {
 				this.isKeyBoardShow = true;
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
 			this.mainSale = new mysale.GetSale(getApp().globalData, this, "MainSale", uni);
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
 		/* position: relative; */
 		position: fixed;
 		top: 0;
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
 		height: 84%;
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
 		width: 68%;
 		max-width: 750rpx;
 		height: 880rpx;
 		background-color: #fff;
 		border-radius: 16rpx;
 		padding: 32rpx;
 		/* overflow-y: auto; */
 		box-sizing: border-box;
 		position: relative;

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


 	/* 软键盘 */
 	.keyboard-input {
 		z-index: 999;
 		background-color: #fff;
 		box-shadow: 0 -6px 10px rgb(255, 255, 255), 0 4px 15px rgba(0, 0, 0, 0.3);
 		border-radius: 22px;
 		width: 1600rpx;
 		padding: 0 30rpx 30rpx;
 		position: absolute;
 		bottom: 200rpx;
 		right: 196rpx;
 		padding-bottom: 40rpx;
 		animation: keyboard 0.5s ease;
 		-webkit-animation: keyboard 0.5s ease;

 	}

 	@keyframes keyboard {
 		0% {
 			transform: scale(0);
 			/* right: -10%; */
 			/* width: 0; */
 		}

 		100% {
 			transform: scale(1);
 			/* width: 810px; */
 		}
 	}


 	.keyboard {
 		user-select: none;
 		cursor: pointer;
 		padding: 10rpx 0 40rpx;
 	}

 	.keyboard .keys {
 		display: flex;
 		list-style: none;
 		margin: 0 0 0 -33rpx;
 	}

 	.keyboard li {
 		box-shadow: 0 -6px 10px rgb(255, 255, 255), 0 4px 15px rgba(0, 0, 0, 0.3);
 		width: 120rpx;
 		height: 120rpx;
 		font-size: 36rpx;
 		margin: 18rpx;
 		background-color: #f2f2f2;
 		border-radius: 30rpx;
 		text-align: center;
 		line-height: 120rpx;
 		transition: all 0.25s;
 	}

 	.keyboard li:active {
 		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15);
 		color: rgb(12, 164, 190);
 		text-shadow: 0 0 15px #57c1f1;
 	}

 	.searchTerms {
 		font-size: 36rpx;
 		font-weight: 700;
 		color: gray;
 		width: 100%;
 		height: 70rpx;
 		display: flex;
 		justify-content: space-between;
 		flex-direction: row;
 		padding-top: 20rpx;
 	}

 	.searchTerms image {
 		margin-top: 20rpx;
 		width: 40rpx;
 		height: 40rpx;
 	}

 	.switchArea {
 		font-size: 36rpx;
 		font-weight: 600;
 		color: gray;
 		position: absolute;
 		/* background-color: #fff; */
 		top: 8rpx;
 		padding: 6px;
 		right: 142px;
 		border-radius: 8px;
 		display: flex;
 		align-items: center;
 		flex-direction: row;
 		/* box-shadow: 0 -6px 10px rgb(255, 255, 255), 0 4px 15px rgba(0, 0, 0, 0.3); */
 	}

 	.switchArea switch .switch-input {
 		height: 56rpx;
 	}

 	.deleteBoard {
 		width: 26px;
 		margin-right: 27px;
 		height: 26px;
 	}

 	.borderCursor {
 		position: relative;
 		color: gray;
 		height: 13px;
 		width: 2px;
 		margin-left: 2px;
 		margin-top: 5px;
 	}

 	.borderCursor:after {
 		position: absolute;
 		content: '';
 		display: inline-block;
 		width: 2px;
 		height: 18px;
 		top: 50%;
 		transform: translateY(-50%);
 		animation: blink 1.2s infinite steps(1, start);
 	}

 	@keyframes blink {

 		0%,
 		100% {
 			background-color: #000;
 		}

 		50% {
 			background-color: transparent;
 		}
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
 		padding: 40rpx;
 		box-sizing: border-box;
 		background: #FCFDFD;
 		border-radius: 40rpx;
 		overflow: auto;
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

 	/* 表格容器 - 负责滚动 */
 	.table-container {
 		flex: 1;
 		overflow-y: auto;
 		/* 纵向滚动 */
 		overflow-x: auto;
 		/* 横向滚动 */
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

 	.table-scroll-x {
 		width: 100%;
 		height: 100%;
 		overflow-x: auto;
 		overflow-y: hidden;
 		-webkit-overflow-scrolling: touch;
 		position: relative;
 		white-space: nowrap;
 	}

 	/* 纵向滚动层 - 负责纵向滚动 */
 	.table-scroll-y {
 		height: 100%;
 		overflow-y: auto;
 		overflow-x: hidden;
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
 		z-index: 2;
 	}

 	/* 表头单元格 */
 	thead th {
 		background-color: #FDFDFE;
 		position: sticky;
 		top: -2rpx;
 		z-index: 10;
 		padding: 20rpx 20rpx;
 		text-align: center;
 		font-size: 26rpx;
 		color: #555555;
 		white-space: nowrap;
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
 	.tr-even {
 		background-color: #F0F5F4;
 	}

 	/* 表体单元格 */
 	tbody td {
 		padding: 20rpx 20rpx;
 		text-align: center;
 		font-size: 26rpx;
 		color: #111111;
 		white-space: nowrap;
 		/* 禁止文字换行 */
 		overflow: hidden;
 		/* 超长内容隐藏 */
 		text-overflow: ellipsis;
 		/* 超长显示省略号 */
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
 </style>