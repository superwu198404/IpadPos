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
			GSID : this.client.GSID,
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
		attach.NO = this.generators.get_next_index('sale002');//自动进行编号
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
		attach.NO = this.generators.get_next_index('sale006');//自动进行编号
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
	index_generator(start_index = 0, end_index = Infinity){
		let reset_index = false,
			caller = "",
			register = {},
			generator = (function*(){
			while(true){
				if(reset_index){
					register[caller].prev = 0;
					register[caller].current = -1;
					reset_index = false;
				}
				register[caller].prev = register[caller].current < 0 ? 0 : register[caller].current;
				register[caller].current = ++register[caller].current;
				yield register[caller].current;
			}
		})();
		this.get_next_index = function(name){
			if(name){
				caller = name;
				if(!(caller in register)){
					register[caller] = {
						prev: 0,
						current: -1,
					}
				}
				return generator.next()?.value;
			}
			else{
				return 0;
			}
		}
		this.get_index = function(name){
			return register[name]?.current || 0;
		}
		this.get_register_caller = function(){
			return Object.keys(register);
		}
		this.reset_index = function(name){
			if(name){
				caller = name;
				reset_index = true;
				return true;
			}
			else 
				return false;
		}
		this.reset_all = function(){
			register = {};
		}
	},
	reset_generators(){
		this.generators.reset_all();
	},
	init(){
		this.client = Object.assign({},util.getStorage("store"));
		this.generators = new this.index_generator();
	},
	client: null,
	generators: null
}
export default init;