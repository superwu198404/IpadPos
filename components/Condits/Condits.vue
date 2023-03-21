<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>
<template>
	<view class="condits">
		<view class="srqlist">
			<view class="h1">查询条件</view>
			<input-pop ref="inputPopRef" @selectValue="selectpopValue" :model="modelvalue" :inputTxt="input_Txt"
				:inputname="inputname" :popInfo="popInfo" :inqueryCondition="inqueryCondition" />

			<view style="display: flex; flex-direction: column;" v-for="item,index in inqueryCondition" :key="index">
				<!-- 双日期选择 -->
				<view class="srq" v-if="item.type === 'dates'" style="margin-bottom: 10rpx;">
					<label>
						<text>开始{{item.condname}}：</text>
						<picker mode="date" fields="day" :data-index="index" data-flag=")" data-value="value"
							:value="item.value" :start="wdate" :end="endDate" @change="bindKeyInput">
							<view>{{ item.value }}
								<image src="/images/img2/jiant-lvvvvv.png"></image>
							</view>
						</picker>
					</label>
					<label>
						<text>结束{{item.condname}}：</text>
						<picker mode="date" fields="day" :data-index="index" data-flag=")" :value="item.value1"
							:start="item.value" :end="endDate" data-value="value1" @change="bindKeyInput">
							<view>{{ item.value1 }}
								<image src="/images/img2/jiant-lvvvvv.png"></image>
							</view>
						</picker>
					</label>
				</view>
				<!-- 输入框 -->
				<view class="pulldown" v-if="item.type === 'input'" style="margin-bottom: 10rpx;">
					<text class="tjmc">{{item.condname}}</text>
					<view class="inputBox">
						<input :value="item.value" style="font-size: 13px;width: 100%;" :data-index="index" :placeholder="'请输入'+item.condname"
							@input="bindKeyInput"/>
							<view class="closeClick del" @click.stop="delItem(index)">x</view>
					</view>
				<!-- 	<label><input :value="item.value" :data-index="index" :placeholder="'请输入'+item.condname"
							@input="bindKeyInput"></input><button @click.stop="delItem(index)" style="z-index: 2;">×</button></label> -->
				</view>
				<!-- 单日期选择 -->
				<view class="srq" v-if="item.type === 'date'" style="margin-bottom: 10rpx;">
					<label>
						<text>{{item.condname}}：</text>
						<picker mode="date" :data-index="index" data-mode="date" :value="item.value" :start="start"
							:end="endDate" @change="bindKeyInput">
							<view>{{ item.value }}
								<image src="/images/img2/jiant-lvvvvv.png"></image>
							</view>
						</picker>
					</label>
				</view>

				<!-- 商品选择 -->
				<view class="pulldown" v-if="item.type === 'popup'" style="margin-bottom: 10rpx;">
					<text class="tjmc">{{item.condname}}</text>

					<button class="popupWrap" :data-index="index" @click="clickDig(item.id, $event)">
						<view style="font-size: 16rpx; padding-left: 8rpx;" v-if="item.value">
							{{item.value }}
						</view>
						<view style="font-size: 16rpx; padding-left: 8rpx;color: gray;" v-if="!item.value">
							{{item.condname}}
						</view>
						<view class="closeClick" @click.stop="delItem(index)">
							×
						</view>
					</button>

				</view>
				<!-- 品类选择 -->
				<view class="pulldown" v-if="item.type === 'popup1'" style="margin-bottom: 10rpx;">
					<text class="tjmc">{{item.condname}}</text>
					<button class="popupWrap" :data-index="index" @click="clickDig(item.id, $event)">
						<view style="font-size: 16rpx; padding-left: 8rpx;" v-if="item.value">
							{{item.value}}
						</view>
						<view style="font-size: 16rpx; padding-left: 8rpx;color: gray;" v-if="!item.value">
							{{item.condname}}
						</view>
						<view class="closeClick" @click.stop="delItem(index)">
							×
						</view>
					</button>
				</view>
				<!-- 店铺选择 -->
				<view class="pulldown" v-if="item.type === 'store'" style="margin-bottom: 10rpx;">
					<text class="tjmc">{{item.condname}}</text>
					<button class="popupWrap" :data-index="index" @click="clickDig(item.id, $event)">
						<view style="font-size: 16rpx; padding-left: 8rpx;" v-if="item.value">
							{{item.value }}
						</view>
						<view style="font-size: 16rpx; padding-left: 8rpx;color: gray;" v-if="!item.value">
							{{item.condname}}
						</view>

						<view class="closeClick" @click.stop="delItem(index)">
							×
						</view>
					</button>
				</view>

				<!-- 下拉框 -->
				<view class="pulldown" v-if="item.type=='select' && item.qs.length >= 5" style="margin-bottom: 10rpx;">
					<text class="tjmc">{{item.condname}}：</text>
					<label>
						<picker mode="selector" :range="item.qs" value="0" range-key="name" @change="bindKeyInput"
							:data-index="index" style=" background-color: #F5F5F5;color: #333; font-size: 7rpx;display: flex;align-items: center;border: 0rpx;
							solid #EEEEEE; border-radius: 3rpx; padding-left: 6rpx;">
							<view class="uni-input">
								{{item.qs.find(_item=>_item.id === item.value) && item.qs.find(_item=>_item.id === item.value).name || '请选择'+item.condname}}
							</view><button>∨</button>
						</picker>
					</label>
					<!-- <label><picker placeholder="请选择门店" mode = "multiSelector"></picker> <button>∨</button></label> -->
				</view>

				<!-- 数量少的单选 -->
				<view class="channel" v-if="item.type === 'select' && item.qs.length < 5">
					<text class="tjmc">{{item.condname}}：</text>
					<view class="chanxz">
						<label style="margin-bottom: 10rpx;" v-for="(_item, _index) in item.qs"
							@click="changeSelect(_item, index, _index)"
							:class="{curr: activeIndex === _index && item.value}" :key="_index">


							{{_item.name}}

							<em>✓</em>


						</label>
					</view>
				</view>
			</view>
			<view class="confirm">
				<button class="btn btn-qx" @click="reSet">重置</button>
				<button class="btn" @click="affirm">确定</button>
			</view>
		</view>
	</view>

</template>

<script>
	import inputPop from '@/components/inputPop/inputPop.vue'
	export default {
		name: "Condits",
		components: {
			inputPop
		},
		//属性
		data() {
			return {
				popInfo: {
					dataIndex: undefined,
					dataFlag: undefined,
					dataValue: undefined
				},
				date: '',
				startTime: '',
				endTime: '',
				activeIndex: 0,
				selectDate: [{
					name: "门店销售"
				}, {
					name: "外卖销售"
				}, {
					name: "大宗销售"
				}],
				reason: {}, //查询后结果
				total: {},
				initValue: null, //初始查询数据
				modelvalue: '',
				input_Txt: '',
				inputname: '',
				selSP: "SPID", //商品查询类型
				selPL: "PLID", //品类查询类型
				selKHID: "KHID", //店铺查询类型
				productItem: "productItem", //商品查询在小程序后台的model名
				productItem_txt: "输入商品名称或编码查询",
				plItem: "qjplItem", //品类查询在小程序后台的model名
				plItem_txt: "输入品类名称或编码查询",
				khItem: "khItem", //门店名称查询在小程序后台的model名
				khItem_txt: "请输入店铺名称查询",
			}
		},
		props: ['inqueryCondition', 'inqueryConditionInit', 'wdate', 'endDate', 'start', 'bill', 'KHID', 'currentSelect',
			'TITLE'
		],
		//组件生命周期
		computed: {

		},

		created() {
			const initValue = JSON.parse(JSON.stringify(this.inqueryCondition))
			this.initValue = initValue
		},
		methods: {
			delItem(index) {
				console.log(index,"index")
				console.log(this.inqueryCondition[index])
				this.inqueryCondition[index].value = ''
			},
			getvalue: function(pm_v) {
				return (pm_v == null ? '' : pm_v);
			},
			// 点击展示搜索弹层
			clickDig(seltype, e) {
				if (seltype.indexOf(".") > 0) {
					seltype = seltype.split(".")[1];
					//productItem
					if (seltype == this.selSP) {
						//商品编码输入框搜索
						this.modelvalue = this.productItem;
						this.input_Txt = this.productItem_txt;
						this.inputname = this.selSP;
					} else if (seltype == this.selPL) { //品类编码输入框搜索	
						this.modelvalue = this.plItem;
						this.input_Txt = this.plItem_txt;
						this.inputname = this.selPL;
					} else {
						this.modelvalue = this.khItem;
						this.input_Txt = this.khItem_txt;
						this.inputname = this.selKHID;
					}
				} else {
					this.modelvalue = this.khItem;
					this.input_Txt = this.khItem_txt;
					this.inputname = this.selKHID;
				}
				//展开弹层
				this.popInfo = {
					dataIndex: e.currentTarget.dataset.index,
					dataFlag: e.currentTarget.dataset.flag,
					dataValue: e.currentTarget.dataset.value
				}
				this.$refs.inputPopRef.open()
			},
			selectpopValue(e) {
				// 父组件传递来的值
				// console.log(e, `9090`)
			},
			//输入框事件
			bindKeyInput(e) {
				let newval = e.detail.value;
				let qcid = e.currentTarget.dataset.index;
				let qtype = this.inqueryCondition[qcid].type;
				let qitems = this.inqueryCondition[qcid];
				let flag = e.currentTarget.dataset.flag;
				let valuef = e.currentTarget.dataset.value;
				if (flag == null) {
					flag = qitems.f;
				}
				if (valuef == null) {
					valuef = "value";
				}
				switch (qtype) {
					case "dates":
						break;
					case "select":
						newval = qitems.qs[newval].id;
						// myobj.YW.setArrerDataBase(this, qcid, "value1", selectindex, "Querycond");
						break;
				}
				this.setInputDate(qcid, valuef, newval)
			},
			setInputDate(index, field, value) {
				this.inqueryCondition[index][field] = value
				
				console.log(this.inqueryCondition[index])
			},
			changeSelect(_item, index, _index) {
				this.activeIndex = _index
				// this.setInputDate(index, 'value', item.id)
				this.$set(this.inqueryCondition[index], 'value', _item.id)

			},
			//重置
			reSet() {
				this.inqueryCondition = structuredClone(this.inqueryConditionInit)
			},
			// 相加
			pSum: function(currentSelect, data) {
				if (currentSelect == "" || currentSelect == null || currentSelect == "undefined") {
					return;
				}
				let pSumDataList = data;
				if (pSumDataList == null || pSumDataList.length == 0) {
					return;
				}
				let pSumList = [];
				let arrSelect = this.TITLE["H" + currentSelect];
				let arrCurrentSelect = arrSelect.filter(item => item.HYPELINK == "Y").map(ele => {
					return [ele.TH, ele.ID];
				})
				for (var a = 0; a < arrCurrentSelect.length; a++) {
					let element = arrCurrentSelect[a];
					//获取汇总值
					var element_item = element[1];
					//获取汇总名
					var element_item_name = element[0];

					var element_itemvalue = parseFloat(0);
					for (var b = 0; b < pSumDataList.length; b++) {
						let element1 = pSumDataList[b];
						for (var itemkey in element1) {
							//判断是汇总行
							if (itemkey.toUpperCase() == element_item.toUpperCase()) {
								element1[itemkey] = element1[itemkey] == "N" || element1[itemkey] == null || element1[
									itemkey] == "" || element1[itemkey] == "undefined" ? 0 : element1[itemkey];
								element_itemvalue += parseFloat(element1[itemkey]);
								break;
							}
						}
					}
					let sumObj = {
						"totalname": element_item_name,
						"totalvalue": parseFloat(element_itemvalue).toFixed(2)
					};
					pSumList.push(sumObj);
				}
				this.total['H' + this.currentSelect] = pSumList
				this.$emit("totalValue", this.total)
			},
			//确认 todo人员id先写死
			affirm() {
				let data = {}
				data.QRYNAME = this.bill
				data.KHID = this.KHID;
				data.CZYID = '0376';

				for (let i = 0; i < this.inqueryCondition.length; i++) {
					let item = this.inqueryCondition[i];
					if (item.value == null && item.value1 == null) {
						continue;
					}
					data[item.id] = item.f + this.getvalue(item.value);
					if (item.id == 'YWBHQH.KHID' && item.type == 'store' && item.f == '&') {
						var ywKhidsplit = this.getvalue(item.value).split(',');
						var ywkhidarry = ywKhidsplit.map(function(item) {
							return "'" + item + "'";
						})
						data[item.id] = item.f + ywkhidarry.join(',');
					}
					if (item.type == 'dates') {
						data[item.id] = "#" + this.getvalue(item.value) + "," + this.getvalue(item.value1)
					}
					if (item.type == 'date') {
						data[item.id] = "#" + this.getvalue(item.value);
					}
				}
				//请求数据 todo数据中为null的置为空字符串
				const valuesDate = [{
					KHDA_KHID: "K200XKD006",
					KHDA_SNAME: "武汉洪福添美店现烤间",
					STATUS_STR: "审核",
					YWXKQH_BHPS_STATUS: "未配送",
					YWXKQH_BILL: "K200QTD0065230301092833",
					YWXKQH_BILL_STATUS: "审核",
					YWXKQH_DATE_DH: "2023-03-01 00:00:00",
					YWXKQH_DATE_LR: "2023-03-01",
					YWXKQH_DATE_XG: null,
					YWXKQH_DPID_XK: null,
					YWXKQH_ID_RY_LR: "0920",
					YWXKQH_KHID: "K200QTD006",
					YWXKQH_KHID_XK: "K200XKD006",
					YWXKQH_RYNAME_LR: "徐",
					YWXKQH_TPNET: 22,
				}, {
					KHDA_KHID: "K200XKD006",
					KHDA_SNAME: "武汉洪福添美店现烤间",
					STATUS_STR: "审核",
					YWXKQH_BHPS_STATUS: "已配送",
					YWXKQH_BILL: "K200QTD0065230301094346",
					YWXKQH_BILL_STATUS: "审核",
					YWXKQH_DATE_DH: "2023-03-01 00:00:00",
					YWXKQH_DATE_LR: "2023-03-01",
					YWXKQH_DATE_XG: null,
					YWXKQH_DPID_XK: null,
					YWXKQH_ID_RY_LR: "0920",
					YWXKQH_KHID: "K200QTD006",
					YWXKQH_KHID_XK: "K200XKD006",
					YWXKQH_RYNAME_LR: "徐",
					YWXKQH_TPNET: 6.5,
				}, {
					KHDA_KHID: "K200XKD006",
					KHDA_SNAME: "武汉洪福添美店现烤间",
					STATUS_STR: "审核",
					YWXKQH_BHPS_STATUS: "已配送",
					YWXKQH_BILL: "K200QTD0065230309091144",
					YWXKQH_BILL_STATUS: "审核",
					YWXKQH_DATE_DH: "2023-03-09 00:00:00",
					YWXKQH_DATE_LR: "2023-03-09",
					YWXKQH_DATE_XG: "",
					YWXKQH_DPID_XK: "",
					YWXKQH_ID_RY_LR: "0920",
					YWXKQH_KHID: "K200QTD006",
					YWXKQH_KHID_XK: "K200XKD006",
					YWXKQH_RYNAME_LR: "xxxx",
					YWXKQH_TPNET: 49,
				}]
				// this.reasonList = billjson
				let billjson = valuesDate.map(item => {
					let obj = {}; // 用于切断引用关系
					for (const key in item) {
						obj[key] = item[key] || ''
					}
					return obj
				})
				const arraylist = [];
				for (let index = 0; index < billjson.length; index++) {
					let element = billjson[index];
					//获取对象字段名 
					for (var elementkey in element) {
						var element_item = elementkey;
						if (element_item.indexOf("BILL_STATUS") > 0) {
							var element_item_value = element[elementkey];
							element["STATUS_STR"] = element_item_value;
							break;
						}
					}
					arraylist.push(element);
				}
				this.reason[this.currentSelect] = arraylist
				this.total['H' + this.currentSelect] = []
				this.pSum(this.currentSelect, billjson)
				this.$emit("reason", this.reason)
			}

		},

	}
</script>


<style>
	.popupWrap {
		display: flex;
		width: 100%;
		justify-content: space-between;
		padding: 0;
		align-items: center;
	}

	.closeClick {
		font-size: 16rpx;
		z-index: 1;
		margin-right: 13px;
		background-color: #ddd;
		width: 26rpx;
		height: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
	.del{
		width: 20rpx;
		height: 20rpx;
		padding: 1rpx;
	}
	.inputBox{
		display: flex;
		width: 100%;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #f8f8f8;
		padding:8rpx 0 8rpx 5rpx
	}
</style>
