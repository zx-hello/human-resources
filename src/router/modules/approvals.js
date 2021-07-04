// 导入layout组件
import Layout from '@/layout'

export default {
  // 路径
  path: '/approvals',
  // 组件
  component: Layout,
  children: [
    {
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批', // 菜单标题
        icon: 'tree-table'
      }
    }
  ]
}
