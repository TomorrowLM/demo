// Vue 模块注入, 使 TypeScript 支持 *.vue 后缀的文件
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
