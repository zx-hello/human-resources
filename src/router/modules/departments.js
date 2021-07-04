// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/departments',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments'),
      meta: {
        title: '组织架构', // 菜单标题
        icon: 'tree'
      }
    }
  ]
}
