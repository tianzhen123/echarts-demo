/*
 * @Description: 折线图
 * @Autor: tianzhen
 * @Date: 2021-08-16 10:13:17
 * @LastEditors: Set Name
 * @LastEditTime: 2021-08-16 19:03:28
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

export {
    basicLine,
    stackedLineChart,
    basicAreaChart,
    stackedAreaChart
}