import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./router/index.js";
import { RouterProvider } from "react-router-dom";
import { registerMicroApps, start } from "qiankun";
import { AppInit } from '@lm/shared';
import "./assets/styles/index.css";
AppInit()
// import reportWebVitals from "./reportWebVitals.js";
const isDev = !GLOBAL_INFO.IS_PROD;
// import 'antd/dist/antd.css';
// const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);
registerMicroApps(
  [
    {
      name: "vue2-mobile",
      entry: isDev ? "//localhost:8001" : '/qiankun/child/vue2-mobile/',//配置微应用访问入口,注意微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误
      container: "#vue2-mobile",
      activeRule: "/qiankun/vue2-mobile",
      // activeRule: getActiveRule('#/vue2-mobile'),
    },
    {
      name: "vue2-pc",
      entry: isDev ? "//localhost:8002" : '/qiankun/child/vue2-pc/',//配置微应用访问入口,注意微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误
      container: "#vue2-pc",
      activeRule: "/qiankun/vue2-pc",
      // loader: (loading) => setLoading(loading)
    },
    // {
    //   name: "vue3",
    //   entry: isDev ? "//localhost:8003" : '/qiankun/child/vue3',//配置微应用访问入口,注意微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误
    //   container: "#vue3-container", // 微应用的容器节点的选择器
    //   activeRule: "/qiankun/vue3",// 微应用的激活规则
    //   activeWhen: location => location.pathname.startsWith('/qiankun/vue3'),
    //   publicLibraryProviders: ['vue', 'element-plus'], // 共享库列表
    //   props: {
    //     appCommuicate: { mes: '我是主应用传递的值' }
    //   }
    //   // loader: (loading) => setLoading(loading)
    // },
    // {
    //   name: "react",
    //   entry: isDev ? "//localhost:8004" : '/qiankun/child/react',//配置微应用访问入口,注意微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误
    //   container: "#react-container", // 微应用的容器节点的选择器
    //   activeRule: "/qiankun/react",// 微应用的激活规则
    //   // activeWhen: location => location.pathname.startsWith('/qiankun/react'),
    // },
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

setTimeout(() => {
  start();
}, 100);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// reportWebVitals();
