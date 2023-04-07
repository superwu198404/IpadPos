import common from '@/api/common.js';

export default {
	async get_tiktok_token(dqid){//获取抖音接口token
		console.log("[GetTiktokToken]传入的地区ID:",dqid);
		if(!dqid) dqid = getApp().globalData.store.DQID;
		console.log("[GetTiktokToken]确认的门店:",getApp().globalData.store);
		console.log("[GetTiktokToken]确认的地区ID:",dqid);
		let result = await common.SimpleAPIRequest({
			class: 'DataQuery',
			method: 'SALEQuery',
			process: false,
			data: `SELECT * FROM PAYCONFIG WHERE KHID='${dqid}' AND PAYTYPE='DYToken'`
		})
		console.log("[GetTiktokToken]抖音token查询结果:", result);
		if(result.code) {
			let data = JSON.parse(result.data);
			if(data.length)
				return data[0]?.LONGKEY;
			else 
				return null;
		}
		else {
			return null;
		}
	},
	async get_tiktok_store_id(khid){//获取抖音接口门店id
		console.log("[GetTiktokStoreId]传入的门店ID:",khid);
		if(!khid) khid = getApp().globalData.store.KHID;
		console.log("[GetTiktokStoreId]传入的门店ID:",khid);
		let result = await common.SimpleAPIRequest({
			class: 'DataQuery',
			method: 'SALEQuery',
			process: false,
			data: `SELECT * FROM PAYCONFIG WHERE KHID='${khid}' AND PAYTYPE='DYKHID'`
		})
		console.log("[GetTiktokStoreId]抖音poi_id查询结果:", result);
		if(result.code) {
			let data = JSON.parse(result.data);
			if(data.length)
				return data[0]?.LONGKEY;
			else 
				return null;
		}
		else {
			return null;
		}
	}
}