<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  async created () {
    const data = await getUserInfo()
    console.log('登陆人信息', data)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
