import util from '@/utils/util.js';
import common from '@/api/common.js';
import checker from '@/utils/graceChecker.js';
import member from '@/api/hy/MemberInterfaces.js';
import bd from '@/utils/business_dictionary.js';
export default{
	methods:{
		async search_member_infos(code){
			if (!code) {
				util.simpleMsg("请输入手机号/会员号!", true);
				return;
			}
			if (code.length > 11) { //扫码操作
				let result = await member.coupon_sale.base_request('QueryHyInfoByCode',{
					khid: this.KHID,
					code: common.ResetAuthCode(code)
				})
				console.warn("[SearchMemberInfos]查询会员信息结果:",result);
				if(result.code){
					let data = JSON.parse(result.data);
					console.warn("[SearchMemberInfos]查询会员信息:",data);
					return data;
				}
			} else {
				let result = await member.coupon_sale.base_request('QueryHyInfo',{
					code: code,
					type: checker.checkMobile(code) ? 'Mobile' : 'ACCOUNT'
				})
				console.warn("[SearchMemberInfos]查询会员信息结果:",result);
				if(result.code){
					let data = JSON.parse(result.data);
					console.warn("[SearchMemberInfos]查询会员信息:",data);
					return data;
				}
			}
		},
		async search_card_infos(code){
			if (!code) {
				util.simpleMsg("请刷卡后再进行此操作!", true);
				return;
			}
			let result = await member.coupon_sale.special_request('CARD_QUERY', { card_num: code });
			console.warn("[SearchCardInfos]查询卡信息结果:",result);
			if(result.code){
				let local_result = await common.SimpleLocalQuery('SPDA',{
					spid: result.data?.materielId
				});
				if(local_result.data.length){
					result.data.cardName = local_result.data[0]?.SNAME;
				}
				else{
					result.data.cardName = '电子卡';
				}
				console.warn("[SearchCardInfos]卡商品信息查询结果:", local_result);
				console.warn("[SearchCardInfos]查询卡信息:",result);
				result.data.cardType = bd.card_type[result.data.cardType];
				result.data.expireDate = util.convertShortDate(result.data.expireDate);
				result.data.cardNum = code;
				return result.data;
			}
		}
	}
}