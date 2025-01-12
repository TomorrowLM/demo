import Vue, { VNode } from 'vue';

import * as lodash from 'lodash';
// import * as moment from 'moment';
// Vue 模块注入, 使 TypeScript 支持 *.vue 后缀的文件
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
// declare const $lm: any;

// declare module 'sortablejs';
declare global {
  // 全局变量设置
  const $_: typeof lodash;
  const $lm: any;
  // const moment: typeof import('moment');
  const pageSize: number;
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
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    [propName: string]: any;
  }
}
