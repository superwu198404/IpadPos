import common from '@/api/common.js'
import {
	BatchQuery
} from '@/api/business/da.js'
import {
	Refund
} from '@/bll/RefundBusiness/bll.js'
import {
	Payment
} from '@/bll/PaymentBusiness/bll.js'

/**
 * 本地预订单信息查询
 */
export const LocalDataQuery = function(bill) {
	return common.QueryBatch([{
			name: "sale1",
			sql: `select * from sale001 where bill='${bill}'`
		},
		{
			name: "sale2",
			sql: `select s2.*,ifnull(s.SNAME,'名称无') NAME from SALE002 s2 left join spda s on s2.spid=s.spid where bill='${bill}'`
		},
		{
			name: "sale3",
			sql: `select * from sale003 where bill='${bill}'`
		}
	]);
}

/**
 * 服务端预订单信息查询
 */
export const ServiceDataQuery = async function(bill) {
	let result = await BatchQuery([{
			name: "sale1",
			sql: `select * from ydsale001 where bill='${bill}'`
		},
		{
			name: "sale2",
			sql: `select s2.*,NVL(s.SNAME,'名称无') NAME from SYSSALE002 s2 left join SPDA s on s2.spid=s.spid where bill='${bill}'`
		},
		{
			name: "sale3",
			sql: `select * from syssale003 where bill='${bill}'`
		}
	]);
	if (result.code) {
		return JSON.parse(result?.result?.data ?? "");
	} else {
		return {
			sale1: {},
			sale2: [],
			sale3: []
		};
	}
}

/**
 * 预定提取、取消操作
 * @param {*} data 
 */
export const Accept = function(params = {
	bill: "",
	product: [],
	xs_type: "",//是 支付(1) 还是 退款(2)
	bill_type: ""//是 支付(Z101) 还是 退款(Z151)
}) {
	if (params.xs_type == 1) { //提取操作 => 支付
		console.log("[预定提取]结算确认!开始结算...")
		Payment(params.product).then(util.callBind(this, function(pay_data) { //处理退款所需的业务信息数据
			console.log("[预定提取]处理的数据:", pay_data);
			this.$store.commit('set-location', pay_data); //把数据传入下个页面
			uni.navigateTo({
				url: "../Payment/PaymentAll",
				events: {
					ExtractBack: util.callBind(this,function(data) {
						console.log("[ExtractBack]支付完成!", data);
						this.$emit("Close");
					})
				}
			})
		})).catch(util.callBind(this, function(err) {
			console.log("退单表数据查询异常:", err);
		}));
	} else { //取消操作 => 退款
		console.log("[预定取消]退单确认!开始退款...");
		Refund(LocalDataQuery(params.bill),ServiceDataQuery(params.bill)).then(util.callBind(this, function(refund_data) { //处理退款所需的业务信息数据
			this.$store.commit('set-location', refund_data); //把数据传入下个页面
			uni.navigateTo({
				url: "../Payment/PaymentAll",
				events: {
					ExtractBack: function(data) {
						console.log("[ExtractBack]退款完成!", data);
					}
				}
			})
		})).catch(util.callBind(this, function(err) {
			console.log("退单表数据查询异常:", err);
		}));
	}
}
