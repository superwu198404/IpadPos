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
	var name = "ipad";
	var path = "_doc/ipad.db";
	///作为 opentran方法 pm_operation的参数选型
	var tranEnum = {
		commit: "commit",
		rollback: "rollback",
		begin: "begin"
	}
	var dbOperTionEnum = {
		isOpenDatabase: "isOpenDatabase",
		openDatabase: "openDatabase",
		selectSql: "selectSql",
		closeDatabase: "closeDatabase",
		executeSql: "executeSql",
		transaction: "transaction"
	}

	var getOperationPromise = function(pm_dboperation, otherParm) {
		return new Promise(
			(resolve, reject) => {
				let inputParm = {};
				inputParm.name = name;
				inputParm.operation = pm_dboperation;
				inputParm.success = (e) => {

					return resolve({
						code: true,
						msg: e
					})
				}
				inputParm.fail = (e) => {
					return resolve({
						code: false,
						msg: e
					})
				}

				for (var prm in otherParm) {
					inputParm[prm] = otherParm[prm];
				}
				plus.sqlite[pm_dboperation](inputParm);

			}
		)

	}
	var isopen = function(msg) {
		return plus.sqlite.isOpenDatabase({
			path: path,
			name: name
		});
	};
	var open = function(msg) {
		var msg = msg | "正在进行操作";
		uni.showLoading({
			title: msg,
			mask: true
		})
		if (isopen()) {
			return {
				code: true,
				msg: "已经是打开的" //防止重复打开报错
			};
		}
		return getOperationPromise(dbOperTionEnum.openDatabase, {
			path: path
		});
	};

	var close = function() {
		return getOperationPromise(dbOperTionEnum.closeDatabase, {});
	};

	var exec = function(pm_sql) {
		return getOperationPromise(dbOperTionEnum.executeSql, {
			sql: pm_sql
		});
	}
	var qry = function(pm_sql) {
		return getOperationPromise(dbOperTionEnum.selectSql, {
			sql: pm_sql
		});
	}

	var tran = function(pm_str) {
		return getOperationPromise(dbOperTionEnum.transaction, {
			operation: pm_str
		});
	}

	var callBackCloseLoading = (res, infun) => {
		uni.hideLoading();
		return infun(res)
	};


	this.executeSqlArray = async function(sqlArray, pm_msg, success, fail) {
		var retcode;
		retcode = await open(pm_msg);
		if (!retcode.code) return callBackCloseLoading(retcode, fail);
		retcode = await tran(tranEnum.begin);
		if (!retcode.code) return callBackCloseLoading(retcode, fail);
		for (var i = 0; i < sqlArray.length; i++) {
			retcode = await exec(sqlArray[i]);
			if (!retcode.code) {
				await tran(tranEnum.rollback);
				return callBackCloseLoading(retcode, fail);
			}
		}
		retcode = await tran(tranEnum.commit);
		if (!retcode.code) {
			await tran(tranEnum.rollback);
			return callBackCloseLoading(retcode, fail);
		}
		await close();
		return callBackCloseLoading(retcode, success);
	};


	this.executeQry = async function(sql, pm_msg, success, fail) {
		var retcode;
		retcode = await open(pm_msg);
		if (!retcode.code) return callBackCloseLoading(retcode, fail);
		retcode = await qry(sql);
		await close();
		if (retcode.code) {
			return callBackCloseLoading(retcode, success);
		} else {
			return callBackCloseLoading(retcode, fail);
		}

	}

	this.executeDml = async function(sql, pm_msg, success, fail) {
		var retcode = {
			code: true,
			msg: "默认打开"
		};
		//console.log("数据库状态" + isopen())
		if (!isopen()) { //关闭就打开
			retcode = await open(pm_msg);
		}
		if (!retcode.code) return callBackCloseLoading(retcode, fail);
		retcode = await exec(sql);
		await close();
		if (retcode.code) {
			return callBackCloseLoading(retcode, success);
		} else {
			return callBackCloseLoading(retcode, fail);
		}

	}

}

var SqliteHelper = {
	get: function() {
		return new mySqllite();
	}
}


export default {
	SqliteHelper,
	openSqllite,
	closeSqllite,
	isOpen,
	selectSql,
	executeSql
}
