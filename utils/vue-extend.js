import Vue from 'vue'

Vue.prototype.$to_sale_pages = (sale_type = 'sale',params) => {
	uni.$emit("redirect", {
		name: sale_type,
		params
	})
}