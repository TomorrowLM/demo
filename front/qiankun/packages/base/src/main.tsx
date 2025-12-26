import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
// import reportWebVitals from "./reportWebVitals.js";
import { router } from "./router/index.js";
import { RouterProvider } from "react-router-dom";
import { registerMicroApps, start } from "qiankun";
import "./public-path";
console.log("环境变量====>>>>>", GLOBAL_INFO);
// const isDev = process.env.NODE_ENV === 'development';
// console.log(GLOBAL_INFO, 123);
// import 'antd/dist/antd.css';
// const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);
// registerMicroApps(
//   [
//     // 这里保留原有微应用注册示例，按需启用
//   ],
//   {
//     beforeLoad: (app) => {
//       console.log("before load app.name====>>>>>", app.name);
//     },
//     beforeMount: [
//       (app) => {
//         console.log("[LifeCycle] before mount %c%s", "color: green;", app.name);
//       },
//     ],
//     afterMount: [
//       (app) => {
//         console.log("[LifeCycle] after mount %c%s", "color: green;", app.name);
//       },
//     ],
//     afterUnmount: [
//       (app) => {
//         console.log(
//           "[LifeCycle] after unmount %c%s",
//           "color: green;",
//           app.name,
//         );
//       },
//     ],
//   },
// );

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
