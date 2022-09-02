/*
	Home 页面路由配置
*/
export default [{
		title: "销售",
		name: "Main",
		keepAlive: true, /*保持组件状态，此处因小程序中不兼容原生vue的keep-alive功能，而手动实现的效果（百度不到的）*/
		url: "@/pages/Main/Main",
		meta:{
			bill_type:"",
			xs_type:1
		},
		icon: require('@/images/xiaoshou.png'),
		icon1: require("@/images/xiaoshou-hui.png"),
		index: 0
	},
	{
		title: "预定",
		name: "Main",
		url: "@/pages/Main/Main", //
		meta:{
			bill_type:"Z171",
			xs_type:3
		},
		icon: require("@/images/yuding.png"),
		icon1: require("@/images/yuding-hui.png"),
		index: 1
	},
	{
		title: "赊销",
		name: "Main",
		url: "@/pages/Main/Main",
		meta:{
			bill_type:"Z154",
			xs_type:6
		},
		icon: require("@/images/shexiao.png"),
		icon1: require("@/images/shexiao-hui.png"),
		index: 2
	},
	{
		title: "预定提取",
		name: "Extract",
		url: "@/pages/Extract/Extract",
		icon: require("@/images/xz-ydtq.png"),
		icon1: require("@/images/wxz-ydtq.png"),
		index: 5
	}, {
		title: "外卖单",
		name: "TakeAway",
		url: "@/pages/TakeAway/TakeAway",
		icon: require("@/images/waimaid.png"),
		icon1: require("@/images/waimaid-hui.png"),
		index: 4
	},
	{
		title: "外卖预订单",
		name: "TakeYD",
		url: "@/pages/TakeYD/TakeYD",
		icon: require("@/images/wmyudd.png"),
		icon1: require("@/images/wmyudd-hui.png"),
		index: 5
	},
	{
		title: "线上业务",
		url: "",
		icon: require("@/images/xianshangdd.png"),
		icon1: require("@/images/xianshangdd-hui.png"),
		index: 6,
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
		index: 7,
		showDetail: false,
		details: [{
				title: "销售退单",
				name: "RefundOrder",
				url: "@/pages/RefundOrder/RefundOrder",
				meta:{
					xs_type:2
				},
				icon: require("@/images/xstd.png"),
				icon1: require("@/images/xstd-wxz.png"),
				index: 0
			},
			{
				title: "预定退单",
				name: "Extract",
				url: "@/pages/Extract/Extract",
				meta: { //跳转的时候会向组件的 meta 传值，组件内通过 this.meta 获取传入的数据
					mode: false,
					xs_type:4
				},
				icon: require("@/images/ydqx.png"),
				icon1: require("@/images/ydqx-wxz.png"),
				index: 1
			},
			{
				title: "赊销退单",
				name: "SXRefund",
				url: "@/pages/RefundOrder/SXRefund",
				meta: {
					xs_type:7
				},
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
		index: 8
	},
	{
		title: "工具",
		url: "",
		icon: require("@/images/xz-th.png"),
		icon1: require("@/images/wxz-th.png"),
		index: 9,
		showDetail: false,
		details: [{
				title: "促销活动",
				name: "Promotion",
				url: "@/pages/Promotion/Promotion",
				icon: require("@/images/dqcuxiao.png"),
				icon1: require("@/images/dqcuxiao-wxz.png"),
				index: 0
			},
			{
				title: "通讯",
				name: "Call",
				url: "",
				icon: require("@/images/tongxun.png"),
				icon1: require("@/images/tongxun-wxz.png"),
				index: 1
			},
			{
				title: "重读",
				name: "Stress",
				url: "/pages/start/start",
				url_type: "single", //页面类型是内嵌(inline)的还是单个(single)
				icon: require("@/images/chongdu.png"),
				icon1: require("@/images/chongdu-wxz.png"),
				index: 2
			},
			{
				title: "未上传",
				name: "UnHandle",
				url: "",
				icon: require("@/images/wschuan.png"),
				icon1: require("@/images/wschuan-wxz.png"),
				index: 3
			}
		]
	}
]
