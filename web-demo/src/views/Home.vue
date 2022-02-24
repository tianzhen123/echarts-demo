<!--
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-05-22 11:07:56
-->
<template>
  <div id="blog">
    <el-input v-model="inpValue" @change="inChanage"></el-input>
    <p>result:{{moneyValue}}</p>
    <!-- <iframe src="http://localhost:8080/#/about" frameborder="0" style="width:100%;height:100%"></iframe> -->
  </div>
</template>
<script>
import {changeMoneyToChinese} from '../util/changeMoneyToChinese'
export default {
  name: "blog",
  data() {
    return {
      flag: null,
      inpValue:0,
      moneyValue:'',
    };
  },
  methods: {
    btnClick() {
      let a = {
        k: 1,
        valueOf() {
          if (this.k == 1) {
            this.k++;
            return 1;
          } else {
            this.k++;
            return 12;
          }
        },
      };
      if (a == 1 && a == 12) {
        console.log(a);
      }
    },
    inChanage(){
      this.moneyValue = changeMoneyToChinese(this.inpValue)
    }
  },
  created() {
    window.addEventListener('message',(params)=>{
      console.log(params);
    })
  },
  mounted() {
   
  },
};
</script>
<style lang="less" scoped>
#blog {
  width: 100%;
  background: #ffffff;
  height: 100%;
}
</style>
