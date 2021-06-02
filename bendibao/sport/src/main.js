import Vue from "vue";
import App from "./App.vue";

//vant
import Vant from "vant";
import { Lazyload, Icon } from "vant";
import "vant/lib/index.css";
Vue.config.productionTip = false;
Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(Icon);
//
var moment = require("moment");
moment().format();
Vue.config.productionTip = false;
//
import VueRouter from "vue-router";
Vue.use(VueRouter);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
