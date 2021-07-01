import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
// 全局注册图标组件
Vue.component('svg-icon', SvgIcon)

// 通过webpack提供的require.context方法读取svg目录下所有图标文件-->自动引入
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
