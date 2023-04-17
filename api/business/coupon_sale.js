import common from '@/api/common.js';

export default {
	methods:{
		coupons_segment_repeat_judge(start_and_end,start_and_end_list){//param 1：券起始号码-券结束号码，param 2：[券起始号码 A-券结束号码 A,券起始号码 B-券结束号码 B,...]
			let input_arr = start_and_end?.split('-');
			console.log("[CouponsSegmentRepeatJudge]券重复号段检查:",{
				start_and_end,
				start_and_end_list
			});
			if(input_arr?.length == 2){
				let start_code_input = Number(input_arr[0].substring(-4,input_arr[0].length - 4));
				let end_code_input = Number(input_arr[0].substring(-4,input_arr[0].length - 4));
				console.log("[CouponsSegmentRepeatJudge]券重复号段检查:",{
					start_code_input,
					end_code_input
				});
				for(let s_e of start_and_end_list){
					let s_e_arr = s_e?.split('-');
					if(s_e_arr?.length == 2){
						let start_code = Number(s_e_arr[0].substring(-4,s_e_arr[0].length - 4));
						let end_code = Number(s_e_arr[0].substring(-4,s_e_arr[0].length - 4));
						console.log("[CouponsSegmentRepeatJudge]券重复号段检查:",{
							start_code,
							end_code
						});
						if(start_code <= start_code_input && end_code >= start_code_input  || start_code <= end_code_input && end_code >= end_code_input){
							return true;
						}
					}
				}
				return false;
			}
			else
				return true;
		},
		re_computed_sales(sale1,sale2){
			console.log("[ReComputedSales]重新计算sale1、2，计算前：",{
				sale1,sale2
			});
			sale2.forEach(s2 => Number(s2.NET?.toFixed(2)));
			console.log("[ReComputedSales]重新计算sale2金额：", sale2);
			let total_amount = sale2.map(s2 => s2.NET).reduce((p,n) => p + n,0);
			sale1.ZNET = total_amount;
			sale1.TNET = total_amount;
			console.log("[ReComputedSales]重新计算sale1金额：", sale1);
			console.log("[ReComputedSales]重新计算完成...");
		},
		coupon_price_record(sale2,sale6){
			console.log("[CouponPriceRecord]券金额记录:",{sale2,sale6});
			sale2.forEach(s2 => {
				sale6.filter(s6 => s6.SPID == s2.SPID).forEach(s6 => s6.MYSTR = s2.PRICE);
			})
			console.log("[CouponPriceRecord]券金额处理后的记录:",{sale2,sale6});
		}
	}
}