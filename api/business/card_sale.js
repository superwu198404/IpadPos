import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import util from '../../utils/util';
import Vue from 'vue';

/**
 * 获取卡充值规则明细
 */
var GetKCZGZMX = function(e, func) {
	let apistr = "MobilePos_API.Models.CardSaleCLASS.GetKCZGZMX";
	let reqdata = Req.resObj(true, "查询中...", {
		khid: e
	}, apistr);
	Req.asyncFuncOne(reqdata, func, func);
}
//跳转支付=>支付后执行的事件
var PayParamAssemble = function(that, func) {
	uni.$emit('stop-message');
	uni.$emit('stop-timed-communication');
	console.log("[PayParamAssemble]支付参数组装...")
	util.setStorage('open-loading', false);
	let allow_type = util.getStorage("POSCS").find(i => i.POSCS == 'SKSQFKID')?.POSCSNR.split(',');
	let ban_type = util.getStorage("PayWayList").filter(i => !allow_type.includes(i.fkid)).map(i => i
		.fkid);
	console.warn("[BeforeFk]卡券销售结算获取的允许、和禁止 的付款类型:", {
		allow_type,
		ban_type
	});
	let inputParm = {
		sale1_obj: that.SALE001, //001 主单 数据对象
		sale2_arr: that.SALE002, //002 商品 数据对象集合
		actType: "Payment", //动作类型(退款、支付)
		ban_pay: ban_type, //被禁用的支付类型
		PayList: that.payed || [], //已支付信息
	}
	console.log("[PayParamAssemble]支付前封装的数据:", inputParm);
	that.$store.commit('set-location', inputParm);
	// console.log("支付前的sale6：", sales.SALE006);
	uni.navigateTo({
		url: "../Payment/Payment",
		events: {
			FinishOrder: func //that.PayedResult
		}
	})
}
//数据筛选
var SortData = (type, data, pro) => {
	let zkData = [];
	if (pro.length > 0 && data.length > 0) {
		let arr = []; //商品价格组集合
		let spArr = [];
		pro.forEach(r => {
			if (arr.indexOf(r.SPJGZ) < 0) {
				arr.push(r.SPJGZ);
				let arr1 = pro.filter(r1 => {
					return r1.SPJGZ == r.SPJGZ;
				})
				let Net = 0;
				arr1.forEach(r2 => {
					Net += Number((r2.ONET).toFixed(2)); //r2.ONET //vip 卡oprice 存在充值金额
				})
				spArr.push({
					SPJGZ: r.SPJGZ,
					NET: Net
				})
			}
		})
		//spArr=[{SPJGZ:"01",NET:2250}]
		console.log("分组统计后的商品信息：", spArr);
		spArr.forEach(r3 => {
			if (type == "TP") {
				let arr4 = data.filter(r4 => {
					return r4.ZKSTR == r3.SPJGZ;
				});
				if (arr4.length > 0) {
					// arr4[0].ZKNET = ((1 - parseFloat(arr4[0].ZKQTY_JS)) * parseFloat(r3
					// 		.NET)).toFixed(1);
					arr4[0].ZKNET = common.newFixed((1 - parseFloat(arr4[0].ZKQTY_JS)) * parseFloat(r3
							.ONET),
						1);
					zkData.push(arr4[0]);
				}
			} else {
				let arr2 = data.filter(r4 => {
					return (r4.ZKSTR == r3.SPJGZ && r4.MZNET <= r3.NET && r4
						.ZKTYPE == 'ZD02');
				});
				let arr3 = data.filter(r4 => {
					return (r4.ZKSTR == r3.SPJGZ && r4.MZNET <= r3.NET && r4
						.ZKTYPE == 'ZD03');
				});
				if (arr2.length > 0) {
					arr2[0].ZKNET = common.newFixed((1 - parseFloat(arr2[0].ZKQTY_JS)) * parseFloat(r3.NET),
						1);
					zkData.push(arr2[0]);
				}
				if (arr2.length > 0 && arr3.length > 0) { //临时生效必须要标准折扣满足最低生效金额
					arr3[0].ZKNET = common.newFixed((1 - parseFloat(arr3[0].ZKQTY_JS)) * parseFloat(r3.NET),
						1);
					zkData.push(arr3[0]);
				}
			}
			console.log("当前商品价格组匹配到的折扣数据：", zkData);
		})
	}
	console.log("筛选后的折扣数据：", zkData);
	if (zkData.length == 0) {
		util.simpleMsg("暂无符合条件的折扣活动", "none");
	}
	return zkData;
}
//计算商品信息折扣信息
var CalProduct = function(zktype, curData, Product) {
	if (curData.length == 0) {
		Product.forEach(r => {
			r.NET = Number((r.ONET).toFixed(2)); //原NET 防止net 在重复折扣后 发生改变
			r.PRICE = Number((r.NET / r.QTY).toFixed(2));
			r.BZDISC = r.BILLDISC; //vip售卡充值、充值赠送金额存在BILLDISC  礼品卡激活没有赠送金额 
			r.LSDISC = 0;
			r.TPDISC = 0;
			r.DISCRATE = r.BILLDISC; //vip售卡充值、充值赠送金额存在BILLDISC 礼品卡激活没有赠送金额
		})
	} else {
		Product.forEach(r => {
			let discArr = [],
				discObj = {},
				DiscNet = 0;
			let arr = curData.filter(r1 => {
				return r1.ZKSTR == r.SPJGZ
			})
			let disc = 0;
			arr.forEach(r2 => {
				// console.log("商品原金额", r.ONET);
				let zknet = Number(r.ONET * (1 - parseFloat(r2.ZKQTY_JS)));
				if (r2.ZKTYPE == 'ZD02') { //标准折扣
					r.BZDISC = common.newFixed(zknet + r.BILLDISC, 1);
					disc += r.BZDISC;
					console.log("当前标准化折扣额", r.BZDISC);
				} else if (r2.ZKTYPE == 'ZD03') { //临时折扣
					r.LSDISC = common.newFixed(zknet, 1);
					disc += r.LSDISC;
					console.log("当前临时折扣值：", r.LSDISC);
				} else { //特批折扣
					r.TPDISC = common.newFixed(zknet, 1);
					disc += r.TPDISC;
					console.log("当前特批折扣值：", r.TPDISC);
				}
				console.log("[CalProduct]Sale-Item:", r2);
			})
			console.log("当前总折扣值：", disc);
			r.DISCRATE = Number(disc.toFixed(2));
			if (zktype != "TP") {
				//剔除DISCRATE 追加的赠送金额 ONET是不包含赠送金额的
				r.NET = Number((r.ONET + r.BILLDISC - r.DISCRATE).toFixed(2));
			} else {
				//特批折扣 DISCRATE 没累加bzdisc
				r.NET = Number((r.ONET - r.DISCRATE).toFixed(2));
			}
			r.PRICE = Number((r.NET / r.QTY).toFixed(2));
		});
	}
	console.log("添加折扣后的商品数据：", Product);
	return Product;
}

//匹配商品的有效规则 包含标准临时和特批
var MatchZKDatas = function(ZKObj, products) {
	console.log("计算商品折扣传入的折扣数据：", ZKObj);
	console.log("计算商品折扣传入的商品信息：", products);
	let CurData;
	if (ZKObj && ZKObj.ZKData && ZKObj.ZKType) {
		if (ZKObj.ZKType == "BZ") {
			CurData = SortData("", ZKObj.ZKData.ZKDatas, products);
			if (CurData.length > 0) {
				CurData = CurData.filter(r => {
					return r.ZKTYPE == 'ZD02'
				})
			}
		} else if (ZKObj.ZKType == "LS") {
			CurData = SortData("", ZKObj.ZKData.ZKDatas, products);
		} else {
			CurData = SortData("TP", ZKObj.ZKData.DKFZKDatas, products);
		}
		console.log("当前商品匹配到的有效折扣规则：", CurData);
		products = CalProduct(ZKObj.ZKType,CurData, products);
	}
	let obj = {
		sale2: products,
		zkrule: CurData
	}
	return obj;
}
export default {
	GetKCZGZMX,
	PayParamAssemble,
	MatchZKDatas
}
