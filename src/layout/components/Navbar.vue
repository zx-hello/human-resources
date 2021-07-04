<template>
  <div class="navbar">
    <!-- 控制菜单的折叠展开状态 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="app-breadcrumb">
      巴啦啦神奇小魔仙
      <span class="breadBtn">体验版</span>
    </div>
    <!-- 面包屑组件 导航菜单 -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <!-- 右侧下拉菜单
         1.后续会放一些工具图标
         2.展示登陆人信息
     -->
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img src="@/assets/common/bigUserHeader.png" class="user-avatar" /> -->
          <img v-imgError="defaultTx" :src="avatar" class="user-avatar" />
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="http://ihrm-java.itheima.net/">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data () {
    return {
      // 默认图片(图片加载失败显示默认图片)
      defaultTx: require('@/assets/common/bigUserHeader.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      // 登陆人的数据
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout () {
      /**
       * 1.避免误操作=> 让用户确认
       * 2.确认后才执行
       */
      this.$confirm('确定要退出嘛？', '提示').then(async () => {
        // 点击确定=> 进入到这里
        await this.$store.dispatch('user/logoutAction')
        // 跳回登录
        // 退出登录的时候把上次访问的页面地址传递给登录页 redirect
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }).catch((e) => {
        // 点击取消=>走到这里
        console.log('取消', e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  // 头部组件的背景色
  background-image: linear-gradient(to top, #0ba360 0%, #3cba92 100%);
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  // .breadcrumb-container {
  //   float: left;
  // }
  // 公司信息
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      // 右侧头像等显示控制
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
