<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <el-button type="primary" @click="addPoint(1, '0')">
              添加权限
            </el-button>
          </el-row>
        </div>
        <!-- card body 表格
            开启树形结构 ====> 数据是树形结构+row-key="id"
            default-expand-all 默认将树形结构全部直接展开
        -->
        <el-table border :data="list" row-key="id" default-expand-all>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPoint(2, row.id)"
              >
                添加
              </el-button>
              <el-button type="text" @click="editPoint(row.id)">编辑</el-button>
              <el-button type="text" @click="delPoint(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 添加权限的弹层  新增/编辑 -->
    <el-dialog
      :visible="showDialog"
      :title="formData.id ? '编辑权限' : '新增权限'"
      @close="close"
    >
      <el-form ref="fm" label-width="100px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">{{
            formData.id ? "修改" : "新增"
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 导入API
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
// 导入树形结构
import { formatTreeData } from '@/utils'
export default {
  name: 'Permission',
  data () {
    return {
      // 权限点的列表数据
      list: [],
      // 控制弹层的显示于隐藏
      showDialog: false,
      /**
       * enVisible	string	非必须 是否启用  0 不启用  1 启用
       * name	string	非必须 权限点名称
       * code	string	非必须 权限点标识(开发权限控制会使用)
       * description	string	非必须 权限点描述
       * type	number	非必须 权限类型  1-页面访问   2-页面下功能
       * pid	string	非必须 权限点父节点ID('0'表示页面权限   |  '1172702828368498688' 表示页面下功能权限)
       *
       */
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      rules: {
        name: [
          { required: true, message: '权限点名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限点标识不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getPermission()
  },
  methods: {
    // 获取权限点列表数据
    async getPermission () {
      const res = await getPermissionList()
      // console.log(res)
      // 处理树形结构
      this.list = formatTreeData(res)
    },
    // 关闭弹层的按钮
    close () {
      this.showDialog = false
      // 由于新增和编辑使用同一个弹层
      // 清空输入框内上次输入的内容
      this.formData = {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
      // 清除校验规则
      this.$refs.fm.resetFields()
    },
    // 提交新增或编辑
    submit () {
      /**
       * 1.整体校验
       * 2.调用接口
       * 3.提示并刷新列表
       * 4.关闭弹层
       */
      this.$refs.fm.validate(async (isOk) => {
        if (isOk) {
          // 根据是否有ID去判断用户点击的是新增还是编辑
          if (this.formData.id) {
            // 编辑
            await updatePermission(this.formData)
          } else {
            // 新增
            await addPermission(this.formData)
          }

          // 更新列表数据
          this.getPermission()
          this.$message.success(this.formData.id ? '编辑成功！' : '新增成功！')
          this.showDialog = false
        }
      })
    },
    // 添加权限点
    /**
     * type 权限点的类型  1-页面访问   2-页面下的功能
     * pid 父节点   若是页面权限--->0   相反传递父的id
     */
    addPoint (type, pid) {
      /**
       * 需求： 1.页面访问
       *       2.页面下的功能
       */
      // 打开弹层
      this.showDialog = true
      // console.log(type, pid)
      // 存储type和pid--->为了提交的时候，新增调用接口使用
      this.formData.type = type
      this.formData.pid = pid
    },
    // 删除权限按钮
    // row 当前点击权限点的数据
    async delPoint (row) {
      /**
       * 1.判断是否有子，有就不允许直接删除
       * 2.询问+调用接口删除
       * 3.提示+刷新列表
       */
      if (row.children && row.children.length > 0) return this.$message.error('不允许直接删除父权限点！')
      this.$confirm('确定要删除吗？', '温馨提示').then(async () => {
        await delPermission(row.id)
        // 更新列表数据
        this.getPermission()
        this.$message.success('删除成功！')
      }).catch(console.log)
    },
    // 编辑当前行权限点
    async editPoint (id) {
      // 1.打开弹层
      // 2.调用接口获取数据，回填数据
      this.showDialog = true
      const res = await getPermissionDetail(id)
      // console.log(res)
      // 数据回填
      this.formData = res
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
