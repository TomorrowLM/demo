import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
// import './samples/node-api'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/style/index.scss";

export const app = createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
