// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/social',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'social',
      component: () => import('@/views/social'),
      meta: {
        title: '社保', // 菜单标题
        icon: 'table'
      }
    }
  ]
}
