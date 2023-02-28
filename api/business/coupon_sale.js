import common from '@/api/common.js';

const common_params = () => ({
	appid: getApp().globalData.appid,
	khid: getApp().globalData.store.KHID
})

export default {
	async CouponInfoSearch(params){//券信息查询
		return await common.SimpleAPIRequest({
			class:"CouponSale",
			method: "CouponSearch",
			data: Object.assign(params,common_params())
		})
	},
	async CouponValid(params){//券号校验
		return await common.SimpleAPIRequest({
			class:"CouponSale",
			method: "CouponAllowSaleSegmentValid",
			data: Object.assign(params,common_params())
		})
	},
	async CouponDistribute(params){//券号下发
		return await common.SimpleAPIRequest({
			class:"CouponSale",
			method: "CouponSegmentDistribute",
			data: Object.assign(params,common_params())
		})
	},
	async CouponActivation(params){//券激活
		return await common.SimpleAPIRequest({
			class:"CouponSale",
			method: "CouponActivation",
			data: Object.assign(params,common_params())
		})
	}
}