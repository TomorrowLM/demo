import $lm from '@lm/shared/lib/src/utils';
const request = $lm.service(process.env.VUE_APP_PROXY_API as string);
export default request;
// Vue.prototype.service = service
// export { service as axios }

// const installer = {
//   vm: {},
//   install(Vue) {
//     // Vue.use(VueAxios, service)
//   }
// }
