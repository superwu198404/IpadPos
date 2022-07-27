<template>
	<view style="width: 100%;display: flex;justify-content: space-between;">
		<view class="getback">
			<view class="message">
				<view class="imgs">
					<image src="../../../images/tongzhi.png" mode="widthFix"></image>
				</view>
				<text>{{ message }}</text>
			</view>
		</view>
		<view class="stores">
			<view class="checkout">
				<label>
					<image src="../../../images/dx-mendian.png" mode="widthFix"></image>{{ store.name }}
				</label>
				<label>
					<image src="../../../images/dx-kuantai.png" mode="widthFix"></image>款台号：{{ store.id }}
				</label>
			</view>
			<view class="account">
				<text>{{ person.account }}</text>
				<view>
					<image src="../../../images/touxiang.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"navbar",
		props:{
			data:{
				type:Object,
				required:true,
				default(){
					return null
				}
			}
		},
		data(){
			return {
				message:"门店有一条新的外卖配送单消息来啦...",
				store:{
					name:"门店名称",
					id:"3"
				},
				person:{
					account:"员工账号"
				}
			}
		},
		methods:{
			
		},
		mounted() {
			this.message = this.data?.message || this.message;
			this.store.name = this.data?.storeName || this.store.name;
			this.store.id = this.data?.storeId || this.store.id;
			this.person.account = this.data?.personAccount || this.person.account;
		}
	}
</script>

<style>
</style>