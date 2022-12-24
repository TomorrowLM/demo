import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/utils/index';
import '@/utils/rem';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/common.scss';
// import BaiduMap from 'vue-baidu-map';

Vue.use(ElementUI);
// Vue.use(BaiduMap, {
//   ak: 'RALHVFnPxQdDB42THG2M3cUDzwSf1zV9',
// });
Vue.use(Antd);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
