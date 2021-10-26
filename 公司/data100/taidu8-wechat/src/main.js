import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './components'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './utils/rem'

Vue.config.productionTip = false

// 将浏览器的前进按钮禁止
import $ from "jquery";
$(function () {
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function () {
      // console.log(window.location.href)
      if (window.location.href.indexOf(window.location.origin + "/wechatpub/surveyOne")>-1) {
        // console.log(window.location.href,"==========================")
        window.history.pushState('forward', null, '#');
        window.history.forward(1);
      }
    });
  }
  // window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
  // window.history.forward(1);
})

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
