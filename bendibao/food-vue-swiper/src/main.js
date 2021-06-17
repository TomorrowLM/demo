import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router/index";
import animated from "animate.css";
import { Toast } from "vant";
import "vant/lib/index.css";
Vue.use(Toast);
import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import "swiper/swiper.min.css";
import { List } from "vant";

Vue.use(List);
Vue.use(MuseUI);
Vue.use(animated);
Vue.config.productionTip = false;

Vue.use(VueRouter);
new Vue({
  router: router,
  render: (h) => h(App),
}).$mount("#app");
