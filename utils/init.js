import sales from '@/utils/sale/saleClass.js'
import util from '@/utils/util.js'
import dateformate from '@/utils/dateformat.js';
const init = {
	sale_common_init_params(){
		let current = new Date();
		return {
			BILL: util.getBill(),
			SALEDATE : current.toLocaleDateString().replaceAll('/','-'),
			SALETIME : current.toLocaleString().replaceAll('/','-'),
			KHID : this.client.KHID,
			POSID : this.client.POSID,
			RYID : this.client.RYID,
			KCDID : this.client.KCDID,
			GCID : this.client.GCID,
			DPID : this.client.DPID,
			YN_OK: 'X', //默认为 X
			YN_SC: 'N', //默认为 N
			YAER : dateformate.getDateByParam("Y"),
			MONTH: dateformate.getDateByParam("M"),
			WEEK: dateformate.getDateByParam("w"),
			TIME: dateformate.getDateByParam("h"),
			XSPTID: "PAD"
		}
	},
	get_sale001(attach = {}){
		let sale1 = new sales.sale001(), current = new Date();
		return Object.cover(Object.cover(sale1,this.sale_common_init_params()), attach);
	},
	get_sale002(sale1, attach = {}){//用sale1去初始化sale2部分信息，以保证信息一致
		let sale2 = new sales.sale002();
		if(sale1)
			return Object.cover(Object.cover(sale2, sale1),attach);
		else{
			return Object.cover(Object.cover(sale2, this.sale_common_init_params()),attach)
		}
	},
	get_sale003(sale1, attach = {}){
		let sale3 = new sales.sale003();
		if(sale1)
			return Object.cover(Object.cover(sale3, sale1),attach);
		else{
			return Object.cover(Object.cover(sale3, this.sale_common_init_params()),attach)
		}
	},
	get_sale006(sale1, attach = {}){//用sale1去初始化sale6部分信息，以保证信息一致
		let sale6 = new sales.sale006();
		if(sale1)
			return Object.cover(Object.cover(sale6, sale1),attach);
		else{
			return Object.cover(Object.cover(sale6, this.sale_common_init_params()),attach)
		}
	},
	get_sxsale001(sale1, attach = {}){
		let sxsale1 = new sales.sxsale001();
		if(sxsale1)
			return Object.cover(Object.cover(sxsale1, sale1),attach);
		else{
			return Object.cover(Object.cover(sxsale1, this.sale_common_init_params()),attach)
		}
	},
	init(){
		this.client = Object.assign({},util.getStorage("store"));
	},
	client: null,
}
export default init;