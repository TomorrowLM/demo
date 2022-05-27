import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import "./utils/index"
import './components'
import router from './router/index'
import store from './store'
import "./global.less"
import 'vant/lib/index.css'

//全部引用
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//size 用于改变组件的默认尺寸，zIndex 设置弹框的初始 z-index（默认值：2000）
// Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.config.productionTip = false

// 将浏览器的前进按钮禁止
// import $ from "jquery";
// $(function () {
//   if (window.history && window.history.pushState) {
//     $(window).on('popstate', function () {
//       // console.log(window.location.href)
//       if (window.location.href.indexOf(window.location.origin + "/wechatpub/surveyOne")>-1) {
//         // console.log(window.location.href,"==========================")
//         window.history.pushState('forward', null, '#');
//         window.history.forward(1);
//       }
//     });
//   }
//   // window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
//   // window.history.forward(1);
// })

new Vue({
  // 创建和挂载根实例。
  // 记得要通过 router 配置参数注入路由，从而让整个应用都有路由功能
  router: router,
  //提供了一个从根组件向所有子组件，以 store 选项的方式“注入”该 store 的机制
  store,
  render: h => h(App),
}).$mount('#app')
