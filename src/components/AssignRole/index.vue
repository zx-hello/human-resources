<template>
  <el-dialog class="assign-role" title="分配角色" :visible="showRoleDialog">
    <!-- 这里准备复选框 -->
    <template #footer>
      <el-button type="primary" size="small">确定</el-button>
      <el-button size="small">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  }
}
</script>
