// 创建数据库 ｜ 打开数据库
function openSqllite() {
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			name: 'life', 					// 数据库名称
			path: '_doc/life.db',   // 数据库地址
			success(e) { resolve(e) },
			fail(e) { reject(e) }
		})
	})
}

// 关闭数据库
function closeSqllite() {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name: 'life',
			success(e) { resolve() },
			fail(e) { reject() }
		})
	})
}

// 监听数据库是否开启 return type : Boolean
function isOpen(name, path) {
	return plus.sqlite.isOpenDatabase({ name: 'life', path: '_doc/life.db' })
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
			sql: sqlCode,   // sql 语句
			success(e) { resolve(e) },
			fail(e) { reject(e) }
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
			name: 'life',    // 数据库名称
			sql: sqlCode,
			success(e) { resolve(e) },
			fail(e) { reject(e) }
		})
	})
}

export default {
	openSqllite,
	closeSqllite,
	isOpen,
	executeSql,
	selectSql,
}
