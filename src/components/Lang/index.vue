<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh' === $i18n.locale">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en' === $i18n.locale">
        en
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    // 动态切换多语言---->点击可以获取对应菜单项上绑定的 command="zh"值
    changeLanguage (command) {
      // 核心：this.$i18n.locale
      this.$i18n.locale = command // 设置给本地的i18n插件
      /**
       * 本地持久化存储当前语言包==>
       * 默认存的是session形式==>关闭浏览器，这个数据就会被删除
       * 语法：cookies.set(key, value, {expires: day/date对象})
       *    expires: day/date对象--->三天后过期，直接写一个数字：3
       *           三小时后过期：new Date(Date.now() + 3 * 60 * 60 * 1000)
       */
      Cookie.set('hr-lang', command)
      this.$message.success(`切换语言成功`)
    }
  }
}
</script>
