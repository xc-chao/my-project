import axios from 'axios'
import { Toast } from 'zarm'
// /api/userInfo
// /api/login
axios.defaults.baseURL = '/api'
// 跨域 默认不带cookie 
axios.defaults.withCredentials = true // 跨域请求携带cookie
// 约定 后端知道  异步的请求
axios.defaults.headers['X-Request-With'] = 'XMLHttpRequest'
// JWT token Authorization 授权码
axios.defaults.headers.post['Content-Type'] = 'application/json;'

axios.interceptors.request.use(config => {
  config.headers['Authorization'] = localStorage.getItem('token') || null
  return config
})
// 响应拦截器
axios.interceptors.response.use(res => {
  // console.log('响应拦截~~~~~',res, res.data) 
  // // 统一处理错误
  // // 加工数据
  if (typeof res.data !== 'object') {
    Toast.show('服务器异常!')
    // reject resolve 
    return Promise.reject(res)
  }

  if (res.data.code !== 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code === 401) { // 状态码 401 unauthorized
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios