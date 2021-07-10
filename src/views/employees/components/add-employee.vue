<template>
  <el-dialog width="50%" title="新增员工" :visible="showDialog" @close="close">
    <!-- 表单 -->
    <el-form ref="fm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dataTypes.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- 显示选择的部门数据 -->
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="showTree = true"
        />
        <!-- 选择部门的数据 -->
        <!-- 方法一 -->
        <!-- <ElDepSelect
          :visible="showTree"
          @close-dept="showTree = false"
          @current-select="getDept"
        ></ElDepSelect> -->
        <!-- 方法二 -->
        <ElDepSelect
          :visible.sync="showTree"
          @current-select="getDept"
        ></ElDepSelect>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="add">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 引入聘用形式的数据字典
import dataTypes from '@/api/constant/employees'
// 引入API
import { addEmployee } from '@/api/employees'
// 引入格式化时间
import { parseTime } from '@/utils'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 聘用形式数据
      dataTypes,
      // 控制部门选择的显示与隐藏
      showTree: false,
      // 定义表单数据
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      },
      // 校验规则
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          // 传入正则,使用正则进行校验
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    // 关闭弹层
    close () {
      this.$emit('close-dialog')
    },
    // 新增员工
    add () {
      /**
       * 1.整体校验==>全部通过校验继续执行
       * 2.调用接口入库==>提示
       * 3.刷新列表+关闭弹窗
       */
      this.$refs.fm.validate(async (isOk) => {
        if (isOk) {
          // 成功
          // 时间格式化后==>入库 timeOfEntry(入职时间), correctionTime(转正时间)
          this.formData.timeOfEntry = parseTime(this.formData.timeOfEntry, '{y}-{m}-{d}')
          this.formData.correctionTime = parseTime(this.formData.correctionTime, '{y}-{m}-{d}')
          await addEmployee(this.formData)
          this.$message.success('添加成功')
          // 关闭弹层
          this.close()
          // 刷新列表
          // this.$parent 父组件===> 员工列表组件实例==>直接调用父组件的方法
          // this.$children 可以获得子组件内的方法
          this.$parent.getList()
        }
      })
    },
    // 选择部门数据 子传父传递过来的数据
    getDept (node) {
      this.formData.departmentName = node.name
    }
  }
}
</script>
