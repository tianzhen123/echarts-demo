/*
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-08-11 13:57:26
 * @LastEditors  : tianzhen
 * @LastEditTime : 2022-02-24 14:55:09 +0800
 */

// 基础配置
let basicOptions = {
    title: {
        text: '',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: 'bottom'
    },
}
// 基础饼图
export const basicPieChart = {
        ...basicOptions,
        series: [
            {
                name: '',
                type: 'pie',
                radius: '50%',
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
// 圆环图
export const circlePieChart = {
    ...basicOptions,
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: []
        }
    ]
}
// 南丁格尔玫瑰图
export const rosePieChart = {
    ...basicOptions,
    series: [
        {
            name: '',
            type: 'pie',
            radius: [30, 150],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
            data: []
        }
    ]
}


