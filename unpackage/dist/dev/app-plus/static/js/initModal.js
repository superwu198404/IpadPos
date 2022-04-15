import Vuex from 'vuex'
// 自定义弹窗
export default function initModal(v) {
  // 挂在store到全局Vue原型上
  v.prototype.$modalStore = new Vuex.Store({
    state: {
		show:false,
		title:"标题",
		content:'内容',
		showCancel:true,
		cancelText:"取消",
		cancelColor:"#333333",
		cancelBackgroundColor:"rgba(236, 236, 236, 0.39)",
		confirmText:"确定",
		confirmColor:"#333333",
		confirmBackgroundColor:"#FFBB24",
		success:null,
    },
    mutations: {
		hideModal(state) {
			// 小程序导航条页面控制
			// #ifndef H5
			if(state.hideTabBar){
				wx.showTabBar();
			}
			// #endif
			state.show = false
		},
		showModal(state,data) {
			state = Object.assign(state,data)
			console.log(state);
			state.show = true
		},
		success(state,res) {
			let cb = state.success
			let resObj={
				cancel:false,
				confirm:false
			}
			res=="confirm"?resObj.confirm=true:resObj.cancel=true
			cb && cb(resObj)
		}
    }
  })
  v.prototype.$showModal = function (option) { 
	if (typeof option === 'object') {
		// #ifndef H5
		if(option.hideTabBar){
			wx.hideTabBar();
		}
		// #endif
		
		v.prototype.$modalStore.commit('showModal', option)
	}else{
		throw "配置项必须为对象传入的值为："+typeof option;
	}
  }
} 