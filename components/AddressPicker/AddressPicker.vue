<template>
	<view class="address-picker">
		<input type="text" class="address" placeholder="请输入地址..." v-model="query" @blur="GetAddress" />
		<view :style="viewStyle" :class="'address-picker-content ' + (state?'open':'close')">
			<view v-for="i in list" @click="SelectedAddress(i)">{{ i.address }}</view>
		</view>
	</view>
</template>

<script>
	import _reserve from '@/api/business/extract.js';
	import util from '@/utils/util.js';
	export default {
		name: "AddressPicker",
		props: {
			inputStyle: {
				type: Object,
				default: function() {
					return {
						height: "30px",
						backgroundColor: "#F5F5F5",
						lineHeight: "30px",
						border: "0.5 px solid #eee",
						width: "100%"
					}
				}
			},
			address: {
				type:String,
				default:""
			},
			rows:{
				type:Number,
				default:8
			}
		},
		data() {
			return {
				query: this.address,
				first_address: {},//首个地址信息
				map_info: {},
				list: [],
				state: false,
				viewStyle: {
					maxHeight: `${this.rows}em`,
					padding: "0px",
					transition: ".5s all"
				}
			}
		},
		watch: {
			"state": function(n, o) {
				if (n) {
					this.viewStyle.maxHeight = `${this.rows}em`;
					this.viewStyle.padding = "2px";
				} else {
					this.viewStyle.maxHeight = "0em";
					this.viewStyle.padding = "0px";
				}
			}
		},
		methods: {
			GetAddress: function() {
				_reserve.searchMapAddr({
					keywords: util.stripscript(this.query),//对特殊字符进行过滤
					Areaid: this.map_info.areaid,
					key: this.map_info.key
				}, util.callBind(this, function(res) {
					this.state = true;
					if (res.code) {
						this.list = JSON.parse(res.data);
						console.log("[GetAddress]高德地址查询:", this.list);
						if(this.list && this.list.length > 0){
							this.first_address = this.list[0];
							this.$emit("catch", this.first_address);
							uni.$emit("catch", this.first_address);
						}
					}
					else{
						this.$emit("Message",{ type:'tips',msg:'查询失败!' })
					}
					console.log("[GetAddress]缓存的首个地址信息:",this.first_address);
				}))
			},
			SelectedAddress: function(address_info) {
				this.state = false;
				this.query = address_info.address;
				this.$emit("change", address_info);
			}
		},
		async created() {
			this.map_info = await _reserve.GetAmap(this.KHID);
		}
	}
</script>

<style>
	.address-picker {
		box-sizing: border-box;
	}

	.address-picker > * {
		width: 100% !important;
	}

	.address-picker-input {
		position: relative;
		display: block;
		height: 30px;
		background-color: #F5F5F5;
		opacity: 1;
		line-height: 30px;
		border-radius: 2px;
		border: 0.5 px solid #eee;
		width: 100%;
		box-sizing: border-box;
		text-overflow: ellipsis;
		overflow-x: hidden;
		white-space: nowrap;
	}

	.address-picker-content {
		display: block;
		background-color: #FFFFFF;
		overflow-y: auto;
		border-radius: 5px;
		box-sizing: border-box;
		
	}
	
	.address{
		height: 60rpx;
		background-color: #F5F5F5;
		line-height: 60rpx;
		border-radius: 4rpx;
		border:1px solid #eee;
		width:100%;
		text-align: left;
		padding:0 10rpx;
	}

	.open {
		transition: .5s all !important;
	}

	.close {
		transition: .5s all !important;
		max-height: 0em !important;
	}
</style>
