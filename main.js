import App from './App'
import * as request from '@/utils/request.js';
import * as $ from '@/utils/common.js'
import tui from './common/httpRequest'
import Vue from 'vue' 
import store from './store' 
import G_show_modal from './static/js/ShowModal/Gshow_modal.js'
Vue.use(G_show_modal);
//把vuex定义成全局组件
Vue.config.productionTip = false
Vue.config.$=$
 Vue.prototype.tui = tui
App.mpType = 'app' 
const app = new Vue({
	 store, 
    ...App
})
app.$mount()

 