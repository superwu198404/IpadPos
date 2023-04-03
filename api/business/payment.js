import Req from '@/utils/request.js';
import db from '@/utils/db/db_excute.js';
import _common from '@/api/common.js';
import _date from '@/utils/dateformat.js';
import _util from '../../utils/util';

//获取付款方式的映射关系
var GetTKRelation = async function() {
	await _common.GetDAPZCS({
		id: "FKJHQTK"
	}, res => {
		if (res.code) {
			let arr = JSON.parse(res.data);
			console.log("获取券退款的映射结果：", arr);
			let newArr = arr.map(r1 => {
				return {
					old_fkid: r1.ID_NR,
					new_fkid: r1.ZF,
					new_name: r1.SNAME
				};
			})
			_util.setStorage("FKJHQTK", newArr);
		} else {
			_util.removeStorage("FKJHQTK");
			console.log("获取券退款的付款映射错误：", res.msg);
		}
	})
}

export default {
	GetTKRelation
}
