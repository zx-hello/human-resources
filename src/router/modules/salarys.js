// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/salarys',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资', // 菜单标题
        icon: 'money'
      }
    }
  ]
}
