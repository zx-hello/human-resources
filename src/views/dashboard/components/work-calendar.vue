<template>
  <el-calendar v-if="show" v-model="currentDate">
    <!-- #dateCell 具名插槽 插槽自定义日历单元格内容
         date 当前日期对象 通过new Date得到 ====>获取日期相关实例数据
         data 当前日期的数据 ====>data.day可以获取完整的处理过的年月日
     -->
    <template #dateCell="{ date, data }">
      <div class="date-content">
        <!-- 显示当前日期 -->
        <span class="text">{{ getDay(data.day) }}</span>
        <!-- 是否为休息日 -->
        <span v-if="isWeekend(date)" class="rest">休</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
/**
 * 问题：动态翻译element日历组件，星期不翻译问题--->重新刷新页面可以解决
 * 根源：星期是写死的，除非组件被重新创建
 * 解决：通过v-if销毁日历组件--->再重新创建
 * 什么时候销毁？ $i18n.locale变化的时候--->使用watch监听其变化
 */
export default {
  data () {
    return {
      currentDate: new Date(),
      // 日历组件的显示
      show: true
    }
  },
  watch: {
    // 监听一个对象上某个属性
    async '$i18n.locale' (newValue) {
      // console.log(newValue)
      // 销毁组件
      this.show = false
      // 等到销毁成功后，重新创建
      await this.$nextTick()
      this.show = true
    }
  },
  methods: {
    // 对于日期进行处理，只保留最后的日
    // day 当前日期格式 2021-07-16
    getDay (day) {
      // 获取年月日数据放到数组中
      const date = day.split('-')[2]
      return date
    },
    // 判断是否为休息日
    isWeekend (week) {
      // getDay得到的是一周中的某一天，1~6代表星期一~星期六  0 表示星期天
      return week.getDay() === 6 || week.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
// 覆盖日历组件单元格高度
::v-deep .el-calendar-day {
  height: 50px;
}
// 自定义日期显示的样式
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
// 休息时间
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
// 当前日期
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
</style>
