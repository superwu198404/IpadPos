/*
 OnlineOrders 业务逻辑处理（view => bll => api）
*/
import common from '@/api/common.js';
export const Validity = async function(item) {
	let createResult = (state, msg) => {
		return {
			state,
			msg,
			item
		}
	};
	if (!item.DATE_DH) //到货日期不能为空
		return createResult(false, "到货日期不能为空!");
	if (item.KHSNAME.indexOf('工厂') >= 0) {
		let dhDate = new Date(item.DATE_DH);
		let toDay = new Date();
		let toDayQH = new Date(toDay.toLocaleDateString() + " " + "22:00")
		item.STORESOURCE = "K";
		if (dhDate.toLocaleDateString() === toDay.toLocaleDateString())
			item.TODAY = true;
		else
			item.TODAY = false;
	} 
	// else {
	// 	let res = await common.Query(`SELECT KHID,SNAME,KHDA.adress,khda.Phone,sname ,CLIENT_TYPE,DQID,DPID,GCID,KHZID,ADRC,ADRPNAME ,KCDID,ZZTLX,JGID FROM KHDA WHERE KHID='${getApp().globalData.KHID}'`);
	// 	if(!res || res.length === 0)
	// 		return createResult(false, "获取门店名称错误!请检查 KHID 是否不存在!");
	// }
	if (item.THTYPE?.indexOf('宅配到家') >= 0)
		if (!item.CUSTMPHONE || !item.CUSTMADDRESS || !item.KHID_BH)
			return createResult(false, "如果为送货方式为 宅配到家，订单则必须有顾客信息和地址信息!");
	return createResult(true, "校验成功!");
}
