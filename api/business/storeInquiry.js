import Req from '@/utils/request.js';

//门店查询页面

/**
 * 获取查询条件
 * @param {*} data 查询参数 
 * @param {*} func 回调函数
 */

export const getQueryCondition = function(id) {
	const data = {
		brand: "SmallProSendingBackground.Model",
		action: "Init",
		ywname: "XCXYWTEMP001CLASS",
		data: {
			BMID: id,
			YWTYPE: "ZDYCX"
		}

	}
	Req.http('xxx',data,"加载中...").then(res=>{
		if(res){
			return res
		}
	})
}
