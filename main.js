import App from './App'
import * as request from '@/utils/request.js';
import * as $ from '@/utils/common.js'
// #ifndef VUE3
import Vue from 'vue' 
import store from './store' 
 
//把vuex定义成全局组件
Vue.config.productionTip = false
Vue.config.$=$
App.mpType = 'app' 
 
const app = new Vue({
	 store, 
    ...App
})
app.$mount()
// // #endif 
// // #ifdef VUE3
// import { createSSRApp } from 'vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
// // #endif