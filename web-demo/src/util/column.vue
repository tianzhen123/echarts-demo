<!--
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-08-13 08:58:29
 * @LastEditors: Set Name
 * @LastEditTime: 2021-08-13 09:04:07
-->
<template>
    <div :class="['g-chart-wrap', {'padding-header' : !noPaddingHeader}]">
        <div :class="['g-chart', { 'no-data': !data.length }]" ref="gChart"></div>
    </div>
</template>

<script>
import { merge } from 'lodash'
import { debounce } from 'throttle-debounce'
import chartMixin from "./mixins"
// import { fetchBuriedPoint } from "@/common/buriedPointReceive"
export default {
    name: 'GColumn',
    mixins: [
        chartMixin,
    ],
    props: {
        data: Array,
        chartName: String,
        xAxisData: Array,
        legend: {
            type: Array,
            default () {
                return []
            }
        },
        noPaddingHeader: Boolean,
        chartOption: Object,
        disableZoom: {
            type: Boolean,
            default: false
        },
        zoomPosition: {
            type: Object,
            default () {
                return {}
            }
        },
        manualRender: {
            type: Boolean,
            default: false
        },
        reverse: {
            type: Boolean,
            default: false
        },
        stackGroup: {
            type: Array,
            default () {
                return []
            }
        },
        selectable: {
            type: Boolean,
            default: false
        },
        // 默认高亮某个柱，目前只支持单系列
        defaultActive: Number,
        // 图表自定义绑定事件
        bindEvents: Function,

        maxZoomCount: {
            type: Number,
            default: 8
        },
        // 引用组件名称
        componentName: String, 
    },
    data () {
        return {
            chart: null,
            isResizeWithoutData: false,
            dataZoomCount: this.maxZoomCount,
            legendSelected: {},
            axisPointerIndex: 0,
            selectStateStore: {}
        }
    },
    computed: {
        zoomOpen () {
            return this.xAxisData.length > this.dataZoomCount
        },
        fullChartWidth () {
            if (!this.data.length) return 0
            // 多加100为左右间距等额外宽度
            return (this.data[0].data.length + 1) * 100
        },
    },
    watch: {
        data () {
            if (!this.manualRender) {
                this.draw()
            }
        },
        legend () {
            this.initLegendState()
        },
        xAxisData (value) {
            this.axisPointerIndex = value.length - 1
        }
    },
    methods: {
        getOption () {
            let option = {
                tooltip: {
                    confine: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line' // 'line' | 'shadow'
                    }
                },
                grid: {
                    top: this.noPaddingHeader ? 80 : '8%',
                    right: '3%',
                    bottom: 36,
                    left: '3%',
                    containLabel: true
                },
                legend: {
                    data: this.legend.map(item => {
                        return {
                            ...item,
                            icon: 'circle'
                        }
                    })
                },
                xAxis: [
                    {
                        data: this.xAxisData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                animation: true,
                series: this.getSeriesData(),
                dataZoom: this.dataZoomOption(),
            }
            let chartOption = merge(option, this.chartOption)
            if (this.reverse) {
                let temp = chartOption.xAxis
                chartOption.xAxis = chartOption.yAxis
                chartOption.yAxis = temp
                chartOption.series.forEach(item => {
                    item.data.reverse()
                })
                chartOption.yAxis.forEach(item => {
                    item.data.reverse()
                })
            }
            // console.log('column', JSON.stringify(chartOption, null, 2));
            return chartOption
        },
        getSeriesData() {
            if (!this.stackGroup.length) return this.data
            this.stackGroup.forEach((group, index) => {
                group.forEach(i => {
                    this.data[i].stack = index + ''
                })
            })
            return this.data
        },
        dataZoomOption() {
            if (this.disableZoom) {
                return []
            }
            const width = this.$refs.gChart.clientWidth
            if (!this.reverse) {
                this.dataZoomCount = Math.floor(width / 100)
            }
            let config
            if (this.reverse) {
                config = {
                    yAxisIndex: [0],
                    startValue: this.zoomOpen ? this.xAxisData.length - this.dataZoomCount : 0,
                    endValue: this.xAxisData.length - 1,
                    top: 30,
                    width: 5,
                    height: '70%'
                }
            } else {
                config = {
                    xAxisIndex: [0],
                    startValue: 0,
                    endValue: this.zoomOpen ? this.dataZoomCount - 1 : this.xAxisData.length - 1,
                    bottom: this.zoomPosition.bottom != undefined ? this.zoomPosition.bottom : 26,
                    height: 5,
                }
            }
            return [
                {
                    ...config,
                    show: this.zoomOpen,
                    type: 'slider',
                    filterMode: 'empty', // 'empty' | 'weakFilter' | 'filter'
                    showDataShadow: false,
                    borderColor: 'transparent',
                    fillerColor: '#a7b7cc',
                    backgroundColor: '#959595',
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z',
                    handleSize: 10,
                    // handleStyle: {
                    //     shadowBlur: 8,
                    //     shadowOffsetX: 0,
                    //     shadowOffsetY: 0,
                    //     shadowColor: '#aaa'
                    // },
                    labelFormatter: '',
                    minValueSpan: 1,
                    zoomLock: false // 不是移动端标识
                },
                {
                    disabled: !this.zoomOpen,
                    type: 'inside',
                    zoomLock: true,
                    zoomOnMouseWheel: this.zoomOpen
                }
            ]
        },
        draw () {
            if (!this.data.length) {
                if (this.chart) {
                    this.chart.clear()
                }
                return
            }
            if (!this.chart) {
                this.chart = this.$echarts.init(this.$refs.gChart)
                // 点击柱状图柱生效
                this.chart.on('click', param => {
                    if (this.selectable) {
                        const { seriesIndex, dataIndex } = param
                        this._toggleSelectState(seriesIndex, dataIndex)
                        this.data[seriesIndex].data[dataIndex]['itemStyle'] = this._barSelectStyle()
                        this.data[seriesIndex].data.forEach((item, index) => {
                            if (dataIndex !== index) {
                                this.data[seriesIndex].data[index]['itemStyle'] = {}
                                this._toggleSelectState(seriesIndex, index, false)
                            }
                        })
                        param['_selected'] = this.selectStateStore[seriesIndex][dataIndex]
                        this.chart.setOption({
                            series: this.data
                        })
                    }
                    this.$emit('item-click', param.data._id, param, this.chartName, this)
                })
                // 使用getZr添加图表的整个canvas区域的点击事件，并获取params携带的信息
                this.chart.getZr().on('click', (params) => {
                    let pointInPixel= [params.offsetX, params.offsetY]
                    if (this.chart.containPixel('grid', pointInPixel)) {
                        /*此处添加具体执行代码*/
                        // 调用埋点接口
                        // if (this.gChartParent.viewParam && this.gChartParent.viewParam.hasOwnProperty("viewType")) {
                        //     fetchBuriedPoint({ eventCode: `${this.gChartParent.$attrs.code}_${this.gChartParent.viewParam.viewType}_chart_click` });
                        // } else {
                        //     // 排除Kit通用组件
                        //     if (!this.gChartParent.$attrs.code.includes("Kit") && !this.gChartParent.$attrs.code.includes("Mobile")) {
                        //         fetchBuriedPoint({ eventCode: `${this.gChartParent.$attrs.code}_chart_click` });
                        //     }
                        // }
                    }
                })
                const handleUpdateAxisPointer = debounce(100, param => {
                    if (param.axesInfo.length) {
                        const dataIndex = param.dataIndex
                        const { rowData, xAxisItem } = this._getRowDataByLegendSelected(dataIndex)
                        this.axisPointerIndex = dataIndex
                        this.$emit('update-axis-pointer', rowData, xAxisItem)
                    }
                })
                this.chart.on('updateAxisPointer', param => {
                    handleUpdateAxisPointer(param)
                })
                this.chart.on('legendselectchanged', param => {
                    this.legendSelected = param.selected
                    const { rowData, xAxisItem } = this._getRowDataByLegendSelected(this.axisPointerIndex)
                    this.$emit('update-axis-pointer', rowData, xAxisItem)
                    this.$emit('legend-select-changed', param, this.legendSelected)
                })
                if (this.bindEvents) {
                    this.bindEvents(this.chart)
                }
                window.addEventListener('resize', this.resizeChart)
            }
            
            // trigger the animation
            this.chart.clear()
            this.chart.setOption(this.getOption())
            this.selectStateStore = {}
            // 空数据下变动视图大小再渲染需要调用 resize
            if (this.isResizeWithoutData) {
                this.chart.resize()
                this.isResizeWithoutData = false
            }
            /**
             * 在默认动画 duration 之后关闭堆叠柱形图动画，防止在使用 datazoom 时触发动画
             * https://www.echartsjs.com/option.html#animationDuration
             */
            if (this.stackGroup.length) {
                setTimeout(() => {
                    this.chart.setOption({
                        animation: false
                    })
                }, 1000)
            }
            if (this.defaultActive !== undefined) {
                const { series, yAxis } = this.chart.getOption()
                const seriesIndex = 0
                const len = series[seriesIndex].data.length
                const dataIndex = this.defaultActive
                const item = series[seriesIndex].data[dataIndex]
                const name = yAxis[seriesIndex].data[dataIndex].value
                if (item.value) {
                    item['itemStyle'] = this._barSelectStyle()
                    this.chart.setOption({
                        series: series
                    })
                }
                this._toggleSelectState(seriesIndex, dataIndex)
                item['_selected'] = this.selectStateStore[seriesIndex][dataIndex]
                this.$emit('default-active-change', item._id, name, item)
            }
        },
        resetDataZoomOption() {
            this.chart.setOption({
                dataZoom: this.dataZoomOption()
            })
        },
        resizeChart() {
            if (!this.data.length) {
                this.isResizeWithoutData = true
                return
            }
            this.resetDataZoomOption()
            this.chart.resize()
        },
        getLastRowData() {
            const index = this.xAxisData.length - 1
            return this._getRowData(index)
        },
        _getRowData(dataIndex) {
            const rowData = []
            const xAxisItem = this.xAxisData[dataIndex]

            this.getSeriesData().forEach(serie => {
                rowData.push({
                    name: serie.name,
                    value: serie.data[dataIndex].value,
                    _id: serie.data[dataIndex]._id
                })
            })
            return {
                rowData,
                xAxisItem
            }
        },
        _getRowDataByLegendSelected(dataIndex) {
            const rowData = []
            const xAxisItem = this.xAxisData[dataIndex]

            this.getSeriesData().forEach(serie => {
                const { name } = serie
                if (this.legendSelected[name]) {
                    rowData.push({
                        name,
                        value: serie.data[dataIndex].value,
                        _id: serie.data[dataIndex]._id
                    })
                }
            })
            return {
                rowData,
                xAxisItem
            }
        },
        _toggleSelectState(seriesIndex, dataIndex, flag) {
            if (!this.selectStateStore[seriesIndex]) {
                this.$set(this.selectStateStore, seriesIndex, {})
            }
            this.$set(
                this.selectStateStore[seriesIndex],
                dataIndex,
                flag == undefined ? !this.selectStateStore[seriesIndex][dataIndex] : flag
            )
        },
        _barSelectStyle() {
            return {
                barBorderWidth: -5,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 10
            }
        },
        initLegendState() {
            const selected = {}
            this.legend.forEach(item => {
                const name = item.name
                selected[name] = true
            })
            this.legendSelected = selected
        },
        getDataURL(option) {
            if (!this.chart) {
                return
            }
            const needMutipleImage = this.zoomOpen && !this.disableZoom
            // 有缩放 展开图表
            if (needMutipleImage) {
                this.$refs.gChart.style.width = this.fullChartWidth + 'px'
                this.chart.clear()
                this.chart.setOption({
                    ...this.getOption(),
                    // 禁用动画，否则直接调用 getDataURL() 会导出动画刚开始时的图
                    animation: false,
                    dataZoom: []
                })
                // resize 保证新图表的宽度为重新设置之后的
                this.resizeChart()
            }
            return this.chart.getDataURL(option)
        }
    },
    mounted () {
        this.draw()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeChart)
        if (this.chart) {
            this.chart.clear()
        }
    }
}
</script>
