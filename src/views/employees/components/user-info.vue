<template>
  <div class="app-container">
    <!-- 个人信息 -->
    <el-form ref="fm" label-width="100px" :model="userData" :rules="rules">
      <!-- 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input
              v-model="userData.departmentName"
              @focus="showTree = true"
            />
            <!-- 部门选择 -->
            <ElDepSelect
              :visible.sync="showTree"
              @current-select="getDept"
            ></ElDepSelect>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="userData.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像" prop="staffPhoto">
            <!-- 放置上传图片 -->
            <!-- <el-image :src="userData.staffPhoto"></el-image> -->
            <!-- 1.回显已经上传的图片
                 2.可以重现上传图片 + 获取重新长传的图片地址
             -->
            <UploadImg :src.sync="userData.staffPhoto"></UploadImg>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="updateDetail">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
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
        departmentName: [
          { required: true, message: '部门名称不允许为空！', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间不允许为空！', trigger: 'change' }
        ]
      },
      // 控制部门选择
      showTree: false
    }
  },
  methods: {
    // 保存更新的用户信息
    updateDetail () {
      this.$refs.fm.validate(async (isOk) => {
        if (isOk) {
          // 获取变化的数据
          await saveUserDetailById(this.userData)
          this.$message.success('更新账户成功！')
        }
      })
    },
    // 选择后修改部门数据
    getDept (node) {
      this.userData.departmentName = node.name
    }
  }
}
</script>
