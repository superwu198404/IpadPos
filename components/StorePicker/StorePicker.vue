<template>
	<view v-if="mode == 'selector'" tabIndex='-1' style="outline: 0px;" @blur="DefaultCheck">
		<input type="text" :key="input_key" v-model="store_name" @focus="selector = true"/>
		<view class="thmd" v-if="selector">
			<text v-for="(item,index) in store_search" @click="Select(item)">{{item.NAME}}</text>
		</view>
	</view>
	<picker v-else range-key="NAME" mode="selector" :range="stores" @change="Change" @cancel="Cancel">
		<view style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ current_data.NAME }}</view>
	</picker>
</template>

<script>
	import {
		getRoom
	} from '@/api/business/onlineorders.js';
	import util from '@/utils/util.js';
	export default {
		name:"StorePicker",
		props:{
			init:String,
			mode:String
		},
		data(){
			return {
				stores:[],
				store_name: "",
				selector: false,
				current_data: null,
				current_index:0,
				input_key: Number(new Date())
			}
		},
		computed:{
			store_search:function(){
				return this.store_name ? this.stores.filter(store_info => store_info.NAME.includes(this.store_name)) : this.stores;
			}
		},
		watch:{
			'current_data':function(n,o){
				console.log("[Watch-CurentData]当前门店:",n);
				this.store_name = n?.NAME ?? this.store_name;
				console.log("[Watch-CurentData]当前门店名称:",this.store_name);
				this.input_key = Number(new Date());
			}
		},
		methods:{
			DefaultCheck:function(){
				this.selector = false;
				if(!this.current_data){//如果为空，判断为未选择，则默认选择一个
					this.current_data = this.stores.length ? this.stores[0] : {};
				}
				this.Select(this.current_data);
			},
			Change:function(e){
				let index = e.detail.value;
				if(index < this.stores.length){
					this.$emit("change",this.stores[index]);
					this.current_data = this.stores[index];
				}
					
			},
			Select:function(store_info){
				console.log("[Select]门店信息:",store_info);
				this.current_data = store_info;
				this.selector = false;
				this.$emit("change",this.current_data);
			},
			Cancel:function(){
				this.$emit("cancel");
			}
		},
		mounted() {
			let gsid_arr = util.getStorage("sysParam")?.KJGSFW?.split(',')
			console.log("[Mounted-StorePicker]模式:",this.mode);
			getRoom({
				gsid:[this.GSID].concat(gsid_arr ?? []),
				storeid:this.KHID,
				dqid:this.DQID
			},util.callBind(this,function(res){
				console.log("[裱花间选择器-StorePicker]初始化数据:",res);
				console.log("[裱花间选择器-StorePicker]默认khid:",this.init);
				if(res.code){
					this.stores = JSON.parse(res.data);
					if(this.init){
						this.current_data = this.stores.find(item => item.KHID === this.init) ?? {};
					}
				}
				else
					util.simpleMsg(res.msg,true);
			}))
		}
	}
</script>

<style>
	.thmd {
		background-color: #fff;
		border-radius: 6rpx;
		width: 100%;
		text-align: left;
		z-index: 999999999;
		box-shadow: 0px 10rpx 20rpx 1px rgba(66, 177, 75, 0.06);
		padding: 1%;
		max-height: 800rpx;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}
	
	.thmd text {
		width: 100% !important;
		display: block;
		text-align: left;
		line-height: 50rpx;
		white-space: nowrap;
		font-weight: 400 !important;
	}
</style>