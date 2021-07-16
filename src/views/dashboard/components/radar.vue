<template>
  <div>
    <el-switch
      v-model="value1"
      active-text="开启雷达图轮巡"
      inactive-text="关闭雷达图轮巡"
      :active-value="true"
      :inactive-value="false"
      @change="change"
    >
    </el-switch>
    <!-- 准备绘制雷达图的盒子 -->
    <div ref="radar" class="radarBox"></div>
  </div>
</template>

<script >
// // // 全量引入echarts图表
// // import * as echarts from 'echarts'

// // 按需引入echarts图表
// // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// import * as echarts from 'echarts/core'
// // 引入柱状图图表，图表后缀都为 Chart
// import {
//   // BarChart // 柱状图
//   RadarChart
// } from 'echarts/charts'
// // 引入提示框，标题，直角坐标系组件，组件后缀都为 Component(配套组件)
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent
// } from 'echarts/components'
// // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
// import {
//   CanvasRenderer
// } from 'echarts/renderers'
// // 注册必须的组件
// echarts.use(
//   // [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]
//   [TitleComponent, TooltipComponent, GridComponent, RadarChart, CanvasRenderer]
// )

export default {
  data () {
    return {
      value1: false,
      list: [],
      // 定时器ID
      timerID: null
    }
  },
  mounted () {
    // 只有这个时候DOM元素才创建好 才可以拿到DOM元素
    this.drawRadar()
  },
  beforeDestroy () {
    clearInterval(this.timerID)
  },
  methods: {
    // 绘制图表
    drawRadar () {
      const data = []
      // 外层循环造3挑假数据
      for (let i = 0; i < 3; i++) {
        const per = { value: [], name: `李${i}` }
        // 制造6个指标项数据====>value
        for (let j = 0; j < 6; j++) {
          per.value.push(Math.floor(Math.random() * 100 + 1))
        }
        data.push(per)
      }
      this.list = data

      // 基于准备好的dom，初始化echarts实例
      const myChart = this.echarts.init(this.$refs.radar)
      // 绘制图表 1. 准备对应的
      // 绘制的配置文件
      const opt = {
        // title: {
        //   text: '基础雷达图'
        // },
        // 鼠标放上去的提示信息
        tooltip: {},
        // legend: {
        //   data: ['张三', '李四']
        // },
        radar: {
          // shape: 'circle',
          axisName: {
            // textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
            // }
          },
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [{
          type: 'radar',
          // areaStyle: {normal: {}},
          data: this.list
          // [
          //   {
          //     value: [10, 1, 90, 20, 100, 30],
          //     name: '张三'
          //   },
          //   {
          //     value: [50, 50, 50, 50, 50, 10],
          //     name: '李四'
          //   },
          //   {
          //     value: [73, 27, 45, 93, 17, 23],
          //     name: '王五'
          //   }
          // ]
        }]
      }
      myChart.setOption(opt)
    },
    // 点击开关，是否启动雷达图的轮巡状态
    change () {
      if (this.timerID) {
        clearInterval(this.timerID)
        this.timerID = null
        return
      }
      this.timerID = setInterval(this.drawRadar, 1000)
    }
  }
}

</script>

<style lang="scss" scoped>
// 样式
.radarBox {
  width: 100%;
  height: 400px;
}
</style>
