<!--
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-07-22 16:17:39
 * @LastEditors: Set Name
 * @LastEditTime: 2021-07-22 16:41:25
-->
<template>
    <div v-clickoutside="handleClose" class="selectInput">
        <div class="input-box">
            <Input :placeholder="placeholder" v-model="inputValue" @input.native="handleInput" type="text" />
        </div>
        <div v-show="dropdownShow" class="input-dropdown">
            <div class="dropdown-title">
                {{ dropdownTitle }}
            </div>
            <div class="dropdown-content">
                <ul class="content-list">
                    <li v-for="(item, index) in searchDataList" :key="index" @click="handleChoose(item.name)" class="list-item">
                        <span class="item-avatar">{{ item.avatar }}</span>
                        <span class="item-name">{{ item.name }}</span>
                    </li>
                </ul>
                <div v-show="dropdownMsgShow" class="content-msg">
                    {{ dropdownMsg }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 引入函数防抖
// import { debounce } from "@/plugins/util/debounce";

export default {
    name: 'selectInput',
    directives: {
        // 自定义指令用于处理点击组件区域之外的click事件
        clickoutside: {
            bind(el, binding) {
                function documentHandler(e) {
                    if (el.contains(e.target)) {
                        return false;
                    }
                    if (binding.expression) {
                        binding.value(e);
                    }
                }
                el.__vueClickOutSize__ = documentHandler;

                document.addEventListener("click", documentHandler);
            },
            unbind(el) {
                document.removeEventListener("click", el.__vueClickOutSize__);
                delete el.__vueClickOutSize__;
            },
        },
    },
    props: {
        // 父组件传递的输入框初始值
        value: {
            type: String,
            default: ''
        },
        // 下拉列表的标题
        dropdownTitle: {
            type: String,
            default: '您可能要找'
        },
        // 下拉列表搜索数据为空时的提示
        dropdownMsg: {
            type: String,
            default: '数据为空！'
        },
        // 下拉列表的初始数组
        dropdownList: {
            type: Array,
            default: () => []
        },
        // 输入框的提示
        placeholder: {
            type: String,
            default: '请输入名字'
        },
    },
    data() {
        return {
            //  控制下拉列表显示
            dropdownShow: false,
            //  控制下拉列表数据为空提示显示
            dropdownMsgShow: false,
            //  输入框值
            inputValue: '',
            //  搜索后的下拉列表，用于渲染下拉
            searchDataList: []
        }
    },
    methods: {
        // 下拉列表隐藏处理函数
        handleClose() {
            let _this = this;
            if (_this.dropdownShow) {
                if (_this.searchDataList.length === 1) {
                    _this.inputValue = _this.searchDataList[0].name;
                } else {
                    _this.inputValue = '';
                }
            }
            _this.dropdownShow = false;
        },
        // 输入框输入处理函数
        handleInput () {
            debugger
            let _this = this;
            _this.searchDataList = [];
            if (_this.inputValue === '') {
                _this.dropdownShow = false;
            } else {
                _this.dropdownList.map(v => {
                    if (v.name.indexOf(_this.inputValue) >= 0) {
                        _this.searchDataList.push(v);
                    }
                });
                _this.searchDataList.length > 0 ? _this.dropdownMsgShow = false : _this.dropdownMsgShow = true;
                _this.dropdownShow = true;
            }
        },
        // 下拉选择处理函数
        handleChoose(val) {
            let _this = this;
            _this.inputValue = val; 
            _this.dropdownShow = false;
        }
    },
    created() {

    },
    mounted() {

    }
}
</script>

<style lang="less" scoped>
.selectInput {
    position: relative;
    .input-dropdown {
        min-width: 200px;
        position: absolute;
        top: 35px;
        left: 0;
        border: 1px solid #cfcfcf;
        border-radius: 5px;
        .dropdown-title {
            padding: 5px 10px;
            color: #e1e1e1;
            background-color: #f8f8f8;
        }
        .dropdown-content {
            .content-list {
                margin: 0;
                padding: 0;
                .list-item {
                    margin: 0;
                    padding: 5px 10px ;
                    list-style: none;
                    &:hover {
                        cursor: pointer;
                        background-color: #f7f5f5;
                    }
                    .item-avatar {
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        color: #ffffff;
                        background-color: #b6c4de;
                        border-radius: 50%;
                        text-align: center;
                        margin-right: 10px;
                    }
                    .item-name {
                        display: inline-block;
                        color: #666666;
                    }
                }
            }
            .content-msg {
                padding: 10px;
                color: #cccccc;
            }
        }
    }
}
</style>