
import App from './App'
import * as request from '@/utils/request.js' 
import * as $ from '@/utils/common.js'

// #ifndef VUE3
// #endif
import Vue from 'vue' 
import store from './store' 
import Gshow_modal  from '@/static/js/ShowModal/Gshow_modal.js'
 Vue.use(Gshow_modal)
//把vuex定义成全局组件
Vue.config.productionTip = false
Vue.config.$=$


App.mpType = 'app'   
const app = new Vue({
	 store, 
    ...App
})
app.$mount()
 
