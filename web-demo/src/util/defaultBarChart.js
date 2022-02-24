/*
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-08-16 17:08:23
 * @LastEditors  : tianzhen
 * @LastEditTime : 2022-02-24 14:49:43 +0800
 */
// 基础配置
const basicOptions = {
    title: {
        text: '',
        left: 'center'
    },
    yAxis: {
        type: 'value'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 'bottom'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: {},
    series:[]
}

const basicBarChart = {
    ...basicOptions,
}
// 堆叠柱状图
const staticColumnChart = {
    ...basicOptions,
    
}
// 条形图
const barChart = {
    ...basicOptions,
}
// 堆叠条形图
const staticBarChart = {
    ...basicOptions,
}

const defaultBar = `option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  };`
export {
    basicBarChart,
    staticColumnChart,
    barChart,
    staticBarChart,
    defaultBar
}