import axios  from  'axios'
import { ElMessage } from 'element-plus'
// 1. 创建axios对象
const http = axios.create({
    baseURL: '/api',
});


// 2.添加请求拦截器
http.interceptors.request.use(
  // 发送请求之前做什么
  function (config) {
    // 获取token
    // const token = localStorage.getItem('pz_token')
    // 接口白名单
    // const whiteUrl = ['/get/code', '/user/authentication', '/login']
    // if (token && !whiteUrl.includes(config.url)) {
    //   config.headers['x-token'] = token
    // }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
);

// 2.添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对接口接口异常的数据，给用户提示
    if (response.data.code === -1) {
      ElMessage.warning(response.data.message)
    }
    // 用户权限有问题
    if (response.data.code === -2) {
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      ElMessage.warning(response.data.message)
      window.location.href = window.location.origin
    }
    return response.data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
);

export default http;
