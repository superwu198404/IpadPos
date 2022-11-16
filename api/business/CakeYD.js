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
		"' as URL2,'http://58.19.103.220:8805/CakeImage/'||url||'?v=" + dateformat.getYMD() +
		"' as URL3 from DGXLIMAGE where DQID='K01000' and YN_MAIN='Y' limit 50";
	await db.get().executeQry(sql, "查询中...", res => {
		data = res.msg;
	}, err => {})
	return data;
}
//预加载图片 异步操作
var loadImage = async function(url) {
	return new Promise((resolve, reject) => {
		try {
			//#ifdef APP-PLUS
			uni.getImageInfo({
				// urls: [url],
				src: url,
				success: function(image) {
					console.log("图片预加载完成...")
					resolve(true);
				},
				fail: function(err) {
					resolve(false);
				}
			});
			//#endif

			// #ifdef H5
			var img = new Image();
			console.log("img", img);
			img.src = url;
			img.onload = function() {
				// var imgHeight = img.height;
				// var imgWidth = img.width;
				console.log("图片预加载完成1...")
				resolve(img);
			};
			img.onerror = function() {
				reject(img);
			};
			//#endif
		} catch (e) {
			//TODO handle the exception
			console.log("图片预加载出错", e);
		}
	})
}
var PreLoadCakeImg = function(func) {
	let sql =
		"select *,'http://58.19.103.220:8805/CakeImage/wx8.jpg?v=" + dateformat.getYMD() +
		"' as URL2,'http://58.19.103.220:8805/CakeImage/'||url||'?v=" + dateformat.getYMD() +
		"' as URL3 from DGXLIMAGE where DQID='K01000' and YN_MAIN='Y' limit 150";
	let store = util.getStorage("store");
	let sysParam = util.getStorage("sysParam");
	sql = "select '" + sysParam.DGIMGURL +
		"' || url ||'?v='|| strftime('%Y%m%d%H%M%S',date_xg) IMGURL from DGXLIMAGE where DQID='" +
		store.DQID + "' and YN_MAIN='Y'";
	db.get().executeQry(sql, "查询中...", res => {
		if (func) func(res);
		// for (var i = 0; i < res.msg.length; i++) {
		// 	console.log("预先3", res.msg[i].URL3);
		// 	loadImage(res.msg[i].URL3);
		// }
	}, err => {})
}
export default {
	GetDGBQ,
	GetCakeList,
	PreLoadCakeImg
}
