/**
 * 注册全局组件
 */
import CustomForm from "./CustomForm/index.vue";


export default (app: any) => {
  app.component("CustomForm", CustomForm);
};
