/**
 * 定义项目中用到的全局指令
 * Vue.directive('指令名称', {
 *    // 会在当前指令作用的dom元素 插入之后执行
 *    // options 里面是指令的表达式=> 通过options.value获取指令绑定的变量值
 *    inserted: function (dom,options) {
 *   // 操作DOM
 *    }
 * })
 */

// 处理用户头像图片加载错误=> 显示一个默认的图片
export const imgError = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted (dom, options) {
    // options是 指令中的变量的解释  其中有一个属性叫做 value
    // dom 表示当前指令作用的dom对象
    // dom认为此时就是图片
    // 当图片有地址 但是地址没有加载成功的时候 会报错
    // 注册图片失败加载失败事件 onerror
    dom.onerror = function () {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  }
}
