import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// 导入其他模块的的vuex数据
import app from './modules/app' // 处理菜单折叠展开状态数据持久化(vuex+cookie)
import settings from './modules/settings' // 头部固定和logo数据状态的管理
import user from './modules/user' // 用户登录相关数据在这里管理(开发需要使用)
// 导入菜单的模块
import menu from './modules/menu'

// 注册vuex
Vue.use(Vuex)

// 初始化vuex===>得到一个vuex实例
const store = new Vuex.Store({
  // 挂载子模块
  modules: {
    app,
    settings,
    user,
    menu
  },
  // 快捷方式=>方便获取子模块的state数据
  getters
})
/**
 * 导出store实例目的
 * 1.可以在其他模块js文件中导入==>获取state数据、调用action等
 * 2.在main.js导入store挂载
 */
export default store
