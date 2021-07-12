<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <PageTools>
            <!-- 插入到left插槽位置 -->
            <template #left>
              <span>总记录数：{{ total }}条</span>
            </template>
            <!-- 插入到right插槽位置 -->
            <template #right>
              <el-button
                type="warning"
                size="small"
                @click="$router.push('/import')"
              >
                导入excel
              </el-button>
              <el-button type="danger" size="small" @click="exportEmployees">
                导出excel
              </el-button>
              <el-button type="primary" size="small" @click="showDialog = true">
                新增员工
              </el-button>
            </template>
          </PageTools>
        </div>
        <div>
          <!-- table列表 -->
          <!-- :default-sort="{prop: 'workNumber', order: 'descending'}" 指定当前页加载后,数据按照哪一页进行排序
                指定排序的列:prop
                指定排序方式:descending 降序 , ascending 升序
           -->
          <el-table
            border
            :data="list"
            :default-sort="{ prop: 'workNumber', order: 'descending' }"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="staffPhoto" label="头像">
              <template #default="{ row }">
                <img
                  slot="reference"
                  :src="row.staffPhoto"
                  class="staff"
                  fit="fill"
                  @click="showCode(row.staffPhoto)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="workNumber" label="工号" />
            <el-table-column prop="formOfEmployment" label="聘用形式">
              <template #default="{ row }">
                {{ formatEmployment(row.formOfEmployment) }}
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" />
            <!-- sortable="true" 开启当前列数据排序 前端的一个假排序 (只能排序当前页的数据) -->
            <el-table-column sortable prop="timeOfEntry" label="入职时间">
              <template #default="{ row }">
                {{ formatDate(row.timeOfEntry) }}
              </template>
            </el-table-column>
            <el-table-column label="账户状态">
              <el-switch v-model="active"></el-switch>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="goToDetail(row.id)">
                  查看
                </el-button>
                <el-button type="text" size="small">分配角色</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="delEmployee(row.id)"
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
            <!-- sizes 用户指定选择展示几条数据
               :page-sizes="[2, 5, 10]" 供用户选择每页展示几条
               @size-change="changeSize" 函数 将列表渲染成用户选择的展示几条数据
          -->
            <el-pagination
              :total="total"
              :current-page="params.page"
              :page-size="params.size"
              :page-sizes="[2, 5, 10]"
              layout="prev, pager, next, sizes, total"
              @current-change="changePage"
              @size-change="changeSize"
            />
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- 弹出层插件 -->
    <AddEmployee
      :show-dialog="showDialog"
      @close-dialog="showDialog = false"
    ></AddEmployee>

    <!-- 二维码弹层 -->
    <el-dialog
      width="300px"
      title="二维码"
      :visible="codeDialog"
      @close="codeDialog = false"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 全局插件无需导入(在component/PageTools/index.vue注册组件-->在main.js中进行挂载Vue.use() )
// import PageTools from '@/components/PageTools'
// 导入API
import { getEmployeeList, delEmployee } from '@/api/employees'
// 导入数据字典
import dataTypes from '@/api/constant/employees'
/**
 * 格式化el-table某一列数据:
 * 1.使用作用域插槽获取当前行数据
 * 2.在methods中定义格式化方法
 */
// 导入时间格式化插件
import dayjs from 'dayjs'
// 引入弹出层插件
import AddEmployee from './components/add-employee.vue'
// 导入二维码插件
import QrCode from 'qrcode'
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  data () {
    return {
      // 存储员工的数组
      list: [],
      // 总条数
      total: 0,
      params: {
        // 当前页
        page: 1,
        // 每条页数
        size: 10
      },
      // 账户状态
      active: true,
      // 弹出层的显示或隐藏
      showDialog: false,
      // 控制二维码弹层的显示与隐藏
      codeDialog: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取员工数据
    async getList () {
      const { total, rows } = await getEmployeeList(this.params)
      // console.log(rows)
      this.total = total
      this.list = rows
    },
    // 分页切换列表数据
    changePage (newPage) {
      this.params.page = newPage
      // 刷新数据
      this.getList()
    },
    // 切换每页多少条数据
    changeSize (size) {
      this.params.size = size
      this.getList()
    },
    // 格式化聘用形式-->通过数据字典-->根据数字,找到数字代表的含义
    formatEmployment (type) {
      // console.log('数据字典', dataTypes.hireType)
      /**
       * 1.生成映射关系 => {1: '正式', 2: '非正式'}
       * 2.根据映射关系找到对应数字的value值
       * 3.一定要记得 return!!!
       */
      const maps = {}
      dataTypes.hireType.forEach(item => {
        maps[item.id] = item.value
      })
      return maps[type]
    },
    // 格式化时间的方法
    // str='默认值'  str若不传值,则显示默认值
    formatDate (value, str = 'YYYY-MM-DD') {
      return dayjs(value).format(str)
    },
    // 删除按钮操作
    delEmployee (id) {
      /**
       * 1.用户确认=确认后
       * 2.调用接口删除
       * 3.刷新列表
       */
      this.$confirm('确定要删除吗？', '提示').then(async () => {
        // 点击确认
        await delEmployee(id)
        this.$message.success('成功删除！')
        // 有个bug==>element-UI的bug==>处理最后一页数据时,删除最后一页的最后一条数据时
        // 删除完成后,页码显示正确,但是数据显示错误(刷新列表使用的是上次的)
        /**
         * 步骤:
         * 1.重新计算页码 ==> 公式:  总条数/每页条数=页码
         * 2.和之前的页码进行对比=>条件:之前页码 > 重新计算页码 ===>修正页码
         * 例如:共8页数据,将第8页数据全部删除=>还剩余7页
         */
        // 纠正页码错误
        // this.total - 1 ==> 由于上面的代码操作已经删除一条数据了==>需要总数减去这被删除的一条数据
        const newPage = Math.ceil((this.total - 1) / this.params.size)
        // 默认页码最小为 1
        if (newPage > 0) {
          // 纠正页码
          this.params.page = this.params.page > newPage ? newPage : this.params.page
        }
        // 更新渲染的数据
        this.getList()
      }).catch(console.log)
    },
    // 导出员工列表的数据
    async exportEmployees () {
      //  按需加载js模块使用===>懒加载==>依赖script-loader包
      const excel = await import('@/utils/Export2Excel')
      // console.log(excel)
      // console.log(this.transformList(this.list))
      // 指定导出得字段(映射关系)
      const maps = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 取出对象内所有得键，导出得头数据
      const header = Object.keys(maps)
      // 过滤头
      const filterHeader = Object.values(maps)
      // 转换二维数组
      const data = this.transformList(this.list, filterHeader)
      excel.export_json_to_excel({
        // 数据部分
        header: header, // 指定导出的表头
        data: data,
        // 指定导出的文件名
        filename: 'testExport',
        // 单元格每列自适应宽度
        autoWidth: true,
        // 导出的文件格式
        bookType: 'xlsx'
      })
    },
    transformList (list, filterHeader) {
      /**
       * 核心：将list列表数据转换成二维数组
       * 1.准备一个空数组==>存储转换结果
       * 2.第一层循环==> 当前页的员工列表数据--->forEach ==> [{}, {}]
       * 3.第二层循环==> 循环当前员工对象数据--->for in ==> {}
       *    1.创建一个空数组==>只存储value值(员工信息)
       *    2.将存完值得空数组push到外层定义得数组中
       * 4.返回处理完得结果
       */
      const secondArr = []
      list.forEach(item => {
        // item ===> {}
        const newArr = []
        for (const key in item) {
          // 根据指定得头去进行导出，过滤数据==>只留下maps里指定导出的数据项
          if (filterHeader.includes(key)) {
            // 判断formOfEmployment(聘用形式) 需要格式换后去push
            if (key === 'formOfEmployment') {
              newArr.push(this.formatEmployment(item[key]))
            } else {
              newArr.push(item[key])
            }
          }
        }
        secondArr.push(newArr)
      })
      return secondArr
    },
    // 跳转到查看员工信息详情页
    goToDetail (id) {
      this.$router.push({ path: `/employees/detail/${id}` })
    },
    showCode (url) {
      // 如果没有图片，则不展示弹层
      if (!url) return
      this.codeDialog = true
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.employees-container {
  .staff {
    width: 68px;
    height: 68px;
    border-radius: 100%;
  }
}
</style>
