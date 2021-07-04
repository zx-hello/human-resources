// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/attendances',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'attendances',
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤', // 菜单标题
        icon: 'skill'
      }
    }
  ]
}
