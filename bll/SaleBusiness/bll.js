import common from '@/api/common.js'
import {
	BatchQuery
} from '@/api/business/da.js'
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
export const ServiceDataQuery = function(bill) {
	return BatchQuery([{
			name: "sale1",
			sql: `select * from sale001 where bill='${bill}'`
		},
		{
			name: "sale2",
			sql: `select s2.*,NVL(s.SNAME,'名称无') NAME from SALE002 s2 left join SPDA s on s2.spid=s.spid where bill='${bill}'`
		},
		{
			name: "sale3",
			sql: `select * from sale003 where bill='${bill}'`
		}
	]);
}
