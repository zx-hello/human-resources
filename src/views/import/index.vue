<template>
  <div class="import-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <span>批量导入员工</span>
        </div>
        <!-- card body -->
        <!-- excel导入组件 -->
        <!-- 父传子：
          :before-upload="beforeUpload" 校验文件
          :on-success="handleSuccess" 校验通过后，获取读取到的excel数据的
        -->
        <UploadExcel
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
// 对于excel读取的时间进行纠正
import { formatExcelDate } from '@/utils/index'
// 导入API接口读取到exce员工数据接口
import { importEmployees } from '@/api/employees'
export default {
  name: 'Import',
  methods: {
    // 读取选择的excel文件之前，会先执行这个校验函数
    // 作用：校验文件格式和大小
    // 用法：校验通过返回true，失败返回false(不会执行handleSuccess函数)
    beforeUpload (file) {
      // console.log('上传之前校验', file)
      // // 满足小于1M的可以上传   file.size：单位是字节(byte)
      // const isLt1M = file.size / 1024 / 1024 < 1
      // if (isLt1M) {
      //   // 必须返回true才会继续执行
      //   return true
      // }

      return true
    },
    // 校验通过后才执行
    // result 读取到的excel数据--->得到一个对象--->内部有header和results
    // header：
    async handleSuccess ({ header, results }) {
      // console.log(header, results)
      // console.log(this.transformResults(results))
      await importEmployees(this.transformResults(results))
      this.$message.success('导入员工数据成功！')
      // 需要返回员工列表==>查看导入的数据
      this.$router.back()
    },
    // 转换读取到的员工数据将其键key==>转成英文的key
    // results: 接口要转换的数据
    transformResults (results) {
      // 中英对照表(映射关系)==>根据读取的数据,设置中文key对应的后台中的英文key
      const zhToen = {
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      /**
       * 步骤:
       * 1.准备一个新数组
       * 2.循环外层数组-->循环中文key的员工数据 [{姓名:'zx'}, {姓名:'zxc'}] ==> forEach循环
       * 3.循环内层-->循环的是中文key的员工数据 {姓名:'zx'} ==>for in 循环
       *   获取中文key ==> 通过zhToen(中英对照表)关系 ==> zhToen[中文key] 替换中文key为英文key
       *   push到新数组中
       * 4.返回新数组
       *
       * 注:问题说明:excel中读取到的时间是不正确的
       *    excel得到的时间是比正确时间多70年
       */
      const newArr = []
      results.forEach(item => {
        // item就是中文key的员工数据
        const newItem = {}
        for (const zhKey in item) {
          // 获取enKey英文属性
          const enKey = zhToen[zhKey]
          // 进行判断==>对于时间问题进行修正 timeOfEntry和correctionTime要处理
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            newItem[enKey] = formatExcelDate(item[zhKey], '-')
          } else {
            // 放到新对象上并赋值
            newItem[enKey] = item[zhKey]
          }
        }
        // push到新数据
        newArr.push(newItem)
      })
      // 返回处理完的新数组
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
