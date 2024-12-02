import Vue from 'vue'
//全部引用
import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
//size 用于改变组件的默认尺寸，zIndex 设置弹框的初始 z-index（默认值：2000）
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.config.productionTip = false;