import Vue, { VNode } from 'vue';
import * as lodash from 'lodash';
import * as moment from 'moment';
// declare module 'sortablejs';

// declare global {
//   namespace JSX {
//     // tslint:disable no-empty-interface
//     interface Element extends VNode {}
//     // tslint:disable no-empty-interface
//     interface ElementClass extends Vue {}
//     interface IntrinsicElements {
//       [elem: string]: any;
//     }
//   }
// }
declare global {
  // 全局变量设置
  const $_: typeof lodash;
  const moment: typeof import('moment');
  const pageSize: number;
  interface Window {
    __POWERED_BY_QIANKUN__: any;
  }
}
// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//     [propName: string]: any;
//   }
// }
