/*
 OnlineOrders 业务逻辑处理（view => bll => api）
*/

export const Validity = function(item) {
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
		if (dhDate.toLocaleDateString() === toDay.toLocaleDateString())
			item.TODAY = true;
		else
			item.TODAY = false;
	}
	if (item.THTYPE?.indexOf('宅配到家') >= 0)
		if (!item.CUSTMPHONE || !item.CUSTMADDRESS || !item.KHID_BH)
			return createResult(false, "如果为送货方式为 宅配到家，订单则必须有顾客信息和地址信息!");
	return createResult(true, "校验成功!");
}
