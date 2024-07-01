import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./utils/index";
import "./components";
import router from "./router/index";
import store from "./store";
import "./global.less";
import "vant/lib/index.css";
import "./public-path";
//全部引用
// import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
//size 用于改变组件的默认尺寸，zIndex 设置弹框的初始 z-index（默认值：2000）
// Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.config.productionTip = false;

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
console.log(process.env.BASE_URL,window.__POWERED_BY_QIANKUN__);
let instance = null;
function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? document.getElementById("app") : "#app");
  console.log(instance);
}
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("bootstrap");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("[vue] props from main framework", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("bootstrap unmount");
  instance.$destroy();
}
