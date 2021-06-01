import Vue from "vue";
import App from "./App.vue";
import vant from "vant";

Vue.config.productionTip = false;

Vue.use(vant);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
