var name = "ipad";
var path = "_doc/ipad.db";
// 创建数据库 ｜ 打开数据库
var openSqllite = function() {
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			name: name, // 数据库名称
			path: path, // 数据库地址
			success(e) {
				console.log("ok");
				resolve(0)
			},
			fail(e) {
				console.log(e);
				reject(-1)
			}
		})
	})
}

// 关闭数据库
var closeSqllite = function() {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name: name,
			success(e) {
				console.log("[CloseSqllite]数据库连接关闭成功!");
				resolve()
			},
			fail(e) {
				console.log("[CloseSqllite]数据库连接关闭失败!");
				reject()
			}
		})
	})
}

// 检测连接状态
var existsSqllite = function() {
	return new Promise((resolve, reject) => {

		plus.sqlite.closeDatabase({
			name: name,
			success(e) {
				resolve()
			},
			fail(e) {
				reject()
			}
		})
	})
}

// 监听数据库是否开启 return type : Boolean
var isOpen = function() {
	return plus.sqlite.isOpenDatabase({
		name: name,
		path: path
	})
}

// 执行 sql 语句 for create table
/* 例子
	创建 table
	'create table if not exists userInfo
	(
		"index" INTEGER PRIMARY KEY AUTOINCREMENT,  自动增加
		"id" TEXT,  字符串
		"name" TEXT,
		"gender" TEXT,
		"avatar" TEXT
	)'
	
	添加数据
	'insert into userInfo (id,name,gender,avatar) values("'+id+'","'+name+'","'+gender+'","'+avatar+'")'
	'insert into userInfo (name, age) values ("demo1", "23")'

	删除数据
	'delete from '+name+' where '+sol+'="'+qq+'" and '+ww+'='+ee+''
	'delete from '+name+' where '+sol+'="'+qq+'"'
	
	修改数据
	UPDATE table_name SET field1=new-value1, field2=new-value2
	'update '+listName+' set '+name+'="'+cont+'" where '+use+'="'+sel+'"'
	'update '+listName+' set '+name+'="'+cont+'"'
*/
var executeSql = function(sqlCode) {
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: name,
			sql: sqlCode, // sql 语句
			success(e) {
				console.log("结果");
				console.log(e);
				resolve(e)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

// 查询数据
/* 例子
	'select * from '+name+' where '+aa+'='+bb+' and '+cc+'='+dd+''
	'select * from '+name+' where '+aa+'='+bb+''
	'select * from '+name+''
	
	// 高级查询
	'select * from '+id+' order by list desc limit 15 offset '+num+'',
*/
var selectSql = function(sqlCode) {
	return new Promise((resolve, reject) => {

		plus.sqlite.selectSql({
			name: name, // 数据库名称
			sql: sqlCode,
			success(e) {
				resolve(e)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}
var mySqllite = function() {
	this.name = "ipad";
	this.path = "_doc/ipad.db";
	var that = this;
	///作为 opentran方法 pm_operation的参数选型
	var tranEnum = {
		commit: "commit",
		rollback: "rollback",
		begin: "begin"
	}
	/* 	var dbOperTionEnum = {
			isOpenDatabase: "isOpenDatabase",
			openDatabase: "openDatabase",
			selectSql: "selectSql",
			closeDatabase: "closeDatabase",
			executeSql: "executeSql",
			transaction: "transaction"
		}
	//["isOpenDatabase","openDatabase","closeDatabase","transaction","executeSql","selectSql","getCallbackIDByFunction"]

	var  inputParm =function(input_pm)
	{
	    
		//this.name ="";
		//this.path  ="";
		//this.operation="";
		//this.sql ="";
	   return  plus.sqlite[input_pm+"Options"];						 
	   // Vue.set(this,'fail',failf);
	} */
	/* var getOperationPromise =   function(pm_dboperation, otherParm) 
	{
		       
				return new Promise((resolve, reject) => {
				var input  = {};// new inputParm(pm_dboperation);
				   console.log(JSON.stringify(input) +":"+pm_dboperation+"Options");
				   
				input.name = that.name;
				
				//input.operation = pm_dboperation;
				input.success =(e) =>{
								       console.Console("okkkkk")
									   return resolve( {
									   	code: true,
									   	msg: e?JSON.stringify(e):"无返回"
									   });
									};						
				//Vue.set(this,'success',successf);
				input.fail =(e)=> {
							         console.Console("nooooooo")
									 return resolve( {
									 	code: false,
									 	msg: e?JSON.stringify(e):"无返回"
									 });
							  };	
			 
				if (otherParm) 
				{
					var arr = Object.keys( otherParm);
					for (var prm in arr) 
					{
					   
						input[arr[prm]] = otherParm[arr[prm]];
					    console.log('加载键'+arr[prm] + input[arr[prm]]);
					}
				}
				console.log('加载'+JSON.stringify(input).substring(0,200));
				console.log("方法展示"+input.success);	
				console.log("方法展示"+pm_dboperation+JSON.stringify(plus.sqlite[pm_dboperation]));	
				
			    plus.sqlite[pm_dboperation](input);
				
				
			  });
			
		

	} */
	var isopen = function(msg) {
		return plus.sqlite.isOpenDatabase({
			path: path,
			name: name
		});
	};
	this.exists = isopen;

	var open = function(msg) {
		msg = msg || "正在进行操作";
		//console.log("[DBO]检查数据库是否打开...");
		if (isopen()) {
			//console.log("[DBO]数据库已经打开!");
			return new Promise(
				(resolve, reject) => {
					return resolve({
						code: true,
						msg: "已经打开了"
					})
				})
		} else {
			//console.log("[DBO]数据库未打开!");
			return new Promise((resolve, reject) => {
				// 修改表数据
				plus.sqlite.openDatabase({
					name: that.name,
					path: that.path,
					success(e) {
						//console.log("[DBO][Success]数据库打开成功:", e);
						return resolve({
							code: true,
							msg: e
						});
					},
					fail(e) {
						console.log("[DBO][Error]数据库打开失败:", e);
						return resolve({
							code: false,
							msg: e
						});
					}

				})
			})
		};
	};
	this.open = open;

	var close = function() {
		return new Promise((resolve, reject) => {
			// 修改表数据
			plus.sqlite.closeDatabase({
				name: that.name,
				success(e) {
					console.log("[DBO]数据关闭成功:", e);
					return resolve({
						code: true,
						msg: e
					});
				},
				fail(e) {
					console.log("[DBO]数据关闭失败:", e);
					return resolve({
						code: false,
						msg: e
					});
				}
			})
		})
	};
	this.close = close;

	var exec = function(pm_sql) {
		return new Promise((resolve, reject) => {
			// 修改表数据
			plus.sqlite.executeSql({
				name: that.name,
				sql: pm_sql,
				success(e) {
					// console.log("executeSql:okkkk" + JSON.stringify(e));
					return resolve({
						code: true,
						msg: e
					});
				},
				fail(e) {
					// console.log("executeSql:errrrrrr" + pm_sql + JSON.stringify(e));
					return resolve({
						code: false,
						msg: e
					});
				}

			})
		})
	}
	var qry = function(pm_sql) {
		return new Promise((resolve, reject) => {
			// 修改表数据
			plus.sqlite.selectSql({
				name: that.name,
				sql: pm_sql,
				success(e) {
					return resolve({
						code: true,
						msg: e
					});
				},
				fail(e) {
					console.log("[Qry]查询异常:", {
						result: e,
						sql: pm_sql
					});
					return resolve({
						code: false,
						msg: e
					});
				}

			})
		})
	}

	var tran = function(pm_str) {
		return new Promise((resolve, reject) => {
			plus.sqlite.transaction({
				name: that.name,
				operation: pm_str,
				success(e) {
					console.log(pm_str + JSON.stringify(e));
					return resolve({
						code: true,
						msg: e
					});
				},
				fail(e) {
					console.log(pm_str + JSON.stringify(e));
					return resolve({
						code: false,
						msg: e
					});
				}
			});
		})

	}

	var callBackCloseLoading = function(res, infun, msg) {
		// uni.hideLoading();
		// return infun(res)
		if (msg) {
			uni.hideLoading();
		}
		let ret
		if (infun) {
			// console.log("[CallBackCloseLoading]方法调用!", infun)
			return infun(res)
		} else {
			ret = res;
		}

		return ret;
	};


	this.executeSqlArray = async function(sqlArray, pm_msg, success, fail, hideloading) {
		var retcode;

		retcode = await open(pm_msg);
		console.log("open:" + JSON.stringify(retcode));
		if (!retcode.code) return callBackCloseLoading(retcode, fail, pm_msg);
		retcode = await tran(tranEnum.begin);
		console.log("tran:" + JSON.stringify(retcode));
		if (!retcode.code) return callBackCloseLoading(retcode, fail, pm_msg);
		for (var i = 0; i < sqlArray.length; i++) {
			retcode = await exec(sqlArray[i]);
			if (!retcode.code) {
				// console.log(i + "exec:" + JSON.stringify(retcode)); 
				//if (retcode.msg.code === -1404) {
				//	continue;
				//	}
				//await tran(tranEnum.rollback);
				//return callBackCloseLoading(retcode, fail, pm_msg);
			}
		}
		retcode = await tran(tranEnum.commit);
		if (!retcode.code) {
			tran(tranEnum.rollback);
			return callBackCloseLoading(retcode, fail, pm_msg);
		}
		//await close();
		console.log("检测是否加载框关闭：", pm_msg)
		return callBackCloseLoading(retcode, success, pm_msg);

	};


	this.executeQry = async function(sql, pm_msg, success, fail) {
		var retcode;
		retcode = await open(pm_msg);
		//console.log("[ExecuteQry]打开数据库:", retcode);
		if (!retcode.code) return callBackCloseLoading(retcode, fail);
		// console.log("[ExecuteQry]执行SQL:", [sql]);
		retcode = await qry(sql);
		console.log("[ExecuteQry]执行完毕:", retcode.code);
		if (retcode.code) {
			return callBackCloseLoading(retcode, success, pm_msg);
		} else {
			return callBackCloseLoading(retcode, fail, pm_msg);
		}
	}

	this.executeDml = async function(sql, pm_msg, success, fail) {
		var retcode = {
			code: true,
			msg: "默认打开"
		};
		//console.log("数据库状态" + isopen())
		await open(pm_msg);
		retcode = await tran(tranEnum.begin);
		if (!retcode.code) return callBackCloseLoading(retcode, fail);
		//console.log("开始执行sql:", sql);
		retcode = await exec(sql);
		console.log("[ExecuteDml]返回值:", retcode);
		// console.log("[ExecuteDml]sql:", sql);
		//await close();
		if (retcode.code) {
			// retcode = await tran(tranEnum.commit);
			await tran(tranEnum.commit); //不采用事务提交的结果通知外部
			//await close();
			return callBackCloseLoading(retcode, success, pm_msg);
		} else {
			// retcode = await tran(tranEnum.rollback);
			await tran(tranEnum.rollback); //不采用事务回滚的结果通知外部
			//await close();
			return callBackCloseLoading(retcode, fail, pm_msg);
		}
	}
	this.executeDml1 = async function(sql, pm_msg, success, fail) {
		var retcode = {
			code: true,
			msg: "默认打开"
		};
		//console.log("数据库状态" + isopen())
		await open(pm_msg);
		await tran(tranEnum.begin);
		// if (!retcode.code) return callBackCloseLoading(retcode, fail);
		//console.log("开始执行sql:", sql);
		retcode = await exec(sql);
		console.log("[ExecuteDml]返回值:", retcode);
		// console.log("[ExecuteDml]sql:", sql);
		//await close();
		if (retcode.code) {
			// retcode = await tran(tranEnum.commit);
			await tran(tranEnum.commit); //不采用事务提交的结果通知外部
			//await close();
			return callBackCloseLoading(retcode, success, pm_msg);
		} else {
			// retcode = await tran(tranEnum.rollback);
			await tran(tranEnum.rollback); //不采用事务回滚的结果通知外部
			//await close();
			return callBackCloseLoading(retcode, fail, pm_msg);
		}
	}
}

var get = function() {
	return new mySqllite();
}


export default {
	get
}