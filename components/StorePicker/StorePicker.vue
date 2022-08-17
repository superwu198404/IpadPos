<template>
	<picker range-key="NAME" mode="selector" :range="stores" @change="Change" @cancel="Cancel">
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
			init:String
		},
		data(){
			return {
				stores:[],
				current_data:{},
				current_index:0
			}
		},
		methods:{
			Change:function(e){
				let index = e.detail.value;
				if(index < this.stores.length){
					this.$emit("change",this.stores[index]);
					this.current_data = this.stores[index];
				}
					
			},
			Cancel:function(){
				this.$emit("cancel");
			}
		},
		mounted() {
			getRoom({
				gsid:[this.GSID],
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
</style>