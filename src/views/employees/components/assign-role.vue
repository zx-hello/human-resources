<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="close"
  >
    <!-- 这里准备复选框 分配角色的列表
         v-model="selectedRoles"  selectedRoles存储多选的值
         选项存的值由label属性决定
    -->
    <el-checkbox-group v-model="selectedRoles">
      <!-- 多选的选项  label决定当前选中的值 一定要是动态的，不然不会有效果 -->
      <el-checkbox v-for="item in roleRist" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="assignRole">
        确定分配
      </el-button>
      <el-button size="small" @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 获取API 角色列表
import { getRoleList } from '@/api/setting'
// 导入用户信息
import { getUserDetailById } from '@/api/user'
// 导入用户分配角色API
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 角色列表
      roleRist: [],
      // 选中角色的ID
      selectedRoles: [],
      // 用户ID 从父组件传递过来的
      currentUserId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 关闭弹窗
    close () {
      this.$emit('update:showRoleDialog', false)
      // 清空上次的选择数据
      this.selectedRoles = []
    },
    // 获取角色列表
    async getRoleList () {
      // 由于此处没有单独获取角色列表的接口，所以将所有页面的所有的角色数据都直接拿到
      const { rows } = await getRoleList({ page: 1, pageSize: 1000 })
      this.roleRist = rows
    },
    // 确定分配角色按钮
    async assignRole () {
      /**
       * 1.获取用户ID+当前选中角色ID数组
       * 2.调用分配角色接口传入
       * 3.提示+关闭弹层
       */
      await assignRoles({ id: this.currentUserId, roleIds: this.selectedRoles })
      this.$message.success('分配角色成功！')
      // 关闭弹窗
      this.close()
    },
    // 获取当前点击用户之前分配过的角色数据==>回填
    // id是用父组件传递过来的 this.$refs.arole.getUserRoles(id)
    async getUserRoles (id) {
      const { roleIds } = await getUserDetailById(id)
      // 回填选中
      this.selectedRoles = roleIds
      // 存储用户ID
      this.currentUserId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-bottom: 20px;
}
</style>
