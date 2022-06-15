import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
// 创建一个新的 store 实例
export default new Vuex.Store({
	  state () {
	    return {
	      location: null
	    }
	  },
	  mutations: {
		"set-location"(state,data) {
	      state.location = data;
	    }
	  }
	})