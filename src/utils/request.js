import axios from 'axios'
// element组件库提供的消息提示
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
// 导入vuex实例=>通过store拿到里面的token
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
// 创建axios实例
const service = axios.create({
  // process.env.VUE_APP_BASE_API使用这个是为了区分环境
  // 动态配置请求的URL=>开发环境和生产环境请求地址不一样
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // 请求超时就不请求了
  timeout: 5000 // request timeout
})

// request interceptor 请求拦截器
// 请求还未发送出去
// 作用：请求发送前 向header中统一添加token
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      // 根据API文档添加
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截器
// 请求已经获取到数据了
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    /**
     * 1.简化数据的返回
     * 2.处理请求的错误并提示
     */
    // 请求成功
    const { success, data, message } = response.data
    // 处理请求的成功或失败
    if (success) {
      // 成功就把页面需要的data返回回去
      return data
    } else {
      // 请求失败
      // 错误提示
      Message({
        message,
        type: 'error',
        duration: 3 * 1000
      })
      // 中断promise并抛出错误
      return Promise.reject(new Error(message))
    }

    // 异常处理
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    // 一定要返回响应体 response 这样页面才可以获取到response的数据
    // return res
    // }
  },
  error => {
    // 请求失败执行到这里
    console.log('err' + error) // for debug
    // 错误信息的提示
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 导出axios实例
export default service
