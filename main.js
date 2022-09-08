import App from './App'
import * as request from '@/utils/request.js';
import * as $ from '@/utils/common.js'
import tui from './common/httpRequest'
import store from '@/utils/store.js';
import extend from '@/utils/extend.js';

// #ifdef VUE2
import Vue from 'vue'

import G_show_modal from './static/js/ShowModal/Gshow_modal.js'
Vue.use(G_show_modal);



// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';
Polyfill.init();

// 全局mixins，用于实现setData等功能';
import Mixin from './polyfill/mixins';
Vue.mixin(Mixin);

//把vuex定义成全局组件
Vue.config.productionTip = false
Vue.config.$ = $
Vue.prototype.tui = tui
Vue.prototype.$to_sale_pages = (params) => {
	console.log("[$to_sale_pages]重定向至销售主页!");
	this.$emit("redirect", {
		name: "sale",
		params
	})
}
App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif
