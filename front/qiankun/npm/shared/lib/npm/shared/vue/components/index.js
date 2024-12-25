"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 全局组件自动注册
 */
const vue_1 = __importDefault(require("vue"));
// 自动加载 global 目录下的 .js 结尾的文件
const componentsContext = require.context('./', true, /\.js$/);
componentsContext.keys().forEach(component => {
    // const componentConfig = componentsContext(component)
    // /**
    // * 兼容 import export 和 require module.export 两种规范
    // */
    // const ctrl = componentConfig.default || componentConfig
    // Vue.component(ctrl.name, ctrl)
});
