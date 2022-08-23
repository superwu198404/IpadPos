<style scopeed>
	@import url(@/static/style/payment/paymentall/basis.css);
	/* @import url(@/style/basis.css); */
	@import url(@/static/style/index.css);
	@import url(@/static/style/message.css);
</style>

<template>
	<view class="content">
		<!-- <menu_page :menuIndex="7"></menu_page> -->
		<view class="right">
			<!-- <menu_head></menu_head> -->
			<view class="listof">
				<view class="prolist">
					<view class="commodity">
						<view class="hh">
							<view class="hotcakes">
								<image src="../../images/ydtq.png" mode="widthFix"></image> 消息通知
								<!-- <view class="classifys">
									<text>全部</text><text class="curr">今日</text><text>近三天</text><text>已过期</text>
								</view> -->
							</view>
							<view class="sousuo" v-if="false">
								<label @click="Search()">
									<image src="../../images/sousuo.png" mode="widthFix"></image>搜索
								</label>
								<view class="criterias" v-if="Criterias">
									<view class="critlist"><text>紧急类型：</text><input type="text" /></view>
									<view class="critlist"><text>部门：</text><input type="text" /></view>
									<view class="confs">
										<button class="btn btn-qx">清空</button>
										<button class="btn" @click="SearchMsg()">查询</button>
									</view>
								</view>
							</view>
						</view>

						<view class="messageblob">
							<view class="depart">
								<view class="broad">
									<label class="h8">紧急程度</label>
									<view class="genres">
										<!-- <text>重要（10）</text>
										<text>普通（15）</text> -->
										<text v-for="(item) in JJ_Arr"
											@click="SearchMsg({type:item.type})">{{item.type}}({{item.count}})</text>
									</view>
								</view>
								<view class="broad">
									<label class="h8">部门</label>
									<view class="genres">
										<!-- <text>管理部（10）</text>
										<text>运营部（15）</text> -->
										<text v-for="(item) in Dep_Arr"
											@click="SearchMsg({name:item.name})">{{item.name}}({{item.count}})</text>
									</view>
								</view>
							</view>
							<view class="messlist" v-if="XT_MsgData.length>0">
								<!-- 消息循环 -->
								<view class="infors" v-for="(item,index) in XT_MsgData">
									<text class="h7">{{item.newVal.DATE_LR}}</text>
									<view class="liis">
										<view class="emergs">
											<label class="zhoyao" v-if="item.newVal.IMTYPE=='1'">重要</label>
											<label class="putong" v-else>普通</label>
											<text>{{item.newVal.EDATE}}截止</text>
										</view>
										<view class="h6">{{item.newVal.TITLE}}</view>
										<view class="sender">
											<text>{{item.newVal.YYBM}} ·
												{{item.newVal.ID_RY_XG}}</text>
											<button class="btn" @click="SeeMore(item)">查看</button>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="boxs" v-if="Shoppingbags">
			<view class="meminfo">
				<image class="bgs" src="../../images/dl-bjhw.png" mode="widthFix"></image>
				<view>
					<view class="member">
						<label class="h9">消息详情</label>
						<button>×</button>
					</view>
					<view class="shoppbag">
						<view class="liis messadet">
							<view class="emergs"><label class="zhoyao">重要</label><label class="putong"
									v-if="putong">普通</label><text>● 进行中</text></view>
							<view class="h6">这是条关于通知的文字这是条关于通知的文字这是条关于通知的文字这是条关于通知的文字标题超出五十个字显示...</view>
							<view class="sender"><text>质管部 · 橘子</text><text>创建时间：2022-06-13 09:00:00</text></view>
						</view>
						<view class="matters">
							<image src="../../images/dl-login.png" mode="widthFix"></image>
							<text>
								编程技术的保存失败的次数第v你说的基本上调查
								上档次
								十九点v你是
							</text>
						</view>
						<view class="tally">
							<label>
								<image src="../../images/yewu-xx.png"></image><text>销售业务</text>
							</label>
							<view>
								<label>
									<image src="../../images/kaishisj-xx.png"></image><text>2022.07.01 00:00 开始</text>
								</label>
								<label>
									<image src="../../images/jieshusj-xx.png"></image><text>2022.07.30 24:00 截止</text>
								</label>
							</view>
						</view>

						<view class="minute">
							<!-- <view class="h7">详细：</view> -->
							<view class="script"><text>联系人：</text><text>橙子</text></view>
							<view class="script"><text>联系电话：</text><text>13098765678</text></view>
							<view class="script"><text>发布人：</text><text>橙子</text></view>
							<view class="script"><text>发布时间：</text><text>2022.07.30 24:00</text></view>
						</view>
					</view>
					<view class="confirm">
						<button class="btn">确 认</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import _msg from '@/api/business/message.js';
	import util from '@/utils/util.js';
	import common from '@/api/common.js';
	var that;

	export default {
		data() {
			return {
				statements: false,
				Criterias: false,
				Memberinfo: false,
				Shoppingbags: false,
				Chargeback: false,
				coupon_list: [],
				Newaddr: false,
				KHID: getApp().globalData.store.KHID,
				putong: true,
				MsgData: [],
				XT_MsgData: [],
				Old_XT_MsgData: [],
				JJ_Arr: [], //紧急类型数据
				Dep_Arr: [] //部门数据
			}
		},
		created: function(res) {
			that = this;

			console.log("进入消息数据页面");
			_msg._ShowMsg(that.KHID, "SYSTEM", res => {
				console.log("后台查到的消息数据：", res);
				that.XT_MsgData = res[0].Details.map(r => {
					return {
						key: r.key,
						val: JSON.parse(r.val),
						newVal: JSON.parse(r.val)[0]
					}
				});
				that.Old_XT_MsgData = that.XT_MsgData;
				let Arr = [that.XT_MsgData[0].newVal.IMTYPE];
				let Arr1 = [that.XT_MsgData[0].newVal.YYBM];
				that.XT_MsgData.map(r => {
					let obj1 = Arr.find(rr => {
						return rr == r.newVal.IMTYPE
					});
					if (!obj1) {
						Arr = Arr.concat(r.newVal.IMTYPE);
					}
					let obj2 = Arr1.find(rr => {
						return rr == r.newVal.YYBM
					});
					if (!obj2) {
						Arr1 = Arr1.concat(r.newVal.YYBM);
					}
				})
				Arr.map(r => {
					that.JJ_Arr.push({
						type: r,
						count: that.XT_MsgData.filter(rr => {
							return rr.newVal.IMTYPE == r;
						}).length,
					})
				});
				Arr1.map(r => {
					that.Dep_Arr.push({
						name: r,
						count: that.XT_MsgData.filter(rr => {
							return rr.newVal.YYBM == r;
						}).length,
					})
				});
				console.log("分组数据：", that.JJ_Arr);
				console.log("分组数据：", that.Dep_Arr);
				console.log("消息数据XT_MsgData:", that.XT_MsgData);
			});
		},
		methods: {
			SeeMore: function(res) {
				util.simpleMsg("暂未开放", "none");
			},
			Statements: function(e) {
				this.statements = !this.statements

			},
			Search: function(e) {
				this.Criterias = !this.Criterias;
			},
			SearchMsg: function(e) {
				console.log("点击数据：", e);
				let arr = [];
				if (e) {
					if (e.type) {
						arr = that.Old_XT_MsgData.filter(r => {
							return r.newVal.IMTYPE == e.type;
						})
					}
					if (e.name) {
						arr = that.Old_XT_MsgData.filter(r => {
							return r.newVal.YYBM == e.name;
						})
					}
				}
				that.XT_MsgData = arr;
			},
			Memberlogin: function(e) {
				this.Memberinfo = true,
					this.Shoppingbags = false
			},
			Bagslist: function(e) {
				this.Shoppingbags = true,
					this.Memberinfo = false
			},
			Moreand: function(e) {
				this.Chargeback = !this.Chargeback
			},
			newlys: function(e) {
				this.Newaddr = true
			},
		}
	}
</script>

<style>
</style>
