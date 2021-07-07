<template>
  <div class="department-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- card title 具名插槽 指定头部的内容 -->
        <!-- <div slot="header"> -->
        <template slot="header">
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>{{ companyInfo.name }}</span>
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
                      <!-- @click.native="addDept('') => 表示直接添加的为父部门=> 一级部门 -->
                      <el-dropdown-item @click.native="addDept()">
                        添加子部门
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- </div> -->
        </template>
        <!-- card body 默认插槽 主体部分 -->
        <div>
          <!-- @default-expand-all="true"(简写：default-expand-all) 默认所有子节点展开
               @node-click="handleNodeClick" 获取当前点击的节点
          -->
          <el-tree
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <!-- 作用域插槽 data拿到的是每一个子节点的对象 -->
            <!-- 什么时候用到作用域插槽？
                父组件中如果想使用子组件中的数据进行自定义内容的渲染 (table 单元格数据渲染)
            -->
            <template #default="{ data }">
              <el-row style="width: 100%">
                <el-col :span="20">
                  <!-- 左侧：部门名字 -->
                  <span>{{ data.name }}</span>
                </el-col>
                <el-col :span="4">
                  <!-- 右侧 -->
                  <el-row type="flex" justify="end">
                    <!-- 两个内容 -->
                    <!-- 部门负责人 -->
                    <el-col>{{ data.manager || "CEO" }}</el-col>
                    <el-col>
                      <!-- 下拉菜单 element -->
                      <el-dropdown>
                        <span> 操作<i class="el-icon-arrow-down" /> </span>
                        <!-- 下拉菜单 => 部门操作按钮 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addDept(data)">
                            添加子部门
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="editDept(data)">
                            编辑部门
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="delDepet(data)">
                            删除部门
                          </el-dropdown-item>
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
    <!-- 新增部门弹窗 -->
    <AddDept
      ref="edit"
      :show-dialog="showDialog"
      :current-node="currentNode"
      :all-tree-data="allTreeData"
      @close_dialog="showDialog = false"
      @update-tree="getAll"
    ></AddDept>
  </div>
</template>

<script>
// 引入api
import { getDepartments, delDepartments } from '@/api/department'
// 引入对树形结构处理的算法
import { formatTreeData } from '@/utils/index'
// 导入新增部门的弹层
import AddDept from './components/add-dept'
export default {
  components: {
    AddDept
  },
  data () {
    return {
      // 公司信息
      companyInfo: { name: '' },
      // 公司组织架构的数据
      /**
       * treeData：树形结构的数据(父子嵌套关系)
       * 如何处理树形结构：找规律=> 父子部门的关系
       * 规律：pid 父部门：空
       *           子部门：有=父部门的id
       * [
       * // 顶级部门
       *    {
       *      name: '总裁办'
       *    },
       *    {
       *      name: '研发部',
       *      children: [
       *        {
       *          name: '前端'
       *        },
       *        {
       *          name: '后端'
       *        }
       *      ]
       *    }
       * ]
       */
      treeData: [],
      // 自定义树形组件数据属性名
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 新增部门的弹窗
      showDialog: false,
      // 当前点击的部门数据
      currentNode: null,
      // 所有部门数据
      allTreeData: []
    }
  },
  created () {
    this.getAll()
  },
  methods: {
    // 获取当前点击的节点
    handleNodeClick (value) {
      // console.log(value)
    },
    // 获取所有部门数据
    async getAll () {
      // const res = await getDepartments()
      const { companyName, depts } = await getDepartments()
      // 存储未经处理的数据
      this.allTreeData = depts
      // 在控制台以表格形式展现数据
      // console.log(res)
      // console.table(depts)
      // 渲染公司名称
      this.companyInfo.name = companyName
      // 渲染树结构数据
      // this.treeData = depts
      // JSON.parse(JSON.stringify(depts))===> 深拷贝
      this.treeData = formatTreeData(JSON.parse(JSON.stringify(depts)))
    },
    // 删除部门
    async delDepet (node) {
      // console.log('当前操作的部门', node)
      /**
       * 1.判断是否为父级部门(有子部门)=> 若是不能删除
       * 2.子部门可以删除
       * 3.数据库删除： 调用接口
       * 4.提示并刷新列表
       */
      if (node.children && node.children.length > 0) {
        return this.$message({
          message: '不允许直接删除父部门，请先删除子部门！',
          type: 'warning'
        })
      }
      // 提示用户是否确认删除
      this.$confirm(`确认删除${node.name}吗？`, '提示').then(async () => {
        // 点击确定
        await delDepartments(node.id)
        this.$message.success('删除成功！')
        // 刷新列表数据
        this.getAll()
      }).catch((e) => {
        // 点击取消
        console.log(e)
      })
    },
    // 添加子部门
    addDept (node) {
      // 存储当前点击的部门数据=>新增部门会使用
      this.currentNode = node
      // 打开弹层
      this.showDialog = true
    },
    // 编辑部门
    editDept (node) {
      this.currentNode = node
      this.showDialog = true
      // 回填点击的当前部门数据 => 调用接口,获取最新部门数据
      // 打开的时候就获取到当前编辑的部门数据ID => 调用接口
      // 父组件调用子组件方法 使用技术==> 使用ref
      // getDept 子组件(department/component/add-dept.vue)的方法
      this.$refs.edit.getDept(node.id)
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
