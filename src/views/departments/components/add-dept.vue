<template>
  <!-- 放置弹层组件 -->
  <el-dialog title="新增部门" width="45%" :visible="showDialog" @close="close">
    <!-- 新增部门表单项 -->
    <el-form label-width="120px">
      <el-form-item label="部门名称">
        <el-input style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <!-- <el-select style="width: 80%" placeholder="请选择" /> -->
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 具名插槽 -->
    <span slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="addDept">新增</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 关闭弹层
    close () {
      console.log('关闭')
      this.$emit('close_dialog')
    },
    // 新增部门
    addDept () {
      console.log('新增')
    }
  }
}
</script>
