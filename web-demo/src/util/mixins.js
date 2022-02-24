/*
 * @Description: 聚合
 * @Author: liyb-d
 * @Date: 2020-09-29 10:31:34
 * @LastEditTime: 2020-12-02 15:41:53
 * @LastEditors: Please set LastEditors
 */
export default{
    computed: {
        gChartParent () {
            let parent = this.$parent;
            let reg = RegExp(/standard/);
            while (parent && !reg.test(parent.$attrs.code)) {
                parent = parent.$parent;
            }
            if (!parent) {
                parent = {}
                if (this.$parent.$route.name == "WidgetsView") {
                    parent["$attrs"] = {
                        code: this.componentName
                    }
                } else {
                    parent["$attrs"] = {
                        code: this.$parent.$route.name
                    }
                }
                parent["viewParam"] = {
                    ...this.$parent.$route.query
                }
            }
            return parent;
        },
    }
}