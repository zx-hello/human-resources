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
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理', // 菜单标题
        icon: 'people'
      }
    }
  ]
}
