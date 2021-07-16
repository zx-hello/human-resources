// 维护公共布局左侧菜单的数据
/**
 * menuList ： 1. 静态路由 2. 根据权限点过滤的路由(动态路由)
 */

// 导入静态路由
import { constantRoutes } from '@/router/index'

export default {
  namespaced: true,
  state: {
    // 菜单数据
    menuList: []
  },
  mutations: {
    // 存储菜单数据 payload = filterAsyncRoutes 在permission.js页面过滤的动态路由
    setMenuList (state, payload) {
      state.menuList = [...constantRoutes, ...payload]
    }
  }
}
