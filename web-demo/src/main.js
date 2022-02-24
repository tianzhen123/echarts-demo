/*
 * @Description: 
 * @Autor: tianzhen
 * @Date: 2021-05-22 11:07:56
 * @LastEditors: Set Name
 * @LastEditTime: 2021-08-13 15:31:59
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
