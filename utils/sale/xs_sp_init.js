/*
初始化销售商品的录入信息
初始化后的结果为   
{[FSTR:A,plid:'xx',plname:'xxx',
     splist:[{spid:'001',spname:'吐司1',pinyin:"xxx",
	          unit:"个",price:"11",specslist:[],ynshowlist:0,
			       ynAddPro:0,addlist:[]},
             {spid:'002',spname:'蛋糕',pinyin:"xxx",
			     unit:"个",specslist:[]},ynshowlist:1,bqlist:[]
				   ynAddPro:0,addlist:[]}
			 {spid:'003',spname:'水吧',pinyin:"xxx",
			     unit:"个",specslist:[]},ynshowlist:0,
				  ynAddPro:1,addlist:[]} 
				 ]
}
ynshowlist：指示是否显示规格列表一般为蛋糕的时候会生效
specslist：为规格列表：例如6号，8号  等
ynAddPro：为水吧产品的附加属性，这里是指水吧产品附加的属性
addlist：为属性列表例如 ：全糖、半糖，去冰，加椰果等等
*/
import sqlLite from '@/utils/db/db_excute.js';
var $sqlLite = sqlLite.get();
var loadSaleSP = {
	codeArr: [{
			key: "元",
			val: new RegExp(/^\d+元/),
			func: function(pinyin, name) {
				let index = name.indexOf("元");
				let prefix1 = pinyin.substring(0, index + 1);
				let suffix1 = pinyin.substring(index + 1);
				return suffix1;
			}
		}, {
			key: "号",
			val: new RegExp(/^\d+号/),
			func: function(pinyin, name) {
				let index = name.indexOf("号");
				let prefix1 = pinyin.substring(0, index + 1);
				let suffix1 = pinyin.substring(index + 1);
				return suffix1;
			}
		}, {
			key: "磅",
			val: new RegExp(/^\d+磅/),
			func: function(pinyin, name) {
				let index = name.indexOf("磅");
				let prefix1 = pinyin.substring(0, index + 1);
				let suffix1 = pinyin.substring(index + 1);
				return suffix1;
			}
		}, {
			key: "度",
			val: new RegExp(/^\d+度/),
			func: function(pinyin, name) {
				let index = name.indexOf("度");
				let prefix1 = pinyin.substring(0, index + 1);
				let suffix1 = pinyin.substring(index + 1);
				return suffix1;
			}
		},
		{
			key: "盎司",
			val: new RegExp(/^\d+盎司/),
			func: function(pinyin, name) {
				let index = name.indexOf("盎司");
				let prefix1 = pinyin.substring(0, index + 2);
				let suffix1 = pinyin.substring(index + 2);
				return suffix1;
			}
		}, {
			key: "()",
			val: new RegExp(/\(.+\)/g),
			func: function(pinyin, reg) {
				let str = pinyin.match(reg);
				return pinyin.split(str[0])[1];
			}
		}, {
			key: "（）",
			val: new RegExp(/\（.+\）/g),
			func: function(pinyin, reg) {
				let str = pinyin.match(reg);
				return pinyin.split(str[0])[1];
			}
		}, {
			key: "[]",
			val: new RegExp(/\[.+\]/g),
			func: function(pinyin, reg) {
				let str = pinyin.match(reg);
				return pinyin.split(str[0])[1];
			}
		}, {
			key: "【】",
			val: new RegExp(/\【.+\】/g),
			func: function(pinyin, reg) {
				let str = pinyin.match(reg);
				return pinyin.split(str[0])[1];
			}
		}
	],
	checkCode: function(pinyin, name) {
		console.log("待校验pinyin：", pinyin + name);
		let str = pinyin;
		for (var i = 0; i < this.codeArr.length; i++) {
			let codeObj = this.codeArr[i];
			if (name) { //非括号类
				if (codeObj.val.test(name)) { //数字开头且带有单位
					// console.log("-校验通过：", codeObj.key);
					str = codeObj.func(pinyin, name);
					// console.log("-校验后的pinyin：", str);
					break;
				}
			} else {
				if (codeObj.val.test(pinyin)) {
					// console.log("校验通过：", codeObj.key);
					str = codeObj.func(pinyin, codeObj.val);
					// console.log("校验后的pinyin：", str);
					break;
				}
			}
		}
		return str;
	},
	//名称格式化
	nameFormat: function(r) {
		let index = -1,
			old = r.PINYIN;
		try {
			//匹配括号中内容()（）[] 【】
			if (/^(\W+)/.test(r.PINYIN)) {
				// console.warn("开始进入括号校验")
				r.PINYIN = this.checkCode(r.PINYIN);
				// console.warn("校验完毕后的拼音：", r.PINYIN);
			} else { //数字开头
				if (/^\d/.test(r.PINYIN)) {
					// console.warn("开始进入数字开头校验")
					r.PINYIN = this.checkCode(r.PINYIN, r.SNAME);
					// console.warn("校验完毕后的拼音：", r.PINYIN);
				}
			}
		} catch (e) {
			//TODO handle the exception
			r.PINYIN = old;
			console.log("拼音格式化异常：", e.message);
		}
	},
	//名称格式化 废弃
	nameFormat2: function(r) {
		let index = -1,
			old = r.PINYIN;
		try {
			//匹配括号中内容()（）[] 【】
			if (/^(\W+)/.test(r.PINYIN)) {
				let str = r.PINYIN.match(/\(.+\)/g);
				if (!str) {
					str = r.PINYIN.match(/\（.+\）/g);
				}
				if (!str) {
					str = r.PINYIN.match(/\[.+\]/g);
				}
				if (!str) {
					str = r.PINYIN.match(/\【.+\】/g);
				}
				if (str) {
					r.PINYIN = r.PINYIN.split(str[0])[1];
					// console.warn("拼音格式变化：", old + "->" + r.PINYIN);
				}
			} else { //数字开头
				//10元
				if (/^\d+元/.test(r.SNAME)) {
					index = r.SNAME.indexOf('元');
				}
				//4号
				if (/^\d+号/.test(r.SNAME)) {
					index = r.SNAME.indexOf('号');
				}
				//4磅
				if (/^\d+磅/.test(r.SNAME)) {
					index = r.SNAME.indexOf('磅');
				}
				//4盎
				if (/^\d+盎/.test(r.SNAME)) {
					index = r.SNAME.indexOf('盎司');
					index += 1;
				}
				if (index >= 0) {
					let prefix1 = r.PINYIN.substring(0, index + 1);
					let suffix1 = r.PINYIN.substring(index + 1);
					r.PINYIN = suffix1; // + prefix1;
					console.warn("拼音格式变化：", old + "->" + r.PINYIN);
				}
			}
		} catch (e) {
			//TODO handle the exception
			r.PINYIN = old;
			console.log("拼音格式化异常：", e.message);
		}
	},
	//旧版本格式方法 暂废弃
	nameFormat1: function(r) {
		// if (r.PINYIN != '(13.9x)xknrs')
		// 	return;
		// console.log("进入格式化商品名称：", r.PINYIN);
		let index = -1;
		//（）
		if (r.PINYIN.indexOf('（') == 0) {
			index = r.PINYIN.indexOf('）');
		}
		//()
		if (r.PINYIN.indexOf('(') == 0) {
			index = r.PINYIN.indexOf(')');
		}
		//【】
		if (r.PINYIN.indexOf('【') == 0) {
			index = r.PINYIN.indexOf('】');
		}
		//[]
		if (r.PINYIN.indexOf('[') == 0) {
			index = r.PINYIN.indexOf(']');
		}
		//数字开头 10元
		if (/^\d/.test(r.SNAME) && r.SNAME.indexOf('元') > 0) {
			index = r.PINYIN.indexOf('元');
		}
		//4号
		if (/^\d/.test(r.SNAME) && r.SNAME.indexOf('号') > 0) {
			index = r.SNAME.indexOf('号');
		}
		//4磅
		if (/^\d/.test(r.SNAME) && r.SNAME.indexOf('磅') > 0) {
			index = r.SNAME.indexOf('磅');
		}
		// console.log("查看索引：", index);
		if (index >= 0) {
			let prefix = r.SNAME.substring(0, index + 1);
			let suffix = r.SNAME.substring(index + 1);
			let prefix1 = r.PINYIN.substring(0, index + 1);
			let suffix1 = r.PINYIN.substring(index + 1);
			r.SNAME = suffix + prefix;
			r.PINYIN = suffix1 + prefix1;
		}
		// console.log("格式化后的商品名称：", r.SNAME);
	},
	getFstrAndSort: function(pm_arr) //将当前数组的拼音的第一位截取出来
	{
		//{"FSTR":"z","PINYIN":"zjpbtzw（x）8-qj","SNAME":"竹节排包提子味（型）8-仟吉","SPID":"000000001010100002","addlist":"","plid":"308","plname":"三明治用半成品","specslist":"","ynAddPro":0,"ynshowlist":0}
		let newarrList;
		console.log("开始获取拼音首字母");
		newarrList = pm_arr.map(item => {
			try {
				//名称格式化 测试再放开
				this.nameFormat(item);
				// console.log("外部名称 ", item);
				let py = item.PINYIN || '';
				//console.log("数组的结构"+JSON.stringify(item))
				let flag = "";
				for (let x = 0; x < py.length; x++) {
					if (py.charCodeAt(x) >= 97 && py.charCodeAt(x) <= 122) {
						flag = py.substr(x, 1);
						break;
					}
				}
				if (flag.length == 0) {
					flag = "Z";
				}
				item["FSTR"] = flag.toUpperCase();
				// console.log("外部名称首字母", flag);
				return item;
			} catch (err) {
				console.log("开始获取拼音首字母发生了错误", err, item);
			}
		});
		return newarrList;
	},
	/*
	  此方法传入的数组是 
	  z主商品sql  1
	  蛋糕合并    2
	  水吧sql	 3
	*/
	arrListGroupBy: function(pm_arr, cake_arr, drinkP_arr, cakeBq_arr, cakeimg_arr, pm_spidKeyList) {
		//{"FSTR":"z","PINYIN":"zjpbtzw（x）8-qj","SNAME":"竹节排包提子味（型）8-仟吉","SPID":"000000001010100002","addlist":"","plid":"308","plname":"三明治用半成品","specslist":"","ynAddPro":0,"ynshowlist":0}
		//console.log(pm_arr.length+"#"+cake_arr.length+"#"+drinkP_arr.length+"#")
		let pkey = "";
		let retArr = [];
		pm_arr = this.getFstrAndSort(pm_arr);
		console.log("##############################" + pm_arr.length + "##############################")
		retArr = pm_arr.sort((a, b) => {
			let x = 0;
			if ((a.FSTR < b.FSTR) || (a.FSTR == b.FSTR && a.plid < b.plid) || (a.FSTR == b.FSTR && a
					.plid == b.plid && a.SNAME < b.SNAME)) {
				x = -1
			} else {
				x = 1
			}
			return x
		});
		let plarr; //品类的子集
		let fsArr = []; //字符的总集集
		retArr.forEach(item => {
			//console.log("排序数组的结构"+JSON.stringify(item))
			let fslag = item.FSTR;
			let plid = item.plid;
			let plname = item.plname;
			let cpk = fslag + "" + plid;
			if (cpk != pkey) {
				plarr = [];
				fsArr.push({
					"FSTR": fslag,
					"plid": plid,
					"plname": item.plname,
					"plarr": plarr
				});
				pkey = cpk;
				//console.log(item.plname+"字母"+fslag)
			}
			if (item.ynshowlist == "1") {
				item.specslist = cake_arr.filter(cakeitem => {
					return cakeitem.DGXLID == item.SPID
				})

				try {
					if (cakeBq_arr) {
						item.bqlist = cakeBq_arr.filter(Bqitem => {
							return Bqitem.DGXLID == item.SPID
						})
						//console.log("标签"+JSON.stringify(item.bqlist).substring(0,100) );
					}
					if (cakeimg_arr) {
						//console.log("图片开始获取" );
						item.imglist = cakeimg_arr.filter(imgitem => {
							return imgitem.DGXLID == item.SPID
						})
						//console.log("图片"+JSON.stringify(item.imglist).substring(0,100) );
					}


					if (item.imglist.length > 0) {
						item.img = item.imglist[0].IMGURL;
						item.note = item.imglist[0].DESCRIBE || '暂时没有添加描述';
						//console.log("图片"+JSON.stringify(item.img) );

					}

				} catch (error) {

					console.log("出现了" + error);
				}
				if (item.specslist.length > 0) {
					item.SPID = item.specslist[0].SPID;
				}

			}
			if (item.ynAddPro == "1") {
				var retDarr = drinkP_arr.filter(drinkitem => {
					return drinkitem.MATNR == item.SPID
				})
				var retDrr_arr = [] //根据retd.CSTCODE  +   retd.ATTCODE  +  retd.OPTCODE;  汇总后的数组
				var gtoupDarr = []
				let dpk = "";
				retDarr.forEach(retd => {
					let newdk = retd.CSTCODE + retd.ATTCODE;
					if (newdk != dpk) {
						dpk = newdk;
						gtoupDarr = []
						retDrr_arr.push({
							CSTCODE: retd.CSTCODE == 1 ? "免费" : "收费",
							ATTCODE: retd.ATTNAME,
							Darr: gtoupDarr
						})
					}

					gtoupDarr.push({
						ATTCODE: retd.ATTCODE,
						ATTNAME: retd.ATTNAME,
						CSTCODE: retd.CSTCODE,
						OPTCODE: retd.OPTCODE,
						OPTNAME: retd.OPTNAME,
						OPTMAT: retd.OPTMAT,
						PRICE: 0,
						SELECTED: retd.RECMARK,
						SPID: retd.MATNR,
						QTY: 0,
						RECMARK: retd.RECMARK
					})
				})
				item.addlist = retDrr_arr;

				//console.log( JSON.stringify(item.addlist)  );
			}
			plarr.push(item);
			pm_spidKeyList[item.SPID] = item;
		})
		// console.log(JSON.stringify(fsArr.slice(0, 3)));
		return fsArr;
	},
	getDgxlImg: function(pm_dqid) {
		let sql =
			"select dgxlimage.DGXLID , url||'?v='|| strftime('%Y%m%d%H%M%S',date_xg) IMGURL,DESCRIBE  from dgxlimage where DQID='" +
			pm_dqid + "' order by DGXLID,yn_main desc";
		/* 	let sql= "select dgxlimage.DGXLID ,  url||'?v='|| strftime('%Y%m%d%H%M%S',date_xg) IMGURL  from   dgxlimage  where exists(select 1 from spda_dgxl,spkhda where spda_dgxl.spid= spkhda.spid " +
			   	" and spda_dgxl.dgxlid =dgxlimage.dgxlid " +
			   " and spkhda.YN_XS='Y' and   spkhda.khid ='" + pm_storeid + "') order by yn_main desc "; */
		return sql;
	},
	loadSp: async function(pm_storeid, callbackfun, pm_dqid, pm_khzid) {

		let d = new Date();
		var x = d.getFullYear() + "-" + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + "-" + (d
			.getDate() < 10 ? "0" : "") + d.getDate();
		var spPrice = {};
		console.log("##############################开始获取售价主数据" + x + "##############################")
		let pricesql = "SELECT PRICE / (CASE UQTY  WHEN 0 THEN 1 else UQTY end) PRICE," +
			" PRICETYPE,SPID,SDATE FROM PRICDA WHERE DATE(SDATE) <= DATE('" + x + "')  " +
			" AND DATE(EDATE) >= DATE('" + x + "') and (dqid is null or dqid = '" + pm_dqid + "') " +
			" and (khzid is null or khzid = '" + pm_khzid +
			"') and  QYSTAT  ='1' ORDER BY SPID,PRICETYPE DESC,SDATE ";
		await $sqlLite.executeQry(pricesql, "正在获取主数据", (res) => {
			let price = res.msg;
			price.forEach(pitem => {


				if (spPrice[pitem.SPID]) {
					//continue;
				} else {
					spPrice[pitem.SPID] = {
						"SPID": pitem.SPID,
						"PRICE": pitem.PRICE
					};
				}
				//console.log(spPrice[pitem.SPID]+"售价列表:"+ JSON.stringify(pitem))
			})
			console.log(JSON.stringify(spPrice).substr(0, 300));
		}, null);

		// var  cakeid=pm_cakeid.split(",").map((item)=> {return  "'"+item+"'"});
		var mainArr = []; //主数据的列表
		var cakeSpesc = []; //蛋糕规格的档案
		var dinkP = []; //水吧的列表
		var cakeBq = []; //存放的是蛋糕的标签
		var cakeimg = []; //存放的是蛋糕的图片
		var spidKeyList = {}; //用keyVal的方式存储商品信息 方便后续进行检索
		console.log("##############################开始获取主商品##############################")
		//z主商品sql 1
		let msplistSql =
			"SELECT substr(S1.pinyin,1,1) FSTR, S1.SPID,S1.SNAME,S1.UNIT,S1.PINYIN,SM.ZLID plid,s1.plid XPLID,PLDA.SNAME plname,S1.SPJGZ, \
	                 0 ynshowlist , '' specslist, \
					 0 ynAddPro,'' addlist  \
	                 FROM SPDA S1,SPKHDA SM,PLDA \
					WHERE S1.SPID =SM.SPID AND PLDA.PLID=SM.ZLID  \
			    AND SM.YN_XS='Y'  AND  S1.SPJGZ IN ('01','02')  \
			    AND ifnull(S1.yn_xpdg,'N') ='N'  AND S1.SPJGZ IS NOT NULL  AND SM.KHID ='" + pm_storeid + "' \
			    AND not exists(select 1 from spda_dgxl where  spda_dgxl.spid = SM.SPID) \
				AND not exists(select 1 from SPDOWNQT where  SPDOWNQT.spid = SM.SPID AND SPDOWNQT.KHID ='" + pm_storeid + "' ) \
				AND NOT EXISTS (SELECT 1 FROM KXPSX WHERE ifnull(KXPSX.DELMK,'N')='N' AND KXPSX.BZIRK='" + pm_dqid +
			"' AND SM.SPID = KXPSX.MATNR )";

		await $sqlLite.executeQry(msplistSql, "正在获取主数据", (res) => {
			// console.log(JSON.stringify(res).substring(0, 2000));
			mainArr = res.msg;
			console.log(JSON.stringify(mainArr.length));
		}, null);

		console.log("##############################开始获取蛋糕主商品##############################")
		//蛋糕合并 2
		let drinksAddSql =
			" select  substr(dgxlda.pinyin,1,1) FSTR,dgxlda.dgxlid SPID,dgxlda.SNAME,'个' UNIT,dgxlda.PINYIN,dgxlda.plid plid,'109' XPLID,'01' SPJGZ,PLDA.SNAME plname," +
			"  1 ynshowlist , '' specslist,0 ynAddPro,'' addlist " +
			" from  dgxlda,plda where dgxlda.plid=plda.plid " +
			" and  exists(select 1 from spda_dgxl,spkhda where spda_dgxl.spid= spkhda.spid " +
			" and spda_dgxl.dgxlid =dgxlda.dgxlid " +
			" and spkhda.YN_XS='Y' and   spkhda.khid ='" + pm_storeid + "')" +
			"";
		await $sqlLite.executeQry(drinksAddSql, "正在获取蛋糕数据", (res) => {

			// console.log(JSON.stringify(res).substring(0,2000));
			mainArr = mainArr.concat(res.msg);
			console.log(JSON.stringify(mainArr.length));
		}, null);
		console.log("##############################开始获取蛋糕规格##############################")
		//蛋糕规格 
		let cakeSpescSql = " SELECT  spda_dgxl.DGXLID, spda_dgxl.SPID,spda.SPJGZ DGJGZ,spda.plid DGPLID, IFNULL(spda_dgxl.cccz,'无尺寸') SPECS  \
	               from spda_dgxl,spkhda,spda where  spda.spid=spda_dgxl.spid  and spda_dgxl.spid= spkhda.spid  \
				   AND not exists(select 1 from SPDOWNQT where  SPDOWNQT.spid = spkhda.SPID AND SPDOWNQT.KHID ='" + pm_storeid + "' ) \
				   and spkhda.YN_XS='Y' and spda.SPJGZ IS NOT NULL and   spkhda.khid ='" + pm_storeid + "'";

		await $sqlLite.executeQry(cakeSpescSql, "正在获取蛋糕数据", (res) => {
			// console.log(JSON.stringify(res).substring(0,2000));
			cakeSpesc = res.msg;
		}, null);
		//水吧sql	3		 

		console.log("##############################开始获取标签的列表##############################")
		/* 	let dgbqlsql_sql ="select  DGXLID,DGBQ ID from  dgxlda_bq  where  exists(select 1 from spda_dgxl,spkhda where spda_dgxl.spid= spkhda.spid " +
			" and spda_dgxl.dgxlid =dgxlda_bq.dgxlid " +
		    " and spkhda.YN_XS='Y' and   spkhda.khid ='" + pm_storeid + "') ";   */
		let dgbqlsql_sql =
			"  select  DGXLID,dgxlda_bq.DGBQ ID,dapzcs_nr.Sname NAME from  dgxlda_bq,dapzcs_nr where dapzcs_nr.id='DGBQ'  AND  dgxlda_bq.Dgbq = dapzcs_nr.Id_Nr ";
		await $sqlLite.executeQry(dgbqlsql_sql, "正在获取标签的列表", (res) => {
			// console.log(JSON.stringify(res).substring(0,2000));
			cakeBq = res.msg;
			console.log("查看一下标签的长度" + JSON.stringify(cakeBq).substring(0, 300));
		}, null);
		console.log("##############################开始获取图片列表##############################")
		let imagesql = this.getDgxlImg(pm_dqid);
		await $sqlLite.executeQry(imagesql, "正在获取图片列表", (res) => {
			// console.log(JSON.stringify(res).substring(0,2000));
			cakeimg = res.msg;
			console.log("查看一下图片列表" + JSON.stringify(cakeimg).substring(0, 300));
		}, null);

		console.log("##############################开始获取水吧商品##############################")
		let msDrinksql =
			"SELECT  substr(S1.PINYIN,1,1) FSTR, S1.SPID,S1.UNIT,S1.SNAME,S1.PINYIN,SM.ZLID plid,PLDA.SNAME plname,s1.plid XPLID,S1.SPJGZ,  " +
			" 0 ynshowlist , '' specslist, 1 ynAddPro,'' addlist " +
			"FROM SPDA S1,SPKHDA SM,PLDA " +
			"WHERE S1.SPID =SM.SPID AND PLDA.PLID=SM.ZLID " +
			"AND  ifnull(S1.yn_xpdg,'N') ='N' AND SM.YN_XS='Y'  AND  S1.SPJGZ IN ('01','02')  " +
			"AND S1.SPJGZ IS NOT NULL  AND SM.KHID ='" + pm_storeid + "' AND  " +
			"EXISTS (SELECT 1 FROM KXPSX WHERE ifnull(KXPSX.DELMK,'N')='N' AND KXPSX.BZIRK='" + pm_dqid +
			"' AND SM.SPID = KXPSX.MATNR   )  AND not exists(select 1 from SPDOWNQT where  SPDOWNQT.spid = SM.SPID AND SPDOWNQT.KHID ='" +
			pm_storeid + "' )";
		await $sqlLite.executeQry(msDrinksql, "开始获取水吧商品", (res) => {
			console.log(JSON.stringify(res).substring(0, 300));
			if (res.msg && res.msg.length > 0) {
				mainArr = mainArr.concat(res.msg);
			} else {
				console.log("没有水吧商品");
			}
		}, null);



		console.log("##############################开始获取水吧属性##############################")
		//水吧属性	 
		let drinkProSql = " SELECT  MATNR, CSTCODE,ATTCODE, ATTNAME, OPTCODE, OPTMAT, OPTNAME, RECMARK  " +
			" FROM  KXPSX   WHERE   ifnull(DELMK,'N')='N' " +
			"  and  not  EXISTS (SELECT 1 FROM KXPSX k2 where   BZIRK='" + pm_dqid +
			"' and  k2.OPTMAT = KXPSX. OPTMAT and  k2.MATNR = KXPSX. MATNR  and k2.CSTCODE = KXPSX.CSTCODE AND K2.CSTCODE='2' AND K2.OPTMAT ='000000002120900109') " +
			" AND    BZIRK='" + pm_dqid + "'" + " ORDER BY KXPSX.MATNR,CSTCODE,ATTCODE ";
		await $sqlLite.executeQry(drinkProSql, "正在获取水吧数据", (res) => {

			console.log(JSON.stringify(res).substring(0, 300));
			dinkP = res.msg;

		}, null);
		console.log("##############################开始进行数组整合##############################")
		// console.log("商品数据：", mainArr);
		// console.log("商品数据1：", cakeSpesc);
		// console.log("商品数据2：", dinkP);
		// console.log("商品数据3：", cakeBq);
		// console.log("商品数据4：", cakeimg);
		let arrAllsp = this.arrListGroupBy(mainArr, cakeSpesc, dinkP, cakeBq, cakeimg, spidKeyList);
		console.log("##############################调用完成进入回调函数##########################")
		// console.log("商品数据5：", arrAllsp);
		if (callbackfun) {
			// console.log("售价"+JSON.stringify(spPrice).substr(0,300));
			console.log("商品spidKeyList" + JSON.stringify(spidKeyList).substr(0, 300));
			callbackfun(arrAllsp, spPrice, spidKeyList);

		}
		return new Promise((resolve, reject) => {
			return resolve({
				code: true,
				msg: arrAllsp
			});

		})

	},


}


export default {
	loadSaleSP
}
