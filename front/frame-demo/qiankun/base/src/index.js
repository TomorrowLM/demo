import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { router } from "./router/index.js";
import { RouterProvider } from "react-router-dom";
import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "Web1", // app name registered
    entry: "//localhost:8088",
    container: "#web1",
    activeRule: "/Web1",
  },
]);
//当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，
//所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。
start();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

reportWebVitals();
