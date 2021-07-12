<template>
  <div class="app-container">
    <!-- 放置表单 -->
    <el-form ref="fm" label-width="60px" :rules="rules" :model="userData">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userData.username" style="width: 300px" />
      </el-form-item>
      <el-form-item label="密码:">
        <el-input
          v-model="userData.password"
          disabled
          style="width: 300px"
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUserName()">更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveUserDetailById } from '@/api/user'
export default {
  props: {
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      rules: {
        username: [
          { required: true, min: 2, max: 20, message: '请输入用户名长度为2~20之间！', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 更新用户名
    updateUserName () {
      /**
       * 1.整体校验
       * 2.调用更新接口
       */
      this.$refs.fm.validate(async (isOk) => {
        if (isOk) {
          // 获取变化的数据
          await saveUserDetailById(this.userData)
          this.$message.success('更新账户成功！')
        }
      })
    }
  }
}
</script>
