"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const index_vue_1 = __importDefault(require("./index.vue"));
const messageSdk = {
    install: function (Vue) {
        const VueComponent = Vue.extend(index_vue_1.default); //创建Vue构造器
        const vm = new VueComponent().$mount(); //创建实例，但不挂载
        let defaultOptions = {
            yesBtnText: '确定',
            noBtnText: '取消'
        };
        const confirm = function (options) {
            Object.assign(vm, defaultOptions, options);
            console.log(vm);
            document.body.appendChild(vm.$el); //挂载到document.body
            // init = true;
            return vm.confirm();
        };
        Vue.prototype.$messageSdk = confirm;
    },
};
exports.default = messageSdk;
// const VueComponent = Vue.extend(message);
// const vm = new VueComponent().$mount();
// let init = false;
// const confirm = function (options) {
//   Object.assign(vm, defaultOptions, options, {
//     type: 'confirm'
//   });
//   if (!init) {
//     document.body.appendChild(vm.$el);
//     init = true;
//   }
//   return vm.confirm();
// };
// export default confirm;
