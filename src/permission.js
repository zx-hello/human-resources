// // ===================原版
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })

// // ====================我写的版本
// 控制访问权限 有无token
import router from '@/router' // 路由实例
import store from '@/store' // vuex store实例
// 加载的进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 导入动态路由
import { asyncRoutes } from '@/router/index'

// 白名单 无需token也可访问的页面
const whiteList = ['/login', '/404']

// 添加前门保安=>根据是否有token拦截页面的访问
/**
 * to 去哪里
 * from 从哪个页面跳转过来
 * next 是否放行
 */
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 为了避免重复登陆=>跳转到首页
      next('/')
    } else {
      // 有token且访问的不是登录页 放行
      next()
      // 获取登陆人的信息=>存储到vuex
      if (!store.getters.name) {
        // 如果没有获取过执行actions获取
        // 后续控制权限的时候 需要加await
        const points = await store.dispatch('user/UserInfoAction')
        // 后续逻辑
        /**
         * 需求：根据登陆后获取的权限点数据--->动态添加路由的规则-->目的：做页面的访问控制
         * 步骤：1.获取vuex中的权限点数据(在store/modules/user.js中获取)==> points
         *      2.根据权限点数据过滤动态路由--->留下当前登陆人有权限的页面路由配置
         *      3.将过滤出来的路由动态添加到路由
         * 注意：
         * 1.配置动态路由的时候，第一个子路由的name值和后台对应页面的权限标识要一一对应
         * 2.动态添加路由是添加到404页面之前，否则就会出现，刷新就是404，动态页面出不来
         */
        //  filterAsyncRoutes 标识当前登陆人可以访问的页面路由配置
        const filterAsyncRoutes = asyncRoutes.filter((route) => {
          // route.children[0].name获取路由配置的name
          // 获取路由配置的name 和 登陆人的menus数组中的值做匹配
          //    1. 匹配到==>有这个route的访问权限   2.相反就没有
          return points.menus.includes(route.children[0].name)
        })
        // 存储合并菜单数据---> 渲染菜单
        store.commit('menu/setMenuList', filterAsyncRoutes)
        // 动态添加路由生效 ===> 确保404路由配置在最后，解决动态路由刷新404问题
        router.addRoutes([...filterAsyncRoutes, { path: '*', redirect: '/404', hidden: true }])
      }
    }
  } else {
    // 不存在token
    if (whiteList.includes(to.path)) {
      // 在白名单内有的就直接放行
      next()
    } else {
      next('/login')
    }
  }
  // 关闭进度条
  NProgress.done()
})
