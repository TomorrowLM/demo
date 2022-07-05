import Vue, { VNode } from 'vue'
// 相关 tsx 模块注入
declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
