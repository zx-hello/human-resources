// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/employees',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees', // 后续权限控制会使用==>注意：name值和后台权限标识的值相等
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理', // 菜单标题
        icon: 'people'
      }
    },
    // 员工详情页的路由
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情'
      }
    }
  ]
}
