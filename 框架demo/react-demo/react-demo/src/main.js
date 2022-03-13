import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import store from "@/store";
import VConsole from 'vconsole';
import { IsPC } from "@/utils";
import App from './app'
import "@/global.less";
import "antd/dist/antd.css";

// if (IsPC) {
//   const vConsole = new VConsole();
//   // 调用 console 方法输出日志
//   console.log('Hello world');
// }

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("App")
);
