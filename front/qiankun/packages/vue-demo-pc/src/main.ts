import Vue from 'vue';
const App = resolved => require(['./App.vue'], resolved)
// import App from './App.vue';
import router from './router';
import store from './store';
import '@/utils/index';
import '@/utils/rem';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import '@/styles/common.scss';
import './public-path';
import { themeSetup } from './loadTheme';
// import BaiduMap from 'vue-baidu-map';

// require('@/styles/themes/light.scss'); //引入
// import './styles/themes/light.scss';
// themeSetup('theme_0')
Vue.use(ElementUI);
// Vue.use(BaiduMap, {
//   ak: 'RALHVFnPxQdDB42THG2M3cUDzwSf1zV9',
// });
Vue.use(Antd);

Vue.config.productionTip = false;
// new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).$mount('#app');

let instance: any = null;
function render(props: any = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#vue2-pc') : '#vue2-pc');
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
  console.log('bootstrap');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  console.log('[vue] props from main framework', props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log('bootstrap unmount');
  instance.$destroy();
}
