/**
 * 用户相关数据维护和管理模块(token、登陆人的信息)
 */
// 导入token存储
import { getToken, setToken, removeToken } from '@/utils/auth'
// 导入login请求
import { login, getUserInfo, getUserDetailById } from '@/api/user'
export default {
  // 开启命名模块化
  namespaced: true,
  // 存和定义用户数据
  state: {
    // 登陆后的token数据
    // 先从本地读取，读取不到才是空
    token: getToken() || '',
    // 登陆人的信息
    userInfo: {}
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
    },
    // 存储用户信息
    updateUserInfo (state, payload) {
      state.userInfo = payload
    },
    // 删除用户信息
    delUserInfo (state) {
      state.userInfo = {}
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
    },
    // 获取登陆人数据并存储
    // 什么时候调用登陆人信息=>可以在permission.js => 前置全局守卫
    async UserInfoAction (ctx) {
      // 1.拿到用户基本信息
      const userInfo = await getUserInfo()
      // 2.获取用户头像
      const avatar = await getUserDetailById(userInfo.userId)
      console.log('登陆人信息', userInfo, avatar)
      // 合并两个对象
      ctx.commit('updateUserInfo', { ...userInfo, ...avatar })
    },
    // 退出登录=>清除本地状态数据
    logoutAction ({ commit }) {
      /**
       * 1.若有退出接口=> 调用
       * 2.清除本地登录存储的数据 =>token、userInfo
       */
      commit('delToken')
      commit('delUserInfo')
    }
  }
}
