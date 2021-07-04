<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 左侧结构 -->
    <!-- 判断是否开启抽屉效果 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 菜单和logo组件 -->
    <sidebar class="sidebar-container" />
    <!-- 右侧结构 -->
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- 头部区域 -->
        <navbar />
      </div>
      <!-- 后台所有业务页面的渲染组件 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    // 注册layout核心布局组件
    Navbar,
    Sidebar,
    AppMain
  },
  // 处理resize事件，控制抽屉效果 =>基于bootstrap框架的响应式
  mixins: [ResizeMixin],
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    fixedHeader () {
      return this.$store.state.settings.fixedHeader
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
// 页面中引入scss样式的语法=> @import '~@/path.scss'
// 引入变量的样式
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
