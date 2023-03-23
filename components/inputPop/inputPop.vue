<template>
	<view v-show="isShowPop" class="popsMask" @click.self="closeBtn">
		<view class="popsWrap">
			<view class="pops">
				<view class="close-btn" @click="closeBtn">
					❌
				</view>
				<view class="popInput">
					<!-- <image src="../../images/chaxun.png" mode="" class="popimage"></image> -->
					<input type="text" :placeholder="name" class="popInput" :value="inputValue" :data-index="dataIndex"
						@input="shoppinginput" >
				</view>
				<view class="result" v-if="searchList.length">
					<view class="resultItem" v-for="item,index in searchList" @click="selectItem(index)">
						{{item.KHID}}-{{item.SNAME}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchList: [],
				timeHandle: null,
				isShowPop: false,
				inputValue: ""
			}
		},
		props: {
			inputTxt: {
				type: String,
				default: '输入店铺名称查询',
			},
			storeType: {
				type: Array,
			},
			//后台名称
			model: {
				type: String,
				default: 'khItem'
			},
			clientTYPE: {
				type: Array,
			},
			// 控制弹层数据
			popInfo: {
				type: Object
			},
			//查询条件数组
			inqueryCondition: {
				type: Array
			}
		},
		computed: {
			name() {
				return this.inputTxt
			},
			dataIndex() {
				return this.popInfo.dataIndex
			}
		},
		methods: {
			closeBtn(e) {
				this.isShowPop = false;
				this.inputValue = ''
				this.searchList = []
			},
			open() {
				this.isShowPop = true;
			},
			bindKeyInput(value) {
				let newval = value;
				let qcid = this.popInfo.dataIndex;
				let qtype = this.inqueryCondition[qcid].type;
				let qitems = this.inqueryCondition[qcid];
				let flag = this.popInfo.dataFlag;
				let valuef = this.popInfo.dataValue;
				if (flag == null) {
					flag = qitems.f;
				}
				if (valuef == null) {
					valuef = "value";
				}
				this.setInputDate(qcid, valuef, newval)
			},
			setInputDate(index, field, value) {
				this.$set(this.inqueryCondition[index], field, `${value.KHID}-${value.SNAME}`)
			},
			shoppinginput(e) {
				this.inputValue = e.detail.value
				let inputVal = e.detail.value
				if (this.timeHandle != null) {
					clearTimeout(this.timeHandle);
				}
				if (inputVal.length < 2) {
					return;
				}
				this.timeHandle = setTimeout(() => {
					// var storeData = JSON.parse(wx.getStorageSync('kh'));
					// myobj.YW.QryList({
					// 	ID: inputVal,
					// 	ZZTLX: this.properties.storeType,
					// 	STOREID: storeData.khid,
					// 	DPID: this.properties.DPID,
					// 	CLIENT_TYPE: this.properties.clientTYPE
					// }, res => {
					// 	let billjson = JSON.parse(res);
					// 	this.setData({
					// 		SYS002: billjson
					// 	});
					// }, null, null, this.properties.model);
					// {"brand":"SmallProSendingBackground.Model","action":"Qrylist","ywname":"productItem","data":"{\"ID\":\"123\",\"ZZTLX\":[],\"STOREID\":\"K200QTD005\",\"DPID\":null,\"CLIENT_TYPE\":[]}"}
					// 请求数据 todo
					const data = {
						ID: inputVal,
						ZZTLX: this.props?.storeType || [],
						STOREID: "门店id--内存中取出",
						CLIENT_TYPE: this.props?.CLIENT_TYPE || []
					}
					const res = [{
						KHID: "000000003080101234",
						SNAME: "冷种（配）25.5-仟吉"
					}, {
						KHID: "000000003080105123",
						SNAME: "罐装杂果（配）100"
					}, {
						KHID: "000000003040100123",
						SNAME: "马斯卡邦慕斯778g-仟吉"
					}]
					this.searchList = res

				}, 1500);
			},
			//选择列表中你要挑选的商品
			selectItem(index) {
				const item = this.searchList[index]
				this.bindKeyInput(item)
				this.closeBtn()
			}
		}
	}
</script>

<style>
	.popsMask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: #00000010;
		z-index: 98;
		top: 0;
		left: 0;
	}

	.popsWrap {
		position: fixed;
		width: 800rpx;
		height: 700rpx;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: auto;
		z-index: 99;
		box-shadow: 0 0 10px 1px #00000050;
		border-radius: 8px;
		padding: 8rpx;
		background-color: #fff;
		overflow-y: auto;
	}

	.pops {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
		display: flex;
		flex-direction: column;
		position: relative;
		position: relative;
	}

	.popsClose {
		position: absolute;
		top: 10;
		right: 20;

	}

	.popimage {
		width: 30rpx;
		height: 30rpx;
		margin-right: 13rpx;
		margin-left: 8px;  
	}

	.popInput {
		background-color: #f5f5f5;
		height: 70rpx;
		margin-right: 70px;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 20rpx;
		padding-left: 10rpx;
		width: 80%;
	}

	.result {
		display: flex;
		flex-direction: column;
	}

	.resultItem {
		margin-top: 15rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		padding-left: 14rpx;
		align-items: center;
		background-color: #F8FEF9;
		height: 80rpx;
	}

	.close-btn {
		position: absolute;
		top: 10rpx;
		right: 15rpx;
		cursor: pointer;
	}
</style>
