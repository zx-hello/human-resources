<template>
  <!-- 分配权限的弹层 -->
  <el-dialog
    width="50%"
    title="分配权限(一级：路由页面查看权限-二级：按钮操作权限)"
    :visible="showPointsDialog"
    @close="close"
  >
    <!-- 权限点数据展示 -->
    <!-- show-checkbox 显示选择框 开启选择
         default-expand-all 默认展开
         :check-strictly="true" 设置true，可以关闭父子选择关联
         node-key="id" 选中时绑定的数据字段(唯一) 必传属性
     -->
    <el-tree
      ref="treePoints"
      :data="pointsList"
      :props="{ label: 'name' }"
      :default-expand-all="true"
      :show-checkbox="true"
      :check-strictly="true"
      node-key="id"
    />
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="assignPoints">分配权限</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 导入API
import { getPermissionList } from '@/api/permisson'
// 获取角色选择过的权限点
import { getRoleDetail, assignPerm } from '@/api/setting'
// 导入转换树形结构
import { formatTreeData } from '@/utils'
export default {
  props: {
    showPointsDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 权限点列表数据
      pointsList: [],
      // 当前角色ID 父组件传递
      roleId: ''
    }
  },
  created () {
    this.getPermissions()
  },
  methods: {
    // 关闭弹层
    close () {
      this.$emit('update:showPointsDialog', false)
      // 清空上次选中权限===> 避免上次回填闪现
      this.$refs.treePoints.setCheckedKeys([])
    },
    // 确定分配权限
    async assignPoints () {
      /**
       * 1. 准备{id: 角色id, permIds: [] 所有选中的节点的ID组成的数组} 接口参数
       * 2. 调用接口分配权限
       * 3.
       */
      await assignPerm({ id: this.roleId, permIds: this.$refs.treePoints.getCheckedKeys() })
      this.$message.success('分配角色权限成功！')
      this.close()
    },
    // 获取权限点数据
    async getPermissions () {
      const res = await getPermissionList()
      // console.log(res)
      this.pointsList = formatTreeData(res)
    },
    // 获取当前角色之前选择过的权限点===>回填
    // id 父组件传递过来的角色ID
    async getRoleSelectedPoints (id) {
      const res = await getRoleDetail(id)
      // console.log(res.permIds)
      // 回显
      this.$refs.treePoints.setCheckedKeys(res.permIds)
      // 保存当前用户的ID
      this.roleId = id
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
