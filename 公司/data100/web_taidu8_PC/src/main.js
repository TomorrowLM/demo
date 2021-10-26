// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "./styles/public.css"//公共样式
import "babel-polyfill";

Vue.config.productionTip = false

//全局组件
import Header from "./components/common/Header";
import Loading from "./components/common/Loading";
import Empty from "./components/common/Empty";
Vue.component("com-header", Header)
Vue.component("loading", Loading)
Vue.component("empty", Empty)

//全局过滤器
Vue.filter('formatPhone', phone => {//隐藏手机号中间四位
  if(phone){
    phone += '';
    return phone.replace(/(\d{3})\d*(\d{4})/g, '$1****$2')
  }else{
    return ""
  }
  
})

//服务
import "./services/loading/index"
import "./services/load/index"
import "./services/wxLogin.js"


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
