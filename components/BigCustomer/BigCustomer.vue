<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	@import url(@/static/style/index.css);
</style>
<template>
	<view class="boxs">
		<view class="customer">
			<view class="h3">选择大客户 <button @click="Close()" class="guan close">×</button></view>
			<view v-if="_ywtype=='kq_sale' || (_ywtype=='sale_credit'||currentSaleType=='sale_credit')" class="search">

				<label v-if="_ywtype=='kq_sale'">
					<!-- -->
					赊销：
					<view class="classifys">
						<label @click="CreditMode(true)"
							:class="exists_credit ? 'curr' : ''"><em><text></text></em>是</label>
						<label @click="CreditMode(false)"
							:class="exists_credit ? '' : 'curr'"><em><text></text></em>否</label>
					</view>
				</label>
				
				
				<label v-if="_ywtype=='sale_credit'||currentSaleType=='sale_credit'">
					<!-- -->
					是否临时授信赊销：
					<view class="classifys">
						<label @click="SaleCreditMode(true)"
							:class="sales_credit ? 'curr' : ''"><em><text></text></em>是</label>
						<label @click="SaleCreditMode(false)"
							:class="sales_credit ? '' : 'curr'"><em><text></text></em>否</label>
					</view>
				</label>
				
				<!-- 授信业务员 -->
				<label v-if="_ywtype=='sale_credit'||currentSaleType=='sale_credit'">
					授信业务员：
					<!-- 下拉搜索选择组件 -->
					<view style="width: 250rpx; z-index: 99999; position: relative;">
						<input v-model="sxsearchValue" placeholder="请输入人员名称"
							style="width: 100%; padding: 10rpx; border: 1px solid #e5e5e5; border-radius: 6rpx;"
							@focus="sxshowDropdown = true" />
						<view v-if="sxshowDropdown && sxfilteredList.length"
							style="position: absolute; top: 80rpx; left: 0; width: 320rpx;  max-height: 400rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
							<view v-for="(item, index) in sxfilteredList" :key="index"
								style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;" @click="sxhandleSelect(item)">
								{{item.IDNAME }}
							</view>
						</view>
				
						<!-- 无结果提示 -->
						<view v-if="sxshowDropdown && !sxfilteredList.length"
							style="position: absolute; top: 80rpx; left: 0; width: 100%; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999;">
							暂无匹配结果
						</view>
					</view>
				</label>
				
			</view>
			<view class="search">
	
				
				<!-- 业务员 -->
				<label>
					业务员：
					<!-- 下拉搜索选择组件 -->
					<view style="width: 250rpx; z-index: 99999; position: relative;">
						<input v-model="searchValue" placeholder="请输入人员名称"
							style="width: 100%; padding: 10rpx; border: 1px solid #e5e5e5; border-radius: 6rpx;"
							@focus="showDropdown = true" />
						<view v-if="showDropdown && filteredList.length"
							style="position: absolute; top: 80rpx; left: 0; width: 320rpx;  max-height: 400rpx; overflow-y: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; z-index: 100000;">
							<view v-for="(item, index) in filteredList" :key="index"
								style="padding: 10rpx; border-bottom: 1px solid #f5f5f5;" @click="handleSelect(item)">
								{{item.IDNAME }}
							</view>
						</view>

						<!-- 无结果提示 -->
						<view v-if="showDropdown && !filteredList.length"
							style="position: absolute; top: 80rpx; left: 0; width: 100%; padding: 10rpx; background: #fff; border: 1px solid #e5e5e5; border-radius: 6rpx; text-align: center; color: #999;">
							暂无匹配结果
						</view>
					</view>
				</label>
				<view class="client">
					<label>
						<image src="../../images/dakehu.png" mode="widthFix"></image><input v-model="search.client_name"
							type="text" placeholder="大客户名称" />
					</label>
					<label>
						<image src="../../images/dakhu-mc.png" mode="widthFix"></image><input v-model="search.client_no"
							type="text" placeholder="大客户编码" />
					</label>
				</view>
				<button class="btn" @click="GetBigClients('1')">搜索</button>
			</view>
			<view class="credit">
				<!-- <radio-group @change="SelectedBigCustomer" style="width: 100%; display: flex;"> -->
				<view class="li" :class="curIndex === index? 'curr':' '" v-for="(i,index) in big_customers"
					@click="ConfimrBig(i,index)">
					<em></em>
					<image src="../../images/dakehu-xz.png" mode="widthFix"></image>
					<view class="encods">
						<label style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
							<!-- <radio :value="i.DKHID" :checked="index === current"></radio> -->
							{{ i.NAME }}
						</label>
						<text>客户编码：{{ i.DKHID }}</text>
					</view>
				</view>

				<!-- </radio-group> -->
			</view>
			<view class="confirm">
				<button class="btn btn-qx" @click="Close()">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	import common from '@/api/common.js';
	import _login from '@/api/business/login.js';
	import qiaoSelect from '@/uni_modules/qiao-select/components/qiao-select/qiaoSelect.vue'
	import {
		getBigClients,
		getBigClientsJGZ,
		GetBigRYCredit
	} from '@/api/business/bigclient.js';
	let that;
	export default {
		name: "BigCustomer",
		props: {
			_ywtype: {
				type: String,
				default: ""
			}
		},
		components: {
			qiaoSelect
		},
		data() {
			return {
				search: {
					client_no: "", //大客户编号 0020000955
					client_name: ""
				},
				JGZList:[],
				exists_credit: false,
				sales_credit: false,
				//xyed:0,
				big_customers: [],
				big_client_info: {},
				current: -1,
				curIndex: -1,
				custom_event_name: "",
				RYData: [], //门店人员信息
				MDRY: {
					RYID: getApp().globalData.store.RYID,
					SNAME: getApp().globalData.store.RYNAME
				},
				ryIndex: 0,
				value: "",

				// 搜索输入框的值
				searchValue: '',
				// 是否显示下拉列表
				showDropdown: false,
				currentSaleType:'',
				
				//授信人员
				sxMDRY: {
					RYID: getApp().globalData.store.RYID,
					SNAME: getApp().globalData.store.RYNAME
				},
				sxvalue: "",
				sxsearchValue: '',
				// 是否显示下拉列表
				sxshowDropdown: false,
				
			}
		},
		computed: {
			Checked: function() {
				return function(id) {
					return this.big_client_info.DKHID === id;
				}
			},
			// 模糊搜索过滤后的列表
			filteredList() {
				if (!this.searchValue) {
					return this.RYData;
				}
				const keyword = this.searchValue.trim();
				return this.RYData.filter(item => {
					if (!item.IDNAME) return false;

					const targetText = item.IDNAME;
					return targetText.includes(keyword);
				});
			},
			//授信人员模糊过滤
			sxfilteredList() {
				if (!this.sxsearchValue) {
					return this.RYData;
				}
				const keyword = this.sxsearchValue.trim();
				return this.RYData.filter(item => {
					if (!item.IDNAME) return false;
			
					const targetText = item.IDNAME;
					return targetText.includes(keyword);
				});
			}
		},
		
		methods: {
			//授信选择人员
			sxhandleSelect(item) {
				this.sxvalue = item.IDNAME; // 绑定选中值
				this.sxsearchValue = item.IDNAME; // 同步到搜索框
				this.sxshowDropdown = false; // 关闭下拉列表
				this.sxMDRY = item;
				console.log("选择的授信接待员：", this.sxMDRY);
				//uni.$emit("choose-mdry", this.MDRY); //通知外部选择事件
				//uni.$emit('set-jdy', this.MDRY); //通知一下外部显示业务员信息
			},
			
			// 选择人员
			handleSelect(item) {
				this.value = item.IDNAME; // 绑定选中值
				this.searchValue = item.IDNAME; // 同步到搜索框
				this.showDropdown = false; // 关闭下拉列表
				this.MDRY = item;
				console.log("选择的接待员：", this.MDRY);
				uni.$emit("choose-mdry", this.MDRY); //通知外部选择事件
				uni.$emit('set-jdy', this.MDRY); //通知一下外部显示业务员信息
			},
			Close: function() {
				// if (Object.keys(this.big_client_info).length == 0) {
				// 	util.simpleMsg("请选择大客户", true);
				// 	return;
				// }
				console.log("[BigCustomer-Close]大客户信息:", this.big_client_info);
				if (this.exists_credit) {
					this.big_client_info.exists_credit = this.exists_credit;
				} else {
					delete this.big_client_info.exists_credit;
				};
				//if (this.sales_credit) {
					//this.big_client_info.sales_credit = this.sales_credit;
				//} else {
					//delete this.big_client_info.sales_credit;
				//};
				
				
				// this.big_client_info.exists_credit = this.exists_credit;
				console.log("组件回调的大客户：", this.big_client_info);
				uni.$emit('close-big-customer', this.big_client_info);
				 uni.$emit('close-big-customer_JGZ', this.big_client_info,this.JGZList);
				this.$emit('ClosePopup', this.big_client_info);
				uni.$emit(this.custom_event_name, 'close');
			},
			CreditMode: function(is_credit) {
				this.exists_credit = is_credit;
			},
			SaleCreditMode: function(is_credit) {
				
				this.sales_credit = is_credit;
			},
			GetBigClients: function(type) {
				console.log("查看门店信心：", this.GSID + this.KHID);
				if(type!='1'){
				uni.$emit('get-current-type', (type) => {
				  console.log("百分百拿到类型122222：", type); 
				  console.log("_ywtype:", this._ywtype);
				  console.log("currentSaleType:", this.currentSaleType);
				  this.currentSaleType = type; // 赋值
				});
				//拿到后就清空
				uni.$emit('clear-current-type');
				}
				let store = getApp().globalData.store;
				getBigClients({
					gsid: store.GSID,
					client_type: '1',
					khid: this.search.client_no,
					name: this.search.client_name,
					storeid: store.KHID
				}, util.callBind(this, function(res) {
					this.big_customers = JSON.parse(res.data);
					console.log("查询出的大客户信息：", res);
					//需要注释 不然默认第一个大客户
					// this.big_client_info = this.big_customers[0];
					// util.simpleMsg("大客户查询成功!", false, this.big_customers);
				}), (err) => {
					util.simpleMsg("大客户查询失败!", true, err);
					this.big_customers = [];
				})
			},
			//选中大客户
			ConfimrBig: function(e, i) {
				this.curIndex = i;
				this.big_client_info = e;
				this.big_client_info.DKFID = e.DKHID;
				
				
				// 1. 把【关闭弹窗】的逻辑抽成函数
				const closePopupAndEmit = (data) => {
				  console.log("[BigCustomer-ConfimrBig]大客户信息:", this.big_client_info);
				  
				  if (this.exists_credit) {
				    this.big_client_info.exists_credit = this.exists_credit;
				  } else {
				    delete this.big_client_info.exists_credit;
				  };
				  
				  if (this.sales_credit) {
				    this.big_client_info.sales_credit = this.sales_credit;
					//还需要将选择的授信人员给传出去
					this.big_client_info.sales_ryid = this.sxMDRY.RYID;
					 //this.big_client_info.xyed = this.xyed;
					//由于临时授信选择的授信业务员  默认相当于接待员
					uni.$emit("choose-mdry", this.sxMDRY); //通知外部选择事件
					uni.$emit('set-jdy', this.sxMDRY); //通知一下外部显示业务员信息
					
				  } else {
				    delete this.big_client_info.sales_credit;
					delete this.big_client_info.sales_ryid ;
					//delete this.big_client_info.xyed ;
				  };
				  
				  console.log("组件回调的大客户：", this.big_client_info);
				  this.$emit('ClosePopup', this.big_client_info);
				  uni.$emit('close-big-customer', this.big_client_info);
				  uni.$emit('close-big-customer_JGZ',this.big_client_info, this.JGZList);
				  uni.$emit(this.custom_event_name, 'close');
				};
				
			  //uni.$emit('get-current-type', (type) => {
			    //console.log("百分百拿到类型12：", type); 
			    //this.currentSaleType = type; // 赋值
			  //});
				let store = getApp().globalData.store;
				console.log("_ywtype:", this._ywtype);
				console.log("currentSaleType:", this.currentSaleType);
				console.log("exists_credit:", this.exists_credit);
				console.log("sales_credit:", this.sales_credit);
				//先判断是否临时授信
				if(this.sales_credit){
					//临时授信必须选业务员，需要查业务员是否有效的临时授信员工
					if (!this.sxMDRY || !this.sxMDRY.RYID) {
					  util.simpleMsg('临时授信赊销请选择授信业务员', true)
					  return false;
					}
					GetBigRYCredit({
						RYID:this.sxMDRY.RYID,
						KHID: store.KHID
					},  util.callBind(this, function(res) {
									console.log("GetBigRYCredit1:", res);	
						let resdt = JSON.parse(res.data);
						console.log("GetBigRYCredit:", resdt);
							if(resdt.length<=0){
								  util.simpleMsg('当前业务员不是临时受信员工', true)
								  this.big_client_info={};
								  return false;
							}else{
								// this.xyed=resdt[0].XYED;
								 //console.log("信用额度:", this.xyed);
								closePopupAndEmit();
								
							}
						
						}), (err) => {
							util.simpleMsg('当前业务员不是临时受信员工', true)
							//如果失败了 也不让往下走
							this.big_client_info={};
								  return false;
						})
					
					
				}else{
					//根据选中的大客户信息 去查询大客户价格组
					if((this._ywtype=="sale_credit"||this.currentSaleType=='sale_credit')||(this._ywtype=='kq_sale'&&this.exists_credit)){
						
						this.JGZList=[];
						getBigClientsJGZ({
							dkhid:  e.DKHID,
							khid: store.KHID
						}, util.callBind(this, function(res) {
							
							let JGZList = JSON.parse(res.data);
						console.log("[BigCustomer-Close]大客户价格组:", JGZList);
							if(JGZList.length<=0){
								//表示没有价格组。则保持原样不关闭，
								util.simpleMsg("无生效合同，不允许赊销!", true);
								this.big_client_info={};
							}else{
								this.JGZList=JGZList;
								closePopupAndEmit();
								
							}
						
						}), (err) => {
							util.simpleMsg("大客户价格组查询失败!", true, err);
							//如果失败了 也不让往下走
							this.big_client_info={};
						})
						
					}else{
						closePopupAndEmit();
					}
					
					
				}
				
				
				
				
				
				
				// console.log("[BigCustomer-ConfimrBig]大客户信息:", this.big_client_info);
				// if (this.exists_credit) {
				// 	this.big_client_info.exists_credit = this.exists_credit;
				// } else {
				// 	delete this.big_client_info.exists_credit;
				// };
				// console.log("组件回调的大客户：", this.big_client_info);
				// this.$emit('ClosePopup', this.big_client_info);
				// uni.$emit('close-big-customer', this.big_client_info);
				// uni.$emit(this.custom_event_name, 'close');
			},
			// SelectedBigCustomer: function(evt) {
			// 	for (let i = 0; i < this.big_customers.length; i++) {
			// 		if (this.big_customers[i].DKHID === evt.detail.value) {
			// 			this.current = i;
			// 			this.big_client_info = this.big_customers[i];
			// 			this.big_client_info.exists_credit = this.exists_credit;
			// 			break;
			// 		}
			// 	}
			// },
			CustomListener: function() {
				console.log("[CustomListener]准备接收名称...");
				uni.$off("set-custom-event");
				uni.$once("set-custom-event", util.callBind(this, function(data) {
					console.log("[CustomListener]获取名称:", data);
					this.custom_event_name = data;
				}))
			},
			//获取门店人员
			GetMDKHRY: e => {
				let store = getApp().globalData.store;
				_login.GetMDKHRY(store.KHID, res => {
					if (res.code) {
						let data = JSON.parse(res.data);
						// 在数据数组开头添加一个空对象作为默认选项
						let id = getApp().globalData.store.RYID;
						let name = getApp().globalData.store.RYNAME;
						that.RYData = data;
						// [{
						// 	RYID: id,
						// 	SNAME: name,
						// 	IDNAME: id + '-' + name
						// }, ...data];
						console.log("RYData结果：", that.RYData);
					}
				})
			},

			//门店人员切换事件
			MDRYChange1: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				that.ryIndex = e.detail.value;
				if (that.RYData.length > 0)
					that.MDRY = that.RYData[that.ryIndex];
				console.log("选择的接待员：", that.MDRY);
				uni.$emit("choose-mdry", that.MDRY); //通知外部选择事件
				uni.$emit('set-jdy', that.MDRY); //通知一下外部显示业务员信息
			},
		},
		
		mounted() {
			this.GetBigClients();
		},
		created() {
			that = this;
			this.CustomListener();
			this.GetMDKHRY();
			uni.$emit("big-customer-open");
			
		
		
		},
		destroyed() {
			if (this.exists_credit) {
				this.big_client_info.exists_credit = this.exists_credit;
			} else {
				delete this.big_client_info.exists_credit;
			};
			
			if (this.sales_credit) {
				this.big_client_info.sales_credit = this.sales_credit;
				//还需要将选择的授信人员给传出去
				this.big_client_info.sales_ryid = this.sxMDRY.RYID;
				 //this.big_client_info.xyed = this.xyed;
			} else {
				delete this.big_client_info.sales_credit;
				delete this.big_client_info.sales_ryid ;
				//delete this.big_client_info.xyed ;
			};
			// this.big_client_info.exists_credit = this.exists_credit;
			uni.$emit("big-customer-close", this.big_client_info);
			  uni.$emit('close-big-customer_JGZ', this.big_client_info,this.JGZList);
			  uni.$emit('set-lssx', this.sales_credit);
			  	console.warn("[Destroyed]big_client_info...",  this.big_client_info);
			console.warn("[Destroyed]大客户关闭...");
		}
	}
</script>

<style>
	.customer {
		background-color: #fff;
		width: 78%;
		min-height: 800rpx;
		max-height: 88%;
		border-radius: 20rpx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 0 3% 8%;
	}

	.customer .h3 {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 34rpx;
		border-bottom: 1px dashed #eee;
	}

	.customer .h3 .guan {
		float: right;
		background: none;
		font-size: 32rpx;
		height: 100rpx;
		line-height: 100rpx;
	}

	.customer .credit radio-input {
		width: 34rpx;
		height: 34rpx;
		padding: 1% 0;
	}

	.search {
		display: flex;
		padding: 0 1% 0 0;
		justify-content: space-between;
		position: relative;
		margin-top: 1%;
	}

	.search .client {
		background-color: #F2F6F6;
		width: 100%;
		display: flex;
		border: 1rpx solid #98C3B3;
		border-radius: 6rpx 0 0 6rpx;
	}

	.search label {
		display: flex;
		align-items: center;
		width: 49%;
		margin-right: 2%;
	}

	.search .client label text {
		display: flex;
		width: 160rpx;
	}

	.search .client label image {
		width: 40rpx;
		height: 40rpx;
		margin: 0 6rpx;
	}

	.search .client label:nth-child(1) input {
		border-radius: 1rpx solid #98C3B3;
	}

	/* .search label text {
		display: flex;
		width: 160rpx;
	} */

	.search label input {
		border: none;
		border-radius: 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 88%;
	}

	.search .btn {
		width: 160rpx;
		height: 64rpx;
		line-height: 64rpx;
		padding: 0;
		font-size: 28rpx;
		background: #006B44;
		border-radius: 0 6rpx 6rpx 0;
		position: absolute;
		top: 5px;
		right: 5px;
	}

	.credit {
		display: flex;
		flex-wrap: wrap;
		max-height: 920rpx;
		overflow: auto;
		/* min-height: 500rpx; */
	}

	.credit .li {
		width: 44.8%;
		display: flex;
		background-color: #fff;
		border-radius: 10rpx;
		/* box-shadow: 0px 10rpx 20rpx 1rpx rgba(0, 107, 68, 0.06); */
		padding: 1.5% 2% 1%;
		margin: 1% 2% 2% 0;
		border: 1rpx solid #ddd;
		position: relative;
	}

	.credit .li:nth-child(2n) {
		margin-right: 0;
	}

	.credit .li em {
		position: absolute;
		top: 10%;
		right: 0;
		width: 4rpx;
		height: 40rpx;
		background-color: #9bdda1;
	}

	.credit .li:nth-child(2n) {
		margin-right: 0;
	}

	.credit .li.curr {
		box-shadow: 0px 15px 20px 1px rgba(197, 231, 200, 0.3000);
		border-radius: 8rpx;
		border: 2rpx solid #9bdda1;
		background: linear-gradient(180deg, #E0F2E1 0%, #FFFFFF 100%);
	}

	.encods {
		display: flex;
		flex-direction: column;
		width: 85%;
	}

	.credit .li image {
		width: 100rpx;
		height: 100rpx;
		margin-right: 2%;
	}

	.credit .li label {
		font-weight: 700;
		font-size: 34rpx;
	}

	.credit .li text {
		color: #b0b0b0;
		font-size: 24rpx;
		line-height: 60rpx;
	}

	.classifys {
		display: flex;
		align-items: center;
		background: none;
		color: #333;
		font-weight: 400;
		border-radius: 40rpx;
		font-size: 14px;
		border: none;
	}

	.classifys label {
		width: 100rpx;
	}

	.classifys label em {
		width: 24rpx;
		height: 24rpx;
		border: 2rpx solid #333;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 8rpx;
	}

	.classifys label.curr {
		color: #006B44;
	}

	.classifys label.curr em {
		border: 2rpx solid #006B44;
	}

	.classifys label.curr em text {
		display: inline-block;
		width: 20rpx;
		height: 20rpx;
		background-color: #006B44;
		padding: 0;
		margin: 2rpx;
		border-radius: 50%;
		font-weight: 700;
	}

	.confirm .btn-qx {
		width: 70%;
		margin: 0 auto;
	}

	.customer .confirm {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 2% 0;
		background-color: #fff;
		border-top: 1px solid #eee;
	}
</style>