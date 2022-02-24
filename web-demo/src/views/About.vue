<!--
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-05-22 11:07:56
 * @LastEditors  : tianzhen
 * @LastEditTime : 2022-02-24 16:40:30 +0800
-->
<template>
	<div class="about">
		<el-form
			class="titleForm"
			ref="form"
			:model="form"
			label-width="80px"
			:rules="formRules"
		>
			<el-form-item label="名称">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="数据源地址" prop="source">
				<el-input v-model="form.source" autocomplete="on"></el-input>
			</el-form-item>
			<el-form-item label="选择模板" prop="model">
				<el-select
					v-if="form.delivery"
					v-model="form.model"
					placeholder="请选择"
					@change="selectModel"
				>
					<el-option
						v-for="(item,index) in options"
						:key="index"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
				<el-cascader
					v-else
					v-model="form.model"
					:options="options2"
					@change="handleChange"
				></el-cascader>
			</el-form-item>

			<el-form-item label="点击事件">
				<el-input
					type="textarea"
					:rows="2"
					placeholder="请输入内容"
					v-model="form.textarea"
				>
				</el-input>
			</el-form-item>

			<el-form-item label="是否自定义">
				<el-switch
					v-model="form.delivery"
					@change="switchChange"
					active-color="#13ce66"
					inactive-color="#ff4949"
				>
				</el-switch>
			</el-form-item>
		</el-form>
		<div class="content">
			<div class="content-left">
				<editor
					height="500"
					width="100%"
					ref="editor"
					v-model="code"
					v-if="form.delivery"
					:options="{
						enableBasicAutocompletion: true,
						enableSnippets: true,
						enableLiveAutocompletion: true,
						tabSize: 2,
						fontSize: 20,
						showPrintMargin: false, //去除编辑器里的竖线
					}"
					:lang="'javascript'"
					@init="editorInit"
				>
				</editor>
				<el-form
					class="content-form"
					v-else
					ref="form2"
					:model="form2"
					label-width="80px"
				>
					<el-form-item label="组件标题">
						<el-input v-model="form2.title"></el-input>
					</el-form-item>
					<el-form-item label="提示框名称" v-if="chartType == 'pie'">
						<el-input v-model="form2.tooltipName"></el-input>
					</el-form-item>
					<el-form-item label="是否显示图例">
						<el-switch
							v-model="form2.legendShow"
							active-color="#13ce66"
							inactive-color="#ff4949"
						>
						</el-switch>
					</el-form-item>
					<el-form-item label="是否显示提示框">
						<el-switch
							v-model="form2.tooltipShow"
							active-color="#13ce66"
							inactive-color="#ff4949"
						>
						</el-switch>
					</el-form-item>
				</el-form>
			</div>

			<div class="content-right">
				<div class="echart" id="echart-line"></div>
			</div>
		</div>
		<el-button @click="btnClick">预览</el-button>
	</div>
</template>
<script>
import * as echarts from "echarts";
import Editor from "vue2-ace-editor";
import {
	basicPieChart,
	circlePieChart,
	rosePieChart,
} from "../util/defaultCharts.js";
import {
    defaultLine,
	basicLine,
	stackedLineChart,
	basicAreaChart,
	stackedAreaChart,
} from "../util/defaultLineChart";
import {
    defaultBar,
	basicBarChart,
	staticColumnChart,
	barChart,
	staticBarChart,
} from "../util/defaultBarChart";
import {
    defaultPie
} from "../util/defaultPieChart"
export default {
	components: {
		Editor,
	},
	data() {
		return {
			chart: null,
			chartType: null,
			code: null,
			form: {
				name: "",
				source: "http://10.2.94.22:3000/",
				delivery: false,
				model: 'defaultLine',
				textarea: "",
			},
			form2: {
				title: "",
				tooltipName: "",
				legendShow: true,
				tooltipShow: true,
			},
			options: [
				{
					value: 'defaultLine',
					label: "折线图",
				},
				{
					value: 'defaultBar',
					label: "柱状图",
				},
				{
					value: 'defaultPie',
					label: "饼图",
				},
			],
			options2: [
				{
					value: "pie",
					label: "饼图",
					children: [
						{
							value: basicPieChart,
							label: "基础饼图",
						},
						{
							value: circlePieChart,
							label: "圆环图",
						},
						{
							value: rosePieChart,
							label: "南丁格尔玫瑰图",
						},
					],
				},
				{
					value: "line",
					label: "折线图",
					children: [
						{
							value: basicLine,
							label: "基础折线图",
						},
						{
							value: stackedLineChart,
							label: "折线堆叠图",
						},
						{
							value: basicAreaChart,
							label: "基础面积图",
						},
						{
							value: stackedAreaChart,
							label: "堆叠面积图",
						},
					],
				},
				{
					value: "bar",
					label: "柱状图",
					children: [
						{
							value: basicBarChart,
							label: "基础柱状图",
						},
						{
							value: staticColumnChart,
							label: "堆叠柱状图",
						},
						{
							value: barChart,
							label: "条形图",
						},
						{
							value: staticBarChart,
							label: "堆叠条形图",
						},
					],
				},
			],
			formRules: {
				model: [
					{
						required: true,
						message: "请选择模板",
						trigger: "change",
					},
				],
				source: [
					{
						required: true,
						message: "请输入数据源地址",
						trigger: "change",
					},
				],
			},
            defaultCharts:{
                'defaultLine':defaultLine,
                'defaultBar':defaultBar,
                'defaultPie':defaultPie
            }

		};
	},
	methods: {
		async selfDesign() {
			let option = null;
			let that = this;
			let data = await that.formCode(that.code);
			let code = `(function(){
                ${data}
                return option
            })()`;

			let res = eval(code);
			this.initCharts(res);
		},
		// 预览
		btnClick() {
			this.$refs["form"].validate((valid) => {
				if (valid) {
					this.viewChart();
				} else {
					this.$message.error("请选择模板");
				}
			});
		},
		viewChart() {
			if (this.form.delivery) {
				// 自定义
				this.selfDesign();
			} else {
				// 系统默认
				this.defaultDesign();
			}
		},
		// 系统默认
		defaultDesign() {
			// 组装JSON
			let data = Object.assign({}, this.form, this.form2);
			this.formatChart(data);
		},
		initCharts(option) {
			if (this.chart) {
				this.chart.clear();
			}
			this.chart = echarts.init(document.getElementById("echart-line"));
			// 先移除事件，再添加
			this.chart.off("click");

			this.chart.on("click", (param) => {
				// eval(this.form.textarea)
				window.parent.postMessage("发送信息about");
                this.$message(`${param.value}`)
			});

			setTimeout(() => {
				try {
					option && this.chart.setOption(option, true);
				} catch (e) {
					console.log("error:" + e);
					this.chart.dispose();
				}
			}, 10);

			//随着屏幕大小调节图表
			window.addEventListener("resize", () => {
				this.chart.resize();
			});
		},
		// 代码编辑器初始化
		editorInit() {
			require("brace/ext/language_tools"); //language extension prerequsite...
			require("brace/mode/javascript"); //language
			require("brace/mode/less");
			require("brace/theme/chrome");
			require("brace/snippets/javascript"); //snippet
		},
		async formCode(code) {
			let res = await this.$axios.get(this.form.source);
			return "var dataSource =" + JSON.stringify(res.data) + ";" + code;
		},
		// 选择模板
		selectModel() {
			this.code = `option = ${JSON.stringify(this.defaultCharts[this.form.model],null,4)}`;
		},
		handleChange(value) {
			this.chartType = value[0];
		},
		// 是否自定义
		switchChange(value) {
			if (value) {
				this.formRules.model[0].required = false;
                this.selectModel()
			} else {
				this.formRules.model[0].required = true;
			}
		},
		// 组装echarts
		async formatChart(params = {}) {
			let option = params.model[1];
			option.title.text = params.title;
			option.legend.show = params.legendShow;
			option.tooltip.show = params.tooltipShow;
			let { status, data } = await this.$axios.get(params.source);
			if (status === 200) {
				switch (this.chartType) {
					case "pie":
						option.series[0].data = data;
						option.series[0].name = params.tooltipName
							? params.tooltipName
							: "";
						break;
					case "line":
					case "bar":
						data.legend && (option.legend.data = data.legend);
						data.yAxis && (option.yAxis = data.yAxis);
						Object.assign(option, {
							xAxis: data.xAxis,
							series: data.series,
						});
						break;
					default:
						break;
				}

				this.initCharts(option);
			}
		},
	},
	mounted() {},
};
</script>
<style lang="less">
.content {
	display: flex;
	.content-right,
	.content-left {
		width: 50%;
		height: 500px;
		border: 1px solid #000;
		.echart {
			height: 99%;
		}
	}
	.content-form {
		margin: 10px;
		.el-form-item {
			width: 50%;
			.el-form-item__content {
				margin-left: 120px !important;
				text-align: left;
				.el-cascader {
					width: 100%;
				}
			}
			.el-form-item__label {
				width: 120px !important;
			}
		}
	}
}
.titleForm {
	display: flex;
	flex-wrap: wrap;
	.el-form-item {
		width: 50%;
		.el-form-item__content {
			margin-left: 120px !important;
			text-align: left;
			.el-cascader {
				width: 100%;
			}
		}
		.el-form-item__label {
			width: 120px !important;
		}
	}
}
</style>
