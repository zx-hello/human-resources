// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/permission',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'permissions',
      component: () => import('@/views/permission'),
      meta: {
        title: '权限管理', // 菜单标题
        icon: 'lock'
      }
    }
  ]
}
