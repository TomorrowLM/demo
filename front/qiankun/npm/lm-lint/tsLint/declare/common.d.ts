export { }

declare global {
  const pageSize: number;
  const window: any;
  const GLOBAL_INFO: {
    IS_PROD: boolean;
    IS_QIANKUN: boolean;
    APP_NAME: string;
    APP_VERSION: string;
    API_BASE_URL: string;
    APP_ROUTER_BASE: string; // 路由基础路径
    [key: string]: any;
  };
  interface Window {
    __POWERED_BY_QIANKUN__: any;
  }
  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = Vue;
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}