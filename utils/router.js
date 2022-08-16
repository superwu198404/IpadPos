/*
	Home 页面路由配置
*/
export default [{
		title: "销售",
		name: "Main",
		url: "@/pages/Main/Main",
		icon: require('@/images/xiaoshou.png'),
		icon1: require("@/images/xiaoshou-hui.png"),
		index: 0
	},
	{
		title: "预定",
		name: "Reserve",
		url: "@/pages/Reserve/Reserve",
		icon: require("@/images/yuding.png"),
		icon1: require("@/images/yuding-hui.png"),
		index: 1
	},
	{
		title: "预定提取",
		name: "Extract",
		url: "@/pages/Extract/Extract",
		icon: require("@/images/xz-ydtq.png"),
		icon1: require("@/images/wxz-ydtq.png"),
		index: 2
	}, {
		title: "外卖单",
		name: "TakeAway",
		url: "@/pages/TakeAway/TakeAway",
		icon: require("@/images/yuding.png"),
		icon1: require("@/images/yuding-hui.png"),
		index: 3
	},
	{
		title: "外卖预订单",
		name: "TakeYD",
		url: "@/pages/TakeYD/TakeYD",
		icon: require("@/images/yuding.png"),
		icon1: require("@/images/yuding-hui.png"),
		index: 4
	},
	{
		title: "线上业务",
		url: "",
		icon: require("@/images/xianshangdd.png"),
		icon1: require("@/images/xianshangdd-hui.png"),
		index: 5,
		showDetail: false,
		details: [{
			title: "线上订单",
			name: "OnlineOrders",
			url: "@/pages/OnlineOrders/OnlineOrders",
			icon: require("@/images/xsdingdan.png"),
			icon1: require("@/images/xsdingdan-wxz.png"),
			index: 0
		}, {
			title: "线上提取",
			name: "OnlinePick",
			url: "@/pages/OnlinePick/OnlinePick",
			icon: require("@/images/xsddtiqu.png"),
			icon1: require("@/images/xsddtiqu-wxz.png"),
			index: 1
		}]
	},
	{
		title: "退单业务",
		url: "",
		icon: require("@/images/xz-th.png"),
		icon1: require("@/images/wxz-th.png"),
		index: 6,
		showDetail: false,
		details: [{
				title: "销售退单",
				name: "RefundOrder",
				url: "@/pages/RefundOrder/RefundOrder",
				icon: require("@/images/xstd.png"),
				icon1: require("@/images/xstd-wxz.png"),
				index: 0
			},
			// {
			// 	title: "预定退单",
			// 	url: "@/pages/RefundOrder/RefundOrder",
			// 	icon: require("@/images/ydqx.png"),
			// 	icon1: require("@/images/ydqx-wxz.png"),
			// 	index: 1
			// }, 
			{
				title: "赊销退单",
				name: "SXRefund",
				url: "@/pages/RefundOrder/SXRefund",
				icon: require("@/images/sxtd.png"),
				icon1: require("@/images/sxtd-wxz.png"),
				index: 2
			}
		]
	},
	{
		title: "消息",
		name: "Message",
		url: "@/pages/Message/Message",
		icon: require("@/images/xz-xx.png"),
		icon1: require("@/images/xiaoxi-hui.png"),
		index: 7
	},
	{
		title: "赊销结算",
		name: "CreditSettlement",
		url: "@/pages/CreditSettlement/CreditSettlement",
		icon: require("@/images/xz-xx.png"),
		icon1: require("@/images/xiaoxi-hui.png"),
		index: 8
	}
]
