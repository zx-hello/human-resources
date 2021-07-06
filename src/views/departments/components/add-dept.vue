<template>
  <!-- 放置弹层组件 -->
  <el-dialog title="新增部门" width="45%" :visible="showDialog" @close="close">
    <!-- 新增部门表单项 -->
    <el-form label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :value="item.username"
            :label="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          v-model="form.introduce"
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
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 用户输入输入框的数据
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 对用户输入的数据进行验证
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 部门负责人选择列表数据
      peoples: []
    }
  },
  mounted () {
    this.getEmployees()
  },
  methods: {
    // 关闭弹层
    close () {
      console.log('关闭')
      this.$emit('close_dialog')
      // 清除弹窗内输入框的内容
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    // 新增部门
    addDept () {
      console.log('新增')
    },
    // 获取员工列表数据
    async getEmployees () {
      const res = await getEmployeeSimple()
      console.log('员工列表数据', res)
      this.peoples = res
    }
  }
}
</script>
