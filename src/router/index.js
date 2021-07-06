import Vue from 'vue'
import Router from 'vue-router'

// 注册路由
Vue.use(Router)

/* Layout */
// 公共布局组件
import Layout from '@/layout'
// 引入多个动态路由
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 动态路由==> 后期做后台系统页面访问控制=>路由规则的动态添加(根据当前登陆人的登录权限)=>权限控制
/**
 * 1.第一层：父路由=>使用layout作为component的值
 * 2.第二层：真正配置的页面放到children里去配置
 * 3.子路由内加上 元信息meta =>里面配置标题title和icon，这样就可以显示到侧边栏菜单了
 * 说明：通过 hidden：true控制路由是否在菜单中显示(放置于父路由中)
 */
export const asyncRoutes = [
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter,
  attendancesRouter,
  salarysRouter,
  socialRouter
]

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 静态路由(不做访问限制)
export const constantRoutes = [
  // 登录页
  {
    path: '/login',
    // 路由的懒加载=>通过一个函数返回组件对象
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 404页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true // 隐藏404页面，不让其显示在菜单栏
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard', // 后续权限控制会使用
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 使用工厂模式=>批量生产路由实例
const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 每次页面切换的时候，都会执行 => 将滚动的位置重置为0，从顶部开始
  scrollBehavior: () => ({ y: 0 }),
  // 将静态路由和动态路由组合到一起
  routes: [...constantRoutes, ...asyncRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由=>避免路由规则缓存
// eslint-disable-next-line space-before-function-paren
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
