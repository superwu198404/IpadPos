<template>
	<view>
		<view style="width: 100%;height:200vw;" v-if="showAll">
			<label style="display: block;width: 100%;height: 70%;"   v-model="clickText">{{clickText}} </label>
			<button @click="closeVshow">关闭:{{clickRowAndcol}}</button>
		</view>
		<view>
			<input style="height: 150px;width: 100%;"  v-model="sql"  placeholder="请输入SQL语句" />
			<label style="display:block;width: 100%;border: 1px solid;"  v-model="errTxt"  disabled="true" >{{errTxt}}</label>
			<view style="display: flex;" >
				<button class="bx"  @click="exec">查询ttt</button>
				<button class="bx"  @click="alltable">所有表</button>
				<button class="bx"  @click="adddata">加载100条</button>
			</view>
		</view>
		   <view style="width: 100%;overflow: auto;white-space: nowrap;">
	    	<view   class="data"  v-model="mydata"  v-for="(item, index) in mydata" >
		    
				<view  style="white-space: nowrap;border-color: black;border: 1rpx;" >
				<label class="tab"  v-if="index==0" style="width: 40px;">行号:排序</label>	
				<label :id="index+key" v-if="index==0" v-for="(key, X) in Object.keys(item)" data-type="B" :data-index="index"  :data-key="key" @click="ordrby"  class="tab">{{key}}</label>
				</view>
			
			<view  style="white-space: nowrap;"  >
				<label class="tab" style="width: 40px;">{{index}}</label>
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
	.bx{
		display: block;
		width: 33%;
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
				    alldata:[],
				    sql:"select * from dapzcs_nr where id ='BHLBBM'",
					sqltable:false,
				    showAll:false,
					OrderByType:{},
					errTxt:"",
					clickText:"",
					clickRowAndcol:"",
					mydata:[{"DATE_LR":"2015-01-13 14:47:54","DATE_SH":"2015-01-13 14:47:54","DA_STATUS":"1","ID_RY_LR":"SYSTEM","ID_RY_SH":"SYSTEM","PINYIN":"qgj","PLID":"61303","PLID_B":"03","PLID_F":"613","PLJBID":"3","PLJBID_F":"2","SNAME":"切割机","YN_JL":"N","YN_XS":"N"},
											    {"DATE_LR":"2015-01-13 14:47:54","DATE_SH":"2015-01-13 14:47:54","DA_STATUS":"1","ID_RY_LR":"SYSTEM","ID_RY_SH":"SYSTEM","PINYIN":"qgj","PLID":"61303","PLID_B":"03","PLID_F":"613","PLJBID":"3","PLJBID_F":"2","SNAME":"切割sssss机","YN_JL":"N","YN_XS":"N"}]
				}
			},
		methods: 
		{
			adddata()
			{
			   let addnum =100;
			   if(this.mydata.length >=this.alldata.length)
			   {
				   return ;
			   }
			   let start  =this.mydata.length;
			   let end    =start+addnum;
			   if( end>= this.alldata.length)
			   {
				   end =  this.alldata.length;
			   }
			   let newadd= this.alldata.slice(start,end); 
			   this.mydata= this.mydata.concat(newadd);
			   this.$set(this, 'mydata', this.mydata);
			   this.$set(this, 'errTxt',"已经加载了"+ this.mydata.length+"/"+this.alldata.length);
			},
			ordrby(e)
			{
				let key = e.currentTarget.dataset.key;
				let index = e.currentTarget.dataset.index;
				let orderby = this.OrderByType[key]||"B";
				if( orderby =="B")
				{
					this.OrderByType[key]="L";
					this.mydata.sort((a,b)=> {return a[key]>=b[key]})
					this.alldata.sort((a,b)=> {return a[key]>=b[key]})
				}
				else
				{
					this.OrderByType[key]="B";
					this.mydata.sort((a,b)=>{ return a[key]<=b[key]})
					this.alldata.sort((a,b)=>{ return a[key]<=b[key]})
				}
				this.$set(this, 'mydata', this.mydata);
			},
			showView:function(e)
			{
				 let key = e.target.dataset.key;
				 let index  = e.target.dataset.index;
				 if( key =="name"&&this.sqltable)
				 {
					 let sqlxx =  "select * from "+this.mydata[index][key];
					 this.qry(sqlxx);
				 }
				 else
				 {
				   this.$set(this, 'clickText', this.mydata[index][key]);
				   this.$set(this, 'clickRowAndcol', "第"+index+"行"+key+"列");
				   this.$set(this, 'showAll', true);
				 }
				
			},
			alltable:function()
			{
				 var  sqlx ="select * FROM Sqlite_master where type='table'"
				 this.sqltable =true;
                 this.qry(sqlx)
			},
			exec()
			{
				 this.sqltable =false;
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
					
					 this.alldata =   res.msg;
					 this.mydata=[];
					  //this.$set(this, 'mydata', res.msg);
					  this.adddata();
					  },
					 
					 (res)=>{
						 
						   this.$set(this, 'errTxt', res.msg.message);
						   this.OrderByType =[];
						       }); 
			}
		}
	}
</script>

<style>

</style>
