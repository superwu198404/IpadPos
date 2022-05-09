<template>
	<view>
		<button @click="hyquery()">会员查询Query_Member_Assets</button>
		<button @click="hyquery1()">会员查询queryCustomCard</button>
		<button @click="hyquery2()">会员查询hyQuery_new</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			hyquery:function(){ 
			let result=hy.Query_Member_Assets("15527956801","Mobile",function(res){
				
				
			});
			},
			hyquery1:function(){
			  let result=hy.queryCustomCard("N","18871878537","1",function(res){
				  
				  
			  })
			},
			hyquery2:function(){
			  let result=hy.hyQuery_new("1000286476","ACCOUNT",function(res){
				  
				  
			  })
			}
		}
	}
</script>

<style>

</style>
