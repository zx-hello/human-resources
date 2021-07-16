<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- 菜单上面logo组件 -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 菜单组件(element组件提供) -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 自定义组件 菜单项的组件 默认插槽
             配置完的路由数据在这里v-for遍历渲染显示到菜单
             作用：sidebar-item组件接口当前路由配置数据item
         -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // 计算路由的变化
    routes () {
      // this.$router.options.routes可以拿到完整的路由数据
      // 所有的路由信息，包括子路由的信息、元信息等
      // this.$router.options.routes 只可以拿到静态的路由，拿不到动态添加的路由(addRoutes)
      // return this.$router.options.routes
      // 拿到的是一个完整的包含了静态路由+动态路由的数据结构
      return this.$store.state.menu.menuList
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    // 控制菜单折叠展开的vuex数据
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
