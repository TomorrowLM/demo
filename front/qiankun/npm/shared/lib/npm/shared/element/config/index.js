"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
//全部引用
const element_ui_1 = __importDefault(require("element-ui"));
require("element-ui/lib/theme-chalk/index.css");
//size 用于改变组件的默认尺寸，zIndex 设置弹框的初始 z-index（默认值：2000）
vue_1.default.use(element_ui_1.default, { size: 'small', zIndex: 3000 });
vue_1.default.config.productionTip = false;
