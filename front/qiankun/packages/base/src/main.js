import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
// import reportWebVitals from "./reportWebVitals.js";
import { router } from "./router/index.js";
import { RouterProvider } from "react-router-dom";
import { registerMicroApps, start } from "qiankun";
const isDev = process.env.NODE_ENV === 'development';
// console.log(process.env.NODE_ENV, API,);
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);
registerMicroApps(
  [
    // {
    //   name: "vue2-mobile",
    //   entry: isDev ? "//localhost:8001" : '/qiankun/child/vue2-mobile/',//配置微应用访问入口,注意微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误
    //   container: "#vue2-mobile",
    //   activeRule: "/qiankun/vue2-mobile",
    //   // activeRule: getActiveRule('#/vue2-mobile'),
    // },
    {
      name: "vue2-pc",
      entry: isDev ? "//localhost:8002" : '/qiankun/child/vue2-pc/',//配置微应用访问入口,注意微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误
      container: "#vue2-pc",
      activeRule: "/qiankun/vue2-pc",
      // loader: (loading) => setLoading(loading)
    },
    {
      name: "vue3",
      entry: isDev ? "//localhost:8003" : '/qiankun/child/vue3',//配置微应用访问入口,注意微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误
      container: "#vue3-container", // 微应用的容器节点的选择器
      activeRule: "/qiankun/vue3",// 微应用的激活规则
      activeWhen: location => location.pathname.startsWith('/qiankun/vue3'),
      // loader: (loading) => setLoading(loading)
    },
  ],
  {
    beforeLoad: (app) => {
      console.log("before load app.name====>>>>>", app.name);
    },
    beforeMount: [
      (app) => {
        console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
      },
    ],
    afterMount: [
      (app) => {
        console.log("[LifeCycle] after mount %c%s", "color: green;", app.name);
      },
    ],
    afterUnmount: [
      (app) => {
        console.log(
          "[LifeCycle] after unmount %c%s",
          "color: green;",
          app.name
        );
      },
    ],
  }
);
//当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，
//所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。
setTimeout(() => {
  start();
}, 100)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
    </RouterProvider>
  </React.StrictMode>
);

// reportWebVitals();
