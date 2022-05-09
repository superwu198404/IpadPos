// 创建数据库 ｜ 打开数据库
function openSqllite() {
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			name: 'life', // 数据库名称
			path: '_doc/life.db', // 数据库地址
			success(e) {
				resolve(0)
			},
			fail(e) {
				reject(-1)
			}
		})
	})
}

// 关闭数据库
function closeSqllite() {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name: 'life',
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
function isOpen(name, path) {
	return plus.sqlite.isOpenDatabase({
		name: 'life',
		path: '_doc/life.db'
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
function executeSql(sqlCode) {
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name: 'life',
			sql: sqlCode, // sql 语句
			success(e) {
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
function selectSql(sqlCode) {
	return new Promise((resolve, reject) => {

		plus.sqlite.selectSql({
			name: 'life', // 数据库名称
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
				inputParm.name = this.name;
				inputParm.operation = pm_dboperation;
				inputParm.success = (e) => {
					return resolve({
						code: true,
						msg: e
					})
				}
				inputParm.fail = (e) => {
					return reject({
						code: false,
						msg: e
					})
				}
				for (prm in otherParm) {
					inputParm[prm] = otherParm[prm];
				}
				plus.sqlite[pm_dboperation](inputParm);
			}
		)

	}
	var open = function(msg) {

		var msg = msg | "正在进行操作";
		uni.showLoading({
			title: msg,
			mask: true
		})
		return getOperationPromise(dbOperTionEnum.openDatabase, {
			path: this.path
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
		if (retcode.msg.length > 0) {
			return callBackCloseLoading(retcode, success);
		} else {
			return callBackCloseLoading(retcode, fail);
		}

	}
	this.executeDml = async function(sql, pm_msg, success, fail) {
		var retcode;
		retcode = await open(pm_msg);
		if (!retcode.code) return callBackCloseLoading(retcode, fail);
		retcode = await exec(sql);
		await close();
		if (retcode.msg.length > 0) {
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
	SqliteHelper
}
