import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./common/rem";
import animated from "animate.css"; // npm install animate.css --save安装，在引入

Vue.use(animated);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
