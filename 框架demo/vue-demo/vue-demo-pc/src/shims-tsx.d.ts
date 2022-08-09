import Vue, { VNode } from 'vue';
// 相关 tsx 模块注入
declare global {
  interface Window {
    BMap: any;
    BMAP_NORMAL_MAP: any;
    BMAP_HYBRID_MAP: any;
  }
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
