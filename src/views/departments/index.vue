<template>
  <div class="department-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- card title -->
        <div slot="header">
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>江苏传智播客教育科技股份有限公司</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>负责人</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <!-- card body -->
        <div>
          <el-tree
            :data="list"
            :props="defaultProps"
            :default-expand-all="true"
          >
            <!-- 作用域插槽 data拿到的是每一个子节点的对象 -->
            <!--
      什么时候用到作用域插槽？父组件中如果想使用子组件中的数据进行自定义内容的渲染 (table 单元格数据渲染)
    -->
            <template #default="{ data }">
              <el-row style="width: 100%">
                <el-col :span="20">
                  <span>{{ data.name }}</span>
                </el-col>
                <el-col :span="4">
                  <el-row type="flex" justify="end">
                    <!-- 两个内容 -->
                    <el-col>{{ data.manager }}</el-col>
                    <el-col>
                      <!-- 下拉菜单 element -->
                      <el-dropdown>
                        <span> 操作<i class="el-icon-arrow-down" /> </span>
                        <!-- 下拉菜单 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>添加子部门</el-dropdown-item>
                          <el-dropdown-item>编辑部门</el-dropdown-item>
                          <el-dropdown-item>删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [{
        name: '2134',
        children: [
          {
            name: '12'
          },
          {
            name: '34'
          }
        ]
      }],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// scss中使用 ::v-deep 深度控制样式
::v-deep .el-tree-node__content {
  margin: 3px 0;
  font-size: 14px;
}
</style>
