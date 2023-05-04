import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
// import './samples/node-api'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/style/index.scss";
import "./uilt/ipcMain.js";
import store from "./store";

export const app = createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(store)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
