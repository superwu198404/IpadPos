import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
// 创建一个新的 store 实例
export default new Vuex.Store({
	  state () {
	    return {
	      location: null,//每次跳转传入的数据
		  orders:null,//订单记录数据
		  refund:null,//退款操作（测试）
		  trade:null,//最近的一个支付单号没有就为空
	    }
	  },
	  mutations: {
		"set-location"(state,data) {
	      state.location = data;
	    },
		"set-orders"(state,data) {
		  state.orders = data;
		},
		"set-refund"(state,data) {
		  state.refund = data;
		},
		"set-trade"(state,data) {
		  state.trade = data;
		}
	  }
	})