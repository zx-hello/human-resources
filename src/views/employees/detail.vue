<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="active">
          <el-tab-pane name="account" label="登录账户设置">
            <LoginSetting :user-data="userData"></LoginSetting>
          </el-tab-pane>
          <el-tab-pane name="detail" label="个人详情">
            <UserInfo :user-data="userData"></UserInfo>
          </el-tab-pane>
          <el-tab-pane name="mobile" label="登录手机号">
            <el-row>
              <el-input v-model="userData.mobile" disabled />
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="12">
                <el-button
                  style="background: #409eff; color: #fff; border: none"
                  @click="$router.back()"
                >
                  返回
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 导入子组件
import LoginSetting from './components/login-setting.vue'
import UserInfo from './components/user-info.vue'
// 导入API
import { getUserDetailById } from '@/api/user'
export default {
  components: {
    LoginSetting,
    UserInfo
  },
  data () {
    return {
      // 用户信息
      userData: {},
      // 默认选中的页签
      active: 'mobile'
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户所有信息
    async getUserInfo () {
      const res = await getUserDetailById(this.$route.params.id)
      // console.log(res)
      this.userData = res
    }
  }
}
</script>
