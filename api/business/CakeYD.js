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
					r.ZF == r1.BQID
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
								_ID: r4.ID_NR
							}
						})
					})
				}
			})
		}
	}, err => {})
	return data;
}

export default {
	GetDGBQ
}
