<template>
  <!-- 放置一个图标 组件由element-admin封装
       在component/SvgIcon/index.vue文件内封装
  -->
  <div>
    <svg-icon
      :icon-class="isFull ? 'exit-fullscreen' : 'fullscreen'"
      class="fullscreen"
      @click="toggleScreen"
    />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  data () {
    return {
      // 是否为全屏的响应数据
      isFull: false
    }
  },
  created () {
    this.onScreen()
  },
  beforeDestroy () {
    // 关闭监控 解绑js事件
    screenfull.off('change')
  },
  methods: {
    /**
     * 浏览器底层提供了全屏的方法，但是有浏览器兼容问题
     * 所以我们使用第三方插件(screenfull)来实现
     * 1. 开启全屏: document.documentElement.requestFullscreen()
     * 2. 关闭全屏: document.exitFullscreen()
     *  */
    // 点击图标，开启或关闭全屏
    toggleScreen () {
      /**
       * 需求：点击icon图标切换全屏
       * 使用技术：
       * 选择screenfull插件--->
       *      1.浏览器兼容性判断(对于浏览器自带的全屏方法进行封装)
       *      2.提供了好用简洁的方法
       * 1.判断兼容性--->screenfull.isEnabled返回true说明当前浏览器支持，相反不支持
       * 2.点击执行嗲用screenfull包里提供的方法
       */
      // 判断是否可用
      if (!screenfull.isEnabled) {
        // 此时全屏不可用
        this.$message.error('浏览器不支持全屏功能！请尝试换个浏览器试试，例如Chrome浏览器')
        return
      }
      // 此方法只可以全屏，无法关闭全屏
      // screenfull.request()
      //   如果可用 可以切换全屏功能
      screenfull.toggle()
    },
    // 监控浏览器是否为全屏的一个状态
    onScreen () {
      // 组件创建时，进行一个是否全屏的一个判断
      if (screenfull.isEnabled) {
        // 监听全屏切换状态
        screenfull.on('change', () => {
          // console.log(screenfull.isFullscreen)
          // screenfull.isFullscreen 返回true是全屏，false不是全屏
          if (screenfull.isFullscreen) {
            this.isFull = true
          } else {
            this.isFull = false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
