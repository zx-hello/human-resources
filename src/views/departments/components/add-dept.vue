<template>
  <!-- 放置弹层组件 -->
  <!-- form.id 根据是否有id去动态显示弹层的标题 -->
  <el-dialog
    :title="form.id ? '编辑部门' : '新增部门'"
    width="45%"
    :visible="showDialog"
    @close="close"
  >
    <!-- 新增部门表单项 -->
    <el-form ref="fm" label-width="120px" :model="form" :rules="rules">
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
          <!-- :value="item.username"===> 选中某个label后存储的值
             :label="item.username"===> 选项显示的值
          -->
          <el-option
            v-for="item in managers"
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
      <el-button type="primary" @click="addDept">
        {{ form.id ? "编辑完成" : "新增" }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/department'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    // 控制弹层的显示于隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作部门数据
    currentNode: {
      type: Object,
      default: () => ({})
    },
    // 校验code是否唯一时从父组件传来的数据
    allTreeData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    // 新增部门 填写部门的编码需要全局唯一
    /**
     * rule 规则
     * value 当前校验部门编码值
     * callback(函数) 是否校验通过
     */
    const validateCode = (rule, value, callback) => {
      // 如何判断一个值是唯一的==> 和所有的数据进行比对==>所有部门的数据
      // 使用some方法===> arr.some( item => value === item.code )
      /**
       * 关于新增和编辑的不同状态==> 校验规则动态变化
       * 1. 新增=> 不存在此部门 需要进行code比对=> 全局唯一
       * 2. 编辑=> 已存在此部门 无需进行code比对=> 排除自身
       */
      let flag
      // this.form.id 根据id去判断是在编辑状态还是新增状态
      if (this.form.id) {
        // 编辑 this.currentNode.code ==> 父部门传递过来的数据
        flag = this.allTreeData.some(item => value === item.code && value !== this.currentNode.code)
      } else {
        // 新增
        flag = this.allTreeData.some(item => value === item.code)
      }

      if (flag) {
        // 和之前存在的部门编码重复
        callback(new Error('新增部门编码重复,请重新输入!'))
      } else {
        callback()
      }
    }
    return {
      // 用户输入输入框的数据
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      // 对用户输入的数据进行验证==>校验规则的属性和要校验表单的属性一一对应
      rules: {
        name: [
          // required: true===>必填项(非空校验)
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          // 长度校验
          { min: 2, max: 50, message: '部门名称要求2-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 50, message: '部门编码要求2-50个字符', trigger: ['blur', 'change'] },
          // 复杂校验
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 300, message: '部门介绍要求2-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 部门负责人选择列表数据
      managers: []
    }
  },
  created () {
    this.getManagers()
  },
  methods: {
    // 关闭弹层
    close () {
      // console.log('关闭')
      this.$emit('close_dialog')
      // 手动清除弹窗内输入框的内容 => 编辑部门的功能需要
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 清空校验的残留和数据
      // 1.没有校验规则的数据不能被清除
      // 2.多出来的数据也不能清除
      this.$refs.fm.resetFields()
    },
    // 新增部门
    addDept () {
      // console.log('新增')
      this.$refs.fm.validate(async (isOk) => {
        // isOk ==> 整体校验是否通过 ==> true通过/ false不通过
        if (isOk) {
          // 通过校验
          if (this.form.id) {
            // 编辑状态
            await updateDepartments(this.form)
            this.$message.success('更新成功！')
          } else {
            // 新增状态
            // pid 父部门的ID：父传子  ===> currentNode
            // 1.pid传空===> 添加的顶层父部门
            // 2.pid有值===> 添加的就是子部门
            await addDepartments({ ...this.form, pid: this.currentNode.id || '' })
            this.$message.success('添加成功！')
          }
          // 刷新列表 ===> 告诉父组件
          this.$emit('update-tree')
          // 关闭弹层
          this.close()
        }
      })
    },
    // 获取负责人列表数据==>给新增部门做选择使用
    async getManagers () {
      const res = await getEmployeeSimple()
      // console.log('员工列表数据', res)
      this.managers = res
    },
    // 获取某个部门详情的数据 => 回填使用
    async getDept (id) {
      const res = await getDepartDetail(id)
      // console.log(res)
      // 回填数据
      this.form = res
    }
  }
}
</script>
