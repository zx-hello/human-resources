// 提供统一的注册的入口文件
// 插件注册 挂载注册全局公共组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ElDepSelect from './DepSel'
import UploadImg from './UploadImg'

// // vue插件写法：声明对象--->内部有nstall方法
// export default {
//   // 可以拿到Vue构造函数(入口页面的Vue方法)
//   install (Vue) {
//     // 注册全局组件
//     Vue.component('PageTools', PageTools)
//   }
// }

/**
 * 优化：
 * 批量注册多个组件
 * 1.将所有组件都放到一个数组中
 * 2.循环数组注册所有组件
 */

const components = [PageTools, UploadExcel, ElDepSelect, UploadImg]

export default {
  install (Vue) {
    components.forEach(cp => {
      // cp.name-->组件内<script>中的name属性
      Vue.component(cp.name, cp)
    })
  }
}
