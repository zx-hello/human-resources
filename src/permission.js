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

// 白名单 无需token也可访问的页面
const whiteList = ['/login', '/404']

// 添加前门保安=>根据是否有token拦截页面的访问
/**
 * to 去哪里
 * from 从哪个页面跳转过来
 * next 是否放行
 */
router.beforeEach((to, from, next) => {
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
        store.dispatch('user/UserInfoAction')
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
