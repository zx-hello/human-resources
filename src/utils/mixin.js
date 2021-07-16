/**
 * 由于线上接口数据的变化是不可控制的
 * 所以没有办法具体将管理员和普通员工的权限完全区分开
 * 但是方法在此处定义和在main.js挂载
 * 若需要使用此方法，就在当前页面需要区分权限的按钮内加上v-if属性
 * 例如：v-if="checkPoints('后台对于这些权限点的名称')"
 */
// 对于页面下功能的权限控制的方法
// mixin一般用于复用逻辑(逻辑)
// 导入vuex实例
import store from '@/store'
export default {
  methods: {
    // 检查页面下的功能点
    // point 功能点的权限点
    checkPoints (point) {
      /**
       * 1. 获取当前登陆人的功能点的权限标识列表
       * 2. 根据传入的权限点标识去 第1步的数组中查找--->找到返回true，相反返回false
       */
      // 解构得到vuex中的数据信息userInfo-->内部存储这权限点
      const { userInfo } = store.state.user
      // roles? ====>利用ES10的语法，进行一个判断
      // 当用户主动退出的时候，代码不会再对userInfo内进行查找，而造成报错
      // ? 作用：增加代码的健壮性
      return userInfo.roles?.points.includes(point)
    }
  }
}
