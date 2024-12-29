import $lm from '@lm/shared';
import { Message } from 'element-ui';

console.log($lm.service, 222);
const baseURL = process.env.VUE_APP_BASE_URL;
console.log(baseURL, 111);

const requestInstance = $lm.service(baseURL);

export default requestInstance;

// Vue.prototype.service = service
// export { service as axios }

// const installer = {
//   vm: {},
//   install(Vue) {
//     // Vue.use(VueAxios, service)
//   }
// }
