<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 标签页组件 -->
        <el-tabs>
          <!-- 放置页签 1 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRole"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roleList">
              <!-- type="index" 固定写法 显示序号 -->
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- 使用默认插槽 自定义显示操作按钮 -->
                <template #default="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="pages.page"
                :page-size="pages.pagesize"
                :total="total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 页签 2 -->
          <el-tab-pane label="公司管理">
            <h1>公司管理</h1>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增角色弹出层 -->
    <el-dialog
      title="编辑弹层"
      :visible="showDialog"
      width="50%"
      @close="showDialog = false"
    >
      <!-- 表单 -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 操作按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="showDialog = false">取消</el-button>
          <el-button size="small" type="primary" @click="submitRole">
            确定
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, deleteRole, addRole, getRoleDetail, updateRole } from '@/api/setting'
export default {
  data () {
    return {
      // 角色列表
      roleList: [],
      // 总条数
      total: 0,
      // 分页的数据
      pages: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10
      },
      // 弹层的打开和隐藏
      showDialog: false,
      // 角色表单的数据
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名不允许为空！', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名长度为2~10位', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getRole() // 获取角色列表
  },
  methods: {
    // 获取角色列表数据
    async getRole () {
      const { total, rows } = await getRoleList(this.pages)
      // console.log(total, rows)
      // 总条数
      this.total = total
      // 存储列表数据
      this.roleList = rows
    },
    // 分页点击页数
    changePage (newPage) {
      // newPage是当前点击的页码 修改页码
      this.pages.page = newPage // 将当前页码赋值给当前的最新页码
      // 重新调用接口，刷新列表
      this.getRole()
    },
    // 删除角色
    delRole (id) {
      // 1.提示信息==> 确认后删除
      // 2.调用接口删除===> 提示
      // 3.刷新列表
      this.$confirm('确定要删除吗？', '提示').then(async () => {
        // 点击确认
        await deleteRole(id)
        this.$message.success('删除成功！')
        // 重置页码
        this.pages.page = 1
        this.getRole()
      }).catch(console.log)
    },
    // 新增角色 打开弹层
    addRole () {
      this.showDialog = true
    },
    // 编辑角色 打开弹层
    async editRole (id) {
      this.showDialog = true
      // 获取当前点击角色的ID
      const res = await getRoleDetail(id)
      // console.log(res)
      this.roleForm = res
    },
    // 新增/编辑角色的 弹层确定按钮
    submitRole () {
      // 1.整体校验
      // 2.校验通过调用接口新增
      // 3.刷新列表+关闭弹窗
      this.$refs.roleForm.validate(async (isOK) => {
        if (isOK) {
          // 判断roleForm 内是否有ID ==> 有--编辑/ 无--新增
          if (this.roleForm.id) {
            await updateRole(this.roleForm)
            this.$message.success('修改角色成功!')
          } else {
            await addRole(this.roleForm)
            this.$message.success('新增角色成功！')
          }
          // 关闭弹层
          this.showDialog = false
          this.pages.page = 1
          // 刷新列表
          this.getRole()
          // 清空输入框的内容
          this.roleForm = {
            name: '',
            description: ''
          }
          // 清空校验
          this.$refs.roleForm.resetFields()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
