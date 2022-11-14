import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import dateformat from '@/utils/dateformat.js';

var app = getApp();

//获取蛋糕标签
var GetDGBQ = async function() {
	let data = [];
	let sql = "select * from DAPZCS_NR where id='DGBQ'";
	await db.get().executeQry(sql, "查询中...", res => {
		let dbbqArr = res.msg;
		if (dbbqArr.length > 0) {
			dbbqArr.map(r => {
				let obj = data.find(r1 => {
					return r1.BQID == r.ZF;
				})
				if (!obj) {
					data.push({
						BQID: r.ZF,
						BQNAME: r.NOTE,
						DATA: dbbqArr.filter(r3 => {
							return r3.ZF == r.ZF
						}).map(r4 => {
							return {
								_NAME: r4.SNAME,
								_ID: r4.ID_NR,
								_CHECK: false
							}
						})
					})
				}
			})
		}
	}, err => {})
	return data;
}

//获取蛋糕数据 测试用
var GetCakeList = async function() {
	let data = [];
	//http://58.19.103.220:8805/CakeImage/00004/-2.jpg
	let sql =
		"select *,'http://58.19.103.220:8805/CakeImage/wx8.jpg?v=" + dateformat.getYMD() +
		"' as URL2 from DGXLIMAGE where DQID='K01000' and YN_MAIN='Y'";
	await db.get().executeQry(sql, "查询中...", res => {
		data = res.msg;
	}, err => {})
	return data;
}
export default {
	GetDGBQ,
	GetCakeList
}
