// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/setting',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'settings',
      component: () => import('@/views/setting'),
      meta: {
        title: '公司设置', // 菜单标题
        icon: 'setting'
      }
    }
  ]
}
