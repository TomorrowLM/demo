import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import "./utils/index"
import router from './router/index'
import "./global.less"
//全部引用
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  // 创建和挂载根实例。
  // 记得要通过 router 配置参数注入路由，
  // 从而让整个应用都有路由功能
  router: router,
}).$mount('#app')
