/*
 * @Description: 折线图
 * @Autor: tianzhen
 * @Date: 2021-08-16 10:13:17
 * @LastEditors  : tianzhen
 * @LastEditTime : 2022-02-24 14:49:50 +0800
 */
const basicOptions = {
    title: {
        text: '',
        left: 'center'
    },
    legend: {
        top: 'bottom'
    },
    tooltip: {
        trigger: 'axis'
    },
    yAxis: {
        type: 'value'
    },
    xAxis:{},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    series: []
}
// 基础折线图
const basicLine = {
    ...basicOptions,
};

// 折线堆叠图
const stackedLineChart = {
    ...basicOptions,
}

// 基础面积图
const basicAreaChart = {
    ...basicOptions,
}

// 堆叠区域图
const stackedAreaChart = {
    ...basicOptions,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    }

}

const defaultLine = `option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };`

export {
    basicLine,
    stackedLineChart,
    basicAreaChart,
    stackedAreaChart,
    defaultLine
}