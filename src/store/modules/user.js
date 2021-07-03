/**
 * 用户相关数据维护和管理模块(token、登陆人的信息)
 */
// 导入token存储
import { getToken, setToken, removeToken } from '@/utils/auth'
// 导入login请求
import { login } from '@/api/user'
export default {
  // 开启命名模块化
  namespaced: true,
  // 存和定义用户数据
  state: {
    // 登陆后的token数据
    // 先从本地读取，读取不到才是空
    token: getToken() || ''
  },
  // 修改state中定义的数据(同步)
  mutations: {
    // 存token的方法
    /**
     *
     * @param {*} state 所有state数据
     * @param {*} token 外部传递的参数(payload)
     */
    updateToken (state, token) {
      state.token = token
      // 本地存储
      setToken(token)
    },
    // 删除token
    delToken (state) {
      state.token = ''
      removeToken()
    }
  },
  // 异步请求 获取后台数据
  actions: {
    // 调用登录接口=>获取token数据
    async loginAction ({ commit }, payload) {
      // 调用接口
      const token = await login(payload)
      // 存token
      commit('updateToken', token)
    }
  }
}
