/*
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-08-16 17:08:23
 * @LastEditors: Set Name
 * @LastEditTime: 2021-08-16 19:09:15
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

export {
    basicBarChart,
    staticColumnChart,
    barChart,
    staticBarChart
}