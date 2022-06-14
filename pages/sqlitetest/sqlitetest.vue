<template>
	<view>
		<view style="width: 100%;height:200vw;" v-if="showAll">
			<label style="display: block;width: 100%;height: 70%;"   v-model="clickText">{{clickText}} </label>
			<button @click="closeVshow">关闭:{{clickRowAndcol}}</button>
		</view>
		<view>
			<input style="height: 150px;width: 100%;"  v-model="sql"  placeholder="请输入SQL语句" />
			<label style="height: 100px;width: 100%;border: 1px solid;"  v-model="errTxt"  disabled="true" >{{errTxt}}</label>
			<button @click="exec">查询ttt</button>
			<button @click="alltable">所有表</button>
		</view>
		<view style="width: 100%;overflow: auto;white-space: nowrap;">
		<view   class="data"  v-model="mydata"  v-for="(item, index) in mydata" >
		    
				<view  style="white-space: nowrap;border-color: black;border: 1rpx;" >
					<label  v-if="index==0" v-for="(key, X) in Object.keys(item)"  class="tab">{{key}}</label>
				</view>
			
			<view  style="white-space: nowrap;"  >
				<label v-for="(key, X) in Object.keys(item)" @click="showView"  :data-index="index"  :data-key="key"  class="tab">{{item[key]}}</label>
			</view>
		</view>
		</view>
		
	</view>

</template>
<style>
	.newrow
	{
		white-space: wrap;
		word-break:break-all;
		white-space: pre-wrap; 
	}
	.tab 
	  {
	     display:inline-block;
	     border: 1rpx solid #ddd;
	     height: 60px;
	     line-height: 30px;
	     width: 120px;
	     white-space: wrap;
	     word-break:break-all;
	     white-space: pre-wrap; 
	     vertical-align: top;
	     padding:0 6px;
		 overflow: hidden;
	  }
</style>
<script>
	import sqlLite from '@/utils/db/db_excute.js';
	import Req from '@/utils/request.js';
	var  mysqlite =	sqlLite.get();
	export default {
		data() {
			return {
				    sql:"select * from plda",
				    showAll:false,
					errTxt:"",
					clickText:"",
					clickRowAndcol:"",
					mydata:[{"DATE_LR":"2015-01-13 14:47:54","DATE_SH":"2015-01-13 14:47:54","DA_STATUS":"1","ID_RY_LR":"SYSTEM","ID_RY_SH":"SYSTEM","PINYIN":"qgj","PLID":"61303","PLID_B":"03","PLID_F":"613","PLJBID":"3","PLJBID_F":"2","SNAME":"切割机","YN_JL":"N","YN_XS":"N"},
											    {"DATE_LR":"2015-01-13 14:47:54","DATE_SH":"2015-01-13 14:47:54","DA_STATUS":"1","ID_RY_LR":"SYSTEM","ID_RY_SH":"SYSTEM","PINYIN":"qgj","PLID":"61303","PLID_B":"03","PLID_F":"613","PLJBID":"3","PLJBID_F":"2","SNAME":"切割sssss机","YN_JL":"N","YN_XS":"N"}]
				}
			},
		methods: 
		{
			showView:function(e)
			{
				 let key = e.target.dataset.key;
				 let index  = e.target.dataset.index;
				 this.$set(this, 'clickText', this.mydata[index][key]);
				 this.$set(this, 'clickRowAndcol', "第"+index+"行"+key+"列");
				 this.$set(this, 'showAll', true);
				
			},
			alltable:function()
			{
				 var  sqlx ="select * FROM Sqlite_master where type='table'"
                 this.qry(sqlx)
			},
			exec()
			{
				this.qry(this.sql);
			},
			closeVshow()
			{
				 this.$set(this, 'showAll', false);
			},
			qry:function(inputSql)
			{
			    inputSql  = inputSql;
				console.log(JSON.stringify(inputSql));
				 mysqlite.executeQry(inputSql,"校验本地数据库信息",
				 (res)=>{ 
					 console.log(JSON.stringify(res).substring(0,1000));
					 //let retdata = req.getResData(res.msg); 
					  this.$set(this, 'mydata', res.msg);
					  },
					 
					 (res)=>{
						  console.log("err"+JSON.stringify(res).substring(0,1000));
						   this.$set(this, 'errTxt', res.msg.message);
						       }); 
			}
		}
	}
</script>

<style>

</style>
