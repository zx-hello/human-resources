import Vue from 'vue'

// 重置组件样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// 导入element组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 多语言配置
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 全局样式
import '@/styles/index.scss' // global css

// 根组件
import App from './App'
// 导入vuex
import store from './store'
import router from './router'

import '@/icons' // icon
// 添加路由拦截---> 页面访问控制
import '@/permission' // permission control

// 注册插件 导入全局所有公共组件
import GlobleComponents from './components'

// 导入自定义指令
// import * as 名字 from 'path' => 这样可以将所有导出放到一个对象上
import * as directives from '@/directives'
// console.log(directives, directives.imgError)
// 注册多个全局指令
/**
 * item 指 里面的dom
 * Vue.directive('指令名称', {
 * inserted: function (dom,options) {
 */
Object.keys(directives).forEach(dname => {
  Vue.directive(dname, directives[dname])
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 挂载插件
// use方法执行流程：
// 1.接收插件对象(install方法)
// 2.调用install方法 传入Vue构造函数
Vue.use(GlobleComponents)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  // 挂载路由实例
  router,
  // 挂载vuex
  store,
  render: h => h(App)
})
