<template>
  <div>
    <!-- 选择部门的数据 -->
    <el-row v-show="visible" class="treeBox">
      <!-- 关闭按钮图标 -->
      <i class="el-icon-circle-close" @click="close"></i>
      <el-tree
        :data="treeData"
        :props="{ label: 'name' }"
        icon-class="el-icon-arrow-right"
        @node-click="selectNode"
      ></el-tree>
    </el-row>
  </div>
</template>

<script>
// 引入API
import { getDepartments } from '@/api/department'
// 引入树形结构转换方法
import { formatTreeData } from '@/utils'

export default {
  name: 'ElDepSelect',
  props: {
    // 控制部门选择是否显示
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 部门选择树形结构的数组
      treeData: []
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    // 获取部门的数据
    async getTreeData () {
      const { depts } = await getDepartments()
      // 使用算法将部门数据进行树形处理
      this.treeData = formatTreeData(depts)
    },
    // 选择部门
    selectNode (Node) {
      /**
       * 1.node当前点击选择的部门数据==>子传父
       * 2.关闭
       */
      this.$emit('current-select', Node)
      // 关闭窗口
      this.close()
    },
    // 关闭部门选择
    close () {
      // 子传父
      // 方法一
      // this.$emit('close-dept')
      // 方法二  在父组件上加上 .sync
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.treeBox {
  position: relative;
  width: 50%;
  margin-top: 10px;
  border: 1px solid #eee;
  .el-icon-circle-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
    font-size: 16px;
    color: cadetblue;
    cursor: pointer;
  }
}
</style>
