/* eslint-disable */
import React from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import store from "@/store";
// import VConsole from 'vconsole';
import App from './app'
import './public-path';
import { AppInit } from '@lm/shared';
AppInit();

console.log('render.js', window.__POWERED_BY_QIANKUN__)
function render(props: any) {
  const { container } = props;
  ReactDom.render(<Provider store={store}>
    <App />
  </Provider>, container ? container.querySelector('#react-app') : document.querySelector('#react-app'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("react-app")
  );
}

// if (module && module.hot) {
//   // 热更新
//   module.hot.accept();
// }

// qiankun 生命周期必须导出
export const bootstrap = async () => {
  console.log('[react16] react app bootstraped');
};

export const mount = async (props: any) => {
  console.log('[react16] props from main framework', props);
  render(props);
};

export const unmount = async (props: any) => {
  const { container } = props;
  ReactDom.unmountComponentAtNode(container ? container.querySelector('#react-app') : document.querySelector('#react-app'));
};
  