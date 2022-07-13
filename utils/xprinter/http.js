import axios from '@/js_sdk/gangdiedao-uni-axios'

// 创建自定义接口服务实例
const http = axios.create({
	baseURL: 'http://127.0.0.1:8099',//根据个人后端情况，修改此处baseURL
	timeout: 6000, // 不可超过 manifest.json 中配置 networkTimeout的超时时间
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		//'X-Requested-With': 'XMLHttpRequest',
	},
})

// 拦截器 在请求之前拦截   添加token
http.interceptors.request.use(config => {
	//请求前有关处理逻辑
	return config
})
// 响应后的拦截
http.interceptors.response.use(response => {
    //响应拦截处理逻辑
	return response;
}, error => {
	
	return Promise.reject(error.message)
})

export default http