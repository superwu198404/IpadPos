<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
	@import url(@/static/style/quiry.css);
</style>

<template>
	<view class="content">
		<query></query>
		<view class="right" style="position: relative;">
			<Head></Head>
			<view class="prolist">
				<view class="hh" style="padding-right:3.7%;">
					<view class="hotcakes">
						<image src="@/images/img2/zhongxin.png" mode="widthFix"></image> 外卖单查询
						<!-- <view>偏好：<text>蛋黄蛋挞</text><text>绿豆糕</text></view> -->
					</view>
				</view>
				<view class="takelist">
					<!-- 查询条件 -->
					<Condits v-if="condits" @reason="getReason" @totalValue="getTotal"
						:inqueryCondition="inqueryCondition" :inqueryConditionInit='inqueryConditionInit' :wdate="wdate"
						:endDate="endDate" :start="start" :bill="bill" :KHID="KHID" :currentSelect="currentSelect"
						:TITLE="TITLE"></Condits>

					<view class="form">
						<view class="Putaway">
							<label @click="open" v-if="isClose">
								<image src="@/images/img2/zhankaiiii.png" mode="widthFix"></image>
							</label>
							<label @click="close" v-if="isOpen">
								<image src="@/images/img2/sousuoooo.png" mode="widthFix"></image>
							</label>
						</view>
						<view class="biaoge" v-if="reason[currentSelect]">
							<table border="0" cellpadding="0" cellspacing="0">
								<thead>
									<th v-for="(item,index) in TITLE['H'+currentSelect]"
										v-if="item.YN_VIEW==='Y'?true:false">
										{{item.TH}}
									</th>
								</thead>
								<tbody>
									<tr v-for="_item,_index in reason[currentSelect]" @click="openDetail1(_index)"
										style="background:''">
										<td :class="_index%2==0?'tdBg':'tdBg2'"
											v-for="(item) in TITLE['H'+currentSelect]" style="background: '';"
											v-if="item.YN_VIEW==='Y'?true:false">
											{{_item[item.ID]}}
										</td>
									</tr>
								</tbody>
							</table>
						</view>
						<view class="totals" v-if="total['H'+ currentSelect]">
							<view v-for="item in total['H'+ currentSelect]">
								<label>{{item.totalname}}：<text>{{item.totalvalue}}</text></label>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 子表 -->
		<view class="box" v-if="zibiao">
			<view class="zibiao">
				<view class="h1">外卖单查询<button class="close" @click="closeSub">×</button></view>
				<view class="form">
					<view class="choice">
						<view class="table">
							<view class="tab" :class="activeIndex===1?'curr':''" @click="changeTab(1)">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<text>子表一</text>
								</label>
							</view>
							<view class="tab" :class="activeIndex===2?'curr':''" v-if="hasTable2" @click="changeTab(2)">
								<image class="bgs" src="@/images/img2/tab-zuo.png" mode="widthFix"></image>
								<label>
									<text>子表二</text>
								</label>
							</view>
						</view>
					</view>
					<view class="biaoge" v-if="reason[currentSelect2]">
						<table border="0" cellpadding="0" cellspacing="0">
							<thead>
								<th v-for="(item,index) in TITLE['H'+currentSelect2]"
									v-if="item.YN_VIEW==='Y'?true:false">{{item.TH}}</th>
							</thead>
							<tbody>
								<tr v-for="_item,_index in reason[currentSelect2]" @click="openDetail1(_index,'sub')"
									style="background: '';">
									<td :class="_index%2==0?'tdBg':'tdBg2'" style="background: '';"
										v-for="(item,index) in TITLE['H'+currentSelect2]"
										v-if="item.YN_VIEW==='Y'?true:false">{{_item[item.ID]}}</td>
								</tr>
							</tbody>
						</table>
					</view>
					<view class="totals">
						<view v-for="item in total['H'+ currentSelect2]">
							<label>{{item.totalname}}：<text>{{item.totalvalue}}</text></label>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Head from '@/pages/Home/Component/Head.vue'
	import query from '@/components/query/query.vue'
	import Condits from '@/components/Condits/Condits.vue'
	import utils from "@/utils/util.js"
	import getQueryCondition from "@/api/business/storeInquiry.js"


	export default {
		components: {
			query,
			Head,
			Condits
		},

		data() {
			return {
				isClose: true,
				isOpen: false,
				condits: true,
				zibiao: false,
				KHID: '', //门店id
				bill: '',
				inqueryCondition: null, //查询条件
				inqueryConditionInit: null, //初始查询条件
				headline: null, //子表
				currentSelect2: '',
				DPID: null,
				mrow: '',
				endDate: '',
				start: '',
				currentSelect: '', //当前请求id
				wdate: '', //xx天后时间
				TITLE: {},
				reason: {},
				total: {},
				list1: [],
				list2: [],
				hasTable2: false,
				activeIndex: 1,
			}
		},
		onLoad(option) {
			console.log(option, `123`)
			let qryid;
			let name;
			if (option.qrytype) {
				qryid = option.qrytype;
				name = option.qtyname;
				this.bill = option.qrytype
			} else {
				qryid = '1056';
				name = "卡销售单查询"
			}
			this.KHID = option.khid
			console.log((this.KHID))
			//初始化时请求数据拿到渲染条件
			// const queryDate = getQueryCondition(option.qrytype)
			//先mock数据
			const v = {
				BILL: "1009",
				KCDID: [{
					id: "YWXKQH.BILL",
					type: "input",
					condname: "POS单号",
					qs: [],
					sql: "",
					f: "*",
					value: ""
				}, {
					id: "YWXKQH.DATE_DH",
					type: "dates",
					condname: "到货日期",
					qs: [],
					sql: "",
					f: ")",
					value: "2023-03-15",
					value1: "2023-03-16"
				}, {
					condname: "产品编码",
					f: '&',
					id: "YWBHQH.SPID",
					qs: [],
					sql: "SELECT PLID ID,SNAME NAME,#$1#$ YLID FROM PLDA  ORDER BY PLID",
					type: 'popup',
					value: "",
					value1: ""
				}, {
					condname: "品类",
					f: '*',
					id: "SPDA.PLID",
					qs: [],
					sql: "SELECT PLID ID,SNAME NAME,#$1#$ YLID FROM PLDA  ORDER BY PLID",
					type: 'popup1',
				}, {
					condname: "销售渠道",
					f: '.',
					id: "VM_SALESP_DAY.XSQD",
					qs: [{
							id: "DS",
							name: "电商"
						},
						{
							id: "ML",
							name: "门零"
						}, {
							id: "QD",
							name: "渠道"
						}, {
							id: "SQ",
							name: "社群"
						},
						{
							id: "CC",
							name: "CC"
						}
					],
					sql: "",
					type: 'select',
					value: "",
					value1: ""
				}, {
					condname: "销售渠道",
					f: '.',
					id: "VM_SALESP_DAY.XSQD",
					qs: [{
							id: "DS",
							name: "电商11"
						},
						{
							id: "ML",
							name: "门零11"
						}, {
							id: "QD",
							name: "渠道11"
						},
					],
					sql: "",
					type: 'select',
					value: "",
					value1: ""
				}, {
					condname: "门店",
					f: '&',
					id: "YWKHDB.KHID",
					qs: [],
					sql: "SELECT PLID ID,SNAME NAME,#$1#$ YLID FROM PLDA  ORDER BY PLID",//K210QTD011-金凤xxx店, NAME:[{ID:"XXX", NAME:''},{ID:"XXX", NAME:''},{ID:"XXX", NAME:''}]
					type: 'store',
					value: "",
					value1: ""
				}],
				DPID: [{
					name: "现烤请货商品查询",
					id: "1008",
					F: "YWXKQH_BILL",
					T: "YWXKQHSP.BILL",
					CT: "."
				}],
				START: "2023",
				ENDDATE: "2024-12-31"
			};
			console.log(v, `第一份数据`)
			// this.inqueryData = v
			this.setDate(v)
			//请求第二份配置数据
			const date2 = [{
				HYPELINK: null,
				ID: "KHDA_KHID",
				LV: 1,
				QRYNAME: "1009",
				TH: "SAP门店编码",
				WIDTH: 5,
				YN_VIEW: "N",
			}, {
				HYPELINK: null,
				ID: "KHDA_SNAME",
				LV: 2,
				QRYNAME: "1009",
				TH: "门店名称",
				WIDTH: 166,
				YN_VIEW: "Y",
			}, {

				HYPELINK: "Y",
				ID: "YWXKQH_TPNET",
				LV: 13,
				QRYNAME: "1009",
				TH: "申请售价总额",
				WIDTH: 95,
				YN_VIEW: "Y",
			}, {
				HYPELINK: null,
				ID: "YWXKQH_DATE_DH",
				LV: 5,
				QRYNAME: "1009",
				TH: "到货日期",
				WIDTH: 100,
				YN_VIEW: "Y",
			}, {
				HYPELINK: null,
				ID: "YWXKQH_DATE_LR",
				LV: 6,
				QRYNAME: "1009",
				TH: "录入日期",
				WIDTH: 100,
				YN_VIEW: "Y",
			}, {
				HYPELINK: null,
				ID: "SPDA_SNAME",
				LV: 1,
				QRYNAME: "1008",
				TH: "商品名称",
				WIDTH: 100,
				YN_VIEW: "Y",
			}, {
				HYPELINK: null,
				ID: "YWXKQHSP_BILL",
				LV: 3,
				QRYNAME: "1008",
				TH: "POS单号",
				WIDTH: 100,
				YN_VIEW: "Y",
			}, {
				HYPELINK: "Y",
				ID: "YWXKQHSP_PNET",
				LV: 5,
				QRYNAME: "1008",
				TH: "要货售价额",
				WIDTH: 100,
				YN_VIEW: "Y",
			}, {
				HYPELINK: null,
				ID: "YWXKQHSP_PRICE",
				LV: 6,
				QRYNAME: "1008",
				TH: "售价",
				WIDTH: 100,
				YN_VIEW: "Y",
			}, {
				HYPELINK: null,
				ID: "YWXKQHSP_SPID",
				LV: 8,
				QRYNAME: "1008",
				TH: "商品编码",
				WIDTH: 100,
				YN_VIEW: "Y",
			}]
			console.log(date2, `第二份数据`)
			let tablelist = {};
			for (let i = 0; i < date2.length; i++) {
				let newid = date2[i].QRYNAME;
				if (tablelist[newid] == null) {
					tablelist[newid] = [];
				}
				tablelist[newid].push(date2[i]);
			}
			for (var item in tablelist) {
				this.TITLE["H" + item] = tablelist[item]
			}
			console.log(this.TITLE, `条件数据`)
		},
		methods: {
			changeTab(value) {
				this.activeIndex = value
				if (value === 1) {
					this.reason[this.currentSelect2] = this.list1
					this.pSum(this.currentSelect2, this.list1)
				} else if (value === 2) {
					this.reason[this.currentSelect2] = this.list2
					this.pSum(this.currentSelect2, this.list2)
				}
			},
			closeSub() {
				this.zibiao = false
			},
			open() {
				this.isClose = false
				this.isOpen = true
				this.condits = false
			},
			close() {
				this.isClose = true
				this.isOpen = false
				this.condits = true
			},
			getReason(e) {
				this.reason = e
			},
			getTotal(e) {
				this.total = e
			},
			//设置页面数据
			setDate(res) {
				// const date = JSON.parse(res
				this.inqueryCondition = JSON.parse(JSON.stringify(res.KCDID))
				this.inqueryConditionInit = JSON.parse(JSON.stringify(res.KCDID))

				let ls_headline = [];
				for (var z = 0; z < res.DPID.length; z++) {
					let findindex = ls_headline.findIndex((item, index) => {
						return item.id == res.DPID[z].id
					})
					if (findindex == -1) {
						ls_headline.push({
							id: res.DPID[z].id,
							name: res.DPID[z].name
						});
					}
				}
				this.headline = ls_headline
				this.DPID = res.DPID
				this.endDate = res.ENDDATE
				this.start = res.START
				this.currentSelect = res.BILL,
					this.wdate = utils.getDateStr(null, -30)
			},
			openDetail1(index, isSub) {

				if (this.headline.length <= 0) {
					return
				} else {

					this.mrow = index
					this.qrysub(index, this.headline[0].id, isSub);
				}
			},
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
				this.total['H' + currentSelect] = pSumList
			},
			// todo 人员id
			qrysub(mrows, subid, isSub) {
				let data = {}
				data.QRYNAME = subid;
				data.KHID = this.KHID;
				data.CZYID = '0376';
				for (var i = 0; i < this.DPID.length; i++) {
					let qtyid = this.DPID[i].id;
					if (qtyid == subid) {
						data[this.DPID[i].T] = this.DPID[i].CT + this.reason[this.currentSelect][mrows][this
							.DPID[i].F
						].toString();
					}
				}
				//请求来的数据
				const values = [{
						SPDA_SNAME: "松软炼奶吐司",
						SPDA_UNIT: "个",
						YWXKQHSP_BILL: "K200QTD0065230301092833",
						YWXKQHSP_NOTE: null,
						YWXKQHSP_PNET: 22,
						YWXKQHSP_PRICE: 22,
						YWXKQHSP_SEQNO: 1,
						YWXKQHSP_SPID: "000000001080100025",
						YWXKQHSP_ZQTY: 1,
						YWXKQHSP_ZQTY_PS: null,
						YWXKQHSP_ZQTY_SC: null,
					},
					{
						SPDA_SNAME: "松软炼奶吐司",
						SPDA_UNIT: "个",
						YWXKQHSP_BILL: "K200QTD0065230301092833",
						YWXKQHSP_NOTE: null,
						YWXKQHSP_PNET: 22,
						YWXKQHSP_PRICE: 22,
						YWXKQHSP_SEQNO: 1,
						YWXKQHSP_SPID: "000000001080100025",
						YWXKQHSP_ZQTY: 1,
						YWXKQHSP_ZQTY_PS: null,
						YWXKQHSP_ZQTY_SC: null,

					}
				]
				if (values.length > 0) {
					this.zibiao = true
					this.currentSelect2 = subid
					this.reason[subid] = values
					this.list1 = values
					this.pSum(this.currentSelect2, values)
					if (isSub && values.length > 0) {
						// todo
						const values = [{
							SPDA_SNAME: "松软炼奶吐司1111",
							SPDA_UNIT: "个",
							YWXKQHSP_BILL: "K200QTD0065230301092833",
							YWXKQHSP_NOTE: null,
							YWXKQHSP_PNET: 22,
							YWXKQHSP_PRICE: 22,
							YWXKQHSP_SEQNO: 1,
							YWXKQHSP_SPID: "000000001080100025",
							YWXKQHSP_ZQTY: 1,
							YWXKQHSP_ZQTY_PS: null,
							YWXKQHSP_ZQTY_SC: null,
						}]
						this.list2 = values
						this.reason[subid] = values
						this.hasTable2 = true
						this.activeIndex = 2
						this.pSum(this.currentSelect2, values)
					}
				}

			}
		}
	}
</script>

<style>
	.prolist {
		height: 90%;
	}

	.tdBg {
		background-color: aliceblue;
	}

	.tdBg2 {
		background-color: #f5f4f8;
	}
</style>
